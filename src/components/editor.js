import fs from 'fs'

import React, {Component} from 'react'
import {render} from 'react-dom'
import {EditorState, CompositeDecorator, convertToRaw, convertFromRaw,
        getDefaultKeyBinding, KeyBindingUtil, RichUtils, Modifier} from 'draft-js'
const {hasCommandModifier, isOptionKeyCommand} = KeyBindingUtil;

import {convertToHTML} from 'draft-convert'

import {keyMap} from './plugins/utils/keys'

import Editor from 'draft-js-plugins-editor'
import {connect} from 'react-redux'

import debounce from 'lodash/debounce';

import {updateFileContent, updateFileTitle, newFile, newFolder, selectFile, selectFolder,
        showSearch, showSidebar} from '../model/actions'

import {saveOnFile} from '../model/helpers'

// PLUGINS
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import createAutoListPlugin from 'draft-js-autolist-plugin'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import createLinePlugin from './plugins/linePlugin'

import createBlockBreakoutPlugin from './plugins/my_breakout'


const toolbarPlugin = createSideToolbarPlugin();
const blockBreakoutPlugin = createBlockBreakoutPlugin()
const linePlugin = createLinePlugin()
const imagePlugin = createImagePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const autoListPlugin = createAutoListPlugin()
const mathjaxPlugin = createMathjaxPlugin({})

// c'è un qualche problema con l'ordine di caricamento...oppure un plugin rompe gli altri
// se c'è math autolist non va (se invece autolist è prima sembra andare)
const plugins = [] //, autoListPlugin. mathjaxPlugin, linePlugin, blockBreakoutPlugin]

import {link, linkStrategy} from './editor_link'

// import {getById} from '../model/helpers'

const {dialog} = require('electron').remote





class MyEditor extends Component {

    constructor(props) {
        super(props)
        this.props = props

        this.compositeDecorator = new CompositeDecorator([
            {
                strategy: linkStrategy,
                component: link,
            }
        ]);

        try {
            const content = props.data.get(props.selectedFile).content
            this.state = {
                editorState: EditorState.createWithContent(content, this.compositeDecorator)
            }
        }
        catch(err) {
            this.state = {
                editorState: EditorState.createEmpty(this.compositeDecorator)
            }
        }

        finally {
            setTimeout(() => this.focus(), 10)
        }
    }


    loadFile(selectedFile, selectedFolder, data) {
        // metto qua la logica che stava dentro componentWillReceiveProps
        // prova a caricare il file ID, se non riesce crea un file vuoto
        console.log('loading: ', selectedFile)
        if (selectedFile != '0') {
            try {
                const content = data.get(selectedFile).content
                this.setState({
                    editorState: EditorState.createWithContent(content, this.compositeDecorator)
                })
            }
            catch(err) {
                console.log(err)
                this.setState({
                    editorState: EditorState.createEmpty(this.compositeDecorator)
                })
            }

            finally {
                setTimeout(() => this.focus(), 10)
            }
        }
    }


    componentWillReceiveProps({selectedFile, selectedFolder, data, _selectFile}) {
        if (selectedFile != this.props.selectedFile){
            this.loadFile(selectedFile, selectedFolder, data)
        }
    }


    onChange = (editorState) => {
        if (this.props.selectedFile != '0') {
            const data = editorState.getCurrentContent()
            this.saveFile(data)
        }
        this.setState({editorState})
    }


    focus = () => this.refs.editor.focus()


    focusTitle = () => this.refs.title.focus()

    // la funzione viene richiamata solo se non era stata chiamata nel secondo precedente
    saveFile = debounce((data) => this.props.updateFile(this.props.selectedFile, data), 1000)


    exportFile = () => {
        const html = convertToHTML(this.state.editorState.getCurrentContent())
        const title = this.props.data.get(this.props.selectedFile).name
        dialog.showSaveDialog(
            {defaultPath: title},
            (fileName) => fs.writeFile(fileName + ".html", html, () => console.log('exported'))
        )
    }


    _updateTitle = (event) => {
        const title = event.target.value != ''? event.target.value : 'Untitled'
        this.props.updateTitle(this.props.selectedFile, title)
    }


    keyBindingFn = (e) => {
        if (keyMap(e) == 'H' && hasCommandModifier(e)) {
            return 'header'
        }

        if (keyMap(e) == 'W' && hasCommandModifier(e)) {
            return 'save-file'
        }

        if (keyMap(e) == 'N' && isOptionKeyCommand(e)) {
            return 'new-folder'
        }
        // commentando il return non sovrascrive la key definita nei plugin...
        // penso che anche nei plugin si debba fare la stessa cosa e mettere il return default
        // solo nell'ultimo caricato
        // return getDefaultKeyBinding(e)
    }


    handleKeyCommand = (command) => {

        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
                this.onChange(newState);
                return 'handled';
        }

        if (command == 'header') {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'))
            return 'handled'
        }

        // if (command == 'load-file'){
        //     this.loadFile('./data/asd.json')
        //     return 'handled'
        // }

        if (command == 'save-file'){
            this.saveFile()
        }

        // if (command == 'new-file'){
        //     let path
        //     if (this.props.selectedFolder == 'root') {
        //         path = ['root']
        //     }
        //     else {
        //         path = this.props.data.get(this.props.selectedFolder).path
        //     }
        //     console.log('selected Folder', this.props.selectedFolder)
        //     const action = this.props._newFile(path)
        //
        //     this.props._selectFile(action.id)
        //     this.refs.title.focus()
        //     setTimeout(() => this.refs.title.select(), 100)
        // }

        if (command == 'new-folder'){
            let path
            if (this.props.selectedFolder == 'root') {
                path = ['root']
            }
            else {
                path = this.props.data.get(this.props.selectedFolder).path
            }
            const action = this.props._newFolder(path)
            this.props._selectFolder(action.id)

            this.props._selectFile('0')
            // this.refs.title.focus()
            // setTimeout(() => this.refs.title.select(), 100)
        }
    }

    onTab = (e) => {
        // aggiungere controlli su tipo di block e sullo shift premuto...DONE
        e.preventDefault()
        let currentState = this.state.editorState
        const blockType = RichUtils.getCurrentBlockType(currentState)

        if (blockType == 'unstyled') {
            let newContentState = Modifier.replaceText(
                currentState.getCurrentContent(),
                currentState.getSelection(),
                '\t'
            )
            this.setState({
                editorState: EditorState.push(currentState, newContentState, 'insert-characters')
            })
        }
        else {
            let newContentState = RichUtils.onTab(e, currentState, 5)
            this.onChange(newContentState)
        }
    }

    render() {

        // const title = getById(this.props.data, this.props.selectedFile).model.name
        const title = this.props.data.get(this.props.selectedFile)?
            this.props.data.get(this.props.selectedFile).name : 'Untitled'

        if (this.props.selectedFile != '0') {
            return (
                <div className='editorRoot'>
                    <input className='editorTitle'
                           value={title}
                           ref='title'
                           onChange={(event) => this._updateTitle(event) }
                           />
                    <div className='content' onClick={() => this.refs.editor.focus()}>
                        <Editor editorState = {this.state.editorState}
                            onChange = {this.onChange}
                            plugins = {plugins}
                            onTab = {this.onTab}
                            handleKeyCommand = {this.handleKeyCommand}
                            keyBindingFn={this.keyBindingFn}
                            ref='editor'
                        />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='editorRoot empty'>
                    <span className='creaFile'>{"crea un file"}</span>
                </div>
            )
        }
    }
}

// --------------- REDUX -----------------

const mapStateToProps = ({selectedFile, selectedFolder, data}) => {
    return {selectedFile, selectedFolder, data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFile: (id, content) => dispatch(updateFileContent(id, content)),
        updateTitle: (id, title) => dispatch(updateFileTitle(id, title)),
        _newFile: (path) => dispatch(newFile('Untitled', path)),
        _newFolder: (path) => dispatch(newFolder('new folder', path)),
        _selectFile: (id) => dispatch(selectFile(id)),
        _selectFolder: (id) => dispatch(selectFolder(id)),
        _showSearch: () => dispatch(showSearch(true)),
        _showSidebar: (bool) => dispatch(showSidebar(bool))
     }
}

MyEditor = connect(mapStateToProps, mapDispatchToProps)(MyEditor)
export default MyEditor

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

import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

import {updateFileContent, updateFileTitle, newFile, newFolder, selectFile, selectFolder,
        showSearch, showSidebar} from '../model/actions'

import {saveOnFile} from '../model/helpers'

// PLUGINS
import createMathjaxPlugin from './plugins/draft-js-mathjax-plugin'

import createEmojiPlugin from 'draft-js-emoji-plugin'

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

const emojiPlugin = createEmojiPlugin()
const {EmojiSuggestions} = emojiPlugin

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

        this.state = this.loadFile(props.selectedFile, props.selectedFolder, props.data)
    }


    getFirstRow = (editorState) => {
        const firstRow = editorState.getCurrentContent().getFirstBlock().getText()
        if (firstRow.length > 20) {
            return firstRow.slice(0, 20) + '...'
        }
        else {
            return firstRow
        }
    }


    blockStyleFn = (contentBlock) => {
        if (this.state.editorState.getCurrentContent().getFirstBlock().getKey() == contentBlock.getKey()){
            return 'title-header'
        }

    }


    updateTitle = (editorState) => {
        const firstRow = this.getFirstRow(editorState)
        return firstRow != ''? firstRow : 'Untitled'
    }


    loadFile(selectedFile, selectedFolder, data) {
        // metto qua la logica che stava dentro componentWillReceiveProps
        // prova a caricare il file ID, se non riesce crea un file vuoto
        try {
            const content = data.get(selectedFile).content
            return {editorState: EditorState.createWithContent(content, this.compositeDecorator)}
        }
        catch(err) {
            return {editorState: EditorState.createEmpty(this.compositeDecorator)}
        }

        finally {
            setTimeout(() => this.focus(), 10)
        }

        this.saveFile.flush()
    }


    componentWillReceiveProps({selectedFile, selectedFolder, data, _selectFile}) {
        if (selectedFile != this.props.selectedFile && selectedFile != '0'){
            this.setState(this.loadFile(selectedFile, selectedFolder, data))
        }
    }


    onChange = (editorState) => {
        if (this.props.selectedFile != '0') {
            this.saveFile(editorState)
        }
        this.setState({editorState})
        // const selectionState = editorState.getSelection()
        // const contentState = editorState.getCurrentContent()
        // const currentBlockKey = selectionState.getStartKey()
        // if (currentBlockKey == editorState.getCurrentContent().getFirstBlock().getKey()) {
        // this.props.updateTitle(this.props.selectedFile, this.updateTitle(editorState))
        // }
    }


    focus = () => this.refs.editor.focus()


    focusTitle = () => this.refs.title.focus()


    // la funzione viene richiamata solo se non era stata chiamata nel secondo precedente
    // il debounce da problemi, se edito velocemente e poi cambio file / chiudo
    // devo fare in modo che al cambio file venga chiamata obbligatoriamente

    saveFile = debounce((editorState) => {
        const data = editorState.getCurrentContent()
        this.props.updateFile(this.props.selectedFile, data)
        this.props.updateTitle(this.props.selectedFile, this.updateTitle(editorState))
    }, 100)


    exportFile = () => {
        const html = convertToHTML(this.state.editorState.getCurrentContent())
        const title = this.props.data.get(this.props.selectedFile).name
        dialog.showSaveDialog(
            {defaultPath: title},
            (fileName) => fs.writeFile(fileName + ".html", html, () => console.log('exported'))
        )
    }


    // _updateTitle = (event) => {
    //     const title = event.target.value != ''? event.target.value : 'Untitled'
    //     this.props.updateTitle(this.props.selectedFile, title)
    // }


    keyBindingFn = (e) => {
        // spostare in un generico "format" plugin (insieme anche ad handleKeyCommand)
        if (keyMap(e) == 'H' && hasCommandModifier(e)) {
            return 'header'
        }

        // spostare nell'app?
        if (keyMap(e) == 'W' && hasCommandModifier(e)) {
            return 'save-file'
        }

        // spostare nell'app?
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
            console.log('asdasd')
            let path
            if (this.props.selectedFolder == 'root') {
                path = ['root']
            }
            else {
                path = this.props.data.get(this.props.selectedFolder).path
            }
            console.log('p', path)
            const action = this.props._newFolder(path)
            this.props._selectFolder(action.id)

            this.props._selectFile('0')
            // this.refs.title.focus()
            // setTimeout(() => this.refs.title.select(), 100)
        }
    }


    onTab = (e) => {
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

        // vecchio titolo

        // <input className='editorTitle'
        //        value={title}
        //        ref='title'
        //
        //        />

        const {data, selectedFile} = this.props
        const title = data.get(selectedFile)? data.get(selectedFile).name : 'Untitled'

        if (selectedFile != '0') {
            return (
                <div className='editorRoot'>
                    <div className='content' onClick={() => this.refs.editor.focus()}>
                        <Editor editorState = {this.state.editorState}
                            onChange = {this.onChange}
                            plugins = {plugins}
                            onTab = {this.onTab}
                            ref='editor'
                            keyBindingFn = {this.keyBindingFn}
                            handleKeyCommand = {this.handleKeyCommand}
                            blockStyleFn = {this.blockStyleFn}
                        />
                        <EmojiSuggestions />
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

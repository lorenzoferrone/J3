import fs from 'fs'

import React, {Component} from 'react'
import {render} from 'react-dom'
import {EditorState, CompositeDecorator, convertToRaw, convertFromRaw,
        getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'
const {hasCommandModifier, isOptionKeyCommand} = KeyBindingUtil;

import {keyMap} from './plugins/utils/keys'

import Editor from 'draft-js-plugins-editor'
import {connect} from 'react-redux'

import {updateFileContent, updateFileTitle, newFile, newFolder, selectFile,
        showSearch, showSidebar, saveOnFile} from '../model/reducers'

// PLUGINS
import createMathjaxPlugin from 'draft-js-mathjax-plugin'
import createAutoListPlugin from 'draft-js-autolist-plugin'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import createLinePlugin from './plugins/linePlugin'

const toolbarPlugin = createSideToolbarPlugin();

const linePlugin = createLinePlugin()
const imagePlugin = createImagePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const autoListPlugin = createAutoListPlugin()
const mathjaxPlugin = createMathjaxPlugin({})

const plugins = [autoListPlugin, linePlugin, inlineToolbarPlugin]

import {link, linkStrategy} from './editor_link'

import {getById} from '../model/helpers'



class MyEditor extends Component {

    constructor(props) {
        super(props)
        store.subscribe(() => saveOnFile(store.getState().data))
        // store.subscribe(() => {
        //     console
        // })
        this.props = props

        this.compositeDecorator = new CompositeDecorator([
            {
                strategy: linkStrategy,
                component: link,
            }
        ]);

        this.state = {
            editorState: EditorState.createEmpty(this.compositeDecorator)
        }
    }

    componentWillReceiveProps({selectedFile, data}) {
        console.log('props', data)


        if (selectedFile != this.props.selectedFile){

            console.log('loading: ', selectedFile)
            try {
                const content = convertFromRaw(data.get(selectedFile).content)
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

    onChange = (editorState) => {
        this.setState({editorState})
        if (this.props.selectedFile != 0) {
            this.saveFile()
        }
    }

    focus = () => {
        this.refs.editor.focus()
    }

    saveFile = () => {
        const data = convertToRaw(this.state.editorState.getCurrentContent())
        this.props.updateFile(this.props.selectedFile, data)
    }

    _updateTitle = (event) => {
        const title = event.target.value
        this.props.updateTitle(this.props.selectedFile, title)
    }

    keyBindingFn = (e) => {
        if (keyMap(e) == 'F' && hasCommandModifier(e)) {
            return 'show-search'
        }

        if (keyMap(e) == 'BACK_SLASH' && hasCommandModifier(e)) {
            return 'toggle-sidebar'
        }

        if (keyMap(e) == 'W' && hasCommandModifier(e)) {
            return 'save-file'
        }

        if (keyMap(e) == 'N' && hasCommandModifier(e)) {
            return 'new-file'
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
        if (command == 'load-file'){
            this.loadFile('./data/asd.json')
            return 'handled'
        }

        if (command == 'save-file'){
            this.saveFile()
        }

        if (command == 'new-file'){
            let path
            if (this.props.selectedFolder == 'root') {
                path = 'root'
            }
            else {
                path = this.props.data.get(this.props.selectedFolder).path
            }
            console.log('selected Folder', this.props.selectedFolder)
            console.log('path', path, 'post')
            const action = this.props._newFile(path)

            this.props._selectFile(action.id)
            this.refs.title.focus()
            setTimeout(() => this.refs.title.select(), 100)
        }

        if (command == 'new-folder'){
            const action = this.props._newFolder()
            this.props._selectFile(action.id)
            // this.refs.title.focus()
            // setTimeout(() => this.refs.title.select(), 100)
        }

        if (command == 'show-search'){
            this.props._showSearch()
        }

        if (command == 'toggle-sidebar'){
            console.log('toggling')
            const visible = store.getState().sidebarState
            this.props._showSidebar(!visible)
        }
    }

    render() {
        console.log(this.props.selectedFile)

        const title = getById(this.props.data, this.props.selectedFile).model.name
        console.log(this.props.data)

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
                    handleKeyCommand = {this.handleKeyCommand}
                    keyBindingFn={this.keyBindingFn}
                    ref='editor'
                />
                <InlineToolbar />
        </div>
            </div>
        )
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
        _newFolder: () => dispatch(newFolder()),
        _selectFile: (id) => dispatch(selectFile(id)),
        _showSearch: () => dispatch(showSearch(true)),
        _showSidebar: (bool) => dispatch(showSidebar(bool))
     }
}

MyEditor = connect(mapStateToProps, mapDispatchToProps)(MyEditor)
export default MyEditor

import React, {Component} from 'react'
import {render} from 'react-dom'

import {Provider, connect} from 'react-redux'
import {createStore} from 'redux'
import {appStore} from './dist/model/reducers'

let store = createStore(appStore)

import MyEditor from './dist/components/editor'
import Sidebar from './dist/components/sidebarFolder'
import SidebarFile from './dist/components/sidebarFile'
import Spotlight from './dist/components/spotlight'

import {saveOnFile} from './dist/model/helpers'

const {remote} = require('electron')
const {Menu, MenuItem} = remote


import {showSidebar, showSearch, newFile, selectFile} from './dist/model/actions'

Mousetrap = require('Mousetrap')
require('mousetrap-global-bind')



class App extends Component {

    constructor(props) {
        super(props)
        this.props = props

        remote.getCurrentWindow().once('close', () => saveOnFile(store.getState()))
        // magari ci aggiungo anche un save periodico ogni 5 secondi??


        // shortcut binding
        Mousetrap.bindGlobal(
            'command+\\',
            () => this.props._showSidebar(!store.getState().sidebarState))

        Mousetrap.bindGlobal(
            'command+f',
            () => this.props._showSearch()
        )

        Mousetrap.bindGlobal(
            'command+n',
            () => {
                let path
                if (this.props.selectedFolder == 'root') {
                    path = ['root']
                }
                else {
                    path = this.props.data.get(this.props.selectedFolder).path
                }
                const action = this.props._newFile(path)

                this.props._selectFile(action.id)
                this.refs.editorRoot.focusTitle()
                // setTimeout(() => this.refs.editortitle.select(), 100)
            }
        )
    }

    render() {
        return (
            <div className="window">
                <div className="window-content">
                    <div className="pane-group">
                        <Sidebar />
                        <SidebarFile />
                        <div id='editorRoot' className="pane">
                            <MyEditor ref='editorRoot'/>
                        </div>
                    </div>
                    <Spotlight />
                </div>
            </div>
        )
    }
}



// -----------
const mapStateToProps = ({selectedFolder, data}) => {
    return {
        selectedFolder,
        data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _showSidebar: (bool) => dispatch(showSidebar(bool)),
        _showSearch: () => dispatch(showSearch(true)),
        _newFile: (path) => dispatch(newFile('Untitled', path)),
        _selectFile: (id) => dispatch(selectFile(id)),
    }
}

App = connect(mapStateToProps, mapDispatchToProps)(App)


render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

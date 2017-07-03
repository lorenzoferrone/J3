import React, {Component} from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-redux'
import {createStore} from 'redux'
import {appStore} from './dist/model/reducers'

let store = createStore(appStore)

import MyEditor from './dist/components/editor'
import Sidebar from './dist/components/sidebar3'
import SidebarFile from './dist/components/sidebarFile'
import Spotlight from './dist/components/spotlight'


class App extends Component {
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



render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

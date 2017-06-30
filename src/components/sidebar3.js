import React, {Component} from 'react'
import {render} from 'react-dom'
import {connect} from 'react-redux'

import {OrderedMap, fromJS} from 'immutable'

import {selectFile, selectFolder, selectNode, deleteFile} from '../model/reducers'

import fs from 'fs'
import dirTree from 'directory-tree'





const nodeComponent = (node, onNodeClick, selectedFolderId) => {
    const active = node.model.id == selectedFolderId ? 'activeFolder' : ''
    const isFolder = node.hasChildren() ? 'folder' : ''
    const className = `list-group-item ${isFolder} ${active}`

    const deleteNode = (e) => {
        _deleteFile(node)
        e.stopPropagation()
    }

    // non va bene perché così quando selezione una cartella si seleziona tutto il blocco
    // ...
    let subComponent = null
    if (node.hasChildren()) {
        subComponent =
            <ul>
                {node.children
                    .map(child => nodeComponent(child, onNodeClick, selectedFolderId))
                }
            </ul>
    }


    return (
        <li className= {className} >
            <div className='element' onClick={(e) => {onNodeClick(node.model.id); e.stopPropagation()}}>
                <span>
                    {node.model.name}
                </span>
                {subComponent}
            </div>
        </li>
    )
}



const sidebar = ({nodes, visible, onNodeClick, selectedFolderId}) => {
    const list = nodes.children.map(node => nodeComponent(node, onNodeClick, selectedFolderId))
    const hidden = visible? '': ' hidden'

    return (
        <div className={`sidebarRoot pane-sm sidebar ${hidden}`}>
            <ul className='list-group'>
                {list}
            </ul>
        </div>
    )
}

//

const mapStateToProps = ({selectedFolder, data, sidebarState}) => {
    return ({
        nodes: data,
        selectedFolderId: selectedFolder,
        visible: sidebarState
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNodeClick: (id) => dispatch(selectFolder(id)),
        _deleteFile: (id) => dispatch(deleteFile(id))
    }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default Sidebar

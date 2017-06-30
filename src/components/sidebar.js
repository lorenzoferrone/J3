import React, {Component} from 'react'
import {render} from 'react-dom'

import {connect} from 'react-redux'
import {selectFile, selectFolder, selectNode, deleteFile} from '../model/reducers'

// import fs from 'fs'
// import dirTree from 'directory-tree'


const nodeComponent = (node, selectedNodeId, selectedFileId, selectedFolderId, onNodeClick, _deleteFile) => {
    const active = node.id == selectedNodeId ? 'selected' : ''
    const activeFolder = node.id == selectedFolderId ? 'selected' : ''
    const isFolder = node.hasOwnProperty('children') ? 'folder' : ''
    const className = `list-group-item ${active} ${isFolder} ${activeFolder}`

    const deleteNode = (e) => {
        _deleteFile(node)
        e.stopPropagation()
    }

    return (
        <li className= {className} >
            <div className='element' onClick={() => onNodeClick(node)}>
                <span>
                    {node.name}
                </span>
                <i className="fa fa-trash-o fa-lg deleteButton"
                   onClick={deleteNode}>
                </i>
            </div>
        </li>
    )
}



const sidebar = ({nodes, selectedNodeId, selectedFolderId,  selectedFileId, onNodeClick, _deleteFile, visible}) => {

    console.log(selectedFolderId)
    let nodes_
    if (selectedFolderId == 'root'){
        nodes_ = nodes
    }
    else {
        nodes_ = nodes.get(selectedFolderId).children
    }

    const list = nodes_
        .filter(node => !node.hasOwnProperty('children'))
        .map(node => nodeComponent(node, selectedNodeId, selectedFileId, selectedFolderId, onNodeClick, _deleteFile))
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

const mapStateToProps = ({selectedNode, selectedFolder, selectedFile, data, sidebarState}) => {
    return ({
        nodes: data,
        selectedFolderId: selectedFolder,
        selectedNodeId: selectedNode,
        selectedFileId: selectedFile,
        visible: sidebarState
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNodeClick: (node) => dispatch(selectFile(node.id)),
        _deleteFile: (node) => dispatch(deleteFile(node.id))
    }
}

const SidebarFile = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default SidebarFile

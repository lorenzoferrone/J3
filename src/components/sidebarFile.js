import React, {Component} from 'react'
import {render} from 'react-dom'
import {connect} from 'react-redux'

import {OrderedMap, fromJS} from 'immutable'

import {selectFile, selectFolder, selectNode, deleteFile} from '../model/actions'

import fs from 'fs'
import dirTree from 'directory-tree'


const nodeComponent = (nodes, node, onNodeClick, selectedFileId, _deleteFile) => {
    const active = node.id == selectedFileId ? 'activeFile' : ''
    const className = `list-group-item ${active}`

    const deleteNode = (e) => {
        console.log(e)
        if (node.id == selectedFileId) {
            console.log('cancellando il file ativo')
            // seleziono un file fittizio vuoto
            onNodeClick('0')
            _deleteFile(node.id)
        }
        else {
            _deleteFile(node.id)
        }

        e.stopPropagation()
    }

    return (
        <div>
        <li className= {"list-group-item"} >
            <div className={`element ${active}`}
                onClick = {(e) => onNodeClick(node.id)}>
                <span>
                    {node.name}
                </span>
                <span className='deleteButton'
                      onClick={(e) => deleteNode(e)}>x</span>
            </div>
        </li>
        </div>
    )
}


const sidebar = ({nodes, visible, onNodeClick, selectedFileId, selectedFolderId, _deleteFile}) => {
    const list = nodes
        .filter(node => !node.hasOwnProperty('children'))
        .filter(node => node.path.includes(selectedFolderId) || selectedFolderId == 'root')
        .map(node => nodeComponent(nodes, node, onNodeClick, selectedFileId, _deleteFile))


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

const mapStateToProps = ({selectedFile, selectedFolder, data, sidebarState}) => {
    return ({
        nodes: data,
        selectedFileId: selectedFile,
        selectedFolderId: selectedFolder,
        visible: sidebarState
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNodeClick: (id) => dispatch(selectFile(id)),
        _deleteFile: (id) => dispatch(deleteFile(id))
    }
}

const SidebarFile = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default SidebarFile

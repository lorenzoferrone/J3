import React, {Component} from 'react'
import {render} from 'react-dom'
import {connect} from 'react-redux'

import {OrderedMap, fromJS} from 'immutable'

import {selectFile, selectFolder, selectNode, deleteFile, editing, updateFileTitle} from '../model/actions'

import fs from 'fs'
import dirTree from 'directory-tree'


const nodeComponent = (nodes, node, onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle) => {
    const active = node.id == selectedFolderId ? 'active' : ''
    const className = `list-group-item ${active}`
    const editing_ = node.id != editingId? 'rename': ''

    const deleteNode = (e) => {
        _deleteFile(node.id)
        e.stopPropagation()
    }

    const __updateTitle = (event) => {
        const title = event.target.value != ''? event.target.value : 'Untitled'
        console.log(title)
        console.log(event)
        _updateTitle(node.id, title)
    }


    let subComponent = null
    if (node.hasOwnProperty('children')) {
        subComponent =
            <ul className='list-group'>
                {node
                    .children
                    .filter(childId => nodes.get(childId).hasOwnProperty('children'))
                    .map(childId => nodeComponent(
                        nodes, nodes.get(childId), onNodeClick,
                        selectedFolderId, editingId, _editNode, _updateTitle)
                    )
                }
            </ul>
    }


    return (
        <li className= {`list-group-item`} >
                <span className={`element ${active}`}
                      onClick={(e) => {onNodeClick(node.id); e.stopPropagation()}}
                      onContextMenu={(e) => {console.log('diocane'); _editNode(node.id)}}>
                      {node.name}
                </span>
                <div className={editing_}>
                    <input value={node.name}
                           onChange={(event) => __updateTitle(event)}
                           onBlur={() => _editNode('0')}/>
                </div>
                {subComponent}

        </li>
    )
}


const sidebar = ({nodes, visible, onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle}) => {
    const listFolder = nodes
        .filter(node => node.path.length == 1)
        .filter(node => node.hasOwnProperty('children'))
        .map(node => nodeComponent(nodes, node, onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle))


    const hidden = visible? '': ' hidden'
    const active = selectedFolderId == 'root'? 'active' : ''
    return (
        <div className={`sidebarRoot pane-sm sidebar ${hidden}`}>
            <ul className='list-group'>
                <li className={`list-group-item`} onClick={(e) => onNodeClick('root')}>
                    <span className = {`element ${active}`}>
                      {"All Files"}
                    </span>
                </li>
                {listFolder}
            </ul>
        </div>
    )
}




//

const mapStateToProps = ({selectedFolder, data, sidebarState, editing}) => {
    return ({
        nodes: data,
        selectedFolderId: selectedFolder,
        visible: sidebarState,
        editingId: editing
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNodeClick: (id) => dispatch(selectFolder(id)),
        _deleteFile: (id) => dispatch(deleteFile(id)),
        _editNode: (id) => dispatch(editing(id)),
        _updateTitle: (id, title) => dispatch(updateFileTitle(id, title))
    }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default Sidebar

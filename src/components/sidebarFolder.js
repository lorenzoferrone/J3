import React, {Component} from 'react'
import {render} from 'react-dom'
import {connect} from 'react-redux'

import {OrderedMap, fromJS} from 'immutable'

import {selectFile, selectFolder, selectNode, deleteFile, deleteFolder, editing, updateFileTitle,
    newFolder} from '../model/actions'

import fs from 'fs'
import dirTree from 'directory-tree'

const {remote} = require('electron')
const {Menu, MenuItem} = remote


const nodeComponent = (
    nodes, node, selectedFolderId, editingId, _editNode,
    _updateTitle, _selectFolder, _selectFile, _newFolder, _deleteFolder) => {

    const active = node.id == selectedFolderId ? 'active' : ''
    const className = `list-group-item ${active}`
    const editing_ = node.id != editingId? 'rename': ''

    // declare textinput ref to focus
    let textInput

    // meun creation
    const menu = new Menu()
    menu.append(new MenuItem({
        label: 'Rename Folder',
        click() {
            _editNode(node.id);
        }
    }))

    menu.append(new MenuItem({
        label: 'Delete Folder',
        click() {
            _deleteFolder(node.id);
        }
    }))

    menu.append(new MenuItem({type: 'separator'}))

    menu.append(new MenuItem({
        label: 'New Folder',
        click: () => {
            let path
            if (selectedFolderId == 'root') {
                path = ['root']
            }
            else {
                path = nodes.get(selectedFolderId).path
            }
            const action = _newFolder(path)
            _selectFolder(action.id)
        }
    }))

    const deleteNode = (e) => {
        _deleteFile(node.id)
        if (nodes.get(node.id).children.length > 0) {
            _selectFile(nodes.get(node.id).children[0])
        }
        else {
            _selectFile('0')
        }
        e.stopPropagation()
    }

    const __updateTitle = (event) => {
        const title = event.target.value != ''? event.target.value : 'Untitled'
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
                        nodes, nodes.get(childId),
                        selectedFolderId, editingId, _editNode, _updateTitle,
                        _selectFolder, _selectFile, _newFolder, _deleteFolder)
                    )
                }
            </ul>
    }

    const _onClick = (e) => {
        _selectFolder(node.id)
        if (nodes.get(node.id).children.filter(childId => !nodes.get(childId).hasOwnProperty('children')).length > 0) {
            _selectFile(nodes.get(node.id)
                .children
                .filter(childId => !nodes.get(childId).hasOwnProperty('children'))[0]
            )
        }
        else {
            _selectFile('0')
        }
        e.stopPropagation()
    }


    return (
        <li className= {`list-group-item`} >
                <span className={`element ${active}`}
                      onClick={(e) => _onClick(e)}
                      onContextMenu={(e) => menu.popup(remote.getCurrentWindow())}>
                      {node.name}
                </span>
                <div className={editing_}>
                    <input type='text'
                           ref={input => {textInput = input; textInput && textInput.focus(); textInput && textInput.select()}}
                           value={node.name}
                           onChange={(event) => __updateTitle(event)}
                           onBlur={() => _editNode('0')}/>
                </div>
                {subComponent}

        </li>
    )
}


const sidebar = ({
    nodes, visible, selectedFolderId, editingId, _editNode, _updateTitle,
    _selectFolder, _selectFile, _newFolder, _deleteFolder}) => {

    const listFolder = nodes
        .filter(node => node.path.length == 1)
        .filter(node => node.hasOwnProperty('children'))
        .map(node => nodeComponent(
            nodes, node, selectedFolderId, editingId, _editNode,
            _updateTitle, _selectFolder, _selectFile, _newFolder,
            _deleteFolder
        ))

    //
    const _onClick = (e, id) => {
        _selectFolder(id)
        // try to get first child of folder
        console.log('children', nodes)
        const node = nodes
            .filter(node => !node.hasOwnProperty('children'))
            .first()
        _selectFile(node.id)
        e.stopPropagation()
    }


    const hidden = visible? '': ' hidden'
    const active = selectedFolderId == 'root'? 'active' : ''
    return (
        <div className={`sidebarRoot pane-sm sidebar ${hidden}`}>
            <ul className='list-group'>
                <li className={`list-group-item`} onClick={(e) => _onClick(e, 'root')}>
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
        _newFolder: (path) => dispatch(newFolder('new folder', path)),
        _selectFolder: (id) => dispatch(selectFolder(id)),
        _selectFile: (id) => dispatch(selectFile(id)),
        _deleteFile: (id) => dispatch(deleteFile(id)),
        _deleteFolder: (id) => dispatch(deleteFolder(id)),
        _editNode: (id) => dispatch(editing(id)),
        _updateTitle: (id, title) => dispatch(updateFileTitle(id, title))
    }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default Sidebar

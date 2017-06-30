import React, {Component} from 'react'
import {render} from 'react-dom'

import {connect} from 'react-redux'
import {selectFile, selectFolder, selectNode, deleteFile} from '../model/reducers'

// import fs from 'fs'
// import dirTree from 'directory-tree'


const nodeComponent = (node, selectedFolderId, onNodeClick, _deleteFile) => {
    const active = node.id == selectedFolderId ? 'activeFolder' : ''
    // const isFolder = node.hasOwnProperty('children') ? 'folder' : ''
    const className = `list-group-item ${active}`

    const deleteNode = (e) => {
        _deleteFile(node)
        e.stopPropagation()
    }


    return (
        <li className= {className} >
            <div className='element' onClick={() => onNodeClick(node.id)}>
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



const sidebar = ({nodes, selectedFolderId,  onNodeClick, _deleteFile, visible}) => {
    const list = nodes
        .filter(node => node.hasOwnProperty('children'))
        .map(node => nodeComponent(node, selectedFolderId, onNodeClick, _deleteFile))
    const hidden = visible? '': ' hidden'

    return (
        <div className={`sidebarRoot pane-sm sidebar ${hidden}`}>
            <ul className='list-group'>
                <li className= {`list-group-item`} >
                    <div className='element' onClick={() => onNodeClick('root')}>
                        <span>
                            {'All Files'}
                        </span>
                    </div>
                </li>
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

const SidebarFolder = connect(mapStateToProps, mapDispatchToProps)(sidebar)
export default SidebarFolder

// TODO: mi sa che cambio tutto, mi serve un metodo "facile" per gestire le note come
// un albero (cartelle e sottocartelle etc)
// opzioni:
// * incorporare redux con qualcosa che mi faccia leggere direttamente il fs (un file una nota)
// * usare qualche libreria (tipo treemodel) e adattarla a redux
// * boh? accannare redux del tutto e usare https://github.com/arqex/freezer (o simili)

import fs from 'fs'
import {OrderedMap, fromJS} from 'immutable'
import {genKey} from 'draft-js'
import {combineReducers} from 'redux'
import Freezer from 'freezer-js'


const content = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'))

const treeNodes = new Freezer(content)

console.log(treeNodes.getData())


// treeNodes = treeNodes.clone()



// actions
export const selectFile = (id) => {
    return {
        type: 'select_file',
        id: id
    }
}

export const selectFolder = (id) => {
    return {
        type: 'select_folder',
        id: id
    }
}

export const selectNode = (id) => {
    return {
        type: 'select_node',
        id: id
    }
}

export const updateFileContent = (id, content) => {
    return {
        type: 'update_file_content',
        id: id,
        content: content
    }
}

export const updateFileTitle = (id, title) => {
    return {
        type: 'update_file_title',
        id: id,
        name: title
    }
}

export const newFile = (title='Untitled', parentId='root') => {
    const id = genKey()
    return {
        type: 'new_file',
        id: id,
        name: title,
        parentId: parentId
    }
}

export const newFolder = (title='new folder', path=['root']) => {
    const id = genKey()
    let newPath
    if (path == 'root') {
        newPath = [id]
    }
    else {
        newPath = path.concat(['children', id])
    }
    return {
        type: 'new_folder',
        id: id,
        name: title,
        path: newPath
    }
}

export const deleteFile = (id) => {
    return {
        type: 'delete_file',
        id: id
    }
}

export const showSearch = (bool) => {
    return {type: 'show_search', bool}
}

export const showSidebar = (bool) => {
    return {type: 'show_sidebar', bool}
}

export const search = (string) => {
    return {type: 'search', string: string}
}




const initialState = {
    selectedFile: "0",
    selectedFolder: 'root',
    data: treeNodes,
    searchState: false
}

// save store on disk
export const saveOnFile = (data) => {
    const content = JSON.stringify(data.model)
    fs.writeFile('./data/db.json', content)
}

// reducers
// data related (delete, create and modify nodes)
const data = (state=initialState.data, action) => {

    switch (action.type) {
        case 'update_file_content':
            return state.set(action.id, {...state.get(action.id), content: action.content})

        case 'update_file_title':
            return state.set(action.id, {...state.get(action.id), name: action.name})

        case 'new_file':
            // devo modificare per creare file sotto altre cartelle.
            // return state.set(action.id, {name: action.name, content: undefined, id: action.id})
            console.log('parentFolder', action.parentId)
            const newNode = {name: action.name, content: undefined, id: action.id}
            return getById(clone(state), action.parentId).addChild(newNode)
            // return state.setIn(action.path, {name: action.name, content: undefined, id: action.id, path: action.path})

        case 'delete_file':
            return state.delete(action.id)

        case 'new_folder':
            return state.setIn(action.path, {name: action.name, id: action.id, children: OrderedMap(), path: action.path})

        default:
            return state
    }
}
// data related: active node
const selectedFile = (state="0", action) => {
    switch (action.type){
        case 'select_file':
            return action.id
        default:
            return state
    }
}

const selectedFolder = (state="root", action) => {
    switch (action.type){
        case 'select_folder':
            return action.id
        default:
            return state
    }
}

const selectedNode = (state="0", action) => {
    switch (action.type){
        case 'select_node':
            return action.id
        default:
            return state
    }
}

// "UI" related (search text, search bar visible...)
const searchState = (state=false, action) => {
    if (action.type == 'show_search') {
        return action.bool
    }
    return state
}

const sidebarState = (state=true, action) => {
    if (action.type == 'show_sidebar') {
        return action.bool
    }
    return state
}

const searchString = (state='', action) => {
    if (action.type == 'search'){
        return action.string
    }
    return state
}



// combine and export
export const appStore = combineReducers(
    {selectedFile, selectedNode, selectedFolder, data, searchState, searchString, sidebarState}
)

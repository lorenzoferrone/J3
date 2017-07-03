import {OrderedMap, Map} from 'immutable'
import {combineReducers} from 'redux'
import {computePath, initializeData} from './helpers'



//
const initialState = initializeData()

console.log(initialState)




// reducers
// data related (delete, create and modify nodes)
const data = (state=initialState.data, action) => {

    switch (action.type) {
        case 'update_file_content':
            console.log('action', action.id, action.content)
            return state.set(action.id, {content: action.content})

        case 'update_file_title':
            console.log('actions', action.id, action.name)
            return state.set(action.id, {name: action.name})
            // return state.set(action.id, {...state.get(action.id), name: action.name})

        case 'new_file':
            // devo modificare per creare file sotto altre cartelle.
            // return state.set(action.id, {name: action.name, content: undefined, id: action.id})

            // calcolo del path

            return state.add({name: action.name, content: undefined, id: action.id})

        case 'delete_file':
            return state.delete(action.id)

        case 'new_folder':
        // calcolo del path
            const pathFolder = computePath(action.path, action.id)
            console.log ('pathFolder', pathFolder)
            return state.setIn(pathFolder, {name: action.name, id: action.id, children: OrderedMap(), path: pathFolder})

        default:
            return state
    }
}
// data related: active node
const selectedFile = (state=initialState.selectedFile, action) => {
    switch (action.type){
        case 'select_file':
            return action.id
        default:
            return state
    }
}

const selectedFolder = (state=initialState.selectedFolder, action) => {
    switch (action.type){
        case 'select_folder':
            return action.id
        default:
            return state
    }
}

const selectedNode = (state=initialState.selectedNode, action) => {
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

const sidebarState = (state=initialState.sidebarState, action) => {
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

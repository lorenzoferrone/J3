import {OrderedMap, Map} from 'immutable'
import {combineReducers} from 'redux'
import {computePath, initializeData} from './helpers'

//
const initialState = initializeData()

console.log(initialState.data.get(initialState.selectedNode))


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

            // calcolo del path
            const path = computePath(action.path, action.id)
            const parent = action.path.slice(-1)[0]
            if (parent != 'root') {
                const children = state.get(parent).children.concat([action.id])
                state = state.set(
                    parent,
                    {
                        ...state.get(parent),
                        children: children
                    })
            }

            return state.set(action.id, {name: action.name, content: undefined, id: action.id, path: path})

        case 'delete_file':
            const newPath_delete = state.get(action.id).path
            const parent_delete = newPath_delete.slice(-2)[0]
            if (newPath_delete.length > 1){
                console.log('o', newPath_delete, parent_delete)
                console.log(state.get(parent_delete))
                if (state.get(parent_delete) != undefined) {
                    const index = state.get(parent_delete).children.indexOf(action.id)
                    console.log(state.get(parent_delete).children)
                    const newChildren = state.get(parent_delete)
                        .children
                        .filter(child => child != action.id)
                    console.log(newChildren)
                    state = state.set(
                        parent_delete,
                        {
                            ...state.get(parent_delete),
                            children: newChildren
                        }
                    )
                }

            }
            return state.delete(action.id)

        case 'delete_folder':
            // per cancellare una cartella devo fare varie cose:
            // * cancellare il nodo relativo alla cartella
            // * cancellare i riferimenti al nodo da parte di ogni antecedente (cioè il padre)
            // * cancellare o rilocare tutti i figli (ricorsivamente)

            // i primi due punti sono uguali al cancellamento di un file

            const folderToDelete = state.get(action.id)

            const newPath_delete_ = state.get(action.id).path
            const parent_delete_ = newPath_delete_.slice(-2)[0]
            if (newPath_delete_.length > 1){
                const index_ = state.get(parent_delete_).children.indexOf(action.id)
                const newChildren_ = state.get(parent_delete_)
                    .children
                    .filter(child => child != action.id)
                state = state.set(
                    parent_delete_,
                    {
                        ...state.get(parent_delete_),
                        children: newChildren_
                    }
                )

            }
            // qua implemento il terzo punto (cancello tutti i discendenti)

            // tutti i nodi che hanno nel path l'id della cartella che sto cancellando (quindi sono suoi discendenti)
            const references = state.filter(node => node.path.includes(action.id))
            console.log(action.id)
            references.map(r => console.log(r))
            references.forEach(r => console.log(state = state.delete(r.id)))

            return state.delete(action.id)

        case 'new_folder':
            // calcolo del path
            const pathFolder = computePath(action.path, action.id)
            const parentFolder = action.path.slice(-1)[0]
            console.log('p', pathFolder, parentFolder)
            if (parentFolder != 'root') {
                const children = state.get(parentFolder).children.concat([action.id])
                state = state.set(
                    parentFolder,
                    {
                        ...state.get(parentFolder),
                        children: children
                    })
            }
            return state.set(action.id, {name: action.name, id: action.id, children: [], path: pathFolder})

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

const editing = (state='0', action) => {
    if (action.type == 'editing'){
        console.log(action.id)
        return action.id
    }
    return state
}



// combine and export
export const appStore = combineReducers(
    {selectedFile, selectedNode, selectedFolder,
        data, searchState, searchString,
        sidebarState, editing}
)

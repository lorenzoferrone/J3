import fs from 'fs'
import {OrderedMap, fromJS, toJS} from 'immutable'
import TreeModel from 'tree-model'

// const tree = new TreeModel()


export const initializeData = () => {
    // carico lo stato da disco
    const content = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'))
    const mappedData = OrderedMap(content.data)


    const selectedFile = content.selectedFile != undefined ? content.selectedFile: '0'
    const selectedNode = content.selectedNode != undefined ? content.selectedNode: '0'
    const selectedFolder = content.selectedFolder != undefined ? content.selectedFolder: 'root'
    const sidebarState = content.sidebarState != undefined ? content.sidebarState: true
    return {
        data: mappedData,
        selectedFile: selectedFile,
        selectedNode: selectedNode,
        selectedFolder: selectedFolder,
        sidebarState: sidebarState
    }
}


export const computePath = (path, id) => {
    if (path[0] == ['root'] && path.length == 1){
        return [id]
    }
    else {
        return path.concat([id])
    }

}



export const saveOnFile = (state) => {

    const content = JSON.stringify(
        {
            ...state,
            data: state.data
    })
    fs.writeFile('./data/db.json', content, () => true)
}

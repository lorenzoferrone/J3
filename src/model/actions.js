import {genKey} from 'draft-js'

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

export const updateTimestamp = (id, timestamp) => {
    return {
        type: 'update_timestamp',
        id: id,
        timestamp: timestamp
    }
}

export const newFile = (title='Untitled', path=['root']) => {
    const id = genKey()
    return {
        type: 'new_file',
        id: id,
        name: title,
        path: path
    }
}

export const newFolder = (title='new folder', path=['root']) => {
    const id = genKey()
    return {
        type: 'new_folder',
        id: id,
        name: title,
        path: path
    }
}

export const deleteFile = (id) => {
    return {
        type: 'delete_file',
        id: id
    }
}

export const deleteFolder = (id) => {
    return {
        type: 'delete_folder',
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

export const editing = id => {
    return {type: 'editing', id: id}
}

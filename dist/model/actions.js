'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.editing = exports.search = exports.showSidebar = exports.showSearch = exports.deleteFile = exports.newFolder = exports.newFile = exports.updateFileTitle = exports.updateFileContent = exports.selectNode = exports.selectFolder = exports.selectFile = undefined;

var _draftJs = require('draft-js');

var selectFile = exports.selectFile = function selectFile(id) {
    return {
        type: 'select_file',
        id: id
    };
};

var selectFolder = exports.selectFolder = function selectFolder(id) {
    return {
        type: 'select_folder',
        id: id
    };
};

var selectNode = exports.selectNode = function selectNode(id) {
    return {
        type: 'select_node',
        id: id
    };
};

var updateFileContent = exports.updateFileContent = function updateFileContent(id, content) {
    return {
        type: 'update_file_content',
        id: id,
        content: content
    };
};

var updateFileTitle = exports.updateFileTitle = function updateFileTitle(id, title) {
    return {
        type: 'update_file_title',
        id: id,
        name: title
    };
};

var newFile = exports.newFile = function newFile() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Untitled';
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['root'];

    var id = (0, _draftJs.genKey)();
    return {
        type: 'new_file',
        id: id,
        name: title,
        path: path
    };
};

var newFolder = exports.newFolder = function newFolder() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'new folder';
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['root'];

    var id = (0, _draftJs.genKey)();
    return {
        type: 'new_folder',
        id: id,
        name: title,
        path: path
    };
};

var deleteFile = exports.deleteFile = function deleteFile(id) {
    return {
        type: 'delete_file',
        id: id
    };
};

var showSearch = exports.showSearch = function showSearch(bool) {
    return { type: 'show_search', bool: bool };
};

var showSidebar = exports.showSidebar = function showSidebar(bool) {
    return { type: 'show_sidebar', bool: bool };
};

var search = exports.search = function search(string) {
    return { type: 'search', string: string };
};

var editing = exports.editing = function editing(id) {
    return { type: 'editing', id: id };
};
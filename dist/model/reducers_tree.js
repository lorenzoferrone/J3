'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appStore = undefined;

var _immutable = require('immutable');

var _redux = require('redux');

var _helpers = require('./helpers');

//
var initialState = (0, _helpers.initializeData)();

console.log(initialState);

// reducers
// data related (delete, create and modify nodes)
var data = function data() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.data;
    var action = arguments[1];


    switch (action.type) {
        case 'update_file_content':
            console.log('action', action.id, action.content);
            return state.set(action.id, { content: action.content });

        case 'update_file_title':
            console.log('actions', action.id, action.name);
            return state.set(action.id, { name: action.name });
        // return state.set(action.id, {...state.get(action.id), name: action.name})

        case 'new_file':
            // devo modificare per creare file sotto altre cartelle.
            // return state.set(action.id, {name: action.name, content: undefined, id: action.id})

            // calcolo del path

            return state.add({ name: action.name, content: undefined, id: action.id });

        case 'delete_file':
            return state.delete(action.id);

        case 'new_folder':
            // calcolo del path
            var pathFolder = (0, _helpers.computePath)(action.path, action.id);
            console.log('pathFolder', pathFolder);
            return state.setIn(pathFolder, { name: action.name, id: action.id, children: (0, _immutable.OrderedMap)(), path: pathFolder });

        default:
            return state;
    }
};
// data related: active node
var selectedFile = function selectedFile() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.selectedFile;
    var action = arguments[1];

    switch (action.type) {
        case 'select_file':
            return action.id;
        default:
            return state;
    }
};

var selectedFolder = function selectedFolder() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.selectedFolder;
    var action = arguments[1];

    switch (action.type) {
        case 'select_folder':
            return action.id;
        default:
            return state;
    }
};

var selectedNode = function selectedNode() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.selectedNode;
    var action = arguments[1];

    switch (action.type) {
        case 'select_node':
            return action.id;
        default:
            return state;
    }
};

// "UI" related (search text, search bar visible...)
var searchState = function searchState() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments[1];

    if (action.type == 'show_search') {
        return action.bool;
    }
    return state;
};

var sidebarState = function sidebarState() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.sidebarState;
    var action = arguments[1];

    if (action.type == 'show_sidebar') {
        return action.bool;
    }
    return state;
};

var searchString = function searchString() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var action = arguments[1];

    if (action.type == 'search') {
        return action.string;
    }
    return state;
};

// combine and export
var appStore = exports.appStore = (0, _redux.combineReducers)({ selectedFile: selectedFile, selectedNode: selectedNode, selectedFolder: selectedFolder, data: data, searchState: searchState, searchString: searchString, sidebarState: sidebarState });
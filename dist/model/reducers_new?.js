'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appStore = exports.saveOnFile = exports.search = exports.showSidebar = exports.showSearch = exports.deleteFile = exports.newFolder = exports.newFile = exports.updateFileTitle = exports.updateFileContent = exports.selectNode = exports.selectFolder = exports.selectFile = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // TODO: mi sa che cambio tutto, mi serve un metodo "facile" per gestire le note come
// un albero (cartelle e sottocartelle etc)
// opzioni:
// * incorporare redux con qualcosa che mi faccia leggere direttamente il fs (un file una nota)
// * usare qualche libreria (tipo treemodel) e adattarla a redux
// * boh? accannare redux del tutto e usare https://github.com/arqex/freezer (o simili)

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _redux = require('redux');

var _freezerJs = require('freezer-js');

var _freezerJs2 = _interopRequireDefault(_freezerJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var content = JSON.parse(_fs2.default.readFileSync('./data/db.json', 'utf8'));

var treeNodes = new _freezerJs2.default(content);

console.log(treeNodes.getData());

// treeNodes = treeNodes.clone()


// actions
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
    var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';

    var id = (0, _draftJs.genKey)();
    return {
        type: 'new_file',
        id: id,
        name: title,
        parentId: parentId
    };
};

var newFolder = exports.newFolder = function newFolder() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'new folder';
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['root'];

    var id = (0, _draftJs.genKey)();
    var newPath = void 0;
    if (path == 'root') {
        newPath = [id];
    } else {
        newPath = path.concat(['children', id]);
    }
    return {
        type: 'new_folder',
        id: id,
        name: title,
        path: newPath
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

var initialState = {
    selectedFile: "0",
    selectedFolder: 'root',
    data: treeNodes,
    searchState: false
};

// save store on disk
var saveOnFile = exports.saveOnFile = function saveOnFile(data) {
    var content = JSON.stringify(data.model);
    _fs2.default.writeFile('./data/db.json', content);
};

// reducers
// data related (delete, create and modify nodes)
var data = function data() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState.data;
    var action = arguments[1];


    switch (action.type) {
        case 'update_file_content':
            return state.set(action.id, _extends({}, state.get(action.id), { content: action.content }));

        case 'update_file_title':
            return state.set(action.id, _extends({}, state.get(action.id), { name: action.name }));

        case 'new_file':
            // devo modificare per creare file sotto altre cartelle.
            // return state.set(action.id, {name: action.name, content: undefined, id: action.id})
            console.log('parentFolder', action.parentId);
            var newNode = { name: action.name, content: undefined, id: action.id };
            return getById(clone(state), action.parentId).addChild(newNode);
        // return state.setIn(action.path, {name: action.name, content: undefined, id: action.id, path: action.path})

        case 'delete_file':
            return state.delete(action.id);

        case 'new_folder':
            return state.setIn(action.path, { name: action.name, id: action.id, children: (0, _immutable.OrderedMap)(), path: action.path });

        default:
            return state;
    }
};
// data related: active node
var selectedFile = function selectedFile() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0";
    var action = arguments[1];

    switch (action.type) {
        case 'select_file':
            return action.id;
        default:
            return state;
    }
};

var selectedFolder = function selectedFolder() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "root";
    var action = arguments[1];

    switch (action.type) {
        case 'select_folder':
            return action.id;
        default:
            return state;
    }
};

var selectedNode = function selectedNode() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0";
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
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
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
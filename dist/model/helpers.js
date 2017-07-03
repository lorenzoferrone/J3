'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveOnFile = exports.computePath = exports.initializeData = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _immutable = require('immutable');

var _treeModel = require('tree-model');

var _treeModel2 = _interopRequireDefault(_treeModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const tree = new TreeModel()


var initializeData = exports.initializeData = function initializeData() {
    // carico lo stato da disco
    var content = JSON.parse(_fs2.default.readFileSync('./data/db.json', 'utf8'));
    var mappedData = (0, _immutable.OrderedMap)(content.data);

    var selectedFile = content.selectedFile != undefined ? content.selectedFile : '0';
    var selectedNode = content.selectedNode != undefined ? content.selectedNode : '0';
    var selectedFolder = content.selectedFolder != undefined ? content.selectedFolder : 'root';
    var sidebarState = content.sidebarState != undefined ? content.sidebarState : true;
    return {
        data: mappedData,
        selectedFile: selectedFile,
        selectedNode: selectedNode,
        selectedFolder: selectedFolder,
        sidebarState: sidebarState
    };
};

var computePath = exports.computePath = function computePath(path, id) {
    if (path[0] == ['root'] && path.length == 1) {
        return [id];
    } else {
        return path.concat([id]);
    }
};

var saveOnFile = exports.saveOnFile = function saveOnFile(state) {

    var content = JSON.stringify(_extends({}, state, {
        data: state.data
    }));
    _fs2.default.writeFile('./data/db.json', content, function () {
        return true;
    });
};
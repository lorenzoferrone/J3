'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _reducers = require('../model/reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import fs from 'fs'
// import dirTree from 'directory-tree'


var nodeComponent = function nodeComponent(node, selectedNodeId, selectedFileId, selectedFolderId, onNodeClick, _deleteFile) {
    var active = node.id == selectedNodeId ? 'selected' : '';
    var activeFolder = node.id == selectedFolderId ? 'selected' : '';
    var isFolder = node.hasOwnProperty('children') ? 'folder' : '';
    var className = 'list-group-item ' + active + ' ' + isFolder + ' ' + activeFolder;

    var deleteNode = function deleteNode(e) {
        _deleteFile(node);
        e.stopPropagation();
    };

    return _react2.default.createElement(
        'li',
        { className: className },
        _react2.default.createElement(
            'div',
            { className: 'element', onClick: function onClick() {
                    return onNodeClick(node);
                } },
            _react2.default.createElement(
                'span',
                null,
                node.name
            ),
            _react2.default.createElement('i', { className: 'fa fa-trash-o fa-lg deleteButton',
                onClick: deleteNode })
        )
    );
};

var sidebar = function sidebar(_ref) {
    var nodes = _ref.nodes,
        selectedNodeId = _ref.selectedNodeId,
        selectedFolderId = _ref.selectedFolderId,
        selectedFileId = _ref.selectedFileId,
        onNodeClick = _ref.onNodeClick,
        _deleteFile = _ref._deleteFile,
        visible = _ref.visible;


    console.log(selectedFolderId);
    var nodes_ = void 0;
    if (selectedFolderId == 'root') {
        nodes_ = nodes;
    } else {
        nodes_ = nodes.get(selectedFolderId).children;
    }

    var list = nodes_.filter(function (node) {
        return !node.hasOwnProperty('children');
    }).map(function (node) {
        return nodeComponent(node, selectedNodeId, selectedFileId, selectedFolderId, onNodeClick, _deleteFile);
    });
    var hidden = visible ? '' : ' hidden';

    return _react2.default.createElement(
        'div',
        { className: 'sidebarRoot pane-sm sidebar ' + hidden },
        _react2.default.createElement(
            'ul',
            { className: 'list-group' },
            list
        )
    );
};

//

var mapStateToProps = function mapStateToProps(_ref2) {
    var selectedNode = _ref2.selectedNode,
        selectedFolder = _ref2.selectedFolder,
        selectedFile = _ref2.selectedFile,
        data = _ref2.data,
        sidebarState = _ref2.sidebarState;

    return {
        nodes: data,
        selectedFolderId: selectedFolder,
        selectedNodeId: selectedNode,
        selectedFileId: selectedFile,
        visible: sidebarState
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onNodeClick: function onNodeClick(node) {
            return dispatch((0, _reducers.selectFile)(node.id));
        },
        _deleteFile: function _deleteFile(node) {
            return dispatch((0, _reducers.deleteFile)(node.id));
        }
    };
};

var SidebarFile = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(sidebar);
exports.default = SidebarFile;
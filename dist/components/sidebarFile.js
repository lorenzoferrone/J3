'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _actions = require('../model/actions');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _directoryTree = require('directory-tree');

var _directoryTree2 = _interopRequireDefault(_directoryTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeComponent = function nodeComponent(nodes, node, onNodeClick, selectedFileId, _deleteFile) {
    var active = node.id == selectedFileId ? 'activeFile' : '';
    var className = 'list-group-item ' + active;

    var deleteNode = function deleteNode(e) {
        console.log(e);
        if (node.id == selectedFileId) {
            console.log('cancellando il file ativo');
            // seleziono un file fittizio vuoto
            onNodeClick('0');
            _deleteFile(node.id);
        } else {
            _deleteFile(node.id);
        }

        e.stopPropagation();
    };

    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'li',
            { className: "list-group-item" },
            _react2.default.createElement(
                'div',
                { className: 'element ' + active,
                    onClick: function onClick(e) {
                        return onNodeClick(node.id);
                    } },
                _react2.default.createElement(
                    'span',
                    null,
                    node.name
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'deleteButton',
                        onClick: function onClick(e) {
                            return deleteNode(e);
                        } },
                    'x'
                )
            )
        )
    );
};

var sidebar = function sidebar(_ref) {
    var nodes = _ref.nodes,
        visible = _ref.visible,
        onNodeClick = _ref.onNodeClick,
        selectedFileId = _ref.selectedFileId,
        selectedFolderId = _ref.selectedFolderId,
        _deleteFile = _ref._deleteFile;

    var list = nodes.filter(function (node) {
        return !node.hasOwnProperty('children');
    }).filter(function (node) {
        return node.path.includes(selectedFolderId) || selectedFolderId == 'root';
    }).map(function (node) {
        return nodeComponent(nodes, node, onNodeClick, selectedFileId, _deleteFile);
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
    var selectedFile = _ref2.selectedFile,
        selectedFolder = _ref2.selectedFolder,
        data = _ref2.data,
        sidebarState = _ref2.sidebarState;

    return {
        nodes: data,
        selectedFileId: selectedFile,
        selectedFolderId: selectedFolder,
        visible: sidebarState
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onNodeClick: function onNodeClick(id) {
            return dispatch((0, _actions.selectFile)(id));
        },
        _deleteFile: function _deleteFile(id) {
            return dispatch((0, _actions.deleteFile)(id));
        }
    };
};

var SidebarFile = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(sidebar);
exports.default = SidebarFile;
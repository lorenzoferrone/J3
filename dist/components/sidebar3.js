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

var nodeComponent = function nodeComponent(nodes, node, onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle) {
    var active = node.id == selectedFolderId ? 'active' : '';
    var className = 'list-group-item ' + active;
    var editing_ = node.id != editingId ? 'rename' : '';

    var deleteNode = function deleteNode(e) {
        _deleteFile(node.id);
        e.stopPropagation();
    };

    var __updateTitle = function __updateTitle(event) {
        var title = event.target.value != '' ? event.target.value : 'Untitled';
        console.log(title);
        console.log(event);
        _updateTitle(node.id, title);
    };

    var subComponent = null;
    if (node.hasOwnProperty('children')) {
        subComponent = _react2.default.createElement(
            'ul',
            { className: 'list-group' },
            node.children.filter(function (childId) {
                return nodes.get(childId).hasOwnProperty('children');
            }).map(function (childId) {
                return nodeComponent(nodes, nodes.get(childId), onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle);
            })
        );
    }

    return _react2.default.createElement(
        'li',
        { className: 'list-group-item' },
        _react2.default.createElement(
            'span',
            { className: 'element ' + active,
                onClick: function onClick(e) {
                    onNodeClick(node.id);e.stopPropagation();
                },
                onContextMenu: function onContextMenu(e) {
                    console.log('diocane');_editNode(node.id);
                } },
            node.name
        ),
        _react2.default.createElement(
            'div',
            { className: editing_ },
            _react2.default.createElement('input', { value: node.name,
                onChange: function onChange(event) {
                    return __updateTitle(event);
                },
                onBlur: function onBlur() {
                    return _editNode('0');
                } })
        ),
        subComponent
    );
};

var sidebar = function sidebar(_ref) {
    var nodes = _ref.nodes,
        visible = _ref.visible,
        onNodeClick = _ref.onNodeClick,
        selectedFolderId = _ref.selectedFolderId,
        editingId = _ref.editingId,
        _editNode = _ref._editNode,
        _updateTitle = _ref._updateTitle;

    var listFolder = nodes.filter(function (node) {
        return node.path.length == 1;
    }).filter(function (node) {
        return node.hasOwnProperty('children');
    }).map(function (node) {
        return nodeComponent(nodes, node, onNodeClick, selectedFolderId, editingId, _editNode, _updateTitle);
    });

    var hidden = visible ? '' : ' hidden';
    var active = selectedFolderId == 'root' ? 'active' : '';
    return _react2.default.createElement(
        'div',
        { className: 'sidebarRoot pane-sm sidebar ' + hidden },
        _react2.default.createElement(
            'ul',
            { className: 'list-group' },
            _react2.default.createElement(
                'li',
                { className: 'list-group-item', onClick: function onClick(e) {
                        return onNodeClick('root');
                    } },
                _react2.default.createElement(
                    'span',
                    { className: 'element ' + active },
                    "All Files"
                )
            ),
            listFolder
        )
    );
};

//

var mapStateToProps = function mapStateToProps(_ref2) {
    var selectedFolder = _ref2.selectedFolder,
        data = _ref2.data,
        sidebarState = _ref2.sidebarState,
        editing = _ref2.editing;

    return {
        nodes: data,
        selectedFolderId: selectedFolder,
        visible: sidebarState,
        editingId: editing
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onNodeClick: function onNodeClick(id) {
            return dispatch((0, _actions.selectFolder)(id));
        },
        _deleteFile: function _deleteFile(id) {
            return dispatch((0, _actions.deleteFile)(id));
        },
        _editNode: function _editNode(id) {
            return dispatch((0, _actions.editing)(id));
        },
        _updateTitle: function _updateTitle(id, title) {
            return dispatch((0, _actions.updateFileTitle)(id, title));
        }
    };
};

var Sidebar = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(sidebar);
exports.default = Sidebar;
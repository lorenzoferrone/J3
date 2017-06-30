'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _reducers = require('../model/reducers');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _directoryTree = require('directory-tree');

var _directoryTree2 = _interopRequireDefault(_directoryTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeComponent = function nodeComponent(node, onNodeClick, selectedFolderId) {
    var active = node.model.id == selectedFolderId ? 'activeFolder' : '';
    var isFolder = node.hasChildren() ? 'folder' : '';
    var className = 'list-group-item ' + isFolder + ' ' + active;

    var deleteNode = function deleteNode(e) {
        _deleteFile(node);
        e.stopPropagation();
    };

    // non va bene perché così quando selezione una cartella si seleziona tutto il blocco
    // ...
    var subComponent = null;
    if (node.hasChildren()) {
        subComponent = _react2.default.createElement(
            'ul',
            null,
            node.children.map(function (child) {
                return nodeComponent(child, onNodeClick, selectedFolderId);
            })
        );
    }

    return _react2.default.createElement(
        'li',
        { className: className },
        _react2.default.createElement(
            'div',
            { className: 'element', onClick: function onClick(e) {
                    onNodeClick(node.model.id);e.stopPropagation();
                } },
            _react2.default.createElement(
                'span',
                null,
                node.model.name
            ),
            subComponent
        )
    );
};

var sidebar = function sidebar(_ref) {
    var nodes = _ref.nodes,
        visible = _ref.visible,
        onNodeClick = _ref.onNodeClick,
        selectedFolderId = _ref.selectedFolderId;

    var list = nodes.children.map(function (node) {
        return nodeComponent(node, onNodeClick, selectedFolderId);
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
    var selectedFolder = _ref2.selectedFolder,
        data = _ref2.data,
        sidebarState = _ref2.sidebarState;

    return {
        nodes: data,
        selectedFolderId: selectedFolder,
        visible: sidebarState
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        onNodeClick: function onNodeClick(id) {
            return dispatch((0, _reducers.selectFolder)(id));
        },
        _deleteFile: function _deleteFile(id) {
            return dispatch((0, _reducers.deleteFile)(id));
        }
    };
};

var Sidebar = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(sidebar);
exports.default = Sidebar;
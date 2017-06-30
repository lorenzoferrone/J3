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


var nodeComponent = function nodeComponent(node, selectedFolderId, onNodeClick, _deleteFile) {
    var active = node.id == selectedFolderId ? 'activeFolder' : '';
    // const isFolder = node.hasOwnProperty('children') ? 'folder' : ''
    var className = 'list-group-item ' + active;

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
                    return onNodeClick(node.id);
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
        selectedFolderId = _ref.selectedFolderId,
        onNodeClick = _ref.onNodeClick,
        _deleteFile = _ref._deleteFile,
        visible = _ref.visible;

    var list = nodes.filter(function (node) {
        return node.hasOwnProperty('children');
    }).map(function (node) {
        return nodeComponent(node, selectedFolderId, onNodeClick, _deleteFile);
    });
    var hidden = visible ? '' : ' hidden';

    return _react2.default.createElement(
        'div',
        { className: 'sidebarRoot pane-sm sidebar ' + hidden },
        _react2.default.createElement(
            'ul',
            { className: 'list-group' },
            _react2.default.createElement(
                'li',
                { className: 'list-group-item' },
                _react2.default.createElement(
                    'div',
                    { className: 'element', onClick: function onClick() {
                            return onNodeClick('root');
                        } },
                    _react2.default.createElement(
                        'span',
                        null,
                        'All Files'
                    )
                )
            ),
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

var SidebarFolder = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(sidebar);
exports.default = SidebarFolder;
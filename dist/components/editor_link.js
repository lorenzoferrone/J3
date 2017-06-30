'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.linkStrategy = exports.link = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _reducers = require('../model/reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Versione con l'entità

var addLink = function addLink(contenState, targetNode) {};

// -----------------------------------------

// Versione con il decoratore


var HANDLE_REGEX = /[\w]*::[\w]+/g;

var linkStrategy = function linkStrategy(contentBlock, callback, contentState) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
};

var findWithRegex = function findWithRegex(regex, contentBlock, callback) {
    var text = contentBlock.getText();
    var matchArr = void 0,
        start = void 0;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};

var link_ = function link_(_ref) {
    var decoratedText = _ref.decoratedText,
        nodes = _ref.nodes,
        _clickLink = _ref._clickLink,
        _clickCreate = _ref._clickCreate,
        children = _ref.children;

    var targetText = decoratedText.slice(decoratedText.indexOf(':') + 2);
    var targetNode = nodes.filter(function (node) {
        return node.name.toLowerCase() == targetText.toLowerCase();
    }).first();
    var color = targetNode != undefined ? 'blue' : 'red';
    var onClick = function onClick(event) {
        if (event.metaKey) {
            return targetNode != undefined ? _clickLink(targetNode) : _clickCreate(targetText);
        }
    };
    return _react2.default.createElement(
        'span',
        {
            style: { color: color },
            onClick: onClick
        },
        children
    );
};

var mapStateToProps = function mapStateToProps(_ref2) {
    var data = _ref2.data;

    return { nodes: data };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        _clickLink: function _clickLink(node) {
            return dispatch((0, _reducers.selectFile)(node.id));
        },
        _clickCreate: function _clickCreate(text) {
            var n = (0, _reducers.newFile)(text);
            dispatch(n);
            setTimeout(dispatch((0, _reducers.selectFile)(n.id)), 100);
        }
    };
};

var link = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(link_);
exports.link = link;
exports.linkStrategy = linkStrategy;
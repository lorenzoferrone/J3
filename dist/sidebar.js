'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _directoryTree = require('directory-tree');

var _directoryTree2 = _interopRequireDefault(_directoryTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var walkTree = function walkTree(treeObject) {
    var tree = [];
    console.log(treeObject, treeObject.children != undefined);

    var nameParent = treeObject.name;
    if (treeObject.children != undefined) {
        // è una cartella
        tree.push(_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
                'div',
                { onClick: function onClick() {
                        return console.log(nameParent);
                    } },
                '> ',
                nameParent
            ),
            _react2.default.createElement(
                'ul',
                null,
                treeObject.children.map(function (node) {
                    return walkTree(node);
                })
            )
        ));
    } else {
        // è un file
        tree.push(_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
                'div',
                { onClick: function onClick() {
                        return console.log(nameParent);
                    } },
                nameParent
            )
        ));
    }

    return tree;
};

var Sidebar = function (_Component) {
    _inherits(Sidebar, _Component);

    function Sidebar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Sidebar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            tree: (0, _directoryTree2.default)('./data')
        }, _this.watcher = _fs2.default.watch('./data', { recursive: true }, function () {
            _this.setState({
                tree: (0, _directoryTree2.default)('./data')
            });
        }), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Sidebar, [{
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'ul',
                    { className: 'list-group' },
                    walkTree(this.state.tree)
                )
            );
        }
    }]);

    return Sidebar;
}(_react.Component);

exports.default = Sidebar;
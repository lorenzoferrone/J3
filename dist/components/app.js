'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reducers = require('./dist/model/reducers');

var _editor = require('./dist/components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _sidebar = require('./dist/components/sidebar3');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _sidebarFile = require('./dist/components/sidebarFile');

var _sidebarFile2 = _interopRequireDefault(_sidebarFile);

var _spotlight = require('./dist/components/spotlight');

var _spotlight2 = _interopRequireDefault(_spotlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = (0, _redux.createStore)(_reducers.appStore);

var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'window' },
                _react2.default.createElement(
                    'div',
                    { className: 'window-content' },
                    _react2.default.createElement(
                        'div',
                        { className: 'pane-group' },
                        _react2.default.createElement(_sidebar2.default, null),
                        _react2.default.createElement(_sidebarFile2.default, null),
                        _react2.default.createElement(
                            'div',
                            { id: 'editorRoot', className: 'pane' },
                            _react2.default.createElement(_editor2.default, { ref: 'editorRoot' })
                        )
                    ),
                    _react2.default.createElement(_spotlight2.default, null)
                )
            );
        }
    }]);

    return App;
}(_react.Component);

(0, _reactDom.render)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(App, null)
), document.getElementById('root'));
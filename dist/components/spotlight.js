'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _actions = require('../model/actions');

var _keys = require('./plugins/utils/keys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var spotlight = function (_Component) {
    _inherits(spotlight, _Component);

    function spotlight(props) {
        _classCallCheck(this, spotlight);

        var _this = _possibleConstructorReturn(this, (spotlight.__proto__ || Object.getPrototypeOf(spotlight)).call(this, props));

        _this.close = function () {
            _this.props._search('');
            _this.setState({ selectedNodeIndex: 0 });
            _this.textInput.value = '';
            _this.props._hide();
        };

        _this.onInput = function (event) {
            if ((0, _keys.keyMap)(event) == 'ESCAPE') {
                _this.close();
            }
            if ((0, _keys.keyMap)(event) == 'DOWN') {
                if (_this.state.selectedNodeIndex < _this.filteredNodes.size - 1) {
                    _this.setState({ selectedNodeIndex: _this.state.selectedNodeIndex + 1 });
                }
            }
            if ((0, _keys.keyMap)(event) == 'UP') {
                if (_this.state.selectedNodeIndex > 0) {
                    _this.setState({ selectedNodeIndex: _this.state.selectedNodeIndex - 1 });
                }
            }
            if ((0, _keys.keyMap)(event) == 'ENTER') {
                var node = _this.filteredNodes.slice(_this.state.selectedNodeIndex).first();
                if (node != undefined) {
                    _this.props._select(node.id);
                    _this.close();
                }

                // console.log('loading:', node)
            }
        };

        _this.__search = function () {
            _this.setState({ selectedNodeIndex: 0 });
            _this.props._search(_this.textInput.value);
            console.log(_this.textInput.value);
            if (_this.textInput.value != '') {
                _this.setState({ showResults: true });
            } else {
                _this.setState({ showResults: false });
            }
        };

        _this.props = props;
        _this.textInput = null;
        _this.state = { selectedNodeIndex: 0, showResults: false };
        return _this;
    }

    _createClass(spotlight, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var hidden = this.props.searchState ? '' : ' hidden';
            var showResultsClass = this.state.showResults ? '' : ' hidden';

            this.filteredNodes = this.props.nodes.filter(function (node) {
                node.name.toLowerCase().indexOf(_this2.props.searchString.toLowerCase()) > -1;
            });

            this.list = this.filteredNodes.map(function (node, key, iter) {
                var index = iter._map.get(key);
                var active = index == _this2.state.selectedNodeIndex ? 'selected' : '';
                var className = 'list-group-item ' + active;
                return _react2.default.createElement(
                    'li',
                    { className: className },
                    node.name
                );
            });

            return _react2.default.createElement(
                'div',
                { onClick: this.close, className: 'sfondo' + hidden },
                _react2.default.createElement(
                    'div',
                    { className: 'mymodal', onClick: function onClick(event) {
                            return event.stopPropagation();
                        } },
                    _react2.default.createElement('input', { type: 'text', id: 'input',
                        ref: function ref(input) {
                            _this2.textInput = input;_this2.textInput && _this2.textInput.focus();
                        },
                        onChange: this.__search,
                        value: this.searchString,
                        onKeyDown: function onKeyDown(event) {
                            return _this2.onInput(event);
                        }
                    }),
                    _react2.default.createElement(
                        'div',
                        { className: 'results' + showResultsClass },
                        _react2.default.createElement(
                            'ul',
                            { className: 'list-group' },
                            this.list
                        )
                    )
                )
            );
        }
    }]);

    return spotlight;
}(_react.Component);

var mapStateToProps = function mapStateToProps(_ref) {
    var data = _ref.data,
        searchState = _ref.searchState,
        searchString = _ref.searchString;

    return {
        nodes: data,
        searchState: searchState,
        searchString: searchString
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        _hide: function _hide() {
            return dispatch((0, _actions.showSearch)(false));
        },
        _search: function _search(string) {
            return dispatch((0, _actions.search)(string));
        },
        _select: function _select(id) {
            return dispatch((0, _actions.selectFile)(id));
        }
    };
};

var Spotlight = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(spotlight);
exports.default = Spotlight;
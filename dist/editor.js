'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _draftJs = require('draft-js');

var _keys = require('./plugins/utils/keys');

var _draftJsPluginsEditor = require('draft-js-plugins-editor');

var _draftJsPluginsEditor2 = _interopRequireDefault(_draftJsPluginsEditor);

var _draftJsMathjaxPlugin = require('draft-js-mathjax-plugin');

var _draftJsMathjaxPlugin2 = _interopRequireDefault(_draftJsMathjaxPlugin);

var _draftJsAutolistPlugin = require('draft-js-autolist-plugin');

var _draftJsAutolistPlugin2 = _interopRequireDefault(_draftJsAutolistPlugin);

var _draftJsInlineToolbarPlugin = require('draft-js-inline-toolbar-plugin');

var _draftJsInlineToolbarPlugin2 = _interopRequireDefault(_draftJsInlineToolbarPlugin);

var _draftJsImagePlugin = require('draft-js-image-plugin');

var _draftJsImagePlugin2 = _interopRequireDefault(_draftJsImagePlugin);

var _draftJsSideToolbarPlugin = require('draft-js-side-toolbar-plugin');

var _draftJsSideToolbarPlugin2 = _interopRequireDefault(_draftJsSideToolbarPlugin);

var _linePlugin = require('./plugins/linePlugin');

var _linePlugin2 = _interopRequireDefault(_linePlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;
// import Editor from 'medium-draft'

var toolbarPlugin = (0, _draftJsSideToolbarPlugin2.default)();

var linePlugin = (0, _linePlugin2.default)();
var imagePlugin = (0, _draftJsImagePlugin2.default)();
var inlineToolbarPlugin = (0, _draftJsInlineToolbarPlugin2.default)();
var InlineToolbar = inlineToolbarPlugin.InlineToolbar;

var autoListPlugin = (0, _draftJsAutolistPlugin2.default)();
var mathjaxPlugin = (0, _draftJsMathjaxPlugin2.default)({});

var plugins = [linePlugin];

var MyEditor = function (_Component) {
    _inherits(MyEditor, _Component);

    function MyEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MyEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MyEditor.__proto__ || Object.getPrototypeOf(MyEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            editorState: _draftJs.EditorState.createEmpty()
        }, _this.onChange = function (editorState) {
            _this.setState({ editorState: editorState });
        }, _this.focus = function () {
            _this.refs.editor.focus();
        }, _this.saveFile = function () {
            var data = JSON.stringify((0, _draftJs.convertToRaw)(_this.state.editorState.getCurrentContent()));
            _fs2.default.writeFile('./data/asd.json', data);
        }, _this.loadFile = function (file) {
            _fs2.default.readFile(file, 'utf8', function (err, data) {
                var content = (0, _draftJs.convertFromRaw)(JSON.parse(data));
                _this.setState({
                    editorState: _draftJs.EditorState.createWithContent(content)
                });
                _this.refs.editor.focus();
            });
        }, _this.keyBindingFn = function (e) {
            if ((0, _keys.keyMap)(e) == 'F' && hasCommandModifier(e)) {
                return 'load-file';
            }
            if ((0, _keys.keyMap)(e) == 'W' && hasCommandModifier(e)) {
                return 'save-file';
            }
            // commentando il return non sovrascrive la key definita nei plugin...
            // penso che anche nei plugin si debba fare la stessa cosa e mettere il return default
            // solo nell'ultimo caricato
            // return getDefaultKeyBinding(e)
        }, _this.handleKeyCommand = function (command) {
            if (command == 'load-file') {
                _this.loadFile('./data/asd.json');
                return 'handled';
            }

            if (command == 'save-file') {
                _this.saveFile();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MyEditor, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_draftJsPluginsEditor2.default, { editorState: this.state.editorState,
                    onChange: this.onChange,
                    plugins: plugins,
                    handleKeyCommand: this.handleKeyCommand,
                    keyBindingFn: this.keyBindingFn,
                    ref: 'editor'
                })
            );
        }
    }]);

    return MyEditor;
}(_react.Component);

exports.default = MyEditor;
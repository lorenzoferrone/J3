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

var _reactRedux = require('react-redux');

var _actions = require('../model/actions');

var _helpers = require('../model/helpers');

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

var _editor_link = require('./editor_link');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier,
    isOptionKeyCommand = _draftJs.KeyBindingUtil.isOptionKeyCommand;

// PLUGINS

var toolbarPlugin = (0, _draftJsSideToolbarPlugin2.default)();

var linePlugin = (0, _linePlugin2.default)();
var imagePlugin = (0, _draftJsImagePlugin2.default)();
var inlineToolbarPlugin = (0, _draftJsInlineToolbarPlugin2.default)();
var InlineToolbar = inlineToolbarPlugin.InlineToolbar;

var autoListPlugin = (0, _draftJsAutolistPlugin2.default)();
var mathjaxPlugin = (0, _draftJsMathjaxPlugin2.default)({});

var plugins = [mathjaxPlugin, autoListPlugin, linePlugin, inlineToolbarPlugin];

// import {getById} from '../model/helpers'


var MyEditor = function (_Component) {
    _inherits(MyEditor, _Component);

    function MyEditor(props) {
        _classCallCheck(this, MyEditor);

        var _this = _possibleConstructorReturn(this, (MyEditor.__proto__ || Object.getPrototypeOf(MyEditor)).call(this, props));

        _this.onChange = function (editorState) {
            _this.setState({ editorState: editorState });
            if (_this.props.selectedFile != 0) {
                _this.saveFile();
            }
        };

        _this.focus = function () {
            _this.refs.editor.focus();
        };

        _this.saveFile = function () {
            var data = (0, _draftJs.convertToRaw)(_this.state.editorState.getCurrentContent());
            _this.props.updateFile(_this.props.selectedFile, data);
        };

        _this._updateTitle = function (event) {
            var title = event.target.value != '' ? event.target.value : 'Untitled';
            _this.props.updateTitle(_this.props.selectedFile, title);
        };

        _this.keyBindingFn = function (e) {
            if ((0, _keys.keyMap)(e) == 'F' && hasCommandModifier(e)) {
                return 'show-search';
            }

            if ((0, _keys.keyMap)(e) == 'BACK_SLASH' && hasCommandModifier(e)) {
                return 'toggle-sidebar';
            }

            if ((0, _keys.keyMap)(e) == 'W' && hasCommandModifier(e)) {
                return 'save-file';
            }

            if ((0, _keys.keyMap)(e) == 'N' && hasCommandModifier(e)) {
                return 'new-file';
            }

            if ((0, _keys.keyMap)(e) == 'N' && isOptionKeyCommand(e)) {
                return 'new-folder';
            }
            // commentando il return non sovrascrive la key definita nei plugin...
            // penso che anche nei plugin si debba fare la stessa cosa e mettere il return default
            // solo nell'ultimo caricato
            // return getDefaultKeyBinding(e)
        };

        _this.handleKeyCommand = function (command) {
            if (command == 'load-file') {
                _this.loadFile('./data/asd.json');
                return 'handled';
            }

            if (command == 'save-file') {
                _this.saveFile();
            }

            if (command == 'new-file') {
                var path = void 0;
                if (_this.props.selectedFolder == 'root') {
                    path = ['root'];
                } else {
                    path = _this.props.data.get(_this.props.selectedFolder).path;
                }
                console.log('selected Folder', _this.props.selectedFolder);
                var action = _this.props._newFile(path);

                _this.props._selectFile(action.id);
                _this.refs.title.focus();
                setTimeout(function () {
                    return _this.refs.title.select();
                }, 100);
            }

            if (command == 'new-folder') {
                var _path = void 0;
                if (_this.props.selectedFolder == 'root') {
                    _path = ['root'];
                } else {
                    _path = _this.props.data.get(_this.props.selectedFolder).path;
                }
                console.log('selected Folder', _this.props.selectedFolder);
                var _action = _this.props._newFolder(_path);
                _this.props._selectFolder(_action.id);

                // this.props._selectFile(action.id)
                // this.refs.title.focus()
                // setTimeout(() => this.refs.title.select(), 100)
            }

            if (command == 'show-search') {
                _this.props._showSearch();
            }

            if (command == 'toggle-sidebar') {
                console.log('toggling');
                var visible = store.getState().sidebarState;
                _this.props._showSidebar(!visible);
            }
        };

        store.subscribe(function () {
            return (0, _helpers.saveOnFile)(store.getState());
        });
        _this.props = props;

        _this.compositeDecorator = new _draftJs.CompositeDecorator([{
            strategy: _editor_link.linkStrategy,
            component: _editor_link.link
        }]);

        try {
            var content = (0, _draftJs.convertFromRaw)(props.data.get(props.selectedFile).content);
            _this.state = {
                editorState: _draftJs.EditorState.createWithContent(content, _this.compositeDecorator)
            };
        } catch (err) {
            console.log(err);
            _this.state = {
                editorState: _draftJs.EditorState.createEmpty(_this.compositeDecorator)
            };
        } finally {
            setTimeout(function () {
                return _this.focus();
            }, 10);
        }
        return _this;
    }

    _createClass(MyEditor, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref) {
            var _this2 = this;

            var selectedFile = _ref.selectedFile,
                data = _ref.data;


            if (selectedFile != this.props.selectedFile) {

                console.log('loading: ', selectedFile);
                try {
                    var content = (0, _draftJs.convertFromRaw)(data.get(selectedFile).content);
                    this.setState({
                        editorState: _draftJs.EditorState.createWithContent(content, this.compositeDecorator)
                    });
                } catch (err) {
                    console.log(err);
                    this.setState({
                        editorState: _draftJs.EditorState.createEmpty(this.compositeDecorator)
                    });
                } finally {
                    setTimeout(function () {
                        return _this2.focus();
                    }, 10);
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            // const title = getById(this.props.data, this.props.selectedFile).model.name
            var title = this.props.data.get(this.props.selectedFile) ? this.props.data.get(this.props.selectedFile).name : 'Untitled';

            return _react2.default.createElement(
                'div',
                { className: 'editorRoot' },
                _react2.default.createElement('input', { className: 'editorTitle',
                    value: title,
                    ref: 'title',
                    onChange: function onChange(event) {
                        return _this3._updateTitle(event);
                    }
                }),
                _react2.default.createElement(
                    'div',
                    { className: 'content', onClick: function onClick() {
                            return _this3.refs.editor.focus();
                        } },
                    _react2.default.createElement(_draftJsPluginsEditor2.default, { editorState: this.state.editorState,
                        onChange: this.onChange,
                        plugins: plugins,
                        handleKeyCommand: this.handleKeyCommand,
                        keyBindingFn: this.keyBindingFn,
                        ref: 'editor'
                    }),
                    _react2.default.createElement(InlineToolbar, null)
                )
            );
        }
    }]);

    return MyEditor;
}(_react.Component);

// --------------- REDUX -----------------

var mapStateToProps = function mapStateToProps(_ref2) {
    var selectedFile = _ref2.selectedFile,
        selectedFolder = _ref2.selectedFolder,
        data = _ref2.data;

    return { selectedFile: selectedFile, selectedFolder: selectedFolder, data: data };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        updateFile: function updateFile(id, content) {
            return dispatch((0, _actions.updateFileContent)(id, content));
        },
        updateTitle: function updateTitle(id, title) {
            return dispatch((0, _actions.updateFileTitle)(id, title));
        },
        _newFile: function _newFile(path) {
            return dispatch((0, _actions.newFile)('Untitled', path));
        },
        _newFolder: function _newFolder(path) {
            return dispatch((0, _actions.newFolder)('new folder', path));
        },
        _selectFile: function _selectFile(id) {
            return dispatch((0, _actions.selectFile)(id));
        },
        _selectFolder: function _selectFolder(id) {
            return dispatch((0, _actions.selectFolder)(id));
        },
        _showSearch: function _showSearch() {
            return dispatch((0, _actions.showSearch)(true));
        },
        _showSidebar: function _showSidebar(bool) {
            return dispatch((0, _actions.showSidebar)(bool));
        }
    };
};

MyEditor = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MyEditor);
exports.default = MyEditor;
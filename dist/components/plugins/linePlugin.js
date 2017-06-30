'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _keys = require('./utils/keys');

var _immutable = require('immutable');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;
// import {render} from 'react-dom'

var LineComponent = function LineComponent() {
    return _react2.default.createElement('hr', null);
};

var createLinePlugin = function createLinePlugin() {

    var keyBindingFn = function keyBindingFn(e) {
        if ((0, _keys.keyMap)(e) == 'S' && hasCommandModifier(e)) {
            return 'add-line';
        }
        return (0, _draftJs.getDefaultKeyBinding)(e);
    };

    var handleBeforeInput = function handleBeforeInput(char, _ref) {
        var getEditorState = _ref.getEditorState,
            setEditorState = _ref.setEditorState;

        var block = (0, _utils.getCurrentBlock)(getEditorState());
        var firstChar = block.text.charAt(0);
        if (firstChar == '-' && char == '-' && block.text.length == 1) {
            setEditorState((0, _utils.insertCustomAtomicBlock)(getEditorState(), 'line'));
            return 'handled';
        }
    };

    var handleKeyCommand = function handleKeyCommand(command, _ref2) {
        var getEditorState = _ref2.getEditorState,
            setEditorState = _ref2.setEditorState;

        if (command == 'add-line') {
            setEditorState((0, _utils.insertCustomAtomicBlock)(getEditorState(), 'line'));
            return 'handled';
        }
        return 'not-handled';
    };

    var blockRendererFn = function blockRendererFn(block, _ref3) {
        var getEditorState = _ref3.getEditorState;


        if ((0, _utils.getBlockEntityType)(block, getEditorState()) == 'line') {
            return { component: LineComponent, editable: false };
        }
        return null;
    };

    return {
        blockRendererFn: blockRendererFn,
        keyBindingFn: keyBindingFn,
        handleKeyCommand: handleKeyCommand,
        handleBeforeInput: handleBeforeInput
    };
};

exports.default = createLinePlugin;
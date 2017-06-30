'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resetBlockWithType = exports.insertCustomAtomicBlock = exports.getBlockEntityType = exports.getCurrentBlock = undefined;

var _draftJs = require('draft-js');

var getCurrentBlock = exports.getCurrentBlock = function getCurrentBlock(editorState) {
    var selectionState = editorState.getSelection();
    var contentState = editorState.getCurrentContent();
    var block = contentState.getBlockForKey(selectionState.getStartKey());
    return block;
};

var getBlockEntityType = exports.getBlockEntityType = function getBlockEntityType(block, editorState) {
    if (block.getType() == 'atomic') {
        var content = editorState.getCurrentContent();
        return content.getEntity(block.getEntityAt(0)).type;
    }
    return null;
};

var insertCustomAtomicBlock = exports.insertCustomAtomicBlock = function insertCustomAtomicBlock(editorState, type) {
    var mutability = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'IMMUTABLE';
    var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var contentStateWithEntity = editorState.getCurrentContent().createEntity(type, mutability, data);
    var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    return _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
};

var resetBlockWithType = exports.resetBlockWithType = function resetBlockWithType(editorState) {
    var newType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unstyled';
    var overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var key = selectionState.getStartKey();
    var blockMap = contentState.getBlockMap();
    var block = blockMap.get(key);
    var newBlock = block.mergeDeep(overrides, {
        type: newType,
        data: {}
    });
    var newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0
        })
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
};
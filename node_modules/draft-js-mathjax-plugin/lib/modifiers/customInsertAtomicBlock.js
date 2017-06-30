'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = customInsertAtomicBlock;

var _draftJs = require('draft-js');

var _immutable = require('immutable');

var _utils = require('./utils');

function customInsertAtomicBlock(editorState, data) {
  var character = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  var afterRemoval = _draftJs.Modifier.removeRange(contentState, selectionState, 'backward');

  var targetSelection = afterRemoval.getSelectionAfter();

  var currentBlockEmpty = (0, _utils.isCurrentBlockEmpty)(afterRemoval, targetSelection);
  var atEndOfBlock = (0, _utils.isAtEndOfBlock)(afterRemoval, targetSelection);
  var atEndOfContent = (0, _utils.isAtEndOfContent)(afterRemoval, targetSelection);

  // Ne pas diviser un bloc vide, sauf s'il est à la fin du contenu
  var afterSplit = !currentBlockEmpty || atEndOfContent ? _draftJs.Modifier.splitBlock(afterRemoval, targetSelection) : afterRemoval;
  var insertionTarget = afterSplit.getSelectionAfter();

  var asAtomicBlock = _draftJs.Modifier.setBlockType(afterSplit, insertionTarget, 'atomic');

  // const charData = CharacterMetadata.create({entity: entityKey})
  var charData = _draftJs.CharacterMetadata.create();

  var fragmentArray = [new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    type: 'atomic',
    text: character,
    characterList: (0, _immutable.List)((0, _immutable.Repeat)(charData, character.length)),
    data: data
  })];

  if (!atEndOfBlock || atEndOfContent) {
    // Pour éviter l'insertion d'un bloc vide inutile dans
    // le cas où le curseur est la fin d'un bloc
    fragmentArray.push(new _draftJs.ContentBlock({
      key: (0, _draftJs.genKey)(),
      type: 'unstyled',
      text: '',
      characterList: (0, _immutable.List)()
    }));
  }

  var fragment = _draftJs.BlockMapBuilder.createFromArray(fragmentArray);

  var withAtomicBlock = _draftJs.Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

  var newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
  });

  return _draftJs.EditorState.push(editorState, newContent, 'insert-fragment');
}
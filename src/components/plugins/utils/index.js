import {AtomicBlockUtils} from 'draft-js';


export const getCurrentBlock = (editorState) => {
      const selectionState = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(selectionState.getStartKey());
      return block;
};

export const getBlockEntityType = (block, editorState) => {
    if (block.getType() == 'atomic'){
        const content = editorState.getCurrentContent()
        return content.getEntity(block.getEntityAt(0)).type
    }
    return null
}


export const insertCustomAtomicBlock = (editorState, type, mutability='IMMUTABLE', data={}) => {
    const contentStateWithEntity = editorState.getCurrentContent().createEntity(
        type,
        mutability,
        data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
}


export const resetBlockWithType = (editorState, newType = 'unstyled', overrides = {}) => {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const key = selectionState.getStartKey();
      const blockMap = contentState.getBlockMap();
      const block = blockMap.get(key);
      const newBlock = block.mergeDeep(overrides, {
          type: newType,
          data: {},
      });
      const newContentState = contentState.merge({
          blockMap: blockMap.set(key, newBlock),
          selectionAfter: selectionState.merge({
              anchorOffset: 0,
              focusOffset: 0,
          }),
      });
      return EditorState.push(editorState, newContentState, 'change-block-type');
};

import React, {Component} from 'react'
// import {render} from 'react-dom'

import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

import {keyMap} from './utils/keys'

import {Map} from 'immutable'

import {getBlockEntityType, insertCustomAtomicBlock, getCurrentBlock} from './utils'


const LineComponent = () => <hr />

const createLinePlugin = () => {

    const keyBindingFn = (e) => {
        if (keyMap(e) == 'S' && hasCommandModifier(e)) {
            return 'add-line'
        }
        return getDefaultKeyBinding(e)
    }

    const handleBeforeInput = (char, {getEditorState, setEditorState}) => {
        const block = getCurrentBlock(getEditorState())
        const firstChar = block.text.charAt(0)
        if (firstChar == '-' && char == '-' && block.text.length == 1){
            setEditorState(insertCustomAtomicBlock(getEditorState(), 'line'))
            return 'handled'
        }

    }

    const handleKeyCommand = (command, {getEditorState, setEditorState}) => {
        if (command == 'add-line') {
            setEditorState(insertCustomAtomicBlock(getEditorState(), 'line'))
            return 'handled'
        }
        return 'not-handled'
    }

    const blockRendererFn = (block, {getEditorState}) => {

        if (getBlockEntityType(block, getEditorState()) == 'line'){
            return {component: LineComponent, editable: false}
        }
        return null
    }

    return {
        blockRendererFn,
        keyBindingFn,
        handleKeyCommand,
        handleBeforeInput
    }
}


export default createLinePlugin

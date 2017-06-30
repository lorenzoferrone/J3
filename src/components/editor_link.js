import React, {Component} from 'react'
import {render} from 'react-dom'

import {connect} from 'react-redux'
import {selectFile, deleteFile, newFile} from '../model/reducers'



// Versione con l'entità

const addLink = (contenState, targetNode) => {

}


// -----------------------------------------

// Versione con il decoratore


const HANDLE_REGEX = /[\w]*::[\w]+/g;

const linkStrategy = (contentBlock, callback, contentState) => {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

const findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
  }
}


const link_ = ({decoratedText, nodes, _clickLink, _clickCreate, children}) => {
    const targetText = decoratedText.slice(decoratedText.indexOf(':') + 2)
    const targetNode = nodes
        .filter(node => node.name.toLowerCase() == targetText.toLowerCase())
        .first()
    const color = targetNode != undefined ? 'blue' : 'red'
    const onClick = (event) => {
        if (event.metaKey) {
            return targetNode != undefined ? _clickLink(targetNode) : _clickCreate(targetText)
        }
    }
    return <span
                style={{color: color}}
                onClick = {onClick}
            >{children}</span>;
}



const mapStateToProps = ({data}) => {
    return {nodes:data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        _clickLink: (node) => dispatch(selectFile(node.id)),
        _clickCreate: (text) => {
            const n = newFile(text)
            dispatch(n)
            setTimeout(dispatch(selectFile(n.id)), 100)
        }
    }
}

const link = connect(mapStateToProps, mapDispatchToProps)(link_)
export {link, linkStrategy}

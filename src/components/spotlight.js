import React, {Component} from 'react'
import {render} from 'react-dom'

import {connect} from 'react-redux'
import {showSearch, search, selectFile} from '../model/actions'

import {keyMap} from './plugins/utils/keys'

class spotlight extends Component {
    constructor(props) {
        super(props)
        this.props = props
        this.textInput = null
        this.state = {selectedNodeIndex: 0, showResults: false}
    }

    close = () => {
        this.props._search('')
        this.setState({selectedNodeIndex: 0})
        this.textInput.value = ''
        this.props._hide()

    }

    onInput = (event) => {
        if (keyMap(event) == 'ESCAPE')  {
            this.close()
        }
        if (keyMap(event) == 'DOWN') {
            if (this.state.selectedNodeIndex < this.filteredNodes.size - 1) {
                this.setState({selectedNodeIndex: (this.state.selectedNodeIndex + 1) })
            }
        }
        if (keyMap(event) == 'UP') {
            if (this.state.selectedNodeIndex > 0) {
                this.setState({selectedNodeIndex: (this.state.selectedNodeIndex - 1) })
            }
        }
        if (keyMap(event) == 'ENTER') {
            const node = this.filteredNodes.slice(this.state.selectedNodeIndex).first()
            if (node != undefined) {
                this.props._select(node.id)
                this.close()
            }

            // console.log('loading:', node)
        }
    }

    __search = () => {
        this.setState({selectedNodeIndex: 0})
        this.props._search(this.textInput.value)
        console.log(this.textInput.value)
        if (this.textInput.value != ''){
            this.setState({showResults: true})
        }
        else {
            this.setState({showResults: false})
        }

    }

    render() {
        const hidden = this.props.searchState? '': ' hidden'
        const showResultsClass = this.state.showResults? '' : ' hidden'

        this.filteredNodes = this.props.nodes
            .filter(node => {
                node.name.toLowerCase().indexOf(this.props.searchString.toLowerCase()) > -1
            })

        this.list = this.filteredNodes
            .map((node, key, iter) => {
                const index = iter._map.get(key)
                const active = index == this.state.selectedNodeIndex ? 'selected' : ''
                const className = 'list-group-item ' + active
                return (
                    <li className = {className}>
                        {node.name}
                    </li>
                )
            }
        )


        return (
            <div onClick={this.close} className={'sfondo' + hidden}>
                <div className='mymodal' onClick={(event) => event.stopPropagation()}>
                    <input type='text' id='input'
                           ref={input => {this.textInput = input; this.textInput && this.textInput.focus()}}
                           onChange={this.__search}
                           value = {this.searchString}
                           onKeyDown={(event) => this.onInput(event)}
                           />

                       <div className={'results' + showResultsClass}>
                         <ul className='list-group'>
                            {this.list}
                        </ul>
                     </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = ({data, searchState, searchString}) => {
    return ({
        nodes: data,
        searchState: searchState,
        searchString: searchString
    })
}

const mapDispatchToProps = (dispatch) => {
    return {
        _hide: () => dispatch(showSearch(false)),
        _search: (string) => dispatch(search(string)),
        _select: (id) => dispatch(selectFile(id))
    }
}

const Spotlight = connect(mapStateToProps, mapDispatchToProps)(spotlight)
export default Spotlight

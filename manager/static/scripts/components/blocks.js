/**
 * Created by surenkov on 10/4/16.
 */
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'

import {
    fetchBlocks,
    fetchBlockTypes,
    createBlock,
    updateBlock,
    removeBlock
} from '../actions/blocks'
import { createBlockForm } from '../utility/blocks'

import Prefetch from './misc/prefetch'
import { Dropdown, Checkbox } from './partial/inputs'

class BlocksComponent extends Prefetch {
    constructor(params) {
        super(params);
        this.state = { loaded: false, newBlock: null };
        this.createBlock = this.createBlock.bind(this);
    }
    prefetchData() {
        Promise.all([
            this.props.loadBlocks(),
            this.props.loadTypes()
        ]).then(() => this.setState({ loaded: true }));
    }
    createBlock(params) {
        this.setState({ newBlock: params });
    }
    hideBlock() {
        this.setState({ newBlock: undefined });
    }
    render() {
        const { blocks, types, onCreate, onUpdate, onRemove } = this.props;
        const { newBlock, loaded } = this.state;
        return (
            loaded ? (
                <div className="ui padded container">
                    <div className="ui centered grid">
                        <div className="twelve wide column">
                            {_.orderBy(blocks, ['ordering', 'id']).map(
                                (block) => (
                                    <Block
                                        key={block.id}
                                        type={types[block.type]}
                                        data={block}
                                        onSave={onUpdate}
                                        onRemove={() => onRemove(block.id)}
                                    />
                                )
                            )}
                            {newBlock &&
                                <Block
                                    type={types[newBlock]}
                                    data={{}}
                                    onSave={(data) => onCreate(data).then((rejected) => !rejected && this.hideBlock())}
                                    onRemove={() => this.hideBlock()}
                                />
                            }
                        </div>
                    </div>
                    {!newBlock && <NewBlockSelect onAdd={this.createBlock} />}
                </div>
            ) : (
                <div className="ui active loader"></div>
            )
        )
    }
}

export const Blocks = connect(
    ({ blocks: { objects, types }}) => ({
        blocks: objects,
        types
    }),
    (dispatch) => ({
        loadBlocks: () => dispatch(fetchBlocks()),
        loadTypes: () => dispatch(fetchBlockTypes()),
        onCreate: (data) => dispatch(createBlock(data)),
        onUpdate: (data) => dispatch(updateBlock(data)),
        onRemove: (id) => dispatch(removeBlock(id))
    })
)(BlocksComponent);

const Block = ({ data, type, onSave, onRemove }) => (
    <div className="ui segment">
        <h3>{type.name}</h3>
        {createBlockForm(data, type, { onSave, onRemove })}
    </div>
);

const NewBlockSelectComponent = ({ types, onAdd }) => (
    <Formsy.Form className="ui form" onChange={({ type }) => onAdd(type)}>
        <div className="ui centered grid">
            <div className="eight wide column">
                <div className="ui segment">
                    <Dropdown name="type" caption="Добавить блок" placeholder="Выберите тип блока из списка">
                        {_.orderBy(types, 'type').map((type, i) =>(
                            <option key={i} value={type.type}>{type.name}</option>
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>
    </Formsy.Form>
);

const NewBlockSelect = connect(
    ({ blocks: { types }}) => ({ types })
)(NewBlockSelectComponent);

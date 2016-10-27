// @flow
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

import { prefetch, Preloader } from './partial/prefetch'
import { Dropdown } from './partial/inputs'

import type { Action } from '../flow/redux'
import type { BlockType } from '../actions/blocks'


type BlockTypeSpec = {
    type: string,
    name: string,
    templates: Array<string>
};

type BlockTypeMap = {
    [t: string]: BlockTypeSpec
};

class BlocksComponent extends React.Component {
    state: { newBlock: ?string };
    props: {
        blocks: Array<BlockType>,
        types: BlockTypeMap,
        onCreate: Action,
        onUpdate: Action,
        onRemove: Action
    };
    createBlock: (type: string) => void;
    saveNewBlock: (data: BlockType) => Promise<any>;
    hideBlock: () => void;

    constructor(params) {
        super(params);

        this.createBlock = (type) => this.setState({ newBlock: type });
        this.saveNewBlock = (data) =>
            this.props.onCreate(data)
                .then((rejected) => !rejected && this.hideBlock());
        this.hideBlock = () => this.setState({ newBlock: null });
        this.state = { newBlock: null };
    }
    render() {
        const { blocks, types, onUpdate, onRemove } = this.props;
        const { newBlock } = this.state;
        return (
            <div className="ui padded container">
                <div className="ui centered grid">
                    <div className="twelve wide column">
                        {_(blocks).orderBy(['ordering', 'id']).map(
                            (block) => (
                                <Block
                                    key={block.id}
                                    type={types[block.type]}
                                    data={block}
                                    onSave={onUpdate}
                                    onRemove={() => onRemove(block.id)}
                                />
                            )
                        ).value()}
                        {newBlock && (
                            <Block
                                type={types[newBlock]}
                                onSave={this.saveNewBlock}
                                onRemove={this.hideBlock}
                            />
                        )}
                    </div>
                </div>
                {!newBlock && <NewBlockSelect onAdd={this.createBlock} />}
            </div>
        )
    }
}

//noinspection JSUnusedGlobalSymbols
export const Blocks = connect(
    ({ blocks: { objects, types }}) => ({
        blocks: objects,
        types
    }),
    (dispatch) => ({
        onLoad: () => Promise.all([
            dispatch(fetchBlocks()),
            dispatch(fetchBlockTypes())
        ]),
        onCreate: (data) => dispatch(createBlock(data)),
        onUpdate: (data) => dispatch(updateBlock(data)),
        onRemove: (id) => dispatch(removeBlock(id))
    })
)(prefetch(BlocksComponent, Preloader));

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
                        {_(types).orderBy('type').map((type, i) =>(
                            <option key={i} value={type.type}>{type.name}</option>
                        )).value()}
                    </Dropdown>
                </div>
            </div>
        </div>
    </Formsy.Form>
);

const NewBlockSelect = connect(
    ({ blocks: { types }}) => ({ types })
)(NewBlockSelectComponent);

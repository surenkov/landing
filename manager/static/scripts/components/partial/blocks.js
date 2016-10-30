// @flow
import _ from 'lodash'
import React from 'react'
import { TextInput, ToggleInput, Dropdown, HiddenInput } from './inputs'

import type { Block, BlockType } from '../../flow/types'

export const BlockButtons = ({ onRemove, onSave = () => true }: { onRemove: () => any, onSave: (data: any) => any}) => (
    <div className="ui right aligned grid">
        <div className="sixteen wide column">
            <div className="ui labeled icon buttons">
                <a onClick={onRemove} className="ui negative button">
                    <i className="trash icon" />
                    Удалить
                </a>
                <button type="submit" onClick={onSave} className="ui positive button">
                    <i className="save icon" />
                    Сохранить
                </button>
            </div>
        </div>
    </div>
);

BlockButtons.propTypes = {
    onSave: React.PropTypes.func,
    onRemove: React.PropTypes.func.isRequired
};

export const BlockDefaults = ({ data = {}, type }: { data: Block, type: BlockType}) => {
    const defaultData = {
        ordering: 0,
        enabled: true,
        template: '',
        ...data
    };

    return (
        <div>
            <h4 className="ui dividing header">Общие параметры</h4>
            <div className="three fields">
                {data.id && <HiddenInput name="id" value={data.id} />}
                <HiddenInput name="type" value={type.type} />
                <Dropdown name="template" value={defaultData.template} caption="Шаблон" placeholder="Выберите шаблон" required>
                    {type.templates.map((template) => (
                        <option key={template} value={template}>{template}</option>
                    ))}
                </Dropdown>
                <TextInput
                    name="ordering"
                    value={defaultData.ordering}
                    type="number"
                    caption="Позиция блока"
                    placeholder="5"
                    required
                />
                <ToggleInput name="enabled" value={defaultData.enabled} caption="Показывать блок"/>
            </div>
        </div>
    );
};

BlockDefaults.propTypes = {
    data: React.PropTypes.object,
    type: React.PropTypes.object
};


export class ListBlock extends React.Component {
    state: { _items: Array<any> };
    getItemsFromProps: (props: any) => Array<any>;

    getItems() {
        return this.state._items;
    }
    constructor(props: any) {
        super(props);
        this.state = { _items: this.getItemsFromProps(props) };
    }
    componentWillReceiveProps(nextProps: any) {
        const nextItems = this.getItemsFromProps(nextProps);
        const shallowEq = _.chain(this.state._items)
            .zip(nextItems)
            .some(([curr, next]) => curr !== next);

        if (!shallowEq)
            this.setState({ _items: nextItems });
    }
    addItem(item: {}) {
        this.setState({ _items: [...this.state._items, item] });
    }
    removeItem(idx: number) {
        const { _items } = this.state;
        this.setState({ _items: [..._items.slice(0, idx), ..._items.slice(idx + 1)] });
    }
}

/**
 * Created by surenkov on 9/9/16.
 */
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults, ListBlock } from 'components/partial/blocks'
import { BlockDropdown, TextInput } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const ItemField = ({ name, value, onRemove }) => (
    <div className="fluid fields">
        <TextInput className="fifteen wide" {...{name, value}} required />
        <a onClick={onRemove} className="ui icon button">
            <i className="remove icon" />
        </a>
    </div>
);

class ListForm extends ListBlock {
    static defaultProps = {
        data: { items: [] }
    };
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this, '');
        this.removeItem = this.removeItem.bind(this);
        this.state = { items: this.props.data.items };
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры списка</h4>
                    <TextInput name="title" value={data.title} caption="Заголовок" placeholder="Текст заголовка" />
                    <div className="ui top attached segment">
                        <div className="field">
                            <label>Элементы списка</label>
                            {this.state.items.map((item, i) => (
                                <ItemField
                                    key={i}
                                    name={`items[${i}]`}
                                    onRemove={() => this.removeItem(i)}
                                    value={item}
                                />
                            ))}
                        </div>
                    </div>
                    <a onClick={this.addItem}
                       className="ui bottom attached icon button">
                        <i className="plus icon" />
                        Добавить элемент списка
                    </a>
                </div>
                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.ListBlock', ListForm);

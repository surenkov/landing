import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults, ListBlock } from 'components/partial/blocks'
import { TextInput, HiddenInput } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const OrderTypeField = ({ name, value, onRemove }) => (
    <div className="fluid fields">
        {value.id && (
            <HiddenInput name={`${name}.id`} value={value.id} />
        )}
        <TextInput className="eight wide"
                   name={`${name}.name`}
                   placeholder="Название платежа"
                   value={value.name}
                   required />

        <TextInput className="seven wide"
                   type="number"
                   min="0"
                   step="0.01"
                   placeholder="Стоимость"
                   name={`${name}.price`}
                   value={value.price}
                   required />

        <a className="ui icon button" onClick={onRemove}>
            <i className="remove icon" />
        </a>
    </div>
);

class KassaForm extends ListBlock {
    static defaultProps = {
        data: {
            order_types: [],
            config: {}
        }
    };

    getItemsFromProps(props) {
        return props.data.order_types;
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;

        const { config } = data;
        const items = this.getItems();
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры платёжной формы</h4>
                    <div className="ui fields">
                        <TextInput name="config.shop_id"
                                   value={config['shop_id']}
                                   caption="Идентификатор магазина"
                                   placeholder="Выдается при подключении к Яндекс.Кассе"
                                   type="number"
                                   className="five wide"
                                   required />

                        <TextInput name="config.sc_id"
                                   value={config['sc_id']}
                                   caption="Идентификатор витрины магазина"
                                   placeholder="Выдается при подключении к Яндекс.Кассе"
                                   type="number"
                                   className="five wide"
                                   required />

                        <TextInput name="config.shop_password"
                                   value={config['shop_password']}
                                   caption="Секретное слово"
                                   placeholder="Выдается при подключении к Яндекс.Кассе"
                                   className="six wide"
                                   required />
                    </div>

                    <h4 className="ui dividing header">Типы платежей</h4>
                    <div className="ui top attached segment">
                        {items.map((item, i) => (
                            <OrderTypeField
                                key={i}
                                name={`order_types[${i}]`}
                                value={item}
                                onRemove={() => this.removeItem(i)}
                            />
                        ))}
                    </div>
                    <a onClick={() => this.addItem({})}
                       className="ui bottom attached icon button">
                        <i className="plus icon" />
                        Добавить тип платежа
                    </a>
                </div>

                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.KassaBlock', KassaForm);

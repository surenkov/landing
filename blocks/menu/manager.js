/**
 * Created by surenkov on 9/9/16.
 */
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults, ListBlock } from 'components/partial/blocks'
import { BlockDropdown, TextInput, ValidInputMixin } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const LinkField = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        onRemove: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            value: {
                caption: ''
            }
        };
    },
    validate() {
        const { caption, block_id} = this.getValue();
        return !!caption && !!block_id;
    },
    render() {
        const { onRemove } = this.props;
        return (
            <Formsy.Form className="field" onChange={this.setValue}>
                <div className={`two${this.getValidClassName(' ', ' error ')}fields`}>
                    <TextInput name="caption" value={this.getValue().caption} />
                    <BlockDropdown name="block_id" value={this.getValue().block_id} required />
                    <a onClick={onRemove} className="ui icon button">
                        <i className="remove icon" />
                    </a>
                </div>
            </Formsy.Form>
        );
    }
});


class MenuForm extends ListBlock {
    static defaultProps = {
        data: { links: [] }
    };
    getItemsFromProps(props) {
        return props.data.links;
    }
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this, {});
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        const items = this.getItems();
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры меню</h4>
                    <TextInput name="title" value={data.title} caption="Текст" placeholder="Текст заголовка" />
                    <div className="ui top attached segment">
                        <div className="field">
                            <label>Ссылки на блоки</label>
                            {items.map((link, i) => (
                                <LinkField
                                    key={i}
                                    name={`links[${i}]`}
                                    onRemove={() => this.removeItem(i)}
                                    value={link}
                                />
                            ))}
                        </div>
                    </div>
                    <a onClick={this.addItem} className="ui bottom attached icon button">
                        <i className="plus icon" />
                        Добавить ссылку
                    </a>
                </div>
                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.MenuBlock', MenuForm);

/**
 * Created by surenkov on 9/9/16.
 */
import _ from 'lodash'
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults } from 'components/partial/blocks'
import { BlockDropdown, TextInput } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const LinkField = React.createClass({
    mixins: [Formsy.Mixin],
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
    render() {
        const { onRemove } = this.props;
        return (
            <Formsy.Form className="field" onChange={this.setValue}>
                <div className="two fields">
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


class MenuForm extends React.Component {
    static defaultProps = {
        data: { links: [] }
    };
    constructor(props) {
        super(props);
        this.addLink = this.addLink.bind(this);
        this.state = {
            links: this.props.data.links
        };
    }
    addLink() {
        this.setState({ links: [ ...this.state.links, {} ]});
    }
    removeLink(link) {
        const links = _.reject(this.state.links, (lnk) => lnk === link);
        this.setState({ links });
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры меню</h4>
                    <TextInput name="title" value={data.title} caption="Текст" placeholder="Текст заголовка" />
                    <div className="ui top attached segment">
                        <div className="field">
                            <label>Ссылки на блоки</label>
                            {this.state.links.map((link, i) => (
                                <LinkField
                                    key={i}
                                    name={`links[${i}]`}
                                    onRemove={() => this.removeLink(link)}
                                    value={link}
                                />
                            ))}
                        </div>
                    </div>
                    <a onClick={this.addLink} className="ui bottom attached icon button">
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

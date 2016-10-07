/**
 * Created by surenkov on 10/5/16.
 */
import _ from 'lodash'
import React from 'react'
import Formsy from 'formsy-react'
import { connect } from 'react-redux'

import 'trumbowyg'
import 'trumbowyg/dist/langs/ru.min.js'
import 'trumbowyg/dist/ui/icons.svg'


const ValidInputMixin = {
    getValidClassName: function(validClass, errorClass) {
        return (!this.isPristine() && !this.isValid() ? errorClass : validClass);
    }
};

export const Checkbox = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        caption: React.PropTypes.string,
    },
    changeValue(e) {
        const value = e.target.checked;
        this.setValue(value);
    },
    render() {
        const { name, caption = '' } = this.props;
        return (
            <div className={'field' + this.getValidClassName('', ' error')}>
                <div className="ui checkbox">
                    <input
                        type="checkbox"
                        name={name}
                        checked={this.getValue()}
                        onChange={this.changeValue}
                    />
                    <label>{caption}</label>
                </div>
            </div>
        );
    }
});

export const RadioGroup = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    changeValue(value) {
        this.setValue(value);
    },
    propTypes: {
        caption: React.PropTypes.string,
        items: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]).isRequired
    },
    render() {
        const { name, caption, items } = this.props;
        const value = this.getValue();
        return (
            <div className={'grouped' + this.getValidClassName(' ', ' error ') + 'fields'}>
                {caption && <label>{caption}</label>}
                {_.map(items, (item, i) => (
                    <div key={i} className="field">
                        <div className="ui radio checkbox">
                            <input
                                type="radio"
                                name={name}
                                onChange={this.changeValue.bind(this, i)}
                                checked={value === i}
                            />
                            <label>{item}</label>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
});

export const ToggleInput = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        caption: React.PropTypes.string,
        description: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            caption: '',
            description: ''
        }
    },
    changeValue(e) {
        const value = e.target.checked;
        this.setValue(value);
    },
    render() {
        const { name, caption, description } = this.props;
        return (
            <div className={'field' + this.getValidClassName('', ' error')}>
                <label>{caption}</label>
                <div className="ui toggle checkbox">
                    <input
                        type="checkbox"
                        name={name}
                        checked={this.getValue()}
                        onChange={this.changeValue}
                    />
                    <label>{description}</label>
                </div>
            </div>
        )
    }
});

export const Dropdown = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        caption: React.PropTypes.string,
        children: React.PropTypes.node.isRequired,
        placeholder: React.PropTypes.string
    },
    changeValue(value) {
        this.setValue(value);
    },
    componentDidMount() {
        $(this.refs.select).dropdown({
            onChange: this.changeValue
        });
    },
    componentDidUpdate() {
        this.componentDidMount();
    },
    render() {
        const { name, children, placeholder, caption } = this.props;
        return (
            <div className={'field' + this.getValidClassName('', ' error')}>
                {caption && <label>{caption}</label>}
                <select ref="select" className="ui selection dropdown" name={name} defaultValue={this.getValue()}>
                    {placeholder && <option value="">{placeholder}</option>}
                    {children}
                </select>
            </div>
        )
    }
});

export const TextInput = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        caption: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        type: React.PropTypes.oneOf([
            'text',
            'email',
            'number',
            'password',
            'date'
        ])
    },
    getDefaultProps() {
        return {
            type: 'text',
            placeholder: ''
        }
    },
    changeValue(e) {
        let value = e.target.value;
        const { type } = this.props;

        if (type == 'number')
            value = +value;
        else if (type == 'date')
            value = new Date(value);

        this.setValue(value);
    },
    render() {
        const { name, type, caption, placeholder, className } = this.props;
        return (
            <div className={(className ? className + ' ': '') + 'field' + this.getValidClassName('', ' error')}>
                {caption && <label>{caption}</label>}
                <input
                    type={type}
                    name={name}
                    value={this.getValue()}
                    placeholder={placeholder}
                    onChange={this.changeValue}
                />
            </div>
        )
    }
});

export const Textarea = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        caption: React.PropTypes.string,
        placeholder: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            placeholder: ''
        }
    },
    changeValue(e) {
        this.setValue(e.target.value);
    },
    render() {
        const { caption, placeholder, name } = this.props;
        return (
            <div className={'field' + this.getValidClassName('', ' error')}>
                {caption && <label>{caption}</label>}
                <textarea
                    name={name}
                    value={this.getValue()}
                    onChange={this.changeValue}
                    placeholder={placeholder}
                />
            </div>
        );
    }
});

export const RichEditTextarea = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    propTypes: {
        placeholder: React.PropTypes.string,
        caption: React.PropTypes.string,
        params: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            placeholder: '',
            value: '',
            params: {}
        }
    },
    changeValue(e) {
        this.setValue(e.target.innerHTML);
    },
    componentDidMount() {
        $(this.refs.trumbowyg).trumbowyg({
            autogrow: true,
            resetCss: true,
            lang: 'ru',
            svgPath: process.env.NODE_ENV == 'development'
                ? 'http://localhost:8080/static/assets/images/icons.svg'
                : '/static/assets/images/icons.svg',
            btns: [
                ['viewHTML'],
                ['formatting'],
                'btnGrp-semantic',
                ['superscript', 'subscript'],
                ['link'],
                ['insertImage'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['removeformat'],
            ],
            ...this.props.params
        }).on('tbwblur', this.changeValue)
            .on('tbwpaste', this.changeValue)
            .trumbowyg('html', this.getValue())
    },
    componentDidUpdate() {
        $(this.refs.trumbowyg).trumbowyg('html', this.getValue());
    },
    render() {
        const { caption, placeholder } = this.props;
        return (
            <div className={'field' + this.getValidClassName('', ' error')}>
                {caption && <label>{caption}</label>}
                <div ref="trumbowyg" placeholder={placeholder} />
            </div>
        );
    }
});

export const HiddenInput = React.createClass({
    mixins: [Formsy.Mixin],
    render() {
        return <input type="hidden" name={this.props.name} value={this.getValue()} />
    }
});


const BlockDropdownComponent = React.createClass({
    render() {
        const { blocks, types, name, value } = this.props;
        return (
            <Dropdown {...{name, value}} placeholder="Выберите блок">
                {_.orderBy(blocks, ['ordering', 'id']).map(
                    (block) => (
                        <option key={block.id} value={block.id}>
                            {types[block.type].name}
                        </option>
                    )
                )}
            </Dropdown>
        );
    }
});

export const BlockDropdown = connect(
    ({ blocks: { objects, types }}) => ({
        blocks: objects,
        types
    })
)(BlockDropdownComponent);


export const MediaInput = React.createClass({
    mixins: [Formsy.Mixin],
    propTypes: {
        icon: React.PropTypes.string,
        caption: React.PropTypes.string,
        onClick: React.PropTypes.func.isRequired,

        value: React.PropTypes.shape({
            id: React.PropTypes.string,
            mime_type: React.PropTypes.any,
            file_url: React.PropTypes.string
        })
    },
    getDefaultProps() {
        return {
            icon: 'remove',
            caption: 'Удалить',
            value: {}
        }
    },
    componentDidMount() {
        $(this.refs.dimmer).dimmer({ closable: false });
    },
    render() {
        const { caption, icon, onClick } = this.props;
        const { file_url } = this.getValue();
        return (
            <div className="image"
                 onMouseEnter={() => $(this.refs.dimmer).dimmer('show')}
                 onMouseLeave={() => $(this.refs.dimmer).dimmer('hide')}
            >
                <img src={file_url} />
                <div ref="dimmer" className="ui dimmer">
                    <div className="content">
                        <div className="center">
                            <a onClick={onClick}
                               className="ui inverted action icon header">
                                <i className={`${icon} icon`} />
                                {caption}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});



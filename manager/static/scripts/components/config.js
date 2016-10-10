/**
 * Created by surenkov on 10/10/16.
 */
import React from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'

import { fetchConfig, updateConfig } from '../actions/config'
import { ListBlock } from './partial/blocks'
import { TextInput, RichEditTextarea, ValidInputMixin } from './partial/inputs'
import Prefetch from './misc/prefetch'


const MetaTag = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    getDefaultProps() {
        return {
            value: {
                name: '',
                content: ''
            }
        };
    },
    validate() {
        const { name, content } = this.getValue();
        return !!name && !!content;
    },
    render() {
        const { onRemove } = this.props;
        return (
            <Formsy.Form className="field" onChange={this.setValue}>
                <div className={`two${this.getValidClassName(' ', ' error ')}fields`}>
                    <TextInput name="name" placeholder="name" value={this.getValue().name} />
                    <TextInput name="content" placeholder="content" value={this.getValue().content} />
                    <a onClick={onRemove} className="ui icon button">
                        <i className="remove icon" />
                    </a>
                </div>
            </Formsy.Form>
        );
    }
});

class MetaTags extends ListBlock {
    static defaultProps = { meta: [] };
    getItemsFromProps(props) {
        return props.meta;
    }
    render() {
        const items = this.getItems();
        return (
            <div className="field">
                <h4 className="ui dividing header">Мета-тэги</h4>
                <div className="ui top attached segment">
                    {items.map((meta, i) => (
                        <MetaTag
                            key={i}
                            name={`meta[${i}]`}
                            value={meta}
                            onRemove={() => this.removeItem(i)}
                        />
                    ))}
                </div>
                <a onClick={() => this.addItem({})}
                   className="ui bottom attached icon button">
                    <i className="plus icon" />
                    Добавить мета-тэг
                </a>
            </div>
        )
    }
}

const ConfigForm = ({ onSave, meta, title, footer_text }) => (
    <Formsy.Form className="ui form" onValidSubmit={onSave}>
        <TextInput name="title" value={title} caption="Заголовок" placeholder="Заголовок лэндинга" />
        <RichEditTextarea name="footer_text" value={footer_text} caption="Текст футера" placeholder="Название компании" />
        <MetaTags meta={meta} />
        <div className="ui right aligned grid">
            <div className="sixteen wide column">
                <button type="submit" className="ui positive labeled icon button">
                    <i className="save icon" />
                    Сохранить
                </button>
            </div>
        </div>
    </Formsy.Form>
);

class ConfigPageComponent extends Prefetch {
    preload() {
        return this.props.loadConfig();
    }
    render() {
        const { config, updateConfig } = this.props;
        const loaded = this.isLoaded();
        return (
            loaded ? (
                <div className="ui padded container">
                    <div className="ui centered grid">
                        <div className="twelve wide column">
                            <div className="ui segment">
                                <h3>Параметры лэндинга</h3>
                                <ConfigForm {...config} onSave={updateConfig} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="ui active loader" />
            )
        );
    }
}

export const ConfigPage = connect(
    ({ config }) => ({ config }),
    (dispatch) => ({
        loadConfig: () => dispatch(fetchConfig()),
        updateConfig: (config) => dispatch(updateConfig(config))
    })
)(ConfigPageComponent);


/**
 * Created by surenkov on 9/9/16.
 */
import React from 'react'
import Formsy from 'formsy-react'

import {
    fetchMedia,
    uploadMedia,
    deleteMedia
} from 'actions/media'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults, ListBlock } from 'components/partial/blocks'
import { TextInput, MediaInput } from 'components/partial/inputs'
import { MediaAddButton } from 'components/media'


class MediaForm extends ListBlock {
    static defaultProps = {
        data: { items: [] }
    };
    getItemsFromProps(props) {
        return props.data.items;
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        const items = this.getItems();
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры списка</h4>
                    <TextInput name="title" value={data.title} caption="Текст" placeholder="Текст заголовка" />
                    <div className="ui top attached segment">
                        <div className="field">
                            <label>Элементы списка</label>
                        </div>
                        <div className="ui four cards">
                            {items.map((item, i) => (
                                <div key={i} className="card">
                                    <MediaInput
                                        name={`items[${i}].media`}
                                        onClick={() => this.removeItem(i)}
                                        value={item.media}
                                    />
                                    <div className="extra content">
                                        <TextInput
                                            name={`items[${i}].caption`}
                                            value={item.caption}
                                            placeholder="Текст элемента"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <MediaAddButton
                        className="ui bottom attached icon button"
                        onSelect={(media) => this.addItem({ media, caption: '' })}
                    >
                        <i className="add icon" />
                        Добавить элемент списка
                    </MediaAddButton>
                </div>
                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.MediaListBlock', MediaForm);

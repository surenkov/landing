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
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.state = { items: props.data.items };
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        const { items } = this.state;
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры меню</h4>
                    <TextInput name="title" value={data.title} caption="Текст" placeholder="Текст заголовка" />
                    <div className="ui segment">
                        <div className="field">
                            <label>Элементы списка</label>
                            <div className="ui three cards">
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
                            <br />
                            <MediaAddButton onSelect={(media) =>
                                this.addItem({ media, caption: '' })
                            } />
                        </div>
                    </div>
                </div>
                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.MediaListBlock', MediaForm);

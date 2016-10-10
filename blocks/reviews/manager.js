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
import { TextInput, Textarea, MediaSelectInput } from 'components/partial/inputs'


const Review = ({ index, item, onRemove }) => (
    <div className="item">
        <MediaSelectInput name={`reviews[${index}].picture`} value={item.picture} />
        <div className="content">
            <div className="description">
                <div className="ui form">
                    <div className="fluid fields">
                        <TextInput
                            className="fifteen wide"
                            value={item.name}
                            name={`reviews[${index}].name`}
                            placeholder="Имя клиента"
                        />
                        <a onClick={onRemove} className="ui negative basic icon button">
                            <i className="trash icon" />
                        </a>
                    </div>
                    <Textarea
                        style={{ minHeight: '5em', height: '5em'}}
                        value={item.review}
                        name={`reviews[${index}].review`}
                        placeholder="Отзыв"
                    />
                </div>
            </div>
        </div>
    </div>
);

class ReviewsForm extends ListBlock {
    static defaultProps = {
        data: { reviews: [] }
    };
    getItemsFromProps(props) {
        return props.data.reviews;
    }
    render() {
        const { data, type, onSave, onRemove } = this.props;
        const items = this.getItems();
        return (
            <Formsy.Form className="ui form" onValidSubmit={onSave}>
                <BlockDefaults data={data} type={type} />
                <div>
                    <h4 className="ui dividing header">Параметры отзывов</h4>
                    <TextInput name="title" value={data.title} caption="Заголовок" placeholder="Текст заголовка" />
                    <div className="ui top attached segment">
                        <div className="field">
                            <label>Список отзывов</label>
                        </div>
                        <div className="ui divided items">
                            {items.map((item, i) => (
                                <Review
                                    key={i}
                                    index={i}
                                    item={item}
                                    onRemove={() => this.removeItem(i)}
                                />
                            ))}
                        </div>
                    </div>
                    <a onClick={() => this.addItem({ name: '', review: '' })}
                       className="ui bottom attached icon button">
                        <i className="plus icon" />
                        Добавит отзыв
                    </a>
                </div>
                <br />
                <BlockButtons onRemove={onRemove} />
            </Formsy.Form>
        )
    }
}

registerBlock('Block.ReviewsBlock', ReviewsForm);

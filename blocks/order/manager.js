/**
 * Created by surenkov on 10/9/16.
 */
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults } from 'components/partial/blocks'
import { TextInput, RichEditTextarea } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const OrderBlockForm = ({ data = {}, type, onSave, onRemove }) => (
    <Formsy.Form className="ui form" onValidSubmit={onSave}>
        <BlockDefaults data={data} type={type} />
        <h4 className="ui dividing header">Параметры формы</h4>
        <div className="two fields">
            <TextInput
                name="email_from"
                type="email"
                value={data.email_from}
                caption="Email отправителя"
                placeholder="norelpy@example.com"
                required
            />
            <TextInput
                name="email_to"
                type="email"
                value={data.email_to}
                caption="Email получателя"
                placeholder="john.doe@example.com"
                required
            />
        </div>
        <TextInput
            name="subject"
            value={data.subject}
            caption="Заголовок письма"
            placeholder="Новая заявка"
            required
        />
        <RichEditTextarea
            name="body"
            value={data.body}
            caption="Текст письма"
            placeholder="Текст сообщения..."
        />
        <br />
        <BlockButtons onRemove={onRemove} />
    </Formsy.Form>
);

registerBlock('Block.OrderBlock', OrderBlockForm);

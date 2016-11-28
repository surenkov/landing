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
        <h5 className="ui dividing header">Надписи</h5>
        <TextInput
            name="title"
            type="text"
            value={data.title}
            caption="Заголовок"
            placeholder="Заголовок блока"
        />
        <div className="three fields">
            <TextInput
                name="success_message"
                type="text"
                value={data.success_message}
                caption="Сообщение об успешной отправке"
                placeholder="Сообщение успешно отправлено"
            />
            <TextInput
                name="fail_message"
                type="text"
                value={data.fail_message}
                caption="Сообщение о неудачной отправке"
                placeholder="Не удалось отправить сообщение"
            />
            <TextInput
                name="button_text"
                type="text"
                value={data.button_text}
                caption="Надпись на кнопке"
                placeholder="Отправить сообщение"
            />
        </div>
        <h5 className="ui dividing header">Параметры письма</h5>
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

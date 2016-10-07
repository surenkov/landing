/**
 * Created by surenkov on 9/9/16.
 */
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults } from 'components/partial/blocks'
import { RichEditTextarea, TextInput } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const TextForm = ({ data = {}, type, onSave, onRemove }) => (
    <Formsy.Form className="ui form" onValidSubmit={onSave}>
        <BlockDefaults data={data} type={type} />
        <h4 className="ui dividing header">Описание</h4>
        <TextInput name="title" value={data.title} caption="Заголовок" placeholder="Текст заголовка" />
        <RichEditTextarea name="text" value={data.text} caption="Описание" placeholder="Текст описания" />
        <br />
        <BlockButtons onRemove={onRemove} />
    </Formsy.Form>
);

registerBlock('Block.TextBlock', TextForm);

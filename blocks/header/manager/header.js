/**
 * Created by surenkov on 9/9/16.
 */
import React from 'react'
import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults } from 'components/partial/blocks'
import { RichEditTextarea } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const HeaderForm = ({ data, type, onSave, onRemove }) => (
    <Formsy.Form className="ui form" onValidSubmit={onSave}>
        <BlockDefaults data={data} type={type} />
        <div>
            <h4 className="ui dividing header">Параметры шапки</h4>
            <RichEditTextarea name="title" caption="Заголовок" placeholder="Текст заголовка" />
        </div>
        <BlockButtons onRemove={onRemove} />
    </Formsy.Form>
);

registerBlock('Block.HeaderBlock', HeaderForm);

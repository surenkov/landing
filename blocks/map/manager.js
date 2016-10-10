/**
 * Created by surenkov on 10/9/16.
 */
import React from 'react'

import { registerBlock } from 'utility/blocks'
import { BlockButtons, BlockDefaults } from 'components/partial/blocks'
import { TextInput } from 'components/partial/inputs'
import Formsy from 'formsy-react'


const MapForm = ({ data = {pos: {}, opt: {}, org: {}}, type, onSave, onRemove }) => (
    <Formsy.Form className="ui form" onValidSubmit={onSave}>
        <BlockDefaults data={data} type={type} />

        <h4 className="ui dividing header">Координаты</h4>
        <div className="three fields">
            <TextInput
                type="number"
                name="pos.lat"
                value={data.pos.lat}
                caption="Широта"
                placeholder="52.12"
                step="0.00000000000001"
                min="-90" max="90"
            />
            <TextInput
                type="number"
                name="pos.lon"
                value={data.pos.lon}
                caption="Долгота"
                placeholder="143.28"
                step="0.00000000000001"
                min="-180" max="180"
            />
            <TextInput
                type="number"
                name="pos.zoom"
                value={data.pos.zoom}
                caption="Приближение"
                placeholder="1-18"
                min="1" max="18"
            />
        </div>


        <h4 className="ui dividing header">Организация</h4>
        <div className="two fields">
            <TextInput
                name="opt.city"
                value={data.opt.city}
                caption="Город (http://2gis.ru/<имя_города>)"
                placeholder="vladivostok"
            />
            <TextInput
                name="org.id"
                value={data.org.id}
                caption="ID организации в 2GIS"
                placeholder="70000000123456789"
            />
        </div>
        <br />
        <BlockButtons onRemove={onRemove} />
    </Formsy.Form>
);

registerBlock('Block.MapBlock', MapForm);

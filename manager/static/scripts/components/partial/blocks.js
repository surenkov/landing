/**
 * Created by surenkov on 10/5/16.
 */
import React from 'react'
import { TextInput, ToggleInput, Dropdown, HiddenInput } from './inputs'

export const BlockButtons = ({ onRemove }) => (
    <div className="ui right aligned grid">
        <div className="sixteen wide column">
            <div className="ui buttons">
                <a onClick={onRemove} className="ui negative icon button">
                    <i className="trash icon" />
                </a>
                <button type="submit" className="ui positive icon button">
                    <i className="save icon" />
                </button>
            </div>
        </div>
    </div>
);

export const BlockDefaults = ({ data = {}, type }) => {
    const defaultData = {
        ordering: 0,
        enabled: true,
        template: 'default',
        ...data
    };

    return (
        <div>
            <h4 className="ui dividing header">Общие параметры</h4>
            <div className="three fields">
                {data.id && <HiddenInput name="id" value={data.id} />}
                <HiddenInput name="type" value={type.type} />

                <Dropdown name="template" value={defaultData.template} caption="Шаблон" placeholder="Выберите шаблон" required>
                    {type.templates.map((template) => (
                        <option key={template} value={template}>{template}</option>
                    ))}
                </Dropdown>
                <TextInput
                    name="ordering"
                    value={defaultData.ordering}
                    type="number"
                    caption="Позиция блока"
                    placeholder="5"
                    required
                />
                <ToggleInput name="enabled" value={defaultData.enabled} caption="Показывать блок"/>
            </div>
        </div>
    );
};

BlockDefaults.propTypes = {
    data: React.PropTypes.object,
    type: React.PropTypes.object
};

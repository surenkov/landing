// @flow
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'

import { fetchUsers, createUser, updateUser, removeUser } from '../actions/users'
import { BlockButtons } from './partial/blocks'
import {
    TextInput,
    HiddenInput,
    ValidInputMixin,
    Dropdown
} from './partial/inputs'
import { prefetch, Preloader } from './partial/prefetch'

import type { Action } from '../flow/redux'
import type { User } from '../flow/types'


class UsersViewComponent extends React.Component {
    props: {
        createUser: Action,
        updateUser: Action,
        removeUser: Action,
        users: Array<User>
    };
    state: { newUser: boolean };
    createUser: (user: User) => void;

    constructor(props) {
        super(props);
        this.state = { newUser: false };

        this.createUser = (user) => {
            const { createUser } = this.props;
            createUser(user).then(() => this.setState({ newUser: false }));
        };
    }
    render() {
        const { users, updateUser, removeUser } = this.props;
        const { newUser } = this.state;

        return (
            <div className="ui padded container">
                <div className="ui centered grid">
                    <div className="twelve wide column">
                        {_(users).orderBy('id').map(
                            (user) => (
                                <UserComponent
                                    key={user.id}
                                    user={user}
                                    onSave={updateUser}
                                    onRemove={() => removeUser(user.id)}
                                />
                            )
                        ).value()}
                        {newUser && (
                            <UserComponent
                                onSave={this.createUser}
                                onRemove={() => this.setState({ newUser: false })}
                            />
                        )}
                    </div>
                    {!newUser && (
                        <div className="sixteen wide center aligned column">
                            <AddUserButton onClick={() => this.setState({ newUser: true })} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

//noinspection JSUnusedGlobalSymbols
export const UsersPage = connect(
    ({ users }) => ({ users }),
    (dispatch) => ({
        onLoad: () => dispatch(fetchUsers()),
        createUser: (data) => dispatch(createUser(data)),
        updateUser: (data) => dispatch(updateUser(data)),
        removeUser: (id) => dispatch(removeUser(id))
    })
)(prefetch(UsersViewComponent, Preloader));

const AddUserButton = ({ onClick }) => (
     <a onClick={onClick} className="ui large primary labeled icon button">
         <i className="plus icon" />
         Добавить пользователя
     </a>
);

const UserComponent = ({ user = {}, onSave, onRemove }: { user?: User, onRemove: Action }) => (
    <div className="ui segment">
        <Formsy.Form className="ui form" onValidSubmit={onSave}>
            {user.id && <HiddenInput name="id" value={user.id} />}
            <h4 className="ui dividing header">Данные пользователя</h4>
            <div className="two fields">
                <TextInput name="name" value={user.name} caption="Имя пользователя" placeholder="Василий" required />
                <TextInput name="email" type="email" caption="Email" placeholder="user@example.com" value={user.email} required />
            </div>
            <h4 className="ui dividing header">Безопасность</h4>
            <Dropdown name="role" value={user.role} caption="Роль" placeholder="Выберите роль" required>
                <option value="manager">Менеджер</option>
                <option value="admin">Администратор</option>
            </Dropdown>
            <DoublePasswordInput name="password" required />
            <BlockButtons onRemove={onRemove} />
        </Formsy.Form>
    </div>
);

const DoublePasswordInput = React.createClass({
    mixins: [Formsy.Mixin, ValidInputMixin],
    getInitialState() {
        return { retype: '' };
    },
    validate() {
        return this.getValue() == this.state.retype;
    },
    changeValue({ target: { value }}) {
        this.setValue(value);
    },
    changeRetype({ target: { value: retype }}) {
        this.setState({ retype });
        this.setValue(this.getValue());
    },
    render() {
        return (
            <div className={`two${this.getValidClassName(' ', ' error ')}fields`}>
                <div className="field">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Пароль"
                        onChange={this.changeValue}
                    />
                </div>
                <div className="field">
                    <label>Повторите пароль</label>
                    <input
                        type="password"
                        placeholder="Пароль"
                        onChange={this.changeRetype}
                    />
                </div>
            </div>
        );
    }
});

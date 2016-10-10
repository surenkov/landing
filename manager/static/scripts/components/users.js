/**
 * Created by surenkov on 10/10/16.
 */
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
import Prefetch from './misc/prefetch'


class UsersPageComponent extends Prefetch {
    constructor(props) {
        super(props);
        this.createUser = this.createUser.bind(this);
        this.state = { ...super.state, newUser: false };
    }
    preload() {
        return this.props.loadUsers();
    }
    createUser(user) {
        const { createUser } = this.props;
        this.props.createUser(user).then(() => this.setState({ newUser: false }));
    }
    render() {
        const loaded = this.isLoaded();
        const { users, updateUser, removeUser } = this.props;
        const { newUser } = this.state;

        return (
            loaded ? (
                <div className="ui padded container">
                    <div className="ui centered grid">
                        <div className="twelve wide column">
                            {_.orderBy(users, 'id').map(
                                (user) => (
                                    <User
                                        user={user}
                                        onSave={updateUser}
                                        onRemove={() => removeUser(user.id)}
                                    />
                                )
                            )}
                            {newUser && (
                                <User
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
            ) : (
                <div className="ui active loader" />
            )
        )
    }
}

export const UsersPage = connect(
    ({ users }) => ({ users }),
    (dispatch) => ({
        loadUsers: () => dispatch(fetchUsers()),
        createUser: (data) => dispatch(createUser(data)),
        updateUser: (data) => dispatch(updateUser(data)),
        removeUser: (id) => dispatch(removeUser(id))
    })
)(UsersPageComponent);

const AddUserButton = ({ onClick }) => (
     <a onClick={onClick} className="ui large primary labeled icon button">
         <i className="plus icon" />
         Добавить пользователя
     </a>
);

const User = ({ user = {}, onSave, onRemove }) => (
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

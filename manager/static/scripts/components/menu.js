// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { logOutUser } from '../actions/auth'
import { RolesAllowed } from './auth'

import type { Action } from '../flow/redux'
import type { User } from '../actions/users'

const MenuComponent = ({ user, onLogout }: { user: User, onLogout: Action }) => (
    <div className="ui top fixed stackable menu">
        <div className="header item">
            Панель управления
        </div>

        <Link className="item" to='/blocks'>Блоки</Link>
        <Link className="item" to='/media'>Медиа</Link>
        <Link className="item" to="/config">Параметры</Link>

        <RolesAllowed roles={['admin']}>
            <Link className="item" to="/users">Пользователи</Link>
        </RolesAllowed>
        <a className="item" href="/" target="_blank">Перейти к сайту</a>

        <div className="ui right simple dropdown item">
            <strong>{user.name}</strong>
            <i className="dropdown icon" />
            <div className="menu">
                <a className="red item" onClick={onLogout}>Выход</a>
            </div>
        </div>
    </div>
);

export const Menu = connect(
    ({ auth }) => ({ user: auth.credentials }),
    { onLogout: logOutUser }
)(MenuComponent);

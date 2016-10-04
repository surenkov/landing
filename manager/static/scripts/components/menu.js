/**
 * Created by surenkov on 10/3/16.
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { logOutUser } from '../actions/auth'
import { RolesAllowed } from './auth'

const MenuComponent = ({ user, onLogout }) => (
    <div className="ui top fixed stackable menu">
        <div className="header item">
            Панель управления
        </div>

        <Link className="item" to='/blocks'>Блоки</Link>
        <RolesAllowed roles={['admin']}>
            <Link className="item" to="/config">Параметры</Link>
        </RolesAllowed>
        <RolesAllowed roles={['admin']}>
            <Link className="item" to="/users">Пользователи</Link>
        </RolesAllowed>
        <a className="item" href="/" target="_blank">Перейти к сайту</a>

        <div className="ui right simple dropdown item">
            {user.name}
            <i className="dropdown icon" />
            <div className="menu">
                <a className="item">Настройки</a>
                <a className="red item" onClick={onLogout}>Выход</a>
            </div>
        </div>
    </div>
);

export const Menu = connect(
    ({ auth }) => ({ user: auth.credentials }),
    { onLogout: logOutUser }
)(MenuComponent);

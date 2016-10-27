// @flow
import React from 'react'
import Formsy from 'formsy-react'

import { connect } from 'react-redux'
import { logInUser } from '../actions/auth'
import { isUserLoggedIn } from '../utility/auth'

import { TextInput } from './partial/inputs'


const AuthForm = ({ onSubmit }) => (
    <div className="full page container">
        <Formsy.Form className="ui form" onValidSubmit={onSubmit}>
            <div className="ui login card">
                <div className="content">
                    <div className="header">Панель управления</div>
                </div>
                <div className="content">
                    <TextInput name="email" type="email" placeholder="user@example.com" validations="isEmail" />
                    <TextInput name="password" type="password" placeholder="Пароль" required />
                </div>
                <div className="right aligned content">
                    <button className="ui primary button" type="submit">Войти</button>
                </div>
            </div>
        </Formsy.Form>
    </div>
);

//noinspection JSUnusedGlobalSymbols
export const Auth = connect(
    null,
    (dispatch) => ({
        onSubmit: (credentials) => dispatch(logInUser(credentials))
    })
)(AuthForm);


const RolesAllowedComponent = ({
    roles = ['manager', 'admin'],
    role,
    children
}) => (
    roles.findIndex((r) => r == role) != -1
        ? <span>{children}</span>
        : null
);

export const RolesAllowed = connect(
    ({ auth: {credentials: {role}}}) => ({ role })
)(RolesAllowedComponent);

RolesAllowed.propTypes = {
    children: React.PropTypes.node,
    roles: React.PropTypes.array
};


const EnsureAuthenticationComponent = ({ children, isLoggedIn }) => (
    isLoggedIn
        ? <span>{children}</span>
        : null
);

export const EnsureAuthenticated = connect(
    (state) => ({ isLoggedIn: isUserLoggedIn(state) })
)(EnsureAuthenticationComponent);

EnsureAuthenticated.propTypes = {
    children: React.PropTypes.node
};


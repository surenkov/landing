/**
 * Created by surenkov on 10/3/16.
 */
import React from 'react'
import Form from 'react-formal'
import yup from 'yup'

import { connect } from 'react-redux'
import { logInUser } from '../actions/auth'
import { isUserLoggedIn } from '../utility/auth'


const authFormSchema = yup.object({
    email: yup.string('')
        .default('')
        .required('Email не может быть пустым'),
    password: yup.string('')
        .default('')
        .required('Пароль не может быть пустым')
});

const AuthForm = ({ onSubmit }) => (
    <div className="full page container">
        <Form
            className="ui form"
            schema={authFormSchema}
            onSubmit={onSubmit}
            onInvalidSubmit={console.log}
        >
            <div className="ui login card">
                <div className="content">
                    <div className="header">Панель управления</div>
                </div>
                <div className="content">
                    <Form.Summary className="error" />
                    <div className="field">
                        <Form.Field name="email" placeholder="user@example.com" errorClass="error" />
                    </div>
                    <div className="field">
                        <Form.Field name="password" type="password" placeholder="Пароль" errorClass="error" />
                    </div>
                </div>
                <div className="extra right aligned content">
                    <Form.Button className="ui primary button" type="submit">
                        Войти
                    </Form.Button>
                </div>
            </div>
        </Form>
    </div>
);

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


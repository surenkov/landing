// @flow
import React from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { removeNotification } from '../actions/notifications'
import type { NotificationSpec } from '../actions/notifications'
import type { Action } from '../flow/redux'


const NotificationsList = ({
    notifications,
    onRemove
}: {
    notifications: Array<NotificationSpec>,
    onRemove: Action
}) => (
    <div id="notifications">
        <ReactCSSTransitionGroup
            transitionName='fade-in-out'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
        >
            {notifications.map((n) => (
                <NotificationComponent
                    key={n.id}
                    data={n.notify}
                    onRemove={() => onRemove(n.id)}
                />
            ))}
        </ReactCSSTransitionGroup>
    </div>
);

const NotificationComponent = ({ data, onRemove }) => (
    <div className={`ui ${data.type} message`}>
        <i className="close icon" onClick={onRemove} />
        {data.title && <div className="header">{data.title}</div>}
        {data.message && <p>{data.message}</p>}
    </div>
);

export const Notifications = connect(
    (state) => ({ notifications: state.notifications }),
    (dispatch) =>({ onRemove: (id) => dispatch(removeNotification(id)) })
)(NotificationsList);

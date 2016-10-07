/**
 * Created by surenkov on 10/6/16.
 */
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import {
    fetchMedia,
    uploadMedia,
    deleteMedia
} from '../actions/media'
import Prefetch from './misc/prefetch'


class MediaUploadButton extends React.Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.uploadClick = this.uploadClick.bind(this);
    }
    uploadClick() {
        const { onClick } = this.props;
        $('<input />', {
            type: 'file',
            on: {
                change: function(e) {
                    onClick(e.target.files[0])
                }
            }
        }).click();
    }
    render() {
        return (
            <a onClick={this.uploadClick} className="big ui top attached button">
                <i className="plus icon" />
                Загрузить
            </a>
        )
    }
}

class MediaPageView extends Prefetch {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }
    prefetchData() {
        this.props.loadMedia()
            .then(() => this.setState({ loaded: true }));
    }
    render() {
        const { media, onUpload, onRemove } = this.props;
        return this.state.loaded ? (
            <div className="ui padded container">
                <div className="ui centered grid">
                    <div className="twelve wide column">
                        <MediaUploadButton onClick={onUpload} />
                        <div className="ui bottom attached segment">
                            <div className="ui four cards">
                                {_.orderBy(media, 'id', 'desc').map((data) => (
                                    <Media
                                        key={data.id}
                                        data={data}
                                        onRemove={() => onRemove(data.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ): (
            <div className="ui active loader"></div>
        );
    }
}

export const MediaPage = connect(
    ({ media }) => ({ media }),
    (dispatch) => ({
        loadMedia: () => dispatch(fetchMedia()),
        onUpload: (file) => dispatch(uploadMedia(file)),
        onRemove: (id) => dispatch(deleteMedia(id))
    })
)(MediaPageView);


const Media = ({ data, onRemove }) => {
    let dimmer, modal;
    return (
        <div
            className="ui media card"
            onMouseEnter={() => $(dimmer).dimmer('show')}
            onMouseLeave={() => $(dimmer).dimmer('hide')}>
            <div className="ui image">
                <img src={data.file_url} />
            </div>
            <div ref={(node) => {
                dimmer = node;
                $(dimmer).dimmer({ closable: false })
            }} className="ui dimmer">
                <div className="content">
                    <div className="center">
                        <h4 onClick={() => $(modal).modal({}).modal('show')} className="ui inverted action icon header">
                            <i className="photo icon" />
                            Открыть
                        </h4>
                        <h4 onClick={onRemove} className="ui inverted action icon header">
                            <i className="trash icon" />
                            Удалить
                        </h4>
                    </div>
                </div>
            </div>
            <div className="hidden">
                <div className="ui modal" ref={(node) => modal = node}>
                    <div className="image content">
                        <img className="image" src={data.file_url} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const SimpleMedia = ({ file, onClick }) => (
    <a className="card" onClick={onClick}>
        <div className="image">
            <img src={file} />
        </div>
    </a>
);

class MediaAddButtonComponent extends Prefetch {
    static propTypes = {
        onSelect: React.PropTypes.func,
    };
    static defaultProps = {
        onSelect: () => {},
    };
    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.state = { loaded: false };
    }
    prefetchData() {
        this.props.loadMedia().then(() => this.setState({ loaded: true }));
    }
    selectImage(media) {
        this.props.onSelect(media);
        $(this.refs.modal).modal('hide');
    }
    showModal() {
        $(this.refs.modal).modal('show');
    }
    render() {
        const { media } = this.props;
        return this.state.loaded ? (
            <div>
                <a onClick={this.showModal} className="ui action icon button">
                    <i className={"plus icon"} />
                </a>
                <div className="hidden">
                    <div ref="modal" className="ui modal">
                        <div className="header">
                            Выберите изображение
                        </div>
                        <div className="content">
                            <div className="ui four cards">
                                {_.orderBy(media, 'id', 'desc').map((m) => (
                                    <SimpleMedia
                                        key={m.id}
                                        file={m.file_url}
                                        onClick={() => this.selectImage(m)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="ui disabled loading button">Loading</div>
        );
    }
}

export const MediaAddButton = connect(
    ({ media }) => ({ media }),
    (dispatch) => ({
        loadMedia: () => dispatch(fetchMedia())
    })
)(MediaAddButtonComponent);

MediaAddButton.propTypes = MediaAddButtonComponent.propTypes;

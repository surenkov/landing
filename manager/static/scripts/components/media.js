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


const mapMediaToProps = ({ media }) => ({ media });
const mapActionsToProps = (dispatch) => ({
    loadMedia: () => dispatch(fetchMedia()),
    onUpload: (file) => dispatch(uploadMedia(file)),
    onRemove: (id) => dispatch(deleteMedia(id))
});

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
    preload() {
        return this.props.loadMedia()
    }
    render() {
        const { media, onUpload, onRemove } = this.props;
        return this.isLoaded() ? (
            <div className="ui padded container">
                <div className="ui centered grid">
                    <div className="twelve wide column">
                        <MediaUploadButton onClick={onUpload} />
                        <div className="ui bottom attached segment">
                            <div className="ui four cards">
                                {_.orderBy(media, 'id', 'desc').map((data) => (
                                    <PageMedia
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
    mapMediaToProps,
    mapActionsToProps
)(MediaPageView);


const PageMedia = ({ data, onRemove }) => {
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

class MediaSelectDummyModal extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        onShow: React.PropTypes.func,
        onClose: React.PropTypes.func,
        show: React.PropTypes.bool
    };
    static defaultProps = {
        onSelect: () => {},
        onShow: () => {},
        onClose: () => {},
        show: false
    };
    constructor(props) {
        super(props);
        this.loadMedia = _.debounce(
            this.loadMedia.bind(this),
            1000,
            { leading: true, trailing: false }
        );
        this.state = { loaded: false, modal: 'hidden' };
    }
    componentDidMount() {
        $(this.refs.modal).modal({
            onShow: () => this.setState({ modal: 'show' }),
            onHide: () => this.setState({ modal: 'hide' }),
            onVisible: () => {
                this.props.onShow();
                this.setState({modal: 'visible'});
            },
            onHidden: () => {
                this.props.onClose();
                this.setState({ modal: 'hidden' });
            }
        });
    }
    componentDidUpdate() {
        const { loaded, modal } = this.state;
        const { show } = this.props;
        const $modal = $(this.refs.modal);
        $modal.modal('refresh');

        if (show && modal == 'hidden')
            $modal.modal('show');

        else if (!show && modal == 'visible')
            $modal.modal('hide');

        if (!loaded && modal == 'show')
            this.loadMedia();
    }
    loadMedia() {
        this.props.loadMedia().then(
            () => this.setState({ loaded: true })
        );
    }
    render() {
        const { media } = this.props;
        return (
            <div className="hidden">
                <div ref="modal" className="ui modal">
                    <div className="header">
                        Выберите изображение
                    </div>
                    <div className="content">
                        {this.state.loaded ? (
                            <div className="ui four cards">
                                {_.orderBy(media, 'id', 'desc').map((m) => (
                                    <SimpleMedia
                                        key={m.id}
                                        file={m.file_url}
                                        onClick={() => this.props.onSelect(m)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="ui active dimmer">
                                <div className="ui loader" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export const MediaSelectModal = connect(
    mapMediaToProps,
    mapActionsToProps
)(MediaSelectDummyModal);
MediaSelectModal.propTypes = MediaSelectDummyModal.propTypes;


export class MediaAddButton extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = { openModal: false };
    }
    render() {
        const { children, onSelect, ...buttonProps } = this.props;
        return (
            <div>
                <a {...buttonProps} onClick={() => this.setState({ openModal: true })}>
                    {children}
                </a>
                <MediaSelectModal
                    show={this.state.openModal}
                    onClose={() => this.setState({ openModal: false })}
                    onSelect={(m) => {
                        this.setState({ openModal: false });
                        onSelect(m);
                    }}
                />
            </div>
        );
    }
}


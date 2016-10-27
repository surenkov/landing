// @flow
import React from 'react'

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { _loaded: false };
    }
    isLoaded() {
        return this.state._loaded;
    }
    componentDidMount() {
        this.preload().then(() => this.setState({ _loaded: true }));
    }
}

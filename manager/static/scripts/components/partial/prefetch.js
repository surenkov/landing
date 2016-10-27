import React from 'react'


export const Preloader = () => <div className="ui active loader" />;

export const prefetch = (
    LoadedComponent,
    NotLoadedComponent = null
) => (
        class extends React.Component {
            constructor(props: {}) {
                super(props);
                this.state = { loaded: false };
            }
            componentDidMount() {
                this.props.onLoad().then(() => this.setState({ loaded: true }));
            }
            render() {
                return this.state.loaded
                    ? (<LoadedComponent {...this.props} />)
                    : (NotLoadedComponent
                        ? <NotLoadedComponent {...this.props} />
                        : null)
            }
        }
);

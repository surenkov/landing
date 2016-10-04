/**
 * Created by surenkov on 10/4/16.
 */
import _ from 'lodash'
import React from 'react'

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.prefetchData = _.debounce(this.prefetchData.bind(this), 40, {
            leading: true,
            trailing: false
        });
    }
    componentDidMount() {
        this.prefetchData();
    }
    prefetchData() {}
}

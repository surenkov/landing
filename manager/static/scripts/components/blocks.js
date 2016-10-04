/**
 * Created by surenkov on 10/4/16.
 */
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import Prefetch from './misc/prefetch'
import { fetchBlocks } from '../actions/blocks'

class BlocksComponent extends Prefetch {
    constructor(params) {
        super(params);
    }
    prefetchData() {
        this.props.loadBlocks();
    }
    render() {
        const { blocks } = this.props;
        return (
            <div className="ui grid container">
                {_.orderBy(blocks, ['ordering', 'id']).map(
                    (block) => <BlockView key={block.id} data={block} />
                )}
            </div>
        )
    }
}

export const Blocks = connect(
    ({ blocks }) => ({ blocks }),
    (dispatch) => ({
        loadBlocks: () => dispatch(fetchBlocks())
    })
)(BlocksComponent);


const BlockView = ({ data }) => (
    <div className="wide column">
        
    </div>
);

/**
 * Created by surenkov on 10/3/16.
 */
import React from 'react'

const componentContainer = new Map();

export const registerBlock = (blockType, component) =>
    componentContainer.set(blockType, component).get(blockType);

export const getBlock = (blockType) =>
    componentContainer.get(blockType) || 'span';


export const createBlockForm = (data, type, props = {}) =>
    React.createElement(getBlock(type.type), { data, type, ...props });

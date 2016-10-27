// @flow
import React from 'react'


type Type = { type: string };
type Block = ReactClass<{}> | string;

const componentContainer = new Map();

export const registerBlock = (blockType: string, component: Block): ?Block =>
    componentContainer.set(blockType, component).get(blockType);

export const getBlock = (blockType: string): Block =>
    componentContainer.get(blockType) || 'span';


export const createBlockForm = (data: {}, type: Type, props: {} = {}) =>
    React.createElement(getBlock(type.type), { data, type, ...props });

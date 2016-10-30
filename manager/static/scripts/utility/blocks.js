// @flow
import React from 'react'
import type { Block, BlockType } from '../flow/types';


const componentContainer = new Map();

export const registerBlock = (blockType: string, component: Block): ?Block =>
    componentContainer.set(blockType, component).get(blockType);

export const getBlock = (blockType: string): Block =>
    componentContainer.get(blockType) || 'span';


export const createBlockForm = (data: Block, type: BlockType, props: {} = {}) =>
    React.createElement(getBlock(type.type), { data, type, ...props });

/**
 * Created by surenkov on 10/3/16.
 */

const componentContainer = new Map();

export const registerBlock = (blockType, component) =>
    componentContainer.set(blockType, component).get(blockType);

export const getBlock = (blockType) =>
    componentContainer.get(blockType);

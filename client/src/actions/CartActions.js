import * as actions from './actions.js';

export const updateCartItems = (data) => {
    return {
      type: actions.UPDATE_CART_ITEMS,
      data: data
    }
};

export const getCartItems = () => {
    return {
      type: actions.GET_CART_ITEMS
    }
};

export const removeItemFromCart = (data) => {
    return {
      type: actions.REMOVE_ITEM_FROM_CART,
      data: data
    }
};

export const removeAllItemsFromCart = (data) => {
    return {
      type: actions.REMOVE_ALL_ITEMS_FROM_CART,
      data: data
    }
};

export const updateAllCartItems = (data) => {
    return {
      type: actions.UPD_ALL_CART_ITEMS,
      data: data
    }
};

import * as actions from './actions.js';

export const getAllProducts = (data) => {
    return {
      type: actions.GET_ALL_PROD,
      data: data
    }
};

export const getAllBrands = (data) => {
    return {
      type: actions.GET_ALL_BRANDS,
      data: data
    }
};

export const getAllCategory = (data) => {
    return {
      type: actions.GET_ALL_CATEGORIES,
      data: data
    }
};

export const getBestSellers = (data) => {
    return {
      type: actions.GET_BEST_SELLERS,
      data: data
    }
};

export const getProductPriceMinAndMax = (data) => {
    return {
      type: actions.GET_PROD_PRICE_MIN_MAX,
      data: data
    }
};

export const getProductCount = (data) => {
    return {
      type: actions.GET_PROD_COUNT,
      data: data
    }
};

export const requestStart = () => {
    return {
      type: actions.REQUEST_START
    }
};

export const requestSuccess = () => {
    return {
      type: actions.REQUEST_SUCCESS
    }
};

export const requestFailure = () => {
    return {
      type: actions.REQUEST_FAILURE
    }
};

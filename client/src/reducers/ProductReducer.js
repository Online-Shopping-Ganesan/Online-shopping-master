import * as actions from '../actions/actions.js';
const initState = {brands:[], categories: [], products: [], bestSeller: [], price: {}, count: 1, loading: false};
export default (state = initState, action) => {
    switch (action.type){
      case actions.GET_ALL_PROD:
    	   return {...state, products: action.data};
      case actions.GET_ALL_BRANDS:
    	  return {...state, brands: action.data};
      case actions.GET_ALL_CATEGORIES:
    	  return {...state, categories: action.data};
      case actions.GET_BEST_SELLERS:
    	  return {...state, bestSeller: action.data};
      case actions.GET_PROD_PRICE_MIN_MAX:
    	  return {...state, price: action.data};
      case actions.GET_PROD_COUNT:
    	  return {...state, count: action.data};
      case actions.REQUEST_START:
    	  return {...state, loading: true};
      case actions.REQUEST_SUCCESS:
    	  return {...state, loading: false};
      case actions.REQUEST_FAILURE:
    	  return {...state, loading: false};
      default:
            return state;
    }
};
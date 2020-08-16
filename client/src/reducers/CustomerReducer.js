import * as actions from '../actions/actions.js';
import { toast } from 'react-toastify';

const initState = {};
export default (state = initState, action) => {
    switch (action.type){
      case actions.SET_CUSTOMER_DTLS:
    	   const data = action.data
    	   return {...state, data};
      default:
            return state;
    }
};
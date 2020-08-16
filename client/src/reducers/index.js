import {combineReducers} from 'redux';
import ProductReducer from './ProductReducer';
import CartReducer from './CartReducer';
import CustomerReducer from './CustomerReducer';

export default combineReducers({
	ProductReducer,
	CartReducer,
	CustomerReducer
});
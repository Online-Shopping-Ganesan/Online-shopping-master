import * as actions from '../actions/actions.js';
import { toast } from 'react-toastify';

const initState = {};
export default (state = initState, action) => {
    switch (action.type){
      case actions.UPDATE_CART_ITEMS: 
    	   let cartItem = localStorage.getItem('cartItem');
    	   cartItem = cartItem ? JSON.parse(cartItem) : {};
    	   const {prod_id, prod_name, prod_img, id, prod_avail_qty, prod_price, prod_size, order_qty, prod_url} = action.data;
    	   if(cartItem[prod_id] == undefined){
    		   cartItem[prod_id] = {prod_name, prod_img, prod_url, productSub: {}};
    		   cartItem[prod_id]['productSub'][id] = {prod_avail_qty, prod_price, prod_size, order_qty}
    	   } else if(cartItem[prod_id]['productSub'][id]){
    		   const productSub = cartItem[prod_id]['productSub'][id];
    		   const qty = parseInt(productSub.order_qty) + parseInt(order_qty);
    		   if(productSub.prod_avail_qty >= qty){
    			   productSub.order_qty = qty;
    		   } else{
    			   const avail_qty = productSub.prod_avail_qty - parseInt(productSub.order_qty);
    			   toast.error(`Proudct have only left ${avail_qty}`);
    		   }
    	   } else{
    		   cartItem[prod_id]['productSub'][id] = {prod_avail_qty, prod_price, prod_size, order_qty};
    	   }
    	   localStorage.setItem('cartItem', JSON.stringify(cartItem));
    	   return state = cartItem;
      case actions.GET_CART_ITEMS:
    	  if(Object.keys(state).length == 0){
    		  let cartItem = localStorage.getItem('cartItem');
    		  state = cartItem ? JSON.parse(cartItem) : {};
    	  }
    	  return state;
      case actions.UPD_ALL_CART_ITEMS:
    	  let allCartItems = localStorage.getItem('cartItem');
		  state = allCartItems ? JSON.parse(allCartItems) : {};
    	  return state;
      case actions.REMOVE_ALL_ITEMS_FROM_CART:
    	  return state = {};
      case actions.REMOVE_ITEM_FROM_CART:
    	  const subProdId = action.data.id;
    	  const prodId = action.data.prod_id;
    	  let cartItems = {...state};
    	  if(subProdId > 0 && prodId > 0){
    		  if(Object.keys(cartItems[prodId]['productSub']).length > 1){
    			  delete cartItems[prodId]['productSub'][subProdId]
    		  }else {
    			  delete cartItems[prodId]
    		  }
    		  localStorage.setItem('cartItem', JSON.stringify(cartItems));
    	  }
    	  return {...cartItems};
      default:
            return state;
    }
};
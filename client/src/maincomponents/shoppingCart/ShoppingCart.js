import React,{useState, useEffect} from "react";
import { connect } from 'react-redux';
import  * as CartActions from '../../actions/CartActions.js';

import { Link } from "react-router-dom";
import ShoppingCartEmpty from './ShoppingCartEmpty';
import ShoppingCartItems from './ShoppingCartItems';
 
const ShoppingCart = (props) => {
  
  const removeItemFromCart = (row) => {
	if(row.id > 0){
		props.removeItemFromCart(row);
	}
  }
  
  return (
		  <div className="col-md-9 col-sm-7">
          <h1>Shopping cart</h1>
          {Object.keys(props.cartItems).length > 0 ? <div className="goods-page">
             <ShoppingCartItems cartItems={props.cartItems} removeItemFromCart={removeItemFromCart}/>
             
             <Link className="btn btn-default" to='/'>Continue shopping <i className="fa fa-shopping-cart"></i></Link>
             <Link className="btn btn-primary" to='/store/checkout'>Checkout <i className="fa fa-check"></i></Link>
          </div> : <ShoppingCartEmpty/>
		  }
        </div>
   );
}

const mapStateToProps = (state, ownProps) => {
	  return {
		  cartItems: state.CartReducer,
	  }
};

const mapDispatchToProps = (dispatch) => {
	  return {
		  removeItemFromCart: (row) => dispatch(CartActions.removeItemFromCart(row)),
	  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
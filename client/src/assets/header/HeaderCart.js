import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import  * as CartActions from '../../actions/CartActions.js';
import NumberFormat from 'react-number-format';
import { Link } from "react-router-dom";
import  Service from '../../services/Service.js';

const HeaderCart = (props) => {
		useEffect(() => {
			props.getCartItems();
		}, []);
		
		const removeItemFromCart = (row) => {
			if(row.id > 0){
				props.removeItemFromCart(row);
			}
		}
		
		const {cartItemsArr, totalPrice} = Service.getCartItemsAndTotalPrice(props.cartItems);
		return (
			<div className="top-cart-block">
	          <div className="top-cart-info">
	            <a href="#" className="top-cart-info-count">{cartItemsArr.length} items</a>
	            <a href="#" className="top-cart-info-value"><NumberFormat value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></a>
	          </div>
	          <i className="fa fa-shopping-cart"></i>
	                        
	          {cartItemsArr.length > 0 && <div className="top-cart-content-wrapper">
	            <div className="top-cart-content">
	              <ul className="scroller" style={{height: '250px'}}>
	                {cartItemsArr.map((row, index) => (<li key={"cartItems"+index}>
	                  <img src={'/public/uploads/products/thumbnail/'+row.prod_img} alt="Rolex Classic Watch" width="37" height="34" />
	                  <span className="cart-content-count">x {row.order_qty}</span>
	                  <strong>{row.prod_name}</strong>
	                  <NumberFormat className="cart-price" value={row.prod_price} displayType={'text'} thousandSeparator={true} prefix={'₹'} />
	                  <a className="del-goods" onClick={() => removeItemFromCart(row)}>&nbsp;</a>
	                </li>))}
	              </ul>
	              <div className="text-right">
	                <Link to="/store/shoppingCart" className="btn btn-default">View Cart</Link>&nbsp;&nbsp;
	                <Link to="/store/checkout" className="btn btn-primary">Checkout</Link>
	              </div>
	            </div>
	          </div>}            
	        </div>
	)
}

const mapStateToProps = (state, ownProps) => {
	  return {
		  cartItems: state.CartReducer,
	  }
};

const mapDispatchToProps = (dispatch) => {
	  return {
		  getCartItems:       () => dispatch(CartActions.getCartItems()),
		  removeItemFromCart: (row) => dispatch(CartActions.removeItemFromCart(row)),
	  }
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderCart);
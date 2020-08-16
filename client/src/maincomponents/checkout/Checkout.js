import React,{useState, useEffect, useContext} from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';

import  * as CustomerActions from '../../actions/CustomerActions.js';
import ShoppingCartItems from '../shoppingCart/ShoppingCartItems';
import CustomerLogin from './CustomerLogin';
import ShippingDetails from './ShippingDetails';
import PaymentDetails from './PaymentDetails';
import ShoppingCartEmpty from '../shoppingCart/ShoppingCartEmpty';
import CheckoutContext from './CheckoutContext';
import  Service from '../../services/Service.js';
import  * as CartActions from '../../actions/CartActions.js';


const Checkout = (props) => {
	const [checkoutDtls, saveCheckoutDtls] = useState({displayTabNo: 1, checkoutOpt: 'login', guestDtls: {}, acceptTermConditions: false, orderNo: ''});
	const customerFirstName = props.customer ? props.customer.f_name : '';
		
	useEffect(() => {
		if(customerFirstName){
			saveCheckoutDtls({...checkoutDtls, displayTabNo: 2});
		}
	}, [customerFirstName]);
	
	const orderCreatedResponse = (response, error, prodDtls) => {
		if(error){
			toast.error(error);
			if(error == 'Invalid cart items, Please try again.'){
				Service.signout(props);
			} else if(error == 'Some products have insufficient quantity'){
				Object.keys(prodDtls).forEach((prodSubId) => {
					let value = prodDtls[prodSubId];
					props.removeItemFromCart({id: prodSubId, prod_id: value.prod_id});
				});
			}
		} else{
			localStorage.removeItem('cartItem');
			props.removeAllItemsFromCart();
			saveCheckoutDtls({...checkoutDtls, orderNo: response});
		}
	}
	
	const confirmOrder = async () => {
		if(checkoutDtls.acceptTermConditions !== true){
			toast.error('Please accept the Term and Conditions');
		}else if(checkoutDtls.checkoutOpt == 'login'){
			if(!props.customer || !props.customer.f_name || !localStorage.getItem('access-token')){
				toast.error('Please login your account or try to choose guest checkout');
				saveCheckoutDtls({...checkoutDtls, displayTabNo: 1});
			}else{
				await Service.getCSRFToken();
				const [response, error, prodDtls] = await Service.createOrderByCustomer(props.cartItems);
				orderCreatedResponse(response, error, prodDtls);
			}
		} else{
			let isInvlaidShippingDtls = true;
			if(Object.keys(checkoutDtls.guestDtls).length){
				isInvlaidShippingDtls = false;
				Object.keys(checkoutDtls.guestDtls).filter(key => {
					if(!isInvlaidShippingDtls){
						const value = typeof checkoutDtls.guestDtls[key] == 'number' ? checkoutDtls.guestDtls[key].toString() : checkoutDtls.guestDtls[key];
						isInvlaidShippingDtls = (typeof value != 'string' || !value.trim());
					}
				});
			}
			
			if(isInvlaidShippingDtls){
				toast.error('Invalid Shipping details');
				saveCheckoutDtls({...checkoutDtls, displayTabNo: 2});
			}else{
				await Service.getCSRFToken();
				const [response, error, prodDtls] = await Service.createOrderByGuest({cartItems: props.cartItems, guestDtls: checkoutDtls.guestDtls});
				orderCreatedResponse(response, error, prodDtls);
			}
		}
	}
	
	return (
			<>
			{ checkoutDtls.orderNo && <Redirect to={{
	            pathname: '/store/orderCreated',
	            state: { orderNo: checkoutDtls.orderNo }
	        }} />	}
			
			{(!props.cartItems || Object.keys(props.cartItems).length == 0) ? <ShoppingCartEmpty/> :
			(<CheckoutContext.Provider value={{checkoutDtls, saveCheckoutDtls}}><div className="col-md-9 col-sm-7">
	        <h1>Checkout</h1>
	        {/* BEGIN CHECKOUT PAGE */}
	        <div className="panel-group checkout-page accordion scrollable" id="checkout-page">

	          {/* BEGIN CHECKOUT */}
	          <fieldset disabled={props.customer && props.customer.f_name}>
	          	<CustomerLogin {...props}/>
	          </fieldset>
	          {/* END CHECKOUT */}

	          {/* BEGIN SHIPPING ADDRESS */}
	          <ShippingDetails {...props}/>
	          {/* END SHIPPING ADDRESS */}
	          {/* BEGIN PAYMENT METHOD */}
	          <PaymentDetails {...props}/>
	          {/* END PAYMENT METHOD */}

	          {/* BEGIN CONFIRM */}
	          <div id="confirm" className="panel panel-default">
	            <div className="panel-heading">
	              <h2 className="panel-title">
	                <a className="accordion-toggle cursor" onClick={() => saveCheckoutDtls({...checkoutDtls, displayTabNo:4})}>
	                Step 4: Confirm Order
	                </a>
	              </h2>
	            </div>
	            <div id="confirm-content" className={(checkoutDtls.displayTabNo == 4) ? 'panel-collapse collapse in' : 'panel-collapse collapse' }>
	              <div className="panel-body row">
	                <div className="col-md-12 clearfix">
	                 <ShoppingCartItems cartItems={props.cartItems} removeDelOpt={true} displayTabNo={checkoutDtls.displayTabNo}/>
	                  
	                  <div className="clearfix"></div>
	                  <button className="btn btn-primary pull-right" type="button" onClick={confirmOrder} id="button-confirm">Confirm Order</button>
	                  <div className="checkbox pull-right">
	                    <label>
	                      <input type="checkbox" value={checkoutDtls.acceptTermConditions} onClick={() => saveCheckoutDtls({...checkoutDtls, acceptTermConditions: !checkoutDtls.acceptTermConditions})}/> I have read and agree to the <a title="Terms & Conditions">Terms & Conditions </a> &nbsp;&nbsp;&nbsp; 
	                    </label>
	                </div>
	                </div>
	                 
	              </div>
	            </div>
	          </div>
	          {/* END CONFIRM */}
	        </div>
	        {/* END CHECKOUT PAGE */}
	      </div></CheckoutContext.Provider>)
	      }
	      
	      </>
	)
}

const mapStateToProps = (state, ownProps) => {
	  return {
		  cartItems: state.CartReducer,
		  customer: state.CustomerReducer.data,
	  }
};

const mapDispatchToProps = (dispatch) => {
	  return {
		  setCustomerDtls: (response) => dispatch(CustomerActions.setCustomerDtls(response)),
		  removeItemFromCart: (row) => dispatch(CartActions.removeItemFromCart(row)),
		  removeAllItemsFromCart:       () => dispatch(CartActions.removeAllItemsFromCart()),
	  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
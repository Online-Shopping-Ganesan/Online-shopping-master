import React,{useState, useContext} from "react";
import CheckoutContext from './CheckoutContext';

const CheckoutOptions = (props) => {
	
	const checkoutContext = useContext(CheckoutContext);
	
	const updCheckoutOpt = (e) => {
		const checkoutOpt = e.target.value;
		checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, checkoutOpt})
	}
	
	return (
			<div className="col-md-6 col-sm-6">
	            <h3>New Customer</h3>
	            <p>Checkout Options:</p>
	            <div className="radio-list">
	              <label>
	                <input type="radio" name="account" checked={checkoutContext.checkoutDtls.checkoutOpt == 'login'} onChange={updCheckoutOpt}  value="login"/> Customer Login
	              </label>
	              <label>
	                <input type="radio" name="account" checked={checkoutContext.checkoutDtls.checkoutOpt == 'guest'}  onChange={updCheckoutOpt}  value="guest"/> Guest Checkout
	              </label> 
	            </div>
	            <p>By creating an account you will be able to shop faster, be up to date on an order's status, and keep track of the orders you have previously made.</p>
	            <button className="btn btn-primary" onClick={() => checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:2})} disabled={checkoutContext.checkoutDtls.checkoutOpt == 'login'}>Continue</button>
          </div>
	)
}

export default CheckoutOptions;
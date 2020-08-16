import React,{useState, useContext} from "react";
import CheckoutOptions from './CheckoutOptions';
import Login from '../customer/Login';
import CheckoutContext from './CheckoutContext';

const CustomerLogin = (props) => {
	const checkoutContext = useContext(CheckoutContext);
	
	return (
			<div id="checkout" className="panel panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">
                <a className="accordion-toggle cursor"  onClick={() => checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:1})}>
                  Step 1: Customer Login
                </a>
              </h2>
            </div>
            <div id="checkout-content" className={ checkoutContext.checkoutDtls.displayTabNo == 1 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }>
              <div className="panel-body row">
                <CheckoutOptions/>
                <Login/>
              </div>
            </div>
          </div>
	)
}

export default CustomerLogin;
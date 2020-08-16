import React,{useContext} from "react";
import CheckoutContext from './CheckoutContext';

const PaymentDetails = (props) => {
	const checkoutContext = useContext(CheckoutContext);
	
	return (
			<div id="payment-method" className="panel panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">
                <a className="accordion-toggle cursor"  onClick={() => checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:3})}>
                  Step 3: Payment Method
                </a>
              </h2>
            </div>
            <div id="payment-method-content" className={(checkoutContext.checkoutDtls.displayTabNo == 3) ? 'panel-collapse collapse in' : 'panel-collapse collapse' }>
              <div className="panel-body row">
                <div className="col-md-12">
                  <p>Please select the preferred payment method to use on this order.</p>
                  <div className="radio-list">
                    <label>
                      <input type="radio" name="CashOnDelivery" defaultChecked={true} value="CashOnDelivery"/> Cash On Delivery
                    </label>
                  </div>
                  <button className="btn btn-primary  pull-right" type="button" id="button-payment-method"  onClick={() => checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:4})}>Continue</button>
                   
                </div>
              </div>
            </div>
          </div>
	)
}

export default PaymentDetails;
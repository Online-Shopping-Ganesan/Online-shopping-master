import React,{useState, useContext} from "react";
import CheckoutContext from '../checkout/CheckoutContext';
import  Service from '../../services/Service.js';
import { toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
//import CryptoJS from "crypto-js";

import { connect } from 'react-redux';
import  * as CustomerActions from '../../actions/CustomerActions.js';

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isRedirect, setIsRedirect] = useState(false);
	const checkoutContext = useContext(CheckoutContext);
	
	const validateForm = () => (email.length > 0 && password.length > 0);
	
	const customerLogin = async(event) => {
		event.preventDefault();	
		await Service.getCSRFToken();
		const [response, errors]= await Service.customerLoginValidation({email, password});
		if(errors){
			toast.error(errors);
			Service.signout(props);
		} else{
			/*const token = CryptoJS.AES.encrypt(JSON.stringify(clientBrowserDtls), process.env.REACT_APP_SECRET_KEY).toString();
			CryptoJS.AES.encrypt(response.token, process.env.REACT_APP_SECRET_KEY).toString();*/
			localStorage.setItem('access-token', response.token);
			delete response['token'];
			props.setCustomerDtls(response);
			if(props.location && props.location.pathname == "/store/login"){
				setIsRedirect(true);
			}else if(checkoutContext) {
				checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:2});
			}
			
			
		}
	}
	
	return (
			<>
			{ isRedirect && <Redirect to='/' />	}
			
			<div className="col-md-6 col-sm-6">
              <h3>Customer Login</h3>
              <form onSubmit={customerLogin}>
	              <div className="form-group">
		              <label htmlFor="email-login">E-Mail</label>
		              <input type="email" id="email-login" placeholder="Enter Email ID" readOnly={props.checkoutOpt == 'guest'} onChange={e => setEmail(e.target.value)} value={email} required className="form-control"/>
		          </div>
		          <div className="form-group">
		              <label htmlFor="password-login">Password</label>
		              <input type="password" id="password-login" placeholder="Enter Password" readOnly={props.checkoutOpt == 'guest'} onChange={e => setPassword(e.target.value)} value={password} required className="form-control"/>
		          </div>
		          {(!props.customer || props.customer.hasOwnProperty('f_name') === false) && (<><Link to="/store/register" className="cursor">Register</Link>&nbsp;&nbsp;<Link to="/store/forgotPassword" className="cursor">Forgotten Password?</Link></>)}
		          <div className="padding-top-20">                  
		              <button className="btn btn-primary" disabled={props.checkoutOpt == 'guest' || !validateForm()}>Login</button>
		          </div>
	          </form>
           </div>
           </>
	)
}
		              
const mapStateToProps = (state, ownProps) => {
	  return {
		  customer: state.CustomerReducer.data,
	  }
};

const mapDispatchToProps = (dispatch) => {
    return {
    	setCustomerDtls: (response) => dispatch(CustomerActions.setCustomerDtls(response)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
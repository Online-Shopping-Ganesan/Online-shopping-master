import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import  * as CustomerActions from '../actions/CustomerActions.js';
import CryptoJS from "crypto-js";
import  Service from '../services/Service.js';
import { toast } from 'react-toastify';


const PreHeader = (props) => {
	
	useEffect(() => {
		const accessToken = localStorage.getItem('access-token');
		if(accessToken && typeof accessToken == 'string' && (!props.customer || !props.customer.f_name)){
			/*const bytes  = CryptoJS.AES.decrypt(accessToken, process.env.REACT_APP_SECRET_KEY);
			const token = bytes.toString(CryptoJS.enc.Utf8);*/
			getCustomerDtls(accessToken);
		}
	}, []);
	
	const getCustomerDtls = async (token) => {
		const [response, error] = await Service.getCustomerDtls(token);
		if(error){
			toast.error(error);
			Service.signout(props);
		}else {
			props.setCustomerDtls(response);
		}
	}
	
	return (
			<div className="pre-header">
	        <div className="container">
	            <div className="row">
					<div className="col-md-12 col-sm-12 additional-nav">
	                    
	                    	{(props.customer && props.customer.f_name) ? (
	                    			<ul className="list-unstyled list-inline float-right"><li><Link to="/store/myOrders">My Orders</Link></li> <li><Link to="/store/myAccount">My Account</Link></li><li><Link to="/store/signout">Signout</Link></li></ul>) : (<ul className="list-unstyled list-inline float-right"><li><Link to="/store/login">Log In/Register</Link></li></ul>)}
	                    
	                </div>
	            </div>
	        </div>        
	    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PreHeader);

import React,{useEffect} from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import  * as CustomerActions from '../../actions/CustomerActions.js';
import  Service from '../../services/Service.js';


const Signout = (props) => {
	useEffect(() => {
		Service.signout(props);
	}, []);
	
	return(
			<Redirect to='/' />	
	)
	
}

const mapDispatchToProps = (dispatch) => {
    return {
    	setCustomerDtls: (customer) => dispatch(CustomerActions.setCustomerDtls(customer)),
    }
};

export default connect(null, mapDispatchToProps)(Signout);



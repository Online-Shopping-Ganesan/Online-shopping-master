import React,{useState, useEffect, useContext} from "react";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import  Service from '../../services/Service.js';
import  * as CustomerActions from '../../actions/CustomerActions.js';
import CheckoutContext from './CheckoutContext';

const ShippingDetails = (props) => {
	const userObj = {f_name:'', l_name:'', email:'', mobile:'', address_1:'', address_2:'', city:'', state_id:'', pincode:'', country: 1};
	const [customerDtls, setCustomerDtls] = useState(userObj);
	const [isLogin, setIsLogin] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [stateList, setStateList] = useState([]);
	const checkoutContext = useContext(CheckoutContext);
	
	useEffect(() => {
		if(stateList.length == 0){
			fetchState();
		}
		if(props.customer && props.customer.f_name){
			const {address_1, address_2, city, state_id, pincode} = props.customer;
			setCustomerDtls({...customerDtls, address_1, address_2, city, state_id, pincode});
			setIsLogin(true);
		}else {
			setIsLogin(false);
		}
		
	}, [props.customer]);
	
	const fetchState = async () => {
		const response = await Service.getAllStates();
		setStateList(response);
	}
	
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setCustomerDtls({...customerDtls, [name]: value});
	}
	
	const customerAddressUpd = async (e) => {
		e.preventDefault();
		if(isEditMode){
			await Service.getCSRFToken();
			const isUpdate = props.customer && props.customer.f_name;
			const [response, error] = await Service.customerAddressUpd(customerDtls);
			
			if(error){
				toast.error(error);
			}else{
				const {address_1, address_2, city, state_id, pincode} = customerDtls;
				props.setCustomerDtls({...props.customer, address_1, address_2, city, state_id, pincode});
				toast.success('Customer Details Updated Successfully');
				setIsEditMode(false);
			}
		}else {
			checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:3, guestDtls: customerDtls})
		}
	}
	
	const updCancel = () => {
		setIsEditMode(false);
		const {address_1, address_2, city, state_id, pincode} = props.customer;
		setCustomerDtls({...customerDtls, address_1, address_2, city, state_id, pincode});
	}
	
	return (
			<div id="payment-address" className="panel panel-default">
            <div className="panel-heading">
              <h2 className="panel-title">
                <a className="accordion-toggle cursor" onClick={() => checkoutContext.saveCheckoutDtls({...checkoutContext.checkoutDtls, displayTabNo:2})}>
                  Step 2: Shipping Details
                </a>
              </h2>
            </div>
            <div id="payment-address-content" className={(checkoutContext.checkoutDtls.displayTabNo == 2) ? 'panel-collapse collapse in' : 'panel-collapse collapse' }>
            <form onSubmit={customerAddressUpd} method="post">
              <div className="panel-body row">
              	{!isLogin && <div className="col-md-6 col-sm-6">
	                <h3>Your Personal Details</h3>
	                <div className="form-group">
	          			<label htmlFor="f_name">First Name <span className="require">*</span></label>
	          			<input type="text" id="f_name" name="f_name" required pattern=".*\S+.*" minLength="2" maxLength="64" value={customerDtls.f_name} onChange={handleChange} className="form-control"/>
	          		</div>
	          		<div className="form-group">
	          			<label htmlFor="l_name">Last Name <span className="require">*</span></label>
	          			<input type="text" id="l_name" name="l_name" required pattern=".*\S+.*" minLength="2" maxLength="64" value={customerDtls.l_name} onChange={handleChange}  className="form-control"/>
	          		</div>
	          		<div className="form-group">
	          			<label htmlFor="email">E-Mail <span className="require">*</span></label>
	          			<input type="email" id="email" name="email" maxLength="64" required value={customerDtls.email} onChange={handleChange} className="form-control"/>
	          		</div>
	          		<div className="form-group">
	          			<label htmlFor="mobile">Mobile <span className="require">*</span></label>
	          			<input type="tel" id="mobile" name="mobile" pattern="^\d{10}$" required value={customerDtls.mobile} onChange={handleChange} className="form-control"/>
	          		</div>
	            </div>}
                <div className={isLogin ? 'col-md-12 col-sm-12' : 'col-md-6 col-sm-6'}>
	                <h3>Your Address</h3>
	                <div className="form-group">
	        			<label htmlFor="address_1">Address 1 <span className="require">*</span></label>
	        			<input type="text" id="address_1" name="address_1" pattern=".*\S+.*" minLength="2" maxLength="255" readOnly={isLogin && !isEditMode} required value={customerDtls.address_1} onChange={handleChange} className="form-control"/>
	        		</div>
	        		<div className="form-group">
	        			<label htmlFor="address_2">Address 2 <span className="require">*</span></label>
	        			<input type="text" id="address_2" name="address_2" pattern=".*\S+.*" minLength="2" maxLength="255" readOnly={isLogin && !isEditMode} required value={customerDtls.address_2} onChange={handleChange} className="form-control"/>
	        		</div>
	        		<div className="form-group">
	        			<label htmlFor="city">City <span className="require">*</span></label>
	        			<input type="text" id="city" name="city" pattern=".*\S+.*" required minLength="2" maxLength="64" readOnly={isLogin && !isEditMode} value={customerDtls.city} onChange={handleChange} className="form-control"/>
	        		</div>
	        		<div className="form-group">
	        			<label htmlFor="pincode">Post Code <span className="require">*</span></label>
	        			<input type="text" id="pincode" name="pincode" pattern=".*\S+.*" minLength="2" maxLength="6" readOnly={isLogin && !isEditMode} required value={customerDtls.pincode} onChange={handleChange} className="form-control"/>
	        		</div>
	        		<div className="form-group">
	        			<label htmlFor="country">Country <span className="require">*</span></label>
	        			<select className="form-control input-sm" id="country" disabled={isLogin && !isEditMode} name="country">
	        			  <option value="1">India</option>
	        			</select>
	        		</div>
	        		<div className="form-group">
	        			<label htmlFor="state_id">Region/State <span className="require">*</span></label>
	        			<select className="form-control input-sm" id="state_id" disabled={isLogin && !isEditMode} required value={customerDtls.state_id} onChange={handleChange} name="state_id">
	        			  <option value=""> --- Please Select --- </option>
	        			  {Array.isArray(stateList) && stateList.map(row => (<option key={'state'+row.id} value={row.id}>{row.name}</option>))}
	        			</select>
	        		</div>
                </div>
                <div className="col-md-12">
                	  {isEditMode ? 
	                	(
		              		<><button className="btn btn-primary pull-right" type="submit">Update</button>
		              		<button className="btn btn-danger pull-right margin-right-5" type="button" onClick={updCancel}>Cancel</button></>
		              	) : 
	                  	((isLogin ? <><button className="btn btn-primary pull-right" type="submit" id="button-payment-address">Continue</button><button className="btn btn-primary pull-right margin-right-5" type="button" onClick={() => setIsEditMode(true)}>Edit</button></> : <button className="btn btn-primary pull-right"  type="submit" id="button-payment-address">Continue</button>))
	                  }
	           </div>
              </div>
            </form>
            </div>
          </div>
	)
}



const mapDispatchToProps = (dispatch) => {
return {
	setCustomerDtls: (response) => dispatch(CustomerActions.setCustomerDtls(response)),
}
};

export default connect(null, mapDispatchToProps)(ShippingDetails);
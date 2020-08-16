import React,{useState, useEffect} from "react";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import  Service from '../../services/Service.js';
import  * as CustomerActions from '../../actions/CustomerActions.js';

const Register = (props) => {
	const userObj = {f_name:'', l_name:'', email:'', mobile:'', pwd:'', pwd_confirm:'', address_1:'', address_2:'', city:'', state_id:'', pincode:'', country: 1};
	const [customerDtls, setCustomerDtls] = useState(userObj);
	const [stateList, setStateList] = useState([]);
	useEffect(() => {
		if(stateList.length == 0){
			fetchState();
		}
		if(props.customer && props.customer.f_name){
			const {f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode} = props.customer;
			setCustomerDtls({...customerDtls, f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode});
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
	
	const customerRegisteration = async (e) => {
		e.preventDefault()
		if(customerDtls.pwd == customerDtls.pwd_confirm){
			await Service.getCSRFToken();
			const isUpdate = props.customer && props.customer.f_name;
			const [response, error] = await Service.customerRegisteration(customerDtls, ( isUpdate ? 'customerDtlsUpdate' : 'customerRegisteration'));
			
			if(error){
				toast.error(error);
			}else{
				
				if(isUpdate){
					const {f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode} = customerDtls;
					props.setCustomerDtls({f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode});
					toast.success('Customer Details Updated Successfully');
				}else {
					setCustomerDtls(userObj);
					toast.success('Customer Details Updated Successfully');
				}
			}
		}else{
			toast.error('Password and confirm paswwrod not matched');
		}
	}
	
	return (
			<div className="col-md-9 col-sm-7">
				<form onSubmit={customerRegisteration} method="post">
		            <div className="panel-body row">
		            	<div className="col-md-6 col-sm-6">
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
			
			          		<h3>Your Password</h3>
			          		<div className="form-group">
			          			<label htmlFor="pwd">Password <span className="require">*</span></label>
			          			<input type="password" id="pwd" name="pwd" minLength="8" maxLength="16" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$" title="Password have Minimun 8 chars and should be at least one letter, one number and one special character" maxLength="32" required={props.history.location.pathname != '/store/myAccount'} value={customerDtls.pwd} onChange={handleChange} className="form-control"/>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="pwd_confirm">Password Confirm <span className="require">*</span></label>
			          			<input type="password" id="pwd_confirm" minLength="8" maxLength="16"  required={props.history.location.pathname != '/store/myAccount'} value={customerDtls.pwd_confirm} onChange={handleChange}  name="pwd_confirm" className="form-control"/>
			          		</div>
		            	</div>
		            	<div className="col-md-6 col-sm-6">
			          		<h3>Your Address</h3>
			          		<div className="form-group">
			          			<label htmlFor="address_1">Address 1 <span className="require">*</span></label>
			          			<input type="text" id="address_1" name="address_1" pattern=".*\S+.*" minLength="2" maxLength="255" required value={customerDtls.address_1} onChange={handleChange} className="form-control"/>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="address_2">Address 2 <span className="require">*</span></label>
			          			<input type="text" id="address_2" name="address_2" pattern=".*\S+.*" minLength="2" maxLength="255" required value={customerDtls.address_2} onChange={handleChange} className="form-control"/>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="city">City <span className="require">*</span></label>
			          			<input type="text" id="city" name="city" pattern=".*\S+.*" required minLength="2" maxLength="64" value={customerDtls.city} onChange={handleChange} className="form-control"/>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="pincode">Post Code <span className="require">*</span></label>
			          			<input type="text" id="pincode" name="pincode" pattern=".*\S+.*" minLength="2" maxLength="6" required value={customerDtls.pincode} onChange={handleChange} className="form-control"/>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="country">Country <span className="require">*</span></label>
			          			<select className="form-control input-sm" id="country" name="country">
			          			  <option value="1">India</option>
			          			</select>
			          		</div>
			          		<div className="form-group">
			          			<label htmlFor="state_id">Region/State <span className="require">*</span></label>
			          			<select className="form-control input-sm" id="state_id" required value={customerDtls.state_id} onChange={handleChange} name="state_id">
			          			  <option value=""> --- Please Select --- </option>
			          			  {Array.isArray(stateList) && stateList.map(row => (<option key={'state'+row.id} value={row.id}>{row.name}</option>))}
			          			</select>
			          		</div>
			          	</div>
		          	</div>
		          	<div className="panel-body row">
		          		<div className="col-md-12 col-sm-12">
		          			<button className="btn btn-primary" type="submit">Submit</button>
		          		</div>
		          	</div>
		        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
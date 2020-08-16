import React,{useState, useEffect} from "react";
import  Service from '../../services/Service.js';
import { toast } from 'react-toastify';

const ForgotPassword = (props) => {
	const [email, setEmail] = useState("");
	const [token, setToken] = useState('');
	const [pwdDtls, setPwdDtls] = useState({pwd:'', pwd_confirm: ''});
	
	
	useEffect(() => {
		const params = new URLSearchParams(props.history.location.search);
		const tokenParam = params.get('token');
		if(tokenParam){
			checkIsValidToken(tokenParam);
		}
	}, []);
	
	const checkIsValidToken = async (tokenParam) => {
		await Service.getCSRFToken();
		const [response, errors]= await Service.checkIsValidToken(tokenParam);
		errors ? toast.error(errors): setToken(tokenParam);
	}
	
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setPwdDtls({...pwdDtls, [name]: value});
	}
	
	const handleSubmit = async (event) => {
		event.preventDefault();	
		if(token){
			if(typeof pwdDtls.pwd == 'string' && pwdDtls.pwd == pwdDtls.pwd_confirm){
				await Service.getCSRFToken();
				const [response, errors] = await Service.updateCustomerPwd({...pwdDtls, token});

				if(errors){
					toast.error(errors);
				} else{
					setToken('');
					toast.success(response)
				}
			}else{
				toast.error('Password and confirm paswwrod not matched');
			}			
		} else {
			await Service.getCSRFToken();
			const [response, errors] = await Service.checkIsValidEmail(email);
			errors ? toast.error(errors) : toast.success(response);
		}
		
	}
	
	return (
			<div className="col-md-6 col-sm-6">
              <h3>Forgot Password</h3>
              <form onSubmit={handleSubmit}>
	              {token ? <><div className="form-group">
        			<label htmlFor="pwd">New Password <span className="require">*</span></label>
          			<input type="password" id="pwd" name="pwd" minLength="8" maxLength="16" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$" title="Password have Minimun 8 chars and should be at least one letter, one number and one special character" maxLength="32" required value={pwdDtls.pwd} onChange={handleChange} className="form-control"/>
          		</div>
          		<div className="form-group">
          			<label htmlFor="pwd_confirm">Confirm Password<span className="require">*</span></label>
          			<input type="password" id="pwd_confirm" minLength="8" maxLength="16"  required value={pwdDtls.pwd_confirm} onChange={handleChange}  name="pwd_confirm" className="form-control"/>
          		</div></> : <div className="form-group">
	              <input type="email" id="emailId" placeholder="Enter Email ID" onChange={e => setEmail(e.target.value)} value={email} required className="form-control"/>
			          </div>}
		          <div className="padding-top-20">                  
		              <button className="btn btn-primary">Submit</button>
		          </div>
	          </form>
           </div>
	)
}
		              
export default ForgotPassword;
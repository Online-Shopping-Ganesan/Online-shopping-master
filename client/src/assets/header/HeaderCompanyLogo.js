import React from 'react';
import { Link } from "react-router-dom";

const HeaderCompanyLogo = (props) => {
		return (
				<React.Fragment>
					<Link to='/' className="site-logo"><h4>Online Shopping</h4></Link>
			    </React.Fragment>
	)
}

export default HeaderCompanyLogo;
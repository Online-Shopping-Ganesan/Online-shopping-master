import React from 'react';
import HeaderCompanyLogo from './HeaderCompanyLogo' ;
import HeaderNavigation from './HeaderNavigation' ;
import HeaderCart from './HeaderCart' ;

const Header = (props) => {
	
		return (
				<div className="header">
			      <div className="container">
			        <HeaderCompanyLogo/>

			        {/* BEGIN CART */}
			        <HeaderCart/>
			        {/*END CART */}

			        {/* BEGIN NAVIGATION */}
			        <HeaderNavigation/>
			        {/* END NAVIGATION */}
			      </div>
			    </div>
	)
}

export default Header;
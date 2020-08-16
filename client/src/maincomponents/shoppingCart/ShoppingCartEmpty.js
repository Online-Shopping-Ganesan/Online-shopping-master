import React from "react";
import { Link } from "react-router-dom";

const ShoppingCartEmpty = () => (
	<div className="col-md-9 col-sm-7">
		<div className="shopping-cart-page">
			<div className="shopping-cart-data clearfix">
				<p>Your shopping cart is empty!</p>
			</div>
	    	<div className="margin-top-10">
	    		<Link className="btn btn-default" to='/'>Continue shopping <i className="fa fa-shopping-cart"></i></Link>
	    	</div>
	    </div>
	</div>
)

export default ShoppingCartEmpty;
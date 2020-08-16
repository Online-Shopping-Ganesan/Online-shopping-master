import React from 'react';
import { Link } from "react-router-dom";


const OrderCreated = (props) => {
	
	return (
			<div className="col-md-9 col-sm-7">
				<div className="shopping-cart-page">
					<h1>Order# <Link to={'/store/orderDtls/'+props.location.state.orderNo}>{props.location.state.orderNo}</Link></h1>
			    	<div className="shopping-cart-data clearfix">
			    		<p>Your Order has been created successfully,< br/>Thanks for choosing online shopping.</p>
			    	</div>
			    	<div className="margin-top-10">
			    		<Link className="btn btn-default" to='/'>Continue shopping <i className="fa fa-shopping-cart"></i></Link>
			    	</div>
			    </div>
			</div>
	)
}

export default OrderCreated;
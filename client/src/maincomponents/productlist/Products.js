import React from 'react';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import  * as CartActions from '../../actions/CartActions.js';


const Products = (props) => {
	
	const addToCart = (row) => {
		props.updateCartItems({...row, 'order_qty': 1});
	}
	
	return (
			
			<>
				<div className="row product-list">
		        
		        {Array.isArray(props.products) && props.products.map(row => (
		        		<div key={'product'+row.prod_id} className="col-md-4 col-sm-6 col-xs-12">
				          <div className="product-item">
				            <div className="pi-img-wrapper">
				              <img src={'/public/uploads/products/thumbnail/'+row.prod_img} height="300" className="img-responsive" alt={row.prod_name} />
				              <div>
				                <Link to={'/store/productDtl/'+row.prod_url} className="btn btn-default fancybox-button">View</Link>
				                <a href={'/public/uploads/products/thumbnail/'+row.prod_img} className="btn btn-default fancybox-fast-view">Zoom</a>
				              </div>
				            </div>
				            <h3><Link to={'/store/productDtl/'+row.prod_url}>{row.prod_name}</Link></h3>
				            <div className="pi-price"><NumberFormat value={row.prod_price} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
				            {row.prod_avail_qty > 0 ? <a className={(props.cartItems[row.prod_id] != undefined ? "green-color" : "")+" btn btn-default add2cart" } onClick={() => addToCart(row)}>Add to cart</a> :
				            	<a className="btn btn-default add2cart color-red">Out of Stock</a>}
				            
				          </div>
				        </div>
		        ))}
		        
		      </div>
		    </>

	)
}


const mapDispatchToProps = (dispatch) => {
	  return {
		  updateCartItems: 	  (addToCartItem) => dispatch(CartActions.updateCartItems(addToCartItem)),
	  }
};

export default connect(null, mapDispatchToProps)(Products);
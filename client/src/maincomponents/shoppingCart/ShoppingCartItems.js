import React,{useEffect, useState} from "react";
import  Service from '../../services/Service.js';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import  * as CartActions from '../../actions/CartActions.js';

const ShoppingCartItems = (props) => {
	  const [cartDtls, setCartDtls] = useState({cartItemsArr: [], totalPrice: 0})
	  
	  useEffect(() => {
		  if(props.orderAmt){
			  setCartDtls({...cartDtls, cartItemsArr: props.cartItems, totalPrice: props.orderAmt});
		  } else{
			  getProdUpdatedPrices();
		  }
	  }, [props.cartItems, props.displayTabNo]);
	  
	  const updateOrderQty = (type, row) => {
		  if(type == 'incr'){
			  row.order_qty = 1;
		  	  props.updateCartItems(row);
		  } else{
			  if((row.order_qty-1) == 0){
				  props.removeItemFromCart(row);
			  } else{
				  row.order_qty = -1;
				  props.updateCartItems(row);
			  }
		  }
	  }
	  
	  const getProdUpdatedPrices = async (subProdIdArr) => {
		  const cartItems = {...props.cartItems};
		  if(cartItems && Object.keys(cartItems).length){
			    if(props.displayTabNo == 4){
			    	  let subProdIdArr = [];
			    	  Object.values(cartItems).forEach(obj => {
						  Object.keys(obj.productSub).forEach((prodSubId) => {
							  subProdIdArr.push(prodSubId);
						  });
					  });
					  await Service.getCSRFToken();
					  const [response, errors]= await Service.getProdUpdatedPrices(subProdIdArr);
					  if(errors){
						  toast.error(errors);
					  } else{
						  let subItemsUpdatePrice = {}, isPriceChgd = false, isUnavailableProd = false;
						  response.forEach(row => {
							  subItemsUpdatePrice[row.id] = row.prod_price;
						  });
						  
						  Object.keys(cartItems).forEach(prodId => {
							  const obj = cartItems[prodId];
							  Object.keys(obj.productSub).forEach((prodSubId) => {
							  	  if(subItemsUpdatePrice[prodSubId] != undefined){
							  		  if(subItemsUpdatePrice[prodSubId] != obj.productSub[prodSubId].prod_price){
							  			  isPriceChgd = true;
										  obj.productSub[prodSubId].prod_price = subItemsUpdatePrice[prodSubId];
									  }
							  	  } else{
							  		  if(Object.keys(cartItems[prodId]['productSub']).length > 1){
						    			  delete cartItems[prodId]['productSub'][prodSubId]
						    		  }else {
						    			  delete cartItems[prodId]
						    		  }
							  		  isUnavailableProd = true;
							  	  }
							  });
						  });
						  if(isPriceChgd || isUnavailableProd){
							  if(isUnavailableProd){
								  toast.error('Some products have insufficient quantity');
							  }
							  localStorage.setItem('cartItem', JSON.stringify(cartItems));
							  props.updateAllCartItems();
						  }
						  setCartDtls(Service.getCartItemsAndTotalPrice(cartItems));
					  }
				}else {
					  setCartDtls(Service.getCartItemsAndTotalPrice(cartItems));
				}
		  }
	  }
	  
	  
	  return (
			  <div className="goods-data clearfix">
				<div className="table-wrapper-responsive">
		        <table summary="Shopping cart">
		        	<thead>
		          <tr>
		            <th className="goods-page-image">Image</th>
		            <th className="goods-page-description">Description</th>
		            <th className="goods-page-quantity">Quantity</th>
		            <th className="goods-page-price">Unit price</th>
		            <th className="goods-page-total" colSpan={props.removeDelOpt ? 1 : 2}>Total</th>
		          </tr>
		          </thead>
		          <tbody>
		          {cartDtls.cartItemsArr.map((row, index) => (
		          		<tr key={'shoppingCartItem'+index}>
		                  <td className="goods-page-image">
		                  <Link to={'/store/productDtl/'+row.prod_url}><img src={'/public/uploads/products/thumbnail/'+row.prod_img} alt={row.prod_name}/></Link>
		                  </td>
		                  <td className="goods-page-description">
		                    <h3><Link to={'/store/productDtl/'+row.prod_url}>{row.prod_name}</Link></h3>
		                    <p><strong>Size</strong>: {row.prod_size}</p>
		                  </td>
		                  <td className="goods-page-quantity">
		                    <div className="product-quantity">
		                    	{props.removeDelOpt !== true ?
		                    	<div className="input-group bootstrap-touchspin input-group-sm">
		                    		<span className="input-group-btn">
		                    			<button className="btn quantity-down bootstrap-touchspin-down" onClick={() => updateOrderQty('decr', row)} type="button"><i className="fa fa-angle-down"></i></button>
		                    		</span>
		                    		<input id="product-quantity" type="text" readOnly className="form-control input-sm" value={row.order_qty} />
		                    		<span className="input-group-btn">
		                    			<button className="btn quantity-up bootstrap-touchspin-up" onClick={() => updateOrderQty('incr', row)} type="button"><i className="fa fa-angle-up"></i></button>
		                    		</span>
		                    	</div> : <input id="product-quantity" type="text" readOnly className="form-control input-sm" value={row.order_qty} /> }
			                </div>
		                  </td>
		                  <td className="goods-page-price" align="right">
		                    <strong><NumberFormat className="cart-price" value={row.prod_price} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></strong>
		                  </td>
		                  <td className="goods-page-total" align="right">
		                    <strong><NumberFormat className="cart-price" value={row.prod_price*row.order_qty} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></strong>
		                  </td>
		                  {props.removeDelOpt !== true && <td className="del-goods-col">
		                  <a className="del-goods" onClick={() => props.removeItemFromCart(row)}>&nbsp;</a>
		                  </td>}
		                  
		                </tr>
		          ))}
		          
		          </tbody>
		          <tfoot>
			          <tr>
			            <td className="goods-page-image"></td>
			            <td className="goods-page-description"></td>
			            <td className="goods-page-quantity"></td>
			            <td className="goods-page-price" align="right">Sub total</td>
			            <td className="goods-page-total" align="right"><strong className="price"><NumberFormat className="cart-price" value={cartDtls.totalPrice} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></strong></td>
			            {props.removeDelOpt !== true && <td className="del-goods-col"></td>}
			          </tr>
		          </tfoot>
		        </table>
		        </div>
		        
	        </div>
		)
	
}

const mapDispatchToProps = (dispatch) => {
	  return {
		  updateAllCartItems:       () => dispatch(CartActions.updateAllCartItems()),
		  updateCartItems: 	  (addToCartItem) => dispatch(CartActions.updateCartItems(addToCartItem)),
	  }
};

export default connect(null, mapDispatchToProps)(ShoppingCartItems);
	                    
	                    
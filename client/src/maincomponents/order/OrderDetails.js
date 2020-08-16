import React,{useEffect, useState} from "react";
import  Service from '../../services/Service.js';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import ShoppingCartItems from '../shoppingCart/ShoppingCartItems';

const OrderDetails = (props) => {
	  const [orderDtls, setOrderDtls] = useState({});
	  
	  useEffect(() => {
		  getOrderDetails();
	  }, []);
	  
	  const getOrderDetails = async () => {
		  if(props.match.params && props.match.params.orderNo){
			  const [response, errror] = await Service.getOrderDetails(props.match.params.orderNo);
			  if(errror){
				  toast.error(errror)
			  }else {
				  setOrderDtls(response);
			  }
		  }
	  }
	  
	  const cancelOrder = async (orderNo) => {
		  await Service.getCSRFToken();
		  const [response, errror] = await Service.cancelOrder(orderNo);
		  if(errror){
			  toast.error(errror)
		  }else if(response.updCnt == 0){
			  getOrderDetails();
		  }else if(response.last_update) {
			  setOrderDtls({...orderDtls, last_update: response.last_update, order_status: 'Cancelled'});
		  } else {
			  toast.error('Order cancelled failed')
		  }
	  }
	  
	  return (
		    <div id="my-order-list" className="col-md-9 col-sm-7">
		    	<h1>Order Details</h1>
				<div className="row margin-top-25">
					<div className="col-md-12 col-sm-7 margin-bottom-10">
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order#:</label></div>
							<div className="col-md-9 col-sm-8">{orderDtls.ord_no}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Confirmed:</label></div>
							<div className="col-md-9 col-sm-8">{new Date(orderDtls.date_of_creation).toDateString()+' '+new Date(orderDtls.date_of_creation).toLocaleTimeString()}</div>
						</div>
						{orderDtls.order_status != 'Confirmed' && 
							<div className="row">
								<div className="col-md-2 col-sm-4"><label>Order {orderDtls.order_status}:</label></div>
								<div className="col-md-6 col-sm-8">{new Date(orderDtls.last_update).toDateString()+' '+new Date(orderDtls.last_update).toLocaleTimeString()}</div>
							</div>	
						}
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Status:</label></div>
							<div className={(orderDtls.order_status == 'Cancelled' ? ' color-red ' : (orderDtls.order_status == 'Delivered' ? ' text-success ' : ''))+"col-md-6 col-sm-8"}>{orderDtls.order_status}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Amount:</label></div>
							<div className="col-md-6 col-sm-8"><NumberFormat className="cart-price" value={orderDtls.ord_tot_amt} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
						</div>
					</div>
				</div>
				<h1>Shipping Details</h1>
				<div className="row margin-top-25">
					<div className="col-md-12 col-sm-7 margin-bottom-10">
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Addres 1:</label></div>
							<div className="col-md-9 col-sm-8">{orderDtls.ship_address_1}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Addres 1:</label></div>
							<div className="col-md-9 col-sm-8">{orderDtls.ship_address_2}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>City:</label></div>
							<div className="col-md-9 col-sm-8">{orderDtls.ship_city}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>State:</label></div>
							<div className="col-md-6 col-sm-8">{orderDtls.state_name}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Pincode:</label></div>
							<div className="col-md-6 col-sm-8">{orderDtls.ship_pincode}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Country:</label></div>
							<div className="col-md-6 col-sm-8">India</div>
						</div>
					</div>
				</div>
				<div className="row margin-top-25">
					<ShoppingCartItems cartItems={orderDtls.prodDtls} removeDelOpt={true} orderAmt={orderDtls.ord_tot_amt} />
				</div>
				<div className="row margin-top-25">
					<Link className="btn btn-primary  float-right" to="/store/myOrders">Back</Link>
					{orderDtls.order_status == 'Confirmed' && <button type="button" className="btn btn-danger float-right margin-right-10" onClick={() => cancelOrder(orderDtls.ord_no)}>Cancel Order</button>}
				</div>
	        </div>
		)
	
}

export default OrderDetails;
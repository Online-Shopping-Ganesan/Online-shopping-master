import React,{useEffect, useState} from "react";
import  Service from '../../services/Service.js';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';

const MyOrders = (props) => {
	  const [orderDtls, setOrderDtls] = useState({orderList:[], totalOrdersCnt: 0, lastOrderDisplayCnt: 0});
	  
	  useEffect(() => {
		  getOrders();
	  }, []);
	  
	  const getOrders = async (type) => {
		  const orderDtlsObj = orderDtls;
		  if(type == 'roload'){
			  orderDtlsObj.lastOrderDisplayCnt = 0;
			  orderDtlsObj.orderList = [];
		  }
		  const [response, errror] = await Service.getOrders(orderDtlsObj.lastOrderDisplayCnt);
		  if(errror){
			  toast.error(errror)
		  }else {
			  if(response.length > 0){
				  orderDtlsObj.orderList = orderDtlsObj.orderList.concat(response);
				  orderDtlsObj.totalOrdersCnt = response[0].cnt;
				  orderDtlsObj.lastOrderDisplayCnt =(orderDtlsObj.lastOrderDisplayCnt + response.length)
				  setOrderDtls({...orderDtlsObj});
			  }
		  }
	  }
	  
	  const cancelOrder = async (orderNo) => {
		  await Service.getCSRFToken();
		  const [response, errror] = await Service.cancelOrder(orderNo);
		  if(errror){
			  toast.error(errror)
		  }else if(response.updCnt == 0){
			  getOrders('roload');
		  }else if(response.last_update) {
			  const orderList = orderDtls.orderList;
			  orderList.forEach(row => {
				  if(row.ord_no == orderNo){
					  row.last_update = response.last_update;
					  row.order_status = 'Cancelled';
				  }
			  });
			  setOrderDtls({...orderDtls, orderList});
		  } else {
			  toast.error('Order cancelled failed')
		  }
	  }
	  
	  return (
		    <div id="my-order-list" className="col-md-9 col-sm-7">
		    	<h1>My Orders</h1>
				<div className="row margin-top-25">
				{(Array.isArray(orderDtls.orderList) && orderDtls.orderList.length > 0) ? orderDtls.orderList.map((row, index) => (
					<div key={'myOrder'+row.ord_no}>
					<div className="col-md-12 col-sm-7 margin-bottom-10">
						<h1>Order# <Link to={'/store/orderDtls/'+row.ord_no}>{row.ord_no}</Link></h1>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Confirmed:</label></div>
							<div className="col-md-9 col-sm-8">{new Date(row.date_of_creation).toDateString()+' '+new Date(row.date_of_creation).toLocaleTimeString()}</div>
						</div>
						{row.order_status != 'Confirmed' && 
							<div className="row">
								<div className="col-md-2 col-sm-4"><label>Order {row.order_status}:</label></div>
								<div className="col-md-6 col-sm-8">{new Date(row.last_update).toDateString()+' '+new Date(row.last_update).toLocaleTimeString()}</div>
							</div>	
						}
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Status:</label></div>
							<div className={(row.order_status == 'Cancelled' ? ' color-red ' : (row.order_status == 'Delivered' ? ' text-success ' : ''))+"col-md-6 col-sm-8"}>{row.order_status}</div>
						</div>
						<div className="row">
							<div className="col-md-2 col-sm-4"><label>Order Amount:</label></div>
							<div className="col-md-6 col-sm-8"><NumberFormat className="cart-price" value={row.ord_tot_amt} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
							{row.order_status == 'Confirmed' && <button type="button" className="btn btn-danger float-right mar-1" onClick={() => cancelOrder(row.ord_no)}>Cancel Order</button> }
						</div>
					</div>
					{(orderDtls.orderList.length -1) != index && <hr style={{border: 'solid 1px #ecebeb'}}  className="margin-top-10"/>}
					
					</div>)) : (<div className="col-md-12 col-sm-7 margin-bottom-10"> You have not placed any orders </div>) }
				
					{(Array.isArray(orderDtls.orderList) && orderDtls.orderList.length > 0 && orderDtls.totalOrdersCnt > orderDtls.lastOrderDisplayCnt) && <div className="col-md-9 col-sm-7"><button type="button" className="btn btn-primary" onClick={getOrders}>View More</button></div> }
				</div>	
	        </div>
		)
	
}

export default MyOrders;
	                    
	                    
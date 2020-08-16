import React from 'react';
import {Switch, Route, Redirect} from 'react-router';
import { BrowserRouter} from 'react-router-dom';

import MissingPage from '../MissingPage';
import PreHeader from '../assets/PreHeader';
import Header from '../assets/header/Header';
import Footer from '../assets/Footer';
import Sidebar from '../assets/sidebar/Sidebar';
import ProductList from '../maincomponents/productlist/ProductList';
import Loader from '../Loader';
import ProductDetail from '../maincomponents/ProductDetail';
import ShoppingCart from '../maincomponents/shoppingCart/ShoppingCart';
import Checkout from '../maincomponents/checkout/Checkout';
import Login from '../maincomponents/customer/Login';
import Register from '../maincomponents/customer/Register';
import Signout from '../maincomponents/customer/Signout';
import ForgotPassword from '../maincomponents/customer/ForgotPassword';
import OrderCreated from '../maincomponents/order/OrderCreated';
import MyOrders from '../maincomponents/order/MyOrders';
import OrderDetails from '../maincomponents/order/OrderDetails';

const Layout = ({ children, props }) => (
		<div>
		    <PreHeader/>
			<Header/>
				<div className="main">
				      <div className="container">
				        <div className="row margin-bottom-40 ">
				        	<Sidebar/>
				        	<Loader/>
			          	  	{children}
				        </div>
				     </div>
			    </div>
			<Footer/>
		</div>
);

export const PrivateRoute = ({ component: Component, ...rest }) => (
	    <Route {...rest} render = {props => (
	        localStorage.getItem('access-token')
	            ? <Component {...props} />
	            : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
	    )} />
)

export const OpenRoute = ({ component: Component, ...rest }) => (
	    <Route {...rest} render = {props => (
	        !localStorage.getItem('access-token')
	            ? <Component {...props} />
	            : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
	    )} />
)


const createRoutes = () => {
	
	
	return (
			<BrowserRouter>
				<Layout>
					  <Switch>
			              <Route exact path="/store/shoppingCart" component={ShoppingCart}  />
					  	  <Route exact path="/store/checkout" component={Checkout}  />
					  	  <Route exact path="/store/orderCreated" component={OrderCreated}  />
					  	  <Route exact path="/store/login" component={Login}  />
					  	  <OpenRoute exact path="/store/register" component={Register}  />
					  	  <PrivateRoute exact path="/store/myAccount" component={Register}  />
					  	  <PrivateRoute exact path="/store/myOrders" component={MyOrders}  />
					  	  <PrivateRoute exact path="/store/orderDtls/:orderNo" component={OrderDetails}  />
					  	  <OpenRoute exact path="/store/forgotPassword" component={ForgotPassword}  />
					  	  <Route exact path="/store/signout" component={Signout}  />
					  	  <Route exact path="/store/productDtl/:prodURL" component={ProductDetail}  />
					  	  <Route exact path="/:category?/:subCategory?" component={ProductList}  />
					  	  <Route exact  component={MissingPage} />
					</Switch>
		        </Layout>
		    </BrowserRouter>
	)
}

export default createRoutes;

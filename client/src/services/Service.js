import axios from 'axios';


const productService = {
	getAllProductListDtls: (searchQuery, type) => {
		let arr = [];
		if(type <= 2){
			const getProductCount = axios.get('getProductCount'+searchQuery);
			const getAllProducts = axios.get('getAllProducts'+searchQuery);
			arr = [...arr, getAllProducts, getProductCount];
		}
		if(type <= 1){
			const getAllBrands = axios.get('getAllBrands'+searchQuery);
			const getProductPriceMinAndMax = axios.get('getProductPriceMinAndMax'+searchQuery);
			arr = [...arr, getAllBrands, getProductPriceMinAndMax];
		}
		return axios.all(arr)
		.then(axios.spread((...responses) => { 
			const err = responses.filter(obj => obj.data.error);
			return err.length == 0 ? [responses, undefined] : [undefined, (err.map(obj => obj.data.data)).join(',')]
		}))
		.catch(errors => [undefined, 'Product List fetch failed'])
	},
	getCategoryAndBestSeller: () => {
		const getAllCategory = axios.get('getAllCategory');
		const getBestSellers = axios.get('getBestSellers');
		
		return axios.all([getAllCategory, getBestSellers])
		.then(axios.spread((...responses) => { 
			const err = responses.filter(obj => obj.data.error);
			return err.length == 0 ? [responses, undefined] : [undefined, (err.map(obj => obj.data.data)).join(',')]
		}))
		.catch(errors => [undefined, 'Category And Best Sellers fetch failed'])
	},
	getSingleProductDtls : (prodURL) => {
		return axios.get('getSingleProductDtls?prodURL='+prodURL)
		.then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.body, undefined]
		})
		.catch(errors => [undefined, 'Single Product fetch failed'])
	},
	getCSRFToken: () => {
		return axios.get('getCSRFToken').then(res => {
			axios.defaults.headers['csrf-token'] = res.data;
	    })
	},
	getCartItemsAndTotalPrice: (cartItems) => {
		let cartItemsArr = [], totalPrice = 0; 
		const cartItemKeys = Object.keys(cartItems);
		if(cartItemKeys.length > 0){
			cartItemKeys.map(obj => {
				let {prod_name, prod_img, prod_url, productSub} = cartItems[obj];
				Object.keys(productSub).forEach(id => {
					cartItemsArr.push({...productSub[id], prod_id: obj, prod_name, prod_img, prod_url, id});
					totalPrice += (productSub[id].prod_price*productSub[id].order_qty);
				});
			})
		}
		return {cartItemsArr, totalPrice}
	},
	customerLoginValidation: (customerLoginDtls) => {
		return axios.post('customerLoginValidation', {data: customerLoginDtls}).then(response => {
			if(response.data.token){
				axios.defaults.headers['Authorization'] =  `Bearer ${response.data.token}`;
			}
			return response.data.error ? [undefined, response.data.msg] : [response.data, undefined];
	    })
	    .catch(errors => [undefined, 'Customer login validation failed'])
	},
	getAllStates: () => {
		return axios.get('getAllStates').then(res => {
			return res.data.data;
	    })
	},
	customerRegisteration: (customerDtls, url) => {
		return axios.post(url, customerDtls).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.body, undefined];
	    }).catch((error) => {
			return [undefined, 'Customer registration failed'];
	    })
	},
	getCustomerDtls: (token) => {
		return axios.get('getCustomerDtls').then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.data, undefined];
	    }).catch((error) => {
			return [undefined, 'Invalid access token'];
	    })
	},
	signout: (props) => {
		localStorage.removeItem('access-token');
		delete axios.defaults.headers['Authorization'];
		props.setCustomerDtls({});
	},
	checkIsValidEmail: (email) => {
		return axios.post('checkIsValidEmail', {email}).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.msg, undefined];
	    }).catch((error) => {
			return [undefined, 'Invalid Eamil ID'];
	    })
	},
	checkIsValidToken: (token) => {
		return axios.get('checkIsValidToken?token='+token).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.msg, undefined];
	    }).catch((error) => {
			return [undefined, 'Invalid Token'];
	    })
	},
	updateCustomerPwd: (pswdDtls) => {
		return axios.post('updateCustomerPwd', {...pswdDtls}).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.msg, undefined];
	    }).catch((error) => {
			return [undefined, 'Invalid Eamil ID'];
	    })
	},
	customerAddressUpd: (customerDtls) => {
		return axios.post('customerAddressUpd', customerDtls).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.body, undefined];
	    }).catch((error) => {
			return [undefined, 'Customer address updation failed'];
	    })
	},
	getProdUpdatedPrices: (subProdIds) => {
		return axios.post('getProdUpdatedPrices', subProdIds).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.body, undefined];
	    }).catch((error) => {
			return [undefined, 'Get latest pice for product service is failed'];
	    })
	},
	createOrderByCustomer: (cartItems) => {
		return axios.post('createOrderByCustomer', {data: {cartItems: cartItems}}).then(response => {
			return response.data.error ? [undefined, response.data.msg, response.data.prodDtls] : [response.data.msg, undefined, undefined];
	    }).catch((error) => {
			return [undefined, 'Order creation failed', undefined];
	    })
	},
	createOrderByGuest: (data) => {
		return axios.post('createOrderByGuest', {data: data}).then(response => {
			return response.data.error ? [undefined, response.data.msg, response.data.prodDtls] : [response.data.msg, undefined, undefined];
	    }).catch((error) => {
			return [undefined, 'Order creation failed', undefined];
	    })
	},
	getOrders: (lastOrderDisplayCnt) => {
		return axios.get(`getOrders?lastOrderCnt=${lastOrderDisplayCnt}`).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.data, undefined];
	    }).catch((error) => {
			return [undefined, 'My orders fetch failed'];
	    })
	},
	cancelOrder: (orderNo) => {
		return axios.post('cancelOrder', {orderNo: orderNo}).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.data, undefined];
	    }).catch((error) => {
			return [undefined, 'Cancel Order failed'];
	    })
	},
	getOrderDetails: (orderNo) => {
		return axios.get(`getOrderDetails?orderNo=${orderNo}`).then(response => {
			return response.data.error ? [undefined, response.data.msg] : [response.data.data, undefined];
	    }).catch((error) => {
			return [undefined, 'Orders detail fetch failed'];
	    })
	},
}


export default productService;
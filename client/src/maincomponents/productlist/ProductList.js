import React, { useState, useEffect } from 'react';
import Products from './Products';
import ProductSort from './ProductSort';
import ProductPagination from './ProductPagination';
import EmptyProduct from './EmptyProduct';

import { connect } from 'react-redux';
import  * as ProductActions from '../../actions/ProductActions.js';
import  Service from '../../services/Service.js';
import { toast } from 'react-toastify';

const ProductList = (props) => {
	const pathname = props.location.pathname;
	const search = props.history.location.search;
	let isPathChgd = false;
	
	useEffect(() => {
		isPathChgd = true;
		const searchQuery = searchCriteria();
		props.getAllProductListDtls(searchQuery, 1);
	}, [pathname]);
	
	useEffect(() => {
		if(isPathChgd == false){
			const searchQuery = searchCriteria();
			props.getAllProductListDtls(searchQuery, 2);
		}
	}, [search]);
	
	
	const searchCriteria = () => {
			
			const category = props.match.params.category;
			const subCategory = props.match.params.subCategory;
			const params = new URLSearchParams(props.history.location.search);
			const limit = (process.env.REACT_APP_PROD_PER_PAGE_COUNT || 9);
			const brands = params.get('brands');
			const page = params.get('page') || 1;
			const price = params.get('price');
			const sort = params.get('sort') || 'newest';
			const order = params.get('order') || 'DESC';
			let queryString = "?";
			
			queryString += "offset="+((page - 1) * limit);
			queryString += "&limit="+limit;
			queryString += "&sort="+sort;
			queryString += "&order="+order;
			if(category){
				queryString += "&category="+category;
			}if(subCategory){
				queryString += "&subCategory="+subCategory;
			}if(brands){
				queryString += "&brands="+brands;
			}if(price){
				let arr = price.split('-');
				queryString += "&minPrice="+arr[0];
				queryString += "&maxPrice="+arr[1];
			}
			console.log('Hi props.location 44', queryString);
			return queryString;
	}
	
	return (
			
			<>
				<div className="col-md-9 col-sm-7">
		          <ProductSort/>
		          {/* BEGIN PRODUCT LIST */}
		          {props.products.length > 0 ? <Products products={props.products} cartItems={props.cartItems}/> : <EmptyProduct/>}
		          {/* END PRODUCT LIST */}
		          {/* BEGIN PAGINATOR */}
		          {props.products.length > 0 && <ProductPagination  products={props.products} count={props.count}/>}
		          {/* END PAGINATOR */}
		        </div>
		    </>
	)
	
}

const getAllProductListDtls = (searchQuery, type) => {
	return async function(dispatch, getState){
		dispatch(ProductActions.requestStart());
		const [response, errors]= await Service.getAllProductListDtls(searchQuery, type);
		if(errors == undefined){
			if(type <= 1){
				dispatch(ProductActions.getProductPriceMinAndMax(response[3].data.data[0]));
				const brands = response[2].data.data.map(obj => obj.ProductsBrand.name);
				dispatch(ProductActions.getAllBrands(brands));
				
			}
			if(type <= 2){
				dispatch(ProductActions.getProductCount(response[1].data.data));
				dispatch(ProductActions.getAllProducts(response[0].data.data));
			}
			dispatch(ProductActions.requestSuccess());
		}else{
			dispatch(ProductActions.requestFailure());
			toast.error(errors);
		}
			
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
	  products: state.ProductReducer.products,
	  count: state.ProductReducer.count,
	  cartItems: state.CartReducer,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
	  getAllProductListDtls: (searchQuery, type) => dispatch(getAllProductListDtls(searchQuery, type)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
    
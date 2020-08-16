import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import SidebarCategory from './SidebarCategory';
import SidebarFilters from './SidebarFilters';
import SidebarBestSellers from './SidebarBestSellers';

import { connect } from 'react-redux';
import  * as ProductActions from '../../actions/ProductActions.js';
import  Service from '../../services/Service.js';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';

const Sidebar = (props) => {
	const pathname = props.location.pathname;
	useEffect(() => {
		props.getCategoryAndBestSeller('', 0);
	}, []);
	
	return (
			
	        <div className="sidebar col-md-3 col-sm-4">{/* <Link to="/react-table">Data Table</Link> */}
	          	<SidebarCategory />
	          	{!pathname.includes('/store/') && <SidebarFilters  />}
	          	<SidebarBestSellers />
	        </div>
	)
}

const getCategoryAndBestSeller = (searchQuery, type) => {
	return async function(dispatch, getState){
		dispatch(ProductActions.requestStart());
		const [response, errors]= await Service.getCategoryAndBestSeller();
		if(errors == undefined){
			dispatch(ProductActions.getAllCategory(response[0].data.data));
			dispatch(ProductActions.getBestSellers(response[1].data.data));
			dispatch(ProductActions.requestSuccess());
		}else{
			dispatch(ProductActions.requestFailure());
			toast.error(errors);
		}
			
	}
}


const mapDispatchToProps = (dispatch) => {
	  return {
		  getCategoryAndBestSeller: (searchQuery, type) => dispatch(getCategoryAndBestSeller(searchQuery, type)),
	  }
};

export default connect(null, mapDispatchToProps)(withRouter(Sidebar));
    
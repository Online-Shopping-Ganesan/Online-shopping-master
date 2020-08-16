import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

const ProductPagination = (props) => {
	const count = Array.isArray(props.count) ? props.count[0].countValue : 1;
	const [pageDtls, setPageDtls] = useState({nav:[], currPageNo: 1, limit: (process.env.REACT_APP_PROD_PER_PAGE_COUNT || 9)});
	
	useEffect(() => {
		const params = new URLSearchParams(props.history.location.search);
		const pageNo = params.get('page') || 1;
		prepareNav(pageNo);
	}, [count]);
	
	const setPageNo = (pageNo) => {
		if(pageNo < 1){
			pageNo = 1;
		}else if(pageNo > Math.ceil(count/pageDtls.limit)){
			pageNo = Math.ceil(count/pageDtls.limit);
		}
		const pathname = props.location.pathname;
		const search = props.history.location.search;
		const params = new URLSearchParams(search);
		params.set('page', pageNo);
		props.history.push({pathname, search: (params).toString()});
		prepareNav(pageNo);
	}
	
	const prepareNav = (pageNo) => {
		var links = [];
		for(let i=0,j=1; i < count; i+=pageDtls.limit, j++){
			links.push(<li key={'nav'+j}><span className={(pageNo == j ? 'active ' : '')+'cursor'} onClick={() => setPageNo(j)}>{j}</span></li>);
	    }
		setPageDtls({...pageDtls, nav:links, currPageNo: pageNo});
	}
	
	
	return (
			
			<div className="row">
	          <div className="col-md-4 col-sm-4 items-info">Items {(pageDtls.limit*(parseInt(pageDtls.currPageNo)-1))+1} to {((pageDtls.limit*(parseInt(pageDtls.currPageNo)-1))+(props.products.length))} of {count} total</div>
	          <div className="col-md-8 col-sm-8">
	            <ul className="pagination pull-right">
	              <li><span className="cursor" onClick={() => setPageNo(parseInt(pageDtls.currPageNo)-1)}>&laquo;</span></li>
	              {pageDtls.nav}
	              <li><span className="cursor" onClick={() => setPageNo(parseInt(pageDtls.currPageNo)+1)}>&raquo;</span></li>
	            </ul>
	          </div>
	        </div>
	)
}

export default withRouter(ProductPagination);
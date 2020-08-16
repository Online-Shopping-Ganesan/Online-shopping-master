import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';

const ProductSort = (props) => {
	const [sort, setSort] = useState({sortBy: 'newest', order: 'ASC'});
	const pathname = props.location.pathname;
	
	useEffect(() => {
		const params = new URLSearchParams(props.history.location.search);
		const sortBy = params.get('sort') || 'newest';
		const order = params.get('order') || 'ASC';
		setSort({sortBy, order});
	}, [pathname]);
	
	const handleChange = (e) => {
		let value = e.target.value;
		if(value){
			value = value.split('|');
			setSort({sortBy: value[0], order:  value[1]});
			
			
			const search = props.history.location.search;
			const params = new URLSearchParams(search);
			params.set('sort', value[0]);
			params.set('order', value[1]);
			props.history.push({pathname, search: (params).toString()});
		}
	}
	
	return (
			
			  <div className="row list-view-sorting clearfix">
		        <div className="col-md-2 col-sm-2 list-view">
		          <a href="#"><i className="fa fa-th-large"></i></a>
		          <a href="#"><i className="fa fa-th-list"></i></a>
		        </div>
		        <div className="col-md-10 col-sm-10">
		          <div className="pull-right">
		            <label className="control-label">Sort&nbsp;By:</label>
		            <select className="form-control input-sm" value={sort.sortBy+'|'+sort.order} onChange={handleChange}>
		              <option value="newest|DESC">Newest Arrivals</option>
		              <option value="name|ASC">Name (A - Z)</option>
		              <option value="name|DESC">Name (Z - A)</option>
		              <option value="price|ASC">Price (Low - High)</option>
		              <option value="price|DESC">Price (High - Low)</option>
		            </select>
		          </div>
		        </div>
		      </div>
		)
}

export default withRouter(ProductSort);
    
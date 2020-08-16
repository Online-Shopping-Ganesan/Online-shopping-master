import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const SidebarFilterByBrands = (props) => {
	const [brand, setBrand] = useState([]);
	const pathname = props.location.pathname;
	
	useEffect(() => {
		const params = new URLSearchParams(props.history.location.search);
		const brands = params.get('brands');
		setBrand(brands ? [...(brands.split(','))]: []);
	}, [pathname]);
	
	const handleChange = (val) => {
		let brandArr = brand;
		brandArr.includes(val) ? (brandArr.splice(brandArr.indexOf(val), 1)) : (brandArr.push(val));
		setBrand([...brandArr]);
		const params = new URLSearchParams(props.history.location.search);
		brand.length ? params.set('brands', brand.join(',')) : params.delete('brands');
		params.set('page', 1);
		props.history.push({pathname, search: (params).toString()});
	}
	
	return (
		<>
			<h2>Filter</h2>
	        <h3>Brands</h3>
	        <div className="checkbox-list">
	        	{Array.isArray(props.brands) && props.brands.map(val => (
	        		<label key={'brand'+val}>
	        			<input type="checkbox" 
			        		value={val}
			                onChange={() => handleChange(val)} 
	        				checked={brand.includes(val)} />&nbsp;{val}
			                
			            </label>
	        	))}
	        </div>
		</>
	)
} 

const mapStateToProps = (state, ownProps) => {
	  return {
		  brands: state.ProductReducer.brands,
	  }
};

export default connect(mapStateToProps, null)(withRouter(SidebarFilterByBrands));
    
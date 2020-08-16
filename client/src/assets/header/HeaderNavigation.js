import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

const HeaderNavigation = (props) => {
		const categories = {};
		props.categories.forEach(row => {
			if(row.parent_id){
				categories[row.parent_id]['child'].push(row);
			}else{
				categories[row.id] = row;
				categories[row.id]['child'] = [];
			}
		});
		
		return (
			<div className="header-navigation">
	          <ul>
	          	{categories && Object.values(categories).map((row) => (
	          			<li key={row.name}><Link to={'/'+row.page_url}>{row.name}</Link>
	          				{row.child.length > 0 && 
	          				<ul className="dropdown-menu">
	          					{row.child.map((child) => (
					                <li key={child.name} className="dropdown-submenu"><Link to={'/'+row.page_url+'/'+child.page_url}>{child.name}</Link></li>
	          					))}
			                </ul> }
	          			</li>
	          	))}
	            
	          </ul>
			  
	        </div>
	)
}

const mapStateToProps = (state, ownProps) => {
  return {
	  categories: state.ProductReducer.categories,
  }
};


export default connect(mapStateToProps, null)(HeaderNavigation);
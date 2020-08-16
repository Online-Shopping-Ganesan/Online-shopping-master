import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

const SidebarCategory = (props) => {
	const [categories, setCategories] = useState({});
	
	useEffect(() => {
		if(Object.keys(categories).length == 0 && props.categories.length > 0){
			const cateObj = {};
			props.categories.forEach(row => {
				if(row.parent_id){
					cateObj[row.parent_id]['child'].push(row);
				}else{
					cateObj[row.id] = row;
					cateObj[row.id]['child'] = [];
					cateObj[row.id]['display'] = false;
				}
			});
			setCategories(cateObj);
		}
	}, [props.categories]);
	
	const updateCategory = (rowId) => {
		const obj = {...categories};
		obj[rowId].display = !obj[rowId].display;
		setCategories(obj);
	}
	
	return (
			
			  <ul className="list-group margin-bottom-25 sidebar-menu">
				  {categories && Object.values(categories).map((row) => (
						<li key={row.name} className={"list-group-item clearfix " + (row.child.length ? 'dropdown' : '')}>
					  	  <Link to={'/'+row.page_url} onClick={() => updateCategory(row.id)}><i className="fa fa-angle-right"></i>{row.name}</Link>
					  	  {row.child.length > 0 && 
					          <ul className="dropdown-menu" style={{display: (row.display ? 'block' : 'none')}}>
					  	  		{row.child.map((child) => (
					  	  			<li key={child.name}><Link to={'/'+row.page_url+'/'+child.page_url}><i className="fa fa-angle-right"></i>{child.name}</Link></li>
					  	  		))}
					          </ul> }
				        </li>
		          ))}
		      </ul>
		)
}
const mapStateToProps = (state, ownProps) => {
  return {
	  categories: state.ProductReducer.categories,
  }
};


export default connect(mapStateToProps, null)(SidebarCategory);
    
import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { Link } from "react-router-dom";

const SidebarBestSellers = (props) => (
		
	  <div className="sidebar-products  col-md-12 col-sm-12 clearfix">
        <h2>Bestsellers</h2>
        {Array.isArray(props.bestSeller) && props.bestSeller.map(row => (
        	<div key={'bestSeller'+row.id} className="item">
                <Link to={'/store/productDtl/'+row.prod_url}><img src={'/public/uploads/products/thumbnail/'+row.prod_img} alt={row.prod_name} /></Link>
                <h3><Link to={'/store/productDtl/'+row.prod_url}>{row.prod_name}</Link></h3>
                <div className="price"><NumberFormat value={row.ProductsSubs[0].prod_price} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
            </div>	
        ))}
        
      </div>
)
const mapStateToProps = (state, ownProps) => {
  return {
	  bestSeller: state.ProductReducer.bestSeller,
  }
};


export default connect(mapStateToProps, null)(SidebarBestSellers);
    
import React from 'react';


const Products = (props) => {
	
	return (
			
			<>
				<div className="row product-list">
		        
				<div className="col-md-4 col-sm-6 col-xs-12">
		          <div className="product-item">
		            <div className="pi-img-wrapper">
		              <img src={'/public/uploads/products/thumbnail/empty_product.png'} height="300" className="img-responsive" alt='Empty Product' />
		            </div>
		           </div>
		        </div>
		        
		      </div>
		    </>

	)
}

export default Products;
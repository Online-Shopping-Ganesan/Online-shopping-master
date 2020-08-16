import React,{useState, useEffect} from "react";
import { connect } from 'react-redux';
import  * as ProductActions from '../actions/ProductActions.js';
import  * as CartActions from '../actions/CartActions.js';
import  Service from '../services/Service.js';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';

 
const ProductDetail = (props) => {
  const prodURL = props.match.params.prodURL;
  const [productDtl, setProductDtl] = useState({product:{}, productSize:{}, quanity: 1, prodSizeIndex: 0});
  
  useEffect( () => {
	  getSingleProductDtls(prodURL)
  }, [prodURL]);
  
  useEffect( () => {
	  setProductDtl({...productDtl, quanity: 1});
  }, [productDtl.product.prod_name, productDtl.prodSizeIndex]);
  
  const getSingleProductDtls = async (prodURL) => {
	  const [response, errors]= await Service.getSingleProductDtls(prodURL);
	  if(errors == undefined){
	  	  props.requestSuccess();
	  	  setProductDtl({...productDtl, product:response, productSize:response.ProductsSubs[0], prodSizeIndex:0});
	  	  document.title = response.prod_name; 
	  	  document.getElementsByTagName("META")[4].content= response.prod_meta_desc;
	  	  document.getElementsByTagName("META")[5].content= response.prod_meta_keyword;
	  }else{
		  props.requestFailure();
		  toast.error(errors);
	  }
  }
  
  const updateProductSize = (e) => {
	  const value = e.target.value;
	  setProductDtl({...productDtl, productSize: productDtl.product.ProductsSubs[value], prodSizeIndex: value});
  }
  
  const addToCart = () => {
	  const productSbu = productDtl.product.ProductsSubs[productDtl.prodSizeIndex];
	  if(productDtl.quanity <= productSbu.prod_avail_qty){
		  props.updateCartItems({...productDtl.product.ProductsSubs[productDtl.prodSizeIndex], 'prod_id':productDtl.product.id, 'prod_name': productDtl.product.prod_name, 'prod_img': productDtl.product.prod_img, 'prod_url': productDtl.product.prod_url, 'order_qty': productDtl.quanity});
	  } else{
		  toast.error(`Proudct have only left ${productSbu.prod_avail_qty}`);
	  }
  }
  
  return (
		  <div className="col-md-9 col-sm-7">
          {productDtl.product.prod_name && <div className="product-page">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div className="product-main-image">
                  <img src={'/public/uploads/products/thumbnail/'+productDtl.product.prod_img} alt={productDtl.product.prod_name} className="img-responsive"/>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <h1>{productDtl.product.prod_name}</h1>
                <div className="price-availability-block clearfix">
                  <div className="price">
                    <strong><NumberFormat value={productDtl.productSize.prod_price} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></strong>
                  </div>
                  <div className="availability">
                    Availability: <strong>{productDtl.productSize.prod_avail_qty > 0 ? 'In Stock' : <span className="color-red">Out of Stock</span>}</strong>
                  </div>
                </div>
                <div className="description">
                  <p>Brand : {productDtl.product.ProductsBrand.name}</p>
                </div>
                <div className="product-page-options">
                  <div className="pull-left">
                    <label className="control-label">Size:</label>
                    <select className="form-control input-sm" value={productDtl.prodSizeIndex} onChange={updateProductSize}>
                      {productDtl.product.ProductsSubs.map((row, index) => (<option key={'size'+row.prod_size} value={index}>{row.prod_size}</option>))}
                    </select>
                  </div>
                </div>
                {productDtl.productSize.prod_avail_qty > 0 && 
                <div className="product-page-cart">
	                <div className="product-quantity">
		                <input type="number" className="col-md-12 col-sm-12 padding-2" value={productDtl.quanity} onChange={(e) => setProductDtl({...productDtl, quanity: e.target.value})} min="1" max={productDtl.productSize.prod_avail_qty}  />
		            </div>
		            <button className="btn btn-primary" type="button" onClick={() => addToCart()}>Add to cart</button>
	            </div>}
                
                
              </div>

              <div className="product-page-content">
                <ul id="myTab" className="nav nav-tabs">
                  <li className="active"><a href="#Description" data-toggle="tab">Description</a></li>
                </ul>
                <div id="myTabContent" className="tab-content">
                  <div className="tab-pane fade in active" id="Description">
                    <p>{productDtl.product.prod_desc}</p>
                  </div>
                </div>
              </div>

              <div className="sticker sticker-sale"></div>
            </div>
          </div>}
        </div>
   );
}

const mapDispatchToProps = (dispatch) => {
	  return {
		  requestSuccess: () => dispatch(ProductActions.requestSuccess()),
		  requestFailure: () => dispatch(ProductActions.requestFailure()),
		  updateCartItems: 	  (addToCartItem) => dispatch(CartActions.updateCartItems(addToCartItem)),
	  }
};

export default connect(null, mapDispatchToProps)(ProductDetail);
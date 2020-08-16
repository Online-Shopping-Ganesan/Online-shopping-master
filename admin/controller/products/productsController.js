const productsModel = require("../../model/products/productsModel");
const fs = require('fs');

module.exports = {
	getProductsList: function(req, res) {
	   productsModel.getProductsList((err, rows) => {
		   	if(!err && rows && typeof rows == 'object'){
		    	res.render('products/productsList', {data: rows });
		    } else{
		    	res.render('products/productsList', { error: err });
		    }
		});
    },
    createNewProducts: function(req, res) {
    	productsModel.getBrandsAndCategoryList((response) => {
    		response.body = {};
    		res.render('products/createProduct', response);
	    });
    },
    createOrUpdateProducts: function(req, res) {
    	productsModel.createOrUpdateProducts(req, res, (response) => {
    		if(response && response.error && req.file && req.file.path){
				fs.unlink(req.file.path,function(err){
			        if(err) return console.log(err);
			    });
			}
			productsModel.getBrandsAndCategoryList((brands) => {
				if(response.error === false && !req.body.id){
					response.body = {};
				}
				res.render('products/createProduct', {...brands, ...response});
    	    });
	    });
    },
    deleteProducts: function(req, res) {
    	const productId = parseInt(req.body.productId);
    	if(Number.isInteger(productId)){
    		productsModel.deleteProducts(productId, (response) => {
    			if(response.error === true){
    				res.render('products/productsList', { error: response.msg  });
    		    } else{
    		    	res.redirect('/admin/productsList/');
    		    }
    	    });
    	}else{
    		res.render('products/productsList', { error: 'Opps something went wrong!'  });
    	}
    },
    editProduct: function(req, res) {
	    productsModel.getSingleProduct(req.params.id, (response) => {
	   		if(response.error === true){
	   			return res.redirect('/admin/logout');
	   		}
	   		const body = response.body;
	   		body.ProductsSubs.forEach(function(obj){
	   			if(!body.prod_size){
	   				body.prod_size = [];
	   			}
	   			if(!body.prod_avail_qty){
	   				body.prod_avail_qty = [];
	   			}if(!body.prod_price){
	   				body.prod_price = [];
	   			}
	   			body.prod_size.push(obj.prod_size);
	   			body.prod_avail_qty.push(obj.prod_avail_qty);
	   			body.prod_price.push(obj.prod_price);
	   		})
	   		productsModel.getBrandsAndCategoryList((brands) => {
    			res.render('products/createProduct', {...brands, ...response});
    	    });
	    });
	},
	getAllProducts: function(req, res) {
	   productsModel.getAllProducts(req, (responses) => {
		   res.json(responses);
		});
    },
    getAllCategory: function(req, res) {
  	   productsModel.getAllCategory((responses) => {
  		   res.json(responses);
  		});
     },
     getBestSellers: function(req, res) {
	   productsModel.getBestSellers((responses) => {
		   res.json(responses);
		});
     },
     getProductPriceMinAndMax: function(req, res) {
	   productsModel.getProductPriceMinAndMax(req, (responses) => {
		   res.json(responses);
		});
    },
    getProductCount: function(req, res) {
	   productsModel.getProductCount(req, (responses) => {
		   res.json(responses);
		});
    },
    getAllBrands: function(req, res) {
  	   productsModel.getAllBrands(req, (responses) => {
		   res.json(responses);
		});
    },
    getSingleProductDtls: function(req, res) {
    	productsModel.getSingleProduct(req.query, (responses) => {
    	   res.json(responses);
 		});
    },
    getCSRFToken: function(req, res) {
    	const token = req.csrfToken(); 
    	res.send(token);
    },
    getProdUpdatedPrices:  function(req, res) {
    	productsModel.getProdUpdatedPrices(req.body, (responses) => {
     	   res.json(responses);
  		});
    },
      
}
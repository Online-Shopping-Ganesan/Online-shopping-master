const Products = require("../../tblMapping/Products");
const ProductsCate = require("../../tblMapping/ProductsCate");
const ProductsBrand = require("../../tblMapping/ProductsBrand");
const ProductsSub = require("../../tblMapping/ProductsSub");
const AdminUser = require("../../tblMapping/AdminUser");
const bcrypt = require('bcrypt');
const { Op, Sequelize, fn, col, transaction, literal, QueryTypes} = require("sequelize");
const saltRounds = process.env.CRYPT_SALT;

const { check, validationResult } = require('express-validator');
const multer  = require('multer');
const path = require('path');
const sharp = require("sharp");
const validate = require('../../middleware/validate');
const common = require('../../common.js');

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./client/public/uploads/products/") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
});

const maxSize = 3000000; //Max 3 MB

var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
        const err = "File upload only supports the " + "following filetypes - " + filetypes;
        req.fileValidationError = err;
        cb(err); 
    }  
}).single('prod_img');

module.exports = {
  getProductsList(callback) {
	 Products
    .findAll({ 
    	 include: [{
		    model: ProductsCate,
		    required: true,
		    attributes: [['name', 'cateName']]
		},
		{
	        model: ProductsBrand, 
	        required: true,
	        attributes: [['name', 'brandName']],
	    },
	    {
	        model: AdminUser, 
	        as: 'createdBy',
	        required: true,
	        attributes: [[fn('CONCAT', col('f_name'), ' ', col('l_name')), 'createdByName']] 
	    }],
		attributes: ['id', 'prod_name', 'prod_desc', 'created_by', 'active'],
    })
    .then(rows => {
    	 if (!rows) {
    		 callback('Products List fetching issue..');
	     } else {
	    	 callback(null, rows)
	     }
    }).catch(err => {
    	callback('Opps something went wrong!');
    });
  },
  getSingleProduct: function(query, callback) {
	  const product = { 
		    	include: [{
				    model: ProductsSub,
				    required: true,
				    attributes: ['id','prod_size', 'prod_avail_qty', 'prod_price']
		    	}] 
	      }
	  if(query > 0){
		  product.where = { id: query };
		  product.attributes = ['id', 'prod_cate_id', 'prod_name', 'prod_desc', 'prod_url', 'prod_meta_keyword', 'prod_meta_desc', 'prod_img', 'prod_brand_id', 'created_by', 'updated_by', 'active'];
	  }else{
		  const queryString = query;
		  product.where = { prod_url: (queryString.prodURL || ''), active: 1 };
		  product.attributes = ['id', 'prod_cate_id', 'prod_name', 'prod_desc', 'prod_url', 'prod_meta_keyword', 'prod_meta_desc', 'prod_img', 'prod_brand_id', 'created_by'];
		  product.include.push({
		        model: ProductsBrand, 
		        required: true,
			    attributes: ['name']
		  })
	  }
	  Products
	    .findOne(product)
      .then(row => {
    	 if (!row) {
    		 callback({error: true, msg:'Invalid Data'});
	     } else {
	    	 callback({error: false, msg:null, body: row})
	     }
      }).catch(err => {
    	 callback({error: true, msg:'Opps something went wrong!'});
      });
  },
  getBrandsAndCategoryList(callback) {
	 const prodBrands = ProductsBrand.findAll();
	 const prodCate = ProductsCate.findAll({attributes: ['id', 'name']});
	 Promise
	    .all([prodBrands, prodCate])
	    .then(responses  => {
	    	 if (!responses ) {
	    		 callback({error: true, msg: 'Brand & Category List fetching issue..'});
		     } else {
		    	 callback({error: false, brands: responses[0], category: responses[1], size: this.getProductSize()});
		     }
	    }).catch(err => {
	    	callback({error: true, msg: 'Opps something went wrong!'});
	    });
   },
   getProductSize(){
	   return ['S', 'M', 'L', 'XL', 'XXL'];
   },
   findByProductName(value, id, prod_brand_id){
	   return  id > 0 ? Products.count({ where: {prod_brand_id, id: {[Op.not]:id}, $col: Sequelize.where(  fn('lower', col('prod_name')),  fn('lower', value))}  }) : Products.count({ where: {prod_brand_id, $col: Sequelize.where(  fn('lower', col('prod_name')),  fn('lower', value))}  });
   },
   createOrUpdateProducts(req, res, callback){
	    upload(req, res, async (err) => {
	    	let errMsg = {error: false, msg:'', body: req.body};
	    	const {id, prod_cate_id, prod_brand_id, prod_name, prod_desc, prod_meta_keyword, prod_meta_desc, prod_size, prod_avail_qty, prod_price, active} = req.body;
	    	
	        if(req.fileValidationError) {
	        	callback({...errMsg, error: true, msg: req.fileValidationError});
	        }else if(err) {
	        	callback({...errMsg, error: true, msg: err});
	        }else if(!req.file && !id) {
	        	callback({...errMsg, error: true, msg: "Image should not be empty"});
	        }else{
	        	await Promise.all(validate('validateProduct').map(validation => validation.run(req)));

	            const errors = validationResult(req);
	            if (!errors.isEmpty()){
	            	 errors.errors.map(err => errMsg.msg += err.msg+"<br />");
                	 callback({...errMsg, error: true});
                }else{
                	this.findByProductName(prod_name, id, prod_brand_id).then(async (user) =>  {
	            		if (user) {
	            			callback({...errMsg, error: true, msg: 'Product Name already in use for this Brand'});
            		    } else {
            		    	const productsSubDtl = {}, prodSize = this.getProductSize();
            		    	prod_size.forEach((obj, index) => {
            		    		if(prodSize.includes(obj) && !Object.keys(productsSubDtl).includes(obj) && prod_avail_qty[index] && prod_price[index]){
            		    			const qtyVal = parseInt(prod_avail_qty[index]);
            		    			const priceVal = parseFloat(prod_price[index]);
            		    			if(qtyVal > 0 && qtyVal < 100000 && priceVal > 0 && priceVal < 10000000){
            		    				productsSubDtl[obj] = {prod_size: obj, prod_avail_qty: qtyVal, prod_price: priceVal};
            		    			}
            		    		}
            		    	});
            		    	const userId = req.session.user ? req.session.user.id : 1;
            		    	let brandName = await ProductsBrand.findOne({ where: { id: prod_brand_id }, attributes: ['name']  });
            		    	brandName = brandName.get('name');
            		    	let prodUrl = prod_name.replace(/[^a-zA-Z0-9 +]/g, "").replace(/\s\s+/g, ' ');
            		    	prodUrl = (brandName.split(' ').join('_') +'_'+ prodUrl.split(' ').join('_')).toLowerCase();
            		    	
            		    	let updateObj = { 
   		    					prod_cate_id: parseInt(prod_cate_id),
   						    	prod_brand_id: parseInt(prod_brand_id),
   						    	prod_name:  common.ucwords(prod_name),
   						    	prod_desc,
   						    	prod_meta_keyword,
   						    	prod_meta_desc,
   						    	prod_url: prodUrl,
   						    	created_by: userId,
   						    	updated_by: userId,
   						     	active: active == 'on' ? 1: 0,
            		    	};
            		    	if(req.file && req.file.filename){
            		    		await sharp(req.file.path)
			    			        .resize(560, 780)
			    			        .toFormat("jpeg")
			    			        .jpeg({ quality: 90 })
			    			        .toFile(`client/public/uploads/products/thumbnail/${req.file.filename}`);
			    			    updateObj.prod_img = req.file.filename;
       		    			}
            		    	if(Object.keys(productsSubDtl).length > 0){
            		    		let t = await req.con.transaction();
            		    		 try {
            		    			 let product;
            		    			 if(id > 0){
            		    				 product = await Products.update(updateObj, { where: { id }, transaction: t });
            		    				 await ProductsSub.destroy({ where: { prod_id: id }  }, { transaction: t });
            		    			 }else{
            		    				 product = await Products.create(updateObj, { transaction: t });
            		    			 }
	            		    		 
            		    			 const productsSubArr = [];
     	   						     productsSubArr.push(Object.values(productsSubDtl).map(function(obj){
     	   						    	return {...obj, prod_id: (id || product.id)}
     	   						     }));
     	   						     await ProductsSub.bulkCreate(productsSubArr[0], { individualHooks: true, transaction: t });
     	   						     await t.commit();
     	   						     
     	   						     callback({...errMsg, error: false, msg:'Product '+(id > 0 ? 'updated' : 'created')+' successfully'});
            		    		 }catch (error) {
            		    			 if (t) await t.rollback();
	   						     	 callback({...errMsg, error: true, msg:'Product '+(id > 0 ? 'updation' : 'creation')+' failed'+error});
            		    		 }
            		    	} else{
            		    		callback({...errMsg, error: true, msg:'Invalid Product Quantity and Pricing details.'});
            		    	}
            		    	
            		    	
            		    }
            		}).catch(err => {
            			callback({...errMsg, error: true, msg: err});
            		})
                }
	        }
	   })
   },
   deleteProducts: function(id, callback) {
	   Products
	    .destroy({ 
	    	where: { id } 
       })
       .then(rowId => {
    	  if(rowId > 0)
    		  callback({error: false, msg:'Deleted Sucessfully'});
    	  else
    		  callback({error: true, msg:'Deletion Failed'});
       }).catch(err => {
    	  callback({error: true, msg:'Opps something went wrong!'});
       });
   },
   async getAllProducts(req, callback) {
	    let msg = '';
	    await Promise.all(validate('validateProductQueryParam').map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()){
        	 errors.errors.map(err => msg += err.msg+", ");
        	 callback({error: true, data: msg});
        }else{
        	const queryString = req.query;
        	/*const product = { 
    		    	include: [{
    				    model: ProductsSub,
    				    required: true,
    				    attributes: ['prod_price', 'prod_size', 'prod_avail_qty'],
    				},
    		    	{
    				    model: ProductsCate,
    				    required: true,
    				    attributes: []
    				},
    				{
    			        model: ProductsBrand, 
    			        required: true,
    				    attributes: []
    			    }],
    		    	attributes: ['id', 'prod_name', 'prod_img', 'prod_url', 'active', 'date_of_creation', 'prod_cate_id'],
    		    	where: { active: 1 } ,
    		    	group: ['id']
    		    }
        	
        	if(queryString.subCategory){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = "${queryString.subCategory}")`)}
        	}else if(queryString.category){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = "${queryString.category}")`)}
        	}
        	
        	if(queryString.brands){
        		const brands = queryString.brands.split(',');
        		product.include[2].where = {'name': {[Op.in]: brands}};
        	}
        	const minPrice = parseFloat(queryString.minPrice || 0);
        	const maxPrice = parseFloat(queryString.maxPrice || 0);
        	if(minPrice >= 0 && maxPrice >= 5){
        		product.include[0].where = {};
        		product.include[0].where.prod_price = { [Op.between]: [minPrice, maxPrice] }
        	}
        	
        	if(queryString.sort == 'newest'){
        		product.order =  [ ['date_of_creation', queryString.order] ]
        	} else if(queryString.sort == 'name'){
        		product.order =  [ ['prod_name', queryString.order] ]
        	} else if(queryString.sort == 'price'){
        		product.order =  [ ['ProductsSubs', 'prod_price', queryString.order] ]
        	}
        	
        	product.offset = parseInt(queryString.offset);
        	product.limit  = parseInt(queryString.limit);
        	
        	Products
		    .findAll(product)
		    .then(rows => {
		    	callback({error: false, data: rows});
		    }).catch(err => {console.log(err)
		    	callback({error: true, data: 'Product fetching failed'});
		    });*/
        	
        	let queryStr = "Select pt.id AS prod_id, pt.prod_name, pt.prod_url, pt.prod_img, pt.active, pt.date_of_creation, pst.id, if(pst.prod_price > 0, min(pst.prod_price), (select min(prod_price) from products_sub_tbl where prod_id = pt.id)) as prod_price, pst.prod_size, pst.prod_avail_qty " +
        			"from products_tbl pt LEFT Join products_sub_tbl pst ON pst.prod_id=pt.id AND pst.prod_avail_qty > 0 " +
        			"Inner Join products_cate_tbl pct ON pct.id = pt.prod_cate_id " +
        			"Inner Join products_brand_tbl pbt ON pbt.id = pt.prod_brand_id where pt.active = :active " ;
        	
        	let queryObj = {active: 1};
        	
        	if(queryString.subCategory){
        		queryStr += "AND pt.prod_cate_id IN (SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = :page_url) ";
        		queryObj.page_url = queryString.subCategory;
        	}else if(queryString.category){
        		queryStr += "AND pt.prod_cate_id IN (SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = :page_url) ";
        		queryObj.page_url = queryString.category;
        	}
        	
        	if(queryString.brands){
        		queryStr += "AND pbt.name IN (:brands) ";
        		queryObj.brands = queryString.brands.split(',');
        	}
        	const minPrice = parseFloat(queryString.minPrice || 0);
        	const maxPrice = parseFloat(queryString.maxPrice || 0);
        	if(minPrice >= 0 && maxPrice >= 5){
        		queryStr += "AND pst.prod_price between :minPrice AND  :maxPrice ";
        		queryObj.minPrice = minPrice;
        		queryObj.maxPrice = maxPrice;
        	}
        	
        	queryStr += " GROUP BY pt.id ORDER BY ";
        	if(queryString.sort == 'newest'){
        		queryStr += " pt.date_of_creation ";
        	} else if(queryString.sort == 'name'){
        		queryStr += " pt.prod_name ";
        	} else if(queryString.sort == 'price'){
        		queryStr += " pst.prod_price ";
        	}
        	queryStr +=  queryString.order+" LIMIT "+ parseInt(queryString.limit) +" OFFSET "+parseInt(queryString.offset)
        	//console.log("Hi 1234: "+queryStr);
        	
        	const rows = await req.con.query(queryStr, { replacements: queryObj, type: QueryTypes.SELECT });
        	callback({error: false, data: rows});
        }
	},
	getAllCategory(callback) {
		ProductsCate
	    .findAll()
	    .then(rows => {
	    	callback({error: false, data: rows});
	    }).catch(err => {
	    	callback({error: true, data: 'Category fetching failed'});
	    });
	},
	getBestSellers(callback) {
		Products
	    .findAll({
	    	include: [{
			    model: ProductsSub,
			    required: true,
			    attributes: ['prod_price', 'prod_size', 'prod_avail_qty'],
			    order:  [ ['prod_price', 'ASC'] ]
	    	}],
	    	attributes: ['id', 'prod_name', 'prod_img', 'prod_url', 'active'],
	    	offset: 0, 
	    	limit: 3,
	    	group: ['id'],
	    	
	    })
	    .then(rows => {
	    	callback({error: false, data: rows});
	    }).catch(err => {
	    	callback({error: true, data: 'Best Sellers fetching failed'});
	    });
	},
	async getProductPriceMinAndMax(req, callback){
		let msg = '';
	    await Promise.all(validate('validateProductQueryParam').map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()){
        	 errors.errors.map(err => msg += err.msg+", ");
        	 callback({error: true, data: msg});
        }else{
        	const queryString = req.query;
        	const product = { 
    		    	include: [{
    				    model: ProductsSub,
    				    required: true,
    				    attributes: [],
    				},{
    				    model: ProductsCate,
    				    required: true,
    				    attributes: [],
    				}],
    		    	attributes: [[fn('min', col('ProductsSubs.prod_price')), 'minValue'], [fn('max', col('ProductsSubs.prod_price')), 'maxValue']],
    		    	where: { active: 1 },
    		    }
        	
        	if(queryString.subCategory){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = "${queryString.subCategory}")`)}
        	}else if(queryString.category){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = "${queryString.category}")`)}
        	}
        	
        	
        	Products
		    .findAll(product)
		    .then(rows => {
		    	callback({error: false, data: rows});
		    }).catch(err => {console.log(err)
		    	callback({error: true, data: 'Product fetching failed'});
		    });
        }
	},
	async getProductCount(req, callback){
		let msg = '';
	    await Promise.all(validate('validateProductQueryParam').map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()){
        	 errors.errors.map(err => msg += err.msg+", ");
        	 callback({error: true, data: msg});
        }else{
        	const queryString = req.query;
        	/*const product = { 
    		    	include: [{
    				    model: ProductsSub,
    				    required: true,
    				    attributes: [],
    				    offset: 1,
    				    limit: 0,
    				},
    		    	{
    				    model: ProductsCate,
    				    required: true,
    				    attributes: []
    				},
    				{
    			        model: ProductsBrand, 
    			        required: true,
    				    attributes: []
    			    }],
    		    	attributes: [[fn('count', col('*')), 'countValue']],
    		    	where: { active: 1 },
    		    }
        	
        	if(queryString.subCategory){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = "${queryString.subCategory}")`)}
        	}else if(queryString.category){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = "${queryString.category}")`)}
        	}
        	
        	if(queryString.brands){
        		const brands = queryString.brands.split(',');
        		product.include[2].where = {'name': {[Op.in]: brands}};
        	}
        	const minPrice = parseFloat(queryString.minPrice || 0);
        	const maxPrice = parseFloat(queryString.maxPrice || 0);
        	if(minPrice >= 0 && maxPrice >= 5){
        		product.include[0].where = {};
        		product.include[0].where.prod_price = { [Op.between]: [minPrice, maxPrice] }
        	}
        	
        	Products
		    .findAll(product)
		    .then(rows => {
		    	callback({error: false, data: rows});
		    }).catch(err => {console.log(err)
		    	callback({error: true, data: 'Product Count fetching failed'});
		    });*/
        	
        	let queryObj = {active: 1};
        	let queryStr = "Select count(*) as countValue " +
			"from products_tbl pt Inner Join (Select prod_id from products_sub_tbl ";
        	
        	const minPrice = parseFloat(queryString.minPrice || 0);
			const maxPrice = parseFloat(queryString.maxPrice || 0);
			if(minPrice >= 0 && maxPrice >= 5){
				queryStr += " where prod_price between :minPrice AND  :maxPrice ";
				queryObj.minPrice = minPrice;
				queryObj.maxPrice = maxPrice;
			}
			queryStr += " group by prod_id) AS pst ON pst.prod_id=pt.id " +
        	"Inner Join products_cate_tbl pct ON pct.id = pt.prod_cate_id " +
			"Inner Join products_brand_tbl pbt ON pbt.id = pt.prod_brand_id where pt.active = :active " ;
	
			if(queryString.subCategory){
				queryStr += "AND pt.prod_cate_id IN (SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = :page_url) ";
				queryObj.page_url = queryString.subCategory;
			}else if(queryString.category){
				queryStr += "AND pt.prod_cate_id IN (SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = :page_url) ";
				queryObj.page_url = queryString.category;
			}
			
			if(queryString.brands){
				queryStr += "AND pbt.name IN (:brands) ";
				queryObj.brands = queryString.brands.split(',');
			}
			
			const rows = await req.con.query(queryStr, { replacements: queryObj, type: QueryTypes.SELECT });
			callback({error: false, data: rows});
        }
	},
	async getAllBrands(req, callback){
		let msg = '';
	    await Promise.all(validate('validateProductQueryParam').map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()){
        	 errors.errors.map(err => msg += err.msg+", ");
        	 callback({error: true, data: msg});
        }else{
        	const queryString = req.query;
        	const product = { 
    		    	include: [{
    				    model: ProductsCate,
    				    required: true,
    				    attributes: [],
    				},
    				{
    			        model: ProductsBrand, 
    			        required: true,
    				    attributes: ['name']
    			    }],
    			    attributes: ['id'],
    		    	where: { active: 1 },
    		    	group: 'ProductsBrand.id'
    		    }
        	
        	if(queryString.subCategory){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT id FROM products_cate_tbl cate1 WHERE cate1.page_url = "${queryString.subCategory}")`)}
        	}else if(queryString.category){
        		product.where.prod_cate_id = {[Op.in]: literal(`(SELECT cate2.id FROM products_cate_tbl AS cate INNER JOIN products_cate_tbl as cate2 ON cate.id = cate2.parent_id OR cate.id = cate2.id WHERE cate.page_url = "${queryString.category}")`)}
        	}
        	
        	
        	Products
		    .findAll(product)
		    .then(rows => {
		    	callback({error: false, data: rows});
		    }).catch(err => {console.log(err)
		    	callback({error: true, data: 'Product fetching failed'});
		    });
        }
	},
	getProdUpdatedPrices: function(subProdIds, callback) {
		console.log('Hi subProdIds', subProdIds);
		ProductsSub
	    .findAll({where: {id :{[Op.in]: subProdIds}}, attributes: ['id', 'prod_price']})
	    .then(row => {
	    	if (!row) {
	    		callback({error: true, msg:'Invalid Data'});
		    } else {
		    	callback({error: false, msg:null, body: row})
		    }
     	}).catch(err => {
     		callback({error: true, msg:'Opps something went wrong!'});
     	});
	},
}
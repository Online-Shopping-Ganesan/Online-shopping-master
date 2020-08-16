const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
	let token = req.header('authorization');
	if (token) {
		token = token.split(' ')[1];
	    // verifies secret and checks exp
	    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
	        if (err) {
	            return res.status(401).json({"error": true, "msg": 'Unauthorized access.' });
	        }
	      req.id = decoded.id;
	      next();
	    });
	  } else {
	    return res.status(403).json({
	        "error": true,
	        "msg": 'No token provided.'
	    });
	}
};

module.exports = verifyToken;
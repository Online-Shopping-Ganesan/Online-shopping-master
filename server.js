const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const con = require("./config/db.js")
const cors = require('cors')
const session = require('express-session');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
	  secret: 'LoxodontaElephasMammuthusPalaeoloxodonPrimelephas',
	  resave: true,
	  saveUninitialized: true,
	  cookie: {
		  maxAge: (3 * 24 * 60 * 60 * 1000),
	  }
}));

app.use(cookieParser());
app.use(csurf({ cookie: true }));

app.use(methodOverride('X-HTTP-Method')) //          Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) //      IBM

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method;
    
    return method
  } 
}))

app.use(function(req, res, next) {
	req.con = con;
	app.locals.csrfToken = req.csrfToken();
	if(req.session){
		res.locals.user = req.session.user;
	}
	next()
});

app.set("views", path.join(__dirname+"\\admin\\", "views"))

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs")
app.use(session({
	  secret: 'xxx1234xxx',
	  resave: false,
	  saveUninitialized: true,
	  cookie: { secure: false }
}));







const adminRouter = require("./admin/routes/route");
const clientRouter = require("./admin/routes/clientRoute")

//routing
app.use("/admin/", adminRouter);

app.use("/", clientRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

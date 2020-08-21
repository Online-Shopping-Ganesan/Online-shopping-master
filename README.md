# Online-shopping-master
<h3>Technology Stack:</h3>
<ol>
<li>React 16.13.1</li>
<li>Redux 4.0.5</li>
<li>Redux Thunk 2.3.0</li>
<li>MySQL</li>
<li>Express JS 4.17.1</li>
<li>ejs 3.1.3</li>
</ol>

<h3>Project Summary:</h3>
<b>Admin Page</b>
<p>The Admin Page has privileges to Add Admin/Non-Admin users, add Products, change order status, view Dashboard of Users and Orders. 
Non-Admin users are considered Sales Users, who don’t have access to Admin User Details. They can edit / delete, products owned or added by them.</p>
<b>Client Page</b>
<p>This is a minimalistic Shopping Website, where users can create an Order to purchase available clothing. Users can filter product based on Brand, Price range. User can cancel the order, if not delivered, with Payment mode as Cash-On-Delivery.</p>

 
<h3>Technical Specification</h3>
<b>Admin Page</b>

<ol>
<li>Authentication: The application uses Session based authentication, without which the user cannot access any page. The user is redirected to the Login page by default to provide the credentials.</li>
<li>CSRF token is used to validate if the request is being sent from a valid form in the application and to prevent un-authorized request from a REST Client.</li>
<li>Ejs: Used as templating Engine.</li>
<li>Express Validator: Acts as a Middleware to validate the request inputs from the user. This performs a Server-Side validation and no validations are being performed in the Client side.</li>
<li>Multer: Used for file upload and product page.</li>
<li>Nodemailer: Used to send email.</li>
<li>Sharp: Used to compress the image size.</li>
<li>Sequelize: Used to ORM.</li>
</ol>
<b>Client page</b>
<ol>
<li>The application is built using React JS.</li>
<li>Redux and Redux-thunk are used for the Common Store.</li>
<li>Axios : used to communicate with the REST API services.</li>
<li>Toastify : to display Messages Stack (Error / Warning / Success).</li>
<li>Jsonwebtoken : The token from backend is being saved in the local storage for a valid user, after user is logged in the application. The token is being sent in the request headers for authentication.</li>
<li>Babel compiler : Used to render the Application in IE11, for ES6 features.</li>
</ol>

<h3>Installation Steps:</h3>
<ol>
<li>Install NPM and MySQL.
<li>Download the Project files. DB files is not included in the project files.</li>
<li>Perform npm install in the project folder and the client subfolder.</li>
<li>Default Port for Admin Page is 5000, and can be accessed at http://localhost:5000/admin </li>
<li>Default Port for Client Page is 8080, and can be accessed at http://localhost:8080/</li>
<li>Replace index.js file in “\node_modules\csurf” with file provided in \etc folder.</li>
<li>For Mail setup, please configure GMAIL User Name and password in .env file</li>
<li>For DB configuration, please configure in config/db.js file</li>
</ol>


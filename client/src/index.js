import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import '../public/assets/pages/css/css.css';
import '../public/assets/pages/css/font-css.css';

import '../public/assets/plugins/font-awesome/css/font-awesome.min.css';
import '../public/assets/plugins/bootstrap/css/bootstrap.min.css';
import '../public/assets/plugins/fancybox/source/jquery.fancybox.css';
import '../public/assets/plugins/owl.carousel/assets/owl.carousel.css';
import '../public/assets/pages/css/style-shop.css';
import '../public/assets/pages/css/style.css';
import '../public/assets/pages/css/style-responsive.css';
//import '../public/assets/pages/css/jquery-ui.css';
import '../public/assets/pages/css/VPyEor.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

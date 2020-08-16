import React from 'react';
import axios from 'axios';
import {Provider} from 'react-redux';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import {ToastContainer} from 'react-toastify';
import createRoutes from './route/route.js';
import configureStore from './store/store.js';

const store = configureStore(applyMiddleware(thunk));
/*
store.subscribe(() => {
	console.log('subscribed for counter actions', store.getState());
});*/

axios.defaults.baseURL = 'http://localhost:5000/';
axios.defaults.headers = {"Access-Control-Allow-Origin": "*", post: {}, 'Cache-Control': 'no-cache', 'Pragma': 'no-cache',  'Expires': '0'};
axios.defaults.headers['Authorization'] = 'Bearer '+(localStorage.getItem('access-token') || '');
axios.defaults.timeout = 10000;

function App() {
  const routes = createRoutes();
  return (
	<React.StrictMode>
		<Provider store={store}>
			<ToastContainer />
		    <div className="App">
		    	{routes}
		    </div>
		</Provider>
	</React.StrictMode>
  );
}

export default App;

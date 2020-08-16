import React from "react";
import { connect } from 'react-redux';
 
const Loader = (props) => {
  
 
  return (
		  <>
		  	{props.loading && <div id="cover-spin"></div>}
		  </>
   );
}

const mapStateToProps = (state, ownProps) => {
  return {
	  loading: state.ProductReducer.loading,
  }
};

export default connect(mapStateToProps, null)(Loader);
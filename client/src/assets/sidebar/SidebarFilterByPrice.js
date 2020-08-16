import React, {useState, useEffect} from 'react';
import InputRange from 'react-input-range';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
let prevMinValue = 0, prevMaxValue = 0;

const SidebarFilterByBrands = (props, history) => {
	const [value, setValue] = useState({min: 0, max: 0});
	const [priceRange, setPriceRange] = useState({minValue: 0, maxValue: 0});
	
	
	useEffect(() => {
		let minValue = props.price.minValue, maxValue = props.price.maxValue
		minValue = (minValue && minValue > 0) ? parseInt(minValue) : 0;
		maxValue = (maxValue && maxValue > 0) ? parseInt(maxValue) : 500;
		setPriceRange( {...priceRange, minValue, maxValue} );
		setValue( {...value, min: minValue, max: maxValue} );
	}, [props.price.maxValue, props.price.minValue]);
	
	const handleOnChange = (value) => {
		let min = value.min, max = value.max;
		min = (min && min > 0) ? parseInt(min) : priceRange.minValue;
		max = (max && max > 0) ? parseInt(max) : priceRange.maxValue;
		
		setValue( {min, max} );
		
	}
	
	const handleChangeComplete = (value) => {
		const pathname = props.location.pathname;
		const params = new URLSearchParams(props.history.location.search);
		params.set('price', value.min+'-'+value.max);
		params.set('page', 1);
		props.history.push({pathname, search: (params).toString()});
	}
	return (
			<>
				
					<h3>Price</h3>
			        <div>
			          <label htmlFor="amount">Range:</label>
			          {value.max && 
				          <InputRange
					          draggableTrack
					          minValue={priceRange.minValue || 0}
				          	  maxValue={priceRange.maxValue || 500}
					          step={10}
					          onChange={value => handleOnChange(value)}
					          onChangeComplete={value => handleChangeComplete(value)}
					          value={value} />
				          }
			        </div>
		       
		        
			</>
		)
			
}
const mapStateToProps = (state, ownProps) => {
  return {
	  price: state.ProductReducer.price,
  }
};


export default connect(mapStateToProps, null)(withRouter(SidebarFilterByBrands));
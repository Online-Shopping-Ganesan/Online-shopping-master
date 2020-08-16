import React from 'react';

const MissingPage = (props) => {
	props.history.push({pathname : "/", state: "wrongURL"});
	return "";
}
		


export default MissingPage;
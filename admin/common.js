module.exports = {
	ucwords: function(str){
	  return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
	  });
	}	
}
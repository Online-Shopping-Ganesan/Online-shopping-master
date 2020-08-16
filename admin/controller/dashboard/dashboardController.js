const dashboardModel = require("../../model/dashboard/dashboardModel")

module.exports = {
	getDashboardCnt: function(req, res) {
	   dashboardModel.getDashboardCnt((responses) => {
		   res.render('dashboard', responses);
		})
    }
}
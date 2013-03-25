window.App = {};
App.newStats = {};

App.getStats = function(){
	$.getJSON("/stats", function(data){
		newStats = data;
	})
}


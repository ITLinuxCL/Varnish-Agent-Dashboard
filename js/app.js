window.App = {};
App.refreshTime = 1000;
App.oldStats = {};
App.newStats = {};

App.getStats = function(){
	$.getJSON("/stats", function(data){
		App.oldStats = App.newStats;
		App.newStats = data;
	})
}

App.calcHitRatio = function(){
	delta_client_req = App.newStats.client_req.value - App.oldStats.client_req.value;
	delta_cache_hit = App.newStats.cache_hit.value - App.oldStats.cache_hit.value;
	hitRatio = (delta_cache_hit*100)/delta_client_req;
	return hitRatio;
}

App.updateHitRatio = function(){
	$("#hit-ratio").html("<h1>"+App.calcHitRatio()+"</h1>");
}

App.updateData = function(){
	App.getStats();
	App.updateHitRatio();
}

$(function(){

	setInterval(App.updateData,App.refreshTime);
	
});

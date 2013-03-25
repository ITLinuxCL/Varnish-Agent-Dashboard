window.App = {};
App.refreshTime = 2000;
App.oldStats = {};
App.newStats = {};

App.getStats = function(){
	$.getJSON("/stats", function(data){
		App.oldStats = App.newStats;
		App.newStats = data;
	})
}

App.calcHitRatio = function(){
	hitRatio = (App.newStats.cache_hit.value*100)/App.newStats.client_req.value;
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

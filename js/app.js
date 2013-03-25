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

App.updateHitRatio = function(){
	$("#hit-ratio").text(App.newStats.cache_hit.value);
}

App.updateData = function(){
	App.getStats;
	App.updateHitRatio();
}

$(function(){

	setInterval(App.updateData,App.refreshTime);
	
});

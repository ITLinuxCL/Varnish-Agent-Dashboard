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
	delta_client_req = App.newStats.client_req.value - App.oldStats.client_req.value;
	delta_cache_hit = App.newStats.cache_hit.value - App.oldStats.cache_hit.value;
	hitRatio = (delta_cache_hit*100)/delta_client_req;
	return Math.round(hitRatio);
}

App.updateHitRatio = function(){
	
	App.hitRatioGauge.refresh(App.calcHitRatio());
	//$("#hit-ratio").html("<h1>"+App.calcHitRatio()+"</h1>");
}

App.updateData = function(){
	App.getStats();
	App.updateHitRatio();
	App.builMetricsTable("cache", App.getCacheMetrics());
	App.builMetricsTable("traffic", App.getCacheMetrics());
	App.builMetricsTable("backend", App.getCacheMetrics());
}

App.getCacheMetrics = function() {
	var hits_ratio = {
		label: "Hits Ratio",
		new_value: App.calcHitRatio(),
		average_value: App.calcHitRatio()
	}
	var hits_qty = {
		label: "Hits Qty.",
		new_value: App.newStats.cache_hit.value,
		average_value: App.oldStats.cache_hit.value
	}
	var miss_qty = {
		label: "Miss Qty.",
		new_value: App.newStats.cache_miss.value,
		average_value: App.oldStats.cache_miss.value
	}
	var obj_cache = {
		label: "Objs. in Cache",
		new_value: App.newStats.n_object.value,
		average_value: App.oldStats.n_object.value
	}
	return [hits_ratio, hits_qty, miss_qty, obj_cache]
}

App.builMetricsTable = function(table_id, values_object){
	var source   = $("#metrics-table-template").html();
	var context = { metric: values_object};
	var template = Handlebars.compile(source);
	var html = template(context);
	$("#"+table_id+"-metrics-table").html(html);
}

$(function(){
	App.hitRatioGauge = new JustGage({
	    id: "hit-ratio", 
	    value: 0, 
	    min: 0,
	    max: 100,
	    title: " ",
		label: "%"
	  });
	setInterval(App.updateData,App.refreshTime);
	
});

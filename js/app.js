window.App = {};
App.refreshTime = 1000;
App.requestMaxValue = 0;
App.bandwidthMaxValue = 0;
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

App.calcAverageHitRatio = function(){
	hitRatio = App.newStats.cache_hit.value * 100 / App.oldStats.client_req.value;
	return Math.round(hitRatio);
}

App.updateHitRatioGauge = function(){
	App.hitRatioGauge.refresh(App.calcHitRatio());
}

App.updateRequestGauge = function() {
	requests_per_second = App.newStats.client_req.value - App.oldStats.client_req.value;
	if(requests_per_second > App.requestMaxValue){
		App.requestMaxValue = requests_per_second;
	}
	App.requestGauge.refresh(requests_per_second, App.requestMaxValue);
}

App.updateBandwidthGauge = function(){
	bandwidth = (App.newStats.s_hdrbytes.value + App.newStats.s_bodybytes.value) - (App.oldStats.s_hdrbytes.value + App.oldStats.s_bodybytes.value);
	if(bandwidth > App.bandwidthMaxValue){
		App.bandwidthMaxValue = bandwidth;
	}
	App.bandwidthGauge.refresh(bandwidth, nFormatter(App.bandwidthMaxValue));
}

App.updateData = function(){
	App.getStats();
	App.updateHitRatioGauge();
	App.updateRequestGauge();
	App.updateBandwidthGauge();
	App.builMetricsTable("cache", App.getCacheMetrics());
	App.builMetricsTable("traffic", App.getTrafficMetrics());
	App.builMetricsTable("backend", App.getBackendMetrics());
}

App.getCacheMetrics = function() {
	var hits_ratio = {
		label: "Hits Ratio",
		new_value: App.calcHitRatio(),
		average_value: App.calcAverageHitRatio()
	}
	var hits_qty = {
		label: "Hits Qty.",
		new_value: nFormatter(App.newStats.cache_hit.value - App.oldStats.cache_hit.value),
		average_value: nFormatter(App.newStats.cache_hit.value / App.newStats.uptime.value)
	}
	var miss_qty = {
		label: "Miss Qty.",
		new_value: nFormatter(App.newStats.cache_miss.value - App.oldStats.cache_miss.value),
		average_value: nFormatter(App.newStats.cache_miss.value / App.newStats.uptime.value)
	}
	var obj_cache = {
		label: "Objs. in Cache",
		new_value: nFormatter(App.newStats.n_object.value - App.oldStats.n_object.value),
		average_value: nFormatter(App.newStats.n_object.value)
	}
	return [hits_ratio, hits_qty, miss_qty, obj_cache]
}

App.getTrafficMetrics = function() {
	var client_conn = {
		label: "Connections",
		new_value: nFormatter(App.newStats.client_conn.value - App.oldStats.client_conn.value),
		average_value: nFormatter(App.newStats.client_conn.value / App.newStats.uptime.value)
	}
	var client_req = {
		label: "Requests",
		new_value: nFormatter(App.newStats.client_req.value - App.oldStats.client_req.value),
		average_value: nFormatter(App.newStats.client_req.value / App.newStats.uptime.value)
	}
	var req_per_conn = {
		label: "Req / Conn",
		new_value: nFormatter((App.newStats.client_req.value - App.oldStats.client_req.value) /(App.newStats.client_conn.value - App.oldStats.client_conn.value) ),
		average_value: nFormatter(App.newStats.client_req.value / App.newStats.client_conn.value)
	}
	
	var bandwith = {
		label: "Bandwidth",
		new_value: nFormatter((App.newStats.s_hdrbytes.value + App.newStats.s_bodybytes.value) - (App.oldStats.s_hdrbytes.value + App.oldStats.s_bodybytes.value)),
		average_value: nFormatter((App.newStats.s_hdrbytes.value + App.newStats.s_bodybytes.value) / App.newStats.uptime.value)
	}
	
	return [client_conn, client_req, req_per_conn, bandwith]
	
}

App.getBackendMetrics = function() {
	var backend_conn = {
		label: "Connections",
		new_value: nFormatter(App.newStats.backend_conn.value - App.oldStats.backend_conn.value),
		average_value: nFormatter(App.newStats.backend_conn.value / App.newStats.uptime.value)
	}
	var backend_fail = {
		label: "Fails",
		new_value: nFormatter(App.newStats.backend_fail.value - App.oldStats.backend_fail.value),
		average_value: nFormatter(App.newStats.backend_fail.value / App.newStats.uptime.value)
	}
	var backend_reuse = {
		label: "Reuse",
		new_value: nFormatter(App.newStats.backend_reuse.value - App.oldStats.backend_reuse.value),
		average_value: nFormatter(App.newStats.backend_reuse.value / App.newStats.uptime.value)
	}
	var backend_fetch = {
		label: "Fetch & Pass",
		new_value: nFormatter(App.newStats.s_pass.value + App.newStats.s_fetch.value - App.oldStats.s_fetch.value - App.oldStats.s_pass.value),
		average_value: nFormatter((App.newStats.s_pass.value + App.newStats.s_fetch.value) / App.newStats.uptime.value)
	}
	return [backend_conn, backend_fetch, backend_fail, backend_reuse]
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
	 	levelColors: ["#f70000","#f9c800","#a8d600"],
	    min: 0,
	    max: 100,
	    title: " ",
		label: "%"
	  });
	
	App.requestGauge = new JustGage({
	    id: "request-gauge", 
	    value: 0, 
	    min: 0,
	    max: 100,
	    title: " ",
		label: "per second"
	  });
	
	App.bandwidthGauge = new JustGage({
	    id: "bandwidth-gauge", 
	    value: 0, 
	    min: 0,
	    max: function(max){return 200},
	    title: " ",
		label: "per second"
	  });
	
	setInterval(App.updateData,App.refreshTime);
	
});


function nFormatter(num) {
     if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
     }
     if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
     return Math.round(num);
}
window.VarnishDashboard = Ember.Application.create({});

VarnishDashboard.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('content', ['red', 'yellow', 'blue']);
  }
});

VarnishDashboard.ApplicationController = Ember.Controller.extend({
	first: "Tom",
	last: "Brand"
});

VarnishDashboard.Store = DS.Store.extend({
	revision: 11,
	url: "http://localhost:6085",
	adapter: "DS.RESTAdapter"
});

VarnishDashboard.Stat = DS.Model.extend({
	
});

DS.RESTAdapter.reopen({
	url: "http://localhost:6085",
	// buildURL: function(record, suffix) {
	//     var s = this._super(record, suffix);
	//     return s + "?callback=?";
	//   }
	ajax: function (url, type, hash) {
	     hash.url = url;
         hash.type = type;
         hash.dataType = 'json';
         hash.contentType = 'application/json; charset=utf-8';
         hash.context = this;

         if (hash.data && type !== 'GET') {
             hash.data = JSON.stringify(hash.data);
         }

         jQuery.ajax(hash).done = function(msg) {
			alert("Recibido");
		};
     },
});
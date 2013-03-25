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
	timestamp: DS.attr('date'),
	
});

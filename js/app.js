window.App = Ember.Application.create({});

App.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('content', ['red', 'yellow', 'blue']);
  }
});

App.ApplicationController = Ember.Controller.extend({
	first: "Tom",
	last: "Brand"
});

App.Store = DS.Store.extend({
	revision: 11,
	url: "http://localhost:6085",
	adapter: "DS.RESTAdapter"
});


App.Stat = DS.Model.extend({
	timestamp: DS.attr('string'),	
});


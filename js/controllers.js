var postcatApp = angular.module('postcatApp', ['infinite-scroll']);

postcatApp.controller('PostListCtrl', ['$scope', '$http', 'Danbooru', function($scope, $http, Danbooru) {
	
	var maybetag = window.location.hash.slice(1);
	if (maybetag.length > 1) {
		$scope.tagName = maybetag;
	}
	$scope.danbooru = new Danbooru($scope.tagName);
	$scope.withTag = function() {
		$scope.danbooru = new Danbooru($scope.tagName);
		$scope.danbooru.nextPage();
	};
}]);

// Danbooru constructor function to encapsulate HTTP and pagination logic
postcatApp.factory('Danbooru', ['$http', function($http) {
	var Danbooru = function(tag) {
		this.tag = tag;
		this.next_cursor = undefined;
		this.items = [];
		this.busy = false;
	};

	Danbooru.prototype.nextPage = function() {
		if (this.busy) return;
		this.busy = true;

		var url = '/danbooru2/post';
		var joiner = '?'
		if (this.tag != undefined && this.tag.length > 0) {
			url = '/danbooru2/post?tag=' + encodeURIComponent(this.tag);
			joiner = '&';
		}
		if (this.next_cursor != undefined) {
			url = url + joiner + 'cursor=' + encodeURIComponent(this.next_cursor);
		}
		console.log('apply with url: ' + url);
		$http.get(url).success(function(data) {
			for (var i = 0; i < data.results.length; i += 1) {
				this.items.push(data.results[i]);
			}
			this.next_cursor = data.left_cursor;
			this.busy = false;
		}.bind(this));
	};

	return Danbooru;
}]);

app.controller('indexController', function($scope, $window, $http, $filter, notificationFactory, failureHandling, $location, apiHelpers, navigationFactory) {

	$scope.isLoading = true;

	//Navigation objects
	$scope.navigationObjectModel = [];
	$scope.navigationEngines = [];
	$scope.navigationAdapters = [];

	$scope.expandObjects = false;
	$scope.expandEngine = false;
	$scope.expandAdapter = false;

	$scope.objects = [];
	$scope.methods = [];
	$scope.adapters = [];

	$scope.displaySearch = true;
	$scope.displayResults = false;

	$scope.mainSearch = {
		searchTerm : "",
	};

	$scope.searchResults = [];
	$scope.loadingSearch = false;

	$scope.runningSearch = false;

	$scope.displayMobileObjectNavSetting = false;
	$scope.displayMobileEngineNavSetting = false

	$scope.handleFailure = function(response)
	{
		$scope.isLoading = false;
		failureHandling.handleFailure(response, $window);
	};

	$scope.displayMobileObjectNav = function()
	{
		navigationFactory.displayMobileObjectNav($scope);
	};

	$scope.displayMobileEngineNav = function()
	{
		navigationFactory.displayMobileEngineNav($scope);
	};

	$scope.goHome = function()
	{
		$scope.isLoading = true;
		$window.location.href = "/api";
	};

	$scope.showObjects = function()
	{
		$scope.expandObjects = !$scope.expandObjects;
	};

	$scope.showEngine = function()
	{
		$scope.expandEngine = !$scope.expandEngine;
	};

	$scope.showAdapter = function()
	{
		$scope.expandAdapter = !$scope.expandAdapter;
	};

	$scope.goToObjectNamespace = function(namespace)
	{
		$window.location.href = "object.html#!?namespace=" + namespace.name;
	};

	$scope.goToEngineNamespace = function(engine)
	{
		$window.location.href = "engine.html#!?engine=" + engine.name;
	};

	$scope.goToAdapterNamespace = function(adapter)
	{
		alert("Not done, sorry");
	};

	$scope.surpriseMe = function()
	{
		var random = (Math.random() * 10);
		if(random > 5)
		{
			//Randomly for an engine
			var item = $scope.methods[Math.floor(Math.random() * $scope.methods.length)];
			$window.location.href = "engine.html#!?engine=" + item.namespace + "&method=" + item.memberName;
		}
		else
		{
			//Randomly for an object
			var item = $scope.objects[Math.floor(Math.random() * $scope.objects.length)];
			$window.location.href = "object.html#!?namespace=" + item.namespace + "&object=" + item.memberName;
		}
	};

	$scope.displayNamespaceSplit = function(namespace)
	{
		return apiHelpers.displayNamespaceSplit(namespace);
	};

	$scope.$on('$locationChangeSuccess', function (a, newUrl, oldUrl) {
		$scope.isLoading = true;

		$scope.setUpNavigation();

		var term = $location.search().search;
		$scope.mainSearch.searchTerm = term;
		$scope.runSearch();
	});

	$scope.setUpNavigation = function()
	{
		$http.get('js/adapter.json').then(function(response) {
			$scope.adapters = response.data;

			var adapterNames = [];

			$scope.adapters.forEach(function(obj) {
				var ns = obj.namespace;
				if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
					ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

				if(adapterNames.indexOf(ns) == -1)
					adapterNames.push(ns);
			});

			adapterNames.sort();

			adapterNames.forEach(function(item) {
				$scope.navigationAdapters.push({name: item, isVisible: false});
			});

			$http.get('js/methods.json').then(function(response) {
				$scope.methods = response.data;

				var engineNames = [];

				$scope.methods.forEach(function(obj) {
					var ns = obj.namespace;
					if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
						ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

					if(engineNames.indexOf(ns) == -1)
						engineNames.push(ns);
				});

				engineNames.sort();

				engineNames.forEach(function(item) {
					$scope.navigationEngines.push({name: item, isVisible: false});
				});

				$http.get('js/objects.json').then(function(response) {
					$scope.objects = response.data;

					var objectNames = [];
					$scope.objects.forEach(function(obj) {
						var ns = obj.namespace;
						if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
							ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

						if(objectNames.indexOf(ns) == -1)
							objectNames.push(ns);
					});

					objectNames.sort();

					objectNames.forEach(function(item) {
						$scope.navigationObjectModel.push({name: item, isVisible: false});
					});

					$scope.isLoading = false;
					$scope.runSearch();
				}, function(response) {
					$scope.handleFailure(response);
				});
			}, function(response) {
				$scope.handleFailure(response);
			});
		}, function(response) {
			$scope.handleFailure(response);
		});
	};

	$scope.changeSearchTerm = function()
	{
		if($scope.mainSearch.searchTerm == "")
			$location.search('search', null);
		else
			$location.search('search', $scope.mainSearch.searchTerm);
	};

	$scope.runSearchKeyPress = function($event)
	{
		if($event.keyCode == 13)
			$scope.changeSearchTerm(); //Code 13 = enter key pressed
	};

	$scope.runSearch = function()
	{
		if($scope.mainSearch.searchTerm == "")
		{
			$scope.runningSearch = false;
			$scope.loadingSearch = false;
			$scope.displaySearch = true;
			$scope.displayResults = false;
			return;
		}

		$scope.runningSearch = true;
		$scope.loadingSearch = true;

		var foundItems = [];

		var term = $scope.mainSearch.searchTerm;
		term = term.toLowerCase();

		$scope.objects.forEach(function(item) {
			var name = item.memberName.toLowerCase();

			if(name.includes(term))
			{
				item.itemType = 1;
				foundItems.push(item);
			}
		});

		$scope.methods.forEach(function(item) {
			var name = item.memberName.toLowerCase();

			if(name.includes(term))
			{
				item.itemType = 2;
				foundItems.push(item);
			}
		});

		foundItems.sort(function(a, b) {
			var aName = a.memberName.toLowerCase();
			var bName = b.memberName.toLowerCase();

			return aName.indexOf(term) - bName.indexOf(term);
		});

		$scope.searchResults = foundItems;

		$scope.loadingSearch = false;
		$scope.displaySearch = false;
		$scope.displayResults = true;
	};

	$scope.goToResult = function(result)
	{
		if(result.itemType == 1)
		{
			//Object result
			$window.location.href = "object.html#!?namespace=" + result.namespace + "&object=" + result.memberName;
		}
		else if (result.itemType == 2)
		{
			//Method result
			$window.location.href = "engine.html#!?engine=" + result.namespace + "&method=" + result.memberName;
		}
	};
});
app.controller('methodController', function($scope, $window, $http, $filter, notificationFactory, failureHandling, $location, apiHelpers) {

	$scope.isLoading = true;

	//Navigation objects
	$scope.navigationObjectModel = [];
	$scope.navigationEngines = [];
	$scope.navigationAdapters = [];

	$scope.expandObjects = false;
	$scope.expandEngine = false;
	$scope.expandAdapter = false;

	//oM specific methods
	$scope.currentMethod = {};
	$scope.currentEngine = {};

	$scope.displayEngine = false;
	$scope.displayEngineMethod = false;

	$scope.adapters = [];
	$scope.methods = [];
	$scope.objects = [];

	$scope.displayMobileObjectNavSetting = false;
	$scope.displayMobileEngineNavSetting = false

	$scope.handleFailure = function(response)
	{
		$scope.isLoading = false;
		failureHandling.handleFailure(response, $window);
	};

	$scope.goHome = function()
	{
		$scope.isLoading = true;
		$window.location.href = "/api";
	};

	$scope.displayMobileObjectNav = function()
	{
		navigationFactory.displayMobileObjectNav($scope);
	};

	$scope.displayMobileEngineNav = function()
	{
		navigationFactory.displayMobileEngineNav($scope);
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

	$scope.goToMethod = function(method)
	{
		$location.search('method', method.memberName);
		$scope.navigationEngines.forEach(function(item) {
			item.isVisible = false;
			if(item.name.includes(method.namespace))
				item.isVisible = true;
		});
	};

	$scope.goToObjectNamespace = function(namespace)
	{
		$window.location.href = "object.html#!?namespace=" + namespace.name;
	};

	$scope.displayEngineMethods

	$scope.goToEngineNamespace = function(engine)
	{
		$scope.setLocationNull();
		$location.search('engine', engine.name);
		$scope.navigationEngines.forEach(function(item) {
			item.isVisible = false;
			if(item.name.includes(engine.name))
				item.isVisible = true;
		});
	};

	$scope.goToAdapterNamespace = function(adapter)
	{
		alert("Not done, sorry");
	};

	$scope.setLocationNull = function()
	{
		$location.search('engine', null);
		$location.search('method', null);
	};

	$scope.setDisplayMethod = function()
	{
		$scope.setAllViewsFalse();
		$scope.displayEngineMethod = true;
	};

	$scope.setDisplayEngine = function()
	{
		$scope.setAllViewsFalse();
		$scope.displayEngine = true;
	};

	$scope.setAllViewsFalse = function()
	{
		$scope.displayEngine = false;
		$scope.displayEngineMethod = false;
	};

	$scope.displayObjectProperties = function(object)
	{
		object.displayProperties = !object.displayProperties;
	};

	$scope.displayEngineMethods = function(engine)
	{
		engine.showEngineMethods = !engine.showEngineMethods;
	};

	$scope.displayAdapterMethods = function(object)
	{
		object.displayAdapters = !object.displayAdapters;
	};

	$scope.displayMethodInputs = function(method)
	{
		method.displayInputs = !method.displayInputs;
	};

	$scope.displayMethodOutputs = function(method)
	{
		method.displayOutputs = !method.displayOutputs;
	};

	$scope.displayNamespaceSplit = function(namespace)
	{
		return apiHelpers.displayNamespaceSplit(namespace);
	};

	$scope.$on('$locationChangeSuccess', function (a, newUrl, oldUrl) {
		$scope.isLoading = true;

		if($scope.objects.length == 0)
			$scope.setUpNavigation(); //First time load

		$scope.navigationEngines.forEach(function(item) {
			item.isVisible = false;
			if(item.name.includes($location.search().engine))
				item.isVisible = true;
		});

		$scope.read_Engine();
	});

	$scope.goToObject = function(object)
	{
		if(object.isInterface == 1) return;

		$window.location.href = "object.html#!?namespace=" + object.namespace + "&object=" + object.memberName;
	};

	$scope.groupMethodsByClass = function(array) {
		var arr = [];

		array.forEach(function(obj) {
			var ns = obj.className;
			if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
				ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

			if(arr[ns] == undefined)
				arr[ns] = [];

			arr[ns].push(obj);
		});

		var tuples = [];

		for (var key in arr) tuples.push([key, arr[key]]);

		tuples.sort(function(a, b) {
			a = a[0];
			b = b[0];
			if(a < b) return -1;
			if(a > b) return 1;
			return 0;
		});

		tuples.forEach(function(obj) {
			obj[1].sort(function(a, b) {
				if(a.memberName < b.memberName) return -1;
				if(a.memberName > b.memberName) return 1;
				return 0;
			});
		});

		return tuples;
	};

	$scope.showHideNamespace = function(object)
	{
		if(object.canView == undefined)
			object.canView = false;
		
		object.canView = !object.canView;
	};

	$scope.showHideMethodInputs = function(object)
	{
		if(object.canViewInputs == undefined)
			object.canViewInputs = false;
		
		object.canViewInputs = !object.canViewInputs;
	};

	$scope.read_Engine = function()
	{
		var engine = $location.search().engine;
		var method = $location.search().method;

		if($scope.methods.length == 0) return;
		
		if(method == null)
		{
			$scope.currentEngine = null;

			if(engine != null && engine != undefined)
			{
				$scope.currentEngine = { methods: [], name : "" };

				var methods = [];
				$scope.methods.filter(function(obj) {
					if(obj.namespace.includes(engine))
						methods.push(obj);
				});

				if(apiHelpers.nthIndexOf(engine, '.', 3) != -1)
					engine = engine.substring(0, apiHelpers.nthIndexOf(engine, '.', 3));

				var groupedMethods = $scope.groupMethodsByClass(methods, engine);
				$scope.currentEngine.name = engine;
				$scope.currentEngine.methods = groupedMethods;
			}

			$scope.setDisplayEngine();
			$scope.isLoading = false;
		}
		else
		{
			$scope.methods.forEach(function(obj) {
				var ns = obj.namespace;
				if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
					ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

				if(ns == engine && obj.memberName == method)
					$scope.currentMethod = obj;
			});

			$scope.setDisplayMethod();
			$scope.isLoading = false;
		}
	};

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
					
					$scope.read_Engine();
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
});
app.controller('objectController', function($scope, $window, $http, $filter, notificationFactory, failureHandling, $location, apiHelpers) {

	$scope.isLoading = true;

	//Navigation objects
	$scope.navigationObjectModel = [];
	$scope.navigationEngines = [];
	$scope.navigationAdapters = [];

	$scope.expandObjects = false;
	$scope.expandEngine = false;
	$scope.expandAdapter = false;

	//oM specific methods
	$scope.currentObject = {};
	$scope.currentNamespace = "";

	$scope.selectedNamespaceObjects = [];

	$scope.displayNamespace = false;
	$scope.displayObject = false;

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

	$scope.goToObjectNamespace = function(namespace)
	{
		$scope.setLocationNull();
		$location.search('namespace', namespace.name);
		$scope.navigationObjectModel.forEach(function(item) {
			item.isVisible = false;
			if(item.name.includes(namespace.name))
				item.isVisible = true;
		});
	};

	$scope.goToEngineNamespace = function(engine)
	{
		$window.location.href = "engine.html#!?engine=" + engine.name;
	};

	$scope.goToAdapterNamespace = function(adapter)
	{
		alert("Not done, sorry");
	};

	$scope.setLocationNull = function()
	{
		$location.search('object', null);
		$location.search('namespace', null);
	};

	$scope.setDisplayObject = function()
	{
		$scope.setAllViewsFalse();
		$scope.displayObject = true;
	};

	$scope.setDisplayNamespace = function()
	{
		$scope.setAllViewsFalse();
		$scope.displayNamespace = true;
	};

	$scope.setAllViewsFalse = function()
	{
		$scope.displayNamespace = false;
		$scope.displayObject = false;
	};

	$scope.displayObjectProperties = function(object)
	{
		object.displayProperties = !object.displayProperties;
	};

	$scope.displayEngineMethods = function(object)
	{
		object.displayMethods = !object.displayMethods;
	};

	$scope.displayImplementedTypes = function(object)
	{
		object.displayImplementedBy = !object.displayImplementedBy;
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

		$scope.navigationObjectModel.forEach(function(item) {
			item.isVisible = false;
			if(item.name.includes($location.search().namespace))
				item.isVisible = true;
		});

		$scope.read_oM();
	});

	$scope.goToObject = function(object)
	{
		if(!object.namespace.startsWith("BH.oM"))
			return;

		$location.search('namespace', object.namespace);
		$location.search('object', object.memberName);
	};

	$scope.goToType = function(type)
	{
		if(!type.namespace.startsWith("BH.oM"))
			return;

		$location.search('namespace', type.namespace);

		if(type.type != undefined)
			$location.search('object', type.type);
		else
			$location.search('object', type.memberName);
	};

	$scope.isEnum = function(type)
	{
		var hasEnumWords = false;
		type.descriptionParts.forEach(function(x) {
			if(x.includes("Enum values:"))
			{
				hasEnumWords = true;
			}
		});

		return hasEnumWords;
	};

	$scope.groupMethodsByNamespace = function(array, coreNS) {
		var arr = [];

		array.forEach(function(obj) {
			var ns = obj.namespace;
			if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
				ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

			if(arr[ns] == undefined)
				arr[ns] = [];

			arr[ns].push(obj);
		});

		var tuples = [];

		if(arr.length == 0)
			return tuples;

		for (var key in arr)
			tuples.push([key, arr[key]]);

		tuples.sort(function(a, b) {
			if(a[0].includes(coreNS)) return -1;
			if(b[0].includes(coreNS)) return 1;
			return 0;
		});

		var t = tuples.shift();

		tuples.sort(function(a, b) {
			a = a[0];
			b = b[0];
			if(a < b) return -1;
			if(a > b) return 1;
			return 0;
		});

		tuples.splice(0, 0, t);

		tuples.forEach(function(obj) {
			if(obj != undefined)
			{
				obj[1].sort(function(a, b) {
					if(a.memberName < b.memberName) return -1;
					if(a.memberName > b.memberName) return 1;
					return 0;
				});
			}
		});

		return tuples;
	};

	$scope.groupedImplementedByNamespace = function(array, coreNS)
	{
		var arr = [];

		array.forEach(function(obj) {
			var ns = obj.namespace;
			if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
				ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

			if(arr[ns] == undefined)
				arr[ns] = [];

			arr[ns].push(obj);
		});

		var tuples = [];

		for(var ns in arr)
		{
			arr[ns].sort(function(a, b) {
				if(a.memberName < b.memberName) return -1;
				if(a.memberName > b.memberName) return 1;
				return 0;
			});

			tuples.push([ns, arr[ns]]);
		}

		tuples.sort(function(a, b) {
			if(a[0] < b[0]) return -1;
			if(a[0] > b[0]) return 1;
			return 0;
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

	$scope.read_oM = function()
	{
		var namespace = $location.search().namespace;
		var object = $location.search().object;

		$scope.displayNamespace = false;

		$scope.currentNamespace = namespace;

		$scope.currentObject = null;
		$scope.selectedNamespaceObjects = [];

		if(object != null && object != undefined)
		{
			$scope.objects.filter(function(obj) {
				if(obj.namespace == namespace)
				{
					if((object.startsWith("I") && obj.memberName.startsWith(object)) || obj.memberName == object)
						$scope.currentObject = obj;
				}
			});

			if($scope.currentObject != null)
			{
				$scope.currentObject.displayProperties = true;
				
				var types = [];
				types.push(namespace + "." + object);
				$scope.currentObject.inheritance.forEach(function(obj) {
					types.push(obj.namespace + "." + obj.memberName);
				});

				var methods = [];
				$scope.methods.filter(function(obj) {
					obj.inputs.filter(function(input) {
						if(types.indexOf(input.namespace + "." + input.memberName) != -1)
						{
							if(methods.indexOf(obj) == -1)
								methods.push(obj);
						}
					});
				});

				var engineNamespace = namespace.replace('oM', 'Engine');
				if(apiHelpers.nthIndexOf(engineNamespace, '.', 3) != -1)
					engineNamespace = engineNamespace.substring(0, apiHelpers.nthIndexOf(engineNamespace, '.', 3));

				var groupedMethods = $scope.groupMethodsByNamespace(methods, engineNamespace);
				$scope.currentObject.methods = groupedMethods;

				var groupedImplemented = $scope.groupedImplementedByNamespace($scope.currentObject.implementedBy, namespace);
				$scope.currentObject.implementedBy = groupedImplemented;

				var adapters = [];
				$scope.adapters.filter(function(obj) {
					if(obj.namespace == $scope.currentObject.namespace && obj.memberName == $scope.currentObject.memberName)
						adapters.push(obj);
				});

				var adapterNamespace = namespace.replace('oM', 'Adapter');
				if(apiHelpers.nthIndexOf(adapterNamespace, '.', 3) != -1)
					adapterNamespace = adapterNamespace.substring(0, apiHelpers.nthIndexOf(adapterNamespace, '.', 3));

				if(adapters.length > 0)
				{
					var groupedAdapters = $scope.groupMethodsByNamespace(adapters[0].adapterMethods, adapterNamespace);
					$scope.currentObject.adapters = groupedAdapters;
				}
				else
					$scope.currentObject.adapters = [];
			}

			$scope.setDisplayObject();
		}
		else
		{
			$scope.objects.filter(function(obj) {
				if(obj.namespace.startsWith(namespace))
					$scope.selectedNamespaceObjects.push(obj);
			});

			$scope.setDisplayNamespace();
		}

		$scope.isLoading = false;
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
					
					$scope.read_oM();
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
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

	$scope.$on('$locationChangeSuccess', function (a, newUrl, oldUrl) {
		$scope.isLoading = true;

		if($scope.objects.length == 0)
			$scope.setUpNavigation(); //First time load
		else
		{
			$scope.setNavigationMenu();
		}

		$scope.read_oM();

		$scope.updateSideBarHeight();
	});

	$scope.updateSideBarHeight = function()
	{
		var sidebar = angular.element(document.querySelector(".content-left-border"))[0];//.offsetHeight;

		if(document.body.scrollHeight > sidebar.offsetHeight)
		    $('.content-left-border').css('height', document.body.scrollHeight);
		else
			$('.content-left-border').css('height', sidebar.offsetHeight);
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
		$scope.updateSideBarHeight();
	};

	$scope.showEngine = function()
	{
		$scope.expandEngine = !$scope.expandEngine;
		$scope.updateSideBarHeight();
	};

	$scope.showAdapter = function()
	{
		$scope.expandAdapter = !$scope.expandAdapter;
		$scope.updateSideBarHeight();
	};

	$scope.goToObjectNamespace = function(namespace)
	{
		$scope.setLocationNull();

		var currentItem = namespace;
		var name = currentItem.current;
		while(currentItem.parent != null)
		{
			currentItem = currentItem.parent;
			name = currentItem.current + "." + name;
		}

		name = "BH.oM." + name;

		$location.search('namespace', name);
	};

	$scope.expand = function(data)
	{
		if(data.expandChildren == undefined)
			data.expandChildren = false;

		data.expandChildren = !data.expandChildren;
		$scope.updateSideBarHeight();
	};

	$scope.goToEngineNamespace = function(engine)
	{
		var currentItem = engine;
		var name = currentItem.current;
		while(currentItem.parent != null)
		{
			currentItem = currentItem.parent;
			name = currentItem.current + "." + name;
		}

		name = "BH.Engine." + name;

		$window.location.href = "engine.html#!?engine=" + name;
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
		$scope.updateSideBarHeight();
	};

	$scope.displayEngineMethods = function(object)
	{
		object.displayMethods = !object.displayMethods;
		$scope.updateSideBarHeight();
	};

	$scope.displayImplementedTypes = function(object)
	{
		object.displayImplementedBy = !object.displayImplementedBy;
		$scope.updateSideBarHeight();
	};

	$scope.displayAdapterMethods = function(object)
	{
		object.displayAdapters = !object.displayAdapters;
		$scope.updateSideBarHeight();
	};

	$scope.displayMethodInputs = function(method)
	{
		method.displayInputs = !method.displayInputs;
		$scope.updateSideBarHeight();
	};

	$scope.displayMethodOutputs = function(method)
	{
		method.displayOutputs = !method.displayOutputs;
		$scope.updateSideBarHeight();
	};

	$scope.displayNamespaceSplit = function(namespace)
	{
		return apiHelpers.displayNamespaceSplit(namespace);
	};

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
		if(array.length == 0)
			return [];

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
		if(array.length == 0)
			return [];
		
		var arr = [];

		array.forEach(function(obj) {
			var ns = obj.namespace;
			var goHard = false;

			if(ns == undefined)
			{
				ns = obj[0]; //Back up
				goHard = true;
			}

			if(apiHelpers.nthIndexOf(ns, '.', 3) != -1)
				ns = ns.substring(0, apiHelpers.nthIndexOf(ns, '.', 3));

			if(arr[ns] == undefined)
				arr[ns] = [];

			if(!goHard)
				arr[ns].push(obj);
			else
			{
				obj[1].forEach(function(item) {
					arr[ns].push(item);
				});
			}
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
		$scope.updateSideBarHeight();
	};

	$scope.showHideMethodInputs = function(object)
	{
		if(object.canViewInputs == undefined)
			object.canViewInputs = false;
		
		object.canViewInputs = !object.canViewInputs;
		$scope.updateSideBarHeight();
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
					var objName = obj.memberName.split('[');
					if(objName[0] == object)
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
		$scope.updateSideBarHeight();
	};

	$scope.setUpNavigation = function()
	{
		$http.get('js/objects.json').then(function(response) {
			$scope.objects = response.data;

			$http.get('js/methods.json').then(function(response) {
				$scope.methods = response.data;

				$http.get('js/objectNavigation.json').then(function(response) {
					$scope.navigationObjectModel = response.data;

					$http.get('js/methodNavigation.json').then(function(response) {
						$scope.navigationEngines = response.data;

						$scope.setNavigationMenu();

						$scope.read_oM();
					}, function(response) {
						//Failure method for getting js/methodNavigation.json
						$scope.handleFailure(response);
					});
				}, function(response) {
					//Failure method for getting js/objectNavigation.json
					$scope.handleFailure(response);
				});
			}, function(response) {
				//Failure method for getting js/methods.json
				$scope.handleFailure(response);
			});
		}, function(response) {
			//Failure method for getting js/objects.json
			$scope.handleFailure(response);
		});
	};

	$scope.setNavigationMenu = function()
	{
		var namespace = $location.search().namespace;
		if(namespace != null && namespace != undefined)
		{
			$scope.expandObjects = true;
			$scope.navigationObjectModel.forEach(function(item) {
				var ns = "BH.oM." + item.current;
				item.expandChildren = false;
				if(namespace.startsWith(ns))
					item.expandChildren = true;

				item.children.forEach(function(item2) {
					var ns2 = ns + "." + item2.current;
					item2.expandChildren = false;
					if(namespace.startsWith(ns2))
						item.expandChildren = true;
				});
			});

			$scope.updateSideBarHeight();
		}
	};
});
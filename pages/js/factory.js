app.factory('notificationFactory', function(toastr) {
	return {
		showNotification : function(message, type, title)
		{
			var hasTitle = (title && title != ""); //Check whether a title exists
			switch(type)
			{
				case 'success':
					if(hasTitle)
						toastr.success(message, title);
					else
						toastr.success(message);
					break;
				case 'error' :
					if(hasTitle)
						toastr.error(message, title);
					else
						toastr.error(message);
					break;
				case 'info' :
					if(hasTitle)
						toastr.info(message, title);
					else
						toastr.info(message);
					break;
				case 'warning' :
					if(hasTitle)
						toastr.warning(message, title);
					else
						toastr.warning(message);
					break;
				default:
					if(hasTitle)
						toastr.info(message, title);
					else
						toastr.info(message);
			}
		},
	};
});

app.factory('failureHandling', function(notificationFactory) {
	return {
		handleFailure : function(response, window)
		{
			notificationFactory.showNotification("An error has occurred with that action", 'error');
		},
	};
});

app.factory('apiHelpers', function() {
	return {
		nthIndexOf : function(str, pattern, n) {
		    var i = -1;

		    while (n-- && i++ < str.length) {
		        i = str.indexOf(pattern, i);
		        if (i < 0) break;
		    }

		    return i;
		},

		displayNamespaceSplit : function(namespace) {
			var name = namespace.name;
			var split = name.split('.');

			if(split.length > 2)
			{
				if(split.length > 3 && split[2] == "External")
					return split[3];
				else
					return split[2];
			}
			else return name; //Not sure what happened
		},
	};
});
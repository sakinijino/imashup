dojo.provide("imashup.components.widgets.IPLocation");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.widgets.IPLocation",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/ip_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/ip_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/IPLocation.html"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 280,
		
		imashup_human_name: "IP Location",
		imashup_catergories: ['Misc'],
		
		inputnode: null,
		result: null,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onSubmit: function(){
			if (this.inputNode.value && this.inputNode.value != "") {
				this.getLocation(this.inputNode.value);
			} else {
				this.getLocation(IPData[0]);
			}
		},
		
		getLocation: function(/* String */ _ip){
			var _url = 'http://api.ipinfodb.com/v3';
     			if (imashup.configs && imashup.configs.proxy) 
      				_url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url ;
    	  		_url += '/ip-city/';
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					key: "ae6ab2e063c6b5daf15bc56eebc8e3764c21b88467622f7f1f894729f1b489bb",
					ip: _ip,
					format: "json",
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.result = dojo.fromJson(response);
					self.displayResult();
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		
		},
		
		displayResult: function() {
		//	console.log(this.result);
			this.result_ip.innerHTML = this.result.ipAddress;
			
			this.result_country.innerHTML = this.result.countryName;
			this.Country(this.result.countryName);
			
			this.result_region.innerHTML = this.result.regionName;
			this.Region(this.result.regionName);
			
			this.result_city.innerHTML = this.result.cityName;
			this.City(this.result.City);
			
			this.result_postcode.innerHTML = this.result.zipCode;
			this.PostalCode(this.result.ZipPostalCode);
			
			this.result_coordinate.innerHTML = " ( " + this.result.latitude + " , " + this.result.longitude + " ) ";
			this.LatLng({
				"Lat": this.result.latitude, 
				"Lng": this.result.longitude
			});
			
			this.Location({
				"Country": this.result.countryName,
				"Region": this.result.regionName,
				"City": this.result.city,
				"Lat": this.result.latitude,
				"Lng": this.result.longitude,
				"PostalCode": this.result.zipCode
			})
			
			this.result_timezone.innerHTML = this.result.timeZone;
		},
		
		Country: function(/* String */ country) {
		},
		
		Region: function(/* String */ region) {
		},
		
		City: function(/* String */ city) {
		},
		
		LatLng: function(/* Object */obj) {
		},
		
		PostalCode: function(/* Object */PostalCode) {
		},
		
		Location: function(/* Object */obj) {
		},
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.IPLocation',
    "interface": {
        properties: {},
        methods: {
			"getLocation": { Function: "getLocation", CustomMethod: "/* arguments[0]: String */" }
		},
        events: {
			"Country": { Function: "Country", CustomMethod: "/* arguments[0]: String */"},
			"Region": { Function: "Region", CustomMethod: "/* arguments[0]: String */"},
			"City": { Function: "City", CustomMethod: "/* arguments[0]: String */"},
			"LatLng": { Function: "LatLng", CustomMethod: "/* arguments[0]: { Lat: float, Lng: float } */"},
			"PostalCode": { Function: "PostalCode", CustomMethod: "/* arguments[0]: String */"},
			"Location": { Function: "Location", CustomMethod: "/* arguments[0]: String */"},
		}
    },
    mixin_types : ['window']
});

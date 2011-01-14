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
			var _url = 'http://api.ipinfodb.com/v2'
      if (imashup.configs && imashup.configs.proxy) 
        _url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url 
      _url += "/ip_query.php";
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					key: "ca40445031c2f3a0d3759c8c20eca3b0a74479aad095ecdfc6b85ac3fc44c2d4",
					output: "json",
					timezone: "true",
					ip: _ip
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
			this.result_ip.innerHTML = this.result.Ip;
			
			this.result_country.innerHTML = this.result.CountryName;
			this.Country(this.result.CountryName);
			
			this.result_region.innerHTML = this.result.RegionName;
			this.Region(this.result.RegionName);
			
			this.result_city.innerHTML = this.result.City;
			this.City(this.result.City);
			
			this.result_postcode.innerHTML = this.result.ZipPostalCode;
			this.PostalCode(this.result.ZipPostalCode);
			
			this.result_coordinate.innerHTML = " ( " + this.result.Latitude + " , " + this.result.Longitude + " ) ";
			this.LatLng({
				"Lat": this.result.Latitude, 
				"Lng": this.result.Longitude
			});
			
			this.Location({
				"Country": this.result.CountryName,
				"Region": this.result.RegionName,
				"City": this.result.City,
				"Lat": this.result.Latitude,
				"Lng": this.result.Longitude,
				"PostalCode": this.result.ZipPostalCode
			})
			
			this.result_timezone.innerHTML = this.result.TimeZoneName;
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
    interface: {
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

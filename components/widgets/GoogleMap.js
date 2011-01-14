dojo.provide("imashup.components.widgets.GoogleMap");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

/*
dojo.create("script", 
	{ type : "text/javascript", src : "http://maps.google.com/maps/api/js?sensor=false"}, 
	document.getElementsByTagName("head")[0]);
*/
	
dojo.declare(
    "imashup.components.widgets.GoogleMap",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/map_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/map_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/GoogleMap.html"),
		
		resizable: true,
		maxable: false,
		width: 650,
		
		imashup_human_name: "Google Map",
		imashup_catergories: ['Search'],
		
		inputnode: null,
		mapContainer: null,
		inputContainer: null,
		
		map:null,
		geocoder:null,
		
		postCreate: function(){
			var latlng = new google.maps.LatLng(39.991893, 116.309954);
			var myOptions = {
				zoom: 10,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
            this.map = new google.maps.Map(this.mapContainer, myOptions);
			
			geocoder = new google.maps.Geocoder();
			
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onsubmit: function(){
			var location = this.inputnode.value;
			this.setLocation(location, true);
		},
		
		setLocation: function(location){
			var my_googlemap = this;
			geocoder.geocode( { 'address': location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// console.log(results);
					my_googlemap.map.setCenter(results[0].geometry.location);
					
					var country = "";
					var countryISO = "";
					
					for(var i = 0; i < results[0].address_components.length; i++) {
						if (results[0].address_components[i].types[1] == "political" 
							&& results[0].address_components[i].types[0] == "country") {
							countryISO = results[0].address_components[i].short_name;
							country = results[0].address_components[i].long_name;
						}
					}
					
					my_googlemap.MarkerLatlng({
						"Lat": results[0].geometry.location.va, 
						"Lng": results[0].geometry.location.wa
					});
					my_googlemap.MarkerLocation(results[0].formatted_address);
					my_googlemap.MarkerCountry(country);
					my_googlemap.MarkerCountryISO(countryISO);
					my_googlemap.MarkerInfo({
						"Location": location, 
						"Country": country, 
						"CountryISO": countryISO,
						"Title": results[0].formatted_address, 
						"Lat": results[0].geometry.location.va,
						"Lng": results[0].geometry.location.wa
					});
					
					my_googlemap.insertMarker({Location: location, Title: results[0].formatted_address});
				 }
			});
		},
		
		insertMarker: function(/* Object */obj) {
			var location = obj.Location;
			var _title = obj.Title;
			var my_googlemap = this;
			geocoder.geocode( {'address': location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					my_googlemap.map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: my_googlemap.map, 
						position: results[0].geometry.location,
						title: _title
					});
					
					var country = "";
					var countryISO = "";
					
					for(var i = 0; i < results[0].address_components.length; i++) {
						if (results[0].address_components[i].types[1] == "political" 
							&& results[0].address_components[i].types[0] == "country") {
							countryISO = results[0].address_components[i].short_name;
							country = results[0].address_components[i].long_name;
						}
					}
					
					google.maps.event.addListener(marker, 'click', function() {
						my_googlemap.MarkerLatlng({
							"Lat": results[0].geometry.location.va, 
							"Lng": results[0].geometry.location.wa
						});
						my_googlemap.MarkerLocation(location);
						my_googlemap.MarkerCountry(country);
						console.log(_title);
						my_googlemap.MarkerTitle(_title);
						my_googlemap.MarkerCountryISO(countryISO);
						my_googlemap.MarkerInfo({
							"Location": location, 
							"Country": country, 
							"CountryISO": countryISO,
							"Title": _title,
							"Lat": results[0].geometry.location.va,
							"Lng": results[0].geometry.location.wa
						});
					});
					
					google.maps.event.addListener(marker, 'rightclick', function() {
						marker.setMap(null);
					})
				}
			});
		},
		
		setLatLng: function(/* Object */obj) {
			this.setLocation(obj.Lat + ", " + obj.Lng);
		},
		
		MarkerTitle: function(/* String */title) {
		},
		
		MarkerLocation: function(/* String */location) {
		},
		
		MarkerCountry: function(/* String */country) {
		},
		
		MarkerCountryISO: function(/* String */countryISO) {
		},
		
		MarkerLatlng: function(/* Object */obj) {
		},
		
		MarkerInfo: function(/* Object */obj) {
		}
	}
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.GoogleMap',
    interface: {
        properties: {},
        methods: {
			"setLocation" : { Function: "setLocation", CustomMethod: "/* arguments[0]: String */" },
			"setLatLng" : { Function: "setLatLng", CustomMethod: "/* arguments[0]: { Lat: float, Lng: float } */" },
			"insertMarker" : { Function: "insertMarker", CustomMethod: "/* arguments[0]: { Location: String, Title: String } */" },
		},
        events: {
			"MarkerLocation" : { Function: "MarkerLocation", CustomMethod: "/* arguments[0]: String */" },
			"MarkerLatlng" : { Function: "MarkerLatlng", CustomMethod: "/* arguments[0]: String */" },
			"MarkerCountry" : { Function: "MarkerCountry", CustomMethod: "/* arguments[0]: String */" },
			"MarkerCountryISO" : { Function: "MarkerCountryISO", CustomMethod: "/* arguments[0]: String */" },
			"MarkerTitle" : { Function: "MarkerTitle", CustomMethod: "/* arguments[0]: String */" },
			"MarkerInfo" : { Function: "MarkerInfo", CustomMethod: "/* arguments[0]: String */" },
		}
    },
    mixin_types : ['window']
});

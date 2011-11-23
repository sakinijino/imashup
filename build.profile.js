dependencies = {
  cssOptimize : "comments",
  internStrings: true,
  releaseName : "",
  version: "0.2",
	layers: [
		{
			name: "../imashup/imashup.js",
			dependencies: [
        "imashup.toolpanels.PropertiesEditor",
        "imashup.toolpanels.Startbar",
        "imashup.toolpanels.Desktop",
        "imashup.toolpanels.Docklet",
        "imashup.components.all"
			]
		}
	],
	prefixes: [
		[ "imashup", "../imashup" ],
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ]
	]
}

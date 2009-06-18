/*saki*/
dojo.require('dojo.string')
dojo.provide('imashup.mixins.WebOSComponent')

dojo.declare("imashup.mixins.WebOSComponent", null, {
		imashup_is_weboscomponent : true,
    imashup_webos_has_icon : true,
    imashup_webos_large_icon_url : dojo.moduleUrl("imashup.mixins", "templates/unknown_large.png"),//need a default icon
    imashup_webos_small_icon_url : dojo.moduleUrl("imashup.mixins", "templates/unknown_small.png")//need a default icon
});

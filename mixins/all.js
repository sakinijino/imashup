dojo.provide('imashup.mixins.all');

dojo.require('imashup.mixins.BasicComponent');
dojo.require('imashup.mixins.LayoutComponent');
dojo.require('imashup.mixins.SizableComponent');
dojo.require('imashup.mixins.WebOSComponent');
dojo.require('imashup.mixins.WindowComponent');

imashup.mixins.all._TYPESTRINGMAPPING = {
    layout : imashup.mixins.LayoutComponent,
    movable : imashup.mixins.MovableComponent,
    sizable : imashup.mixins.SizableComponent,
    webos : imashup.mixins.WebOSComponent,
    window : imashup.mixins.WindowComponent
}

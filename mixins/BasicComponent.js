/*saki*/
dojo.require('dojo.string')
dojo.provide('imashup.mixins.BasicComponent')

dojo.string.capitalize = function(word){
    return word.substring(0,1).toUpperCase() + word.substring(1);
};

dojo.declare("imashup.mixins.BasicComponent", null, {
    imashup_is_imashupcomponent : true,
    imashup_is_singleton : false,
    imashup_singleton : null,
    imashup_human_name : null,
    imashup_catergories : [],
    
    imashup_getHumanName : function() {
    	if (this.imashup_human_name != null) return this.imashup_human_name
    	else return this.declaredClass.split('.')[this.declaredClass.split('.').length-1]
    },
    
    imashup_getCategories : function() {
    	return this.imashup_catergories;
    },

    imashup_getProperty: function(name) {
        if (dojo.isFunction(this['get'+dojo.string.capitalize(name)])) {
            return this['get'+dojo.string.capitalize(name)]();
        }
        else return this[name];
    },

    imashup_setProperty: function(name, value) {
        if (dojo.isFunction(this['set'+dojo.string.capitalize(name)])) {
            this['set'+dojo.string.capitalize(name)](value);
        }
        else this[name] = value;
    }
});

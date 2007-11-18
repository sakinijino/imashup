[
    {
	text : 'Test long text Information Item',
	type : 'text'
    },
    {
	type : 'hr'
    },
    {
	text : 'Test Redirect Item',
	type : 'redirect',
	url : '/',
	openinblank : true //default is false
    },
    {
	text : 'Test Ajax Request Item',
	type : 'ajax',
	url : 'menu_items2.js',
	data : {test : 'test'}, //optional, params of ajax call
	method : 'get', //default is 'get'
	updateMenu : true, //default is false, whether to update menu by the return value of ajax call
	before : 'ExampleAjaxMenu.confirm', //optional, name of function which runs before ajax call
	                    //if the function return false, ajax call would be terminated
	                    //the function takes three params, before_params, floating pane, itemid
	before_params : 'Are you sure to process an ajax call?', //default is null, before function's first param
	callback : 'ExampleAjaxMenu.fadeIn' //optional, name of function which runs after ajax call
	                                    //the function takes three params, ajax return value, floating pane, itemid
    },
    {
	text : 'Test Function Item',
	type : 'function',
	func : 'ExampleAjaxMenu.showDialog', //function name
                                             //the function takes three params, params, floating pane, itemid
	params : {x : 100, y : 100} //default is null, function's first param
    }
]
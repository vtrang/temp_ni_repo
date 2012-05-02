var _username = "";
var _password = "";
var _displayPopover = null;

if (localStorage.getItem('loginname')){
	_username = localStorage.getItem('loginname');
	_password = localStorage.getItem('loginpass');
}

for(var i=0; i<safari.extension.toolbarItems.length; i++)
	{
		var item = safari.extension.toolbarItems[i];
		if(item.identifier == "PopoverButton") _displayPopover = item;
	}

function removeAllPopovers()
{
	//hide popovers
	for(var i=0;i<safari.extension.popovers.length;i++)
    	{
    		var id = safari.extension.popovers[i].identifier;
    		if( id == "StashBarrel" || id == "TrapPlaced")
				{
					safari.extension.popovers[i].hide();
				}
		}
		//remove the popovers

	safari.extension.removePopover("TrapPlaced");
	safari.extension.removePopover("StashBarrel");
	
	
}

function niClientApp_catchPopup(which) {

	console.log("which is: " + which);
	console.log("Caught panel... "+which.id);
	if (which.elements) {
		for (var i=0; i<which.elements.length; i++) {
			console.log(" Element '"+which.elements[i].id+"' set to '"+which.elements[i].val+"'");
		}
	} else {
	
		// handle barrels
		if (which == "nova_initia_tool_barrel") {
			
			removeAllPopovers();
			var barrelPopover = safari.extension.createPopover("StashBarrel", safari.extension.baseURI + "popovers/StashBarrel.html",450, 205);
                            _displayPopover.popover = barrelPopover;
                            _displayPopover.showPopover();

			//var myWin = safari.application.openBrowserWindow();
			//myWin.activeTab.url = "http://www.google.com";
			//myWin.activeTab.resizeTo(200,200);
			/*alert('alert');
			var sg = prompt("Enter SG: ","0");
			var traps = prompt("Enter Traps: ","0");
			var barrels = prompt("Enter Barrels: ","0");
			var spiders = prompt("Enter Spiders: ","0");
			var shields = prompt("Enter Shields: ","0");
			var doorways = prompt("Enter Doorways: ","0");
			var signposts = prompt("Enter Signposts: ","0");
			var message = prompt("Enter Message: ","Blah blah blah!");
			window.NovaInitia.Toolbar.stash_barrel(sg,traps,barrels,spiders,shields,doorways,signposts,message);*/
		}
		
		// handle signposts
		if (which == "nova_initia_tool_signpost") {
			var signpost_panel_popup_title = prompt("Enter title: ","");
			var signpost_panel_popup_comment = prompt("Enter comment: ","");
			var signpost_panel_popup_nsfw = false;
			window.NovaInitia.Toolbar.place_signpost(signpost_panel_popup_title,signpost_panel_popup_comment,signpost_panel_popup_nsfw);
		}
		//handle doorways
		if (which == "nova_initia_tool_doorway") {
			var doorway_popup_panel_URL = prompt("URL:","");
			var doorway_popup_panel_hint = prompt("Hint:","");
			var doorway_popup_panel_comment = prompt("Comment:", "");
			var doorway_popup_panel_nsfw = false;
			window.NovaInitia.Toolbar.open_doorway(doorway_popup_panel_URL, doorway_popup_panel_hint, doorway_popup_panel_comment, doorway_popup_panel_nsfw);

		}
		
	}
}
	
function niClientApp_login() {
	if (localStorage.getItem('loginname') == null) {
		_username = prompt("Username: ","");
		_password = prompt("Password: ","");
		localStorage.setItem('loginname', _username);
		localStorage.setItem('loginpass', _password);
		fnNovaInitia_setUserLogin(localStorage.getItem('loginname'),localStorage.getItem('loginpass'));
		window.NovaInitia.Toolbar.process_login(null);

	}
	else {
		fnNovaInitia_setUserLogin(localStorage.getItem('loginname'),localStorage.getItem('loginpass'));
		window.NovaInitia.Toolbar.process_login(null);
	}
}

function niClientApp_getURL() {
	return safari.application.activeBrowserWindow.activeTab.url;
}

function niClientApp_loadURL(wndId) {
	switch (wndId.id) {
		case "nova_initia_tool_events":
			safari.application.activeBrowserWindow.openTab().url = "http://www.nova-initia.com/remog/events?LASTKEY="+NovaInitia.Toolbar.getKey();
			break;
		case "nova_initia_tool_resgister":
			safari.application.activeBrowserWindow.openTab().url = "http://www.nova-initia.com/register.php";
			break;
		case "nova_initia_tool_mail":
			safari.application.activeBrowserWindow.openTab().url = "http://www.nova-initia.com/remog/mail?LASTKEY="+NovaInitia.Toolbar.getKey();
			break;
		case "nova_initia_tool_profile":
			safari.application.activeBrowserWindow.openTab().url = "http://www.nova-initia.com/remog/user/"+_username+"?LASTKEY="+NovaInitia.Toolbar.getKey();
			break;
		case "nova_initia_tool_sg":
			safari.application.activeBrowserWindow.openTab().url = "http://www.nova-initia.com/remog/trade?LASTKEY="+NovaInitia.Toolbar.getKey();
			break;
		default: 
			safari.application.activeBrowserWindow.openTab().url = wndId;
	}
	
}

function send_request(theURL, theMethod, theParams) {
	var theReq = new XMLHttpRequest();
	theReq.overrideMimeType("application/json");
	theReq.open(theMethod,theURL,false);
	if(typeof(theParams) === "string") {
		theReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	} else {
		theReq.setRequestHeader("Content-type", "application/json");
		theParams = JSON.stringify(theParams);
	}
	if(_key) theReq.setRequestHeader("X-NOVA-INITIA-LASTKEY", _key);
	if(theParams) {
		theReq.send(theParams);
	} else {
		theReq.send(null);
	}
	return theReq;
}


safari.application.addEventListener("navigate", navigateHandler, true);
function navigateHandler(msgEvent) {
	tb_injectAdapter();
}


function tb_injectAdapter() {
   var libr = document.createElement("script");
   libr.type = "text/javascript";
   libr.src = "javascript/niAdapter.js";
   document.getElementsByTagName("head")[0].appendChild(libr);
   
   libr.onload = function() {
	initializeAdapter(_username,_password);
   };
}
window.onload = navigateHandler;
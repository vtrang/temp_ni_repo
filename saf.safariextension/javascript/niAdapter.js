// library files to inject
var novaInitia_libraries = [
   "http://mikederoche.com/cs320/commoncode/libs/jquery-1.5.1.min.js",
   "http://mikederoche.com/cs320/commoncode/libs/keycode.js",
   "http://mikederoche.com/cs320/commoncode/libs/bigint.js",
   "http://mikederoche.com/cs320/commoncode/libs/algorithms.js",
   "http://mikederoche.com/cs320/commoncode/libs/sha256.js",
   "http://mikederoche.com/cs320/commoncode/libs/crypto-md5.js",
   "javascript/toolbar.js"
];
var novaInitia_libraries_current = 0;

var _gusername = "";
var _gpassword = "";

/*
 * LIBRARY INJECTION FUNCTIONS
 */

   function fnNovaInitia_library_inject() {
      delete libr;

      var libr = document.createElement("script");
      libr.type = "text/javascript";
      libr.src = novaInitia_libraries[novaInitia_libraries_current];
   
      if (libr.readyState) {
         libr.onreadystatechange = function () {
            if (libr.readyState == "loaded" || libr.readyState == "complete") {
               libr.onreadystatechange = null;
               delete libr;
               fnNovaInitia_library_callback();
            }
         };
      } else {
         libr.onload = function () {
            delete libr;
            fnNovaInitia_library_callback();
         };
      }
       
      document.getElementsByTagName("head")[0].appendChild(libr);
   }

   function fnNovaInitia_library_callback() {
      novaInitia_libraries_current++;
      if (novaInitia_libraries_current >= novaInitia_libraries.length) {
         fnNovaInitia_init_fromAdapter(_gusername,_gpassword);
         fnNovaInitia_injectToolbar();
      } else {
         fnNovaInitia_library_inject();
      }
   }


/*
 * PREFERENCES FUNCTIONS
 */
   
   function fnNovaInitia_prefs_set(name,value) {
      localStorage.setItem(name,value);
   }
   
   function fnNovaInitia_prefs_get(name) {
      localStorage.getItem(name);
   }


/*
 * MAIN INITIALIZATION FUNCTIONS
 */


function fnNovaInitia_injectToolbar() {
   if ($("#niTBC").length > 0) return;

   // fix body padding and margins
   oM1 = $("body").css("margin-top");
      oM2 = (parseInt(oM1)+70)+"px";
   
   $("body").css("margin-top","0px");

   // prepend a container to hold common code
   $("body").prepend("<div id='niTBC'></div>");

   // inject common code HTML into container
   $("#niTBC").html('<div id="toolbarWrapper"><div id="toolbar_login" style="display: none"><table cellspacing="0" cellpadding="0" id="toolbarTable"><tr><td class="toolbarItem"><img id="nova_initia_tool_login" class="nova_initia_tools_toolbarbutton" onclick="niClientApp_login();" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/ni.ico" /> Login</td></tr></table></div><div id="toolbar"><table cellspacing="0" cellpadding="0" id="toolbarTable"><tr><td class="toolbarItem"><img id="nova_initia_tool_trap" class="nova_initia_tools_toolbarbutton" onclick="window.NovaInitia.Toolbar.process_toolbutton(this,null);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/trap.ico" /><div id="novaInitia_toolbar_inventory_traps">--</div></td><td class="toolbarItem"><img id="nova_initia_tool_barrel" class="nova_initia_tools_toolbarbutton" onclick="niClientApp_catchPopup(this.id);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/barrel.ico" /><div id="novaInitia_toolbar_inventory_barrells">--</div></td><td class="toolbarItem"><img id="nova_initia_tool_signpost" class="nova_initia_tools_toolbarbutton" onclick="niClientApp_catchPopup(this.id);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/sign.ico" /><div id="novaInitia_toolbar_inventory_signposts">--</div></td><td class="toolbarItem"><img id="nova_initia_tool_doorway" class="nova_initia_tools_toolbarbutton" onclick="niClientApp_catchPopup(this.id);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/doorway.ico" /><div id="novaInitia_toolbar_inventory_doors">--</div></td><td class="toolbarItem"><img id="nova_initia_tool_spider" class="nova_initia_tools_toolbarbutton" onclick="window.NovaInitia.Toolbar.process_toolbutton(this,null);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/spider.ico" /><div id="novaInitia_toolbar_inventory_spiders">--</div></td><td class="toolbarItem"><img id="nova_initia_tool_shield" class="nova_initia_tools_toolbarbutton" onclick="window.NovaInitia.Toolbar.process_toolbutton(this,null);" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/shield.ico" /><div id="novaInitia_toolbar_inventory_shields">--</div></td><td class="toolbarItem" style="width: 80px"><img id="nova_initia_tool_events" onclick="niClientApp_loadURL(this);" src="http://i60.photobucket.com/albums/h11/pyrosox11/events32.png" /> Events</td><td class="toolbarItem" style="width: 50px"><img id="nova_initia_tool_mail" onclick="niClientApp_loadURL(this)" src="http://i60.photobucket.com/albums/h11/pyrosox11/msg32-1.png" /><div id="novaInitia_toolbar_inventory_messages">--</div></td><td class="toolbarItem" style="width: 80px"><img id="nova_initia_tool_profile" onclick="niClientApp_loadURL(this);" src="http://i60.photobucket.com/albums/h11/pyrosox11/profile32-3.png" /> Profile</td><td class="toolbarItem" style="width: auto; text-align: right"><img style="float: none;" id="nova_initia_tool_sg" onclick="niClientApp_loadURL(this)" src="http://mikederoche.com/cs320/commoncode/skin/images/icons/sg.ico" /><div id="novaInitia_toolbar_inventory_sg" style="float: right">--</div></td><td class="toolbarItem" style="width: 50px; padding-right: 5px; padding-left: 20px; text-align: right"><img src="http://mikederoche.com/cs320/commoncode/skin/images/logout32.png" onclick="window.NovaInitia.Toolbar.logout();" /></td></tr></table></div></div>');
   
   // inject the toolbar style sheet
   var cssl = document.createElement("link");
   cssl.setAttribute("type","text/css");
   cssl.setAttribute("rel","stylesheet");
   cssl.setAttribute("href","javascript/nova-initia_toolbar.css");
   document.getElementsByTagName("head")[0].appendChild(cssl);
}


// go go gadget
function initializeAdapter(inusername,inpassword) {
   _gusername = inusername;
   _gpassword = inpassword;
   fnNovaInitia_library_inject();
}
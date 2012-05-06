var globalNi;
var _globalUsername;
var _globalPassword;

function StartNI(ni) {
    
    console.log("Nova Initia ENGAGED.  WARP SPEED AHEAD.")

    ni.JSON = window.JSON;
    console.log(window.JSON);

 ni.JSOC = function(){
    var Cache = {};
    return {
        "get":function(n){
            var obj = {}, val = Cache[n];
            obj[n] = val;
            if(val) return obj;
        },
        "getMulti":function(l){
            var a = [];
            for (var k in l) a.push(this.get(l[k]));
            return a;
        },
        "getType":function(t){
            var a = [];
            for (var o in Cache) if(typeof(Cache[o])==t){a.push(this.get(o))}
            return a;
        },
        "getMultiType":function(l){
            var a = [];
			for (var t in l){
            	for (var o in Cache) if(typeof(Cache[o])==t){a.push(this.get(o))}
			}
            return a;
        },
        "set":function(n,v){
            if(Cache[n]) delete(Cache[n]);
            Cache[n]=v;
            if (arguments[2]){
                var ttl = arguments[2].ttl || null;
                if(ttl) var self = this, to = setTimeout(function(){self.remove(n)}, ttl);
            }
            return (Cache[n])?1:0;
        },
        "add":function(n,v){
            if(!Cache[n]){
                Cache[n]=v;
                if (arguments[2]){
                    var ttl = arguments[2].ttl || null;
                    if(ttl) var self = this, to = setTimeout(function(){self.remove(n)}, ttl);
                }
                return (Cache[n])?1:0;
            }
        },
        "replace":function(n,v){
            if(Cache[n]){
                delete(Cache[n]);
                Cache[n]=v;
                if (arguments[2]){
                    var ttl = arguments[2].ttl || null;
                    if(ttl) var self = this, to = setTimeout(function(){self.remove(n)}, ttl);
                }
                return (Cache[n])?1:0;
            }
        },
        "remove":function(n){
            delete(Cache[n]);
            return (!Cache[n])?1:0;
        },
        "flush_all":function(){
            for(k in Cache) delete(Cache[k]);
            return 1;
        }
    }
}

var _displayPopover = null;
for(var i=0; i<safari.extension.toolbarItems.length; i++)
    {
        var item = safari.extension.toolbarItems[i];
        if(item.identifier == "PopoverButton") _displayPopover = item;
    }
/*---------------------------*/

/*----------------- ALGORITHMS */
 ni.boardObserver = {
  getSupportedFlavours : function () {
    var flavours = new FlavourSet();
    flavours.appendFlavour("text/unicode");
    return flavours;
  },
  onDragOver: function (evt,flavour,session){},
  onDrop: function (evt,dropdata,session){
    alert(dropdata);
	if (dropdata.data!=""){
	  alert(dropdata);
      var elem=document.createElement(dropdata.data);
      evt.target.appendChild(elem);
      elem.setAttribute("left",""+evt.pageX);
      elem.setAttribute("top",""+evt.pageY);
      elem.setAttribute("label",dropdata.data);
    }
  }
}

ni.sha256 = function(s){
 
	var chrsz   = 8;
	var hexcase = 0;
 
	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
 
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
	function core_sha256 (m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
 
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
 
		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
 
			for ( var j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
 
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
 
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
 
	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}
 
	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
 
ni.MD5 = function (str)
{

	/*var converter =
	  Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
	    createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	
	// we use UTF-8 here, you can choose other encodings.
	converter.charset = "UTF-8";
	// result is an out parameter,
	// result.value will contain the array length
	var result = {};
	// data is an array of bytes
	var data = converter.convertToByteArray(str, result);
	var ch = Components.classes["@mozilla.org/security/hash;1"]
	                   .createInstance(Components.interfaces.nsICryptoHash);
	ch.init(ch.MD5);
	ch.update(data, data.length);
	var hash = ch.finish(false);
	
	// return the two-digit hexadecimal code for a byte
	function toHexString(charCode)
	{
	  return ("0" + charCode.toString(16)).slice(-2);
	}
	
	// convert the binary hash data to a hex string.
	var s = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");

	//Added for compatibility with TNN
	s = s.substr(0,32);

	return s;*/
        	//from 2.3.0-md5.js

	// var hash = Crypto.MD5(str);
	var utf = Utf8Encode(str);
	var bytes = convertToByteArray(utf);
	var hash = Crypto.MD5(bytes, { asString: true });

	function toHexString(charCode)
	{
		return ("0" + charCode.toString(16)).slice(-2);
	}


	// convert the binary hash data to a hex string.
	var s = "";
	for(i in hash)
	{
		s += toHexString(hash.charCodeAt(i));
	}

	// var tmp = [];
	// for(i in hash)
	// {
	// 	tmp.push(toHexString(hash.charCodeAt(i)));
	// }
	// var s = tmp.join("");

	//Added for compatibility with TNN
	s = s.substr(0,32);
	return s;
}

ni.urlencode = function(str) {
    // URL-encodes string  
    // 
    // version: 910.813
    // discuss at: http://phpjs.org/functions/urlencode
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Joris
    // %          note 1: This reflects PHP 5.3/6.0+ behavior
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
    var hexStr = function (dec) {
        return '%' + (dec < 16 ? '0' : '') + dec.toString(16).toUpperCase();
    };

    var ret = '',
            unreserved = /[\w.-]/; // A-Za-z0-9_.- // Tilde is not here for historical reasons; to preserve it, use rawurlencode instead
    str = (str+'').toString();

    for (var i = 0, dl = str.length; i < dl; i++) {
        var ch = str.charAt(i);
        if (unreserved.test(ch)) {
            ret += ch;
        }
        else {
            var code = str.charCodeAt(i);
            if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters); https://developer.mozilla.org/index.php?title=en/Core_JavaScript_1.5_Reference/Global_Objects/String/charCodeAt
                ret += ((code - 0xD800) * 0x400) + (str.charCodeAt(i+1) - 0xDC00) + 0x10000;
                i++; // skip the next one as we just retrieved it as a low surrogate
            }
            // We never come across a low surrogate because we skip them, unless invalid
            // Reserved assumed to be in UTF-8, as in PHP
            else if (code === 32) {
                ret += '+'; // %20 in rawurlencode
            }
            else if (code < 128) { // 1 byte
                ret += hexStr(code);
            }
            else if (code >= 128 && code < 2048) { // 2 bytes
                ret += hexStr((code >> 6) | 0xC0);
                ret += hexStr((code & 0x3F) | 0x80);
            }
            else if (code >= 2048) { // 3 bytes (code < 65536)
                ret += hexStr((code >> 12) | 0xE0);
                ret += hexStr(((code >> 6) & 0x3F) | 0x80);
                ret += hexStr((code & 0x3F) | 0x80);
            }
        }
    }
    return ret;
}

ni.urldecode = function(str) {
    // Decodes URL-encoded string  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/urldecode
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +   improved by: Orlando
    // %        note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urldecode('Kevin+van+Zonneveld%21');
    // *     returns 1: 'Kevin van Zonneveld!'
    // *     example 2: urldecode('http%3A%2F%2Fkevin.vanzonneveld.net%2F');
    // *     returns 2: 'http://kevin.vanzonneveld.net/'
    // *     example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a');
    // *     returns 3: 'http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
    
    var hash_map = {}, ret = str.toString(), unicodeStr='', hexEscStr='';
    
    var replacer = function (search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };
    
    // The hash_map is identical to the one in urlencode.
    hash_map["'"]   = '%27';
    hash_map['(']   = '%28';
    hash_map[')']   = '%29';
    hash_map['*']   = '%2A';
    hash_map['~']   = '%7E';
    hash_map['!']   = '%21';
    hash_map['%20'] = '+';
    hash_map['\u00DC'] = '%DC';
    hash_map['\u00FC'] = '%FC';
    hash_map['\u00C4'] = '%D4';
    hash_map['\u00E4'] = '%E4';
    hash_map['\u00D6'] = '%D6';
    hash_map['\u00F6'] = '%F6';
    hash_map['\u00DF'] = '%DF';
    hash_map['\u20AC'] = '%80';
    hash_map['\u0081'] = '%81';
    hash_map['\u201A'] = '%82';
    hash_map['\u0192'] = '%83';
    hash_map['\u201E'] = '%84';
    hash_map['\u2026'] = '%85';
    hash_map['\u2020'] = '%86';
    hash_map['\u2021'] = '%87';
    hash_map['\u02C6'] = '%88';
    hash_map['\u2030'] = '%89';
    hash_map['\u0160'] = '%8A';
    hash_map['\u2039'] = '%8B';
    hash_map['\u0152'] = '%8C';
    hash_map['\u008D'] = '%8D';
    hash_map['\u017D'] = '%8E';
    hash_map['\u008F'] = '%8F';
    hash_map['\u0090'] = '%90';
    hash_map['\u2018'] = '%91';
    hash_map['\u2019'] = '%92';
    hash_map['\u201C'] = '%93';
    hash_map['\u201D'] = '%94';
    hash_map['\u2022'] = '%95';
    hash_map['\u2013'] = '%96';
    hash_map['\u2014'] = '%97';
    hash_map['\u02DC'] = '%98';
    hash_map['\u2122'] = '%99';
    hash_map['\u0161'] = '%9A';
    hash_map['\u203A'] = '%9B';
    hash_map['\u0153'] = '%9C';
    hash_map['\u009D'] = '%9D';
    hash_map['\u017E'] = '%9E';
    hash_map['\u0178'] = '%9F';
    hash_map['\u00C6'] = '%C3%86';
    hash_map['\u00D8'] = '%C3%98';
    hash_map['\u00C5'] = '%C3%85';

    for (unicodeStr in hash_map) {
        hexEscStr = hash_map[unicodeStr]; // Switch order when decoding
        ret = replacer(hexEscStr, unicodeStr, ret); // Custom replace. No regexing
    }
    
    // End with decodeURIComponent, which most resembles PHP's encoding functions
    ret = decodeURIComponent(ret);

    return ret;
}


// Turns a URL into a pair of hashes.
// Input is expected to be in the format "proto://domain/path?qs#ignored"
//   where the path and query string are optional, and everything after the
//   hash is ignored.
// Return value is an object containing two base32 strings (see rfc3548), both
// of length 26.  The two values are under keys "domain" and "url"
ni.UrlToHash = function(url,doHash)
{
	// Make sure it's a URL, and strip the bits we don't care about.
	
	
	//To Lowercase causes problems
	//url = url.toLowerCase();
	
	/* Regex:
		^[a-z]+:\/\/							Protocol
		[a-z][-a-z0-9]+(\.[a-z][-a-z0-9]+)+		Domain name
		($|\/|\?)?[^#]*							Everything else up to the #
	*/
	url = /^[a-z]+:\/\/([a-z0-9][-a-z0-9]+(\.[a-z0-9][-a-z0-9]+)+)[^_]($|\/|\?)?[^#]*/.exec(url);
	if (!url)
		return(false);
	var domain = url[1];
	url = url[0];
	
	if(doHash)
		return({"domain":ni.base32md5(domain),"url":ni.base32md5(url)});
	else
		return(url);
}

// Takes a string, md5's it, and turns it into base32.
ni.base32md5 = function(data)
{
	var hex = ni.MD5(data);
	if (hex.length != 32)
		return(false);
	
	// Convert base16 into base32.
	// (We ignore the =='s on the end, as the whole point is to make it shorter,
	// and we don't care about decoding it, and all are the same length).
	var b32 = "";
	for(var i = 0; i < 7; i++)
	{
		var b32tmp = parseInt(hex.substr(0,5),16).toString(32);
		while(b32tmp.length < (i==6?2:4))
			b32tmp = "0"+b32tmp;
		b32 += b32tmp; 
		hex = hex.substr(5);
	}
	
	return (b32);
}

/**
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
ni.dump = function(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;

	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";

	if(typeof(arr) == 'object') { //Array/Hashes/Objects
		for(var item in arr) {
			var value = arr[item];
 
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
/*---------------------------*/

    ni.debug_set = fnNovaInitia_prefs_get("novainitia-debug");
    ni.debug_set = false;
    ni.show_login_bar = fnNovaInitia_prefs_get("novainitia-login_toolbar_visible_at_startup");
    ni.button_placement = fnNovaInitia_prefs_get("novainitia-stash_barrel_button_placement_bottom");

    /* Called by page load listener used to send XUL elements to the toolbar class since the class can't reach them */
    ni.initialize_toolbar = function () {
        console.log("Let's novainitia-hotkey_spider it works");
        if (ni.debug_set) alert('ni.initialize_toolbar: ' + this + ' ' + this.id);
        ni.Toolbar.loadToolbar(document.getElementById('nova_initia_login_toolbar'), document.getElementById('nova_initia_tools_toolbar'), document.getElementById("nova_initia_barrel_panel"), document.getElementById("nova_initia_barrel_panel_label"), document.getElementById("nova_initia_barrel_panel_title_0"), document.getElementById("nova_initia_barrel_panel_title_1"), document.getElementById("nova_initia_barrel_panel_title_2"), document.getElementById("nova_initia_barrel_panel_image"), document.getElementById("nova_initia_barrel_panel_button"), document.getElementById("nova_initia_barrel_panel_profile_button"), document.getElementById("nova_initia_doorway_panel"), document.getElementById("nova_initia_doorway_panel_label"), document.getElementById("nova_initia_doorway_panel_image"), document.getElementById("nova_initia_doorway_panel_hint_label_0"), document.getElementById("nova_initia_doorway_panel_hint_label_1"), document.getElementById("nova_initia_doorway_panel_hint_label_2"), document.getElementById("nova_initia_doorway_panel_hidden_label"), document.getElementById("nova_initia_doorway_panel_button"), document.getElementById("nova_initia_doorway_panel_next_button"), document.getElementById("nova_initia_doorway_panel_prev_button"), document.getElementById("nova_initia_doorway_panel_chain_button"), document.getElementById("nova_initia_doorway_panel_profile_button"), document.getElementById("nova_initia_doorway_panel_dismiss_button"), document.getElementById("nova_initia_doorway_panel_count"), document.getElementById("nova_initia_trap_panel"), document.getElementById("nova_initia_trap_panel_label"), document.getElementById("nova_initia_trap_panel_description"), document.getElementById("nova_initia_trap_panel_image"), document.getElementById("nova_initia_spider_panel"), document.getElementById("nova_initia_spider_panel_label"), document.getElementById("nova_initia_spider_panel_description"), document.getElementById("nova_initia_spider_panel_image"), document.getElementById("nova_initia_tools_menuitem_logout"), document.getElementById("nova_initia_tools_menuitem_login"), document.getElementById("nova_initia_throbber"), document.getElementById("nova_initia_login_toolbar_throbber"), parent.document.getElementsByClassName('nova_initia_tools_toolbarbutton'), document.getElementById('nova_initia_tools_menu_user_submenu'), document.getElementById('menu_nova_initia_tools_menu_user_submenupopup'), document.getElementById('nova_initia_user_menu_separator'), document.getElementById('nova_initia_tool_trap'), document.getElementById('nova_initia_tool_barrel'), document.getElementById('nova_initia_tool_spider'), document.getElementById('nova_initia_shield_panel'), document.getElementById('nova_initia_shield_panel_label'), document.getElementById('nova_initia_shield_panel_description'), document.getElementById('nova_initia_shield_panel_image'), document.getElementById('nova_initia_tool_shield'), document.getElementById('nova_initia_tool_doorway'), document.getElementById('nova_initia_tool_signpost'), document.getElementById('nova_initia_tool_barrel_panel_popup_sg_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_sg_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_traps_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_traps_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_barrels_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_barrels_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_spiders_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_spiders_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_shields_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_shields_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_doorways_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_doorways_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_signposts_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_signposts_image_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_message_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_label'), document.getElementById('nova_initia_tool_barrel_panel_popup_top'), document.getElementById('nova_initia_tool_barrel_panel_popup_stash_button_top'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_sg'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_traps'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_barrels'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_spiders'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_shields'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_doorways'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_signposts'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_message'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_label'), document.getElementById('nova_initia_tool_barrel_loot_panel_popup_thanks_button'), document.getElementById('nova_initia_tool_doorway_panel_popup'), document.getElementById('nova_initia_tool_doorway_panel_popup_URL'), document.getElementById('nova_initia_tool_doorway_panel_popup_hint'), document.getElementById('nova_initia_tool_doorway_panel_popup_comment'), document.getElementById('nova_initia_tool_doorway_panel_popup_URL_image'), document.getElementById('nova_initia_tool_doorway_panel_popup_add_to_chain'), document.getElementById('nova_initia_tool_doorway_panel_popup_nsfw'), document.getElementById('nova_initia_doorway_panel_end'), document.getElementById('nova_initia_doorway_panel_end_label'), document.getElementById('nova_initia_doorway_panel_end_comment_textbox'), document.getElementById('nova_initia_doorway_panel_end_button'), document.getElementById('nova_initia_tool_sg'), document.getElementById('nova_initia_tour_panel'), document.getElementById('nova_initia_tour_panel_title_label'), document.getElementById('nova_initia_tour_panel_comment_textbox'), document.getElementById('nova_initia_tour_panel_back_button'), document.getElementById('nova_initia_tour_panel_complete_button'), document.getElementById('nova_initia_tour_panel_complete_label'), document.getElementById('nova_initia_tour_panel_A_button'), document.getElementById('nova_initia_tour_panel_B_button'), document.getElementById('nova_initia_tour_panel_C_button'), document.getElementById('nova_initia_tour_panel_D_button'), document.getElementById('nova_initia_signpost_panel'), document.getElementById('nova_initia_signpost_panel_title_label'), document.getElementById('nova_initia_signpost_panel_user_label'), document.getElementById('nova_initia_signpost_panel_image'), document.getElementById('nova_initia_signpost_panel_goto_start_button'), document.getElementById('nova_initia_tour_start_panel'), document.getElementById('nova_initia_tour_start_panel_title_label'), document.getElementById('nova_initia_tour_start_panel_comment_textbox'), document.getElementById('nova_initia_tour_start_panel_start_tour_button'), document.getElementById('nova_initia_tool_signpost_panel_popup'), document.getElementById('nova_initia_tool_signpost_panel_popup_title'), document.getElementById('nova_initia_tool_signpost_panel_popup_comment'), document.getElementById('nova_initia_tool_signpost_panel_popup_nsfw'), document.getElementById("nova_initia_fail_panel"), document.getElementById("nova_initia_fail_panel_label"), document.getElementById("nova_initia_fail_panel_description"), document.getElementById("nova_initia_fail_panel_image"), document.getElementById("nova_initia_random_panel"), document.getElementById("nova_initia_random_panel_label"), document.getElementById("nova_initia_random_panel_description"), document.getElementById("nova_initia_random_panel_image"));
        console.log("SUCCESS!");
    }

    ni.Toolbar = new function createToolbar() {
        console.log("Attempting to create the toolbar...");
        if (ni.debug_set) {
            alert('nova_initia_toolbar: ' + this);
        }
        // Array to hold all of the trackable URL starters. Anything else will be rejected for tracking (ie: about:config, https:, etc...)
        var acceptable_URL_starters = new Array("http:");
        var user_cache = new window.NovaInitia.JSOC();
        var location_cache = new window.NovaInitia.JSOC();
        var doorway_cache = new window.NovaInitia.JSOC();
        var signpost_cache = new window.NovaInitia.JSOC();
        var signpost_panel = "";
        var signpost_panel_title_label = "";
        var signpost_panel_user_label = "";
        var signpost_panel_image = "";
        var signpost_panel_goto_button = "";
        var signpost_panel_open = false;
        var signpost_panel_popup = "";
        var signpost_panel_popup_title = "";
        var signpost_panel_popup_comment = "";
        var signpost_tool_id = "";
        var signpost_tool_cost = "";
        var signpost_tool_amount = "";
        var signpost_toolbar_button = "";
        var barrel_panel = "";
        var barrel_panel_label = "";
        var barrel_panel_title_0 = "";
        var barrel_panel_title_1 = "";
        var barrel_panel_title_2 = "";
        var barrel_panel_button = "";
        var barrel_panel_profile_button = "";
        var barrel_panel_image = "";
        var barrel_panel_open = false;
        var barrel_tool_id = "";
        var barrel_tool_cost = "";
        var barrel_tool_amount = "";
        var barrel_toolbar_button = "";
        var last_barrel_ID = "";
        var doorway_end_panel = "";
        var doorway_end_panel_label = "";
        var doorway_end_panel_comment = "";
        var doorway_end_panel_button = "";
        var doorway_end_panel_open = false;
        var doorway_panel = "";
        var doorway_panel_button = "";
        var doorway_panel_count = "";
        var doorway_panel_next_button = "";
        var doorway_panel_prev_button = "";
        var doorway_panel_chain_button = "";
        var doorway_panel_dismiss_button = "";
        var doorway_panel_hint_label_0 = "";
        var doorway_panel_hint_label_1 = "";
        var doorway_panel_hint_label_2 = "";
        var doorway_panel_hidden_label = "";
        var doorway_panel_label = "";
        var doorway_panel_image = "";
        var doorway_panel_open = false;
        var doorway_popup_panel = "";
        var doorway_popup_panel_URL = "";
        var doorway_popup_panel_hint = "";
        var doorway_popup_panel_comment = "";
        var doorway_popup_panel_add_to_checkbox = "";
        var doorway_popup_panel_URL_image = "";
        var doorway_popup_panel_nsfw_checkbox = "";
        var doorway_carousel_array = new Array();
        var doorway_tool_id = "";
        var doorway_tool_cost = "";
        var doorway_tool_amount = "";
        var doorway_toolbar_button = "";
        var fail_panel = "";
        var fail_panel_label = "";
        var fail_panel_description = "";
        var fail_panel_open = false;
        var fail_tool_id = "";
        var random_panel = "";
        var random_panel_label = "";
        var random_panel_description = "";
        var random_panel_open = false;
        var random_event_id = "";
        var trap_panel = "";
        var trap_panel_label = "";
        var trap_panel_description = "";
        var trap_panel_image = "";
        var trap_panel_open = false;
        var trap_tool_id = "";
        var trap_tool_cost = "";
        var trap_tool_amount = "";
        var trap_toolbar_button = "";
        var spider_panel = "";
        var spider_panel_label = "";
        var spider_panel_description = "";
        var spider_panel_image = "";
        var spider_panel_open = false;
        var spider_tool_id = "";
        var spider_tool_cost = "";
        var spider_tool_amount = "";
        var spider_toolbar_button = "";
        var shield_tool_id = "";
        var shield_tool_cost = "";
        var shield_toolbar_button = "";
        var shield_hits_left = 0;
        var shield_tool_amount = "";
        var shield_panel = "";
        var shield_panel_label = "";
        var shield_panel_description = "";
        var shield_panel_image = "";
        var shield_panel_open = false;
        var sg_tool_amount = "";
        var sg_toolbar_button = "";
        var open_barrel_sg_label = "";
        var open_barrel_traps_label = "";
        var open_barrel_barrels_label = "";
        var open_barrel_spiders_label = "";
        var open_barrel_shields_label = "";
        var open_barrel_doorways_label = "";
        var open_barrel_signposts_label = "";
        var open_barrel_message_label = "";
        var open_barrel_panel = "";
        var open_barrel_panel_open = false;
        var open_barrel_label = "";
        var open_barrel_button = "";
        var stash_barrel_sg_textbox = "";
        var stash_barrel_sg_image = "";
        var stash_barrel_traps_textbox = "";
        var stash_barrel_traps_image = "";
        var stash_barrel_traps_image_filler = "";
        var stash_barrel_barrels_textbox = "";
        var stash_barrel_barrels_image = "";
        var stash_barrel_barrels_image_filler = "";
        var stash_barrel_spiders_textbox = "";
        var stash_barrel_spiders_image = "";
        var stash_barrel_spiders_image_filler = "";
        var stash_barrel_shields_textbox = "";
        var stash_barrel_shields_image = "";
        var stash_barrel_shields_image_filler = "";
        var stash_barrel_doorways_textbox = "";
        var stash_barrel_doorways_image = "";
        var stash_barrel_doorways_image_filler = "";
        var stash_barrel_signposts_textbox = "";
        var stash_barrel_signposts_image = "";
        var stash_barrel_signposts_image_filler = "";
        var stash_barrel_message_textbox = "";
        var stash_barrel_panel = "";
        var stash_barrel_button = "";
        var tour_panel = "";
        var tour_panel_title_label = "";
        var tour_panel_comment_textbox = "";
        var tour_panel_back_button = "";
        var tour_panel_complete_button = "";
        var tour_panel_complete_label = "";
        var tour_panel_A_button = "";
        var tour_panel_B_button = "";
        var tour_panel_C_button = "";
        var tour_panel_D_button = "";
        var tour_panel_A_label = "";
        var tour_panel_B_label = "";
        var tour_panel_C_label = "";
        var tour_panel_D_label = "";
        var tour_panel_open = false;
        var tour_start_panel = "";
        var tour_start_panel_title_label = "";
        var tour_start_panel_comment_textbox = "";
        var tour_start_panel_start_button = "";
        var tour_start_panel_open = false;
        var at_tour_start = false;
        var in_a_tour = false;
        var cur_tour_info = "";
        var tour_path_info = new Array();
        var last_tour_ID = "";
        var last_doorwayID = "";
        var last_doorway_user = "";
        var user_menu = "";
        var user_menu_popup = "";
        var user_menu_separator = "";
        var user_array = new Array();
        var user_JSON = "";
        var temporary_tool_user = "";
        var login_toolbar = "";
        var toolbar = "";
        var toolbar_throbber = "";
        var loginbar_throbber = "";
        var toolbutton_elements = new Array();
        var logout_menuitem = "";
        var login_menuitem = "";
        var logged_in = false;
        var user_name = "";
        var current_key = "";
        var notification_timeout = "";
        var login_saved = fnNovaInitia_prefs_get("novainitia-login_saved");
        
        //var server_url = fnNovaInitia_prefs_get("novainitia-server_url");
        var server_url = "nova-initia.com";
        //var url_prefix = fnNovaInitia_prefs_get("novainitia-url_prefix");
        var url_prefix = "data.";
        
        var cur_url_hash = "";
        var cur_domain_hash = "";
        var cur_url = "";
        var prev_url = "";
        var cur_page_num = 0;
        var cur_signpost_ID = "";
        var cur_tour_group_ID = "";
        var prev_signpost_ID = "";
        var at_a_page = false;
        var took_doorway = false;
        var tool_array = new Array();
        var class_giver_ID = "1";
        var class_guardian_ID = "2";
        var class_guide_ID = "3";
        var trapTimeout = 0;
        var barrelTimeout = 0;
        var spiderTimeout = 0;
        var shieldTimeout = 0;
        var doorwayTimeout = 0;
        var signpostTimeout = 0;
        var failTimeout = 0;
        var randomTimeout = 0;
        var locationTimeout = 0;

        this.AutoSyncEnabled = false;

        /* initialize the toolbar by setting all necessary variables */
        this.loadToolbar = function (loginToolbar, mainToolbar, barrelPanel, barrelPanelLabel, barrelPanelTitle0, barrelPanelTitle1, barrelPanelTitle2, barrelPanelImage, barrelPanelButton, barrelPanelProfileButton, doorwayPanel, doorwayPanelLabel, doorwayPanelImage, doorwayPanelHintLabel0, doorwayPanelHintLabel1, doorwayPanelHintLabel2, doorwayPanelHiddenLabel, doorwayPanelButton, doorwayPanelNextButton, doorwayPanelPrevButton, doorwayPanelChainButton, doorwayPanelProfileButton, doorwayPanelDismissButton, doorwayCount, trapPanel, trapPanelLabel, trapPanelDescription, trapPanelImage, spiderPanel, spiderPanelLabel, spiderPanelDescription, spiderPanelImage, logoutMenuitem, loginMenuitem, toolbarThrobber, loginbarThrobber, toolbuttonElements, userMenu, userMenuPopup, userMenuSeparator, trapToolbarButton, barrelToolbarButton, spiderToolbarButton, shieldPanel, shieldPanelLabel, shieldPanelDescription, shieldPanelImage, shieldToolbarButton, doorwayToolbarButton, signpostToolbarButton, stashSg, stashSgImage, stashTraps, stashTrapsImage, stashBarrels, stashBarrelsImage, stashSpiders, stashSpidersImage, stashShields, stashShieldsImage, stashDoorways, stashDoorwaysImage, stashSignposts, stashSignpostsImage, stashMessage, stashLabel, stashPanel, stashButton, openSg, openTraps, openBarrels, openSpiders, openShields, openDoorways, openSignposts, openMessage, openPanel, openLabel, openButton, doorwayPopupPanel, doorwayPopupPanelURL, doorwayPopupPanelHint, doorwayPopupPanelComment, doorwayPopupPanelURLImage, doorwayPopupPanelAddCheckbox, doorwayPopupPanelNSFWCheckbox, endDoorwayPanel, endDoorwayPanelLabel, endDoorwayPanelComment, endDoorwayPanelButton, sgButton, tourPanel, tourPanelTitle, tourPanelComments, tourPanelBack, tourPanelComplete, tourPanelCompleteLabel, tourPanelA, tourPanelB, tourPanelC, tourPanelD, signpostPanel, signpostPanelTitle, signpostPanelUser, signpostPanelImage, signpostPanelGotoStartButton, tourStartPanel, tourStartPanelTitle, tourStartPanelComment, tourStartPanelStartTourButton, signpostPopup, signpostPopupTitle, signpostPopupComment, signpostNSFWCheckbox, failPanel, failPanelLabel, failPanelDescription, failPanelImage, randomPanel, randomPanelLabel, randomPanelDescription, randomPanelImage) {
            toolbutton_elements = toolbuttonElements;
            this.set_toolbutton_orient(fnNovaInitia_prefs_get("novainitia-toolbar_text_orientation_vertical"));
            if (ni.debug_set) alert('loadToolBar: ' + this);
            login_toolbar = loginToolbar;
            toolbar = mainToolbar;
            signpost_panel = signpostPanel;
            signpost_panel_title_label = signpostPanelTitle;
            signpost_panel_user_label = signpostPanelUser;
            signpost_panel_image = signpostPanelImage;
            signpost_panel_goto_button = signpostPanelGotoStartButton;
            signpost_panel_popup = signpostPopup;
            signpost_panel_popup_title = signpostPopupTitle;
            signpost_panel_popup_comment = signpostPopupComment;
            signpost_panel_popup_nsfw = signpostNSFWCheckbox;
            signpost_toolbar_button = signpostToolbarButton;
            tour_start_panel = tourStartPanel;
            tour_start_panel_title_label = tourStartPanelTitle;
            tour_start_panel_comment_textbox = tourStartPanelComment;
            tour_start_panel_start_button = tourStartPanelStartTourButton;
            barrel_panel = barrelPanel;
            barrel_panel_label = barrelPanelLabel;
            barrel_panel_title_0 = barrelPanelTitle0;
            barrel_panel_title_1 = barrelPanelTitle1;
            barrel_panel_title_2 = barrelPanelTitle2;
            barrel_panel_image = barrelPanelImage;
            barrel_panel_button = barrelPanelButton;
            barrel_panel_profile_button = barrelPanelProfileButton;
            barrel_toolbar_button = barrelToolbarButton;
            doorway_end_panel = endDoorwayPanel;
            doorway_end_panel_label = endDoorwayPanelLabel;
            doorway_end_panel_comment = endDoorwayPanelComment;
            doorway_end_panel_button = endDoorwayPanelButton;
            doorway_panel = doorwayPanel;
            doorway_panel_button = doorwayPanelButton;
            doorway_panel_next_button = doorwayPanelNextButton;
            doorway_panel_prev_button = doorwayPanelPrevButton;
            doorway_panel_chain_button = doorwayPanelChainButton;
            doorway_panel_profile_button = doorwayPanelProfileButton;
            doorway_panel_dismiss_button = doorwayPanelDismissButton;
            doorway_panel_count = doorwayCount;
            doorway_panel_hint_label_0 = doorwayPanelHintLabel0;
            doorway_panel_hint_label_1 = doorwayPanelHintLabel1;
            doorway_panel_hint_label_2 = doorwayPanelHintLabel2;
            doorway_panel_hidden_label = doorwayPanelHiddenLabel;
            doorway_panel_label = doorwayPanelLabel;
            doorway_panel_image = doorwayPanelImage;
            doorway_popup_panel = doorwayPopupPanel;
            doorway_popup_panel_URL = doorwayPopupPanelURL;
            doorway_popup_panel_hint = doorwayPopupPanelHint;
            doorway_popup_panel_comment = doorwayPopupPanelComment;
            doorway_popup_panel_add_to_checkbox = doorwayPopupPanelAddCheckbox;
            doorway_popup_panel_nsfw_checkbox = doorwayPopupPanelNSFWCheckbox;
            doorway_popup_panel_URL_image = doorwayPopupPanelURLImage;
            doorway_toolbar_button = doorwayToolbarButton;
            fail_panel = failPanel;
            fail_panel_label = failPanelLabel;
            fail_panel_description = failPanelDescription;
            fail_panel_image = failPanelImage;
            random_panel = randomPanel;
            random_panel_label = randomPanelLabel;
            random_panel_description = randomPanelDescription;
            random_panel_image = randomPanelImage;
            trap_panel = trapPanel;
            trap_panel_label = trapPanelLabel;
            trap_panel_description = trapPanelDescription;
            trap_panel_image = trapPanelImage;
            trap_toolbar_button = trapToolbarButton;
            spider_panel = spiderPanel;
            spider_panel_label = spiderPanelLabel;
            spider_panel_description = spiderPanelDescription;
            spider_panel_image = spiderPanelImage;
            spider_toolbar_button = spiderToolbarButton;
            shield_panel = shieldPanel;
            shield_panel_label = shieldPanelLabel;
            shield_panel_description = shieldPanelDescription;
            shield_panel_image = shieldPanelImage;
            shield_toolbar_button = shieldToolbarButton;
            open_barrel_sg_label = openSg;
            open_barrel_traps_label = openTraps;
            open_barrel_barrels_label = openBarrels;
            open_barrel_spiders_label = openSpiders;
            open_barrel_shields_label = openShields;
            open_barrel_doorways_label = openDoorways;
            open_barrel_signposts_label = openSignposts;
            open_barrel_message_label = openMessage;
            open_barrel_panel = openPanel;
            open_barrel_label = openLabel;
            open_barrel_button = openButton;
            stash_barrel_sg_textbox = stashSg;
            stash_barrel_sg_image = stashSgImage;
            stash_barrel_traps_textbox = stashTraps;
            stash_barrel_traps_image = stashTrapsImage;
            stash_barrel_barrels_textbox = stashBarrels;
            stash_barrel_barrels_image = stashBarrelsImage;
            stash_barrel_spiders_textbox = stashSpiders;
            stash_barrel_spiders_image = stashSpidersImage;
            stash_barrel_shields_textbox = stashShields;
            stash_barrel_shields_image = stashShieldsImage;
            stash_barrel_doorways_textbox = stashDoorways;
            stash_barrel_doorways_image = stashDoorwaysImage;
            stash_barrel_signposts_textbox = stashSignposts;
            stash_barrel_signposts_image = stashSignpostsImage;
            stash_barrel_message_textbox = stashMessage;
            stash_barrel_label_textbox = stashLabel;
            stash_barrel_panel = stashPanel;
            stash_barrel_button = stashButton;
            tour_panel = tourPanel;
            tour_panel_title_label = tourPanelTitle;
            tour_panel_comment_textbox = tourPanelComments;
            tour_panel_back_button = tourPanelBack;
            tour_panel_complete_button = tourPanelComplete;
            tour_panel_complete_label = tourPanelCompleteLabel;
            tour_panel_A_button = tourPanelA;
            tour_panel_B_button = tourPanelB;
            tour_panel_C_button = tourPanelC;
            tour_panel_D_button = tourPanelD;
            sg_toolbar_button = sgButton;
            logout_menuitem = logoutMenuitem;
            login_menuitem = loginMenuitem;
            toolbar_throbber = toolbarThrobber;
            if (toolbar_throbber) toolbar_throbber.hidden = true;
            loginbar_throbber = loginbarThrobber;
            if (ni.show_login_bar) {
                //login_toolbar.hidden = false;
                //login_toolbar.collapsed = false;
            }
            //toolbar.hidden = true;
            //toolbar.collapsed = true;
            user_menu = userMenu;
            user_menu_popup = userMenuPopup;
            user_menu_separator = userMenuSeparator;
            //ni.Toolbar.setup_user_menu();
            fnNovaInitia_prefs_set("novainitia-cur_username", "");
            fnNovaInitia_prefs_set("novainitia-cur_ava_url", "");
            fnNovaInitia_prefs_set("novainitia-cur_tagline", "");
            fnNovaInitia_prefs_set("novainitia-cur_email", "");
            fnNovaInitia_prefs_set("novainitia-cur_location", "");
            fnNovaInitia_prefs_set("novainitia-cur_class", "");
            fnNovaInitia_prefs_set("novainitia-cur_id", "");
            fnNovaInitia_prefs_set("novainitia-cur_hash", "");
            try {
                //Add buttons when updates come along
                var nitoolbar = document.getElementById("nova_initia_tools_toolbar");
                var curSet = nitoolbar.currentSet;
                //This will need to come out of a future version.
                var set = "nova_initia_tool_trap,nova_initia_tool_barrel,nova_initia_tool_signpost,nova_initia_tool_doorway,nova_initia_tool_spider,nova_initia_tool_shield,nova_initia_events,nova_initia_mail,nova_initia_profile,nova_intia_logout,spring,nova_initia_throbber,spring,nova_initia_tool_sg";
                nitoolbar.setAttribute("currentset", set);
                nitoolbar.currentSet = set;
                document.persist("nova_initia_tools_toolbar", "currentset");
                try {
                    BrowserToolboxCustomizeDone(true);
                } catch (e) {}
            } catch (e) {}


            try {
                curSet = nitoolbar.currentSet;
                if (curSet.indexOf("nova_intia_logout") == -1) {
                    set = curSet.replace(/nova_initia_profile/, "nova_initia_profile,nova_initia_logout");
                    nitoolbar.setAttribute("currentset", set);
                    nitoolbar.currentSet = set;
                    document.persist("nova_initia_tools_toolbar", "currentset");
                    try {
                        BrowserToolboxCustomizeDone(true);
                    } catch (e) {}
                }
            } catch (e) {}
        };

        
    // Preferences for hotkeys
        this.capture_key = function (e) {
            var theKeyObj = ni.KeyCode.translate_event(e);
            var theFullKey = ni.KeyCode.hot_key(theKeyObj);
            var theKey = ni.KeyCode.orig_key(theKeyObj);
            var modCtrl = fnNovaInitia_prefs_get("novainitia-hotkey_modifier_ctrl");
            var modAlt = fnNovaInitia_prefs_get("novainitia-hotkey_modifier_alt");
            var modShift = fnNovaInitia_prefs_get("novainitia-hotkey_modifier_shift");
            var evt = document.createEvent("KeyboardEvent");
            evt.initKeyEvent("keypress", false, true, null, false, false, false, false, 13, 0);

            var modCtrlMatch = false;
            if (modCtrl) {
                if (theKeyObj.ctrl) {
                    modCtrlMatch = true;
                }
            } else {
                if (!theKeyObj.ctrl) {
                    modCtrlMatch = true;
                }
            }

            var modAltMatch = false;
            if (modAlt) {
                if (theKeyObj.alt) {
                    modAltMatch = true;
                }
            } else {
                if (!theKeyObj.alt) {
                    modAltMatch = true;
                }
            }

            var modShiftMatch = false;
            if (modShift) {
                if (theKeyObj.shift) {
                    modShiftMatch = true;
                }
            } else {
                if (!theKeyObj.shift) {
                    modShiftMatch = true;
                }
            }

            if (modCtrlMatch && modAltMatch && modShiftMatch) {
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_trap").toUpperCase()) trap_toolbar_button.click();
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_barrel").toUpperCase()) barrel_toolbar_button.click();
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_signpost").toUpperCase()) signpost_toolbar_button.click();
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_doorway").toUpperCase()) doorway_toolbar_button.click();
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_spider").toUpperCase()) spider_toolbar_button.click();
                if (theKey == fnNovaInitia_prefs_get("novainitia-hotkey_shield").toUpperCase()) shield_toolbar_button.click();
            }
        };

        /* Get all the saved users and call setup_user_menuitem on them */
        /*this.setup_user_menu = function () {
            var tmpObj = new Object();
            var children = ni.prefManager.getChildList("extensions.nova-initia.saved_users", tmpObj);
            user_array = new Array();
            for (var j = 0; j < tmpObj.value; j++) {
                this.setup_user_menuitem(ni.prefManager.getCharPref(children[j]));
            }
        };*/

        /* Inserts the saved user XUL into the switch user menu of the nova initia tool menu */
        this.setup_user_menuitem = function (theUser) {
            if (ni.debug_set) alert('adding ' + theUser + ' to users menu');
            if (!this.inArray(user_array, theUser)) {
                if (ni.debug_set) alert("not added yet");
                var userItem = document.createElement("menuitem");
                userItem.setAttribute("id", "nova_initia_user_menu_" + theUser);
                userItem.setAttribute("label", theUser);
                userItem.setAttribute("insertbefore", "nova_initia_user_menu_separator");
                userItem.setAttribute("oncommand", "NovaInitia.Toolbar.process_login(this,false,'" + theUser + "',true)");
                user_menu_popup.insertBefore(userItem, user_menu_separator);
                user_array[user_array.length] = theUser;
            }
        };

        this.remove_user_menuitem = function (theUser) {
            var userItem = document.getElementById("nova_initia_user_menu_" + theUser);
            user_menu_popup.removeChild(userItem);
        };

        /* returns trus if theItem is in theArray, false otherwise */
        this.inArray = function (theArray, theItem) {
            for (var i = 0; i < theArray.length; i++) {
                if (theArray[i] == theItem) return true;
            }
            return false;
        };

        /* set the orientation of the text to the toolbutton icon images */
        this.set_toolbutton_orient = function (theOrient) {
            var i = 0;
            while (toolbutton_elements[i]) {
                if (theOrient) toolbutton_elements[i].orient = "vertical";
                else toolbutton_elements[i].orient = "horizontal";
                i++;
                if (!toolbutton_elements[i]) break;
            }
        };

        /* Grab all tool information from server and set all corresponding internal vars */
        this.initialize_tools = function (theRes) {
            if (ni.debug_set) {
                alert("initialize tools");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            
            if (theRes.status == 200) {
                var tmp_tool_res = ni.JSON.parse(theRes.responseText);
                var i = 0;
                while (tmp_tool_res.toolSet[i]) {
                    if (ni.debug_set) alert("processing tool: " + tmp_tool_res.toolSet[i].NAME);
                    switch (tmp_tool_res.toolSet[i].NAME) {
                    case 'Trap':
                        trap_tool_id = tmp_tool_res.toolSet[i].ID;
                        trap_tool_cost = tmp_tool_res.toolSet[i].COST;
                        var tmp_array = [trap_panel, trap_panel_label];
                        tool_array[Number(trap_tool_id)] = tmp_array;
                        break;
                    case 'Barrel':
                        barrel_tool_id = tmp_tool_res.toolSet[i].ID;
                        barrel_tool_cost = tmp_tool_res.toolSet[i].COST;
                        var tmp_array = [barrel_panel, barrel_panel_label];
                        tool_array[Number(barrel_tool_id)] = tmp_array;
                        break;
                    case 'Spider':
                        spider_tool_id = tmp_tool_res.toolSet[i].ID;
                        spider_tool_cost = tmp_tool_res.toolSet[i].COST;
                        tool_array[spider_tool_id] = [spider_panel, spider_panel_label];
                        break;
                    case 'Shield':
                        shield_tool_id = tmp_tool_res.toolSet[i].ID;
                        shield_tool_cost = tmp_tool_res.toolSet[i].COST;
                        tool_array[shield_tool_id] = [shield_panel, shield_panel_label];
                        break;
                    case 'Doorway':
                        doorway_tool_id = tmp_tool_res.toolSet[i].ID;
                        doorway_tool_cost = tmp_tool_res.toolSet[i].COST;
                        var tmp_array = [doorway_panel, doorway_panel_label];
                        tool_array[Number(doorway_tool_id)] = tmp_array;
                        break;
                    case 'Signpost':
                        signpost_tool_id = tmp_tool_res.toolSet[i].ID;
                        signpost_tool_cost = tmp_tool_res.toolSet[i].COST;
                        var tmp_array = [signpost_panel, signpost_panel_user_label];
                        tool_array[Number(signpost_tool_id)] = tmp_array;
                        break;
                    }
                    i++;
                }
                NovaInitia.Toolbar.sync_user();
            } else alert("Server Error, please contact suppport (Code: -200)");
        };

        /********** - Panel Display Functions - **********/

        /* open an event panel */
        this.set_panel_open = function (thePanel) {
            
            if (thePanel != null) {
               niClientApp_catchPopup(thePanel.id);
            } else {
                return;
            }
            
            //ni.jQuery(thePanel).attr("open", "true");
            switch (thePanel.id) {
            case 'nova_initia_doorway_panel_end':
                doorway_end_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_trap_panel':
                trap_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_signpost_panel':
                signpost_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_doorway_panel':
                doorway_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_barrel_panel':
                barrel_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_tool_barrel_loot_panel_popup':
                open_barrel_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_spider_panel':
                spider_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_tour_start_panel':
                tour_start_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_tour_panel':
                tour_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_shield_panel':
                shield_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_fail_panel':
                fail_panel_open = true;
                ni.panels_open = true;
                break;
            case 'nova_initia_random_panel':
                random_panel_open = true;
                ni.panels_open = true;
                break;
            }
        };

        /* find all open event panels and return the eobjects in an array */
        this.get_open_panels = function () {
            if (ni.panels_open) {
                var openPanels = ni.jQuery(".nova_initia_panel_class[open='true']").get();

                if (openPanels.length > 0) return openPanels;
                else return false;
            }
            return false;
        };

        /* Calculate and display the event panels */
        this.show_panel = function (thePanels) {
            if (this.isArray(thePanels)) {
                for (z=0; z<thePanels.length; z++) {
                    this.set_panel_open(thePanels[z]);
                }
            } else {
                this.set_panel_open(thePanels);
            }
                
        /*  var lastPanel = this.getAnchor();
            var openPanels = this.get_open_panels();

            //this.dismiss_all_panels();
            var setX = gBrowser.boxObject.screenX;
            var setY = gBrowser.boxObject.screenY;
            if (ni.debug_set) alert("is array: " + this.isArray(thePanels));
            if (this.isArray(thePanels)) {
                var i = 0;
                var tmpHeight = 0;

                while (thePanels[i]) {
                    this.set_panel_open(thePanels[i]);
                    var tmpSetY = setY + (i * 52);
                    var tmpSetY = setY + (tmpHeight);
                    thePanels[i].openPopup(lastPanel, "after_end", 0, 0, false, false);
                    this.toggleTextAndButtons(thePanels[i]);
                    ni.panels_open = true;
                    switch (thePanels[i].id) {
                    case 'nova_initia_doorway_panel_end':
                        tmpHeight += 175;
                        break;
                    case 'nova_initia_shield_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_fail_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_random_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_trap_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_signpost_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_doorway_panel':
                        tmpHeight += 216;
                        break;
                    case 'nova_initia_barrel_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_tool_barrel_loot_panel_popup':
                        tmpHeight += 255;
                        break;
                    case 'nova_initia_spider_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_tour_panel':
                        tmpHeight += 202;
                        break;
                    case 'nova_initia_tour_start_panel':
                        tmpHeight += 202;
                        break;
                    }
                    i++;
                }
            } else {
                this.set_panel_open(thePanels);
                thePanels.openPopup(lastPanel, "after_end", 0, 0, false, false);
                //thePanels.openPopupAtScreen(setX,setY,false);
                this.toggleTextAndButtons(thePanels);
                ni.panels_open = true;

            }
        */
        };

        this.getAnchor = function () {
        /*    var anchor = null;
            var panelSet = ni.jQuery("#mainPopupSet>.nova_initia_panel_class[open=true]");
            var attachTo = null;
            panelSet.each(function () {
                if (anchor == null || anchor.boxObject.Y + anchor.boxObject.height < this.boxObject.Y + this.boxObject.height) anchor = this;
            });

            attachTo = ni.jQuery('#navigator-toolbox').get(0);

            if (anchor != null) {

                attachTo = anchor;
            }

            return attachTo;*/
        };

        /* dismiss all open event panels */
        this.dismiss_all_panels = function () {
            var thePanels = this.get_open_panels();
            if (thePanels) {
                var i = 0
                while (thePanels[i]) {
                    this.dismiss_panel(thePanels[i].id);
                    i++;
                }
            }
        };

        /* Sets the about panel information and opens the panel */
        this.show_about_panel = function (theBrowserObj, thePanel, theVersionLabel) {
            var currentVer;
            if (typeof (AddonManager) != "undefined") {
                AddonManager.getAddonByID("nova-initia@nova-initia.com", function (aAddon) {
                    currentVer = aAddon.version;
                    theVersionLabel.value = "Version: " + currentVer;
                    thePanel.openPopup(theBrowserObj, 'before_start', 0, 0, false, false);
                });
            } else {
                currentVer = ni.extensionManager.getItemForID("nova-initia@nova-initia.com").version;
                theVersionLabel.value = "Version: " + currentVer;
                thePanel.openPopup(theBrowserObj, 'before_start', 0, 0, false, false);
            }
        };

        /* dismiss an event panel and reposition the others */
        this.dismiss_panel = function (thePanel, doorwayArrayPos, sendToServer) {
            /*thePanelId = thePanel.indexOf("#") > -1 ? thePanel : "#" + thePanel;
            var disabledButtons = parent.document.querySelector(thePanelId + "_buttons>button");
            if (disabledButtons) disabledButtons.removeAttribute("noshow");
            if (ni.debug_set) alert("Dismissing panel: " + thePanel);
            ni.jQuery(thePanelId).attr("open", "false");
            switch (thePanel) {
            case 'nova_initia_doorway_panel_end':
                doorway_end_panel_open = false;
                doorway_end_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_trap_panel':
                trap_panel_open = false;
                trap_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_signpost_panel':
                if (last_tour_ID && sendToServer) {
                    var trackURL = "http://" + url_prefix + server_url + "/rf/remog/group/" + last_tour_ID + "/dismiss.json";
                    last_tour_ID = "";
                    this.send_request(trackURL, "PUT", null, true, this.process_dismiss_panel, false, null);
                }

                signpost_panel_open = false;
                signpost_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_doorway_panel':
                if (undefined === doorwayArrayPos) {
                    doorway_panel_open = false;
                    doorway_panel.hidePopup();
                } else {
                    var theID = doorway_carousel_array[doorwayArrayPos][0];
                    var trackURL = "http://" + url_prefix + server_url + "/rf/remog/doorway/" + theID + "/dismiss.json";
                    this.send_request(trackURL, "PUT", null, true, this.process_dismiss_panel, false);
                    if (doorwayArrayPos == 0) {
                        if (doorway_carousel_array.length > 1) {
                            doorway_carousel_array = doorway_carousel_array.slice(1);
                            this.setup_doorways(0);
                        } else {
                            doorway_panel_open = false;
                            doorway_panel.hidePopup();
                        }
                    } else {
                        if (doorway_carousel_array[doorwayArrayPos + 1]) {
                            var tmpArr = doorway_carousel_array.slice(doorwayArrayPos + 1);
                            doorway_carousel_array = doorway_carousel_array.slice(0, doorwayArrayPos);
                            doorway_carousel_array = doorway_carousel_array.concat(tmpArr);
                        } else doorway_carousel_array = doorway_carousel_array.slice(0, doorwayArrayPos);
                        this.setup_doorways(doorwayArrayPos - 1);
                    }
                }
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_barrel_panel':
                if (last_barrel_ID && sendToServer) {
                    var trackURL = "http://" + url_prefix + server_url + "/rf/remog/gift/" + last_barrel_ID + "/dismiss.json";
                    last_barrel_ID = "";
                    this.send_request(trackURL, "PUT", null, true, this.process_dismiss_panel, false, null);
                }
                barrel_panel_open = false;
                barrel_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_spider_panel':
                spider_panel_open = false;
                spider_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_tour_panel':
                tour_panel_open = false;
                tour_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_tour_start_panel':
                tour_start_panel_open = false;
                tour_start_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_tool_barrel_loot_panel_popup':
                open_barrel_panel_open = false;
                open_barrel_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_fail_panel':
                fail_panel_open = false;
                fail_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            case 'nova_initia_random_panel':
                random_panel_open = false;
                random_panel.hidePopup();
                if (!this.get_open_panels()) ni.panels_open = false;
                break;
            }
            */
        };

        this.process_dismiss_panel = function (theRes) {
            // JSON decode
            if (theRes.status == 200) {
                var tmpDismissResponse = ni.JSON.parse(theRes.responseText);
                if (ni.debug_set) {
                    alert("dismiss_panel status: " + theRes.status);
                    alert("dismiss_panel responseText: " + theRes.responseText);
                    //if (tmpDismissResponse.error) this.send_notification("Failed to Dismiss: " + tmpDismissResponse.error + "!", "PRIORITY_INFO_LOW");
                    //if (tmpDismissResponse.result) {
                    //    this.send_notification("Successfully Dismissed!", "PRIORITY_INFO_LOW");
                    //}
                }
            } //else this.send_notification("Dismiss received bad server response!", "PRIORITY_INFO_LOW");
        };

        /* gets called by the window resize event listener or other panel functions that need to reposition the panels */
        this.window_resized = function () {
            var openPanels = NovaInitia.Toolbar.get_open_panels();
            if (openPanels) {
                ni.jQuery(openPanels).each(function () {
                    this.hidePopup();
                });
                NovaInitia.Toolbar.show_panel(openPanels);
            }
        };

        this.new_message = function (recipient) {
            ni.jQuery('#nova_initia_mail_receiver')[0].value = ni.jQuery(recipient)[0].value;
            ni.jQuery('#nova_initia_mail_panel_popup')[0].openPopup(NovaInitia.Toolbar.getAnchor(), 'after_end', 0, 0, null, null);
        };

        this.openTab = function (theURL, register) {
            ni.tBrowser = top.document.getElementById("content");
            if (register) ni.tab = ni.tBrowser.addTab("http://www." + server_url + "/register.php");
            else ni.tab = ni.tBrowser.addTab(theURL);
            ni.tBrowser.selectedTab = ni.tab;
        };

        /* redirects the current tab to a new URL, sets up necessary info if the redirection if from 'stepping through' a doorway */
        this.redirect_to = function (theURL, theDoorwayID, theUser, theTourID, theGroupID) {
            NovaInitia.Toolbar.showThrobber();
            if (theDoorwayID) {
                var doorway_cached = doorway_cache.get(theDoorwayID);
                var tmp_doorway = null;

                function doorway_loaded(tmp_doorway) {
                    if (tmp_doorway) {
                        var tmpDoorwayInfo = ni.JSON.parse(tmp_doorway);
                        if (tmpDoorwayInfo.doorway.Url) {
                            took_doorway = true;
                            last_doorwayID = theDoorwayID;
                            last_doorway_user = theUser;
                            openUILink(ni.urldecode(tmpDoorwayInfo.doorway.Url));
                        }
                    }
                }

                function doorway_request_finished(doorwayReq) {
                    if (ni.debug_set) alert(doorwayReq.status + " | " + doorwayReq.responseText);
                    if (doorwayReq.status == 200) {
                        tmp_doorway = doorwayReq.responseText;
                        doorway_cache.add(theDoorwayID, doorwayReq.responseText);
                    } //else this.send_notification("Bad response looking up doorway information", "PRIORITY_CRITICAL_HIGH");

                    doorway_loaded(tmp_doorway);

                    NovaInitia.Toolbar.hideThrobber();
                }

                NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/doorway/" + theDoorwayID + ".json", "GET", null, true, doorway_request_finished, false, null);

            } else if (theTourID) {
                if (at_tour_start) {
                    tour_path_info = new Array(new Array(0, cur_url));
                }
                at_tour_start = false;
                in_a_tour = true;
                prev_signpost_ID = cur_signpost_ID;
                cur_signpost_ID = theTourID;
                if (theURL) {
                    if (theGroupID) cur_tour_group_ID = theGroupID;
                    tour_path_info.push(new Array(cur_signpost_ID, theURL));
                    openUILink(ni.urldecode(theURL));
                } else {
                    var signpost_cached = signpost_cache.get(theTourID);
                    var tmp_signpost = null;

                    function signpost_loaded(tmp_signpost) {
                        if (tmp_signpost) {
                            var tmpSignpostInfo = ni.JSON.parse(tmp_signpost);
                            cur_tour_group_ID = tmpSignpostInfo.signpost.GroupID;
                            tour_path_info.push(new Array(cur_signpost_ID, tmpSignpostInfo.signpost.Url));
                            openUILink(ni.urldecode(tmpSignpostInfo.signpost.Url));
                        }

                        NovaInitia.Toolbar.hideThrobber();
                    }

                    if (signpost_cached) {
                        tmp_signpost = signpost_cached[theTourID];
                        signpost_loaded(tmp_signpost);
                    } else {
                        var tmpURL = "http://" + url_prefix + server_url + "/rf/remog/signpost/" + theTourID + ".json?LASTKEY=" + current_key;

                        function signpost_request_finished(signpostReq) {
                            if (ni.debug_set) alert("signpost req: " + signpostReq.status + " | " + signpostReq.responseText);
                            if (signpostReq.status == 200) {
                                tmp_signpost = signpostReq.responseText;
                                signpost_cache.add(theTourID, signpostReq.responseText);
                            } //else this.send_notification("Bad response looking up signpost information", "PRIORITY_CRITICAL_HIGH");

                            signpost_loaded(tmp_signpost)
                        }

                        NovaInitia.Toolbar.send_request(tmpURL, "GET", null, true, signpost_request_finished, false, null);
                    }
                }

            } else {
                openUILink(theURL);
                NovaInitia.Toolbar.hideThrobber();
            }
        };

        /* Sets all of the user info from the JSON response
         */
        this.set_user_info = function () {
            user_name = user_JSON.user.UserName;
            
            //Basic preferences 
            fnNovaInitia_prefs_set("novainitia-cur_username", user_name);
            fnNovaInitia_prefs_set("novainitia-cur_ava_url", user_JSON.user.AvatarUrl);
            fnNovaInitia_prefs_set("novainitia-cur_tagline", user_JSON.user.TagLine);
            fnNovaInitia_prefs_set("novainitia-cur_email", user_JSON.user.Email);
            fnNovaInitia_prefs_set("novainitia-cur_location", user_JSON.user.Location);
            fnNovaInitia_prefs_set("novainitia-cur_class", user_JSON.user.Class);
            fnNovaInitia_prefs_set("novainitia-cur_id", user_JSON.user.ID);
            fnNovaInitia_prefs_set("novainitia-cur_hash", user_JSON.user.LastKey);
            NovaInitia.Toolbar.set_user_shield(user_JSON.user.isShielded);
            sg_tool_amount = user_JSON.user['Sg'];
            if (ni.debug_set) alert(trap_tool_id + "|" + barrel_tool_id + "|" + spider_tool_id + "|" + shield_tool_id + "|" + doorway_tool_id + "|" + signpost_tool_id);
            var tool0name = "Tool" + trap_tool_id;
            trap_tool_amount = user_JSON.user[tool0name];
            if (trap_tool_amount == "") trap_tool_amount = 0;
            var tool1name = "Tool" + barrel_tool_id;
            barrel_tool_amount = user_JSON.user[tool1name];
            if (barrel_tool_amount == "") barrel_tool_amount = 0;
            var tool2name = "Tool" + spider_tool_id;
            spider_tool_amount = user_JSON.user[tool2name];
            if (spider_tool_amount == "") spider_tool_amount = 0;
            var tool3name = "Tool" + shield_tool_id;
            shield_tool_amount = user_JSON.user[tool3name];
            if (shield_tool_amount == "") shield_tool_amount = 0;
            var tool4name = "Tool" + doorway_tool_id;
            doorway_tool_amount = user_JSON.user[tool4name];
            if (doorway_tool_amount == "") doorway_tool_amount = 0;
            var tool5name = "Tool" + signpost_tool_id;
            signpost_tool_amount = user_JSON.user[tool5name];
            if (signpost_tool_amount == "") signpost_tool_amount = 0;

            NovaInitia.Toolbar.set_user_tool_amounts();
        };

        this.server_sync = function () {

        };

        /* Sets the toolbutton labels with the current amounts */
        this.set_user_tool_amounts = function () {
            if (trap_toolbar_button) trap_toolbar_button.label = trap_tool_amount;
            if (barrel_toolbar_button) barrel_toolbar_button.label = barrel_tool_amount;
            if (spider_toolbar_button) spider_toolbar_button.label = spider_tool_amount;
            if (shield_toolbar_button) {
                shield_toolbar_button.label = shield_tool_amount;
            }
            if (doorway_toolbar_button) doorway_toolbar_button.label = doorway_tool_amount;
            if (signpost_toolbar_button) signpost_toolbar_button.label = signpost_tool_amount;
            if (sg_toolbar_button) {
                sg_toolbar_button.label = sg_tool_amount;
            }
            
            //
            if (ni.debug_set) alert("Updaing inventory!!");
            $("#novaInitia_toolbar_inventory_traps").html(trap_tool_amount);
            $("#novaInitia_toolbar_inventory_barrells").html(barrel_tool_amount);
            $("#novaInitia_toolbar_inventory_spiders").html(spider_tool_amount);
            $("#novaInitia_toolbar_inventory_shields").html(shield_tool_amount);
            $("#novaInitia_toolbar_inventory_doors").html(doorway_tool_amount);
            $("#novaInitia_toolbar_inventory_sg").html(sg_tool_amount);
            $("#novaInitia_toolbar_inventory_signposts").html(signpost_tool_amount);
        };

        /* Set the user's shield status
         *  theHits is the number of hits left in the current shield
         */
        this.set_user_shield = function (theHits) {
            var tmpShield = parseInt(theHits, 10);
            if (tmpShield != 0) {
                shield_hits_left = tmpShield;
                if (ni.debug_set) alert(shield_hits_left);
                if (shield_toolbar_button) {
                    shield_toolbar_button.image = "http://mikederoche.com/cs320/commoncode/skin/images/icons/shield.ico";
                }
                $("#nova_initia_tool_shield").attr("src","http://mikederoche.com/cs320/commoncode/skin/images/shieldOn32.png");
            } else {
                shield_hits_left = 0;
                if (shield_toolbar_button) {
                    shield_toolbar_button.image = "http://mikederoche.com/cs320/commoncode/skin/images/icons/no-shield.ico";
                }
                $("#nova_initia_tool_shield").attr("src","http://mikederoche.com/cs320/commoncode/skin/images/shieldOff32.png");
            }
        };

        /* processes a shield hit */
        this.shield_hit = function (sendNotifications, destroyShield) {
            if (shield_hits_left > 0) {
                if (destroyShield) {
                    shield_hits_left = 0;
                    if (shield_toolbar_button) shield_toolbar_button.image = "http://mikederoche.com/cs320/commoncode/skin/images/icons/no-shield.ico";
                    if (sendNotifications) {
                        shield_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/shield_destroyed.jpg";
                        NovaInitia.Toolbar.show_panel(trap_panel);
                        shieldTimeout = this.autoClose(shieldTimeout, "nova_initia_trap_panel", 3000);
                    }

                } else {
                    shield_hits_left--;
                    if (ni.debug_set) alert("shield left: " + shield_hits_left);
                    if (shield_hits_left == 0) {
                        trap_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/shield_destroyed.jpg";
                        if (shield_toolbar_button) shield_toolbar_button.image = "http://mikederoche.com/cs320/commoncode/skin/images/icons/no-shield.ico";
                        NovaInitia.Toolbar.show_panel(trap_panel);
                        trapTimeout = this.autoClose(trapTimeout, "nova_initia_trap_panel", 3000);
                    } else {
                        trap_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/shield_triggered.jpg";
                    }
                }
            } else {
                if (ni.debug_set) alert("Trap Sprung Without A Shield!");
                if (shield_toolbar_button) shield_toolbar_button.image = "http://mikederoche.com/cs320/commoncode/skin/images/icons/no-shield.ico";
                trap_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/trap_triggered.png";
            }
        };

        /* called when barrel or doorway toolbar button is pressed
         *  disables the Stash/Open button if user is currently at an invalid page
         */
        this.try_popup = function (theButton, thePanel) {
            niClientApp_catchPopup(thePanel.id);
            /*if (at_a_page == true) {
                theButton.disabled = false;
                thePanel.focus();
            } else {
                theButton.disabled = true;
            }
            if (thePanel.id == "nova_initia_tool_doorway_panel_popup") {
                if (last_doorwayID) {
                    var doorway_cached = doorway_cache.get(last_doorwayID);
                    if (doorway_cached) {
                        var tmp_doorway = doorway_cached[last_doorwayID];
                        var tmpDoorwayInfo = ni.JSON.parse(tmp_doorway);
                        if (tmpDoorwayInfo.doorway.NextID) {
                            if (tmpDoorwayInfo.doorway.NextID == "0") {
                                doorway_popup_panel_add_to_checkbox.disabled = false;
                                doorway_popup_panel_add_to_checkbox.checked = false;
                            }
                        }
                    }
                } else {
                    doorway_popup_panel_add_to_checkbox.disabled = true;
                    doorway_popup_panel_add_to_checkbox.checked = false;
                }
            }
            if (thePanel.id == "nova_initia_tool_barrel_panel_popup_top" || thePanel.id == "nova_initia_tool_barrel_panel_popup") {
                if (user_JSON.user.Class != class_giver_ID) {
                    stash_barrel_sg_textbox.value = "0";
                    stash_barrel_sg_textbox.disabled = true;
                    stash_barrel_label_textbox.disabled = true;
                } else {
                    stash_barrel_sg_textbox.disabled = false;
                    if (user_JSON.user.LevelClass1 > 4) {
                        stash_barrel_label_textbox.disabled = false;
                    } else {
                        stash_barrel_label_textbox.disabled = true;
                    }
                }
            }*/
        };

        /* Validate that barrel contents are within bounds (not all 0 and no more than current inventory allows) and send request to stash */
        this.stash_barrel = function (stash_barrel_sg,stash_barrel_traps,stash_barrel_barrels,stash_barrel_spiders,stash_barrel_shields,stash_barrel_doorways,stash_barrel_signposts,stash_barrel_message) {
            var proceed = true;
            
            var limit = user_JSON.user.Class == class_giver_ID ? 100 : 10;
            if (((Number(stash_barrel_sg) / 10) + Number(stash_barrel_traps) + Number(stash_barrel_barrels) + Number(stash_barrel_spiders) + Number(stash_barrel_shields) + Number(stash_barrel_doorways) + Number(stash_barrel_signposts)) > limit) {
            }
	    
	    if (Number(stash_barrel_sg) < 0) {
		proceed = false;
		if (ni.debug_set) alert("trying to be sneaky");
	    }
            if (Number(stash_barrel_sg) > sg_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough sg");
                //stash_barrel_sg_image.hidden = false;
            }

            if (Number(stash_barrel_traps) > trap_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Traps");
                //stash_barrel_traps_image.hidden = false;
            }

            if ((Number(stash_barrel_barrels) + 1) > barrel_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Barrels");
                //stash_barrel_barrels_image.hidden = false;
            }

            if (Number(stash_barrel_spiders) > spider_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Spiders");
                //stash_barrel_spiders_image.hidden = false;
            }

            if (Number(stash_barrel_shields) > shield_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Shields");
                //stash_barrel_shields_image.hidden = false;
            }

            if (Number(stash_barrel_doorways) > doorway_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Doorways");
                //stash_barrel_doorways_image.hidden = false;
            }

            if (Number(stash_barrel_signposts) > signpost_tool_amount) {
                proceed = false;
                if (ni.debug_set) alert("Not enough Signposts");
                //stash_barrel_signposts_image.hidden = false;
            }

            if (Number(stash_barrel_traps) == 0 && Number(stash_barrel_barrels) == 0 && Number(stash_barrel_spiders) == 0 && Number(stash_barrel_shields) == 0 && Number(stash_barrel_doorways) == 0 && Number(stash_barrel_signposts) == 0 && Number(stash_barrel_sg) == 0) {
                stash_barrel_panel.hidePopup();
                proceed = false;
                //this.send_notification("Cannot Stash Empty Barrels", "PRIORITY_INFO_HIGH");
            }
            if (proceed) {
                var theParams = {
                    "Comment": ni.urlencode(stash_barrel_message),
                    "Tool0": stash_barrel_traps,
                    "Tool1": stash_barrel_barrels,
                    "Tool2": stash_barrel_spiders,
                    "Tool3": stash_barrel_shields,
                    "Tool4": stash_barrel_doorways,
                    "Tool5": stash_barrel_signposts,
                    "Sg": stash_barrel_sg
                };

                NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + barrel_tool_id + ".json", "POST", JSON.stringify(theParams), true, NovaInitia.Toolbar.process_barrel_stash, false, null);
                if (ni.debug_set) {
                    alert("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + barrel_tool_id + ".json");
                    alert(theParams);
                }
            }
        };

        /* Check the status of the barrel stash reply */
        this.process_barrel_stash = function (theRes) {
            if (ni.debug_set) {
                alert("Process Barrel Stash");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 201 || theRes.status == 200) {
                NovaInitia.Toolbar.check_tool_set(theRes, barrel_tool_id);
                var tmpBarrelInfo = ni.JSON.parse(theRes.responseText);
                //if (tmpBarrelInfo.error) this.send_notification("Barrel Stash received a bad response!", "PRIORITY_INFO_HIGH");
            } else {
                //this.send_notification("Barrel Stash received a bad response!", "PRIORITY_INFO_HIGH");
            }
        };

        /* Setup and send request to open a barrel with barrelID */
        this.open_barrel = function (barrelID, theUser) {
            temporary_tool_user = theUser;
            if (ni.debug_set) {
                alert("open: " + barrelID);
                alert("http://" + url_prefix + server_url + "/rf/remog/gift/" + barrelID + ".json");
            }
            NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/gift/" + barrelID + ".json", "GET", null, true, NovaInitia.Toolbar.process_barrel_open, false, null);
        };

        /* Process the reply from the barrel open request */
        this.process_barrel_open = function (theRes) {

            if (ni.debug_set) {
                alert("Process Barrel Open");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 200) {
                var tmp_barrel_open_res = ni.JSON.parse(theRes.responseText);
                if (tmp_barrel_open_res.error) {
                    //this.send_notification("Error: " + tmp_barrel_open_res.error, "PRIORITY_INFO_HIGH");
                } else if (tmp_barrel_open_res.gift) {
                    if (tmp_barrel_open_res.gift.ID) {
                        if (ni.debug_set) alert("message: " + tmp_barrel_open_res.gift.Comment + " | Traps: " + tmp_barrel_open_res.gift.Tool0 + " | Barrels: " + tmp_barrel_open_res.gift.Tool1 + " | Spiders: " + tmp_barrel_open_res.gift.Tool2 + " | Shields: " + tmp_barrel_open_res.gift.Tool3 + " | Doorways: " + tmp_barrel_open_res.gift.Tool4 + " | Signposts: " + tmp_barrel_open_res.gift.Tool5);
                        open_barrel_label.value = "Loot Retrieved from " + temporary_tool_user + "'s Barrel:";
                        open_barrel_sg_label.value = tmp_barrel_open_res.gift.Sg;
                        open_barrel_traps_label.value = tmp_barrel_open_res.gift.Tool0;
                        open_barrel_barrels_label.value = tmp_barrel_open_res.gift.Tool1;
                        open_barrel_spiders_label.value = tmp_barrel_open_res.gift.Tool2;
                        open_barrel_shields_label.value = tmp_barrel_open_res.gift.Tool3;
                        open_barrel_doorways_label.value = tmp_barrel_open_res.gift.Tool4;
                        open_barrel_signposts_label.value = tmp_barrel_open_res.gift.Tool5;
                        open_barrel_message_label.value = tmp_barrel_open_res.gift.Comment;
                        NovaInitia.Toolbar.show_panel(open_barrel_panel);
                        sg_tool_amount = Number(sg_tool_amount) + Number(tmp_barrel_open_res.gift.Sg);
                        trap_tool_amount = Number(trap_tool_amount) + Number(tmp_barrel_open_res.gift.Tool0);
                        barrel_tool_amount = Number(barrel_tool_amount) + Number(tmp_barrel_open_res.gift.Tool1);
                        spider_tool_amount = Number(spider_tool_amount) + Number(tmp_barrel_open_res.gift.Tool2);
                        shield_tool_amount = Number(shield_tool_amount) + Number(tmp_barrel_open_res.gift.Tool3);
                        doorway_tool_amount = Number(doorway_tool_amount) + Number(tmp_barrel_open_res.gift.Tool4);
                        signpost_tool_amount = Number(signpost_tool_amount) + Number(tmp_barrel_open_res.gift.Tool5);
                        NovaInitia.Toolbar.set_user_tool_amounts();
                        NovaInitia.Toolbar.dismiss_panel('nova_initia_barrel_panel');
                    }
                }
            } else {
                //this.send_notification("Barrel Open received a bad response!", "PRIORITY_INFO_HIGH");
            }
        };

        /* opens doorway panel, gathers required info, sends request to server */
        this.open_doorway = function (doorway_popup_panel_URL, doorway_popup_panel_hint, doorway_popup_panel_comment, doorway_popup_panel_nsfw) {
            var proceed = true;
            var theGroupID = "";
            var theParentID = "";
            var doorway_cached = null;
            var tmp_doorway = null;
	    
            if (last_doorwayID) {
                doorway_cached = doorway_cache.get(last_doorwayID);
                if (doorway_cached) {
                    tmp_doorway = doorway_cached[last_doorwayID];
                    var tmpDoorwayInfo = ni.JSON.parse(tmp_doorway);
                    if (tmpDoorwayInfo.doorway.GroupID) theGroupID = tmpDoorwayInfo.doorway.GroupID;
                }
            }
            if (doorway_popup_panel_URL == "") {
                //doorway_popup_panel_URL_image.hidden = false;
                proceed = false;
            } else {
                //doorway_popup_panel_URL_image.hidden = true;
            }
	    
            if (proceed) {
                var theParams = "Url=" + ni.urlencode(doorway_popup_panel_URL) + "&Hint=" + ni.urlencode(doorway_popup_panel_hint) + "&Comment=" + ni.urlencode(doorway_popup_panel_comment) + "&Home=" + ni.urlencode(cur_url) + "&NSFW=" + doorway_popup_panel_nsfw_checkbox;
                doorway_popup_panel_add_to_checkbox = false;
		if (doorway_popup_panel_add_to_checkbox) {
                    if (theGroupID) theParams = theParams + "&GroupID=" + theGroupID;
                    NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + doorway_tool_id + ".json", "POST", theParams, true, NovaInitia.Toolbar.process_doorway_open, false, theGroupID);
                } else NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + doorway_tool_id + ".json", "POST", theParams, true, NovaInitia.Toolbar.process_doorway_open, false, null);
                //NovaInitia.Toolbar.dismiss_panel('nova_initia_doorway_panel');
                if (ni.debug_set) {
                    alert("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + doorway_tool_id + ".json");
                    alert(theParams);
                }
            }
        };

        /* processes the response of the doorway open request */
        this.process_doorway_open = function (theRes) {
            if (ni.debug_set) {
                alert("Process Doorway Open");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 201 || theRes.status == 200) {
                NovaInitia.Toolbar.check_tool_set(theRes, doorway_tool_id);
            } else {
                //this.send_notification("Doorway Open received a bad response!", "PRIORITY_INFO_HIGH");
            }
        };

        /* returns the # of doorways in the carousel */
        this.num_of_doorways = function () {
            return doorway_carousel_array.length;
        };

        /* sets up the doorway carousel */
        this.setup_doorways = function (thePos) {
            /*if (doorway_carousel_array[thePos]) {
                //doorway_carousel_array[thePos][0] is the ID of the doorway
                //doorway_carousel_array[thePos][1] is the user who left the doorway
                //doorway_carousel_array[thePos][2] is the hint
                if (thePos > 0) doorway_panel_prev_button.disabled = false;
                else doorway_panel_prev_button.disabled = true;
                if (doorway_carousel_array[thePos + 1]) {
                    doorway_panel_next_button.disabled = false;
                    doorway_panel_next_button.label = "Next";
                    doorway_panel_next_button.removeAttribute("oncommand");
                    doorway_panel_next_button.setAttribute("oncommand", "NovaInitia.Toolbar.doorway_carousel_next()");
                } else {
                    doorway_panel_next_button.removeAttribute("oncommand");
                    doorway_panel_next_button.setAttribute("oncommand", "NovaInitia.Toolbar.doorway_carousel_load_more()");
                    doorway_panel_next_button.label = "Get More";
                }
                doorway_panel_count.value = Number(thePos + 1) + " of " + NovaInitia.Toolbar.num_of_doorways();
                doorway_panel_label.value = doorway_carousel_array[thePos][1];
                doorway_panel_hidden_label.value = doorway_carousel_array[thePos][0];
                doorway_panel_hint_label_0.value = doorway_carousel_array[thePos][2].Hint.substring(0, 38);
                doorway_panel_hint_label_1.value = doorway_carousel_array[thePos][2].Hint.substring(38, 76);
                doorway_panel_hint_label_2.value = doorway_carousel_array[thePos][2].Hint.substring(76, 114);
                doorway_panel_profile_button.label = "<< " + doorway_carousel_array[thePos][1] + "'s Profile";
                doorway_panel_profile_button.removeAttribute("oncommand");
                doorway_panel_profile_button.setAttribute("oncommand", "gBrowser.selectedTab = gBrowser.addTab('http://www.nova-initia.com/remog/user/" + doorway_carousel_array[thePos][1] + "');");
                if (doorway_carousel_array[thePos][2].GroupID && doorway_carousel_array[thePos][2].GroupID != doorway_carousel_array[thePos][0]) {
                    doorway_panel_chain_button.removeAttribute("oncommand");
                    doorway_panel_chain_button.setAttribute("oncommand", "alert('To the Beginning of the chain we go (eventually)!')");
                    doorway_panel_chain_button.hidden = false;
                } else doorway_panel_chain_button.hidden = true;
                doorway_panel_button.removeAttribute("oncommand");
                doorway_panel_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to(''," + doorway_carousel_array[thePos][0] + ",'" + doorway_carousel_array[thePos][1] + "')");
                doorway_panel_dismiss_button.removeAttribute("oncommand");
                doorway_panel_dismiss_button.setAttribute("oncommand", "NovaInitia.Toolbar.dismiss_panel('nova_initia_doorway_panel'," + thePos + ")");
                NovaInitia.Toolbar.show_panel(doorway_panel);
            }*/
        };

        /* called when load more button in doorway carousel is pressed, sends request to load more to the server */
        this.doorway_carousel_load_more = function () {
            cur_page_num++;
            NovaInitia.Toolbar.showThrobber();
            var trackURL = "http://" + url_prefix + server_url + "/rf/remog/doorway/" + cur_url_hash + "/" + cur_domain_hash + "/list/" + cur_page_num + ".json";
            ///remog/doorway/$URLHASH/$DOMAINHASH/list/$page
            NovaInitia.Toolbar.send_request(trackURL, "GET", null, true, NovaInitia.Toolbar.process_doorway_carousel_load_more, false, null);
            // send request for more
        };

        /* load the results of the load_more request into the doorway carousel */
        this.process_doorway_carousel_load_more = function (theRes) {
            // set next button label back to next
            // JSON decode
            if (ni.debug_set) {
                alert("carousel load more status: " + theRes.status);
                alert("carousel load more responseText: " + theRes.responseText);
            }
            var doorwayRes = ni.JSON.parse(theRes.responseText);
            var i = 0;
            if (doorwayRes.doorSet) {
                while (doorwayRes.doorSet[i]) {
                    var theUsername = NovaInitia.Toolbar.get_username(doorwayRes.doorSet[i].USERID);
                    var theHint = {
                        "Hint": doorwayRes.doorSet[i].toolData.Hint
                    };
                    doorway_carousel_array.push(new Array( /*ID of doorway*/ doorwayRes.doorSet[i].ID, /*User who left*/ theUsername, /*hint*/ theHint));
                    i++;
                }
            }
            NovaInitia.Toolbar.hideThrobber();
            NovaInitia.Toolbar.doorway_carousel_next();
        };

        /* Gets the previous doorway in the doorway carousel */
        this.doorway_carousel_prev = function () {
            var i = 0;
            while (doorway_carousel_array[i]) {
                if (doorway_carousel_array[i][0] == doorway_panel_hidden_label.value) {
                    if (i != 0) {
                        NovaInitia.Toolbar.setup_doorways(i - 1);
                        break;
                    } else doorway_panel_prev_button.disabled = true;
                }
                i++;
            }
        };

        /* Gets the next doorway in the doorway carousel */
        this.doorway_carousel_next = function () {
            var i = 0;
            while (doorway_carousel_array[i]) {
                if (doorway_carousel_array[i][0] == doorway_panel_hidden_label.value) {
                    if (doorway_carousel_array[i + 1]) {
                        NovaInitia.Toolbar.setup_doorways(i + 1);
                        break;
                    } else {
                        doorway_panel_next_button.disabled = true;
                    }
                }
                i++;
            }
        };
        /* called when a user 'steps through' a doorway and opens the rate panel */
        this.stepped_through_doorway = function () {
            var doorway_cached = doorway_cache.get(last_doorwayID);
            var tmpDoorwayInfo = ni.JSON.parse(doorway_cached[last_doorwayID]);
            if (tmpDoorwayInfo.doorway) {
                doorway_end_panel_label.value = "You Stepped Through " + last_doorway_user + "'s Doorway!";
                doorway_end_panel_comment.value = tmpDoorwayInfo.doorway.Comment;
                doorway_end_panel_button.disabled = false;
                doorway_end_panel_button.removeAttribute("oncommand");
                doorway_end_panel_button.setAttribute("oncommand", "NovaInitia.Toolbar.send_rating('" + last_doorwayID + "'); NovaInitia.Toolbar.dismiss_panel('nova_initia_doorway_panel_end');");
                NovaInitia.Toolbar.show_panel(doorway_end_panel);
                NovaInitia.Toolbar.window_resized();
            }
        };

        this.send_rating = function (theID) {
            doorway_end_panel_button.disabled = true;
            var trackURL = "http://" + url_prefix + server_url + "/rf/remog/doorway/" + theID + "/rate/1.json";
            NovaInitia.Toolbar.send_request(trackURL, "PUT", null, true, NovaInitia.Toolbar.process_send_rate, false, null);
        };

        this.process_send_rate = function (theRes) {
            // JSON decode
            if (theRes.status == 200) {
                var tmpRateResponse = ni.JSON.parse(theRes.responseText);
                if (ni.debug_set) {
                    alert("send_rate status: " + theRes.status);
                    alert("send_rate responseText: " + theRes.responseText);
                }
                //if (tmpRateResponse.error) this.send_notification("Rating Was NOT Received: " + tmpRateResponse.error + "!", "PRIORITY_INFO_LOW");
            } //else this.send_notification("Rating Was NOT Received: Bad server response!" + tmpRateResponse.error + "!", "PRIORITY_INFO_LOW");
        };

        /* returns whether or not a user just took a doorway and sets took_doorway var to false */
        this.just_took_doorway = function () {
            var returnThis = took_doorway;
            if (took_doorway) took_doorway = false;
            return returnThis;
        };

        /* set the last_doorwayID var to the ID of the last doorway taken */
        this.set_last_doorwayID = function (toThis) {
            last_doorwayID = toThis;
        };

        this.place_signpost = function (signpost_panel_popup_title,signpost_panel_popup_comment,signpost_panel_popup_nsfw) {
            if (signpost_tool_amount > 0) {
                if (at_a_page) {
                    var theParams = "Url=" + ni.urlencode(cur_url);
                    if (signpost_panel_popup_title != "") theParams = theParams + "&Title=" + ni.urlencode(signpost_panel_popup_title);
                    if (signpost_panel_popup_comment != "") theParams = theParams + "&Comment=" + ni.urlencode(signpost_panel_popup_comment);
                    theParams = theParams + "&NSFW=" + signpost_panel_popup_nsfw;
                    NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + signpost_tool_id + ".json", "POST", theParams, true, NovaInitia.Toolbar.process_signpost_place, false, null);
                    //signpost_panel_popup.hidePopup();
                } //else this.send_notification("Not At A Valid Page!", "PRIORITY_INFO_LOW");
            } //else this.send_notification("Out of Signposts!", "PRIORITY_INFO_LOW");
        };

        /* process the response after trying to place a signpost */
        this.process_signpost_place = function (theRes) {
            if (ni.debug_set) {
                alert("Process Signpost Place");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 201 || theRes.status == 200) {
                //signpost_panel_popup_title.value = "";
                //signpost_panel_popup_comment.value = "";
                NovaInitia.Toolbar.check_tool_set(theRes, signpost_tool_id);
            } else {
                //this.send_notification("Signpost received a bad response!", "PRIORITY_INFO_HIGH");
            }
        };


        this.process_signpost_request = function (theRes) {
            if (ni.debug_set) {
                alert("Process Signpost Request");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 200) {
                var signpost_info = ni.JSON.parse(theRes.responseText);
                var signpost_cached = signpost_cache.get(signpost_info.signpost.ID);
                if (!signpost_cached) {
                    signpost_cache.add(signpost_info.signpost.ID, theRes.responseText);
                }
                if (at_tour_start) {
                    if (cur_tour_group_ID != signpost_info.signpost.GroupID) {

                        tour_start_panel_title_label.value = "Tour Entry";
                        tour_start_panel_comment_textbox.value = "Click 'Start' below to begin this tour!";
                        tour_start_panel_start_button.hidden = false;
                        tour_start_panel_start_button.removeAttribute("oncommand");
                        tour_start_panel_start_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to('" + signpost_info.signpost.Url + "'," + false + "," + false + "," + signpost_info.signpost.ID + "," + signpost_info.signpost.GroupID + ")");
                        NovaInitia.Toolbar.show_panel(tour_start_panel);
                    }
                } else {
                    tour_panel_title_label.value = ni.urldecode(signpost_info.signpost.Title);
                    tour_panel_comment_textbox.value = ni.urldecode(signpost_info.signpost.Comment);
                    if (signpost_info.signpost.ANextID != "0") {
                        if (signpost_info.signpost.BNextID == "0" && signpost_info.signpost.CNextID == "0" && signpost_info.signpost.DNextID == "0") tour_panel_A_button.label = "Next";
                        else tour_panel_A_button.label = "A";
                        tour_panel_A_button.setAttribute("onmouseover", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.ANextTitle) + "'");
                        tour_panel_A_button.setAttribute("onmouseout", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.Comment) + "'");
                        tour_panel_A_button.removeAttribute("oncommand");
                        tour_panel_A_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to(''," + false + "," + false + "," + signpost_info.signpost.ANextID + ")");
                        tour_panel_A_button.hidden = false;
                    } else {
                        tour_panel_A_label.hidden = true;
                        tour_panel_A_button.hidden = true;
                    }
                    if (signpost_info.signpost.BNextID != "0") {
                        tour_panel_B_button.setAttribute("onmouseover", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.BNextTitle) + "'");
                        tour_panel_B_button.setAttribute("onmouseout", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.Comment) + "'");
                        tour_panel_B_button.removeAttribute("oncommand");
                        tour_panel_B_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to(''," + false + "," + false + "," + signpost_info.signpost.BNextID + ")");
                        tour_panel_B_button.hidden = false;
                    } else {
                        tour_panel_B_label.hidden = true;
                        tour_panel_B_button.hidden = true;
                    }
                    if (signpost_info.signpost.CNextID != "0") {
                        tour_panel_C_button.setAttribute("onmouseover", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.CNextTitle) + "'");
                        tour_panel_C_button.setAttribute("onmouseout", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.Comment) + "'");
                        tour_panel_C_button.removeAttribute("oncommand");
                        tour_panel_C_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to(''," + false + "," + false + "," + signpost_info.signpost.CNextID + ")");
                        tour_panel_C_button.hidden = false;
                    } else {
                        tour_panel_C_label.hidden = true;
                        tour_panel_C_button.hidden = true;
                    }
                    if (signpost_info.signpost.DNextID != "0") {
                        tour_panel_D_button.setAttribute("onmouseover", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.DNextTitle) + "'");
                        tour_panel_D_button.setAttribute("onmouseout", "document.getElementById('nova_initia_tour_panel_comment_textbox').value = '" + ni.urldecode(signpost_info.signpost.Comment) + "'");
                        tour_panel_D_button.removeAttribute("oncommand");
                        tour_panel_D_button.setAttribute("oncommand", "NovaInitia.Toolbar.redirect_to(''," + false + "," + false + "," + signpost_info.signpost.DNextID + ")");
                        tour_panel_D_button.hidden = false;
                    } else {
                        tour_panel_D_label.hidden = true;
                        tour_panel_D_button.hidden = true;
                    }

                    if (signpost_info.signpost.ANextID == "0" && signpost_info.signpost.BNextID == "0" && signpost_info.signpost.CNextID == "0" && signpost_info.signpost.DNextID == "0") {
                        tour_panel_complete_button.removeAttribute("oncommand");
                        var tmpURL = "NovaInitia.Toolbar.complete_tour('" + signpost_info.signpost.GroupID + "','" + cur_url_hash + "','" + cur_domain_hash + "');NovaInitia.Toolbar.redirect_to('http://www." + server_url + "/rf/remog/group/" + signpost_info.signpost.GroupID + "?LASTKEY=" + current_key + "')";
                        tour_panel_complete_button.setAttribute("oncommand", tmpURL);
                        tour_panel_complete_button.hidden = false;
                        tour_panel_complete_label.hidden = false;
                    } else {
                        tour_panel_complete_button.removeAttribute("oncommand");
                        tour_panel_complete_button.hidden = true;
                        tour_panel_complete_label.hidden = true;
                    }
                    NovaInitia.Toolbar.show_panel(tour_panel);
                }
            } else {
                //this.send_notification("Signpost received a bad response!", "PRIORITY_INFO_HIGH");
            }
        };

        this.tour_go_back = function () {
            tour_path_info.pop();
            var tmpLen = tour_path_info.length - 1;

            var tmpURL = tour_path_info[tmpLen][1];
            var tmpID = tour_path_info[tmpLen][0]
            if (tmpID == 0) {
                cur_tour_group_ID = "";
                tour_path_info = new Array();
                NovaInitia.Toolbar.redirect_to(tmpURL, false, false, false);
            } else {
                tour_path_info.pop();
                NovaInitia.Toolbar.redirect_to(tmpURL, false, false, tmpID);
            }
        };

        this.complete_tour = function (theGroupID, theUHash, theDHash) {
            var theParams = {
                "u": theUHash,
                "d": theDHash
            };
            NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/group/" + theGroupID + "/complete", "POST", theParams, true, NovaInitia.Toolbar.process_complete_tour, false, null);
        };

        this.process_complete_tour = function (theRes) {
            if (ni.debug_set) {
                alert("Process Complete Tour");
                alert("status: " + theRes.status);
                alert("responseText: " + theRes.responseText);
            }
            if (theRes.status == 200) {
                var tour_complete_info = ni.JSON.parse(theRes.responseText);
                if (tour_complete_info.groupComplete) {
                    sg_tool_amount = Number(sg_tool_amount) + Number(tour_complete_info.Sg);
                    NovaInitia.Toolbar.set_user_tool_amounts();
                }
                //if (tour_complete_info.error) this.send_notification("Tour Completion received this error:" + theRes.error, "PRIORITY_INFO_HIGH");
            } else {
                //this.send_notification("Tour Completion Failed!", "PRIORITY_INFO_HIGH");
            }
        };

        this.process_tour = function (tmpID) {
            if (!at_tour_start) cur_tour_info = new Array(tmpID, cur_url);
            var signpost_cached = signpost_cache.get(tmpID);
            if (signpost_cached) {
                //doorway was cached doorway_cached[theDoorwayID] is the JSON
                var tmpRes = new Object();
                tmpRes.status = "200";
                tmpRes.responseText = signpost_cached[tmpID];
                NovaInitia.Toolbar.process_signpost_request(tmpRes);
            } else {
                var tmpURL = "http://" + url_prefix + server_url + "/rf/remog/signpost/" + tmpID + ".json?LASTKEY=" + current_key;
                NovaInitia.Toolbar.send_request(tmpURL, "GET", null, true, NovaInitia.Toolbar.process_signpost_request, false, null);
            }
        };

        
        // GET USER TOOLS FROM DB
        this.sync_user = function () {
            function sync_request_finished(tmp_user_res) {
                if (tmp_user_res.status == 200) {
                    if (ni.debug_set) {
                        alert(tmp_user_res.responseText);
                    }
                    var tmp_info = ni.JSON.parse(tmp_user_res.responseText);
                    console.log(ni.JSON);
                    if (tmp_info['error']) NovaInitia.Toolbar.process_page_error(tmp_info['error']);
                    else {
                        if (ni.debug_set) alert("user data sync'd");
                        user_JSON = tmp_info;
                        NovaInitia.Toolbar.set_user_info();
                    }
                }
            }
            if (typeof (arguments[0]) !== 'undefined') {
                if (ni.debug_set) alert(arguments[0].status);
                sync_request_finished(arguments[0]);
            } else NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/user/" + user_JSON.user.ID + ".json", "GET", null, true, sync_request_finished, false, null);
        };

        this.clear_logins = function () {
            fnNovaInitia_prefs_set("novainitia-login_saved", false);
            fnNovaInitia_prefs_set("novainitia-saved_username", "");
            fnNovaInitia_prefs_set("novainitia-saved_password_hash", "");
            var count = new Object();
            var logins = ni.prefManager.getChildList("extensions.nova-initia.saved_users", count);
            for (var i = 0; i < count.value; i++) {
                //alert(logins[i]);
                NovaInitia.Toolbar.remove_user_menuitem(ni.prefManager.getCharPref(logins[i]));
                ni.prefManager.deleteBranch(logins[i]);
            }
            count = new Object();
            var passes = ni.prefManager.getChildList("extensions.nova-initia.saved_passes", count);
            for (var i = 0; i < count.value; i++) {
                //alert(passes[i]);
                ni.prefManager.deleteBranch(passes[i]);
            }
        };

        /* Gather and process the login information */
        this.process_login = function (what, newLogin, theUser, logoutFirst) {
            console.log("Logging In...");
            console.log("   Username: "+_globalUsername);
            console.log("   Password: "+_globalPassword);
            if (ni.debug_set) alert("logging in");
            login_saved = fnNovaInitia_prefs_get("novainitia-login_saved");
            if (newLogin) login_saved = false;
            //loginbar_throbber.collapsed = false;

            ni.username = {
                value: ""
            };
            ni.password = {
                value: ""
            };
            ni.stay_logged_in = {
                value: false
            };
            var okorcancel = false;
            if (theUser) {
                var tmpUser = fnNovaInitia_prefs_get("novainitia-saved_users." + theUser);
                var tmpPass = fnNovaInitia_prefs_get("novainitia-saved_passes." + theUser);
                if (ni.debug_set) alert("switching user to: " + tmpUser);
                if (tmpUser) {
                    if (tmpPass) {
                        ni.username = {
                            value: tmpUser
                        };
                        ni.password = {
                            value: tmpPass
                        };
                        if (login_saved) ni.stay_logged_in = {
                            value: true
                        };
                        else ni.stay_logged_in = {
                            value: false
                        };
                        okorcancel = true;
                    } else {
                        ni.username = {
                            value: "username"
                        };
                        ni.password = {
                            value: "password"
                        };
                        ni.stay_logged_in = {
                            value: false
                        };
                        okorcancel = prompts.promptUsernameAndPassword(window, 'Login', 'Enter your login info', ni.username, ni.password, 'Stay Logged In?', ni.stay_logged_in);
                    }
                } else {
                    ni.username = {
                        value: "username"
                    };
                    ni.password = {
                        value: "password"
                    };
                    ni.stay_logged_in = {
                        value: false
                    };
                    okorcancel = prompts.promptUsernameAndPassword(window, 'Login', 'Enter your login info', ni.username, ni.password, 'Stay Logged In?', ni.stay_logged_in);
                }
            } else {
                if (login_saved) {
                    ni.username = {
                        value: fnNovaInitia_prefs_get("novainitia-saved_username")
                    };
                    ni.password = {
                        value: fnNovaInitia_prefs_get("novainitia-saved_password_hash")
                    };
                    ni.stay_logged_in = {
                        value: true
                    };
                    okorcancel = true;
                } else {
                    ni.username = {
                        value: "username"
                    };
                    ni.password = {
                        value: "password"
                    };
                    ni.stay_logged_in = {
                        value: false
                    };
                    //okorcancel = prompts.promptUsernameAndPassword(window, 'Login', 'Enter your login info', ni.username, ni.password, 'Stay Logged In?', ni.stay_logged_in);
                }
            }
            
            ni.username.value = _globalUsername;
            ni.password.value = _globalPassword;
            ni.stay_logged_in = true;
            
            //if they hit ok enter the if, if they hit cancel skip the if */
            okorcancel = true;
            if (okorcancel) {
                var params = "login=1&uname=" + ni.username.value;
                if (ni.debug_set) alert('testing login! ' + this + ' params: ' + params);

                function user_request_finished(userReq) {
                    if (ni.debug_set) alert(userReq.status);
                    if (userReq.status == 200) {
                        if (userReq.responseText.substring(0, 6) == 'Error:') {
                            //this.send_notification(userReq.responseText, "PRIORITY_CRITICAL_HIGH");
                            if (ni.debug_set) alert(userReq.responseText);
                        } else {
                            ni.pass = ni.password.value;
                            NovaInitia.Toolbar.setKey(userReq.responseText);
                            window.document.addEventListener("ene" + NovaInitia.Toolbar.getKey(), NovaInitia.Toolbar.server_sync, true, true);
                            if (ni.debug_set) alert('key: ' + userReq.responseText);
                            //if the login was previously saved it would already have been hashed so don't hash again
                            if (!login_saved) ni.pass = sha256(ni.pass);
                            ni.hashed_pass = ni.pass;
                            if (ni.debug_set) alert('db hash: ' + ni.pass);
                            ni.pass = ni.pass + userReq.responseText;
                            if (ni.debug_set) alert('with key: ' + ni.pass);
                            ni.pass = sha256(ni.pass);
                            if (ni.debug_set) alert('match hash: ' + ni.pass);
                            var loginParams = "login=1&pwd=" + ni.pass + "&uname=" + ni.username.value + "&LastKey=" + userReq.responseText;
                            //ni.cookieSvc.setCookieString(ni.cookieUri, null, "LastKey=" + userReq.responseText + ";", null);
                            fnNovaInitia_prefs_set("novainitia-alpha-LastKey",userReq.responseText);
			    if (ni.debug_set) alert("login params:" + loginParams);

                            
                            
                            function login_request_finished(loginReq) {
                                if (ni.debug_set) alert("&&&"+loginReq.responseText);
                                if (loginReq.status == 200 && loginReq.responseText.charAt(0) == "{") {
                                    var tmp_login_info = window.NovaInitia.JSON.parse(loginReq.responseText);
                                    user_JSON = tmp_login_info;
                                    if (tmp_login_info.user && tmp_login_info.user.ID) {
                                        if (ni.debug_set) alert(loginReq.responseText);
                                        if (logoutFirst) NovaInitia.Toolbar.logout();
                                        if (ni.stay_logged_in.value) {
                                            fnNovaInitia_prefs_set("novainitia-saved_username", ni.username.value);
                                            fnNovaInitia_prefs_set("novainitia-saved_users." + ni.username.value, ni.username.value);
                                            fnNovaInitia_prefs_set("novainitia-saved_password_hash", ni.hashed_pass);
                                            fnNovaInitia_prefs_set("novainitia-saved_passes." + ni.username.value, ni.hashed_pass);
                                            fnNovaInitia_prefs_set("novainitia-login_saved", true);
                                            NovaInitia.Toolbar.setup_user_menuitem(ni.username.value);
                                        } else {
                                            fnNovaInitia_prefs_set("novainitia-saved_username", "");
                                            fnNovaInitia_prefs_set("novainitia-saved_password_hash", "");
                                            fnNovaInitia_prefs_set("novainitia-login_saved", false);
                                        }
                                        NovaInitia.Toolbar.set_toolbutton_orient(fnNovaInitia_prefs_get("novainitia-toolbar_text_orientation_vertical"));
                                        //login_toolbar.hidden = true;
                                        //login_toolbar.collapsed = true;
                                        //toolbar.hidden = false;
                                        //toolbar.collapsed = false;
                                        //unhide user menu
                                        //login_menuitem.hidden = true;
                                        //logout_menuitem.hidden = false;
                                        //user_menu.hidden = false;
                                        logged_in = true;
                                        
                                        $("#toolbar_login").css("display","none");
                                        $("#toolbar").css("display","block");
                                        
                                        ni.page_listener_functions.initialize();
                                        NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/tool.json", "GET", null, true, NovaInitia.Toolbar.initialize_tools, false, null);
                                        NovaInitia.Toolbar.process_page(niClientApp_getURL());
                                        NovaInitia.Toolbar.set_user_tool_amounts();
                                    } else {
                                        //this.send_notification(loginReq.responseText, "PRIORITY_CRITICAL_HIGH");
                                        if (ni.debug_set) alert(loginReq.responseText);
                                    }
                                } else {
                                    //if (loginReq.responseText.substring(0, 6) == 'Error:') this.send_notification(loginReq.responseText, "PRIORITY_CRITICAL_HIGH");
                                    //else this.send_notification("Bad Response, server may be unreachable!!!", "PRIORITY_CRITICAL_HIGH");
                                    if (ni.debug_set) alert('Bad/No Response from server');
                                }
                            }
                            if (ni.debug_set) alert("=====http://" + url_prefix + server_url + "/login2.php"+"......"+loginParams);
                            NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/login2.php", "POST", loginParams, true, login_request_finished, false, null);

                        }
                    } else {
                        //this.send_notification("Bad Response, server may be unreachable!!!", "PRIORITY_CRITICAL_HIGH");
                        if (ni.debug_set) alert('Bad/No Response from server');
                    }
                }

                //NovaInitia.Toolbar.SharedKey.Sync();
                if (ni.debug_set) alert("*********"+"http://" + url_prefix + server_url + "/getKey.php");
                NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/getKey.php", "POST", params, true, user_request_finished, true, null);
            }
            //loginbar_throbber.collapsed = true;
        };


        function DiffieHellman(size) {
            this.bitStrength = size;
            this.secret = ni.bigInt.randBigInt(this.bitStrength, 0);
            this.base = ni.bigInt.int2bigInt(3, 0, 0);
        }

        DiffieHellman.prototype.Package = function () {
            this.resultbase = arguments[0] || 10;

            function Pack(Key) {
                this.g = ni.bigInt.bigInt2str(Key.base, Key.resultbase);
                this.p = ni.bigInt.bigInt2str(Key.prime, Key.resultbase);
                this.A = ni.bigInt.bigInt2str(Key.result, Key.resultbase);
            }

            if (!this.result) {
                while (!this.result || ni.bigInt.GCD(this.base, this.prime) != 1) {
                    this.prime = ni.bigInt.randTruePrime(this.bitStrength);
                    this.result = ni.bigInt.powMod(this.base, this.secret, this.prime);
                }

                this.sharedSet = new Pack(this);
            }

            return this.sharedSet;
        };

        DiffieHellman.prototype.FindKey = function (chal) {
            this.bigIntKey = ni.bigInt.powMod(ni.bigInt.str2bigInt(chal, 10, 0, 0), this.secret, this.prime);
            this.secretKey = ni.bigInt.bigInt2str(this.bigIntKey, 10);
            return this.secretKey;
        };

        DiffieHellman.prototype.Sync = function () {
            NovaInitia.Toolbar.send_request("http://www.nova-initia.com/key.php", "POST", this.Package(), true, function (resp) {
                NovaInitia.Toolbar.SharedKey.challenge = resp.responseText;
                NovaInitia.Toolbar.SharedKey.FindKey(NovaInitia.Toolbar.SharedKey.challenge);
                NovaInitia.Toolbar.SharedKey.secretKeyHex = ni.bigInt.bigInt2str(NovaInitia.Toolbar.SharedKey.bigIntKey, 16);
            }, true, null);
        };

        //FUUUUUUUUUUUU
        //this.SharedKey = new DiffieHellman(128);

        /* Check to see if the tool was successfully set and perform related tasks
         *  theResponse is the response from the tool set request
         *  theToolID is the ID of the tool trying to be set
         */
        this.check_tool_set = function (theResponse, theToolID) {
            if (ni.debug_set) alert("check_tool_set: "+theResponse);
            var tmp_info = ni.JSON.parse(theResponse.responseText);
            if (tmp_info.fail) {
                if (tmp_info.fail == true) {
                    NovaInitia.Toolbar.show_panel(fail_panel);

                    if (theToolID == trap_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/trap_failed.jpg";
                        fail_panel_label.value = "Trap failed";
                        trap_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == barrel_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/barrel_failed.jpg";
                        fail_panel_label.value = "Barrel failed";
                        barrel_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == spider_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/spider_failed.jpg";
                        fail_panel_label.value = "Spider failed";
                        spider_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == shield_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/shield_failed.jpg";
                        fail_panel_label.value = "Shield failed";
                        shield_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == doorway_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/doorway_failed.jpg";
                        fail_panel_label.value = "Doorway failed";
                        doorway_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == signpost_tool_id) {
                        fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/signpost_failed.jpg";
                        fail_panel_label.value = "Signpost failed";
                        signpost_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }

                    failTimeout = this.autoClose(failTimeout, "nova_initia_fail_panel", 3000);
                }
            }

            if (tmp_info.pageSet) {
                if (tmp_info.pageSet.ID) {
                    if (theToolID == trap_tool_id) {
                        NovaInitia.Toolbar.show_panel(trap_panel);
                        //trap_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/trap_set.jpg";
                        //trap_panel_label.value = "";
                        //trap_panel_description.value = "";
                        //parent.document.querySelector("#nova_initia_trap_panel_buttons>button").setAttribute("noshow", "true");
                        //trapTimeout = this.autoClose(trapTimeout, "nova_initia_trap_panel", 3000);
                        trap_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == barrel_tool_id) {
                        NovaInitia.Toolbar.show_panel(barrel_panel);
                        //barrel_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/barrel_set.jpg";
                        //barrel_panel_label.value = "";
                        //barrel_panel_title_0.value = "";
                        //barrel_panel_title_1.value = "";
                        //barrel_panel_title_2.value = "";
                        //parent.document.querySelector("#nova_initia_barrel_panel_buttons>button").setAttribute("noshow", "true");
                        //barrelTimeout = this.autoClose(barrelTimeout, "nova_initia_barrel_panel", 3000);

                        sg_tool_amount -= Number(stash_barrel_sg_textbox.value);
                        trap_tool_amount -= Number(stash_barrel_traps_textbox.value);
                        barrel_tool_amount -= Number(stash_barrel_barrels_textbox.value) + 1;
                        spider_tool_amount -= Number(stash_barrel_spiders_textbox.value);
                        shield_tool_amount -= Number(stash_barrel_shields_textbox.value);
                        doorway_tool_amount -= Number(stash_barrel_doorways_textbox.value);
                        signpost_tool_amount -= Number(stash_barrel_signposts_textbox.value);
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == spider_tool_id) {
                        NovaInitia.Toolbar.show_panel(spider_panel);
                        //spider_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/spider_set.jpg";
                        //spider_panel_label.value = "";
                        //spider_panel_description.value = "";
                        //parent.document.querySelector("#nova_initia_spider_panel_buttons>button").setAttribute("noshow", "true");
                        //spiderTimeout = this.autoClose(spiderTimeout, "nova_initia_spider_panel", 3000);
                        spider_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == doorway_tool_id) {
                        NovaInitia.Toolbar.show_panel(doorway_panel);
                        //doorway_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/doorway_set.png";
                        //doorway_panel_label.value = "";
                        //doorwayTimeout = this.autoClose(doorwayTimeout, "nova_initia_doorway_panel", 3000);
                        doorway_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                    if (theToolID == signpost_tool_id) {
                        NovaInitia.Toolbar.show_panel(signpost_panel);
                        //signpost_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/signpost_set.jpg";
                        //signpost_panel_label.value = "";
                        //parent.document.querySelector("#nova_initia_signpost_panel_buttons>button").setAttribute("noshow", "true");
                        //signpostTimeout = this.autoClose(signpostTimeout, "nova_initia_signpost_panel", 3000);
                        signpost_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                    }
                }
            }

            if (tmp_info.result) {
                if (tmp_info.result == "Page Full") {
                    //this.send_notification("Page full, please try again later", "PRIORITY_INFO_LOW");
                } else {
                    if (theToolID == trap_tool_id && tmp_info.result == "Trap Blocked!") {
                        spider_panel_label.value = tmp_info.username + "'s";
                        spider_panel_description.value = "spider caused the trap to explode in your face!";
                        spider_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/spider_triggered.png";
                        NovaInitia.Toolbar.show_panel(spider_panel);
                        trap_tool_amount -= 1;
                        sg_tool_amount -= tmp_info.Sg === undefined ? 0 : tmp_info.Sg;
                        NovaInitia.Toolbar.shield_hit(false, true);
                        NovaInitia.Toolbar.set_user_tool_amounts();
                        spiderTimeout = this.autoClose(spiderTimeout, spider_panel.id, 3000);
                    }

                    if (theToolID == spider_tool_id && tmp_info.result == "Spider triggered!") {
                        spider_panel_label.value = tmp_info.username + "'s";
                        spider_panel_description.value = "trap drove your spider into a rage!";
                        spider_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/spider_triggered.png";
                        NovaInitia.Toolbar.show_panel(spider_panel);
                        spider_tool_amount -= 1;
                        sg_tool_amount -= tmp_info.Sg === undefined ? 0 : tmp_info.Sg;
                        NovaInitia.Toolbar.shield_hit(false, true);
                        NovaInitia.Toolbar.set_user_tool_amounts();
                        spiderTimeout = this.autoClose(spiderTimeout, spider_panel.id, 3000);
                    }

                    if (theToolID == signpost_tool_id && tmp_info.result == "Signpost Blocked!") {
                        spider_panel_label.value = tmp_info.username + "'s";
                        spider_panel_description.value = "spider blocked your signpost!";
                        spider_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/signpost_blocked.jpg";
                        NovaInitia.Toolbar.show_panel(spider_panel);
                        signpost_tool_amount -= 1;
                        NovaInitia.Toolbar.set_user_tool_amounts();
                        spiderTimeout = this.autoClose(spiderTimeout, spider_panel.id, 3000);
                    }

                }
            }

            if (tmp_info.error) {
                //this.send_notification(tmp_info.error, "PRIORITY_INFO_LOW");
            }

            if (ni.debug_set) {
                alert("tool response: " + theResponse.responseText);
                alert("tool laid ID: " + tmp_info.pageSet.ID);
            }
        };

        this.autoClose = function (obj, id, timeout) {
            clearTimeout(obj);
            return setTimeout("NovaInitia.Toolbar.dismiss_panel('" + id + "');", timeout);
        };

        /*	Called when a toolbar button is pressed
			what is the XUL object it's called from
		*/
        this.process_toolbutton = function (what, url) {
            if (url != null) {
                NovaInitia.Toolbar.process_page(url);
            }
            if (ni.debug_set) alert('ni.process_toolbutton: ' + this);
            if (logged_in == true) {
                if (ni.debug_set) alert("It's logged in, maybe it'll work!");

                if (ni.debug_set) alert("CUR URL STUFF: "+cur_url_hash+", "+cur_domain_hash);
                switch (what.id) {
                case 'nova_initia_tool_trap':
                    if (ni.debug_set) alert("inside trap sequence 1");
                    if (at_a_page == true) {
                        if (ni.debug_set) alert("inside trap sequence 2");
                        if (trap_tool_amount > 0) {
                            //if (toolbar_throbber) toolbar_throbber.hidden = false;
                            
                            var tmp_tool_res = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + trap_tool_id + ".json", "POST", null, false, null, false, null);
                           
                            var trapPopover = safari.extension.createPopover("TrapPlaced", safari.extension.baseURI + "popovers/TrapPlaced.html",250, 205);
                            _displayPopover.popover = trapPopover;
                            _displayPopover.showPopover();
                            if (ni.debug_set) {
                                alert("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + trap_tool_id + ".json");
                                alert("tmp_tool_res status: " + tmp_tool_res.status);
                            }
                            if (tmp_tool_res.status == 201 || tmp_tool_res.status == 200) {
                                NovaInitia.Toolbar.check_tool_set(tmp_tool_res, trap_tool_id);
                            } //else this.send_notification("Bad Response, Trap Failed!", "PRIORITY_INFO_LOW");
                        } //else this.send_notification("Out of Traps!", "PRIORITY_INFO_LOW");
                    }
                    break;

                case 'nova_initia_tool_spider':
                    if (at_a_page == true) {
                        if (spider_tool_amount > 0) {
                            //if (toolbar_throbber) toolbar_throbber.hidden = false;
                            var tmp_tool_res = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + spider_tool_id + ".json", "POST", null, false, null, false);
                            
                            var spiderPopover = safari.extension.createPopover("SpiderPlaced", safari.extension.baseURI + "popovers/SpiderPlaced.html",250, 205);
                            _displayPopover.popover = spiderPopover;
                            _displayPopover.showPopover();
                            if (ni.debug_set) {
                                alert("http://" + url_prefix + server_url + "/rf/remog/page/" + cur_url_hash + "/" + cur_domain_hash + "/" + spider_tool_id + ".json");
                                alert("tmp_tool_res status: " + tmp_tool_res.status);
                            }
                            if (tmp_tool_res.status == 201 || tmp_tool_res.status == 200) {
                                NovaInitia.Toolbar.check_tool_set(tmp_tool_res, spider_tool_id);
                            } //else this.send_notification("Bad Response, Spider Failed!", "PRIORITY_INFO_LOW");
                        } //else this.send_notification("Out of Spiders!", "PRIORITY_INFO_LOW");
                    }
                    break;

                case 'nova_initia_tool_shield':
                    if (shield_tool_amount > 0) {
                        //if (toolbar_throbber) toolbar_throbber.hidden = false;
                        //var tmp_tool_res = NovaInitia.Toolbar.send_request("http://"+url_prefix+server_url+"/rf/remog/page/"+cur_url_hash+"/"+cur_domain_hash+"/"+shield_tool_id+".json","POST",null,false,null,false,null);
                        var tmp_tool_res = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/user/shield.json", "POST", null, false, null, false, null);
                        if (ni.debug_set) {
                            alert("http://" + url_prefix + server_url + "/rf/remog/user/shield");
                            alert("tmp_tool_res status: " + tmp_tool_res.status);
                            alert("tool response: " + tmp_tool_res.responseText);
                        }
                        if (tmp_tool_res.status == 200) {
                            var tmp_info = ni.JSON.parse(tmp_tool_res.responseText);
                            if (tmp_info.user.ID) {
                                user_JSON = tmp_info;
                                NovaInitia.Toolbar.set_user_info();
                                NovaInitia.Toolbar.set_user_shield();
                                if (ni.debug_set) alert("shield:"+tmp_info.user.isShielded);
                                if (tmp_info.user.isShielded == "0") {
                                    $("#nova_initia_tool_shield").attr("src","http://mikederoche.com/cs320/commoncode/skin/images/shieldOff32.png");
                                } else {
                                    $("#nova_initia_tool_shield").attr("src","http://mikederoche.com/cs320/commoncode/skin/images/shieldOn32.png");
                                }
                            }
                        } else {
                            ni.fail_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/shield_failed.jpg";
                            NovaInitia.Toolbar.show_panel(fail_panel);
                            if (toolbar_throbber) toolbar_throbber.hidden = true;
                        }
                    } //else this.send_notification("Out of Shields!", "PRIORITY_INFO_LOW");
                    break;
                case 'nova_initia_mail_send_button':
                    var data = {
                        "message": {
                            "ToID": document.getElementById("nova_initia_mail_receiver").value,
                            "Subject": document.getElementById("nova_initia_mail_receiver").value,
                            "Contents": document.getElementById("nova_initia_mail_body").value
                        }
                    };
                    var send_mail = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/mail.json", "POST", JSON.stringify(data), true, function () {
                        document.getElementById('nova_initia_mail_panel_popup').hidePopup();
                    }, false, null);
                    break;
                case 'nova_initia_mail':
                case 'nova_initia_mail_read':
                    this.openTab("http://www." + server_url + "/remog/mail?LASTKEY=" + NovaInitia.Toolbar.getKey());
                    break;
                case 'nova_initia_profile':
                    this.openTab("http://www." + server_url + "/remog/user/" + ni.username.value + "?LASTKEY=" + NovaInitia.Toolbar.getKey());
                    break;
                case 'nova_initia_events':
                    this.openTab("http://www." + server_url + "/remog/events?LASTKEY=" + NovaInitia.Toolbar.getKey());
                    break;
                case 'nova_initia_tool_sg':
                    this.openTab("http://www." + server_url + "/remog/trade?LASTKEY=" + NovaInitia.Toolbar.getKey());
                    break;
                }
                if (url != null) {
                    reTmpArray = ni.UrlToHash(the_URL, true);
                    NovaInitia.Toolbar.set_url_hashes(reTmpArray, niClientApp_getURL());
                }
            } else alert('Please Login First');
            if (toolbar_throbber) toolbar_throbber.hidden = true;
        };

        /* Initiates the Firefox yellow notification bar */
        this.send_notification = function (notif, style) {
            gBrowser.getNotificationBox().removeAllNotifications(true);
            gBrowser.getNotificationBox().appendNotification(notif, "", "", style, Array());
            var removeNotifications = function () {
                    gBrowser.getNotificationBox().removeAllNotifications(false);
                }
            notifyTimeout = this.autoClose(notifyTimeout, removeNotifications, 3000);
        };

        /* set the hashes for the page to the vars so they can be used later */
        this.set_url_hashes = function (theHashes, theCurUrl) {
            if (theCurUrl) {
                if (theCurUrl != prev_url) prev_url = cur_url;
                cur_url = theCurUrl;
            }
            if (theHashes['url']) cur_url_hash = theHashes['url'];
            if (theHashes['domain']) cur_domain_hash = theHashes['domain'];
            if (ni.debug_set) alert("cur url hash: " + cur_url_hash + " cur domain hash: " + cur_domain_hash);
        };

        this.get_cur_url = function () {
            return cur_url;
        };

        /* logout of current user and return toolbar to initial state */
        this.logout = function (sendNotice) {
            if (ni.debug_set) alert("logout");
            this.dismiss_all_panels();
            ni.page_listener_functions.shutdown();
            user_cache.flush_all();
            location_cache.flush_all();
            doorway_cache.flush_all();
            //toolbar.hidden = true;
            //toolbar.collapsed = true;
            //user_menu.hidden = true;
            if (ni.show_login_bar) {
                login_toolbar.hidden = false;
                login_toolbar.collapsed = false;
            }
            logged_in = false;
            //logout_menuitem.hidden = true;
            //login_menuitem.hidden = false;
            fnNovaInitia_prefs_set("novainitia-cur_username", "");
            fnNovaInitia_prefs_set("novainitia-cur_ava_url", "");
            fnNovaInitia_prefs_set("novainitia-cur_tagline", "");
            fnNovaInitia_prefs_set("novainitia-cur_email", "");
            fnNovaInitia_prefs_set("novainitia-cur_location", "");
            fnNovaInitia_prefs_set("novainitia-cur_class", "");
            fnNovaInitia_prefs_set("novainitia-cur_id", "");
            fnNovaInitia_prefs_set("novainitia-cur_hash", "");
            //ni.cookieManager.remove("nova-initia.com", "LastKey", "/", false);
            fnNovaInitia_prefs_set("novainitia-alpha-LastKey","");
	    //if (sendNotice) this.send_notification("Logged out of Nova Initia", "PRIORITY_INFO_LOW");
            _globalUsername = "";
            _globalPassword = "";
            $("#toolbar_login").css("display","block");
            $("#toolbar").css("display","none");
        };

        /* returns true is a user currently logged in */
        this.isLoggedIn = function () {
            return logged_in;
        };

        /* gets the current key */
        this.getKey = function () {
            if (ni.debug_set) alert("getKey: " + current_key);
            return current_key;
        };

        /* sets the current key */
        this.setKey = function (curKey) {
            if (ni.debug_set) alert("setKey: " + curKey);
            current_key = curKey;
        };

        /* function to check if an object is an array */
        this.isArray = function (obj) {
            return $.isArray(obj);
            //return obj.constructor == Array;
        };

        /* show the toolbar throbber */
        this.showThrobber = function () {
            if (toolbar_throbber) toolbar_throbber.hidden = false;
        };

        /* hide the toolbar throbber */
        this.hideThrobber = function () {
            if (toolbar_throbber) toolbar_throbber.hidden = true;
        };

        /* set the at_a_page variable */
        this.setAtAPage = function (atAPage) {
            at_a_page = atAPage;
        };

        /* resets the current page number to 0 */
        this.reset_cur_page_num = function () {
            cur_page_num = 0;
        };

        this.check_at_tour_start = function () {
            return at_tour_start;
        };

        this.set_at_tour_start = function (atTourStart) {
            at_tour_start = atTourStart;
        };

        this.get_in_a_tour = function () {
            return in_a_tour;
        };

        this.set_in_a_tour = function (inATour) {
            in_a_tour = inATour;
            if (inATour) {
                cur_tour_url = cur_url;
            }
        };

        this.get_cur_signpost_ID = function () {
            return cur_signpost_ID;
        };

        this.set_cur_signpost_ID = function (theID) {
            cur_signpost_ID = theID;
            if (theID == "") cur_tour_group_ID = "";
        };

        this.get_cur_tour_info = function () {
            return cur_tour_info;
        };

        this.set_last_barrel_ID = function (theID) {
            last_barrel_ID = theID;
        };

        this.set_last_tour_ID = function (theID) {
            last_tour_ID = theID;
        };


        /* Functions that listen for page/tab/location changes and fires process_new_URL */
        ni.page_change_listener = {
            alreadyChecked: false,
            QueryInterface: function (aIID) {
                if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) {
                    return this;
                }
                throw Components.results.NS_NOINTERFACE;
            },
            // gets called when the page changes (tabs included)
            onLocationChange: function (aProgress, aRequest, aURI) {
                function thread_process_new_URL() {
                    ni.page_listener_functions.process_new_URL(aURI);
                }
                if (aURI) {
                    if (NovaInitia.Toolbar.isLoggedIn()) setTimeout(thread_process_new_URL, 100);
                }
                this.alreadyChecked = false;
            },
            onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {
                if (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) {
                    if (ni.debug_set) alert("STATE_STOP");
                    this.alreadyChecked = true;
                }
            },
            onProgressChange: function () {},
            onStatusChange: function () {},
            onSecurityChange: function () {},
            onLinkIconAvailable: function () {}
        };

        /* Functions that get called when page/tab/location changes occur
		   initialize adds the progressListener to the page
		   shutdown disables the listener on page close
		   process_new_URL gets called when the page/tab/location is changed
		*/
        ni.page_listener_functions = {
            initialize: function () {
                if (ni.debug_set) alert('adding page progress listener');
                if (!ni.Toolbar.AutoSyncEnabled) {
                    document.addEventListener("NovaInitiaSync" + ni.Toolbar.getKey(), function (e) {
                        NovaInitia.Toolbar.sync_user();
                    }, false, true);
                    NovaInitia.Toolbar.AutoSyncEnabled = true;
                }
                //gBrowser.addProgressListener(ni.page_change_listener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
            },
            shutdown: function () {
                if (ni.debug_set) alert('removing page progress listener')
                //gBrowser.removeProgressListener(ni.page_change_listener);

                NovaInitia.Toolbar.setAtAPage(false);
            },
            process_new_URL: function (new_URI) {
                NovaInitia.Toolbar.process_page(new_URI);
            }
        };

        /* adds tool found on a page to the theArray (usually tool_array) for processing */
        this.add_tool_to_found_array = function (theArray, theObj, theToolID) {
            var theUsername = NovaInitia.Toolbar.get_username(theObj.USERID);
            var tmp_tools_found_array = new Array(theToolID, theUsername, theObj.ID, theObj.Sg === undefined ? null : theObj.Sg);
            if (theObj.toolData) tmp_tools_found_array[3] = theObj.toolData;
            theArray.push(tmp_tools_found_array);
            return theArray;
        };

        /* get a username from a user's ID */
        this.get_username = function (theUser) {
            var user_is_cached = user_cache.get(theUser);
            if (user_is_cached) {
                if (ni.debug_set) alert("cached user: " + user_is_cached[theUser]);
                return (user_is_cached[theUser]);
            } else {
                var tmp_user_res = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/user/" + theUser + ".json", "GET", null, false, null, false, null);
                if (tmp_user_res.status == 200) {
                    var tmp_info = ni.JSON.parse(tmp_user_res.responseText);
                    if (tmp_info['error']) NovaInitia.Toolbar.process_page_error(tmp_info['error']);
                    else {
                        if (tmp_info.user) {
                            user_cache.add(theUser, tmp_info.user.UserName);
                            return (tmp_info.user.UserName);
                        }
                    }
                }
            }
        };

        /* process the event results for the page */
        this.process_page = function (new_URI) {
            if (ni.debug_set) alert("@@processing page...");
            if (NovaInitia.Toolbar.isLoggedIn()) {
                if (ni.debug_set) alert("@@well, we ARE logged in...");
                var the_URL = false;
                if (new_URI.spec) the_URL = new_URI.spec;
                else the_URL = new_URI;
                if (the_URL) {
                    if (ni.debug_set) alert("inside url: "+the_URL);
                    NovaInitia.Toolbar.dismiss_all_panels();
                    NovaInitia.Toolbar.reset_cur_page_num();
                    last_barrel_ID = "";
                    last_tour_ID = "";
                    if (acceptable_URL_starters.indexOf(the_URL.substring(0, 5)) >= 0) {
                        if (ni.debug_set) alert("URL accepted");
                        //NovaInitia.Toolbar.showThrobber();
                        NovaInitia.Toolbar.setAtAPage(true);
                        var same_url = false;
                        var standardized_url = ni.UrlToHash(the_URL, false);

                        if (NovaInitia.Toolbar.get_cur_url() != standardized_url) same_url = true;

                        var location_cached = location_cache.get(standardized_url);
                        var tmpArray = {};
                        if (location_cached) {
                            if (ni.debug_set) alert("url was cached");
                            tmpArray['url'] = location_cached[standardized_url][0];
                            tmpArray['domain'] = location_cached[standardized_url][1];
                        } else {
                            if (ni.debug_set) alert("url was NOT cached");
                            tmpArray = ni.UrlToHash(the_URL, true);
                            var location_array = new Array(tmpArray['url'], tmpArray['domain']);
                            location_cache.add(standardized_url, location_array);
                        }
                        NovaInitia.Toolbar.set_url_hashes(tmpArray, standardized_url);
                        var tmpCurTourInfo = NovaInitia.Toolbar.get_cur_tour_info();
                        if (tmpCurTourInfo[1] && tmpCurTourInfo[1] == standardized_url) {
                            NovaInitia.Toolbar.set_in_a_tour(false);
                            NovaInitia.Toolbar.process_tour(tmpCurTourInfo[0]);
                        } else {
                            if (same_url) {

                                NovaInitia.Toolbar.set_at_tour_start(false);
                                if (NovaInitia.Toolbar.get_in_a_tour()) {
                                    NovaInitia.Toolbar.set_in_a_tour(false);
                                    NovaInitia.Toolbar.process_tour(NovaInitia.Toolbar.get_cur_signpost_ID());
                                } else {
                                    NovaInitia.Toolbar.set_cur_signpost_ID(null);
                                }
                            } else {
                                //NovaInitia.Toolbar.set_in_a_tour(false);
                                if (NovaInitia.Toolbar.get_cur_signpost_ID()) {
                                    NovaInitia.Toolbar.process_tour(NovaInitia.Toolbar.get_cur_signpost_ID());
                                }
                            }
                        }

                        var regexResult = /^http:\/\/www.nova-initia.com\/rf\/remog\/group\/[0-9]+$/.test(standardized_url);
                        if (regexResult) {
                            //alert("redirecting to: "+standardized_url+"?LASTKEY="+current_key);
                            //NovaInitia.Toolbar.set_at_tour_start(standardized_url.match(/[0-9]+/));
                            NovaInitia.Toolbar.redirect_to(standardized_url + "?LASTKEY=" + current_key);
                        } else {
                            var regObj = new RegExp('^http:\\/\\/www.nova-initia.com\\/rf\\/remog\\/group\\/[0-9]+\\?LASTKEY=' + current_key + '$');
                            var regObj2 = new RegExp('^http:\\/\\/www.nova-initia.com\\/rf\\/remog\\/group\\/[0-9]+\\?LASTKEY=' + current_key.toLowerCase() + '$');
                            regexResult = regObj.test(the_URL);
                            var regexResult2 = regObj2.test(the_URL);
                            if (regexResult || regexResult2) {
                                //alert("at a tour start page");
                                //We're at the launch page, show the popup
                                var tmpTourID = standardized_url.match(/[0-9]+/);
                                if (tmpTourID && !NovaInitia.Toolbar.get_in_a_tour()) {
                                    NovaInitia.Toolbar.set_at_tour_start(tmpTourID);
                                    NovaInitia.Toolbar.process_tour(tmpTourID);
                                }
                            }
                            if (NovaInitia.Toolbar.just_took_doorway()) {
                                NovaInitia.Toolbar.stepped_through_doorway();
                                took_doorway = true;
                            } else NovaInitia.Toolbar.set_last_doorwayID(null);

                            var end = "." + url_prefix + server_url + "/rf/remog/page.json";
                            var len = tmpArray['domain'].length;
                            var domainStr = tmpArray['domain'].substring(0, len - 1) + ".x" + tmpArray['domain'].substring(len - 1);
                            var trackURL = "http://" + url_prefix + server_url + "/rf/remog/page/" + tmpArray['url'] + "/" + tmpArray['domain'] + ".json";
                            function page_request_finished(pageRes) {
                                if (ni.debug_set) {
                                    alert("Process: " + the_URL);
                                    alert("url hash: " + tmpArray['url'] + " | domain hash: " + tmpArray['domain'] + " | url: " + trackURL);
                                    alert("status: " + pageRes.status);
                                    alert("resp: " + pageRes.responseText);
                                }
                                if (pageRes.status == 200) {
                                    doorway_carousel_array = new Array();
                                    var tmp_page_res = ni.JSON.parse(pageRes.responseText);
                                    if (tmp_page_res['error']) NovaInitia.Toolbar.process_page_error(tmp_page_res['error']);
                                    else {
                                        if (tmp_page_res.dns) {
                                            var splitUrl = /^[a-z]+:\/\/([a-z0-9][-a-z0-9]+(\.[a-z0-9][-a-z0-9]+)+)($|\/|\?)?[^#]*/.exec(cur_url);
                                            var domain = splitUrl[1];
                                            var add_dns_params = "&Hash=" + cur_domain_hash + "&Url=" + domain;
                                            var add_dns_req = NovaInitia.Toolbar.send_request("http://" + url_prefix + server_url + "/rf/remog/domain", "POST", add_dns_params, true, function () {}, false, null);
                                        }

                                        if (tmp_page_res.pageSet) {
                                            var tmp_tools_found_array = new Array();
                                            for (var i = 0; i <= 6; i++) {

                                                if (tmp_page_res.pageSet[i]) {
                                                    if (NovaInitia.Toolbar.isArray(tmp_page_res.pageSet[i])) {
                                                        var tmp_page_array = tmp_page_res.pageSet[i];
                                                        if (tmp_page_array) {
                                                            var j = 0;
                                                            while (tmp_page_array[j]) {
                                                                if (tmp_page_array[j].ID) tmp_tools_found_array = NovaInitia.Toolbar.add_tool_to_found_array(tmp_tools_found_array, tmp_page_array[j], i);
                                                                j++;
                                                            }
                                                        }
                                                    } else {
                                                        if (tmp_page_res.pageSet[i].ID) {
                                                            if (tmp_page_res.pageSet[i].toolData) tmp_tools_found_array = NovaInitia.Toolbar.add_tool_to_found_array(tmp_tools_found_array, tmp_page_res.pageSet[i], i);
                                                            else {
                                                                if (i != 3) tmp_tools_found_array = NovaInitia.Toolbar.add_tool_to_found_array(tmp_tools_found_array, tmp_page_res.pageSet[i], i);
                                                                else {
                                                                    if (tmp_page_res.fail == true) NovaInitia.Toolbar.shield_hit(true, true);
                                                                }
                                                            }
                                                        } else if (typeof (tmp_page_res.pageSet[i].count) != "undefined") {
                                                            if (i == 6) {
                                                                var count = tmp_page_res.pageSet[i].count;
                                                                document.getElementById("novaInitia_toolbar_inventory_messages").innerHTML = count;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if (tmp_tools_found_array.length > 0) NovaInitia.Toolbar.found_tools(tmp_tools_found_array);

                                        }
                                    }
                                } else {
                                    //this.send_notification("Unable To Track!", "PRIORITY_CRITICAL_HIGH");
                                }
                                NovaInitia.Toolbar.hideThrobber();
                            }

                            NovaInitia.Toolbar.send_request(trackURL, "GET", null, true, page_request_finished, false, null);
                        }
                    } else {
                        if (ni.debug_set) alert("URL not trackable");
                        NovaInitia.Toolbar.setAtAPage(false);
                    }
                }
            }
        };

        /* process an error response from the server */
        this.process_page_error = function (theError) {
            switch (theError) {
            case 'Please sign in.':
                //this.send_notification("Your session has expired, please login again.", "PRIORITY_CRITICAL_HIGH");
                NovaInitia.Toolbar.logout(false);
                break;
            }
        };

        this.testNameSpace = function () {
            alert("damn");
        };

        /* process the tools found */
        this.found_tools = function (theArray) {
            if (logged_in) {
                var i = 0;
                var j = 0;
                var panel_array = new Array();
                doorway_carousel_array = new Array();
                while (theArray[i]) {
                    niClientApp_catchPopup(theArray[i]);
                    if (tool_array[Number(theArray[i][0])]) {
                        if (Number(theArray[i][0]) == trap_tool_id) {
                            trap_panel_label.value = theArray[i][1] + "'s";
                            trap_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/trap_triggered.png";
                            
                            trap_panel_description.value = "trap was sprung!";
                            if (ni.debug_set) alert("Trap Sprung");
                            sg_tool_amount -= theArray[i][3] * 1;
                            if (sg_tool_amount < 0) sg_tool_amount = 0;
                            NovaInitia.Toolbar.shield_hit(true, false);
                            NovaInitia.Toolbar.set_user_tool_amounts();
                        }
                        if (Number(theArray[i][0]) == barrel_tool_id) {
                            last_barrel_ID = theArray[i][2];
                            barrel_panel_button.setAttribute("oncommand", "NovaInitia.Toolbar.set_last_barrel_ID('');NovaInitia.Toolbar.open_barrel('" + theArray[i][2] + "','" + theArray[i][1] + "');");
                            barrel_panel_label.value = theArray[i][1];
                            barrel_panel_profile_button.label = "<< " + theArray[i][1] + "'s Profile";
                            barrel_panel_profile_button.removeAttribute("oncommand");
                            barrel_panel_profile_button.setAttribute("oncommand", "gBrowser.selectedTab = gBrowser.addTab('http://www.nova-initia.com/remog/user/" + theArray[i][1] + "');");
                            barrel_panel_image.src = "http://mikederoche.com/cs320/commoncode/skin/images/overlays/barrel_found.jpg";
                            if (theArray[i][3]) {
                                barrel_panel_title_0.value = theArray[i][3].Title.substring(0, 38);
                                barrel_panel_title_1.value = theArray[i][3].Title.substring(38, 76);
                                barrel_panel_title_2.value = theArray[i][3].Title.substring(76, 114);
                            } else {
                                barrel_panel_title_1.value = "hid a barrel here!";
                            }
                        }
                        if (Number(theArray[i][0]) == doorway_tool_id) {
                            var tmp_carousel_array = new Array(theArray[i][2], theArray[i][1], theArray[i][3]);
                            doorway_carousel_array.push(tmp_carousel_array);
                        }
                        if (Number(theArray[i][0]) == signpost_tool_id) {
                            last_tour_ID = theArray[i][2];
                            signpost_panel_user_label.value = "by " + theArray[i][1];
                            signpost_panel_title_label.value = ni.urldecode(theArray[i][3].Title);
                            signpost_panel_goto_button.removeAttribute("oncommand");
                            var tmpURL = "NovaInitia.Toolbar.redirect_to('http://www." + server_url + "/rf/remog/group/" + theArray[i][2] + "?LASTKEY=" + current_key + "')";
                            signpost_panel_goto_button.setAttribute("oncommand", tmpURL);
                        }

                        if (ni.debug_set) alert("opening panel with tool id: " + Number(theArray[i][0]));
                        if (Number(theArray[i][0]) != spider_tool_id && Number(theArray[i][0]) != doorway_tool_id) {
                            if (!cur_signpost_ID) {
                                if (Number(theArray[i][0]) == signpost_tool_id) {
                                    if (cur_tour_group_ID != theArray[i][2]) {
                                        panel_array[j] = tool_array[Number(theArray[i][0])][0];
                                        j++;
                                    }
                                } else {
                                    panel_array[j] = tool_array[Number(theArray[i][0])][0];
                                    j++;
                                }
                            }
                        }
                    }
                    i++;
                }
                NovaInitia.Toolbar.setup_doorways(0);
                NovaInitia.Toolbar.show_panel(panel_array);
            }
        };

        /*	send a XMLHttpRequest
			theURL (string) - the url to send the request to
			theMethod (string) - the request type (ex: "POST"|"GET"|"PUT"|...)
			theParams (string) - the parameters to send, variables etc... (set to null if none otherwise use URL format: var1=blah&var2=blah2)
			nonBlock (bool) - set to true to setup a non-blocking request (remember to set the callback function if this it true)
			callback (string) - the function to be called when the request is finally received (set to null if nonBlock is false)
			noHeader (bool) - set to true to avoid sending the LASTKEY header (only used before the key is received the first time, all other requests must have this set to false or the server will ask the user to login)
		*/
        this.send_request = function (theURL, theMethod, theParams, nonBlock, callback, noHeader, theGroupID) {
            if (!noHeader) {
                if (theURL.indexOf("LASTKEY=" + NovaInitia.Toolbar.getKey()) == -1) {
                    if (theURL.indexOf("?") == -1) theURL += "?";
                    theURL += "&LASTKEY=" + NovaInitia.Toolbar.getKey();
                }
            }

            var filter_NSFW = fnNovaInitia_prefs_get("novainitia-filter_nsfw_all");

            if (NovaInitia.Toolbar.just_took_doorway()) {
                var doorway_cached = doorway_cache.get(last_doorwayID);
                var tmpDoorwayInfo = ni.JSON.parse(doorway_cached[last_doorwayID]);
                theGroupID = tmpDoorwayInfo.doorway.GroupID;
            }

            var theReq = new XMLHttpRequest();

            theReq.overrideMimeType("application/json");
            if (nonBlock) {
                theReq.onreadystatechange = function () {
                    if (theReq.readyState == 4) {
                        if (typeof (callback) == "function") callback(theReq);
                    }
                }
            }

            theReq.open(theMethod, theURL, nonBlock);
            if (typeof (theParams) === "string") {
                theReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            } else {
                theReq.setRequestHeader("Content-type", "application/json");
                theParams = ni.JSON.stringify(theParams);
            }
            if (!noHeader) theReq.setRequestHeader("X-NOVA-INITIA-LASTKEY", NovaInitia.Toolbar.getKey());
            if (theGroupID) theReq.setRequestHeader("X-NOVA-INITIA-GROUPID", theGroupID);
            if (filter_NSFW == true) theReq.setRequestHeader("X-NOVA-INITIA-FILTER-NSFW", filter_NSFW);
            if (theParams) theReq.send(theParams);
            else theReq.send(null);
            if (!nonBlock) return theReq;
        };

        this.createThumbnail = function () {
            var canvasW = 320;
            var canvasH = 240;

            var w = content.document.body.clientWidth + content.scrollMaxX;
            var cw = content.document.documentElement.clientWidth + content.scrollMaxX;
            var offsetW = (cw - w) / 2;
            if (w > 10000) w = 10000;

            var scale = canvasW / w;
            var ratio = canvasH / canvasW;
            var maxY = Math.round(w * ratio);

            var h = content.document.documentElement.clientHeight + content.scrollMaxY;
            if (h > 10000) h = 10000;
            if (h > maxY) h = maxY;

            var canvas = content.document.createElement("canvas");
            canvas.style.width = canvasW + "px";
            canvas.style.height = canvasH + "px";
            canvas.id = "c" + Math.random().toString().substring(2);
            canvas.width = canvasW;
            canvas.height = canvasH;
            canvas.style.position = "absolute";
            canvas.style.top = "0px";
            canvas.style.left = "0px";
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvasW, canvasH);

            ctx.save();
            ctx.scale(scale, scale);
            ctx.drawWindow(content, offsetW, 0, w, h, "rgb(0,0,0)");

            ctx.restore();
            content.document.body.appendChild(canvas);
        };


        this.toggleTextAndButtons = function (panel) {
            var buttons = document.getElementById(panel.id + "_buttons");
            var text = document.getElementById(panel.id + "_text");
            if (!text) {
                text = document.getElementById(panel.id + "_title_label");
            }

            var count = document.getElementById(panel.id + "_count");

            if (buttons) {
                buttons.style.display = "none";
                if (text) text.style.display = "-moz-box";
                if (count) count.style.display = "-moz-box";

                panel.onmouseover = function () {
                    if (text) text.style.display = "none";
                    if (count) count.style.display = "none";
                    buttons.style.display = "";
                    var disabled = buttons.querySelectorAll("button[noshow]");
                    if (disabled) {
                        for (var b in disabled) {
                            if (disabled[b].style) disabled[b].style.visibility = "hidden";
                        }
                    }
                };

                panel.onmouseout = function () {
                    if (text) text.style.display = "-moz-box";
                    if (count) count.style.display = "-moz-box";
                    buttons.style.display = "none";
                    var disabled = buttons.querySelectorAll("button[noshow]");
                    if (disabled) {
                        for (var b in disabled) {
                            if (disabled[b].style) disabled[b].style.visibility = "visible";
                        }
                    }

                };
            }
        };

    };

    ni.panels_open = false;
    console.log("About to initialize the toolbar, captain!");
   
    setTimeout(ni.initialize_toolbar, 100);
    setTimeout(ni.Toolbar.process_login, 200);
}


function fnNovaInitia_setUserLogin(inUser, inPass) {
    _globalUsername = inUser;
    _globalPassword = inPass;
}

function fnNovaInitia_init_fromAdapter(inusername, inpassword) {
    _globalUsername = inusername;
    _globalPassword = inpassword;

    StartNI(window.NovaInitia);
}

// this code block is extremely important
if (window.addEventListener ) {
    var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
    window.addEventListener("keydown", function(e){
        kkeys.push( e.keyCode );
        if ( kkeys.toString().indexOf( konami ) >= 0 ) {
            niClientApp_Konami();
            kkeys = [];
        }
    }, true);
}


window.NovaInitia = window.NovaInitia || {};
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (() => {

/**
* Minima JS lib for MiniDAPPs..
* 
* Includes the Decimal.js lib for precise Maths.
* 
* @spartacusrex
*/

/**
 * The MAIN Minima Callback function 
 */
var MINIMA_MAIN_CALLBACK = null;

/**
 * Main MINIMA Object for all interaction
 */
var Minima = {
	
	//RPC Host for Minima
	rpchost : "http://127.0.0.1:9002/",
	
	/**
	 * Minima Startup - with the callback function used for all Minima messages
	 */
	init : function(callback){
		//Log a little..
		Minima.log("Initialising..");
		
		//Info.. 
		Minima.log("RPCHOST : "+Minima.rpchost);
		
		//All done..
		MINIMA_MAIN_CALLBACK = callback;
		
		//And Post a message
		MinimaPostMessage("connected", "");
	},
	
	/**
	 * Log some data with a timestamp in a consistent manner to the console
	 */
	log : function(output){
		console.log("Minima @ "+new Date().toLocaleString()+" : "+output);
	},
	
	/**
	 * Runs a function on the Minima Command Line
	 */
	cmd : function(minifunc, callback){
		MinimaRPC(minifunc,callback);
	},
		
	/**
	 * Form GET / POST parameters..
	 */
	form : {
		
		//Return the GET parameter by scraping the location..
		getParams : function(parameterName){
			    var result = null,
		        tmp = [];
			    var items = location.search.substr(1).split("&");
			    for (var index = 0; index < items.length; index++) {
			        tmp = items[index].split("=");
			        //console.log("TMP:"+tmp);
				   if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
			    }
			    return result;
		}		
	}
};

/**
 * GET the RPC call - can be cmd/sql/file/net
 */
function MinimaRPC(command, callback){
	
	//URL encode the command..
	encoded = encodeURIComponent(command);
	
	//And now fire off a call saving it 
	httpGetAsync(Minima.rpchost+encoded, callback, false);
}

/**
 * Post a message to the Minima Event Listeners
 */
function MinimaPostMessage(event, info){
   //Create Data Object
   var data = { "event": event, "info" : info };

   //And dispatch
   if(MINIMA_MAIN_CALLBACK){
		MINIMA_MAIN_CALLBACK(data);	
   }      
}

/**
 * Notification Div
 */
var TOTAL_NOTIFICATIONS     = 0;
var TOTAL_NOTIFICATIONS_MAX = 0;
function MinimaCreateNotification(text, bgcolor){
	//First add the total overlay div
	var notifydiv = document.createElement('div');
	
	//Create a random ID for this DIV..
	var notifyid = Math.floor(Math.random()*1000000000);
	
	//Details..
	notifydiv.id  = notifyid;
	notifydiv.style.position 	 = "absolute";
	
	notifydiv.style.top 		 = 20 + TOTAL_NOTIFICATIONS_MAX * 110;
	TOTAL_NOTIFICATIONS++;
	TOTAL_NOTIFICATIONS_MAX++;
	
	notifydiv.style.right 		 = "0";
	notifydiv.style.width 	     = "400";
	notifydiv.style.height 	     = "90";
	
	//Regular or specific color
	if(bgcolor){
		notifydiv.style.background   = bgcolor;
	}else{
		notifydiv.style.background   = "#bbbbbb";	
	}
	
	notifydiv.style.opacity 	 = "0";
	notifydiv.style.borderRadius = "10px";
	notifydiv.style.border = "thick solid #222222";
	
	//Add it to the Page
	document.body.appendChild(notifydiv);
	
	//Create an HTML window
	var notifytext = "<table border=0 width=400 height=90><tr>" +
	"<td style='width:400;height:90;font-size:16px;font-family:monospace;color:black;text-align:center;vertical-align:middle;'>"+text+"</td></tr></table>";

	//Now get that element
	var elem = document.getElementById(notifyid);
	
	//Set the Text..
	elem.innerHTML = notifytext;
	
	//Fade in..
	elem.style.transition = "all 1s";
	
	// reflow
	elem.getBoundingClientRect();

	// it transitions!
	elem.style.opacity = 0.8;
	elem.style.right   = 40;
	
	//And create a timer to shut it down..
	setTimeout(function() {
		TOTAL_NOTIFICATIONS--;
		if(TOTAL_NOTIFICATIONS<=0){
			TOTAL_NOTIFICATIONS=0;
			TOTAL_NOTIFICATIONS_MAX=0;
		}
		
		document.getElementById(notifyid).style.display = "none";  
	 }, 4000);
}

/**
 * Utility function for GET request
 * 
 * @param theUrl
 * @param callback
 * @param params
 * @returns
 */
function httpPostAsync(theUrl, params, callback){
		
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			//Do we log it..
        	if(Minima.logging){
        		Minima.log("RPC:"+theUrl+"\nPARAMS:"+params+"\nRESPONSE:"+xmlHttp.responseText);
        	}

        	//Send it to the callback function..
        	if(callback){
        		callback(JSON.parse(xmlHttp.responseText));
        	}
        }
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');    
	xmlHttp.send(params);
}

/**
 * Utility function for GET request (UNUSED for now..)
 * 
 * @param theUrl
 * @param callback
 * @returns
 */
function httpGetAsync(theUrl, callback, logenabled)
{	
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	if(logenabled){
				console.log("RPC      : "+theUrl);
				console.log("RESPONSE : "+xmlHttp.responseText);
			}

			//Always a JSON ..
        	var rpcjson = JSON.parse(xmlHttp.responseText);
        	
        	//Do we log it..
        	//if(Minima.logging && logenabled){
        	//	var logstring = JSON.stringify(rpcjson, null, 2).replace(/\\n/g,"\n");
        	//	Minima.log(theUrl+"\n"+logstring);
        	//}
        	
        	//Send it to the callback function..
        	if(callback){
        		callback(rpcjson);
        	}
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


/***/ }),
/* 2 */
/***/ (() => {

/**
 * SCRIPT IDE JS
 */

function runScript() {
  var txt = document.getElementById("scriptarea").value.trim();

  //Check for Killer Characters..
  if (txt.indexOf(",") != -1) {
    alert("NO commas Allowed in Scripts!");
    return;
  }
  if (txt.indexOf('"') != -1 || txt.indexOf("'") != -1) {
    alert("NO Quotes Allowed in Scripts!");
    return;
  }
  if (txt.indexOf(":") != -1 || txt.indexOf(";") != -1) {
    alert("NO semi-colons Allowed in Scripts!");
    return;
  }

  //Save if you run..
  if (document.getElementById("autosave").checked) {
    save();
  }

  //Get the script
  var script = txt.replace(/\n/g, " ").trim();
  script = parseComments(script).trim();
  if (script == "") {
    return;
  }

  var state = document.getElementById("state").value.trim();
  if (state != "") {
    state = "state:" + state;
  }

  var prevstate = document.getElementById("prevstate").value.trim();
  if (prevstate != "") {
    prevstate = "prevstate:" + prevstate;
  }

  var globals = "globals:" + getGlobals();

  var sigs = document.getElementById("sigs").value.trim();
  if (sigs != "") {
    sigs = "signatures:" + sigs;
  }

  var scripts = document.getElementById("mastscripts").value.trim();
  if (scripts != "") {
    scripts = "extrascripts:" + sigs;
  }

  Minima.cmd(
    'runscript script:"' +
      script +
      '" ' +
      state +
      " " +
      prevstate +
      " " +
      globals +
      " " +
      sigs +
      " " +
      scripts,
    function (json) {
      console.log("RESULT : " + JSON.stringify(json));

      var brkscr = json.response.trace.replace(/\n/g, "<br>");

      var res = "---------------------------------<br>";
      if (json.response.parseok) {
        res += "PARSE OK : ";
      } else {
        res += "PARSE FAIL : ";
      }

      if (json.response.success) {
        res += "RUN OK : ";
      } else {
        res += "RUN FAIL : ";
      }

      if (json.response.monotonic) {
        res += "MONOTONIC ";
      } else {
        res += "NOT MONOTONIC ";
      }

      //Set it
      document.getElementById("parse").innerHTML =
        res + "<br>---------------------------------<br>" + brkscr;
      document.getElementById("parse").scrollTop = 0;

      //Set some detais
      document.getElementById("clean").innerHTML = json.response.clean.script;
      document.getElementById("clean").scrollTop = 0;

      //Set the global address
      document.getElementById("cleanaddress").innerHTML =
        json.response.clean.address;
      document.getElementById("@ADDRESS").value = json.response.clean.address;
    }
  );

  return;
}

var globals = {};
function addGlobalIfValid(globalname) {
  if (document.getElementById(globalname).value.trim() !== "") {
    globals[globalname + ""] = document.getElementById(globalname).value.trim();
    //globals += globalname+":"+document.getElementById(globalname).value.trim()+"#";
  }
}
function getGlobals() {
  globals = {};

  addGlobalIfValid("@BLOCK");
  addGlobalIfValid("@CREATED");
  addGlobalIfValid("@INPUT");
  addGlobalIfValid("@AMOUNT");
  addGlobalIfValid("@TOKENID");
  addGlobalIfValid("@COINID");
  addGlobalIfValid("@TOTIN");
  addGlobalIfValid("@TOTOUT");

  return JSON.stringify(globals);
}

function clearGlobals() {
  document.getElementById("@BLOCK").value = "";
  document.getElementById("@CREATED").value = "";
  document.getElementById("@INPUT").value = "";
  document.getElementById("@ADDRESS").value = "";
  document.getElementById("@AMOUNT").value = "";
  document.getElementById("@TOKENID").value = "";
  document.getElementById("@COINID").value = "";
  document.getElementById("@TOTIN").value = "";
  document.getElementById("@TOTOUT").value = "";
}

function getOutputString() {
  var outputs = "";
  var table = document.getElementById("outputtable");
  var rows = table.getElementsByTagName("tr");
  var len = rows.length;
  for (i = 2; i < len; i++) {
    var address = getTableValue(
      document.getElementById("table_address_" + i).innerHTML
    );
    var amount = getTableValue(
      document.getElementById("table_amount_" + i).innerHTML
    );
    var tokenid = getTableValue(
      document.getElementById("table_tokenid_" + i).innerHTML
    );

    outputs += address + ":" + amount + ":" + tokenid + "#";
  }

  return outputs;
}

//Deafult - Save the selected
function save() {
  saveScript(document.getElementById("scripts").selectedIndex);
}

function saveScript(sel) {
  //Get all this different parts..
  var scriptarea = document.getElementById("scriptarea").value;
  var state = document.getElementById("state").value;
  var prevstate = document.getElementById("prevstate").value;
  var sigs = document.getElementById("sigs").value;
  var scripts = document.getElementById("mastscripts").value;
  var outputs = "";
  var globals = getGlobals();

  //Create a JSON out of it..
  var storejson = {
    script: scriptarea,
    state: state,
    prevstate: prevstate,
    sigs: sigs,
    outputs: outputs,
    scripts: scripts,
    globals: globals,
  };

  //Convert the whole thing to a tring
  var jsontext = JSON.stringify(storejson);
  //console.log("SAVE JSON:"+jsontext);

  //Now store it..
  window.localStorage.setItem("ScriptIDE" + sel, jsontext);
}

var prevsel = 0;
function loadScript() {
  //Load cached if available..
  var sel = document.getElementById("scripts").selectedIndex;

  //Save the OLD
  if (document.getElementById("autosave").checked) {
    saveScript(prevsel);
  }
  prevsel = sel;

  //Load the JSON
  var jsontext = window.localStorage.getItem("ScriptIDE" + sel);
  //console.log("LOAD JSON:"+jsontext);

  if (jsontext != null) {
    //Convert to a JSON
    var json = JSON.parse(jsontext);

    document.getElementById("scriptarea").value = json.script;
    document.getElementById("state").value = json.state;
    document.getElementById("prevstate").value = json.prevstate;
    document.getElementById("mastscripts").value = json.scripts;
    document.getElementById("sigs").value = json.sigs;

    //Load the OUTPUTS..
    /*clearAllOutputs();
		var outs = json.outputs.split("#");
		outlen   = outs.length;
		for(i=0;i<outlen;i++){
			if(outs[i] !== ""){
				var out = outs[i].split(":");
				addOutput(out[0],out[1],out[2]);	
			}
		}*/

    //Load the GLOBALS..
    clearGlobals();
    var globs = json.globals.split("#");
    globlen = globs.length;
    for (i = 0; i < globlen; i++) {
      if (globs[i] !== "") {
        var glob = globs[i].split(":");
        document.getElementById(glob[0]).value = glob[1];
      }
    }
  } else {
    //Reset the values..
    document.getElementById("scriptarea").value = "";
    document.getElementById("state").value = "";
    document.getElementById("prevstate").value = "";
    document.getElementById("sigs").value = "";

    clearGlobals();
    //clearAllOutputs();
  }

  //reset..
  document.getElementById("parse").innerHTML = "";
  document.getElementById("clean").innerHTML = "";
}

/**
 * The OUTPUTS table
 */
function addDefault() {
  var addr = document.getElementById("output_address").value;
  var amt = document.getElementById("output_amount").value;
  var tok = document.getElementById("output_tokenid").value;
  addOutput(addr, amt, tok);
}

function addOutput(addr, amt, tok) {
  var table = document.getElementById("outputtable");
  var rows = table.getElementsByTagName("tr");
  var len = rows.length;
  var out = len - 2;

  var row = table.insertRow(len);
  var output = row.insertCell(0);
  var address = row.insertCell(1);
  var amount = row.insertCell(2);
  var tokenid = row.insertCell(3);

  //Data..
  output.id = "table_output_" + len;
  output.innerHTML = "" + out;

  address.id = "table_address_" + len;
  address.innerHTML = '<input size=30 type=text value="' + addr + '">';

  amount.id = "table_amount_" + len;
  amount.innerHTML = '<input size=20 type=number value="' + amt + '">';

  tokenid.id = "table_tokenid_" + len;
  tokenid.innerHTML = '<input size=30 type=text value="' + tok + '">';
}

function getTableValue(fullhtml) {
  start = fullhtml.indexOf('value="') + 7;
  end = fullhtml.indexOf('"', start);
  ret = fullhtml.substring(start, end);
  return ret;
}

function deleteOutput() {
  var table = document.getElementById("outputtable");
  var rows = table.getElementsByTagName("tr");
  var len = rows.length;

  if (len > 2) {
    table.deleteRow(len - 1);
  }
}

function clearAllOutputs() {
  var table = document.getElementById("outputtable");
  var rows = table.getElementsByTagName("tr");
  var len = rows.length;

  for (i = 2; i < len; i++) {
    deleteOutput();
  }

  document.getElementById("output_address").value = "0x00";
  document.getElementById("output_amount").value = "0";
  document.getElementById("output_tokenid").value = "0x00";
}

function parseComments(code) {
  // state
  var isInRegExp = false;
  var isInString = false;
  var terminator = null; // to hold the string terminator
  var escape = false; // last char was an escape
  var isInComment = false;

  var c = code.split(""); // code

  var o = []; // output
  for (var i = 0; i < c.length; i++) {
    if (isInString) {
      // handle string literal case
      if (c[i] === terminator && escape === false) {
        isInString = false;
        o.push(c[i]);
      } else if (c[i] === "\\") {
        // escape
        escape = true;
      } else {
        escape = false;
        o.push(c[i]);
      }
    } else if (isInRegExp) {
      // regular expression case
      if (c[i] === "/" && escape === false) {
        isInRegExp = false;
        o.push(c[i]);
      } else if (c[i] === "\\") {
        escape = true;
      } else {
        escape = false;
        o.push(c[i]);
      }
    } else if (isInComment) {
      // comment case
      if (c[i] === "*" && c[i + 1] === "/") {
        isInComment = false;
        i++;
        // Note - not pushing comments to output
      }
    } else {
      // not in a literal
      if (c[i] === "/" && c[i + 1] === "/") {
        // single line comment
        while (c[i] !== "\n" && c[i] !== undefined) {
          //end or new line
          i++;
        }
      } else if (c[i] === "/" && c[i + 1] === "*") {
        // start comment
        isInComment = true;
        o.push(" "); // add a space per spec
        i++; // don't catch /*/
      } else if (c[i] === "/") {
        // start regexp literal
        isInRegExp = true;
        o.push(c[i]);
      } else if (c[i] === "'" || c[i] === '"') {
        // string literal
        isInString = true;
        o.push(c[i]);
        separator = c[i];
      } else {
        // plain ol' code
        o.push(c[i]);
      }
    }
  }
  return o.join("");
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {

/*! taboverride v4.0.3 | https://github.com/wjbryant/taboverride
(c) 2015 Bill Bryant | http://opensource.org/licenses/mit */

/**
 * @fileOverview taboverride
 * @author       Bill Bryant
 * @version      4.0.3
 */

/*jslint browser: true */
/*global exports, define */

// use CommonJS or AMD if available
(function (factory) {
    'use strict';

    var mod;

    if (true) {
        // Node.js/CommonJS
        factory(exports);
    } else {}
}(function (tabOverride) {
    'use strict';

    /**
     * The tabOverride namespace object
     *
     * @namespace tabOverride
     */

    var document = window.document,
        listeners,
        aTab = '\t', // the string representing a tab
        tabKey = 9,
        untabKey = 9,
        tabModifierKeys = [],
        untabModifierKeys = ['shiftKey'],
        autoIndent = true, // whether each line should be automatically indented
        inWhitespace = false, // whether the start of the selection is in the leading whitespace on enter
        textareaElem = document.createElement('textarea'), // temp textarea element to get newline character(s)
        newline, // the newline character sequence (\n or \r\n)
        newlineLen, // the number of characters used for a newline (1 or 2)
        hooks = {};

    /**
     * Determines whether the specified modifier keys match the modifier keys
     * that were pressed.
     *
     * @param  {string[]} modifierKeys  the modifier keys to check - ex: ['shiftKey']
     * @param  {Event}    e             the event object for the keydown event
     * @return {boolean}                whether modifierKeys are valid for the event
     *
     * @method tabOverride.utils.isValidModifierKeyCombo
     */
    function isValidModifierKeyCombo(modifierKeys, e) {
        var modifierKeyNames = ['alt', 'ctrl', 'meta', 'shift'],
            numModKeys = modifierKeys.length,
            i,
            j,
            currModifierKey,
            isValid = true;

        // check that all required modifier keys were pressed
        for (i = 0; i < numModKeys; i += 1) {
            if (!e[modifierKeys[i]]) {
                isValid = false;
                break;
            }
        }

        // if the requirements were met, check for additional modifier keys
        if (isValid) {
            for (i = 0; i < modifierKeyNames.length; i += 1) {
                currModifierKey = modifierKeyNames[i] + 'Key';

                // if this key was pressed
                if (e[currModifierKey]) {
                    // if there are required keys, check whether the current key
                    // is required
                    if (numModKeys) {
                        isValid = false;

                        // if this is a required key, continue
                        for (j = 0; j < numModKeys; j += 1) {
                            if (currModifierKey === modifierKeys[j]) {
                                isValid = true;
                                break;
                            }
                        }
                    } else {
                        // no required keys, but one was pressed
                        isValid = false;
                    }
                }

                // an extra key was pressed, don't check anymore
                if (!isValid) {
                    break;
                }
            }
        }

        return isValid;
    }

    /**
     * Determines whether the tab key combination was pressed.
     *
     * @param  {number}  keyCode  the key code of the key that was pressed
     * @param  {Event}   e        the event object for the key event
     * @return {boolean}          whether the tab key combo was pressed
     *
     * @private
     */
    function tabKeyComboPressed(keyCode, e) {
        return keyCode === tabKey && isValidModifierKeyCombo(tabModifierKeys, e);
    }

    /**
     * Determines whether the untab key combination was pressed.
     *
     * @param  {number}  keyCode  the key code of the key that was pressed
     * @param  {Event}   e        the event object for the key event
     * @return {boolean}          whether the untab key combo was pressed
     *
     * @private
     */
    function untabKeyComboPressed(keyCode, e) {
        return keyCode === untabKey && isValidModifierKeyCombo(untabModifierKeys, e);
    }

    /**
     * Creates a function to get and set the specified key combination.
     *
     * @param  {Function} keyFunc       getter/setter function for the key
     * @param  {string[]} modifierKeys  the array of modifier keys to manipulate
     * @return {Function}               a getter/setter function for the specified
     *                                  key combination
     *
     * @private
     */
    function createKeyComboFunction(keyFunc, modifierKeys) {
        return function (keyCode, modifierKeyNames) {
            var i,
                keyCombo = '';

            if (arguments.length) {
                if (typeof keyCode === 'number') {
                    keyFunc(keyCode);

                    modifierKeys.length = 0; // clear the array

                    if (modifierKeyNames && modifierKeyNames.length) {
                        for (i = 0; i < modifierKeyNames.length; i += 1) {
                            modifierKeys.push(modifierKeyNames[i] + 'Key');
                        }
                    }
                }

                return this;
            }

            for (i = 0; i < modifierKeys.length; i += 1) {
                keyCombo += modifierKeys[i].slice(0, -3) + '+';
            }

            return keyCombo + keyFunc();
        };
    }

    /**
     * Event handler to insert or remove tabs and newlines on the keydown event
     * for the tab or enter key.
     *
     * @param {Event} e  the event object
     *
     * @method tabOverride.handlers.keydown
     */
    function overrideKeyDown(e) {
        e = e || event;

        // textarea elements can only contain text nodes which don't receive
        // keydown events, so the event target/srcElement will always be the
        // textarea element, however, prefer currentTarget in order to support
        // delegated events in compliant browsers
        var target = e.currentTarget || e.srcElement, // don't use the "this" keyword (doesn't work in old IE)
            key = e.keyCode, // the key code for the key that was pressed
            tab, // the string representing a tab
            tabLen, // the length of a tab
            text, // initial text in the textarea
            range, // the IE TextRange object
            tempRange, // used to calculate selection start and end positions in IE
            preNewlines, // the number of newline character sequences before the selection start (for IE)
            selNewlines, // the number of newline character sequences within the selection (for IE)
            initScrollTop, // initial scrollTop value used to fix scrolling in Firefox
            selStart, // the selection start position
            selEnd, // the selection end position
            sel, // the selected text
            startLine, // for multi-line selections, the first character position of the first line
            endLine, // for multi-line selections, the last character position of the last line
            numTabs, // the number of tabs inserted / removed in the selection
            startTab, // if a tab was removed from the start of the first line
            preTab, // if a tab was removed before the start of the selection
            whitespace, // the whitespace at the beginning of the first selected line
            whitespaceLen, // the length of the whitespace at the beginning of the first selected line
            CHARACTER = 'character'; // string constant used for the Range.move methods

        // don't do any unnecessary work
        if ((target.nodeName && target.nodeName.toLowerCase() !== 'textarea') ||
                (key !== tabKey && key !== untabKey && (key !== 13 || !autoIndent))) {
            return;
        }

        // initialize variables used for tab and enter keys
        inWhitespace = false; // this will be set to true if enter is pressed in the leading whitespace
        text = target.value;

        // this is really just for Firefox, but will be used by all browsers that support
        // selectionStart and selectionEnd - whenever the textarea value property is reset,
        // Firefox scrolls back to the top - this is used to set it back to the original value
        // scrollTop is nonstandard, but supported by all modern browsers
        initScrollTop = target.scrollTop;

        // get the text selection
        if (typeof target.selectionStart === 'number') {
            selStart = target.selectionStart;
            selEnd = target.selectionEnd;
            sel = text.slice(selStart, selEnd);

        } else if (document.selection) { // IE
            range = document.selection.createRange();
            sel = range.text;
            tempRange = range.duplicate();
            tempRange.moveToElementText(target);
            tempRange.setEndPoint('EndToEnd', range);
            selEnd = tempRange.text.length;
            selStart = selEnd - sel.length;

            // whenever the value of the textarea is changed, the range needs to be reset
            // IE <9 (and Opera) use both \r and \n for newlines - this adds an extra character
            // that needs to be accounted for when doing position calculations with ranges
            // these values are used to offset the selection start and end positions
            if (newlineLen > 1) {
                preNewlines = text.slice(0, selStart).split(newline).length - 1;
                selNewlines = sel.split(newline).length - 1;
            } else {
                preNewlines = selNewlines = 0;
            }
        } else {
            return; // cannot access textarea selection - do nothing
        }

        // tab / untab key - insert / remove tab
        if (key === tabKey || key === untabKey) {

            // initialize tab variables
            tab = aTab;
            tabLen = tab.length;
            numTabs = 0;
            startTab = 0;
            preTab = 0;

            // multi-line selection
            if (selStart !== selEnd && sel.indexOf('\n') !== -1) {
                // for multiple lines, only insert / remove tabs from the beginning of each line

                // find the start of the first selected line
                if (selStart === 0 || text.charAt(selStart - 1) === '\n') {
                    // the selection starts at the beginning of a line
                    startLine = selStart;
                } else {
                    // the selection starts after the beginning of a line
                    // set startLine to the beginning of the first partially selected line
                    // subtract 1 from selStart in case the cursor is at the newline character,
                    // for instance, if the very end of the previous line was selected
                    // add 1 to get the next character after the newline
                    // if there is none before the selection, lastIndexOf returns -1
                    // when 1 is added to that it becomes 0 and the first character is used
                    startLine = text.lastIndexOf('\n', selStart - 1) + 1;
                }

                // find the end of the last selected line
                if (selEnd === text.length || text.charAt(selEnd) === '\n') {
                    // the selection ends at the end of a line
                    endLine = selEnd;
                } else if (text.charAt(selEnd - 1) === '\n') {
                    // the selection ends at the start of a line, but no
                    // characters are selected - don't indent this line
                    endLine = selEnd - 1;
                } else {
                    // the selection ends before the end of a line
                    // set endLine to the end of the last partially selected line
                    endLine = text.indexOf('\n', selEnd);
                    if (endLine === -1) {
                        endLine = text.length;
                    }
                }

                // tab key combo - insert tabs
                if (tabKeyComboPressed(key, e)) {

                    numTabs = 1; // for the first tab

                    // insert tabs at the beginning of each line of the selection
                    target.value = text.slice(0, startLine) + tab +
                        text.slice(startLine, endLine).replace(/\n/g, function () {
                            numTabs += 1;
                            return '\n' + tab;
                        }) + text.slice(endLine);

                    // set start and end points
                    if (range) { // IE
                        range.collapse();
                        range.moveEnd(CHARACTER, selEnd + (numTabs * tabLen) - selNewlines - preNewlines);
                        range.moveStart(CHARACTER, selStart + tabLen - preNewlines);
                        range.select();
                    } else {
                        // the selection start is always moved by 1 character
                        target.selectionStart = selStart + tabLen;
                        // move the selection end over by the total number of tabs inserted
                        target.selectionEnd = selEnd + (numTabs * tabLen);
                        target.scrollTop = initScrollTop;
                    }
                } else if (untabKeyComboPressed(key, e)) {
                    // if the untab key combo was pressed, remove tabs instead of inserting them

                    if (text.slice(startLine).indexOf(tab) === 0) {
                        // is this tab part of the selection?
                        if (startLine === selStart) {
                            // it is, remove it
                            sel = sel.slice(tabLen);
                        } else {
                            // the tab comes before the selection
                            preTab = tabLen;
                        }
                        startTab = tabLen;
                    }

                    target.value = text.slice(0, startLine) + text.slice(startLine + preTab, selStart) +
                        sel.replace(new RegExp('\n' + tab, 'g'), function () {
                            numTabs += 1;
                            return '\n';
                        }) + text.slice(selEnd);

                    // set start and end points
                    if (range) { // IE
                        // setting end first makes calculations easier
                        range.collapse();
                        range.moveEnd(CHARACTER, selEnd - startTab - (numTabs * tabLen) - selNewlines - preNewlines);
                        range.moveStart(CHARACTER, selStart - preTab - preNewlines);
                        range.select();
                    } else {
                        // set start first for Opera
                        target.selectionStart = selStart - preTab; // preTab is 0 or tabLen
                        // move the selection end over by the total number of tabs removed
                        target.selectionEnd = selEnd - startTab - (numTabs * tabLen);
                    }
                } else {
                    return; // do nothing for invalid key combinations
                }

            } else { // single line selection

                // tab key combo - insert a tab
                if (tabKeyComboPressed(key, e)) {
                    if (range) { // IE
                        range.text = tab;
                        range.select();
                    } else {
                        target.value = text.slice(0, selStart) + tab + text.slice(selEnd);
                        target.selectionEnd = target.selectionStart = selStart + tabLen;
                        target.scrollTop = initScrollTop;
                    }
                } else if (untabKeyComboPressed(key, e)) {
                    // if the untab key combo was pressed, remove a tab instead of inserting one

                    // if the character before the selection is a tab, remove it
                    if (text.slice(selStart - tabLen).indexOf(tab) === 0) {
                        target.value = text.slice(0, selStart - tabLen) + text.slice(selStart);

                        // set start and end points
                        if (range) { // IE
                            // collapses range and moves it by -1 tab
                            range.move(CHARACTER, selStart - tabLen - preNewlines);
                            range.select();
                        } else {
                            target.selectionEnd = target.selectionStart = selStart - tabLen;
                            target.scrollTop = initScrollTop;
                        }
                    }
                } else {
                    return; // do nothing for invalid key combinations
                }
            }
        } else if (autoIndent) { // Enter key
            // insert a newline and copy the whitespace from the beginning of the line

            // find the start of the first selected line
            if (selStart === 0 || text.charAt(selStart - 1) === '\n') {
                // the selection starts at the beginning of a line
                // do nothing special
                inWhitespace = true;
                return;
            }

            // see explanation under "multi-line selection" above
            startLine = text.lastIndexOf('\n', selStart - 1) + 1;

            // find the end of the first selected line
            endLine = text.indexOf('\n', selStart);

            // if no newline is found, set endLine to the end of the text
            if (endLine === -1) {
                endLine = text.length;
            }

            // get the whitespace at the beginning of the first selected line (spaces and tabs only)
            whitespace = text.slice(startLine, endLine).match(/^[ \t]*/)[0];
            whitespaceLen = whitespace.length;

            // the cursor (selStart) is in the whitespace at beginning of the line
            // do nothing special
            if (selStart < startLine + whitespaceLen) {
                inWhitespace = true;
                return;
            }

            if (range) { // IE
                // insert the newline and whitespace
                range.text = '\n' + whitespace;
                range.select();
            } else {
                // insert the newline and whitespace
                target.value = text.slice(0, selStart) + '\n' + whitespace + text.slice(selEnd);
                // Opera uses \r\n for a newline, instead of \n,
                // so use newlineLen instead of a hard-coded value
                target.selectionEnd = target.selectionStart = selStart + newlineLen + whitespaceLen;
                target.scrollTop = initScrollTop;
            }
        }

        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
            return false;
        }
    }

    /**
     * Event handler to prevent the default action for the keypress event when
     * tab or enter is pressed. Opera and Firefox also fire a keypress event
     * when the tab or enter key is pressed. Opera requires that the default
     * action be prevented on this event or the textarea will lose focus.
     *
     * @param {Event} e  the event object
     *
     * @method tabOverride.handlers.keypress
     */
    function overrideKeyPress(e) {
        e = e || event;

        var key = e.keyCode;

        if (tabKeyComboPressed(key, e) || untabKeyComboPressed(key, e) ||
                (key === 13 && autoIndent && !inWhitespace)) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
                return false;
            }
        }
    }

    /**
     * Executes all registered extension functions for the specified hook.
     *
     * @param {string} hook    the name of the hook for which the extensions are registered
     * @param {Array}  [args]  the arguments to pass to the extension
     *
     * @method tabOverride.utils.executeExtensions
     */
    function executeExtensions(hook, args) {
        var i,
            extensions = hooks[hook] || [],
            len = extensions.length;

        for (i = 0; i < len; i += 1) {
            extensions[i].apply(null, args);
        }
    }

    /**
     * @typedef {Object} tabOverride.utils~handlerObj
     *
     * @property {string}   type     the event type
     * @property {Function} handler  the handler function - passed an Event object
     */

    /**
     * @typedef {Object} tabOverride.utils~listenersObj
     *
     * @property {Function} add     Adds all the event listeners to the
     *                              specified element
     * @property {Function} remove  Removes all the event listeners from
     *                              the specified element
     */

    /**
     * Creates functions to add and remove event listeners in a cross-browser
     * compatible way.
     *
     * @param  {tabOverride.utils~handlerObj[]} handlerList  an array of {@link tabOverride.utils~handlerObj handlerObj} objects
     * @return {tabOverride.utils~listenersObj}              a listenersObj object used to add and remove the event listeners
     *
     * @method tabOverride.utils.createListeners
     */
    function createListeners(handlerList) {
        var i,
            len = handlerList.length,
            remove,
            add;

        function loop(func) {
            for (i = 0; i < len; i += 1) {
                func(handlerList[i].type, handlerList[i].handler);
            }
        }

        // use the standard event handler registration method when available
        if (document.addEventListener) {
            remove = function (elem) {
                loop(function (type, handler) {
                    elem.removeEventListener(type, handler, false);
                });
            };
            add = function (elem) {
                // remove listeners before adding them to make sure they are not
                // added more than once
                remove(elem);
                loop(function (type, handler) {
                    elem.addEventListener(type, handler, false);
                });
            };
        } else if (document.attachEvent) {
            // support IE 6-8
            remove = function (elem) {
                loop(function (type, handler) {
                    elem.detachEvent('on' + type, handler);
                });
            };
            add = function (elem) {
                remove(elem);
                loop(function (type, handler) {
                    elem.attachEvent('on' + type, handler);
                });
            };
        }

        return {
            add: add,
            remove: remove
        };
    }

    /**
     * Adds the Tab Override event listeners to the specified element.
     *
     * Hooks: addListeners - passed the element to which the listeners will
     * be added.
     *
     * @param {Element} elem  the element to which the listeners will be added
     *
     * @method tabOverride.utils.addListeners
     */
    function addListeners(elem) {
        executeExtensions('addListeners', [elem]);
        listeners.add(elem);
    }

    /**
     * Removes the Tab Override event listeners from the specified element.
     *
     * Hooks: removeListeners - passed the element from which the listeners
     * will be removed.
     *
     * @param {Element} elem  the element from which the listeners will be removed
     *
     * @method tabOverride.utils.removeListeners
     */
    function removeListeners(elem) {
        executeExtensions('removeListeners', [elem]);
        listeners.remove(elem);
    }


    // Initialize Variables

    listeners = createListeners([
        { type: 'keydown', handler: overrideKeyDown },
        { type: 'keypress', handler: overrideKeyPress }
    ]);

    // get the characters used for a newline
    textareaElem.value = '\n';
    newline = textareaElem.value;
    newlineLen = newline.length;
    textareaElem = null;


    // Public Properties and Methods

    /**
     * Namespace for utility methods
     *
     * @namespace
     */
    tabOverride.utils = {
        executeExtensions: executeExtensions,
        isValidModifierKeyCombo: isValidModifierKeyCombo,
        createListeners: createListeners,
        addListeners: addListeners,
        removeListeners: removeListeners
    };

    /**
     * Namespace for event handler functions
     *
     * @namespace
     */
    tabOverride.handlers = {
        keydown: overrideKeyDown,
        keypress: overrideKeyPress
    };

    /**
     * Adds an extension function to be executed when the specified hook is
     * "fired." The extension function is called for each element and is passed
     * any relevant arguments for the hook.
     *
     * @param  {string}   hook  the name of the hook for which the extension
     *                          will be registered
     * @param  {Function} func  the function to be executed when the hook is "fired"
     * @return {Object}         the tabOverride object
     */
    tabOverride.addExtension = function (hook, func) {
        if (hook && typeof hook === 'string' && typeof func === 'function') {
            if (!hooks[hook]) {
                hooks[hook] = [];
            }
            hooks[hook].push(func);
        }

        return this;
    };

    /**
     * Enables or disables Tab Override for the specified textarea element(s).
     *
     * Hooks: set - passed the current element and a boolean indicating whether
     * Tab Override was enabled or disabled.
     *
     * @param  {Element|Element[]} elems          the textarea element(s) for
     *                                            which to enable or disable
     *                                            Tab Override
     * @param  {boolean}           [enable=true]  whether Tab Override should be
     *                                            enabled for the element(s)
     * @return {Object}                           the tabOverride object
     */
    tabOverride.set = function (elems, enable) {
        var enableFlag,
            elemsArr,
            numElems,
            setListeners,
            attrValue,
            i,
            elem;

        if (elems) {
            enableFlag = arguments.length < 2 || enable;

            // don't manipulate param when referencing arguments object
            // this is just a matter of practice
            elemsArr = elems;
            numElems = elemsArr.length;

            if (typeof numElems !== 'number') {
                elemsArr = [elemsArr];
                numElems = 1;
            }

            if (enableFlag) {
                setListeners = addListeners;
                attrValue = 'true';
            } else {
                setListeners = removeListeners;
                attrValue = '';
            }

            for (i = 0; i < numElems; i += 1) {
                elem = elemsArr[i];
                if (elem && elem.nodeName && elem.nodeName.toLowerCase() === 'textarea') {
                    executeExtensions('set', [elem, enableFlag]);
                    elem.setAttribute('data-taboverride-enabled', attrValue);
                    setListeners(elem);
                }
            }
        }

        return this;
    };

    /**
     * Gets or sets the tab size for all elements that have Tab Override enabled.
     * 0 represents the tab character.
     *
     * @param  {number}        [size]  the tab size
     * @return {number|Object}         the tab size or the tabOverride object
     */
    tabOverride.tabSize = function (size) {
        var i;

        if (arguments.length) {
            if (size && typeof size === 'number' && size > 0) {
                aTab = '';
                for (i = 0; i < size; i += 1) {
                    aTab += ' ';
                }
            } else {
                // size is falsy (0), not a number, or a negative number
                aTab = '\t';
            }
            return this;
        }

        return (aTab === '\t') ? 0 : aTab.length;
    };

    /**
     * Gets or sets the auto indent setting. True if each line should be
     * automatically indented (default = true).
     *
     * @param  {boolean}        [enable]  whether auto indent should be enabled
     * @return {boolean|Object}           whether auto indent is enabled or the
     *                                    tabOverride object
     */
    tabOverride.autoIndent = function (enable) {
        if (arguments.length) {
            autoIndent = enable ? true : false;
            return this;
        }

        return autoIndent;
    };

    /**
     * Gets or sets the tab key combination.
     *
     * @param  {number}        keyCode             the key code of the key to use for tab
     * @param  {string[]}      [modifierKeyNames]  the modifier key names - valid names are
     *                                             'alt', 'ctrl', 'meta', and 'shift'
     * @return {string|Object}                     the current tab key combination or the
     *                                             tabOverride object
     *
     * @method
     */
    tabOverride.tabKey = createKeyComboFunction(function (keyCode) {
        if (!arguments.length) {
            return tabKey;
        }
        tabKey = keyCode;
    }, tabModifierKeys);

    /**
     * Gets or sets the untab key combination.
     *
     * @param  {number}        keyCode             the key code of the key to use for untab
     * @param  {string[]}      [modifierKeyNames]  the modifier key names - valid names are
     *                                             'alt', 'ctrl', 'meta', and 'shift'
     * @return {string|Object}                     the current untab key combination or the
     *                                             tabOverride object
     *
     * @method
     */
    tabOverride.untabKey = createKeyComboFunction(function (keyCode) {
        if (!arguments.length) {
            return untabKey;
        }
        untabKey = keyCode;
    }, untabModifierKeys);
}));

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_minimanew__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _js_minimanew__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_minimanew__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _js_scriptide__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _js_scriptide__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_scriptide__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_taboverride__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _js_taboverride__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_js_taboverride__WEBPACK_IMPORTED_MODULE_2__);




})();

/******/ })()
;
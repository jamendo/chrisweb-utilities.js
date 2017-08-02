(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var errorLogger;
    var utilities;
    (function (utilities) {
        utilities.version = '0.0.4';
        utilities.logFontColor = 'default';
        utilities.logBackgroundColor = 'default';
        utilities.logSpecial = false;
        utilities.logVerbose = true;
        /**
         *
         * html log
         * create a div an insert the messages in div
         * can be usefull on mobile if no other console is available
         *
         * @param {type} logObjects
         * @param {type} logObjectsLength
         * @param {type} logFontColor
         * @param {type} logBackgroundColor
         * @returns {undefined}
         */
        function htmlLog(logObjects, logObjectsLength, logFontColor, logBackgroundColor) {
            // TODO: fix: seems that if logging starts before "domload" some
            // messages get lost
            if (document.getElementById('log') === null) {
                var logDiv = document.createElement('div');
                logDiv.id = 'log';
                logDiv.style.cssText = 'position: absolute; overflow: scroll; left: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 999999; width: 100%; height: 20%; background-color: #fff;';
                document.body.appendChild(logDiv);
            }
            for (var i = 0; i < logObjectsLength; i++) {
                var logSpan = document.createElement('span');
                logSpan.style.cssText = 'color: #' + logFontColor + '; background-color: #' + logBackgroundColor + ';';
                var spanContent = document.createTextNode(logObjects[i]);
                logSpan.appendChild(spanContent);
                document.getElementById('log').appendChild(logSpan);
                var brElement = document.createElement('br');
                document.getElementById('log').appendChild(brElement);
            }
        }
        utilities.htmlLog = htmlLog;
        ;
        /**
         *
         * file log
         * nodejs logging to file
         *
         * @param {type} logObjects
         * @param {type} logObjectsLength
         * @param {type} logFontColor
         * @returns {undefined}
         */
        function fileLog(logObjects, logObjectsLength, logFontColor) {
            try {
                var winston = require('winston');
                for (var i = 0; i < logObjectsLength; i++) {
                    switch (logFontColor) {
                        case 'red':
                            winston.error(logObjects[i]);
                            break;
                        case 'yellow':
                            winston.warn(logObjects[i]);
                            break;
                        default:
                            winston.info(logObjects[i]);
                    }
                }
            }
            catch (e) {
                // winston is not installed
            }
        }
        utilities.fileLog = fileLog;
        ;
        /**
         *
         * log messages
         *
         * @returns {Boolean}
         */
        function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // is console defined, some older IEs don't have a console
            if (typeof (console) === 'undefined') {
                return;
            }
            // extract options and get objects to log
            var logArguments = handleLogArguments(args);
            var logObjects = logArguments.objects;
            var logFontColor = logArguments.fontColor;
            var logBackgroundColor = logArguments.backgroundColor;
            var logObjectsLength = logObjects.length;
            // nodejs or browser mode
            if (typeof (window) === 'undefined') {
                if (typeof (utilities.logVerbose) !== 'undefined'
                    && utilities.logVerbose === true) {
                    // get background and fontColor codes
                    var color = getServerColors(logFontColor, logBackgroundColor);
                    // log each object
                    for (var i_1 = 0; i_1 < logObjectsLength; i_1++) {
                        if (typeof (logObjects[i_1]) === 'string') {
                            console.log(color.background + color.font + logObjects[i_1] + color.reset);
                        }
                        else {
                            console.log(logObjects[i_1]);
                        }
                    }
                    ;
                }
                // log to file if logSpecial is enabled or if the fontColor is red
                if ((typeof (utilities.logSpecial) !== 'undefined' && utilities.logSpecial === true) || logFontColor === 'red') {
                    fileLog(logObjects, logObjectsLength, logFontColor);
                }
            }
            else {
                // get background and fontColor codes
                var color = getClientColors(logFontColor, logBackgroundColor);
                if (typeof (utilities.logVerbose) !== 'undefined'
                    && utilities.logVerbose === true) {
                    // log each object
                    for (var i = 0; i < logObjectsLength; i++) {
                        if (typeof (logObjects[i]) === 'string') {
                            console.log('%c' + logObjects[i], 'background: #' + color.background + '; color: #' + color.font);
                        }
                        else {
                            console.log(logObjects[i]);
                        }
                    }
                    ;
                }
                // log to html if logSpecial is enabled
                if (typeof (utilities.logSpecial) !== 'undefined'
                    && utilities.logSpecial === true) {
                    htmlLog(logObjects, logObjectsLength, color.font, color.background);
                }
            }
        }
        utilities.log = log;
        ;
        /**
         *
         * get the client side (browser) colors
         *
         * @param {type} logFontColor
         * @param {type} logBackgroundColor
         * @returns {_L16.getClientColors.Anonym$2}
         */
        function getClientColors(logFontColor, logBackgroundColor) {
            var colors = {
                red: 'FF0000',
                green: '00FF00',
                yellow: 'FFFF00',
                blue: '0000FF',
                magenta: 'FF00FF',
                cyan: '00FFFF',
                white: 'FFFFFF',
                black: '000000'
            };
            var fontColor;
            var backgroundColor;
            // font color
            if (typeof (logFontColor) === 'undefined' || logFontColor === 'default') {
                fontColor = colors['black'];
            }
            else {
                if (typeof (colors[logFontColor]) !== 'undefined') {
                    fontColor = colors[logFontColor];
                }
                else {
                    throw 'unknown fontColor in utilities console log';
                }
            }
            // background color
            if (typeof (logBackgroundColor) === 'undefined' || logBackgroundColor === 'default') {
                backgroundColor = colors['white'];
            }
            else {
                if (typeof (colors[logBackgroundColor]) !== 'undefined') {
                    backgroundColor = colors[logBackgroundColor];
                }
                else {
                    throw 'unknown fontColor in utilities console log';
                }
            }
            return { font: fontColor, background: backgroundColor };
        }
        ;
        /**
         *
         * get the colors for the backend (server) console
         *
         * @param {type} logFontColor
         * @param {type} logBackgroundColor
         * @returns {_L16.getServerColors.Anonym$2}
         */
        function getServerColors(logFontColor, logBackgroundColor) {
            var backgroundColors = {
                black: '\u001b[40m',
                red: '\u001b[41m',
                green: '\u001b[42m',
                yellow: '\u001b[43m',
                blue: '\u001b[44m',
                magenta: '\u001b[45m',
                cyan: '\u001b[46m',
                white: '\u001b[47m'
            };
            var foregroundColors = {
                black: '\u001b[30m',
                red: '\u001b[31m',
                green: '\u001b[32m',
                yellow: '\u001b[33m',
                blue: '\u001b[34m',
                magenta: '\u001b[35m',
                cyan: '\u001b[36m',
                white: '\u001b[37m'
            };
            var fontColor;
            var backgroundColor;
            // font color
            if (typeof (logFontColor) === 'undefined' || logFontColor === 'default') {
                fontColor = foregroundColors['white'];
            }
            else {
                if (typeof (foregroundColors[logFontColor]) !== 'undefined') {
                    fontColor = foregroundColors[logFontColor];
                }
                else {
                    throw 'unknown font color in utilities console log';
                }
            }
            // background color
            if (typeof (logBackgroundColor) === 'undefined' || logBackgroundColor === 'default') {
                backgroundColor = backgroundColors['black'];
            }
            else {
                if (typeof (backgroundColors[logBackgroundColor]) !== 'undefined') {
                    backgroundColor = backgroundColors[logBackgroundColor];
                }
                else {
                    throw 'unknown background color in utilities console log';
                }
            }
            return { font: fontColor, background: backgroundColor, reset: '\u001b[0m' };
        }
        ;
        /**
         *
         * handle log arguments
         * extract the color infos from the arguments to log
         *
         * @param {type} logArguments
         * @returns {_L16.handleLogArguments.Anonym$2}
         */
        function handleLogArguments(logArguments) {
            var logObjects = [];
            var logFontColor = utilities.logFontColor;
            var logBackgroundColor = utilities.logBackgroundColor;
            var argumentsLength = logArguments.length;
            for (var i = 0; i < argumentsLength; i++) {
                var argument = logArguments[i];
                if (typeof (argument) === 'string') {
                    if (argument.substr(0, 10) === 'fontColor:') {
                        logFontColor = argument.substr(10, argument.length).trim();
                    }
                    else if (argument.substr(0, 16) === 'backgroundColor:') {
                        logBackgroundColor = argument.substr(16, argument.length).trim();
                    }
                    else {
                        logObjects.push(argument);
                    }
                }
                else {
                    logObjects.push(argument);
                }
            }
            return { objects: logObjects, fontColor: logFontColor, backgroundColor: logBackgroundColor };
        }
        ;
        /**
         *
         * returns the timestamp of right now for browser that dont support
         * es5 Date.now
         *
         * @returns {Number}
         */
        function getTimestamp() {
            return new Date().getTime();
        }
        ;
        /**
         *
         * extracts html elements (and their content) from strings
         *
         * @param {string} text
         * @param {boolean} removeTextBetweenTags
         * @returns {string}
         */
        function removeElements(text, removeTextBetweenTags) {
            if (removeTextBetweenTags === void 0) { removeTextBetweenTags = false; }
            if (removeTextBetweenTags === false) {
                // replace single tags
                text = text.replace(/<[^>]*>?/g, '');
            }
            else {
                // replace all tags and whats inside
                text = text.replace(/<[^>]*>[^>]*<\/[^>]*>?/g, '');
                // replace single tags
                text = text.replace(/<[^>]*>?/g, '');
            }
            return text;
        }
        utilities.removeElements = removeElements;
        ;
        /**
         *
         * unescapes a string and uses removeElements to ensure the string does not contain html elements
         *
         * @param {string} rawText
         * @returns {string}
         */
        function safeUnescape(rawText, extendedEscape, myEscapeList) {
            var unEscapeList = {
                // usually you would just escape (unescape) characters that get
                // used in (x)html
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#x27;': "'",
                '&#x60;': '`'
            };
            // by default also use extended list
            if (extendedEscape === undefined || extendedEscape === true) {
                var unEscapeExtendedList = {
                    // but in the case where everything has been encoded lets decode these too
                    '&lsquo;': '‘',
                    '&rsquo;': '’',
                    '&sbquo;': '‚',
                    '&ldquo;': '“',
                    '&rdquo;': '”',
                    '&bdquo;': '„',
                    '&dagger;': '†',
                    '&Dagger;': '‡',
                    '&permil;': '‰',
                    '&lsaquo;': '‹',
                    '&rsaquo;': '›',
                    '&ndash;': '-',
                    '&mdash;': '—',
                    '&nbsp;': ' ',
                    '&iexcl;': '¡',
                    '&cent;': '¢',
                    '&pound;': '£',
                    '&curren;': '¤',
                    '&yen;': '¥',
                    '&brvbar;': '¦',
                    '&brkbar;': '¦',
                    '&sect;': '§',
                    '&uml;': '¨',
                    '&die;': '¨',
                    '&copy;': '©',
                    '&ordf;': 'ª',
                    '&laquo;': '«',
                    '&not;': '¬',
                    '&shy;': ' ',
                    '&reg;': '®',
                    '&macr;': '¯',
                    '&hibar;': '¯',
                    '&deg;': '°',
                    '&plusmn;': '±',
                    '&sup2;': '²',
                    '&sup3;': '³',
                    '&acute;': '´',
                    '&micro;': 'µ',
                    '&para;': '¶',
                    '&middot;': '·',
                    '&cedil;': '¸',
                    '&sup1;': '¹',
                    '&ordm;': 'º',
                    '&raquo;': '»',
                    '&frac14;': '¼',
                    '&frac12;': '½',
                    '&frac34;': '¾',
                    '&iquest;': '¿'
                };
                for (var key in unEscapeExtendedList) {
                    unEscapeList[key] = unEscapeExtendedList[key];
                }
            }
            if (myEscapeList !== undefined) {
                for (var key in myEscapeList) {
                    unEscapeList[key] = myEscapeList[key];
                }
            }
            var escaper = function (match) {
                return unEscapeList[match];
            };
            // regexes for identifying a key that needs to be escaped
            var unEscapeKeys = Object.keys(unEscapeList);
            var source = '(?:' + unEscapeKeys.join('|') + ')';
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            rawText = rawText == null ? '' : '' + rawText;
            var unescapedText = testRegexp.test(rawText) ? rawText.replace(replaceRegexp, escaper) : rawText;
            var text = removeElements(unescapedText, false);
            return text;
        }
        utilities.safeUnescape = safeUnescape;
        ;
        /**
         *
         * returns a universally unique identifier
         *
         * @returns {unresolved}
         */
        function generateUUID() {
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        }
        utilities.generateUUID = generateUUID;
        ;
        /**
         *
         * filters a string
         * removes everything that is a not an alpha or numeric character, plus
         * the characters if any got specified as second argument
         *
         * @param {type} inputString
         * @param {type} specialCharacters
         * @returns {Boolean}
         */
        function filterAlphaNumericPlus(inputString, specialCharacters) {
            if (typeof (inputString) === 'string' && inputString.length > 0) {
                var outputString = void 0;
                if (specialCharacters !== undefined) {
                    var regex = RegExp('[^a-z0-9' + specialCharacters + ']', 'gi');
                    outputString = inputString.replace(regex, '');
                }
                else {
                    outputString = inputString.replace(/[^a-z0-9]/gi, '');
                }
                return outputString;
            }
            return false;
        }
        utilities.filterAlphaNumericPlus = filterAlphaNumericPlus;
        ;
        /**
         *
         * decode uri
         *
         * @param {type} uri
         * @returns {unresolved}
         */
        function decodeUri(uri) {
            var additionToSpace = '/\+/g'; // replace addition symbol with a space
            return decodeURIComponent(uri.replace(additionToSpace, ' '));
        }
        utilities.decodeUri = decodeUri;
        ;
        /**
         *
         * encode uri
         *
         * @param {type} uri
         * @returns {unresolved}
         */
        function encodeUri(uri) {
            return encodeURIComponent(uri);
        }
        utilities.encodeUri = encodeUri;
        ;
        /**
         *
         * find and remove an array entry
         *
         * @param {type} array
         * @param {type} removeMe
         * @returns {undefined}
         */
        function arrayRemove(array, removeMe) {
            var index = array.indexOf(removeMe);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        }
        utilities.arrayRemove = arrayRemove;
        ;
        /**
         *
         * capitalise first letter of a string
         *
         * @param string string
         * @returns {unresolved}
         */
        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        utilities.capitaliseFirstLetter = capitaliseFirstLetter;
        ;
        /**
         *
         * get url parameters
         *
         * @param string query
         * @returns {_L16.utilities@call;decodeUri|Boolean}
         */
        function getUrlParameters(query) {
            if (query === undefined) {
                if (window !== undefined) {
                    query = window.location.search.substring(1);
                }
                else {
                    throw 'you must provide a query to parse';
                }
            }
            var search = /([^&=]+)=?([^&]*)/g;
            var urlParams = {};
            var parameters = search.exec(query);
            if (!!parameters) {
                for (var i = 0; i <= parameters.length; i++) {
                    var parameter = parameters[i];
                    urlParams[decodeUri(parameter[1])] = decodeUri(parameter[2]);
                }
            }
            return urlParams;
        }
        utilities.getUrlParameters = getUrlParameters;
        ;
        /**
         *
         * does a string contain another string
         *
         * @param {type} string
         * @param {type} contains
         * @returns {Boolean}
         */
        function stringContains(string, contains) {
            if (typeof string !== 'string') {
                throw 'input is not a string';
            }
            if (string.indexOf(contains) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        utilities.stringContains = stringContains;
        ;
        /**
         *
         * get the index of a substring in a string with optional nth time it occurs
         *
         * @param {type} string
         * @param {type} substring
         * @param {type} nthTime
         * @returns {unresolved}
         */
        function getSubstringIndex(string, substring, nthTime) {
            var times = 0;
            var index = 0;
            if (nthTime === 0) {
                nthTime = 1;
            }
            while (times < nthTime && index !== -1) {
                index = string.indexOf(substring, index + 1);
                times++;
            }
            return index;
        }
        utilities.getSubstringIndex = getSubstringIndex;
        ;
        /**
         * does the script run on the server
         */
        function isServer() {
            if (typeof (global) === 'object') {
                return true;
            }
            else {
                return false;
            }
        }
        utilities.isServer = isServer;
        ;
        /**
         * does the script run in a client
         */
        function isClient() {
            return !isServer();
        }
        utilities.isClient = isClient;
        ;
        /**
         * replace the placeholder(s) with some value
         */
        function replacePlaceholders(input, replacements) {
            var output = input;
            if (typeof input === 'string' && typeof replacements === 'object') {
                output = input.replace(/\b\w+?\b/g, function replacePlaceHolder(placeholder) {
                    return Object.prototype.hasOwnProperty.call(replacements, placeholder) ? replacements[placeholder] : placeholder;
                });
            }
            return output;
        }
        utilities.replacePlaceholders = replacePlaceholders;
        ;
        /**
         * URL utility to get a parameter by name from an URL
         */
        function getUrlParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            var results = regex.exec(url);
            if (!results) {
                return null;
            }
            if (!results[2]) {
                return '';
            }
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        utilities.getUrlParameterByName = getUrlParameterByName;
        /**
         * URL utility to replace a given parameter
         */
        function replaceUrlParameter(url, paramName, paramValue) {
            var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
            if (url.search(pattern) >= 0) {
                return url.replace(pattern, '$1' + paramValue + '$2');
            }
            return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
        }
        utilities.replaceUrlParameter = replaceUrlParameter;
    })(utilities = exports.utilities || (exports.utilities = {}));
    ;
    exports.default = utilities;
});

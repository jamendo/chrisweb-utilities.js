'use strict';

var errorLogger;

export module utilities {
    export const version: string = '0.0.4';
    export const logFontColor: string = 'default';
    export const logBackgroundColor: string = 'default';
    export const logSpecial: boolean = false;
    export const logVerbose: boolean = true;

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
    export function htmlLog(logObjects: Array<string>, logObjectsLength: number, logFontColor: string, logBackgroundColor: string) {

        // TODO: fix: seems that if logging starts before "domload" some
        // messages get lost

        if (document.getElementById('log') === null) {

            const logDiv = document.createElement('div');

            logDiv.id = 'log';

            logDiv.style.cssText = 'position: absolute; overflow: scroll; left: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 999999; width: 100%; height: 20%; background-color: #fff;';

            document.body.appendChild(logDiv);

        }

        for (let i = 0; i < logObjectsLength; i++) {

            const logSpan = document.createElement('span');

            logSpan.style.cssText = 'color: #' + logFontColor + '; background-color: #' + logBackgroundColor + ';';

            const spanContent = document.createTextNode(logObjects[i]);

            logSpan.appendChild(spanContent);

            document.getElementById('log')!.appendChild(logSpan);

            const brElement = document.createElement('br');

            document.getElementById('log')!.appendChild(brElement);

        }

    };

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
    export function fileLog(logObjects: Array<string>, logObjectsLength: number, logFontColor: string): void {

        try {

            const winston = require('winston');

            for (let i = 0; i < logObjectsLength; i++) {

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

        } catch (e) {

            // winston is not installed

        }

    };

    /**
     * 
     * log messages
     * 
     * @returns {Boolean}
     */
    export function log(...args: Array<any>): void {

        // is console defined, some older IEs don't have a console
        if (typeof (console) === 'undefined') {

            return;

        }

        // extract options and get objects to log
        const logArguments = handleLogArguments(args);

        const logObjects = logArguments.objects;
        const logFontColor = logArguments.fontColor;
        const logBackgroundColor = logArguments.backgroundColor;

        const logObjectsLength = logObjects.length;

        // nodejs or browser mode
        if (typeof (window) === 'undefined') {

            if (typeof (utilities.logVerbose) !== 'undefined'
                && utilities.logVerbose === true) {

                // get background and fontColor codes
                const color = getServerColors(logFontColor, logBackgroundColor);

                // log each object
                for (let i = 0; i < logObjectsLength; i++) {

                    if (typeof (logObjects[i]) === 'string') {
                        console.log(color.background + color.font + logObjects[i] + color.reset);
                    } else {
                        console.log(logObjects[i]);
                    }

                };

            }

            // log to file if logSpecial is enabled or if the fontColor is red
            if ((typeof (utilities.logSpecial) !== 'undefined' && utilities.logSpecial === true) || logFontColor === 'red') {

                fileLog(logObjects, logObjectsLength, logFontColor);

            }

        } else {

            // get background and fontColor codes
            const color = getClientColors(logFontColor, logBackgroundColor);

            if (typeof (utilities.logVerbose) !== 'undefined'
                && utilities.logVerbose === true) {

                // log each object
                for (var i = 0; i < logObjectsLength; i++) {

                    if (typeof (logObjects[i]) === 'string') {
                        console.log('%c' + logObjects[i], 'background: #' + color.background + '; color: #' + color.font);
                    } else {
                        console.log(logObjects[i]);
                    }

                };

            }

            // log to html if logSpecial is enabled
            if (typeof (utilities.logSpecial) !== 'undefined'
                && utilities.logSpecial === true) {

                htmlLog(logObjects, logObjectsLength, color.font, color.background);

            }

        }

    };

    /**
     * 
     * get the client side (browser) colors
     * 
     * @param {type} logFontColor
     * @param {type} logBackgroundColor
     * @returns {_L16.getClientColors.Anonym$2}
     */
    function getClientColors(logFontColor: string, logBackgroundColor: string): {font: string, background: string} {

        const colors: {[color: string]: string} = {
            red: 'FF0000',
            green: '00FF00',
            yellow: 'FFFF00',
            blue: '0000FF',
            magenta: 'FF00FF',
            cyan: '00FFFF',
            white: 'FFFFFF',
            black: '000000'
        };

        let fontColor;
        let backgroundColor;

        // font color
        if (typeof (logFontColor) === 'undefined' || logFontColor === 'default') {

            fontColor = colors['black'];

        } else {

            if (typeof (colors[logFontColor]) !== 'undefined') {
                fontColor = colors[logFontColor];
            } else {
                throw 'unknown fontColor in utilities console log';
            }

        }

        // background color
        if (typeof (logBackgroundColor) === 'undefined' || logBackgroundColor === 'default') {

            backgroundColor = colors['white'];

        } else {

            if (typeof (colors[logBackgroundColor]) !== 'undefined') {
                backgroundColor = colors[logBackgroundColor];
            } else {
                throw 'unknown fontColor in utilities console log';
            }

        }

        return { font: fontColor, background: backgroundColor };

    };

    /**
     * 
     * get the colors for the backend (server) console
     * 
     * @param {type} logFontColor
     * @param {type} logBackgroundColor
     * @returns {_L16.getServerColors.Anonym$2}
     */
    function getServerColors(logFontColor: string, logBackgroundColor: string): {font: string, background: string, reset: string} {

        const backgroundColors: {[color: string]: string} = {
            black: '\u001b[40m',
            red: '\u001b[41m',
            green: '\u001b[42m',
            yellow: '\u001b[43m',
            blue: '\u001b[44m',
            magenta: '\u001b[45m',
            cyan: '\u001b[46m',
            white: '\u001b[47m'
        };


        const foregroundColors: {[color: string]: string} = {
            black: '\u001b[30m',
            red: '\u001b[31m',
            green: '\u001b[32m',
            yellow: '\u001b[33m',
            blue: '\u001b[34m',
            magenta: '\u001b[35m',
            cyan: '\u001b[36m',
            white: '\u001b[37m'
        };

        let fontColor;
        let backgroundColor;

        // font color
        if (typeof (logFontColor) === 'undefined' || logFontColor === 'default') {

            fontColor = foregroundColors['white'];

        } else {

            if (typeof (foregroundColors[logFontColor]) !== 'undefined') {
                fontColor = foregroundColors[logFontColor];
            } else {
                throw 'unknown font color in utilities console log';
            }

        }

        // background color
        if (typeof (logBackgroundColor) === 'undefined' || logBackgroundColor === 'default') {

            backgroundColor = backgroundColors['black'];

        } else {

            if (typeof (backgroundColors[logBackgroundColor]) !== 'undefined') {
                backgroundColor = backgroundColors[logBackgroundColor];
            } else {
                throw 'unknown background color in utilities console log';
            }

        }

        return { font: fontColor, background: backgroundColor, reset: '\u001b[0m' };

    };

    /**
     * 
     * handle log arguments
     * extract the color infos from the arguments to log
     * 
     * @param {type} logArguments
     * @returns {_L16.handleLogArguments.Anonym$2}
     */
    function handleLogArguments(logArguments: Array<string>): {objects: Array<string>, fontColor: string, backgroundColor: string} {

        const logObjects: Array<string> = [];

        let logFontColor = utilities.logFontColor;
        let logBackgroundColor = utilities.logBackgroundColor;

        const argumentsLength = logArguments.length;

        for (let i = 0; i < argumentsLength; i++) {

            var argument = logArguments[i];

            if (typeof (argument) === 'string') {

                if (argument.substr(0, 10) === 'fontColor:') {
                    logFontColor = argument.substr(10, argument.length).trim();
                } else if (argument.substr(0, 16) === 'backgroundColor:') {
                    logBackgroundColor = argument.substr(16, argument.length).trim();
                } else {
                    logObjects.push(argument);
                }

            } else {
                logObjects.push(argument);
            }

        }

        return { objects: logObjects, fontColor: logFontColor, backgroundColor: logBackgroundColor };

    };

    /**
     * 
     * returns the timestamp of right now for browser that dont support
     * es5 Date.now
     * 
     * @returns {Number}
     */
    function getTimestamp(): number {

        return new Date().getTime();

    };

    /**
     * 
     * extracts html elements (and their content) from strings
     * 
     * @param {string} text
     * @param {boolean} removeTextBetweenTags
     * @returns {string}
     */
    export function removeElements(text: string, removeTextBetweenTags: boolean = false): string {

        if (removeTextBetweenTags === false) {

            // replace single tags
            text = text.replace(/<[^>]*>?/g, '');

        } else {

            // replace all tags and whats inside
            text = text.replace(/<[^>]*>[^>]*<\/[^>]*>?/g, '');

            // replace single tags
            text = text.replace(/<[^>]*>?/g, '');

        }

        return text;

    };

    /**
     * 
     * unescapes a string and uses removeElements to ensure the string does not contain html elements
     * 
     * @param {string} rawText
     * @returns {string}
     */
    export function safeUnescape(rawText: string, extendedEscape?: boolean, myEscapeList?: { [key: string]: string }): string {

        const unEscapeList: {[key: string]: string} = {
            // usually you would just escape (unescape) characters that get
            // used in (x)html
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#x27;': "'",
            '&#x60;': '`'
        }

        // by default also use extended list
        if (extendedEscape === undefined || extendedEscape === true) {

            const unEscapeExtendedList: {[key: string]: string} = {
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

            for (let key in unEscapeExtendedList) {
                unEscapeList[key] = unEscapeExtendedList[key];
            }

        }

        if (myEscapeList !== undefined) {

            for (let key in myEscapeList) {
                unEscapeList[key] = myEscapeList[key];
            }

        }

        const escaper = function (match: string) {
            return unEscapeList[match];
        };

        // regexes for identifying a key that needs to be escaped
        const unEscapeKeys = Object.keys(unEscapeList);
        const source = '(?:' + unEscapeKeys.join('|') + ')';
        const testRegexp = RegExp(source);
        const replaceRegexp = RegExp(source, 'g');

        rawText = rawText == null ? '' : '' + rawText;

        const unescapedText = testRegexp.test(rawText) ? rawText.replace(replaceRegexp, escaper) : rawText;

        const text = removeElements(unescapedText, false);

        return text;

    };

    /**
     * 
     * returns a universally unique identifier
     * 
     * @returns {unresolved}
     */
    export function generateUUID(): string {

        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

        // http://www.ietf.org/rfc/rfc4122.txt
        const s: Array<any> = [];
        const hexDigits = "0123456789abcdef";

        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }

        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");

        return uuid;

    };

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
    export function filterAlphaNumericPlus(inputString: string, specialCharacters: string): string | boolean {

        if (typeof (inputString) === 'string' && inputString.length > 0) {

            let outputString;

            if (specialCharacters !== undefined) {

                const regex = RegExp('[^a-z0-9' + specialCharacters + ']', 'gi');

                outputString = inputString.replace(regex, '');

            } else {
                outputString = inputString.replace(/[^a-z0-9]/gi, '');
            }

            return outputString;

        }

        return false;

    };

    /**
     * 
     * decode uri
     * 
     * @param {type} uri
     * @returns {unresolved}
     */
    export function decodeUri(uri: string): string {

        const additionToSpace = '/\+/g';  // replace addition symbol with a space

        return decodeURIComponent(uri.replace(additionToSpace, ' '));

    };

    /**
     * 
     * encode uri
     * 
     * @param {type} uri
     * @returns {unresolved}
     */
    export function encodeUri(uri: string): string {

        return encodeURIComponent(uri);

    };

    /**
     * 
     * find and remove an array entry
     * 
     * @param {type} array
     * @param {type} removeMe
     * @returns {undefined}
     */
    export function arrayRemove<T>(array: Array<T>, removeMe: T): Array<T> {

        const index = array.indexOf(removeMe);

        if (index > -1) {
            array.splice(index, 1);
        }

        return array;

    };

    /**
     * 
     * capitalise first letter of a string
     * 
     * @param string string
     * @returns {unresolved}
     */
    export function capitaliseFirstLetter(string: string): string {

        return string.charAt(0).toUpperCase() + string.slice(1);

    };

    /**
     * 
     * get url parameters
     * 
     * @param string query
     * @returns {_L16.utilities@call;decodeUri|Boolean}
     */
    export function getUrlParameters(query: string): object {

        if (query === undefined) {

            if (window !== undefined) {
                query = window.location.search.substring(1);
            } else {
                throw 'you must provide a query to parse';
            }

        }

        const search = /([^&=]+)=?([^&]*)/g;
        const urlParams: {[key: string]: string} = {};
        const parameters = search.exec(query);

        if (!!parameters) {
            for (let i = 0; i <= parameters.length; i++) {

                const parameter = parameters[i];

                urlParams[decodeUri(parameter[1])] = decodeUri(parameter[2]);

            }
        }

        return urlParams;

    };

    /**
     * 
     * does a string contain another string
     * 
     * @param {type} string
     * @param {type} contains
     * @returns {Boolean}
     */
    export function stringContains(string: string, contains: string): boolean {

        if (typeof string !== 'string') {
            throw 'input is not a string';
        }

        if (string.indexOf(contains) > -1) {
            return true;
        } else {
            return false;
        }

    };

    /**
     * 
     * get the index of a substring in a string with optional nth time it occurs
     * 
     * @param {type} string
     * @param {type} substring
     * @param {type} nthTime
     * @returns {unresolved}
     */
    export function getSubstringIndex(string: string, substring: string, nthTime: number): number {

        let times = 0;
        let index = 0;

        if (nthTime === 0) {
            nthTime = 1;
        }

        while (times < nthTime && index !== -1) {

            index = string.indexOf(substring, index + 1);
            times++;

        }

        return index;

    };

    /**
     * does the script run on the server
     */
    export function isServer(): boolean {

        if (typeof (global) === 'object') {
            return true;
        } else {
            return false;
        }

    };

    /**
     * does the script run in a client
     */
    export function isClient(): boolean {
        return !isServer();
    };

    /**
     * replace the placeholder(s) with some value
     */
    export function replacePlaceholders(input: string, replacements: {[key: string]: string}): string {

        var output = input;

        if (typeof input === 'string' && typeof replacements === 'object') {

            output = input.replace(/\b\w+?\b/g, function replacePlaceHolder(placeholder) {
                return Object.prototype.hasOwnProperty.call(replacements, placeholder) ? replacements[placeholder] : placeholder;
            });

        }

        return output;

    };

    /**
     * URL utility to get a parameter by name from an URL
     */
    export function getUrlParameterByName(name: string, url?: string): string|null {

        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");

        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));

    }

    /**
     * URL utility to replace a given parameter
     */
    export function replaceUrlParameter(url: string, paramName: string, paramValue: string): string {

        const pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');

        if (url.search(pattern) >= 0) {
            return url.replace(pattern, '$1' + paramValue + '$2');
        }

        return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;

    }

};

export default utilities;

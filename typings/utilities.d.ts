export declare module utilities {
    const version: string;
    const logFontColor: string;
    const logBackgroundColor: string;
    const logSpecial: boolean;
    const logVerbose: boolean;
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
    function htmlLog(logObjects: Array<string>, logObjectsLength: number, logFontColor: string, logBackgroundColor: string): void;
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
    function fileLog(logObjects: Array<string>, logObjectsLength: number, logFontColor: string): void;
    /**
     *
     * log messages
     *
     * @returns {Boolean}
     */
    function log(...args: Array<any>): void;
    /**
     *
     * extracts html elements (and their content) from strings
     *
     * @param {string} text
     * @param {boolean} removeTextBetweenTags
     * @returns {string}
     */
    function removeElements(text: string, removeTextBetweenTags?: boolean): string;
    /**
     *
     * unescapes a string and uses removeElements to ensure the string does not contain html elements
     *
     * @param {string} rawText
     * @returns {string}
     */
    function safeUnescape(rawText: string, extendedEscape?: boolean, myEscapeList?: {
        [key: string]: string;
    }): string;
    /**
     *
     * returns a universally unique identifier
     *
     * @returns {unresolved}
     */
    function generateUUID(): string;
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
    function filterAlphaNumericPlus(inputString: string, specialCharacters: string): string | boolean;
    /**
     *
     * decode uri
     *
     * @param {type} uri
     * @returns {unresolved}
     */
    function decodeUri(uri: string): string;
    /**
     *
     * encode uri
     *
     * @param {type} uri
     * @returns {unresolved}
     */
    function encodeUri(uri: string): string;
    /**
     *
     * find and remove an array entry
     *
     * @param {type} array
     * @param {type} removeMe
     * @returns {undefined}
     */
    function arrayRemove<T>(array: Array<T>, removeMe: T): Array<T>;
    /**
     *
     * capitalise first letter of a string
     *
     * @param string string
     * @returns {unresolved}
     */
    function capitaliseFirstLetter(string: string): string;
    /**
     *
     * get url parameters
     *
     * @param string query
     * @returns {_L16.utilities@call;decodeUri|Boolean}
     */
    function getUrlParameters(query: string): object;
    /**
     *
     * does a string contain another string
     *
     * @param {type} string
     * @param {type} contains
     * @returns {Boolean}
     */
    function stringContains(string: string, contains: string): boolean;
    /**
     *
     * get the index of a substring in a string with optional nth time it occurs
     *
     * @param {type} string
     * @param {type} substring
     * @param {type} nthTime
     * @returns {unresolved}
     */
    function getSubstringIndex(string: string, substring: string, nthTime: number): number;
    /**
     * does the script run on the server
     */
    function isServer(): boolean;
    /**
     * does the script run in a client
     */
    function isClient(): boolean;
    /**
     * replace the placeholder(s) with some value
     */
    function replacePlaceholders(input: string, replacements: {
        [key: string]: string;
    }): string;
    /**
     * URL utility to get a parameter by name from an URL
     */
    function getUrlParameterByName(name: string, url?: string): string | null;
    /**
     * URL utility to replace a given parameter
     */
    function replaceUrlParameter(url: string, paramName: string, paramValue: string): string;
}
export default utilities;

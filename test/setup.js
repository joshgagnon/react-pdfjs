var jsdom = require('jsdom');

global.window = new jsdom.JSDOM('<!doctype html><html><body></body></html>').window;
global.document = global.window.document;
global.navigator = { userAgent: 'node' };
global.PDFJS = {};
global.URL = require('url-parse');
global.XMLHttpRequest = require('xhr2');
global.HTMLElement = global.window.HTMLElement;
global.Element = global.window.Element;
global.history = global.window.history;
// A family of jQuery plugins with custom link selectors and useful link modifiers.
// These help with creating consistent markup for links to downloadable files, offsite
// links, etc., that can show details like file size and file type.
//
// The plugin is wrapped up in an IIFE. The argument factory is a function invoked
// in one of three ways (depending on the environment) to register the plugin with jQuery.
; (function(factory) {

	// Register as a module in a module environment, or as a plain jQuery
	// plugin in a bare environment.
	if (typeof module === "object" && typeof module.exports === "object") {
		// CommonJS environment
		factory(require("jquery"));
	}
	else if (typeof define === 'function' && define.amd) {
		// AMD environment. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Old-fashioned browser globals
		factory(jQuery);
	}
} (function($) {

	// Selector for off-site links
	// Usage: $("div.main a:external")...
	$.expr[':'].external = function(obj) {
		return (obj.hostname != location.hostname) && (obj.protocol == 'http:' || obj.protocol == 'https:');
	};

	// Selector for on-site links
	// Usage: $("div.main a:internal")...
	$.expr[':'].internal = function(obj) {
		return obj.hostname == location.hostname && (obj.protocol == 'http:' || obj.protocol == 'https:');
	};

	// Selector for email addresses
	// Usage: $("div.main a:email")...
	$.expr[':'].email = function(obj) {
		return obj.protocol === "mailto:";
	};

	// Selects on-site links whose path starts with a given string, like '/documents/'
	// Usage: $("div.main a:pathStartsWith(/documents/)")...
	// Notice: no quotes around the argument
	$.expr[':'].pathStartsWith = function(elem, i, argument) {
		var pattern = argument[3];
		var re = new RegExp('^' + regexEscape(pattern), "i");
		return ((elem.hostname === location.hostname) && (properPathname(elem.pathname).match(re) != null));
	};

	// Selects on-site links whose path ends with a given string, like '.pdf'
	// Usage: $("div.main a:pathEndsWith(.pdf)")...
	// Notice: no quotes around the argument
	$.expr[':'].pathEndsWith = function(elem, i, argument) {
		var pattern = argument[3];
		var re = new RegExp(regexEscape(pattern) + '$', "i");
		return ((elem.hostname === location.hostname) && (properPathname(elem.pathname).match(re) != null));
	};

	// Selects on-site links whose path contains a given string, like 'whazzup'.
	// Usage: $("div.main a:pathContains(whazzup)")...
	// Notice: no quotes around the argument
	$.expr[':'].pathContains = function(elem, i, argument) {
		var pattern = argument[3];
		var re = new RegExp(regexEscape(pattern), "i");
		return ((elem.hostname === location.hostname) && (properPathname(elem.pathname).match(re) != null));
	};

	// Regular expression to match a file extension (. followed by 1-6 characters).
	var extensionExpression = /\.([a-z0-9]{1,6})$/;

	// Adds a class to links corresponding to their file extensions.
	// Applying to a link with href="somefile.pdf" will add the class "pdf".
    // The class will always be lowercase. Optionally, a map dicitonary object
	// or function can be supplied to translate from the extension to the
	// actual class name. 
	$.fn.addExtensionClass = function(extmap) {
		
		var map;
		
		// Create the extension-to-class mapping function
		if (typeof extmap === 'object') {
			// classmap is a dictionary object
			map = function(ext) {
				if (ext in extmap) 
					return extmap[ext];
				else
					return ext;
			};
		}
		else if (typeof extmap === 'function') {
			// Use supplied function
			map = extmap;
		}
		else {
			// No argument (or invalid). Identity function
			map = function(ext) { return ext; };
		}
		
		// Apply the extension-to-class map to each element
		this.each(function() {
			var match = this.href.toLowerCase().match(extensionExpression);
			if (match != null) {
				var ext = match[1];
				$(this).addClass(map(ext));
			}
		});
		return this;
	};

	// Make link open in new window
	$.fn.openNewWindow = function() {
		this.attr('target', '_blank');
		return this;
	};

    // Iterate a collection, and for links, determine the extension
    // of the URL. Then invoke a callback with a data object
    // containing the extension
    $.fn.eachExtension = function(callback) {
      this.each(function(index) {
          
        // Determine the extension
        var match = this.href.toLowerCase().match(extensionExpression);
        if (match != null) {
            var extension = match[1];
            var data = {
                index: index,
                ext: extension,
                EXT: extension.toUpperCase()
            };
            
            // Invoke callback with data
            callback.call(this, data);
        }         
      });
    };
    
	// Iterates a collection of elements (presumed to be links). For each, fetch metadata for
    // the link via a HEAD request, and invoke a callback with the data. The callback can
    // modify the link or add markup incorporating the metadata.
	// The supplied success callback is invoked with an object containing the file information,
	// with context (this) equal to the link object. If the request fails, the fail callback is
	// invoked instead.
	$.fn.eachMetadata = function(success, fail) {
		this.each(function() {
			// Assure same origin to prevent whatever happens when it's not.
			if (this.hostname !== location.hostname)
				return;

			var link = this;
			var url = this.href;

			// Get file extension from end of URL
			var match = url.match(extensionExpression);
			var extension = match == null ? '' : match[1];

			var linkInfo = {
				ext: extension,
				EXT: extension.toUpperCase()
			};

			// Issue Ajax HEAD request. This gets all the interesting
			// file attributes, but doesn't transfer the file contents.
			$.ajax(url, {
				method: "HEAD",
				timeout: 3000,
				context: link
			})
				.done(function(data, textStatus, jqxhr) {
					var size = jqxhr.getResponseHeader("Content-Length");
					var rawType = jqxhr.getResponseHeader("Content-Type");
					linkInfo.size = size;
					linkInfo.formattedSize = htmlFormattedSize(size, { decimalPlaces: 1 });
					linkInfo.rawType = rawType;
					linkInfo.mimeType = rawType.split(';')[0];
					success.call(link, linkInfo);
				})
				.fail(function(jqxhr, textStatus) {
					if (fail) {
						linkInfo.status = jqxhr.status;
						linkInfo.textStatus = textStatus;
						fail.call(link, linkInfo);
					}
				});
		});
		return this;
	};

	// Returns a formated file size as an HTML snippet.
	var htmlFormattedSize = function(bytes, options) {
		options = $.extend({
			suffixes: ['byte', 'bytes', '<abbr title="kilobytes">KB</abbr>', '<abbr title="megabytes">MB</abbr>', '<abbr title="gigabytes">GB</abbr>'],
			decimalPlaces: 2,
			unknown: 'Size unknown'
		}, options || {});
		var b = parseInt(bytes, 10);
		if (isNaN(b)) { return options.unknown; }
		if (b === 0) { return '0 ' + options.suffixes[0]; }
		if (b == 1) { return '1 ' + options.suffixes[0]; }
		if (b < 1024) { return b.toFixed(0) + ' ' + options.suffixes[1]; }
		if (b < 1048576) { return (b / 1024).toFixed(options.decimalPlaces) + ' ' + options.suffixes[2]; }
		if (b < 1073741824) { return (b / 1048576).toFixed(options.decimalPlaces) + ' ' + options.suffixes[3]; }
		else { return (b / 1073741824).toFixed(options.decimalPlaces) + ' ' + options.suffixes[4]; }
	};

	// Escape special characters in a regular expression specification
	var regexEscapeExpr = new RegExp("[-/\\^$*+?.()|[\]{}]", "g");
	var regexEscape = function(s) {
		return s.replace(regexEscapeExpr, '\\$&');
	};

	// Element pathname should start with a / character, but on buggy browsers
	// it does not.  This adds a leading / if it's missing.
	var properPathname = function(pathname) {
		if (pathname.charAt(0) === '/')
			return pathname;

		return '/' + pathname;
	};
}));
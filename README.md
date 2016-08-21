# jquery.link-decorators

This is a family of jQuery plugins with custom link selectors and useful link modifiers.
These help with creating consistent, accessible markup for links to downloadable files, offsite
links, etc., that can show details like file size and file type, or enforce appropriate link targets.
For example, links to offsite locations can be forced to open in a new window, regardless of the
static markup.

This is especially useful on a CMS system, where there are multiple authors who may not be knowlegeable about
markup, to enforce standards that improve usability and accessibility.


## Getting Started
To use the plugin, include a reference to the file `dist/jquery.link-decorators.js` or `dist/jquery.link-decorators.min.js`
in your page, after referencing jQuery itself.

The plugin is packaged as an NPM module, but Node.js is not required to use the plugin. It's a standard jQuery plugin,
deployed with NPM because that is the form that the jQuery project encourages.

The files `/demo/demo.html` and `/demo/demo-fa` show simple examples of using the plugin.

### Link Selectors
**External link selector**

`jQuery("a:external")`

Selects links to external locations, meaning links with a hostname different than the current location.

**Internal link selector**

`jQuery("a:internal")`

Selects internal links, where the hostname is the same as the current location.

**Email link selector**

`jQuery("a:mailto")`

Selects links to email addresses, where the protocol is `mailto`.

**Path starts with selector**

`jQuery("a:pathStartsWith(/download/)")`

Selects links where the path starts with the given argument. Note that there are no quotes around the argument.

**Path ends with selector**

`jQuery("a:pathEndsWith(.pdf)")`

Selects links where the path ends with the given argument. Note that there are no quotes around the argument.

**Path contains selector**

`jQuery("a:pathContains(something)")`

Selects links where the path contains the given argument. Note that there are no quotes around the argument.

### Link Modifiers

**.addExtensionClass**

Adds a class to a link corresponding to the file extension of the target. For example, a link to a `.pdf` file
will have the class `pdf` added to it. An optional argument can map from the extension to another
value.

For purposes of this operation, a link is considered to have an extension when the URL ends with a
dot followed by 1-6 alphanumeric characters. Links whose URL does not match this pattern are
unmodified.

With no argument supplied, the extension itself (not including the dot) is used as the class name.
If an object is supplied, it is treated as a dictionary. If it has a property corresponding to the
extension, the value of the property is used as the class name. If a function is supplied, it will
be invoked with the extension, and the result will be used as the class.

With no argument: `jQuery("a:pathStartsWith(/download/).addExtensionClass();`

With a dictionary object:
```
var map = { pdf: "pdf-file", txt: "text-file" };
jQuery("a:pathStartsWith(/download/).addExtensionClass(map);
```

With a function:
```
var map = function(ext) {
	return ext + "-file";
};
jQuery("a:pathStartsWith(/download/).addExtensionClass(map);
```

**.openNewWindow**

Causes links to open in a new window. 

`jQuery("a:pathStartsWith(/download/)").openNewWindow();`

**.decorate**
	
Fetch the metadata corresponding to a link (file size, MIME type, etc.) and invoke a callback with the information.
Typically the callback will add some markup that includes the metadata, such as file size and MIME type.
The context (value of the `this` keyword) for the callback is the link element.
The metadata is obtained by issuing a `HEAD` request, and packaging the results into a simple data object with
the following properties:
* `ext`: The file extension as returned from the request
* `EXT`: The file extension in uppercase
* `size`: The file size, in bytes
* `formattedSize`: The file size, formatted as an HTML snippet, with units of bytes, KB, MB, or GB.
* `rawType`: The contents of the `Content-Type` header
* `mimeType`: The MIME type, obtained from the `Content-Type` header

An optional second callback will be invoked if the request fails. This could be used to add an unhappy style to a broken link.

```
jQuery("a:pathStartsWith(/download/)")
	.decorate(function (info) { $(this).append("<span class='popup'>[" + info.EXT + ": " + info.formattedSize + "]</span>") });
```

### Common uses:
Make off-site links in the main div open in a new window, and decorate with
some popup text (the popup effect relies on appropriate CSS, not shown here).
```
$("div.main a:external")
.openNewWindow()
.append("<span class='popup'>Opens in new window</span>")});
```

Give links to the documents folder `document` class, and a class for the file extension,
show the file type and size in a popup, and open in a new window.
```
$("div.main a:pathStartsWith(/documents/)")
	.addClass("document")
	.addExtensionClass()
	.openNewWindow()
	.decorate(function (info) {
		$(this).append("<span class='popup'>[" + info.EXT + ": " + info.formattedSize + "]</span>")
	});
```

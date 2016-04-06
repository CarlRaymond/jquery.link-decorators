# jquery.link-decorators

A family of jQuery plugins with custom link selectors and useful link modifiers.
These help with creating consistent markup for links to downloadable files, offsite
links, etc., that can show details like file size and file type. With the help of some
CSS styling, these details can be displayed in popup windows.

This is especially useful on a CMS system, to standardize markup and improve usability.

## Link Selectors
### External link selector
`jQuery("a:external")`

Selects links to external locations, meaning links with a hostname different than the current location.

### Internal link selector
`jQuery("a:internal")`

Selects internal links, where the hostname is the same as the current location.

### Email link selector
`jQuery("a:mailto")`

Selects links to email addresses, where the protocol is `mailto`

### Path start with selector
`jQuery("a:pathStartsWith(/download/)")`

Selects links where the path starts with the given argument. Note that there are no quotes around the argument.

### Path ends with selector
`jQuery("a:pathEndsWith(.pdf)")`

Selects links where the path ends with the given argument. Note that there are no quotes around the argument.

### Path contains selector
`jQuery("a:pathContains(something)")`

Selects links where the path contains the given argument. Note that there are no quotes around the argument.

## Link Modifiers

### .addClassForExtension
Adds a class to a link corresponding to the file extension of the target. For example, a link to a `.pdf` file
will have the class `pdf` added to it.

`jQuery("a:pathStartsWith(/download/).addClassForExtension();`

### .openNewWindow
Causes links to open in a new window. 

`jQuery("a:pathStartsWith(/download/)").openNewWindow();`

### .getFileInfo
Fetch the metadata corresponding to a link (file size, MIME type, etc.) and invoke a callback with the information.
Typically the callback will add some markup that includes the metadata. The context (value of the `this` keyword)
for the callback is the link element.
The metadata is obtained by issuing a `HEAD` request, and includes the following properties:
* `ext`: The file extension
* `EXT`: The file extension in uppercase
* `size`: The file size, in bytes
* `formattedSize': The file size, formatted as an HTML snippet, with units of bytes, KB, MB, or GB.
* `rawType`: The contents of the `Content-Type` header
* `mimeType`: The MIME type, obtained from the `Content-Type` header

An optional second callback will be invoked if the request fails. This could be used to add a style to a broken link.

```
jQuery("a:pathStartsWith(/download/)")
	.getFileInfo(function (info) { $(this).append("<span class='popup'>[" + info.EXT + ": " + info.formattedSize + "]</span>") });
```

## Common uses:
Make off-site links in the main div open in a new window, and decorate with
some popup text (relies on CSS).
```
$("div.main a:external")
.openNewWindow()
.append("<span class='popup'>Opens in new window</span>")});
```

Give links to the documents folder `document` class, and a class for the file extension,
and show the file type and size in a popup.
```
$("div.main a:pathStartsWith(/documents/)")
.addClass("document")
.addClassForExtension()
.openNewWindow()
.getFileInfo(function (info) { $(this).append("<span class='popup'>[" + info.EXT + ": " + info.formattedSize + "]</span>") });
```

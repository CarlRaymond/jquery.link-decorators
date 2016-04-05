# jquery.link-decorators

**Pre-Release**
*This plugin is still under development. Come back later.*

A family of jQuery plugins with custom link selectors and useful link modifiers.
These help with creating consistent markup for links to downloadable files, offsite
links, etc., that can show details like file size and file type. With the help of some
CSS styling, these details can be displayed in popup windows.

This is especially useful on a CMS system, to standardize markup and improve usability.

## Common uses:
Make off-site link in the main div open in a new window, and decorate with
some popup text (relies on CSS).
```
$("div.main a:external")
.openNewWindow()
.append("<span class='popup'>Opens in new window</span>")});
```

Give document download links the "document" class, and a class for the file extension,
and show the file type and size in a popup.
```
$("div.main a:pathStartsWith(/documents/)")
.addClass("document")
.addClassForExtension()
.openNewWindow()
.getFileInfo(function (info) { $(this).append("<span class='popup'>[" + info.EXT + ": " + info.formattedSize + "]</span>") });
```

QUnit.test("a:internal selects internal link", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is <a class='internal' href='/test/documents/plain.txt'>an internal link</a>.</p>");

    var set = $("a:internal", fixture);
    assert.equal(set.length, 1);
});

QUnit.test("a:internal does not select external link", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is <a class='external' href='http://www.google.com'>an external link</a>.</p>");

    var set = $("a:internal", fixture);
    assert.equal(set.length, 0);
});

QUnit.test("a:external selects external link", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is <a class='external' href='http://www.google.com'>an external link</a>.</p>");

    var set = $("a:external", fixture);
    assert.equal(set.length, 1);
});

QUnit.test("a:external does not select internal link", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is <a class='internal' href='/test/documents/plain.txt'>an internal link</a>.</p>");

    var set = $("a:external", fixture);
    assert.equal(set.length, 0);
});

QUnit.test("a:external does not select invalid link", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is <a>an invalid link</a>.</p>");

    var set = $("a:external", fixture);
    assert.equal(set.length, 0);
});

QUnit.test("decorate on existing file invokes success", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>Download a <a href='/test/documents/sample.pdf'>sample file</a>.</p>");

    var done = assert.async();
    $("a:internal", fixture).decorate(function(info) {
        assert.equal(info.ext, "pdf", "Extension correct");
        assert.equal(info.EXT, "PDF", "Uppercase extension correct");
        assert.ok(info.size = 7945, "Size correct");
        assert.equal(info.mimeType, "application/pdf", "MIME type correct");
        done();
    });
});

QUnit.test("decorate on missing file invokes fail", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>Download a <a href='/test/documents/missing.pdf'>missing file</a>.</p>");

    var done = assert.async();

    var success = function(info) { // jshint ignore:line
        // Should not be invoked
        assert.ok(false, "Non-existent file");
    };

    var fail = function(info) { // jshint ignore:line
        assert.ok(true, "Fail callback invoked");
        done();
    };

    $("a:internal", fixture).decorate(success, fail);
});

QUnit.test("addExtensionClass with no argument", function(assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");
   
   $("a", fixture).addExtensionClass();
   
   assert.ok($("a", fixture).hasClass("pdf"), "Link has 'pdf' class"); 
});

QUnit.test("addExtensionClass with map object", function(assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");

	var map = { pdf: 'whazzup' };
	$("a", fixture).addExtensionClass(map);
	
	assert.ok($("a", fixture).hasClass("whazzup"), "Link has 'whazzup' class");
});

QUnit.test("addExtensionClass with map object and missing key", function (assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");

	var map = { txt: 'whazzup' };
	$("a", fixture).addExtensionClass(map);
	
	assert.ok(!$("a", fixture).hasClass("whazzup"), "Link does not have 'whazzup' class");
});

QUnit.test("addExtensionClass with map function", function(assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");

	var map = function(ext) { return 'whazzup'; }; //jshint ignore:line
	
	$("a", fixture).addExtensionClass(map);
	
	assert.ok($("a", fixture).hasClass("whazzup"), "Link has 'whazzup' class");
});


QUnit.test("extension", function(assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");
   //fixture.append("<p>This is a link to a <a href='/test/documents/plain.txt'>plain text file</a>.</p>");
   
   var done = assert.async();
   $("a", fixture).extension(function (data) {
     assert.equal(data.ext, 'pdf', "ext correct");
     assert.equal(data.EXT, 'PDF', "EXT correct");
     done();  
   });
});


$.fn.hasAttr = function(name) {
    return $(this).attr(name) !== undefined;
};

$.fn.hasAttrValue = function(name, value) {
    var vals = $(this).attr(name).split(' ');

    return $.inArray(value, vals) > -1;
};

QUnit.test("noOpener with no rel attribute adds attribute", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is a <a href='http://example.com/'>link</a>.</p>");

    $("a", fixture).noOpener();
    
    assert.ok($("a", fixture).hasAttrValue("rel", "noopener"), "Link has rel='nofollow'");
});

QUnit.test("noOpener with other rel attribute adds noopener", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is a <a rel='author' href='http://example.com/'>link</a>.</p>");

    $("a", fixture).noOpener();

    assert.ok($("a", fixture).hasAttrValue("rel", "noopener"), "Link has rel='noopener'");
    assert.ok($("a", fixture).hasAttrValue("rel", "author"), "Link retains rel='author'");
});

QUnit.test("noOpener with existing rel=noopener preserves attribute", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is a <a rel='noopener' href='http://example.com/'>link</a>.</p>");

    $("a", fixture).noOpener();
    assert.ok($("a", fixture).hasAttrValue("rel", "noopener"), "Link retains rel='noopener'");

});


QUnit.test("noFollow with existing rel attribute adds additional value", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is a <a rel='author' href='http://example.com/'>link</a>.</p>");

    $("a", fixture).noFollow();
    assert.ok($("a", fixture).hasAttrValue("rel", "nofollow"), "Link has rel='noopener'");
    assert.ok($("a", fixture).hasAttrValue("rel", "author"), "Link retains rel='author'");
});

QUnit.test("noFollow with existing rel=nofollow preserves attribute", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>This is a <a rel='nofollow' href='http://example.com/'>link</a>.</p>");

    $("a", fixture).noFollow();
    assert.ok($("a", fixture).hasAttrValue("rel", "nofollow"), "Link retains rel='nofollow'");
});

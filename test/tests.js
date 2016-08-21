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
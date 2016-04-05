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

QUnit.test("getFileInfo on existing file invokes success", function(assert) {
    var fixture = $("#qunit-fixture");
    fixture.append("<p>Download a <a href='/test/documents/sample.pdf'>sample file</a>.</p>");

    var done = assert.async();
    $("a:internal", fixture).getFileInfo(function(info) {
        assert.equal(info.ext, "pdf", "Extension correct");
        assert.equal(info.EXT, "PDF", "Uppercase extension correct");
        assert.ok(info.size > 60000, "Size correct");
        assert.equal(info.mimeType, "application/pdf", "MIME type correct");
        done();
    });
});

QUnit.test("getFileInfo on missing file invokes fail", function(assert) {
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

    $("a:internal", fixture).getFileInfo(success, fail);
});

QUnit.test("addClassForExtension", function(assert) {
   var fixture = $("#qunit-fixture");
   fixture.append("<p>Download <a href='/test/documents/sample.pdf'>a sample file</a>.</p>");
   
   $("a", fixture).addClassForExtension();
   
   assert.ok($("a", fixture).hasClass("pdf"), "Link has pdf class"); 
});

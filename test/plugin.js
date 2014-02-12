// Load modules

var Lab = require('lab');
var Hapi = require('hapi');


// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('hapi-spa', function () {

    var table;

    it('can be added as a plugin to hapi', function (done) {

        var server = new Hapi.Server({ files: { relativeTo: __dirname } });
        server.pack.require('../', {folder: '/var/www/public_html'}, function (err) {

            expect(err).to.not.exist;
            table = server.table();
            done();
        });
    });

    it('can use plugin options', function (done) {

        var server = new Hapi.Server({ files: { relativeTo: __dirname } });
        server.pack.require('../', {path: '/test', index: 'index.htm', folder: 'spa/', hash: '#' }, function (err) {

        expect(err).to.not.exist;
        table = server.table();
        var found = table.filter(function (route) {
            return (route.method === 'get' && route.path === '/test/{file*}' && route.params[0] === 'file');
        });
        expect(found).to.have.length(1);

        done();
        });
    });

    it('returns an index file', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: __dirname } });
        server.pack.require('../', { folder: './spa/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/index.html', function(res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

        });
    });

    it('returns a static asset', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: __dirname } });
        server.pack.require('../', { folder: './spa/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/assets/test.txt', function(res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

        });
    });

    it('returns a 404 if index file not found', function(done) {

        var server = new Hapi.Server({ files: { relativeTo: __dirname } });
        server.pack.require('../', { folder: './not-exist/' }, function (err) {

            expect(err).to.not.exist;
            server.inject('/index.html', function(res) {
                expect(res.statusCode).to.equal(404);
                done();
            });

        });
    });
});
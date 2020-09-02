var co = require('co');
var util = require('../server/utils');

describe("get package.json", function () {
    it("should connect directly to server with password", function (done) {
        co(function* () {
            try {
                var res = yield util.read("../package.json");
                expect(res.name).toBe('scullog');
            } catch (e) {
                console.log(e);
            } finally {
                done();
            }
        });
    });

    it("should extract the zip", function (done) {
        co(function* () {
            try {
                yield util.extractRemoteZip("../master.zip", "/tmp/scullog");
            } catch (e) {
                console.log(e);
            } finally {
                done();
            }
        });
    })
});   
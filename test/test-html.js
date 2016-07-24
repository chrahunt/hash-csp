/* eslint no-sync: "off" */
/* global describe, it, __dirname */
var path = require('path');
var vfs = require('vinyl-fs');
var fs = require('fs');
var hashstream = require('..');
var expect = require('chai').expect;

function fixtures(glob) {
  return path.join(__dirname, 'fixtures', glob);
}

describe('hashing', () => {
  it('should hash correctly', (done) => {
    var name = "single-script";
    var sha = fs.readFileSync(fixtures(name + ".sha256"), { encoding: "utf8" });
    vfs.src(fixtures(name + ".html"))
       .pipe(hashstream((hashes) => {
         expect(hashes).to.have.length(1);
         expect(hashes[0]).to.equal(sha);
         done();
       }));
  });

  it('should hash multiple script tags', (done) => {
    var name = "multiple-scripts";
    var sha = fs.readFileSync(fixtures(name + ".sha256"), { encoding: "utf8" })
                .split("\n");
    vfs.src(fixtures(name + ".html"))
       .pipe(hashstream((hashes) => {
         expect(hashes).to.have.length(2);
         expect(hashes[0]).to.equal(sha[0]);
         expect(hashes[1]).to.equal(sha[1]);
         done();
       }));
  });
});
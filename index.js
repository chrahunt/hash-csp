var sjcl = require('sjcl');
var cheerio = require('cheerio');
var Writable = require('readable-stream').Writable;

var defaults = {
  algorithm: 'sha256'
};

/**
 * Returns a stream you can pipe into.
 * Stream takes vinyl records.
 * hashstream(vinyl)
 * opts are optional and  
 */
function hashstream(opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  opts = Object.assign({}, defaults, opts);

  if (opts.algorithm !== "sha256")
    throw new Error("Only sha256 is supported.");

  // Generate base64-encoded SHA256 for given string.
  function hash(s) {
    var hashed = sjcl.hash.sha256.hash(s);
    return sjcl.codec.base64.fromBits(hashed);
  }

  function mapScripts(html, iteratee) {
    var $ = cheerio.load(html);
    return $('script').map((i, el) => {
      return iteratee($(el).text());
    }).toArray();
  }

  var hashes = [];

  var receiver = new Writable({ objectMode: true });

  receiver._write = function (file, enc, next) {
    var result = mapScripts(file.contents, hash);
    result = result.map(h => `${opts.algorithm}-${h}`);
    if (opts.with_names) {
      hashes.push([file.path, ...result]);
    } else {
      hashes.push(...result);
    }
    next();
  };

  if (cb) receiver.on('finish', () => {
    cb(hashes)
  });

  return receiver;
}

module.exports = hashstream;

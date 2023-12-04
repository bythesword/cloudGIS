class AnalysisPLTFR {

    constructor(parent, callbacks) {
        this.parent = parent;
        this.callbacks = callbacks;
        this.readyForAnlysis = 0;
        this.memeryDB = {
            setting: {
                bestTransformValue: 1,
                site: {
                    current: 1,
                    count: 1,
                    countList: [1]
                },
            },
            drawTree: {
                1: {
                    mesh1: {
                        points: {
                            index: [],
                            xyzs: []
                        },
                        lines: {
                            index: [],
                            xyzs: []
                        },
                        triangle: {
                            index: [],
                            xyzs: []
                        },
                        frameLine: {
                            index: [],
                            xyzs: []
                        },
                    }
                }
            },
            res: {
                1: {
                    index: { 1: 1, 3: 2, 6: 3 },
                    pressures: {
                        "U.U1": []
                    }
                }
            }
        };
    }
    do(data) {
        this.readyForAnlysis += 1;
        this.log({ "AnalysisPLTFR do function  and ready value is :": this.readyForAnlysis });
        this.log({ "AnalysisPLTFR do function ": data });
        if (this.readyForAnlysis > 1) {
            this.returnAnalysisData();
        }
    }
    analysisINP() { }
    analysisMSH() { }
    analysisDAT() { }
    analysisRES() { }

    returnAnalysisData() {
        this.log("AnalysisPLTFR returnAnalysisData function (){}");
        this.callbacks.receive(this.memeryDB, this.parent);
    }
    log(msg) {
        if (typeof this.callbacks.log !== "undefined") {
            this.callbacks.log(msg, this.parent);
        } else {
            console.log(msg);
        }
    }

}

/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
  
    var ERROR = 'input is invalid type';
    var WINDOW = typeof window === 'object';
    var root = WINDOW ? window : {};
    if (root.JS_MD5_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
      root = global;
    } else if (WEB_WORKER) {
      root = self;
    }
    !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;
    typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [128, 32768, 8388608, -2147483648];
    var SHIFT = [0, 8, 16, 24];
    var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
  
    var blocks = [], buffer8;
    if (ARRAY_BUFFER) {
      var buffer = new ArrayBuffer(68);
      buffer8 = new Uint8Array(buffer);
      blocks = new Uint32Array(buffer);
    }
  
    if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }
  
    if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
  
    /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method digest
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.digest('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method array
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.array('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method arrayBuffer
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.buffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method base64
     * @memberof md5
     * @description Output hash as base64 string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} base64 string
     * @example
     * md5.base64('The quick brown fox jumps over the lazy dog');
     */
    var createOutputMethod = function (outputType) {
      return function (message) {
        return new Md5(true).update(message)[outputType]();
      };
    };
  
    /**
     * @method create
     * @memberof md5
     * @description Create Md5 object
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.create();
     */
    /**
     * @method update
     * @memberof md5
     * @description Create and update Md5 object
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.update('The quick brown fox jumps over the lazy dog');
     * // equal to
     * var hash = md5.create();
     * hash.update('The quick brown fox jumps over the lazy dog');
     */
    var createMethod = function () {
      var method = createOutputMethod('hex');
      if (NODE_JS) {
        method = nodeWrap(method);
      }
      method.create = function () {
        return new Md5();
      };
      method.update = function (message) {
        return method.create().update(message);
      };
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createOutputMethod(type);
      }
      return method;
    };
  
    var nodeWrap = function (method) {
      var crypto = eval("require('crypto')");
      var Buffer = eval("require('buffer').Buffer");
      var nodeMethod = function (message) {
        if (typeof message === 'string') {
          return crypto.createHash('md5').update(message, 'utf8').digest('hex');
        } else {
          if (message === null || message === undefined) {
            throw ERROR;
          } else if (message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          }
        }
        if (Array.isArray(message) || ArrayBuffer.isView(message) ||
          message.constructor === Buffer) {
          return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
        } else {
          return method(message);
        }
      };
      return nodeMethod;
    };
  
    /**
     * Md5 class
     * @class Md5
     * @description This is internal class.
     * @see {@link md5.create}
     */
    function Md5(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          var buffer = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer);
          this.blocks = new Uint32Array(buffer);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
      this.first = true;
    }
  
    /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
    Md5.prototype.update = function (message) {
      if (this.finalized) {
        return;
      }
  
      var notString, type = typeof message;
      if (type !== 'string') {
        if (type === 'object') {
          if (message === null) {
            throw ERROR;
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw ERROR;
            }
          }
        } else {
          throw ERROR;
        }
        notString = true;
      }
      var code, index = 0, i, length = message.length, blocks = this.blocks;
      var buffer8 = this.buffer8;
  
      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks[0] = blocks[16];
          blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }
  
        if (notString) {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              buffer8[i++] = message[index];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                buffer8[i++] = code;
              } else if (code < 0x800) {
                buffer8[i++] = 0xc0 | (code >> 6);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else if (code < 0xd800 || code >= 0xe000) {
                buffer8[i++] = 0xe0 | (code >> 12);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                buffer8[i++] = 0xf0 | (code >> 18);
                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              }
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                blocks[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 0x800) {
                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else if (code < 0xd800 || code >= 0xe000) {
                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              }
            }
          }
        }
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 64) {
          this.start = i - 64;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };
  
    Md5.prototype.finalize = function () {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i = this.lastByteIndex;
      blocks[i >> 2] |= EXTRA[i & 3];
      if (i >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }
      blocks[14] = this.bytes << 3;
      blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    };
  
    Md5.prototype.hash = function () {
      var a, b, c, d, bc, da, blocks = this.blocks;
  
      if (this.first) {
        a = blocks[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = this.h0;
        b = this.h1;
        c = this.h2;
        d = this.h3;
        a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }
  
      a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[9] - 343485551;
      b = (b << 21 | b >>> 11) + c << 0;
  
      if (this.first) {
        this.h0 = a + 1732584193 << 0;
        this.h1 = b - 271733879 << 0;
        this.h2 = c - 1732584194 << 0;
        this.h3 = d + 271733878 << 0;
        this.first = false;
      } else {
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
      }
    };
  
    /**
     * @method hex
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.hex();
     */
    Md5.prototype.hex = function () {
      this.finalize();
  
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
  
      return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
        HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
        HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
        HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
        HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
        HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
        HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
        HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
        HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
        HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
        HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
        HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
        HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
        HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
        HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
        HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
    };
  
    /**
     * @method toString
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.toString();
     */
    Md5.prototype.toString = Md5.prototype.hex;
  
    /**
     * @method digest
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.digest}
     * @example
     * hash.digest();
     */
    Md5.prototype.digest = function () {
      this.finalize();
  
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
        h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
        h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
        h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
      ];
    };
  
    /**
     * @method array
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.array}
     * @example
     * hash.array();
     */
    Md5.prototype.array = Md5.prototype.digest;
  
    /**
     * @method arrayBuffer
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.arrayBuffer}
     * @example
     * hash.arrayBuffer();
     */
    Md5.prototype.arrayBuffer = function () {
      this.finalize();
  
      var buffer = new ArrayBuffer(16);
      var blocks = new Uint32Array(buffer);
      blocks[0] = this.h0;
      blocks[1] = this.h1;
      blocks[2] = this.h2;
      blocks[3] = this.h3;
      return buffer;
    };
  
    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.buffer}
     * @example
     * hash.buffer();
     */
    Md5.prototype.buffer = Md5.prototype.arrayBuffer;
  
    /**
     * @method base64
     * @memberof Md5
     * @instance
     * @description Output hash as base64 string
     * @returns {String} base64 string
     * @see {@link md5.base64}
     * @example
     * hash.base64();
     */
    Md5.prototype.base64 = function () {
      var v1, v2, v3, base64Str = '', bytes = this.array();
      for (var i = 0; i < 15;) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
          BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
          BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
          BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
        BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
        '==';
      return base64Str;
    };
  
    
    createMethod();

class MeshAnalysis {

    constructor(callbacks = false) {

        this.md5OfFiles = {
            //"md5":filename,
        };
        this.filenames = {
            // filename:filename
        };
        this.callWorker = {};
        this.init(callbacks);
    }
    init(callback) {

        if (callback) {
            for (let i in callback) {
                this.callWorker[i] = callback[i];
            }
        }
        else {
            this.log("MeshAnalysis : can't find the callback or worker input");
        }
        this.log("MeshAnalysis Init.");
    }
    do(data) {
        this.log({ "MeshAnalysis:data is ": data });
        this.postMSG();
    }
    postMSG() {
        this.callWorker.onMSG({ type: "Mesh", content: "dfasdfasdf" }, this.callWorker.parent);
    }
    // this function will be rewrite by worker fork class
    log(msg, that = false) {
        if (that == false) {
            that = this;
        }
        if (typeof that.callWorker["log"] != "undefined") {
            that.callWorker.log(msg, that.callWorker.parent);
        }
        else {
            console.log("getFile : ", msg);
        }
    }

}

class ResAnalysis {

    constructor(callbacks = false) {

        this.md5OfFiles = {
            //"md5":filename,
        };
        this.filenames = {
            // filename:filename
        };
        this.callWorker = {};
        this.init(callbacks);
    }
    init(callback) {

        if (callback) {
            for (let i in callback) {
                this.callWorker[i] = callback[i];
            }
        }
        else {
            this.log("ResAnalysis : can't find the callback or worker input");
        }
        this.log("ResAnalysis Init.");
    }
    do(data) {
        this.log({ "ResAnalysis:data is ": data });
        this.postMSG();
    }
    postMSG() {
        this.callWorker.onMSG({ type: "RES", content: "7987987987987987987987" }, this.callWorker.parent);
    }
    // this function will be rewrite by worker fork class
    log(msg, that = false) {
        if (that == false) {
            that = this;
        }
        if (typeof that.callWorker["log"] != "undefined") {
            that.callWorker.log(msg, that.callWorker.parent);
        }
        else {
            console.log("getFile : ", msg);
        }
    }

}

class SaveDB {

    constructor(inputJSON, parent) {

    }

}

// import { JSZip } from "jszip";
class GetFile {

    constructor(callbacks = false) {
        this.analysis = new AnalysisPLTFR(this, {
            receive: this.receiveDataFromeAnalysis,
            log: this.log,
        });
        this.md5OfFiles = {
            //"md5":filename,
        };
        this.filenames = {
            // filename:filename
        };
        this.callbacks = callbacks;
        this.save = new SaveDB();
        this.worker = {};
        this.init(callbacks);
    }
    // this function will be rewrite by worker fork class ,for close worker 
    destroy() { }
    // this function will be rewrite by worker fork class 
    init() {
        this.worker = {
            getMeshFile: new MeshAnalysis({
                log: this.log,
                onMSG: this.doAnalysis,
                parent: this,
            }),
            getResFile: new ResAnalysis({
                log: this.log,
                onMSG: this.doAnalysis,
                parent: this,
            }),
        };
        // if (callback) {
        //     for (let i in callback) {
        //         this.callbacks[i] = callback[i];
        //     }
        // }
        // else {
        //     this.log("getFile : can't find the callback or worker input");
        // }
        this.log("getFile Init.");
    }
    // this function will be rewrite by worker fork class
    postMSG2CM(data, that = false) {
        if (that == false) {
            that = this;
        }
        if (typeof that.callbacks["postMSG"] != "undefined") {
            that.callbacks.onMSG(data);
        }
        else {
            that.log({ "getFile : error,can't find the callback or worker input ": data });
        }

    }
    // this function will be rewrite by worker fork class
    log(msg, that = false) {
        if (that == false) {
            that = this;
        }
        if (typeof that.callbacks["log"] != "undefined") {
            that.callbacks.log(msg, that.callbacks.parent);
        }
        else {
            console.log("getFile : ", msg);
        }
    }
    // this function will be rewrite by worker fork class
    doAnalysis(data, that = false) {
        if (that == false) {
            that = this;
        }
        that.analysis.do(data);
        //
    }
    // this function will be rewrite by worker fork class
    receiveDataFromeAnalysis(data, that) {
        that.log({
            type: "log",
            succeed: true,
            subject: "80%:完成优化数据",
        });
        that.log({ "getFile receiveDataFromeAnalysis:": data });
        that.callbacks.onMSG(
            {
                type: "data",
                succeed: true,
                data: data
            }
            , that.callbacks.parent);

    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //part for read URL zip file or normal file 
    readFile(data) {
        this.log(data);
        this.postMSG2Mesh(data);
        this.postMSG2Res(data);

    }
    // this function will be rewrite by worker fork class
    postMSG2Mesh(data) {
        this.worker.getMeshFile.do(data);
    }
    // this function will be rewrite by worker fork class
    postMSG2Res(data) {
        this.worker.getResFile.do(data);
    }
    initFormat() {
        if (this.zipFile.ziped == false) ; else {
            this.zipFile.list = {
                "mesh.nodes": [this.callNodes, 0],
                "mesh.boundary": [this.callBoundary, 0],
                "mesh.elements": [this.callElements, 0],
            };
        }
        // let abc = 1;
    }
    getfirstEXTFile(Ext) {
        let first = false;
        for (let i in this.zipFS.files) {
            let perFile = this.zipFS.files[i].name;
            let getExt = perFile.split(".");
            if (getExt.length > 1 && getExt[getExt.length - 1] == Ext) {
                first = perFile;
                break;
            }
        }
        return first;
    }
    getfirstEXTFileList(Ext) {
        let list = [];
        for (let i in this.zipFS.files) {
            let perFile = this.zipFS.files[i].name.toLowerCase();
            let getExt = perFile.split(".");
            if (getExt.length > 1 && getExt[getExt.length - 1] == Ext) {
                list.push(perFile);
            }
        }
        return list;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 二进制转换
    arrayBufferToBase64(buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    base64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            //.replace(/-/g, '+')//
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // file
    initLoadFile(inputFile) {
        let that = this;
        if (inputFile.mesh) {
            const loader = new FileLoader();

            //加载一个文本文件，并把结果输出到控制台上
            loader.load(
                // resource URL
                inputFile.mesh,

                // onLoad回调
                function (data) {
                    // output the text to the console
                    // console.log(data)
                    if (inputFile.type == "abaqus") {
                        that.getFileMesh([data, 0]);
                    } else if (inputFile.type == "gid") {
                        that.getFileMesh(data);
                    }
                    that.callDraw(that);
                    that.afterInit(that);
                },

                // onProgress回调
                function (xhr) {
                    that.parent.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                },

                // onError回调
                function (err) {
                    that.parent.log("An error happened", err);
                }
            );
        }
    }
    initZip(zipFile) {
        // const promise = new JSZip.external.Promise(function (resolve, reject) {
        //     JSZipUtils.getBinaryContent(zipFile.zip, function (err, data) {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(data);
        //         }
        //     });is
        // });
        let that = this;
        this.parent.log("1%:准备接收计算结果数据;");
        this.idb = new cloudIdb("idbZIP", function (isCache) {
            const promise = new JSZip.external.Promise(function (resolve, reject) {
                that.parent.log("10%:接收数据;");
                let zipName = zipFile.zip.split("/").pop();
                if (isCache == false) {
                    JSZipUtils.getBinaryContent(zipFile.zip, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            let a2b = that.arrayBufferToBase64(data);
                            // let b2a = that.base64ToUint8Array(a2b).buffer;
                            // console.log("this is raw from zip ", data, b2a)
                            that.idb.add(zipName, a2b);
                            // console.log("The data loads from network")
                            resolve(data);
                        }
                    });
                } else {
                    that.idb.read(zipName, function (cacheData) {
                        if (cacheData == false || isCache == false) {
                            JSZipUtils.getBinaryContent(zipFile.zip, function (err, data) {
                                if (err) {
                                    reject(err);
                                } else {
                                    let a2b = that.arrayBufferToBase64(data);
                                    // let b2a = that.base64ToUint8Array(a2b).buffer;
                                    // console.log("this is raw from zip ", data, b2a)
                                    that.idb.add(zipName, a2b);
                                    // console.log("The data loads from network")
                                    resolve(data);
                                }
                            });
                        } else {
                            // console.log("The data loads from cache");
                            resolve(that.base64ToUint8Array(cacheData).buffer);
                        }
                    });
                }
            });
            promise
                .then(JSZip.loadAsync) // 2) chain with the zip promise
                .then(
                    function (zip) {
                        that.parent.log("20%:数据传输;");
                        that.zipFS = zip;
                        that.initFormat();
                        let array = [];
                        for (let i in zipFile.list) {
                            if (typeof zipFile.list[i] == "function") {
                                array.push(
                                    zip
                                        .file(i)
                                        .async("string")
                                        .then(function (data) {

                                            that.parent.log("......");
                                            zipFile.list[i].call(that, data);
                                        })
                                );
                            } else {
                                array.push(
                                    zip
                                        .file(i)
                                        .async("string")
                                        .then(function (data) {
                                            that.parent.log("......");
                                            zipFile.list[i][0].call(that, [data, zipFile.list[i][1]]);
                                        })
                                );
                            }
                        }

                        function myPromise(promiseList) {
                            that.parent.log("30%:数据处理;");
                            return promiseList.map((the_promise) =>
                                the_promise.then(
                                    (res) => ({ status: "ok", res }),
                                    (err) => ({ status: "not ok", err })
                                )
                            );
                        }
                        function pro(PromiseArr) {
                            Promise.all(myPromise(PromiseArr)).then(
                                (res) => {
                                    // console.log(res);
                                    if (PromiseArr.length == res.length) {
                                        //开始处理
                                        that.parent.log("70%:开始数据可视化处理;");
                                        that.callDraw();
                                        that.parent.log("90%:开始数据可视化处理;");
                                        if (that.parent.render) that.parent.render();
                                        else if (that.parent.parent.render)
                                            that.parent.parent.render();
                                        that.afterInit(that);
                                    }
                                },
                                (err) => console.log(err)
                            );
                        }
                        pro(array);
                    },
                    function error(e) {
                        console.log(e);
                    }
                );
        });
    }
}

// import JSZip from "../libs/jszip/jszip";
// import JSZipUtils from "../libs/jszip/jszip-utils";
// import { md5 } from "../libs/md5/md5";
// import { MeshAnalysis } from "./mesh"; // worker ready
// import { ResAnalysis } from "./res"; // worker ready
// import { SaveDB } from "./savedb";// no worker

// eslint-disable-next-line no-unused-vars

class GetFileWorker extends GetFile {

    constructor() {
        super(false);
        this.iii = 0;
        return this;
    }
    // this function will be rewrite by worker fork class ,for close worker 
    destroy() {

    }
    // this function will be rewrite by worker fork class 
    init() {
        let that = this;
        this.worker = {
            getMeshFile: new Worker("./mesh.worker.js", { type: "module" }),
            getResFile: new Worker("./res.worker.js", { type: "module" })
        };
        this.worker.getMeshFile.onmessage = function (e) { that.doAnalysis(e, that); };
        this.worker.getResFile.onmessage = function (e) { that.doAnalysis(e, that); };

        this.log({ type: "msg", data: "getFile Init. worker" });
    }

    // this function will be rewrite by worker fork class
    postMSG(data, that = false) {
        if (that == false) {
            that = this;
        }
        if (typeof that.callWorker["postMSG"] != "undefined") {
            that.callWorker.postMSG(data);
        }
        else {
            that.log({ "getFile : error,can't find the callback or worker input ": data });
        }

    }
    // this function will be rewrite by worker fork class
    log(msg) {

        postMessage(msg);
    }


    postMSG2Mesh(data) {
        this.worker.getMeshFile.postMessage({
            type: "input",
            // succeed: true,
            subject: "text",
            data: data,
        });
    }
    postMSG2Res(data) {
        this.worker.getResFile.postMessage({
            type: "input",
            // succeed: true,
            subject: "text",
            data: data,
        });
    }

    doAnalysis(e, that) {
        if (typeof e.data != "undefined")
            if (typeof e.data.type != "undefined")
                if (e.data.type == "log") {
                    that.log(e.data);
                }
                else if (e.data.type == "data") {
                    if (e.data.succeed == true) {
                        that.log({
                            type: "log",
                            succeed: true,
                            subject: (that.iii++ ? 70 : 60) + "%:开始优化数据",
                            data: e.data
                        });
                        that.analysis.do(e.data);
                    }
                    else {
                        that.log({
                            type: "error",
                            succeed: false,
                            subject: "错误:数据分析异常",
                            data: e.data
                        });
                    }
                }
                else {
                    that.log(e.data);
                }
            else {
                that.log(e.data);
            }


    }
    receiveDataFromeAnalysis(data) {
        this.log({
            type: "log",
            succeed: true,
            subject: "80%:完成优化数据",
        });
        postMessage(
            {
                type: "data",
                succeed: true,
                data: data
            });

    }

}

class MeshAnalysisWorker extends MeshAnalysis {

    constructor() {
        super(false);
        return this;
    }
    init() {
        this.log("MeshAnalysis Init. worker");
    }
    do(data) {
        this.log(data);
        this.postMSG("return from mesh " + data);
    }
    postMSG(data) {
        postMessage(
            {
                type: "data",
                succeed: true,
                subject: "mesh data",
                data: data
            });
    }
    // this function will be rewrite by worker fork class
    log(msg) {
        postMessage(msg);
    }

}

class ResAnalysisWorker extends ResAnalysis {
    constructor() {
        super();
        return this;
    }
    init() {
        this.log("ResAnalysis Init. worker");
    }
    do(data) {
        this.log(data);
        this.postMSG("return from mesh " + data);
    }
    postMSG(data) {
        postMessage(
            {
                type: "data",
                succeed: true,
                subject: "res data",
                data: data
            });
    }
    // this function will be rewrite by worker fork class
    log(msg) {
        postMessage(msg);
    }

}

export { GetFileWorker, MeshAnalysisWorker, ResAnalysisWorker };

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pdbundle = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pdgui = require("../../../pd/nw/pdgui.js")
var shortcuts = require("../../../pd/nw/pd_shortcuts.js")
var pd_canvas = require("../../../pd/nw/pd_canvas.js")

module.exports = {
    pdgui: pdgui,
    shortcuts: shortcuts,
    pd_canvas: pd_canvas,
  }
},{"../../../pd/nw/pd_canvas.js":9,"../../../pd/nw/pd_shortcuts.js":11,"../../../pd/nw/pdgui.js":12}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (process){(function (){
var fs = require('fs');
var path = require('path');

// default options
var defaultOpt = {
  all: false,
  recursive: true,
  files: true,
  directories: false,
  ignore: false
};

function defaults(defaults, obj) {
  for (var prop in defaults)
    if (defaults.hasOwnProperty(prop))
      if (!obj.hasOwnProperty(prop))
        obj[prop] = defaults[prop];
  return obj;
}

// general function
module.exports = function(dir, opt, action, complete) {

  // check args
  if (typeof opt === 'function') {
    if (typeof action === 'undefined')
      complete = function () {};
    else
      complete = action;

    action = opt;
    opt = { };
  } else if (typeof complete === 'undefined')
    complete = function () {};

  // Assert that dir is a string
  if (typeof dir !== 'string')
    dir = process.cwd();

  opt = defaults(defaultOpt, opt);

  // Check if user wants to ignore dir/file
  // If they do, create function that can test if file matches
  var ignore = null;
  if (opt.ignore instanceof RegExp) {
    ignore = function(file) { return file.match(opt.ignore); }
  } else if (typeof opt.ignore === 'string' && opt.ignore.trim()) {
    ignore = function(file) { return file.indexOf(opt.ignore) !== -1; }
  }

  function dive(dir) {
    // Read the directory
    todo++;
    fs.readdir(dir, function(err, list) {
      todo--;
      // Return the error if something went wrong
      if (err) {
        action(err, dir);
      } else {
        // For every file in the list
        list.forEach(function(file) {
          if (ignore && ignore(file))
            return;

          if (opt.all || file[0] !== '.') {
            // Full path of that file
            var fullPath = path.resolve(dir, file);
            // Get the file's stats
            todo++;
            fs.lstat(fullPath, function(err, stat) {
              todo--;
              if (err) {
                action(err, fullPath);
              } else {
                if (stat) {
                  // If the file is a directory
                  if (stat.isDirectory()) {
                    // Call action if enabled for directories
                    if (opt.directories)
                      action(null, fullPath, stat);

                    // Dive into the directory
                    if (opt.recursive)
                      dive(fullPath);

                  } else {
                    // Call action if enabled for files
                    if (opt.files)
                      action(null, fullPath, stat);
                  }
                }
              }
              if (!todo)
                complete();
            });
          }

        });

      }
      //empty directories, or with just hidden files
      if (!todo)
        complete();
    });
  }

  var todo = 0;
  dive(path.resolve(dir));
};


}).call(this)}).call(this,require('_process'))
},{"_process":4,"fs":2,"path":3}],6:[function(require,module,exports){
/**
 * elasticlunr - http://weixsong.github.io
 * Lightweight full-text search engine in Javascript for browser search and offline search. - 0.8.5
 *
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 * MIT Licensed
 * @license
 */

(function(){

/*!
 * elasticlunr.js
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * Convenience function for instantiating a new elasticlunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 * 
 * 1. elasticlunr.trimmer - trim non-word character
 * 2. elasticlunr.StopWordFilter - filters out any stop words before they enter the
 * index
 * 3. elasticlunr.stemmer - stems the tokens before entering the index.
 *
 *
 * Example:
 *
 *     var idx = elasticlunr(function () {
 *       this.addField('id');
 *       this.addField('title');
 *       this.addField('body');
 *       
 *       //this.setRef('id'); // default ref is 'id'
 *
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       });
 *     });
 * 
 *    idx.addDoc({
 *      id: 1, 
 *      title: 'Oracle released database 12g',
 *      body: 'Yestaday, Oracle has released their latest database, named 12g, more robust. this product will increase Oracle profit.'
 *    });
 * 
 *    idx.addDoc({
 *      id: 2, 
 *      title: 'Oracle released annual profit report',
 *      body: 'Yestaday, Oracle has released their annual profit report of 2015, total profit is 12.5 Billion.'
 *    });
 * 
 *    # simple search
 *    idx.search('oracle database');
 * 
 *    # search with query-time boosting
 *    idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
 *
 * @param {Function} config A function that will be called with the new instance
 * of the elasticlunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new elasticlunr.Index.
 * @namespace
 * @module
 * @return {elasticlunr.Index}
 *
 */
var elasticlunr = function (config) {
  var idx = new elasticlunr.Index;

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx;
};

elasticlunr.version = "0.8.5";
/*!
 * elasticlunr.utils
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * A namespace containing utils for the rest of the elasticlunr library
 */
elasticlunr.utils = {};

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
elasticlunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message);
    }
  };
})(this);

/**
 * Convert an object to string.
 *
 * In the case of `null` and `undefined` the function returns
 * an empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {object} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
elasticlunr.utils.toString = function (obj) {
  if (obj === void 0 || obj === null) {
    return "";
  }

  return obj.toString();
}
/*!
 * elasticlunr.EventEmitter
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.EventEmitter is an event emitter for elasticlunr. It manages adding and removing event handlers and triggering events and their handlers.
 *
 * Each event could has multiple corresponding functions, these functions will be called as the sequence that they are added into the event.
 * 
 * @constructor
 */
elasticlunr.EventEmitter = function () {
  this.events = {};
};

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} fn The function to call when an event is fired.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args;

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function");

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = [];
    this.events[name].push(fn);
  }, this);
};

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} fn The function to remove from an event.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return;

  var fnIndex = this.events[name].indexOf(fn);
  if (fnIndex == -1) return;

  this.events[name].splice(fnIndex, 1);

  if (this.events[name].length == 0) delete this.events[name];
};

/**
 * Calls all functions bound to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return;

  var args = Array.prototype.slice.call(arguments, 1);

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args);
  });
};

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
elasticlunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events;
};
/*!
 * elasticlunr.tokenizer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * A function for splitting a string into tokens.
 * Currently English is support as default.
 * Uses `elasticlunr.tokenizer.seperator` to split strings, you could change
 * the value of this property to set how you want strings are split into tokens.
 * IMPORTANT: use elasticlunr.tokenizer.seperator carefully, if you are not familiar with
 * text process, then you'd better not change it.
 *
 * @module
 * @param {String} str The string that you want to tokenize.
 * @see elasticlunr.tokenizer.seperator
 * @return {Array}
 */
elasticlunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return [];
  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return elasticlunr.utils.toString(t).toLowerCase();
    });
  }

  return obj.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator);
};

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
elasticlunr.tokenizer.seperator = /[\s\-]+/
/*!
 * elasticlunr.Pipeline
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.Pipelines maintain an ordered list of functions to be applied to 
 * both documents tokens and query tokens.
 *
 * An instance of elasticlunr.Index created with the elasticlunr shortcut will contain a
 * pipeline with a trimmer, a stop word filter, an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with elasticlunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
elasticlunr.Pipeline = function () {
  this._queue = [];
};

elasticlunr.Pipeline.registeredFunctions = {};

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to check for.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    elasticlunr.utils.warn('Overwriting existing registered function: ' + label);
  }

  fn.label = label;
  elasticlunr.Pipeline.registeredFunctions[label] = fn;
};

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions);

  if (!isRegistered) {
    elasticlunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn);
  }
};

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with elasticlunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @return {elasticlunr.Pipeline}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.load = function (serialised) {
  var pipeline = new elasticlunr.Pipeline;

  serialised.forEach(function (fnName) {
    var fn = elasticlunr.Pipeline.registeredFunctions[fnName];

    if (fn) {
      pipeline.add(fn);
    } else {
      throw new Error('Cannot load un-registered function: ' + fnName);
    }
  });

  return pipeline;
};

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments);

  fns.forEach(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    this._queue.push(fn);
  }, this);
};

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.after = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos == -1) {
    throw new Error('Cannot find existingFn');
  }

  pos = pos + 1;
  this._queue.splice(pos, 0, newFn);
};

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 * If existingFn is not found, throw an Exception.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.before = function (existingFn, newFn) {
  elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);

  var pos = this._queue.indexOf(existingFn);
  if (pos == -1) {
    throw new Error('Cannot find existingFn');
  }

  this._queue.splice(pos, 0, newFn);
};

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._queue.indexOf(fn);
  if (pos == -1) {
    return;
  }

  this._queue.splice(pos, 1);
};

/**
 * Runs the current list of functions that make up the pipeline against the
 * input tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      pipelineLength = this._queue.length;

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i];

    for (var j = 0; j < pipelineLength; j++) {
      token = this._queue[j](token, i, tokens);
      if (token === void 0) break;
    };

    if (token !== void 0) out.push(token);
  };

  return out;
};

/**
 * Resets the pipeline by removing any existing processors.
 *
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.reset = function () {
  this._queue = [];
};

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @return {Array}
 * @memberOf Pipeline
 */
elasticlunr.Pipeline.prototype.toJSON = function () {
  return this._queue.map(function (fn) {
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
    return fn.label;
  });
};
/*!
 * elasticlunr.Index
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
elasticlunr.Index = function () {
  this._fields = [];
  this._ref = 'id';
  this.pipeline = new elasticlunr.Pipeline;
  this.documentStore = new elasticlunr.DocumentStore;
  this.index = {};
  this.eventEmitter = new elasticlunr.EventEmitter;
  this._idfCache = {};

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {};
  }).bind(this));
};

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments);
  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
};

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn);
};

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of elasticlunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== elasticlunr.version) {
    elasticlunr.utils.warn('version mismatch: current ' 
                    + elasticlunr.version + ' importing ' + serialisedData.version);
  }

  var idx = new this;

  idx._fields = serialisedData.fields;
  idx._ref = serialisedData.ref;
  idx.documentStore = elasticlunr.DocumentStore.load(serialisedData.documentStore);
  idx.pipeline = elasticlunr.Pipeline.load(serialisedData.pipeline);
  idx.index = {};
  for (var field in serialisedData.index) {
    idx.index[field] = elasticlunr.InvertedIndex.load(serialisedData.index[field]);
  }

  return idx;
};

/**
 * Adds a field to the list of fields that will be searchable within documents in the index.
 * 
 * Remember that inner index is build based on field, which means each field has one inverted index.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that should be indexed
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.addField = function (fieldName) {
  this._fields.push(fieldName);
  this.index[fieldName] = new elasticlunr.InvertedIndex;
  return this;
};

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.setRef = function (refName) {
  this._ref = refName;
  return this;
};

/**
 * 
 * Set if the JSON format original documents are save into elasticlunr.DocumentStore
 * 
 * Defaultly save all the original JSON documents.
 *
 * @param {Boolean} save Whether to save the original JSON documents.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.saveDocument = function (save) {
  this.documentStore = new elasticlunr.DocumentStore(save);
  return this;
};

/**
 * Add a JSON format document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The JSON format document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
elasticlunr.Index.prototype.addDoc = function (doc, emitEvent) {
  if (!doc) return;
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];

  this.documentStore.addDoc(docRef, doc);
  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    this.documentStore.addFieldLength(docRef, field, fieldTokens.length);

    var tokenCount = {};
    fieldTokens.forEach(function (token) {
      if (token in tokenCount) tokenCount[token] += 1;
      else tokenCount[token] = 1;
    }, this);

    for (var token in tokenCount) {
      var termFrequency = tokenCount[token];
      termFrequency = Math.sqrt(termFrequency);
      this.index[field].addToken(token, { ref: docRef, tf: termFrequency });
    }
  }, this);

  if (emitEvent) this.eventEmitter.emit('add', doc, this);
};

/**
 * Removes a document from the index by doc ref.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 * 
 * If user setting DocumentStore not storing the documents, then remove doc by docRef is not allowed.
 *
 * @param {String|Integer} docRef The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDocByRef = function (docRef, emitEvent) {
  if (!docRef) return;
  if (this.documentStore.isDocStored() == false) {
    elasticlunr.utils.warn('remove doc by ref is not allowed, because currectly not storing documents in DocumentStore');
    return;
  }
  
  if (!this.documentStore.hasDoc(docRef)) return;
  var doc = this.documentStore.getDoc(docRef);
  this.removeDoc(doc);
};

/**
 * Removes a document from the index.
 * This remove operation could work even the original doc is not store in the DocumentStore.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 * 
 *
 * @param {Object} doc The document ref to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDoc = function (doc, emitEvent) {
  if (!doc) return;

  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];
  if (!this.documentStore.hasDoc(docRef)) return;

  this.documentStore.removeDoc(docRef);

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    fieldTokens.forEach(function (token) {
      this.index[field].removeToken(token, docRef);
    }, this);
  }, this);

  if (emitEvent) this.eventEmitter.emit('remove', doc, this);
};

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
elasticlunr.Index.prototype.update = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  this.removeDoc(doc, false);
  this.addDoc(doc, false);

  if (emitEvent) this.eventEmitter.emit('update', doc, this);
};

/**
 * Calculates the inverse document frequency for a token within the index of a field.
 *
 * @param {String} token The token to calculate the idf of.
 * @param {String} field The field to compute idf.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
elasticlunr.Index.prototype.idf = function (term, field) {
  var cacheKey = "@" + field + '/' + term;
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey];

  var df = this.index[field].getDocFreq(term);
  var idf = 1 + Math.log(this.documentStore.length / (df + 1));
  this._idfCache[cacheKey] = idf;

  return idf;
};

/**
 * get fields of current index instance 
 * 
 * @return {Array}
 */
elasticlunr.Index.prototype.getFields = function () {
  return this._fields.slice();
}

/**
 * Searches the index using the passed query.
 * Queries should be a string, multiple words are allowed.
 * 
 * If config is null, will search all fields defaultly, and lead to OR based query.
 * If config is specified, will search specified with query time boosting.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @param {JSON} userConfig The user query config, JSON format.
 * @return {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
elasticlunr.Index.prototype.search = function (query, userConfig) {
  if (!query) return [];

  var configStr = null;
  if (userConfig != null) {
    configStr = JSON.stringify(userConfig);
  }

  var config = new elasticlunr.Configuration(configStr, this.getFields()).get();

  var queryTokens = this.pipeline.run(elasticlunr.tokenizer(query));

  var queryResults = {};
  var squaredWeight = this.computeSquaredWeight(queryTokens, config);

  for (var field in config) {
    var fieldSearchResults = this.fieldSearch(queryTokens, field, config);
    var fieldBoost = config[field].boost;
    var queryNorm = 1 / Math.sqrt(1 / (fieldBoost * fieldBoost) * squaredWeight);

    for (var docRef in fieldSearchResults) {
      fieldSearchResults[docRef] = fieldSearchResults[docRef] * queryNorm;
    }

    for (var docRef in fieldSearchResults) {
      if (docRef in queryResults) {
        queryResults[docRef] += fieldSearchResults[docRef];
      } else {
        queryResults[docRef] = fieldSearchResults[docRef];
      }
    }
  }

  var results = [];
  for (var docRef in queryResults) {
    results.push({ref: docRef, score: queryResults[docRef]});
  }

  results.sort(function (a, b) { return b.score - a.score; });
  return results;
};

/**
 * search queryTokens in specified field.
 *
 * @param {Array} queryTokens The query tokens to query in this field.
 * @param {String} field Field to query in.
 * @param {elasticlunr.Configuration} config The user query config, JSON format.
 * @return {Object}
 */
elasticlunr.Index.prototype.fieldSearch = function (queryTokens, fieldName, config) {
  var booleanType = config[fieldName].bool;
  var expand = config[fieldName].expand;
  var scores = {};
  var docTokens = {};

  queryTokens.forEach(function (token) {
    var tokens = [token];
    if (expand == true) {
      tokens = this.index[fieldName].expandToken(token);
    }
 
    tokens.forEach(function (key) {
      var docs = this.index[fieldName].getDocs(key);
      var idf = this.idf(key, fieldName);
      for (var docRef in docs) {
        var tf = this.index[fieldName].getTermFrequency(key, docRef);
        var fieldLength = this.documentStore.getFieldLength(docRef, fieldName);
        var norm = 1;
        if (fieldLength != 0) {
          norm = 1 / Math.sqrt(fieldLength);
        }

        var penality = 1;
        if (key != token) {
          // currently I'm not sure if this penality is enough,
          // need to do verification
          penality = (1 - (key.length - token.length) / key.length) * 0.15;
        } else {
          // only record appeared token for retrieved documents for the 
          // original token, not for expaned token.
          // beause for doing coordNorm for a retrieved document, coordNorm only care how many
          // query token appear in that document.
          // so expanded token should not be added into docTokens, if added, this will pollute the 
          // coordNorm
          this.fieldSearchStats(docTokens, key, docs);
        }

        var score = tf * idf * norm * penality;

        if (docRef in scores) {
          scores[docRef] += score;
        } else {
          scores[docRef] = score;
        }
      }
    }, this);
  }, this);

  if (booleanType == 'AND') {
    scores = this.intersect(scores, docTokens, queryTokens.length);
  }

  scores = this.coordNorm(scores, docTokens, queryTokens.length);

  return scores;
};

/**
 * Record the occuring query token of retrieved doc specified by doc field.
 * Only for inner user.
 * 
 * @param {Object} docTokens a data structure stores which token appears in the retrieved doc.
 * @param {String} token query token
 * @param {Object} docs the retrieved documents of the query token
 * 
 */
elasticlunr.Index.prototype.fieldSearchStats = function (docTokens, token, docs) {
  for (var doc in docs) {
    if (doc in docTokens) {
      docTokens[doc].push(token);
    } else {
      docTokens[doc] = [token];
    }
  }
};

/**
 * compute squared weight of query tokens.
 *
 * @param {Array} queryTokens query tokens.
 * @param {elasticlunr.Configuration} config The user query config, JSON format.
 * @return {Float}
 */
elasticlunr.Index.prototype.computeSquaredWeight = function (queryTokens, config) {
  var weight = 0.0;
  queryTokens.forEach(function (token) {
    var fieldWeight = 0.0;
    for (var field in config) {
      var fieldBoost = config[field].boost;
      var idf = this.idf(token, field);
      fieldWeight += idf * idf * fieldBoost * fieldBoost;
    }
    weight += fieldWeight;
  }, this);

  return weight;
};

/**
 * find documents contain all the query tokens.
 * only for inner use.
 * 
 * @param {Object} results first results
 * @param {Object} docs field search results of a token
 * @param {Integer} n query token number
 * @return {Object}
 */
elasticlunr.Index.prototype.intersect = function (scores, docTokens, n) {
  var res = {};

  for (var doc in scores) {
    if (!(doc in docTokens)) continue;
    if (docTokens[doc].length == n) {
      res[doc] = scores[doc];
    }
  }

  return res;
};

/**
 * coord norm the score of a doc.
 * if a doc contain more query tokens, then the score will larger than the doc
 * contains less query tokens.
 * 
 * only for inner use.
 * 
 * @param {Object} results first results
 * @param {Object} docs field search results of a token
 * @param {Integer} n query token number
 * @return {Object}
 */
elasticlunr.Index.prototype.coordNorm = function (scores, docTokens, n) {
  for (var doc in scores) {
    if (!(doc in docTokens)) continue;
    var tokens = docTokens[doc].length;
    scores[doc] = scores[doc] * tokens / n;
  }

  return scores;
};

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @return {Object}
 * @memberOf Index
 */
elasticlunr.Index.prototype.toJSON = function () {
  var indexJson = {};
  this._fields.forEach(function (field) {
    indexJson[field] = this.index[field].toJSON();
  }, this);

  return {
    version: elasticlunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    index: indexJson,
    pipeline: this.pipeline.toJSON()
  };
};

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = elasticlunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
elasticlunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(this);
  plugin.apply(this, args);
};
/*!
 * elasticlunr.DocumentStore
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
 *
 * elasticlunr.DocumentStore store original JSON format documents that you could build search snippet by this original JSON document.
 *
 * user could choose whether original JSON format document should be store, if no configuration then document will be stored defaultly.
 * If user care more about the index size, user could select not store JSON documents, then this will has some defects, such as user
 * could not use JSON document to generate snippets of search results.
 * 
 * @param {Boolean} save If the original JSON document should be stored.
 * @constructor
 * @module
 */
elasticlunr.DocumentStore = function (save) {
  if (save === null || save === undefined) {
    this._save = true;
  } else {
    this._save = save;
  }

  this.docs = {};
  this.docInfo = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @return {elasticlunr.DocumentStore}
 */
elasticlunr.DocumentStore.load = function (serialisedData) {
  var store = new this;

  store.length = serialisedData.length;
  store.docs = serialisedData.docs;
  store.docInfo = serialisedData.docInfo;
  store._save = serialisedData.save;

  return store;
};

/**
 * check if current instance store the original doc
 *
 * @return {Boolean}
 */
elasticlunr.DocumentStore.prototype.isDocStored = function () {
  return this._save;
};

/**
 * Stores the given doc in the document store against the given id.
 * If docRef already exist, then update doc.
 * 
 * Document is store by original JSON format, then you could use original document to generate search snippets.
 *
 * @param {Integer|String} docRef The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (docRef, doc) {
  if (!this.hasDoc(docRef)) this.length++;

  if (this._save === true) {
    this.docs[docRef] = doc;
  } else {
    this.docs[docRef] = null;
  }
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 * 
 * If docRef not found, return null.
 * If user set not storing the documents, return null.
 *
 * @param {Integer|String} docRef The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.getDoc = function (docRef) {
  if (this.hasDoc(docRef) === false) return null;
  return this.docs[docRef];
};

/**
 * Checks whether the document store contains a key (docRef).
 *
 * @param {Integer|String} docRef The id to look up in the document store.
 * @return {Boolean}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (docRef) {
  return docRef in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Integer|String} docRef The id to remove from the document store.
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (docRef) {
  if (!this.hasDoc(docRef)) return;

  delete this.docs[docRef];
  delete this.docInfo[docRef];
  this.length--;
};

/**
 * Add field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 * 
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.addFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;
  
  if (!this.docInfo[docRef]) this.docInfo[docRef] = {};
  this.docInfo[docRef][fieldName] = length;
};

/**
 * Update field length of a document's field tokens from pipeline results.
 * The field length of a document is used to do field length normalization even without the original JSON document stored.
 * 
 * @param {Integer|String} docRef document's id or reference
 * @param {String} fieldName field name
 * @param {Integer} length field length
 */
elasticlunr.DocumentStore.prototype.updateFieldLength = function (docRef, fieldName, length) {
  if (docRef === null || docRef === undefined) return;
  if (this.hasDoc(docRef) == false) return;
  
  this.addFieldLength(docRef, fieldName, length);
};

/**
 * get field length of a document by docRef
 * 
 * @param {Integer|String} docRef document id or reference
 * @param {String} fieldName field name
 * @return {Integer} field length
 */
elasticlunr.DocumentStore.prototype.getFieldLength = function (docRef, fieldName) {
  if (docRef === null || docRef === undefined) return 0;

  if (!(docRef in this.docs)) return 0;
  if (!(fieldName in this.docInfo[docRef])) return 0;
  return this.docInfo[docRef][fieldName];
};

/**
 * Returns a JSON representation of the document store used for serialisation.
 *
 * @return {Object} JSON format
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.toJSON = function () {
  return {
    docs: this.docs,
    docInfo: this.docInfo,
    length: this.length,
    save: this._save
  };
};
/*!
 * elasticlunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return porterStemmer;
})();

elasticlunr.Pipeline.registerFunction(elasticlunr.stemmer, 'stemmer');
/*!
 * elasticlunr.stopWordFilter
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Wei Song
 */

/**
 * elasticlunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 * Currently this StopwordFilter using dictionary to do O(1) stop word filter.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.stopWordFilter = function (token) {
  if (token && elasticlunr.stopWordFilter.stopWords[token] !== true) {
    return token;
  }
};

/**
 * remove predefined stop words
 * if user want to use customized stop words, user could use this function to delete
 * all predefined stopwords.
 *
 * @return {null}
 */
elasticlunr.clearStopWords = function () {
  elasticlunr.stopWordFilter.stopWords = {};
};

/**
 * add customized stop words
 * user could use this function to add customized stop words
 * 
 * @params {Array} words customized stop words
 * @return {null}
 */
elasticlunr.addStopWords = function (words) {
  if (words == null || Array.isArray(words) === false) return;

  words.forEach(function (word) {
    elasticlunr.stopWordFilter.stopWords[word] = true;
  }, this);
};

elasticlunr.defaultStopWords = {
  "": true,
  "a": true,
  "able": true,
  "about": true,
  "across": true,
  "after": true,
  "all": true,
  "almost": true,
  "also": true,
  "am": true,
  "among": true,
  "an": true,
  "and": true,
  "any": true,
  "are": true,
  "as": true,
  "at": true,
  "be": true,
  "because": true,
  "been": true,
  "but": true,
  "by": true,
  "can": true,
  "cannot": true,
  "could": true,
  "dear": true,
  "did": true,
  "do": true,
  "does": true,
  "either": true,
  "else": true,
  "ever": true,
  "every": true,
  "for": true,
  "from": true,
  "get": true,
  "got": true,
  "had": true,
  "has": true,
  "have": true,
  "he": true,
  "her": true,
  "hers": true,
  "him": true,
  "his": true,
  "how": true,
  "however": true,
  "i": true,
  "if": true,
  "in": true,
  "into": true,
  "is": true,
  "it": true,
  "its": true,
  "just": true,
  "least": true,
  "let": true,
  "like": true,
  "likely": true,
  "may": true,
  "me": true,
  "might": true,
  "most": true,
  "must": true,
  "my": true,
  "neither": true,
  "no": true,
  "nor": true,
  "not": true,
  "of": true,
  "off": true,
  "often": true,
  "on": true,
  "only": true,
  "or": true,
  "other": true,
  "our": true,
  "own": true,
  "rather": true,
  "said": true,
  "say": true,
  "says": true,
  "she": true,
  "should": true,
  "since": true,
  "so": true,
  "some": true,
  "than": true,
  "that": true,
  "the": true,
  "their": true,
  "them": true,
  "then": true,
  "there": true,
  "these": true,
  "they": true,
  "this": true,
  "tis": true,
  "to": true,
  "too": true,
  "twas": true,
  "us": true,
  "wants": true,
  "was": true,
  "we": true,
  "were": true,
  "what": true,
  "when": true,
  "where": true,
  "which": true,
  "while": true,
  "who": true,
  "whom": true,
  "why": true,
  "will": true,
  "with": true,
  "would": true,
  "yet": true,
  "you": true,
  "your": true
};

elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;

elasticlunr.Pipeline.registerFunction(elasticlunr.stopWordFilter, 'stopWordFilter');
/*!
 * elasticlunr.trimmer
 * Copyright (C) 2016 Oliver Nightingale
 * Copyright (C) 2016 Oliver Nightingale
 */

/**
 * elasticlunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
elasticlunr.trimmer = function (token) {
  if (token === null || token === undefined) {
    throw new Error('token should not be undefined');
  }

  return token
    .replace(/^\W+/, '')
    .replace(/\W+$/, '');
};

elasticlunr.Pipeline.registerFunction(elasticlunr.trimmer, 'trimmer');
/*!
 * elasticlunr.InvertedIndex
 * Copyright (C) 2016 Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.InvertedIndex is used for efficient storing and lookup of the inverted index of token to document ref.
 *
 * @constructor
 */
elasticlunr.InvertedIndex = function () {
  this.root = { docs: {}, df: 0 };
  this.length = 0;
};

/**
 * Loads a previously serialised inverted index.
 *
 * @param {Object} serialisedData The serialised inverted index to load.
 * @return {elasticlunr.InvertedIndex}
 */
elasticlunr.InvertedIndex.load = function (serialisedData) {
  var idx = new this;

  idx.root = serialisedData.root;
  idx.length = serialisedData.length;

  return idx;
};

/**
 * Adds a {token: tokenInfo} pair to the inverted index.
 * If the token already exist, then update the tokenInfo.
 *
 * By default this function starts at the root of the current inverted index, however
 * it can start at any node of the inverted index if required.
 *
 * @param {String} token 
 * @param {Object} tokenInfo format: { ref: 1, tf: 2}
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
 * is used.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.addToken = function (token, tokenInfo, root) {
  var root = root || this.root,
      idx = 0;

  while (idx <= token.length - 1) {
    var key = token[idx];

    if (!(key in root)) root[key] = {docs: {}, df: 0};
    idx += 1;
    root = root[key];
  }

  var docRef = tokenInfo.ref;
  if (!root.docs[docRef]) {
    // if this doc not exist, then add this doc
    root.docs[docRef] = {tf: tokenInfo.tf};
    root.df += 1;
    this.length += 1;
  } else {
    // if this doc already exist, then update tokenInfo
    root.docs[docRef] = {tf: tokenInfo.tf};
  }
};

/**
 * Checks whether this key is in this elasticlunr.InvertedIndex.
 * 
 *
 * @param {String} token The token to check
 * @return {Boolean}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.hasToken = function (token) {
  if (!token) return false;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false;
    node = node[token[i]];
  }

  return true;
};

/**
 * Retrieve a node from the inverted index for a given token.
 * If token not found in this InvertedIndex, return null.
 * 
 *
 * @param {String} token The token to get the node for.
 * @return {Object}
 * @see InvertedIndex.prototype.get
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getNode = function (token) {
  if (!token) return null;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return null;
    node = node[token[i]];
  }

  return node;
};

/**
 * Retrieve the documents for a given token.
 * If token not found, return {}.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocs = function (token) {
  var node = this.getNode(token);
  if (node == null) {
    return {};
  }

  return node.docs;
};

/**
 * Retrieve term frequency of given token in given docRef.
 * If token or docRef not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @param {String|Integer} docRef
 * @return {Integer}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getTermFrequency = function (token, docRef) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  if (!(docRef in node.docs)) {
    return 0;
  }

  return node.docs[docRef].tf;
};

/**
 * Retrieve the document frequency of given token.
 * If token not found, return 0.
 *
 *
 * @param {String} token The token to get the documents for.
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocFreq = function (token) {
  var node = this.getNode(token);

  if (node == null) {
    return 0;
  }

  return node.df;
};

/**
 * Remove the document identified by ref from the token in the inverted index.
 *
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.removeToken = function (token, ref) {
  if (!token) return;
  var node = this.getNode(token);

  if (node == null) return;

  if (ref in node.docs) {
    delete node.docs[ref];
    node.df -= 1;
  }
};

/**
 * Find all the possible suffixes of the passed token using tokens currently in the inverted index.
 * If token not found, return empty Array.
 *
 * @param {String} token The token to expand.
 * @return {Array}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.expandToken = function (token, memo, root) {
  if (token == null || token == '') return [];
  var memo = memo || [];

  if (root == void 0) {
    root = this.getNode(token);
    if (root == null) return memo;
  }

  if (root.df > 0) memo.push(token);

  for (var key in root) {
    if (key === 'docs') continue;
    if (key === 'df') continue;
    this.expandToken(token + key, memo, root[key]);
  }

  return memo;
};

/**
 * Returns a representation of the inverted index ready for serialisation.
 *
 * @return {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.toJSON = function () {
  return {
    root: this.root,
    length: this.length
  };
};

/*!
 * elasticlunr.Configuration
 * Copyright (C) 2016 Wei Song
 */
 
 /** 
  * elasticlunr.Configuration is used to analyze the user search configuration.
  * 
  * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
  * 
  * Currently configuration supports:
  * 1. query-time boosting, user could set how to boost each field.
  * 2. boolean model chosing, user could choose which boolean model to use for each field.
  * 3. token expandation, user could set token expand to True to improve Recall. Default is False.
  * 
  * Query time boosting must be configured by field category, "boolean" model could be configured 
  * by both field category or globally as the following example. Field configuration for "boolean"
  * will overwrite global configuration.
  * Token expand could be configured both by field category or golbally. Local field configuration will
  * overwrite global configuration.
  * 
  * configuration example:
  * {
  *   fields:{ 
  *     title: {boost: 2},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "bool" field configuation overwrite global configuation example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * "expand" example:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   expand: true
  * }
  * 
  * "expand" example for field category:
  * {
  *   fields:{ 
  *     title: {boost: 2, bool: "AND", expand: true},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  * 
  * then, user could search with configuration to do query-time boosting.
  * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
  * 
  * 
  * @constructor
  * 
  * @param {String} config user configuration
  * @param {Array} fields fields of index instance
  * @module
  */
elasticlunr.Configuration = function (config, fields) {
  var config = config || '';

  if (fields == undefined || fields == null) {
    throw new Error('fields should not be null');
  }

  this.config = {};

  var userConfig;
  try {
    userConfig = JSON.parse(config);
    this.buildUserConfig(userConfig, fields);
  } catch (error) {
    elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
    this.buildDefaultConfig(fields);
  }
};

/**
 * Build default search configuration.
 * 
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
  this.reset();
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: "OR",
      expand: false
    };
  }, this);
};

/**
 * Build user configuration.
 * 
 * @param {JSON} config User JSON configuratoin
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildUserConfig = function (config, fields) {
  var global_bool = "OR";
  var global_expand = false;

  this.reset();
  if ('bool' in config) {
    global_bool = config['bool'] || global_bool;
  }

  if ('expand' in config) {
    global_expand = config['expand'] || global_expand;
  }

  if ('fields' in config) {
    for (var field in config['fields']) {
      if (fields.indexOf(field) > -1) {
        var field_config = config['fields'][field];
        var field_expand = global_expand;
        if (field_config.expand != undefined) {
          field_expand = field_config.expand;
        }

        this.config[field] = {
          boost: field_config.boost || 1,
          bool: field_config.bool || global_bool,
          expand: field_expand
        };
      } else {
        elasticlunr.utils.warn('field name in user configuration not found in index instance fields');
      }
    }
  } else {
    this.addAllFields2UserConfig(global_bool, global_expand, fields);
  }
};

/**
 * Add all fields to user search configuration.
 * 
 * @param {String} bool Boolean model
 * @param {String} expand Expand model
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.addAllFields2UserConfig = function (bool, expand, fields) {
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: bool,
      expand: expand
    };
  }, this);
};

/**
 * get current user configuration
 */
elasticlunr.Configuration.prototype.get = function () {
  return this.config;
};

/**
 * reset user search configuration.
 */
elasticlunr.Configuration.prototype.reset = function () {
  this.config = {};
};

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.elasticlunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return elasticlunr
  }))
})();

},{}],7:[function(require,module,exports){
module.exports={
  "iem": {
    "prop": {
      "heading": {
          "size":    "size and behavior",
          "messages": "messages",
          "label":   "label",
          "colors":  "colors"
      },
      "size_tt": "size of the iemgui",
      "size": "size",
      "select_size": "selection size",
      "select_size_tt": "size of the selection rectangle used to select and drag the object",
      "visible_width": "width",
      "visible_width_tt": "width of the rectangle",
      "visible_height": "height",
      "visible_height_tt": "height of the rectangle",
      "nonzero_value": "nonzero value",
      "nonzero_value_tt": "value to output when the toggle shows an 'x'",
      "flash_interrupt": "interrupt",
      "flash_interrupt_tt": "the amount of time (in milliseconds) that Pd will wait before interrupting the flashing of the button",
      "flash_hold":  "hold",
      "flash_hold_tt": "the amount of time (in milliseconds) that Pd will display the flash animation",
      "vu_scale":    "scale",
      "vu_scale_tt": "display scale (numbers) next to the meter",
      "width":       "width",
      "width_tt":     "width of the iemgui in pixels",
      "height":       "height",
      "height_tt":    "height of the iemgui in pixels",
      "minimum":      "minimum",
      "minimum_tt":   "smallest number to output. Anything lower will be replaced by this number",
      "maximum":      "maximum",
      "maximum_tt":   "largest number to output. Anything bigger will be replaced by this number",
      "number":       "number",
      "number_tt":    "total number of buttons",
      "init":         "init",
      "init_tt":      "save the state of the iemgui with the patch, and output a saved value when loaded (as if you had a [loadbang] connected to the input)",
      "log_scale":          "logarithmic scaling",
      "log_scale_tt":       "use logarithmic scale for values along the slider",
      "log_height":   "log height",
      "log_height_tt":   "the framus intersects with the ramistan approximately at the podernoster",
      "steady":       "steady on click",
      "steady_tt":    "don't move the slider when clicked. Only move it when dragging the mouse",
      "send":         "send symbol",
      "send_tt":      "symbol to send wireless messages to other iemguis or objects",
      "receive":      "receive symbol",
      "receive_tt":   "symbol to receive wireless messages from other iemguis or objects",
      "label":        "text",
      "label_tt":     "text to display next to this iemgui",
      "xoffset":      "x",
      "xoffset_tt":  "horizontal offset of the text relative to the top-left corner of the iemgui",
      "yoffset":      "y",
      "yoffset_tt":   "vertical offset for the text relative to the top-left corner of the iemgui",
      "font":         "font",
      "font_tt":      "which font to use when displaying the label text",
      "fontsize":     "size",
      "fontsize_tt":  "size of the font for the label",
      "bgcolor":      "background",
      "bgcolor_tt":   "background fill color for the iemgui",
      "fgcolor":      "foreground",
      "fgcolor_tt":   "foreground color for the iemgui",
      "label_color":        "label",
      "label_color_tt":     "color for the text label",
      "ok":           "Ok",
      "ok_tt":        "Apply the settings and close this dialog window",
      "apply":        "Apply",
      "apply_tt":     "Apply the settings without closing the dialog",
      "cancel":       "Cancel",
      "cancel_tt":    "Close the dialog window",
      "close":        "Close",
      "close_tt":     "Close the dialog window",
      "mknob_steps":  "# of steps",
      "mknob_steps_tt": "number of dial positions for the knob",
      "mknob_size":   "size",
      "mknob_size_tt": "size of the knob"
    }
  },
  "gatom": {
    "prop": {
      "gatom": "atom box",
      "dropdown": "dropdown menu",
      "label": "label",
      "label_left": "left",
      "label_right": "right",
      "label_tt": "text label to display next to this object",
      "labelpos": "label position",
      "labelpos_tt": "position the text label relative to the widget",
      "label_top": "top",
      "label_bottom": "bottom",
      "label_left": "left",
      "label_right": "right",
      "dropdown_outtype": "output",
      "dropdown_outtype_tt": "whether to output the index or the value",
      "width": "width",
      "width_tt": "width (in characters)"
    }
  },
  "menu": {
    "file": "File",
    "new": "New",
    "new_tt": "Create an empty Pd patch",
    "open": "Open",
    "open_tt": "Open one or more Pd files",
    "recent_files": "Recent Files",
    "recent_files_tt": "Open a recently opened Pd file",
    "clear_recent_files": "Clear List",
    "clear_recent_files_tt": "Clear the recent files list",
    "k12_demos": "K12 Demos",
    "k12_demos_tt": "Demo patches for use with K12 Mode",
    "save": "Save",
    "save_tt": "Save a Pd patch to disk",
    "saveas": "Save as...",
    "saveas_tt": "Save a Pd patch by manually choosing a filename",
    "print": "Print...",
    "print_tt": "Print a Pd patch, saving the result to a PDF file",
    "download": "Download",
    "message": "Message...",
    "message_tt": "Send a message directly to the running Pd instance",

    "close": "Close",
    "close_tt": "Close patch",

    "quit": "Quit",
    "quit_tt": "Close all patches and quit the program",

    "edit": "Edit",

    "undo": "Undo",
    "undo_tt": "Undo the last action performed on this patch",
    "redo": "Redo",
    "redo_tt": "if you clicked undo, this will restore the action that you performed",
    "cut": "Cut",
    "cut_tt": "Remove the currently selected object or objects on the canvas",
    "copy": "Copy",
    "copy_tt": "Copy selected objects to the clipboard",
    "paste": "Paste",
    "paste_tt": "Add any objects to the canvas which were previously cut or copied",
    "paste_clipboard": "Paste from Clipboard",
    "paste_clipboard_tt": "Paste Pd code from the clipboard to the canvas (use with caution!)",
    "duplicate": "Duplicate",
    "duplicate_tt": "Paste a copy of the current selection on the canvas (doesn't use clipboard)",
    "selectall": "Select All",
    "selectall_tt": "Select all objects in a patch",
    "reselect": "Reselect",
    "reselect_tt": "Restore the previous selection",
    "find": "Find",
    "find_tt": "Find text in the console output",
    "tidyup": "Tidy Up",
    "tidyup_tt": "Line up the selected objects in straight rows and columns",
    "clear_console": "Clear Console",
    "clear_console_tt": "Clear the Pd Window Console",
    "tofront": "Bring to Front",
    "tofront_tt": "Bring the selected object visually in front of all other objects",
    "toback": "Send to Back",
    "toback_tt": "Send the selected object visually behind all other objects",
    "font": "Font",
    "font_tt": "Font settings for this patch",
    "cordinspector": "Cord Inspector",
    "cordinspector_tt": "Move the mouse over cords to inspect the data moving between objects",
    "find": "Find",
    "find_tt": "Search for an object in this patch",
    "findagain": "Find Again",
    "findagain_tt": "Search for the next object matching the string you typed",
    "finderror": "Find Last Error",
    "finderror_tt": "If possible, find the last object which caused an error",
    "autotips": "Autotips",
    "autotips_tt": "Turn on tooltips in the patch",
    "editmode": "Editmode",
    "editmode_tt": "Toggle Editmode",
    "preferences": "Preferences",
    "preferences_tt": "Open a dialog window to configure the running instance of Pd",

    "view": "View",

    "zoomin": "Zoom In",
    "zoomin_tt": "Make the patch visually larger",
    "zoomout": "Zoom Out",
    "zoomout_tt": "Make the patch visually smaller",
    "zoomreset": "Reset Zoom",
    "zoomreset_tt": "Reset the zoom to the original level",
    "zoomoptimal": "Optimal Zoom",
    "zoomoptimal_tt": "Change the zoom to the optimal level which makes the entire patch visible (as far as possible)",
    "zoomhoriz": "Fit to Width",
    "zoomhoriz_tt": "Change the zoom level to make the patch fit horizontally",
    "zoomvert": "Fit to Height",
    "zoomvert_tt": "Change the zoom level to make the patch fit vertically",
    "fullscreen": "Fullscreen",

    "put": "Put",

    "object": "Object",
    "object_tt": "Add an empty object box to the canvas",
    "msgbox": "Message",
    "msg_tt": "Add a message box to the canvas",
    "number": "Number",
    "number_tt": "Add a box to type, scroll, and display a number on the canvas",
    "symbol": "Symbol",
    "symbol_tt": "Add a box to type and display a symbol on the canvas",
    "comment": "Comment",
    "comment_tt": "Write a comment on the canvas",
    "dropdown": "Dropdown",
    "dropdown_tt": "Dropdown menu",
    "bang": "Bang",
    "bang_tt": "Add a graphical button to the canvas for sending bang messages",
    "toggle": "Toggle",
    "bang_tt": "Add a graphical checkbox to the canvas for toggling between two values",
    "number2": "Number2",
    "number2_tt": "Add a fancy graphical box to the canvas for displaying and scrolling numbers",
    "vslider": "Vslider",
    "vslider_tt": "Add a vertical slider to the canvas for scrolling numbers",
    "hslider": "Hslider",
    "hslider_tt": "Add a horizontal slider to the canvas for scrolling numbers",
    "vradio": "Vradio",
    "vradio_tt": "Add a vertical group of radio buttons to the canvas for selecting a value",
    "hradio": "Hradio",
    "hradio_tt": "Add horizontal group of radio buttons to the canvas for selecting a value",
    "vu": "VU",
    "vu_tt": "Add a VU Meter to the canvas",
    "cnv": "Canvas Rectangle",
    "cnv_tt": "Add a boring rectangle to the canvas for displaying a rectangle",

    "graph": "Graph",
    "graph_tt": "Add an empty graph to the canvas",
    "array": "Array",
    "array_tt": "Add a visual array object to the canvas (with dialog for settings)",

    "windows": "Windows",

    "nextwin": "Next Window",
    "nextwin_tt": "Give focus to the next open window in the stacking order",
    "prevwin": "Previous Window",
    "prevwin_tt": "Give focus to the previous window in the stacking order",
    "parentwin": "Parent Window",
    "parentwin_tt": "give focus to the parent window of the current window",
    "visible_ancestor": "Closest Visible Ancestor",
    "visible_ancestor_tt": "give focus to the closest ancestor of this window that is currently visible",
    "pdwin": "Pd Window",
    "pdwin_tt": "Give focus to the main Pd window",

    "media": "Media",

    "audio_on": "Audio On",
    "audio_on_tt": "Turn audio on",
    "audio_off": "Audio Off",
    "audio_off_tt": "Turn audio off",
    "test": "Test Audio and Midi",
    "test_tt": "Open a patch to test your audio and midi are configured and functioning correctly",
    "loadmeter": "Load Meter",
    "loadmeter_tt": "Open a patch to monitor the CPU load of Pd (note: doesn't include the GUI)",

    "help": "Help",

    "about": "About Pd-L2ork",
    "about_tt": "Get information about this version of Pd",
    "manual": "Manual",
    "manual_tt": "Open the HTML manual for Pd",
    "browser": "Help Browser",
    "browser_tt": "Open a help browser to search for documentation and objects",
    "intro": "Quick Reference",
    "intro_tt": "Open a help patch listing Pd's most essential objects",
    "l2ork_list": "Pd-L2ork Mailing List",
    "l2ork_list_tt": "Open a link in a browser for Pd-L2ork Mailing List",
    "pd_list": "Pure Data Mailing Lists",
    "pd_list_tt": "Open a link in a browser for Pure Data Mailing Lists",
    "forums": "Forums",
    "forums_tt": "Open a link in a browser for the Pd Forum",
    "irc": "IRC Chat",
    "irc_tt": "Open a link in a browser for IRC Chat",
    "devtools": "Show DevTools",
    "devtools_tt": "Show the DevTools window (for debugging)"
  },
  "pd_window": {
    "find": {
      "placeholder": "Search in Console"
    }
  },
  "canvas": {
    "paste_clipboard_prompt": "Warning: you are about to paste Pd code that came from somewhere outside of Pd. Do you want to continue?",
    "save_dialog": {
      "prompt": "Do you want to save the changes you made in",
      "yes": "Yes",
      "yes_tt": "Write the changes to file before closing the patch",
      "no": "No",
      "no_tt": "Don't save any changes, just close the patch",
      "cancel": "Cancel",
      "cancel_tt": "Don't save any changes, and don't close the patch"
    },
    "find": {
      "placeholder": "Search in Canvas",
      "search": "Search",
      "search_tt": "Find next occurrence",
      "whole_word": "Match Whole Word"
    },
    "menu": {
      "props": "Properties",
      "open": "Open",
      "help": "Help",
      "front": "Bring to Front",
      "back": "Send to Back"
    },
    "prop": {
      "heading": {
        "gop": "appearance",
        "data_scaling": "data scaling",
        "size": "size",
        "viewbox_offsets": "viewbox offsets",
        "arrays": "array options"
      },
      "no_scroll": "hide scrollbars (experimental)",
      "no_scroll_tt": "hide window scrollbars",
      "no_menu": "hide menu (experimental)",
      "no_menu_tt": "hide window menu",
      "gop": "graph on parent",
      "gop_tt": "show the inner contents of this canvas in a rectangle on the containing canvas",
      "hide_name": "hide name and arguments",
      "hide_name_tt": "hide the text that appears in the object box",
      "gop_0": "Object",
      "gop_1": "Window",
      "gop_2": "Window (no text)",
      "x_pix": "width",
      "x_pix_tt": "width of the object",
      "y_pix": "height",
      "y_pix_tt": "height of the object",
      "x_scale": "x scale",
      "x_scale_tt": "horizontal scaling factor",
      "y_scale": "y scale",
      "y_scale_tt": "vertical scaling factor",
      "x_margin": "x offset",
      "x_margin_tt": "horizontal offset into the subpatch for the view area",
      "y_margin": "y offset",
      "y_margin_tt": "vertical offset into the subpatch for the view area",
      "x1": "left",
      "x1_tt": "x value at left edge of graph. (Set automatically for arrays)",
      "x2": "right",
      "x2_tt": "x value at right edge of graph. (Set automatically for arrays)",
      "y1": "top",
      "y1_tt": "y value at the top of the graph",
      "y2": "bottom",
      "y2_tt": "y value at the bottom of the graph",

      "array_name": "name",
      "array_name_tt": "receiver name for the array",
      "array_size": "size",
      "array_size_tt": "number of elements in the array",
      "array_polygon": "polygon",
      "array_polygon_tt": "the array trace is drawn as a polygon",
      "array_points": "points",
      "array_points_tt": "the array trace is drawn as horizontal line segments",
      "array_bezier": "Bezier curve",
      "array_bezier_tt": "the array trace is drawn as a Bezier curve",
      "array_bars": "bar graph",
      "array_bars_tt": "each element of the array is drawn as a bar in a bar graph",
      "array_save": "save contents",
      "array_save_tt": "save array contents with this patch",
      "array_jump": "jump on click",
      "array_jump_tt": "update the element to the position of the click",
      "array_style": "draw as:",
      "array_outline": "outline color",
      "array_outline_tt": "color for outline around the bars",
      "array_fill": "fill color",
      "array_fill_tt": "inner color of the bars",
      "array_in_existing_graph": "put in last graph",
      "array_in_existing_graph_tt": "draw the array inside the last graph that was created. This is a way to have multiple arrays drawn in the same graph.",
      "array_delete": "delete this array",
      "array_delete_tt": "delete this array (i.e., remove it from the graph) when you click Ok"
    }
  },
  "prefs": {
    "heading": {
      "startup": "Startup",
      "startup_tt": "startup settings",
      "gui": "GUI",
      "gui_tt": "settings for the user interface",
      "audio": "Audio",
      "audio_tt": "configure the audio devices",
      "midi": "MIDI",
      "midi_tt": "configure MIDI devices"
    },
    "startup": {
      "flags": "startup flags",
      "flags_tt": "Startup flags the program is invoked with; changes require a restart of the application to take effect",
      "libs": "Libraries",
      "libs_tt": "External libraries to be loaded on startup; changes require a restart of the application to take effect",
      "paths": "Search Paths",
      "paths_tt": "Search path for abstractions and externals",
      "new": "New",
      "new_tt": "Add an item after the selected one",
      "edit": "Edit",
      "edit_tt": "Edit the selected item",
      "del": "Delete",
      "del_tt": "Delete the selected item"
    },
    "gui": {
      "autopatch_yoffset_tt": "specify a distance in pixels from the bottom of the object to which the new object will be connected",
      "autopatch_yoffset": "custom autopatching y-offset",
      "autopatch_yoffset_checkbox_tt": "check to enable a custom autopatching y-offset",
      "presets": {
        "gui_preset": "GUI preset",
        "gui_preset_tt": "Collection of patch colors and styles",
        "default": "Default",
        "vanilla": "Vanilla",
        "vanilla_inverted": "Vanilla (Inverted)",
        "extended": "Pd-Extended",
        "inverted": "Inverted",
        "subdued": "Subdued",
        "strongbad": "Strongbad",
        "solarized": "Solarized",
        "solarized_inverted": "Solarized (Inverted)",
        "extended": "Extended",
        "c64": "C64",
        "footgun": "Footgun"
      },
      "zoom": {
        "save_zoom": "save/load zoom level with patch",
        "save_zoom_tt": "Save the current zoom level with the patch and restore it when reloading the patch"
      },
      "browser": {
        "browser_title": "Help browser settings (WARNING: changing these may affect startup times!)",
        "browser_doc": "help browser only searches the doc folder",
        "browser_doc_tt": "Only scan help patches in the doc folder for searchable keywords (faster)",
        "browser_path": "help browser also searches the help path",
        "browser_path_tt": "Also scan help patches in the user-defined help path for searchable keywords (slower)",
        "browser_init": "prepare the help index at application start",
        "browser_init_tt": "If checked, prepare the index for the help browser already when the application starts"
      }
    },
    "audio": {
      "api": "audio api",
      "api_tt": "audio backend or server to use to process audio",
      "sr": "sample rate",
      "sr_tt": "number of samples per second",
      "advance": "delay",
      "advance_tt": "delay",
      "blocksize": "blocksize",
      "blocksize_tt": "number of samples in a block to be delivered to or received from the audio api",
      "callback": "use callbacks",
      "callback_tt": "use Pd's callback interface for this API",
      "channels": "channels",
      "channels_tt": "number of channels for this device",
      "input_title": "Input Devices",
      "input_title_tt": "hardware devices used to get audio into Pd",
      "output_title": "Output Devices",
      "output_title_tt": "hardware devices to send audio from Pd"
    },
    "midi": {
      "api": "midi api",
      "api_tt": "midi backend or server used to communicate with midi devices",
      "alsa_in_ports": "input ports",
      "alsa_in_ports_tt": "maximum number of incoming midi port connections",
      "alsa_out_ports": "output ports",
      "alsa_out_ports_tt": "maximum number of outgoing midi ports from Pd",
      "input_title": "Input Devices",
      "input_title_tt": "hardware devices used to get midi data into Pd",
      "output_title": "Output Devices",
      "output_title_tt": "hardware devices to send midi data from Pd"
    },
    "ok": "Ok",
    "ok_tt": "Update the preferences and close the dialog",
    "apply": "Apply",
    "apply_tt": "Update preferences without closing this dialog",
    "cancel": "Cancel",
    "cancel_tt": "Cancel updating the preferences",
    "close": "Close",
    "close_tt": "Close the preferences dialog"
  },
  "font": {
    "prop": {
      "size": "font size",
      "8": "8",
      "10": "10",
      "12": "12",
      "16": "16",
      "24": "24",
      "36": "36",
      "close": "Close",
      "close_tt": "Close the font dialog"
    }
  },
  "search": {
    "browse": "browse the documentation",
    "search": "search",
    "building_index": "Building index...",
    "no_results": "No results found.",
    "search_placeholder": "Search Pd Docs"
  }
}

},{}],8:[function(require,module,exports){
// Grabbed hastily from https://github.com/jkroso/parse-svg-path
// MIT licensed so it's a good fit for Pd :)

module.exports = parse

/**
 * expected argument lengths
 * @type {Object}
 */

var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}

/**
 * segment pattern
 * @type {RegExp}
 */

var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig

/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * @param {String} path
 * @return {Array}
 */

function parse(path) {
	var data = []
	path.replace(segment, function(_, command, args){
		var type = command.toLowerCase()
		args = parseValues(args)

		// overloaded moveTo
		if (type == 'm' && args.length > 2) {
			data.push([command].concat(args.splice(0, 2)))
			type = 'l'
			command = command == 'm' ? 'l' : 'L'
		}

		while (true) {
			if (args.length == length[type]) {
				args.unshift(command)
				return data.push(args)
			}
			if (args.length < length[type]) throw new Error('malformed path data')
			data.push([command].concat(args.splice(0, length[type])))
		}
	})
	return data
}

var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

function parseValues(args) {
	var numbers = args.match(number)
	return numbers ? numbers.map(Number) : []
}

},{}],9:[function(require,module,exports){
(function (process){(function (){
"use strict";

var pdgui = require("./pdgui.js");
var pd_menus = require("./pd_menus.js");
var gui;

if(!pdgui.is_webapp()){
    var gui = require("nw.gui");
}


// Apply gui preset to this canvas
pdgui.skin.apply(window);

//var name = pdgui.last_loaded();

var l = pdgui.get_local_string;

function nw_window_focus_callback(name) {
    pdgui.set_focused_patchwin(name);
    // on OSX, update the menu on focus
    if (process.platform === "darwin") {
        nw_create_patch_window_menus(gui, window, canvas_events.get_id());
    }
}

function nw_window_blur_callback(name) {
    // Fake a mouseup event to keep from getting a dangling selection box
    if (canvas_events.get_state() === "normal") {
        pdgui.pdsend(name, "mouseup_fake");
    }
}

function nw_window_zoom(name, delta) {
    var z = gui.Window.get().zoomLevel;
    z += delta;
    if (z < 8 && z > -8) {
        gui.Window.get().zoomLevel = z;
        pdgui.pdsend(name, "zoom", z);
        pdgui.gui_canvas_get_scroll(name);
    }
}

var canvas_events = (function() {
    var name,
        filename,
        state,
        scalar_draggables = {}, // scalar child with the "drag" event enabled
        draggable_elem,         // last scalar we dragged
        draggable_label,        // kluge for handling [cnv] label/size anchors
        last_draggable_x,       // last x coord for the element we're dragging
        last_draggable_y,       // last y
        previous_state = "none", /* last state, excluding explicit 'none' */
        match_words_state = false,
        last_dropdown_menu_x,
        last_dropdown_menu_y,
        last_search_term = "",
        svg_view = "",		
        canvas_divs = {},	
        canvas_div = "",	
        canvas_div_x = 0,	
        canvas_div_y = 0,	
        canvas_div_scroll_left = 0,	
        canvas_div_scroll_top = 0,
        clicking = false,
        textbox = function () {
            return document.getElementById("new_object_textentry");
        },
        find_scalar_draggable = function (elem) {
            var ret = elem;
            while (ret) {
                if (scalar_draggables[ret.id]) {
                    return ret;
                }
                ret = (ret.parentNode && ret.parentNode.tagName === "g") ?
                    ret.parentNode : null;
            }
            return ret; // returning null if no parent group has a listener
        },
        target_is_scrollbar = function(evt) {
            // Don't send the event to Pd if we click on the scrollbars.
            // This is a bit fragile because we're suppressing on
            // HTMLHtmlElement which is too broad...
            if (evt.target.constructor.name === "HTMLHtmlElement") {
                return 1;
            } else {
                return 0;
            }
        },
        text_to_normalized_svg_path = function(text) {
            text = text.slice(4).trim()  // draw
                       .slice(4).trim()  // path
                       .slice(1).trim()  // d
                       .slice(1).trim(); // =
            if (text.slice(0, 1) === '"') {
                text = text.slice(1);
            }
            if (text.slice(-1) === '"') {
                text = text.slice(0, -1);
            }
            text = pdgui.parse_svg_path(text);
            return "draw path " + text.reduce(function (prev, curr) {
                return prev.concat(curr)
            }).join(" ");
        },
        text_to_fudi = function(text) {
            text = text.trim();
            // special case for draw path d="arbitrary path string" ...
            if (text.search(/^draw\s+path\s+d\s*=\s*"/) !== -1) {
                text = text_to_normalized_svg_path(text);
            }
            if(!pdgui.is_webapp()){
                // escape dollar signs
                text = text.replace(/(\$[0-9]+)/g, "\\$1");
            }
            // escape special $@ sign
            text = text.replace(/(\$@)/g, "\\$@");

            // escape "," and ";"
            text = text.replace(/(?!\\)(,|;)/g, " \\$1 ");

            // filter consecutive ascii32
            text = text.replace(/\u0020+/g, " ");
            return text;
        },
        string_to_array_of_chunks = function(msg) {
        // Convert a string (FUDI message) to an array of strings small enough
        // to fit in Pd's socketreceiver buffer of 4096 bytes
            var chunk_max = 1024,
                max_pd_string = 1000,
                left,
                in_array = [],
                out_array = [];
            if (msg.length <= chunk_max) {
                out_array.push([msg]);
            } else {
                in_array = msg.split(/[\s\n]/); // split on newlines or spaces
                while (in_array.length) {
                    left = in_array.slice(); // make a copy of in_array
                    if (left.toString().length > chunk_max) {
                        while (1) {
                            if (left.length < 2) {
                                pdgui.post("Warning: string truncated:");
                                pdgui.post(left.toString().
                                    match(/............................../g).join("\n")
                                );
                                break;
                            }
                            left = left.splice(0, left.length >> 1);
                            if (left.toString().length <= chunk_max) {
                                break;
                            }
                        }
                    }
                    // might need a check here for max_pd_string to warn
                    // user if a string is going to get truncated. (That's
                    // what max_pd_string is for above.)
                    out_array.push(left);
                    in_array = in_array.splice(left.length);
                }
            }
            return out_array;
        },
        might_be_a_pd_file = function(stuff_from_clipboard) {
            // Super-simplistic guess at whether the string from the clipboard
            // starts with Pd code. This is just meant as a convenience so that
            // stuff in the copy buffer that obviously isn't Pd code doesn't get
            // in the way when editing.
            var text = stuff_from_clipboard.trim(),
                one = text.charAt(0),
                two = text.charAt(1);
            return (one === "#" && (two === "N" || two === "X"));
        },
        grow_svg_for_element = function(elem) {
            // See if an element overflows the svg bbox, and
            // enlarge the svg to accommodate it.
            // Note: window.scrollX and window.scrollY might not work
            // with Android Chrome 43 and IE.
            var svg = document.getElementById("patchsvg");
            if (svg) {
                elem_bbox = elem.getBoundingClientRect(),
                svg_viewbox = svg.getAttribute("viewBox").split(" "),
                w = Math.max(elem_bbox.left + elem_bbox.width + window.scrollX,
                    svg_viewbox[2]),
                h = Math.max(elem_bbox.top + elem_bbox.height + window.scrollY,
                    svg_viewbox[3]);
                svg.setAttribute("viewBox",
                    [Math.min(elem_bbox.left, svg_viewbox[0]),
                    Math.min(elem_bbox.top, svg_viewbox[1]),
                    w,
                    h
                    ].join(" "));
                svg.setAttribute("width", w);
                svg.setAttribute("height", h);
            }
        },
        dropdown_index_to_pd = function(elem) {
            var highlighted = elem.querySelector(".highlighted");
            if (highlighted) {
                pdgui.pdsend(elem.getAttribute("data-callback"),
                    highlighted.getAttribute("data-index"));
            }
        },
        dropdown_clear_highlight = function() {
            var container = document.querySelector("#dropdown_list"),
                li_array = container.querySelectorAll("li");
            Array.prototype.forEach.call(li_array, function(e) {
                e.classList.remove("highlighted");
            });
        },
        dropdown_highlight_elem = function(elem, scroll) {
            var container = document.querySelector("#dropdown_list");
            if (!elem.classList.contains("highlighted")) {
                dropdown_clear_highlight();
                elem.classList.add("highlighted");
                // Make sure the highlighted element is in view
                if (scroll) {
                    if (elem.offsetTop < container.scrollTop
                        || elem.offsetTop + elem.offsetHeight >
                            container.scrollTop + container.offsetHeight) {
                            if (scroll === "up") {
                                // we can't usse elem.scrollIntoView() here
                                // because it may also change the scrollbar on
                                // the document, which in turn could change the
                                // pageX/pageY, for the mousemove event, which
                                // in turn would make it impossible for us to
                                // filter out unnecessary mousemove calls
                                //    elem.scrollIntoView();
                            container.scrollTop = elem.offsetTop;
                        } else if (scroll === "down") {
                            container.scrollTop = elem.offsetTop + elem.offsetHeight
                                - container.clientHeight;
                        }
                    }
                }
            }
        },
        events = {
            window_recalculate: function(evt){
                // Update current patch div
                canvas_div_x = Math.floor(document.getElementById("patch_div_"+name).getBoundingClientRect().left)
                canvas_divs[name].canvas_div_x = canvas_div_x;

                canvas_div_y = Math.floor(document.getElementById("patch_div_"+name).getBoundingClientRect().top)
                canvas_divs[name].canvas_div_y = canvas_div_y;

                // Update all canvas
                for (var div_name in canvas_divs) {	
	                if (canvas_divs.hasOwnProperty(div_name)) {
                        var new_x = Math.floor(document.getElementById("patch_div_"+div_name).getBoundingClientRect().left)
                        var new_y = Math.floor(document.getElementById("patch_div_"+div_name).getBoundingClientRect().top)
                        
                        canvas_divs[div_name].canvas_div_x = new_x;
	                    canvas_divs[div_name].canvas_div_y = new_y;                       
	                }	
                }
            },    
            onscroll: function(evt) {    
                if(pdgui.is_webapp()){
                    canvas_div_scroll_left = canvas_divs[name].canvas_div.scrollLeft;	
                    canvas_div_scroll_top = canvas_divs[name].canvas_div.scrollTop;	
                }            	
            },	
            mouseenter: function(evt) {	
                if(pdgui.is_webapp()){
 
                    var id = evt.srcElement.id	
                    var n = id.split('_');	

                    // Check if mousedown it's entering another canvas
                    if((clicking) && (name != n[n.length -1])){
                        events.mouseup(evt);
                    }

                    name = n[n.length -1];	
                    canvas_div_x = canvas_divs[name].canvas_div_x;	
                    canvas_div_y = canvas_divs[name].canvas_div_y;	
                    filename = canvas_divs[name].filename;	
                    svg_view = canvas_divs[name].svg_view;	
                    add_shortcuts(name);	
        
                    evt.stopPropagation();	
                    evt.preventDefault();	
        
                    load_canvas_menu_actions(name, filename);
                    events.window_recalculate(evt)
        
                    return false;
                }	
            },
            mouseleave: function(evt){
                if(pdgui.is_webapp()){
                    if(clicking){
                        document.addEventListener("mouseup", events.mouseup, false);
                    }
                }
            },
            mousemove: function(evt) {
                //pdgui.post("x: " + evt.pageX + " y: " + evt.pageY +
                //    " modifier: " + (evt.shiftKey + (pdgui.cmd_or_ctrl_key(evt) << 1)));

                var x_coord, y_coord;
                if(pdgui.is_webapp()){
                    x_coord = Math.floor(evt.pageX + svg_view.x + canvas_div_scroll_left - canvas_div_x);
                    y_coord = Math.floor(evt.pageY + svg_view.y + canvas_div_scroll_top - canvas_div_y);
                }else{
                    x_coord = evt.pageX + svg_view.x,
                    y_coord = evt.pageY + svg_view.y
                }

                pdgui.pdsend(name, "motion",
                    x_coord,
                    y_coord,
                    (evt.shiftKey + (pdgui.cmd_or_ctrl_key(evt) << 1))
                );
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },
            mousedown: function(evt) {
                if(pdgui.is_webapp()){
                    clicking = true;
                    var popup = document.getElementById("popup");
                    if(popup){
                        popup.parentNode.removeChild(popup);
                    }
                }
                var target_id, resize_type;
                var x_coord, y_coord;
                if (target_is_scrollbar(evt)) {
                    return;
                } else if (evt.target.parentNode &&
                    evt.target.parentNode.classList
                        .contains("clickable_resize_handle")) {
                    draggable_label =
                        evt.target.parentNode.classList.contains("move_handle");

                    // get id ("x123456etcgobj" without the "x" or "gobj")
                    target_id = (draggable_label ? "_l" : "_s") +
                        evt.target.parentNode.parentNode.id.slice(0,-4).slice(1);
                    last_draggable_x = evt.pageX + svg_view.x;

                    last_draggable_y = pdgui.is_webapp() ? evt.layerY : evt.pageY;
                    last_draggable_y += svg_view.y;

                    // Nasty-- we have to forward magic values from g_canvas.h
                    // defines in order to get the correct constrain behavior.
                    if (evt.target.classList.contains("constrain_top_right")) {
                        resize_type = 7; // CURSOR_EDITMODE_RESIZE_X
                    } else if (evt.target.classList
                        .contains("constrain_bottom_right")) {
                        resize_type = 10; // CURSOR_EDITMODE_RESIZE_Y
                    } else if (draggable_label) {
                        resize_type = 11; // CURSOR_EDITMODE_MOVE
                    } else {
                        resize_type = 8; // CURSOR_EDITMODE_RESIZE
                    }

                    // Even nastier-- we now must turn off the cursor styles
                    // so that moving the pointer outside the hotspot doesn't
                    // cause the cursor to change. This happens for the
                    // drag handle to move the gop red rectangle. Unlike
                    // the label handles, it doesn't get immediately
                    // destroyed upon receiving its callback below.
                    pdgui.toggle_drag_handle_cursors(evt.target.parentNode,
                        !!draggable_label, false);

                    if(pdgui.is_webapp()){
                        x_coord = Math.floor(evt.pageX + svg_view.x + canvas_div_scroll_left - canvas_div_x)
                        y_coord = Math.floor(evt.pageY + svg_view.y + canvas_div_scroll_top - canvas_div_y)
                    }else{
                        x_coord = (evt.pageX + svg_view.x),
                        y_coord = (evt.pageY + svg_view.y)
                    }

                    pdgui.pdsend(target_id, "_click", resize_type,
                        x_coord,
                        y_coord);
                    canvas_events.iemgui_label_drag();
                    return;
                }
                // tk events (and, therefore, Pd events) are one greater
                // than html5...
                var b = evt.button + 1;
                var mod, match_elem;
                // See if there are any draggable scalar shapes...
                if (Object.keys(scalar_draggables).length) {
                    // if so, see if our target is one of them...
                    match_elem = find_scalar_draggable(evt.target);
                    if (match_elem) {
                        // then set some state and turn on the drag events
                        draggable_elem = match_elem;
                        last_draggable_x = evt.pageX;
                        last_draggable_y = pdgui.is_webapp() ? evt.layerY : evt.pageY;
                        canvas_events.scalar_drag();
                    }
                }
                // For some reason right-click sends a modifier value of "8",
                // and canvas_doclick in g_editor.c depends on that value to
                // do the right thing.  So let's hack...
                if (b === 3 || (process.platform === "darwin" && evt.ctrlKey)) {
                    // right-click
                    mod = 8;
                } else {
                    mod = (evt.shiftKey + (pdgui.cmd_or_ctrl_key(evt) << 1));
                }

                if(pdgui.is_webapp()){
                    x_coord = Math.floor(evt.pageX + svg_view.x + canvas_div_scroll_left - canvas_div_x)
                    y_coord = Math.floor(evt.pageY + svg_view.y + canvas_div_scroll_top - canvas_div_y)
                }else{
                    x_coord = (evt.pageX + svg_view.x),
                    y_coord = (evt.pageY + svg_view.y)
                }
                pdgui.pdsend(name, "mouse",
                    x_coord,
                    y_coord,
                    b, mod
                );
                //evt.stopPropagation();
                //evt.preventDefault();
            },
            mouseup: function(evt) {
                //pdgui.post("mouseup: x: " +
                //    evt.pageX + " y: " + evt.pageY +
                //    " button: " + (evt.button + 1));
                var x_coord, y_coord
                
                if(pdgui.is_webapp()){
                    x_coord = Math.floor(evt.pageX + svg_view.x + canvas_div_scroll_left - canvas_div_x)
                    y_coord = Math.floor(evt.pageY + svg_view.y + canvas_div_scroll_top - canvas_div_y)
                    clicking = false;
                }else{
                    x_coord = (evt.pageX + svg_view.x),
                    y_coord = (evt.pageY + svg_view.y)
                }

                pdgui.pdsend(name, "mouseup",
                    x_coord,
                    y_coord,
                    (evt.button + 1)
                );
                evt.stopPropagation();
                evt.preventDefault();
            },
            keydown: function(evt) {
                pdgui.keydown(name, evt);
                // prevent the default behavior of scrolling
                // on arrow keys in editmode
                var patchid = pdgui.is_webapp() ? "#patchsvg_"+name : "#patchsvg"
                const elem = document.querySelector(patchid);
                if (elem && elem.classList.contains("editmode")) {
                    if ([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
                        evt.preventDefault();
                    }
                }
            },
            keypress: function(evt) {
                pdgui.keypress(name, evt);
                // Avoid prevent default on textareas
                if(evt.target.type !== "textarea"){
                    // Don't do things like scrolling on space, arrow keys, etc.
                    evt.preventDefault();
                }
            },
            keyup: function(evt) {
                pdgui.keyup(name, evt);
                evt.stopPropagation();
                evt.preventDefault();
            },
            text_mousemove: function(evt) {
                evt.stopPropagation();
                //evt.preventDefault();
                return false;
            },
            text_mousedown: function(evt) {
                if (textbox() !== evt.target && !target_is_scrollbar(evt)) {
                    utils.create_obj();
                    // send a mousedown and mouseup event to Pd to instantiate
                    // the object
                    events.mousedown(evt);
                    events.mouseup(evt);
                    canvas_events.normal();
                }
                evt.stopPropagation();
                //evt.preventDefault();
                return false;
            },
            text_mouseup: function(evt) {
                //pdgui.post("mouseup target is " +
                //    evt.target + " and textbox is " + textbox());
                //evt.stopPropagation();
                //evt.preventDefault();
                return false;
            },
            text_keydown: function(evt) {
                if (pdgui.is_webapp()) { // temporary fix
                    if (pdgui.cmd_or_ctrl_key(evt)) {
                        return false;
                    }
                }
                evt.stopPropagation();
                //evt.preventDefault();
                return false;
            },
            text_keyup: function(evt) {
                evt.stopPropagation();
                if (evt.keyCode === 13) {
                    grow_svg_for_element(textbox());
                }
                //evt.preventDefault();
                return false;
            },
            text_keypress: function(evt) {
                evt.stopPropagation();
                //evt.preventDefault();
                return false;
            },
            text_paste: function(evt) {
                evt.preventDefault();
                document.execCommand("insertText", false,
                    evt.clipboardData.getData("text"));
                grow_svg_for_element(textbox());
            },
            floating_text_click: function(evt) {
                if (target_is_scrollbar(evt)) {
                    return;
                }
                //pdgui.post("leaving floating mode");
                canvas_events.text();
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },
            floating_text_keypress: function(evt) {
                //pdgui.post("leaving floating mode");
                canvas_events.text();
                //evt.stopPropagation();
                //evt.preventDefault();
                //return false;
            },
            find_click: function(evt) {
                var id_find = pdgui.is_webapp() ? "canvas_find_text"+name : "canvas_find_text";
                var t = document.getElementById(id_find).value;
                if (t !== "") {
                    if (t === last_search_term) {
                        pdgui.pdsend(name, "findagain");
                    } else {
                        pdgui.pdsend(name, "find",
                        pdgui.encode_for_dialog(t),
                        match_words_state ? "1" : "0");
                    }
                }
                last_search_term = t;
            },
            find_keydown: function(evt) {
                if (evt.keyCode === 13) {
                    events.find_click(evt);
                }
            },
            scalar_draggable_mousemove: function(evt) {
                var new_x = evt.pageX,
                    new_y = pdgui.is_webapp() ? evt.layerY : evt.pageY,
                    dx = new_x - last_draggable_x,
                    dy = new_y - last_draggable_y,
                    // For the sake of convenience we're sending transformed
                    // dx and dy back to the user. If it turns out this is
                    // expensive we can either optimize this or just leave it
                    // up to the user to handle on their own. (But I should
                    // mention that it was non-trivial for me to do the math
                    // of inverting and multiplying the matrices from within
                    // a Pd patch. And I'm the author of this API. Make
                    // of that what you will...)
                    minv = draggable_elem.getCTM().inverse(),
                    tx = minv.a * dx + minv.c * dy,
                    ty = minv.b * dx + minv.d * dy;
                var obj = scalar_draggables[draggable_elem.id];
                pdgui.pdsend(obj.cid, "scalar_event", obj.scalar_sym,
                    obj.drawcommand_sym, obj.array_sym, obj.index,
                    obj.event_name, dx, dy, tx, ty);
                last_draggable_x = new_x;
                last_draggable_y = new_y;
            },
            scalar_draggable_mouseup: function(evt) {
                canvas_events.normal();
            },
            iemgui_label_mousemove: function(evt) {
                // This is very convoluted.
                // 1. In the generic mousedown handler we detect a click for a
                //    label handle, red gop rect handle, or [cnv] resize anchor.
                //    That sets this callback for dragging the handle.
                // 2. The mousedown also sends a message to Pd to tell it that
                //    a handle has been clicked. The message is forwarded
                //    to the relevant handle (a t_scalehandle in Pd).
                // 3. Pd erases *all* handles, then redraws the one for this
                //    object. That *eventually* leaves just the handle(s)
                //    for the current object. This is either a single handle
                //    (for most iemguis and the canvas red rect), or possibly
                //    two handles for [cnv]-- one for resizing and one for its
                //    label.
                // 4. This function responds to mouse motion. It looks up
                //    the current handle by tag (using the draggable_lable
                //    kludge to choose between the cnv_resize_handle and
                //    everything else), sends a message to Pd to alter the
                //    object/label accordingly, then displaces the little
                //    handle itself. We unfortunately can't merely keep a
                //    reference to the handle element because in #3 Pd will
                //    have erased it.
                // Pro: I don't have to dig into the C code to get this to
                //      work.
                // Con: It's inherently racy. #3 and #4 happen at the same
                //      time, so it's possible to apply dx/dy to the wrong
                //      handle (which will eventually get erased by Pd anyway).
                //      Anyhow, this is all very bad, but it works so it's
                //      at least not the worst of all possible worlds.
                var evt_y = pdgui.is_webapp() ? evt.layerY : evt.pageY;
                var dx = (evt.pageX + svg_view.x) - last_draggable_x,
                    dy = (evt_y + svg_view.y) - last_draggable_y,
                    handle_elem = document.querySelector(
                        draggable_label ?
                            ".move_handle" :
                            ".cnv_resize_handle"
                        ),
                    target_id = (draggable_label ? "_l" : "_s") +
                        handle_elem.parentNode.id.slice(0,-4).slice(1),
                    is_canvas_gop_rect = document.
                        getElementsByClassName("gop_drag_handle").length ?
                        true : false;

                last_draggable_x = evt.pageX + svg_view.x;
                last_draggable_y = evt_y + svg_view.y;

                pdgui.pdsend(target_id, "_motion",
                    (evt.pageX + svg_view.x),
                    (evt_y + svg_view.y));
            },
            iemgui_label_mouseup: function(evt) {
                //pdgui.post("lifting the mousebutton on an iemgui label");
                // Set last state (none doesn't count as a state)
                //pdgui.post("previous state is "
                //    + canvas_events.get_previous_state());
                var label_handle = document.querySelector(".move_handle");
                var cnv_resize_handle =
                    document.querySelector(".cnv_resize_handle");
                // Restore our cursor bindings for any drag handles that
                // happen to exist
                if (label_handle) {
                    pdgui.toggle_drag_handle_cursors(label_handle,
                        true, true);
                }
                if (cnv_resize_handle) {
                    pdgui.toggle_drag_handle_cursors(cnv_resize_handle,
                        false, true);
                }
                canvas_events[canvas_events.get_previous_state()]();
            },
            dropdown_menu_keydown: function(evt) {
                var select_elem = document.querySelector("#dropdown_list"),
                    li;
                switch(evt.keyCode) {
                    case 13:
                    case 32:
                        dropdown_index_to_pd(select_elem);
                        select_elem.style.setProperty("display", "none");
                        canvas_events.normal();
                        break;
                    case 27: // escape
                        select_elem.style.setProperty("display", "none");
                        canvas_events.normal();
                        break;
                    case 38: // up
                        li = select_elem.querySelector(".highlighted");
                        li = li.previousElementSibling ||
                             li.parentElement.lastElementChild;
                        dropdown_highlight_elem(li, "up");
                        evt.preventDefault();
                        break;
                    case 40: // down
                        li = select_elem.querySelector(".highlighted");
                        li = li.nextElementSibling ||
                             li.parentElement.firstElementChild;
                        dropdown_highlight_elem(li, "down");
                        evt.preventDefault();
                        break;
                    default:
                }
            },
            dropdown_menu_keypress: function(evt) {
                var li_nodes = document.querySelectorAll("#dropdown_list li"),
                    string_array = [],
                    highlighted,
                    highlighted_index,
                    match,
                    offset;
                highlighted = document
                    .querySelector("#dropdown_list .highlighted");
                if (highlighted) {
                    highlighted_index =
                        +document.querySelector("#dropdown_list .highlighted")
                            .getAttribute("data-index");
                    offset = highlighted_index + 1;
                } else {
                    highlighted_index = 1;
                    offset = 2;
                }
                Array.prototype.forEach.call(li_nodes, function(e, i, a) {
                    var s = a[(i + offset) % a.length];
                    string_array.push(s.textContent.trim());
                });
                match = string_array.indexOf(
                    string_array.find(function(e) {
                        return e.charAt(0).toLowerCase() ===
                            String.fromCharCode(evt.charCode).toLowerCase();
                }));
                if (match !== undefined) {
                    match = (match + offset) % li_nodes.length;
                    if (match !== highlighted_index) {
                        dropdown_highlight_elem(li_nodes[match],
                            match < highlighted_index ? "up" : "down");
                    }
                }
            },
            dropdown_menu_mousedown: function(evt) {
                var select_elem = document.querySelector("#dropdown_list"),
                    in_dropdown = evt.target;
                while (in_dropdown) {
                    if (in_dropdown.id === "dropdown_list") {
                        break;
                    }
                    in_dropdown = in_dropdown.parentNode;
                }
                // Allow scrollbar click and drag without closing the menu
                if (in_dropdown &&
                        evt.pageX - select_elem.offsetLeft >
                        select_elem.clientWidth) {
                    return;
                }
                // Special case for OSX, where the scrollbar doesn't take
                // up any extra space
                if (nw.process.platform === "darwin"
                    && (evt.target.id === "dropdown_list")) {
                    return;
                }
                if (evt.target.parentNode
                    && evt.target.parentNode.parentNode
                    && evt.target.parentNode.parentNode.id === "dropdown_list") {
                    dropdown_highlight_elem(evt.target);
                }
                // This selects whatever item is highlighted even
                // if we click outside the menu. Might be better to
                // cancel in that case.
                dropdown_index_to_pd(select_elem);
                select_elem.style.setProperty("display", "none");
                canvas_events.normal();
            },
            dropdown_menu_mouseup: function(evt) {
                var i, select_elem;
                // This can be triggered if the user keeps the mouse down
                // to highlight an element and releases the mouse button to
                // choose that element
                if (evt.target.parentNode
                    && evt.target.parentNode.parentNode
                    && evt.target.parentNode.parentNode.id === "dropdown_list") {
                    select_elem = document.querySelector("#dropdown_list");
                    dropdown_index_to_pd(select_elem);
                    select_elem.style.setProperty("display", "none");
                    canvas_events.normal();
                }
            },
            dropdown_menu_wheel: function(evt) {
                // Here we generate bogus mouse coords so that
                // we can break through the filter below if we're
                // using the mouse wheel to scroll in the list.
                last_dropdown_menu_x = Number.MIN_VALUE;
                last_dropdown_menu_y = Number.MIN_VALUE;
            },
            dropdown_menu_mousemove: function(evt) {
                // For whatever reason, Chromium decides to trigger the
                // mousemove/mouseenter/mouseover events if the element
                // underneath it changes (or for mousemove, if the element
                // moves at all). Unfortunately that means we have to track
                // the mouse position the entire time to filter out the
                // true mousemove events from the ones Chromium generates
                // when a scroll event changes the element under the mouse.
                if (evt.pageX !== last_dropdown_menu_x
                    || evt.pageY !== last_dropdown_menu_y) {
                    if (evt.target.parentNode
                        && evt.target.parentNode.parentNode
                        && evt.target.parentNode.parentNode.id === "dropdown_list") {
                        dropdown_highlight_elem(evt.target);
                    } else {
                        dropdown_clear_highlight();
                    }
                }
                last_dropdown_menu_x = evt.pageX;
                last_dropdown_menu_y = evt.pageY;
            }
        },
        utils = {
            create_obj: function() {
                // Yes: I _really_ want .innerText and NOT .textContent
                // here.  I want those newlines: although that isn't
                // standard in Pd-Vanilla, Pd-l2ork uses and preserves
                // them inside comments
                var fudi_msg = text_to_fudi(textbox().innerText),
                    fudi_array = string_to_array_of_chunks(fudi_msg),
                    i;
                for (i = 0; i < fudi_array.length; i++) {
                    pdgui.pdsend(name, "obj_addtobuf", fudi_array[i].join(" "));
                }
                pdgui.pdsend(name, "obj_buftotext");
            }
        }
    ;

    return {
        none: function(div_name) {
            if (div_name === undefined) div_name = name;	
            var div = canvas_divs[div_name];
                
            var evt_name, prop;
            if (state !== "none") {
                previous_state = state;
            }
            state = "none";
            for (prop in events) {
                if (events.hasOwnProperty(prop)) {
                    evt_name = prop.split("_");
                    evt_name = evt_name[evt_name.length - 1];

                    if(pdgui.is_webapp() && div !== undefined){
                        div.canvas_div.removeEventListener(evt_name, events[prop], false);
                    }else{
                        document.removeEventListener(evt_name, events[prop], false);
                    }
                }
            }
        },
        normal: function() {
            canvas_events.none();

            if(pdgui.is_webapp()){
                for (var div_name in canvas_divs) {	
	                if (canvas_divs.hasOwnProperty(div_name)) { 	
	                    var div = canvas_divs[div_name];	
	                    canvas_events.none(div_name);	
	                    div.canvas_div.addEventListener("scroll", events.onscroll, false);	
	                    div.canvas_div.addEventListener("mouseenter", events.mouseenter, false);	
	                    div.canvas_div.addEventListener("mouseleave", events.mouseleave, false);
                        div.canvas_div.addEventListener("mousemove", events.mousemove, false);	
	                    div.canvas_div.addEventListener("keydown", events.keydown, false);	
	                    div.canvas_div.addEventListener("keypress", events.keypress, false);	
	                    div.canvas_div.addEventListener("keyup", events.keyup, false);	
	                    div.canvas_div.addEventListener("mousedown", events.mousedown, false);	
	                    div.canvas_div.addEventListener("mouseup", events.mouseup, false);    	
	                }	
                }   
                // Handle offset based on page
                var container = document.getElementById("container-app");
                container.addEventListener("scroll", events.window_recalculate, false);

                var canvas_content = document.getElementById("canvas-content");
                canvas_content.addEventListener("scroll", events.window_recalculate, false);

                var patches = document.getElementsByClassName("patch");
                for (var i = 0; i < patches.length; i++) {
                    patches[i].addEventListener("scroll", events.window_recalculate, false);
                }

                // Add listeners to keyevents
                document.addEventListener("keydown", events.keydown, false);
                document.addEventListener("keyup", events.keyup, false);
            }else{
                document.addEventListener("mousemove", events.mousemove, false);
                document.addEventListener("keydown", events.keydown, false);
                document.addEventListener("keypress", events.keypress, false);
                document.addEventListener("keyup", events.keyup, false);
                document.addEventListener("mousedown", events.mousedown, false);
                document.addEventListener("mouseup", events.mouseup, false);

                set_edit_menu_modals(true);
            }
            state = "normal";

        },
        scalar_drag: function() {
            // This scalar_drag is a prototype for moving more of the editing
            // environment directly to the GUI.  At the moment we're leaving
            // the other "normal" events live, since behavior like editmode
            // selection still happens from the Pd engine.
            //this.none();
            if(pdgui.is_webapp()){
                svg.addEventListener("mousemove", events.scalar_draggable_mousemove, false);	
	            svg.addEventListener("mouseup", events.scalar_draggable_mouseup, false);
            }else{
                document.addEventListener("mousemove", events.scalar_draggable_mousemove, false);
                document.addEventListener("mouseup", events.scalar_draggable_mouseup, false);
            }
        },
        iemgui_label_drag: function() {
            // This is a workaround for dragging iemgui labels. Resizing iemguis
            // currently happens in Pd (canvas_doclick and canvas_motion). (Look
            // for MA_RESIZE.)
            // The exception is my_canvas, which is weird because the visible
            // rectangle extends past the bbox that it reports to Pd.
            // Unfortunately that means a lot of work to treat it separately.
            canvas_events.none();

            if(pdgui.is_webapp()){
                svg.addEventListener("mousemove",	
                    events.iemgui_label_mousemove, false);
                svg.addEventListener("mouseup",	
	                events.iemgui_label_mouseup, false);
            }else{
                document.addEventListener("mousemove",
                    events.iemgui_label_mousemove, false);
                document.addEventListener("mouseup",
                    events.iemgui_label_mouseup, false);
            }
        },
        text: function() {
            canvas_events.none();

            if(pdgui.is_webapp()){
                var div = canvas_divs[name];	
		
	            div.canvas_div.addEventListener("mousemove", events.text_mousemove, false);	
	            div.canvas_div.addEventListener("keydown", events.text_keydown, false);	
	            div.canvas_div.addEventListener("keypress", events.text_keypress, false);	
	            div.canvas_div.addEventListener("keyup", events.text_keyup, false);	
	            div.canvas_div.addEventListener("paste", events.text_paste, false);	
	            div.canvas_div.addEventListener("mousedown", events.text_mousedown, false);	
	            div.canvas_div.addEventListener("mouseup", events.text_mouseup, false);
            }else{
                document.addEventListener("mousemove", events.text_mousemove, false);
                document.addEventListener("keydown", events.text_keydown, false);
                document.addEventListener("keypress", events.text_keypress, false);
                document.addEventListener("keyup", events.text_keyup, false);
                document.addEventListener("paste", events.text_paste, false);
                document.addEventListener("mousedown", events.text_mousedown, false);
                document.addEventListener("mouseup", events.text_mouseup, false);    
            }

            state = "text";
            set_edit_menu_modals(false);
        },
        floating_text: function() {
            canvas_events.none();
            canvas_events.text();

            if(pdgui.is_webapp()){
                var div = canvas_divs[name];	
		
	            div.canvas_div.removeEventListener("mousedown", events.text_mousedown, false);	
	            div.canvas_div.removeEventListener("mouseup", events.text_mouseup, false);	
	            div.canvas_div.removeEventListener("keypress", events.text_keypress, false);	
	            div.canvas_div.removeEventListener("mousemove", events.text_mousemove, false);	
	            	
	            div.canvas_div.addEventListener("click", events.floating_text_click, false);	
	            div.canvas_div.addEventListener("keypress", events.floating_text_keypress, false);	
	            div.canvas_div.addEventListener("mousemove", events.mousemove, false);
            }else{
                document.removeEventListener("mousedown", events.text_mousedown, false);
                document.removeEventListener("mouseup", events.text_mouseup, false);
                document.removeEventListener("keypress", events.text_keypress, false);
                document.removeEventListener("mousemove", events.text_mousemove, false);
                document.addEventListener("click", events.floating_text_click, false);
                document.addEventListener("keypress", events.floating_text_keypress, false);
                document.addEventListener("mousemove", events.mousemove, false);
            }

            state = "floating_text";
            set_edit_menu_modals(false);
        },
        dropdown_menu: function() {
            canvas_events.none();

            if(pdgui.is_webapp()){
                svg.addEventListener("mousedown", events.dropdown_menu_mousedown, false);	
	            svg.addEventListener("mouseup", events.dropdown_menu_mouseup, false);	
	            svg.addEventListener("mousemove", events.dropdown_menu_mousemove, false);	
	            svg.addEventListener("keydown", events.dropdown_menu_keydown, false);	
	            svg.addEventListener("keypress", events.dropdown_menu_keypress, false);
            }else{
                document.addEventListener("mousedown", events.dropdown_menu_mousedown, false);
                document.addEventListener("mouseup", events.dropdown_menu_mouseup, false);
                document.addEventListener("mousemove", events.dropdown_menu_mousemove, false);
                document.addEventListener("keydown", events.dropdown_menu_keydown, false);
                document.addEventListener("keypress", events.dropdown_menu_keypress, false);    
            }
            document.querySelector("#dropdown_list")
                .addEventListener("wheel", events.dropdown_menu_wheel, false);
        },
        search: function() {
            if(pdgui.is_webapp()){
                var input_find = document.getElementById("canvas_find_text"+name);	
	            input_find.addEventListener("keydown", events.find_keydown, false);	
		
	            var button_find = document.getElementById("canvas_find_button"+name);	
	            button_find.addEventListener("click", events.find_click);
            }else{
                canvas_events.none();
                document.addEventListener("keydown", events.find_keydown, false);
            }
            state = "search";
        },
        register: function(n, attrs) {
            name = n;

            if(pdgui.is_webapp()){
                filename = attrs.name,	
	            canvas_div = document.getElementById("patch_div_"+n)	
	            var canvas_div_scroll_left = canvas_div.scrollLeft;	
	            var canvas_div_scroll_top = canvas_div.scrollTop;	
	            canvas_div_x = Math.floor(document.getElementById("patch_div_"+n).getBoundingClientRect().left); 	
	            canvas_div_y = document.getElementById("patch_div_"+n).getBoundingClientRect().top	
	            svg_view = document.getElementById("patchsvg_"+n).viewBox.baseVal,	
	            	
	            canvas_divs[n] = {	
	                svg_view,	
	                canvas_div,	
	                canvas_div_x,	
	                canvas_div_y,	
	                canvas_div_scroll_left,	
	                canvas_div_scroll_top,	
	                filename	
                }
            }else{
                svg_view = document.getElementById("patchsvg").viewBox.baseVal;
            }
        },
        get_id: function() {
            return name;
        },
        get_state: function() {
            return state;
        },
        get_previous_state: function() {
            return previous_state;
        },
        create_obj: function() {
            utils.create_obj();
        },
        match_words: function(state) {
            match_words_state = state;
        },
        find_reset: function() {
            last_search_term = "";
        },
        add_scalar_draggable: function(cid, tag, scalar_sym, drawcommand_sym,
            event_name, array_sym, index) {
            scalar_draggables[tag] = {
                cid: cid,
                scalar_sym: scalar_sym,
                drawcommand_sym: drawcommand_sym,
                event_name: event_name,
                array_sym: array_sym,
                index: index
            };
        },
        remove_scalar_draggable: function(id) {
            if (scalar_draggables[id]) {
                scalar_draggables[id] = null;
            }
        },
        save_and_close: function() {
            pdgui.pdsend(name, "menusave", 1);
        },
        close_without_saving: function(cid, force) {
            pdgui.pdsend(name, "dirty 0");
            pdgui.pdsend(cid, "menuclose", force);
        },
        close_save_dialog: function() {
            document.getElementById("save_before_quit").close();
        },
        paste_from_pd_file: function(name, clipboard_data) {
            var line, lines, i, pd_message;
            // This lets the user copy some Pd source file from another
            // application and paste the code directly into a canvas window
            // (empty or otherwise). It does a quick check to make sure the OS
            // clipboard is holding text that could conceivably be Pd source
            // code. But that's not 100% foolproof and the engine might crash
            // and burn, so be careful! :)

            // We only want to check the external buffer and/or send a "paste"
            // event to Pd if the canvas is in a "normal" state.
            if (canvas_events.get_state() !== "normal") {
                return;
            }
            if (!might_be_a_pd_file(clipboard_data)) {
                pdgui.post("paste error: clipboard doesn't appear to contain valid Pd code");
                return;
            }

            // clear the buffer
            pdgui.pdsend(name, "copyfromexternalbuffer");
            pd_message = "";
            lines = clipboard_data.split("\n");
            for (i = 0; i < lines.length; i++) {
                line = lines[i];
                // process pd_message if it ends with a semicolon that
                // isn't preceded by a backslash
                if (line.slice(-1) === ";" &&
                    (line.length < 2 || line.slice(-2, -1) !== "\\")) {
                    if (pd_message === "") {
                        pd_message = line;
                    } else {
                        pd_message = pd_message + " " + line;
                    }
                    pdgui.pdsend(name, "copyfromexternalbuffer", pd_message);
                    pd_message = "";
                } else {
                    pd_message = pd_message + " " + line;
                    pd_message = pd_message.replace(/\n/g, "");
                }
            }
            // This signals to the engine that we're done filling the external
            // buffer, that it can do necessary checks and call some internal
            // cleanup code.

            pdgui.pdsend(name, "copyfromexternalbuffer");
            // Send a canvas "paste" message to Pd
            pdgui.pdsend(name, "paste");
            // Finally, make sure to reset the buffer so that next time around
            // we start from a clean slate. (Otherwise, the engine will just
            // add stuff to the existing buffer contents.)
            pdgui.pdsend(name, "reset_copyfromexternalbuffer");
        },
        init: function() {
            document.getElementById("saveDialog")
                .setAttribute("nwworkingdir", pdgui.get_pwd());
            document.getElementById("fileDialog")
                .setAttribute("nwworkingdir", pdgui.get_pwd());
            document.getElementById("fileDialog").setAttribute("accept",
                Object.keys(pdgui.pd_filetypes).toString());
            // Dialog events -- these are set elsewhere now because of a bug
            // with nwworkingdir
            document.querySelector("#saveDialog").addEventListener("change",
                function(evt) {
                    pdgui.saveas_callback(name, evt.target.value, 0);
                    // reset value so that we can open the same file twice
                    evt.target.value = null;
                    console.log("tried to save something");
                }, false
            );
            // Whoa-- huge workaround! Right now we're getting
            // the popup menu the way Pd Vanilla does it:
            // 1) send a mouse(down) message to Pd
            // 2) Pd checks whether it wants to send us a popup
            // 3) Pd checks what popup menu items are available for obj/canvas
            // 4) Pd sends GUI back a message with this info
            // 5) GUI finally displays the popup
            // 6) GUI keeps a _global_ _variable_ to remember the popup coords
            // 7) User clicks an option in the popup
            // 8) GUI sends a message back to Pd with the popup index and coords
            // 9) Pd walks the linked list of objects to look up the object
            // 10) Pd asks the object if it reacts to popups, and if it reacts
            //     to the selected item in the popup
            // 11) Pd sends a message to the relevant object for the item in
            //     question
            // nw.js has a nice little "contextmenu" event handler, but it's too
            // difficult to use when passing between GUI and Pd (twice). In the
            // future we should do all popup menu event handling in the GUI,
            // and only pass a message to Pd when the user has clicked an item.
            // For now, however, we just turn off its default behavior and
            // control it with a bunch of complicated callbacks.
            var elemt = pdgui.is_webapp() ? svg : document;
            elemt.addEventListener("contextmenu", function(evt) {
                console.log("got a context menu evt...");
                evt.preventDefault();
            });

            // Cut event
            elemt.addEventListener("cut", function(evt) {
                // This event doesn't currently get called because the
                // nw menubar receives the event and doesn't propagate
                // to the DOM. But if we add the ability to toggle menubar
                // display, we might need to rely on this listener.
                pdgui.pdsend(name, "cut");
            });

            // Copy event
            elemt.addEventListener("copy", function(evt) {
                // On OSX, this event gets triggered when we're editing
                // inside an object/message box. So we only forward the
                // copy message to Pd if we're in a "normal" canvas state
                if (canvas_events.get_state() === "normal") {
                    pdgui.pdsend(name, "copy");
                }
            });

            // Listen to paste event
            // XXXTODO: Not sure whether this is even needed any more, as the
            // paste-from-clipboard functionality has been moved to its own menu
            // option. So this code may possibly be removed in the future. -ag
            elemt.addEventListener("paste", function(evt) {
                if (canvas_events.get_state() !== "normal") {
                    return;
                }
                // Send a canvas "paste" message to Pd
                pdgui.pdsend(name, "paste");
            });

            // MouseWheel event for zooming
            elemt.addEventListener("wheel", function(evt) {
                var d = { deltaX: 0, deltaY: 0, deltaZ: 0 };
                Object.keys(d).forEach(function(key) {
                    if (evt[key] < 0) {
                        d[key] = -1;
                    } else if (evt[key] > 0) {
                        d[key] = 1;
                    } else {
                        d[key] = 0;
                    }
                });
                if (pdgui.cmd_or_ctrl_key(evt)) {
                    // scroll up for zoom-in, down for zoom-out
                    nw_window_zoom(name, -d.deltaY);
                }
                // Send a message on to Pd for the [mousewheel] legacy object
                // (in the future we can refcount to prevent forwarding
                // these messages when there's no extant receiver)
                pdgui.pdsend(name, "legacy_mousewheel",
                    d.deltaX, d.deltaY, d.deltaZ);
            });

            // The following is commented out because we have to set the
            // event listener inside nw_create_pd_window_menus due to a
            // bug with nwworkingdir

            //document.querySelector("#fileDialog").addEventListener("change",
            //    function(evt) {
            //        var file_array = this.value;
            //        // reset value so that we can open the same file twice
            //        this.value = null;
            //        pdgui.menu_open(file_array);
            //        console.log("tried to open something\n\n\n\n\n\n\n\n");
            //    }, false
            //);
            document.querySelector("#openpanel_dialog")
                .addEventListener("change", function(evt) {
                    var file_string = evt.target.value;
                    // reset value so that we can open the same file twice
                    evt.target.value = null;
                    pdgui.file_dialog_callback(file_string);
                    console.log("tried to openpanel something");
                }, false
            );
            document.querySelector("#savepanel_dialog")
                .addEventListener("change", function(evt) {
                    var file_string = evt.target.value;
                    // reset value so that we can open the same file twice
                    evt.target.value = null;
                    pdgui.file_dialog_callback(file_string);
                    console.log("tried to savepanel something");
                }, false
            );
            document.querySelector("#canvas_find_text")
                .addEventListener("focusin", canvas_events.search, false
            );

            // disable drag and drop for the time being
            window.addEventListener("dragover", function (evt) {
                evt.preventDefault();
            }, false);
            window.addEventListener("drop", function (evt) {
                evt.preventDefault();
            }, false);

            // Add placeholder text... this all needs to be collected into an 
            // add_events function similiar to the one in index.js
            document.querySelector("#canvas_find_text").placeholder =
                l("canvas.find.placeholder");
            document.querySelector("#canvas_find_text").addEventListener("blur",
                canvas_events.normal, false
            );
            document.querySelector("#canvas_find_button")
                .addEventListener("onclick", events.find_click
            );
            // We need to separate these into nw_window events and html5 DOM
            // events closing the Window this isn't actually closing the window
            // yet
            gui.Window.get().on("close", function() {
                pdgui.pdsend(name, "menuclose 0");
            });
            // update viewport size when window size changes
            gui.Window.get().on("maximize", function() {
                pdgui.gui_canvas_get_scroll(name);
            });
            gui.Window.get().on("unmaximize", function() {
                pdgui.gui_canvas_get_scroll(name);
            });
            gui.Window.get().on("resize", function() {
                pdgui.gui_canvas_get_scroll(name);
            });
            gui.Window.get().on("focus", function() {
                nw_window_focus_callback(name);
            });
            gui.Window.get().on("blur", function() {
                nw_window_blur_callback(name);
            });
            gui.Window.get().on("move", function(x, y) {
                var w = gui.Window.get();
                pdgui.pdsend(name, "setbounds", x, y,
                    x + w.width, y + w.height);
            });
            // set minimum window size
            gui.Window.get().setMinimumSize(150, 100);
        },
        update_filename: function(cid, name){	
            if (pdgui.is_webapp()) {
                if(canvas_divs[cid]){	
                    canvas_divs[cid].filename = name;	
                    load_canvas_menu_actions(cid, filename)	
                }                    
            }
        },
        remove_canvas_div: function(cid){
            delete canvas_divs[cid];
            canvas_events.none();
        }
    };
}());
		
window.canvas_events = canvas_events;

// Stop-gap translator. We copy/pasted this in each dialog, too. It
// should be moved to pdgui.js
function translate_form() {
    var i
    var elements = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < elements.length; i++) {
        var data = elements[i].dataset.i18n;
        if (data.slice(0,7) === "[title]") {
            elements[i].title = l(data.slice(7));
        } else {
            elements[i].textContent = l(data);
        }
    }
}

// This gets called from the nw_create_window function in index.html
// It provides us with our canvas id from the C side.  Once we have it
// we can create the menu and register event callbacks
function register_window_id(cid, attr_array) {
    if(pdgui.is_webapp()){
            // Add menu text	
            menu_options("web-canvas", window, cid);
            add_shortcuts(cid);	
            pdgui.update_focused_windows(cid);

            // Force font size 10
            pdgui.pdsend(cid, "font", 10, 8, 100,0);
    }


    var kludge_title;
    // We create the window menus and popup menu before doing anything else
    // to ensure that we don't try to set the svg size before these are done.
    // Otherwise we might set the svg size to the window viewport, only to have
    // the menu push down the svg viewport and create scrollbars. Those same
    // scrollbars will get erased once canvas_map triggers, causing a quick
    // (and annoying) scrollbar flash.
    // For OSX, we have a single menu and just track which window has the
    // focus.
    if (process.platform !== "darwin") {
        nw_create_patch_window_menus(gui, window, cid);
    }
    create_popup_menu(cid);
    canvas_events.register(cid, attr_array);
    translate_form();
    canvas_events.normal();

    if(!pdgui.is_webapp()){
        // Initialize global DOM state/events
        canvas_events.init(document);
        // Trigger a "focus" event so that OSX updates the menu for this window
        nw_window_focus_callback(cid);
        // Initialize the zoom level to the value retrieved from the patch, if any.
        nw.Window.get().zoomLevel = attr_array.zoom;
    }
    
    pdgui.canvas_map(cid); // side-effect: triggers gui_canvas_get_scroll
    pdgui.canvas_set_editmode(cid, attr_array.editmode);
    // For now, there is no way for the cord inspector to be turned on by
    // default. But if this changes we need to set its menu item checkbox
    // accordingly here
    // set_cord_inspector_checkbox();

    // Set scroll bars
    pdgui.canvas_set_scrollbars(cid, !attr_array.hide_scroll);
    // One final kludge-- because window creation is asynchronous, we may
    // have gotten a dirty flag before the window was created. In that case
    // we check the title_queue to see if our title now contains an asterisk
    // (which is the visual cue for "dirty")

    // Two possibilities for handling this better:
    // have a representation of canvas attys in pdgui.js (editmode, dirty, etc.)
    // or
    // send those attys from Pd after mapping the canvas
    kludge_title = pdgui.query_title_queue(cid);
    if (kludge_title && !pdgui.is_webapp()) {
        nw.Window.get().title = kludge_title;
    }
    pdgui.free_title_queue(cid);
}
window.register_canvas = register_window_id;

class Popup {
    constructor(){
        this.popup_elem = document.createElement("ul");        
        this.popup_elem.id = "popup";
        this.items = [];

        // Close after click
        this.popup_elem.onclick = function(e){
            var ul_node = e.target.parentNode;
            if (ul_node !== document.body) {
                ul_node.parentNode.removeChild(ul_node);
            }
        }
    }

    append(params){
        var item = document.createElement("li");
        item.append(params['label'])
        item.onclick = params['click'];
        this.items.push({item: item, enabled: 1});
    }

    popup(xpos, ypos) {
        for(var item of this.items){
            if(item.enabled == 0){
                item.item.classList.add("popup-disabled");
                item.item.onclick = function(){};
            }
            this.popup_elem.appendChild(item.item);
        }

        this.popup_elem.style.left = xpos+"px";
        this.popup_elem.style.top = ypos+"px";
        document.getElementById("container").prepend(this.popup_elem);
    };
}


function create_popup_menu(name) {
    // The right-click popup menu
    var popup_menu;
    var popup_menu_options = {
        props: {
            label: l("canvas.menu.props"),
            click: function() {
                pdgui.popup_action(name, 0);
                // show sidebar
                $("#sidebar").collapse("show");
                $("#sidebar-col-icon").removeClass("rotate");

            }
        },
        open: {
            label: l("canvas.menu.open"),
            click: function() {
                pdgui.popup_action(name, 1);
            }
        },
        help: {
            label: l("canvas.menu.help"),
            click: function() {
                pdgui.popup_action(name, 2);
            }
        },
        front: {
            label: l("canvas.menu.front"),
            click: function() {
                pdgui.popup_action(name, 3);
            }
        },
        back: {
            label: l("canvas.menu.back"),
            click: function() {
                pdgui.popup_action(name, 4);
            }
        }
    }

    if(pdgui.is_webapp()){
        popup_menu = new Popup();
        pdgui.add_popup(name, popup_menu);
    
        popup_menu.append(popup_menu_options['props']);
        popup_menu.append(popup_menu_options['open']);
        popup_menu.append(popup_menu_options['help']);
        popup_menu.append(popup_menu_options['front']);
        popup_menu.append(popup_menu_options['back']);
    }else{
        popup_menu = new gui.Menu();
        pdgui.add_popup(name, popup_menu);

        popup_menu.append(new gui.MenuItem(popup_menu_options['props']));
        popup_menu.append(new gui.MenuItem(popup_menu_options['open']));
        popup_menu.append(new gui.MenuItem(popup_menu_options['help']));
        popup_menu.append(new gui.MenuItem({
            type: "separator",
        }));
        popup_menu.append(new gui.MenuItem(popup_menu_options['front']));
        popup_menu.append(new gui.MenuItem(popup_menu_options['back']));
    }
}

function nw_undo_menu(undo_text, redo_text) {
    // Disabling undo/redo menu buttons on OSX will
    // turn off any DOM events associated with that
    // key command. So we can't disable them here--
    // otherwise it would turn off text-editing
    // undo/redo.
    if (process.platform !== "darwin" && undo_text === "no") {
        canvas_menu.edit.undo.enabled = false;
    } else {
        canvas_menu.edit.undo.enabled = true;
        canvas_menu.edit.undo.label = l("menu.undo") + " " + undo_text;
    }
    if (process.platform !== "darwin" && redo_text === "no") {
        canvas_menu.edit.redo.enabled = false;
    } else {
        canvas_menu.edit.redo.enabled = true;
        canvas_menu.edit.redo.label = l("menu.redo") + " " + redo_text;
    }
}

function have_live_box() {
    var state = canvas_events.get_state();
    if (state === "text" || state === "floating_text") {
        return true;
    } else {
        return false;
    }
}

// If there's a box being edited, send the box's text to Pd
function update_live_box() {
    if (have_live_box()) {
        canvas_events.create_obj();
    }
}

// If there's a box being edited, try to instantiate it in Pd
function instantiate_live_box() {
    if (have_live_box()) {
        canvas_events.create_obj();
    }
}

// Menus for the Patch window

var canvas_menu = {};

function set_edit_menu_modals(state) {
    // OSX needs to keep these enabled, otherwise the events won't trigger
    if (process.platform === "darwin") {
        state = true;
    }
    if(!pdgui.is_webapp()){
        canvas_menu.edit.undo.enabled = state;
        canvas_menu.edit.redo.enabled = state;
        canvas_menu.edit.cut.enabled = state;
        canvas_menu.edit.copy.enabled = state;
        canvas_menu.edit.paste.enabled = state;
        canvas_menu.edit.selectall.enabled = state;
    }
}

function set_editmode_checkbox(state) {
    canvas_menu.edit.editmode.checked = state;
}

function set_cord_inspector_checkbox(state) {
    if(pdgui.is_webapp()){
        var cordinspector = document.getElementById("cordinspector"+name);
        cordinspector.checked = state;
    }else{
        canvas_menu.edit.cordinspector.checked = state;
    }
}

// stop-gap
function menu_generic () {
    alert("Please implement this");
}

function minit(menu_item, options) {
    if(pdgui.is_webapp()){
        menu_item = document.getElementById(menu_item);
    }

    var key;
    for (key in options) {
        if (options.hasOwnProperty(key)) {
            // For click callbacks, we want to check if canvas state is
            // "none", in which case we don't call them. This is just a
            // hack, though-- it'd be a better UX to disable all menu items
            // when we're in the "none" state.
            menu_item[key] = (key !== "click") ?
                options[key] :
                function() {
                    if (canvas_events.get_state() !== "none") {
                        options[key]();
                    }
            };
        }
    }
}

function nw_create_patch_window_menus(gui, w, name) {
    // if we're on GNU/Linux or Windows, create the menus:
    if(!pdgui.is_webapp()){
        var m = canvas_menu = pd_menus.create_menu(gui);

        // File sub-entries
        // We explicitly enable these menu items because on OSX
        // the console menu disables them. (Same for Edit and Put menu)
        minit(m.file.new_file, { click: pdgui.menu_new });
        minit(m.file.open, {
            click: function() {
                var input, chooser,
                    span = w.document.querySelector("#fileDialogSpan");
                // Complicated workaround-- see comment in build_file_dialog_string
                input = pdgui.build_file_dialog_string({
                    style: "display: none;",
                    type: "file",
                    id: "fileDialog",
                    nwworkingdir: pdgui.get_pd_opendir(),
                    multiple: null,
                    // These are copied from pd_filetypes in pdgui.js
                    accept: ".pd,.pat,.mxt,.mxb,.help"
                });
                span.innerHTML = input;
                chooser = w.document.querySelector("#fileDialog");
                // Hack-- we have to set the event listener here because we
                // changed out the innerHTML above
                chooser.onchange = function() {
                    var file_array = this.value;
                    // reset value so that we can open the same file twice
                    this.value = null;
                    pdgui.menu_open(file_array);
                    console.log("tried to open something");
                };
                chooser.click();
            }
        });
        if (pdgui.k12_mode == 1) {
            minit(m.file.k12, { click: pdgui.menu_k12_open_demos });
        }
        minit(m.file.save, {
            enabled: true,
            click: function () {
                pdgui.canvas_check_geometry(name); // should this go in menu_save?
                pdgui.menu_save(name);
            }
        });
        minit(m.file.saveas, {
            enabled: true,
            click: function (){
                pdgui.canvas_check_geometry(name);
                pdgui.menu_saveas(name);
            }
        });
        minit(m.file.print, {
            enabled: true,
            click: function (){
                pdgui.canvas_check_geometry(name);
                pdgui.menu_print(name);
            }
        });
        minit(m.file.message, {
            click: function() { pdgui.menu_send(name); }
        });
        minit(m.file.close, {
            enabled: true,
            click: function() { pdgui.menu_close(name); }
        });
        minit(m.file.quit, {
            click: pdgui.menu_quit
        });

        // Edit menu
        minit(m.edit.undo, {
            enabled: true,
            click: function () {
                if (canvas_events.get_state() === "text") {
                    document.execCommand("undo", false, null);
                } else {
                    pdgui.pdsend(name, "undo");
                }
            }
        });
        minit(m.edit.redo, {
            enabled: true,
            click: function () {
                if (canvas_events.get_state() === "text") {
                    document.execCommand("redo", false, null);
                } else {
                    pdgui.pdsend(name, "redo");
                }
            }
        });
        minit(m.edit.cut, {
            enabled: true,
            click: function () { pdgui.pdsend(name, "cut"); }
        });
        minit(m.edit.copy, {
            enabled: true,
            click: function () { pdgui.pdsend(name, "copy"); }
        });
        minit(m.edit.paste, {
            enabled: true,
            click: function () { pdgui.pdsend(name, "paste"); }
        });
        minit(m.edit.paste_clipboard, {
            enabled: true,
            click: function () {
            var clipboard = nw.Clipboard.get();
            var text = clipboard.get('text');
            //pdgui.post("** paste from clipboard: "+text);
            canvas_events.paste_from_pd_file(name, text);
        }
        });
        minit(m.edit.duplicate, {
            enabled: true,
            click: function () { pdgui.pdsend(name, "duplicate"); }
        });
        minit(m.edit.selectall, {
            enabled: true,
            click: function (evt) {
                if (canvas_events.get_state() === "normal") {
                    pdgui.pdsend(name, "selectall");
                } else if (process.platform === "darwin") {
                    // big kluge for OSX to select all inside a
                    // contenteditable element (needed because
                    // the stupid MacBuiltin is buggy-- see pd_menus.js)
                    document.execCommand("selectAll", false, null);
                }
            }
        });
        minit(m.edit.clear_console, {
            enabled: true,
            click: pdgui.clear_console
        });
        minit(m.edit.reselect, {
            enabled: true,
            click: function() {
                // This is a bit complicated... menu item shortcuts receive
                // key events before the DOM, so we have to make sure to
                // filter out <ctrl-or-cmd-Enter> in the DOM eventhandler
                // in the "normal" keypress callback.
                // We also have to make sure to send the text ahead to Pd
                // to make sure it has it in the before before attempting
                // to "reselect".
                // As we move the editing functionality from the c code to
                // the GUI, this will get less complex.
                if (canvas_events.get_state() === "floating_text" ||
                    canvas_events.get_state() === "text") {
                    canvas_events.text(); // anchor the object
                    canvas_events.create_obj();
                }
                pdgui.pdsend(name, "reselect");
            }
        });
        minit(m.edit.tidyup, {
            enabled: true,
            click: function() { pdgui.pdsend(name, "tidy"); }
        });
        minit(m.edit.font, {
            enabled: true,
            click: function () { pdgui.pdsend(name, "menufont"); }
        });
        minit(m.edit.cordinspector, {
            enabled: true,
            click: function() { pdgui.pdsend(name, "magicglass 0"); }
        });
        minit(m.edit.find, {
            click: function () {
                var find_bar = w.document.getElementById("canvas_find"),
                    find_bar_text = w.document.getElementById("canvas_find_text"),
                    state = find_bar.style.getPropertyValue("display");
                // if there's a box being edited, try to instantiate it in Pd
                instantiate_live_box();
                if (state === "none") {
                    find_bar.style.setProperty("display", "inline");
                    find_bar_text.focus();
                    find_bar_text.select();
                    canvas_events.search();
                } else {
                    find_bar.style.setProperty("display", "none");
                    // "normal" seems to be the only viable state for the
                    // canvas atm.  But if there are other states added later,
                    // we might need to fetch the previous state here.
                    canvas_events.normal();
                    // this resets the last search term so that the next search
                    // starts from the beginning again
                    canvas_events.find_reset();
                }
            }
        });
        minit(m.edit.findagain, {
            enabled: true,
            click: function() {
                pdgui.pdsend(name, "findagain");
            }
        });
        minit(m.edit.finderror, {
            enabled: true,
            click: function() {
                pdgui.pdsend("pd finderror");
            }
        });
        minit(m.edit.autotips, {
            enabled: true,
            click: menu_generic
        });
        minit(m.edit.editmode, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "editmode 0");
            }
        });
        minit(m.edit.preferences, {
            click: pdgui.open_prefs
        });

        // View menu
        minit(m.view.zoomin, {
            enabled: true,
            click: function () {
                nw_window_zoom(name, +1);
            }
        });
        minit(m.view.zoomout, {
            enabled: true,
            click: function () {
                nw_window_zoom(name, -1);
            }
        });
        minit(m.view.optimalzoom, {
            enabled: true,
            click: function () {
                pdgui.gui_canvas_optimal_zoom(name, 1, 1);
                pdgui.gui_canvas_get_scroll(name);
            }
        });
        minit(m.view.horizzoom, {
            enabled: true,
            click: function () {
                pdgui.gui_canvas_optimal_zoom(name, 1, 0);
                pdgui.gui_canvas_get_scroll(name);
            }
        });
        minit(m.view.vertzoom, {
            enabled: true,
            click: function () {
                pdgui.gui_canvas_optimal_zoom(name, 0, 1);
                pdgui.gui_canvas_get_scroll(name);
            }
        });
        minit(m.view.zoomreset, {
            enabled: true,
            click: function () {
                gui.Window.get().zoomLevel = 0;
                pdgui.pdsend(name, "zoom", 0);
                pdgui.gui_canvas_get_scroll(name);
            }
        });
        minit(m.view.fullscreen, {
            click: function() {
                var win = gui.Window.get();
                win.toggleFullscreen();
            }
        });

        // Put menu
        minit(m.put.object, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "obj 0");
            }
        });
        minit(m.put.message, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "msg 0");
            }
        });
        minit(m.put.number, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "floatatom 0");
            }
        });
        minit(m.put.symbol, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "symbolatom 0");
            }
        });
        minit(m.put.comment, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "text 0");
            }
        });
        minit(m.put.dropdown, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "dropdown 0");
            }
        });
        minit(m.put.bang, {
            enabled: true,
            click: function(e) {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "bng 0");
            }
        });
        minit(m.put.toggle, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "toggle 0");
            }
        });
        minit(m.put.number2, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "numbox 0");
            }
        });
        minit(m.put.vslider, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "vslider 0");
            }
        });
        minit(m.put.hslider, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "hslider 0");
            }
        });
        minit(m.put.vradio, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "vradio 0");
            }
        });
        minit(m.put.hradio, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "hradio 0");
            }
        });
        minit(m.put.vu, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "vumeter 0");
            }
        });
        minit(m.put.cnv, {
            enabled: true,
            click: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "mycnv 0");
            }
        });
        //minit(m.put.graph, {
        //    enabled: true,
        //    click: function() {
        //        update_live_box();
        //        pdgui.pdsend(name, "dirty 1");
        //        // leaving out some placement logic... see pd.tk menu_graph
        //        pdgui.pdsend(name, "graph NULL 0 0 0 0 30 30 0 30");
        //    },
        //});
        minit(m.put.array, {
            enabled: true,
            click: function() {
                    update_live_box();
                    pdgui.pdsend(name, "dirty 1");
                    pdgui.pdsend(name, "menuarray");
                }
        });

        // Window
        minit(m.win.nextwin, {
            click: function() {
                pdgui.raise_next(name);
            }
        });
        minit(m.win.prevwin, {
            click: function() {
                pdgui.raise_prev(name);
            }
        });
        minit(m.win.parentwin, {
            enabled: true,
            click: function() {
                pdgui.pdsend(name, "findparent", 0);
            }
        });
        minit(m.win.visible_ancestor, {
            enabled: true,
            click: function() {
                pdgui.pdsend(name, "findparent", 1);
            }
        });
        minit(m.win.pdwin, {
            enabled: true,
            click: function() {
                pdgui.raise_pd_window();
            }
        });

        // Media menu
        minit(m.media.audio_on, {
            click: function() {
                pdgui.pdsend("pd dsp 1");
            }
        });
        minit(m.media.audio_off, {
            click: function() {
                pdgui.pdsend("pd dsp 0");
            }
        });
        minit(m.media.test, {
            click: function() {
                pdgui.pd_doc_open("doc/7.stuff/tools", "testtone.pd");
            }
        });
        minit(m.media.loadmeter, {
            click: function() {
                pdgui.pd_doc_open("doc/7.stuff/tools", "load-meter.pd");
            }
        });

        // Help menu
        minit(m.help.about, {
            click: function() {
                pdgui.pd_doc_open("doc/about", "about.pd");
            }
        });
        minit(m.help.manual, {
            click: function() {
                pdgui.pd_doc_open("doc/1.manual", "index.htm");
            }
        });
        minit(m.help.browser, {
            click: pdgui.open_search
        });
        minit(m.help.intro, {
            click: function() {
                pdgui.pd_doc_open("doc/5.reference", "help-intro.pd");
            }
        });
        minit(m.help.l2ork_list, {
            click: function() {
                pdgui.external_doc_open("http://disis.music.vt.edu/listinfo/l2ork-dev");
            }
        });
        minit(m.help.pd_list, {
            click: function() {
                pdgui.external_doc_open("http://puredata.info/community/lists");
            }
        });
        minit(m.help.forums, {
            click: function() {
                pdgui.external_doc_open("http://forum.pdpatchrepo.info/");
            }
        });
        minit(m.help.irc, {
            click: function() {
                pdgui.external_doc_open("http://puredata.info/community/IRC");
            }
        });
        minit(m.help.devtools, {
            click: function () {
                gui.Window.get().showDevTools();
            }
        });
    }
}


function load_canvas_menu_actions(name, filename){
    // File menu
    minit("file-message"+name,{onclick: function(){pdgui.menu_send(name)}});

    minit("file-save"+name, {
        onclick: function () {
            pdgui.canvas_check_geometry(name); // should this go in menu_save?
            pdgui.menu_save(name);
        }
    });

    minit("file-saveas"+name, {
        onclick: function (){
            pdgui.canvas_check_geometry(name);
            pdgui.menu_saveas(name);
        }
    });
    minit("file-download"+name, {
        onclick: function (){
            pdgui.canvas_check_geometry(name);
            pdgui.download_patch(filename);
        }
    });
    minit("file-print"+name, {
        onclick: function (){
            pdgui.canvas_check_geometry(name);
            pdgui.menu_print(name);
        }
    });
    minit("file-close"+name, {
        onclick: function() { pdgui.menu_close(name); }
    });
    minit("close-canvas"+name, {
        onclick: function() { pdgui.menu_close(name); }
    });
    

    // Edit entries
    minit("edit-undo"+name, {
        onclick: function () {
            if (canvas_events.get_state() === "text") {
                document.execCommand("undo", false, null);
            } else {
                pdgui.pdsend(name, "undo");
            }
        }
    });
    minit("edit-redo"+name, {
        onclick: function () {
            if (canvas_events.get_state() === "text") {
                document.execCommand("redo", false, null);
            } else {
                pdgui.pdsend(name, "redo");
            }
        }
    });
    minit("edit-cut"+name, {
        onclick: function () { pdgui.pdsend(name, "cut"); }
    });
    minit("edit-copy"+name, {
        onclick: function () { pdgui.pdsend(name, "copy"); }
    });
    minit("edit-paste"+name, {
        onclick: function () { pdgui.pdsend(name, "paste"); }
    });
    minit("edit-paste-clipboard"+name, {
        onclick: function () {
            navigator.clipboard.readText().then(text =>
                canvas_events.paste_from_pd_file(name, text));           
            //pdgui.post("** paste from clipboard: "+text);

    	}
    });
    minit("edit-duplicate"+name, {
        onclick: function () { pdgui.pdsend(name, "duplicate"); }
    });
    minit("edit-selectall"+name, {
        onclick: function (evt) {
            if (canvas_events.get_state() === "normal") {
                pdgui.pdsend(name, "selectall");
            } else if (process.platform === "darwin") {
                // big kluge for OSX to select all inside a
                // contenteditable element (needed because
                // the stupid MacBuiltin is buggy-- see pd_menus.js)
                document.execCommand("selectAll", false, null);
            }
        }
    });

    minit("edit-reselect"+name, {
        onclick: function() {
            // This is a bit complicated... menu item shortcuts receive
            // key events before the DOM, so we have to make sure to
            // filter out <ctrl-or-cmd-Enter> in the DOM eventhandler
            // in the "normal" keypress callback.
            // We also have to make sure to send the text ahead to Pd
            // to make sure it has it in the before before attempting
            // to "reselect".
            // As we move the editing functionality from the c code to
            // the GUI, this will get less complex.
            if (canvas_events.get_state() === "floating_text" ||
                canvas_events.get_state() === "text") {
                canvas_events.text(); // anchor the object
                canvas_events.create_obj();
            }
            pdgui.pdsend(name, "reselect");
        }
    });
    minit("edit-tidyup"+name, {
        onclick: function() { pdgui.pdsend(name, "tidy"); }
    });
    minit("edit-font"+name, {
        onclick: function () { pdgui.pdsend(name, "menufont"); }
    });
    minit("edit-cordinspector"+name, {
        onclick: function() { pdgui.pdsend(name, "magicglass 0"); }
    });
    minit("edit-find"+name, {
        onclick: function () {
            var find_bar = window.document.getElementById("canvas_find"+name),
                find_bar_text = window.document.getElementById("canvas_find_text"+name),
                state = find_bar.style.getPropertyValue("display");
            // if there's a box being edited, try to instantiate it in Pd
            instantiate_live_box();
            if (state === "none") {
                find_bar.style.setProperty("display", "block");
                find_bar_text.focus();
                find_bar_text.select();
                canvas_events.search();
            } else {
                find_bar.style.setProperty("display", "none");
                // "normal" seems to be the only viable state for the
                // canvas atm.  But if there are other states added later,
                // we might need to fetch the previous state here.
                canvas_events.normal();
                // this resets the last search term so that the next search
                // starts from the beginning again
                canvas_events.find_reset();
            }
        }
    });
    minit("edit-findagain"+name, {
        onclick: function() {
            pdgui.pdsend(name, "findagain");
        }
    });  
    minit("edit-editmode"+name, {
        onclick: function() {
            pdgui.pdsend(name, "editmode 0");            
            update_live_box();
        }
    });

    // Put menu
    minit("put-object"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "obj 0");
        }
    });
    minit("put-msgbox"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "msg 0");
        }
    });
    minit("put-number"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "floatatom 0");
        }
    });
    minit("put-symbol"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "symbolatom 0");
        }
    });
    minit("put-comment"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "text 0");
        }
    });
    minit("put-dropdown"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "dropdown 0");
        }
    });
    minit("put-bang"+name, {
        onclick: function(e) {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "bng 0");
        }
    });
    minit("put-toggle"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "toggle 0");
        }
    });
    minit("put-number2"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "numbox 0");
        }
    });
    minit("put-vslider"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "vslider 0");
        }
    });
    minit("put-hslider"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "hslider 0");
        }
    });
    minit("put-vradio"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "vradio 0");
        }
    });
    minit("put-hradio"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "hradio 0");
        }
    });
    minit("put-vu"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "vumeter 0");
        }
    });
    minit("put-cnv"+name, {
        onclick: function() {
            update_live_box();
            pdgui.pdsend(name, "dirty 1");
            pdgui.pdsend(name, "mycnv 0");
        }
    });
    minit("put-array"+name, {
        onclick: function() {
                update_live_box();
                pdgui.pdsend(name, "dirty 1");
                pdgui.pdsend(name, "menuarray");
                // show sidebar
                $("#sidebar").collapse("show");
                $("#sidebar-col-icon").removeClass("rotate");
            }
    });

    // Window menu
    minit("window-nextwin"+name, {
        onclick: function() {
            pdgui.raise_next(name);
        }
    });

    minit("window-prevwin"+name, {
        onclick: function() {
            pdgui.raise_prev(name);
        }
    });1

    minit("window-parentwin"+name, {
        onclick: function() {
            pdgui.pdsend(name, "findparent", 0);
        }
    });
    minit("window-visible-ancestor"+name, {
        onclick: function() {
            pdgui.pdsend(name, "findparent", 1);
        }
    });
}

}).call(this)}).call(this,require('_process'))
},{"./pd_menus.js":10,"./pdgui.js":12,"_process":4,"nw.gui":2}],10:[function(require,module,exports){
(function (process){(function (){
"use strict";

var pdgui = require("./pdgui.js");
var l = pdgui.get_local_string; // For menu names
var osx_menu = null; // OSX App menu -- a single one per running instance
var recent_files_submenu = null;
var shortcuts = require("./pd_shortcuts.js");

function create_menu(gui, type) {
    // On OSX we create a menu only once, and then enable/disable menuitems
    // and switch out functions as needed.

    // We specify the label here because nw.js won't create a menu item
    // without one. We also specify the keyboard shortcuts here because
    // nw.js won't create an event listener unless you make the
    // shortcut immediately when creating the menu item. (It also
    // won't let you update the keyboard shortcut binding later.)
    var m = {},
        osx = process.platform === "darwin",
        canvas_menu, // menu for canvas = true,  menu for Pd console = false
        window_menu, // window menu bar, or-- for OSX-- app menu bar
        file_menu, // submenus for window menubar...
        edit_menu,
        view_menu,
        put_menu,
        winman_menu,
        media_menu,
        help_menu;

    // We only maintain a single instance of the recent files submenu which
    // gets updated in pdgui.js via a callback from the engine.
    if (!recent_files_submenu) {
        recent_files_submenu = new gui.Menu();
        // NOTE: Since we can't be sure whether the GUI or the engine runs
        // first, make sure that we populate the submenu on the first run in
        // either case.
        pdgui.populate_recent_files(recent_files_submenu);
    }

    // OSX just spawns a single canvas menu and then enables/disables
    // the various menu items as needed.
    canvas_menu = osx || (type !== "console");

    if (osx_menu) {
        return osx_menu; // don't spawn multiple menus on OSX
    }
    // Window menu
    window_menu = new gui.Menu({ type: "menubar" });

    // On OSX, we need to start with the built-in mac menu in order to
    // get the application menu to show up correctly. Unfortunately, this
    // will also spawn a built-in "Edit" and "Window" menu. Even more
    // unfortunately, we must use the built-in "Edit" menu-- without it
    // there is no way to get <command-v> shortcut to trigger the
    // DOM "paste" event.
    if (osx) {
        window_menu.createMacBuiltin("purr-data");
    }

    // File menu
    file_menu = new gui.Menu();

    // File sub-entries
    m.file = {};
    file_menu.append(m.file.new_file = new gui.MenuItem({
        label: l("menu.new"),
        key: shortcuts.menu.new.key,
        modifiers: shortcuts.menu.new.modifiers,
        tooltip: l("menu.new_tt")
    }));
    file_menu.append(m.file.open = new gui.MenuItem({
        label: l("menu.open"),
        key: shortcuts.menu.open.key,
        modifiers: shortcuts.menu.open.modifiers,
        tooltip: l("menu.open_tt")
    }));
    file_menu.append(m.file.recent_files = new gui.MenuItem({
        label: l("menu.recent_files"),
        submenu: recent_files_submenu,
        tooltip: l("menu.recent_files_tt")
    }));
    if (pdgui.k12_mode == 1) {
        file_menu.append(m.file.k12 = new gui.MenuItem({
            label: l("menu.k12_demos"),
            tooltip: l("menu.k12_demos_tt")
        }));
    }
    file_menu.append(new gui.MenuItem({ type: "separator" }));
    if (canvas_menu) {
        file_menu.append(m.file.save = new gui.MenuItem({
            label: l("menu.save"),
            key: shortcuts.menu.save.key,
            modifiers: shortcuts.menu.save.modifiers,
            tooltip: l("menu.save_tt")
        }));
        file_menu.append(m.file.saveas = new gui.MenuItem({
            label: l("menu.saveas"),
            key: shortcuts.menu.saveas.key,
            modifiers: shortcuts.menu.saveas.modifiers,
            tooltip: l("menu.saveas_tt")
        }));
        file_menu.append(m.file.print = new gui.MenuItem({
            label: l("menu.print"),
            key: shortcuts.menu.print.key,
            modifiers: shortcuts.menu.print.modifiers,
            tooltip: l("menu.print_tt")
        }));
    }
    if (pdgui.k12_mode == 0) {
        file_menu.append(new gui.MenuItem({ type: "separator" }));
    }
    file_menu.append(m.file.message = new gui.MenuItem({
        label: l("menu.message"),
        key: shortcuts.menu.message.key,
        modifiers: shortcuts.menu.message.modifiers,
        tooltip: l("menu.message_tt")
    }));
    if (pdgui.k12_mode == 0) {
        file_menu.append(new gui.MenuItem({ type: "separator" }));
    }
    if (canvas_menu) {
        file_menu.append(m.file.close = new gui.MenuItem({
            label: l("menu.close"),
            key: shortcuts.menu.close.key,
            modifiers: shortcuts.menu.close.modifiers,
            tooltip: l("menu.close_tt")
        }));
    }
    file_menu.append(m.file.quit = new gui.MenuItem({
        label: l("menu.quit"),
        key: shortcuts.menu.quit.key,
        modifiers: shortcuts.menu.quit.modifiers 
    }));

    // Edit menu
    m.edit = {};
    // For OSX, we have to use the built-in "Edit" menu-- I haven't
    // found any other way to get "paste" event to trickle down to
    // the DOM. As a consequence, we must fetch the relevant menu
    // items that were created above with createMacBuiltin and assign
    // them to the relevant variables below
    if (osx) {
        edit_menu = window_menu.items[1].submenu;
        m.edit.undo = window_menu.items[1].submenu.items[0];
        // Remove the default Undo, since we can't seem to bind
        // a click function to it
        window_menu.items[1].submenu.remove(m.edit.undo);

        // Now create a new one and insert it at the top
        edit_menu.insert(m.edit.undo = new gui.MenuItem({
            label: l("menu.undo"),
            tooltip: l("menu.undo_tt"),
            key: shortcuts.menu.undo.key,
            modifiers: shortcuts.menu.undo.modifiers
        }), 0);

        m.edit.redo = window_menu.items[1].submenu.items[1];
        // Remove the default Undo, since we can't seem to bind
        // a click function to it
        window_menu.items[1].submenu.remove(m.edit.redo);

        // Now create a new one and insert it at the top
        edit_menu.insert(m.edit.redo = new gui.MenuItem({
            label: l("menu.redo"),
            tooltip: l("menu.redo_tt"),
            key: shortcuts.menu.redo.key,
            modifiers: shortcuts.menu.redo.modifiers
        }), 1);

        // Note: window_menu.items[1].submenu.items[2] is the separator
        m.edit.cut = window_menu.items[1].submenu.items[3];
        m.edit.copy = window_menu.items[1].submenu.items[4];
        m.edit.paste = window_menu.items[1].submenu.items[5];
        // There's no "Delete" item for GNU/Linux or Windows--
        // not sure yet what to do with it.
        m.edit.delete = window_menu.items[1].submenu.items[6];
        // The MacBuiltin "Select All" doesn't propagate down to the DOM
        //on OSX, so we have to remove it
        m.edit.selectall= window_menu.items[1].submenu.items[7];
        window_menu.items[1].submenu.remove(m.edit.selectall);
        // Now we replace it with a custom "Select All" which will
        // propagate to the DOM...
        edit_menu.append(m.edit.selectall = new gui.MenuItem({
            label: l("menu.selectall"),
            tooltip: l("menu.selectall_tt"),
            key: shortcuts.menu.selectall.key,
            modifiers: shortcuts.menu.selectall.modifiers
        }));
        // Finally, let's remove the "Delete" item since it's not hooked
        // in to anything yet...
        window_menu.items[1].submenu.remove(m.edit.delete);
    } else {
        edit_menu = new gui.Menu();
        // Edit sub-entries
        if (canvas_menu) {
            edit_menu.append(m.edit.undo = new gui.MenuItem({
                label: l("menu.undo"),
                tooltip: l("menu.undo_tt"),
                key: shortcuts.menu.undo.key,
                modifiers: shortcuts.menu.undo.modifiers
            }));
            edit_menu.append(m.edit.redo = new gui.MenuItem({
                label: l("menu.redo"),
                tooltip: l("menu.redo_tt"),
                key: shortcuts.menu.redo.key,
                modifiers: shortcuts.menu.redo.modifiers
            }));
            edit_menu.append(new gui.MenuItem({ type: "separator" }));
            edit_menu.append(m.edit.cut = new gui.MenuItem({
                label: l("menu.cut"),
                key: shortcuts.menu.cut.key,
                modifiers: shortcuts.menu.cut.modifiers,
                tooltip: l("menu.cut_tt")
            }));
        }
        edit_menu.append(m.edit.copy = new gui.MenuItem({
            label: l("menu.copy"),
            key: shortcuts.menu.copy.key,
            modifiers: shortcuts.menu.copy.modifiers,
            tooltip: l("menu.copy_tt")
        }));
        if (canvas_menu) {
            edit_menu.append(m.edit.paste = new gui.MenuItem({
                label: l("menu.paste"),
                key: shortcuts.menu.paste.key,
                modifiers: shortcuts.menu.paste.modifiers,
                tooltip: l("menu.paste_tt")
            }));
        }
    }

    // We need "duplicate" for canvas_menu and for OSX, where it's not
    // part of the builtin Edit menu...

    if (canvas_menu) {
        edit_menu.append(m.edit.paste_clipboard = new gui.MenuItem({
            label: l("menu.paste_clipboard"),
            key: shortcuts.menu.paste_clipboard.key,
            modifiers: shortcuts.menu.paste_clipboard.modifiers,
            tooltip: l("menu.paste_clipboard_tt")
        }));
        edit_menu.append(m.edit.duplicate = new gui.MenuItem({
            label: l("menu.duplicate"),
            key: shortcuts.menu.duplicate.key,
            modifiers: shortcuts.menu.duplicate.modifiers,
            tooltip: l("menu.duplicate_tt")
        }));
    }

    // OSX already has "Select All" in the builtin Edit menu...
    if (!osx) {
        edit_menu.append(m.edit.selectall = new gui.MenuItem({
            label: l("menu.selectall"),
            key: shortcuts.menu.selectall.key,
            modifiers: shortcuts.menu.selectall.modifiers,
            tooltip: l("menu.selectall_tt")
        }));
    }

    if (canvas_menu) {
        // Unfortunately nw.js doesn't allow
        // key: "Return" or key: "Enter", so we
        // can't bind to ctrl-Enter here. (Even
        // tried fromCharCode...)
        edit_menu.append(m.edit.reselect = new gui.MenuItem({
            label: l("menu.reselect"),
            key: shortcuts.menu.reselect.key,
            modifiers: shortcuts.menu.reselect.modifiers,
            tooltip: l("menu.reselect_tt")
        }));
    }
    edit_menu.append(new gui.MenuItem({ type: "separator" }));
    edit_menu.append(m.edit.clear_console = new gui.MenuItem({
        label: l("menu.clear_console"),
        tooltip: l("menu.clear_console"),
        key: shortcuts.menu.clear_console.key,
        modifiers: shortcuts.menu.clear_console.modifiers
    }));
        edit_menu.append(new gui.MenuItem({ type: "separator" }));
    if (canvas_menu) {
        edit_menu.append(m.edit.tidyup = new gui.MenuItem({
            label: l("menu.tidyup"),
            key: shortcuts.menu.tidyup.key,
            modifiers: shortcuts.menu.tidyup.modifiers,
            tooltip: l("menu.tidyup_tt")
        }));
        edit_menu.append(m.edit.font = new gui.MenuItem({
            label: l("menu.font"),
            tooltip: l("menu.font_tt")
        }));
        edit_menu.append(m.edit.cordinspector = new gui.MenuItem({
            type: "checkbox",
            label: l("menu.cordinspector"),
            key: shortcuts.menu.cordinspector.key,
            modifiers: shortcuts.menu.cordinspector.modifiers,
            tooltip: l("menu.cordinspector_tt")
        }));
        edit_menu.append(new gui.MenuItem({ type: "separator" }));
    }
    edit_menu.append(m.edit.find = new gui.MenuItem({
        label: l("menu.find"),
        key: shortcuts.menu.find.key,
        modifiers: shortcuts.menu.find.modifiers,
        tooltip: l("menu.find_tt")
    }));
    if (canvas_menu) {
        edit_menu.append(m.edit.findagain = new gui.MenuItem({
            label: l("menu.findagain"),
            key: shortcuts.menu.findagain.key,
            modifiers: shortcuts.menu.findagain.modifiers,
            tooltip: l("menu.findagain")
        }));
        edit_menu.append(m.edit.finderror = new gui.MenuItem({
            label: l("menu.finderror"),
            tooltip: l("menu.finderror_tt")
        }));
        edit_menu.append(new gui.MenuItem({ type: "separator" }));
        m.edit.autotips = new gui.MenuItem({
            label: l("menu.autotips"),
            tooltip: l("menu.autotips_tt")
        });
        // commented out because it doesn't work yet -ag
        //edit_menu.append(m.edit.autotips);
        edit_menu.append(m.edit.editmode = new gui.MenuItem({
            type: "checkbox",
            label: l("menu.editmode"),
            key: shortcuts.menu.editmode.key,
            modifiers: shortcuts.menu.editmode.modifiers,
            tooltip: l("menu.editmode_tt")
        }));
        edit_menu.append(new gui.MenuItem({ type: "separator" }));
    }
    edit_menu.append(m.edit.preferences = new gui.MenuItem({
        label: l("menu.preferences"),
        key: shortcuts.menu.preferences.key,
        modifiers: shortcuts.menu.preferences.modifiers,
        tooltip: l("menu.preferences_tt")
    }));

    // View menu
    view_menu = new gui.Menu();

    // View sub-entries
    m.view = {};
    view_menu.append(m.view.zoomin = new gui.MenuItem({
        label: l("menu.zoomin"),
        key: shortcuts.menu.zoomin.key,
        modifiers: shortcuts.menu.zoomin.modifiers,
        tooltip: l("menu.zoomin_tt")
    }));
    view_menu.append(m.view.zoomout = new gui.MenuItem({
        label: l("menu.zoomout"),
        key: shortcuts.menu.zoomout.key,
        modifiers: shortcuts.menu.zoomout.modifiers,
        tooltip: l("menu.zoomout_tt")
    }));
    view_menu.append(new gui.MenuItem({ type: "separator" }));
    view_menu.append(m.view.zoomreset = new gui.MenuItem({
        label: l("menu.zoomreset"),
        key: shortcuts.menu.zoomreset.key,
        modifiers: shortcuts.menu.zoomreset.modifiers,
        tooltip: l("menu.zoomreset_tt")
    }));
    if (canvas_menu) {
	view_menu.append(m.view.optimalzoom = new gui.MenuItem({
            label: l("menu.zoomoptimal"),
            key: shortcuts.menu.zoomoptimal.key,
            modifiers: shortcuts.menu.zoomoptimal.modifiers,
            tooltip: l("menu.zoomoptimal_tt")
	}));
	view_menu.append(m.view.horizzoom = new gui.MenuItem({
            label: l("menu.zoomhoriz"),
            key: shortcuts.menu.zoomhoriz.key,
            modifiers: shortcuts.menu.zoomhoriz.modifiers,
            tooltip: l("menu.zoomhoriz_tt")
	}));
	view_menu.append(m.view.vertzoom = new gui.MenuItem({
            label: l("menu.zoomvert"),
            key: shortcuts.menu.zoomvert.key,
            modifiers: shortcuts.menu.zoomvert.modifiers,
            tooltip: l("menu.zoomvert_tt")
	}));
    }
    view_menu.append(new gui.MenuItem({ type: "separator" }));
    view_menu.append(m.view.fullscreen = new gui.MenuItem({
        label: l("menu.fullscreen"),
        key: shortcuts.menu.fullscreen.key,
        modifiers: shortcuts.menu.fullscreen.modifiers,
        tooltip: l("menu.fullscreen_tt")
    }));

    if (canvas_menu) {
        // Put menu
        put_menu = new gui.Menu();

        // Put menu sub-entries
        m.put = {};
        put_menu.append(m.put.object = new gui.MenuItem({
            label: l("menu.object"),
            key: shortcuts.menu.object.key,
            modifiers: shortcuts.menu.object.modifiers,
            tooltip: l("menu.object_tt")
        }));
        put_menu.append(m.put.message = new gui.MenuItem({
            label: l("menu.msgbox"),
            key: shortcuts.menu.msgbox.key,
            modifiers: shortcuts.menu.msgbox.modifiers,
            tooltip: l("menu.msgbox_tt")
        }));
        put_menu.append(m.put.number = new gui.MenuItem({
            label: l("menu.number"),
            key: shortcuts.menu.number.key,
            modifiers: shortcuts.menu.number.modifiers,
            tooltip: l("menu.number_tt")
        }));
        put_menu.append(m.put.symbol = new gui.MenuItem({
            label: l("menu.symbol"),
            key: shortcuts.menu.symbol.key,
            modifiers: shortcuts.menu.symbol.modifiers,
            tooltip: l("menu.symbol_tt")
        }));
        put_menu.append(m.put.comment = new gui.MenuItem({
            label: l("menu.comment"),
            key: shortcuts.menu.comment.key,
            modifiers: shortcuts.menu.comment.modifiers,
            tooltip: l("menu.comment_tt")
        }));
        put_menu.append(m.put.dropdown = new gui.MenuItem({
            label: l("menu.dropdown"),
            key: shortcuts.menu.dropdown.key,
            modifiers: shortcuts.menu.dropdown.modifiers,
            tooltip: l("menu.dropdown_tt")
        }));
        put_menu.append(new gui.MenuItem({ type: "separator" }));
        put_menu.append(m.put.bang = new gui.MenuItem({
            label: l("menu.bang"),
            key: shortcuts.menu.bang.key,
            modifiers: shortcuts.menu.bang.modifiers,
            tooltip: l("menu.bang_tt")
        }));
        put_menu.append(m.put.toggle = new gui.MenuItem({
            label: l("menu.toggle"),
            key: shortcuts.menu.toggle.key,
            modifiers: shortcuts.menu.toggle.modifiers,
            tooltip: l("menu.toggle_tt")
        }));
        put_menu.append(m.put.number2 = new gui.MenuItem({
            label: l("menu.number2"),
            key: shortcuts.menu.number2.key,
            modifiers: shortcuts.menu.number2.modifiers,
            tooltip: l("menu.number2")
        }));
        put_menu.append(m.put.vslider = new gui.MenuItem({
            label: l("menu.vslider"),
            key: shortcuts.menu.vslider.key,
            modifiers: shortcuts.menu.vslider.modifiers,
            tooltip: l("menu.vslider_tt")
        }));
        put_menu.append(m.put.hslider = new gui.MenuItem({
            label: l("menu.hslider"),
            key: shortcuts.menu.hslider.key,
            modifiers: shortcuts.menu.hslider.modifiers,
            tooltip: l("menu.hslider_tt")
        }));
        put_menu.append(m.put.vradio = new gui.MenuItem({
            label: l("menu.vradio"),
            key: shortcuts.menu.vradio.key,
            modifiers: shortcuts.menu.vradio.modifiers,
            tooltip: l("menu.vradio_tt")
        }));
        put_menu.append(m.put.hradio = new gui.MenuItem({
            label: l("menu.hradio"),
            key: shortcuts.menu.hradio.key,
            modifiers: shortcuts.menu.hradio.modifiers,
            tooltip: l("menu.hradio_tt")
        }));
        put_menu.append(m.put.vu = new gui.MenuItem({
            label: l("menu.vu"),
            key: shortcuts.menu.vu.key,
            modifiers: shortcuts.menu.vu.modifiers,
            tooltip: l("menu.vu_tt")
        }));
        put_menu.append(m.put.cnv = new gui.MenuItem({
            label: l("menu.cnv"),
            key: shortcuts.menu.cnv.key,
            modifiers: shortcuts.menu.cnv.modifiers,
            tooltip: l("menu.cnv_tt")
        }));
        put_menu.append(new gui.MenuItem({ type: "separator" }));
        //putMenu.append(m.put.graph = new gui.MenuItem());
        put_menu.append(m.put.array = new gui.MenuItem({
            label: l("menu.array"),
            tooltip: l("menu.array_tt")
        }));
    }

    // Windows menu... call it "winman" (i.e., window management)
    // to avoid confusion
    if (osx) {
        // on OSX, createMacBuiltin creates a window menu
        winman_menu = window_menu.items[2].submenu;
    } else {
        winman_menu = new gui.Menu();
    }
    // Win sub-entries
    m.win = {};
    winman_menu.append(m.win.nextwin = new gui.MenuItem({
        label: l("menu.nextwin"),
        key: shortcuts.menu.nextwin.key,
        modifiers: shortcuts.menu.nextwin.modifiers,
        tooltip: l("menu.nextwin_tt")
    }));
    winman_menu.append(m.win.prevwin = new gui.MenuItem({
        label: l("menu.prevwin"),
        key: shortcuts.menu.prevwin.key,
        modifiers: shortcuts.menu.prevwin.modifiers,
        tooltip: l("menu.prevwin_tt")
    }));
    if (canvas_menu) {
        winman_menu.append(new gui.MenuItem({ type: "separator" }));
        winman_menu.append(m.win.parentwin = new gui.MenuItem({
            label: l("menu.parentwin"),
            tooltip: l("menu.parentwin_tt")
        }));
        winman_menu.append(m.win.visible_ancestor = new gui.MenuItem({
            label: l("menu.visible_ancestor"),
            tooltip: l("menu.visible_ancestor_tt")
        }));
        winman_menu.append(m.win.pdwin = new gui.MenuItem({
            label: l("menu.pdwin"),
            tooltip: l("menu.pdwin_tt"),
            key: shortcuts.menu.pdwin.key,
            modifiers: shortcuts.menu.pdwin.modifiers
        }));
    }

    // Media menu
    media_menu = new gui.Menu();

    // Media sub-entries
    m.media = {};
    media_menu.append(m.media.audio_on = new gui.MenuItem({
        label: l("menu.audio_on"),
        key: shortcuts.menu.audio_on.key,
        modifiers: shortcuts.menu.audio_on.modifiers,
        tooltip: l("menu.audio_on_tt")
    }));
    media_menu.append(m.media.audio_off = new gui.MenuItem({
        label: l("menu.audio_off"),
        key: shortcuts.menu.audio_off.key,
        modifiers: shortcuts.menu.audio_off.modifiers,
        tooltip: l("menu.audio_off_tt")
    }));
    media_menu.append(new gui.MenuItem({ type: "separator" }));
    media_menu.append(m.media.test = new gui.MenuItem({
        label: l("menu.test"),
        tooltip: l("menu.test_tt")
    }));
    media_menu.append(m.media.loadmeter = new gui.MenuItem({
        label: l("menu.loadmeter"),
        tooltip: l("menu.loadmeter_tt")
    }));

    // Help menu
    help_menu = new gui.Menu();

    // Help sub-entries
    m.help = {};
    help_menu.append(m.help.about = new gui.MenuItem({
        label: l("menu.about"),
        tooltip: l("menu.about_tt")
    }));
    help_menu.append(m.help.manual = new gui.MenuItem({
        label: l("menu.manual"),
        tooltip: l("menu.manual_tt")
    }));
    help_menu.append(m.help.browser = new gui.MenuItem({
        label: l("menu.browser"),
        key: shortcuts.menu.browser.key,
        modifiers: shortcuts.menu.browser.modifiers,
        tooltip: l("menu.browser_tt")
    }));
    help_menu.append(m.help.intro = new gui.MenuItem({
        label: l("menu.intro"),
        tooltip: l("menu.intro_tt")
    }));
    help_menu.append(new gui.MenuItem({ type: "separator" }));
    help_menu.append(m.help.l2ork_list = new gui.MenuItem({
        label: l("menu.l2ork_list"),
        tooltip: l("menu.l2ork_list_tt")
    }));
    help_menu.append(m.help.pd_list = new gui.MenuItem({
        label: l("menu.pd_list"),
        tooltip: l("menu.pd_list_tt")
    }));
    help_menu.append(m.help.forums = new gui.MenuItem({
        label: l("menu.forums"),
        tooltip: l("menu.forums_tt")
    }));
    help_menu.append(m.help.irc = new gui.MenuItem({
        label: l("menu.irc"),
        tooltip: l("menu.irc_tt")
    }));
    help_menu.append(m.help.devtools = new gui.MenuItem({
        label: l("menu.devtools"),
        tooltip: l("menu.devtools_tt")
    }));

    // Add submenus to window menu
    if (osx) {
        window_menu.insert(new gui.MenuItem({
            label: l("menu.file"),
            submenu: file_menu
        }), 1);
        // Edit menu created from mac builtin above
        window_menu.insert(new gui.MenuItem({
            label: l("menu.view"),
            submenu: view_menu
        }), 3);
        window_menu.insert(new gui.MenuItem({
            label: l("menu.put"),
            submenu: put_menu
        }), 4);
        window_menu.insert(new gui.MenuItem({
            label: l("menu.media"),
            submenu: media_menu
        }), 5);
        // "Window" menu created from mac builtin above
        window_menu.append(new gui.MenuItem({
            label: l("menu.help"),
            submenu: help_menu
        }));
    } else {
        window_menu.append(new gui.MenuItem({
            label: l("menu.file"),
            submenu: file_menu
        }));
        window_menu.append(new gui.MenuItem({
            label: l("menu.edit"),
            submenu: edit_menu
        }));
        window_menu.append(new gui.MenuItem({
            label: l("menu.view"),
            submenu: view_menu
        }));
        if (canvas_menu) {
            window_menu.append(new gui.MenuItem({
                label: l("menu.put"),
                submenu: put_menu
            }));
        }
        window_menu.append(new gui.MenuItem({
            label: l("menu.media"),
            submenu: media_menu
        }));
        window_menu.append(new gui.MenuItem({
            label: l("menu.windows"),
            submenu: winman_menu
        }));
        window_menu.append(new gui.MenuItem({
            label: l("menu.help"),
            submenu: help_menu
        }));
    }

    // Assign to window
    gui.Window.get().menu = window_menu;

    // If we're on OSX, store the object
    if (process.platform === "darwin") {
        osx_menu = m;
    }
    return m;
}

exports.create_menu = create_menu;

}).call(this)}).call(this,require('_process'))
},{"./pd_shortcuts.js":11,"./pdgui.js":12,"_process":4}],11:[function(require,module,exports){
(function (process){(function (){
"use strict";

var cmd_or_ctrl = (process.platform === "darwin") ? "Cmd" : "Ctrl";

exports.menu = {
  "new":   { key: "N", modifiers: cmd_or_ctrl },
  "open":   { key: "O", modifiers: cmd_or_ctrl },
  "save":   { key: "S", modifiers: cmd_or_ctrl },
  "saveas": { key: "S", modifiers: cmd_or_ctrl + "+Shift" },
  "print":  { key: "P", modifiers: cmd_or_ctrl + "+Shift" },
  "message" : { key: "M", modifiers: cmd_or_ctrl },
  "close":  { key: "W", modifiers: cmd_or_ctrl },
  "quit":   { key: "Q", modifiers: cmd_or_ctrl },

  "undo":   { key: "Z", modifiers: cmd_or_ctrl },
  "redo":   { key: "Z", modifiers: cmd_or_ctrl + "+Shift" },
  "selectall":{ key: "A", modifiers: cmd_or_ctrl },
  "cut":    { key: "X", modifiers: cmd_or_ctrl },
  "copy":   { key: "C", modifiers: cmd_or_ctrl },
  "paste":  { key: "V", modifiers: cmd_or_ctrl },
  "paste_clipboard": { key: "V", modifiers: cmd_or_ctrl + "+Alt" },
  "duplicate": { key: "D", modifiers: cmd_or_ctrl },
  "undo":   { key: "Z", modifiers: cmd_or_ctrl },

  "reselect": { key: String.fromCharCode(10), modifiers: cmd_or_ctrl },
  "clear_console": { key: "L", modifiers: cmd_or_ctrl + "+Shift" },
  "tidyup": { key: "Y", modifiers: cmd_or_ctrl },
  "cordinspector":   { key: "R", modifiers: cmd_or_ctrl + "+Shift" },
  "find":   { key: "F", modifiers: cmd_or_ctrl },
  "findagain":{ key: "G", modifiers: cmd_or_ctrl },
  "editmode": { key: "E", modifiers: cmd_or_ctrl },
  "preferences": { key: (process.platform === "darwin") ? "," : "P",
    modifiers: cmd_or_ctrl },

  "zoomin": { key: "=", modifiers: cmd_or_ctrl },
  "zoomout": { key: "-", modifiers: cmd_or_ctrl },
  "zoomreset": { key: "0", modifiers: cmd_or_ctrl },
  "zoomoptimal": { key: "9", modifiers: cmd_or_ctrl },
  "zoomhoriz": { key: "9", modifiers: cmd_or_ctrl + "+Alt" },
  "zoomvert": { key: "9", modifiers: cmd_or_ctrl + "+Shift" },
  "fullscreen": { key: (process.platform === "darwin") ? "F" : "F11",
    modifiers: (process.platform === "darwin") ? "Cmd+Ctrl" : null },

  "object": { key: "1", modifiers: cmd_or_ctrl },
  "msgbox": { key: "2", modifiers: cmd_or_ctrl },
  "number": { key: "3", modifiers: cmd_or_ctrl },
  "symbol": { key: "4", modifiers: cmd_or_ctrl },
  "comment": { key: "5", modifiers: cmd_or_ctrl },
  "dropdown": { key: "6", modifiers: cmd_or_ctrl },
  "bang": { key: "B", modifiers: cmd_or_ctrl + "+Shift" },
  "toggle": { key: "T", modifiers: cmd_or_ctrl + "+Shift" },
  "number2": { key: "N", modifiers: cmd_or_ctrl + "+Shift" },
  "vslider": { key: "V", modifiers: cmd_or_ctrl + "+Shift" },
  "hslider": { key: "H", modifiers: cmd_or_ctrl + "+Shift" },
  "vradio": { key: "D", modifiers: cmd_or_ctrl + "+Shift" },
  "hradio": { key: "I", modifiers: cmd_or_ctrl + "+Shift" },
  "vu":     { key: "U", modifiers: cmd_or_ctrl + "+Shift" },
  "cnv": { key: "C", modifiers: cmd_or_ctrl + "+Shift" },

  "nextwin": { key: "PageDown", modifiers: cmd_or_ctrl },
  "prevwin": { key: "PageUp", modifiers: cmd_or_ctrl },
  "pdwin": { key: "R", modifiers: cmd_or_ctrl },

  "audio_on": { key: "/", modifiers: cmd_or_ctrl },
  "audio_off": { key: ".", modifiers: cmd_or_ctrl },

  "browser": { key: "B", modifiers: cmd_or_ctrl },
  "audio_off": { key: ".", modifiers: cmd_or_ctrl },
  "audio_off": { key: ".", modifiers: cmd_or_ctrl },
  "audio_off": { key: ".", modifiers: cmd_or_ctrl },


  // Webapp shortcuts
  "new_web":   { key: "N", modifiers: cmd_or_ctrl },
  "open_web":   { key: "O", modifiers: cmd_or_ctrl },
  "save_web":   { key: "S", modifiers: cmd_or_ctrl },
  "saveas_web": { key: "S", modifiers: cmd_or_ctrl + "+Shift" },
  "print_web":  { key: "P", modifiers: cmd_or_ctrl },
  "message_web" : { key: "M", modifiers: cmd_or_ctrl },
  "close_web":  { key: "W", modifiers: cmd_or_ctrl },

  "undo_web":   { key: "Z", modifiers: cmd_or_ctrl },
  "redo_web":   { key: "Z", modifiers: cmd_or_ctrl + "+Shift" },
  "selectall_web":{ key: "Q", modifiers: cmd_or_ctrl + "+Shift"},
  "cut_web":    { key: "X", modifiers: cmd_or_ctrl },
  "copy_web":   { key: "C", modifiers: cmd_or_ctrl },
  "paste_web":  { key: "V", modifiers: cmd_or_ctrl },
  "paste_clipboard_web": { key: "G", modifiers: cmd_or_ctrl + "+Shift" },
  "duplicate_web": { key: "D", modifiers: cmd_or_ctrl },

  "reselect_web": { key: "Q", modifiers: cmd_or_ctrl + "+Shift" },
  "clear_console_web": { key: "L", modifiers: cmd_or_ctrl + "+Shift" },
  "tidyup_web": { key: "Y", modifiers: cmd_or_ctrl },
  "cordinspector_web":   { key: "R", modifiers: cmd_or_ctrl + "+Shift" },
  "find_web":   { key: "F", modifiers: cmd_or_ctrl },
  "findagain_web":{ key: "F", modifiers: cmd_or_ctrl + "+Shift"},
  "editmode_web": { key: "E", modifiers: cmd_or_ctrl },
  "preferences_web": { key: (process.platform === "darwin") ? "," : "P",
    modifiers: cmd_or_ctrl },

  "zoomin_web": { key: "=", modifiers: cmd_or_ctrl },
  "zoomout_web": { key: "-", modifiers: cmd_or_ctrl },
  "zoomreset_web": { key: "0", modifiers: cmd_or_ctrl },
  "zoomoptimal_web": { key: "9", modifiers: cmd_or_ctrl },
  "zoomhoriz_web": { key: "9", modifiers: cmd_or_ctrl },
  "zoomvert_web": { key: "9", modifiers: cmd_or_ctrl + "+Shift" },
  "fullscreen_web": { key: (process.platform === "darwin") ? "F" : "F11",
    modifiers: (process.platform === "darwin") ? "Cmd+Ctrl" : null },

  "object_web": { key: "1", modifiers: cmd_or_ctrl },
  "msgbox_web": { key: "2", modifiers: cmd_or_ctrl },
  "number_web": { key: "3", modifiers: cmd_or_ctrl },
  "symbol_web": { key: "4", modifiers: cmd_or_ctrl },
  "comment_web": { key: "5", modifiers: cmd_or_ctrl },
  "dropdown_web": { key: "M", modifiers: cmd_or_ctrl + "+Shift" },
  "bang_web": { key: "B", modifiers: cmd_or_ctrl + "+Shift" },
  "toggle_web": { key: "T", modifiers: cmd_or_ctrl + "+Shift" },
  "number2_web": { key: "N", modifiers: cmd_or_ctrl + "+Shift" },
  "vslider_web": { key: "V", modifiers: cmd_or_ctrl + "+Shift" },
  "hslider_web": { key: "H", modifiers: cmd_or_ctrl + "+Shift" },
  "vradio_web": { key: "D", modifiers: cmd_or_ctrl + "+Shift" },
  "hradio_web": { key: "I", modifiers: cmd_or_ctrl + "+Shift" },
  "vu_web":     { key: "U", modifiers: cmd_or_ctrl + "+Shift" },
  "cnv_web": { key: "C", modifiers: cmd_or_ctrl + "+Shift" },

  "nextwin_web": { key: "PageDown", modifiers: cmd_or_ctrl },
  "prevwin_web": { key: "PageUp", modifiers: cmd_or_ctrl },
  "pdwin_web": { key: "R", modifiers: cmd_or_ctrl },

  "audio_on_web": { key: "/", modifiers: cmd_or_ctrl },
  "audio_off_web": { key: ".", modifiers: cmd_or_ctrl },

  "browser_web": { key: "B", modifiers: cmd_or_ctrl },

}

}).call(this)}).call(this,require('_process'))
},{"_process":4}],12:[function(require,module,exports){
(function (process){(function (){
"use strict";

var pwd;
var lib_dir;
var help_path, browser_doc, browser_path, browser_init;
var pd_engine_id;


function is_webapp(){
    if(typeof(Module) === "undefined"){
        return false;
    }
    return true;
}

exports.is_webapp = is_webapp;

if (is_webapp()) {
    if (navigator.platform.toUpperCase().indexOf("MAC") > -1) {
        process.platform = "darwin";
    } else if (navigator.platform.toUpperCase().indexOf("WIN") > -1) {
        process.platform = "win32";
    }
}

exports.set_pwd = function(pwd_string) {
    pwd = pwd_string;
}

exports.get_pwd = function() {
    return pwd;
}

function defunkify_windows_path(s) {
    var ret = s;
    if (process.platform === "win32") {
        ret = ret.replace(/\\/g, "/");
    }
    return ret;
}

exports.set_pd_engine_id = function (id) {
    pd_engine_id = id;
}

exports.defunkify_windows_path = defunkify_windows_path;

function gui_set_browser_config(doc_flag, path_flag, init_flag, helppath) {
    // post("gui_set_browser_config: " + helppath.join(":"));
    browser_doc = doc_flag;
    browser_path = path_flag;
    browser_init = init_flag;
    help_path = helppath;
    // AG: Start building the keyword index for dialog_search.html. We do this
    // here so that we can be sure that lib_dir and help_path are known already.
    // (This may also be deferred until the browser is launched for the first
    // time, depending on the value of browser_init.)
    if (browser_init == 1) make_index();
}

function gui_set_lib_dir(dir) {
    lib_dir = dir;
}

exports.get_lib_dir = function() {
    return lib_dir;
}

function get_pd_opendir() {
    if (pd_opendir) {
        return pd_opendir;
    } else {
        return pwd;
    }
}

exports.get_pd_opendir = get_pd_opendir;

function set_pd_opendir(dir) {
    pd_opendir = dir;
}

function gui_set_current_dir(dummy, dir_and_filename) {
    set_pd_opendir(path.dirname(dir_and_filename));
}

function gui_set_gui_preset(name) {
    skin.set(name);
}

exports.set_focused_patchwin = function(cid) {
    last_focused = cid;
}

// Keyword index (cf. dialog_search.html)

var fs = require("fs");
var path = require("path");
var dive = require("./dive.js"); // small module to recursively search dirs
var elasticlunr = require("./elasticlunr.js"); // lightweight full-text search engine in JavaScript, cf. https://github.com/weixsong/elasticlunr.js/

var index = elasticlunr();

index.addField("title");
index.addField("keywords");
index.addField("description");
//index.addField("body");
index.addField("path");
index.setRef("id");

function add_doc_to_index(filename, data) {
    var title = path.basename(filename, ".pd"),
        big_line = data.replace("\n", " "),
        keywords,
        desc;
        // We use [\s\S] to match across multiple lines...
        keywords = big_line
            .match(/#X text \-?[0-9]+ \-?[0-9]+ KEYWORDS ([\s\S]*?);/i),
        desc = big_line
            .match(/#X text \-?[0-9]+ \-?[0-9]+ DESCRIPTION ([\s\S]*?);/i);
        keywords = keywords && keywords.length > 1 ? keywords[1].trim() : null;
        desc = desc && desc.length > 1 ? desc[1].trim() : null;
        // Remove the Pd escapes for commas
        desc = desc ? desc.replace(" \\,", ",") : null;
        if (desc) {
            // format Pd's "comma atoms" as normal commas
            desc = desc.replace(" \\,", ",");
        }
    if (title.slice(-5) === "-help") {
        title = title.slice(0, -5);
    }
    index.addDoc({
        "id": filename,
        "title": title,
        "keywords": keywords,
        "description": desc
        //"body": big_line,
    });
}

function read_file(err, filename, stat) {
    if (!err) {
        if (filename.slice(-3) === ".pd") {
            // AG: We MUST read the files synchronously here. This might be a
            // performance issue on some systems, but if we don't do this then
            // we may open a huge number of files simultaneously, causing the
            // process to run out of file handles.
            try {
                var data = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
                add_doc_to_index(filename, data);
            } catch (read_err) {
                post("err: " + read_err);
            }
        }
    } else {
        // AG: Simply ignore missing/unreadable files and directories.
        // post("err: " + err);
    }
}

var index_done = false;
var index_started = false;

function finish_index() {
    index_done = true;
    post("finished building help index");
}

// AG: pilfered from https://stackoverflow.com/questions/21077670
function expand_tilde(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

// AG: This is supposed to be executed only once, after lib_dir has been set.
// Note that dive() traverses lib_dir asynchronously, so we report back in
// finish_index() when this is done.
function make_index() {
    var doc_path = browser_doc?path.join(lib_dir, "doc"):lib_dir;
    var i = 0;
    var l = help_path.length;
    function make_index_cont() {
        if (i < l) {
            var doc_path = help_path[i++];
            // AG: These paths might not exist, ignore them in this case. Also
            // note that we need to expand ~ here.
            var full_path = expand_tilde(doc_path);
            fs.lstat(full_path, function(err, stat) {
                if (!err) {
                    post("building help index in " + doc_path);
                    dive(full_path, read_file, make_index_cont);
                } else {
                    make_index_cont();
                }
            });
        } else {
            finish_index();
        }
    }
    index_started = true;
    post("building help index in " + doc_path);
    dive(doc_path, read_file, browser_path?make_index_cont:finish_index);
}

// AG: This is called from dialog_search.html with a callback that expects to
// receive the finished index as its sole argument. We also build the index
// here if needed, using make_index, then simply wait until make_index
// finishes and finally invoke the callback on the resulting index.
function build_index(cb) {
    function build_index_worker() {
        if (index_done == true) {
            cb(index);
        } else {
            setTimeout(build_index_worker, 500);
        }
    }
    if (index_started == false) {
        make_index();
    }
    build_index_worker();
}

exports.build_index = build_index;

// Modules

var cp = require("child_process"); // for starting core Pd from GUI in OSX

var parse_svg_path = require("./parse-svg-path.js");

exports.parse_svg_path = parse_svg_path;

// local strings
var lang = require("./pdlang.js");

exports.get_local_string = lang.get_local_string;

var pd_window;
exports.pd_window;

// Turns out I messed this up. pd_window should really be an
// "nw window", so that you can use it to access all the
// nw window methods and settings.  Instead I set it to the
// DOM window object. This complicates things-- for example,
// in walk_window_list I have to take care when comparing
// patchwin[]-- which are nw windows-- and pd_window.
// I'm not sure of the best way to fix this. Probably we want to
// just deal with DOM windows, but that would mean abstracting
// out the stuff that deals with nw window size and
// positioning.
exports.set_pd_window = function(win) {
    pd_window = win;
    exports.pd_window = win;
}

var font_engine_sanity;

// Here we use an HTML5 canvas hack to measure the width of
// the text to check for a font rendering anomaly. Here's why:
//
// It was reported that Ubuntu 16.04, Arch-- and probably most other Gnu/Linux
// distros going forward-- all end up with text extending past the box border.
// The test_text below is the string used in the bug report.
// OSX, Windows, and older Gnu/Linux stacks (like Ubuntu 14.04) all render
// this text with a width that is within half a pixel of each other (+- 217).
//
// Newer versions of Ubuntu and Arch measured nearly 7 pixels wider.
//
// I don't know what the new Gnu/Linux stack is up to (and I don't have the
// time to spelunk) but it's out of whack with the rest of the desktop
// rendering engines. Worse, there's some kind of quantization going on that
// keeps the new Gnu/Linux stack from hitting anything close to the font
// metrics of Pd Vanilla.
//
// Anyhow, we check for the discrepancy and try our best not to make newer
// versions of Gnu/Linux distros look too shitty...
exports.set_font_engine_sanity = function(win) {
    var canvas = win.document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        test_text = "struct theremin float x float y";
    canvas.id = "font_sanity_checker_canvas";
    win.document.body.appendChild(canvas);
    ctx.font = "11.65px DejaVu Sans Mono";
    if (Math.floor(ctx.measureText(test_text).width) <= 217) {
        font_engine_sanity = true;
    } else {
        font_engine_sanity = false;
    }
    canvas.parentNode.removeChild(canvas);
}

exports.get_font_engine_sanity = function() {
    return font_engine_sanity;
}

function font_stack_is_maintained_by_troglodytes() {
    return !font_engine_sanity;
}

var nw_create_window;
var nw_close_window;
var nw_app_quit;
var nw_open_html;
var nw_open_textfile;
var nw_open_external_doc;

exports.set_new_window_fn = function (nw_context_fn) {
    nw_create_window = nw_context_fn;
}

exports.set_close_window_fn = function (nw_context_fn) {
    nw_close_window = nw_context_fn;
}

exports.set_open_html_fn = function (nw_context_fn) {
    nw_open_html = nw_context_fn;
}

exports.set_open_textfile_fn = function (nw_context_fn) {
    nw_open_textfile = nw_context_fn;
}

exports.set_open_external_doc_fn = function (nw_context_fn) {
    nw_open_external_doc = nw_context_fn;
}

// Global variables from tcl
var pd_myversion,    // Pd version string
    pd_apilist,      // Available Audio APIs (tcl list)
    pd_midiapilist,  // MIDI APIsa (tcl list)
    pd_nt,           // Something to do with Windows configuration
    fontname,        // Font
    fontweight,      //  config
    pd_fontlist,     //   (Seems to be hard coded in Pd-l2ork)
    pd_whichmidiapi, // MIDI API, set by pd->gui message
    pd_whichapi,     // Audio API, set by pd->gui message
    pd_opendir,      //
    pd_guidir,       //
    pd_tearoff,      //
    put_tearoff,     //
    tcl_version,     //
    canvas_fill,     //
    colors,          //
    global_clipboard, //
    global_selection, //
    k12_mode = 0,         // should be set from argv ("0" is just a stopgap)
    k12_saveas_on_new, //
    autotips,          // tooltips
    magicglass,        // cord inspector
    window_prefs,      //retaining window-specific preferences
    pdtk_canvas_mouseup_name, // not sure what this does
    filetypes,         // valid file extensions for opening/saving (includes Max filetypes)
    untitled_number,   // number to increment for each new patch that is opened
    untitled_directory, // default directory where to create/save new patches
    popup_coords,       // 0: canvas x
                        // 1: canvas y
                        // 2: screen x
                        // 3: screen y
    pd_colors = {};                // associative array of canvas color presets

    var pd_filetypes = { ".pd": "Pd Files",
                         ".pat":"Max Patch Files",
                         ".mxt":"Max Text Files",
                         ".mxb":"Max Binary Files",
                         ".help":"Max Help Files"
                       };

    exports.k12_mode = k12_mode;
    exports.pd_filetypes = pd_filetypes;

    popup_coords = [0,0];

// Keycode vs Charcode: A Primer
// -----------------------------
// * keycode is a unique number assigned to a physical key on the keyboard
// * keycode is device dependent
// * charcode is the ASCII character (printable or otherwise) that gets output
//     when you depress a particular key
// * keydown and keyup events report keycodes but not charcodes
// * keypress events report charcodes but not keycodes
// * keypress events do _not_ fire for non-printing chars like arrow keys,
//     Alt keypress, Ctrl, (possibly) the keypad Delete key, and others
// * in Pd, we want to send ASCII codes + arrow keys et al to Pd for
//     both keydown and keyup events
// * events (without an auto-repeat) happen in this order:
//       1) keydown
//       2) keypress
//       3) keyup
// Therefore are solution is:
// 1. We check for non-printable keycodes like arrow keys inside
//    the keydown event.
// 2. In the keypress event, we map the charcode to the
//    last keydown keycode we received.
// 3. On keyup, we use the keycode to look up the corresponding
//    charcode, and send the charcode on to Pd
var pd_keymap = {}; // to iteratively map keydown/keyup keys
                    // to keypress char codes

function set_keymap(keycode, charcode) {
    pd_keymap[keycode] = charcode;
}

exports.set_keymap = set_keymap;

function get_char_code(keycode) {
    return pd_keymap[keycode];
}

exports.get_char_code = get_char_code;

// This could probably be in pdgui.js
function add_keymods(key, evt) {
    var shift = evt.shiftKey ? "Shift" : "";
    var ctrl = evt.ctrlKey ? "Ctrl" : "";
    return shift + ctrl + key;
}

function cmd_or_ctrl_key(evt) {
    if (process.platform === "darwin") {
        return evt.metaKey;
    } else {
        return evt.ctrlKey;
    }
}

exports.cmd_or_ctrl_key = cmd_or_ctrl_key;

(function () {

    var last_keydown = "";
    var keydown_repeat = 0;

    exports.keydown = function(cid, evt) {
        var key_code = evt.keyCode,
            hack = null, // hack for non-printable ascii codes
            cmd_or_ctrl
        switch(key_code) {
            case 8: // backspace
            case 9:
            case 10:
            case 27:
            //case 32:
            case 127: hack = key_code; break;
            case 46: hack = 127; break; // some platforms report 46 for Delete
            case 37: hack = add_keymods("Left", evt); break;
            case 38: hack = add_keymods("Up", evt); break;
            case 39: hack = add_keymods("Right", evt); break;
            case 40: hack = add_keymods("Down", evt); break;
            case 33: hack = add_keymods("Prior", evt); break;
            case 34: hack = add_keymods("Next", evt); break;
            case 35: hack = add_keymods("End", evt); break;
            case 36: hack = add_keymods("Home", evt); break;

            // These may be different on Safari...
            case 112: hack = add_keymods("F1", evt); break;
            case 113: hack = add_keymods("F2", evt); break;
            case 114: hack = add_keymods("F3", evt); break;
            case 115: hack = add_keymods("F4", evt); break;
            case 116: hack = add_keymods("F5", evt); break;
            case 117: hack = add_keymods("F6", evt); break;
            case 118: hack = add_keymods("F7", evt); break;
            case 119: hack = add_keymods("F8", evt); break;
            case 120: hack = add_keymods("F9", evt); break;
            case 121: hack = add_keymods("F10", evt); break;
            case 122: hack = add_keymods("F11", evt); break;
            case 123: hack = add_keymods("F12", evt); break;

            // Handle weird behavior for clipboard shortcuts
            // Which don't fire a keypress for some odd reason

            case 65:
                if (cmd_or_ctrl_key(evt)) { // ctrl-a
                    // This is handled in the nwjs menu, but we
                    // add a way to toggle the window menubar
                    // the following command should be uncommented...
                    //pdsend(name, "selectall");
                    hack = 0; // not sure what to report here...
                }
                break;
            case 88:
                if (cmd_or_ctrl_key(evt)) { // ctrl-x
                    // This is handled in the nwjs menubar. If we
                    // add a way to toggle the menubar it will be
                    // handled with the "cut" DOM listener, so we
                    // can probably remove this code...
                    //pdsend(name, "cut");
                    hack = 0; // not sure what to report here...
                }
                break;
            case 67:
                if (cmd_or_ctrl_key(evt)) { // ctrl-c
                    // Handled in nwjs menubar (see above)
                    //pdsend(name, "copy");
                    hack = 0; // not sure what to report here...
                }
                break;
            case 86:
                if (cmd_or_ctrl_key(evt)) { // ctrl-v
                    // We also use "cut" and "copy" DOM event handlers
                    // and leave this code in case we need to change
                    // tactics for some reason.
                    //pdsend(name, "paste");
                    hack = 0; // not sure what to report here...
                }
                break;
            case 90:
                if (cmd_or_ctrl_key(evt)) { // ctrl-z undo/redo
                    // We have to catch undo and redo here.
                    // undo and redo have nw.js menu item shortcuts,
                    // and those shortcuts don't behave consistently
                    // across platforms:
                    // Gnu/Linux: key events for the shortcut do not
                    //   propogate down to the DOM
                    // OSX: key events for the shortcut _do_ propogate
                    //   down to the DOM
                    // Windows: not sure...

                    // Solution-- let the menu item shortcuts handle
                    // undo/redo functionality, and do nothing here...
                    //if (evt.shiftKey) {
                    //    pdsend(name, "redo");
                    //} else {
                    //    pdsend(name, "undo");
                    //}
                }
                break;

            // Need to handle Control key, Alt

            case 16: hack = "Shift"; break;
            case 17: hack = "Control"; break;
            case 18: hack = "Alt"; break;

            // keycode 55 = 7 key (shifted = '/' on German keyboards)
            case 55:
                if (cmd_or_ctrl_key(evt)) {
                    evt.preventDefault();
                    pdsend("pd dsp 1");
                }
                break;

        }
        if (hack !== null) {
            // To match Pd Vanilla behavior, fake a keyup if this
            // is an auto-repeating key
            if (evt.repeat) {
                canvas_sendkey(cid, 0, evt, hack, 1);
            }
            canvas_sendkey(cid, 1, evt, hack, evt.repeat);
            set_keymap(key_code, hack);
        }

        //post("keydown time: keycode is " + evt.keyCode);
        last_keydown = evt.keyCode;
        keydown_repeat = evt.repeat;
        //evt.stopPropagation();
        //evt.preventDefault();
    };

    exports.keypress = function(cid, evt) {
        // For some reasons <ctrl-e> registers a keypress with
        // charCode of 5. We filter that out here so it doesn't
        // cause trouble when toggling editmode.
        // Also, we're capturing <ctrl-or-cmd-Enter> in the "Edit"
        // menu item "reselect", so we filter it out here as well.
        // (That may change once we find a more flexible way of
        // handling keyboard shortcuts
        if (evt.charCode !== 5 &&
              (!cmd_or_ctrl_key(evt) || evt.charCode !== 10)) {
            // To match Pd Vanilla behavior, fake a keyup if this
            // is an auto-repeating key
            if (keydown_repeat) {
                canvas_sendkey(cid, 0, evt, evt.charCode, 1);
            }
            canvas_sendkey(cid, 1, evt, evt.charCode,
                keydown_repeat);
            set_keymap(last_keydown, evt.charCode,
                keydown_repeat);
        }
        //post("keypress time: charcode is " + evt.charCode);
        // Don't do things like scrolling on space, arrow keys, etc.
    };

    exports.keyup = function(cid, evt) {
        var my_char_code = get_char_code(evt.keyCode);
        // Sometimes we don't have char_code. For example, the
        // nw menu doesn't propogate shortcut events, so we don't get
        // to map a charcode on keydown/keypress. In those cases we'll
        // get null, so we check for that here...

        // Also, HTML5 keyup event appears not to ever trigger on autorepeat.
        // So we always send a zero here and fake the autorepeat above to
        // maintain consistency with Pd Vanilla.
        if (my_char_code) {
            canvas_sendkey(cid, 0, evt, my_char_code, 0);
        }
        // This can probably be removed
        //if (cmd_or_ctrl_key(evt) &&
        //      (evt.keyCode === 13 || evt.keyCode === 10)) {
        //    pdgui.pdsend(name, "reselect");
        //}
    };

})();

    // Hard-coded Pd-l2ork font metrics
/*
var font_fixed_metrics = [
    8, 5, 11,
    9, 6, 12,
    10, 6, 13,
    12, 7, 16,
    14, 8, 17,
    16, 10, 19,
    18, 11, 22,
    24, 14, 29,
    30, 18, 37,
    36, 22, 44 ].join(" ");
*/

// Let's try to get some metrics specific to Node-webkit...
// Hard-coded Pd-l2ork font metrics
var font_fixed_metrics = [
    8, 5, 11,
    9, 6, 12,
    10, 6, 13,
    12, 7, 16,
    14, 8, 17,
    16, 10, 19,
    18, 11, 22,
    24, 14, 29,
    30, 18, 37,
    36, 22, 44 ].join(" ");

// Utility Functions

// This is used to escape spaces and other special delimiters in FUDI
// arguments for dialogs. (The reverse function is sys_decodedialog() in the C
// code.)
function encode_for_dialog(s) {
    s = s.replace(/\+/g, "++");
    s = s.replace(/\s/g, "+_");
    s = s.replace(/\$/g, "+d");
    s = s.replace(/;/g, "+s");
    s = s.replace(/,/g, "+c");
    s = "+" + s;
    return s;
}

exports.encode_for_dialog = encode_for_dialog;

// originally used to enquote a string to send it to a tcl function
function enquote (x) {
    var foo = x.replace(/,/g, "");
    foo = foo.replace(/;/g, "");
    foo = foo.replace(/"/g, "");
    foo = foo.replace(/ /g, "\\ ");
    foo = foo.trim();
    return foo;
}

// from stackoverflow.com/questions/21698906/how-to-check-if-a-path-is-absolute-or-relative
// only seems to be used by pddplink_open
function path_is_absolute(myPath) {
    var ret = (path.resolve(myPath) ===
        path.normalize(myPath).replace(/(.+)([\/|\\])$/, "$1"));
    return ret;
}

function set_midiapi(val) {
    pd_whichmidiapi = val;
}

function set_audioapi(val) {
    pd_whichapi = val;
}

var throttle_console_scroll = (function() {
    var scroll_delay;
    return function() {
        if (!scroll_delay) {
            scroll_delay = setTimeout(function() {
                var printout = pd_window.document
                    .getElementById("console_bottom");
                printout.scrollTop = printout.scrollHeight;
                scroll_delay = undefined;
            }, 30);
        }
    }
}());

// Hmm, probably need a closure here...
var current_string = "";
var last_string = "";
var last_child = {};
var last_object_id = "";
var duplicate = 0;

function do_post(object_id, selector, string, type, loglevel) {
    var my_p, my_a, span, text, sel_span, printout, dup_span;
    current_string = current_string + (selector ? selector : "") + string;
    my_p = pd_window.document.getElementById("p1");
    // We can get posts from Pd that are build incrementally, with the final
    // message having a "\n" at the end. So we test for that.
    if (string.slice(-1) === "\n") {
        if (current_string === last_string
            && object_id === last_object_id) {
            duplicate += 1;
            dup_span = last_child.firstElementChild;
            dup_span.textContent = "[" + (duplicate + 1) + "] ";
            current_string = "";
            if (my_p.lastChild !== last_child) {
                my_p.appendChild(last_child);
            }
        } else {
            span = pd_window.document.createElement("span");
            if (type) {
                span.classList.add(type);
            }
            dup_span = pd_window.document.createElement("span");
            sel_span = pd_window.document.createTextNode(
                selector ? selector : "");
            text = pd_window.document.createTextNode(
                (selector && selector !== "") ? ": " + string : current_string);
            if (object_id && object_id.length > 0) {
                my_a = pd_window.document.createElement("a");
                my_a.href = "javascript:pdgui.pd_error_select_by_id('" +
                    object_id + "')";
                my_a.appendChild(sel_span);
                span.appendChild(dup_span); // duplicate tally
                span.appendChild(my_a);
            } else {
                span.appendChild(dup_span);
                span.appendChild(sel_span);
                my_p.appendChild(span);
            }
            span.appendChild(text);
            my_p.appendChild(span);
            last_string = current_string;
            current_string = "";
            last_child = span;
            last_object_id = object_id;
            duplicate = 0;
            // update the scrollbars to the bottom, but throttle it
            // since it is expensive
            throttle_console_scroll();
        }
    }
}

// print message to console-- add a newline for convenience
function post(string, type) {
    do_post(null, null, string + "\n", type, null);
}

exports.post = post;

// print message to console from Pd-- don't add newline
function gui_post(string, type) {
    do_post(null, "", string, type, null);
}

function pd_error_select_by_id(objectid) {
    if (objectid !== null) {
        pdsend("pd findinstance " + objectid);
    }
}

exports.pd_error_select_by_id = pd_error_select_by_id;

function gui_post_error(objectid, loglevel, error_msg) {
    do_post(objectid, "error", error_msg, "error", loglevel);
}

// This is used specifically by [print] so that we can receive the full
// message in a single call. This way we can call do_post with a single
// string message and track the object id with the selector.

function gui_print(object_id, selector, array_of_strings) {
    // Unfortunately the instance finder still uses a "." prefix, so we
    // have to add that here
    do_post("." + object_id, selector, array_of_strings.join(" ") + "\n",
        null, null);
}

function gui_legacy_tcl_command(file, line_number, text) {
    // Print legacy tcl commands on the console. These may still be present in
    // some parts of the code (usually externals) which haven't been converted
    // to the new nw.js gui yet. Usually the presence of such commands
    // indicates a bug that needs to be fixed. This information is most useful
    // for developers, so you may want to comment out the following line if
    // you don't want to see them.
    post("legacy tcl command at " + line_number + " of " + file + ": " + text);
}

function clear_console() {
    var container = pd_window.document.getElementById("p1");
    container.textContent = "";
}

exports.clear_console = clear_console;

// convert canvas dimensions to old tcl/tk geometry
// string format. Unfortunately this is exposed (and
// documented) to the user with the "relocate" message
// in both Pd-Extended and Pd-Vanilla.  So we have to
// keep it here for backwards compatibility.
function pd_geo_string(w, h, x, y) {
    return  [w,"x",h,"+",x,"+",y].join("");
}

// quick hack so that we can paste pd code from clipboard and
// have it affect an empty canvas' geometry
// requires nw.js API
function gui_canvas_change_geometry(cid, w, h, x, y) {
    gui(cid).get_nw_window(function(nw_win) {
        nw_win.width = w;
        nw_win.height = h + 23; // 23 is a kludge to account for menubar
        nw_win.x = x;
        nw_win.y = y;
    });
}

// In tcl/tk, this function had some checks to apparently
// keep from sending a "relocate" message to Pd, but I'm
// not exactly clear on how it works. If this ends up being
// a cpu hog, check out pdtk_canvas_checkgeometry in the old
// pd.tk
function canvas_check_geometry(cid) {
    var win_w = patchwin[cid].width,
        // "23" is a kludge to account for the menubar size.  See comment
        // in nw_create_window of index.js
        win_h = patchwin[cid].height - 23,
        win_x = patchwin[cid].x,
        win_y = patchwin[cid].y,
        cnv_width = patchwin[cid].window.innerWidth,
        cnv_height = patchwin[cid].window.innerHeight - 23;
    // We're reusing win_x and win_y below, as it
    // shouldn't make a difference to the bounds
    // algorithm in Pd
    pdsend(cid, "relocate",
           pd_geo_string(win_w, win_h, win_x, win_y),
           pd_geo_string(cnv_width, cnv_height, win_x, win_y)
    );
}

exports.canvas_check_geometry = canvas_check_geometry;

function menu_save(name) {
    pdsend(name + " menusave");
}

exports.menu_save = menu_save;

// This is an enormous workaround based off of the comment for this bug:
//   https://github.com/nwjs/nw.js/issues/3372
// Essentially nwworkingdir won't work if you set it through a javascript
// object like a normal human being. Instead, you have to let it get parsed
// by the browser, which means adding a <span> tag as a parent just so we
// can set its innerHTML.
// If this bug is ever resolved then this function can go away, as you should
// be able to just set nwsaveas and nwworkingdir through the setAttribute
// DOM interface.
function build_file_dialog_string(obj) {
    var prop, input = "<input ";
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            input += prop;
            if (obj[prop]) {
                input += '="' + obj[prop] + '"';
            }
            input += ' ';
        }
    }
    input += "/>";
    return input;
}

exports.build_file_dialog_string = build_file_dialog_string;

function gui_canvas_saveas(name, initfile, initdir, close_flag) {
    // If we don't have a ".pd" file extension (e.g., "Untitled-1", add one)
    if (initfile.slice(-3) !== ".pd") {
        initfile += ".pd";
    }

    if(is_webapp()){
        var filename = prompt("Please enter file name", initfile);
        if (filename != null) {
            saveas_callback(name, filename, close_flag);
            add_canvas_name(name, filename);
        }
    }else{
        var input, chooser,
        span = patchwin[name].window.document.querySelector("#saveDialogSpan");
        if (!fs.existsSync(initdir)) {
            initdir = pwd;
        }

        // This is complicated because of a bug... see build_file_dialog_string

        // NOTE ag: The original code had nwworkingdir set to path.join(initdir,
        // initfile) which doesn't seem right and in fact does *not* work with the
        // latest nw.js on Linux at all (dialog comes up without a path under
        // which to save, "Save" doesn't work until you explicitly select one).

        // Setting nwsaveas to initfile and nwworkingdir to initdir (as you'd
        // expect) works for me on Linux, but it seems that specifying an absolute
        // pathname for nwsaveas is necessary on Windows, and this also works on
        // Linux. Cf. https://github.com/nwjs/nw.js/issues/3372 (which is still
        // open at the time of this writing). -ag
        input = build_file_dialog_string({
            style: "display: none;",
            type: "file",
            id: "saveDialog",
            // using an absolute path here, see comment above
            nwsaveas: path.join(initdir, initfile),
            nwworkingdir: initdir,
            accept: ".pd"
        });
        span.innerHTML = input;
        chooser = patchwin[name].window.document.querySelector("#saveDialog");
        chooser.onchange = function() {
            saveas_callback(name, this.value, close_flag);
            // reset value so that we can open the same file twice
            this.value = null;
            console.log("tried to save something");
        }
        chooser.click();
    }
}

function saveas_callback(cid, file, close_flag) {
    var filename = is_webapp() ? file : defunkify_windows_path(file),
        directory = is_webapp() ? workspace : path.dirname(filename),
        basename = is_webapp() ? file : path.basename(filename);

    // It probably isn't possible to arrive at the callback with an
    // empty string.  But I've only tested on Debian so far...
    if (filename === null) {
        return;
    }
    pdsend(cid, "savetofile", enquote(basename), enquote(directory),
        close_flag);

    if(is_webapp()){
        update_file_ls();
    }else{
        // XXXREVIEW: It seems sensible that we also switch the opendir here. -ag
        set_pd_opendir(directory);
        // update the recent files list
        var norm_path = path.normalize(directory);
        pdsend("pd add-recent-file", enquote(defunkify_windows_path(path.join(norm_path, basename))));
    }

}

exports.saveas_callback = saveas_callback;

function menu_saveas(name) {
    pdsend(name + " menusaveas");
}

exports.menu_saveas = menu_saveas;

function gui_canvas_print(name, initfile, initdir) {
    // If we don't have a ".pd" file extension (e.g., "Untitled-1", add one)
    if (initfile.slice(-3) !== ".pd") {
        initfile += ".pd";
    }

    if(is_webapp()){
        print_callback(name, initfile);
    }else{
        // AG: This works mostly like gui_canvas_saveas above, except that we
        // create a pdf file and use a different input element and callback.
        var input, chooser,
            span = patchwin[name].window.document.querySelector("#printDialogSpan");
        if (!fs.existsSync(initdir)) {
            initdir = pwd;
        }

        // Adding an "f" now gives .pdf which is what we want.
        initfile += "f";
        input = build_file_dialog_string({
            style: "display: none;",
            type: "file",
            id: "printDialog",
            nwsaveas: path.join(initdir, initfile),
            nwworkingdir: initdir,
            accept: ".pdf"
        });
        span.innerHTML = input;
        chooser = patchwin[name].window.document.querySelector("#printDialog");
        chooser.onchange = function() {
            print_callback(name, this.value);
            // reset value so that we can open the same file twice
            this.value = null;
            console.log("tried to print something");
        }
        chooser.click();
    }
}

function print_callback(cid, file) {
    var filename = is_webapp() ? file :defunkify_windows_path(file);
    // It probably isn't possible to arrive at the callback with an
    // empty string.  But I've only tested on Debian so far...
    if (filename === null) {
        return;
    }

    if(is_webapp()){
        // Prepare window for print
        var print_win = window.open(); 
        var print_content = patchwin[cid].window.document.getElementById("patch_div_"+cid).innerHTML;
        var css = patchwin[cid].window.document.getElementsByTagName('head')[0].innerHTML;    
        print_win.document.write(css);    
        print_win.document.write(print_content);
        print_win.document.title = filename;
        print_win.document.close();
        print_win.print();
        print_win.close();
    }else{
        // Let nw.js do the rest (requires nw.js 0.14.6+)
        patchwin[cid].print({ pdf_path: filename, headerFooterEnabled: false });
    }

    post("printed to: " + filename);
}

exports.print_callback = print_callback;

function menu_print(name) {
    pdsend(name + " menuprint");
}

exports.menu_print = menu_print;

function menu_new () {
    // try not to use a global here
    untitled_directory = get_pd_opendir();
    pdsend("pd filename",
           "Untitled-" + untitled_number,
           enquote(defunkify_windows_path(untitled_directory)));
    // I don't think k12_mode works yet. Need to test this.
    if (k12_mode == 1) {
        k12_saveas_on_new = 1;
        pdsend("#N canvas");
        pdsend("#X obj -30 -30 preset_hub k12 1 %hidden%");
        pdsend("#X pop 1");
    } else {
        pdsend("#N canvas");
        pdsend("#X pop 1");
    }
    untitled_number++;
}

exports.menu_new = menu_new;

// requires nw.js API
function gui_window_close(cid) {
    // for some edge cases like [vis 1, vis 0(--[send subpatch] we
    // may not have finished creating the window yet. So we check to
    // make sure the canvas cid exists...
    gui(cid).get_nw_window(function(nw_win) {
        if(is_webapp()){
            menuclose_webapp(cid);
        }else{
            nw_close_window(nw_win);
        }
    });
    // remove reference to the window from patchwin object
    set_patchwin(cid, null);
    loading[cid] = null;
}

function menu_k12_open_demos () {

}

exports.menu_k12_open_demos = menu_k12_open_demos;


function menu_open (filenames_string) {
    var file_array = filenames_string.split(";"),
        length = file_array.length,
        i;
    for (i = 0; i < length; i++) {
        open_file(file_array[i]);
    }
}

exports.menu_open = menu_open;

function menu_close(name) {
    // not handling the "text editor" yet
    // not handling the "Window" menu yet
    //pdtk_canvas_checkgeometry $name
    pdsend(name + " menuclose 1"); // currently, we just force quit(1) on web without canvas_menuclose_callback
}

exports.menu_close = menu_close;

function canvas_menuclose_callback(cid_for_dialog, cid, force) {
    // Hacky-- this should really be dir/filename here instead of
    // filename/args/dir which is ugly. Also, this should use the
    // html5 dialog-- or some CSS equivalent-- instead of the
    // confusing OK/Cancel javascript prompt.
    var nw = patchwin[cid_for_dialog],
        w = nw.window,
        doc = w.document,
        dialog = doc.getElementById("save_before_quit"),
        // hm... we messed up somewhere. It'd be better to set the document
        // title so that we don't have to mess with nw.js-specific properties.
        // Also, it's pretty shoddy to have to split on " * ", and to include
        // the creation arguments in this dialog. We'd be better off storing
        // the actual path and filename somewhere, then just fetching it here.
        title = nw.title.split(" * "),
        dialog_file_slot = doc.getElementById("save_before_quit_filename"),
        yes_button = doc.getElementById("yes_button"),
        no_button = doc.getElementById("no_button"),
        cancel_button = doc.getElementById("cancel_button"),
        filename = title[0],
        dir = title[1];
    if (dir.charAt(0) === "(") {
        dir = dir.slice(dir.indexOf(")")+4); // slice off ") - "
    } else {
        dir = dir.slice(2); // slice off "- "
    }
    dialog_file_slot.textContent = filename;
    dialog_file_slot.title = dir;
    yes_button.onclick = function() {
        w.canvas_events.save_and_close();
    };
    no_button.onclick = function() {
        w.canvas_events.close_without_saving(cid, force);
    };
    cancel_button.onclick = function() {
        w.canvas_events.close_save_dialog();
        w.canvas_events[w.canvas_events.get_previous_state()]();
    }

    // Boy does this seem wrong-- restore() brings the window to the front of
    // the stacking order. But that is really the job of focus(). This works
    // under Ubuntu-- need to test it on OSX...
    nw.restore();
    // Turn off events so that the user doesn't change the canvas state--
    // we actually need to disable the menubar items, too, but we haven't
    // done that yet.
    w.canvas_events.none();
    // go back to original zoom level so that dialog will show up
    nw.zoomLevel = 0;
    // big workaround-- apparently the dialog placement algo and the nw.js
    // zoomLevel state change don't happen deterministically. So we set a
    // timeout to force the dialog to render after the zoomLevel change.

    // Probably the best solution is to give up on using the nw.js zoomLevel
    // method altogether and do canvas zooming completely in the DOM. This will
    // add some math to the canvas_events, so it's probably a good idea to
    // wait until we move most of the GUI functionality out of the C code (or
    // at least until we quit sending incessant "motion" messages to the core).
    w.setTimeout(function() {
        dialog.showModal();
    }, 150);
}

function menuclose_webapp(cid){
    window.document.getElementById("patch"+cid).remove();
    window.canvas_events.remove_canvas_div(cid);
    delete window.shortkeys[cid];
    remove_focused_window(cid);
    add_shortcuts();
}

function gui_canvas_menuclose(cid_for_dialog, cid, force) {
    // Hack to get around a renderer bug-- not guaranteed to work
    // for long patches
    if(is_webapp()){
        menuclose_webapp(cid);
    }else{
        setTimeout(function() {
            canvas_menuclose_callback(cid_for_dialog, cid, force);
        }, 450);
    }
}

function gui_quit_dialog() {
    gui_raise_pd_window();
    var reply = pd_window.window.confirm("Really quit?");
    if (reply === true) {
        pdsend("pd quit");
    }
}

// send a message to Pd
function menu_send(name) {
    if (is_webapp) {
        $(".editmode").removeClass("editmode");
        $('[id*="editmode"]').prop('checked', false);
        $("#message-modal").modal("show");
        $("#message-text").val(name);
    } else {
        var message,
        win = name ? patchwin[name] : pd_window;
        message = win.window.prompt("Type a message to send to Pd", name);
        if (message != undefined && message.length) {
        post("Sending message to Pd: " + message + ";");
        pdsend(message);
        }
    }
}

function web_menu_send() {
    var message = $("#message-text").val();
    if (message != undefined && message.length) {
        post("Sending message to Pd: " + message + ";");
        pdsend(message);
    }
    $("#message-text").val("");
    $("#message-modal").modal("hide");
}

exports.web_menu_send = web_menu_send;

// requires nw.js API (Menuitem)
function canvas_set_editmode(cid, state) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg"
    gui(cid).get_elem(patchsvg_id, function(patchsvg, w) {
        if(is_webapp()){
            patchwin[cid].window.document.getElementById("editmode"+cid).checked = !!state;
        }else{
            w.set_editmode_checkbox(state !== 0 ? true : false);
        }
        
        if (state !== 0) {
            patchsvg.classList.add("editmode");
        } else {
            patchsvg.classList.remove("editmode");
        }
    });
}

exports.canvas_set_editmode = canvas_set_editmode;

function gui_canvas_set_editmode(cid, state) {
    canvas_set_editmode(cid, state);
}

// requires nw.js API (Menuitem)
function gui_canvas_set_cordinspector(cid, state) {
    if(is_webapp()){
        patchwin[cid].window.document.getElementById("cordinspector"+cid).checked = !!state;
    }else{
        patchwin[cid].window.set_cord_inspector_checkbox(state !== 0 ? true : false);
    }
}

function canvas_set_scrollbars(cid, scroll) {
    patchwin[cid].window.document.body.style.overflow = "hidden";
}

exports.canvas_set_scrollbars = canvas_set_scrollbars;

function gui_canvas_set_scrollbars(cid, no_scrollbars) {
    canvas_set_scrollbars(cid, no_scrollbars === 0);
}

exports.menu_send = menu_send;

function gui_set_toplevel_window_list(dummy, attr_array) {
    // We receive an array in the form:
    // ["Name", "address", etc.]
    // where "address" is the cid (x123456etc.)
    // We don't do anything with it at the moment,
    // but they could be added to the "Windows" menu
    // if desired. (Pd Vanilla doesn't do this, but
    // Pd-l2ork (and possibly Pd-extended) did.

    // the "dummy" parameter is just to work around a bug in the gui_vmess API
}

function menu_quit() {
    pdsend("pd verifyquit");
}

exports.menu_quit = menu_quit;

var nw_app_quit;

function app_quit() {
    nw_app_quit();
}

exports.set_app_quitfn = function(quitfn) {
    nw_app_quit = quitfn;
}

function import_file(directory, basename)
{
    if (basename.match(/\.(pat|mxb|help)$/) !=null) {
        post("warning: opening pat|mxb|help not implemented yet");
        if (pd_nt == 0) {
            // on GNU/Linux, cyclist is installed into /usr/bin usually
            cyclist = "/usr/bin/cyclist";
        } else {
            cyclist = pd_guidir + "/bin/cyclist"
        }
        //The following is from tcl and still needs to be ported...

        //convert Max binary to text .pat
        // The following is tcl code which needs to get converted
        // to javascript...
        //set binport [open "| \"$cyclist\" \"$filename\""]
        //set convertedtext [read $binport]
        //if { ! [catch {close $binport} err]} {
        //    if {! [file writable $directory]} {     set directory "/tmp" }
        //    set basename "$basename.pat"
        //    set textpatfile [open "$directory/$basename" w]
        //    puts $textpatfile $convertedtext
        //    close $textpatfile
        //    puts stderr "converted Max binary to text format: $directory/$basename"
        //}
    }
}

function process_file(file, do_open) {
    var filename = defunkify_windows_path(file),
        directory = path.dirname(filename),
        basename = path.basename(filename),
        cyclist;
    if (do_open) import_file(directory, basename);
    if (basename.match(/\.(pd|pat|mxt)$/i) != null) {
        if (do_open) {
            pdsend("pd open", enquote(basename),
                   (enquote(directory)));
        }
        set_pd_opendir(directory);
        //::pd_guiprefs::update_recentfiles "$filename" 1
        // update the recent files list
        var norm_path = path.normalize(directory);
        pdsend("pd add-recent-file", enquote(defunkify_windows_path(path.join(norm_path, basename))));
    }
}

function open_file(file) {
    process_file(file, 1);
}

function gui_process_open_arg(file) {
    // AG: This is invoked when the engine opens a patch file via the command
    // line (-open). In this case the file is already loaded, so we just
    // update the opendir and the recent files list.
    process_file(file, 0);
}

function open_html(target) {
    nw_open_html(target);
}

function open_textfile(target) {
    nw_open_textfile(target);
}

// Think about renaming this and pd_doc_open...

// Open a file-- html, text, or Pd.
function doc_open (dir, basename) {
    // normalize to get rid of extra slashes, ".." and "."
    var norm_path = path.normalize(dir);
    if (basename.slice(-4) === ".txt"
        || basename.slice(-2) === ".c") {
        open_textfile(path.join(norm_path, basename));
    } else if (basename.slice(-5) === ".html"
               || basename.slice(-4) === ".htm"
               || basename.slice(-4) === ".pdf") {
        open_html(path.join(norm_path, basename));

    } else {
        pdsend("pd open", enquote(defunkify_windows_path(basename)),
            enquote(defunkify_windows_path(norm_path)));
    }
}

// Need to rethink these names-- it's confusing to have this and
// pd_doc_open available, but we need this one for dialog_search because
// it uses absolute paths
exports.doc_open = doc_open;

// Open a file relative to the main directory where "doc/" and "extra/" live
function pd_doc_open(dir, basename) {
    doc_open(path.join(lib_dir, dir), basename);
}

exports.pd_doc_open = pd_doc_open;

function web_pd_doc_open(dir, basename) {
    dir = "purr-data/"+ dir;
    open_patch(basename, dir);    
}
exports.web_pd_doc_open = web_pd_doc_open;


function external_doc_open(url) {
    nw_open_external_doc(url);
}
exports.external_doc_open = external_doc_open;

function web_external_doc_open(url) {
    window.open(url);
}
exports.web_external_doc_open = web_external_doc_open;

function gui_set_cwd(dummy, cwd) {
    if (cwd !== ".") {
        pwd = cwd;
        post("working directory is " + cwd);
    }
}

// This doesn't work at the moment.  Not sure how to feed the command line
// filelist to a single instance of node-webkit.
function gui_open_via_unique (secondary_pd_engine_id, unique, file_array) {
    var startup_dir = pwd,
        i,
        file;
    if (unique == 0 && secondary_pd_engine_id !== pd_engine_id) {
        for (i = 0; i < file_array.length; i++) {
            file = file_array[i];
            if (!path.isAbsolute(file)) {
                file = path.join(pwd, file);
            }
            open_file(file);
        }
        quit_secondary_pd_instance(secondary_pd_engine_id);
    }
}

function gui_startup(version, fontname_from_pd, fontweight_from_pd,
    apilist, midiapilist) {
    console.log("Starting up...");
    console.log("gui_startup from GUI...");
    // # tb: user defined typefaces
    // set some global variables
    pd_myversion = version;
    pd_apilist =  apilist;
    pd_midiapilist = midiapilist;

    fontname = fontname_from_pd;
    fontweight = fontweight_from_pd;
    pd_fontlist = "";
    untitled_number = 1; // global variable to increment for each new patch

    // From tcl, not sure if all of it is still needed...

    // # on Mac OS X, lower the Pd window to the background so patches open on top
    // if {$pd_nt == 2} { lower . }
    // # on Windows, raise the Pd window so that it has focused when launched
    // if {$pd_nt == 1} { raise . }

    // set fontlist ""
    // if {[info tclversion] >= 8.5} {find_default_font}
    //        set_base_font $fontname_from_pd $fontweight_from_pd
    //        fit_font_into_metrics

    //    # UBUNTU MONO 6 6 8 10 11 14 14 19 22 30
    //        # DEJAVU SANS MONO 6 6 8 9 10 12 14 18 22 29

    //#    foreach i {6 6 8 10 11 14 14 19 22 30} {
    //#        set font [format {{%s} %d %s} $fontname_from_pd $i $fontweight_from_pd]
    //#        set pd_fontlist [linsert $pd_fontlist 100000 $font]
    //#        set width0 [font measure  $font x]
    //#        set height0 [lindex [font metrics $font] 5]
    //#        set fontlist [concat $fontlist $i [font measure  $font x] \
    //#                          [lindex [font metrics $font] 5]]
    //#    }

    //    set tclpatch [info patchlevel]
    //    if {$tclpatch == "8.3.0" || \
    //            $tclpatch == "8.3.1" || \
    //            $tclpatch == "8.3.2" || \
    //            $tclpatch == "8.3.3" } {
    //        set oldtclversion 1
    //    } else {
    //        set oldtclversion 0
    //    }

    var l_pwd = is_webapp() ? "/" : enquote(defunkify_windows_path(pwd))
    pdsend("pd init", l_pwd, "0",
        font_fixed_metrics);

    //    # add the audio and help menus to the Pd window.  We delayed this
    //    # so that we'd know the value of "apilist".
    //    menu_addstd .mbar

    //    global pd_nt
    //    if {$pd_nt == 2} {
    //        global pd_macdropped pd_macready
    //        set pd_macready 1
    //        foreach file $pd_macdropped {
    //            pd [concat pd open [pdtk_enquote [file tail $file]] \
    //                    [pdtk_enquote  [file dirname $file]] \;]
    //            menu_doc_open [file dirname $file] [file tail $file]
    //        }
    //    }
}

// Global canvas associative arrays (aka javascript objects)
var scroll = {},
    menu = {},
    canvas_color = {},
    topmost = {},
    resize = {},
    xscrollable = {},
    yscrollable = {},
    update_tick = {},
    drag_tick = {},
    undo = {},
    redo = {},
    font = {},
    doscroll = {},
    last_loaded, // last loaded canvas
    last_focused, // last focused canvas (doesn't include Pd window or dialogs)
    loading = {},
    title_queue= {}, // ugly kluge to work around an ugly race condition
    popup_menu = {};

    var patchwin = {}; // object filled with cid: [Window object] pairs
    var dialogwin = {}; // object filled with did: [Window object] pairs

exports.get_patchwin = function(name) {
    return patchwin[name];
}

var set_patchwin = function(cid, win) {
    patchwin[cid] = win;
    if (win) {
        gui.add(cid, win);
    } else {
        gui.remove(cid, win);
    }
}

exports.set_patchwin = set_patchwin;

exports.get_dialogwin = function(name) {
    return dialogwin[name];
}

exports.set_dialogwin = function(did, win) {
    dialogwin[did] = win;
}

exports.remove_dialogwin = function(name) {
    dialogwin[name] = null;
}

// stopgap...
pd_colors["canvas_color"] = "white";

exports.last_loaded = function () {
    return last_loaded;
}

// close a canvas window

function gui_canvas_cursor(cid, pd_event_type) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(patch) {
        // A quick mapping of events to pointers-- these can
        // be revised later
        var c;
        switch(pd_event_type) {
            case "cursor_runmode_nothing":
                c = "default";
                break;
            case "cursor_runmode_clickme":
                // The "pointer" icon seems the natural choice for "clickme"
                // here, but unfortunately it creates ambiguity with the
                // default editmode pointer icon. Not sure what the best
                // solution is, but for now so we use "default" for clickme.
                // That creates another ambiguity, but it's less of an issue
                // since most of the clickable runtime items are fairly obvious
                // anyway.

                //c = "pointer";

                c = "default";
                break;
            case "cursor_runmode_thicken":
                c = "inherit";
                break;
            case "cursor_runmode_addpoint":
                c = "cell";
                break;
            case "cursor_editmode_nothing":
                c = "pointer";
                break;
            case "cursor_editmode_connect":
                c = "-webkit-grabbing";
                break;
            case "cursor_editmode_disconnect":
                c = "no-drop";
                break;
            case "cursor_editmode_resize":
                c = "ew-resize";
                break;
            case "cursor_editmode_resize_bottom_right":
                c = "se-resize";
                break;
            case "cursor_scroll":
                c = "all-scroll";
                break;
            case "cursor_editmode_resize_vert":
                c = "ns-resize";
                break;
            case "cursor_editmode_move":
                c = "move";
                break;
        }
        patch.style.cursor = c;
    });
}

// Note: cid can either be a real canvas id, or the string "pd" for the
// console window
function canvas_sendkey(cid, state, evt, char_code, repeat) {
    var shift = evt.shiftKey ? 1 : 0,
        repeat_number = repeat ? 1 : 0;
    pdsend(cid, "key", state, char_code, shift, 1, repeat_number);
}

exports.canvas_sendkey = canvas_sendkey;

function title_callback(cid, title) {
    patchwin[cid].window.document.title = title;
}

function format_window_title(name, dirty_flag, args, dir) {
        return name + " " + (dirty_flag ? "*" : "") + args + " - " + dir;
}

exports.format_window_title = format_window_title;

// This should be used when a file is saved with the name changed
// (and maybe in other situations)
function gui_canvas_set_title(cid, name, args, dir, dirty_flag) {
    if(is_webapp()){
        if (patchwin[cid]) {
            window.canvas_events.update_filename(cid, name);
        }        
    }else{
        var title = format_window_title(name, dirty_flag, args, dir);
        if (patchwin[cid]) {
            patchwin[cid].title = title;
        } else {
            title_queue[cid] = title;
        }
    }
}

function query_title_queue(cid) {
    return title_queue[cid];
}

exports.query_title_queue = query_title_queue;

function free_title_queue(cid) {
    title_queue[cid] = null;
}

exports.free_title_queue = free_title_queue;

function window_is_loading(cid) {
    return loading[cid];
}

exports.window_is_loading = window_is_loading;

function set_window_finished_loading(cid) {
    loading[cid] = null;
}

exports.set_window_finished_loading = set_window_finished_loading;

// wrapper for nw_create_window
function create_window(cid, type, width, height, xpos, ypos, attr_array) {
    nw_create_window(cid, type, width, height, xpos, ypos, attr_array);
    // initialize variable to reflect that this window has been opened
    loading[cid] = true;
    // we call set_patchwin from the callback in pd_canvas
}

// create a new canvas
function gui_canvas_new(cid, width, height, geometry, zoom, editmode, name, dir, dirty_flag, hide_scroll, hide_menu, cargs) {
    // hack for buggy tcl popups... should go away for node-webkit
    //reset_ctrl_on_popup_window

    // local vars for window-specific behavior
    // visibility of menu and scrollbars, plus canvas background
    scroll[cid] = 1;
    menu[cid] = 1;
    // attempt at getting global presets to play
    // well with local settings.
    var my_canvas_color = "";
    //canvas_color[cid] = orange;
    my_canvas_color = pd_colors["canvas_color"];
    topmost[cid] = 0;
    resize[cid] = 1;
    xscrollable[cid] = 0;
    yscrollable[cid] = 0;
    update_tick[cid] = 0;
    drag_tick[cid] = 0;
    undo[cid] = false;
    redo[cid] = false;
    font[cid] = 10;
    doscroll[cid] = 0;
    // geometry is just the x/y screen offset "+xoff+yoff"
    geometry = geometry.slice(1);   // remove the leading "+"
    geometry = geometry.split("+"); // x/y screen offset (in pixels)
    // Keep patches on the visible screen
    var xpos = Math.min(Number(geometry[0]), window.screen.width - width);
    var ypos = Math.min(Number(geometry[1]), window.screen.height - height);
    xpos = Math.max(xpos, 0);
    ypos = Math.max(ypos, 0);
    var menu_flag;
    if (menu[cid] == 1) {
        menu_flag = true;
    } else {
        menu_flag = false;
    }
    last_loaded = cid;
    // Not sure why resize and topmost are here-- but we'll pass them on for
    // the time being...
    create_window(cid, "pd_canvas", width, height,
        xpos, ypos, {
            menu_flag: menu_flag,
            resize: resize[cid],
            topmost: topmost[cid],
            color: my_canvas_color,
            name: name,
            dir: dir,
            dirty: dirty_flag,
            args: cargs,
            zoom: zoom,
            editmode: editmode,
            hide_scroll: hide_scroll
    });
}

/* This gets sent to Pd to trigger each object on the canvas
   to do its "vis" function. The result will be a flood of messages
   back from Pd to the GUI to draw these objects */
function canvas_map(name) {
    console.log("canvas mapping " + name + "...");
    pdsend(name + " map 1");
}

function gui_canvas_erase_all_gobjs(cid) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg"
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var elem;
        while (elem = svg_elem.firstChild) {
            svg_elem.removeChild(elem);
        }
    });
}

exports.canvas_map = canvas_map;

// Start Pd

// If the GUI is started first (as in a Mac OSX Bundle) we use this
// function to actually start the core
function spawn_pd(gui_path, port, file_to_open) {
    post("gui_path is " + gui_path);
    var pd_binary,
        platform = process.platform,
        flags = ["-guiport", port];
    if (platform === "darwin") {
        // OSX -- this is currently tailored to work with an app bundle. It
        // hasn't been tested with a system install of pd-l2ork
        pd_binary = path.join(gui_path, "bin", "pd-l2ork");
        if (file_to_open) {
            flags.push("-open", file_to_open);
        }
    } else {
        pd_binary = path.join(gui_path, "..", "bin", "pd-l2ork");
        flags.push("-nrt"); // for some reason realtime causes watchdog to die
    }
    post("binary is " + pd_binary);
    // AG: It isn't nice that we change the cwd halfway through the startup
    // here, but since the GUI launches the engine if we come here (that's how
    // it works on the Mac), we *really* want to launch the engine in the
    // user's home directory and not in some random subdir of the OSX app
    // bundle. Note that to make that work, the pd-l2ork executable needs to
    // be invoked using an absolute path (see above).
    process.chdir(process.env.HOME);
    var child = cp.spawn(pd_binary, flags, {
        stdio: "inherit",
        detached: true
    });
    child.on("error", function(err) {
        pd_window.alert("Couldn't successfully start Pd due to an error:\n\n" +
          err + "\n\nClick Ok to close Pd.");
        process.exit(1);
    });
    child.unref();
    post("Pd started.");
}

// net stuff
var net = require("net");

var HOST = "127.0.0.1";
var PORT;
var connection; // the GUI's socket connection to Pd

exports.set_port = function (port_no) {
    PORT = port_no;
}

var secondary_pd_engines = {};

// This is an alarmingly complicated and brittle approach to opening
// files from a secondary instance of Pd in a currently running instance.
// It works something like this:
// 1. User is running an instance of Purr Data.
// 2. User runs another instance of Purr Data from the command line, specifying
//    files to be opened as command line args. Or, they click on a file which
//    in the desktop or file manager which triggers the same behavior.
// 2. A new Pd process starts-- let's call it a "secondary pd engine".
// 3. The secondary pd engine tries to run a new GUI.
// 4. The secondary GUI forwards an "open" message to the currently running GUI.
// 5. The secondary GUI exits (before spawning any windows).
// 6. The original GUI receives the "open" message, finds the port number
//    for the secondary Pd engine, and opens a socket to it.
// 7. The original GUI receives a message to set the working directory to
//    whatever the secondary Pd engine thinks it should be.
// 8. The original GUI sends a message to the secondary Pd instance, telling
//    it to send a list of files to be opened.
// 9. The original GUI receives a message from the secondary Pd instance
//    with the list of files.
// 10.For each file to be opened, the original GUI sends a message to the
//    _original_ Pd engine to open the file.
// 11.Once these messages have been sent, the original GUI sends a message
//    to the secondary Pd engine to quit.
// 12.The original Pd engine opens the files, and the secondary Pd instance
//    quits.
function connect_as_client_to_secondary_instance(host, port, pd_engine_id) {
    var client = new net.Socket(),
        command_buffer = {
            next_command: ""
    };
    client.setNoDelay(true);
    client.connect(+port, host, function() {
        console.log("CONNECTED TO: " + host + ":" + port);
        secondary_pd_engines[pd_engine_id] = {
            socket: client
        }
        client.write("pd forward_files_from_secondary_instance;");
    });
    client.on("data", function(data) {
        // Terrible thing:
        // We're parsing the data as it comes in-- possibly
        // from multiple ancillary instances of the Pd engine.
        // So to retain some semblance of sanity, we only let the
        // parser evaluate commands that we list in the array below--
        // anything else will be discarded.  This is of course bad
        // because it means simple changes to the code, e.g., changing
        // the name of the function "gui_set_cwd" would cause a bug
        // if you forget to come here and also change that name in the
        // array below.
        // Another terrible thing-- gui_set_cwd sets a single, global
        // var for the working directory. So if the user does something
        // weird like write a script to open files from random directories,
        // there would be a race and it might not work.
        // Yet another terrible thing-- now we're setting the current
        // working directory both in the GUI, and from the secondary instances
        // with "gui_set_cwd" below.
        perfect_parser(data, command_buffer, [
            "gui_set_cwd",
            "gui_open_via_unique"
        ]);
    });
    client.on("close", function () {
        // I guess somebody could script opening patches in an
        // installation, so let's go ahead and delete the key here
        // (The alternative is just setting it to undefined)
        delete secondary_pd_engines[pd_engine_id];
    });
}

function quit_secondary_pd_instance (pd_engine_id) {
    secondary_pd_engines[pd_engine_id].socket.write("pd quit;");
}

// This is called when the running GUI receives an "open" event.
exports.connect_as_client_to_secondary_instance =
    connect_as_client_to_secondary_instance;

function connect_as_client() {
    var client = new net.Socket();
    client.setNoDelay(true);
    // uncomment the next line to use fast_parser (then set its callback below)
    //client.setEncoding("utf8");
    client.connect(PORT, HOST, function() {
        console.log("CONNECTED TO: " + HOST + ":" + PORT);
    });
    connection = client;
    init_socket_events();
}

exports.connect_as_client = connect_as_client;

function connect_as_server(gui_path, file_path) {
    var server = net.createServer(function(c) {
            post("incoming connection to GUI");
            connection = c;
            init_socket_events();
        }),
        port = PORT,
        ntries = 0,
        listener_callback = function() {
            post("GUI listening on port " + port + " on host " + HOST);
            spawn_pd(gui_path, port, file_path);
        };
    server.listen(port, HOST, listener_callback);
    // try to reconnect if necessary
    server.on("error", function (e) {
        if (e.code === "EADDRINUSE" && ntries++ < 20) {
            post("Address in use, retrying...");
            port++;
            setTimeout(function () {
                server.close();
                server.listen(port, HOST); // (already have the callback above)
            }, 30); // Not sure we really need a delay here
        } else {
            pd_window.alert("Error: couldn't bind to a port. Either port nos " +
                  PORT + " through " + port + " are taken or you don't have " +
                  "networking turned on. (See Pd's html doc for details.)");
            server.close();
            process.exit(1);
        }
    });
}

exports.connect_as_server = connect_as_server;

// Add a 'data' event handler for the client socket
// data parameter is what the server sent to this socket

// We're not receiving FUDI (i.e., Pd) messages. Right now we're just using
// the unit separator (ASCII 31) to signal the end of a message. This is
// easier than checking for unescaped semicolons, since it only requires a
// check for a single byte. Of course this makes it more brittle, so it can
// be changed later if needed.

function perfect_parser(data, cbuf, sel_array) {
        var i, len, selector, args;
        len = data.length;
        for (i = 0; i < len; i++) {
            // check for end of command:
            if (data[i] === 31) { // unit separator
                // decode next_command
                try {
                    // This should work for all utf-8 content
                    cbuf.next_command =
                        decodeURIComponent(cbuf.next_command);
                }
                catch(err) {
                    // This should work for ISO-8859-1
                    cbuf.next_command = unescape(cbuf.next_command);
                }
                // Turn newlines into backslash + "n" so
                // eval will do the right thing with them
                cbuf.next_command = cbuf.next_command.replace(/\n/g, "\\n");
                cbuf.next_command = cbuf.next_command.replace(/\r/g, "\\r");
                selector = cbuf.next_command.slice(0, cbuf.next_command.indexOf(" "));
                args = cbuf.next_command.slice(selector.length + 1);
                cbuf.next_command = "";
                // Now evaluate it
                //post("Evaling: " + selector + "(" + args + ");");
                // For communicating with a secondary instance, we filter
                // incoming messages. A better approach would be to make
                // sure that the Pd engine only sends the gui_set_cwd message
                // before "gui_startup".  Then we could just check the
                // Pd engine id in "gui_startup" and branch there, instead of
                // fudging with the parser here.
                if (!sel_array || sel_array.indexOf(selector) !== -1) {
                    eval(selector + "(" + args + ");");
                }
            } else {
                cbuf.next_command += "%" +
                    ("0" // leading zero (for rare case of single digit)
                     + data[i].toString(16)) // to hex
                       .slice(-2); // remove extra leading zero
            }
        }
    };
exports.perfect_parser = perfect_parser;

function init_socket_events () {
    // A not-quite-FUDI command: selector arg1,arg2,etc. These are
    // formatted on the C side to be easy to parse here in javascript
    var command_buffer = {
        next_command: ""
    };
    connection.on("data", function(data) {
        perfect_parser(data, command_buffer);
    });
    connection.on("error", function(e) {
        console.log("Socket error: " + e.code);
        nw_app_quit();
    });

    // Add a "close" event handler for the socket
    connection.on("close", function() {
        //console.log("Connection closed");
        //connection.destroy();
        nw_app_quit(); // set a timeout here if you need to debug
    });
}

exports.init_socket_events = init_socket_events;

// Send commands to Pd
function pdsend() {
    if(is_webapp()){
        var string = Array.prototype.join.call(arguments, " ");
        var array = string.split(" ");
        Module.pd.startMessage(array.length - 2);
        for (let i = 2; i < array.length; i++) {
          if ((isNaN(array[i])) || array[i] === "" ) {
            Module.pd.addSymbol(array[i]);
          }
          else {
            Module.pd.addFloat(parseFloat(array[i]));
          }
        }
        Module.pd.finishMessage(array[0], array[1]);
    }else{
        // Using arguments in this way disables V8 optimization for
        // some reason.  But it doesn't look like it makes that much
        // of a difference
        var string = Array.prototype.join.call(arguments, " ");
        connection.write(string + ";");
        // reprint the outgoing string to the pdwindow
        //post(string + ";", "red");
    }
}
exports.pdsend = pdsend;

//--------------------- Webapp file sys handler ----------------------------
var workspace = "/home/web_user/"

function upload_patch(files) {      
    if (files.length === 0) {
        console.log("No file is selected");
        return;
    }

    var fileInput = document.getElementById("uploadPatch");
    var allowedExtension = ".pd";

    // Check that the file extension is supported.
    // If not, clear the input.
    var hasInvalidFiles = false;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        if (!file.name.endsWith(allowedExtension)) {
        hasInvalidFiles = true;
        }
    }
    
    if(hasInvalidFiles) {
        fileInput.value = ""; 
        alert("Unsupported file selected.");
    }

    for (const file of files){
        var reader = new FileReader();
        reader.onload = function () {
        var data = new Uint8Array(reader.result);
        FS.createDataFile(workspace, file.name, data, true, true, true);
        };
        reader.readAsArrayBuffer(file);
    }

    // Refresh file list after upload file
    setTimeout(function(){ 
        update_file_ls(); 
    }, 200);
    
}

exports.upload_patch = upload_patch;

function open_patch(file_name, dir) {
    if (dir === undefined) dir = workspace;
    Module.pd.openPatch(file_name, dir);
}

exports.open_patch = open_patch;

function close_patch(file_name) {
    if (file_name === "") return;
    Module.pd.closePatch(file_name);
}

exports.close_patch = close_patch;

function download_patch(file_name) {
    if (file_name === "") return;
    var found = false;

    for (const file of FS.readdir(workspace)){
        if (file_name == file) {
            found = true;
        }        
    }
    
    if(found){
        var content = FS.readFile(workspace+file_name);        
        var a = document.createElement('a');
        a.download = file_name;
        var blob = new Blob(
            [content],
            {
                type: "text/plain;charset=utf-8"
            }
        );
        a.href = URL.createObjectURL(blob);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }, 2000);
     } else{
        alert("Please save before download!")
        return;
    }
}

exports.download_patch = download_patch;

function delete_file(file_name) {
    FS.unlink(workspace+file_name, function(err) {
        console.log(err);
    });
    update_file_ls();
}

function edit_file_name(file_name) {
    var new_name = prompt("Enter new file name", file_name);  
    if (new_name != null) {
        FS.rename(workspace+file_name, workspace+new_name, function(err) {
            console.log(err);
        });
        update_file_ls();
    }
}

function update_file_ls(){
    var file_ls = window.document.getElementById("file_ls");
    file_ls.innerHTML = "";
    var files_added = 0;

    for (const file of FS.readdir(workspace)){
        var mode = FS.stat(workspace+file).mode;
        if(FS.isFile(mode)){
            var list_item = window.document.createElement("div");
            var icons = window.document.createElement("div");
            var li = window.document.createElement("li");
            var a = window.document.createElement("a");
            var edit_icon = window.document.createElement("i");
            edit_icon.classList.add("fa", "fa-pencil", "text-primary", "edit");
            var trash_icon = window.document.createElement("i");
            trash_icon.classList.add("fa", "fa-trash", "text-primary", "delete");
            icons.setAttribute("id", "file-icons");
            list_item.classList.add("d-flex", "justify-content-between");
            list_item.setAttribute("id", "list-item");
            // Add name of file
            a.append(file);
    
            // Add open button
            a.onclick = function(){open_patch(file)};
            trash_icon.onclick = function(){delete_file(file)};
            edit_icon.onclick = function(){edit_file_name(file)};
            li.append(a);
            li.classList.add("d-inline-block", "text-truncate");

            //append elements
            list_item.append(li);
            icons.append(edit_icon);
            icons.append(trash_icon);
            list_item.append(icons);
            file_ls.append(list_item);
            files_added = files_added + 1;
        }
    }

    if(files_added > 0){
        window.document.getElementById("file_ls_empty").style.display = "none";
    }else{
        window.document.getElementById("file_ls_empty").style.display = "block";
    }
}
exports.update_file_ls = update_file_ls;


// Send a ping message back to Pd
function gui_ping() {
    pdsend("pd ping");
}

// Send a message to Pd to ping the "watchdog", which is a program
// that supervises Pd when run with -rt flag on some OSes
function gui_ping_watchdog() {
    pdsend("pd watchdog");
}

// Schedule watchdog pings for the life of the GUI
function gui_watchdog() {
    setInterval(gui_ping_watchdog, 2000);
}

// Text drawing stuff

// Here's the main API, structured to make an easier (inital) transition
// from tcl/tk to javascript

// Gobj container, so that all drawn items are contained in a <g> which
// handles displacing (and in the future, possibly clicks and other events)
function get_gobj(cid, object) {
    return patchwin[cid].window.document.getElementById(object + "gobj");
}

// Convenience function to get a drawn item of gobj
function get_item(cid, item_id) {
    return patchwin[cid].window.document.getElementById(item_id);
}

// Similar to [canvas create] in tk
function create_item(cid, type, args) {
    var item = patchwin[cid].window.document
        .createElementNS("http://www.w3.org/2000/svg", type);
    if (args !== null) {
        configure_item(item, args);
    }
    return item;
}

// Similar to [canvas itemconfigure], without the need for a reference
// to the canvas
function configure_item(item, attributes) {
    // draw_vis from g_template sends attributes
    // as a ["attr1",val1, "attr2", val2, etc.] array,
    // so we check for that here
    var value, i, attr;
    if (Array.isArray(attributes)) {
        // we should check to make sure length is even here...
        for (i = 0; i < attributes.length; i+=2) {
            value = attributes[i+1];
            item.setAttributeNS(null, attributes[i],
                Array.isArray(value) ? value.join(" "): value);
        }
    } else {
        for (attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                if (item) {
                    item.setAttributeNS(null, attr, attributes[attr]);
                }
            }
        }
    }
}

// The GUI side probably shouldn't know about "items" on SVG.
function gui_configure_item(cid, tag, attributes) {
    gui(cid).get_elem(tag, attributes);
}

function add_gobj_to_svg(svg, gobj) {
    svg.insertBefore(gobj, svg.querySelector(".cord"));
}

// New interface to incrementally move away from the tcl-like functions
// we're currently using. Basically like a trimmed down jquery, except
// we're dealing with multiple toplevel windows so we need an window id
// to get the correct Pd canvas context. Also, some of Pd's t_text tags
// still have "." in them which unfortunately means we must wrap
// getElementById instead of the more expressive querySelector[All] where
// the "." is interpreted as a CSS class selector.

// Methods:
// get_gobj(id, callbackOrObject) returns a reference to this little canvas
//                                interface
// get_elem(id, callbackOrObject) returns a reference to this little canvas
//                                interface
// get_nw_window(callback)        returns a reference to the nw.js Window
//                                wrapper. We keep this separate from the
//                                others in order to annotate those parts
//                                of the code which rely on the nw API (and
//                                abstract them out later if we need to)

// objects are used to set SVG attributes (in the SVG namespace)
// function callbacks have the following args: (DOMElement, window)

// Note about checking for existence:
// Why? Because an iemgui inside a gop canvas will send drawing updates,
// __even__ __if__ that iemgui is outside the bounds of the gop and thus
// not displayed. This would be best fixed in the C code, but I'm not
// exactly sure where or how yet.
// Same problem on Pd Vanilla, except that tk canvas commands on
// non-existent tags don't throw an error.

var gui = (function() {
    var c = {}; // object to hold references to all our canvas closures
    // We store the last "thing" we fetched from the window. This is either
    // the window itself or a "gobj". Regular old DOM elements that aren't
    // a "gobj" container don't count. This way we can do a "get_gobj" then
    // gang multiple element queries after it that work within our last
    // "gobj." (Same for window.)
    var last_thing;
    var null_fn, null_canvas;
    var create_canvas = function(cid, w) {
        var get = function(parent, sel, arg, suffix) {
            sel = sel + (suffix ? "gobj" : "");
            var elem = parent ?
                parent.querySelector(sel) :
                w.window.document.getElementById(sel);
            last_thing = parent ? last_thing : elem;
            if (elem) {
                if (arg && typeof arg === "object") {
                    configure_item(elem, arg);
                } else if (typeof arg === "function") {
                    arg(elem, w.window, c[cid]);
                }
            }
            return c[cid];
        }
        return {
            append: !w ? null_fn: function(cb) {
                var frag = w.window.document.createDocumentFragment();
                frag = cb(frag, w.window, c[cid]);
                if (last_thing) {
                    last_thing.appendChild(frag);
                }
                return c[cid];
            },
            get_gobj: !w ? null_fn : function(sel, arg) {
                return get(null, sel, arg, "gobj");
            },
            get_elem: !w ? null_fn : function(sel, arg) {
                return get(null, sel, arg);
            },
            get_nw_window: !w ? null_fn : function(cb) {
                cb(w);
                return c[cid];
            },
            q: !w ? null_fn : function(sel, arg) {
                return last_thing ? get(last_thing, sel, arg) : c[cid];
            },
            debug: function() { return last_thing; }
        }
    };
    // The tcl/tk interface ignores calls to configure non-existent items on
    // canvases. Additionally, its interface was synchronous so that the window
    // would always be guaranteed to exist. So we create a null canvas to keep
    // from erroring out when things don't exist.
    null_fn = function() {
        return null_canvas;
    }
    null_canvas = create_canvas(null);
    var canvas_container = function(cid) {
        last_thing = c[cid] ? c[cid] : null_canvas;
        return last_thing;
    }
    canvas_container.add = function(cid, nw_win) {
        c[cid] = create_canvas(cid, nw_win);
    }
    canvas_container.remove = function(cid, nw_win) {
        c[cid] = null;
    }
    return canvas_container;
}());

// For debugging
exports.gui = gui;

// Most of the following functions map either to pd.tk procs, or in some cases
// tk canvas subcommands

// The "gobj" is a container for all the shapes/paths used to display
// a graphical object on the canvas. This comes in handy-- for example, we
// can displace an object just by translating its "gobj".

// Object, message, and xlet boxes should be crisp (i.e., no anti-aliasing),
// and the "shape-rendering" attribute of "crispEdges" acheives this. However,
// that will also create asymmetric line-widths when scaling-- for example,
// the left edge of a rect may be 3 pixels while the right edge is 4. I'm not
// sure whether this is a bug or just the quirky behavior of value "crispEdges".
// As a workaround, we explicitly add "0.5" to the gobj's translation
// coordinates below. This aligns the shapes-- lines, polygons, and rects
// with a 1px stroke-- to the pixel grid, making them crisp.

// Also-- note that we have a separate function for creating a scalar.
// This is because the user may be drawing lines or paths as
// part of a scalar, in which case we want to leave it up to them to align
// their drawing to the pixel grid. For example, imagine a user pasting a
// path command from the web. If that path already employs the "0.5" offset
// to align to the pixel-grid, a gobj offset would cancel it out. That
// would mean the Pd user always has to do the _opposite_ of what they read
// in SVG tutorials in order to get crisp lines, which is bad.
// In the future, it might make sense to combine the scalar and object
// creation, in which case a flag to toggle the offset would be appropriate.

function gui_gobj_new(cid, tag, type, xpos, ypos, is_toplevel) {
    var g;
    xpos += 0.5,
    ypos += 0.5;
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var transform_string = "matrix(1,0,0,1," + xpos + "," + ypos + ")";
        g = create_item(cid, "g", {
            id: tag + "gobj",
            transform: transform_string,
            class: type + (is_toplevel !== 0 ? "" : " gop")
        });
        add_gobj_to_svg(svg_elem, g);
    });
    return g;
}

function gui_text_draw_border(cid, tag, bgcolor, isbroken, width, height) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        // isbroken means either
        //     a) the object couldn't create or
        //     b) the box is empty
        var rect = create_item(cid, "rect", {
            width: width,
            height: height,
            //"shape-rendering": "crispEdges",
            class: "border"
        });
        if (isbroken === 1) {
            rect.classList.add("broken_border");
        }
        frag.appendChild(rect);
        return frag;
    });
}

function gui_gobj_draw_io(cid, parenttag, tag, x1, y1, x2, y2, basex, basey,
    type, i, is_signal, is_iemgui) {
    gui(cid).get_gobj(parenttag)
    .append(function(frag) {
        var xlet_class, xlet_id, rect;
        if (is_iemgui) {
            xlet_class = "xlet_iemgui";
            // We have an inconsistency here.  We're setting the tag using
            // string concatenation below, but the "tag" for iemguis arrives
            // to us pre-concatenated.  We need to remove that formatting in c,
            // and in general try to simplify tag creation on the c side as
            // much as possible.
            xlet_id = tag;
        } else if (is_signal) {
            xlet_class = "xlet_signal";
            xlet_id = tag + type + i;
        } else {
            xlet_class = "xlet_control";
            xlet_id = tag + type + i;
        }
        rect = create_item(cid, "rect", {
            width: x2 - x1,
            height: y2 - y1,
            x: x1 - basex,
            y: y1 - basey,
            id: xlet_id,
            class: xlet_class,
            //"shape-rendering": "crispEdges"
        });
        frag.appendChild(rect);
        return frag;
    });
}

function gui_gobj_redraw_io(cid, parenttag, tag, x, y, type, i, basex, basey) {
    // We have to check for null. Here's why...
    // if you create a gatom:
    //   canvas_atom -> glist_add -> text_vis -> glist_retext ->
    //     rtext_retext -> rtext_senditup ->
    //       text_drawborder (firsttime=0) -> glist_drawiofor (firsttime=0)
    // This means that a new gatom tries to redraw its inlets before
    // it has created them.
    gui(cid).get_elem(tag + type + i, {
        x: x - basex,
        y: y - basey
    });
}

function gui_gobj_erase_io(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_gobj_configure_io(cid, tag, is_iemgui, is_signal, width) {
    gui(cid).get_elem(tag, {
        "stroke-width": width
    })
    .get_elem(tag, function(e) {
        var type;
        if (is_iemgui) {
            type = "xlet_iemgui";
        } else if (is_signal) {
            type = "xlet_signal";
        } else {
            "xlet_control";
        }
        e.classList.add(type);
        e.classList.remove("xlet_selected");
    });
}

function gui_gobj_highlight_io(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.classList.add("xlet_selected");
    });
}

function message_border_points(width, height) {
    return [0,0,
            width+4, 0,
            width, 4,
            width, height-4,
            width+4, height,
            0, height,
            0, 0]
        .join(" ");
}

function gui_message_draw_border(cid, tag, width, height) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var polygon = create_item(cid, "polygon", {
            points: message_border_points(width, height),
            fill: "none",
            stroke: "black",
            class: "border"
            //id: tag + "border"
        });
        frag.appendChild(polygon);
        return frag;
    });
}

function gui_message_flash(cid, tag, state) {
    gui(cid).get_gobj(tag, function(e) {
        if (state !== 0) {
            e.classList.add("flashed");
        } else {
            e.classList.remove("flashed");
        }
    });
}

function gui_message_redraw_border(cid, tag, width, height) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        points: message_border_points(width, height)
    });
}

function atom_border_points(width, height, is_dropdown) {
    // For atom, angle the top-right corner.
    // For dropdown, angle both top-right and bottom-right corners
    var bottom_right_x = is_dropdown ? width - 4 : width;
    return  [0, 0,
            width - 4, 0,
            width, 4,
            width, height - 4,
            bottom_right_x, height,
            0, height,
            0, 0]
        .join(" ");
}

function atom_arrow_points(width, height) {
    var m = height < 20 ? 1 : height / 12;
    return [width - (9 * m), height * 0.5 - Math.floor(1 * m),
        width - (3 * m), height * 0.5 - Math.floor(1 * m),
        width - (6 * m), height * 0.5 + Math.floor(4 * m),
    ].join(" ");
}

function gui_atom_draw_border(cid, tag, type, width, height) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var polygon = create_item(cid, "polygon", {
            points: atom_border_points(width, height, type !== 0),
            fill: "none",
            stroke: "gray",
            "stroke-width": 1,
            class: "border"
            //id: tag + "border"
        });
           
        frag.appendChild(polygon);
        if (type !== 0) { // dropdown
            // 1 = output index
            // 2 = output value
            // Let's make the two visually distinct so that the user can still
            // reason about the patch functionality merely by reading the
            // diagram
            var m = height < 20 ? 1 : height / 12;
            var arrow = create_item(cid, "polygon", {
                points: atom_arrow_points(width, height),
                "class": type === 1 ? "arrow index_arrow" : "arrow value_arrow"
            });
            frag.appendChild(arrow);
        }
        return frag;
    });
}

function gui_atom_redraw_border(cid, tag, type, width, height) {
    gui(cid).get_gobj(tag)
    .q("polygon",  {
        points: atom_border_points(width, height, type !== 0) 
    });
    if (type !== 0) {
        gui(cid).get_gobj(tag)
        .q(".arrow", {
            points: atom_arrow_points(width, height)
        });
    }
}

// draw a patch cord
function gui_canvas_line(cid,tag,type,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg"
    gui(cid).get_elem(patchsvg_id)
    .append(function(frag) {
        var svg = get_item(cid, "patchsvg"),
        // xoff is for making sure straight lines are crisp.  An SVG stroke
        // straddles the coordinate, with 1/2 the width on each side.
        // Control cords are 1 px wide, which requires a 0.5 x-offset to align
        // the stroke to the pixel grid.
        // Signal cords are 2 px wide = 1px on each side-- no need for x-offset.
            xoff = type === 'signal' ? 0 : 0.5,
            d_array = ["M", p1 + xoff, p2 + xoff,
                       "Q", p3 + xoff, p4 + xoff, p5 + xoff, p6 + xoff,
                       "Q", p7 + xoff, p8 + xoff, p9 + xoff, p10 + xoff],
            path;
        path = create_item(cid, "path", {
            d: d_array.join(" "),
            fill: "none",
            //"shape-rendering": "optimizeSpeed",
            id: tag,
            "class": "cord " + type
        });
        frag.appendChild(path);
        return frag;
    });
}

function gui_canvas_select_line(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.classList.add("selected_line");
    });
}

function gui_canvas_deselect_line(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.classList.remove("selected_line");
    });
}

// rename to erase_line (or at least standardize with gobj_erase)
function gui_canvas_delete_line(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_canvas_update_line(cid, tag, x1, y1, x2, y2, yoff) {
    // We have to check for existence here for the special case of
    // preset_node which hides a wire that feeds back from the downstream
    // object to its inlet. Pd refrains from drawing this hidden wire at all.
    // It should also suppress a call here to update that line, but it
    // currently doesn't. So we check for existence.
    gui(cid).get_elem(tag, function(e) {
        var halfx = parseInt((x2 - x1)/2),
            halfy = parseInt((y2 - y1)/2),
            xoff, // see comment in gui_canvas_line about xoff
            d_array;
        xoff = e.classList.contains("signal") ? 0: 0.5;
        d_array = ["M",x1+xoff,y1+xoff,
                   "Q",x1+xoff,y1+yoff+xoff,x1+halfx+xoff,y1+halfy+xoff,
                   "Q",x2+xoff,y2-yoff+xoff,x2+xoff,y2+xoff];
        configure_item(e, { d: d_array.join(" ") });
    });
}

function text_line_height_kludge(fontsize, fontsize_type) {
    var pd_fontsize = fontsize_type === "gui" ?
        gui_fontsize_to_pd_fontsize(fontsize) :
        fontsize;
    switch (pd_fontsize) {
        case 8: return 11;
        case 10: return 13;
        case 12: return 16;
        case 16: return 19;
        case 24: return 29;
        case 36: return 44;
        default: return gui_fontsize + 2;
    }
}

function text_to_tspans(cid, svg_text, text) {
    var lines, i, len, tspan, fontsize, text_node;
    lines = text.split("\n");
    len = lines.length;
    // Get fontsize (minus the trailing "px")
    fontsize = svg_text.getAttribute("font-size").slice(0, -2);
    for (i = 0; i < len; i++) {
        tspan = create_item(cid, "tspan", {
            dy: i == 0 ? 0 : text_line_height_kludge(+fontsize, "gui") + "px",
            x: 0
        });
        // find a way to abstract away the canvas array and the DOM here
        text_node = patchwin[cid].window.document
                    .createTextNode(lines[i]);
        tspan.appendChild(text_node);
        svg_text.appendChild(tspan);
    }
}

// To keep the object and message box size consistent
// with Pd-Vanilla, we make small changes to the font
// sizes before rendering. If this impedes readability
// we can revisit the issue. Even Pd-Vanilla's box sizing
// changed at version 0.43, so we can break as well if
// it comes to that.

function font_map() {
    return {
        // pd_size: gui_size
        8: 8.33,
        12: 11.65,
        16: 16.65,
        24: 23.3,
        36: 36.6
    };
}

// This is a suboptimal font map, necessary because some genius "improved"
// the font stack on Gnu/Linux by delivering font metrics that don't match
// at all with what you get in OSX, Windows, nor even the previous version
// of the Gnu/Linux stack.
function suboptimal_font_map() {
    return {
        // pd_size: gui_size
        8: 8.45,
        12: 11.4,
        16: 16.45,
        24: 23.3,
        36: 36
    }
}

function gobj_fontsize_kludge(fontsize, return_type) {
    // These were tested on an X60 running Trisquel (based
    // on Ubuntu 14.04)
    var ret, prop,
        fmap = font_stack_is_maintained_by_troglodytes() ?
            suboptimal_font_map() : font_map();
    if (return_type === "gui") {
        ret = fmap[fontsize];
        return ret ? ret : fontsize;
    } else {
        for (prop in fmap) {
            if (fmap.hasOwnProperty(prop)) {
                if (fmap[prop] == fontsize) {
                    return +prop;
                }
            }
        }
        return fontsize;
    }
}

function pd_fontsize_to_gui_fontsize(fontsize) {
    return gobj_fontsize_kludge(fontsize, "gui");
}

function gui_fontsize_to_pd_fontsize(fontsize) {
    return gobj_fontsize_kludge(fontsize, "pd");
}

// Another hack, similar to above. We use this to
// make sure that there is enough vertical space
// between lines to fill the box when there is
// multi-line text.
function gobj_font_y_kludge(fontsize) {
    switch (fontsize) {
        case 8: return -0.5;
        case 10: return -1;
        case 12: return -1;
        case 16: return -1.5;
        case 24: return -3;
        case 36: return -6;
        default: return 0;
    }
}

function gui_text_new(cid, tag, type, isselected, left_margin, font_height, text, font) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var svg_text = create_item(cid, "text", {
            // Maybe it's just me, but the svg spec's explanation of how
            // text x/y and tspan x/y interact is difficult to understand.
            // So here we just translate by the right amount for the
            // left-margin, guaranteeing all tspan children will line up where
            // they should be.

            // Another anomaly-- we add 0.5 to the translation so that the font
            // hinting works correctly. This effectively cancels out the 0.5
            // pixel alignment done in the gobj, so it might be better to
            // specify the offset in whatever is calling this function.

            // I don't know how svg text grid alignment relates to other svg
            // shapes, and I haven't yet found any documentation for it. All I
            // know is an integer offset results in blurry text, and the 0.5
            // offset doesn't.
            transform: "translate(" + (left_margin - 0.5) + ")",
            y: font_height + gobj_font_y_kludge(font),
            // Turns out we can't do 'hanging' baseline
            // because it's borked when scaled. Bummer, because that's how Pd's
            // text is handled under tk...
            // 'dominant-baseline': 'hanging',
            "shape-rendering": "crispEdges",
            "font-size": pd_fontsize_to_gui_fontsize(font) + "px",
            "font-weight": "normal",
            id: tag + "text",
            "class": "box_text"
        });
        // trim off any extraneous leading/trailing whitespace. Because of
        // the way binbuf_gettext works we almost always have a trailing
        // whitespace.
        text = text.trim();
        // fill svg_text with tspan content by splitting on '\n'
        text_to_tspans(cid, svg_text, text);
        frag.appendChild(svg_text);
        if (isselected) {
            gui_gobj_select(cid, tag);
        }
        return frag;
    });
}

// Because of the overly complex code path inside
// canvas_setgraph, multiple erasures can be triggered in a row.
function gui_gobj_erase(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_text_set (cid, tag, text) {
    gui(cid).get_elem(tag + "text", function(e) {
        text = text.trim();
        e.textContent = "";
        text_to_tspans(cid, e, text);
    });
}

function gui_text_redraw_border(cid, tag, width, height) {
    // Hm, need to figure out how to refactor to get rid of
    // configure_item call...
    gui(cid).get_gobj(tag, function(e) {
        var b = e.querySelectorAll(".border"),
        i;
        for (i = 0; i < b.length; b++) {
            configure_item(b[i], {
                width: width,
                height: height
            });
        }
    });
}

function gui_gobj_select(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.classList.add("selected");
    });
}

function gui_gobj_deselect(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.classList.remove("selected");
    });
}

// This adds a 0.5 offset to align to pixel grid, so it should
// only be used to move gobjs to a new position.  (Should probably
// be renamed to gobj_move to make this more obvious.)
function elem_move(elem, x, y) {
    var t = elem.transform.baseVal.getItem(0);
    t.matrix.e = x+0.5;
    t.matrix.f = y+0.5;
}

function elem_displace(elem, dx, dy) {
        var t = elem.transform.baseVal.getItem(0);
        t.matrix.e += dx;
        t.matrix.f += dy;
}

function elem_get_coords(elem) {
    var t = elem.transform.baseVal.getItem(0);
    return {
        x: t.matrix.e,
        y: t.matrix.f
    }
}

// used for tidy up and GUI external displacefn callbacks
function gui_text_displace(name, tag, dx, dy) {
    gui(name).get_gobj(tag, function(e) {
        elem_displace(e, dx, dy);
    });
}

function textentry_displace(t, dx, dy) {
    var transform = t.style.getPropertyValue("transform")
        .split("(")[1]    // get everything after the "("
        .replace(")", "") // remove trailing ")"
        .split(",");      // split into x and y
    var x = +transform[0].trim().replace("px", ""),
        y = +transform[1].trim().replace("px", "");
    if (is_webapp()) { // temporary fix for firefox
        if (y + dy == 0) {
            if (dy < 0) {
                y--;
            }
            else {
                y++;
            }
        }
    }
    t.style.setProperty("transform",
        "translate(" +
        (x + dx) + "px, " +
        (y + dy) + "px)");
}

function gui_canvas_displace_withtag(cid, dx, dy) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid)
    .get_elem(patchsvg_id, function(svg_elem, w) {
        var i, ol;
        ol = w.document.getElementsByClassName("selected");
        for (i = 0; i < ol.length; i++) {
            elem_displace(ol[i], dx, dy);
        }
    })
    .get_elem("new_object_textentry", function(textentry) {
        textentry_displace(textentry, dx, dy);
    });
}

function gui_canvas_draw_selection(cid, x1, y1, x2, y2) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var points_array = [x1 + 0.5, y1 + 0.5,
                            x2 + 0.5, y1 + 0.5,
                            x2 + 0.5, y2 + 0.5,
                            x1 + 0.5, y2 + 0.5
        ];
        var rect = create_item(cid, "polygon", {
            points: points_array.join(" "),
            fill: "none",
            //"shape-rendering": "optimizeSpeed",
            "stroke-width": 1,
            id: "selection_rectangle",
            display: "inline"
        });
        svg_elem.appendChild(rect);
    });
}

function gui_canvas_move_selection(cid, x1, y1, x2, y2) {
    var points_array = [x1 + 0.5, y1 + 0.5, x2 + 0.5, y1 + 0.5,
                        x2 + 0.5, y2 + 0.5, x1 + 0.5, y2 + 0.5];
    gui(cid).get_elem("selection_rectangle", {
        points: points_array
    });

}

function gui_canvas_hide_selection(cid) {
    gui(cid).get_elem("selection_rectangle", function(e) {
        e.parentElement.removeChild(e);
    });
}

// iemguis

function gui_bng_new(cid, tag, cx, cy, radius) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var circle = create_item(cid, "circle", {
            cx: cx,
            cy: cy,
            r: radius,
            "shape-rendering": "auto",
            fill: "none",
            stroke: "black",
            "stroke-width": 1,
            id: tag + "button"
        });
        frag.appendChild(circle);
        return frag;
    });
}

function gui_bng_button_color(cid, tag, color) {
    gui(cid).get_elem(tag + "button", {
        fill: color
    });
}

function gui_bng_configure(cid, tag, color, cx, cy, r) {
    gui(cid).get_elem(tag + "button", {
        cx: cx,
        cy: cy,
        r: r,
        fill: color
    });
}

function gui_toggle_new(cid, tag, color, width, state, p1,p2,p3,p4,p5,p6,p7,p8,basex,basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var points = [p1 - basex, p2 - basey,
                      p3 - basex, p4 - basey
        ].join(" ");
        var cross1 = create_item(cid, "polyline", {
            points: points,
            stroke: color,
            fill: "none",
            id: tag + "cross1",
            display: state ? "inline" : "none",
            "stroke-width": width
        });
        points = [p5 - basex, p6 - basey,
                  p7 - basex, p8 - basey
        ].join(" ");
        var cross2 = create_item(cid, "polyline", {
            points: points,
            stroke: color,
            fill: "none",
            id: tag + "cross2",
            display: state ? "inline" : "none",
            "stroke-width": width
        });
        frag.appendChild(cross1);
        frag.appendChild(cross2);
        return frag;
    });
}

function gui_toggle_resize_cross(cid,tag,w,p1,p2,p3,p4,p5,p6,p7,p8,basex,basey) {
    var points1 = [p1 - basex, p2 - basey,
                  p3 - basex, p4 - basey
    ].join(" "),
        points2 = [p5 - basex, p6 - basey,
                        p7 - basex, p8 - basey
    ].join(" ");
    gui(cid)
    .get_elem(tag + "cross1", {
        points: points1,
        "stroke-width": w
    })
    .get_elem(tag + "cross2", {
        points: points2,
        "stroke-width": w
    });
}

function gui_toggle_update(cid, tag, state, color) {
    var disp = !!state ? "inline" : "none";
    gui(cid)
    .get_elem(tag + "cross1", {
        display: disp,
        stroke: color
    })
    .get_elem(tag + "cross2", {
        display: disp,
        stroke: color
    })
}

function numbox_data_string(w, h) {
    return ["M", 0, 0,
            "L", w - 4, 0,
                 w, 4,
                 w, h,
                 0, h,
            "z",
            "L", 0, 0,
                 (h / 2)|0, (h / 2)|0, // |0 to force int
                 0, h]
    .join(" ");
}

// Todo: send fewer parameters from c
function gui_numbox_new(cid, tag, color, x, y, w, h, is_toplevel) {
    // numbox doesn't have a standard iemgui border,
    // so we must create its gobj manually
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function() {
        var g = gui_gobj_new(cid, tag, "iemgui", x, y, is_toplevel);
        var data = numbox_data_string(w, h);
        var border = create_item(cid, "path", {
            d: data,
            fill: color,
            stroke: "black",
            "stroke-width": 1,
            id: (tag + "border"),
            "class": "border"
        });
        g.appendChild(border);
    });
}

function gui_numbox_coords(cid, tag, w, h) {
    gui(cid).get_elem(tag + "border", {
        d: numbox_data_string(w, h)
    });
}

function gui_numbox_draw_text(cid,tag,text,font_size,color,xpos,ypos,basex,basey) {
    // kludge alert -- I'm not sure why I need to add half to the ypos
    // below. But it works for most font sizes.
    gui(cid).get_gobj(tag)
    .append(function(frag, w) {
        var svg_text = create_item(cid, "text", {
            transform: "translate(" +
                        (xpos - basex) + "," +
                        ((ypos - basey + (ypos - basey) * 0.5)|0) + ")",
            "font-size": font_size,
            fill: color,
            id: tag + "text"
        }),
        text_node = w.document.createTextNode(text);
        svg_text.appendChild(text_node);
        frag.appendChild(svg_text);
        return frag;
    });
}

function gui_numbox_update(cid, tag, fcolor, bgcolor, font_name, font_size, font_weight) {
    gui(cid)
    .get_elem(tag + "border", {
        fill: bgcolor
    })
    .get_elem(tag + "text", {
        fill: fcolor,
        "font-size": font_size
    })
    // label may or may not exist, but that's covered by the API
    .get_elem(tag + "label", function() {
        gui_iemgui_label_font(cid, tag, font_name, font_weight, font_size);
    });
}

function gui_numbox_update_text_position(cid, tag, x, y) {
    gui(cid).get_elem(tag + "text", {
        transform: "translate( " + x + "," + ((y + y*0.5)|0) + ")"
    });
}

function gui_slider_new(cid, tag, color, p1, p2, p3, p4, basex, basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var indicator = create_item(cid, "line", {
            x1: p1 - basex,
            y1: p2 - basey,
            x2: p3 - basex,
            y2: p4 - basey,
            stroke: color,
            "stroke-width": 3,
            fill: "none",
            id: tag + "indicator"
        });
        frag.appendChild(indicator);
        return frag;
    });
}

function gui_slider_update(cid, tag, p1, p2, p3, p4, basex, basey) {
    gui(cid).get_elem(tag + "indicator", {
        x1: p1 - basex,
        y1: p2 - basey,
        x2: p3 - basex,
        y2: p4 - basey
    });
}

function gui_slider_indicator_color(cid, tag, color) {
    gui(cid).get_elem(tag + "indicator", {
        stroke: color
    });
}

function gui_radio_new(cid, tag, p1, p2, p3, p4, i, basex, basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var cell = create_item(cid, "line", {
            x1: p1 - basex,
            y1: p2 - basey,
            x2: p3 - basex,
            y2: p4 - basey,
            // stroke is just black for now
            stroke: "black",
            "stroke-width": 1,
            fill: "none",
            id: tag + "cell_" + i
        });
        frag.appendChild(cell);
        return frag;
    });
}

function gui_radio_create_buttons(cid,tag,color,p1,p2,p3,p4,basex,basey,i,state) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var b = create_item(cid, "rect", {
            x: p1 - basex,
            y: p2 - basey,
            width: p3 - p1,
            height: p4 - p2,
            stroke: color,
            fill: color,
            id: tag + "button_" + i,
            display: state ? "inline" : "none"
        });
        frag.appendChild(b);
        return frag;
    });
}

function gui_radio_button_coords(cid, tag, x1, y1, xi, yi, i, s, d, orient) {
    gui(cid)
    .get_elem(tag + "button_" + i, {
        x: orient ? s : xi+s,
        y: orient ? yi+s : s,
        width: d-(s*2),
        height: d-(s*2)
    })
    // the line to draw the cell for i=0 doesn't exist. Probably was not worth
    // the effort, but it's easier just to check for that here atm.
    if (i > 0) {
        gui(cid)
        .get_elem(tag + "cell_" + i, {
            x1: orient ? 0 : xi,
            y1: orient ? yi : 0,
            x2: orient ? d : xi,
            y2: orient ? yi : d
        });
    }
}

function gui_radio_update(cid, tag, fgcolor, prev, next) {
    gui(cid)
    .get_elem(tag + "button_" + prev, {
        display: "none"
    })
    .get_elem(tag + "button_" + next, {
        display: "inline",
        fill: fgcolor,
        stroke: fgcolor
    });
}

function gui_vumeter_draw_text(cid,tag,color,xpos,ypos,text,index,basex,basey, font_size, font_weight) {
    gui(cid).get_gobj(tag)
    .append(function(frag, w) {
        var svg_text = create_item(cid, "text", {
            x: xpos - basex,
            y: ypos - basey,
            "font-family": iemgui_fontfamily(fontname),
            "font-size": font_size,
            "font-weight": font_weight,
            id: tag + "text_" + index
        }),
        text_node = w.document.createTextNode(text);
        svg_text.appendChild(text_node);
        frag.appendChild(svg_text);
        return frag;
    });
}

// Oh, what a terrible interface this is!
// the c API for vumeter was just spewing all kinds of state changes
// at tcl/tk, depending on it to just ignore non-existent objects.
// On changes in the Properties dialog, it would
// a) remove all the labels
// b) configure a bunch of _non-existent_ labels
// c) recreate all the missing labels
// To get on to other work we just parrot the insanity here,
// and silently ignore calls to update non-existent text.
function gui_vumeter_update_text(cid, tag, text, font, selected, color, i) {
    gui(cid).get_elem(tag + "text_" + i, {
        fill: color
    });
}

function gui_vumeter_text_coords(cid, tag, i, xpos, ypos, basex, basey) {
    gui(cid).get_elem(tag + "text_" + i, {
        x: xpos - basex,
        y: ypos - basey
    });
}

function gui_vumeter_erase_text(cid, tag, i) {
    gui(cid).get_elem(tag + "text_" + i, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_vumeter_create_steps(cid,tag,color,p1,p2,p3,p4,width,basex,basey,i) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var l = create_item(cid, "line", {
            x1: p1 - basex,
            y1: p2 - basey,
            x2: p3 - basex,
            y2: p4 - basey,
            stroke: color,
            "stroke-width": width,
            "id": tag + "led_" + i
        });
        frag.appendChild(l);
        return frag;
    });
}

function gui_vumeter_update_steps(cid, tag, i, width) {
    gui(cid).get_elem(tag + "led_" + i, {
        "stroke-width": width
    });
}

function gui_vumeter_update_step_coords(cid,tag,i,x1,y1,x2,y2,basex,basey) {
    gui(cid).get_elem(tag + "led_" + i, {
        x1: x1 - basex,
        y1: y1 - basey,
        x2: x2 - basex,
        y2: y2 - basey
    });
}

function gui_vumeter_draw_rect(cid,tag,color,p1,p2,p3,p4,basex,basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var rect = create_item(cid, "rect", {
            x: p1 - basex,
            y: p2 - basey,
            width: p3 - p1,
            height: p4 + 1 - p2,
            stroke: color,
            fill: color,
            id: tag + "rect"
        });
        frag.appendChild(rect);
        return frag;
    });
}

function gui_vumeter_update_rect(cid, tag, color) {
    gui(cid).get_elem(tag + "rect", {
        fill: color,
        stroke: color
    });
}

// Oh hack upon hack... why doesn't the iemgui base_config just take care
// of this?
function gui_vumeter_border_size(cid, tag, width, height) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        width: width,
        height: height
    });
}

function gui_vumeter_update_peak_width(cid, tag, width) {
    gui(cid).get_elem(tag + "rect", {
        "stroke-width": width
    });
}

function gui_vumeter_draw_peak(cid,tag,color,p1,p2,p3,p4,width,basex,basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var line = create_item(cid, "line", {
            x1: p1 - basex,
            y1: p2 - basey,
            x2: p3 - basex,
            y2: p4 - basey,
            stroke: color,
            "stroke-width": width,
            id: tag + "peak"
        }); 
        frag.appendChild(line);
        return frag;
    });
}

// probably should change tag from "rect" to "cover"
function gui_vumeter_update_rms(cid, tag, p1, p2, p3, p4, basex, basey) {
    gui(cid).get_elem(tag + "rect", {
        x: p1 - basex,
        y: p2 - basey,
        width: p3 - p1,
        height: p4 - p2 + 1
    });
}

function gui_vumeter_update_peak(cid,tag,color,p1,p2,p3,p4,basex,basey) {
    gui(cid).get_elem(tag + "peak", {
        x1: p1 - basex,
        y1: p2 - basey,
        x2: p3 - basex,
        y2: p4 - basey,
        stroke: color
    });
}

function gui_iemgui_base_color(cid, tag, color) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        fill: color
    });
}

function gui_iemgui_move_and_resize(cid, tag, x1, y1, x2, y2) {
    gui(cid).get_gobj(tag, function(e) {
        elem_move(e, x1, y1);
    })
    .q(".border", {
        width: x2 - x1,
        height: y2 - y1
    });
}

function iemgui_font_height(name, size) {
    return size;
    var dejaVuSansMono = {
        6: [3, 4], 7: [4, 5], 8: [5, 7], 9: [5, 7], 10: [6, 8],
        11: [7, 8], 12: [7, 9], 13: [8, 9], 14: [8, 10], 15: [9, 12],
        16: [9, 12], 17: [10, 13], 18: [10, 13], 19: [11, 14], 20: [12, 14],
        21: [12, 16], 22: [13, 16], 23: [13, 17], 24: [14, 18], 25: [14, 18],
        26: [15, 20], 27: [16, 20], 28: [16, 21], 29: [17, 21], 30: [17, 22],
        31: [18, 22], 32: [18, 23], 33: [19, 25], 34: [19, 25], 35: [20, 26],
        36: [21, 26], 37: [21, 27], 38: [22, 27], 39: [22, 29], 40: [23, 30],
        41: [23, 30], 42: [24, 31], 43: [24, 31], 44: [25, 33], 45: [26, 33],
        46: [25, 34], 47: [26, 34], 48: [26, 35], 49: [27, 36], 50: [26, 36],
        51: [28, 37], 52: [29, 38], 53: [29, 39], 54: [30, 39], 55: [30, 41],
        56: [31, 41], 57: [31, 42], 58: [32, 43], 59: [32, 43], 60: [32, 45],
        61: [34, 45], 62: [34, 46], 63: [35, 46], 64: [35, 47], 65: [36, 49],
        66: [36, 49], 67: [36, 50], 68: [37, 50], 69: [38, 51], 70: [38, 51],
        71: [38, 52], 72: [39, 52]
    };
    // We use these heights for both the monotype and iemgui's "Helvetica"
    // which, at least on linux, has the same height
    if (name === "DejaVu Sans Mono" || name == "helvetica") {
        return dejaVuSansMono[size][1];
    } else {
        return size;
    }
}

function iemgui_fontfamily(name) {
    var family = "DejaVu Sans Mono";
    if (name === "DejaVu Sans Mono") {
        family = "DejaVu Sans Mono"; // probably should add some fallbacks here
    }
    else if (name === "helvetica") {
        family = "Helvetica, 'DejaVu Sans'";
    }
    else if (name === "times") {
        family = "'Times New Roman', 'DejaVu Serif', 'FreeSerif', serif";
    }
    return family;
}

function gui_iemgui_label_new(cid, tag, x, y, color, text, fontname, fontweight,
    fontsize) {
    gui(cid).get_gobj(tag)
    .append(function(frag, w) {
        var svg_text = create_item(cid, "text", {
            // x and y need to be relative to baseline instead of nw anchor
            x: x,
            y: y,
            //"font-size": font + "px",
            "font-family": iemgui_fontfamily(fontname),
            // for some reason the font looks bold in Pd-Vanilla-- not sure why
            "font-weight": fontweight,
            "font-size": fontsize + "px",
            fill: color,
            // Iemgui labels are anchored "w" (left-aligned to non-tclers).
            // For no good reason, they are also centered vertically, unlike
            // object box text. Since svg text uses the baseline as a reference
            // by default, we just take half the pixel font size and use that
            // as an additional offset.
            //
            // There is an alignment-baseline property in svg that
            // is supposed to do this for us. However, when I tried choosing
            // "hanging" to get tcl's equivalent of "n", I ran into a bug
            // where the text gets positioned incorrectly when zooming.
            transform: "translate(0," +
                iemgui_font_height(fontname, fontsize) / 2 + ")",
            id: tag + "label"
        });
        var text_node = w.document.createTextNode(text);
        svg_text.appendChild(text_node);
        frag.appendChild(svg_text);
        return frag;
    });
}

function gui_iemgui_label_set(cid, tag, text) {
    gui(cid).get_elem(tag + "label", function(e) {
        e.textContent = text; 
    });
}

function gui_iemgui_label_coords(cid, tag, x, y) {
    gui(cid).get_elem(tag + "label", {
        x: x,
        y: y
    });
}

function gui_iemgui_label_color(cid, tag, color) {
    gui(cid).get_elem(tag + "label", {
        fill: color
    });
}

function gui_iemgui_label_color(cid, tag, color) {
    gui(cid).get_elem(tag + "label", {
        fill: color
    });
}

function gui_iemgui_label_select(cid, tag, is_selected) {
    gui(cid).get_elem(tag + "label", function(e) {
        if (!!is_selected) {
            e.classList.add("iemgui_label_selected");
        } else {
            e.classList.remove("iemgui_label_selected");
        }
    });
}

function gui_iemgui_label_font(cid, tag, fontname, fontweight, fontsize) {
    gui(cid).get_elem(tag + "label", {
        "font-family": iemgui_fontfamily(fontname),
        "font-weight": fontweight,
        "font-size": fontsize + "px",
        transform: "translate(0," + iemgui_font_height(fontname, fontsize) / 2 + ")"
    });
}

function toggle_drag_handle_cursors(e, is_label, state) {
    e.querySelector(".constrain_top_right").style.cursor =
        state ? "ew-resize" : "";
    e.querySelector(".constrain_bottom_right").style.cursor =
        state ? "ns-resize" : "";
    e.querySelector(".unconstrained").style.cursor =
        state ? (is_label ? "move" : "se-resize") : "";
}

exports.toggle_drag_handle_cursors = toggle_drag_handle_cursors;

// Show or hide little handle for dragging around iemgui labels
function gui_iemgui_label_show_drag_handle(cid, tag, state, x, y, cnv_resize) {
    if (state !== 0) {
        gui(cid).get_gobj(tag)
        .append(function(frag, w) {
            var g, rect, top_right, bottom_right;
            g = create_item(cid, "g", {
                class: (cid === tag) ? "gop_drag_handle move_handle border" :
                    cnv_resize !== 0 ? "cnv_resize_handle border" :
                    "label_drag_handle move_handle border",
                transform: "matrix(1, 0, 0, 1, 0, 0)"
            });
            // Here we use a "line" shape so that we can control its color
            // using the "border" class (for iemguis) or the "gop_rect" class
            // for the graph-on-parent rectangle anchor. In both cases the
            // styles set a stroke property, and a single thick line is easier
            // to define than a "rect" for that case.
            rect = create_item(cid, "line", {
                x1: x,
                y1: y,
                x2: x,
                y2: y + 14,
                "stroke-width": 14,
                class: "unconstrained"
            });
            g.classList.add("clickable_resize_handle");
            top_right = create_item(cid, "rect", {
                x: x + 1.5,
                y: y + 0.5,
                width: 5,
                height: 7,
                fill: "black",
                "fill-opacity": "0",
                class: "constrain_top_right"
            });
            bottom_right = create_item(cid, "rect", {
                x: x - 6.5,
                y: y + 8.5,
                width: 7,
                height: 5,
                fill: "black",
                "fill-opacity": "0",
                class: "constrain_bottom_right"
            });
            g.appendChild(rect);
            g.appendChild(top_right);
            g.appendChild(bottom_right);

            // Quick hack for cursors on mouse-over. We only add them if
            // we're not already dragging a label or resizing an iemgui.
            // Apparently I didn't register all these edge-case event states
            // in canvas_events. States like "iemgui_label_drag" actually
            // just get registered as state "none". So we just check for "none"
            // here and assume it means we're in the middle of dragging.
            // If not we go ahead and set our cursor styles.
            if (w.canvas_events.get_state() != "none") {
                toggle_drag_handle_cursors(g, cnv_resize === 0, true);
            }

            frag.appendChild(g);
            return frag;
        });
    } else {
        gui(cid).get_gobj(tag, function(e) {
            var g =
                e.getElementsByClassName((cid === tag) ? "gop_drag_handle" :
                    cnv_resize !== 0 ? "cnv_resize_handle" :
                        "label_drag_handle")[0];
            //rect = get_item(cid, "clickable_resize_handle");
            // Need to check for null here...
            if (g) {
                g.parentNode.removeChild(g);
            } else {
                post("error: couldn't delete the iemgui drag handle!");
            }
        });
    }
}

function gui_iemgui_label_displace_drag_handle(cid, tag, dx, dy) {
    gui(cid).get_gobj(tag)
    .q(".label_drag_handle", function(e) {
        var t = e.transform.baseVal.getItem(0);
        t.matrix.e += dx;
        t.matrix.f += dy;
    });
}

function gui_mycanvas_new(cid,tag,color,x1,y1,x2_vis,y2_vis,x2,y2) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var rect_vis, rect, g;
        rect_vis = create_item(cid, "rect", {
            width: x2_vis - x1,
            height: y2_vis - y1,
            fill: color,
            stroke: color,
            id: tag + "rect"
            }
        );
        // we use a drag_handle, which is square outline with transparent fill
        // that shows the part of the rectangle that may be dragged in editmode.
        // Clicking the rectangle outside of that square will have no effect.
        // Unlike a 'border' it takes the same color as the visible rectangle
        // when deselected.
        // I'm not sure why it was decided to define this object's bbox separate
        // from the visual rectangle. That causes all kinds of usability
        // problems.
        // For just one example, it means we can't simply use the "resize"
        // cursor like all the other iemguis.
        // Unfortunately its ingrained as a core object in Pd, so we have to
        // support it here.
        rect = create_item(cid, "rect", {
            width: x2 - x1,
            height: y2 - y1,
            fill: "none",
            stroke: color,
            id: tag + "drag_handle",
            "class": "border mycanvas_border"
            }
        );
        frag.appendChild(rect_vis);
        frag.appendChild(rect);
        return frag;
    });
}

function gui_mycanvas_update(cid, tag, color, selected) {
    gui(cid)
    .get_elem(tag + "rect", {
        fill: color,
        stroke: color
    })
    .get_elem(tag + "drag_handle", {
        stroke: color
    });
}

function gui_mycanvas_coords(cid, tag, vis_width, vis_height, select_width, select_height) {
    gui(cid)
    .get_elem(tag + "rect", {
        width: vis_width,
        height: vis_height
    })
    .get_elem(tag + "drag_handle", {
        width: select_width,
        height: select_height
    });
}

function gui_scalar_new(cid, tag, isselected, t1, t2, t3, t4, t5, t6,
    is_toplevel) {
    var g;
    // we should probably use gui_gobj_new here, but we"re doing some initial
    // scaling that normal gobjs don't need...
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var matrix, transform_string, selection_rect;
        matrix = [t1,t2,t3,t4,t5,t6];
        transform_string = "matrix(" + matrix.join() + ")";
        g = create_item(cid, "g", {
            id: tag + "gobj",
            transform: transform_string,
        });
        if (isselected !== 0) {
            g.classList.add("selected");
        }
        if (is_toplevel === 0) {
            g.classList.add("gop");
        }
        // Let's make a selection rect...
        selection_rect = create_item(cid, "rect", {
            class: "border",
            display: "none",
            fill: "none",
            "pointer-events": "none"
        });
        g.appendChild(selection_rect);
        add_gobj_to_svg(svg_elem, g);
    });
    return g;
}

function gui_scalar_erase(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.parentNode.removeChild(e);
    });
}

// This is unnecessarily complex-- the select rect is a child of the parent
// scalar group, but in the initial Tkpath API the rect was free-standing.
// This means all the coordinate parameters are in the screen position. But
// we need the coords relative to the scalar's x/y-- hence we subtract the
// scalar's basex/basey from the coords below.

// Additionally, this function is a misnomer-- we're not actually drawing
// the rect here.  It's drawn as part of the scalar_vis function.  We're
// merely changing its coords and size.

// Finally, we have this awful display attribute toggling in css
// for selected borders because somehow calling properties on a graph
// triggers this function.  I have no idea why it does that.
function gui_scalar_draw_select_rect(cid, tag, state, x1, y1, x2, y2, basex, basey) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        x: (x1 - basex) + 0.5,
        y: (y1 - basey) + 0.5,
        width: x2 - x1,
        height: y2 - y1
    });
}

function gui_scalar_draw_group(cid, tag, parent_tag, type, attr_array) {
    gui(cid).get_elem(parent_tag)
    .append(function(frag) {
        if (!attr_array) {
            attr_array = [];
        }
        attr_array.push("id", tag);
        var group = create_item(cid, type, attr_array);
        frag.appendChild(group);
        return frag;
    });
}

function gui_scalar_configure_gobj(cid, tag, isselected, t1, t2, t3, t4, t5, t6) {
    var matrix = [t1,t2,t3,t4,t5,t6],
        transform_string = "matrix(" + matrix.join() + ")";
    gui(cid).get_gobj(tag, {
        transform: transform_string 
    });
}

function gui_draw_vis(cid, type, attr_array, tag_array) {
    gui(cid).get_elem(tag_array[0])
    .append(function(frag) {
        var item;
        attr_array.push("id", tag_array[1]);
        item = create_item(cid, type, attr_array);
        frag.appendChild(item);
        return frag;
    });
}

// This is a stop gap to update the old draw commands like [drawpolygon]
// without having to erase and recreate their DOM elements
function gui_draw_configure_old_command(cid, type, attr_array, tag_array) {
    gui(cid).get_elem(tag_array[1], function(e) {
        configure_item(e, attr_array);
    });
}

function gui_draw_erase_item(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_draw_coords(cid, tag, shape, points) {
    gui(cid).get_elem(tag, function(elem) {
        switch (shape) {
            case "rect":
                configure_item(elem, {
                    x: points[0],
                    y: points[1],
                    width: points[2],
                    height: points[3]
                });
                break;
            case "circle":
                configure_item(elem, {
                    cx: points[0],
                    cy: points[1]
                });
                break;
            case "polyline":
            case "polygon":
                configure_item(elem, {
                    points: points
                });
                break;
            default:
        }
    });
}

// set a drag event for a shape that's part of a scalar.
// this is a convenience method for the user, so that dragging outside
// of the bbox of the shape will still register as part of the event.
// (Attempting to set the event more than once is ignored.)
function gui_draw_drag_event(cid, tag, scalar_sym, drawcommand_sym,
    event_name, array_sym, index, state) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem, w) {
        if (state === 0) {
            w.canvas_events.remove_scalar_draggable(tag);
        } else {
            w.canvas_events.add_scalar_draggable(cid, tag, scalar_sym,
                drawcommand_sym, event_name, array_sym, index);
        }
    });
}

// Events for scalars-- mouseover, mouseout, etc.
function gui_draw_event(cid, tag, scalar_sym, drawcommand_sym, event_name,
    array_sym, index, state) {
    gui(cid).get_elem(tag, function(e) {
        var event_type = "on" + event_name;
        if (state === 1) {
            e[event_type] = function(e) {
                pdsend(cid, "scalar_event", scalar_sym, drawcommand_sym,
                    array_sym, index, event_name, e.pageX, e.pageY);
            };
        } else {
            e[event_type] = null;
        }
    });
}

// Configure one attr/val pair at a time, received from Pd
function gui_draw_configure(cid, tag, attr, val) {
    gui(cid).get_elem(tag, function(e) {
        var obj = {};
        if (Array.isArray(val)) {
            obj[attr] = val.join(" ");
        } else {
            // strings or numbers
            obj[attr] = val;
        }
        configure_item(e, obj);
    });
}

// Special case for viewBox which, in addition to its inexplicably inconsistent
// camelcasing also has no "none" value in the spec. This requires us to create
// a special case to remove the attribute if the user wants to get back to
// the default behavior.
function gui_draw_viewbox(cid, tag, attr, val) {
    // Value will be an empty array if the user provided no values
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        if (val.length) {
            gui_draw_configure(cid, tag, attr, val)
        } else {
            get_item(cid, tag).removeAttribute("viewBox");
        }
    });
}

// Configure multiple attr/val pairs (this should be merged with gui_draw_configure at some point
function gui_draw_configure_all(cid, tag, attr_array) {
    gui(cid).get_elem(tag, attr_array);
}

// Plots for arrays and data structures
function gui_plot_vis(cid, basex, basey, data_array, attr_array, tag_array) {
    gui(cid).get_elem(tag_array[0])
    .append(function(frag) {
        var p = create_item(cid, "path", {
            d: data_array.join(" "),
            id: tag_array[1],
            //stroke: "red",
            //fill: "black",
            //"stroke-width": "0"
        });
        configure_item(p, attr_array);
        frag.appendChild(p);
        return frag;
    });
}

// This function doubles as a visfn for drawnumber. Furthermore it doubles
// as a way to update attributes for drawnumber/symbol without having to
// recreate the object. The "flag" argument is 1 for creating a new element,
// and -1 to set attributes on the existing object.
function gui_drawnumber_vis(cid, parent_tag, tag, x, y, scale_x, scale_y,
    font, fontsize, fontcolor, text, flag, visibility) {
    if (flag === 1) {
        gui(cid).get_elem(parent_tag)
        .append(function(frag) {
            var svg_text = create_item(cid, "text", {
                // x and y are fudge factors. Text on the tk canvas used an
                // anchor at the top-right corner of the text's bbox.  SVG uses
                // the baseline. There's probably a programmatic way to do this,
                // but for now-- fudge factors based on the DejaVu Sans Mono
                // font. :)

                // For an explanation of why we translate by "x" instead of
                // setting the x attribute, see comment in gui_text_new
                transform: "scale(" + scale_x + "," + scale_y + ") " +
                           "translate(" + x + ")",
                y: y + fontsize,
                // Turns out we can't do 'hanging' baseline because it's borked
                // when scaled. Bummer...
                // "dominant-baseline": "hanging",
                //"shape-rendering": "optimizeSpeed",
                "font-size": fontsize + "px",
                fill: fontcolor,
                visibility: visibility === 1 ? "normal" : "hidden",
                id: tag
            });
            // fill svg_text with tspan content by splitting on "\n"
            text_to_tspans(cid, svg_text, text);
            frag.appendChild(svg_text);
            return frag;
        });
    } else {
        gui(cid).get_elem(tag, function(svg_text) {
            configure_item(svg_text, {
                transform: "scale(" + scale_x + "," + scale_y + ") " +
                           "translate(" + x + ")",
                y: y + fontsize,
                // Turns out we can't do 'hanging' baseline because it's borked
                // when scaled. Bummer...
                // "dominant-baseline": "hanging",
                //"shape-rendering": "optimizeSpeed",
                "font-size": fontsize + "px",
                fill: fontcolor,
                visibility: visibility === 1 ? "normal" : "hidden",
                id: tag
            });
            svg_text.textContent = "";
            text_to_tspans(cid, svg_text, text);
        });
    }
}

// closure to handle class-specific data that
// needs to be in the GUI. There shouldn't be
// many cases for this-- for now it's just used
// to cache image data for image-handling classes:
// ggee/image
// moonlib/image (for backwards compatibility only: its API is inherently leaky)
// tof/imagebang
// draw sprite
// draw image
var pd_cache = (function() {
    var d = {};
    return {
        free: function(key) {
            if (d.hasOwnProperty(key)) {
                d[key] = null;
            }
        },
        set: function(key, data) {
            d[key] = data;
            return data;
        },
        get: function(key) {
            if (d.hasOwnProperty(key)) {
                return d[key];
            } else {
                return undefined;
            }
        },
        debug: function() {
            return d;
        }
    };
}());

exports.pd_cache = pd_cache;

function gui_drawimage_new(obj_tag, file_path, canvasdir, flags) {
    var drawsprite = 1,
        drawimage_data = [], // array for base64 image data
        image_seq,
        count = 0,
        matchchar = "*",
        files,
        ext,
        img_types = [".gif", ".jpeg", ".jpg", ".png", ".svg"],
        img; // dummy image to measure width and height
    image_seq = flags & drawsprite;
    if (file_path !== "") {
        if(!path.isAbsolute(file_path)) {
            file_path = path.join(canvasdir, file_path);
        }
        file_path = path.normalize(file_path);
    }
    if (file_path !== "" && fs.existsSync(file_path)) {
        if (image_seq && fs.lstatSync(file_path).isDirectory()) {
            // [draw sprite]
            files = fs.readdirSync(file_path)
                    .sort(); // Note that js's "sort" method doesn't do the
                             // "right thing" for numbers. For that we'd need
                             // to provide our own sorting function
        } else {
            // [draw image]
            files = [path.basename(file_path)];
            file_path = path.dirname(file_path);
        }
        // todo: warn about image sequence with > 999
        files.forEach(function(file) {
            ext = path.extname(file).toLowerCase();
            if (img_types.indexOf(ext) != -1) {
                // Now add an element to that array with the image data
                drawimage_data.push({
                    type: ext === ".jpeg" ? "jpg" : ext.slice(1),
                    data: fs.readFileSync(path.join(file_path, file),"base64")
                });
                count++;
            }
        });
    }

    if (count === 0) {
        // set a default image
        drawimage_data.push({
            type: "png",
            data: get_default_png_data()
        });
        if (file_path !== "") {
            post("draw image: error: couldn't load image");
        }
        post("draw image: warning: no image loaded. Using default png");
    }
    img = new pd_window.Image(); // create an image in the pd_window context
    img.onload = function() {
        pdsend(obj_tag, "size", this.width, this.height);
    };
    img.src = "data:image/" + drawimage_data[0].type +
        ";base64," + drawimage_data[0].data;
    pd_cache.set(obj_tag, drawimage_data); // add the data to container
}

function gui_image_free(obj_tag) {
    var c = pd_cache.get(obj_tag);
    if (c) {
        pd_cache.free(obj_tag); // empty the image(s)
    } else {
        post("image: warning: no image data in cache to free");
    }
}

// We use this to get the correct height and width for the svg
// image. Unfortunately svg images are less flexible than normal
// html images-- you have to provide a size and 100% doesn't work.
// So here we load the image data into a new Image, just to get it
// to calculate the dimensions. We then use those dimensions for
// our svg image x/y, after which point the Image below _should_ 
// get garbage collected.
// We add the "tk_anchor" parameter so that we can match the awful interface
// of moonlib/image. We only check for the value "center"-- otherwise we
// assume "nw" (top-left corner) when tk_anchor is undefined, as this matches
// the svg spec.
function img_size_setter(cid, svg_image_tag, type, data, tk_anchor) {
    var img = new pd_window.window.Image(),
        w, h;
    img.onload = function() {
        w = this.width,
        h = this.height;
        configure_item(get_item(cid, svg_image_tag), {
            width: w,
            height: h,
            x: tk_anchor === "center" ? 0 - w/2 : 0,
            y: tk_anchor === "center" ? 0 - h/2 : 0
        });
    };
    img.src = "data:image/" + type + ";base64," + data;
}

function gui_drawimage_vis(cid, x, y, obj, data, seqno, parent_tag) {
    gui(cid).get_elem(parent_tag) // main <g> within the scalar
    .append(function(frag) {
        var item,
            image_array = pd_cache.get(obj),
            len = image_array.length,
            i,
            image_container,
            xy_container,
            obj_tag = "draw" + obj.slice(1) + "." + data.slice(1);
        if (len < 1) {
            return;
        }
        // Wrap around for out-of-bounds sequence numbers
        if (seqno >= len || seqno < 0) {
            seqno %= len;
        }
        // Since sprites can have lots of images we don't want to
        // set props on each one of them every time the user changes
        // an attribute's value. So we use a "g" to receive all the
        // relevant changes.
        // Unfortunately "g" doesn't have x/y attys. So it can't propagate
        // those values down to the child images. Thus we have to add
        // another "g" as a parent and manually convert x/y changes
        // the user makes to a transform. (And we can't use the inner g's
        // transform because the user can set their own transform there.)
        xy_container = create_item(cid, "g", {
            id: obj_tag + "xy",
            transform: "translate(" + x + "," + y + ")"
        });
        image_container = create_item(cid, "g", {
            id: obj_tag
        });
        for (i = 0; i < len; i++) {
            item = create_item(cid, "image", {
                x: x,
                y: y,
                id: obj_tag + i,
                visibility: seqno === i ? "visible" : "hidden",
                preserveAspectRatio: "xMinYMin meet"
            });
            item.setAttributeNS("http://www.w3.org/1999/xlink", "href",
                "data:image/" + image_array[i].type + ";base64," +
                 image_array[i].data);
            image_container.appendChild(item);
        }
        xy_container.appendChild(image_container);
        frag.appendChild(xy_container);
        // Hack to set correct width and height
        for (i = 0; i < len; i++) {
            img_size_setter(cid, obj_tag+i, pd_cache.get(obj)[i].type,
                pd_cache.get(obj)[i].data);
        }
        return frag;
    });
}

// Hack
function gui_drawimage_xy(cid, obj, data, x, y) {
    var obj_tag = "draw" + obj.slice(1) + "." + data.slice(1);
    gui(cid).get_elem(obj_tag + "xy", {
        transform: "translate(" + x + "," + y + ")"
    });
}

function gui_drawimage_index(cid, obj, data, index) {
    var obj_tag = "draw" + obj.slice(1) + "." + data.slice(1);
    gui(cid).get_elem(obj_tag, function(image_container) {
        var len = image_container.childNodes.length,
            image = image_container.childNodes[((index % len) + len) % len],
            last_image =
                image_container.querySelectorAll('[visibility="visible"]'),
            i;
        for (i = 0; i < last_image.length; i++) {
            configure_item(last_image[i], { visibility: "hidden" });
        }
        configure_item(image, { visibility: "visible" });
    });
}

// Default png image data
function get_default_png_data() {
    return ["iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAb1BMVEWBgYHX19",
            "f///8vLy/8/Pzx8PH3+Pf19fXz8/Pu7u7l5eXj4+Pn5+fs7Oza2tr6+vnq6urh",
            "4eHe3t7c3Nza2dr6+fro6Og1NTXr6+xYWFi1tbWjo6OWl5aLjItDQ0PPz8+/v7",
            "+wsLCenZ5zc3NOTk4Rpd0DAAAAqElEQVQoz62L2Q6CMBBFhcFdCsomq+v/f6Mn",
            "bdOSBn3ypNO5Nyez+kG0zN9NWZZK8RRbB/2XmMLSvSZp2mehTMVcLGIYbcWcLW",
            "1/U4PIZCvmOCMSaWzEHGaMIq2NmJNn4ORuMybP6xxYD0SnE4NJDdc0fYv0LCJg",
            "9g4RqV3BrJfB7Bzc+ILZOjC+YDYOjC+YKqsyHlOZAX5Msgwm1iRxgDYBSWjCm+",
            "98AAfDEgD0K69gAAAAAElFTkSuQmCC"
           ].join("");
}

function gui_load_default_image(dummy_cid, key) {
    pd_cache.set(key, {
        type: "png",
        data: get_default_png_data()
    });
}

// Load an image and cache the base64 data
function gui_load_image(cid, key, filepath) {
    var data = fs.readFileSync(filepath,"base64"),
        ext = path.extname(filepath);
    pd_cache.set(key, {
        type: ext === ".jpeg" ? "jpg" : ext.slice(1),
        data: data
    });
}

// Draw an image in an object-- used for ggee/image, moonlib/image and
// tof/imagebang. For the meaning of tk_anchor see img_size_setter. This
// interface assumes there is only one image per gobject. If you try to
// set more you'll get duplicate ids.
function gui_gobj_draw_image(cid, tag, image_key, tk_anchor) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var i = create_item(cid, "image", {
            id: tag,
            preserveAspectRatio: "xMinYMin meet"
        });
        i.setAttributeNS("http://www.w3.org/1999/xlink", "href",
            "data:image/" + pd_cache.get(image_key).type + ";base64," +
             pd_cache.get(image_key).data);
        img_size_setter(cid, tag, pd_cache.get(image_key).type,
            pd_cache.get(image_key).data, tk_anchor);
        frag.appendChild(i);
        return frag;
    });
}

function gui_image_size_callback(cid, key, callback) {
    var img = new pd_window.Image(); // create an image in the pd_window context
    img.onload = function() {
        pdsend(callback, "_imagesize", this.width, this.height);
    };
    img.src = "data:image/" + pd_cache.get(key).type +
        ";base64," + pd_cache.get(key).data;
}

function gui_image_draw_border(cid, tag, x, y, w, h) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var b = create_item(cid, "path", {
            "stroke-width": "1",
            fill: "none",
            d: ["m", x, y, w, 0,
                "m", 0, 0, 0, h,
                "m", 0, 0, -w, 0,
                "m", 0, 0, 0, -h
               ].join(" "),
            visibility: "hidden",
            class: "border"
        });
        frag.appendChild(b);
        return frag;
    });
}

function gui_image_toggle_border(cid, tag, state) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        visibility: state === 0 ? "hidden" : "visible"
    });
}

// Switch the data for an existing svg image
function gui_image_configure(cid, tag, image_key, tk_anchor) {
    gui(cid).get_elem(tag, function(e) {
        if (pd_cache.get(image_key)) {
            e.setAttributeNS("http://www.w3.org/1999/xlink", "href",
                "data:image/" + pd_cache.get(image_key).type + ";base64," +
                 pd_cache.get(image_key).data);
            img_size_setter(cid, tag, pd_cache.get(image_key).type,
                pd_cache.get(image_key).data, tk_anchor);
        } else {
            // need to change this to an actual error
            post("image: error: can't find image");
        }
    });
}

// Move an image
function gui_image_coords(cid, tag, x, y) {
    // ggee/image accepts a message that can trigger this, meaning
    // [loadbang] can end up calling this before the patchwindow exists.
    // So we have to check for existence below
    gui(cid).get_gobj(tag, function(e) {
        elem_move(e, x, y);
    });
}

// Scope~
function gui_scope_draw_bg(cid, tag, fg_color, bg_color, w, h, grid_width, dx, dy) {
    gui(cid)
    .get_gobj(tag)
    .append(function(frag) {
        var bg = create_item(cid, "rect", {
            width: w,
            height: h,
            fill: bg_color,
            class: "bg",
            stroke: "black",
            "stroke-width": grid_width
        }),
        path,
        path_string = "",
        fg_xy_path, // to be used for the foreground lines
        fg_mono_path,
        i, x, y, align_x, align_y;
        // Path strings for the grid lines
        // vertical lines...
        for (i = 0, x = dx; i < 7; i++, x += dx) {
            align_x = (x|0) === x ? x : Math.round(x);
            path_string += ["M", align_x, 0, "V", h].join(" ");
        }
        // horizontal lines...
        for (i = 0, y = dy; i < 3; i++, y += dy) {
            align_y = (y|0) === y ? y : Math.round(y);
            path_string += ["M", 0, align_y, "H", w].join(" ");
        }
        path = create_item(cid, "path", {
            d: path_string,
            fill: "none",
            stroke: "black",
            "stroke-width": grid_width,
        });
        // We go ahead and create a path to be used in the foreground. We'll
        // set the actual path data in the draw/redraw functions. Doing it this
        // way will save us having to create and destroy DOM objects each time
        // we redraw the foreground
        fg_xy_path = create_item(cid, "path", {
            fill: "none",
            stroke: fg_color,
            class: "fgxy"
        });
        fg_mono_path = create_item(cid, "path", {
            fill: "none",
            stroke: fg_color,
            class: "fgmono"
        });
        frag.appendChild(bg);
        frag.appendChild(path);
        frag.appendChild(fg_xy_path);
        frag.appendChild(fg_mono_path);
        return frag;
    });
}

function scope_configure_fg(cid, tag, type, data_array) {
    gui(cid)
        .get_gobj(tag)
        .q(type, { // class ".fgxy" or ".fgmono"
            d: data_array.join(" ")
    });
}

function gui_scope_configure_fg_xy(cid, tag, data_array) {
    scope_configure_fg(cid, tag, ".fgxy", data_array);
}

function gui_scope_configure_fg_mono(cid, tag, data_array) {
    scope_configure_fg(cid, tag, ".fgmono", data_array);
}

function gui_scope_configure_bg_color(cid, tag, color) {
    gui(cid).get_gobj(tag)
        .query(".bg", {
            fill: color
        });
}

function gui_scope_configure_fg_color(cid, tag, color) {
    gui(cid).get_gobj(tag)
        .q(".fgxy", { stroke: color })
        .q(".fgmono", { stroke: color });
}

function gui_scope_clear_fg(cid, tag) {
    scope_configure_fg(cid, tag, ".fgxy", []);
    scope_configure_fg(cid, tag, ".fgmono", []);
}

// unauthorized/grid

function get_grid_data(w, h, x_l, y_l) {
    var d, x, y, offset;
    d = [];
    offset = Math.floor(w / x_l);
    if (offset > 0) {
        for (x = 0; x < w; x += offset) {
            d = d.concat(["M", x, 0, x, h]); // vertical line
        }
    } else {
        post("Warning: too many gridlines");
    }
    offset = Math.floor(h / y_l);
    if (offset > 0) {
        for (y = 0; y < h; y += offset) {
            d = d.concat(["M", 0, y, w, y]); // horizontal line
        }
    } else {
        post("Warning: too many gridlines");
    }
    return d.join(" ");
}

function gui_configure_grid(cid, tag, w, h, bg_color, has_grid, x_l, y_l) {
    var grid_d_string = !!has_grid ? get_grid_data(w, h, x_l, y_l) : "",
        point_size = 5;
    gui(cid).get_gobj(tag)
    .q(".bg", {
        width: w,
        height: h,
        fill: bg_color,
    })
    .q(".border", {
        d: ["M", 0, 0, w, 0,
            "M", 0, h, w, h,
            "M", 0, 0, 0, h,
            "M", w, 0, w, h
           ].join(" "),
        fill: "none",
        stroke: "black",
        "stroke-width": 1
    })
    .q(".out_0", {
        y: h + 1,
        width: 7,
        height: 1,
        fill: "none",
        stroke: "black",
        "stroke-width": 1
    })
    .q(".out_1", {
        x: w - 7,
        y: h + 1,
        width: 7,
        height: 1,
        fill: "none",
        stroke: "black",
        "stroke-width": 1
    })
    .q(".grid", {
        d: grid_d_string,
        stroke: "white",
        "stroke-width": 1
    })
    .q(".point", {
        style: "visibility: none;",
        width: 5,
        height: 5,
        fill: "#ff0000",
        stroke: "black",
        "stroke-width": 1
    });
}

function gui_grid_new(cid, tag, x, y, is_toplevel) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        gui_gobj_new(cid, tag, "obj", x, y, is_toplevel);
    });
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var bg = create_item(cid, "rect", {
            class: "bg"
        }),
        border = create_item(cid, "path", {
            class: "border" // now we can inherit the css border styles
        }),
        out_0 = create_item(cid, "rect", {
            class: "out_0",
            style: "display: " + (is_toplevel ? "inline;" : "none;")
        }),
        out_1 = create_item(cid, "rect", {
            class: "out_1",
            style: "display: " + (is_toplevel ? "inline;" : "none;")
        }),
        grid = create_item(cid, "path", {
            class: "grid"
        }),
        point = create_item(cid, "rect", {
            class: "point"
        });
        frag.appendChild(bg);
        frag.appendChild(out_0);
        frag.appendChild(out_1);
        frag.appendChild(grid);
        frag.appendChild(point);
        frag.appendChild(border);
        return frag;
    });
}

function gui_grid_point(cid, tag, x, y) {
    gui(cid).get_gobj(tag)
    .q(".point", {
        x: x,
        y: y,
        style: "visibility: visible;"
    });
}

// unauthorized/pianoroll
function pianoroll_get_id(tag, type, i, j) {
    // Because i and j are just integers we want to prevent ambiguity.
    // For example, "1" and "23" concatenate the same as "12" and "3". So
    // we separate the two with an underscore.
    return tag + "_" + type + "_" + i + "_" + j;
}

function gui_pianoroll_draw_rect(cid, tag, x1, y1, x2, y2, i, j, type) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var r = create_item(cid, "rect", {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            id: pianoroll_get_id(tag, type, i, j),
            fill: type === "pitch" ? "#771623" : "#562663",
            stroke: "#998121",
            "stroke-width": "1"
        });
        frag.appendChild(r);
        return frag;
    });
}

// consider doing a single call with an array of data here...
function gui_pianoroll_update_rect(cid, tag, type, i, j, fill) {
    gui(cid)
    .get_elem(pianoroll_get_id(tag, type, i, j), {
        fill: fill
    });
}

// just clear out everything inside the container
function gui_pianoroll_erase_innards(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.innerHTML = "";
    });
}

// mknob from moonlib
function gui_mknob_new(cid, tag, x, y, is_toplevel, show_in, show_out,
    is_footils_knob) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        gui_gobj_new(cid, tag, "obj", x, y, is_toplevel);
    });
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var border = create_item(cid, "path", {
            class: "border" // now we can inherit the css border styles
        }),
        circle = create_item(cid, "circle", {
            //class: "circle"
        }),
        line = create_item(cid, "line", {
            //class: "dial"
        });
        frag.appendChild(border);
        frag.appendChild(circle);
        /* An extra circle for footils/knob */
        if (!!is_footils_knob) {
            frag.appendChild(create_item(cid, "circle", {
                class: "dial_frag"
            }));
        }
        frag.appendChild(line);
        return frag;
    });
}

function knob_dashes(d, len) {
    var c = d * 3.14159;
    return (c * len) + " " + (c * (1 - len));
}

function knob_offset(d) {
    return d * 3.14 * -0.28;
}

function gui_configure_mknob(cid, tag, size, bg_color, fg_color,
    is_footils_knob) {
    var w = size,
        h = !!is_footils_knob ? size + 5 : size;
    var g = gui(cid).get_gobj(tag)
    .q(".border", {
        d: ["M", 0, 0, w, 0,
            "M", 0, h, w, h,
            "M", 0, 0, 0, h,
            "M", w, 0, w, h
           ].join(" "),
        fill: "none",
    })
    .q("circle", {
        cx: size / 2,
        cy: size / 2,
        r: size / 2,
        fill: !!is_footils_knob ? "none" : bg_color,
        stroke: "black",
        "stroke-width": !!is_footils_knob ? 3 : 1,
        "stroke-dasharray": !!is_footils_knob ?
            knob_dashes(size, 0.94) : "none",
        "stroke-dashoffset": !!is_footils_knob ? knob_offset(size) : "0"
    })
    .q("line", { // indicator
        "stroke-width": 2,
        stroke: fg_color
    });

    if (!!is_footils_knob) {
        g.q(".dial_frag", {
            cx: size / 2,
            cy: size / 2,
            r: size / 2,
            fill: "none",
            stroke: bg_color,
            "stroke-width": 3,
            "stroke-dasharray": knob_dashes(size, 0.94),
            "stroke-dashoffset": knob_offset(size)
        });
    }
}

function gui_turn_mknob(cid, tag, x1, y1, x2, y2, is_footils_knob, val) {
    var g = gui(cid).get_gobj(tag)
    .q("line", { // indicator
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    });
    if (!!is_footils_knob) {
        g.q(".dial_frag", {
            "stroke-dasharray": knob_dashes(x1 * 2, val * 0.94)
        });
    }
}

// room_sim_2d and room_sim_3d objects from iemlib
function gui_room_sim_new(cid, tag, x, y, w, h, is_toplevel) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        gui_gobj_new(cid, tag, "obj", x, y, is_toplevel);
    });
    gui(cid).get_gobj(tag)
    .append(function(frag) {
//        frag.appendChild(line);
        return frag;
    });
}

function gui_room_sim_map(cid, tag, w, h, rad, head, xpix, ypix, fontsize,
    fcol, bcol, src_array, r3d) {
    gui(cid).get_gobj(tag, function(e) {
        gui_text_draw_border(cid, tag, 0, 0, w, h);
        // Set the style for the background directly... otherwise the
        // default theme bgcolor will be used
        e.querySelector(".border").style.fill = bcol;
    })
    .append(function(frag) {
        var x1 = xpix - rad,
            x2 = xpix + rad - 1,
            y1 = ypix - rad,
            y2 = ypix + rad - 1,
            dx = -((rad * Math.sin(head * 0.0174533) + 0.49999)|0),
            dy = -((rad * Math.cos(head * 0.0174533) + 0.49999)|0),
            i,
            text;
        for (i = 0; i < src_array.length; i++) {
            text = create_item(cid, "text", {
                x: src_array[i][0],
                y: src_array[i][1],
                fill: src_array[i][2],
                "font-size": fontsize,
                "dominant-baseline": "middle"
            });
            text.textContent = (i + 1).toString();
            frag.appendChild(text);
        }
        var ellipse = create_item(cid, "ellipse", {
            cx: (x2 - x1) * 0.5 + x1,
            cy: (y2 - y1) * 0.5 + y1,
            rx: (x2 - x1) * 0.5,
            ry: (y2 - y1) * 0.5,
            "stroke-width": 1,
            "stroke": fcol,
            "fill": "none"
        }),
        ellipse2 = create_item(cid, "ellipse", {
            // for room_sim_3d
            cx: r3d ? (r3d[2] - r3d[0]) * 0.5 + r3d[0] : 0,
            cy: r3d ? (r3d[3] - r3d[1]) * 0.5 + r3d[1] : 0,
            rx: r3d ? (r3d[2] - r3d[0]) * 0.5 : 0,
            ry: r3d ? (r3d[3] - r3d[1]) * 0.5 : 0,
            "stroke-width": 1,
            stroke: fcol,
            fill: "none"
        }),
        line = create_item(cid, "line", {
            x1: xpix,
            y1: ypix,
            x2: xpix + dx,
            y2: ypix + dy,
            "stroke-width": 3,
            stroke: fcol
        });
        frag.appendChild(ellipse);
        frag.appendChild(ellipse2);
        frag.appendChild(line);
        return frag;
    })
}

function gui_room_sim_update_src(cid, tag, i, x, y, font_size, col) {
    gui(cid).get_gobj(tag, function(e) {
        var a = e.querySelectorAll("text");
        if (a.length && i < a.length) {
            configure_item(a[i], {
                x: x,
                y: y,
                "font-size": font_size,
                fill: col
            });
        }
    });
}

function gui_room_sim_update(cid, tag, x0, y0, dx, dy, pixrad) {
    gui(cid).get_gobj(tag)
    .q("line", {
        x1: x0,
        y1: y0,
        x2: x0 + dx,
        y2: y0 + dy
    })
    .q("ellipse", {
        rx: ((x0 + pixrad - 1) - (x0 - pixrad)) * 0.5,
        ry: ((y0 + pixrad - 1) - (y0 - pixrad)) * 0.5,
        cx: ((x0 + pixrad - 1) - (x0 - pixrad)) * 0.5 + (x0 - pixrad),
        cy: ((y0 + pixrad - 1) - (y0 - pixrad)) * 0.5 + (y0 - pixrad),
    });
}

// for room_sim_3d
function gui_room_sim_head2(cid, tag, x1, y1, x2, y2) {
    gui(cid).get_gobj(tag, function(e) {
        configure_item(e.querySelectorAll("ellipse")[1], {
            rx: (x2 - x1) * 0.5,
            ry: (y2 - y1) * 0.5,
            cx: (x2 - x1) * 0.5 + x1,
            cy: (y2 - y1) * 0.5 + y1
        });
    });
}

function gui_room_sim_fontsize(cid, tag, i, size) {
    gui(cid).get_gobj(tag, function(e) {
        var i, a;
        a = e.querySelectorAll("text");
        if (a.length) {
            for (i = 0; i < a.length; i++) {
                configure_item(a[i], {
                    "font-size": size
                });
            }
        }
    });
}

// for the dial thingy
function gui_room_sim_colors(cid, tag, fg, bg) {
    gui(cid).get_gobj(tag)
    .q("ellipse", {
        stroke: fg
    })
    .q("line", {
        stroke: fg
    })
    .q(".border", function(e) {
        e.style.fill = bg;
    });
}

function gui_room_sim_erase(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.innerHTML = "";
    });
}

function add_popup(cid, popup) {
    popup_menu[cid] = popup;
}

// envgen
function gui_envgen_draw_bg(cid, tag, bg_color, w, h, points_array) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var bg, border, pline;
        bg = create_item(cid, "rect", {
            width: w,
            height: h,
            fill: bg_color,
            stroke: "black",
            "stroke-width": "2",
            transform: "translate(0.5, 0.5)"
        });
        // draw an extra path so we can give envgen
        // a border class without affecting the
        // background color of envgen
        border = create_item(cid, "path", {
            "stroke-width": 1,
            d: ["M", 0, 0, w+1, 0,
                "M", w+1, 0, w+1, h+1,
                "M", w+1, h+1, 0, h+1,
                "M", 0, h+1, 0, 0].join(" "),
            "class": "border",
        });
        pline = create_item(cid, "polyline", {
            stroke: "black",
            fill: "none",
            transform: "translate(2, 2)",
            points: points_array.join(" ")
        });
        frag.appendChild(bg);
        frag.appendChild(border);
        frag.appendChild(pline);
        return frag;
    });
}

function gui_envgen_draw_doodle(cid, tag, cx, cy) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var d = create_item(cid, "circle", {
            r: "2",
            cx: cx + 2,
            cy: cy + 2
        });
        frag.appendChild(d);
        return frag;
    });
}

function gui_envgen_erase_doodles(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        var elem_array = e.querySelectorAll("circle"),
        i;
        if (elem_array.length > 0) {
            for (i = 0; i < elem_array.length; i++) {
                elem_array[i].parentNode.removeChild(elem_array[i]);
            }
        }
    });
}

function gui_envgen_coords(cid, tag, w, h, points_array) {
    gui(cid).get_gobj(tag)
    .q(".border", {
        d: ["M", 0, 0, w+1, 0,
            "M", w+1, 0, w+1, h+1,
            "M", w+1, h+1, 0, h+1,
            "M", 0, h+1, 0, 0].join(" ")
    })
    .q(".rect", {
        width: w,
        height: h
    })
    .q("polyline", {
        points: points_array.join(" ")
    });
}

function gui_envgen_text(cid, tag, x, y, value, duration) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var svg_text = create_item(cid, "text", {
            transform: "translate(" + x + ")",
            y: y,
            "font-size": "12px"
        });
        text_to_tspans(cid, svg_text, value + "x" + duration);
        frag.appendChild(svg_text);
        return frag;
    });
}

function gui_envgen_erase_text(cid, tag) {
    gui(cid).get_gobj(tag)
    .q("text", function(svg_text) {
        svg_text.parentNode.removeChild(svg_text);
    });
}

function gui_envgen_move_xlet(cid, tag, type, i, x, y, basex, basey) {
    gui(cid).get_elem(tag + type + i, {
        x: x - basex,
        y: y - basey
    });
}

exports.add_popup = add_popup;

// Kludge to get popup coords to fit the browser's zoom level. As of v0.16.1
// it appears nw.js fixed the bug that required this kludge. The only versions
// affected then are
// a) Windows, which is pinned to version 0.14.7 to support XP and
// b) OSX 10.8 which requires 0.14.7 to run.
// So we do a version check for "0.14.7" to see whether the kludge is
// needed.
function zoom_kludge(zoom_level) {
    var zfactor;
    switch(zoom_level) {
        case -7: zfactor = 0.279; break;
        case -6: zfactor = 0.335; break;
        case -5: zfactor = 0.402; break;
        case -4: zfactor = 0.483; break;
        case -3: zfactor = 0.58; break;
        case -2: zfactor = 0.695; break;
        case -1: zfactor = 0.834; break;
        case 1: zfactor = 1.2; break;
        case 2: zfactor = 1.44; break;
        case 3: zfactor = 1.73; break;
        case 4: zfactor = 2.073; break;
        case 5: zfactor = 2.485; break;
        case 6: zfactor = 2.98; break;
        case 7: zfactor = 3.6; break;
        case 8: zfactor = 4.32; break;
        default: zfactor = 1;
    }
    return zfactor;
}

function gui_canvas_popup(cid, xpos, ypos, canprop, canopen, isobject) {
    // Get page coords for top of window, in case we're scrolled
    gui(cid).get_nw_window(function(nw_win) {
        var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
        var win_left = nw_win.window.document.body.scrollLeft,
            win_top = nw_win.window.document.body.scrollTop,
            zoom_level = nw_win.zoomLevel, // these were used to work
            zfactor,                       // around an old nw.js popup pos
                                           // bug. Now it's only necessary
                                           // on Windows, which uses v.0.14
            svg_view_box = nw_win.window.document.getElementById(patchsvg_id)
                .getAttribute("viewBox").split(" "); // need top-left svg origin

        // Set the global popup x/y so they can be retrieved by the relevant
        // document's event handler
        popup_coords[0] = xpos;
        popup_coords[1] = ypos;

        popup_menu[cid].items[0].enabled = canprop;
        popup_menu[cid].items[1].enabled = canopen;

        if(is_webapp()){
            var x_offset = Math.floor(document.getElementById(patchsvg_id).getBoundingClientRect().x);
            var y_offset = Math.floor(document.getElementById(patchsvg_id).getBoundingClientRect().y);

            popup_menu[cid].popup(xpos+x_offset, ypos+y_offset);
        }
        else{
            // Check nw.js version-- if its lts then we need the zoom_kludge...
            zfactor = process.versions.nw === "0.14.7" ? zoom_kludge(zoom_level) : 1;
            
            //popup_coords[0] = xpos;
            //popup_coords[1] = ypos;

            // We'll use "isobject" to enable/disable "To Front" and "To Back"
            //isobject;

            // We need to round win_left and win_top because the popup menu
            // interface expects an int. Otherwise the popup position gets wonky
            // when you zoom and scroll...
            xpos = Math.floor(xpos * zfactor) - Math.floor(win_left * zfactor);
            ypos = Math.floor(ypos * zfactor) - Math.floor(win_top * zfactor);

            // Now subtract the x and y offset for the top left corner of the svg.
            // We need to do this because a Pd canvas can have objects with negative
            // coordinates. Thus the SVG viewbox will have negative values for the
            // top left corner, and those must be subtracted from xpos/ypos to get
            // the proper window coordinates.
            xpos -= Math.floor(svg_view_box[0] * zfactor);
            ypos -= Math.floor(svg_view_box[1] * zfactor);

            popup_coords[2] = xpos + nw_win.x;
            popup_coords[3] = ypos + nw_win.y;

            popup_menu[cid].popup(xpos, ypos);
        }
    });
}

function popup_action(cid, index) {
    pdsend(cid, "done-popup", index, popup_coords[0], popup_coords[1]);
}

exports.popup_action = popup_action;

// Graphs and Arrays

// Doesn't look like we needs this

//function gui_graph_drawborder(cid, tag, x1, y1, x2, y2) {
//    var g = get_gobj(cid, tag);
//    var b = create_item(cid, "rect", {
//        width: x2 - x1,
//        height: y2 - y1,
//        stroke: "black",
//        fill: "none",
//        id: tag
//    });
//    g.appendChild(b);
//}

// This sets a GOP subpatch or graph to be "greyed out" when the user
// has opened it to inspect its contents.  (I.e., it has its own window.)
// We never actually remove this tag-- instead we just assume that the
// GOP will get erased and redrawn when its time to show the contents
// again.
function gui_graph_fill_border(cid, tag) {
    gui(cid).get_gobj(tag, function(e) {
        e.classList.add("has_window");
    });
}

function gui_graph_deleteborder(cid, tag) {
    gui(cid).get_elem(tag, function(e) {
        e.parentNode.removeChild(b);
    });
}

function gui_graph_label(cid, tag, font_size, font_height, is_selected,
    legacy_mode, array_of_attr_arrays) {
    // first let's check if we have any colors other than black. If so we
    // we will create a little rectangle next to the label to show the color.
    var show_color_rect = false;
    array_of_attr_arrays.forEach(function(e) {
        var c;
        if (!show_color_rect) {
            c = attr_array_to_object(e).color;
            show_color_rect = (c !== "black" && c !== "#000000");
        }
    });

    // if the graph only holds a single array, don't display the color
    if (array_of_attr_arrays.length <= 1) {
        show_color_rect = false;
    }

    array_of_attr_arrays.forEach(function(e, i) {
        var a = attr_array_to_object(e),
            narrays = array_of_attr_arrays.length;
        // a.label for the label
        // a.color for the color
        var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
        gui(cid).get_elem(patchsvg_id, function(elem) {
            var x, y;
            if (!!legacy_mode) { // Pd Vanilla labels go above the box
                y = -font_height * (narrays - (i + 1)) - 1;
            } else { // In L2ork they go inside the box
                // shift the label to the right if we're displaying a small
                // rectangle to show the color
                x = show_color_rect ? 17 : 2;
                y = font_height * (i + 1);
            }
            gui_text_new(cid, tag, "graph_label", !!is_selected,
                x, y, a.label, font_size);
        })
        .get_gobj(tag)
        .append(function(frag) {
            var colorbar;
            if (legacy_mode == 0 && show_color_rect) {
                colorbar = create_item(cid, "rect", {
                    fill: a.color,
                    stroke: "black",
                    "stroke-width": 1,
                    x: 4,
                    y: font_height * i + (font_height * 0.5),
                    width: 10,
                    height: 10
                });
                frag.appendChild(colorbar);
            }
            return frag;
        })
        .get_elem(tag + "text", function(e) {
            e.id = tag + "text" + i;
        });
    });
}

function gui_graph_vtick(cid, tag, x, up_y, down_y, tick_pix, basex, basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var up_tick,
            down_tick;
        // Don't think these need an ID...
        up_tick = create_item(cid, "line", {
            stroke: "black",
            x1: x - basex,
            y1: up_y - basey,
            x2: x - basex,
            y2: up_y - tick_pix - basey
        });
        down_tick = create_item(cid, "line", {
            stroke: "black",
            x1: x - basex,
            y1: down_y - basey,
            x2: x - basex,
            y2: down_y + tick_pix - basey
        });
        frag.appendChild(up_tick);
        frag.appendChild(down_tick);
        return frag;
    });
}

function gui_graph_htick(cid, tag, y, r_x, l_x, tick_pix, basex, basey) {
    gui(cid).get_gobj(tag)
    .append(function(frag) {
        var left_tick,
            right_tick;
        // Don't think these need an ID...
        left_tick = create_item(cid, "line", {
            stroke: "black",
            x1: l_x - basex,
            y1: y - basey,
            x2: l_x - tick_pix - basex,
            y2: y - basey,
            id: "tick" + y
        });
        right_tick = create_item(cid, "line", {
            stroke: "black",
            x1: r_x - basex,
            y1: y - basey,
            x2: r_x + tick_pix - basex,
            y2: y - basey
        });
        frag.appendChild(left_tick);
        frag.appendChild(right_tick);
        return frag;
    });
}

function gui_graph_tick_label(cid, tag, x, y, text, font, font_size, font_weight, basex, basey, tk_label_anchor) {
    gui(cid).get_gobj(tag)
    .append(function(frag, w) {
        var svg_text, text_node, text_anchor, alignment_baseline;
        // We use anchor identifiers from the tk toolkit:
        //
        // "n" for north, or aligned at the top of the text
        // "s" for south, or default baseline alignment
        // "e" for east, or text-anchor at the end of the text
        // "w" for west, or default text-anchor for left-to-right languages
        //
        // For x labels the tk_label_anchor will either be "n" for labels at the
        // bottom of the graph, or "s" for labels at the top of the graph
        //
        // For y labels the tk_label_anchor will either be "e" for labels at the
        // right of the graph, or "w" for labels at the right.
        //
        // In each case we want the label to be centered around the tick mark.
        // So we default to value "middle" if we didn't get a value for that
        // axis.
        text_anchor = tk_label_anchor === "e" ? "end" :
            tk_label_anchor === "w" ? "start" : "middle";
        alignment_baseline = tk_label_anchor === "n" ? "hanging" :
            tk_label_anchor === "s" ? "auto" : "middle";
        svg_text = create_item(cid, "text", {
            // need a label "y" relative to baseline
            x: x - basex,
            y: y - basey,
            "text-anchor": text_anchor,
            "alignment-baseline": alignment_baseline,
            "font-size": pd_fontsize_to_gui_fontsize(font_size) + "px",
        });
        text_node = w.document.createTextNode(text);
        svg_text.appendChild(text_node);
        frag.appendChild(svg_text);
        return frag;
    });
}

function gui_canvas_drawredrect(cid, x1, y1, x2, y2) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var g = gui_gobj_new(cid, cid, "gop_rect", x1, y1, 1);
        var r = create_item(cid, "rect", {
            width: x2 - x1,
            height: y2 - y1,
            id: "gop_rect"
        });
        g.appendChild(r);
        svg_elem.appendChild(g);
    });
}

function gui_canvas_deleteredrect(cid) {
    // We need to check for existence here, because the first
    // time setting GOP in properties, there is no red rect yet.
    // But setting properties when the subpatch's window is
    // visible calls glist_redraw, and glist_redraw will try to delete
    // the red rect _before_ it's been drawn in this case.
    // Unfortunately, it's quite difficult to refactor those c
    // functions without knowing the side effects.  But ineffectual
    // gui calls should really be minimized-- otherwise it's simply
    // too difficult to debug what's being passed over the socket.
    gui(cid).get_gobj(cid, function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_canvas_redrect_coords(cid, x1, y1, x2, y2) {
    gui(cid).get_gobj(cid, function(e) {
        elem_move(e, x1, y1);
    })
    .get_elem("gop_rect", {
        width: x2 - x1,
        height: y2 - y1
    });
}

//  Cord Inspector (a.k.a. Magic Glass)

// For clarity, this probably shouldn't be a gobj.  Also, it might be easier to
// make it a div that lives on top of the patchsvg
function gui_cord_inspector_new(cid, font_size) {
    var g = get_gobj(cid, "cord_inspector"),
        ci_rect = create_item(cid, "rect", { id: "cord_inspector_rect" }),
        ci_poly = create_item(cid, "polygon", { id: "cord_inspector_polygon" }),
        ci_text = create_item(cid, "text", {
            id: "cord_inspector_text",
            "font-size": pd_fontsize_to_gui_fontsize(font_size) + "px",
        }),
        text_node = patchwin[cid].window.document.createTextNode("");
    ci_text.appendChild(text_node);
    g.appendChild(ci_rect);
    g.appendChild(ci_poly);
    g.appendChild(ci_text);
}

function gui_cord_inspector_update(cid, text, basex, basey, bg_size, y1, y2, moved) {
    var gobj = get_gobj(cid, "cord_inspector"),
        rect = get_item(cid, "cord_inspector_rect"),
        poly = get_item(cid, "cord_inspector_polygon"),
        svg_text = get_item(cid, "cord_inspector_text"),
        polypoints_array;
    gobj.setAttributeNS(null, "transform",
            "translate(" + (basex + 10.5) + "," + (basey + 0.5) + ")");
    gobj.setAttributeNS(null, "pointer-events", "none");
    gobj.classList.remove("flash");
    // Lots of fudge factors here, tailored to the current default font size
    configure_item(rect, {
        x: 13,
        y: y1 - basey,
        width: bg_size - basex,
        height: y2 - basey + 10
    });
    polypoints_array = [8,0,13,5,13,-5];
    configure_item(poly, {
        points: polypoints_array.join()
    });
    configure_item(svg_text, {
        x: 20,
        y: 5,
    });
    // set the text
    svg_text.textContent = text;
}

function gui_cord_inspector_erase(cid) {
    gui(cid).get_gobj("cord_inspector", function(e) {
        e.parentNode.removeChild(e);
    });
}

function gui_cord_inspector_flash(cid, state) {
    gui(cid).get_elem("cord_inspector_text", function(e) {
        if (state === 1) {
            e.classList.add("flash");
        } else {
            e.classList.remove("flash");
        }
    });
}

// Window functions

// Webapp window functions
var focused_windows = [];

function update_focused_windows(cid){
    focused_windows.push(cid);
}
exports.update_focused_windows = update_focused_windows;

function remove_focused_window(cid){
    var index = focused_windows.indexOf(cid);
    if(index !== -1){
        focused_windows.splice(index, 1);
    }    
}

function gui_raise_window(cid) {
    // Check if the window exists, for edge cases like
    // [vis 1, vis1(---[send this_canvas]

    if(is_webapp()){
        $("#patch"+cid).effect("shake");
    }else{
        gui(cid).get_nw_window(function(nw_win) {
            nw_win.focus();
        });
    }

}

// Unfortunately DOM window.focus doesn't actually focus the window, so we
// have to use the chrome API
function gui_raise_pd_window() {
    if(is_webapp()){
        $("#console-window").effect("shake");
    }else{
        chrome.windows.getAll(function (w_array) {
            chrome.windows.update(w_array[0].id, { focused: true });
        });
    }

}

// Using the chrome app API, because nw.js doesn't seem
// to let me get a list of the Windows
function walk_window_list(cid, offset) {
    if(is_webapp()){
        var current_index = focused_windows.indexOf(cid)
        var last_focused = focused_windows[current_index+offset];
    
        if(last_focused !== undefined){
            $("#patch"+last_focused).effect("shake");
        }

    }else{
        chrome.windows.getAll(function (w_array) {
            chrome.windows.getLastFocused(function (w) {
                var i, next, match = -1;
                for (i = 0; i < w_array.length; i++) {
                    if (w_array[i].id === w.id) {
                        match = i;
                        break;
                    }
                }
                if (match !== -1) {
                    next = (((match + offset) % w_array.length) // modulo...
                            + w_array.length) % w_array.length; // handle negatives
                    chrome.windows.update(w_array[next].id, { focused: true });
                } else {
                    post("error: cannot find last focused window.");
                }
            });
        })
    }
}

function raise_next(cid) {
    walk_window_list(cid, 1);
}

exports.raise_next = raise_next;

function raise_prev(cid) {
    walk_window_list(cid, -1);
}

exports.raise_prev = raise_prev;

exports.raise_pd_window= gui_raise_pd_window;

// Openpanel and Savepanel

var file_dialog_target;

function file_dialog(cid, type, target, start_path) {
    file_dialog_target = target;
    var query_string = (type === "open" ?
                        "openpanelSpan" : "savepanelSpan"),
        input_span,
        input_elem,
        input_string,
        dialog_options,
        win;
    // We try opening the dialog in the last focused window. There's an
    // edge case where [loadbang]--[openpanel] will trigger before the
    // window has finished loading. In that case we just trigger the
    // dialog in the main Pd window.
    win = last_focused && patchwin[last_focused] ? patchwin[last_focused] :
        pd_window;
    input_span = win.window.document.querySelector("#" + query_string);
    // We have to use an absolute path here because of a bug in nw.js 0.14.7
    if (!path.isAbsolute(start_path)) {
        start_path = path.join(pwd, start_path);
    }
    // We also have to inject html into the dom because of a bug in nw.js
    // 0.14.7. For some reason we can't just change the value of nwworkingdir--
    // it just doesn't work. So this requires us to have the parent <span>
    // around the <input>. Then when we change the innerHTML of the span the
    // new value for nwworkingdir magically works.
    dialog_options = {
        style: "display: none;",
        type: "file",
        id: type === "open" ? "openpanel_dialog" : "savepanel_dialog",
        // using an absolute path here, see comment above
        nwworkingdir: start_path
    };
    if (type !== "open") {
        dialog_options.nwsaveas = "";
    }
    input_string = build_file_dialog_string(dialog_options);
    input_span.innerHTML = input_string;
    // Now that we've rebuilt the input element, let's get a reference to it...
    input_elem = win.window.document.querySelector("#" +
        (type === "open" ? "openpanel_dialog" : "savepanel_dialog"));
    // And add an event handler for the callback
    input_elem.onchange = function() {
        // reset value so that we can open the same file twice
        file_dialog_callback(this.value);
        this.value = null;
        console.log("openpanel/savepanel called");
    };
    win.window.setTimeout(function() {
        input_elem.click(); },
        300
    );
}

function gui_openpanel(cid, target, path) {
    file_dialog(cid, "open", target, path);
}

function gui_savepanel(cid, target, path) {
    file_dialog(cid, "save", target, path);
}

function file_dialog_callback(file_string) {
    pdsend(file_dialog_target, "callback",
        enquote(defunkify_windows_path(file_string)));
}

exports.file_dialog_callback = file_dialog_callback;

// Used to convert the ["key", "value"...] arrays coming from
// Pd to a javascript object. This is a hack that I employ because
// I had already implemented JSON arrays in the Pd->GUI interface
// and didn't feel like adding object notation.
function attr_array_to_object(attr_array) {
    var i,
        len = attr_array.length,
        obj = {};
    for (i = 0; i < len; i += 2) {
        obj[attr_array[i]] = attr_array[i+1];
    }
    return obj;
}

function gui_gatom_dialog(did, attr_array) {
    var d_tmp = create_window(did, "gatom", 265, 300,
        popup_coords[2], popup_coords[3],
        attr_array_to_object(attr_array));

    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }

}

function gui_gatom_activate(cid, tag, state) {
    gui(cid).get_gobj(tag, function(e) {
        if (state !== 0) {
            e.classList.add("activated");
        } else {
            e.classList.remove("activated");
        }
    });
}

function gui_dropdown_dialog(did, attr_array) {
    // Just reuse the "gatom" dialog
    var d_tmp = create_window(did, "gatom", 265, 300,
        popup_coords[2], popup_coords[3],
        attr_array_to_object(attr_array));

    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }
}

function dropdown_populate(w, label_array, current_index) {
    var ol = w.document.querySelector("#dropdown_list ol");
    // clear it out
    ol.innerHTML = '';
    label_array.forEach(function(text, i) {
        var li = w.document.createElement("li");
        li.textContent = text;
        li.setAttribute("data-index", i);
        if (i === current_index) {
            li.classList.add("highlighted");
        }
        ol.appendChild(li);
    });
}

function gui_dropdown_activate(cid, obj_tag, tag, current_index, font_size, state, label_array) {
    var g, select_elem, svg_view, g_bbox,
        doc_height,    // document height, excluding the scrollbar
        menu_height, // height of the list of elements inside the div
        div_y,       // position of div containing the dropdown menu
        div_max,     // max height of the div
        scroll_y,
        offset_anchor; // top or bottom
    // Annoying: obj_tag is just the "x"-prepended hex value for the object,
    // and tag is the one from rtext_gettag that is used as our gobj id
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem, w) {
        g = get_gobj(cid, tag);
        if (state !== 0) {
            svg_view = svg_elem.viewBox.baseVal;
            select_elem = w.document.querySelector("#dropdown_list");
            dropdown_populate(w, label_array, current_index);
            // stick the obj_tag in a data field
            select_elem.setAttribute("data-callback", obj_tag);
            // display the menu so we can measure it

            g_bbox = g.getBoundingClientRect();
            // Measuring the document height is tricky-- the following
            // method is the only reliable one I've found. And even here,
            // if you display the select_elem as inline _before_ measuring
            // the doc height, the result ends up being _smaller_. No idea.
            doc_height = w.document.documentElement.clientHeight;
            // Now let's display the select_elem div so we can measure it
            select_elem.style.setProperty("display", "inline");
            menu_height = select_elem.querySelector("ol")
                .getBoundingClientRect().height;
            scroll_y = w.scrollY;
            // If the area below the object is smaller than 75px, then
            // display the menu above the object.
            // If the entire menu won't fit below the object but _will_
            // fit above it, display it above the object.
            // If the menu needs a scrollbar, display it below the object
            if (doc_height - g_bbox.bottom <= 75
                || (menu_height > doc_height - g_bbox.bottom
                    && menu_height <= g_bbox.top)) {
                // menu on top
                offset_anchor = "bottom";
                div_max = g_bbox.top - 2;
                div_y = doc_height - (g_bbox.top + scroll_y);
            }
            else {
                // menu on bottom (possibly with scrollbar)
                offset_anchor = "top";
                div_max = doc_height - g_bbox.bottom - 2;
                div_y = g_bbox.bottom + scroll_y;
            }
            // set a max-height to force scrollbar if needed
            select_elem.style.setProperty("max-height", div_max + "px");
            select_elem.style.setProperty("left",
                (elem_get_coords(g).x - svg_view.x) + "px");
            // Remove "top" and "bottom" props to keep state clean
            select_elem.style.removeProperty("top");
            select_elem.style.removeProperty("bottom");
            // Now position the div relative to either the "top" or "bottom"
            select_elem.style.setProperty(offset_anchor, div_y + "px");
            select_elem.style.setProperty("font-size",
                pd_fontsize_to_gui_fontsize(font_size) + "px");
            select_elem.style.setProperty("min-width", g.getBBox().width + "px");
            w.canvas_events.dropdown_menu();
        } else {
            post("deactivating dropdown menu");
            // Probably want to send this
            pdsend(cid, "key 0 Control 0 1 0");
        }
    });
}

function gui_iemgui_dialog(did, attr_array) {
    //for (var i = 0; i < attr_array.length; i++) {
    //    attr_array[i] = '"' + attr_array[i] + '"';
    //}
    create_window(did, "iemgui", 265, 450,
        popup_coords[2], popup_coords[3],
        attr_array_to_object(attr_array));
}

function gui_dialog_set_field(did, field_name, value) {
    var elem = dialogwin[did].window.document.getElementsByName(field_name)[0];
    elem.value = value;
    dialogwin[did].window.update_attr(elem);
}

// Used when undoing a font size change when the font dialog is open
function gui_font_dialog_change_size(did, font_size) {
    var button;
    if (dialogwin[did]) {
        button = dialogwin[did].window.document.getElementById(font_size);
        button.click();
    } else {
        post("error: no font dialogwin!");
    }
}

function gui_array_new(did, count) {
    var attr_array = [{
        array_gfxstub: did,
        array_name: "array" + count,
        array_size: 100,
        array_flags: 3,
        array_fill: "black",
        array_outline: "black",
        array_in_existing_graph: 0
    }];
    var d_tmp = create_window(did, "canvas", 265, 340, 20, 20,
        attr_array);
    
    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }
}

function gui_canvas_dialog(did, attr_arrays) {
    var i, j, inner_array, prop;
    // Convert array of arrays to an array of objects
    for (i = 0; i < attr_arrays.length; i++) {
        attr_arrays[i] = attr_array_to_object(attr_arrays[i]);
        for (prop in attr_arrays[i]) {
            if (attr_arrays[i].hasOwnProperty(prop)) {
                console.log("array: prop is " + prop);
            }
        }
    }
    var d_tmp = create_window(did, "canvas", 300, 100,
        popup_coords[2], popup_coords[3],
        attr_arrays);

    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }
}

function gui_data_dialog(did, data_string) {
    var d_tmp = create_window(did, "data", 250, 300,
        popup_coords[2], popup_coords[3],
        data_string);

    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }
}

function gui_text_dialog_clear(did) {
    if (dialogwin[did]) {
        dialogwin[did].window.textarea_clear();
    }
}

function gui_text_dialog_append(did, line) {
    if (dialogwin[did]) {
        dialogwin[did].window.textarea_append(line);
    }
}

function gui_text_dialog_set_dirty(did, state) {
    if (dialogwin[did]) {
        dialogwin[did].window.set_dirty(state !== 0);
    }
}

function gui_text_dialog(did, width, height, font_size) {
    var d_tmp = create_window(did, "text", width, height,
        popup_coords[2], popup_coords[3],
        font_size);
    
    if(!is_webapp()){
        dialogwin[did] = d_tmp;
    }
}

function dialog_raise(did) {
    if(!is_webapp()){
        dialogwin[did].focus();
    }
}

function gui_text_dialog_raise(did) {
    if (dialogwin[did]) {
        dialog_raise(did);
    }
}

function gui_text_dialog_close_from_pd(did, signoff) {
    if (dialogwin[did]) {
        dialogwin[did].window.close_from_pd(signoff !== 0);
    }
}

function gui_remove_gfxstub(did) {
    if (dialogwin[did] !== undefined && dialogwin[did] !== null) {
        if(!is_webapp()){
            dialogwin[did].close(true);
        }
        dialogwin[did] = null;
    }
}

function gui_font_dialog(cid, gfxstub, font_size) {
    var attrs = { canvas: cid, font_size: font_size };
    var d_tmp = create_window(gfxstub, "font", 265, 200, 0, 0,
        attrs);

    if(!is_webapp()){
        dialogwin[gfxstub] = d_tmp;
    }
}

function gui_external_dialog(did, external_name, attr_array) {
    create_window(did, "external", 265, 450,
        popup_coords[2], popup_coords[3],
        {
            name: external_name,
            attributes: attr_array
        });
}

// Global settings

function gui_pd_dsp(state) {
    if (pd_window !== undefined) {
        pd_window.document.getElementById("dsp_control").checked = !!state;
    }
}

function open_prefs() {
    if (!dialogwin["prefs"]) {
        create_window("prefs", "prefs", 370, 470, 0, 0, null);
    } else {
        dialog_raise("prefs");
    }
    // show sidebar
    $("#sidebar").collapse("show");
    $("#sidebar-col-icon").removeClass("rotate");
}

exports.open_prefs = open_prefs;

function open_search() {
    if (!dialogwin["search"]) {
        create_window("search", "search", 300, 400, 20, 20, null);
    } else {
        dialog_raise("search");
    }
    // show sidebar
    $("#sidebar").collapse("show");
    $("#sidebar-col-icon").removeClass("rotate");
}

exports.open_search= open_search;

// This is the same for all windows (initialization is in pd_menus.js).
var recent_files_submenu = null;
var recent_files = null;

// We need to jump through some hoops here since JS closures capture variables
// by reference, which causes trouble when closures are created within a
// loop.
function recent_files_callback(i) {
    return function() {
        var fname = recent_files[i];
        //post("clicked recent file: "+fname);
        open_file(fname);
    }
}

function populate_recent_files(submenu) {
    if (submenu) recent_files_submenu = submenu;
    if (recent_files && recent_files_submenu) {
        //post("recent files: " + recent_files.join(" "));
        while (recent_files_submenu.items.length > 0)
            recent_files_submenu.removeAt(0);
        for (var i = 0; i < recent_files.length; i++) {
            var item = new nw.MenuItem({
                label: path.basename(recent_files[i]),
                tooltip: recent_files[i]
            });
            item.click = recent_files_callback(i);
            recent_files_submenu.append(item);
        }
        if (recent_files_submenu.items.length > 0) {
            recent_files_submenu.append(new nw.MenuItem({
                type: "separator"
            }));
            var item = new nw.MenuItem({
                label: lang.get_local_string("menu.clear_recent_files"),
                tooltip: lang.get_local_string("menu.clear_recent_files_tt")
            });
            item.click = function() {
                pdsend("pd clear-recent-files");
            };
            recent_files_submenu.append(item);
        }
    }
}

exports.populate_recent_files = populate_recent_files;

function gui_recent_files(dummy, recent_files_array) {
    recent_files = recent_files_array;
    populate_recent_files(recent_files_submenu);
}

function gui_audio_properties(gfxstub, sys_indevs, sys_outdevs,
    pd_indevs, pd_inchans, pd_outdevs, pd_outchans, audio_attrs) {
    var attrs = audio_attrs.concat([
        "audio-apis", pd_apilist,
        "sys-indevs", sys_indevs,
        "sys-outdevs", sys_outdevs,
        "pd-indevs", pd_indevs,
        "pd-inchans", pd_inchans,
        "pd-outdevs", pd_outdevs,
        "pd-outchans", pd_outchans
        ]);
    //for (var i = 0; i < arguments.length; i++) {
    //    post("arg " + i + " is " + arguments[i]);
    //}
    if (dialogwin["prefs"] !== null) {
        if(is_webapp()){
            dialogwin["prefs"].window.audio_prefs_callback(attrs);
        }else{
            dialogwin["prefs"].eval(null,
                "audio_prefs_callback("  +
                JSON.stringify(attrs) + ");"
            );
        }
    }
}

function gui_midi_properties(gfxstub, sys_indevs, sys_outdevs,
    pd_indevs, pd_outdevs, midi_attrs) {
    var attrs = midi_attrs.concat([
        "midi-apis", pd_midiapilist,
        "midi-indev-names", sys_indevs,
        "midi-outdev-names", sys_outdevs,
        "pd-indevs", pd_indevs,
        "pd-outdevs", pd_outdevs,
        ]);
    //post("got back some midi props...");
    //for (var i = 0; i < arguments.length; i++) {
    //    post("arg " + i + " is " + arguments[i]);
    //}
    if (dialogwin["prefs"] !== null) {
        if(is_webapp()){
            dialogwin["prefs"].window.midi_prefs_callback(attrs);
        }else{
            dialogwin["prefs"].eval(null,
                "midi_prefs_callback("  +
                JSON.stringify(attrs) + ");"
            );
        }
    }
}

function gui_gui_properties(dummy, name, save_zoom, browser_doc, browser_path,
    browser_init, autopatch_yoffset) {
    if (dialogwin["prefs"] !== null) {
        dialogwin["prefs"].window.gui_prefs_callback(name, save_zoom,
            browser_doc, browser_path, browser_init, autopatch_yoffset);
    }
}

function gui_path_properties(dummy, use_stdpath, verbose, path_array) {
    if (dialogwin["prefs"] !== null) {
        dialogwin["prefs"].window.path_prefs_callback(use_stdpath, verbose, path_array);
    }
}

function gui_lib_properties(dummy, defeat_rt, flag_string, lib_array) {
    if (dialogwin["prefs"] !== null) {
        dialogwin["prefs"].window.lib_prefs_callback(defeat_rt, flag_string, lib_array);
    }
}

// Let's try a closure for gui skins
var skin = exports.skin = (function () {
    var dir = "css/";
    var preset = "default";
    var id;
    function set_css(win) {
        win.document.getElementById("page_style")
            .setAttribute("href", dir + preset + ".css");
    }
    return {
        get: function () {
            post("getting preset: " + dir + preset + ".css");
            return dir + preset + ".css";
        },
        set: function (name) {
            preset = name;
            for (id in patchwin) {
                if (patchwin.hasOwnProperty(id) && patchwin[id]) {
                    set_css(patchwin[id].window);
                }
            }
            // hack for the console
            pd_window.document.getElementById("page_style")
                .setAttribute("href", dir + preset + ".css");
        },
        apply: function (win) {
            set_css(win);
        }
    };
}());

function select_text(cid, elem) {
    var range, win = patchwin[cid].window;
    if (win.document.selection) {
        range = win.document.body.createTextRange();
        range.moveToElementText(elem);
        range.select();
    } else if (win.getSelection) {
        range = win.document.createRange();
        range.selectNodeContents(elem);
        win.getSelection().removeAllRanges();
        win.getSelection().addRange(range);
    }
}

// CSS: Cleanly separate style from content.
// Me: Ahhhh!
// Arnold: Get down!
// Me: Wat?
// CSS: Impossible...
// Arnold: Style this. *kappakappakappa*
// Me: Hey, you can't just go around killing people!
// Arnold: It's not human. It's a W3C Standard.
// Me: But how did it get here?
// Arnold: It travelled from the past.
// Me: What does it want?
// Arnold: It won't stop until your energy is completely eliminated.
// Me: What now?
// Arnold: Use this to find what you need. Then get the heck out of there!
function get_style_by_selector(w, selector) {
    var sheet_list = w.document.styleSheets,
        rule_list, i, j,
        len = sheet_list.length;
    for (i = 0; i < len; i++) {
        rule_list = sheet_list[i].cssRules;
        for (j = 0; j < rule_list.length; j++) {
            if (rule_list[j].type == w.CSSRule.STYLE_RULE &&
                rule_list[j].selectorText == selector) {
                return rule_list[j].style;
            }
        }
    }
    return null;
}

// for debugging purposes
exports.get_style_by_selector = get_style_by_selector;

// Big, stupid, ugly SVG data url to shove into CSS when
// the user clicks a box in edit mode. One set of points for
// the "head", or main box, and the other for the "tail", or
// message flag at the right.
function generate_msg_box_bg_data(type, stroke) {
   return 'url(\"data:image/svg+xml;utf8,' +
            '<svg ' +
              "xmlns:svg='http://www.w3.org/2000/svg' " +
              "xmlns='http://www.w3.org/2000/svg' " +
              "xmlns:xlink='http://www.w3.org/1999/xlink' " +
              "version='1.0' " +
              "viewBox='0 0 10 10' " +
              "preserveAspectRatio='none'" +
            ">" +
              "<polyline vector-effect='non-scaling-stroke' " +
                "id='bubbles' " +
                "fill='none' " +
                "stroke=' " +
                  stroke + // Here's our stroke color
                "' " +
                "stroke-width='1' " +
                (type === "head" ?
                    "points='10 0 0 0 0 10 10 10' " : // box
                    "points='0 0 10 0 0 2 0 8 10 10 0 10' ") + // flag
              "/>" +
            "</svg>" +
          '")';
}

// Big problem here-- CSS fails miserably at something as simple as the
// message box flag. We use a backgroundImage svg to address this, but
// for security reasons HTML5 doesn't provide access to svg image styles.
// As a workaround we just seek out the relevant CSS rules and shove the
// whole svg data url into them. We do this each time the user
// clicks a box to edit.
// Also, notice that both CSS and SVG _still_ fail miserably at drawing a
// message box flag that expands in the middle while retaining the same angles
// at the edges. As the message spans more and more lines the ugliness becomes
// more and more apparent.
// Anyhow, this enormous workaround makes it possible to just specify the
// edit box color in CSS for the presets.
function shove_svg_background_data_into_css(w) {
    var head_style = get_style_by_selector(w, "#new_object_textentry.msg"),
        tail_style = get_style_by_selector(w, "p.msg::after"),
        stroke = head_style.outlineColor;
    head_style.backgroundImage = generate_msg_box_bg_data("head", stroke);
    tail_style.backgroundImage = generate_msg_box_bg_data("tail", stroke);
}

function gui_textarea(cid, tag, type, x, y, width_spec, height_spec, text,
    font_size, is_gop, state) {
    var range, svg_view, p,
        gobj = get_gobj(cid, tag);
    if (state !== 0) {
        // Make sure we're in editmode
        canvas_set_editmode(cid, 1);
        // Hide the gobj while we edit.  However, we want the gobj to
        // contribute to the svg's bbox-- that way when the new_object_textentry
        // goes away we still have the same dimensions.  Otherwise the user
        // can get strange jumps in the viewport when instantiating an object
        // at the extremities of the patch.
        // To solve this, we use 'visibility' instead of 'display', since it
        // still uses the hidden item when calculating the bbox.
        // (We can probably solve this problem by throwing in yet another
        // gui_canvas_get_scroll, but this seems like the right way to go
        // anyway.)
        configure_item(gobj, { visibility: "hidden" });
        p = patchwin[cid].window.document.createElement("p");
        configure_item(p, {
            id: "new_object_textentry"
        });
        var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
        svg_view = patchwin[cid].window.document.getElementById(patchsvg_id)
            .viewBox.baseVal;
        p.classList.add(type);
        p.contentEditable = "true";
        p.style.setProperty("left", (x - svg_view.x) + "px");
        p.style.setProperty("top", (y - svg_view.y) + "px");
        p.style.setProperty("font-size",
            pd_fontsize_to_gui_fontsize(font_size) + "px");
        p.style.setProperty("line-height",
            text_line_height_kludge(font_size, "pd") + "px");
        if (is_webapp()) { // temporary fix for Firefox
            p.style.setProperty("transform", "translate(0px, 1px)");
        }
        else {
            p.style.setProperty("transform", "translate(0px, 0px)");
        }
        p.style.setProperty("max-width",
            width_spec !== 0 ? width_spec + "ch" : "60ch");
        p.style.setProperty("min-width",
            width_spec <= 0 ? "3ch" :
                (is_gop == 1 ? width_spec + "px" :
                    width_spec + "ch"));
        if (is_gop == 1) {
            p.style.setProperty("min-height", height_spec + "px");
        }
        // set backgroundimage for message box
        if (type === "msg") {
            shove_svg_background_data_into_css(patchwin[cid].window);
        }
        // remove leading/trailing whitespace
        text = text.trim();
        p.textContent = text;
        // append to doc body
        if(is_webapp()){
            // Fix min-width on webapp
            p.style.setProperty("min-width",
            width_spec <= 0 ? "5ch" :
                (is_gop == 1 ? width_spec + "px" :
                    width_spec + 2 + "ch"));

	        var svg = patchwin[cid].window.document.getElementById("patch_div_"+cid);	
	        var div_p = patchwin[cid].window.document.createElement("div");
	        div_p.id = "div-svg-p";	
	        div_p.append(p)	
	        svg.prepend(div_p);
        }else{
            patchwin[cid].window.document.body.appendChild(p);
        }

        p.focus();
        select_text(cid, p);
        if (state === 1) {
            patchwin[cid].window.canvas_events.text();
        } else {
            patchwin[cid].window.canvas_events.floating_text();
        }
    } else {
        configure_item(gobj, { visibility: "normal" });
        p = patchwin[cid].window.document.getElementById("new_object_textentry");
        if (p !== null) {
            p.parentNode.removeChild(p);
        }
        if (patchwin[cid].window.canvas_events.get_previous_state() ===
               "search") {
            patchwin[cid].window.canvas_events.search();
        } else {
            patchwin[cid].window.canvas_events.normal();
        }

        if(is_webapp()){
            var div_p = patchwin[cid].window.document.getElementById("div-svg-p");
            if (div_p) {
                div_p.parentNode.removeChild(div_p);
            }
        }
    }
}

function gui_undo_menu(cid, undo_text, redo_text) {
    // we have to check if the window exists, because Pd starts
    // up with two unvis'd patch windows used for garrays. Plus
    // there may be some calls to subpatches after updating a dialog
    // (like turning on GOP) which call this for a canvas that has
    // been destroyed.
    gui(cid).get_nw_window(function(nw_win) {
        if (cid !== "nobody") {
            if(!is_webapp()){
                nw_win.window.nw_undo_menu(undo_text, redo_text);
            }
        }
    });
}

// leverages the get_nw_window method in the callers...
function canvas_params(nw_win, cid)
{
    // calculate the canvas parameters (svg bounding box and window geometry)
    // for do_getscroll and do_optimalzoom
    var bbox, width, height, min_width, min_height, x, y, svg_elem;
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    svg_elem = nw_win.window.document.getElementById(patchsvg_id);
    if (svg_elem) {
        bbox = svg_elem.getBBox();
    }
    else {
        bbox = {x: 0, y: 0, width: 0, height: 0};
    }
    // We try to do Pd-extended style canvas origins. That is, coord (0, 0)
    // should be in the top-left corner unless there are objects with a
    // negative x or y.
    // To implement the Pd-l2ork behavior, the top-left of the canvas should
    // always be the topmost, leftmost object.
    width = bbox.x > 0 ? bbox.x + bbox.width : bbox.width;
    height = bbox.y > 0 ? bbox.y + bbox.height : bbox.height;
    x = bbox.x > 0 ? 0 : bbox.x,
    y = bbox.y > 0 ? 0 : bbox.y;

    // The svg "overflow" attribute on an <svg> seems to be buggy-- for example,
    // you can't trigger a mouseover event for a <rect> that is outside of the
    // explicit bounds of the svg.
    // To deal with this, we want to set the svg width/height to always be
    // at least as large as the browser's viewport. There are a few ways to
    // do this this, like documentElement.clientWidth, but window.innerWidth
    // seems to give the best results.
    // However, there is either a bug or some strange behavior regarding
    // the viewport size: setting both the height and width of an <svg> to
    // the viewport height/width will display the scrollbars. The height or
    // width must be set to 4 less than the viewport size in order to keep
    // the scrollbars from appearing. Here, we just subtract 4 from both
    // of them. This could lead to some problems with event handlers but I
    // haven't had a problem with it yet.
    if(is_webapp()){
        const elem = document.getElementById(patchsvg_id);
        if (elem) {
            min_width = elem.getBoundingClientRect().width;	
	        min_height = elem.getBoundingClientRect().height;
        }
    }else{
        min_width = nw_win.window.innerWidth - 4;
        min_height = nw_win.window.innerHeight - 4;    
    }
    // Since we don't do any transformations on the patchsvg,
    // let's try just using ints for the height/width/viewBox
    // to keep things simple.
    width |= 0; // drop everything to the right of the decimal point
    height |= 0;
    min_width |= 0;
    min_height |= 0;
    x |= 0;
    y |= 0;
    return { x: x, y: y, w: width, h: height,
             mw: min_width, mh: min_height };
}

function do_getscroll(cid) {
    // Since we're throttling these getscroll calls, they can happen after
    // the patch has been closed. We remove the cid from the patchwin
    // object on close, so we can just check to see if our Window object has
    // been set to null, and if so just return.
    // This is an awfully bad pattern. The whole scroll-checking mechanism
    // needs to be rethought, but in the meantime this should prevent any
    // errors wrt the rendering context disappearing.
    gui(cid).get_nw_window(function(nw_win) {
        var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
        var svg_elem = nw_win.window.document.getElementById(patchsvg_id);
        var { x: x, y: y, w: width, h: height,
            mw: min_width, mh: min_height } = canvas_params(nw_win, cid);
        if (width < min_width) {
            width = min_width;
        }
        // If the svg extends beyond the viewport, it might be nice to pad
        // both the height/width and the x/y coords so that there is extra
        // room for making connections and manipulating the objects.  As it
        // stands objects will be flush with the scrollbars and window
        // edges.
        if (height < min_height) {
            height = min_height;
        }
        configure_item(svg_elem, {
            viewBox: [x, y, width, height].join(" "),
            width: width,
            height: height
        });
    });
}

var getscroll_var = {};

// We use a setTimeout here for two reasons:
// 1. nw.js has a nasty Renderer bug  when you try to modify the
//    window before the document has finished loading. To get
//    the error get rid of the setTimeout
// 2. This should protect the user from triggering a bunch of
//    layouts.  But this only works because I'm not updating
//    the view to follow the mouse-- for example, when
//    the user is dragging an object beyond the bounds of the
//    viewport. The tcl/tk version actually does follow the
//    mouse. In that case this setTimeout could keep the
//    graphics from displaying until the user releases the mouse,
//    which would be a buggy UI
function gui_canvas_get_scroll(cid) {
    if (!getscroll_var[cid]) {
        getscroll_var[cid] = setTimeout(function() {
            do_getscroll(cid);
            getscroll_var[cid] = null;
        }, 250);
    }
}

exports.gui_canvas_get_scroll = gui_canvas_get_scroll;

function do_optimalzoom(cid, hflag, vflag) {
    // determine an optimal zoom level that makes the entire patch fit within
    // the window
    gui(cid).get_nw_window(function(nw_win) {
        var { x: x, y: y, w: width, h: height, mw: min_width, mh: min_height } =
            canvas_params(nw_win, cid);
        // Calculate the optimal horizontal and vertical zoom values,
        // using floor to always round down to the nearest integer. Note
        // that these may well be negative, if the viewport is too small
        // for the patch at the current zoom level. XXXREVIEW: We assume a
        // zoom factor of 1.2 here; this works for me on Linux, but I'm
        // not sure how portable it is. -ag
        var zx = 0, zy = 0;
        if (width>0) zx = Math.floor(Math.log(min_width/width)/Math.log(1.2));
        if (height>0) zy = Math.floor(Math.log(min_height/height)/Math.log(1.2));
        // Optimal zoom is the minimum of the horizontal and/or the vertical
        // zoom values, depending on the h and v flags. This gives us the offset
        // to the current zoom level. We then need to clamp the resulting new
        // zoom level to the valid zoom level range of -8..+7.
        var actz = nw_win.zoomLevel, z = 0;
        if (hflag && vflag)
            z = Math.min(zx, zy);
        else if (hflag)
            z = zx;
        else if (vflag)
            z = zy;
        z += actz;
        if (z < -8) z = -8; if (z > 7) z = 7;
        //post("bbox: "+width+"x"+height+"+"+x+"+"+y+" window size: "+min_width+"x"+min_height+" current zoom level: "+actz+" optimal zoom level: "+z);
        if (z != actz) {
            nw_win.zoomLevel = z;
            pdsend(cid, "zoom", z);
        }
    });
}

var optimalzoom_var = {};

// We use a setTimeout here as with do_getscroll above, but we have to
// use a smaller value here, so that we're done before a subsequent
// call to do_getscroll updates the viewport. XXXREVIEW: Hopefully
// 100 msec are enough for do_optimalzoom to finish.
function gui_canvas_optimal_zoom(cid, h, v) {
    clearTimeout(optimalzoom_var[cid]);
    optimalzoom_var[cid] = setTimeout(do_optimalzoom, 150, cid, h, v);
}

exports.gui_canvas_optimal_zoom = gui_canvas_optimal_zoom;

// handling the selection
function gui_lower(cid, tag) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var first_child = svg_elem.firstElementChild,
        selection = null,
        gobj,
        len,
        i;
        if (tag === "selected") {
            selection = svg_elem.getElementsByClassName("selected");
        } else {
            gobj = get_gobj(cid, tag);
            if (gobj !== null) {
                selection = [gobj];
            }
        }
        if (selection !== null) {
            len = selection.length;
            for (i = len - 1; i >= 0; i--) {
                svg_elem.insertBefore(selection[i], first_child);
            }
        }
    });
}

// This only differs from gui_raise by setting first_child to
// the cord element instead of the first element in the svg.  Really,
// all three of these should be combined into a single function (plus
// all the silly logic on the C side moved here
function gui_raise(cid, tag) {
    var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
    gui(cid).get_elem(patchsvg_id, function(svg_elem) {
        var first_child = svg_elem.querySelector(".cord"),
        selection = null,
        gobj,
        len,
        i;
        if (tag === "selected") {
            selection = svg_elem.getElementsByClassName("selected");
        } else {
            gobj = get_gobj(cid, tag);
            if (gobj !== null) {
                selection = [gobj];
            }
        }
        if (selection !== null) {
            len = selection.length;
            for (i = len - 1; i >= 0; i--) {
                svg_elem.insertBefore(selection[i], first_child);
            }
        }
    });
}

function gui_find_lowest_and_arrange(cid, reference_element_tag, objtag) {
    gui(cid).get_gobj(reference_element_tag, function(ref_elem, w) {
        var patchsvg_id = is_webapp() ? "patchsvg_"+cid : "patchsvg";
        var svg_elem = w.document.getElementById(patchsvg_id),
        selection = null,
        gobj,
        len,
        i; 
        if (objtag === "selected") {
            selection = svg_elem.getElementsByClassName("selected");
        } else {
            gobj = get_gobj(cid, objtag);
            if (gobj !== null) {
                selection = [get_gobj(cid, objtag)];
            }
        }
        if (selection !== null) {
            len = selection.length;
            for (i = len - 1; i >= 0; i--) {
                svg_elem.insertBefore(selection[i], ref_elem);
            }
        }
    });
}

// Bindings for dialog menu of iemgui, canvas, etc.
exports.dialog_bindings = function(did) {
    var dwin = dialogwin[did].window;
    dwin.document.onkeydown = function(evt) {
        if (evt.keyCode === 13) { // enter
            dwin.ok();
        } else if (evt.keyCode === 27) { // escape
            dwin.cancel();
        }
    };
}

exports.resize_window = function(did) {
    var w = dialogwin[did].window.document.body.scrollWidth,
        h = dialogwin[did].window.document.body.scrollHeight;
    dialogwin[did].width = w;
    dialogwin[did].height = h;
}

// External GUI classes

function gui_pddplink_open(filename, dir) {
    var full_path, revised_dir, revised_filename;
    if (filename.indexOf("://") > -1) {
        external_doc_open(filename);
    } else if (path_is_absolute(filename)) {
        doc_open(path.dirname(filename), path.basename(filename));
    } else if (fs.existsSync(path.join(dir, filename))) {
        full_path = path.normalize(path.join(dir, filename));
        revised_dir = path.dirname(full_path);
        revised_filename = path.basename(full_path);
        doc_open(revised_dir, revised_filename);
    } else {
        // Give feedback to let user know the link didn't work...
        post("pddplink: error: file not found: " + filename);
    }
}

}).call(this)}).call(this,require('_process'))
},{"./dive.js":5,"./elasticlunr.js":6,"./parse-svg-path.js":8,"./pdlang.js":13,"_process":4,"child_process":2,"fs":2,"net":2,"path":3}],13:[function(require,module,exports){
"use strict";

var lang;

try {
    // try the locale given by navigator.language
    lang = require("./locales/" + navigator.language + "/translation.json");
} catch (e) {
    // if that fails then fall back to the default locale "en"
    lang = require("./locales/en/translation.json");
}

exports.lang = lang;

function recursive_key_splitter(key, object) {
    var subkeys = key.split(".");
    if (subkeys.length > 1) {
        return recursive_key_splitter(subkeys.slice(1).join("."), object[subkeys[0]]);
    } else {
        return object[subkeys[0]];
    }
}

exports.get_local_string = function (key) {
    return recursive_key_splitter(key, lang);
};

},{"./locales/en/translation.json":7}]},{},[1])(1)
});

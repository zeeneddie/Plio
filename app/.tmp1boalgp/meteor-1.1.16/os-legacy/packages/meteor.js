(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteor/global.js                                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
global = this;                                                                                                     // 1
                                                                                                                   // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteor/server_environment.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
meteorEnv = {                                                                                                      // 1
  NODE_ENV: process.env.NODE_ENV || "production",                                                                  // 2
  TEST_METADATA: process.env.TEST_METADATA || "{}"                                                                 // 3
};                                                                                                                 // 4
                                                                                                                   // 5
if (typeof __meteor_runtime_config__ === "object") {                                                               // 6
  __meteor_runtime_config__.meteorEnv = meteorEnv;                                                                 // 7
}                                                                                                                  // 8
                                                                                                                   // 9
Meteor = {                                                                                                         // 10
  isProduction: meteorEnv.NODE_ENV === "production",                                                               // 11
  isDevelopment: meteorEnv.NODE_ENV !== "production",                                                              // 12
  isClient: false,                                                                                                 // 13
  isServer: true,                                                                                                  // 14
  isCordova: false                                                                                                 // 15
};                                                                                                                 // 16
                                                                                                                   // 17
Meteor.settings = {};                                                                                              // 18
                                                                                                                   // 19
if (process.env.METEOR_SETTINGS) {                                                                                 // 20
  try {                                                                                                            // 21
    Meteor.settings = JSON.parse(process.env.METEOR_SETTINGS);                                                     // 22
  } catch (e) {                                                                                                    // 23
    throw new Error("METEOR_SETTINGS are not valid JSON: " + process.env.METEOR_SETTINGS);                         // 24
  }                                                                                                                // 25
}                                                                                                                  // 26
                                                                                                                   // 27
// Make sure that there is always a public attribute                                                               // 28
// to enable Meteor.settings.public on client                                                                      // 29
if (! Meteor.settings.public) {                                                                                    // 30
    Meteor.settings.public = {};                                                                                   // 31
}                                                                                                                  // 32
                                                                                                                   // 33
// Push a subset of settings to the client.  Note that the way this                                                // 34
// code is written, if the app mutates `Meteor.settings.public` on the                                             // 35
// server, it also mutates                                                                                         // 36
// `__meteor_runtime_config__.PUBLIC_SETTINGS`, and the modified                                                   // 37
// settings will be sent to the client.                                                                            // 38
if (typeof __meteor_runtime_config__ === "object") {                                                               // 39
  __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;                                              // 40
}                                                                                                                  // 41
                                                                                                                   // 42
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteor/helpers.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
if (Meteor.isServer)                                                                                               // 1
  var Future = Npm.require('fibers/future');                                                                       // 2
                                                                                                                   // 3
if (typeof __meteor_runtime_config__ === 'object' &&                                                               // 4
    __meteor_runtime_config__.meteorRelease) {                                                                     // 5
  /**                                                                                                              // 6
   * @summary `Meteor.release` is a string containing the name of the [release](#meteorupdate) with which the project was built (for example, `"1.2.3"`). It is `undefined` if the project was built using a git checkout of Meteor.
   * @locus Anywhere                                                                                               // 8
   * @type {String}                                                                                                // 9
   */                                                                                                              // 10
  Meteor.release = __meteor_runtime_config__.meteorRelease;                                                        // 11
}                                                                                                                  // 12
                                                                                                                   // 13
// XXX find a better home for these? Ideally they would be _.get,                                                  // 14
// _.ensure, _.delete..                                                                                            // 15
                                                                                                                   // 16
_.extend(Meteor, {                                                                                                 // 17
  // _get(a,b,c,d) returns a[b][c][d], or else undefined if a[b] or                                                // 18
  // a[b][c] doesn't exist.                                                                                        // 19
  //                                                                                                               // 20
  _get: function (obj /*, arguments */) {                                                                          // 21
    for (var i = 1; i < arguments.length; i++) {                                                                   // 22
      if (!(arguments[i] in obj))                                                                                  // 23
        return undefined;                                                                                          // 24
      obj = obj[arguments[i]];                                                                                     // 25
    }                                                                                                              // 26
    return obj;                                                                                                    // 27
  },                                                                                                               // 28
                                                                                                                   // 29
  // _ensure(a,b,c,d) ensures that a[b][c][d] exists. If it does not,                                              // 30
  // it is created and set to {}. Either way, it is returned.                                                      // 31
  //                                                                                                               // 32
  _ensure: function (obj /*, arguments */) {                                                                       // 33
    for (var i = 1; i < arguments.length; i++) {                                                                   // 34
      var key = arguments[i];                                                                                      // 35
      if (!(key in obj))                                                                                           // 36
        obj[key] = {};                                                                                             // 37
      obj = obj[key];                                                                                              // 38
    }                                                                                                              // 39
                                                                                                                   // 40
    return obj;                                                                                                    // 41
  },                                                                                                               // 42
                                                                                                                   // 43
  // _delete(a, b, c, d) deletes a[b][c][d], then a[b][c] unless it                                                // 44
  // isn't empty, then a[b] unless it isn't empty.                                                                 // 45
  //                                                                                                               // 46
  _delete: function (obj /*, arguments */) {                                                                       // 47
    var stack = [obj];                                                                                             // 48
    var leaf = true;                                                                                               // 49
    for (var i = 1; i < arguments.length - 1; i++) {                                                               // 50
      var key = arguments[i];                                                                                      // 51
      if (!(key in obj)) {                                                                                         // 52
        leaf = false;                                                                                              // 53
        break;                                                                                                     // 54
      }                                                                                                            // 55
      obj = obj[key];                                                                                              // 56
      if (typeof obj !== "object")                                                                                 // 57
        break;                                                                                                     // 58
      stack.push(obj);                                                                                             // 59
    }                                                                                                              // 60
                                                                                                                   // 61
    for (var i = stack.length - 1; i >= 0; i--) {                                                                  // 62
      var key = arguments[i+1];                                                                                    // 63
                                                                                                                   // 64
      if (leaf)                                                                                                    // 65
        leaf = false;                                                                                              // 66
      else                                                                                                         // 67
        for (var other in stack[i][key])                                                                           // 68
          return; // not empty -- we're done                                                                       // 69
                                                                                                                   // 70
      delete stack[i][key];                                                                                        // 71
    }                                                                                                              // 72
  },                                                                                                               // 73
                                                                                                                   // 74
  // wrapAsync can wrap any function that takes some number of arguments that                                      // 75
  // can't be undefined, followed by some optional arguments, where the callback                                   // 76
  // is the last optional argument.                                                                                // 77
  // e.g. fs.readFile(pathname, [callback]),                                                                       // 78
  // fs.open(pathname, flags, [mode], [callback])                                                                  // 79
  // For maximum effectiveness and least confusion, wrapAsync should be used on                                    // 80
  // functions where the callback is the only argument of type Function.                                           // 81
                                                                                                                   // 82
  /**                                                                                                              // 83
   * @memberOf Meteor                                                                                              // 84
   * @summary Wrap a function that takes a callback function as its final parameter. The signature of the callback of the wrapped function should be `function(error, result){}`. On the server, the wrapped function can be used either synchronously (without passing a callback) or asynchronously (when a callback is passed). On the client, a callback is always required; errors will be logged if there is no callback. If a callback is provided, the environment captured when the original function was called will be restored in the callback.
   * @locus Anywhere                                                                                               // 86
   * @param {Function} func A function that takes a callback as its final parameter                                // 87
   * @param {Object} [context] Optional `this` object against which the original function will be invoked          // 88
   */                                                                                                              // 89
  wrapAsync: function (fn, context) {                                                                              // 90
    return function (/* arguments */) {                                                                            // 91
      var self = context || this;                                                                                  // 92
      var newArgs = _.toArray(arguments);                                                                          // 93
      var callback;                                                                                                // 94
                                                                                                                   // 95
      for (var i = newArgs.length - 1; i >= 0; --i) {                                                              // 96
        var arg = newArgs[i];                                                                                      // 97
        var type = typeof arg;                                                                                     // 98
        if (type !== "undefined") {                                                                                // 99
          if (type === "function") {                                                                               // 100
            callback = arg;                                                                                        // 101
          }                                                                                                        // 102
          break;                                                                                                   // 103
        }                                                                                                          // 104
      }                                                                                                            // 105
                                                                                                                   // 106
      if (! callback) {                                                                                            // 107
        if (Meteor.isClient) {                                                                                     // 108
          callback = logErr;                                                                                       // 109
        } else {                                                                                                   // 110
          var fut = new Future();                                                                                  // 111
          callback = fut.resolver();                                                                               // 112
        }                                                                                                          // 113
        ++i; // Insert the callback just after arg.                                                                // 114
      }                                                                                                            // 115
                                                                                                                   // 116
      newArgs[i] = Meteor.bindEnvironment(callback);                                                               // 117
      var result = fn.apply(self, newArgs);                                                                        // 118
      return fut ? fut.wait() : result;                                                                            // 119
    };                                                                                                             // 120
  },                                                                                                               // 121
                                                                                                                   // 122
  // Sets child's prototype to a new object whose prototype is parent's                                            // 123
  // prototype. Used as:                                                                                           // 124
  //   Meteor._inherits(ClassB, ClassA).                                                                           // 125
  //   _.extend(ClassB.prototype, { ... })                                                                         // 126
  // Inspired by CoffeeScript's `extend` and Google Closure's `goog.inherits`.                                     // 127
  _inherits: function (Child, Parent) {                                                                            // 128
    // copy Parent static properties                                                                               // 129
    for (var key in Parent) {                                                                                      // 130
      // make sure we only copy hasOwnProperty properties vs. prototype                                            // 131
      // properties                                                                                                // 132
      if (_.has(Parent, key))                                                                                      // 133
        Child[key] = Parent[key];                                                                                  // 134
    }                                                                                                              // 135
                                                                                                                   // 136
    // a middle member of prototype chain: takes the prototype from the Parent                                     // 137
    var Middle = function () {                                                                                     // 138
      this.constructor = Child;                                                                                    // 139
    };                                                                                                             // 140
    Middle.prototype = Parent.prototype;                                                                           // 141
    Child.prototype = new Middle();                                                                                // 142
    Child.__super__ = Parent.prototype;                                                                            // 143
    return Child;                                                                                                  // 144
  }                                                                                                                // 145
});                                                                                                                // 146
                                                                                                                   // 147
var warnedAboutWrapAsync = false;                                                                                  // 148
                                                                                                                   // 149
/**                                                                                                                // 150
 * @deprecated in 0.9.3                                                                                            // 151
 */                                                                                                                // 152
Meteor._wrapAsync = function(fn, context) {                                                                        // 153
  if (! warnedAboutWrapAsync) {                                                                                    // 154
    Meteor._debug("Meteor._wrapAsync has been renamed to Meteor.wrapAsync");                                       // 155
    warnedAboutWrapAsync = true;                                                                                   // 156
  }                                                                                                                // 157
  return Meteor.wrapAsync.apply(Meteor, arguments);                                                                // 158
};                                                                                                                 // 159
                                                                                                                   // 160
function logErr(err) {                                                                                             // 161
  if (err) {                                                                                                       // 162
    return Meteor._debug(                                                                                          // 163
      "Exception in callback of async function",                                                                   // 164
      err.stack ? err.stack : err                                                                                  // 165
    );                                                                                                             // 166
  }                                                                                                                // 167
}                                                                                                                  // 168
                                                                                                                   // 169
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteor/setimmediate.js                                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// Chooses one of three setImmediate implementations:                                                              // 1
//                                                                                                                 // 2
// * Native setImmediate (IE 10, Node 0.9+)                                                                        // 3
//                                                                                                                 // 4
// * postMessage (many browsers)                                                                                   // 5
//                                                                                                                 // 6
// * setTimeout  (fallback)                                                                                        // 7
//                                                                                                                 // 8
// The postMessage implementation is based on                                                                      // 9
// https://github.com/NobleJS/setImmediate/tree/1.0.1                                                              // 10
//                                                                                                                 // 11
// Don't use `nextTick` for Node since it runs its callbacks before                                                // 12
// I/O, which is stricter than we're looking for.                                                                  // 13
//                                                                                                                 // 14
// Not installed as a polyfill, as our public API is `Meteor.defer`.                                               // 15
// Since we're not trying to be a polyfill, we have some                                                           // 16
// simplifications:                                                                                                // 17
//                                                                                                                 // 18
// If one invocation of a setImmediate callback pauses itself by a                                                 // 19
// call to alert/prompt/showModelDialog, the NobleJS polyfill                                                      // 20
// implementation ensured that no setImmedate callback would run until                                             // 21
// the first invocation completed.  While correct per the spec, what it                                            // 22
// would mean for us in practice is that any reactive updates relying                                              // 23
// on Meteor.defer would be hung in the main window until the modal                                                // 24
// dialog was dismissed.  Thus we only ensure that a setImmediate                                                  // 25
// function is called in a later event loop.                                                                       // 26
//                                                                                                                 // 27
// We don't need to support using a string to be eval'ed for the                                                   // 28
// callback, arguments to the function, or clearImmediate.                                                         // 29
                                                                                                                   // 30
"use strict";                                                                                                      // 31
                                                                                                                   // 32
var global = this;                                                                                                 // 33
                                                                                                                   // 34
                                                                                                                   // 35
// IE 10, Node >= 9.1                                                                                              // 36
                                                                                                                   // 37
function useSetImmediate() {                                                                                       // 38
  if (! global.setImmediate)                                                                                       // 39
    return null;                                                                                                   // 40
  else {                                                                                                           // 41
    var setImmediate = function (fn) {                                                                             // 42
      global.setImmediate(fn);                                                                                     // 43
    };                                                                                                             // 44
    setImmediate.implementation = 'setImmediate';                                                                  // 45
    return setImmediate;                                                                                           // 46
  }                                                                                                                // 47
}                                                                                                                  // 48
                                                                                                                   // 49
                                                                                                                   // 50
// Android 2.3.6, Chrome 26, Firefox 20, IE 8-9, iOS 5.1.1 Safari                                                  // 51
                                                                                                                   // 52
function usePostMessage() {                                                                                        // 53
  // The test against `importScripts` prevents this implementation                                                 // 54
  // from being installed inside a web worker, where                                                               // 55
  // `global.postMessage` means something completely different and                                                 // 56
  // can't be used for this purpose.                                                                               // 57
                                                                                                                   // 58
  if (!global.postMessage || global.importScripts) {                                                               // 59
    return null;                                                                                                   // 60
  }                                                                                                                // 61
                                                                                                                   // 62
  // Avoid synchronous post message implementations.                                                               // 63
                                                                                                                   // 64
  var postMessageIsAsynchronous = true;                                                                            // 65
  var oldOnMessage = global.onmessage;                                                                             // 66
  global.onmessage = function () {                                                                                 // 67
      postMessageIsAsynchronous = false;                                                                           // 68
  };                                                                                                               // 69
  global.postMessage("", "*");                                                                                     // 70
  global.onmessage = oldOnMessage;                                                                                 // 71
                                                                                                                   // 72
  if (! postMessageIsAsynchronous)                                                                                 // 73
    return null;                                                                                                   // 74
                                                                                                                   // 75
  var funcIndex = 0;                                                                                               // 76
  var funcs = {};                                                                                                  // 77
                                                                                                                   // 78
  // Installs an event handler on `global` for the `message` event: see                                            // 79
  // * https://developer.mozilla.org/en/DOM/window.postMessage                                                     // 80
  // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages                // 81
                                                                                                                   // 82
  // XXX use Random.id() here?                                                                                     // 83
  var MESSAGE_PREFIX = "Meteor._setImmediate." + Math.random() + '.';                                              // 84
                                                                                                                   // 85
  function isStringAndStartsWith(string, putativeStart) {                                                          // 86
    return (typeof string === "string" &&                                                                          // 87
            string.substring(0, putativeStart.length) === putativeStart);                                          // 88
  }                                                                                                                // 89
                                                                                                                   // 90
  function onGlobalMessage(event) {                                                                                // 91
    // This will catch all incoming messages (even from other                                                      // 92
    // windows!), so we need to try reasonably hard to avoid letting                                               // 93
    // anyone else trick us into firing off. We test the origin is                                                 // 94
    // still this window, and that a (randomly generated)                                                          // 95
    // unpredictable identifying prefix is present.                                                                // 96
    if (event.source === global &&                                                                                 // 97
        isStringAndStartsWith(event.data, MESSAGE_PREFIX)) {                                                       // 98
      var index = event.data.substring(MESSAGE_PREFIX.length);                                                     // 99
      try {                                                                                                        // 100
        if (funcs[index])                                                                                          // 101
          funcs[index]();                                                                                          // 102
      }                                                                                                            // 103
      finally {                                                                                                    // 104
        delete funcs[index];                                                                                       // 105
      }                                                                                                            // 106
    }                                                                                                              // 107
  }                                                                                                                // 108
                                                                                                                   // 109
  if (global.addEventListener) {                                                                                   // 110
    global.addEventListener("message", onGlobalMessage, false);                                                    // 111
  } else {                                                                                                         // 112
    global.attachEvent("onmessage", onGlobalMessage);                                                              // 113
  }                                                                                                                // 114
                                                                                                                   // 115
  var setImmediate = function (fn) {                                                                               // 116
    // Make `global` post a message to itself with the handle and                                                  // 117
    // identifying prefix, thus asynchronously invoking our                                                        // 118
    // onGlobalMessage listener above.                                                                             // 119
    ++funcIndex;                                                                                                   // 120
    funcs[funcIndex] = fn;                                                                                         // 121
    global.postMessage(MESSAGE_PREFIX + funcIndex, "*");                                                           // 122
  };                                                                                                               // 123
  setImmediate.implementation = 'postMessage';                                                                     // 124
  return setImmediate;                                                                                             // 125
}                                                                                                                  // 126
                                                                                                                   // 127
                                                                                                                   // 128
function useTimeout() {                                                                                            // 129
  var setImmediate = function (fn) {                                                                               // 130
    global.setTimeout(fn, 0);                                                                                      // 131
  };                                                                                                               // 132
  setImmediate.implementation = 'setTimeout';                                                                      // 133
  return setImmediate;                                                                                             // 134
}                                                                                                                  // 135
                                                                                                                   // 136
                                                                                                                   // 137
Meteor._setImmediate =                                                                                             // 138
  useSetImmediate() ||                                                                                             // 139
  usePostMessage() ||                                                                                              // 140
  useTimeout();                                                                                                    // 141
                                                                                                                   // 142
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteor/timers.js                                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var withoutInvocation = function (f) {                                                                             // 1
  if (Package.ddp) {                                                                                               // 2
    var _CurrentInvocation = Package.ddp.DDP._CurrentInvocation;                                                   // 3
    if (_CurrentInvocation.get() && _CurrentInvocation.get().isSimulation)                                         // 4
      throw new Error("Can't set timers inside simulations");                                                      // 5
    return function () { _CurrentInvocation.withValue(null, f); };                                                 // 6
  }                                                                                                                // 7
  else                                                                                                             // 8
    return f;                                                                                                      // 9
};                                                                                                                 // 10
                                                                                                                   // 11
var bindAndCatch = function (context, f) {                                                                         // 12
  return Meteor.bindEnvironment(withoutInvocation(f), context);                                                    // 13
};                                                                                                                 // 14
                                                                                                                   // 15
_.extend(Meteor, {                                                                                                 // 16
  // Meteor.setTimeout and Meteor.setInterval callbacks scheduled                                                  // 17
  // inside a server method are not part of the method invocation and                                              // 18
  // should clear out the CurrentInvocation environment variable.                                                  // 19
                                                                                                                   // 20
  /**                                                                                                              // 21
   * @memberOf Meteor                                                                                              // 22
   * @summary Call a function in the future after waiting for a specified delay.                                   // 23
   * @locus Anywhere                                                                                               // 24
   * @param {Function} func The function to run                                                                    // 25
   * @param {Number} delay Number of milliseconds to wait before calling function                                  // 26
   */                                                                                                              // 27
  setTimeout: function (f, duration) {                                                                             // 28
    return setTimeout(bindAndCatch("setTimeout callback", f), duration);                                           // 29
  },                                                                                                               // 30
                                                                                                                   // 31
  /**                                                                                                              // 32
   * @memberOf Meteor                                                                                              // 33
   * @summary Call a function repeatedly, with a time delay between calls.                                         // 34
   * @locus Anywhere                                                                                               // 35
   * @param {Function} func The function to run                                                                    // 36
   * @param {Number} delay Number of milliseconds to wait between each function call.                              // 37
   */                                                                                                              // 38
  setInterval: function (f, duration) {                                                                            // 39
    return setInterval(bindAndCatch("setInterval callback", f), duration);                                         // 40
  },                                                                                                               // 41
                                                                                                                   // 42
  /**                                                                                                              // 43
   * @memberOf Meteor                                                                                              // 44
   * @summary Cancel a repeating function call scheduled by `Meteor.setInterval`.                                  // 45
   * @locus Anywhere                                                       
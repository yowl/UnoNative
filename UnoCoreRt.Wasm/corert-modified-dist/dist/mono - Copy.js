// no requirejs :-P
var UnoAppManifest = {

    splashScreenImage: "Assets/SplashScreen.scale-200.png",
    splashScreenColor: "#00f",
    displayName: "UnoCoreRt"

}
/* using the MonoSupport function from Uno.UI.js
var DotNet;
(function (DotNet) {
})(DotNet || (DotNet = {}));

*/
var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}
Module["arguments"] = [];
var quit_ = function(status, toThrow) {
  throw toThrow;
};
Module["thisProgram"] = "./this.program";
var thisProgram = './this.program'; // TODO: is this MODULARIZE=1 ???
Module["quit"] = function(status, toThrow) {
    throw toThrow
}
;
Module["preRun"] = [];
Module["postRun"] = [];
// try turning off fs as there is no /dev and that fails
//Module["noFSInit"] = true;
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var scriptDirectory = "";
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    } else {
        return scriptDirectory + path
    }
}
if (ENVIRONMENT_IS_NODE) {
    scriptDirectory = __dirname + "/";
    var nodeFS;
    var nodePath;
    Module["read"] = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS)
            nodeFS = require("fs");
        if (!nodePath)
            nodePath = require("path");
        filename = nodePath["normalize"](filename);
        ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString()
    }
    ;
    Module["readBinary"] = function readBinary(filename) {
        var ret = Module["read"](filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        assert(ret.buffer);
        return ret
    }
    ;
    if (process["argv"].length > 1) {
        Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")
    }
    Module["arguments"] = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    });
    process["on"]("unhandledRejection", abort);
    Module["quit"] = function(status) {
        process["exit"](status)
    }
    ;
    Module["inspect"] = function() {
        return "[Emscripten Module object]"
    }
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
        Module["read"] = function shell_read(f) {
            return read(f)
        }
    }
    Module["readBinary"] = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data
    }
    ;
    if (typeof scriptArgs != "undefined") {
        Module["arguments"] = scriptArgs
    } else if (typeof arguments != "undefined") {
        Module["arguments"] = arguments
    }
    if (typeof quit === "function") {
        Module["quit"] = function(status) {
            quit(status)
        }
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    Module["read"] = function shell_read(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText
    }
    ;
    if (ENVIRONMENT_IS_WORKER) {
        Module["readBinary"] = function readBinary(url) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response)
        }
    }
    Module["readAsync"] = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
            }
            onerror()
        }
        ;
        xhr.onerror = onerror;
        xhr.send(null)
    }
    ;
    Module["setWindowTitle"] = function(title) {
        document.title = title
    }
} else {}
var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = undefined;
function dynamicAlloc(size) {
    var ret = HEAP32[DYNAMICTOP_PTR >> 2];
    var end = ret + size + 15 & -16;
    if (end <= _emscripten_get_heap_size()) {
        HEAP32[DYNAMICTOP_PTR >> 2] = end
    } else {
        var success = _emscripten_resize_heap(end);
        if (!success)
            return 0
    }
    return ret
}
function getNativeTypeSize(type) {
    switch (type) {
    case "i1":
    case "i8":
        return 1;
    case "i16":
        return 2;
    case "i32":
        return 4;
    case "i64":
        return 8;
    case "float":
        return 4;
    case "double":
        return 8;
    default:
        {
            if (type[type.length - 1] === "*") {
                return 4
            } else if (type[0] === "i") {
                var bits = parseInt(type.substr(1));
                assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                return bits / 8
            } else {
                return 0
            }
        }
    }
}
var asm2wasmImports = {
    "f64-rem": function(x, y) {
        return x % y
    },
    "debugger": function() {
        debugger
    }
};
// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function === "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

var freeTableIndexes = [];

// Weak map of functions in the table to their indexes, created on first use.
var functionsInTableMap;

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  var table = wasmTable;

  // Check if the function is already in the table, to ensure each function
  // gets a unique index. First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    for (var i = 0; i < table.length; i++) {
      var item = table.get(i);
      // Ignore null values.
      if (item) {
        functionsInTableMap.set(item, i);
      }
    }
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }

  // It's not in the table, add it now.


  var ret;
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    ret = freeTableIndexes.pop();
  } else {
    ret = table.length;
    // Grow the table
    try {
      table.grow(1);
    } catch (err) {
      if (!(err instanceof RangeError)) {
        throw err;
      }
      throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
    }
  }

  // Set the new value.
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    table.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction');
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }

  functionsInTableMap.set(func, ret);

  return ret;
}

function removeFunctionWasm(index) {
  functionsInTableMap.delete(wasmTable.get(index));
  freeTableIndexes.push(index);
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {
  assert(typeof func !== 'undefined');

  return addFunctionWasm(func, sig);
}

function removeFunction(index) {
  removeFunctionWasm(index);
}



var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}







function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

/** @param {Array=} args */
function dynCall(sig, ptr, args) {
  if (args && args.length) {
    // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
    assert(args.length === sig.substring(1).replace(/j/g, '--').length);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};

function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;


function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}
var wasmMemory;
var wasmTable;
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}
function getCFunc(ident) {
    var func = Module["_" + ident];
    assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
    return func
}
function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        "string": function(str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len)
            }
            return ret
        },
        "array": function(arr) {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }
    };
    function convertReturnValue(ret) {
        if (returnType === "string")
            return UTF8ToString(ret);
        if (returnType === "boolean")
            return Boolean(ret);
        return ret
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0)
                    stack = stackSave();
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var ret = func.apply(null, cArgs);
    ret = convertReturnValue(ret);
    if (stack !== 0)
        stackRestore(stack);
    return ret
}
function cwrap(ident, returnType, argTypes, opts) {
    argTypes = argTypes || [];
    var numericArgs = argTypes.every(function(type) {
        return type === "number"
    });
    var numericRet = returnType !== "string";
    if (numericRet && numericArgs && !opts) {
        return getCFunc(ident)
    }
    return function() {
        return ccall(ident, returnType, argTypes, arguments, opts)
    }
}
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
var ALLOC_NORMAL = 0;
var ALLOC_NONE = 3;
function allocate(slab, types, allocator, ptr) {
    var zeroinit, size;
    if (typeof slab === "number") {
        zeroinit = true;
        size = slab
    } else {
        zeroinit = false;
        size = slab.length
    }
    var singleType = typeof types === "string" ? types : null;
    var ret;
    if (allocator == ALLOC_NONE) {
        ret = ptr
    } else {
        ret = [_malloc, stackAlloc, dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length))
    }
    if (zeroinit) {
        var stop;
        ptr = ret;
        assert((ret & 3) == 0);
        stop = ret + (size & ~3);
        for (; ptr < stop; ptr += 4) {
            HEAP32[ptr >> 2] = 0
        }
        stop = ret + size;
        while (ptr < stop) {
            HEAP8[ptr++ >> 0] = 0
        }
        return ret
    }
    if (singleType === "i8") {
        if (slab.subarray || slab.slice) {
            HEAPU8.set(slab, ret)
        } else {
            HEAPU8.set(new Uint8Array(slab), ret)
        }
        return ret
    }
    var i = 0, type, typeSize, previousType;
    while (i < size) {
        var curr = slab[i];
        type = singleType || types[i];
        if (type === 0) {
            i++;
            continue
        }
        if (type == "i64")
            type = "i32";
        setValue(ret + i, curr, type);
        if (previousType !== type) {
            typeSize = getNativeTypeSize(type);
            previousType = type
        }
        i += typeSize
    }
    return ret
}
function getMemory(size) {
    if (!runtimeInitialized)
        return dynamicAlloc(size);
    return _malloc(size)
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (u8Array[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = u8Array[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            var u1 = u8Array[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            var u2 = u8Array[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
    return str
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0))
        return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx)
                break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx)
                break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx)
                break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx)
                break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}
function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
            u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127)
            ++len;
        else if (u <= 2047)
            len += 2;
        else if (u <= 65535)
            len += 3;
        else
            len += 4
    }
    return len
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function stringToUTF16(str, outPtr, maxBytesToWrite) {
    if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647
    }
    if (maxBytesToWrite < 2)
        return 0;
    maxBytesToWrite -= 2;
    var startPtr = outPtr;
    var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
    for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2
    }
    HEAP16[outPtr >> 1] = 0;
    return outPtr - startPtr
}
function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret)
        stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}
// extra functions from emscripten
// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull)
        HEAP8[buffer >> 0] = 0
}
function demangle(func) {
    return func
}
function demangleAll(text) {
    var regex = /__Z[\w\d_]+/g;
    return text.replace(regex, function(x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    })
}
function jsStackTrace() {
    var err = new Error;
    if (!err.stack) {
        try {
            throw new Error(0)
        } catch (e) {
            err = e
        }
        if (!err.stack) {
            return "(no stack trace available)"
        }
    }
    return err.stack.toString()
}
function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"])
        js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}
var PAGE_SIZE = 4096;
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - x % multiple
    }
    return x
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}
var STATIC_BASE = 1024,
    STACK_BASE = 19422064,
    STACKTOP = STACK_BASE,
    STACK_MAX = 14179184,
    DYNAMIC_BASE = 19422064;

assert(STACK_BASE % 16 === 0, 'stack must start aligned');
assert(DYNAMIC_BASE % 16 === 0, 'heap must start aligned');


var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 536870912;if (!Object.getOwnPropertyDescriptor(Module, 'INITIAL_MEMORY')) Object.defineProperty(Module, 'INITIAL_MEMORY', { configurable: true, get: function() { abort('Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });

assert(INITIAL_INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
      ,
      'maximum': INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
    });
  }


if (wasmMemory) {
  buffer = wasmMemory.buffer;
}

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['INITIAL_MEMORY'].
INITIAL_INITIAL_MEMORY = buffer.byteLength;
assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  // The stack grows downwards
  HEAPU32[(STACK_MAX >> 2)+1] = 0x2135467;
  HEAPU32[(STACK_MAX >> 2)+2] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  var cookie1 = HEAPU32[(STACK_MAX >> 2)+1];
  var cookie2 = HEAPU32[(STACK_MAX >> 2)+2];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback();
            continue
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                Module["dynCall_v"](func)
            } else {
                Module["dynCall_vi"](func, callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
            Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}


function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
TTY.init();
PIPEFS.root = FS.mount(PIPEFS, {}, null);
SOCKFS.root = FS.mount(SOCKFS, {}, null);
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  callRuntimeCallbacks(__ATEXIT__);
  FS.quit();
TTY.shutdown();
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_fround = Math.fround;
var Math_min = Math.min;
var Math_trunc = Math.trunc;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
    return id
}
function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}
function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
    return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
}
var wasmBinaryFile = "mono.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}
function getBinary() {
    try {
        if (Module["wasmBinary"]) {
            return new Uint8Array(Module["wasmBinary"])
        }
        if (Module["readBinary"]) {
            return Module["readBinary"](wasmBinaryFile)
        } else {
            throw "both async and sync fetching of the wasm failed"
        }
    } catch (err) {
        abort(err)
    }
}
function getBinaryPromise() {
    if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
        return fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }).then(function(response) {
            if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
            }
            return response["arrayBuffer"]()
        }).catch(function() {
            return getBinary()
        })
    }
    return new Promise(function(resolve, reject) {
        resolve(getBinary())
    }
    )
}
function createWasm(env) {

    // missing functions, instantiate fails if these aren't here.
    Object.assign(env, {
        CompareStringEx: function() {},
        EnumCalendarInfoExEx: function() {},
        GlobalizationNative_GetCalendars : function() {},
        FindNLSStringEx: function() {},
        corert_wasm_invoke_js: function _corert_wasm_invoke_js(js, length, exception) {
          var mono_string = DOTNET._dotnet_get_global()._mono_string_cached
              || (DOTNET._dotnet_get_global()._mono_string_cached = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']));
  
          var jsFuncName = UTF8ToString(js, length);
          console.log("wasm invoke " + jsFuncName);
  //        var funcNameJsString = DOTNET.conv_string(js); // this relies on mono_wasm_string_get_utf8 which we dont have.  Its in driver.c
          var res = eval(jsFuncName);
          exception = 0;
          return "" + res;
      },
        corert_wasm_invoke_js_unmarshalled:   function _corert_wasm_invoke_js_unmarshalled(js, length, arg0, arg1, arg2, exception) {
  
          var jsFuncName = UTF8ToString(js, length);
          console.log("wasm invoke_js_unmarshalled " + jsFuncName);
          var dotNetExports = DOTNET._dotnet_get_global().DotNet;
          if (!dotNetExports) {
              throw new Error('The Microsoft.JSInterop.js library is not loaded.');
          }
          var funcInstance = dotNetExports.jsCallDispatcher.findJSFunction(jsFuncName);
  
            exception="";
          return funcInstance.call(null, arg0, arg1, arg2);
  //        exception = 0;
  //        return "" + res;
      },
        LocaleNameToLCID: function(){ },
        CompareStringOrdinal: function(){ },
        GlobalizationNative_GetLocaleInfoInt: function() {},
        LCMapStringEx: function() {},
        GlobalizationNative_GetDefaultLocaleName: function() {},
        GlobalizationNative_GetLocaleInfoString: function() {},
        GlobalizationNative_GetLocaleInfoGroupingSizes: function() {},
        GetLocaleInfoEx: function() {},
        GlobalizationNative_ChangeCaseInvariant : function() {},
        GlobalizationNative_ChangeCaseTurkish: function() {},
        GlobalizationNative_ChangeCase : function() {},
        LCIDToLocaleName: function() {},
        EnumTimeFormatsEx : function() {},
        GlobalizationNative_GetLocaleTimeFormat: function() {},
        GetUserPreferredUILanguages: function() {},
        ResolveLocaleName: function() {},
        GlobalizationNative_GetLocaleName: function() {},
        IdnToUnicode: function() {},
        GlobalizationNative_ToUnicode: function() {},
        NormalizeString: function() {},
        GlobalizationNative_NormalizeString: function() {},
        IdnToAscii: function() {},
        GlobalizationNative_ToAscii: function() {},
        GlobalizationNative_GetTimeZoneDisplayName: function() {},
        FindStringOrdinal: function() {},
        GlobalizationNative_GetLatestJapaneseEra : function() {},
        GetCalendarInfoEx : function() {},
        GlobalizationNative_GetJapaneseEraStartDate : function() {},
        EnumSystemLocalesEx : function() {},
        GlobalizationNative_GetLocales: function () {},
        "abort": abort,
        nanosleep: function() { alert('nanosleep');},
        pthread_condattr_init: function() {},
        pthread_condattr_setclock: function() {},
        pthread_attr_setdetachstate: function() {},
        pthread_create: function() {},
        pthread_attr_destroy: function() {},
        clock_gettime: function() {},
        pthread_getattr_np: function() {},
        pthread_attr_getstack: function() {},
        gettimeofday: function() {},
        pthread_attr_init: function() {},
        pthread_condattr_destroy : function() {}
      });

    var info = {
        "env": env,
        'wasi_snapshot_preview1': asmLibraryArg,
        "global": {
            "NaN": NaN,
            Infinity: Infinity
        },
        "global.Math": Math,
        "asm2wasm": asm2wasmImports
    };
    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");
    if (Module["instantiateWasm"]) {
        try {
            return Module["instantiateWasm"](info, receiveInstance)
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"])
    }
    function instantiateArrayBuffer(receiver) {
        getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }
    if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
        WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }), info).then(receiveInstantiatedSource, function(reason) {
            err("wasm streaming compile failed: " + reason);
            err("falling back to ArrayBuffer instantiation");
            instantiateArrayBuffer(receiveInstantiatedSource)
        })
    } else {
        instantiateArrayBuffer(receiveInstantiatedSource)
    }
    return {}
}
var wasmTable = new WebAssembly.Table({
  'initial': 90558,
  'maximum': 90558,
  'element': 'anyfunc'
});
Module["asm"] = function(global, env, providedBuffer) {
    env["memory"] = wasmMemory;
    env["table"] = wasmTable;
    //env["__memory_base"] = 1024;
    //env["__table_base"] = 0;
    /* these aren't in emscripten's
    */
    var exports = createWasm(env);
    return exports
}
;


function createExportWrapper(name, fixedasm) {
  return function() {
    var displayName = name;
    var asm = fixedasm;
    if (!fixedasm) {
      asm = Module['asm'];
    }
    assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
    assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

// called from emscripten starting main
/** @type {function(...*):?} */
var _main = Module["_main"] = createExportWrapper("main");

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

/** @type {function(...*):?} */
var ___set_stack_limit = Module["___set_stack_limit"] = createExportWrapper("__set_stack_limit");




var ASM_CONSTS = [function($0, $1) {
    var str = UTF8ToString($0);
    try {
        var res = eval(str);
        if (res === null || res == undefined)
            return 0;
        res = res.toString();
        setValue($1, 0, "i32")
    } catch (e) {
        res = e.toString();
        setValue($1, 1, "i32");
        if (res === null || res === undefined)
            res = "unknown exception"
    }
    var buff = Module._malloc((res.length + 1) * 2);
    stringToUTF16(res, buff, (res.length + 1) * 2);
    return buff
}
, function() {
    var err = new Error;
    console.log("Stacktrace: \n");
    console.log(err.stack)
}
, function() {
    return STACK_BASE
}
, function() {
    return TOTAL_STACK
}
];
function _emscripten_asm_const_i(code) {
    return ASM_CONSTS[code]()
}
function _emscripten_asm_const_iii(code, a0, a1) {
    return ASM_CONSTS[code](a0, a1)
}

// copied from emscripten build
// STATICTOP = STATIC_BASE + 18674384;
/* global initializers */  __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });

 var ___exception_infos={};
  
  var ___exception_caught= [];
  
  function ___exception_addRef(ptr) {
      if (!ptr) return;
      var info = ___exception_infos[ptr];
      info.refcount++;
    }
  
  function ___exception_deAdjust(adjusted) {
      if (!adjusted || ___exception_infos[adjusted]) return adjusted;
      for (var key in ___exception_infos) {
        var ptr = +key; // the iteration key is a string, and if we throw this, it must be an integer as that is what we look for
        var adj = ___exception_infos[ptr].adjusted;
        var len = adj.length;
        for (var i = 0; i < len; i++) {
          if (adj[i] === adjusted) {
            return ptr;
          }
        }
      }
      return adjusted;
    }
  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return __ZSt18uncaught_exceptionv.uncaught_exceptions > 0;
    }function ___cxa_begin_catch(ptr) {
      var info = ___exception_infos[ptr];
      if (info && !info.caught) {
        info.caught = true;
        __ZSt18uncaught_exceptionv.uncaught_exceptions--;
      }
      if (info) info.rethrown = false;
      ___exception_caught.push(ptr);
      ___exception_addRef(___exception_deAdjust(ptr));
      return ptr;
    }

 var exceptionLast=0;
  
  function ___cxa_free_exception(ptr) {
      try {
        return _free(ptr);
      } catch(e) {
        err('exception during cxa_free_exception: ' + e);
      }
    }function exception_decRef(info) {
      // A rethrown exception can reach refcount 0; it must not be discarded
      // Its next handler will clear the rethrown flag and addRef it, prior to
      // final decRef and destruction here
      if (info.release_ref() && !info.get_rethrown()) {
        var destructor = info.get_destructor();
        if (destructor) {
          // In Wasm, destructors return 'this' as in ARM
          wasmTable.get(destructor)(info.excPtr);
        }
        ___cxa_free_exception(info.excPtr);
      }
    }function ___cxa_end_catch() {
      // Clear state flag.
      _setThrew(0);
      assert(exceptionCaught.length > 0);
      // Call destructor if one is registered then clear it.
      var catchInfo = exceptionCaught.pop();
  
      exception_decRef(catchInfo.get_exception_info());
      catchInfo.free();
      exceptionLast = 0; // XXX in decRef?
    }

  function ___cxa_find_matching_catch_3() {
      var thrown = ___exception_last;
      if (!thrown) {
        // just pass through the null ptr
        return ((setTempRet0(0),0)|0);
      }
      var info = ___exception_infos[thrown];
      var throwntype = info.type;
      if (!throwntype) {
        // just pass through the thrown ptr
        return ((setTempRet0(0),thrown)|0);
      }
      var typeArray = Array.prototype.slice.call(arguments);
  
      var pointer = ___cxa_is_pointer_type(throwntype);
      // can_catch receives a **, add indirection
      var buffer = 18671296;
      HEAP32[((buffer)>>2)]=thrown;
      thrown = buffer;
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && ___cxa_can_catch(typeArray[i], throwntype, thrown)) {
          thrown = HEAP32[((thrown)>>2)]; // undo indirection
          info.adjusted.push(thrown);
          return ((setTempRet0(typeArray[i]),thrown)|0);
        }
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      thrown = HEAP32[((thrown)>>2)]; // undo indirection
      return ((setTempRet0(throwntype),thrown)|0);
    }

function ___cxa_atexit(a0,a1
  ) {
  return _atexit(a0,a1);
  }

  function ___cxa_thread_atexit(a0,a1
  ) {
  return _atexit(a0,a1);
  }

  function ___cxa_throw(ptr, type, destructor) {
      ___exception_infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      ___exception_last = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++;
      }
      throw ptr;
    }

  function ___cxa_uncaught_exceptions() {
      return __ZSt18uncaught_exceptionv.uncaught_exceptions;
    }

  function ___handle_stack_overflow() {
      abort('stack overflow')
    }
  function ___resumeException(catchInfoPtr) {
      var catchInfo = new CatchInfo(catchInfoPtr);
      var ptr = catchInfo.get_base_ptr();
      if (!exceptionLast) { exceptionLast = ptr; }
      catchInfo.free();
      throw ptr;
    }function ___cxa_find_matching_catch_3() {
      var thrown = exceptionLast;
      if (!thrown) {
        // just pass through the null ptr
        return ((setTempRet0(0),0)|0);
      }
      var info = new ExceptionInfo(thrown);
      var thrownType = info.get_type();
      var catchInfo = new CatchInfo();
      catchInfo.set_base_ptr(thrown);
      if (!thrownType) {
        // just pass through the thrown ptr
        return ((setTempRet0(0),catchInfo.ptr)|0);
      }
      var typeArray = Array.prototype.slice.call(arguments);
  
      // can_catch receives a **, add indirection
      var thrownBuf = 18675392;
      HEAP32[((thrownBuf)>>2)]=thrown;
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        var caughtType = typeArray[i];
        if (caughtType === 0 || caughtType === thrownType) {
          // Catch all clause matched or exactly the same type is caught
          break;
        }
        if (___cxa_can_catch(caughtType, thrownType, thrownBuf)) {
          var adjusted = HEAP32[((thrownBuf)>>2)];
          if (thrown !== adjusted) {
            catchInfo.set_adjusted_ptr(adjusted);
          }
          return ((setTempRet0(caughtType),catchInfo.ptr)|0);
        }
      }
      return ((setTempRet0(thrownType),catchInfo.ptr)|0);
    }


/* from emscripten*/
  var PATH={splitPath:function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function(path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function(path) {
        return PATH.splitPath(path)[3];
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function(l, r) {
        return PATH.normalize(l + '/' + r);
      }};
  
  
  function setErrNo(value) {
      HEAP32[((___errno_location())>>2)]=value;
      return value;
    }
  

  function _getTempRet0() {
      return (getTempRet0() | 0);
    }
  
  /** @type {function(...*):?} */
  function _CompareStringEx(
  ) {
  err('missing function: CompareStringEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _CompareStringOrdinal(
  ) {
  err('missing function: CompareStringOrdinal'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _EnumCalendarInfoExEx(
  ) {
  err('missing function: EnumCalendarInfoExEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _EnumSystemLocalesEx(
  ) {
  err('missing function: EnumSystemLocalesEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _EnumTimeFormatsEx(
  ) {
  err('missing function: EnumTimeFormatsEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _FindNLSStringEx(
  ) {
  err('missing function: FindNLSStringEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _FindStringOrdinal(
  ) {
  err('missing function: FindStringOrdinal'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GetCalendarInfoEx(
  ) {
  err('missing function: GetCalendarInfoEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GetLocaleInfoEx(
  ) {
  err('missing function: GetLocaleInfoEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GetUserPreferredUILanguages(
  ) {
  err('missing function: GetUserPreferredUILanguages'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_ChangeCase(
  ) {
  err('missing function: GlobalizationNative_ChangeCase'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_ChangeCaseInvariant(
  ) {
  err('missing function: GlobalizationNative_ChangeCaseInvariant'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_ChangeCaseTurkish(
  ) {
  err('missing function: GlobalizationNative_ChangeCaseTurkish'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetCalendars(
  ) {
  err('missing function: GlobalizationNative_GetCalendars'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetDefaultLocaleName(
  ) {
  err('missing function: GlobalizationNative_GetDefaultLocaleName'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetJapaneseEraStartDate(
  ) {
  err('missing function: GlobalizationNative_GetJapaneseEraStartDate'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLatestJapaneseEra(
  ) {
  err('missing function: GlobalizationNative_GetLatestJapaneseEra'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocaleInfoGroupingSizes(
  ) {
  err('missing function: GlobalizationNative_GetLocaleInfoGroupingSizes'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocaleInfoInt(
  ) {
  err('missing function: GlobalizationNative_GetLocaleInfoInt'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocaleInfoString(
  ) {
  err('missing function: GlobalizationNative_GetLocaleInfoString'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocaleName(
  ) {
  err('missing function: GlobalizationNative_GetLocaleName'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocaleTimeFormat(
  ) {
  err('missing function: GlobalizationNative_GetLocaleTimeFormat'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetLocales(
  ) {
  err('missing function: GlobalizationNative_GetLocales'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_GetTimeZoneDisplayName(
  ) {
  err('missing function: GlobalizationNative_GetTimeZoneDisplayName'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_NormalizeString(
  ) {
  err('missing function: GlobalizationNative_NormalizeString'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_ToAscii(
  ) {
  err('missing function: GlobalizationNative_ToAscii'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _GlobalizationNative_ToUnicode(
  ) {
  err('missing function: GlobalizationNative_ToUnicode'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _IdnToAscii(
  ) {
  err('missing function: IdnToAscii'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _IdnToUnicode(
  ) {
  err('missing function: IdnToUnicode'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _LCIDToLocaleName(
  ) {
  err('missing function: LCIDToLocaleName'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _LCMapStringEx(
  ) {
  err('missing function: LCMapStringEx'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _LocaleNameToLCID(
  ) {
  err('missing function: LocaleNameToLCID'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _NormalizeString(
  ) {
  err('missing function: NormalizeString'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ResolveLocaleName(
  ) {
  err('missing function: ResolveLocaleName'); abort(-1);
  }

function ___sys_chmod(path, mode) {try {
  
      path = SYSCALLS.getStr(path);
      FS.chmod(path, mode);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_fadvise64_64(fd, offset, len, advice) {
      return 0; // your advice is important to us (but we can't use it)
    }

  function ___sys_fchmod(fd, mode) {try {
  
      FS.fchmod(fd, mode);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_fcntl64(fd, cmd, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        /* case 12: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
          
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        }
        case 13:
        case 14:
        /* case 13: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
        /* case 14: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
          
          
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -28; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_fstat64(fd, buf) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_ftruncate64(fd, zero, low, high) {try {
  
      var length = SYSCALLS.get64(low, high);
      FS.ftruncate(fd, length);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_getcwd(buf, size) {try {
  
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd);
      if (size < cwdLengthInBytes + 1) return -68;
      stringToUTF8(cwd, buf, size);
      return buf;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_getdents64(fd, dirp, count) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd)
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }
  
      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);
  
      var idx = Math.floor(off / struct_size);
  
      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name[0] === '.') {
          id = 1;
          type = 4; // DT_DIR
        } else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                 FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                 FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                 8;                             // DT_REG, regular file.
        }
        (tempI64 = [id>>>0,(tempDouble=id,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((dirp + pos)>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)]=tempI64[1]);
        (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble=(idx + 1) * struct_size,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((dirp + pos)+(8))>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)]=tempI64[1]);
        HEAP16[(((dirp + pos)+(16))>>1)]=280;
        HEAP8[(((dirp + pos)+(18))>>0)]=type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_getegid32() {
      return 0;
    }

  function ___sys_geteuid32(
  ) {
  return ___sys_getegid32();
  }

  function ___sys_getgid32(
  ) {
  return ___sys_getegid32();
  }

  function ___sys_getpid() {
      return 42;
    }

  function ___sys_getrusage(who, usage) {try {
  
      _memset(usage, 0, 136);
      HEAP32[((usage)>>2)]=1; // fake some values
      HEAP32[(((usage)+(4))>>2)]=2;
      HEAP32[(((usage)+(8))>>2)]=3;
      HEAP32[(((usage)+(12))>>2)]=4;
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_getuid32(
  ) {
  return ___sys_getegid32();
  }

  function ___sys_ioctl(fd, op, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)]=0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_link(oldpath, newpath) {
      return -34; // no hardlinks for us
    }

  function ___sys_lstat64(path, buf) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_madvise1(addr, length, advice) {
      return 0; // advice is welcome, but ignored
    }

  function ___sys_mkdir(path, mode) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doMkdir(path, mode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_mlock(addr, len) {
      return 0;
    }

  
  function syscallMmap2(addr, len, prot, flags, fd, off) {
      off <<= 12; // undo pgoffset
      var ptr;
      var allocated = false;
  
      // addr argument must be page aligned if MAP_FIXED flag is set.
      if ((flags & 16) !== 0 && (addr % 16384) !== 0) {
        return -28;
      }
  
      // MAP_ANONYMOUS (aka MAP_ANON) isn't actually defined by POSIX spec,
      // but it is widely used way to allocate memory pages on Linux, BSD and Mac.
      // In this case fd argument is ignored.
      if ((flags & 32) !== 0) {
        ptr = _memalign(16384, len);
        if (!ptr) return -48;
        _memset(ptr, 0, len);
        allocated = true;
      } else {
        var info = FS.getStream(fd);
        if (!info) return -8;
        var res = FS.mmap(info, addr, len, off, prot, flags);
        ptr = res.ptr;
        allocated = res.allocated;
      }
      SYSCALLS.mappings[ptr] = { malloc: ptr, len: len, allocated: allocated, fd: fd, prot: prot, flags: flags, offset: off };
      return ptr;
    }function ___sys_mmap2(addr, len, prot, flags, fd, off) {try {
  
      return syscallMmap2(addr, len, prot, flags, fd, off);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_mprotect(addr, len, size) {
      return 0; // let's not and say we did
    }

  function ___sys_munlock(addr, len) {
      return 0;
    }

  
  function syscallMunmap(addr, len) {
      if ((addr | 0) === -1 || len === 0) {
        return -28;
      }
      // TODO: support unmmap'ing parts of allocations
      var info = SYSCALLS.mappings[addr];
      if (!info) return 0;
      if (len === info.len) {
        var stream = FS.getStream(info.fd);
        if (info.prot & 2) {
          SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
        }
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
          _free(info.malloc);
        }
      }
      return 0;
    }function ___sys_munmap(addr, len) {try {
  
      return syscallMunmap(addr, len);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_open(path, flags, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var pathname = SYSCALLS.getStr(path);
      var mode = SYSCALLS.get();
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  var PIPEFS={BUCKET_BUFFER_SIZE:8192,mount:function (mount) {
        // Do not pollute the real root directory or its child nodes with pipes
        // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createPipe:function () {
        var pipe = {
          buckets: []
        };
  
        pipe.buckets.push({
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: 0,
          roffset: 0
        });
  
        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
  
        rNode.pipe = pipe;
        wNode.pipe = pipe;
  
        var readableStream = FS.createStream({
          path: rName,
          node: rNode,
          flags: FS.modeStringToFlags('r'),
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;
  
        var writableStream = FS.createStream({
          path: wName,
          node: wNode,
          flags: FS.modeStringToFlags('w'),
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;
  
        return {
          readable_fd: readableStream.fd,
          writable_fd: writableStream.fd
        };
      },stream_ops:{poll:function (stream) {
          var pipe = stream.node.pipe;
  
          if ((stream.flags & 2097155) === 1) {
            return (256 | 4);
          } else {
            if (pipe.buckets.length > 0) {
              for (var i = 0; i < pipe.buckets.length; i++) {
                var bucket = pipe.buckets[i];
                if (bucket.offset - bucket.roffset > 0) {
                  return (64 | 1);
                }
              }
            }
          }
  
          return 0;
        },ioctl:function (stream, request, varargs) {
          return ERRNO_CODES.EINVAL;
        },fsync:function (stream) {
          return ERRNO_CODES.EINVAL;
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
          var currentLength = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var bucket = pipe.buckets[i];
            currentLength += bucket.offset - bucket.roffset;
          }
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          if (length <= 0) {
            return 0;
          }
          if (currentLength == 0) {
            // Behave as if the read end is always non-blocking
            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
          }
          var toRead = Math.min(currentLength, length);
  
          var totalRead = toRead;
          var toRemove = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var currBucket = pipe.buckets[i];
            var bucketSize = currBucket.offset - currBucket.roffset;
  
            if (toRead <= bucketSize) {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              if (toRead < bucketSize) {
                tmpSlice = tmpSlice.subarray(0, toRead);
                currBucket.roffset += toRead;
              } else {
                toRemove++;
              }
              data.set(tmpSlice);
              break;
            } else {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              data.set(tmpSlice);
              data = data.subarray(tmpSlice.byteLength);
              toRead -= tmpSlice.byteLength;
              toRemove++;
            }
          }
  
          if (toRemove && toRemove == pipe.buckets.length) {
            // Do not generate excessive garbage in use cases such as
            // write several bytes, read everything, write several bytes, read everything...
            toRemove--;
            pipe.buckets[toRemove].offset = 0;
            pipe.buckets[toRemove].roffset = 0;
          }
  
          pipe.buckets.splice(0, toRemove);
  
          return totalRead;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          var dataLen = data.byteLength;
          if (dataLen <= 0) {
            return 0;
          }
  
          var currBucket = null;
  
          if (pipe.buckets.length == 0) {
            currBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: 0,
              roffset: 0
            };
            pipe.buckets.push(currBucket);
          } else {
            currBucket = pipe.buckets[pipe.buckets.length - 1];
          }
  
          assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
  
          var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
          if (freeBytesInCurrBuffer >= dataLen) {
            currBucket.buffer.set(data, currBucket.offset);
            currBucket.offset += dataLen;
            return dataLen;
          } else if (freeBytesInCurrBuffer > 0) {
            currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
            currBucket.offset += freeBytesInCurrBuffer;
            data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
          }
  
          var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
          var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
  
          for (var i = 0; i < numBuckets; i++) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: PIPEFS.BUCKET_BUFFER_SIZE,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
            data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
          }
  
          if (remElements > 0) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: data.byteLength,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data);
          }
  
          return dataLen;
        },close:function (stream) {
          var pipe = stream.node.pipe;
          pipe.buckets = null;
        }},nextname:function () {
        if (!PIPEFS.nextname.current) {
          PIPEFS.nextname.current = 0;
        }
        return 'pipe[' + (PIPEFS.nextname.current++) + ']';
      }};function ___sys_pipe(fdPtr) {try {
  
      if (fdPtr == 0) {
        throw new FS.ErrnoError(21);
      }
  
      var res = PIPEFS.createPipe();
  
      HEAP32[((fdPtr)>>2)]=res.readable_fd;
      HEAP32[(((fdPtr)+(4))>>2)]=res.writable_fd;
  
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_pipe2(fds, flags) {
      return -52; // unsupported feature
    }

  function ___sys_poll(fds, nfds, timeout) {try {
  
      var nonzero = 0;
      for (var i = 0; i < nfds; i++) {
        var pollfd = fds + 8 * i;
        var fd = HEAP32[((pollfd)>>2)];
        var events = HEAP16[(((pollfd)+(4))>>1)];
        var mask = 32;
        var stream = FS.getStream(fd);
        if (stream) {
          mask = SYSCALLS.DEFAULT_POLLMASK;
          if (stream.stream_ops.poll) {
            mask = stream.stream_ops.poll(stream);
          }
        }
        mask &= events | 8 | 16;
        if (mask) nonzero++;
        HEAP16[(((pollfd)+(6))>>1)]=mask;
      }
      return nonzero;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_prlimit64(pid, resource, new_limit, old_limit) {try {
  
      if (old_limit) { // just report no limits
        HEAP32[((old_limit)>>2)]=-1;  // RLIM_INFINITY
        HEAP32[(((old_limit)+(4))>>2)]=-1;  // RLIM_INFINITY
        HEAP32[(((old_limit)+(8))>>2)]=-1;  // RLIM_INFINITY
        HEAP32[(((old_limit)+(12))>>2)]=-1;  // RLIM_INFINITY
      }
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_read(fd, buf, count) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return FS.read(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_readlink(path, buf, bufsize) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doReadlink(path, buf, bufsize);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_rename(old_path, new_path) {try {
  
      old_path = SYSCALLS.getStr(old_path);
      new_path = SYSCALLS.getStr(new_path);
      FS.rename(old_path, new_path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_rmdir(path) {try {
  
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

function ___sys_socketcall(call, socketvararg) {try {
  
      // socketcalls pass the rest of the arguments in a struct
      SYSCALLS.varargs = socketvararg;
  
      var getSocketFromFD = function() {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(8);
        return socket;
      };
      /** @param {boolean=} allowNull */
      var getSocketAddress = function(allowNull) {
        var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info;
      };
  
      switch (call) {
        case 1: { // socket
          var domain = SYSCALLS.get(), type = SYSCALLS.get(), protocol = SYSCALLS.get();
          var sock = SOCKFS.createSocket(domain, type, protocol);
          assert(sock.stream.fd < 64); // XXX ? select() assumes socket fd values are in 0..63
          return sock.stream.fd;
        }
        case 2: { // bind
          var sock = getSocketFromFD(), info = getSocketAddress();
          sock.sock_ops.bind(sock, info.addr, info.port);
          return 0;
        }
        case 3: { // connect
          var sock = getSocketFromFD(), info = getSocketAddress();
          sock.sock_ops.connect(sock, info.addr, info.port);
          return 0;
        }
        case 4: { // listen
          var sock = getSocketFromFD(), backlog = SYSCALLS.get();
          sock.sock_ops.listen(sock, backlog);
          return 0;
        }
        case 5: { // accept
          var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
          var newsock = sock.sock_ops.accept(sock);
          if (addr) {
            var res = __write_sockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport);
            assert(!res.errno);
          }
          return newsock.stream.fd;
        }
        case 6: { // getsockname
          var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
          // TODO: sock.saddr should never be undefined, see TODO in websocket_sock_ops.getname
          var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || '0.0.0.0'), sock.sport);
          assert(!res.errno);
          return 0;
        }
        case 7: { // getpeername
          var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
          if (!sock.daddr) {
            return -53; // The socket is not connected.
          }
          var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport);
          assert(!res.errno);
          return 0;
        }
        case 11: { // sendto
          var sock = getSocketFromFD(), message = SYSCALLS.get(), length = SYSCALLS.get(), flags = SYSCALLS.get(), dest = getSocketAddress(true);
          if (!dest) {
            // send, no address provided
            return FS.write(sock.stream, HEAP8,message, length);
          } else {
            // sendto an address
            return sock.sock_ops.sendmsg(sock, HEAP8,message, length, dest.addr, dest.port);
          }
        }
        case 12: { // recvfrom
          var sock = getSocketFromFD(), buf = SYSCALLS.get(), len = SYSCALLS.get(), flags = SYSCALLS.get(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
          var msg = sock.sock_ops.recvmsg(sock, len);
          if (!msg) return 0; // socket is closed
          if (addr) {
            var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port);
            assert(!res.errno);
          }
          HEAPU8.set(msg.buffer, buf);
          return msg.buffer.byteLength;
        }
        case 14: { // setsockopt
          return -50; // The option is unknown at the level indicated.
        }
        case 15: { // getsockopt
          var sock = getSocketFromFD(), level = SYSCALLS.get(), optname = SYSCALLS.get(), optval = SYSCALLS.get(), optlen = SYSCALLS.get();
          // Minimal getsockopt aimed at resolving https://github.com/emscripten-core/emscripten/issues/2211
          // so only supports SOL_SOCKET with SO_ERROR.
          if (level === 1) {
            if (optname === 4) {
              HEAP32[((optval)>>2)]=sock.error;
              HEAP32[((optlen)>>2)]=4;
              sock.error = null; // Clear the error (The SO_ERROR option obtains and then clears this field).
              return 0;
            }
          }
          return -50; // The option is unknown at the level indicated.
        }
        case 16: { // sendmsg
          var sock = getSocketFromFD(), message = SYSCALLS.get(), flags = SYSCALLS.get();
          var iov = HEAP32[(((message)+(8))>>2)];
          var num = HEAP32[(((message)+(12))>>2)];
          // read the address and port to send to
          var addr, port;
          var name = HEAP32[((message)>>2)];
          var namelen = HEAP32[(((message)+(4))>>2)];
          if (name) {
            var info = __read_sockaddr(name, namelen);
            if (info.errno) return -info.errno;
            port = info.port;
            addr = DNS.lookup_addr(info.addr) || info.addr;
          }
          // concatenate scatter-gather arrays into one message buffer
          var total = 0;
          for (var i = 0; i < num; i++) {
            total += HEAP32[(((iov)+((8 * i) + 4))>>2)];
          }
          var view = new Uint8Array(total);
          var offset = 0;
          for (var i = 0; i < num; i++) {
            var iovbase = HEAP32[(((iov)+((8 * i) + 0))>>2)];
            var iovlen = HEAP32[(((iov)+((8 * i) + 4))>>2)];
            for (var j = 0; j < iovlen; j++) {  
              view[offset++] = HEAP8[(((iovbase)+(j))>>0)];
            }
          }
          // write the buffer
          return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port);
        }
        case 17: { // recvmsg
          var sock = getSocketFromFD(), message = SYSCALLS.get(), flags = SYSCALLS.get();
          var iov = HEAP32[(((message)+(8))>>2)];
          var num = HEAP32[(((message)+(12))>>2)];
          // get the total amount of data we can read across all arrays
          var total = 0;
          for (var i = 0; i < num; i++) {
            total += HEAP32[(((iov)+((8 * i) + 4))>>2)];
          }
          // try to read total data
          var msg = sock.sock_ops.recvmsg(sock, total);
          if (!msg) return 0; // socket is closed
  
          // TODO honor flags:
          // MSG_OOB
          // Requests out-of-band data. The significance and semantics of out-of-band data are protocol-specific.
          // MSG_PEEK
          // Peeks at the incoming message.
          // MSG_WAITALL
          // Requests that the function block until the full amount of data requested can be returned. The function may return a smaller amount of data if a signal is caught, if the connection is terminated, if MSG_PEEK was specified, or if an error is pending for the socket.
  
          // write the source address out
          var name = HEAP32[((message)>>2)];
          if (name) {
            var res = __write_sockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port);
            assert(!res.errno);
          }
          // write the buffer out to the scatter-gather arrays
          var bytesRead = 0;
          var bytesRemaining = msg.buffer.byteLength;
          for (var i = 0; bytesRemaining > 0 && i < num; i++) {
            var iovbase = HEAP32[(((iov)+((8 * i) + 0))>>2)];
            var iovlen = HEAP32[(((iov)+((8 * i) + 4))>>2)];
            if (!iovlen) {
              continue;
            }
            var length = Math.min(iovlen, bytesRemaining);
            var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
            HEAPU8.set(buf, iovbase + bytesRead);
            bytesRead += length;
            bytesRemaining -= length;
          }
  
          // TODO set msghdr.msg_flags
          // MSG_EOR
          // End of record was received (if supported by the protocol).
          // MSG_OOB
          // Out-of-band data was received.
          // MSG_TRUNC
          // Normal data was truncated.
          // MSG_CTRUNC
  
          return bytesRead;
        }
        default: {
          return -52; // unsupported feature
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_stat64(path, buf) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_ugetrlimit(resource, rlim) {try {
  
      HEAP32[((rlim)>>2)]=-1;  // RLIM_INFINITY
      HEAP32[(((rlim)+(4))>>2)]=-1;  // RLIM_INFINITY
      HEAP32[(((rlim)+(8))>>2)]=-1;  // RLIM_INFINITY
      HEAP32[(((rlim)+(12))>>2)]=-1;  // RLIM_INFINITY
      return 0; // just report no limits
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_uname(buf) {try {
  
      if (!buf) return -21
      var layout = {"__size__":390,"sysname":0,"nodename":65,"release":130,"version":195,"machine":260,"domainname":325};
      var copyString = function(element, value) {
        var offset = layout[element];
        writeAsciiToMemory(value, buf + offset);
      };
      copyString('sysname', 'Emscripten');
      copyString('nodename', 'emscripten');
      copyString('release', '1.0');
      copyString('version', '#1');
      copyString('machine', 'x86-JS');
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_unlink(path) {try {
  
      path = SYSCALLS.getStr(path);
      FS.unlink(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_utimensat(dirfd, path, times, flags) {try {
  
      path = SYSCALLS.getStr(path);
      assert(flags === 0);
      path = SYSCALLS.calculateAt(dirfd, path);
      var seconds = HEAP32[((times)>>2)];
      var nanoseconds = HEAP32[(((times)+(4))>>2)];
      var atime = (seconds*1000) + (nanoseconds/(1000*1000));
      times += 8;
      seconds = HEAP32[((times)>>2)];
      nanoseconds = HEAP32[(((times)+(4))>>2)];
      var mtime = (seconds*1000) + (nanoseconds/(1000*1000));
      FS.utime(path, atime, mtime);
      return 0;  
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

function _corert_wasm_invoke_js(js, length, exception) {
          var mono_string = DOTNET._dotnet_get_global()._mono_string_cached
              || (DOTNET._dotnet_get_global()._mono_string_cached = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']));
  
          console.log("wasm invoke" + js);
          var jsFuncName = UTF8ToString(js, length);
  //        var funcNameJsString = DOTNET.conv_string(js); // this relies on mono_wasm_string_get_utf8 which we dont have.  Its in driver.c
  //        alert(funcNameJsString);
          console.log(jsFuncName);
          var res = eval(jsFuncName);
          exception = 0;
          return "" + res;
      }

  function _corert_wasm_invoke_js_unmarshalled(js, length, arg0, arg1, arg2, exception) {
  
          console.log("wasm invoke unmarshalled" + js);
          var jsFuncName = UTF8ToString(js, length);
          console.log(jsFuncName);
          var dotNetExports = DOTNET._dotnet_get_global().DotNet;
          if (!dotNetExports) {
              throw new Error('The Microsoft.JSInterop.js library is not loaded.');
          }
          var funcInstance = dotNetExports.jsCallDispatcher.findJSFunction(jsFuncName);
  
          return funcInstance.call(null, arg0, arg1, arg2);
          //var res  = mono_wasm_invoke_js_unmarshalled(exception, js, p1, p2, p3);
  //        eval(jsFuncName + '(' + p1 + ',' + p2 + ',' + p3 + ');');
  //        var res = func.apply(p1, p2, p3);
  //        exception = 0;
  //        return "" + res;
      }
  /** @type {function(...*):?} */
  function _deflate(
  ) {
  err('missing function: deflate'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _deflateEnd(
  ) {
  err('missing function: deflateEnd'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _deflateInit2_(
  ) {
  err('missing function: deflateInit2_'); abort(-1);
  }

  function _dladdr(address, info) {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  function _dlclose(handle) {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  function _dlerror() {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  function _dlopen(filename, flag) {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  function _dlsym(handle, symbol) {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  function traverseStack(args) {
      if (!args || !args.callee || !args.callee.name) {
        return [null, '', ''];
      }
  
      var funstr = args.callee.toString();
      var funcname = args.callee.name;
      var str = '(';
      var first = true;
      for (var i in args) {
        var a = args[i];
        if (!first) {
          str += ", ";
        }
        first = false;
        if (typeof a === 'number' || typeof a === 'string') {
          str += a;
        } else {
          str += '(' + typeof a + ')';
        }
      }
      str += ')';
      var caller = args.callee.caller;
      args = caller ? caller.arguments : [];
      if (first)
        str = '';
      return [args, funcname, str];
    }/** @param {number=} flags */
  function _emscripten_get_callstack_js(flags) {
      var callstack = jsStackTrace();
  
      // Find the symbols in the callstack that corresponds to the functions that report callstack information, and remove everything up to these from the output.
      var iThisFunc = callstack.lastIndexOf('_emscripten_log');
      var iThisFunc2 = callstack.lastIndexOf('_emscripten_get_callstack');
      var iNextLine = callstack.indexOf('\n', Math.max(iThisFunc, iThisFunc2))+1;
      callstack = callstack.slice(iNextLine);
  
      // If user requested to see the original source stack, but no source map information is available, just fall back to showing the JS stack.
      if (flags & 8/*EM_LOG_C_STACK*/ && typeof emscripten_source_map === 'undefined') {
        warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
        flags ^= 8/*EM_LOG_C_STACK*/;
        flags |= 16/*EM_LOG_JS_STACK*/;
      }
  
      var stack_args = null;
      if (flags & 128 /*EM_LOG_FUNC_PARAMS*/) {
        // To get the actual parameters to the functions, traverse the stack via the unfortunately deprecated 'arguments.callee' method, if it works:
        stack_args = traverseStack(arguments);
        while (stack_args[1].indexOf('_emscripten_') >= 0)
          stack_args = traverseStack(stack_args[0]);
      }
  
      // Process all lines:
      var lines = callstack.split('\n');
      callstack = '';
      var newFirefoxRe = new RegExp('\\s*(.*?)@(.*?):([0-9]+):([0-9]+)'); // New FF30 with column info: extract components of form '       Object._main@http://server.com:4324:12'
      var firefoxRe = new RegExp('\\s*(.*?)@(.*):(.*)(:(.*))?'); // Old FF without column info: extract components of form '       Object._main@http://server.com:4324'
      var chromeRe = new RegExp('\\s*at (.*?) \\\((.*):(.*):(.*)\\\)'); // Extract components of form '    at Object._main (http://server.com/file.html:4324:12)'
  
      for (var l in lines) {
        var line = lines[l];
  
        var jsSymbolName = '';
        var file = '';
        var lineno = 0;
        var column = 0;
  
        var parts = chromeRe.exec(line);
        if (parts && parts.length == 5) {
          jsSymbolName = parts[1];
          file = parts[2];
          lineno = parts[3];
          column = parts[4];
        } else {
          parts = newFirefoxRe.exec(line);
          if (!parts) parts = firefoxRe.exec(line);
          if (parts && parts.length >= 4) {
            jsSymbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            column = parts[4]|0; // Old Firefox doesn't carry column information, but in new FF30, it is present. See https://bugzilla.mozilla.org/show_bug.cgi?id=762556
          } else {
            // Was not able to extract this line for demangling/sourcemapping purposes. Output it as-is.
            callstack += line + '\n';
            continue;
          }
        }
  
        // Try to demangle the symbol, but fall back to showing the original JS symbol name if not available.
        var cSymbolName = (flags & 32/*EM_LOG_DEMANGLE*/) ? demangle(jsSymbolName) : jsSymbolName;
        if (!cSymbolName) {
          cSymbolName = jsSymbolName;
        }
  
        var haveSourceMap = false;
  
        if (flags & 8/*EM_LOG_C_STACK*/) {
          var orig = emscripten_source_map.originalPositionFor({line: lineno, column: column});
          haveSourceMap = (orig && orig.source);
          if (haveSourceMap) {
            if (flags & 64/*EM_LOG_NO_PATHS*/) {
              orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf('/')+1);
            }
            callstack += '    at ' + cSymbolName + ' (' + orig.source + ':' + orig.line + ':' + orig.column + ')\n';
          }
        }
        if ((flags & 16/*EM_LOG_JS_STACK*/) || !haveSourceMap) {
          if (flags & 64/*EM_LOG_NO_PATHS*/) {
            file = file.substring(file.replace(/\\/g, "/").lastIndexOf('/')+1);
          }
          callstack += (haveSourceMap ? ('     = '+jsSymbolName) : ('    at '+cSymbolName)) + ' (' + file + ':' + lineno + ':' + column + ')\n';
        }
  
        // If we are still keeping track with the callstack by traversing via 'arguments.callee', print the function parameters as well.
        if (flags & 128 /*EM_LOG_FUNC_PARAMS*/ && stack_args[0]) {
          if (stack_args[1] == jsSymbolName && stack_args[2].length > 0) {
            callstack = callstack.replace(/\s+$/, '');
            callstack += ' with values: ' + stack_args[1] + stack_args[2] + '\n';
          }
          stack_args = traverseStack(stack_args[0]);
        }
      }
      // Trim extra whitespace at the end of the output.
      callstack = callstack.replace(/\s+$/, '');
      return callstack;
    }function _emscripten_get_callstack(flags, str, maxbytes) {
      var callstack = _emscripten_get_callstack_js(flags);
      // User can query the required amount of bytes to hold the callstack.
      if (!str || maxbytes <= 0) {
        return lengthBytesUTF8(callstack)+1;
      }
      // Output callstack string as C string to HEAP.
      var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes);
  
      // Return number of bytes written, including null.
      return bytesWrittenExcludingNull+1;
    }

  function _emscripten_get_sbrk_ptr() {
      return 13358624;
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  
  function _emscripten_get_heap_size() {
      return HEAPU8.length;
    }
  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s INITIAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
    }function _emscripten_resize_heap(requestedSize) {
      requestedSize = requestedSize >>> 0;
      abortOnCannotGrowMemory(requestedSize);
    }
  
  
  var ENV={};
ENV["UNO_BOOTSTRAP_MONO_RUNTIME_CONFIGURATION"] = "release";
  
  function __getExecutableName() {
      return thisProgram || './this.program';
    }function getEnvStrings() {
      if (!getEnvStrings.strings) {
        // Default values.
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          // Browser language detection #8751
          'LANG': ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8',
          '_': __getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAP32[((penviron_count)>>2)]=strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAP32[((penviron_buf_size)>>2)]=bufSize;
      return 0;
    }

  function _exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      exit(status);
    }

  function _fd_close(fd) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_fdstat_get(fd, pbuf) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      // All character devices are terminals (other things a Linux system would
      // assume is a character device, like the mouse, we have special APIs for).
      var type = stream.tty ? 2 :
                 FS.isDir(stream.mode) ? 3 :
                 FS.isLink(stream.mode) ? 7 :
                 4;
      HEAP8[((pbuf)>>0)]=type;
      // TODO HEAP16[(((pbuf)+(2))>>1)]=?;
      // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(8))>>2)]=tempI64[0],HEAP32[(((pbuf)+(12))>>2)]=tempI64[1]);
      // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(16))>>2)]=tempI64[0],HEAP32[(((pbuf)+(20))>>2)]=tempI64[1]);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_read(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
  
      
      var stream = SYSCALLS.getStreamFromFD(fd);
      var HIGH_OFFSET = 0x100000000; // 2^32
      // use an unsigned operator on low and shift high by 32-bits
      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  
      var DOUBLE_LIMIT = 0x20000000000000; // 2^53
      // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
        return -61;
      }
  
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)]=tempI64[0],HEAP32[(((newOffset)+(4))>>2)]=tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_sync(fd) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (stream.stream_ops && stream.stream_ops.fsync) {
        return -stream.stream_ops.fsync(stream);
      }
      return 0; // we can't do anything synchronously; the in-memory FS is already synced to
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_write(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _flock(fd, operation) {
      // int flock(int fd, int operation);
      // Pretend to succeed
      return 0;
    }

    var GAI_ERRNO_MESSAGES={};function _gai_strerror(val) {
      var buflen = 256;
  
      // On first call to gai_strerror we initialise the buffer and populate the error messages.
      if (!_gai_strerror.buffer) {
          _gai_strerror.buffer = _malloc(buflen);
  
          GAI_ERRNO_MESSAGES['0'] = 'Success';
          GAI_ERRNO_MESSAGES['' + -1] = 'Invalid value for \'ai_flags\' field';
          GAI_ERRNO_MESSAGES['' + -2] = 'NAME or SERVICE is unknown';
          GAI_ERRNO_MESSAGES['' + -3] = 'Temporary failure in name resolution';
          GAI_ERRNO_MESSAGES['' + -4] = 'Non-recoverable failure in name res';
          GAI_ERRNO_MESSAGES['' + -6] = '\'ai_family\' not supported';
          GAI_ERRNO_MESSAGES['' + -7] = '\'ai_socktype\' not supported';
          GAI_ERRNO_MESSAGES['' + -8] = 'SERVICE not supported for \'ai_socktype\'';
          GAI_ERRNO_MESSAGES['' + -10] = 'Memory allocation failure';
          GAI_ERRNO_MESSAGES['' + -11] = 'System error returned in \'errno\'';
          GAI_ERRNO_MESSAGES['' + -12] = 'Argument buffer overflow';
      }
  
      var msg = 'Unknown error';
  
      if (val in GAI_ERRNO_MESSAGES) {
        if (GAI_ERRNO_MESSAGES[val].length > buflen - 1) {
          msg = 'Message too long'; // EMSGSIZE message. This should never occur given the GAI_ERRNO_MESSAGES above.
        } else {
          msg = GAI_ERRNO_MESSAGES[val];
        }
      }
  
      writeAsciiToMemory(msg, _gai_strerror.buffer);
      return _gai_strerror.buffer;
    }

  function _getaddrinfo(node, service, hint, out) {
      // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
      // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
      // really should provide a linked list of suitable addrinfo values.
      var addrs = [];
      var canon = null;
      var addr = 0;
      var port = 0;
      var flags = 0;
      var family = 0;
      var type = 0;
      var proto = 0;
      var ai, last;
  
      function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var res;
  
        salen = family === 10 ?
          28 :
          16;
        addr = family === 10 ?
          __inet_ntop6_raw(addr) :
          __inet_ntop4_raw(addr);
        sa = _malloc(salen);
        res = __write_sockaddr(sa, family, addr, port);
        assert(!res.errno);
  
        ai = _malloc(32);
        HEAP32[(((ai)+(4))>>2)]=family;
        HEAP32[(((ai)+(8))>>2)]=type;
        HEAP32[(((ai)+(12))>>2)]=proto;
        HEAP32[(((ai)+(24))>>2)]=canon;
        HEAP32[(((ai)+(20))>>2)]=sa;
        if (family === 10) {
          HEAP32[(((ai)+(16))>>2)]=28;
        } else {
          HEAP32[(((ai)+(16))>>2)]=16;
        }
        HEAP32[(((ai)+(28))>>2)]=0;
  
        return ai;
      }
  
      if (hint) {
        flags = HEAP32[((hint)>>2)];
        family = HEAP32[(((hint)+(4))>>2)];
        type = HEAP32[(((hint)+(8))>>2)];
        proto = HEAP32[(((hint)+(12))>>2)];
      }
      if (type && !proto) {
        proto = type === 2 ? 17 : 6;
      }
      if (!type && proto) {
        type = proto === 17 ? 2 : 1;
      }
  
      // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
      // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
      if (proto === 0) {
        proto = 6;
      }
      if (type === 0) {
        type = 1;
      }
  
      if (!node && !service) {
        return -2;
      }
      if (flags & ~(1|2|4|
          1024|8|16|32)) {
        return -1;
      }
      if (hint !== 0 && (HEAP32[((hint)>>2)] & 2) && !node) {
        return -1;
      }
      if (flags & 32) {
        // TODO
        return -2;
      }
      if (type !== 0 && type !== 1 && type !== 2) {
        return -7;
      }
      if (family !== 0 && family !== 2 && family !== 10) {
        return -6;
      }
  
      if (service) {
        service = UTF8ToString(service);
        port = parseInt(service, 10);
  
        if (isNaN(port)) {
          if (flags & 1024) {
            return -2;
          }
          // TODO support resolving well-known service names from:
          // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
          return -8;
        }
      }
  
      if (!node) {
        if (family === 0) {
          family = 2;
        }
        if ((flags & 1) === 0) {
          if (family === 2) {
            addr = _htonl(2130706433);
          } else {
            addr = [0, 0, 0, 1];
          }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAP32[((out)>>2)]=ai;
        return 0;
      }
  
      //
      // try as a numeric address
      //
      node = UTF8ToString(node);
      addr = __inet_pton4_raw(node);
      if (addr !== null) {
        // incoming node is a valid ipv4 address
        if (family === 0 || family === 2) {
          family = 2;
        }
        else if (family === 10 && (flags & 8)) {
          addr = [0, 0, _htonl(0xffff), addr];
          family = 10;
        } else {
          return -2;
        }
      } else {
        addr = __inet_pton6_raw(node);
        if (addr !== null) {
          // incoming node is a valid ipv6 address
          if (family === 0 || family === 10) {
            family = 10;
          } else {
            return -2;
          }
        }
      }
      if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAP32[((out)>>2)]=ai;
        return 0;
      }
      if (flags & 4) {
        return -2;
      }
  
      //
      // try as a hostname
      //
      // resolve the hostname to a temporary fake address
      node = DNS.lookup_name(node);
      addr = __inet_pton4_raw(node);
      if (family === 0) {
        family = 2;
      } else if (family === 10) {
        addr = [0, 0, _htonl(0xffff), addr];
      }
      ai = allocaddrinfo(family, type, proto, null, addr, port);
      HEAP32[((out)>>2)]=ai;
      return 0;
    }

  function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
      var info = __read_sockaddr(sa, salen);
      if (info.errno) {
        return -6;
      }
      var port = info.port;
      var addr = info.addr;
  
      var overflowed = false;
  
      if (node && nodelen) {
        var lookup;
        if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
          if (flags & 8) {
            return -2;
          }
        } else {
          addr = lookup;
        }
        var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
  
        if (numBytesWrittenExclNull+1 >= nodelen) {
          overflowed = true;
        }
      }
  
      if (serv && servlen) {
        port = '' + port;
        var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
  
        if (numBytesWrittenExclNull+1 >= servlen) {
          overflowed = true;
        }
      }
  
      if (overflowed) {
        // Note: even when we overflow, getnameinfo() is specced to write out the truncated results.
        return -12;
      }
  
      return 0;
    }

  function _getpwuid_r() { throw 'getpwuid_r: TODO' }

function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  out(what);
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  var output = 'abort(' + what + ') at ' + stackTrace();
  what = output;

  // Throw a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  throw new WebAssembly.RuntimeError(what);
}

  function _gettimeofday(ptr) {
      var now = Date.now();
      HEAP32[((ptr)>>2)]=(now/1000)|0; // seconds
      HEAP32[(((ptr)+(4))>>2)]=((now % 1000)*1000)|0; // microseconds
      return 0;
    }

  
  var ___tm_timezone=(stringToUTF8("GMT", 18564688, 4), 18564688);function _gmtime_r(time, tmPtr) {
      var date = new Date(HEAP32[((time)>>2)]*1000);
      HEAP32[((tmPtr)>>2)]=date.getUTCSeconds();
      HEAP32[(((tmPtr)+(4))>>2)]=date.getUTCMinutes();
      HEAP32[(((tmPtr)+(8))>>2)]=date.getUTCHours();
      HEAP32[(((tmPtr)+(12))>>2)]=date.getUTCDate();
      HEAP32[(((tmPtr)+(16))>>2)]=date.getUTCMonth();
      HEAP32[(((tmPtr)+(20))>>2)]=date.getUTCFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)]=date.getUTCDay();
      HEAP32[(((tmPtr)+(36))>>2)]=0;
      HEAP32[(((tmPtr)+(32))>>2)]=0;
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
      HEAP32[(((tmPtr)+(40))>>2)]=___tm_timezone;
  
      return tmPtr;
    }

  /** @type {function(...*):?} */
  function _inflate(
  ) {
  err('missing function: inflate'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _inflateEnd(
  ) {
  err('missing function: inflateEnd'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _inflateInit2_(
  ) {
  err('missing function: inflateInit2_'); abort(-1);
  }

  
  function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by getTimezoneOffset().
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAP32[((__get_timezone())>>2)]=(new Date()).getTimezoneOffset() * 60;
  
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      HEAP32[((__get_daylight())>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        // Northern hemisphere
        HEAP32[((__get_tzname())>>2)]=winterNamePtr;
        HEAP32[(((__get_tzname())+(4))>>2)]=summerNamePtr;
      } else {
        HEAP32[((__get_tzname())>>2)]=summerNamePtr;
        HEAP32[(((__get_tzname())+(4))>>2)]=winterNamePtr;
      }
    }function _mktime(tmPtr) {
      _tzset();
      var date = new Date(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
  
      // There's an ambiguous hour when the time goes back; the tm_isdst field is
      // used to disambiguate it.  Date() basically guesses, so we fix it up if it
      // guessed wrong, or fill in tm_isdst with the guess if it's -1.
      var dst = HEAP32[(((tmPtr)+(32))>>2)];
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
      if (dst < 0) {
        // Attention: some regions don't have DST at all.
        HEAP32[(((tmPtr)+(32))>>2)]=Number(summerOffset != winterOffset && dstOffset == guessedOffset);
      } else if ((dst > 0) != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
        date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
      }
  
      HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
  
      return (date.getTime() / 1000)|0;
    }

  
  function _usleep(useconds) {
      // int usleep(useconds_t useconds);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
      // We're single-threaded, so use a busy loop. Super-ugly.
      var start = _emscripten_get_now();
      while (_emscripten_get_now() - start < useconds / 1000) {
        // Do nothing.
      }
    }function _nanosleep(rqtp, rmtp) {
      // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
      if (rqtp === 0) {
        setErrNo(28);
        return -1;
      }
      var seconds = HEAP32[((rqtp)>>2)];
      var nanoseconds = HEAP32[(((rqtp)+(4))>>2)];
      if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
        setErrNo(28);
        return -1;
      }
      if (rmtp !== 0) {
        HEAP32[((rmtp)>>2)]=0;
        HEAP32[(((rmtp)+(4))>>2)]=0;
      }
      return _usleep((seconds * 1e6) + (nanoseconds / 1000));
    }

  function _pthread_attr_destroy(attr) {
      /* int pthread_attr_destroy(pthread_attr_t *attr); */
      //FIXME: should destroy the pthread_attr_t struct
      return 0;
    }

  function _pthread_attr_getstack(attr, stackaddr, stacksize) {
      /* int pthread_attr_getstack(const pthread_attr_t *restrict attr,
         void **restrict stackaddr, size_t *restrict stacksize); */
      /*FIXME: assumes that there is only one thread, and that attr is the
        current thread*/
      HEAP32[((stackaddr)>>2)]=STACK_BASE;
      HEAP32[((stacksize)>>2)]=TOTAL_STACK;
      return 0;
    }

  function _pthread_attr_init(attr) {
      /* int pthread_attr_init(pthread_attr_t *attr); */
      //FIXME: should allocate a pthread_attr_t
      return 0;
    }

  function _pthread_attr_setdetachstate() {}

  function _pthread_attr_setstacksize() {}

  function _pthread_condattr_destroy() { return 0; }

  function _pthread_condattr_init() { return 0; }

  function _pthread_condattr_setclock() { return 0; }

  function _pthread_create() {
      return 6;
    }

  function _pthread_getattr_np(thread, attr) {
      /* int pthread_getattr_np(pthread_t thread, pthread_attr_t *attr); */
      //FIXME: should fill in attributes of the given thread in pthread_attr_t
      return 0;
    }

  function _pthread_rwlock_destroy() { return 0; }

  function _pthread_rwlock_init() { return 0; }

  function _pthread_rwlock_rdlock() { return 0; }

  function _pthread_rwlock_unlock() { return 0; }

  function _pthread_rwlock_wrlock() { return 0; }

  function _pthread_setcancelstate() { return 0; }
  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }

  function _sigaction(signum, act, oldact) {
      //int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
      err('Calling stub instead of sigaction()');
      return 0;
    }

  
  var __sigalrm_handler=0;function _signal(sig, func) {
      if (sig == 14 /*SIGALRM*/) {
        __sigalrm_handler = func;
      } else {
        err('Calling stub instead of signal()');
      }
      return 0;
    }

  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {
        // no-op
      }
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = HEAP32[(((tm)+(40))>>2)];
  
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
      };
  
      var pattern = UTF8ToString(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate time representation
        // Modified Conversion Specifiers
        '%Ec': '%c',                      // Replaced by the locale's alternative appropriate date and time representation.
        '%EC': '%C',                      // Replaced by the name of the base year (period) in the locale's alternative representation.
        '%Ex': '%m/%d/%y',                // Replaced by the locale's alternative date representation.
        '%EX': '%H:%M:%S',                // Replaced by the locale's alternative time representation.
        '%Ey': '%y',                      // Replaced by the offset from %EC (year only) in the locale's alternative representation.
        '%EY': '%Y',                      // Replaced by the full alternative year representation.
        '%Od': '%d',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
        '%Oe': '%e',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
        '%OH': '%H',                      // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
        '%OI': '%I',                      // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
        '%Om': '%m',                      // Replaced by the month using the locale's alternative numeric symbols.
        '%OM': '%M',                      // Replaced by the minutes using the locale's alternative numeric symbols.
        '%OS': '%S',                      // Replaced by the seconds using the locale's alternative numeric symbols.
        '%Ou': '%u',                      // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
        '%OU': '%U',                      // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
        '%OV': '%V',                      // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
        '%Ow': '%w',                      // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
        '%OW': '%W',                      // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
        '%Oy': '%y',                      // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      }
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        }
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      }
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      }
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else {
            return thisDate.getFullYear()-1;
          }
      }
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
          // January 4th, which is also the week that includes the first Thursday of the year, and
          // is also the first week that contains at least four days in the year.
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
          // the last week of the preceding year; thus, for Saturday 2nd January 1999,
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
          // or 31st is a Monday, it and any following days are part of week 1 of the following year.
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
  
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          return date.tm_wday || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Sunday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week)
          // as a decimal number [01,53]. If the week containing 1 January has four
          // or more days in the new year, then it is considered week 1.
          // Otherwise, it is the last week of the previous year, and the next week is week 1.
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          }
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          return date.tm_wday;
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Monday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': function(date) {
          return date.tm_zone;
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return 16384;
        case 85:
          var maxHeapSize = HEAPU8.length;
          return maxHeapSize / 16384;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
        case 79:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: {
          if (typeof navigator === 'object') return navigator['hardwareConcurrency'] || 1;
          return 1;
        }
      }
      setErrNo(28);
      return -1;
    }

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  /** @type {function(...*):?} */
  function _ucol_closeElements_62(
  ) {
  err('missing function: ucol_closeElements_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_close_62(
  ) {
  err('missing function: ucol_close_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_getRules_62(
  ) {
  err('missing function: ucol_getRules_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_getSortKey_62(
  ) {
  err('missing function: ucol_getSortKey_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_getStrength_62(
  ) {
  err('missing function: ucol_getStrength_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_next_62(
  ) {
  err('missing function: ucol_next_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_openElements_62(
  ) {
  err('missing function: ucol_openElements_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_openRules_62(
  ) {
  err('missing function: ucol_openRules_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_open_62(
  ) {
  err('missing function: ucol_open_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_previous_62(
  ) {
  err('missing function: ucol_previous_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_safeClone_62(
  ) {
  err('missing function: ucol_safeClone_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_setAttribute_62(
  ) {
  err('missing function: ucol_setAttribute_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_setVariableTop_62(
  ) {
  err('missing function: ucol_setVariableTop_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _ucol_strcoll_62(
  ) {
  err('missing function: ucol_strcoll_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _usearch_close_62(
  ) {
  err('missing function: usearch_close_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _usearch_first_62(
  ) {
  err('missing function: usearch_first_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _usearch_getMatchedLength_62(
  ) {
  err('missing function: usearch_getMatchedLength_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _usearch_last_62(
  ) {
  err('missing function: usearch_last_62'); abort(-1);
  }

  /** @type {function(...*):?} */
  function _usearch_openFromCollator_62(
  ) {
  err('missing function: usearch_openFromCollator_62'); abort(-1);
  }
var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;  // root node sets parent to itself
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292/*292*/ | 73/*73*/;
  var writeMode = 146/*146*/;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get: /** @this{FSNode} */function() {
     return (this.mode & readMode) === readMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get: /** @this{FSNode} */function() {
     return (this.mode & writeMode) === writeMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get: /** @this{FSNode} */function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get: /** @this{FSNode} */function() {
     return FS.isChrdev(this.mode);
    }
   }
  });


function ___assert_fail(condition, filename, line, func) {
    abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
}
var ENV = {};
 function __getExecutableName() {
      return thisProgram || './this.program';
    }function getEnvStrings() {
      if (!getEnvStrings.strings) {
        // Default values.
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          // Browser language detection #8751
          'LANG': ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8',
          '_': __getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

function ___buildEnvironment(environ) {
    var MAX_ENV_VALUES = 64;
    var TOTAL_ENV_SIZE = 1024;
    var poolPtr;
    var envPtr;
    if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        ENV["USER"] = ENV["LOGNAME"] = "web_user";
        ENV["PATH"] = "/";
        ENV["PWD"] = "/";
        ENV["HOME"] = "/home/web_user";
        ENV["LANG"] = "C.UTF-8";
        ENV["_"] = Module["thisProgram"];
        poolPtr = getMemory(TOTAL_ENV_SIZE);
        envPtr = getMemory(MAX_ENV_VALUES * 4);
        HEAP32[envPtr >> 2] = poolPtr;
        HEAP32[environ >> 2] = envPtr
    } else {
        envPtr = HEAP32[environ >> 2];
        poolPtr = HEAP32[envPtr >> 2]
    }
    var strings = [];
    var totalSize = 0;
    for (var key in ENV) {
        if (typeof ENV[key] === "string") {
            var line = key + "=" + ENV[key];
            strings.push(line);
            totalSize += line.length
        }
    }
    if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")
    }
    var ptrSize = 4;
    for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
        poolPtr += line.length + 1
    }
    HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
}
function _emscripten_get_now() {
    abort()
}
function _emscripten_get_now_is_monotonic() {
    return 0 || ENVIRONMENT_IS_NODE || typeof dateNow !== "undefined" || typeof performance === "object" && performance && typeof performance["now"] === "function"
}
function ___setErrNo(value) {
    if (Module["___errno_location"])
        HEAP32[Module["___errno_location"]() >> 2] = value;
    return value
}
function _clock_gettime(clk_id, tp) {
    var now;
    if (clk_id === 0) {
        now = Date.now()
    } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
        now = _emscripten_get_now()
    } else {
        ___setErrNo(22);
        return -1
    }
    HEAP32[tp >> 2] = now / 1e3 | 0;
    HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
    return 0
}
function ___clock_gettime(a0, a1) {
    return _clock_gettime(a0, a1)
}
function ___cxa_allocate_exception(size) {
    return _malloc(size)
}
function __ZSt18uncaught_exceptionv() {
    return !!__ZSt18uncaught_exceptionv.uncaught_exception
}
function ___cxa_free_exception(ptr) {
    try {
        return _free(ptr)
    } catch (e) {}
}
var EXCEPTIONS = {
    last: 0,
    caught: [],
    infos: {},
    deAdjust: function(adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted])
            return adjusted;
        for (var key in EXCEPTIONS.infos) {
            var ptr = +key;
            var adj = EXCEPTIONS.infos[ptr].adjusted;
            var len = adj.length;
            for (var i = 0; i < len; i++) {
                if (adj[i] === adjusted) {
                    return ptr
                }
            }
        }
        return adjusted
    },
    addRef: function(ptr) {
        if (!ptr)
            return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++
    },
    decRef: function(ptr) {
        if (!ptr)
            return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;
        if (info.refcount === 0 && !info.rethrown) {
            if (info.destructor) {
                Module["dynCall_vi"](info.destructor, ptr)
            }
            delete EXCEPTIONS.infos[ptr];
            ___cxa_free_exception(ptr)
        }
    },
    clearRef: function(ptr) {
        if (!ptr)
            return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0
    }
};
function ___cxa_throw(ptr, type, destructor) {
    EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
    };
    EXCEPTIONS.last = ptr;
    if (!("uncaught_exception"in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1
    } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++
    }
    throw ptr
}
function ___lock() {}

var PATH = {
    splitPath: function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    },
    normalizeArray: function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    },
    normalize: function(path) {
        var isAbsolute = path.charAt(0) === "/"
          , trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    },
    dirname: function(path) {
        var result = PATH.splitPath(path)
          , root = result[0]
          , dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    },
    basename: function(path) {
        if (path === "/")
            return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1)
            return path;
        return path.substr(lastSlash + 1)
    },
    extname: function(path) {
        return PATH.splitPath(path)[3]
    },
    join: function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"))
    },
    join2: function(l, r) {
        return PATH.normalize(l + "/" + r)
    },
    resolve: function() {
        var resolvedPath = ""
          , resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
            return !!p
        }), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    },
    relative: function(from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "")
                    break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "")
                    break
            }
            if (start > end)
                return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    }
};
var TTY = {
    ttys: [],
    init: function() {},
    shutdown: function() {},
    register: function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    },
    stream_ops: {
        open: function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(19)
            }
            stream.tty = tty;
            stream.seekable = false
        },
        close: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        flush: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        read: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(6)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(5)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(11)
                }
                if (result === null || result === undefined)
                    break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        },
        write: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(6)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(5)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        }
    },
    default_tty_ops: {
        get_char: function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    var isPosixPlatform = process.platform != "win32";
                    var fd = process.stdin.fd;
                    if (isPosixPlatform) {
                        var usingDevice = false;
                        try {
                            fd = fs.openSync("/dev/stdin", "r");
                            usingDevice = true
                        } catch (e) {}
                    }
                    try {
                        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null)
                    } catch (e) {
                        if (e.toString().indexOf("EOF") != -1)
                            bytesRead = 0;
                        else
                            throw e
                    }
                    if (usingDevice) {
                        fs.closeSync(fd)
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        },
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0)
                    tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    },
    default_tty1_ops: {
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0)
                    tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    }
};
var MEMFS = {
    ops_table: null,
    mount: function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    },
    createNode: function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(1)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node
        }
        return node
    },
    getFileDataAsRegularArray: function(node) {
        if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i)
                arr.push(node.contents[i]);
            return arr
        }
        return node.contents
    },
    getFileDataAsTypedArray: function(node) {
        if (!node.contents)
            return new Uint8Array;
        if (node.contents.subarray)
            return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    },
    expandFileStorage: function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity)
            return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
        if (prevCapacity != 0)
            newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0)
            node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        return
    },
    resizeFileStorage: function(node, newSize) {
        if (node.usedBytes == newSize)
            return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
        }
        if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(new ArrayBuffer(newSize));
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
        }
        if (!node.contents)
            node.contents = [];
        if (node.contents.length > newSize)
            node.contents.length = newSize;
        else
            while (node.contents.length < newSize)
                node.contents.push(0);
        node.usedBytes = newSize
    },
    node_ops: {
        getattr: function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        },
        setattr: function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        },
        lookup: function(parent, name) {
            throw FS.genericErrors[2]
        },
        mknod: function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(39)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir
        },
        unlink: function(parent, name) {
            delete parent.contents[name]
        },
        rmdir: function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(39)
            }
            delete parent.contents[name]
        },
        readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        },
        readlink: function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(22)
            }
            return node.link
        }
    },
    stream_ops: {
        read: function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes)
                return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++)
                    buffer[offset + i] = contents[position + i]
            }
            return size
        },
        write: function(stream, buffer, offset, length, position, canOwn) {
            canOwn = false;
            if (!length)
                return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray)
                node.contents.set(buffer.subarray(offset, offset + length), position);
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(22)
            }
            return position
        },
        allocate: function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        },
        mmap: function(stream, buffer, offset, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(19)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < stream.node.usedBytes) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(12)
                }
                buffer.set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        },
        msync: function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(19)
            }
            if (mmapFlags & 2) {
                return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        }
    }
};
var IDBFS = {
    dbs: {},
    indexedDB: function() {
        if (typeof indexedDB !== "undefined")
            return indexedDB;
        var ret = null;
        if (typeof window === "object")
            ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret
    },
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: function(mount) {
        return MEMFS.mount.apply(null, arguments)
    },
    syncfs: function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
            if (err)
                return callback(err);
            IDBFS.getRemoteSet(mount, function(err, remote) {
                if (err)
                    return callback(err);
                var src = populate ? remote : local;
                var dst = populate ? local : remote;
                IDBFS.reconcile(src, dst, callback)
            })
        })
    },
    getDB: function(name, callback) {
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db)
        }
        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
        } catch (e) {
            return callback(e)
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB")
        }
        req.onupgradeneeded = function(e) {
            var db = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
            }
            if (!fileStore.indexNames.contains("timestamp")) {
                fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                })
            }
        }
        ;
        req.onsuccess = function() {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db)
        }
        ;
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    getLocalSet: function(mount, callback) {
        var entries = {};
        function isRealDir(p) {
            return p !== "." && p !== ".."
        }
        function toAbsolute(root) {
            return function(p) {
                return PATH.join2(root, p)
            }
        }
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
            var path = check.pop();
            var stat;
            try {
                stat = FS.stat(path)
            } catch (e) {
                return callback(e)
            }
            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
            }
            entries[path] = {
                timestamp: stat.mtime
            }
        }
        return callback(null, {
            type: "local",
            entries: entries
        })
    },
    getRemoteSet: function(mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
            if (err)
                return callback(err);
            try {
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                transaction.onerror = function(e) {
                    callback(this.error);
                    e.preventDefault()
                }
                ;
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                var index = store.index("timestamp");
                index.openKeyCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                        return callback(null, {
                            type: "remote",
                            db: db,
                            entries: entries
                        })
                    }
                    entries[cursor.primaryKey] = {
                        timestamp: cursor.key
                    };
                    cursor.continue()
                }
            } catch (e) {
                return callback(e)
            }
        })
    },
    loadLocalEntry: function(path, callback) {
        var stat, node;
        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path)
        } catch (e) {
            return callback(e)
        }
        if (FS.isDir(stat.mode)) {
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode
            })
        } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode,
                contents: node.contents
            })
        } else {
            return callback(new Error("node type not supported"))
        }
    },
    storeLocalEntry: function(path, entry, callback) {
        try {
            if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode)
            } else if (FS.isFile(entry.mode)) {
                FS.writeFile(path, entry.contents, {
                    canOwn: true
                })
            } else {
                return callback(new Error("node type not supported"))
            }
            FS.chmod(path, entry.mode);
            FS.utime(path, entry.timestamp, entry.timestamp)
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    removeLocalEntry: function(path, callback) {
        try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
                FS.rmdir(path)
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path)
            }
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    loadRemoteEntry: function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) {
            callback(null, event.target.result)
        }
        ;
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    storeRemoteEntry: function(store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() {
            callback(null)
        }
        ;
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    removeRemoteEntry: function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() {
            callback(null)
        }
        ;
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    reconcile: function(src, dst, callback) {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach(function(key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e.timestamp > e2.timestamp) {
                create.push(key);
                total++
            }
        });
        var remove = [];
        Object.keys(dst.entries).forEach(function(key) {
            var e = dst.entries[key];
            var e2 = src.entries[key];
            if (!e2) {
                remove.push(key);
                total++
            }
        });
        if (!total) {
            return callback(null)
        }
        var errored = false;
        var completed = 0;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return callback(err)
                }
                return
            }
            if (++completed >= total) {
                return callback(null)
            }
        }
        transaction.onerror = function(e) {
            done(this.error);
            e.preventDefault()
        }
        ;
        create.sort().forEach(function(path) {
            if (dst.type === "local") {
                IDBFS.loadRemoteEntry(store, path, function(err, entry) {
                    if (err)
                        return done(err);
                    IDBFS.storeLocalEntry(path, entry, done)
                })
            } else {
                IDBFS.loadLocalEntry(path, function(err, entry) {
                    if (err)
                        return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done)
                })
            }
        });
        remove.sort().reverse().forEach(function(path) {
            if (dst.type === "local") {
                IDBFS.removeLocalEntry(path, done)
            } else {
                IDBFS.removeRemoteEntry(store, path, done)
            }
        })
    }
};
var NODEFS = {
    isWindows: false,
    staticInit: function() {
        NODEFS.isWindows = !!process.platform.match(/^win/);
        var flags = process["binding"]("constants");
        if (flags["fs"]) {
            flags = flags["fs"]
        }
        NODEFS.flagsForNodeMap = {
            1024: flags["O_APPEND"],
            64: flags["O_CREAT"],
            128: flags["O_EXCL"],
            0: flags["O_RDONLY"],
            2: flags["O_RDWR"],
            4096: flags["O_SYNC"],
            512: flags["O_TRUNC"],
            1: flags["O_WRONLY"]
        }
    },
    bufferFrom: function(arrayBuffer) {
        return Buffer.alloc ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer)
    },
    mount: function(mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
    },
    createNode: function(parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
            throw new FS.ErrnoError(22)
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node
    },
    getMode: function(path) {
        var stat;
        try {
            stat = fs.lstatSync(path);
            if (NODEFS.isWindows) {
                stat.mode = stat.mode | (stat.mode & 292) >> 2
            }
        } catch (e) {
            if (!e.code)
                throw e;
            throw new FS.ErrnoError(-e.errno)
        }
        return stat.mode
    },
    realPath: function(node) {
        var parts = [];
        while (node.parent !== node) {
            parts.push(node.name);
            node = node.parent
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts)
    },
    flagsForNode: function(flags) {
        flags &= ~2097152;
        flags &= ~2048;
        flags &= ~32768;
        flags &= ~524288;
        var newFlags = 0;
        for (var k in NODEFS.flagsForNodeMap) {
            if (flags & k) {
                newFlags |= NODEFS.flagsForNodeMap[k];
                flags ^= k
            }
        }
        if (!flags) {
            return newFlags
        } else {
            throw new FS.ErrnoError(22)
        }
    },
    node_ops: {
        getattr: function(node) {
            var path = NODEFS.realPath(node);
            var stat;
            try {
                stat = fs.lstatSync(path)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
            if (NODEFS.isWindows && !stat.blksize) {
                stat.blksize = 4096
            }
            if (NODEFS.isWindows && !stat.blocks) {
                stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
            }
            return {
                dev: stat.dev,
                ino: stat.ino,
                mode: stat.mode,
                nlink: stat.nlink,
                uid: stat.uid,
                gid: stat.gid,
                rdev: stat.rdev,
                size: stat.size,
                atime: stat.atime,
                mtime: stat.mtime,
                ctime: stat.ctime,
                blksize: stat.blksize,
                blocks: stat.blocks
            }
        },
        setattr: function(node, attr) {
            var path = NODEFS.realPath(node);
            try {
                if (attr.mode !== undefined) {
                    fs.chmodSync(path, attr.mode);
                    node.mode = attr.mode
                }
                if (attr.timestamp !== undefined) {
                    var date = new Date(attr.timestamp);
                    fs.utimesSync(path, date, date)
                }
                if (attr.size !== undefined) {
                    fs.truncateSync(path, attr.size)
                }
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        lookup: function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            var mode = NODEFS.getMode(path);
            return NODEFS.createNode(parent, name, mode)
        },
        mknod: function(parent, name, mode, dev) {
            var node = NODEFS.createNode(parent, name, mode, dev);
            var path = NODEFS.realPath(node);
            try {
                if (FS.isDir(node.mode)) {
                    fs.mkdirSync(path, node.mode)
                } else {
                    fs.writeFileSync(path, "", {
                        mode: node.mode
                    })
                }
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
            return node
        },
        rename: function(oldNode, newDir, newName) {
            var oldPath = NODEFS.realPath(oldNode);
            var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
            try {
                fs.renameSync(oldPath, newPath)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        unlink: function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.unlinkSync(path)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        rmdir: function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.rmdirSync(path)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        readdir: function(node) {
            var path = NODEFS.realPath(node);
            try {
                return fs.readdirSync(path)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        symlink: function(parent, newName, oldPath) {
            var newPath = PATH.join2(NODEFS.realPath(parent), newName);
            try {
                fs.symlinkSync(oldPath, newPath)
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        readlink: function(node) {
            var path = NODEFS.realPath(node);
            try {
                path = fs.readlinkSync(path);
                path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
                return path
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        }
    },
    stream_ops: {
        open: function(stream) {
            var path = NODEFS.realPath(stream.node);
            try {
                if (FS.isFile(stream.node.mode)) {
                    stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags))
                }
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        close: function(stream) {
            try {
                if (FS.isFile(stream.node.mode) && stream.nfd) {
                    fs.closeSync(stream.nfd)
                }
            } catch (e) {
                if (!e.code)
                    throw e;
                throw new FS.ErrnoError(-e.errno)
            }
        },
        read: function(stream, buffer, offset, length, position) {
            if (length === 0)
                return 0;
            try {
                return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
            } catch (e) {
                throw new FS.ErrnoError(-e.errno)
            }
        },
        write: function(stream, buffer, offset, length, position) {
            try {
                return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position)
            } catch (e) {
                throw new FS.ErrnoError(-e.errno)
            }
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    try {
                        var stat = fs.fstatSync(stream.nfd);
                        position += stat.size
                    } catch (e) {
                        throw new FS.ErrnoError(-e.errno)
                    }
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(22)
            }
            return position
        }
    }
};
var WORKERFS = {
    DIR_MODE: 16895,
    FILE_MODE: 33279,
    reader: null,
    mount: function(mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader)
            WORKERFS.reader = new FileReaderSync;
        var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
        var createdParents = {};
        function ensureParent(path) {
            var parts = path.split("/");
            var parent = root;
            for (var i = 0; i < parts.length - 1; i++) {
                var curr = parts.slice(0, i + 1).join("/");
                if (!createdParents[curr]) {
                    createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0)
                }
                parent = createdParents[curr]
            }
            return parent
        }
        function base(path) {
            var parts = path.split("/");
            return parts[parts.length - 1]
        }
        Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
            WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate)
        });
        (mount.opts["blobs"] || []).forEach(function(obj) {
            WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"])
        });
        (mount.opts["packages"] || []).forEach(function(pack) {
            pack["metadata"].files.forEach(function(file) {
                var name = file.filename.substr(1);
                WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end))
            })
        });
        return root
    },
    createNode: function(parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
            node.size = contents.size;
            node.contents = contents
        } else {
            node.size = 4096;
            node.contents = {}
        }
        if (parent) {
            parent.contents[name] = node
        }
        return node
    },
    node_ops: {
        getattr: function(node) {
            return {
                dev: 1,
                ino: undefined,
                mode: node.mode,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: undefined,
                size: node.size,
                atime: new Date(node.timestamp),
                mtime: new Date(node.timestamp),
                ctime: new Date(node.timestamp),
                blksize: 4096,
                blocks: Math.ceil(node.size / 4096)
            }
        },
        setattr: function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
        },
        lookup: function(parent, name) {
            throw new FS.ErrnoError(2)
        },
        mknod: function(parent, name, mode, dev) {
            throw new FS.ErrnoError(1)
        },
        rename: function(oldNode, newDir, newName) {
            throw new FS.ErrnoError(1)
        },
        unlink: function(parent, name) {
            throw new FS.ErrnoError(1)
        },
        rmdir: function(parent, name) {
            throw new FS.ErrnoError(1)
        },
        readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function(parent, newName, oldPath) {
            throw new FS.ErrnoError(1)
        },
        readlink: function(node) {
            throw new FS.ErrnoError(1)
        }
    },
    stream_ops: {
        read: function(stream, buffer, offset, length, position) {
            if (position >= stream.node.size)
                return 0;
            var chunk = stream.node.contents.slice(position, position + length);
            var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
            buffer.set(new Uint8Array(ab), offset);
            return chunk.size
        },
        write: function(stream, buffer, offset, length, position) {
            throw new FS.ErrnoError(5)
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.size
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(22)
            }
            return position
        }
    }
};
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    handleFSError: function(e) {
        if (!(e instanceof FS.ErrnoError))
            throw e + " : " + stackTrace();
        return ___setErrNo(e.errno)
    },
    lookupPath: function(path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path)
            return {
                path: "",
                node: null
            };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key]
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(40)
        }
        var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(40)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    },
    getPath: function(node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                    return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    },
    hashName: function(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    },
    hashAddNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    },
    hashRemoveNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    },
    lookupNode: function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
            throw new FS.ErrnoError(err,parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    },
    createNode: function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
            FS.FSNode = function(parent, name, mode, rdev) {
                if (!parent) {
                    parent = this
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.mounted = null;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.node_ops = {};
                this.stream_ops = {};
                this.rdev = rdev
            }
            ;
            FS.FSNode.prototype = {};
            var readMode = 292 | 73;
            var writeMode = 146;
            Object.defineProperties(FS.FSNode.prototype, {
                read: {
                    get: function() {
                        return (this.mode & readMode) === readMode
                    },
                    set: function(val) {
                        val ? this.mode |= readMode : this.mode &= ~readMode
                    }
                },
                write: {
                    get: function() {
                        return (this.mode & writeMode) === writeMode
                    },
                    set: function(val) {
                        val ? this.mode |= writeMode : this.mode &= ~writeMode
                    }
                },
                isFolder: {
                    get: function() {
                        return FS.isDir(this.mode)
                    }
                },
                isDevice: {
                    get: function() {
                        return FS.isChrdev(this.mode)
                    }
                }
            })
        }
        var node = new FS.FSNode(parent,name,mode,rdev);
        FS.hashAddNode(node);
        return node
    },
    destroyNode: function(node) {
        FS.hashRemoveNode(node)
    },
    isRoot: function(node) {
        return node === node.parent
    },
    isMountpoint: function(node) {
        return !!node.mounted
    },
    isFile: function(mode) {
        return (mode & 61440) === 32768
    },
    isDir: function(mode) {
        return (mode & 61440) === 16384
    },
    isLink: function(mode) {
        return (mode & 61440) === 40960
    },
    isChrdev: function(mode) {
        return (mode & 61440) === 8192
    },
    isBlkdev: function(mode) {
        return (mode & 61440) === 24576
    },
    isFIFO: function(mode) {
        return (mode & 61440) === 4096
    },
    isSocket: function(mode) {
        return (mode & 49152) === 49152
    },
    flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    },
    modeStringToFlags: function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    },
    flagsToPermissionString: function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    },
    nodePermissions: function(node, perms) {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return 13
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return 13
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return 13
        }
        return 0
    },
    mayLookup: function(dir) {
        var err = FS.nodePermissions(dir, "x");
        if (err)
            return err;
        if (!dir.node_ops.lookup)
            return 13;
        return 0
    },
    mayCreate: function(dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return 17
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    },
    mayDelete: function(dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var err = FS.nodePermissions(dir, "wx");
        if (err) {
            return err
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 20
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 16
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 21
            }
        }
        return 0
    },
    mayOpen: function(node, flags) {
        if (!node) {
            return 2
        }
        if (FS.isLink(node.mode)) {
            return 40
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 21
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(24)
    },
    getStream: function(fd) {
        return FS.streams[fd]
    },
    createStream: function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = function() {}
            ;
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(val) {
                        this.node = val
                    }
                },
                isRead: {
                    get: function() {
                        return (this.flags & 2097155) !== 1
                    }
                },
                isWrite: {
                    get: function() {
                        return (this.flags & 2097155) !== 0
                    }
                },
                isAppend: {
                    get: function() {
                        return this.flags & 1024
                    }
                }
            })
        }
        var newStream = new FS.FSStream;
        for (var p in stream) {
            newStream[p] = stream[p]
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    },
    closeStream: function(fd) {
        FS.streams[fd] = null
    },
    chrdev_stream_ops: {
        open: function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        },
        llseek: function() {
            throw new FS.ErrnoError(29)
        }
    },
    major: function(dev) {
        return dev >> 8
    },
    minor: function(dev) {
        return dev & 255
    },
    makedev: function(ma, mi) {
        return ma << 8 | mi
    },
    registerDevice: function(dev, ops) {
        FS.devices[dev] = {
            stream_ops: ops
        }
    },
    getDevice: function(dev) {
        return FS.devices[dev]
    },
    getMounts: function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    },
    syncfs: function(populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(err) {
            FS.syncFSRequests--;
            return callback(err)
        }
        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(err)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach(function(mount) {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        })
    },
    mount: function(type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(16)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(16)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(20)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    },
    unmount: function(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(22)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current)
                }
                current = next
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1)
    },
    lookup: function(parent, name) {
        return parent.node_ops.lookup(parent, name)
    },
    mknod: function(path, mode, dev) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(22)
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(1)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    },
    create: function(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    },
    mkdir: function(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    },
    mkdirTree: function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i])
                continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != 17)
                    throw e
            }
        }
    },
    mkdev: function(path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    },
    symlink: function(oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
            throw new FS.ErrnoError(2)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(2)
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(1)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    },
    rename: function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, {
                parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
                parent: true
            });
            new_dir = lookup.node
        } catch (e) {
            throw new FS.ErrnoError(16)
        }
        if (!old_dir || !new_dir)
            throw new FS.ErrnoError(2);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(18)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(22)
        }
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(39)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(1)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(16)
        }
        if (new_dir !== old_dir) {
            err = FS.nodePermissions(old_dir, "w");
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
        try {
            if (FS.trackingDelegate["onMovePath"])
                FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
            console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
    },
    rmdir: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(1)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(16)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(20)
        }
        return node.node_ops.readdir(node)
    },
    unlink: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(1)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(16)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readlink: function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(2)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(22)
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    },
    stat: function(path, dontFollow) {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(2)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(1)
        }
        return node.node_ops.getattr(node)
    },
    lstat: function(path) {
        return FS.stat(path, true)
    },
    chmod: function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    },
    lchmod: function(path, mode) {
        FS.chmod(path, mode, true)
    },
    fchmod: function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(9)
        }
        FS.chmod(stream.node, mode)
    },
    chown: function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    },
    lchown: function(path, uid, gid) {
        FS.chown(path, uid, gid, true)
    },
    fchown: function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(9)
        }
        FS.chown(stream.node, uid, gid)
    },
    truncate: function(path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(22)
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(21)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(22)
        }
        var err = FS.nodePermissions(node, "w");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    },
    ftruncate: function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(9)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(22)
        }
        FS.truncate(stream.node, len)
    },
    utime: function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    },
    open: function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(2)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path === "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(17)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(2)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(20)
        }
        if (!created) {
            var err = FS.mayOpen(node, flags);
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        }, fd_start, fd_end);
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles)
                FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                console.log("FS.trackingDelegate error on read file: " + path)
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
        }
        return stream
    },
    close: function(stream) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9)
        }
        if (stream.getdents)
            stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    },
    isClosed: function(stream) {
        return stream.fd === null
    },
    llseek: function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(29)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(22)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    },
    read: function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(22)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(9)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(21)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(22)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(29)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking)
            stream.position += bytesRead;
        return bytesRead
    },
    write: function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(22)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(9)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(21)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(22)
        }
        if (stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(29)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking)
            stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"])
                FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
            console.log("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message)
        }
        return bytesWritten
    },
    allocate: function(stream, offset, length) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(22)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(9)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(19)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(95)
        }
        stream.stream_ops.allocate(stream, offset, length)
    },
    mmap: function(stream, buffer, offset, length, position, prot, flags) {
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(13)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(19)
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    },
    munmap: function(stream) {
        return 0
    },
    ioctl: function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(25)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    },
    readFile: function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    },
    writeFile: function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    },
    cwd: function() {
        return FS.currentPath
    },
    chdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(2)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(20)
        }
        var err = FS.nodePermissions(lookup.node, "x");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        FS.currentPath = lookup.path
    },
    createDefaultDirectories: function() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    },
    createDefaultDevices: function() {
//        return; // if we take this out then maybe can enable fsinit
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: function() {
                return 0
            },
            write: function(stream, buffer, offset, length, pos) {
                return length
            }
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
            var randomBuffer = new Uint8Array(1);
            random_device = function() {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0]
            }
        } else if (ENVIRONMENT_IS_NODE) {
            try {
                var crypto_module = require("crypto");
                random_device = function() {
                    return crypto_module["randomBytes"](1)[0]
                }
            } catch (e) {}
        } else {}
        if (!random_device) {
            random_device = function() {
                abort("random_device")
            }
        }
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: function() {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: function() {
                var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: function(parent, name) {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream)
                            throw new FS.ErrnoError(9);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: function() {
                                    return stream.path
                                }
                            }
                        };
                        ret.parent = ret;
                        return ret
                    }
                };
                return node
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: function() {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", "r");
        var stdout = FS.open("/dev/stdout", "w");
        var stderr = FS.open("/dev/stderr", "w")
    },
    ensureErrnoError: function() {
        if (FS.ErrnoError)
            return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function(errno) {
                this.errno = errno
            }
            ;
            this.setErrno(errno);
            this.message = "FS error";
            if (this.stack)
                Object.defineProperty(this, "stack", {
                    value: (new Error).stack,
                    writable: true
                })
        }
        ;
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [2].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        })
    },
    staticInit: function() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS,
            "IDBFS": IDBFS,
            "NODEFS": NODEFS,
            "WORKERFS": WORKERFS
        }
    },
    init: function(input, output, error) {
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    },
    quit: function() {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush)
            fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    },
    getMode: function(canRead, canWrite) {
        var mode = 0;
        if (canRead)
            mode |= 292 | 73;
        if (canWrite)
            mode |= 146;
        return mode
    },
    joinPath: function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/")
            path = path.substr(1);
        return path
    },
    absolutePath: function(relative, base) {
        return PATH.resolve(base, relative)
    },
    standardizePath: function(path) {
        return PATH.normalize(path)
    },
    findObject: function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object
        } else {
            ___setErrNo(ret.error);
            return null
        }
    },
    analyzePath: function(path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    },
    createFolder: function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode)
    },
    createPath: function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part)
                continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    },
    createFile: function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    },
    createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                    arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    },
    createDevice: function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major)
            FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: function(stream) {
                stream.seekable = false
            },
            close: function(stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            },
            read: function(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(5)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(11)
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            },
            write: function(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(5)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            }
        });
        return FS.mkdev(path, mode, dev)
    },
    createLink: function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path)
    },
    forceLoadFile: function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
            return true;
        var success = true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (Module["read"]) {
            try {
                obj.contents = intArrayFromString(Module["read"](obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                success = false
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
        if (!success)
            ___setErrNo(5);
        return success
    },
    createLazyFile: function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        }
        ;
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        }
        ;
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing)
                chunkSize = datalength;
            var doXHR = function(from, to) {
                if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize)
                    xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                if (typeof Uint8Array != "undefined")
                    xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                } else {
                    return intArrayFromString(xhr.responseText || "", true)
                }
            };
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] === "undefined")
                    throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                console.log("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        }
        ;
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    }
                },
                chunkSize: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    }
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function() {
                    return this.contents.length
                }
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(5)
                }
                return fn.apply(null, arguments)
            }
        });
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(5)
            }
            var contents = stream.node.contents;
            if (position >= contents.length)
                return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        }
        ;
        node.stream_ops = stream_ops;
        return node
    },
    createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);
        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish)
                    preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                }
                if (onload)
                    onload();
                removeRunDependency(dep)
            }
            var handled = false;
            Module["preloadPlugins"].forEach(function(plugin) {
                if (handled)
                    return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, function() {
                        if (onerror)
                            onerror();
                        removeRunDependency(dep)
                    });
                    handled = true
                }
            });
            if (!handled)
                finish(byteArray)
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(url, function(byteArray) {
                processData(byteArray)
            }, onerror)
        } else {
            processData(url)
        }
    },
    indexedDB: function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    },
    DB_NAME: function() {
        return "EM_FS_" + window.location.pathname
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function(paths, onload, onerror) {
        onload = onload || function() {}
        ;
        onerror = onerror || function() {}
        ;
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        }
        ;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0
              , fail = 0
              , total = paths.length;
            function finish() {
                if (fail == 0)
                    onload();
                else
                    onerror()
            }
            paths.forEach(function(path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total)
                        finish()
                }
                ;
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total)
                        finish()
                }
            });
            transaction.onerror = onerror
        }
        ;
        openRequest.onerror = onerror
    },
    loadFilesFromDB: function(paths, onload, onerror) {
        onload = onload || function() {}
        ;
        onerror = onerror || function() {}
        ;
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0
              , fail = 0
              , total = paths.length;
            function finish() {
                if (fail == 0)
                    onload();
                else
                    onerror()
            }
            paths.forEach(function(path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total)
                        finish()
                }
                ;
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total)
                        finish()
                }
            });
            transaction.onerror = onerror
        }
        ;
        openRequest.onerror = onerror
    }
};
var ERRNO_CODES = {
    EPERM: 1,
    ENOENT: 2,
    ESRCH: 3,
    EINTR: 4,
    EIO: 5,
    ENXIO: 6,
    E2BIG: 7,
    ENOEXEC: 8,
    EBADF: 9,
    ECHILD: 10,
    EAGAIN: 11,
    EWOULDBLOCK: 11,
    ENOMEM: 12,
    EACCES: 13,
    EFAULT: 14,
    ENOTBLK: 15,
    EBUSY: 16,
    EEXIST: 17,
    EXDEV: 18,
    ENODEV: 19,
    ENOTDIR: 20,
    EISDIR: 21,
    EINVAL: 22,
    ENFILE: 23,
    EMFILE: 24,
    ENOTTY: 25,
    ETXTBSY: 26,
    EFBIG: 27,
    ENOSPC: 28,
    ESPIPE: 29,
    EROFS: 30,
    EMLINK: 31,
    EPIPE: 32,
    EDOM: 33,
    ERANGE: 34,
    ENOMSG: 42,
    EIDRM: 43,
    ECHRNG: 44,
    EL2NSYNC: 45,
    EL3HLT: 46,
    EL3RST: 47,
    ELNRNG: 48,
    EUNATCH: 49,
    ENOCSI: 50,
    EL2HLT: 51,
    EDEADLK: 35,
    ENOLCK: 37,
    EBADE: 52,
    EBADR: 53,
    EXFULL: 54,
    ENOANO: 55,
    EBADRQC: 56,
    EBADSLT: 57,
    EDEADLOCK: 35,
    EBFONT: 59,
    ENOSTR: 60,
    ENODATA: 61,
    ETIME: 62,
    ENOSR: 63,
    ENONET: 64,
    ENOPKG: 65,
    EREMOTE: 66,
    ENOLINK: 67,
    EADV: 68,
    ESRMNT: 69,
    ECOMM: 70,
    EPROTO: 71,
    EMULTIHOP: 72,
    EDOTDOT: 73,
    EBADMSG: 74,
    ENOTUNIQ: 76,
    EBADFD: 77,
    EREMCHG: 78,
    ELIBACC: 79,
    ELIBBAD: 80,
    ELIBSCN: 81,
    ELIBMAX: 82,
    ELIBEXEC: 83,
    ENOSYS: 38,
    ENOTEMPTY: 39,
    ENAMETOOLONG: 36,
    ELOOP: 40,
    EOPNOTSUPP: 95,
    EPFNOSUPPORT: 96,
    ECONNRESET: 104,
    ENOBUFS: 105,
    EAFNOSUPPORT: 97,
    EPROTOTYPE: 91,
    ENOTSOCK: 88,
    ENOPROTOOPT: 92,
    ESHUTDOWN: 108,
    ECONNREFUSED: 111,
    EADDRINUSE: 98,
    ECONNABORTED: 103,
    ENETUNREACH: 101,
    ENETDOWN: 100,
    ETIMEDOUT: 110,
    EHOSTDOWN: 112,
    EHOSTUNREACH: 113,
    EINPROGRESS: 115,
    EALREADY: 114,
    EDESTADDRREQ: 89,
    EMSGSIZE: 90,
    EPROTONOSUPPORT: 93,
    ESOCKTNOSUPPORT: 94,
    EADDRNOTAVAIL: 99,
    ENETRESET: 102,
    EISCONN: 106,
    ENOTCONN: 107,
    ETOOMANYREFS: 109,
    EUSERS: 87,
    EDQUOT: 122,
    ESTALE: 116,
    ENOTSUP: 95,
    ENOMEDIUM: 123,
    EILSEQ: 84,
    EOVERFLOW: 75,
    ECANCELED: 125,
    ENOTRECOVERABLE: 131,
    EOWNERDEAD: 130,
    ESTRPIPE: 86
};
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    mappings: {},
    umask: 511,
    calculateAt: function(dirfd, path) {
        if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
                dir = FS.cwd()
            } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream)
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                dir = dirstream.path
            }
            path = PATH.join2(dir, path)
        }
        return path
    },
    doStat: function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -ERRNO_CODES.ENOTDIR
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[buf + 40 >> 2] = tempI64[0],
        HEAP32[buf + 44 >> 2] = tempI64[1];
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 76 >> 2] = 0;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[buf + 80 >> 2] = tempI64[0],
        HEAP32[buf + 84 >> 2] = tempI64[1];
        return 0
    },
    doMsync: function(addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags)
    },
    doMkdir: function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/")
            path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    },
    doMknod: function(path, mode, dev) {
        switch (mode & 61440) {
        case 32768:
        case 8192:
        case 24576:
        case 4096:
        case 49152:
            break;
        default:
            return -ERRNO_CODES.EINVAL
        }
        FS.mknod(path, mode, dev);
        return 0
    },
    doReadlink: function(path, buf, bufsize) {
        if (bufsize <= 0)
            return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    },
    doAccess: function(path, amode) {
        if (amode & ~7) {
            return -ERRNO_CODES.EINVAL
        }
        var node;
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        node = lookup.node;
        var perms = "";
        if (amode & 4)
            perms += "r";
        if (amode & 2)
            perms += "w";
        if (amode & 1)
            perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -ERRNO_CODES.EACCES
        }
        return 0
    },
    doDup: function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest)
            FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
    },
    doReadv: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (curr < len)
                break
        }
        return ret
    },
    doWritev: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr
        }
        return ret
    },
    /* replace with standard */
    /*
    varargs: 0,
    get: function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    },
    getStr: function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret
    },
    getStreamFromFD: function() {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream)
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream
    },*/
    varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },getStreamFromFD:function(fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },get64:function(low, high) {
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },

    // end of standard, mono stuff follows
    getSocketFromFD: function() {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket)
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket
    },
    getSocketAddress: function(allowNull) {
        var addrp = SYSCALLS.get()
          , addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0)
            return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno)
            throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info
    },
    get64: function() {
        var low = SYSCALLS.get()
          , high = SYSCALLS.get();
        return low
    },
    getZero: function() {
        SYSCALLS.get()
    }
};
function ___syscall10(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.unlink(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
var SOCKFS = {
    mount: function(mount) {
        Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {};
        Module["websocket"]._callbacks = {};
        Module["websocket"]["on"] = function(event, callback) {
            if ("function" === typeof callback) {
                this._callbacks[event] = callback
            }
            return this
        }
        ;
        Module["websocket"].emit = function(event, param) {
            if ("function" === typeof this._callbacks[event]) {
                this._callbacks[event].call(this, param)
            }
        }
        ;
        return FS.createNode(null, "/", 16384 | 511, 0)
    },
    createSocket: function(family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
            assert(streaming == (protocol == 6))
        }
        var sock = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            error: null,
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
        };
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        var stream = FS.createStream({
            path: name,
            node: node,
            flags: FS.modeStringToFlags("r+"),
            seekable: false,
            stream_ops: SOCKFS.stream_ops
        });
        sock.stream = stream;
        return sock
    },
    getSocket: function(fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
            return null
        }
        return stream.node.sock
    },
    stream_ops: {
        poll: function(stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock)
        },
        ioctl: function(stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs)
        },
        read: function(stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
                return 0
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length
        },
        write: function(stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length)
        },
        close: function(stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock)
        }
    },
    nextname: function() {
        if (!SOCKFS.nextname.current) {
            SOCKFS.nextname.current = 0
        }
        return "socket[" + SOCKFS.nextname.current++ + "]"
    },
    websocket_sock_ops: {
        createPeer: function(sock, addr, port) {
            var ws;
            if (typeof addr === "object") {
                ws = addr;
                addr = null;
                port = null
            }
            if (ws) {
                if (ws._socket) {
                    addr = ws._socket.remoteAddress;
                    port = ws._socket.remotePort
                } else {
                    var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                    if (!result) {
                        throw new Error("WebSocket URL must be in the format ws(s)://address:port")
                    }
                    addr = result[1];
                    port = parseInt(result[2], 10)
                }
            } else {
                try {
                    var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
                    var url = "ws:#".replace("#", "//");
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["url"]) {
                            url = Module["websocket"]["url"]
                        }
                    }
                    if (url === "ws://" || url === "wss://") {
                        var parts = addr.split("/");
                        url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/")
                    }
                    var subProtocols = "binary";
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["subprotocol"]) {
                            subProtocols = Module["websocket"]["subprotocol"]
                        }
                    }
                    subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                    var opts = ENVIRONMENT_IS_NODE ? {
                        "protocol": subProtocols.toString()
                    } : subProtocols;
                    if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
                        subProtocols = "null";
                        opts = undefined
                    }
                    var WebSocketConstructor;
                    if (ENVIRONMENT_IS_NODE) {
                        WebSocketConstructor = require("ws")
                    } else if (ENVIRONMENT_IS_WEB) {
                        WebSocketConstructor = window["WebSocket"]
                    } else {
                        WebSocketConstructor = WebSocket
                    }
                    ws = new WebSocketConstructor(url,opts);
                    ws.binaryType = "arraybuffer"
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)
                }
            }
            var peer = {
                addr: addr,
                port: port,
                socket: ws,
                dgram_send_queue: []
            };
            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
            if (sock.type === 2 && typeof sock.sport !== "undefined") {
                peer.dgram_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255]))
            }
            return peer
        },
        getPeer: function(sock, addr, port) {
            return sock.peers[addr + ":" + port]
        },
        addPeer: function(sock, peer) {
            sock.peers[peer.addr + ":" + peer.port] = peer
        },
        removePeer: function(sock, peer) {
            delete sock.peers[peer.addr + ":" + peer.port]
        },
        handlePeerEvents: function(sock, peer) {
            var first = true;
            var handleOpen = function() {
                Module["websocket"].emit("open", sock.stream.fd);
                try {
                    var queued = peer.dgram_send_queue.shift();
                    while (queued) {
                        peer.socket.send(queued);
                        queued = peer.dgram_send_queue.shift()
                    }
                } catch (e) {
                    peer.socket.close()
                }
            };
            function handleMessage(data) {
                assert(typeof data !== "string" && data.byteLength !== undefined);
                if (data.byteLength == 0) {
                    return
                }
                data = new Uint8Array(data);
                var wasfirst = first;
                first = false;
                if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                    var newport = data[8] << 8 | data[9];
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return
                }
                sock.recv_queue.push({
                    addr: peer.addr,
                    port: peer.port,
                    data: data
                });
                Module["websocket"].emit("message", sock.stream.fd)
            }
            if (ENVIRONMENT_IS_NODE) {
                peer.socket.on("open", handleOpen);
                peer.socket.on("message", function(data, flags) {
                    if (!flags.binary) {
                        return
                    }
                    handleMessage(new Uint8Array(data).buffer)
                });
                peer.socket.on("close", function() {
                    Module["websocket"].emit("close", sock.stream.fd)
                });
                peer.socket.on("error", function(error) {
                    sock.error = ERRNO_CODES.ECONNREFUSED;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                })
            } else {
                peer.socket.onopen = handleOpen;
                peer.socket.onclose = function() {
                    Module["websocket"].emit("close", sock.stream.fd)
                }
                ;
                peer.socket.onmessage = function peer_socket_onmessage(event) {
                    handleMessage(event.data)
                }
                ;
                peer.socket.onerror = function(error) {
                    sock.error = ERRNO_CODES.ECONNREFUSED;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                }
            }
        },
        poll: function(sock) {
            if (sock.type === 1 && sock.server) {
                return sock.pending.length ? 64 | 1 : 0
            }
            var mask = 0;
            var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
            if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                mask |= 64 | 1
            }
            if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                mask |= 4
            }
            if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                mask |= 16
            }
            return mask
        },
        ioctl: function(sock, request, arg) {
            switch (request) {
            case 21531:
                var bytes = 0;
                if (sock.recv_queue.length) {
                    bytes = sock.recv_queue[0].data.length
                }
                HEAP32[arg >> 2] = bytes;
                return 0;
            default:
                return ERRNO_CODES.EINVAL
            }
        },
        close: function(sock) {
            if (sock.server) {
                try {
                    sock.server.close()
                } catch (e) {}
                sock.server = null
            }
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
                var peer = sock.peers[peers[i]];
                try {
                    peer.socket.close()
                } catch (e) {}
                SOCKFS.websocket_sock_ops.removePeer(sock, peer)
            }
            return 0
        },
        bind: function(sock, addr, port) {
            if (typeof sock.saddr !== "undefined" || typeof sock.sport !== "undefined") {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            sock.saddr = addr;
            sock.sport = port;
            if (sock.type === 2) {
                if (sock.server) {
                    sock.server.close();
                    sock.server = null
                }
                try {
                    sock.sock_ops.listen(sock, 0)
                } catch (e) {
                    if (!(e instanceof FS.ErrnoError))
                        throw e;
                    if (e.errno !== ERRNO_CODES.EOPNOTSUPP)
                        throw e
                }
            }
        },
        connect: function(sock, addr, port) {
            if (sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
            }
            if (typeof sock.daddr !== "undefined" && typeof sock.dport !== "undefined") {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                if (dest) {
                    if (dest.socket.readyState === dest.socket.CONNECTING) {
                        throw new FS.ErrnoError(ERRNO_CODES.EALREADY)
                    } else {
                        throw new FS.ErrnoError(ERRNO_CODES.EISCONN)
                    }
                }
            }
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;
            throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)
        },
        listen: function(sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
                throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
            }
            if (sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            var WebSocketServer = require("ws").Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
                host: host,
                port: sock.sport
            });
            Module["websocket"].emit("listen", sock.stream.fd);
            sock.server.on("connection", function(ws) {
                if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;
                    sock.pending.push(newsock);
                    Module["websocket"].emit("connection", newsock.stream.fd)
                } else {
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    Module["websocket"].emit("connection", sock.stream.fd)
                }
            });
            sock.server.on("closed", function() {
                Module["websocket"].emit("close", sock.stream.fd);
                sock.server = null
            });
            sock.server.on("error", function(error) {
                sock.error = ERRNO_CODES.EHOSTUNREACH;
                Module["websocket"].emit("error", [sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable"])
            })
        },
        accept: function(listensock) {
            if (!listensock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock
        },
        getname: function(sock, peer) {
            var addr, port;
            if (peer) {
                if (sock.daddr === undefined || sock.dport === undefined) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                }
                addr = sock.daddr;
                port = sock.dport
            } else {
                addr = sock.saddr || 0;
                port = sock.sport || 0
            }
            return {
                addr: addr,
                port: port
            }
        },
        sendmsg: function(sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
                if (addr === undefined || port === undefined) {
                    addr = sock.daddr;
                    port = sock.dport
                }
                if (addr === undefined || port === undefined) {
                    throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)
                }
            } else {
                addr = sock.daddr;
                port = sock.dport
            }
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
            if (sock.type === 1) {
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
            }
            if (ArrayBuffer.isView(buffer)) {
                offset += buffer.byteOffset;
                buffer = buffer.buffer
            }
            var data;
            data = buffer.slice(offset, offset + length);
            if (sock.type === 2) {
                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port)
                    }
                    dest.dgram_send_queue.push(data);
                    return length
                }
            }
            try {
                dest.socket.send(data);
                return length
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
        },
        recvmsg: function(sock, length) {
            if (sock.type === 1 && sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
            }
            var queued = sock.recv_queue.shift();
            if (!queued) {
                if (sock.type === 1) {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                    if (!dest) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                    } else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        return null
                    } else {
                        throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                    }
                } else {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
            }
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
                buffer: new Uint8Array(queuedBuffer,queuedOffset,bytesRead),
                addr: queued.addr,
                port: queued.port
            };
            if (sock.type === 1 && bytesRead < queuedLength) {
                var bytesRemaining = queuedLength - bytesRead;
                queued.data = new Uint8Array(queuedBuffer,queuedOffset + bytesRead,bytesRemaining);
                sock.recv_queue.unshift(queued)
            }
            return res
        }
    }
};
function __inet_pton4_raw(str) {
    var b = str.split(".");
    for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp))
            return null;
        b[i] = tmp
    }
    return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0
}
function __inet_pton6_raw(str) {
    var words;
    var w, offset, z;
    var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
    var parts = [];
    if (!valid6regx.test(str)) {
        return null
    }
    if (str === "::") {
        return [0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (str.indexOf("::") === 0) {
        str = str.replace("::", "Z:")
    } else {
        str = str.replace("::", ":Z:")
    }
    if (str.indexOf(".") > 0) {
        str = str.replace(new RegExp("[.]","g"), ":");
        words = str.split(":");
        words[words.length - 4] = parseInt(words[words.length - 4]) + parseInt(words[words.length - 3]) * 256;
        words[words.length - 3] = parseInt(words[words.length - 2]) + parseInt(words[words.length - 1]) * 256;
        words = words.slice(0, words.length - 2)
    } else {
        words = str.split(":")
    }
    offset = 0;
    z = 0;
    for (w = 0; w < words.length; w++) {
        if (typeof words[w] === "string") {
            if (words[w] === "Z") {
                for (z = 0; z < 8 - words.length + 1; z++) {
                    parts[w + z] = 0
                }
                offset = z - 1
            } else {
                parts[w + offset] = _htons(parseInt(words[w], 16))
            }
        } else {
            parts[w + offset] = words[w]
        }
    }
    return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]]
}
var DNS = {
    address_map: {
        id: 1,
        addrs: {},
        names: {}
    },
    lookup_name: function(name) {
        var res = __inet_pton4_raw(name);
        if (res !== null) {
            return name
        }
        res = __inet_pton6_raw(name);
        if (res !== null) {
            return name
        }
        var addr;
        if (DNS.address_map.addrs[name]) {
            addr = DNS.address_map.addrs[name]
        } else {
            var id = DNS.address_map.id++;
            assert(id < 65535, "exceeded max address mappings of 65535");
            addr = "172.29." + (id & 255) + "." + (id & 65280);
            DNS.address_map.names[addr] = name;
            DNS.address_map.addrs[name] = addr
        }
        return addr
    },
    lookup_addr: function(addr) {
        if (DNS.address_map.names[addr]) {
            return DNS.address_map.names[addr]
        }
        return null
    }
};
function __inet_ntop4_raw(addr) {
    return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255)
}
function __inet_ntop6_raw(ints) {
    var str = "";
    var word = 0;
    var longest = 0;
    var lastzero = 0;
    var zstart = 0;
    var len = 0;
    var i = 0;
    var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16];
    var hasipv4 = true;
    var v4part = "";
    for (i = 0; i < 5; i++) {
        if (parts[i] !== 0) {
            hasipv4 = false;
            break
        }
    }
    if (hasipv4) {
        v4part = __inet_ntop4_raw(parts[6] | parts[7] << 16);
        if (parts[5] === -1) {
            str = "::ffff:";
            str += v4part;
            return str
        }
        if (parts[5] === 0) {
            str = "::";
            if (v4part === "0.0.0.0")
                v4part = "";
            if (v4part === "0.0.0.1")
                v4part = "1";
            str += v4part;
            return str
        }
    }
    for (word = 0; word < 8; word++) {
        if (parts[word] === 0) {
            if (word - lastzero > 1) {
                len = 0
            }
            lastzero = word;
            len++
        }
        if (len > longest) {
            longest = len;
            zstart = word - longest + 1
        }
    }
    for (word = 0; word < 8; word++) {
        if (longest > 1) {
            if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                if (word === zstart) {
                    str += ":";
                    if (zstart === 0)
                        str += ":"
                }
                continue
            }
        }
        str += Number(_ntohs(parts[word] & 65535)).toString(16);
        str += word < 7 ? ":" : ""
    }
    return str
}
function __read_sockaddr(sa, salen) {
    var family = HEAP16[sa >> 1];
    var port = _ntohs(HEAP16[sa + 2 >> 1]);
    var addr;
    switch (family) {
    case 2:
        if (salen !== 16) {
            return {
                errno: 22
            }
        }
        addr = HEAP32[sa + 4 >> 2];
        addr = __inet_ntop4_raw(addr);
        break;
    case 10:
        if (salen !== 28) {
            return {
                errno: 22
            }
        }
        addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
        addr = __inet_ntop6_raw(addr);
        break;
    default:
        return {
            errno: 97
        }
    }
    return {
        family: family,
        addr: addr,
        port: port
    }
}
function __write_sockaddr(sa, family, addr, port) {
    switch (family) {
    case 2:
        addr = __inet_pton4_raw(addr);
        HEAP16[sa >> 1] = family;
        HEAP32[sa + 4 >> 2] = addr;
        HEAP16[sa + 2 >> 1] = _htons(port);
        break;
    case 10:
        addr = __inet_pton6_raw(addr);
        HEAP32[sa >> 2] = family;
        HEAP32[sa + 8 >> 2] = addr[0];
        HEAP32[sa + 12 >> 2] = addr[1];
        HEAP32[sa + 16 >> 2] = addr[2];
        HEAP32[sa + 20 >> 2] = addr[3];
        HEAP16[sa + 2 >> 1] = _htons(port);
        HEAP32[sa + 4 >> 2] = 0;
        HEAP32[sa + 24 >> 2] = 0;
        break;
    default:
        return {
            errno: 97
        }
    }
    return {}
}
function ___syscall102(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var call = SYSCALLS.get()
          , socketvararg = SYSCALLS.get();
        SYSCALLS.varargs = socketvararg;
        switch (call) {
        case 1:
            {
                var domain = SYSCALLS.get()
                  , type = SYSCALLS.get()
                  , protocol = SYSCALLS.get();
                var sock = SOCKFS.createSocket(domain, type, protocol);
                return sock.stream.fd
            }
        case 2:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , info = SYSCALLS.getSocketAddress();
                sock.sock_ops.bind(sock, info.addr, info.port);
                return 0
            }
        case 3:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , info = SYSCALLS.getSocketAddress();
                sock.sock_ops.connect(sock, info.addr, info.port);
                return 0
            }
        case 4:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , backlog = SYSCALLS.get();
                sock.sock_ops.listen(sock, backlog);
                return 0
            }
        case 5:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , addr = SYSCALLS.get()
                  , addrlen = SYSCALLS.get();
                var newsock = sock.sock_ops.accept(sock);
                if (addr) {
                    var res = __write_sockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport)
                }
                return newsock.stream.fd
            }
        case 6:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , addr = SYSCALLS.get()
                  , addrlen = SYSCALLS.get();
                var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport);
                return 0
            }
        case 7:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , addr = SYSCALLS.get()
                  , addrlen = SYSCALLS.get();
                if (!sock.daddr) {
                    return -ERRNO_CODES.ENOTCONN
                }
                var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport);
                return 0
            }
        case 11:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , message = SYSCALLS.get()
                  , length = SYSCALLS.get()
                  , flags = SYSCALLS.get()
                  , dest = SYSCALLS.getSocketAddress(true);
                if (!dest) {
                    return FS.write(sock.stream, HEAP8, message, length)
                } else {
                    return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port)
                }
            }
        case 12:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , buf = SYSCALLS.get()
                  , len = SYSCALLS.get()
                  , flags = SYSCALLS.get()
                  , addr = SYSCALLS.get()
                  , addrlen = SYSCALLS.get();
                var msg = sock.sock_ops.recvmsg(sock, len);
                if (!msg)
                    return 0;
                if (addr) {
                    var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port)
                }
                HEAPU8.set(msg.buffer, buf);
                return msg.buffer.byteLength
            }
        case 14:
            {
                return -ERRNO_CODES.ENOPROTOOPT
            }
        case 15:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , level = SYSCALLS.get()
                  , optname = SYSCALLS.get()
                  , optval = SYSCALLS.get()
                  , optlen = SYSCALLS.get();
                if (level === 1) {
                    if (optname === 4) {
                        HEAP32[optval >> 2] = sock.error;
                        HEAP32[optlen >> 2] = 4;
                        sock.error = null;
                        return 0
                    }
                }
                return -ERRNO_CODES.ENOPROTOOPT
            }
        case 16:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , message = SYSCALLS.get()
                  , flags = SYSCALLS.get();
                var iov = HEAP32[message + 8 >> 2];
                var num = HEAP32[message + 12 >> 2];
                var addr, port;
                var name = HEAP32[message >> 2];
                var namelen = HEAP32[message + 4 >> 2];
                if (name) {
                    var info = __read_sockaddr(name, namelen);
                    if (info.errno)
                        return -info.errno;
                    port = info.port;
                    addr = DNS.lookup_addr(info.addr) || info.addr
                }
                var total = 0;
                for (var i = 0; i < num; i++) {
                    total += HEAP32[iov + (8 * i + 4) >> 2]
                }
                var view = new Uint8Array(total);
                var offset = 0;
                for (var i = 0; i < num; i++) {
                    var iovbase = HEAP32[iov + (8 * i + 0) >> 2];
                    var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
                    for (var j = 0; j < iovlen; j++) {
                        view[offset++] = HEAP8[iovbase + j >> 0]
                    }
                }
                return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port)
            }
        case 17:
            {
                var sock = SYSCALLS.getSocketFromFD()
                  , message = SYSCALLS.get()
                  , flags = SYSCALLS.get();
                var iov = HEAP32[message + 8 >> 2];
                var num = HEAP32[message + 12 >> 2];
                var total = 0;
                for (var i = 0; i < num; i++) {
                    total += HEAP32[iov + (8 * i + 4) >> 2]
                }
                var msg = sock.sock_ops.recvmsg(sock, total);
                if (!msg)
                    return 0;
                var name = HEAP32[message >> 2];
                if (name) {
                    var res = __write_sockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port)
                }
                var bytesRead = 0;
                var bytesRemaining = msg.buffer.byteLength;
                for (var i = 0; bytesRemaining > 0 && i < num; i++) {
                    var iovbase = HEAP32[iov + (8 * i + 0) >> 2];
                    var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
                    if (!iovlen) {
                        continue
                    }
                    var length = Math.min(iovlen, bytesRemaining);
                    var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
                    HEAPU8.set(buf, iovbase + bytesRead);
                    bytesRead += length;
                    bytesRemaining -= length
                }
                return bytesRead
            }
        default:
            abort("unsupported socketcall syscall " + call)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall118(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD();
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall12(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.chdir(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall122(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var buf = SYSCALLS.get();
        if (!buf)
            return -ERRNO_CODES.EFAULT;
        var layout = {
            "sysname": 0,
            "nodename": 65,
            "domainname": 325,
            "machine": 260,
            "version": 195,
            "release": 130,
            "__size__": 390
        };
        var copyString = function(element, value) {
            var offset = layout[element];
            writeAsciiToMemory(value, buf + offset)
        };
        copyString("sysname", "Emscripten");
        copyString("nodename", "emscripten");
        copyString("release", "1.0");
        copyString("version", "#1");
        copyString("machine", "x86-JS");
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall140(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , offset_high = SYSCALLS.get()
          , offset_low = SYSCALLS.get()
          , result = SYSCALLS.get()
          , whence = SYSCALLS.get();
        if (!(offset_high == -1 && offset_low < 0) && !(offset_high == 0 && offset_low >= 0)) {
            return -ERRNO_CODES.EOVERFLOW
        }
        var offset = offset_low;
        FS.llseek(stream, offset, whence);
        tempI64 = [stream.position >>> 0, (tempDouble = stream.position,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[result >> 2] = tempI64[0],
        HEAP32[result + 4 >> 2] = tempI64[1];
        if (stream.getdents && offset === 0 && whence === 0)
            stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall142(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var nfds = SYSCALLS.get()
          , readfds = SYSCALLS.get()
          , writefds = SYSCALLS.get()
          , exceptfds = SYSCALLS.get()
          , timeout = SYSCALLS.get();
        var total = 0;
        var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0
          , srcReadHigh = readfds ? HEAP32[readfds + 4 >> 2] : 0;
        var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0
          , srcWriteHigh = writefds ? HEAP32[writefds + 4 >> 2] : 0;
        var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0
          , srcExceptHigh = exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0;
        var dstReadLow = 0
          , dstReadHigh = 0;
        var dstWriteLow = 0
          , dstWriteHigh = 0;
        var dstExceptLow = 0
          , dstExceptHigh = 0;
        var allLow = (readfds ? HEAP32[readfds >> 2] : 0) | (writefds ? HEAP32[writefds >> 2] : 0) | (exceptfds ? HEAP32[exceptfds >> 2] : 0);
        var allHigh = (readfds ? HEAP32[readfds + 4 >> 2] : 0) | (writefds ? HEAP32[writefds + 4 >> 2] : 0) | (exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0);
        var check = function(fd, low, high, val) {
            return fd < 32 ? low & val : high & val
        };
        for (var fd = 0; fd < nfds; fd++) {
            var mask = 1 << fd % 32;
            if (!check(fd, allLow, allHigh, mask)) {
                continue
            }
            var stream = FS.getStream(fd);
            if (!stream)
                throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            var flags = SYSCALLS.DEFAULT_POLLMASK;
            if (stream.stream_ops.poll) {
                flags = stream.stream_ops.poll(stream)
            }
            if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
                fd < 32 ? dstReadLow = dstReadLow | mask : dstReadHigh = dstReadHigh | mask;
                total++
            }
            if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
                fd < 32 ? dstWriteLow = dstWriteLow | mask : dstWriteHigh = dstWriteHigh | mask;
                total++
            }
            if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
                fd < 32 ? dstExceptLow = dstExceptLow | mask : dstExceptHigh = dstExceptHigh | mask;
                total++
            }
        }
        if (readfds) {
            HEAP32[readfds >> 2] = dstReadLow;
            HEAP32[readfds + 4 >> 2] = dstReadHigh
        }
        if (writefds) {
            HEAP32[writefds >> 2] = dstWriteLow;
            HEAP32[writefds + 4 >> 2] = dstWriteHigh
        }
        if (exceptfds) {
            HEAP32[exceptfds >> 2] = dstExceptLow;
            HEAP32[exceptfds + 4 >> 2] = dstExceptHigh
        }
        return total
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall144(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get()
          , len = SYSCALLS.get()
          , flags = SYSCALLS.get();
        var info = SYSCALLS.mappings[addr];
        if (!info)
            return 0;
        SYSCALLS.doMsync(addr, FS.getStream(info.fd), len, info.flags);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall145(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , iov = SYSCALLS.get()
          , iovcnt = SYSCALLS.get();
        return SYSCALLS.doReadv(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall146(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , iov = SYSCALLS.get()
          , iovcnt = SYSCALLS.get();
        return SYSCALLS.doWritev(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall15(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , mode = SYSCALLS.get();
        FS.chmod(path, mode);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall168(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var fds = SYSCALLS.get()
          , nfds = SYSCALLS.get()
          , timeout = SYSCALLS.get();
        var nonzero = 0;
        for (var i = 0; i < nfds; i++) {
            var pollfd = fds + 8 * i;
            var fd = HEAP32[pollfd >> 2];
            var events = HEAP16[pollfd + 4 >> 1];
            var mask = 32;
            var stream = FS.getStream(fd);
            if (stream) {
                mask = SYSCALLS.DEFAULT_POLLMASK;
                if (stream.stream_ops.poll) {
                    mask = stream.stream_ops.poll(stream)
                }
            }
            mask &= events | 8 | 16;
            if (mask)
                nonzero++;
            HEAP16[pollfd + 6 >> 1] = mask
        }
        return nonzero
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall183(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var buf = SYSCALLS.get()
          , size = SYSCALLS.get();
        if (size === 0)
            return -ERRNO_CODES.EINVAL;
        var cwd = FS.cwd();
        var cwdLengthInBytes = lengthBytesUTF8(cwd);
        if (size < cwdLengthInBytes + 1)
            return -ERRNO_CODES.ERANGE;
        stringToUTF8(cwd, buf, size);
        return buf
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall192(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get()
          , len = SYSCALLS.get()
          , prot = SYSCALLS.get()
          , flags = SYSCALLS.get()
          , fd = SYSCALLS.get()
          , off = SYSCALLS.get();
        off <<= 12;
        var ptr;
        var allocated = false;
        if (fd === -1) {
            ptr = _memalign(PAGE_SIZE, len);
            if (!ptr)
                return -ERRNO_CODES.ENOMEM;
            _memset(ptr, 0, len);
            allocated = true
        } else {
            var info = FS.getStream(fd);
            if (!info)
                return -ERRNO_CODES.EBADF;
            var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
            ptr = res.ptr;
            allocated = res.allocated
        }
        SYSCALLS.mappings[ptr] = {
            malloc: ptr,
            len: len,
            allocated: allocated,
            fd: fd,
            flags: flags
        };
        return ptr
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall194(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var fd = SYSCALLS.get()
          , zero = SYSCALLS.getZero()
          , length = SYSCALLS.get64();
        FS.ftruncate(fd, length);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall195(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall196(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.lstat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall197(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, stream.path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall202(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall199(a0, a1) {
    return ___syscall202(a0, a1)
}
var PROCINFO = {
    ppid: 1,
    pid: 42,
    sid: 42,
    pgid: 42
};
function ___syscall20(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return PROCINFO.pid
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall201(a0, a1) {
    return ___syscall202(a0, a1)
}
function ___syscall211(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var ruid = SYSCALLS.get()
          , euid = SYSCALLS.get()
          , suid = SYSCALLS.get();
        HEAP32[ruid >> 2] = 0;
        HEAP32[euid >> 2] = 0;
        HEAP32[suid >> 2] = 0;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall209(a0, a1) {
    return ___syscall211(a0, a1)
}
function ___syscall220(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , dirp = SYSCALLS.get()
          , count = SYSCALLS.get();
        if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path)
        }
        var pos = 0;
        while (stream.getdents.length > 0 && pos + 280 <= count) {
            var id;
            var type;
            var name = stream.getdents.pop();
            if (name[0] === ".") {
                id = 1;
                type = 4
            } else {
                var child = FS.lookupNode(stream.node, name);
                id = child.id;
                type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
            }
            tempI64 = [id >>> 0, (tempDouble = id,
            +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
            HEAP32[dirp + pos >> 2] = tempI64[0],
            HEAP32[dirp + pos + 4 >> 2] = tempI64[1];
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position,
            +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
            HEAP32[dirp + pos + 8 >> 2] = tempI64[0],
            HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
            HEAP16[dirp + pos + 16 >> 1] = 280;
            HEAP8[dirp + pos + 18 >> 0] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += 280
        }
        return pos
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall221(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , cmd = SYSCALLS.get();
        switch (cmd) {
        case 0:
            {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                    return -ERRNO_CODES.EINVAL
                }
                var newStream;
                newStream = FS.open(stream.path, stream.flags, 0, arg);
                return newStream.fd
            }
        case 1:
        case 2:
            return 0;
        case 3:
            return stream.flags;
        case 4:
            {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0
            }
        case 12:
            {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0
            }
        case 13:
        case 14:
            return 0;
        case 16:
        case 8:
            return -ERRNO_CODES.EINVAL;
        case 9:
            ___setErrNo(ERRNO_CODES.EINVAL);
            return -1;
        default:
            {
                return -ERRNO_CODES.EINVAL
            }
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall268(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , size = SYSCALLS.get()
          , buf = SYSCALLS.get();
        HEAP32[buf + 4 >> 2] = 4096;
        HEAP32[buf + 40 >> 2] = 4096;
        HEAP32[buf + 8 >> 2] = 1e6;
        HEAP32[buf + 12 >> 2] = 5e5;
        HEAP32[buf + 16 >> 2] = 5e5;
        HEAP32[buf + 20 >> 2] = FS.nextInode;
        HEAP32[buf + 24 >> 2] = 1e6;
        HEAP32[buf + 28 >> 2] = 42;
        HEAP32[buf + 44 >> 2] = 2;
        HEAP32[buf + 36 >> 2] = 255;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall272(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall3(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , buf = SYSCALLS.get()
          , count = SYSCALLS.get();
        return FS.read(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall320(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var dirfd = SYSCALLS.get()
          , path = SYSCALLS.getStr()
          , times = SYSCALLS.get()
          , flags = SYSCALLS.get();
        path = SYSCALLS.calculateAt(dirfd, path);
        var seconds = HEAP32[times >> 2];
        var nanoseconds = HEAP32[times + 4 >> 2];
        var atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
        times += 8;
        seconds = HEAP32[times >> 2];
        nanoseconds = HEAP32[times + 4 >> 2];
        var mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
        FS.utime(path, atime, mtime);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall33(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , amode = SYSCALLS.get();
        return SYSCALLS.doAccess(path, amode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall38(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old_path = SYSCALLS.getStr()
          , new_path = SYSCALLS.getStr();
        FS.rename(old_path, new_path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall39(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , mode = SYSCALLS.get();
        return SYSCALLS.doMkdir(path, mode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall4(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , buf = SYSCALLS.get()
          , count = SYSCALLS.get();
        return FS.write(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall40(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.rmdir(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall41(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old = SYSCALLS.getStreamFromFD();
        return FS.open(old.path, old.flags, 0).fd
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
var PIPEFS = {
    BUCKET_BUFFER_SIZE: 8192,
    mount: function(mount) {
        return FS.createNode(null, "/", 16384 | 511, 0)
    },
    createPipe: function() {
        var pipe = {
            buckets: []
        };
        pipe.buckets.push({
            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
            offset: 0,
            roffset: 0
        });
        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
        rNode.pipe = pipe;
        wNode.pipe = pipe;
        var readableStream = FS.createStream({
            path: rName,
            node: rNode,
            flags: FS.modeStringToFlags("r"),
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;
        var writableStream = FS.createStream({
            path: wName,
            node: wNode,
            flags: FS.modeStringToFlags("w"),
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;
        return {
            readable_fd: readableStream.fd,
            writable_fd: writableStream.fd
        }
    },
    stream_ops: {
        poll: function(stream) {
            var pipe = stream.node.pipe;
            if ((stream.flags & 2097155) === 1) {
                return 256 | 4
            } else {
                if (pipe.buckets.length > 0) {
                    for (var i = 0; i < pipe.buckets.length; i++) {
                        var bucket = pipe.buckets[i];
                        if (bucket.offset - bucket.roffset > 0) {
                            return 64 | 1
                        }
                    }
                }
            }
            return 0
        },
        ioctl: function(stream, request, varargs) {
            return ERRNO_CODES.EINVAL
        },
        read: function(stream, buffer, offset, length, position) {
            var pipe = stream.node.pipe;
            var currentLength = 0;
            for (var i = 0; i < pipe.buckets.length; i++) {
                var bucket = pipe.buckets[i];
                currentLength += bucket.offset - bucket.roffset
            }
            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);
            if (length <= 0) {
                return 0
            }
            if (currentLength == 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
            }
            var toRead = Math.min(currentLength, length);
            var totalRead = toRead;
            var toRemove = 0;
            for (var i = 0; i < pipe.buckets.length; i++) {
                var currBucket = pipe.buckets[i];
                var bucketSize = currBucket.offset - currBucket.roffset;
                if (toRead <= bucketSize) {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    if (toRead < bucketSize) {
                        tmpSlice = tmpSlice.subarray(0, toRead);
                        currBucket.roffset += toRead
                    } else {
                        toRemove++
                    }
                    data.set(tmpSlice);
                    break
                } else {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    data.set(tmpSlice);
                    data = data.subarray(tmpSlice.byteLength);
                    toRead -= tmpSlice.byteLength;
                    toRemove++
                }
            }
            if (toRemove && toRemove == pipe.buckets.length) {
                toRemove--;
                pipe.buckets[toRemove].offset = 0;
                pipe.buckets[toRemove].roffset = 0
            }
            pipe.buckets.splice(0, toRemove);
            return totalRead
        },
        write: function(stream, buffer, offset, length, position) {
            var pipe = stream.node.pipe;
            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);
            var dataLen = data.byteLength;
            if (dataLen <= 0) {
                return 0
            }
            var currBucket = null;
            if (pipe.buckets.length == 0) {
                currBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: 0,
                    roffset: 0
                };
                pipe.buckets.push(currBucket)
            } else {
                currBucket = pipe.buckets[pipe.buckets.length - 1]
            }
            assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
            var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
            if (freeBytesInCurrBuffer >= dataLen) {
                currBucket.buffer.set(data, currBucket.offset);
                currBucket.offset += dataLen;
                return dataLen
            } else if (freeBytesInCurrBuffer > 0) {
                currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
                currBucket.offset += freeBytesInCurrBuffer;
                data = data.subarray(freeBytesInCurrBuffer, data.byteLength)
            }
            var numBuckets = data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0;
            var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
            for (var i = 0; i < numBuckets; i++) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: PIPEFS.BUCKET_BUFFER_SIZE,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
                data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength)
            }
            if (remElements > 0) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: data.byteLength,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data)
            }
            return dataLen
        },
        close: function(stream) {
            var pipe = stream.node.pipe;
            pipe.buckets = null
        }
    },
    nextname: function() {
        if (!PIPEFS.nextname.current) {
            PIPEFS.nextname.current = 0
        }
        return "pipe[" + PIPEFS.nextname.current++ + "]"
    }
};
function ___syscall42(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var fdPtr = SYSCALLS.get();
        if (fdPtr == 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EFAULT)
        }
        var res = PIPEFS.createPipe();
        HEAP32[fdPtr >> 2] = res.readable_fd;
        HEAP32[fdPtr + 4 >> 2] = res.writable_fd;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall5(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var pathname = SYSCALLS.getStr()
          , flags = SYSCALLS.get()
          , mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall54(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD()
          , op = SYSCALLS.get();
        switch (op) {
        case 21509:
        case 21505:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                return 0
            }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                return 0
            }
        case 21519:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0
            }
        case 21520:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                return -ERRNO_CODES.EINVAL
            }
        case 21531:
            {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp)
            }
        case 21523:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                return 0
            }
        case 21524:
            {
                if (!stream.tty)
                    return -ERRNO_CODES.ENOTTY;
                return 0
            }
        default:
            abort("bad ioctl syscall " + op)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall6(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD();
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall63(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old = SYSCALLS.getStreamFromFD()
          , suggestFD = SYSCALLS.get();
        if (old.fd === suggestFD)
            return suggestFD;
        return SYSCALLS.doDup(old.path, old.flags, suggestFD)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall77(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var who = SYSCALLS.get()
          , usage = SYSCALLS.get();
        _memset(usage, 0, 136);
        HEAP32[usage >> 2] = 1;
        HEAP32[usage + 4 >> 2] = 2;
        HEAP32[usage + 8 >> 2] = 3;
        HEAP32[usage + 12 >> 2] = 4;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall85(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr()
          , buf = SYSCALLS.get()
          , bufsize = SYSCALLS.get();
        return SYSCALLS.doReadlink(path, buf, bufsize)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall9(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var oldpath = SYSCALLS.get()
          , newpath = SYSCALLS.get();
        return -ERRNO_CODES.EMLINK
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall91(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get()
          , len = SYSCALLS.get();
        var info = SYSCALLS.mappings[addr];
        if (!info)
            return 0;
        if (len === info.len) {
            var stream = FS.getStream(info.fd);
            SYSCALLS.doMsync(addr, stream, len, info.flags);
            FS.munmap(stream);
            SYSCALLS.mappings[addr] = null;
            if (info.allocated) {
                _free(info.malloc)
            }
        }
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall94(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var fd = SYSCALLS.get()
          , mode = SYSCALLS.get();
        FS.fchmod(fd, mode);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall96(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall97(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return -ERRNO_CODES.EPERM
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___unlock() {}
function _exit(status) {
    exit(status)
}
function _abort() {
    Module["abort"]()
}


  var ExceptionInfoAttrs={DESTRUCTOR_OFFSET:0,REFCOUNT_OFFSET:4,TYPE_OFFSET:8,CAUGHT_OFFSET:12,RETHROWN_OFFSET:13,SIZE:16};function ___cxa_allocate_exception(size) {
      // Thrown object is prepended by exception metadata block
      return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
    }

function _atexit(func, arg) {
    __ATEXIT__.unshift({
        func: func,
        arg: arg
    })
}

  function ExceptionInfo(excPtr) {
      this.excPtr = excPtr;
      this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
  
      this.set_type = function(type) {
        HEAP32[(((this.ptr)+(ExceptionInfoAttrs.TYPE_OFFSET))>>2)]=type;
      };
  
      this.get_type = function() {
        return HEAP32[(((this.ptr)+(ExceptionInfoAttrs.TYPE_OFFSET))>>2)];
      };
  
      this.set_destructor = function(destructor) {
        HEAP32[(((this.ptr)+(ExceptionInfoAttrs.DESTRUCTOR_OFFSET))>>2)]=destructor;
      };
  
      this.get_destructor = function() {
        return HEAP32[(((this.ptr)+(ExceptionInfoAttrs.DESTRUCTOR_OFFSET))>>2)];
      };
  
      this.set_refcount = function(refcount) {
        HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=refcount;
      };
  
      this.set_caught = function (caught) {
        caught = caught ? 1 : 0;
        HEAP8[(((this.ptr)+(ExceptionInfoAttrs.CAUGHT_OFFSET))>>0)]=caught;
      };
  
      this.get_caught = function () {
        return HEAP8[(((this.ptr)+(ExceptionInfoAttrs.CAUGHT_OFFSET))>>0)] != 0;
      };
  
      this.set_rethrown = function (rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(((this.ptr)+(ExceptionInfoAttrs.RETHROWN_OFFSET))>>0)]=rethrown;
      };
  
      this.get_rethrown = function () {
        return HEAP8[(((this.ptr)+(ExceptionInfoAttrs.RETHROWN_OFFSET))>>0)] != 0;
      };
  
      // Initialize native structure fields. Should be called once after allocated.
      this.init = function(type, destructor) {
        this.set_type(type);
        this.set_destructor(destructor);
        this.set_refcount(0);
        this.set_caught(false);
        this.set_rethrown(false);
      }
  
      this.add_ref = function() {
        var value = HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)];
        HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=value + 1;
      };
  
      // Returns true if last reference released.
      this.release_ref = function() {
        var prev = HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)];
        HEAP32[(((this.ptr)+(ExceptionInfoAttrs.REFCOUNT_OFFSET))>>2)]=prev - 1;
        assert(prev > 0);
        return prev === 1;
      };
    }function CatchInfo(ptr) {
  
      this.free = function() {
        _free(this.ptr);
        this.ptr = 0;
      };
  
      this.set_base_ptr = function(basePtr) {
        HEAP32[((this.ptr)>>2)]=basePtr;
      };
  
      this.get_base_ptr = function() {
        return HEAP32[((this.ptr)>>2)];
      };
  
      this.set_adjusted_ptr = function(adjustedPtr) {
        var ptrSize = 4;
        HEAP32[(((this.ptr)+(ptrSize))>>2)]=adjustedPtr;
      };
  
      this.get_adjusted_ptr = function() {
        var ptrSize = 4;
        return HEAP32[(((this.ptr)+(ptrSize))>>2)];
      };
  
      // Get pointer which is expected to be received by catch clause in C++ code. It may be adjusted
      // when the pointer is casted to some of the exception object base classes (e.g. when virtual
      // inheritance is used). When a pointer is thrown this method should return the thrown pointer
      // itself.
      this.get_exception_ptr = function() {
        // Work around a fastcomp bug, this code is still included for some reason in a build without
        // exceptions support.
        var isPointer = ___cxa_is_pointer_type(
          this.get_exception_info().get_type());
        if (isPointer) {
          return HEAP32[((this.get_base_ptr())>>2)];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.get_base_ptr();
      };
  
      this.get_exception_info = function() {
        return new ExceptionInfo(this.get_base_ptr());
      };
  
      if (ptr === undefined) {
        this.ptr = _malloc(8);
        this.set_adjusted_ptr(0);
      } else {
        this.ptr = ptr;
      }
    }
  
  var exceptionCaught= [];
  
  function exception_addRef(info) {
      info.add_ref();
    }
  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return __ZSt18uncaught_exceptionv.uncaught_exceptions > 0;
    }function ___cxa_begin_catch(ptr) {
      var catchInfo = new CatchInfo(ptr);
      var info = catchInfo.get_exception_info();
      if (!info.get_caught()) {
        info.set_caught(true);
        __ZSt18uncaught_exceptionv.uncaught_exceptions--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(catchInfo);
      exception_addRef(info);
      return catchInfo.get_exception_ptr();
    }


function _emscripten_get_now_res() {
    if (ENVIRONMENT_IS_NODE) {
        return 1
    } else if (typeof dateNow !== "undefined") {
        return 1e3
    } else if (typeof performance === "object" && performance && typeof performance["now"] === "function") {
        return 1e3
    } else {
        return 1e3 * 1e3
    }
}
function _clock_getres(clk_id, res) {
    var nsec;
    if (clk_id === 0) {
        nsec = 1e3 * 1e3
    } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
        nsec = _emscripten_get_now_res()
    } else {
        ___setErrNo(22);
        return -1
    }
    HEAP32[res >> 2] = nsec / 1e9 | 0;
    HEAP32[res + 4 >> 2] = nsec;
    return 0
}


 var _emscripten_get_now;if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else _emscripten_get_now = function() { return performance.now(); }
  ;
  
  var _emscripten_get_now_is_monotonic=true;;function _clock_gettime(clk_id, tp) {
      // int clock_gettime(clockid_t clk_id, struct timespec *tp);
      var now;
      if (clk_id === 0) {
        now = Date.now();
      } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
        now = _emscripten_get_now();
      } else {
        setErrNo(28);
        return -1;
      }
      HEAP32[((tp)>>2)]=(now/1000)|0; // seconds
      HEAP32[(((tp)+(4))>>2)]=((now % 1000)*1000*1000)|0; // nanoseconds
      return 0;
    }

  
  var DOTNET={_dotnet_get_global:function() {
  			function testGlobal(obj) {
  				obj['___dotnet_global___'] = obj;
  				var success = typeof ___dotnet_global___ === 'object' && obj['___dotnet_global___'] === obj;
  				if (!success) {
  					delete obj['___dotnet_global___'];
  				}
  				return success;
  			}
  			if (typeof ___dotnet_global___ === 'object') {
  				return ___dotnet_global___;
  			}
  			if (typeof global === 'object' && testGlobal(global)) {
  				___dotnet_global___ = global;
  			} else if (typeof window === 'object' && testGlobal(window)) {
  				___dotnet_global___ = window;
  			}
  			if (typeof ___dotnet_global___ === 'object') {
  				return ___dotnet_global___;
  			}
  			throw Error('unable to get DotNet global object.');
  		},conv_string:function (mono_obj) {
  			if (mono_obj == 0)
  				return null;
  
  			if (!this.mono_string_get_utf8)
  				this.mono_string_get_utf8 = Module.cwrap ('mono_wasm_string_get_utf8', 'number', ['number']);
  
  			var raw = this.mono_string_get_utf8 (mono_obj);
  			var res = Module.UTF8ToString (raw);
  			Module._free (raw);
  
  			return res;
  		}}


function _emscripten_get_heap_size() {
    return HEAP8.length
}
function abortOnCannotGrowMemory(requestedSize) {
    abort("OOM")
}
function emscripten_realloc_buffer(size) {
    var PAGE_MULTIPLE = 65536;
    size = alignUp(size, PAGE_MULTIPLE);
    var oldSize = buffer.byteLength;
    try {
        var result = wasmMemory.grow((size - oldSize) / 65536);
        if (result !== (-1 | 0)) {
            buffer = wasmMemory.buffer;
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}
function _fork() {
    ___setErrNo(11);
    return -1
}
function _getaddrinfo(node, service, hint, out) {
    var addr = 0;
    var port = 0;
    var flags = 0;
    var family = 0;
    var type = 0;
    var proto = 0;
    var ai;
    function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var res;
        salen = family === 10 ? 28 : 16;
        addr = family === 10 ? __inet_ntop6_raw(addr) : __inet_ntop4_raw(addr);
        sa = _malloc(salen);
        res = __write_sockaddr(sa, family, addr, port);
        assert(!res.errno);
        ai = _malloc(32);
        HEAP32[ai + 4 >> 2] = family;
        HEAP32[ai + 8 >> 2] = type;
        HEAP32[ai + 12 >> 2] = proto;
        HEAP32[ai + 24 >> 2] = canon;
        HEAP32[ai + 20 >> 2] = sa;
        if (family === 10) {
            HEAP32[ai + 16 >> 2] = 28
        } else {
            HEAP32[ai + 16 >> 2] = 16
        }
        HEAP32[ai + 28 >> 2] = 0;
        return ai
    }
    if (hint) {
        flags = HEAP32[hint >> 2];
        family = HEAP32[hint + 4 >> 2];
        type = HEAP32[hint + 8 >> 2];
        proto = HEAP32[hint + 12 >> 2]
    }
    if (type && !proto) {
        proto = type === 2 ? 17 : 6
    }
    if (!type && proto) {
        type = proto === 17 ? 2 : 1
    }
    if (proto === 0) {
        proto = 6
    }
    if (type === 0) {
        type = 1
    }
    if (!node && !service) {
        return -2
    }
    if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
        return -1
    }
    if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
        return -1
    }
    if (flags & 32) {
        return -2
    }
    if (type !== 0 && type !== 1 && type !== 2) {
        return -7
    }
    if (family !== 0 && family !== 2 && family !== 10) {
        return -6
    }
    if (service) {
        service = UTF8ToString(service);
        port = parseInt(service, 10);
        if (isNaN(port)) {
            if (flags & 1024) {
                return -2
            }
            return -8
        }
    }
    if (!node) {
        if (family === 0) {
            family = 2
        }
        if ((flags & 1) === 0) {
            if (family === 2) {
                addr = _htonl(2130706433)
            } else {
                addr = [0, 0, 0, 1]
            }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAP32[out >> 2] = ai;
        return 0
    }
    node = UTF8ToString(node);
    addr = __inet_pton4_raw(node);
    if (addr !== null) {
        if (family === 0 || family === 2) {
            family = 2
        } else if (family === 10 && flags & 8) {
            addr = [0, 0, _htonl(65535), addr];
            family = 10
        } else {
            return -2
        }
    } else {
        addr = __inet_pton6_raw(node);
        if (addr !== null) {
            if (family === 0 || family === 10) {
                family = 10
            } else {
                return -2
            }
        }
    }
    if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAP32[out >> 2] = ai;
        return 0
    }
    if (flags & 4) {
        return -2
    }
    node = DNS.lookup_name(node);
    addr = __inet_pton4_raw(node);
    if (family === 0) {
        family = 2
    } else if (family === 10) {
        addr = [0, 0, _htonl(65535), addr]
    }
    ai = allocaddrinfo(family, type, proto, null, addr, port);
    HEAP32[out >> 2] = ai;
    return 0
}
function _getenv(name) {
    if (name === 0)
        return 0;
    name = UTF8ToString(name);
    if (!ENV.hasOwnProperty(name))
        return 0;
    if (_getenv.ret)
        _free(_getenv.ret);
    _getenv.ret = allocateUTF8(ENV[name]);
    return _getenv.ret
}
function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
    var info = __read_sockaddr(sa, salen);
    if (info.errno) {
        return -6
    }
    var port = info.port;
    var addr = info.addr;
    var overflowed = false;
    if (node && nodelen) {
        var lookup;
        if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
            if (flags & 8) {
                return -2
            }
        } else {
            addr = lookup
        }
        var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
        if (numBytesWrittenExclNull + 1 >= nodelen) {
            overflowed = true
        }
    }
    if (serv && servlen) {
        port = "" + port;
        var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
        if (numBytesWrittenExclNull + 1 >= servlen) {
            overflowed = true
        }
    }
    if (overflowed) {
        return -12
    }
    return 0
}
var Protocols = {
    list: [],
    map: {}
};
function _setprotoent(stayopen) {
    function allocprotoent(name, proto, aliases) {
        var nameBuf = _malloc(name.length + 1);
        writeAsciiToMemory(name, nameBuf);
        var j = 0;
        var length = aliases.length;
        var aliasListBuf = _malloc((length + 1) * 4);
        for (var i = 0; i < length; i++,
        j += 4) {
            var alias = aliases[i];
            var aliasBuf = _malloc(alias.length + 1);
            writeAsciiToMemory(alias, aliasBuf);
            HEAP32[aliasListBuf + j >> 2] = aliasBuf
        }
        HEAP32[aliasListBuf + j >> 2] = 0;
        var pe = _malloc(12);
        HEAP32[pe >> 2] = nameBuf;
        HEAP32[pe + 4 >> 2] = aliasListBuf;
        HEAP32[pe + 8 >> 2] = proto;
        return pe
    }
    var list = Protocols.list;
    var map = Protocols.map;
    if (list.length === 0) {
        var entry = allocprotoent("tcp", 6, ["TCP"]);
        list.push(entry);
        map["tcp"] = map["6"] = entry;
        entry = allocprotoent("udp", 17, ["UDP"]);
        list.push(entry);
        map["udp"] = map["17"] = entry
    }
    _setprotoent.index = 0
}
function _getprotobyname(name) {
    name = UTF8ToString(name);
    _setprotoent(true);
    var result = Protocols.map[name];
    return result
}
function _getpwuid(uid) {
    return 0
}
function _gettimeofday(ptr) {
    var now = Date.now();
    HEAP32[ptr >> 2] = now / 1e3 | 0;
    HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
    return 0
}
var ___tm_timezone = (stringToUTF8("GMT", 677008, 4),
677008);
function _gmtime_r(time, tmPtr) {
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
    HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
    HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
    HEAP32[tmPtr + 36 >> 2] = 0;
    HEAP32[tmPtr + 32 >> 2] = 0;
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 40 >> 2] = ___tm_timezone;
    return tmPtr
}
function _kill(pid, sig) {
    ___setErrNo(ERRNO_CODES.EPERM);
    return -1
}
function _llvm_log10_f32(x) {
    return Math.log(x) / Math.LN10
}
function _llvm_log10_f64(a0) {
    return _llvm_log10_f32(a0)
}
function _llvm_trap() {
    abort("trap!")
}
var _llvm_trunc_f32 = Math_trunc;
var _llvm_trunc_f64 = Math_trunc;
function _tzset() {
    if (_tzset.called)
        return;
    _tzset.called = true;
    HEAP32[__get_timezone() >> 2] = (new Date).getTimezoneOffset() * 60;
    var winter = new Date(2e3,0,1);
    var summer = new Date(2e3,6,1);
    HEAP32[__get_daylight() >> 2] = Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
    function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT"
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocate(intArrayFromString(winterName), "i8", ALLOC_NORMAL);
    var summerNamePtr = allocate(intArrayFromString(summerName), "i8", ALLOC_NORMAL);
    if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        HEAP32[__get_tzname() >> 2] = winterNamePtr;
        HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr
    } else {
        HEAP32[__get_tzname() >> 2] = summerNamePtr;
        HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr
    }
}
function _localtime_r(time, tmPtr) {
    _tzset();
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var start = new Date(date.getFullYear(),0,1);
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = new Date(2e3,6,1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst;
    var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
    HEAP32[tmPtr + 40 >> 2] = zonePtr;
    return tmPtr
}
function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest)
}
var MONO = {
    pump_count: 0,
    timeout_queue: [],
    mono_wasm_runtime_is_ready: false,
    pump_message: function() {
        if (!this.mono_background_exec)
            this.mono_background_exec = Module.cwrap("mono_background_exec", "void", []);
        while (MONO.timeout_queue.length > 0) {
            --MONO.pump_count;
            MONO.timeout_queue.shift()()
        }
        while (MONO.pump_count > 0) {
            --MONO.pump_count;
            this.mono_background_exec()
        }
    },
    mono_wasm_get_call_stack: function() {
        if (!this.mono_wasm_current_bp_id)
            this.mono_wasm_current_bp_id = Module.cwrap("mono_wasm_current_bp_id", "number", []);
        if (!this.mono_wasm_enum_frames)
            this.mono_wasm_enum_frames = Module.cwrap("mono_wasm_enum_frames", "void", []);
        var bp_id = this.mono_wasm_current_bp_id();
        this.active_frames = [];
        this.mono_wasm_enum_frames();
        var the_frames = this.active_frames;
        this.active_frames = [];
        return {
            "breakpoint_id": bp_id,
            "frames": the_frames
        }
    },
    mono_wasm_get_variables: function(scope, var_list) {
        if (!this.mono_wasm_get_var_info)
            this.mono_wasm_get_var_info = Module.cwrap("mono_wasm_get_var_info", "void", ["number", "number"]);
        this.var_info = [];
        for (var i = 0; i < var_list.length; ++i)
            this.mono_wasm_get_var_info(scope, var_list[i]);
        var res = this.var_info;
        this.var_info = [];
        return res
    },
    mono_wasm_get_object_properties: function(objId) {
        if (!this.mono_wasm_get_object_properties_info)
            this.mono_wasm_get_object_properties_info = Module.cwrap("mono_wasm_get_object_properties", "void", ["number"]);
        this.var_info = [];
        console.log(">> mono_wasm_get_object_properties " + objId);
        this.mono_wasm_get_object_properties_info(objId);
        var res = this.var_info;
        this.var_info = [];
        return res
    },
    mono_wasm_get_array_values: function(objId) {
        if (!this.mono_wasm_get_array_values_info)
            this.mono_wasm_get_array_values_info = Module.cwrap("mono_wasm_get_array_values", "void", ["number"]);
        this.var_info = [];
        console.log(">> mono_wasm_get_array_values " + objId);
        this.mono_wasm_get_array_values_info(objId);
        var res = this.var_info;
        this.var_info = [];
        return res
    },
    mono_wasm_start_single_stepping: function(kind) {
        console.log(">> mono_wasm_start_single_stepping " + kind);
        if (!this.mono_wasm_setup_single_step)
            this.mono_wasm_setup_single_step = Module.cwrap("mono_wasm_setup_single_step", "void", ["number"]);
        this.mono_wasm_setup_single_step(kind)
    },
    mono_wasm_runtime_ready: function() {
        console.log(">>mono_wasm_runtime_ready");
        this.mono_wasm_runtime_is_ready = true;
        // no debugger, stop annoying break
        //debugger
    },
    mono_wasm_set_breakpoint: function(assembly, method_token, il_offset) {
        if (!this.mono_wasm_set_bp)
            this.mono_wasm_set_bp = Module.cwrap("mono_wasm_set_breakpoint", "number", ["string", "number", "number"]);
        return this.mono_wasm_set_bp(assembly, method_token, il_offset)
    },
    mono_wasm_remove_breakpoint: function(breakpoint_id) {
        if (!this.mono_wasm_del_bp)
            this.mono_wasm_del_bp = Module.cwrap("mono_wasm_remove_breakpoint", "number", ["number"]);
        return this.mono_wasm_del_bp(breakpoint_id)
    },
    mono_wasm_setenv: function(name, value) {
        if (!this.wasm_setenv)
            this.wasm_setenv = Module.cwrap("mono_wasm_setenv", "void", ["string", "string"]);
        this.wasm_setenv(name, value)
    },
    mono_wasm_set_runtime_options: function(options) {
        if (!this.wasm_parse_runtime_options)
            this.wasm_parse_runtime_options = Module.cwrap("mono_wasm_parse_runtime_options", "void", ["number", "number"]);
        var argv = Module._malloc(options.length * 4);
        var wasm_strdup = Module.cwrap("mono_wasm_strdup", "number", ["string"]);
        aindex = 0;
        for (var i = 0; i < options.length; ++i) {
            Module.setValue(argv + aindex * 4, wasm_strdup(options[i]), "i32");
            aindex += 1
        }
        this.wasm_parse_runtime_options(options.length, argv)
    },
    mono_load_runtime_and_bcl: function(vfs_prefix, deploy_prefix, enable_debugging, file_list, loaded_cb, fetch_file_cb) {
        var pending = file_list.length;
        var loaded_files = [];
        var mono_wasm_add_assembly = Module.cwrap("mono_wasm_add_assembly", null, ["string", "number", "number"]);
        if (!fetch_file_cb) {
            if (ENVIRONMENT_IS_NODE) {
                var fs = require("fs");
                fetch_file_cb = function(asset) {
                    console.log("Loading... " + asset);
                    var binary = fs.readFileSync(asset);
                    var resolve_func2 = function(resolve, reject) {
                        resolve(new Uint8Array(binary))
                    };
                    var resolve_func1 = function(resolve, reject) {
                        var response = {
                            ok: true,
                            url: asset,
                            arrayBuffer: function() {
                                return new Promise(resolve_func2)
                            }
                        };
                        resolve(response)
                    };
                    return new Promise(resolve_func1)
                }
            } else {
                fetch_file_cb = function(asset) {
                    return fetch(asset, {
                        credentials: "same-origin"
                    })
                }
            }
        }
        // have no files so just run the pending == 0 code
                            MONO.loaded_files = loaded_files;
                    var load_runtime = Module.cwrap("mono_wasm_load_runtime", null, ["string", "number"]);
                    console.log("initializing mono runtime");
                    if (ENVIRONMENT_IS_SHELL) {
                        try {
                            load_runtime(vfs_prefix, enable_debugging)
                        } catch (ex) {
                            print("load_runtime () failed: " + ex);
                            var err = new Error;
                            print("Stacktrace: \n");
                            print(err.stack);
                            var wasm_exit = Module.cwrap("mono_wasm_exit", "void", ["number"]);
                            wasm_exit(1)
                        }
                    } else {
                        //                    no runtime to "load"
    //                    load_runtime(vfs_prefix, enable_debugging)
                    }
                    MONO.mono_wasm_runtime_ready();
                    loaded_cb();
/*
        file_list.forEach(function(file_name) {
            var fetch_promise = fetch_file_cb(locateFile(deploy_prefix + "/" + file_name));
            fetch_promise.then(function(response) {
                if (!response.ok)
                    throw "failed to load '" + file_name + "'";
                loaded_files.push(response.url);
                return response["arrayBuffer"]()
            }).then(function(blob) {
                var asm = new Uint8Array(blob);
                var memory = Module._malloc(asm.length);
                var heapBytes = new Uint8Array(Module.HEAPU8.buffer,memory,asm.length);
                heapBytes.set(asm);
                mono_wasm_add_assembly(file_name, memory, asm.length);
                console.log("Loaded: " + file_name);
                --pending;
                if (pending == 0) {
                    MONO.loaded_files = loaded_files;
                    var load_runtime = Module.cwrap("mono_wasm_load_runtime", null, ["string", "number"]);
                    console.log("initializing mono runtime");
                    if (ENVIRONMENT_IS_SHELL) {
                        try {
                            load_runtime(vfs_prefix, enable_debugging)
                        } catch (ex) {
                            print("load_runtime () failed: " + ex);
                            var err = new Error;
                            print("Stacktrace: \n");
                            print(err.stack);
                            var wasm_exit = Module.cwrap("mono_wasm_exit", "void", ["number"]);
                            wasm_exit(1)
                        }
                    } else {
                        load_runtime(vfs_prefix, enable_debugging)
                    }
                    MONO.mono_wasm_runtime_ready();
                    loaded_cb()
                }
            })
        })
            */
    },
    mono_wasm_get_loaded_files: function() {
        console.log(">>>mono_wasm_get_loaded_files");
        return this.loaded_files
    },
    mono_wasm_clear_all_breakpoints: function() {
        if (this.mono_clear_bps)
            this.mono_clear_bps = Module.cwrap("mono_wasm_clear_all_breakpoints", "void", []);
        this.mono_clear_bps()
    }
};
function _mono_set_timeout(timeout, id) {
    if (!this.mono_set_timeout_exec)
        this.mono_set_timeout_exec = Module.cwrap("mono_set_timeout_exec", "void", ["number"]);
    if (ENVIRONMENT_IS_WEB) {
        window.setTimeout(function() {
            this.mono_set_timeout_exec(id)
        }, timeout)
    } else {
        ++MONO.pump_count;
        MONO.timeout_queue.push(function() {
            this.mono_set_timeout_exec(id)
        })
    }
}
function _mono_wasm_add_array_item(position) {
    MONO.var_info.push({
        name: "[" + position + "]"
    })
}
function _mono_wasm_add_array_var(className, objectId) {
    if (objectId == 0) {
        MONO.var_info.push({
            value: {
                type: "array",
                className: Module.UTF8ToString(className),
                description: Module.UTF8ToString(className),
                subtype: "null"
            }
        })
    } else {
        MONO.var_info.push({
            value: {
                type: "array",
                className: Module.UTF8ToString(className),
                description: Module.UTF8ToString(className),
                objectId: "dotnet:array:" + objectId
            }
        })
    }
}
function _mono_wasm_add_bool_var(var_value) {
    MONO.var_info.push({
        value: {
            type: "boolean",
            value: var_value != 0
        }
    })
}
function _mono_wasm_add_float_var(var_value) {
    MONO.var_info.push({
        value: {
            type: "number",
            value: var_value
        }
    })
}
function _mono_wasm_add_frame(il, method, name) {
    MONO.active_frames.push({
        il_pos: il,
        method_token: method,
        assembly_name: Module.UTF8ToString(name)
    })
}
function _mono_wasm_add_int_var(var_value) {
    MONO.var_info.push({
        value: {
            type: "number",
            value: var_value
        }
    })
}
function _mono_wasm_add_long_var(var_value) {
    MONO.var_info.push({
        value: {
            type: "number",
            value: var_value
        }
    })
}
function _mono_wasm_add_obj_var(className, objectId) {
    if (objectId == 0) {
        MONO.var_info.push({
            value: {
                type: "object",
                className: Module.UTF8ToString(className),
                description: Module.UTF8ToString(className),
                subtype: "null"
            }
        })
    } else {
        MONO.var_info.push({
            value: {
                type: "object",
                className: Module.UTF8ToString(className),
                description: Module.UTF8ToString(className),
                objectId: "dotnet:object:" + objectId
            }
        })
    }
}
function _mono_wasm_add_properties_var(name) {
    MONO.var_info.push({
        name: Module.UTF8ToString(name)
    })
}
function _mono_wasm_add_string_var(var_value) {
    if (var_value == 0) {
        MONO.var_info.push({
            value: {
                type: "object",
                subtype: "null"
            }
        })
    } else {
        MONO.var_info.push({
            value: {
                type: "string",
                value: Module.UTF8ToString(var_value)
            }
        })
    }
}
var BINDING = {
    BINDING_ASM: "[WebAssembly.Bindings]WebAssembly.Runtime",
    mono_wasm_object_registry: [],
    mono_wasm_ref_counter: 0,
    mono_wasm_free_list: [],
    mono_wasm_marshal_enum_as_int: false,
    mono_bindings_init: function(binding_asm) {
        this.BINDING_ASM = binding_asm
    },
    export_functions: function(module) {
        module["mono_bindings_init"] = BINDING.mono_bindings_init.bind(BINDING);
        module["mono_method_invoke"] = BINDING.call_method.bind(BINDING);
        module["mono_method_get_call_signature"] = BINDING.mono_method_get_call_signature.bind(BINDING);
        module["mono_method_resolve"] = BINDING.resolve_method_fqn.bind(BINDING);
        module["mono_bind_static_method"] = BINDING.bind_static_method.bind(BINDING);
        module["mono_call_static_method"] = BINDING.call_static_method.bind(BINDING)
    },
    bindings_lazy_init: function() {
        if (this.init)
            return;
        // dont load anything
        this.assembly_load = function() {};
        //this.assembly_load = Module.cwrap("mono_wasm_assembly_load", "number", ["string"]);
        this.invoke_method = Module.cwrap("corert_wasm_invoke_method", "number", ["number", "number", "number", "number"]);

        //CoreRT TODO:  funcs with strings will fail in ccall
        this.find_class = Module.cwrap("mono_wasm_assembly_find_class", "number", ["number", "string", "string"]);
        this.find_method = Module.cwrap("mono_wasm_assembly_find_method", "number", ["number", "string", "number"]);
//        this.mono_string_get_utf8 = Module.cwrap("mono_wasm_string_get_utf8", "number", ["number"]);
        this.js_string_to_mono_string = Module.cwrap("mono_wasm_string_from_js", "number", ["string"]);
//        this.mono_get_obj_type = Module.cwrap("mono_wasm_get_obj_type", "number", ["number"]);
//        this.mono_unbox_int = Module.cwrap("mono_unbox_int", "number", ["number"]);
//        this.mono_unbox_float = Module.cwrap("mono_wasm_unbox_float", "number", ["number"]);
//        this.mono_array_length = Module.cwrap("mono_wasm_array_length", "number", ["number"]);
//        this.mono_array_get = Module.cwrap("mono_wasm_array_get", "number", ["number", "number"]);
//        this.mono_obj_array_new = Module.cwrap("mono_wasm_obj_array_new", "number", ["number"]);
//        this.mono_obj_array_set = Module.cwrap("mono_wasm_obj_array_set", "void", ["number", "number", "number"]);
//        this.mono_unbox_enum = Module.cwrap("mono_wasm_unbox_enum", "number", ["number"]);
//        this.mono_typed_array_new = Module.cwrap("mono_wasm_typed_array_new", "number", ["number", "number", "number", "number"]);
        var binding_fqn_asm = this.BINDING_ASM.substring(this.BINDING_ASM.indexOf("[") + 1, this.BINDING_ASM.indexOf("]")).trim();
        var binding_fqn_class = this.BINDING_ASM.substring(this.BINDING_ASM.indexOf("]") + 1).trim();
        // no binding module, may have to build and link in
        /*this.binding_module = this.assembly_load(binding_fqn_asm);
        if (!this.binding_module)
            throw "Can't find bindings module assembly: " + binding_fqn_asm;
        if (binding_fqn_class !== null && typeof binding_fqn_class !== "undefined") {
            var namespace = "WebAssembly";
            var classname = binding_fqn_class.length > 0 ? binding_fqn_class : "Runtime";
            if (binding_fqn_class.indexOf(".") != -1) {
                var idx = binding_fqn_class.lastIndexOf(".");
                namespace = binding_fqn_class.substring(0, idx);
                classname = binding_fqn_class.substring(idx + 1)
            }
        }
        var wasm_runtime_class = this.find_class(this.binding_module, namespace, classname);
        if (!wasm_runtime_class)
            throw "Can't find " + binding_fqn_class + " class";
        var get_method = function(method_name) {
            var res = BINDING.find_method(wasm_runtime_class, method_name, -1);
            if (!res)
                throw "Can't find method " + namespace + "." + classname + ":" + method_name;
            return res
        };
        this.bind_js_obj = get_method("BindJSObject");
        this.bind_core_clr_obj = get_method("BindCoreCLRObject");
        this.bind_existing_obj = get_method("BindExistingObject");
        this.unbind_js_obj = get_method("UnBindJSObject");
        this.unbind_js_obj_and_free = get_method("UnBindJSObjectAndFree");
        this.unbind_raw_obj_and_free = get_method("UnBindRawJSObjectAndFree");
        this.get_js_id = get_method("GetJSObjectId");
        this.get_raw_mono_obj = get_method("GetMonoObject");
        this.box_js_int = get_method("BoxInt");
        this.box_js_double = get_method("BoxDouble");
        this.box_js_bool = get_method("BoxBool");
        this.is_simple_array = get_method("IsSimpleArray");
        this.get_core_type = get_method("GetCoreType");
        this.setup_js_cont = get_method("SetupJSContinuation");
        this.create_tcs = get_method("CreateTaskSource");
        this.set_tcs_result = get_method("SetTaskSourceResult");
        this.set_tcs_failure = get_method("SetTaskSourceFailure");
        this.tcs_get_task_and_bind = get_method("GetTaskAndBind");
        this.get_call_sig = get_method("GetCallSignature");
        this.object_to_string = get_method("ObjectToString");
        this.get_date_value = get_method("GetDateValue");
        this.create_date_time = get_method("CreateDateTime");
        this.object_to_enum = get_method("ObjectToEnum");
        */
        this.init = true
    },
    get_js_obj: function(js_handle) {
        if (js_handle > 0)
            return this.mono_wasm_require_handle(js_handle);
        return null
    },
    conv_string: function(mono_obj) {
        if (mono_obj == 0)
            return null;
        var raw = this.mono_string_get_utf8(mono_obj);
        var res = Module.UTF8ToString(raw);
        Module._free(raw);
        return res
    },
    is_nested_array: function(ele) {
        return this.call_method(this.is_simple_array, null, "mi", [ele])
    },
    mono_array_to_js_array: function(mono_array) {
        if (mono_array == 0)
            return null;
        var res = [];
        var len = this.mono_array_length(mono_array);
        for (var i = 0; i < len; ++i) {
            var ele = this.mono_array_get(mono_array, i);
            if (this.is_nested_array(ele))
                res.push(this.mono_array_to_js_array(ele));
            else
                res.push(this.unbox_mono_obj(ele))
        }
        return res
    },
    js_array_to_mono_array: function(js_array) {
        var mono_array = this.mono_obj_array_new(js_array.length);
        for (var i = 0; i < js_array.length; ++i) {
            this.mono_obj_array_set(mono_array, i, this.js_to_mono_obj(js_array[i]))
        }
        return mono_array
    },
    unbox_mono_obj: function(mono_obj) {
        if (mono_obj == 0)
            return undefined;
        var type = this.mono_get_obj_type(mono_obj);
        switch (type) {
        case 1:
            return this.mono_unbox_int(mono_obj);
        case 2:
            return this.mono_unbox_float(mono_obj);
        case 3:
            return this.conv_string(mono_obj);
        case 4:
            throw new Error("no idea on how to unbox value types");
        case 5:
            {
                var obj = this.extract_js_obj(mono_obj);
                return function() {
                    return BINDING.invoke_delegate(obj, arguments)
                }
            }
        case 6:
            {
                if (typeof Promise === "undefined" || typeof Promise.resolve === "undefined")
                    throw new Error("Promises are not supported thus C# Tasks can not work in this context.");
                var obj = this.extract_js_obj(mono_obj);
                var cont_obj = null;
                var promise = new Promise(function(resolve, reject) {
                    cont_obj = {
                        resolve: resolve,
                        reject: reject
                    }
                }
                );
                this.call_method(this.setup_js_cont, null, "mo", [mono_obj, cont_obj]);
                obj.__mono_js_cont__ = cont_obj.__mono_gchandle__;
                cont_obj.__mono_js_task__ = obj.__mono_gchandle__;
                return promise
            }
        case 7:
            return this.extract_js_obj(mono_obj);
        case 8:
            return this.mono_unbox_int(mono_obj) != 0;
        case 9:
            if (this.mono_wasm_marshal_enum_as_int) {
                return this.mono_unbox_enum(mono_obj)
            } else {
                enumValue = this.call_method(this.object_to_string, null, "m", [mono_obj])
            }
            return enumValue;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
            {
                throw new Error("Marshalling of primitive arrays are not supported.  Use the corresponding TypedArray instead.")
            }
        case 20:
            var dateValue = this.call_method(this.get_date_value, null, "md", [mono_obj]);
            return new Date(dateValue);
        case 21:
            var dateoffsetValue = this.call_method(this.object_to_string, null, "m", [mono_obj]);
            return dateoffsetValue;
        default:
            throw new Error("no idea on how to unbox object kind " + type)
        }
    },
    create_task_completion_source: function() {
        return this.call_method(this.create_tcs, null, "i", [-1])
    },
    set_task_result: function(tcs, result) {
        tcs.is_mono_tcs_result_set = true;
        this.call_method(this.set_tcs_result, null, "oo", [tcs, result]);
        if (tcs.is_mono_tcs_task_bound)
            this.free_task_completion_source(tcs)
    },
    set_task_failure: function(tcs, reason) {
        tcs.is_mono_tcs_result_set = true;
        this.call_method(this.set_tcs_failure, null, "os", [tcs, reason.toString()]);
        if (tcs.is_mono_tcs_task_bound)
            this.free_task_completion_source(tcs)
    },
    js_typedarray_to_heap: function(typedArray) {
        var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
        var ptr = Module._malloc(numBytes);
        var heapBytes = new Uint8Array(Module.HEAPU8.buffer,ptr,numBytes);
        heapBytes.set(new Uint8Array(typedArray.buffer,typedArray.byteOffset,numBytes));
        return heapBytes
    },
    js_to_mono_obj: function(js_obj) {
        this.bindings_lazy_init();
        if (js_obj == null || js_obj == undefined)
            return 0;
        if (typeof js_obj === "number") {
            if (parseInt(js_obj) == js_obj)
                return this.call_method(this.box_js_int, null, "im", [js_obj]);
            return this.call_method(this.box_js_double, null, "dm", [js_obj])
        }
        if (typeof js_obj === "string")
            return this.js_string_to_mono_string(js_obj);
        if (typeof js_obj === "boolean")
            return this.call_method(this.box_js_bool, null, "im", [js_obj]);
        if (Promise.resolve(js_obj) === js_obj) {
            var the_task = this.try_extract_mono_obj(js_obj);
            if (the_task)
                return the_task;
            var tcs = this.create_task_completion_source();
            js_obj.then(function(result) {
                BINDING.set_task_result(tcs, result)
            }, function(reason) {
                BINDING.set_task_failure(tcs, reason)
            });
            return this.get_task_and_bind(tcs, js_obj)
        }
        if (js_obj.constructor.name === "Date")
            return this.call_method(this.create_date_time, null, "dm", [js_obj.getTime()]);
        return this.extract_mono_obj(js_obj)
    },
    js_typed_array_to_array: function(js_obj) {
        if (!!(js_obj.buffer instanceof ArrayBuffer && js_obj.BYTES_PER_ELEMENT)) {
            var arrayType = 0;
            if (js_obj instanceof Int8Array)
                arrayType = 11;
            if (js_obj instanceof Uint8Array)
                arrayType = 12;
            if (js_obj instanceof Uint8ClampedArray)
                arrayType = 12;
            if (js_obj instanceof Int16Array)
                arrayType = 13;
            if (js_obj instanceof Uint16Array)
                arrayType = 14;
            if (js_obj instanceof Int32Array)
                arrayType = 15;
            if (js_obj instanceof Uint32Array)
                arrayType = 16;
            if (js_obj instanceof Float32Array)
                arrayType = 17;
            if (js_obj instanceof Float64Array)
                arrayType = 18;
            var heapBytes = this.js_typedarray_to_heap(js_obj);
            var bufferArray = this.mono_typed_array_new(heapBytes.byteOffset, js_obj.length, js_obj.BYTES_PER_ELEMENT, arrayType);
            Module._free(heapBytes.byteOffset);
            return bufferArray
        } else {
            throw new Error("Object '" + js_obj + "' is not a typed array")
        }
    },
    typedarray_copy_to: function(typed_array, pinned_array, begin, end, bytes_per_element) {
        if (!!(typed_array.buffer instanceof ArrayBuffer && typed_array.BYTES_PER_ELEMENT)) {
            if (bytes_per_element !== typed_array.BYTES_PER_ELEMENT)
                throw new Error("Inconsistent element sizes: TypedArray.BYTES_PER_ELEMENT '" + typed_array.BYTES_PER_ELEMENT + "' sizeof managed element: '" + bytes_per_element + "'");
            var num_of_bytes = (end - begin) * bytes_per_element;
            var view_bytes = typed_array.length * typed_array.BYTES_PER_ELEMENT;
            if (num_of_bytes > view_bytes)
                num_of_bytes = view_bytes;
            var offset = begin * bytes_per_element;
            var heapBytes = new Uint8Array(Module.HEAPU8.buffer,pinned_array + offset,num_of_bytes);
            heapBytes.set(new Uint8Array(typed_array.buffer,typed_array.byteOffset,num_of_bytes));
            return num_of_bytes
        } else {
            throw new Error("Object '" + typed_array + "' is not a typed array")
        }
    },
    typedarray_copy_from: function(typed_array, pinned_array, begin, end, bytes_per_element) {
        if (!!(typed_array.buffer instanceof ArrayBuffer && typed_array.BYTES_PER_ELEMENT)) {
            if (bytes_per_element !== typed_array.BYTES_PER_ELEMENT)
                throw new Error("Inconsistent element sizes: TypedArray.BYTES_PER_ELEMENT '" + typed_array.BYTES_PER_ELEMENT + "' sizeof managed element: '" + bytes_per_element + "'");
            var num_of_bytes = (end - begin) * bytes_per_element;
            var view_bytes = typed_array.length * typed_array.BYTES_PER_ELEMENT;
            if (num_of_bytes > view_bytes)
                num_of_bytes = view_bytes;
            var typedarrayBytes = new Uint8Array(typed_array.buffer,0,num_of_bytes);
            var offset = begin * bytes_per_element;
            typedarrayBytes.set(Module.HEAPU8.subarray(pinned_array + offset, pinned_array + offset + num_of_bytes));
            return num_of_bytes
        } else {
            throw new Error("Object '" + typed_array + "' is not a typed array")
        }
    },
    typed_array_from: function(pinned_array, begin, end, bytes_per_element, type) {
        var newTypedArray = 0;
        switch (type) {
        case 5:
            newTypedArray = new Int8Array(end - begin);
            break;
        case 6:
            newTypedArray = new Uint8Array(end - begin);
            break;
        case 7:
            newTypedArray = new Int16Array(end - begin);
            break;
        case 8:
            newTypedArray = new Uint16Array(end - begin);
            break;
        case 9:
            newTypedArray = new Int32Array(end - begin);
            break;
        case 10:
            newTypedArray = new Uint32Array(end - begin);
            break;
        case 13:
            newTypedArray = new Float32Array(end - begin);
            break;
        case 14:
            newTypedArray = new Float64Array(end - begin);
            break;
        case 15:
            newTypedArray = new Uint8ClampedArray(end - begin);
            break
        }
        this.typedarray_copy_from(newTypedArray, pinned_array, begin, end, bytes_per_element);
        return newTypedArray
    },
    js_to_mono_enum: function(method, parmIdx, js_obj) {
        this.bindings_lazy_init();
        if (js_obj === null || typeof js_obj === "undefined")
            return 0;
        var monoObj = this.js_to_mono_obj(js_obj);
        var monoEnum = this.call_method(this.object_to_enum, null, "iimm", [method, parmIdx, monoObj]);
        return this.mono_unbox_enum(monoEnum)
    },
    wasm_binding_obj_new: function(js_obj_id, type) {
        return this.call_method(this.bind_js_obj, null, "io", [js_obj_id, type])
    },
    wasm_bind_existing: function(mono_obj, js_id) {
        return this.call_method(this.bind_existing_obj, null, "mi", [mono_obj, js_id])
    },
    wasm_bind_core_clr_obj: function(js_id, gc_handle) {
        return this.call_method(this.bind_core_clr_obj, null, "ii", [js_id, gc_handle])
    },
    wasm_unbind_js_obj: function(js_obj_id) {
        this.call_method(this.unbind_js_obj, null, "i", [js_obj_id])
    },
    wasm_unbind_js_obj_and_free: function(js_obj_id) {
        this.call_method(this.unbind_js_obj_and_free, null, "i", [js_obj_id])
    },
    wasm_get_js_id: function(mono_obj) {
        return this.call_method(this.get_js_id, null, "m", [mono_obj])
    },
    wasm_get_raw_obj: function(gchandle) {
        return this.call_method(this.get_raw_mono_obj, null, "im", [gchandle])
    },
    try_extract_mono_obj: function(js_obj) {
        if (js_obj === null || typeof js_obj === "undefined" || typeof js_obj.__mono_gchandle__ === "undefined")
            return 0;
        return this.wasm_get_raw_obj(js_obj.__mono_gchandle__)
    },
    mono_method_get_call_signature: function(method) {
        this.bindings_lazy_init();
        return this.call_method(this.get_call_sig, null, "i", [method])
    },
    get_task_and_bind: function(tcs, js_obj) {
        var gc_handle = this.mono_wasm_free_list.length ? this.mono_wasm_free_list.pop() : this.mono_wasm_ref_counter++;
        var task_gchandle = this.call_method(this.tcs_get_task_and_bind, null, "oi", [tcs, gc_handle + 1]);
        js_obj.__mono_gchandle__ = task_gchandle;
        this.mono_wasm_object_registry[gc_handle] = js_obj;
        this.free_task_completion_source(tcs);
        tcs.is_mono_tcs_task_bound = true;
        js_obj.__mono_bound_tcs__ = tcs.__mono_gchandle__;
        tcs.__mono_bound_task__ = js_obj.__mono_gchandle__;
        return this.wasm_get_raw_obj(js_obj.__mono_gchandle__)
    },
    free_task_completion_source: function(tcs) {
        if (tcs.is_mono_tcs_result_set) {
            this.call_method(this.unbind_raw_obj_and_free, null, "ii", [tcs.__mono_gchandle__])
        }
        if (tcs.__mono_bound_task__) {
            this.call_method(this.unbind_raw_obj_and_free, null, "ii", [tcs.__mono_bound_task__])
        }
    },
    extract_mono_obj: function(js_obj) {
        if (js_obj === null || typeof js_obj === "undefined")
            return 0;
        if (!js_obj.is_mono_bridged_obj) {
            var gc_handle = this.mono_wasm_register_obj(js_obj);
            return this.wasm_get_raw_obj(gc_handle)
        }
        return this.wasm_get_raw_obj(js_obj.__mono_gchandle__)
    },
    extract_js_obj: function(mono_obj) {
        if (mono_obj == 0)
            return null;
        var js_id = this.wasm_get_js_id(mono_obj);
        if (js_id > 0)
            return this.mono_wasm_require_handle(js_id);
        var gcHandle = this.mono_wasm_free_list.length ? this.mono_wasm_free_list.pop() : this.mono_wasm_ref_counter++;
        var js_obj = {
            __mono_gchandle__: this.wasm_bind_existing(mono_obj, gcHandle + 1),
            is_mono_bridged_obj: true
        };
        this.mono_wasm_object_registry[gcHandle] = js_obj;
        return js_obj
    },
    call_method: function(method, this_arg, args_marshal, args) {
        this.bindings_lazy_init();
        var extra_args_mem = 0;
        for (var i = 0; i < args.length; ++i) {
            if (args_marshal[i] == "i" || args_marshal[i] == "f" || args_marshal[i] == "l" || args_marshal[i] == "d" || args_marshal[i] == "j" || args_marshal[i] == "k")
                extra_args_mem += 8
        }
        var extra_args_mem = extra_args_mem ? Module._malloc(extra_args_mem) : 0;
        var extra_arg_idx = 0;
        var args_mem = Module._malloc(args.length * 4);
        var eh_throw = Module._malloc(4);
        for (var i = 0; i < args.length; ++i) {
            if (args_marshal[i] == "s") {
                Module.setValue(args_mem + i * 4, this.js_string_to_mono_string(args[i]), "i32")
            } else if (args_marshal[i] == "m") {
                Module.setValue(args_mem + i * 4, args[i], "i32")
            } else if (args_marshal[i] == "o") {
                Module.setValue(args_mem + i * 4, this.js_to_mono_obj(args[i]), "i32")
            } else if (args_marshal[i] == "j" || args_marshal[i] == "k") {
                var enumVal = this.js_to_mono_enum(method, i, args[i]);
                var extra_cell = extra_args_mem + extra_arg_idx;
                extra_arg_idx += 8;
                if (args_marshal[i] == "j")
                    Module.setValue(extra_cell, enumVal, "i32");
                else if (args_marshal[i] == "k")
                    Module.setValue(extra_cell, enumVal, "i64");
                Module.setValue(args_mem + i * 4, extra_cell, "i32")
            } else if (args_marshal[i] == "i" || args_marshal[i] == "f" || args_marshal[i] == "l" || args_marshal[i] == "d") {
                var extra_cell = extra_args_mem + extra_arg_idx;
                extra_arg_idx += 8;
                if (args_marshal[i] == "i")
                    Module.setValue(extra_cell, args[i], "i32");
                else if (args_marshal[i] == "l")
                    Module.setValue(extra_cell, args[i], "i64");
                else if (args_marshal[i] == "f")
                    Module.setValue(extra_cell, args[i], "float");
                else
                    Module.setValue(extra_cell, args[i], "double");
                Module.setValue(args_mem + i * 4, extra_cell, "i32")
            }
        }
        Module.setValue(eh_throw, 0, "i32");
        var res = this.invoke_method(method, this_arg, args_mem, eh_throw);
        var eh_res = Module.getValue(eh_throw, "i32");
        if (extra_args_mem)
            Module._free(extra_args_mem);
        Module._free(args_mem);
        Module._free(eh_throw);
        if (eh_res != 0) {
            var msg = this.conv_string(res);
            throw new Error(msg)
        }
        if (args_marshal !== null && typeof args_marshal !== "undefined") {
            if (args_marshal.length >= args.length && args_marshal[args.length] === "m")
                return res
        }
        return this.unbox_mono_obj(res)
    },
    invoke_delegate: function(delegate_obj, js_args) {
        this.bindings_lazy_init();
        if (!this.delegate_dynamic_invoke) {
            if (!this.corlib)
                this.corlib = this.assembly_load("mscorlib");
            if (!this.delegate_class)
                this.delegate_class = this.find_class(this.corlib, "System", "Delegate");
            if (!this.delegate_class) {
                throw new Error("System.Delegate class can not be resolved.")
            }
            this.delegate_dynamic_invoke = this.find_method(this.delegate_class, "DynamicInvoke", -1)
        }
        var mono_args = this.js_array_to_mono_array(js_args);
        if (!this.delegate_dynamic_invoke)
            throw new Error("System.Delegate.DynamicInvoke method can not be resolved.");
        return this.call_method(this.delegate_dynamic_invoke, this.extract_mono_obj(delegate_obj), "mo", [mono_args])
    },
    resolve_method_fqn: function(fqn) {
        var assembly = fqn.substring(fqn.indexOf("[") + 1, fqn.indexOf("]")).trim();
        fqn = fqn.substring(fqn.indexOf("]") + 1).trim();
        var methodname = fqn.substring(fqn.indexOf(":") + 1);
        fqn = fqn.substring(0, fqn.indexOf(":")).trim();
        var namespace = "";
        var classname = fqn;
        if (fqn.indexOf(".") != -1) {
            var idx = fqn.lastIndexOf(".");
            namespace = fqn.substring(0, idx);
            classname = fqn.substring(idx + 1)
        }
        var asm = this.assembly_load(assembly);
        if (!asm)
            throw new Error("Could not find assembly: " + assembly);
        var klass = this.find_class(asm, namespace, classname);
        if (!klass)
            throw new Error("Could not find class: " + namespace + ":" + classname);
        var method = this.find_method(klass, methodname, -1);
        if (!method)
            throw new Error("Could not find method: " + methodname);
        return method
    },
    call_static_method: function(fqn, args, signature) {
        this.bindings_lazy_init();
        var method = this.resolve_method_fqn(fqn);
        if (typeof signature === "undefined")
            signature = Module.mono_method_get_call_signature(method);
        return this.call_method(method, null, signature, args)
    },
    bind_static_method: function(fqn, signature) {
        this.bindings_lazy_init();
        var method = this.resolve_method_fqn(fqn);
        if (typeof signature === "undefined")
            signature = Module.mono_method_get_call_signature(method);
        return function() {
            return BINDING.call_method(method, null, signature, arguments)
        }
    },
    wasm_get_core_type: function(obj) {
        return this.call_method(this.get_core_type, null, "so", ["WebAssembly.Core." + obj.constructor.name])
    },
    get_wasm_type: function(obj) {
        var coreType = obj[Symbol.for("wasm type")];
        if (typeof coreType === "undefined") {
            switch (obj.constructor.name) {
            case "Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "ArrayBuffer":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    ArrayBuffer.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Int8Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Int8Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Uint8Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Uint8Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Uint8ClampedArray":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Uint8ClampedArray.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Int16Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Int16Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Uint16Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Uint16Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Int32Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Int32Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Uint32Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Uint32Array.prototype[Symbol.for("wasm type")] = coreType
                }
                return coreType;
            case "Float32Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Float32Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Float64Array":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Float64Array.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "Function":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    Function.prototype[Symbol.for("wasm type")] = coreType
                }
                break;
            case "SharedArrayBuffer":
                coreType = this.wasm_get_core_type(obj);
                if (typeof coreType !== "undefined") {
                    SharedArrayBuffer.prototype[Symbol.for("wasm type")] = coreType
                }
                break
            }
        }
        return coreType
    },
    mono_wasm_register_obj: function(obj) {
        var gc_handle = undefined;
        if (obj !== null && typeof obj !== "undefined") {
            gc_handle = obj.__mono_gchandle__;
            if (typeof gc_handle === "undefined") {
                var handle = this.mono_wasm_free_list.length ? this.mono_wasm_free_list.pop() : this.mono_wasm_ref_counter++;
                obj.__mono_jshandle__ = handle;
                var wasm_type = this.get_wasm_type(obj);
                gc_handle = obj.__mono_gchandle__ = this.wasm_binding_obj_new(handle + 1, wasm_type);
                this.mono_wasm_object_registry[handle] = obj
            }
        }
        return gc_handle
    },
    mono_wasm_require_handle: function(handle) {
        if (handle > 0)
            return this.mono_wasm_object_registry[handle - 1];
        return null
    },
    mono_wasm_unregister_obj: function(js_id) {
        var obj = this.mono_wasm_object_registry[js_id - 1];
        if (typeof obj !== "undefined" && obj !== null) {
            if (typeof ___mono_wasm_global___ !== "undefined" && ___mono_wasm_global___ === obj)
                return obj;
            var gc_handle = obj.__mono_gchandle__;
            if (typeof gc_handle !== "undefined") {
                this.wasm_unbind_js_obj_and_free(js_id);
                obj.__mono_gchandle__ = undefined;
                obj.__mono_jshandle__ = undefined;
                this.mono_wasm_object_registry[js_id - 1] = undefined;
                this.mono_wasm_free_list.push(js_id - 1)
            }
        }
        return obj
    },
    mono_wasm_free_handle: function(handle) {
        this.mono_wasm_unregister_obj(handle)
    },
    mono_wasm_free_raw_object: function(js_id) {
        var obj = this.mono_wasm_object_registry[js_id - 1];
        if (typeof obj !== "undefined" && obj !== null) {
            if (typeof ___mono_wasm_global___ !== "undefined" && ___mono_wasm_global___ === obj)
                return obj;
            var gc_handle = obj.__mono_gchandle__;
            if (typeof gc_handle !== "undefined") {
                obj.__mono_gchandle__ = undefined;
                obj.__mono_jshandle__ = undefined;
                this.mono_wasm_object_registry[js_id - 1] = undefined;
                this.mono_wasm_free_list.push(js_id - 1)
            }
        }
        return obj
    },
    mono_wasm_get_global: function() {
        function testGlobal(obj) {
            obj["___mono_wasm_global___"] = obj;
            var success = typeof ___mono_wasm_global___ === "object" && obj["___mono_wasm_global___"] === obj;
            if (!success) {
                delete obj["___mono_wasm_global___"]
            }
            return success
        }
        if (typeof ___mono_wasm_global___ === "object") {
            return ___mono_wasm_global___
        }
        if (typeof global === "object" && testGlobal(global)) {
            ___mono_wasm_global___ = global
        } else if (typeof window === "object" && testGlobal(window)) {
            ___mono_wasm_global___ = window
        } else if (testGlobal(function() {
            return Function
        }()("return this")())) {
            ___mono_wasm_global___ = function() {
                return Function
            }()("return this")()
        }
        if (typeof ___mono_wasm_global___ === "object") {
            return ___mono_wasm_global___
        }
        throw Error("unable to get mono wasm global object.")
    }
};
function _mono_wasm_bind_core_object(js_handle, gc_handle, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    BINDING.wasm_bind_core_clr_obj(js_handle, gc_handle);
    requireObject.__mono_gchandle__ = gc_handle;
    return gc_handle
}
function _mono_wasm_bind_host_object(js_handle, gc_handle, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    BINDING.wasm_bind_core_clr_obj(js_handle, gc_handle);
    requireObject.__mono_gchandle__ = gc_handle;
    return gc_handle
}
function _mono_wasm_fire_bp() {
    console.log("mono_wasm_fire_bp");
    debugger
}
function _mono_wasm_get_by_index(js_handle, property_index, is_exception) {
    BINDING.bindings_lazy_init();
    var obj = BINDING.mono_wasm_require_handle(js_handle);
    if (!obj) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    try {
        var m = obj[property_index];
        return BINDING.js_to_mono_obj(m)
    } catch (e) {
        var res = e.toString();
        setValue(is_exception, 1, "i32");
        if (res === null || typeof res === "undefined")
            res = "unknown exception";
        return BINDING.js_string_to_mono_string(res)
    }
}
function _mono_wasm_get_global_object(global_name, is_exception) {
    BINDING.bindings_lazy_init();
    var js_name = BINDING.conv_string(global_name);
    var globalObj = undefined;
    if (!js_name) {
        globalObj = BINDING.mono_wasm_get_global()
    } else {
        globalObj = BINDING.mono_wasm_get_global()[js_name]
    }
    if (globalObj === null || typeof globalObj === undefined) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Global object '" + js_name + "' not found.")
    }
    return BINDING.js_to_mono_obj(globalObj)
}
function _mono_wasm_get_object_property(js_handle, property_name, is_exception) {
    BINDING.bindings_lazy_init();
    var obj = BINDING.mono_wasm_require_handle(js_handle);
    if (!obj) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var js_name = BINDING.conv_string(property_name);
    if (!js_name) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid property name object '" + js_name + "'")
    }
    var res;
    try {
        var m = obj[js_name];
        if (m === Object(m) && obj.__is_mono_proxied__)
            m.__is_mono_proxied__ = true;
        return BINDING.js_to_mono_obj(m)
    } catch (e) {
        var res = e.toString();
        setValue(is_exception, 1, "i32");
        if (res === null || typeof res === "undefined")
            res = "unknown exception";
        return BINDING.js_string_to_mono_string(res)
    }
}
function _mono_wasm_invoke_js_marshalled(exceptionMessage, asyncHandleLongPtr, functionName, argsJson) {
    console.log('_mono_wasm_invoke_js_marshalled');
    var mono_string = DOTNET._dotnet_get_global()._mono_string_cached || (DOTNET._dotnet_get_global()._mono_string_cached = Module.cwrap("mono_wasm_string_from_js", "number", ["string"]));
    try {
        var u32Index = asyncHandleLongPtr >> 2;
        var asyncHandleJsNumber = Module.HEAPU32[u32Index + 1] * 4294967296 + Module.HEAPU32[u32Index];
        var funcNameJsString = DOTNET.conv_string(functionName);
        var argsJsonJsString = argsJson && DOTNET.conv_string(argsJson);
        var dotNetExports = DOTNET._dotnet_get_global().DotNet;
        if (!dotNetExports) {
            throw new Error("The Microsoft.JSInterop.js library is not loaded.")
        }
        if (asyncHandleJsNumber) {
            dotNetExports.jsCallDispatcher.beginInvokeJSFromDotNet(asyncHandleJsNumber, funcNameJsString, argsJsonJsString);
            return 0
        } else {
            var resultJson = dotNetExports.jsCallDispatcher.invokeJSFromDotNet(funcNameJsString, argsJsonJsString);
            return resultJson === null ? 0 : mono_string(resultJson)
        }
    } catch (ex) {
        var exceptionJsString = ex.message + "\n" + ex.stack;
        var exceptionSystemString = mono_string(exceptionJsString);
        setValue(exceptionMessage, exceptionSystemString, "i32");
        return 0
    }
}
function _mono_wasm_invoke_js_unmarshalled(exceptionMessage, funcName, arg0, arg1, arg2) {
    console.log('_mono_wasm_invoke_js_unmarshalled');
    try {
        var funcNameJsString = DOTNET.conv_string(funcName);
        var dotNetExports = DOTNET._dotnet_get_global().DotNet;
        if (!dotNetExports) {
            throw new Error("The Microsoft.JSInterop.js library is not loaded.")
        }
        var funcInstance = dotNetExports.jsCallDispatcher.findJSFunction(funcNameJsString);
        return funcInstance.call(null, arg0, arg1, arg2)
    } catch (ex) {
        var exceptionJsString = ex.message + "\n" + ex.stack;
        var mono_string = Module.cwrap("mono_wasm_string_from_js", "number", ["string"]);
        var exceptionSystemString = mono_string(exceptionJsString);
        setValue(exceptionMessage, exceptionSystemString, "i32");
        return 0
    }
}
function _mono_wasm_invoke_js_with_args(js_handle, method_name, args, is_exception) {
    console.log('_mono_wasm_invoke_js_with_args');
    BINDING.bindings_lazy_init();
    var obj = BINDING.get_js_obj(js_handle);
    if (!obj) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var js_name = BINDING.conv_string(method_name);
    if (!js_name) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid method name object '" + method_name + "'")
    }
    var js_args = BINDING.mono_array_to_js_array(args);
    var res;
    try {
        var m = obj[js_name];
        if (typeof m === "undefined")
            throw new Error("Method: '" + js_name + "' not found for: '" + Object.prototype.toString.call(obj) + "'");
        var res = m.apply(obj, js_args);
        return BINDING.js_to_mono_obj(res)
    } catch (e) {
        var res = e.toString();
        setValue(is_exception, 1, "i32");
        if (res === null || res === undefined)
            res = "unknown exception";
        return BINDING.js_string_to_mono_string(res)
    }
}
function _mono_wasm_new(core_name, args, is_exception) {
    var js_name = BINDING.conv_string(core_name);
    if (!js_name) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Core object '" + js_name + "' not found.")
    }
    var coreObj = BINDING.mono_wasm_get_global()[js_name];
    if (coreObj === null || typeof coreObj === undefined) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Global object '" + js_name + "' not found.")
    }
    var js_args = BINDING.mono_array_to_js_array(args);
    try {
        var allocator = function(constructor, js_args) {
            var argsList = new Array;
            argsList[0] = constructor;
            if (js_args)
                argsList = argsList.concat(js_args);
            var obj = new (constructor.bind.apply(constructor, argsList));
            return obj
        };
        var res = allocator(coreObj, js_args);
        var gc_handle = BINDING.mono_wasm_free_list.length ? BINDING.mono_wasm_free_list.pop() : BINDING.mono_wasm_ref_counter++;
        BINDING.mono_wasm_object_registry[gc_handle] = res;
        return BINDING.js_to_mono_obj(gc_handle + 1)
    } catch (e) {
        var res = e.toString();
        setValue(is_exception, 1, "i32");
        if (res === null || res === undefined)
            res = "Error allocating object.";
        return BINDING.js_string_to_mono_string(res)
    }
}
function _mono_wasm_new_object(object_handle_or_function, args, is_exception) {
    BINDING.bindings_lazy_init();
    if (!object_handle_or_function) {
        return BINDING.js_to_mono_obj({})
    } else {
        var requireObject;
        if (typeof object_handle_or_function === "function")
            requireObject = object_handle_or_function;
        else
            requireObject = BINDING.mono_wasm_require_handle(object_handle_or_function);
        if (!requireObject) {
            setValue(is_exception, 1, "i32");
            return BINDING.js_string_to_mono_string("Invalid JS object handle '" + object_handle_or_function + "'")
        }
        var js_args = BINDING.mono_array_to_js_array(args);
        try {
            var allocator = function(constructor, js_args) {
                var argsList = new Array;
                argsList[0] = constructor;
                if (js_args)
                    argsList = argsList.concat(js_args);
                var obj = new (constructor.bind.apply(constructor, argsList));
                return obj
            };
            var res = allocator(requireObject, js_args);
            return BINDING.extract_mono_obj(res)
        } catch (e) {
            var res = e.toString();
            setValue(is_exception, 1, "i32");
            if (res === null || res === undefined)
                res = "Error allocating object.";
            return BINDING.js_string_to_mono_string(res)
        }
    }
}
function _mono_wasm_release_handle(js_handle, is_exception) {
    BINDING.bindings_lazy_init();
    BINDING.mono_wasm_free_handle(js_handle)
}
function _mono_wasm_release_object(js_handle, is_exception) {
    BINDING.bindings_lazy_init();
    BINDING.mono_wasm_free_raw_object(js_handle)
}
function _mono_wasm_set_by_index(js_handle, property_index, value, is_exception) {
    BINDING.bindings_lazy_init();
    var obj = BINDING.mono_wasm_require_handle(js_handle);
    if (!obj) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var js_value = BINDING.unbox_mono_obj(value);
    try {
        obj[property_index] = js_value;
        return true
    } catch (e) {
        var res = e.toString();
        setValue(is_exception, 1, "i32");
        if (res === null || typeof res === "undefined")
            res = "unknown exception";
        return BINDING.js_string_to_mono_string(res)
    }
}
function _mono_wasm_set_object_property(js_handle, property_name, value, createIfNotExist, hasOwnProperty, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var property = BINDING.conv_string(property_name);
    if (!property) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid property name object '" + property_name + "'")
    }
    var result = false;
    var js_value = BINDING.unbox_mono_obj(value);
    if (createIfNotExist) {
        requireObject[property] = js_value;
        result = true
    } else {
        result = false;
        if (!createIfNotExist) {
            if (!requireObject.hasOwnProperty(property))
                return false
        }
        if (hasOwnProperty === true) {
            if (requireObject.hasOwnProperty(property)) {
                requireObject[property] = js_value;
                result = true
            }
        } else {
            requireObject[property] = js_value;
            result = true
        }
    }
    return BINDING.call_method(BINDING.box_js_bool, null, "im", [result])
}
function _mono_wasm_typed_array_copy_from(js_handle, pinned_array, begin, end, bytes_per_element, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var res = BINDING.typedarray_copy_from(requireObject, pinned_array, begin, end, bytes_per_element);
    return BINDING.js_to_mono_obj(res)
}
function _mono_wasm_typed_array_copy_to(js_handle, pinned_array, begin, end, bytes_per_element, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    var res = BINDING.typedarray_copy_to(requireObject, pinned_array, begin, end, bytes_per_element);
    return BINDING.js_to_mono_obj(res)
}
function _mono_wasm_typed_array_from(pinned_array, begin, end, bytes_per_element, type, is_exception) {
    BINDING.bindings_lazy_init();
    var res = BINDING.typed_array_from(pinned_array, begin, end, bytes_per_element, type);
    return BINDING.js_to_mono_obj(res)
}
function _mono_wasm_typed_array_to_array(js_handle, is_exception) {
    BINDING.bindings_lazy_init();
    var requireObject = BINDING.mono_wasm_require_handle(js_handle);
    if (!requireObject) {
        setValue(is_exception, 1, "i32");
        return BINDING.js_string_to_mono_string("Invalid JS object handle '" + js_handle + "'")
    }
    return BINDING.js_typed_array_to_array(requireObject)
}
function _usleep(useconds) {
    var msec = useconds / 1e3;
    if ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"]) {
        var start = self["performance"]["now"]();
        while (self["performance"]["now"]() - start < msec) {}
    } else {
        var start = Date.now();
        while (Date.now() - start < msec) {}
    }
    return 0
}
Module["_usleep"] = _usleep;
function _nanosleep(rqtp, rmtp) {
    var seconds = HEAP32[rqtp >> 2];
    var nanoseconds = HEAP32[rqtp + 4 >> 2];
    if (rmtp !== 0) {
        HEAP32[rmtp >> 2] = 0;
        HEAP32[rmtp + 4 >> 2] = 0
    }
    return _usleep(seconds * 1e6 + nanoseconds / 1e3)
}
function _pthread_cleanup_pop() {
    assert(_pthread_cleanup_push.level == __ATEXIT__.length, "cannot pop if something else added meanwhile!");
    __ATEXIT__.pop();
    _pthread_cleanup_push.level = __ATEXIT__.length
}
function _pthread_cleanup_push(routine, arg) {
    __ATEXIT__.push(function() {
        dynCall_vi(routine, arg)
    });
    _pthread_cleanup_push.level = __ATEXIT__.length
}
function _pthread_cond_destroy() {
    return 0
}
function _pthread_cond_init() {
    return 0
}
function _pthread_cond_signal() {
    return 0
}
function _pthread_cond_timedwait() {
    return 0
}
function _pthread_cond_wait() {
    return 0
}
function _pthread_mutexattr_destroy() {}
function _pthread_mutexattr_init() {}
function _pthread_mutexattr_setprotocol() {}
function _pthread_mutexattr_settype() {}
function _pthread_setcancelstate() {
    return 0
}
function _schedule_background_exec() {
    ++MONO.pump_count;
    if (ENVIRONMENT_IS_WEB) {
        window.setTimeout(MONO.pump_message, 0)
    }
}
function _sem_destroy() {}
function _sem_init() {}
function _sem_post() {}
function _sem_trywait() {}
function _sem_wait() {}
function _setenv(envname, envval, overwrite) {
    if (envname === 0) {
        ___setErrNo(22);
        return -1
    }
    var name = UTF8ToString(envname);
    var val = UTF8ToString(envval);
    if (name === "" || name.indexOf("=") !== -1) {
        ___setErrNo(22);
        return -1
    }
    if (ENV.hasOwnProperty(name) && !overwrite)
        return 0;
    ENV[name] = val;
    ___buildEnvironment(__get_environ());
    return 0
}
function _sigaction(signum, act, oldact) {
    return 0
}
function _sigemptyset(set) {
    HEAP32[set >> 2] = 0;
    return 0
}
function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}
function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++])
        ;
    return sum
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}
function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }
    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }
    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }
    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
        case 0:
            return new Date(janFourth.getFullYear() - 1,11,29);
        case 1:
            return janFourth;
        case 2:
            return new Date(janFourth.getFullYear(),0,3);
        case 3:
            return new Date(janFourth.getFullYear(),0,2);
        case 4:
            return new Date(janFourth.getFullYear(),0,1);
        case 5:
            return new Date(janFourth.getFullYear() - 1,11,31);
        case 6:
            return new Date(janFourth.getFullYear() - 1,11,30)
        }
    }
    function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(),0,4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1,0,4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            } else {
                return thisDate.getFullYear()
            }
        } else {
            return thisDate.getFullYear() - 1
        }
    }
    var EXPANSION_RULES_2 = {
        "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function(date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function(date) {
            return getWeekBasedYear(date)
        },
        "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0)
                twelveHour = 12;
            else if (twelveHour > 12)
                twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function(date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            } else {
                return "PM"
            }
        },
        "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(date) {
            var day = new Date(date.tm_year + 1900,date.tm_mon + 1,date.tm_mday,0,0,0,0);
            return day.getDay() || 7
        },
        "%U": function(date) {
            var janFirst = new Date(date.tm_year + 1900,0,1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
        },
        "%V": function(date) {
            var janFourthThisYear = new Date(date.tm_year + 1900,0,4);
            var janFourthNextYear = new Date(date.tm_year + 1901,0,4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
                daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
        },
        "%w": function(date) {
            var day = new Date(date.tm_year + 1900,date.tm_mon + 1,date.tm_mday,0,0,0,0);
            return day.getDay()
        },
        "%W": function(date) {
            var janFirst = new Date(date.tm_year,0,1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
        },
        "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(date) {
            return date.tm_year + 1900
        },
        "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function(date) {
            return date.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
            pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_2[rule](date))
        }
    }
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}
/* duplicate
function _sysconf(name) {
    switch (name) {
    case 30:
        return PAGE_SIZE;
    case 85:
        var maxHeapSize = 2 * 1024 * 1024 * 1024 - 65536;
        return maxHeapSize / PAGE_SIZE;
    case 132:
    case 133:
    case 12:
    case 137:
    case 138:
    case 15:
    case 235:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 149:
    case 13:
    case 10:
    case 236:
    case 153:
    case 9:
    case 21:
    case 22:
    case 159:
    case 154:
    case 14:
    case 77:
    case 78:
    case 139:
    case 80:
    case 81:
    case 82:
    case 68:
    case 67:
    case 164:
    case 11:
    case 29:
    case 47:
    case 48:
    case 95:
    case 52:
    case 51:
    case 46:
        return 200809;
    case 79:
        return 0;
    case 27:
    case 246:
    case 127:
    case 128:
    case 23:
    case 24:
    case 160:
    case 161:
    case 181:
    case 182:
    case 242:
    case 183:
    case 184:
    case 243:
    case 244:
    case 245:
    case 165:
    case 178:
    case 179:
    case 49:
    case 50:
    case 168:
    case 169:
    case 175:
    case 170:
    case 171:
    case 172:
    case 97:
    case 76:
    case 32:
    case 173:
    case 35:
        return -1;
    case 176:
    case 177:
    case 7:
    case 155:
    case 8:
    case 157:
    case 125:
    case 126:
    case 92:
    case 93:
    case 129:
    case 130:
    case 131:
    case 94:
    case 91:
        return 1;
    case 74:
    case 60:
    case 69:
    case 70:
    case 4:
        return 1024;
    case 31:
    case 42:
    case 72:
        return 32;
    case 87:
    case 26:
    case 33:
        return 2147483647;
    case 34:
    case 1:
        return 47839;
    case 38:
    case 36:
        return 99;
    case 43:
    case 37:
        return 2048;
    case 0:
        return 2097152;
    case 3:
        return 65536;
    case 28:
        return 32768;
    case 44:
        return 32767;
    case 75:
        return 16384;
    case 39:
        return 1e3;
    case 89:
        return 700;
    case 71:
        return 256;
    case 40:
        return 255;
    case 2:
        return 100;
    case 180:
        return 64;
    case 25:
        return 20;
    case 5:
        return 16;
    case 6:
        return 6;
    case 73:
        return 4;
    case 84:
        {
            if (typeof navigator === "object")
                return navigator["hardwareConcurrency"] || 1;
            return 1
        }
    }
    ___setErrNo(22);
    return -1
}
*/
function _time(ptr) {
    var ret = Date.now() / 1e3 | 0;
    if (ptr) {
        HEAP32[ptr >> 2] = ret
    }
    return ret
}
function _unsetenv(name) {
    if (name === 0) {
        ___setErrNo(22);
        return -1
    }
    name = UTF8ToString(name);
    if (name === "" || name.indexOf("=") !== -1) {
        ___setErrNo(22);
        return -1
    }
    if (ENV.hasOwnProperty(name)) {
        delete ENV[name];
        ___buildEnvironment(__get_environ())
    }
    return 0
}
function _utime(path, times) {
    var time;
    if (times) {
        var offset = 4;
        time = HEAP32[times + offset >> 2];
        time *= 1e3
    } else {
        time = Date.now()
    }
    path = UTF8ToString(path);
    try {
        FS.utime(path, time, time);
        return 0
    } catch (e) {
        FS.handleFSError(e);
        return -1
    }
}
function _utimes(path, times) {
    var time;
    if (times) {
        var offset = 8 + 0;
        time = HEAP32[times + offset >> 2] * 1e3;
        offset = 8 + 4;
        time += HEAP32[times + offset >> 2] / 1e3
    } else {
        time = Date.now()
    }
    path = UTF8ToString(path);
    try {
        FS.utime(path, time, time);
        return 0
    } catch (e) {
        FS.handleFSError(e);
        return -1
    }
}
function _wait(stat_loc) {
    ___setErrNo(10);
    return -1
}
function _waitpid() {
    return _wait.apply(null, arguments)
}
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow
} else if (typeof performance === "object" && performance && typeof performance["now"] === "function") {
    _emscripten_get_now = function() {
        return performance["now"]()
    }
} else {
    _emscripten_get_now = Date.now
}
FS.staticInit();
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
if (ENVIRONMENT_IS_NODE) {
    var fs = require("fs");
    var NODEJS_PATH = require("path");
    NODEFS.staticInit()
}
Module["pump_message"] = MONO.pump_message;
BINDING.export_functions(Module);
function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull)
        u8array.length = numBytesWritten;
    return u8array
}
/* replace with dynCalls from standard emscripten 
function dynCall_X(index) {
    index = index | 0;
    return mftCall_X(index)
}
function dynCall_d(index) {
    index = index | 0;
    return +mftCall_d(index)
}
function dynCall_dd(index, a1) {
    index = index | 0;
    a1 = +a1;
    return +mftCall_dd(index, +a1)
}
function dynCall_ddd(index, a1, a2) {
    index = index | 0;
    a1 = +a1;
    a2 = +a2;
    return +mftCall_ddd(index, +a1, +a2)
}
function dynCall_ddi(index, a1, a2) {
    index = index | 0;
    a1 = +a1;
    a2 = a2 | 0;
    return +mftCall_ddi(index, +a1, a2 | 0)
}
function dynCall_di(index, a1) {
    index = index | 0;
    a1 = a1 | 0;
    return +mftCall_di(index, a1 | 0)
}
function dynCall_did(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = +a2;
    return +mftCall_did(index, a1 | 0, +a2)
}
function dynCall_didd(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = +a2;
    a3 = +a3;
    return +mftCall_didd(index, a1 | 0, +a2, +a3)
}
function dynCall_ff(index, a1) {
    index = index | 0;
    a1 = Math_fround(a1);
    return Math_fround(mftCall_ff(index, Math_fround(a1)))
}
function dynCall_fff(index, a1, a2) {
    index = index | 0;
    a1 = Math_fround(a1);
    a2 = Math_fround(a2);
    return Math_fround(mftCall_fff(index, Math_fround(a1), Math_fround(a2)))
}
function dynCall_ffi(index, a1, a2) {
    index = index | 0;
    a1 = Math_fround(a1);
    a2 = a2 | 0;
    return Math_fround(mftCall_ffi(index, Math_fround(a1), a2 | 0))
}
function dynCall_fi(index, a1) {
    index = index | 0;
    a1 = a1 | 0;
    return Math_fround(mftCall_fi(index, a1 | 0))
}
function dynCall_fif(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    return Math_fround(mftCall_fif(index, a1 | 0, Math_fround(a2)))
}
function dynCall_fiff(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    return Math_fround(mftCall_fiff(index, a1 | 0, Math_fround(a2), Math_fround(a3)))
}
function dynCall_i(index) {
    index = index | 0;
    return mftCall_i(index) | 0
}
function dynCall_id(index, a1) {
    index = index | 0;
    a1 = +a1;
    return mftCall_id(index, +a1) | 0
}
function dynCall_idiii(index, a1, a2, a3, a4) {
    index = index | 0;
    a1 = +a1;
    a2 = a2 | 0;
    a3 = a3 | 0;
    a4 = a4 | 0;
    return mftCall_idiii(index, +a1, a2 | 0, a3 | 0, a4 | 0) | 0
}
function dynCall_iffffffi(index, a1, a2, a3, a4, a5, a6, a7) {
    index = index | 0;
    a1 = Math_fround(a1);
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    a4 = Math_fround(a4);
    a5 = Math_fround(a5);
    a6 = Math_fround(a6);
    a7 = a7 | 0;
    return mftCall_iffffffi(index, Math_fround(a1), Math_fround(a2), Math_fround(a3), Math_fround(a4), Math_fround(a5), Math_fround(a6), a7 | 0) | 0
}
function dynCall_iffii(index, a1, a2, a3, a4) {
    index = index | 0;
    a1 = Math_fround(a1);
    a2 = Math_fround(a2);
    a3 = a3 | 0;
    a4 = a4 | 0;
    return mftCall_iffii(index, Math_fround(a1), Math_fround(a2), a3 | 0, a4 | 0) | 0
}
function dynCall_iji(index, a1, a2) {
    index = index | 0;
    a1 = i64(a1);
    a2 = a2 | 0;
    return mftCall_iji(index, i64(a1), a2 | 0) | 0
}
function dynCall_j(index) {
    index = index | 0;
    return i64(mftCall_j(index))
}
function dynCall_jd(index, a1) {
    index = index | 0;
    a1 = +a1;
    return i64(mftCall_jd(index, +a1))
}
function dynCall_jf(index, a1) {
    index = index | 0;
    a1 = Math_fround(a1);
    return i64(mftCall_jf(index, Math_fround(a1)))
}
function dynCall_ji(index, a1) {
    index = index | 0;
    a1 = a1 | 0;
    return i64(mftCall_ji(index, a1 | 0))
}
function dynCall_jii(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = a2 | 0;
    return i64(mftCall_jii(index, a1 | 0, a2 | 0))
}
function dynCall_jiii(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = a2 | 0;
    a3 = a3 | 0;
    return i64(mftCall_jiii(index, a1 | 0, a2 | 0, a3 | 0))
}
function dynCall_jiij(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = a2 | 0;
    a3 = i64(a3);
    return i64(mftCall_jiij(index, a1 | 0, a2 | 0, i64(a3)))
}
function dynCall_jij(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    return i64(mftCall_jij(index, a1 | 0, i64(a2)))
}
function dynCall_jiji(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    a3 = a3 | 0;
    return i64(mftCall_jiji(index, a1 | 0, i64(a2), a3 | 0))
}
function dynCall_jijii(index, a1, a2, a3, a4) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    a3 = a3 | 0;
    a4 = a4 | 0;
    return i64(mftCall_jijii(index, a1 | 0, i64(a2), a3 | 0, a4 | 0))
}
function dynCall_jijj(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    a3 = i64(a3);
    return i64(mftCall_jijj(index, a1 | 0, i64(a2), i64(a3)))
}
function dynCall_jj(index, a1) {
    index = index | 0;
    a1 = i64(a1);
    return i64(mftCall_jj(index, i64(a1)))
}
function dynCall_v(index) {
    index = index | 0;
    mftCall_v(index)
}
function dynCall_vi(index, a1) {
    index = index | 0;
    a1 = a1 | 0;
    mftCall_vi(index, a1 | 0)
}
function dynCall_vid(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = +a2;
    mftCall_vid(index, a1 | 0, +a2)
}
function dynCall_vif(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    mftCall_vif(index, a1 | 0, Math_fround(a2))
}
function dynCall_viff(index, a1, a2, a3) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    mftCall_viff(index, a1 | 0, Math_fround(a2), Math_fround(a3))
}
function dynCall_viffff(index, a1, a2, a3, a4, a5) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    a4 = Math_fround(a4);
    a5 = Math_fround(a5);
    mftCall_viffff(index, a1 | 0, Math_fround(a2), Math_fround(a3), Math_fround(a4), Math_fround(a5))
}
function dynCall_vifffff(index, a1, a2, a3, a4, a5, a6) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    a4 = Math_fround(a4);
    a5 = Math_fround(a5);
    a6 = Math_fround(a6);
    mftCall_vifffff(index, a1 | 0, Math_fround(a2), Math_fround(a3), Math_fround(a4), Math_fround(a5), Math_fround(a6))
}
function dynCall_viffffff(index, a1, a2, a3, a4, a5, a6, a7) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    a4 = Math_fround(a4);
    a5 = Math_fround(a5);
    a6 = Math_fround(a6);
    a7 = Math_fround(a7);
    mftCall_viffffff(index, a1 | 0, Math_fround(a2), Math_fround(a3), Math_fround(a4), Math_fround(a5), Math_fround(a6), Math_fround(a7))
}
function dynCall_vifffffi(index, a1, a2, a3, a4, a5, a6, a7) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = Math_fround(a2);
    a3 = Math_fround(a3);
    a4 = Math_fround(a4);
    a5 = Math_fround(a5);
    a6 = Math_fround(a6);
    a7 = a7 | 0;
    mftCall_vifffffi(index, a1 | 0, Math_fround(a2), Math_fround(a3), Math_fround(a4), Math_fround(a5), Math_fround(a6), a7 | 0)
}
function dynCall_vij(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    mftCall_vij(index, a1 | 0, i64(a2))
}
function dynCall_vijii(index, a1, a2, a3, a4) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    a3 = a3 | 0;
    a4 = a4 | 0;
    mftCall_vijii(index, a1 | 0, i64(a2), a3 | 0, a4 | 0)
}
function dynCall_vijji(index, a1, a2, a3, a4) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = i64(a2);
    a3 = i64(a3);
    a4 = a4 | 0;
    mftCall_vijji(index, a1 | 0, i64(a2), i64(a3), a4 | 0)
}
function dynCall_vj(index, a1) {
    index = index | 0;
    a1 = i64(a1);
    mftCall_vj(index, i64(a1))
}
*/

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiiiij = Module["dynCall_viiiiiiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiiiiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiiiiji = Module["dynCall_viiiiiiiiiiiiji"] = createExportWrapper("dynCall_viiiiiiiiiiiiji");

/** @type {function(...*):?} */
var dynCall_viiiiiiij = Module["dynCall_viiiiiiij"] = createExportWrapper("dynCall_viiiiiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiij = Module["dynCall_viiiiiij"] = createExportWrapper("dynCall_viiiiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiijj = Module["dynCall_viiiiiijj"] = createExportWrapper("dynCall_viiiiiijj");

/** @type {function(...*):?} */
var dynCall_viiiiijj = Module["dynCall_viiiiijj"] = createExportWrapper("dynCall_viiiiijj");

/** @type {function(...*):?} */
var dynCall_viiij = Module["dynCall_viiij"] = createExportWrapper("dynCall_viiij");

/** @type {function(...*):?} */
var dynCall_viij = Module["dynCall_viij"] = createExportWrapper("dynCall_viij");

/** @type {function(...*):?} */
var dynCall_viijj = Module["dynCall_viijj"] = createExportWrapper("dynCall_viijj");

/** @type {function(...*):?} */
var dynCall_vij = Module["dynCall_vij"] = createExportWrapper("dynCall_vij");

/** @type {function(...*):?} */
var dynCall_viji = Module["dynCall_viji"] = createExportWrapper("dynCall_viji");

/** @type {function(...*):?} */
var dynCall_vijj = Module["dynCall_vijj"] = createExportWrapper("dynCall_vijj");

/** @type {function(...*):?} */
var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");

/** @type {function(...*):?} */
var dynCall_iiiij = Module["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");

/** @type {function(...*):?} */
var dynCall_iiij = Module["dynCall_iiij"] = createExportWrapper("dynCall_iiij");

/** @type {function(...*):?} */
var dynCall_iij = Module["dynCall_iij"] = createExportWrapper("dynCall_iij");

/** @type {function(...*):?} */
var dynCall_iiji = Module["dynCall_iiji"] = createExportWrapper("dynCall_iiji");

/** @type {function(...*):?} */
var dynCall_iijj = Module["dynCall_iijj"] = createExportWrapper("dynCall_iijj");

/** @type {function(...*):?} */
var dynCall_iijjj = Module["dynCall_iijjj"] = createExportWrapper("dynCall_iijjj");

/** @type {function(...*):?} */
var dynCall_iijjji = Module["dynCall_iijjji"] = createExportWrapper("dynCall_iijjji");

/** @type {function(...*):?} */
var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");

/** @type {function(...*):?} */
var dynCall_jii = Module["dynCall_jii"] = createExportWrapper("dynCall_jii");

/** @type {function(...*):?} */
var dynCall_jiii = Module["dynCall_jiii"] = createExportWrapper("dynCall_jiii");

/** @type {function(...*):?} */
var dynCall_jiiiiiiiii = Module["dynCall_jiiiiiiiii"] = createExportWrapper("dynCall_jiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_jij = Module["dynCall_jij"] = createExportWrapper("dynCall_jij");

/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

/** @type {function(...*):?} */
var dynCall_jijj = Module["dynCall_jijj"] = createExportWrapper("dynCall_jijj");

/** @type {function(...*):?} */
var dynCall_jid = Module["dynCall_jid"] = createExportWrapper("dynCall_jid");

/** @type {function(...*):?} */
var dynCall_iijiji = Module["dynCall_iijiji"] = createExportWrapper("dynCall_iijiji");

/** @type {function(...*):?} */
var dynCall_jif = Module["dynCall_jif"] = createExportWrapper("dynCall_jif");

/** @type {function(...*):?} */
var dynCall_jiiiijiiij = Module["dynCall_jiiiijiiij"] = createExportWrapper("dynCall_jiiiijiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiijijj = Module["dynCall_viiiiiiiiiijijj"] = createExportWrapper("dynCall_viiiiiiiiiijijj");

/** @type {function(...*):?} */
var dynCall_viijjjj = Module["dynCall_viijjjj"] = createExportWrapper("dynCall_viijjjj");

/** @type {function(...*):?} */
var dynCall_viijjjjjjjj = Module["dynCall_viijjjjjjjj"] = createExportWrapper("dynCall_viijjjjjjjj");

/** @type {function(...*):?} */
var dynCall_iijjjj = Module["dynCall_iijjjj"] = createExportWrapper("dynCall_iijjjj");

/** @type {function(...*):?} */
var dynCall_viiji = Module["dynCall_viiji"] = createExportWrapper("dynCall_viiji");

/** @type {function(...*):?} */
var dynCall_viijjjjjji = Module["dynCall_viijjjjjji"] = createExportWrapper("dynCall_viijjjjjji");

/** @type {function(...*):?} */
var dynCall_viijji = Module["dynCall_viijji"] = createExportWrapper("dynCall_viijji");

/** @type {function(...*):?} */
var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");

/** @type {function(...*):?} */
var dynCall_iijiiii = Module["dynCall_iijiiii"] = createExportWrapper("dynCall_iijiiii");

/** @type {function(...*):?} */
var dynCall_iijiiiij = Module["dynCall_iijiiiij"] = createExportWrapper("dynCall_iijiiiij");

/** @type {function(...*):?} */
var dynCall_jiiiii = Module["dynCall_jiiiii"] = createExportWrapper("dynCall_jiiiii");

/** @type {function(...*):?} */
var dynCall_iijii = Module["dynCall_iijii"] = createExportWrapper("dynCall_iijii");

/** @type {function(...*):?} */
var dynCall_iijji = Module["dynCall_iijji"] = createExportWrapper("dynCall_iijji");

/** @type {function(...*):?} */
var dynCall_iijjjji = Module["dynCall_iijjjji"] = createExportWrapper("dynCall_iijjjji");

/** @type {function(...*):?} */
var dynCall_vijiiii = Module["dynCall_vijiiii"] = createExportWrapper("dynCall_vijiiii");

/** @type {function(...*):?} */
var dynCall_iiiji = Module["dynCall_iiiji"] = createExportWrapper("dynCall_iiiji");

/** @type {function(...*):?} */
var dynCall_iijjii = Module["dynCall_iijjii"] = createExportWrapper("dynCall_iijjii");

/** @type {function(...*):?} */
var dynCall_viijiij = Module["dynCall_viijiij"] = createExportWrapper("dynCall_viijiij");

/** @type {function(...*):?} */
var dynCall_jiiii = Module["dynCall_jiiii"] = createExportWrapper("dynCall_jiiii");

/** @type {function(...*):?} */
var dynCall_viiiij = Module["dynCall_viiiij"] = createExportWrapper("dynCall_viiiij");

/** @type {function(...*):?} */
var dynCall_vijii = Module["dynCall_vijii"] = createExportWrapper("dynCall_vijii");

/** @type {function(...*):?} */
var dynCall_iijiii = Module["dynCall_iijiii"] = createExportWrapper("dynCall_iijiii");

/** @type {function(...*):?} */
var dynCall_jidd = Module["dynCall_jidd"] = createExportWrapper("dynCall_jidd");

/** @type {function(...*):?} */
var dynCall_iiiijiji = Module["dynCall_iiiijiji"] = createExportWrapper("dynCall_iiiijiji");

/** @type {function(...*):?} */
var dynCall_viijiiii = Module["dynCall_viijiiii"] = createExportWrapper("dynCall_viijiiii");

/** @type {function(...*):?} */
var dynCall_iijiiiiiii = Module["dynCall_iijiiiiiii"] = createExportWrapper("dynCall_iijiiiiiii");

/** @type {function(...*):?} */
var dynCall_dij = Module["dynCall_dij"] = createExportWrapper("dynCall_dij");

/** @type {function(...*):?} */
var dynCall_dijj = Module["dynCall_dijj"] = createExportWrapper("dynCall_dijj");

/** @type {function(...*):?} */
var dynCall_fijj = Module["dynCall_fijj"] = createExportWrapper("dynCall_fijj");

/** @type {function(...*):?} */
var dynCall_viiiiij = Module["dynCall_viiiiij"] = createExportWrapper("dynCall_viiiiij");

/** @type {function(...*):?} */
var dynCall_fij = Module["dynCall_fij"] = createExportWrapper("dynCall_fij");

/** @type {function(...*):?} */
var dynCall_jijjj = Module["dynCall_jijjj"] = createExportWrapper("dynCall_jijjj");

/** @type {function(...*):?} */
var dynCall_vijjj = Module["dynCall_vijjj"] = createExportWrapper("dynCall_vijjj");

/** @type {function(...*):?} */
var dynCall_jiijiiiiiiiii = Module["dynCall_jiijiiiiiiiii"] = createExportWrapper("dynCall_jiijiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_iijiiiiiiiiijiiiiiiiii = Module["dynCall_iijiiiiiiiiijiiiiiiiii"] = createExportWrapper("dynCall_iijiiiiiiiiijiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_vijjii = Module["dynCall_vijjii"] = createExportWrapper("dynCall_vijjii");

/** @type {function(...*):?} */
var dynCall_viijjjjjj = Module["dynCall_viijjjjjj"] = createExportWrapper("dynCall_viijjjjjj");

/** @type {function(...*):?} */
var dynCall_viiijj = Module["dynCall_viiijj"] = createExportWrapper("dynCall_viiijj");

/** @type {function(...*):?} */
var dynCall_jidi = Module["dynCall_jidi"] = createExportWrapper("dynCall_jidi");

/** @type {function(...*):?} */
var dynCall_iijiiiiiiiii = Module["dynCall_iijiiiiiiiii"] = createExportWrapper("dynCall_iijiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_jijjji = Module["dynCall_jijjji"] = createExportWrapper("dynCall_jijjji");

/** @type {function(...*):?} */
var dynCall_iijijiiiii = Module["dynCall_iijijiiiii"] = createExportWrapper("dynCall_iijijiiiii");

/** @type {function(...*):?} */
var dynCall_jijii = Module["dynCall_jijii"] = createExportWrapper("dynCall_jijii");

/** @type {function(...*):?} */
var dynCall_iiiiijjjjj = Module["dynCall_iiiiijjjjj"] = createExportWrapper("dynCall_iiiiijjjjj");

/** @type {function(...*):?} */
var dynCall_iiiiijjj = Module["dynCall_iiiiijjj"] = createExportWrapper("dynCall_iiiiijjj");

/** @type {function(...*):?} */
var dynCall_viijiddddi = Module["dynCall_viijiddddi"] = createExportWrapper("dynCall_viijiddddi");

/** @type {function(...*):?} */
var dynCall_iijjiii = Module["dynCall_iijjiii"] = createExportWrapper("dynCall_iijjiii");

/** @type {function(...*):?} */
var dynCall_jijiiiii = Module["dynCall_jijiiiii"] = createExportWrapper("dynCall_jijiiiii");

/** @type {function(...*):?} */
var dynCall_fijji = Module["dynCall_fijji"] = createExportWrapper("dynCall_fijji");

/** @type {function(...*):?} */
var dynCall_dijji = Module["dynCall_dijji"] = createExportWrapper("dynCall_dijji");

/** @type {function(...*):?} */
var dynCall_jijji = Module["dynCall_jijji"] = createExportWrapper("dynCall_jijji");

/** @type {function(...*):?} */
var dynCall_vijjjjj = Module["dynCall_vijjjjj"] = createExportWrapper("dynCall_vijjjjj");

/** @type {function(...*):?} */
var dynCall_vijiiiiiiiiiiii = Module["dynCall_vijiiiiiiiiiiii"] = createExportWrapper("dynCall_vijiiiiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_viijjjjjjjji = Module["dynCall_viijjjjjjjji"] = createExportWrapper("dynCall_viijjjjjjjji");

/** @type {function(...*):?} */
var dynCall_viiiiiiiijiiiiiiij = Module["dynCall_viiiiiiiijiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiijiiiiiiij");

/** @type {function(...*):?} */
var dynCall_viiiijiiij = Module["dynCall_viiiijiiij"] = createExportWrapper("dynCall_viiiijiiij");

/** @type {function(...*):?} */
var dynCall_iidjii = Module["dynCall_iidjii"] = createExportWrapper("dynCall_iidjii");

/** @type {function(...*):?} */
var dynCall_iiiiijiiij = Module["dynCall_iiiiijiiij"] = createExportWrapper("dynCall_iiiiijiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiiiij = Module["dynCall_viiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiij");

/** @type {function(...*):?} */
var dynCall_viijjj = Module["dynCall_viijjj"] = createExportWrapper("dynCall_viijjj");

/** @type {function(...*):?} */
var dynCall_viijjjjiiiiiiiiijiiiiiiiiiji = Module["dynCall_viijjjjiiiiiiiiijiiiiiiiiiji"] = createExportWrapper("dynCall_viijjjjiiiiiiiiijiiiiiiiiiji");

/** @type {function(...*):?} */
var dynCall_iiiiiij = Module["dynCall_iiiiiij"] = createExportWrapper("dynCall_iiiiiij");

/** @type {function(...*):?} */
var dynCall_viijiiiiijiiiii = Module["dynCall_viijiiiiijiiiii"] = createExportWrapper("dynCall_viijiiiiijiiiii");

/** @type {function(...*):?} */
var dynCall_iijiiiiijiiiii = Module["dynCall_iijiiiiijiiiii"] = createExportWrapper("dynCall_iijiiiiijiiiii");

/** @type {function(...*):?} */
var dynCall_vijiiiii = Module["dynCall_vijiiiii"] = createExportWrapper("dynCall_vijiiiii");

/** @type {function(...*):?} */
var dynCall_vijjjjiiiiiiiiijiiiiiiiiiji = Module["dynCall_vijjjjiiiiiiiiijiiiiiiiiiji"] = createExportWrapper("dynCall_vijjjjiiiiiiiiijiiiiiiiiiji");

/** @type {function(...*):?} */
var dynCall_vijjjjiiiiiiiiijiiiiiiiiii = Module["dynCall_vijjjjiiiiiiiiijiiiiiiiiii"] = createExportWrapper("dynCall_vijjjjiiiiiiiiijiiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_viijiii = Module["dynCall_viijiii"] = createExportWrapper("dynCall_viijiii");

/** @type {function(...*):?} */
var dynCall_fijjjji = Module["dynCall_fijjjji"] = createExportWrapper("dynCall_fijjjji");

/** @type {function(...*):?} */
var dynCall_dijjjji = Module["dynCall_dijjjji"] = createExportWrapper("dynCall_dijjjji");

/** @type {function(...*):?} */
var dynCall_vidjii = Module["dynCall_vidjii"] = createExportWrapper("dynCall_vidjii");

/** @type {function(...*):?} */
var dynCall_iiiiiji = Module["dynCall_iiiiiji"] = createExportWrapper("dynCall_iiiiiji");

/** @type {function(...*):?} */
var dynCall_viiiiiijiiiiij = Module["dynCall_viiiiiijiiiiij"] = createExportWrapper("dynCall_viiiiiijiiiiij");

/** @type {function(...*):?} */
var dynCall_vijjdd = Module["dynCall_vijjdd"] = createExportWrapper("dynCall_vijjdd");

/** @type {function(...*):?} */
var dynCall_iijjdd = Module["dynCall_iijjdd"] = createExportWrapper("dynCall_iijjdd");

/** @type {function(...*):?} */
var dynCall_viijiiiii = Module["dynCall_viijiiiii"] = createExportWrapper("dynCall_viijiiiii");

/** @type {function(...*):?} */
var dynCall_iiiijiij = Module["dynCall_iiiijiij"] = createExportWrapper("dynCall_iiiijiij");

/** @type {function(...*):?} */
var dynCall_viiiji = Module["dynCall_viiiji"] = createExportWrapper("dynCall_viiiji");

/** @type {function(...*):?} */
var dynCall_jijd = Module["dynCall_jijd"] = createExportWrapper("dynCall_jijd");

/** @type {function(...*):?} */
var dynCall_vijiiiijii = Module["dynCall_vijiiiijii"] = createExportWrapper("dynCall_vijiiiijii");

/** @type {function(...*):?} */
var dynCall_iiijii = Module["dynCall_iiijii"] = createExportWrapper("dynCall_iiijii");

/** @type {function(...*):?} */
var dynCall_iijjiiii = Module["dynCall_iijjiiii"] = createExportWrapper("dynCall_iijjiiii");

/** @type {function(...*):?} */
var dynCall_vijiiiij = Module["dynCall_vijiiiij"] = createExportWrapper("dynCall_vijiiiij");

/** @type {function(...*):?} */
var dynCall_viijiiiij = Module["dynCall_viijiiiij"] = createExportWrapper("dynCall_viijiiiij");

/** @type {function(...*):?} */
var dynCall_jiiij = Module["dynCall_jiiij"] = createExportWrapper("dynCall_jiiij");

/** @type {function(...*):?} */
var dynCall_viijjji = Module["dynCall_viijjji"] = createExportWrapper("dynCall_viijjji");

/** @type {function(...*):?} */
var dynCall_viijiiiiji = Module["dynCall_viijiiiiji"] = createExportWrapper("dynCall_viijiiiiji");

/** @type {function(...*):?} */
var dynCall_iijiiiijjiiiij = Module["dynCall_iijiiiijjiiiij"] = createExportWrapper("dynCall_iijiiiijjiiiij");

/** @type {function(...*):?} */
var dynCall_iiiiiijiiiij = Module["dynCall_iiiiiijiiiij"] = createExportWrapper("dynCall_iiiiiijiiiij");

/** @type {function(...*):?} */
var dynCall_jijjjji = Module["dynCall_jijjjji"] = createExportWrapper("dynCall_jijjjji");

/** @type {function(...*):?} */
var dynCall_iiiijj = Module["dynCall_iiiijj"] = createExportWrapper("dynCall_iiiijj");

/** @type {function(...*):?} */
var dynCall_iiijj = Module["dynCall_iiijj"] = createExportWrapper("dynCall_iiijj");

var asmGlobalArg = {};
// copied from emscripten js
var asmLibraryArg = { "CompareStringEx": _CompareStringEx, "CompareStringOrdinal": _CompareStringOrdinal, "EnumCalendarInfoExEx": _EnumCalendarInfoExEx, "EnumSystemLocalesEx": _EnumSystemLocalesEx, "EnumTimeFormatsEx": _EnumTimeFormatsEx, "FindNLSStringEx": _FindNLSStringEx, "FindStringOrdinal": _FindStringOrdinal, "GetCalendarInfoEx": _GetCalendarInfoEx, "GetLocaleInfoEx": _GetLocaleInfoEx, "GetUserPreferredUILanguages": _GetUserPreferredUILanguages, "GlobalizationNative_ChangeCase": _GlobalizationNative_ChangeCase, "GlobalizationNative_ChangeCaseInvariant": _GlobalizationNative_ChangeCaseInvariant, "GlobalizationNative_ChangeCaseTurkish": _GlobalizationNative_ChangeCaseTurkish, "GlobalizationNative_GetCalendars": _GlobalizationNative_GetCalendars, "GlobalizationNative_GetDefaultLocaleName": _GlobalizationNative_GetDefaultLocaleName, "GlobalizationNative_GetJapaneseEraStartDate": _GlobalizationNative_GetJapaneseEraStartDate, "GlobalizationNative_GetLatestJapaneseEra": _GlobalizationNative_GetLatestJapaneseEra, "GlobalizationNative_GetLocaleInfoGroupingSizes": _GlobalizationNative_GetLocaleInfoGroupingSizes, "GlobalizationNative_GetLocaleInfoInt": _GlobalizationNative_GetLocaleInfoInt, "GlobalizationNative_GetLocaleInfoString": _GlobalizationNative_GetLocaleInfoString, "GlobalizationNative_GetLocaleName": _GlobalizationNative_GetLocaleName, "GlobalizationNative_GetLocaleTimeFormat": _GlobalizationNative_GetLocaleTimeFormat, "GlobalizationNative_GetLocales": _GlobalizationNative_GetLocales, "GlobalizationNative_GetTimeZoneDisplayName": _GlobalizationNative_GetTimeZoneDisplayName, "GlobalizationNative_NormalizeString": _GlobalizationNative_NormalizeString, "GlobalizationNative_ToAscii": _GlobalizationNative_ToAscii, "GlobalizationNative_ToUnicode": _GlobalizationNative_ToUnicode, "IdnToAscii": _IdnToAscii, "IdnToUnicode": _IdnToUnicode, "LCIDToLocaleName": _LCIDToLocaleName, "LCMapStringEx": _LCMapStringEx, "LocaleNameToLCID": _LocaleNameToLCID, "NormalizeString": _NormalizeString, "ResolveLocaleName": _ResolveLocaleName, "__assert_fail": ___assert_fail, "__cxa_allocate_exception": ___cxa_allocate_exception, "__cxa_atexit": ___cxa_atexit, "__cxa_begin_catch": ___cxa_begin_catch, "__cxa_end_catch": ___cxa_end_catch, "__cxa_find_matching_catch_3": ___cxa_find_matching_catch_3, "__cxa_thread_atexit": ___cxa_thread_atexit, "__cxa_throw": ___cxa_throw, "__cxa_uncaught_exceptions": ___cxa_uncaught_exceptions, "__handle_stack_overflow": ___handle_stack_overflow, "__resumeException": ___resumeException, "__sys_chmod": ___sys_chmod, "__sys_fadvise64_64": ___sys_fadvise64_64, "__sys_fchmod": ___sys_fchmod, "__sys_fcntl64": ___sys_fcntl64, "__sys_fstat64": ___sys_fstat64, "__sys_ftruncate64": ___sys_ftruncate64, "__sys_getcwd": ___sys_getcwd, "__sys_getdents64": ___sys_getdents64, "__sys_getegid32": ___sys_getegid32, "__sys_geteuid32": ___sys_geteuid32, "__sys_getgid32": ___sys_getgid32, "__sys_getpid": ___sys_getpid, "__sys_getrusage": ___sys_getrusage, "__sys_getuid32": ___sys_getuid32, "__sys_ioctl": ___sys_ioctl, "__sys_link": ___sys_link, "__sys_lstat64": ___sys_lstat64, "__sys_madvise1": ___sys_madvise1, "__sys_mkdir": ___sys_mkdir, "__sys_mlock": ___sys_mlock, "__sys_mmap2": ___sys_mmap2, "__sys_mprotect": ___sys_mprotect, "__sys_munlock": ___sys_munlock, "__sys_munmap": ___sys_munmap, "__sys_open": ___sys_open, "__sys_pipe": ___sys_pipe, "__sys_pipe2": ___sys_pipe2, "__sys_poll": ___sys_poll, "__sys_prlimit64": ___sys_prlimit64, "__sys_read": ___sys_read, "__sys_readlink": ___sys_readlink, "__sys_rename": ___sys_rename, "__sys_rmdir": ___sys_rmdir, "__sys_socketcall": ___sys_socketcall, "__sys_stat64": ___sys_stat64, "__sys_ugetrlimit": ___sys_ugetrlimit, "__sys_uname": ___sys_uname, "__sys_unlink": ___sys_unlink, "__sys_utimensat": ___sys_utimensat, "abort": _abort, "atexit": _atexit, "clock_gettime": _clock_gettime, "corert_wasm_invoke_js": _corert_wasm_invoke_js, "corert_wasm_invoke_js_unmarshalled": _corert_wasm_invoke_js_unmarshalled, "deflate": _deflate, "deflateEnd": _deflateEnd, "deflateInit2_": _deflateInit2_, "dladdr": _dladdr, "dlclose": _dlclose, "dlerror": _dlerror, "dlopen": _dlopen, "dlsym": _dlsym, "emscripten_get_callstack": _emscripten_get_callstack, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_resize_heap": _emscripten_resize_heap, "environ_get": _environ_get, "environ_sizes_get": _environ_sizes_get, "exit": _exit, "fd_close": _fd_close, "fd_fdstat_get": _fd_fdstat_get, "fd_read": _fd_read, "fd_seek": _fd_seek, "fd_sync": _fd_sync, "fd_write": _fd_write, "flock": _flock, "gai_strerror": _gai_strerror, "getTempRet0": _getTempRet0, "getaddrinfo": _getaddrinfo, "getnameinfo": _getnameinfo, "getpwuid_r": _getpwuid_r, "gettimeofday": _gettimeofday, "gmtime_r": _gmtime_r, "inflate": _inflate, "inflateEnd": _inflateEnd, "inflateInit2_": _inflateInit2_, "invoke_di": invoke_di, "invoke_did": invoke_did, "invoke_didd": invoke_didd, "invoke_dii": invoke_dii, "invoke_diii": invoke_diii, "invoke_diid": invoke_diid, "__indirect_function_table": wasmTable, "invoke_diiii": invoke_diiii, "invoke_diiiii": invoke_diiiii, "invoke_dij": invoke_dij, "invoke_fi": invoke_fi, "invoke_fid": invoke_fid, "invoke_fidd": invoke_fidd, "invoke_fiff": invoke_fiff, "invoke_i": invoke_i, "invoke_ii": invoke_ii, "invoke_iid": invoke_iid, "invoke_iidd": invoke_iidd, "invoke_iidddd": invoke_iidddd, "invoke_iidddddddd": invoke_iidddddddd, "invoke_iiddi": invoke_iiddi, "invoke_iiddiiiiiiiiii": invoke_iiddiiiiiiiiii, "invoke_iif": invoke_iif, "invoke_iii": invoke_iii, "invoke_iiii": invoke_iiii, "invoke_iiiii": invoke_iiiii, "invoke_iiiiii": invoke_iiiiii, "invoke_iiiiiif": invoke_iiiiiif, "invoke_iiiiiifiiiif": invoke_iiiiiifiiiif, "invoke_iiiiiii": invoke_iiiiiii, "invoke_iiiiiiid": invoke_iiiiiiid, "invoke_iiiiiiidiiiiid": invoke_iiiiiiidiiiiid, "invoke_iiiiiiii": invoke_iiiiiiii, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_iiiiiiiiii": invoke_iiiiiiiiii, "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii, "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii, "invoke_iiiiiiiiiiiii": invoke_iiiiiiiiiiiii, "invoke_iiiiiiiiiiiiii": invoke_iiiiiiiiiiiiii, "invoke_iiiiiiiiiiiiiiiiii": invoke_iiiiiiiiiiiiiiiiii, "invoke_iiiiiiiiiiiiiiiiiiiiiiii": invoke_iiiiiiiiiiiiiiiiiiiiiiii, "invoke_iiiiiiij": invoke_iiiiiiij, "invoke_iiiiiiijiiiiij": invoke_iiiiiiijiiiiij, "invoke_iiiiij": invoke_iiiiij, "invoke_iiiiijiiij": invoke_iiiiijiiij, "invoke_iiiij": invoke_iiiij, "invoke_iiij": invoke_iiij, "invoke_iij": invoke_iij, "invoke_iiji": invoke_iiji, "invoke_iijj": invoke_iijj, "invoke_iijjj": invoke_iijjj, "invoke_iijjji": invoke_iijjji, "invoke_ji": invoke_ji, "invoke_jid": invoke_jid, "invoke_jii": invoke_jii, "invoke_jiii": invoke_jiii, "invoke_jiiii": invoke_jiiii, "invoke_jiiiii": invoke_jiiiii, "invoke_jiiiiiiiii": invoke_jiiiiiiiii, "invoke_jij": invoke_jij, "invoke_jiji": invoke_jiji, "invoke_jijj": invoke_jijj,"invoke_viiiiiiiidiiiiid": invoke_viiiiiiiidiiiiid, "invoke_viiiddddddiiiiiii": invoke_viiiddddddiiiiiii, "invoke_v": invoke_v, "invoke_vi": invoke_vi, "invoke_viiiiiid": invoke_viiiiiid,  "invoke_vid": invoke_vid, "invoke_vidd": invoke_vidd, "invoke_vidddd": invoke_vidddd, "invoke_vidddddd": invoke_vidddddd, "invoke_viddddddddiiiiiii": invoke_viddddddddiiiiiii, "invoke_viddddddiiii": invoke_viddddddiiii, "invoke_viddddii": invoke_viddddii,"invoke_viddi": invoke_viddi,"invoke_viiiiid": invoke_viiiiid,  "invoke_viiddi": invoke_viiddi, "invoke_viddii": invoke_viddii, "invoke_viddiiiiiii": invoke_viddiiiiiii, "invoke_vif": invoke_vif, "invoke_viffffff": invoke_viffffff, "invoke_vii": invoke_vii, "invoke_viid": invoke_viid, "invoke_viidd": invoke_viidd, "invoke_viidddd": invoke_viidddd, "invoke_viiddiiiiiii": invoke_viiddiiiiiii, "invoke_viiddiiiiiiiii": invoke_viiddiiiiiiiii, "invoke_viif": invoke_viif, "invoke_viiffffffffffff": invoke_viiffffffffffff, "invoke_viii": invoke_viii, "invoke_viiid": invoke_viiid, "invoke_viiiddii": invoke_viiiddii, "invoke_viiii": invoke_viiii, "invoke_viiiid": invoke_viiiid, "invoke_viiiii": invoke_viiiii, "invoke_viiiiii": invoke_viiiiii, "invoke_viiiiiifiiiif": invoke_viiiiiifiiiif, "invoke_viiiiiii": invoke_viiiiiii, "invoke_viiiiiiidiiiiid": invoke_viiiiiiidiiiiid, "invoke_viiiiiiii": invoke_viiiiiiii, "invoke_viiiiiiiii": invoke_viiiiiiiii, "invoke_viiiiiiiiii": invoke_viiiiiiiiii, "invoke_viiiiiiiiiii": invoke_viiiiiiiiiii, "invoke_viiiiiiiiiiii": invoke_viiiiiiiiiiii, "invoke_viiiiiiiiiiiii": invoke_viiiiiiiiiiiii, "invoke_viiiiiiiiiiiiiiiiii": invoke_viiiiiiiiiiiiiiiiii, "invoke_viiiiiiiiiiiij": invoke_viiiiiiiiiiiij, "invoke_viiiiiiiiiiiiji": invoke_viiiiiiiiiiiiji, "invoke_viiiiiiij": invoke_viiiiiiij, "invoke_viiiiiiijiiiiij": invoke_viiiiiiijiiiiij, "invoke_viiiiiij": invoke_viiiiiij, "invoke_viiiiiijj": invoke_viiiiiijj, "invoke_viiiiij": invoke_viiiiij, "invoke_viiiiijj": invoke_viiiiijj, "invoke_viiiij": invoke_viiiij, "invoke_viiij": invoke_viiij, "invoke_viij": invoke_viij, "invoke_viiji": invoke_viiji, "invoke_viijj": invoke_viijj, "invoke_vij": invoke_vij, "invoke_viji": invoke_viji, "invoke_vijiiii": invoke_vijiiii, "invoke_vijj": invoke_vijj, "invoke_vijjjjiiiiiiiiijiiiiiiiiii": invoke_vijjjjiiiiiiiiijiiiiiiiiii, "memory": wasmMemory, "mktime": _mktime, "nanosleep": _nanosleep, "pthread_attr_destroy": _pthread_attr_destroy, "pthread_attr_getstack": _pthread_attr_getstack, "pthread_attr_init": _pthread_attr_init, "pthread_attr_setdetachstate": _pthread_attr_setdetachstate, "pthread_attr_setstacksize": _pthread_attr_setstacksize, "pthread_condattr_destroy": _pthread_condattr_destroy, "pthread_condattr_init": _pthread_condattr_init, "pthread_condattr_setclock": _pthread_condattr_setclock, "pthread_create": _pthread_create, "pthread_getattr_np": _pthread_getattr_np, "pthread_rwlock_destroy": _pthread_rwlock_destroy, "pthread_rwlock_init": _pthread_rwlock_init, "pthread_rwlock_rdlock": _pthread_rwlock_rdlock, "pthread_rwlock_unlock": _pthread_rwlock_unlock, "pthread_rwlock_wrlock": _pthread_rwlock_wrlock, "pthread_setcancelstate": _pthread_setcancelstate, "setTempRet0": _setTempRet0, "sigaction": _sigaction, "signal": _signal, "strftime": _strftime, "sysconf": _sysconf, "table": wasmTable, "time": _time, "ucol_closeElements_62": _ucol_closeElements_62, "ucol_close_62": _ucol_close_62, "ucol_getRules_62": _ucol_getRules_62, "ucol_getSortKey_62": _ucol_getSortKey_62, "ucol_getStrength_62": _ucol_getStrength_62, "ucol_next_62": _ucol_next_62, "ucol_openElements_62": _ucol_openElements_62, "ucol_openRules_62": _ucol_openRules_62, "ucol_open_62": _ucol_open_62, "ucol_previous_62": _ucol_previous_62, "ucol_safeClone_62": _ucol_safeClone_62, "ucol_setAttribute_62": _ucol_setAttribute_62, "ucol_setVariableTop_62": _ucol_setVariableTop_62, "ucol_strcoll_62": _ucol_strcoll_62, "usearch_close_62": _usearch_close_62, "usearch_first_62": _usearch_first_62, "usearch_getMatchedLength_62": _usearch_getMatchedLength_62, "usearch_last_62": _usearch_last_62, "usearch_openFromCollator_62": _usearch_openFromCollator_62 };

// mono's args, standard seems to have the full names
/*
var asmLibraryArg = {
    "Ib": abort,
    "l": setTempRet0,
    "i": ___assert_fail,
    "gb": ___buildEnvironment,
    "Ya": ___clock_gettime,
    "Oa": ___cxa_allocate_exception,
    "Ga": ___cxa_throw,
    "p": ___lock,
    "K": ___setErrNo,
    "la": ___syscall10,
    "j": ___syscall102,
    "Hb": ___syscall118,
    "yb": ___syscall12,
    "ub": ___syscall122,
    "T": ___syscall140,
    "nb": ___syscall142,
    "jb": ___syscall144,
    "ib": ___syscall145,
    "Q": ___syscall146,
    "P": ___syscall15,
    "hb": ___syscall168,
    "fb": ___syscall183,
    "eb": ___syscall192,
    "db": ___syscall194,
    "O": ___syscall195,
    "cb": ___syscall196,
    "bb": ___syscall197,
    "ab": ___syscall199,
    "$a": ___syscall20,
    "_a": ___syscall201,
    "Za": ___syscall202,
    "Xa": ___syscall209,
    "Wa": ___syscall220,
    "f": ___syscall221,
    "Va": ___syscall268,
    "Ua": ___syscall272,
    "Ta": ___syscall3,
    "Sa": ___syscall320,
    "Ra": ___syscall33,
    "Qa": ___syscall38,
    "Pa": ___syscall39,
    "Na": ___syscall4,
    "Ma": ___syscall40,
    "La": ___syscall41,
    "Ka": ___syscall42,
    "N": ___syscall5,
    "w": ___syscall54,
    "s": ___syscall6,
    "Ja": ___syscall63,
    "Ia": ___syscall77,
    "Ha": ___syscall85,
    "Fa": ___syscall9,
    "Ea": ___syscall91,
    "Da": ___syscall94,
    "Ca": ___syscall96,
    "Ba": ___syscall97,
    "o": ___unlock,
    "b": _abort,
    "Aa": _atexit,
    "za": _clock_getres,
    "ya": _clock_gettime,
    "r": _emscripten_asm_const_i,
    "xa": _emscripten_asm_const_iii,
    "wa": _emscripten_get_heap_size,
    "va": _emscripten_memcpy_big,
    "ua": _emscripten_resize_heap,
    "k": _exit,
    "ta": _fork,
    "sa": _getaddrinfo,
    "M": _getenv,
    "L": _getnameinfo,
    "ra": _getprotobyname,
    "qa": _getpwuid,
    "m": _gettimeofday,
    "pa": _gmtime_r,
    "oa": _kill,
    "na": _llvm_log10_f32,
    "ma": _llvm_log10_f64,
    "B": _llvm_trap,
    "J": _llvm_trunc_f32,
    "I": _llvm_trunc_f64,
    "e": _localtime_r,
    "ka": _mono_set_timeout,
    "ja": _mono_wasm_add_array_item,
    "mb": _mono_wasm_add_array_var,
    "ia": _mono_wasm_add_bool_var,
    "H": _mono_wasm_add_float_var,
    "ha": _mono_wasm_add_frame,
    "A": _mono_wasm_add_int_var,
    "lb": _mono_wasm_add_long_var,
    "kb": _mono_wasm_add_obj_var,
    "G": _mono_wasm_add_properties_var,
    "v": _mono_wasm_add_string_var,
    "ga": _mono_wasm_bind_core_object,
    "fa": _mono_wasm_bind_host_object,
    "ea": _mono_wasm_fire_bp,
    "da": _mono_wasm_get_by_index,
    "ca": _mono_wasm_get_global_object,
    "ba": _mono_wasm_get_object_property,
    "aa": _mono_wasm_invoke_js_marshalled,
    "$": _mono_wasm_invoke_js_unmarshalled,
    "_": _mono_wasm_invoke_js_with_args,
    "Z": _mono_wasm_new,
    "Y": _mono_wasm_new_object,
    "Gb": _mono_wasm_release_handle,
    "Fb": _mono_wasm_release_object,
    "Eb": _mono_wasm_set_by_index,
    "Db": _mono_wasm_set_object_property,
    "Cb": _mono_wasm_typed_array_copy_from,
    "Bb": _mono_wasm_typed_array_copy_to,
    "Ab": _mono_wasm_typed_array_from,
    "zb": _mono_wasm_typed_array_to_array,
    "u": _nanosleep,
    "h": _pthread_cleanup_pop,
    "g": _pthread_cleanup_push,
    "xb": _pthread_cond_destroy,
    "X": _pthread_cond_init,
    "wb": _pthread_cond_signal,
    "vb": _pthread_cond_timedwait,
    "q": _pthread_cond_wait,
    "F": _pthread_mutexattr_destroy,
    "E": _pthread_mutexattr_init,
    "D": _pthread_mutexattr_setprotocol,
    "C": _pthread_mutexattr_settype,
    "z": _pthread_setcancelstate,
    "tb": _schedule_background_exec,
    "sb": _sem_destroy,
    "W": _sem_init,
    "V": _sem_post,
    "U": _sem_trywait,
    "t": _sem_wait,
    "rb": _setenv,
    "y": _sigaction,
    "x": _sigemptyset,
    "d": _strftime,
    "n": _sysconf,
    "c": _time,
    "qb": _unsetenv,
    "S": _utime,
    "R": _utimes,
    "pb": _waitpid,
    "ob": abortOnCannotGrowMemory,
    "a": DYNAMICTOP_PTR
};
*/
var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
Module["asm"] = asm;

/* replace with standard emscripten */
/** @type {function(...*):?} */
var _memalign = Module["_memalign"] = createExportWrapper("memalign");

/** @type {function(...*):?} */
var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = createExportWrapper("emscripten_main_thread_process_queued_calls");

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiiiij = Module["dynCall_viiiiiiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiiiiiij");

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiiiiji = Module["dynCall_viiiiiiiiiiiiji"] = createExportWrapper("dynCall_viiiiiiiiiiiiji");

/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = createExportWrapper("malloc");

/** @type {function(...*):?} */
var _memset = Module["_memset"] = createExportWrapper("memset");

/** @type {function(...*):?} */
var _corert_wasm_invoke_method = Module["_corert_wasm_invoke_method"] = createExportWrapper("corert_wasm_invoke_method");

var _uno_windows_ui_core_coredispatcher_dispatchercallback = Module["_uno_windows_ui_core_coredispatcher_dispatchercallback"] = createExportWrapper("uno_windows_ui_core_coredispatcher_dispatchercallback");

/** @type {function(...*):?} */
var _memcpy = Module["_memcpy"] = createExportWrapper("memcpy");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");


/** @type {function(...*):?} */
var _free = Module["_free"] = createExportWrapper("free");

/** @type {function(...*):?} */
var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

/*
var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = function() {
    return Module["asm"]["Jb"].apply(null, arguments)
}
;
var ___errno_location = Module["___errno_location"] = function() {
    return Module["asm"]["Kb"].apply(null, arguments)
}
;
var __get_daylight = Module["__get_daylight"] = function() {
    return Module["asm"]["Lb"].apply(null, arguments)
}
;
var __get_environ = Module["__get_environ"] = function() {
    return Module["asm"]["Mb"].apply(null, arguments)
}
;
var __get_timezone = Module["__get_timezone"] = function() {
    return Module["asm"]["Nb"].apply(null, arguments)
}
;
var __get_tzname = Module["__get_tzname"] = function() {
    return Module["asm"]["Ob"].apply(null, arguments)
}
;
var _free = Module["_free"] = function() {
    return Module["asm"]["Pb"].apply(null, arguments)
}
;
var _htonl = Module["_htonl"] = function() {
    return Module["asm"]["Qb"].apply(null, arguments)
}
;
var _htons = Module["_htons"] = function() {
    return Module["asm"]["Rb"].apply(null, arguments)
}
;
var _malloc = Module["_malloc"] = function() {
    return Module["asm"]["Sb"].apply(null, arguments)
}
;
var _memalign = Module["_memalign"] = function() {
    return Module["asm"]["Tb"].apply(null, arguments)
}
;
var _memset = Module["_memset"] = function() {
    return Module["asm"]["Ub"].apply(null, arguments)
}
;
var _mono_background_exec = Module["_mono_background_exec"] = function() {
    return Module["asm"]["Vb"].apply(null, arguments)
}
;
var _mono_print_method_from_ip = Module["_mono_print_method_from_ip"] = function() {
    return Module["asm"]["Wb"].apply(null, arguments)
}
;
var _mono_set_timeout_exec = Module["_mono_set_timeout_exec"] = function() {
    return Module["asm"]["Xb"].apply(null, arguments)
}
;
var _mono_unbox_int = Module["_mono_unbox_int"] = function() {
    return Module["asm"]["Yb"].apply(null, arguments)
}
;
var _mono_wasm_add_assembly = Module["_mono_wasm_add_assembly"] = function() {
    return Module["asm"]["Zb"].apply(null, arguments)
}
;
var _mono_wasm_array_get = Module["_mono_wasm_array_get"] = function() {
    return Module["asm"]["_b"].apply(null, arguments)
}
;
var _mono_wasm_array_length = Module["_mono_wasm_array_length"] = function() {
    return Module["asm"]["$b"].apply(null, arguments)
}
;
var _mono_wasm_assembly_find_class = Module["_mono_wasm_assembly_find_class"] = function() {
    return Module["asm"]["ac"].apply(null, arguments)
}
;
var _mono_wasm_assembly_find_method = Module["_mono_wasm_assembly_find_method"] = function() {
    return Module["asm"]["bc"].apply(null, arguments)
}
;
var _mono_wasm_assembly_get_entry_point = Module["_mono_wasm_assembly_get_entry_point"] = function() {
    return Module["asm"]["cc"].apply(null, arguments)
}
;
var _mono_wasm_assembly_load = Module["_mono_wasm_assembly_load"] = function() {
    return Module["asm"]["dc"].apply(null, arguments)
}
;
var _mono_wasm_clear_all_breakpoints = Module["_mono_wasm_clear_all_breakpoints"] = function() {
    return Module["asm"]["ec"].apply(null, arguments)
}
;
var _mono_wasm_current_bp_id = Module["_mono_wasm_current_bp_id"] = function() {
    return Module["asm"]["fc"].apply(null, arguments)
}
;
var _mono_wasm_enum_frames = Module["_mono_wasm_enum_frames"] = function() {
    return Module["asm"]["gc"].apply(null, arguments)
}
;
var _mono_wasm_exec_regression = Module["_mono_wasm_exec_regression"] = function() {
    return Module["asm"]["hc"].apply(null, arguments)
}
;
var _mono_wasm_exit = Module["_mono_wasm_exit"] = function() {
    return Module["asm"]["ic"].apply(null, arguments)
}
;
var _mono_wasm_get_array_values = Module["_mono_wasm_get_array_values"] = function() {
    return Module["asm"]["jc"].apply(null, arguments)
}
;
var _mono_wasm_get_obj_type = Module["_mono_wasm_get_obj_type"] = function() {
    return Module["asm"]["kc"].apply(null, arguments)
}
;
var _mono_wasm_get_object_properties = Module["_mono_wasm_get_object_properties"] = function() {
    return Module["asm"]["lc"].apply(null, arguments)
}
;
var _mono_wasm_get_var_info = Module["_mono_wasm_get_var_info"] = function() {
    return Module["asm"]["mc"].apply(null, arguments)
}
;
var _mono_wasm_invoke_method = Module["_mono_wasm_invoke_method"] = function() {
    return Module["asm"]["nc"].apply(null, arguments)
}
;
var _mono_wasm_load_runtime = Module["_mono_wasm_load_runtime"] = function() {
    return Module["asm"]["oc"].apply(null, arguments)
}
;
var _mono_wasm_obj_array_new = Module["_mono_wasm_obj_array_new"] = function() {
    return Module["asm"]["pc"].apply(null, arguments)
}
;
var _mono_wasm_obj_array_set = Module["_mono_wasm_obj_array_set"] = function() {
    return Module["asm"]["qc"].apply(null, arguments)
}
;
var _mono_wasm_parse_runtime_options = Module["_mono_wasm_parse_runtime_options"] = function() {
    return Module["asm"]["rc"].apply(null, arguments)
}
;
var _mono_wasm_remove_breakpoint = Module["_mono_wasm_remove_breakpoint"] = function() {
    return Module["asm"]["sc"].apply(null, arguments)
}
;
var _mono_wasm_set_breakpoint = Module["_mono_wasm_set_breakpoint"] = function() {
    return Module["asm"]["tc"].apply(null, arguments)
}
;
var _mono_wasm_set_main_args = Module["_mono_wasm_set_main_args"] = function() {
    return Module["asm"]["uc"].apply(null, arguments)
}
;
var _mono_wasm_setenv = Module["_mono_wasm_setenv"] = function() {
    return Module["asm"]["vc"].apply(null, arguments)
}
;
var _mono_wasm_setup_single_step = Module["_mono_wasm_setup_single_step"] = function() {
    return Module["asm"]["wc"].apply(null, arguments)
}
;
var _mono_wasm_strdup = Module["_mono_wasm_strdup"] = function() {
    return Module["asm"]["xc"].apply(null, arguments)
}
;
var _mono_wasm_string_array_new = Module["_mono_wasm_string_array_new"] = function() {
    return Module["asm"]["yc"].apply(null, arguments)
}
;
var _mono_wasm_string_from_js = Module["_mono_wasm_string_from_js"] = function() {
    return Module["asm"]["zc"].apply(null, arguments)
}
;
var _mono_wasm_string_get_utf8 = Module["_mono_wasm_string_get_utf8"] = function() {
    return Module["asm"]["Ac"].apply(null, arguments)
}
;
var _mono_wasm_typed_array_new = Module["_mono_wasm_typed_array_new"] = function() {
    return Module["asm"]["Bc"].apply(null, arguments)
}
;
var _mono_wasm_unbox_enum = Module["_mono_wasm_unbox_enum"] = function() {
    return Module["asm"]["Cc"].apply(null, arguments)
}
;
var _mono_wasm_unbox_float = Module["_mono_wasm_unbox_float"] = function() {
    return Module["asm"]["Dc"].apply(null, arguments)
}
;
var _ntohs = Module["_ntohs"] = function() {
    return Module["asm"]["Ec"].apply(null, arguments)
}
;
var _putchar = Module["_putchar"] = function() {
    return Module["asm"]["Fc"].apply(null, arguments)
}
;
var _wasm_get_stack_base = Module["_wasm_get_stack_base"] = function() {
    return Module["asm"]["Gc"].apply(null, arguments)
}
;
var _wasm_get_stack_size = Module["_wasm_get_stack_size"] = function() {
    return Module["asm"]["Hc"].apply(null, arguments)
}
;
/*
var stackAlloc = Module["stackAlloc"] = function() {
    return Module["asm"]["Ke"].apply(null, arguments)
}
;
var stackRestore = Module["stackRestore"] = function() {
    return Module["asm"]["Le"].apply(null, arguments)
}
;
var stackSave = Module["stackSave"] = function() {
    return Module["asm"]["Me"].apply(null, arguments)
}
;
*/
/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

/** @type {function(...*):?} */
var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = createExportWrapper("_ZSt18uncaught_exceptionv");

/** @type {function(...*):?} */
var ___cxa_can_catch = Module["___cxa_can_catch"] = createExportWrapper("__cxa_can_catch");

/** @type {function(...*):?} */
var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = createExportWrapper("__cxa_is_pointer_type");

function invoke_viii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}


function invoke_vii(index,a1,a2) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}


function invoke_iiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index,a1) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index,a1) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_di(index,a1) {
  var sp = stackSave();
  try {
    return dynCall_di(index,a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiii(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viidd(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    dynCall_viidd(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiffffffffffff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14) {
  var sp = stackSave();
  try {
    dynCall_viiffffffffffff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vidd(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    dynCall_vidd(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_didd(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_didd(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vid(index,a1,a2) {
  var sp = stackSave();
  try {
    dynCall_vid(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddddii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_viddddii(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viid(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    dynCall_viid(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}


function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_diid(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return wasmTable.get(index)(a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_dii(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_dii(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddddddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    dynCall_viddddddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    dynCall_viiddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    dynCall_viiddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_diii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_diii(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_diiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_diiiii(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_diiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_diiii(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iid(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_iid(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vidddddd(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_vidddddd(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iidd(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_iidd(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vidddd(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_vidddd(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_fi(index,a1) {
  var sp = stackSave();
  try {
    return dynCall_fi(index,a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vif(index,a1,a2) {
  var sp = stackSave();
  try {
    dynCall_vif(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiid(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_viiiid(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiid(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    dynCall_viiid(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_did(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_did(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_fidd(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_fidd(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_fid(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_fid(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiddi(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiid(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddi(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    dynCall_viddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    return dynCall_iidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viidddd(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    dynCall_viidddd(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiddii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_viiiddii(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_viddii(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    return dynCall_iiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viffffff(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_viffffff(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viddddddddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16) {
  var sp = stackSave();
  try {
    dynCall_viddddddddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiddi(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_iiddi(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iidddd(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_iidddd(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viif(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    dynCall_viif(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiifiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  var sp = stackSave();
  try {
    dynCall_viiiiiifiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiidiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiidiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iif(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_iif(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiif(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiif(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiid(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiid(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiidiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiidiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiifiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiifiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_fiff(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_fiff(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_v(index) {
  var sp = stackSave();
  try {
    dynCall_v(index);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_i(index) {
  var sp = stackSave();
  try {
    return dynCall_i(index);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiij(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_iiiij(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iij(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_iij(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vij(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    dynCall_vij(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_ji(index,a1) {
  var sp = stackSave();
  try {
    return dynCall_ji(index,a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viji(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    dynCall_viji(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jid(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_jid(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viij(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    dynCall_viij(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiij(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiji(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_jiji(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jii(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_jii(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iijj(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_iijj(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jijj(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_jijj(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jij(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_jij(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiij(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_iiij(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiij(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_viiij(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    return dynCall_jiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiiiiiiiji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiiiiiiji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_dij(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_dij(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiji(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_viiji(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viijj(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    dynCall_viijj(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vijj(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    dynCall_vijj(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    dynCall_viiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiij(index,a1,a2,a3,a4,a5,a6) {
  var sp = stackSave();
  try {
    dynCall_viiiij(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iijjj(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    return dynCall_iijjj(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iijjji(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    return dynCall_iijjji(index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiijj(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    dynCall_viiiiijj(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiij(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_viiiiij(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_jiii(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiji(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_iiji(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiiijiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiijiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiijiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  var sp = stackSave();
  try {
    return dynCall_iiiiijiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiijiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiiijiiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_jiiiii(index,a1,a2,a3,a4,a5) {
  var sp = stackSave();
  try {
    return dynCall_jiiiii(index,a1,a2,a3,a4,a5);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiijj(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  var sp = stackSave();
  try {
    dynCall_viiiiiijj(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vijiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    dynCall_vijiiii(index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vijjjjiiiiiiiiijiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30) {
  var sp = stackSave();
  try {
    dynCall_vijjjjiiiiiiiiijiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiiddddddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiiiiiiidiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiiiiid(index,a1,a2,a3,a4,a5,a6,a7) {
  var sp = stackSave();
  try {
    wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}
function invoke_jiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_jiiii(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

/* replaced with standard emscripten calls

var dynCall_X = Module["dynCall_X"] = function() {
    return Module["asm"]["Ic"].apply(null, arguments)
}
;
var dynCall_d = Module["dynCall_d"] = function() {
    return Module["asm"]["Jc"].apply(null, arguments)
}
;
var dynCall_dd = Module["dynCall_dd"] = function() {
    return Module["asm"]["Kc"].apply(null, arguments)
}
;
var dynCall_ddd = Module["dynCall_ddd"] = function() {
    return Module["asm"]["Lc"].apply(null, arguments)
}
;
var dynCall_ddi = Module["dynCall_ddi"] = function() {
    return Module["asm"]["Mc"].apply(null, arguments)
}
;
var dynCall_di = Module["dynCall_di"] = function() {
    return Module["asm"]["Nc"].apply(null, arguments)
}
;
var dynCall_did = Module["dynCall_did"] = function() {
    return Module["asm"]["Oc"].apply(null, arguments)
}
;
var dynCall_didd = Module["dynCall_didd"] = function() {
    return Module["asm"]["Pc"].apply(null, arguments)
}
;
var dynCall_ff = Module["dynCall_ff"] = function() {
    return Module["asm"]["Qc"].apply(null, arguments)
}
;
var dynCall_fff = Module["dynCall_fff"] = function() {
    return Module["asm"]["Rc"].apply(null, arguments)
}
;
var dynCall_ffi = Module["dynCall_ffi"] = function() {
    return Module["asm"]["Sc"].apply(null, arguments)
}
;
var dynCall_fi = Module["dynCall_fi"] = function() {
    return Module["asm"]["Tc"].apply(null, arguments)
}
;
var dynCall_fif = Module["dynCall_fif"] = function() {
    return Module["asm"]["Uc"].apply(null, arguments)
}
;
var dynCall_fiff = Module["dynCall_fiff"] = function() {
    return Module["asm"]["Vc"].apply(null, arguments)
}
;
var dynCall_i = Module["dynCall_i"] = function() {
    return Module["asm"]["Wc"].apply(null, arguments)
}
;
var dynCall_id = Module["dynCall_id"] = function() {
    return Module["asm"]["Xc"].apply(null, arguments)
}
;
var dynCall_idiii = Module["dynCall_idiii"] = function() {
    return Module["asm"]["Yc"].apply(null, arguments)
}
;
var dynCall_iffffffi = Module["dynCall_iffffffi"] = function() {
    return Module["asm"]["Zc"].apply(null, arguments)
}
;
var dynCall_iffii = Module["dynCall_iffii"] = function() {
    return Module["asm"]["_c"].apply(null, arguments)
}
;
var dynCall_ii = Module["dynCall_ii"] = function() {
    return Module["asm"]["$c"].apply(null, arguments)
}
;
var dynCall_iif = Module["dynCall_iif"] = function() {
    return Module["asm"]["ad"].apply(null, arguments)
}
;
var dynCall_iiff = Module["dynCall_iiff"] = function() {
    return Module["asm"]["bd"].apply(null, arguments)
}
;
var dynCall_iifff = Module["dynCall_iifff"] = function() {
    return Module["asm"]["cd"].apply(null, arguments)
}
;
var dynCall_iiffffff = Module["dynCall_iiffffff"] = function() {
    return Module["asm"]["dd"].apply(null, arguments)
}
;
var dynCall_iiffffffff = Module["dynCall_iiffffffff"] = function() {
    return Module["asm"]["ed"].apply(null, arguments)
}
;
var dynCall_iiffffi = Module["dynCall_iiffffi"] = function() {
    return Module["asm"]["fd"].apply(null, arguments)
}
;
var dynCall_iiffffii = Module["dynCall_iiffffii"] = function() {
    return Module["asm"]["gd"].apply(null, arguments)
}
;
var dynCall_iifffi = Module["dynCall_iifffi"] = function() {
    return Module["asm"]["hd"].apply(null, arguments)
}
;
var dynCall_iiffi = Module["dynCall_iiffi"] = function() {
    return Module["asm"]["id"].apply(null, arguments)
}
;
var dynCall_iiffii = Module["dynCall_iiffii"] = function() {
    return Module["asm"]["jd"].apply(null, arguments)
}
;
var dynCall_iiffiii = Module["dynCall_iiffiii"] = function() {
    return Module["asm"]["kd"].apply(null, arguments)
}
;
var dynCall_iifi = Module["dynCall_iifi"] = function() {
    return Module["asm"]["ld"].apply(null, arguments)
}
;
var dynCall_iifii = Module["dynCall_iifii"] = function() {
    return Module["asm"]["md"].apply(null, arguments)
}
;
var dynCall_iifiii = Module["dynCall_iifiii"] = function() {
    return Module["asm"]["nd"].apply(null, arguments)
}
;
var dynCall_iij = Module["dynCall_iij"] = function() {
    return Module["asm"]["Rd"].apply(null, arguments)
}
;
var dynCall_iiji = Module["dynCall_iiji"] = function() {
    return Module["asm"]["Sd"].apply(null, arguments)
}
;
var dynCall_iijiiii = Module["dynCall_iijiiii"] = function() {
    return Module["asm"]["Td"].apply(null, arguments)
}
;
var dynCall_iijiiiii = Module["dynCall_iijiiiii"] = function() {
    return Module["asm"]["Ud"].apply(null, arguments)
}
;
var dynCall_iijjji = Module["dynCall_iijjji"] = function() {
    return Module["asm"]["Vd"].apply(null, arguments)
}
;
var dynCall_iji = Module["dynCall_iji"] = function() {
    return Module["asm"]["Wd"].apply(null, arguments)
}
;
var dynCall_j = Module["dynCall_j"] = function() {
    return Module["asm"]["Xd"].apply(null, arguments)
}
;
var dynCall_jd = Module["dynCall_jd"] = function() {
    return Module["asm"]["Yd"].apply(null, arguments)
}
;
var dynCall_jf = Module["dynCall_jf"] = function() {
    return Module["asm"]["Zd"].apply(null, arguments)
}
;
var dynCall_ji = Module["dynCall_ji"] = function() {
    return Module["asm"]["_d"].apply(null, arguments)
}
;
var dynCall_jii = Module["dynCall_jii"] = function() {
    return Module["asm"]["$d"].apply(null, arguments)
}
;
var dynCall_jiii = Module["dynCall_jiii"] = function() {
    return Module["asm"]["ae"].apply(null, arguments)
}
;
var dynCall_jiij = Module["dynCall_jiij"] = function() {
    return Module["asm"]["be"].apply(null, arguments)
}
;
var dynCall_jij = Module["dynCall_jij"] = function() {
    return Module["asm"]["ce"].apply(null, arguments)
}
;
var dynCall_jiji = Module["dynCall_jiji"] = function() {
    return Module["asm"]["de"].apply(null, arguments)
}
;
var dynCall_jijii = Module["dynCall_jijii"] = function() {
    return Module["asm"]["ee"].apply(null, arguments)
}
;
var dynCall_jijj = Module["dynCall_jijj"] = function() {
    return Module["asm"]["fe"].apply(null, arguments)
}
;
var dynCall_jj = Module["dynCall_jj"] = function() {
    return Module["asm"]["ge"].apply(null, arguments)
}
;
var dynCall_v = Module["dynCall_v"] = function() {
    return Module["asm"]["he"].apply(null, arguments)
}
;
var dynCall_vj = Module["dynCall_vj"] = function() {
    return Module["asm"]["Je"].apply(null, arguments)
}
;
Module["dynCall_X"] = dynCall_X;
Module["dynCall_d"] = dynCall_d;
Module["dynCall_dd"] = dynCall_dd;
Module["dynCall_ddd"] = dynCall_ddd;
Module["dynCall_ddi"] = dynCall_ddi;
Module["dynCall_di"] = dynCall_di;
Module["dynCall_did"] = dynCall_did;
Module["dynCall_didd"] = dynCall_didd;
Module["dynCall_ff"] = dynCall_ff;
Module["dynCall_fff"] = dynCall_fff;
Module["dynCall_ffi"] = dynCall_ffi;
Module["dynCall_fi"] = dynCall_fi;
Module["dynCall_fif"] = dynCall_fif;
Module["dynCall_fiff"] = dynCall_fiff;
Module["dynCall_i"] = dynCall_i;
Module["dynCall_id"] = dynCall_id;
Module["dynCall_idiii"] = dynCall_idiii;
Module["dynCall_iffffffi"] = dynCall_iffffffi;
Module["dynCall_iffii"] = dynCall_iffii;
Module["dynCall_ii"] = dynCall_ii;
Module["dynCall_iif"] = dynCall_iif;
Module["dynCall_iiff"] = dynCall_iiff;
Module["dynCall_iifff"] = dynCall_iifff;
Module["dynCall_iiffffff"] = dynCall_iiffffff;
Module["dynCall_iiffffffff"] = dynCall_iiffffffff;
Module["dynCall_iiffffi"] = dynCall_iiffffi;
Module["dynCall_iiffffii"] = dynCall_iiffffii;
Module["dynCall_iifffi"] = dynCall_iifffi;
Module["dynCall_iiffi"] = dynCall_iiffi;
Module["dynCall_iiffii"] = dynCall_iiffii;
Module["dynCall_iiffiii"] = dynCall_iiffiii;
Module["dynCall_iifi"] = dynCall_iifi;
Module["dynCall_iifii"] = dynCall_iifii;
Module["dynCall_iifiii"] = dynCall_iifiii;
Module["dynCall_iij"] = dynCall_iij;
Module["dynCall_iiji"] = dynCall_iiji;
Module["dynCall_iijiiii"] = dynCall_iijiiii;
Module["dynCall_iijiiiii"] = dynCall_iijiiiii;
Module["dynCall_iijjji"] = dynCall_iijjji;
Module["dynCall_iji"] = dynCall_iji;
Module["dynCall_j"] = dynCall_j;
Module["dynCall_jd"] = dynCall_jd;
Module["dynCall_jf"] = dynCall_jf;
Module["dynCall_ji"] = dynCall_ji;
Module["dynCall_jii"] = dynCall_jii;
Module["dynCall_jiii"] = dynCall_jiii;
Module["dynCall_jiij"] = dynCall_jiij;
Module["dynCall_jij"] = dynCall_jij;
Module["dynCall_jiji"] = dynCall_jiji;
Module["dynCall_jijii"] = dynCall_jijii;
Module["dynCall_jijj"] = dynCall_jijj;
Module["dynCall_jj"] = dynCall_jj;
Module["dynCall_v"] = dynCall_v;
Module["dynCall_vi"] = dynCall_vi;
Module["dynCall_vid"] = dynCall_vid;
Module["dynCall_vif"] = dynCall_vif;
Module["dynCall_viff"] = dynCall_viff;
Module["dynCall_viffff"] = dynCall_viffff;
Module["dynCall_vifffff"] = dynCall_vifffff;
Module["dynCall_viffffff"] = dynCall_viffffff;
Module["dynCall_vifffffi"] = dynCall_vifffffi;
Module["dynCall_vii"] = dynCall_vii;
Module["dynCall_viidiii"] = dynCall_viidiii;
*/
Module["asm"] = asm;
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
Module["setValue"] = setValue;
Module["getValue"] = getValue;
Module["UTF8ToString"] = UTF8ToString;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["addFunction"] = addFunction;
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;


function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
dependenciesFulfilled = function runCaller() {
    if (!Module["calledRun"])
        run();
    if (!Module["calledRun"])
        dependenciesFulfilled = runCaller
}
;
function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = Module['_main'];


  args = args || [];

  var argc = args.length+1;
  var argv = stackAlloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;

  try {

    Module['___set_stack_limit'](STACK_MAX);

    var ret = entryFunction(argc, argv);


    // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as execution is asynchronously handed
    // off to a pthread.
    // if we're not running an evented main loop, it's time to exit
      exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'unwind') {
      // running an evented main loop, don't immediately exit
      noExitRuntime = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      err('exception thrown: ' + toLog);
      quit_(1, e);
    }
  } finally {
    calledMain = true;
  }
}

function run(args) {
    args = args || Module["arguments"];
    if (runDependencies > 0) {
        return
    }

    writeStackCookie();

    preRun();
    if (runDependencies > 0)
        return;
    if (Module["calledRun"])
        return;
    function doRun() {
        if (Module["calledRun"])
            return;
        Module["calledRun"] = true;
        if (ABORT)
            return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"])
            Module["onRuntimeInitialized"]();
//            if (shouldRunNow) callMain(args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
            setTimeout(function() {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
      checkStackCookie();
}
Module["run"] = run;
function exit(status, implicit) {
    if (implicit && Module["noExitRuntime"] && status === 0) {
        return
    }
    if (Module["noExitRuntime"]) {} else {
        ABORT = true;
        EXITSTATUS = status;
        exitRuntime();
        if (Module["onExit"])
            Module["onExit"](status)
    }
    Module["quit"](status, new ExitStatus(status))
}
function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    if (what !== undefined) {
        out(what);
        err(what);
        what = JSON.stringify(what)
    } else {
        what = ""
    }
    ABORT = true;
    EXITSTATUS = 1;
    throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info."
}
Module["abort"] = abort;
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

Module["noExitRuntime"] = true;

// add Uno.UI.js
var Uno;
(function (Uno) {
    var Utils;
    (function (Utils) {
        class Clipboard {
            static setText(text) {
                const nav = navigator;
                if (nav.clipboard) {
                    // Use clipboard object when available
                    nav.clipboard.setText(text);
                }
                else {
                    // Hack when the clipboard is not available
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                }
                return "ok";
            }
        }
        Utils.Clipboard = Clipboard;
    })(Utils = Uno.Utils || (Uno.Utils = {}));
})(Uno || (Uno = {}));
var Windows;
(function (Windows) {
    var UI;
    (function (UI) {
        var Xaml;
        (function (Xaml) {
            class Application {
                static getDefaultSystemTheme() {
                    if (window.matchMedia) {
                        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                            return Xaml.ApplicationTheme.Dark;
                        }
                        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                            return Xaml.ApplicationTheme.Light;
                        }
                    }
                    return null;
                }
                static observeSystemTheme() {
                    /*
                    if (!this.dispatchThemeChange) {
                        this.dispatchThemeChange = Module.mono_bind_static_method("[Uno.UI] Windows.UI.Xaml.Application:DispatchSystemThemeChange");
                    }
                    if (window.matchMedia) {
                        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
                            Application.dispatchThemeChange();
                        });
                    }
                    */
                }
            }
            Xaml.Application = Application;
        })(Xaml = UI.Xaml || (UI.Xaml = {}));
    })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));
(function (Windows) {
    var UI;
    (function (UI) {
        var Core;
        (function (Core) {
            /**
             * Support file for the Windows.UI.Core
             * */
            class CoreDispatcher {
                static init(isReady) {
                    MonoSupport.jsCallDispatcher.registerScope("CoreDispatcher", Windows.UI.Core.CoreDispatcher);
                    CoreDispatcher.initMethods();
                    CoreDispatcher._isReady = isReady;
                    CoreDispatcher._isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                    CoreDispatcher._isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                }
                /**
                 * Enqueues a core dispatcher callback on the javascript's event loop
                 *
                 * */
                static WakeUp() {
                    // Is there a Ready promise ?
                    if (CoreDispatcher._isReady) {
                        // Are we already waiting for a Ready promise ?
                        if (!CoreDispatcher._isWaitingReady) {
                            CoreDispatcher._isReady
                                .then(() => {
                                CoreDispatcher.InnerWakeUp();
                                CoreDispatcher._isReady = null;
                            });
                            CoreDispatcher._isWaitingReady = true;
                        }
                    }
                    else {
                        CoreDispatcher.InnerWakeUp();
                    }
                    return true;
                }
                static InnerWakeUp() {
                    if ((CoreDispatcher._isIOS || CoreDispatcher._isSafari) && CoreDispatcher._isFirstCall) {
                        //
                        // This is a workaround for the available call stack during the first 5 (?) seconds
                        // of the startup of an application. See https://github.com/mono/mono/issues/12357 for
                        // more details.
                        //
                        CoreDispatcher._isFirstCall = false;
                        console.warn("Detected iOS, delaying first CoreDispatcher dispatch for 5 seconds (see https://github.com/mono/mono/issues/12357)");
                        window.setTimeout(() => this.WakeUp(), 5000);
                    }
                    else {
                        window.setImmediate(() => {
                            try {
                                CoreDispatcher._coreDispatcherCallback();
                            }
                            catch (e) {
                                console.error(`Unhandled dispatcher exception: ${e} (${e.stack})`);
                                throw e;
                            }
                        });
                    }
                }
                static initMethods() {
                    if (Uno.UI.WindowManager.isHosted) {
                        console.debug("Hosted Mode: Skipping CoreDispatcher initialization ");
                    }
                    else {
                        if (!CoreDispatcher._coreDispatcherCallback) {
                            //TODO: CoreRT (can we just export this?)
                            CoreDispatcher._coreDispatcherCallback = function() {console.log('dispatcher callback');
                            Module._uno_windows_ui_core_coredispatcher_dispatchercallback();}; // Module.mono_bind_static_method("[Uno] Windows.UI.Core.CoreDispatcher:DispatcherCallback");
                        }
                    }
                }
            }
            CoreDispatcher._isFirstCall = true;
            Core.CoreDispatcher = CoreDispatcher;
        })(Core = UI.Core || (UI.Core = {}));
    })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));
var Uno;
(function (Uno) {
    var UI;
    (function (UI) {
        class HtmlDom {
            /**
             * Initialize various polyfills used by Uno
             */
            static initPolyfills() {
                this.isConnectedPolyfill();
            }
            static isConnectedPolyfill() {
                function get() {
                    // polyfill implementation
                    return document.contains(this);
                }
                (supported => {
                    if (!supported) {
                        Object.defineProperty(Node.prototype, "isConnected", { get });
                    }
                })("isConnected" in Node.prototype);
            }
        }
        UI.HtmlDom = HtmlDom;
    })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Uno;
(function (Uno) {
    var Http;
    (function (Http) {
        class HttpClient {
            static send(config) {
                return __awaiter(this, void 0, void 0, function* () {
                    const params = {
                        method: config.method,
                        cache: config.cacheMode || "default",
                        headers: new Headers(config.headers)
                    };
                    if (config.payload) {
                        params.body = yield this.blobFromBase64(config.payload, config.payloadType);
                    }
                    try {
                        const response = yield fetch(config.url, params);
                        let responseHeaders = "";
                        response.headers.forEach((v, k) => responseHeaders += `${k}:${v}\n`);
                        const responseBlob = yield response.blob();
                        const responsePayload = responseBlob ? yield this.base64FromBlob(responseBlob) : "";
                        this.dispatchResponse(config.id, response.status, responseHeaders, responsePayload);
                    }
                    catch (error) {
                        this.dispatchError(config.id, `${error.message || error}`);
                        console.error(error);
                    }
                });
            }
            static blobFromBase64(base64, contentType) {
                return __awaiter(this, void 0, void 0, function* () {
                    contentType = contentType || "application/octet-stream";
                    const url = `data:${contentType};base64,${base64}`;
                    return yield (yield fetch(url)).blob();
                });
            }
            static base64FromBlob(blob) {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const dataUrl = reader.result;
                        const base64 = dataUrl.split(",", 2)[1];
                        resolve(base64);
                    };
                    reader.readAsDataURL(blob);
                });
            }
            static dispatchResponse(requestId, status, headers, payload) {
                this.initMethods();
                const requestIdStr = MonoRuntime.mono_string(requestId);
                const statusStr = MonoRuntime.mono_string("" + status);
                const headersStr = MonoRuntime.mono_string(headers);
                const payloadStr = MonoRuntime.mono_string(payload);
                MonoRuntime.call_method(this.dispatchResponseMethod, null, [requestIdStr, statusStr, headersStr, payloadStr]);
            }
            static dispatchError(requestId, error) {
                this.initMethods();
                const requestIdStr = MonoRuntime.mono_string(requestId);
                const errorStr = MonoRuntime.mono_string(error);
                MonoRuntime.call_method(this.dispatchErrorMethod, null, [requestIdStr, errorStr]);
            }
            static initMethods() {
                if (this.dispatchResponseMethod) {
                    return; // already initialized.
                }
                const asm = MonoRuntime.assembly_load("Uno.UI.Wasm");
                const httpClass = MonoRuntime.find_class(asm, "Uno.UI.Wasm", "WasmHttpHandler");
                this.dispatchResponseMethod = MonoRuntime.find_method(httpClass, "DispatchResponse", -1);
                this.dispatchErrorMethod = MonoRuntime.find_method(httpClass, "DispatchError", -1);
            }
        }
        Http.HttpClient = HttpClient;
    })(Http = Uno.Http || (Uno.Http = {}));
})(Uno || (Uno = {}));
var MonoSupport;
(function (MonoSupport) {
    /**
     * This class is used by https://github.com/mono/mono/blob/fa726d3ac7153d87ed187abd422faa4877f85bb5/sdks/wasm/dotnet_support.js#L88 to perform
     * unmarshaled invocation of javascript from .NET code.
     * */
    class jsCallDispatcher {
        /**
         * Registers a instance for a specified identier
         * @param identifier the scope name
         * @param instance the instance to use for the scope
         */
        static registerScope(identifier, instance) {
            jsCallDispatcher.registrations.set(identifier, instance);
        }
        static findJSFunction(identifier) {
            if (!identifier) {
                return jsCallDispatcher.dispatch;
            }
            else {
                if (!jsCallDispatcher._isUnoRegistered) {
                    jsCallDispatcher.registerScope("UnoStatic", Uno.UI.WindowManager);
                    jsCallDispatcher.registerScope("UnoStatic_Windows_Storage_StorageFolder", Windows.Storage.StorageFolder);
                    jsCallDispatcher._isUnoRegistered = true;
                }
                const { ns, methodName } = jsCallDispatcher.parseIdentifier(identifier);
                var instance = jsCallDispatcher.registrations.get(ns);
                if (instance) {
                    var boundMethod = instance[methodName].bind(instance);
                    var methodId = jsCallDispatcher.cacheMethod(boundMethod);
                    return () => methodId;
                }
                else {
                    throw `Unknown scope ${ns}`;
                }
            }
        }
        /**
         * Internal dispatcher for methods invoked through TSInteropMarshaller
         * @param id The method ID obtained when invoking WebAssemblyRuntime.InvokeJSUnmarshalled with a method name
         * @param pParams The parameters structure ID
         * @param pRet The pointer to the return value structure
         */
        static dispatch(id, pParams, pRet) {
            return jsCallDispatcher.methodMap[id](pParams, pRet);
        }
        /**
         * Parses the method identifier
         * @param identifier
         */
        static parseIdentifier(identifier) {
            var parts = identifier.split(':');
            const ns = parts[0];
            const methodName = parts[1];
            return { ns, methodName };
        }
        /**
         * Adds the a resolved method for a given identifier
         * @param identifier the findJSFunction identifier
         * @param boundMethod the method to call
         */
        static cacheMethod(boundMethod) {
            var methodId = Object.keys(jsCallDispatcher.methodMap).length;
            jsCallDispatcher.methodMap[methodId] = boundMethod;
            return methodId;
        }
    }
    jsCallDispatcher.registrations = new Map();
    jsCallDispatcher.methodMap = {};
    MonoSupport.jsCallDispatcher = jsCallDispatcher;
})(MonoSupport || (MonoSupport = {}));
// Export the DotNet helper for WebAssembly.JSInterop.InvokeJSUnmarshalled
//alert("setting DotNet");
window.DotNet = MonoSupport;
var Uno;
(function (Uno) {
    var UI;
    (function (UI) {
        class WindowManager {
            constructor(containerElementId, loadingElementId) {
                this.containerElementId = containerElementId;
                this.loadingElementId = loadingElementId;
                this.allActiveElementsById = {};
                this.uiElementRegistrations = {};
                this.initDom();
            }
            /**
             * Defines if the WindowManager is running in hosted mode, and should skip the
             * initialization of WebAssembly, use this mode in conjunction with the Uno.UI.WpfHost
             * to improve debuggability.
             */
            static get isHosted() {
                return WindowManager._isHosted;
            }
            /**
             * Defines if the WindowManager is responsible to raise the loading, loaded and unloaded events,
             * or if they are raised directly by the managed code to reduce interop.
             */
            static get isLoadEventsEnabled() {
                return WindowManager._isLoadEventsEnabled;
            }
            /**
                * Initialize the WindowManager
                * @param containerElementId The ID of the container element for the Xaml UI
                * @param loadingElementId The ID of the loading element to remove once ready
                */
            static init(isHosted, isLoadEventsEnabled, containerElementId = "uno-body", loadingElementId = "uno-loading") {
                WindowManager._isHosted = isHosted;
                WindowManager._isLoadEventsEnabled = isLoadEventsEnabled;
                Windows.UI.Core.CoreDispatcher.init(WindowManager.buildReadyPromise());
                this.current = new WindowManager(containerElementId, loadingElementId);
                MonoSupport.jsCallDispatcher.registerScope("Uno", this.current);
                this.current.init();
                return "ok";
            }
            /**
             * Builds a promise that will signal the ability for the dispatcher
             * to initiate work.
             * */
            static buildReadyPromise() {
                return new Promise(resolve => {
                    Promise.all([WindowManager.buildSplashScreen()]).then(() => resolve(true));
                });
            }
            /**
             * Build the splashscreen image eagerly
             * */
            static buildSplashScreen() {
                return new Promise(resolve => {
                    const img = new Image();
                    let loaded = false;
                    let loadingDone = () => {
                        if (!loaded) {
                            loaded = true;
                            if (img.width !== 0 && img.height !== 0) {
                                // Materialize the image content so it shows immediately
                                // even if the dispatcher is blocked thereafter by all
                                // the Uno initialization work. The resulting canvas is not used.
                                //
                                // If the image fails to load, setup the splashScreen anyways with the
                                // proper sample.
                                let canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                let ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);
                            }
                            if (document.readyState === "loading") {
                                document.addEventListener("DOMContentLoaded", () => {
                                    WindowManager.setupSplashScreen(img);
                                    resolve(true);
                                });
                            }
                            else {
                                WindowManager.setupSplashScreen(img);
                                resolve(true);
                            }
                        }
                    };
                    // Preload the splash screen so the image element
                    // created later on 
                    img.onload = loadingDone;
                    img.onerror = loadingDone;
                    img.src = String(UnoAppManifest.splashScreenImage);
                    // If there's no response, skip the loading
                    setTimeout(loadingDone, 2000);
                });
            }
            /**
                * Initialize the WindowManager
                * @param containerElementId The ID of the container element for the Xaml UI
                * @param loadingElementId The ID of the loading element to remove once ready
                */
            static initNative(pParams) {
                const params = WindowManagerInitParams.unmarshal(pParams);
                WindowManager.init(params.IsHostedMode, params.IsLoadEventsEnabled);
                return true;
            }
            /**
                * Creates the UWP-compatible splash screen
                *
                */
            static setupSplashScreen(splashImage) {
                if (UnoAppManifest && UnoAppManifest.splashScreenImage) {
                    const loading = document.getElementById("loading");
                    if (loading) {
                        loading.remove();
                    }
                    const unoBody = document.getElementById("uno-body");
                    if (unoBody) {
                        const unoLoading = document.createElement("div");
                        unoLoading.id = "uno-loading";
                        if (UnoAppManifest.splashScreenColor) {
                            const body = document.getElementsByTagName("body")[0];
                            body.style.backgroundColor = UnoAppManifest.splashScreenColor;
                        }
                        splashImage.id = "uno-loading-splash";
                        splashImage.classList.add("uno-splash");
                        unoLoading.appendChild(splashImage);
                        unoBody.appendChild(unoLoading);
                    }
                }
            }
            /**
                * Reads the window's search parameters
                *
                */
            static findLaunchArguments() {
                if (typeof URLSearchParams === "function") {
                    return new URLSearchParams(window.location.search).toString();
                }
                else {
                    const queryIndex = document.location.search.indexOf('?');
                    if (queryIndex !== -1) {
                        return document.location.search.substring(queryIndex + 1);
                    }
                    return "";
                }
            }
            /**
                * Create a html DOM element representing a Xaml element.
                *
                * You need to call addView to connect it to the DOM.
                */
            createContent(contentDefinition) {
                this.createContentInternal(contentDefinition);
                return "ok";
            }
            /**
                * Create a html DOM element representing a Xaml element.
                *
                * You need to call addView to connect it to the DOM.
                */
            createContentNative(pParams) {
                const params = WindowManagerCreateContentParams.unmarshal(pParams);
                const def = {
                    id: this.handleToString(params.HtmlId),
                    handle: params.Handle,
                    isFocusable: params.IsFocusable,
                    isSvg: params.IsSvg,
                    tagName: params.TagName,
                    uiElementRegistrationId: params.UIElementRegistrationId,
                };
                this.createContentInternal(def);
                return true;
            }
            createContentInternal(contentDefinition) {
                // Create the HTML element
                const element = contentDefinition.isSvg
                    ? document.createElementNS("http://www.w3.org/2000/svg", contentDefinition.tagName)
                    : document.createElement(contentDefinition.tagName);
                element.id = contentDefinition.id;
                const uiElementRegistration = this.uiElementRegistrations[this.handleToString(contentDefinition.uiElementRegistrationId)];
                if (!uiElementRegistration) {
                    throw `UIElement registration id ${contentDefinition.uiElementRegistrationId} is unknown.`;
                }
                element.setAttribute("XamlType", uiElementRegistration.typeName);
                element.setAttribute("XamlHandle", this.handleToString(contentDefinition.handle));
                if (uiElementRegistration.isFrameworkElement) {
                    this.setAsUnarranged(element);
                }
                if (element.hasOwnProperty("tabindex")) {
                    element["tabindex"] = contentDefinition.isFocusable ? 0 : -1;
                }
                else {
                    element.setAttribute("tabindex", contentDefinition.isFocusable ? "0" : "-1");
                }
                if (contentDefinition) {
                    let classes = element.classList.value;
                    for (const className of uiElementRegistration.classNames) {
                        classes += " uno-" + className;
                    }
                    element.classList.value = classes;
                }
                // Add the html element to list of elements
                this.allActiveElementsById[contentDefinition.id] = element;
            }
                        registerUIElement(typeName, isFrameworkElement, classNames) {
                            console.log('this ' + this);
                            console.log('uiElementRegistrations ' + this.uiElementRegistrations);
                const registrationId = Object.keys(this.uiElementRegistrations).length;
                this.uiElementRegistrations[this.handleToString(registrationId)] = {
                    classNames: classNames,
                    isFrameworkElement: isFrameworkElement,
                    typeName: typeName,
                };
                return registrationId;
            }
            registerUIElementNative(pParams, pReturn) {
                console.log('pParams' + pParams);
                const params = WindowManagerRegisterUIElementParams.unmarshal(pParams);
                console.log('params');
                console.log(params);
                const registrationId = this.registerUIElement(params.TypeName, params.IsFrameworkElement, params.Classes);
                const ret = new WindowManagerRegisterUIElementReturn();
                ret.RegistrationId = registrationId;
                ret.marshal(pReturn);
                return true;
            }
            getView(elementHandle) {
                const element = this.allActiveElementsById[elementHandle];
                if (!element) {
                    throw `Element id ${elementHandle} not found.`;
                }
                return element;
            }
            /**
                * Set a name for an element.
                *
                * This is mostly for diagnostic purposes.
                */
            setName(elementId, name) {
                this.setNameInternal(elementId, name);
                return "ok";
            }
            /**
                * Set a name for an element.
                *
                * This is mostly for diagnostic purposes.
                */
            setNameNative(pParam) {
                const params = WindowManagerSetNameParams.unmarshal(pParam);
                this.setNameInternal(params.HtmlId, params.Name);
                return true;
            }
            setNameInternal(elementId, name) {
                this.getView(elementId).setAttribute("xamlname", name);
            }
            /**
                * Set a name for an element.
                *
                * This is mostly for diagnostic purposes.
                */
            setXUid(elementId, name) {
                this.setXUidInternal(elementId, name);
                return "ok";
            }
            /**
                * Set a name for an element.
                *
                * This is mostly for diagnostic purposes.
                */
            setXUidNative(pParam) {
                const params = WindowManagerSetXUidParams.unmarshal(pParam);
                this.setXUidInternal(params.HtmlId, params.Uid);
                return true;
            }
            setXUidInternal(elementId, name) {
                this.getView(elementId).setAttribute("xuid", name);
            }
            /**
                * Set an attribute for an element.
                */
            setAttributes(elementId, attributes) {
                const element = this.getView(elementId);
                for (const name in attributes) {
                    if (attributes.hasOwnProperty(name)) {
                        element.setAttribute(name, attributes[name]);
                    }
                }
                return "ok";
            }
            /**
                * Set an attribute for an element.
                */
            setAttributesNative(pParams) {
                const params = WindowManagerSetAttributesParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                for (let i = 0; i < params.Pairs_Length; i += 2) {
                    element.setAttribute(params.Pairs[i], params.Pairs[i + 1]);
                }
                return true;
            }
            /**
                * Set an attribute for an element.
                */
            setAttributeNative(pParams) {
                const params = WindowManagerSetAttributeParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                element.setAttribute(params.Name, params.Value);
                return true;
            }
            /**
                * Removes an attribute for an element.
                */
            removeAttribute(elementId, name) {
                const element = this.getView(elementId);
                element.removeAttribute(name);
                return "ok";
            }
            /**
                * Removes an attribute for an element.
                */
            removeAttributeNative(pParams) {
                const params = WindowManagerRemoveAttributeParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                element.removeAttribute(params.Name);
                return true;
            }
            /**
                * Get an attribute for an element.
                */
            getAttribute(elementId, name) {
                return this.getView(elementId).getAttribute(name);
            }
            /**
                * Set a property for an element.
                */
            setProperty(elementId, properties) {
                const element = this.getView(elementId);
                for (const name in properties) {
                    if (properties.hasOwnProperty(name)) {
                        var setVal = properties[name];
                        if (setVal === "true") {
                            element[name] = true;
                        }
                        else if (setVal === "false") {
                            element[name] = false;
                        }
                        else {
                            element[name] = setVal;
                        }
                    }
                }
                return "ok";
            }
            /**
                * Set a property for an element.
                */
            setPropertyNative(pParams) {
                const params = WindowManagerSetPropertyParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                for (let i = 0; i < params.Pairs_Length; i += 2) {
                    var setVal = params.Pairs[i + 1];
                    if (setVal === "true") {
                        element[params.Pairs[i]] = true;
                    }
                    else if (setVal === "false") {
                        element[params.Pairs[i]] = false;
                    }
                    else {
                        element[params.Pairs[i]] = setVal;
                    }
                }
                return true;
            }
            /**
                * Get a property for an element.
                */
            getProperty(elementId, name) {
                const element = this.getView(elementId);
                return element[name] || "";
            }
            /**
                * Set the CSS style of a html element.
                *
                * To remove a value, set it to empty string.
                * @param styles A dictionary of styles to apply on html element.
                */
            setStyle(elementId, styles, setAsArranged = false, clipToBounds) {
                const element = this.getView(elementId);
                for (const style in styles) {
                    if (styles.hasOwnProperty(style)) {
                        element.style.setProperty(style, styles[style]);
                    }
                }
                if (setAsArranged) {
                    this.setAsArranged(element);
                }
                if (typeof clipToBounds === "boolean") {
                    this.setClipToBounds(element, clipToBounds);
                }
                return "ok";
            }
            /**
            * Set the CSS style of a html element.
            *
            * To remove a value, set it to empty string.
            * @param styles A dictionary of styles to apply on html element.
            */
            setStyleNative(pParams) {
                const params = WindowManagerSetStylesParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                const elementStyle = element.style;
                const pairs = params.Pairs;
                for (let i = 0; i < params.Pairs_Length; i += 2) {
                    const key = pairs[i];
                    const value = pairs[i + 1];
                    elementStyle.setProperty(key, value);
                }
                if (params.SetAsArranged) {
                    this.setAsArranged(element);
                }
                this.setClipToBounds(element, params.ClipToBounds);
                return true;
            }
            /**
            * Set a single CSS style of a html element
            *
            */
            setStyleDoubleNative(pParams) {
                const params = WindowManagerSetStyleDoubleParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                element.style.setProperty(params.Name, String(params.Value));
                return true;
            }
            /**
                * Set the CSS style of a html element.
                *
                * To remove a value, set it to empty string.
                * @param styles A dictionary of styles to apply on html element.
                */
            resetStyle(elementId, names) {
                this.resetStyleInternal(elementId, names);
                return "ok";
            }
            /**
                * Set the CSS style of a html element.
                *
                * To remove a value, set it to empty string.
                * @param styles A dictionary of styles to apply on html element.
                */
            resetStyleNative(pParams) {
                const params = WindowManagerResetStyleParams.unmarshal(pParams);
                this.resetStyleInternal(params.HtmlId, params.Styles);
                return true;
            }
            resetStyleInternal(elementId, names) {
                const element = this.getView(elementId);
                for (const name of names) {
                    element.style.setProperty(name, "");
                }
            }
            /**
             * Set CSS classes on an element
             */
            setClasses(elementId, cssClassesList, classIndex) {
                const element = this.getView(elementId);
                for (let i = 0; i < cssClassesList.length; i++) {
                    if (i === classIndex) {
                        element.classList.add(cssClassesList[i]);
                    }
                    else {
                        element.classList.remove(cssClassesList[i]);
                    }
                }
                return "ok";
            }
            setClassesNative(pParams) {
                const params = WindowManagerSetClassesParams.unmarshal(pParams);
                this.setClasses(params.HtmlId, params.CssClasses, params.Index);
                return true;
            }
            /**
            * Arrange and clips a native elements
            *
            */
            arrangeElementNative(pParams) {
                const params = WindowManagerArrangeElementParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                const style = element.style;
                style.position = "absolute";
                style.top = params.Top + "px";
                style.left = params.Left + "px";
                style.width = params.Width === NaN ? "auto" : params.Width + "px";
                style.height = params.Height === NaN ? "auto" : params.Height + "px";
                if (params.Clip) {
                    style.clip = `rect(${params.ClipTop}px, ${params.ClipRight}px, ${params.ClipBottom}px, ${params.ClipLeft}px)`;
                }
                else {
                    style.clip = "";
                }
                this.setAsArranged(element);
                this.setClipToBounds(element, params.ClipToBounds);
                return true;
            }
            setAsArranged(element) {
                element.classList.remove(WindowManager.unoUnarrangedClassName);
            }
            setAsUnarranged(element) {
                element.classList.add(WindowManager.unoUnarrangedClassName);
            }
            setClipToBounds(element, clipToBounds) {
                if (clipToBounds) {
                    element.classList.add(WindowManager.unoClippedToBoundsClassName);
                }
                else {
                    element.classList.remove(WindowManager.unoClippedToBoundsClassName);
                }
            }
            /**
            * Sets the transform matrix of an element
            *
            */
            setElementTransformNative(pParams) {
                const params = WindowManagerSetElementTransformParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                var style = element.style;
                const matrix = `matrix(${params.M11},${params.M12},${params.M21},${params.M22},${params.M31},${params.M32})`;
                style.transform = matrix;
                this.setAsArranged(element);
                this.setClipToBounds(element, params.ClipToBounds);
                return true;
            }
            setPointerEvents(htmlId, enabled) {
                const element = this.getView(htmlId);
                element.style.pointerEvents = enabled ? "auto" : "none";
            }
            setPointerEventsNative(pParams) {
                const params = WindowManagerSetPointerEventsParams.unmarshal(pParams);
                this.setPointerEvents(params.HtmlId, params.Enabled);
                return true;
            }
            /**
                * Load the specified URL into a new tab or window
                * @param url URL to load
                * @returns "True" or "False", depending on whether a new window could be opened or not
                */
            open(url) {
                const newWindow = window.open(url, "_blank");
                return newWindow != null
                    ? "True"
                    : "False";
            }
            /**
                * Issue a browser alert to user
                * @param message message to display
                */
            alert(message) {
                window.alert(message);
                return "ok";
            }
            /**
                * Sets the browser window title
                * @param message the new title
                */
            setWindowTitle(title) {
                document.title = title || UnoAppManifest.displayName;
                return "ok";
            }
            /**
                * Gets the currently set browser window title
                */
            getWindowTitle() {
                return document.title || UnoAppManifest.displayName;
            }
            /**
                * Add an event handler to a html element.
                *
                * @param eventName The name of the event
                * @param onCapturePhase true means "on trickle down" (going down to target), false means "on bubble up" (bubbling back to ancestors). Default is false.
                */
            registerEventOnView(elementId, eventName, onCapturePhase = false, eventFilterName, eventExtractorName) {
                this.registerEventOnViewInternal(elementId, eventName, onCapturePhase, eventFilterName, eventExtractorName);
                return "ok";
            }
            /**
                * Add an event handler to a html element.
                *
                * @param eventName The name of the event
                * @param onCapturePhase true means "on trickle down", false means "on bubble up". Default is false.
                */
            registerEventOnViewNative(pParams) {
                const params = WindowManagerRegisterEventOnViewParams.unmarshal(pParams);
                this.registerEventOnViewInternal(params.HtmlId, params.EventName, params.OnCapturePhase, params.EventFilterName, params.EventExtractorName);
                return true;
            }
            /**
             * Ensure that any pending leave event are going to be processed (cf @see processPendingLeaveEvent )
             */
            ensurePendingLeaveEventProcessing() {
                if (this._isPendingLeaveProcessingEnabled) {
                    return;
                }
                // Register an event listener on move in order to process any pending event (leave).
                document.addEventListener("pointermove", evt => {
                    if (this.processPendingLeaveEvent) {
                        this.processPendingLeaveEvent(evt);
                    }
                }, true); // in the capture phase to get it as soon as possible, and to make sure to respect the events ordering
                this._isPendingLeaveProcessingEnabled = true;
            }
                        registerPointerEventsOnView(pParams) {
                const params = WindowManagerRegisterEventOnViewParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                element.addEventListener("pointerenter", WindowManager.onPointerEnterReceived);
                element.addEventListener("pointerleave", WindowManager.onPointerLeaveReceived);
                element.addEventListener("pointerdown", WindowManager.onPointerEventReceived);
                element.addEventListener("pointerup", WindowManager.onPointerEventReceived);
                element.addEventListener("pointercancel", WindowManager.onPointerEventReceived);
            }
            static onPointerEventReceived(evt) {
                WindowManager.dispatchPointerEvent(evt.currentTarget, evt);
            }
            static dispatchPointerEvent(element, evt) {
                const payload = WindowManager.pointerEventExtractor(evt);
                const handled = WindowManager.current.dispatchEvent(element, evt.type, payload);
                if (handled) {
                    evt.stopPropagation();
                }
            }
            static onPointerEnterReceived(evt) {
                const element = evt.currentTarget;
                const e = evt;
                if (e.explicitOriginalTarget) { // FF only
                    // It happens on FF that when another control which is over the 'element' has been updated, like text or visibility changed,
                    // we receive a pointer enter/leave of an element which is under an element that is capable to handle pointers,
                    // which is unexpected as the "pointerenter" should not bubble.
                    // So we have to validate that this event is effectively due to the pointer entering the control.
                    // We achieve this by browsing up the elements under the pointer (** not the visual tree**) 
                    for (let elt of document.elementsFromPoint(evt.pageX, evt.pageY)) {
                        if (elt == element) {
                            // We found our target element, we can raise the event and stop the loop
                            WindowManager.onPointerEventReceived(evt);
                            return;
                        }
                        let htmlElt = elt;
                        if (htmlElt.style.pointerEvents != "none") {
                            // This 'htmlElt' is handling the pointers events, this mean that we can stop the loop.
                            // However, if this 'htmlElt' is one of our child it means that the event was legitimate
                            // and we have to raise it for the 'element'.
                            while (htmlElt.parentElement) {
                                htmlElt = htmlElt.parentElement;
                                if (htmlElt == element) {
                                    WindowManager.onPointerEventReceived(evt);
                                    return;
                                }
                            }
                            // We found an element this is capable to handle the pointers but which is not one of our child
                            // (probably a sibling which is covering the element). It means that the pointerEnter/Leave should
                            // not have bubble to the element, and we can mute it.
                            return;
                        }
                    }
                }
                else {
                    WindowManager.onPointerEventReceived(evt);
                }
            }
            static onPointerLeaveReceived(evt) {
                const element = evt.currentTarget;
                const e = evt;
                if (e.explicitOriginalTarget // FF only
                    && e.explicitOriginalTarget !== element
                    && event.isOver(element)) {
                    // If the event was re-targeted, it's suspicious as the leave event should not bubble
                    // This happens on FF when another control which is over the 'element' has been updated, like text or visibility changed.
                    // So we have to validate that this event is effectively due to the pointer leaving the element.
                    // We achieve that by buffering it until the next few 'pointermove' on document for which we validate the new pointer location.
                    // It's common to get a move right after the leave with the same pointer's location,
                    // so we wait up to 3 pointer move before dropping the leave event.
                    var attempt = 3;
                    WindowManager.current.ensurePendingLeaveEventProcessing();
                    WindowManager.current.processPendingLeaveEvent = (move) => {
                        if (!move.isOverDeep(element)) {
                            // Raising deferred pointerleave on element " + element.id);
                            // Note The 'evt.currentTarget' is available only while in the event handler.
                            //		So we manually keep a reference ('element') and explicit dispatch event to it.
                            //		https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
                            WindowManager.dispatchPointerEvent(element, evt);
                            WindowManager.current.processPendingLeaveEvent = null;
                        }
                        else if (--attempt <= 0) {
                            // Drop deferred pointerleave on element " + element.id);
                            WindowManager.current.processPendingLeaveEvent = null;
                        }
                        else {
                            // Requeue deferred pointerleave on element " + element.id);
                        }
                    };
                }
                else {
                    WindowManager.onPointerEventReceived(evt);
                }
            }
            /**
             * Ensure that any pending leave event are going to be processed (cf @see processPendingLeaveEvent )
             */
            ensurePendingLeaveEventProcessing() {
                if (this._isPendingLeaveProcessingEnabled) {
                    return;
                }
                // Register an event listener on move in order to process any pending event (leave).
                document.addEventListener("pointermove", evt => {
                    if (this.processPendingLeaveEvent) {
                        this.processPendingLeaveEvent(evt);
                    }
                }, true); // in the capture phase to get it as soon as possible, and to make sure to respect the events ordering
                this._isPendingLeaveProcessingEnabled = true;
            }
            /**
                * Add an event handler to a html element.
                *
                * @param eventName The name of the event
                * @param onCapturePhase true means "on trickle down", false means "on bubble up". Default is false.
                */
            registerEventOnViewInternal(elementId, eventName, onCapturePhase = false, eventFilterName, eventExtractorName) {
                const element = this.getView(elementId);
                const eventExtractor = this.getEventExtractor(eventExtractorName);
                const eventHandler = (event) => {
                    const eventPayload = eventExtractor
                        ? `${eventExtractor(event)}`
                        : "";
                    var handled = this.dispatchEvent(element, eventName, eventPayload);
                    if (handled) {
                        event.stopPropagation();
                    }
                };
                if (eventName == "pointerenter") {
                    const enterPointerHandler = (event) => {
                        const e = event;
                        if (e.explicitOriginalTarget) { // FF only
                            // It happens on FF that when another control which is over the 'element' has been updated, like text or visibility changed,
                            // we receive a pointer enter/leave of an element which is under an element that is capable to handle pointers,
                            // which is unexpected as the "pointerenter" should not bubble.
                            // So we have to validate that this event is effectively due to the pointer entering the control.
                            // We achieve this by browsing up the elements under the pointer (** not the visual tree**) 
                            const evt = event;
                            for (let elt of document.elementsFromPoint(evt.pageX, evt.pageY)) {
                                if (elt == element) {
                                    // We found our target element, we can raise the event and stop the loop
                                    eventHandler(event);
                                    return;
                                }
                                let htmlElt = elt;
                                if (htmlElt.style.pointerEvents != "none") {
                                    // This 'htmlElt' is handling the pointers events, this mean that we can stop the loop.
                                    // However, if this 'htmlElt' is one of our child it means that the event was legitimate
                                    // and we have to raise it for the 'element'.
                                    while (htmlElt.parentElement) {
                                        htmlElt = htmlElt.parentElement;
                                        if (htmlElt == element) {
                                            eventHandler(event);
                                            return;
                                        }
                                    }
                                    // We found an element this is capable to handle the pointers but which is not one of our child
                                    // (probably a sibling which is covering the element). It means that the pointerEnter/Leave should
                                    // not have bubble to the element, and we can mute it.
                                    return;
                                }
                            }
                        }
                        else {
                            eventHandler(event);
                        }
                    };
                    element.addEventListener(eventName, enterPointerHandler, onCapturePhase);
                }
                else if (eventName == "pointerleave") {
                    const leavePointerHandler = (event) => {
                        const e = event;
                        if (e.explicitOriginalTarget // FF only
                            && e.explicitOriginalTarget !== event.currentTarget
                            && event.isOver(element)) {
                            // If the event was re-targeted, it's suspicious as the leave event should not bubble
                            // This happens on FF when another control which is over the 'element' has been updated, like text or visibility changed.
                            // So we have to validate that this event is effectively due to the pointer leaving the element.
                            // We achieve that by buffering it until the next few 'pointermove' on document for which we validate the new pointer location.
                            // It's common to get a move right after the leave with the same pointer's location,
                            // so we wait up to 3 pointer move before dropping the leave event.
                            var attempt = 3;
                            this.ensurePendingLeaveEventProcessing();
                            this.processPendingLeaveEvent = (move) => {
                                if (!move.isOverDeep(element)) {
                                    console.log("Raising deferred pointerleave on element " + elementId);
                                    eventHandler(event);
                                    this.processPendingLeaveEvent = null;
                                }
                                else if (--attempt <= 0) {
                                    console.log("Drop deferred pointerleave on element " + elementId);
                                    this.processPendingLeaveEvent = null;
                                }
                                else {
                                    console.log("Requeue deferred pointerleave on element " + elementId);
                                }
                            };
                        }
                        else {
                            eventHandler(event);
                        }
                    };
                    element.addEventListener(eventName, leavePointerHandler, onCapturePhase);
                }
                else {
                    element.addEventListener(eventName, eventHandler, onCapturePhase);
                }
            }
            /**
             * left pointer event filter to be used with registerEventOnView
             * @param evt
             */
            leftPointerEventFilter(evt) {
                return evt ? evt.eventPhase === 2 || evt.eventPhase === 3 && (!evt.button || evt.button === 0) : false;
            }
            /**
             * default event filter to be used with registerEventOnView to
             * use for most routed events
             * @param evt
             */
            defaultEventFilter(evt) {
                return evt ? evt.eventPhase === 2 || evt.eventPhase === 3 : false;
            }
            /**
             * Gets the event filter function. See UIElement.HtmlEventFilter
             * @param eventFilterName an event filter name.
             */
            getEventFilter(eventFilterName) {
                if (eventFilterName) {
                    switch (eventFilterName) {
                        case "LeftPointerEventFilter":
                            return this.leftPointerEventFilter;
                        case "Default":
                            return this.defaultEventFilter;
                    }
                    throw `Event filter ${eventFilterName} is not supported`;
                }
                return null;
            }
            /**
             * pointer event extractor to be used with registerEventOnView
             * @param evt
             */
            pointerEventExtractor(evt) {
                if (!evt) {
                    return "";
                }
                let src = evt.target;
                let srcHandle = "0";
                while (src) {
                    let handle = src.getAttribute("XamlHandle");
                    if (handle) {
                        srcHandle = handle;
                        break;
                    }
                    src = src.parentElement;
                }
                return `${evt.pointerId};${evt.clientX};${evt.clientY};${(evt.ctrlKey ? "1" : "0")};${(evt.shiftKey ? "1" : "0")};${evt.button};${evt.pointerType};${srcHandle};${evt.timeStamp}`;
            }
            /**
             * keyboard event extractor to be used with registerEventOnView
             * @param evt
             */
            keyboardEventExtractor(evt) {
                return (evt instanceof KeyboardEvent) ? evt.key : "0";
            }
            /**
             * tapped (mouse clicked / double clicked) event extractor to be used with registerEventOnView
             * @param evt
             */
            tappedEventExtractor(evt) {
                return evt
                    ? `0;${evt.clientX};${evt.clientY};${(evt.ctrlKey ? "1" : "0")};${(evt.shiftKey ? "1" : "0")};${evt.button};mouse`
                    : "";
            }
            /**
             * tapped (mouse clicked / double clicked) event extractor to be used with registerEventOnView
             * @param evt
             */
            focusEventExtractor(evt) {
                if (evt) {
                    const targetElement = evt.target;
                    if (targetElement) {
                        const targetXamlHandle = targetElement.getAttribute("XamlHandle");
                        if (targetXamlHandle) {
                            return `${targetXamlHandle}`;
                        }
                    }
                }
                return "";
            }
            customEventDetailExtractor(evt) {
                if (evt) {
                    const detail = evt.detail;
                    if (detail) {
                        return JSON.stringify(detail);
                    }
                }
                return "";
            }
            customEventDetailStringExtractor(evt) {
                return evt ? `${evt.detail}` : "";
            }
            /**
             * Gets the event extractor function. See UIElement.HtmlEventExtractor
             * @param eventExtractorName an event extractor name.
             */
            getEventExtractor(eventExtractorName) {
                if (eventExtractorName) {
                    switch (eventExtractorName) {
                        case "PointerEventExtractor":
                            return this.pointerEventExtractor;
                        case "KeyboardEventExtractor":
                            return this.keyboardEventExtractor;
                        case "TappedEventExtractor":
                            return this.tappedEventExtractor;
                        case "FocusEventExtractor":
                            return this.focusEventExtractor;
                        case "CustomEventDetailJsonExtractor":
                            return this.customEventDetailExtractor;
                        case "CustomEventDetailStringExtractor":
                            return this.customEventDetailStringExtractor;
                    }
                    throw `Event filter ${eventExtractorName} is not supported`;
                }
                return null;
            }
            /**
                * Set or replace the root content element.
                */
            setRootContent(elementId) {
                if (this.rootContent && Number(this.rootContent.id) === elementId) {
                    return null; // nothing to do
                }
                if (this.rootContent) {
                    // Remove existing
                    this.containerElement.removeChild(this.rootContent);
                    if (WindowManager.isLoadEventsEnabled) {
                        this.dispatchEvent(this.rootContent, "unloaded");
                    }
                    this.rootContent.classList.remove(WindowManager.unoRootClassName);
                }
                if (!elementId) {
                    return null;
                }
                // set new root
                const newRootElement = this.getView(elementId);
                newRootElement.classList.add(WindowManager.unoRootClassName);
                this.rootContent = newRootElement;
                if (WindowManager.isLoadEventsEnabled) {
                    this.dispatchEvent(this.rootContent, "loading");
                }
                this.containerElement.appendChild(this.rootContent);
                if (WindowManager.isLoadEventsEnabled) {
                    this.dispatchEvent(this.rootContent, "loaded");
                }
                this.setAsArranged(newRootElement); // patch because root is not measured/arranged
                this.resize();
                return "ok";
            }
            /**
                * Set a view as a child of another one.
                *
                * "Loading" & "Loaded" events will be raised if necessary.
                *
                * @param index Position in children list. Appended at end if not specified.
                */
            addView(parentId, childId, index) {
                this.addViewInternal(parentId, childId, index);
                return "ok";
            }
            /**
                * Set a view as a child of another one.
                *
                * "Loading" & "Loaded" events will be raised if necessary.
                *
                * @param pParams Pointer to a WindowManagerAddViewParams native structure.
                */
             addViewNative(pParams) {
                const params = WindowManagerAddViewParams.unmarshal(pParams);
                this.addViewInternal(params.HtmlId, params.ChildView, params.Index != -1 ? params.Index : null);
                return true;
            }
            addViewInternal(parentId, childId, index) {
                const parentElement = this.getView(parentId);
                const childElement = this.getView(childId);
                let shouldRaiseLoadEvents = false;
                if (WindowManager.isLoadEventsEnabled) {
                    const alreadyLoaded = this.getIsConnectedToRootElement(childElement);
                    shouldRaiseLoadEvents = !alreadyLoaded && this.getIsConnectedToRootElement(parentElement);
                    if (shouldRaiseLoadEvents) {
                        this.dispatchEvent(childElement, "loading");
                    }
                }
                if (index != null && index < parentElement.childElementCount) {
                    const insertBeforeElement = parentElement.children[index];
                    parentElement.insertBefore(childElement, insertBeforeElement);
                }
                else {
                    parentElement.appendChild(childElement);
                }
                if (shouldRaiseLoadEvents) {
                    this.dispatchEvent(childElement, "loaded");
                }
            }
            /**
                * Remove a child from a parent element.
                *
                * "Unloading" & "Unloaded" events will be raised if necessary.
                */
            removeView(parentId, childId) {
                this.removeViewInternal(parentId, childId);
                return "ok";
            }
            /**
                * Remove a child from a parent element.
                *
                * "Unloading" & "Unloaded" events will be raised if necessary.
                */
            removeViewNative(pParams) {
                const params = WindowManagerRemoveViewParams.unmarshal(pParams);
                this.removeViewInternal(params.HtmlId, params.ChildView);
                return true;
            }
            removeViewInternal(parentId, childId) {
                const parentElement = this.getView(parentId);
                const childElement = this.getView(childId);
                const shouldRaiseLoadEvents = WindowManager.isLoadEventsEnabled
                    && this.getIsConnectedToRootElement(childElement);
                parentElement.removeChild(childElement);
                // Mark the element as unarranged, so if it gets measured while being
                // disconnected from the root element, it won't be visible.
                this.setAsUnarranged(childElement);
                if (shouldRaiseLoadEvents) {
                    this.dispatchEvent(childElement, "unloaded");
                }
            }
            /**
                * Destroy a html element.
                *
                * The element won't be available anymore. Usually indicate the managed
                * version has been scavenged by the GC.
                */
            destroyView(elementId) {
                this.destroyViewInternal(elementId);
                return "ok";
            }
            /**
                * Destroy a html element.
                *
                * The element won't be available anymore. Usually indicate the managed
                * version has been scavenged by the GC.
                */
            destroyViewNative(pParams) {
                const params = WindowManagerDestroyViewParams.unmarshal(pParams);
                this.destroyViewInternal(params.HtmlId);
                return true;
            }
            destroyViewInternal(elementId) {
                const element = this.getView(elementId);
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
                delete this.allActiveElementsById[elementId];
            }
            getBoundingClientRect(elementId) {
                const bounds = this.getView(elementId).getBoundingClientRect();
                return `${bounds.left};${bounds.top};${bounds.right - bounds.left};${bounds.bottom - bounds.top}`;
            }
            getBBox(elementId) {
                const bbox = this.getBBoxInternal(elementId);
                return `${bbox.x};${bbox.y};${bbox.width};${bbox.height}`;
            }
            getBBoxNative(pParams, pReturn) {
                const params = WindowManagerGetBBoxParams.unmarshal(pParams);
                const bbox = this.getBBoxInternal(params.HtmlId);
                const ret = new WindowManagerGetBBoxReturn();
                ret.X = bbox.x;
                ret.Y = bbox.y;
                ret.Width = bbox.width;
                ret.Height = bbox.height;
                ret.marshal(pReturn);
                return true;
            }
            getBBoxInternal(elementId) {
                return this.getView(elementId).getBBox();
            }
            /**
                * Use the Html engine to measure the element using specified constraints.
                *
                * @param maxWidth string containing width in pixels. Empty string means infinite.
                * @param maxHeight string containing height in pixels. Empty string means infinite.
                */
            measureView(viewId, maxWidth, maxHeight) {
                const ret = this.measureViewInternal(Number(viewId), maxWidth ? Number(maxWidth) : NaN, maxHeight ? Number(maxHeight) : NaN);
                return `${ret[0]};${ret[1]}`;
            }
            /**
                * Use the Html engine to measure the element using specified constraints.
                *
                * @param maxWidth string containing width in pixels. Empty string means infinite.
                * @param maxHeight string containing height in pixels. Empty string means infinite.
                */
            measureViewNative(pParams, pReturn) {
                const params = WindowManagerMeasureViewParams.unmarshal(pParams);
                const ret = this.measureViewInternal(params.HtmlId, params.AvailableWidth, params.AvailableHeight);
                const ret2 = new WindowManagerMeasureViewReturn();
                ret2.DesiredWidth = ret[0];
                ret2.DesiredHeight = ret[1];
                ret2.marshal(pReturn);
                return true;
            }
            measureElement(element) {
                const offsetWidth = element.offsetWidth;
                const offsetHeight = element.offsetHeight;
                const resultWidth = offsetWidth ? offsetWidth : element.clientWidth;
                const resultHeight = offsetHeight ? offsetHeight : element.clientHeight;
                // +1 is added to take rounding/flooring into account
                return [resultWidth + 1, resultHeight];
            }
            measureViewInternal(viewId, maxWidth, maxHeight) {
                const element = this.getView(viewId);
                const elementStyle = element.style;
                const originalStyleCssText = elementStyle.cssText;
                let parentElement = null;
                let parentElementWidthHeight = null;
                let unconnectedRoot = null;
                let cleanupUnconnectedRoot = function (owner) {
                    if (unconnectedRoot !== null) {
                        owner.removeChild(unconnectedRoot);
                    }
                };
                try {
                    if (!element.isConnected) {
                        // If the element is not connected to the DOM, we need it
                        // to be connected for the measure to provide a meaningful value.
                        unconnectedRoot = element;
                        while (unconnectedRoot.parentElement) {
                            // Need to find the top most "unconnected" parent
                            // of this element
                            unconnectedRoot = unconnectedRoot.parentElement;
                        }
                        this.containerElement.appendChild(unconnectedRoot);
                    }
                    // As per W3C css-transform spec:
                    // https://www.w3.org/TR/css-transforms-1/#propdef-transform
                    //
                    // > For elements whose layout is governed by the CSS box model, any value other than none
                    // > for the transform property also causes the element to establish a containing block for
                    // > all descendants.Its padding box will be used to layout for all of its
                    // > absolute - position descendants, fixed - position descendants, and descendant fixed
                    // > background attachments.
                    //
                    // We use this feature to allow an measure of text without being influenced by the bounds
                    // of the viewport. We just need to temporary set both the parent width & height to a very big value.
                    parentElement = element.parentElement;
                    parentElementWidthHeight = { width: parentElement.style.width, height: parentElement.style.height };
                    parentElement.style.width = WindowManager.MAX_WIDTH;
                    parentElement.style.height = WindowManager.MAX_HEIGHT;
                    const updatedStyles = {};
                    for (let i = 0; i < elementStyle.length; i++) {
                        const key = elementStyle[i];
                        updatedStyles[key] = elementStyle.getPropertyValue(key);
                    }
                    if (updatedStyles.hasOwnProperty("width")) {
                        delete updatedStyles.width;
                    }
                    if (updatedStyles.hasOwnProperty("height")) {
                        delete updatedStyles.height;
                    }
                    // This is required for an unconstrained measure (otherwise the parents size is taken into account)
                    updatedStyles.position = "fixed";
                    updatedStyles["max-width"] = Number.isFinite(maxWidth) ? maxWidth + "px" : "none";
                    updatedStyles["max-height"] = Number.isFinite(maxHeight) ? maxHeight + "px" : "none";
                    let updatedStyleString = "";
                    for (let key in updatedStyles) {
                        if (updatedStyles.hasOwnProperty(key)) {
                            updatedStyleString += key + ": " + updatedStyles[key] + "; ";
                        }
                    }
                    // We use a string to prevent the browser to update the element between
                    // each style assignation. This way, the browser will update the element only once.
                    elementStyle.cssText = updatedStyleString;
                    if (element instanceof HTMLImageElement) {
                        const imgElement = element;
                        return [imgElement.naturalWidth, imgElement.naturalHeight];
                    }
                    else if (element instanceof HTMLInputElement) {
                        const inputElement = element;
                        cleanupUnconnectedRoot(this.containerElement);
                        // Create a temporary element that will contain the input's content
                        var textOnlyElement = document.createElement("p");
                        textOnlyElement.style.cssText = updatedStyleString;
                        textOnlyElement.innerText = inputElement.value;
                        unconnectedRoot = textOnlyElement;
                        this.containerElement.appendChild(unconnectedRoot);
                        var textSize = this.measureElement(textOnlyElement);
                        var inputSize = this.measureElement(element);
                        // Take the width of the inner text, but keep the height of the input element.
                        return [textSize[0], inputSize[1]];
                    }
                    else {
                        return this.measureElement(element);
                    }
                }
                finally {
                    elementStyle.cssText = originalStyleCssText;
                    if (parentElement && parentElementWidthHeight) {
                        parentElement.style.width = parentElementWidthHeight.width;
                        parentElement.style.height = parentElementWidthHeight.height;
                    }
                    cleanupUnconnectedRoot(this.containerElement);
                }
            }
            scrollTo(pParams) {
                const params = WindowManagerScrollToOptionsParams.unmarshal(pParams);
                const elt = this.getView(params.HtmlId);
                const opts = ({
                    left: params.HasLeft ? params.Left : undefined,
                    top: params.HasTop ? params.Top : undefined,
                    behavior: (params.DisableAnimation ? "auto" : "smooth")
                });
                elt.scrollTo(opts);
                return true;
            }
            setImageRawData(viewId, dataPtr, width, height) {
                const element = this.getView(viewId);
                if (element.tagName.toUpperCase() === "IMG") {
                    const imgElement = element;
                    const rawCanvas = document.createElement("canvas");
                    rawCanvas.width = width;
                    rawCanvas.height = height;
                    const ctx = rawCanvas.getContext("2d");
                    const imgData = ctx.createImageData(width, height);
                    const bufferSize = width * height * 4;
                    for (let i = 0; i < bufferSize; i += 4) {
                        imgData.data[i + 0] = Module.HEAPU8[dataPtr + i + 2];
                        imgData.data[i + 1] = Module.HEAPU8[dataPtr + i + 1];
                        imgData.data[i + 2] = Module.HEAPU8[dataPtr + i + 0];
                        imgData.data[i + 3] = Module.HEAPU8[dataPtr + i + 3];
                    }
                    ctx.putImageData(imgData, 0, 0);
                    imgElement.src = rawCanvas.toDataURL();
                    return "ok";
                }
            }
            /**
             * Sets the provided image with a mono-chrome version of the provided url.
             * @param viewId the image to manipulate
             * @param url the source image
             * @param color the color to apply to the monochrome pixels
             */
            setImageAsMonochrome(viewId, url, color) {
                const element = this.getView(viewId);
                if (element.tagName.toUpperCase() === "IMG") {
                    const imgElement = element;
                    var img = new Image();
                    img.onload = buildMonochromeImage;
                    img.src = url;
                    function buildMonochromeImage() {
                        // create a colored version of img
                        const c = document.createElement('canvas');
                        const ctx = c.getContext('2d');
                        c.width = img.width;
                        c.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = color;
                        ctx.fillRect(0, 0, img.width, img.height);
                        ctx.globalCompositeOperation = 'source-over';
                        imgElement.src = c.toDataURL();
                    }
                    return "ok";
                }
                else {
                    throw `setImageAsMonochrome: Element id ${viewId} is not an Img.`;
                }
            }
            setPointerCapture(viewId, pointerId) {
                this.getView(viewId).setPointerCapture(pointerId);
                return "ok";
            }
            releasePointerCapture(viewId, pointerId) {
                this.getView(viewId).releasePointerCapture(pointerId);
                return "ok";
            }
            focusView(elementId) {
                const element = this.getView(elementId);
                if (!(element instanceof HTMLElement)) {
                    throw `Element id ${elementId} is not focusable.`;
                }
                element.focus();
                return "ok";
            }
            /**
                * Set the Html content for an element.
                *
                * Those html elements won't be available as XamlElement in managed code.
                * WARNING: you should avoid mixing this and `addView` for the same element.
                */
            setHtmlContent(viewId, html) {
                this.setHtmlContentInternal(viewId, html);
                return "ok";
            }
            /**
                * Set the Html content for an element.
                *
                * Those html elements won't be available as XamlElement in managed code.
                * WARNING: you should avoid mixing this and `addView` for the same element.
                */
            setHtmlContentNative(pParams) {
                const params = WindowManagerSetContentHtmlParams.unmarshal(pParams);
                this.setHtmlContentInternal(params.HtmlId, params.Html);
                return true;
            }
            setHtmlContentInternal(viewId, html) {
                this.getView(viewId).innerHTML = html;
            }
            /**
             * Gets the Client and Offset size of the specified element
             *
             * This method is used to determine the size of the scroll bars, to
             * mask the events coming from that zone.
             */
            getClientViewSize(elementId) {
                const element = this.getView(elementId);
                return `${element.clientWidth};${element.clientHeight};${element.offsetWidth};${element.offsetHeight}`;
            }
            /**
             * Gets the Client and Offset size of the specified element
             *
             * This method is used to determine the size of the scroll bars, to
             * mask the events coming from that zone.
             */
            getClientViewSizeNative(pParams, pReturn) {
                const params = WindowManagerGetClientViewSizeParams.unmarshal(pParams);
                const element = this.getView(params.HtmlId);
                const ret2 = new WindowManagerGetClientViewSizeReturn();
                ret2.ClientWidth = element.clientWidth;
                ret2.ClientHeight = element.clientHeight;
                ret2.OffsetWidth = element.offsetWidth;
                ret2.OffsetHeight = element.offsetHeight;
                ret2.marshal(pReturn);
                return true;
            }
            /**
             * Gets a dependency property value.
             *
             * Note that the casing of this method is intentionally Pascal for platform alignment.
             */
            GetDependencyPropertyValue(elementId, propertyName) {
                if (!WindowManager.getDependencyPropertyValueMethod) {
                    WindowManager.getDependencyPropertyValueMethod = Module.mono_bind_static_method("[Uno.UI] Uno.UI.Helpers.Automation:GetDependencyPropertyValue");
                }
                const element = this.getView(elementId);
                const htmlId = Number(element.getAttribute("XamlHandle"));
                return WindowManager.getDependencyPropertyValueMethod(htmlId, propertyName);
            }
            /**
             * Sets a dependency property value.
             *
             * Note that the casing of this method is intentionally Pascal for platform alignment.
             */
            SetDependencyPropertyValue(elementId, propertyNameAndValue) {
                if (!WindowManager.setDependencyPropertyValueMethod) {
                    WindowManager.setDependencyPropertyValueMethod = Module.mono_bind_static_method("[Uno.UI] Uno.UI.Helpers.Automation:SetDependencyPropertyValue");
                }
                const element = this.getView(elementId);
                const htmlId = Number(element.getAttribute("XamlHandle"));
                return WindowManager.setDependencyPropertyValueMethod(htmlId, propertyNameAndValue);
            }
            /**
                * Remove the loading indicator.
                *
                * In a future version it will also handle the splashscreen.
                */
            activate() {
                this.removeLoading();
                return "ok";
            }
            init() {
                if (UnoAppManifest.displayName) {
                    document.title = UnoAppManifest.displayName;
                }
            }
            static initMethods() {
                if (WindowManager.isHosted) {
                    console.debug("Hosted Mode: Skipping MonoRuntime initialization ");
                }
                else {
                    if (!WindowManager.resizeMethod) {
                        WindowManager.resizeMethod = function() {}; // why doesn't this use standard emscripten methods, because its interpreted?  // Module.mono_bind_static_method("[Uno.UI] Windows.UI.Xaml.Window:Resize");
                    }
                    if (!WindowManager.dispatchEventMethod) {
                        WindowManager.dispatchEventMethod = function() {}; // ditto Module.mono_bind_static_method("[Uno.UI] Windows.UI.Xaml.UIElement:DispatchEvent");
                    }
                }
            }
            initDom() {
                this.containerElement = document.getElementById(this.containerElementId);
                if (!this.containerElement) {
                    // If not found, we simply create a new one.
                    this.containerElement = document.createElement("div");
                    document.body.appendChild(this.containerElement);
                }
                window.addEventListener("resize", x => this.resize());
            }
            removeLoading() {
                if (!this.loadingElementId) {
                    return;
                }
                const element = document.getElementById(this.loadingElementId);
                if (element) {
                    element.parentElement.removeChild(element);
                }
                // UWP Window's default background is white.
                const body = document.getElementsByTagName("body")[0];
                body.style.backgroundColor = "#fff";
            }
            resize() {
                if (WindowManager.isHosted) {
                    UnoDispatch.resize(`${document.documentElement.clientWidth};${document.documentElement.clientHeight}`);
                }
                else {
                    WindowManager.resizeMethod(document.documentElement.clientWidth, document.documentElement.clientHeight);
                }
            }
            dispatchEvent(element, eventName, eventPayload = null) {
                const htmlId = Number(element.getAttribute("XamlHandle"));
                // console.debug(`${element.getAttribute("id")}: Raising event ${eventName}.`);
                if (!htmlId) {
                    throw `No attribute XamlHandle on element ${element}. Can't raise event.`;
                }
                if (WindowManager.isHosted) {
                    // Dispatch to the C# backed UnoDispatch class. Events propagated
                    // this way always succeed because synchronous calls are not possible
                    // between the host and the browser, unlike wasm.
                    UnoDispatch.dispatch(String(htmlId), eventName, eventPayload);
                    return true;
                }
                else {
                    return WindowManager.dispatchEventMethod(htmlId, eventName, eventPayload || "");
                }
            }
            getIsConnectedToRootElement(element) {
                const rootElement = this.rootContent;
                if (!rootElement) {
                    return false;
                }
                return rootElement === element || rootElement.contains(element);
            }
            handleToString(handle) {
                // Fastest conversion as of 2020-03-25 (when compared to String(handle) or handle.toString())
                return handle + "";
            }
            setCursor(cssCursor) {
                const unoBody = document.getElementById(this.containerElementId);
                if (unoBody) {
                    //always cleanup
                    if (this.cursorStyleElement != undefined) {
                        this.cursorStyleElement.remove();
                        this.cursorStyleElement = undefined;
                    }
                    //only add custom overriding style if not auto 
                    if (cssCursor != "auto") {
                        // this part is only to override default css:  .uno-buttonbase {cursor: pointer;}
                        this.cursorStyleElement = document.createElement("style");
                        this.cursorStyleElement.innerHTML = ".uno-buttonbase { cursor: " + cssCursor + "; }";
                        document.body.appendChild(this.cursorStyleElement);
                    }
                    unoBody.style.cursor = cssCursor;
                }
                return "ok";
            }
        }
        WindowManager._isHosted = false;
        WindowManager._isLoadEventsEnabled = false;
        WindowManager.unoRootClassName = "uno-root-element";
        WindowManager.unoUnarrangedClassName = "uno-unarranged";
        WindowManager.unoClippedToBoundsClassName = "uno-clippedToBounds";
        WindowManager._cctor = (() => {
            WindowManager.initMethods();
            UI.HtmlDom.initPolyfills();
        })();
        WindowManager.MAX_WIDTH = `${Number.MAX_SAFE_INTEGER}vw`;
        WindowManager.MAX_HEIGHT = `${Number.MAX_SAFE_INTEGER}vh`;
        UI.WindowManager = WindowManager;
        if (typeof define === "function") {
            define(["AppManifest"], () => {
            });
        }
        else {
            throw `The Uno.Wasm.Boostrap is not up to date, please upgrade to a later version`;
        }
    })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));
// Ensure the "Uno" namespace is availablle globally
window.Uno = Uno;
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class StorageFolderMakePersistentParams {
    static unmarshal(pData) {
        let ret = new StorageFolderMakePersistentParams();
        {
            ret.Paths_Length = Number(Module.getValue(pData + 0, "i32"));
        }
        {
            var pArray = Module.getValue(pData + 4, "*");
            if (pArray !== 0) {
                ret.Paths = new Array();
                for (var i = 0; i < ret.Paths_Length; i++) {
                    var value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Paths.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Paths.push(null);
                    }
                }
            }
            else {
                ret.Paths = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerAddViewParams {
    static unmarshal(pData) {
        let ret = new WindowManagerAddViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.ChildView = Number(Module.getValue(pData + 4, "*"));
        }
        {
            ret.Index = Number(Module.getValue(pData + 8, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerArrangeElementParams {
    static unmarshal(pData) {
        let ret = new WindowManagerArrangeElementParams();
        {
            ret.Top = Number(Module.getValue(pData + 0, "double"));
        }
        {
            ret.Left = Number(Module.getValue(pData + 8, "double"));
        }
        {
            ret.Width = Number(Module.getValue(pData + 16, "double"));
        }
        {
            ret.Height = Number(Module.getValue(pData + 24, "double"));
        }
        {
            ret.ClipTop = Number(Module.getValue(pData + 32, "double"));
        }
        {
            ret.ClipLeft = Number(Module.getValue(pData + 40, "double"));
        }
        {
            ret.ClipBottom = Number(Module.getValue(pData + 48, "double"));
        }
        {
            ret.ClipRight = Number(Module.getValue(pData + 56, "double"));
        }
        {
            ret.HtmlId = Number(Module.getValue(pData + 64, "*"));
        }
        {
            ret.Clip = Boolean(Module.getValue(pData + 68, "i32"));
        }
        {
            ret.ClipToBounds = Boolean(Module.getValue(pData + 72, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerCreateContentParams {
    static unmarshal(pData) {
        const ret = new WindowManagerCreateContentParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            const ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.TagName = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.TagName = null;
            }
        }
        {
            ret.Handle = Number(Module.getValue(pData + 8, "*"));
        }
        {
            ret.UIElementRegistrationId = Number(Module.getValue(pData + 12, "i32"));
        }
        {
            ret.IsSvg = Boolean(Module.getValue(pData + 16, "i32"));
        }
        {
            ret.IsFocusable = Boolean(Module.getValue(pData + 20, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerDestroyViewParams {
    static unmarshal(pData) {
        let ret = new WindowManagerDestroyViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerGetBBoxParams {
    static unmarshal(pData) {
        let ret = new WindowManagerGetBBoxParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerGetBBoxReturn {
    marshal(pData) {
        Module.setValue(pData + 0, this.X, "double");
        Module.setValue(pData + 8, this.Y, "double");
        Module.setValue(pData + 16, this.Width, "double");
        Module.setValue(pData + 24, this.Height, "double");
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerGetClientViewSizeParams {
    static unmarshal(pData) {
        let ret = new WindowManagerGetClientViewSizeParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerGetClientViewSizeReturn {
    marshal(pData) {
        Module.setValue(pData + 0, this.OffsetWidth, "double");
        Module.setValue(pData + 8, this.OffsetHeight, "double");
        Module.setValue(pData + 16, this.ClientWidth, "double");
        Module.setValue(pData + 24, this.ClientHeight, "double");
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerInitParams {
    static unmarshal(pData) {
        let ret = new WindowManagerInitParams();
        {
            ret.IsHostedMode = Boolean(Module.getValue(pData + 0, "i32"));
        }
        {
            ret.IsLoadEventsEnabled = Boolean(Module.getValue(pData + 4, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerMeasureViewParams {
    static unmarshal(pData) {
        let ret = new WindowManagerMeasureViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.AvailableWidth = Number(Module.getValue(pData + 8, "double"));
        }
        {
            ret.AvailableHeight = Number(Module.getValue(pData + 16, "double"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerMeasureViewReturn {
    marshal(pData) {
        Module.setValue(pData + 0, this.DesiredWidth, "double");
        Module.setValue(pData + 8, this.DesiredHeight, "double");
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRegisterEventOnViewParams {
    static unmarshal(pData) {
        const ret = new WindowManagerRegisterEventOnViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            const ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.EventName = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.EventName = null;
            }
        }
        {
            ret.OnCapturePhase = Boolean(Module.getValue(pData + 8, "i32"));
        }
        {
            ret.EventExtractorId = Number(Module.getValue(pData + 12, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRemoveAttributeParams {
    static unmarshal(pData) {
        let ret = new WindowManagerRemoveAttributeParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            var ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Name = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Name = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRegisterUIElementReturn {
    marshal(pData) {
        Module.setValue(pData + 0, this.RegistrationId, "i32");
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRemoveViewParams {
    static unmarshal(pData) {
        let ret = new WindowManagerRemoveViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.ChildView = Number(Module.getValue(pData + 4, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerResetStyleParams {
    static unmarshal(pData) {
        const ret = new WindowManagerResetStyleParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.Styles_Length = Number(Module.getValue(pData + 4, "i32"));
        }
        {
            const pArray = Module.getValue(pData + 8, "*");
            if (pArray !== 0) {
                ret.Styles = new Array();
                for (var i = 0; i < ret.Styles_Length; i++) {
                    const value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Styles.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Styles.push(null);
                    }
                }
            }
            else {
                ret.Styles = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerScrollToOptionsParams {
    static unmarshal(pData) {
        let ret = new WindowManagerScrollToOptionsParams();
        {
            ret.Left = Number(Module.getValue(pData + 0, "double"));
        }
        {
            ret.Top = Number(Module.getValue(pData + 8, "double"));
        }
        {
            ret.HasLeft = Boolean(Module.getValue(pData + 16, "i32"));
        }
        {
            ret.HasTop = Boolean(Module.getValue(pData + 20, "i32"));
        }
        {
            ret.DisableAnimation = Boolean(Module.getValue(pData + 24, "i32"));
        }
        {
            ret.HtmlId = Number(Module.getValue(pData + 28, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetAttributeParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetAttributeParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            var ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Name = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Name = null;
            }
        }
        {
            var ptr = Module.getValue(pData + 8, "*");
            if (ptr !== 0) {
                ret.Value = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Value = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRegisterPointerEventsOnViewParams {
    static unmarshal(pData) {
        const ret = new WindowManagerRegisterPointerEventsOnViewParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerRegisterUIElementParams {
    static unmarshal(pData) {
        const ret = new WindowManagerRegisterUIElementParams();
        {
            const ptr = Module.getValue(pData + 0, "*");
            if (ptr !== 0) {
                ret.TypeName = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.TypeName = null;
            }
        }
        {
            ret.IsFrameworkElement = Boolean(Module.getValue(pData + 4, "i32"));
        }
        {
            ret.Classes_Length = Number(Module.getValue(pData + 8, "i32"));
        }
        {
            const pArray = Module.getValue(pData + 12, "*");
            if (pArray !== 0) {
                ret.Classes = new Array();
                for (var i = 0; i < ret.Classes_Length; i++) {
                    const value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Classes.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Classes.push(null);
                    }
                }
            }
            else {
                ret.Classes = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetAttributesParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetAttributesParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.Pairs_Length = Number(Module.getValue(pData + 4, "i32"));
        }
        {
            var pArray = Module.getValue(pData + 8, "*");
            if (pArray !== 0) {
                ret.Pairs = new Array();
                for (var i = 0; i < ret.Pairs_Length; i++) {
                    var value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Pairs.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Pairs.push(null);
                    }
                }
            }
            else {
                ret.Pairs = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetClassesParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetClassesParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.CssClasses_Length = Number(Module.getValue(pData + 4, "i32"));
        }
        {
            var pArray = Module.getValue(pData + 8, "*");
            if (pArray !== 0) {
                ret.CssClasses = new Array();
                for (var i = 0; i < ret.CssClasses_Length; i++) {
                    var value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.CssClasses.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.CssClasses.push(null);
                    }
                }
            }
            else {
                ret.CssClasses = null;
            }
        }
        {
            ret.Index = Number(Module.getValue(pData + 12, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetContentHtmlParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetContentHtmlParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            var ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Html = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Html = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetElementTransformParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetElementTransformParams();
        {
            ret.M11 = Number(Module.getValue(pData + 0, "double"));
        }
        {
            ret.M12 = Number(Module.getValue(pData + 8, "double"));
        }
        {
            ret.M21 = Number(Module.getValue(pData + 16, "double"));
        }
        {
            ret.M22 = Number(Module.getValue(pData + 24, "double"));
        }
        {
            ret.M31 = Number(Module.getValue(pData + 32, "double"));
        }
        {
            ret.M32 = Number(Module.getValue(pData + 40, "double"));
        }
        {
            ret.HtmlId = Number(Module.getValue(pData + 48, "*"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetNameParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetNameParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            var ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Name = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Name = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetPointerEventsParams {
    static unmarshal(pData) {
        const ret = new WindowManagerSetPointerEventsParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.Enabled = Boolean(Module.getValue(pData + 4, "i32"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetPropertyParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetPropertyParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.Pairs_Length = Number(Module.getValue(pData + 4, "i32"));
        }
        {
            var pArray = Module.getValue(pData + 8, "*");
            if (pArray !== 0) {
                ret.Pairs = new Array();
                for (var i = 0; i < ret.Pairs_Length; i++) {
                    var value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Pairs.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Pairs.push(null);
                    }
                }
            }
            else {
                ret.Pairs = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetStyleDoubleParams {
    static unmarshal(pData) {
        const ret = new WindowManagerSetStyleDoubleParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            const ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Name = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Name = null;
            }
        }
        {
            ret.Value = Number(Module.getValue(pData + 8, "double"));
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetStylesParams {
    static unmarshal(pData) {
        const ret = new WindowManagerSetStylesParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            ret.Pairs_Length = Number(Module.getValue(pData + 4, "i32"));
        }
        {
            const pArray = Module.getValue(pData + 8, "*");
            if (pArray !== 0) {
                ret.Pairs = new Array();
                for (var i = 0; i < ret.Pairs_Length; i++) {
                    const value = Module.getValue(pArray + i * 4, "*");
                    if (value !== 0) {
                        ret.Pairs.push(String(MonoRuntime.conv_string(value)));
                    }
                    else {
                        ret.Pairs.push(null);
                    }
                }
            }
            else {
                ret.Pairs = null;
            }
        }
        return ret;
    }
}
/* TSBindingsGenerator Generated code -- this code is regenerated on each build */
class WindowManagerSetXUidParams {
    static unmarshal(pData) {
        let ret = new WindowManagerSetXUidParams();
        {
            ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
        }
        {
            var ptr = Module.getValue(pData + 4, "*");
            if (ptr !== 0) {
                ret.Uid = String(Module.UTF8ToString(ptr));
            }
            else {
                ret.Uid = null;
            }
        }
        return ret;
    }
}
PointerEvent.prototype.isOver = function (element) {
    const bounds = element.getBoundingClientRect();
    return this.pageX >= bounds.left
        && this.pageX < bounds.right
        && this.pageY >= bounds.top
        && this.pageY < bounds.bottom;
};
PointerEvent.prototype.isOverDeep = function (element) {
    if (!element) {
        return false;
    }
    else if (element.style.pointerEvents != "none") {
        return this.isOver(element);
    }
    else {
        for (let elt of element.children) {
            if (this.isOverDeep(elt)) {
                return true;
            }
        }
    }
};
var Uno;
(function (Uno) {
    var Foundation;
    (function (Foundation) {
        var Interop;
        (function (Interop) {
            class ManagedObject {
                static init() {
                    ManagedObject.dispatchMethod = Module.mono_bind_static_method("[Uno.Foundation] Uno.Foundation.Interop.JSObject:Dispatch");
                }
                static dispatch(handle, method, parameters) {
                    if (!ManagedObject.dispatchMethod) {
                        ManagedObject.init();
                    }
                    ManagedObject.dispatchMethod(handle, method, parameters || "");
                }
            }
            Interop.ManagedObject = ManagedObject;
        })(Interop = Foundation.Interop || (Foundation.Interop = {}));
    })(Foundation = Uno.Foundation || (Uno.Foundation = {}));
})(Uno || (Uno = {}));
var Uno;
(function (Uno) {
    var UI;
    (function (UI) {
        var Interop;
        (function (Interop) {
            class Runtime {
                static init() {
                    return "";
                }
            }
            Runtime.engine = Runtime.init();
            Interop.Runtime = Runtime;
        })(Interop = UI.Interop || (UI.Interop = {}));
    })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));
var Uno;
(function (Uno) {
    var UI;
    (function (UI) {
        var Interop;
        (function (Interop) {
            class Xaml {
            }
            Interop.Xaml = Xaml;
        })(Interop = UI.Interop || (UI.Interop = {}));
    })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));
// ReSharper disable InconsistentNaming
var Windows;
(function (Windows) {
    var Storage;
    ///alert("setting Storage\n");
    (function (Storage) {
        class StorageFolder {
            /**
             * Determine if IndexDB is available, some browsers and modes disable it.
             * */
            static isIndexDBAvailable() {
                try {
                    // IndexedDB may not be available in private mode
                    window.indexedDB;
                    return true;
                }
                catch (err) {
                    return false;
                }
            }
            /**
             * Setup the storage persistence of a given set of paths.
             * */
            static makePersistent(pParams) {
                const params = StorageFolderMakePersistentParams.unmarshal(pParams);
                for (var i = 0; i < params.Paths.length; i++) {
                    this.setupStorage(params.Paths[i]);
                }
            }
            /**
             * Setup the storage persistence of a given path.
             * */
            static setupStorage(path) {
                if (Uno.UI.WindowManager.isHosted) {
                    console.debug("Hosted Mode: skipping IndexDB initialization");
                    return;
                }
                if (!this.isIndexDBAvailable()) {
                    console.warn("IndexedDB is not available (private mode or uri starts with file:// ?), changes will not be persisted.");
                    return;
                }
                console.debug("Making persistent: " + path);
                FS.mkdir(path);
                FS.mount(IDBFS, {}, path);
                // Request an initial sync to populate the file system
                const that = this;
                FS.syncfs(true, err => {
                    if (err) {
                        console.error(`Error synchronizing filesystem from IndexDB: ${err}`);
                    }
                });
                // Ensure to sync pseudo file system on unload (and periodically for safety)
                if (!this._isInit) {
                    window.addEventListener("beforeunload", this.synchronizeFileSystem);
                    setInterval(this.synchronizeFileSystem, 10000);
                    this._isInit = true;
                }
            }
            /**
             * Synchronize the IDBFS memory cache back to IndexDB
             * */
            static synchronizeFileSystem() {
                FS.syncfs(err => {
                    if (err) {
                        console.error(`Error synchronizing filesystem from IndexDB: ${err}`);
                    }
                });
            }
        }
        StorageFolder._isInit = false;
        Storage.StorageFolder = StorageFolder;
    })(Storage = Windows.Storage || (Windows.Storage = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var Devices;
    (function (Devices) {
        var Geolocation;
        (function (Geolocation) {
            let GeolocationAccessStatus;
            (function (GeolocationAccessStatus) {
                GeolocationAccessStatus["Allowed"] = "Allowed";
                GeolocationAccessStatus["Denied"] = "Denied";
                GeolocationAccessStatus["Unspecified"] = "Unspecified";
            })(GeolocationAccessStatus || (GeolocationAccessStatus = {}));
            let PositionStatus;
            (function (PositionStatus) {
                PositionStatus["Ready"] = "Ready";
                PositionStatus["Initializing"] = "Initializing";
                PositionStatus["NoData"] = "NoData";
                PositionStatus["Disabled"] = "Disabled";
                PositionStatus["NotInitialized"] = "NotInitialized";
                PositionStatus["NotAvailable"] = "NotAvailable";
            })(PositionStatus || (PositionStatus = {}));
            class Geolocator {
                static initialize() {
                    this.positionWatches = {};
                    if (!this.dispatchAccessRequest) {
                        this.dispatchAccessRequest = Module.mono_bind_static_method("[Uno] Windows.Devices.Geolocation.Geolocator:DispatchAccessRequest");
                    }
                    if (!this.dispatchError) {
                        this.dispatchError = Module.mono_bind_static_method("[Uno] Windows.Devices.Geolocation.Geolocator:DispatchError");
                    }
                    if (!this.dispatchGeoposition) {
                        this.dispatchGeoposition = Module.mono_bind_static_method("[Uno] Windows.Devices.Geolocation.Geolocator:DispatchGeoposition");
                    }
                }
                //checks for permission to the geolocation services
                static requestAccess() {
                    Geolocator.initialize();
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((_) => {
                            Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Allowed);
                        }, (error) => {
                            if (error.code == error.PERMISSION_DENIED) {
                                Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Denied);
                            }
                            else if (error.code == error.POSITION_UNAVAILABLE ||
                                error.code == error.TIMEOUT) {
                                //position unavailable but we still have permission
                                Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Allowed);
                            }
                            else {
                                Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Unspecified);
                            }
                        }, { enableHighAccuracy: false, maximumAge: 86400000, timeout: 100 });
                    }
                    else {
                        Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Denied);
                    }
                }
                //retrieves a single geoposition
                static getGeoposition(desiredAccuracyInMeters, maximumAge, timeout, requestId) {
                    Geolocator.initialize();
                    if (navigator.geolocation) {
                        this.getAccurateCurrentPosition((position) => Geolocator.handleGeoposition(position, requestId), (error) => Geolocator.handleError(error, requestId), desiredAccuracyInMeters, {
                            enableHighAccuracy: desiredAccuracyInMeters < 50,
                            maximumAge: maximumAge,
                            timeout: timeout
                        });
                    }
                    else {
                        Geolocator.dispatchError(PositionStatus.NotAvailable, requestId);
                    }
                }
                static startPositionWatch(desiredAccuracyInMeters, requestId) {
                    Geolocator.initialize();
                    if (navigator.geolocation) {
                        Geolocator.positionWatches[requestId] = navigator.geolocation.watchPosition((position) => Geolocator.handleGeoposition(position, requestId), (error) => Geolocator.handleError(error, requestId));
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                static stopPositionWatch(desiredAccuracyInMeters, requestId) {
                    navigator.geolocation.clearWatch(Geolocator.positionWatches[requestId]);
                    delete Geolocator.positionWatches[requestId];
                }
                static handleGeoposition(position, requestId) {
                    var serializedGeoposition = position.coords.latitude + ":" +
                        position.coords.longitude + ":" +
                        position.coords.altitude + ":" +
                        position.coords.altitudeAccuracy + ":" +
                        position.coords.accuracy + ":" +
                        position.coords.heading + ":" +
                        position.coords.speed + ":" +
                        position.timestamp;
                    Geolocator.dispatchGeoposition(serializedGeoposition, requestId);
                }
                static handleError(error, requestId) {
                    if (error.code == error.TIMEOUT) {
                        Geolocator.dispatchError(PositionStatus.NoData, requestId);
                    }
                    else if (error.code == error.PERMISSION_DENIED) {
                        Geolocator.dispatchError(PositionStatus.Disabled, requestId);
                    }
                    else if (error.code == error.POSITION_UNAVAILABLE) {
                        Geolocator.dispatchError(PositionStatus.NotAvailable, requestId);
                    }
                }
                //this attempts to squeeze out the requested accuracy from the GPS by utilizing the set timeout
                //adapted from https://github.com/gregsramblings/getAccurateCurrentPosition/blob/master/geo.js		
                static getAccurateCurrentPosition(geolocationSuccess, geolocationError, desiredAccuracy, options) {
                    var lastCheckedPosition;
                    var locationEventCount = 0;
                    var watchId;
                    var timerId;
                    var checkLocation = function (position) {
                        lastCheckedPosition = position;
                        locationEventCount = locationEventCount + 1;
                        //is the accuracy enough?
                        if (position.coords.accuracy <= desiredAccuracy) {
                            clearTimeout(timerId);
                            navigator.geolocation.clearWatch(watchId);
                            foundPosition(position);
                        }
                    };
                    var stopTrying = function () {
                        navigator.geolocation.clearWatch(watchId);
                        foundPosition(lastCheckedPosition);
                    };
                    var onError = function (error) {
                        clearTimeout(timerId);
                        navigator.geolocation.clearWatch(watchId);
                        geolocationError(error);
                    };
                    var foundPosition = function (position) {
                        geolocationSuccess(position);
                    };
                    watchId = navigator.geolocation.watchPosition(checkLocation, onError, options);
                    timerId = setTimeout(stopTrying, options.timeout);
                }
                ;
            }
            Geolocation.Geolocator = Geolocator;
        })(Geolocation = Devices.Geolocation || (Devices.Geolocation = {}));
    })(Devices = Windows.Devices || (Windows.Devices = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var Devices;
    (function (Devices) {
        var Sensors;
        (function (Sensors) {
            class Accelerometer {
                static initialize() {
                    if (window.DeviceMotionEvent) {
                        this.dispatchReading = Module.mono_bind_static_method("[Uno] Windows.Devices.Sensors.Accelerometer:DispatchReading");
                        return true;
                    }
                    return false;
                }
                static startReading() {
                    window.addEventListener("devicemotion", Accelerometer.readingChangedHandler);
                }
                static stopReading() {
                    window.removeEventListener("devicemotion", Accelerometer.readingChangedHandler);
                }
                static readingChangedHandler(event) {
                    Accelerometer.dispatchReading(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
                }
            }
            Sensors.Accelerometer = Accelerometer;
        })(Sensors = Devices.Sensors || (Devices.Sensors = {}));
    })(Devices = Windows.Devices || (Windows.Devices = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var Devices;
    (function (Devices) {
        var Sensors;
        (function (Sensors) {
            class Gyrometer {
                static initialize() {
                    try {
                        if (typeof window.Gyroscope === "function") {
                            this.dispatchReading = Module.mono_bind_static_method("[Uno] Windows.Devices.Sensors.Gyrometer:DispatchReading");
                            let GyroscopeClass = window.Gyroscope;
                            this.gyroscope = new GyroscopeClass({ referenceFrame: "device" });
                            return true;
                        }
                    }
                    catch (error) {
                        //sensor not available
                        console.log("Gyroscope could not be initialized.");
                    }
                    return false;
                }
                static startReading() {
                    this.gyroscope.addEventListener("reading", Gyrometer.readingChangedHandler);
                    this.gyroscope.start();
                }
                static stopReading() {
                    this.gyroscope.removeEventListener("reading", Gyrometer.readingChangedHandler);
                    this.gyroscope.stop();
                }
                static readingChangedHandler(event) {
                    Gyrometer.dispatchReading(Gyrometer.gyroscope.x, Gyrometer.gyroscope.y, Gyrometer.gyroscope.z);
                }
            }
            Sensors.Gyrometer = Gyrometer;
        })(Sensors = Devices.Sensors || (Devices.Sensors = {}));
    })(Devices = Windows.Devices || (Windows.Devices = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var Devices;
    (function (Devices) {
        var Sensors;
        (function (Sensors) {
            class Magnetometer {
                static initialize() {
                    try {
                        if (typeof window.Magnetometer === "function") {
                            this.dispatchReading = Module.mono_bind_static_method("[Uno] Windows.Devices.Sensors.Magnetometer:DispatchReading");
                            let MagnetometerClass = window.Magnetometer;
                            this.magnetometer = new MagnetometerClass({ referenceFrame: 'device' });
                            return true;
                        }
                    }
                    catch (error) {
                        //sensor not available
                        console.log("Magnetometer could not be initialized.");
                    }
                    return false;
                }
                static startReading() {
                    this.magnetometer.addEventListener("reading", Magnetometer.readingChangedHandler);
                    this.magnetometer.start();
                }
                static stopReading() {
                    this.magnetometer.removeEventListener("reading", Magnetometer.readingChangedHandler);
                    this.magnetometer.stop();
                }
                static readingChangedHandler(event) {
                    Magnetometer.dispatchReading(Magnetometer.magnetometer.x, Magnetometer.magnetometer.y, Magnetometer.magnetometer.z);
                }
            }
            Sensors.Magnetometer = Magnetometer;
        })(Sensors = Devices.Sensors || (Devices.Sensors = {}));
    })(Devices = Windows.Devices || (Windows.Devices = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var System;
    (function (System) {
        var Profile;
        (function (Profile) {
            class AnalyticsVersionInfo {
                static getUserAgent() {
                    return navigator.userAgent;
                }
                static getBrowserName() {
                    // Opera 8.0+
                    if ((!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
                        return "Opera";
                    }
                    // Firefox 1.0+
                    if (typeof window.InstallTrigger !== 'undefined') {
                        return "Firefox";
                    }
                    // Safari 3.0+ "[object HTMLElementConstructor]" 
                    if (/constructor/i.test(window.HTMLElement) ||
                        ((p) => p.toString() === "[object SafariRemoteNotification]")(typeof window.safari !== 'undefined' && window.safari.pushNotification)) {
                        return "Safari";
                    }
                    // Edge 20+
                    if (!!window.StyleMedia) {
                        return "Edge";
                    }
                    // Chrome 1 - 71
                    if (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) {
                        return "Chrome";
                    }
                }
            }
            Profile.AnalyticsVersionInfo = AnalyticsVersionInfo;
        })(Profile = System.Profile || (System.Profile = {}));
    })(System = Windows.System || (Windows.System = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var UI;
    (function (UI) {
        var Core;
        (function (Core) {
            class SystemNavigationManager {
                constructor() {
                    var that = this;
                    var dispatchBackRequest = Module.mono_bind_static_method("[Uno] Windows.UI.Core.SystemNavigationManager:DispatchBackRequest");
                    window.history.replaceState(0, document.title, null);
                    window.addEventListener("popstate", function (evt) {
                        if (that._isEnabled) {
                            if (evt.state === 0) {
                                // Push something in the stack only if we know that we reached the first page.
                                // There is no way to track our location in the stack, so we use indexes (in the 'state').
                                window.history.pushState(1, document.title, null);
                            }
                            dispatchBackRequest();
                        }
                        else if (evt.state === 1) {
                            // The manager is disabled, but the user requested to navigate forward to our dummy entry,
                            // but we prefer to keep this dummy entry in the forward stack (is more prompt to be cleared by the browser,
                            // and as it's less commonly used it should be less annoying for the user)
                            window.history.back();
                        }
                    });
                }
                static get current() {
                    if (!this._current) {
                        this._current = new SystemNavigationManager();
                    }
                    return this._current;
                }
                enable() {
                    if (this._isEnabled) {
                        return;
                    }
                    // Clear the back stack, so the only items will be ours (and we won't have any remaining forward item)
                    this.clearStack();
                    window.history.pushState(1, document.title, null);
                    // Then set the enabled flag so the handler will begin its work
                    this._isEnabled = true;
                }
                disable() {
                    if (!this._isEnabled) {
                        return;
                    }
                    // Disable the handler, then clear the history
                    // Note: As a side effect, the forward button will be enabled :(
                    this._isEnabled = false;
                    this.clearStack();
                }
                clearStack() {
                    // There is no way to determine our position in the stack, so we only navigate back if we determine that
                    // we are currently on our dummy target page.
                    if (window.history.state === 1) {
                        window.history.back();
                    }
                    window.history.replaceState(0, document.title, null);
                }
            }
            Core.SystemNavigationManager = SystemNavigationManager;
        })(Core = UI.Core || (UI.Core = {}));
    })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var UI;
    (function (UI) {
        var Xaml;
        (function (Xaml) {
            let ApplicationTheme;
            (function (ApplicationTheme) {
                ApplicationTheme["Light"] = "Light";
                ApplicationTheme["Dark"] = "Dark";
            })(ApplicationTheme = Xaml.ApplicationTheme || (Xaml.ApplicationTheme = {}));
        })(Xaml = UI.Xaml || (UI.Xaml = {}));
    })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));
var Windows;
(function (Windows) {
    var Phone;
    (function (Phone) {
        var Devices;
        (function (Devices) {
            var Notification;
            (function (Notification) {
                class VibrationDevice {
                    static initialize() {
                        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
                        if (navigator.vibrate) {
                            return true;
                        }
                        return false;
                    }
                    static vibrate(duration) {
                        return window.navigator.vibrate(duration);
                    }
                }
                Notification.VibrationDevice = VibrationDevice;
            })(Notification = Devices.Notification || (Devices.Notification = {}));
        })(Devices = Phone.Devices || (Phone.Devices = {}));
    })(Phone = Windows.Phone || (Windows.Phone = {}));
})(Windows || (Windows = {}));


(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function (handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function (event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function (handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function (handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function (handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function (handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));



run();



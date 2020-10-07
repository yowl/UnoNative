
	var DOTNET= {
		_dotnet_get_global: function() {
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
		},
		//FIXME this is wastefull, we could remove the temp malloc by going the UTF16 route
		//FIXME this is unsafe, cuz raw objects could be GC'd.
		conv_string: function (mono_obj) {
			if (mono_obj == 0)
				return null;

			if (!this.mono_string_get_utf8)
				this.mono_string_get_utf8 = Module.cwrap ('mono_wasm_string_get_utf8', 'number', ['number']);

			var raw = this.mono_string_get_utf8 (mono_obj);
			var res = Module.UTF8ToString (raw);
			Module._free (raw);

			return res;
		},		
	}

  function _corert_wasm_invoke_js_unmarshalled(js, length, arg0, arg1, arg2, exception) {
  
          alert("wasm invoke unmarshalled");
          var jsFuncName = UTF8ToString(js, length);
          alert(jsFuncName);
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

function _corert_wasm_invoke_js(js, length, exception) {
          var mono_string = DOTNET._dotnet_get_global()._mono_string_cached
              || (DOTNET._dotnet_get_global()._mono_string_cached = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']));
  
          alert("wasm invoke");
          var jsFuncName = UTF8ToString(js, length);
  //        var funcNameJsString = DOTNET.conv_string(js); // this relies on mono_wasm_string_get_utf8 which we dont have.  Its in driver.c
  //        alert(funcNameJsString);
          alert(jsFuncName);
          var res = eval(jsFuncName);
          exception = 0;
          return "" + res;
      }




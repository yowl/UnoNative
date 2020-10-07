var Module = typeof Module !== "undefined" ? Module : {};

var requirejs, require, define;

!function(global, setTimeout) {
 var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.3.6", commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), isWebWorker = !isBrowser && "undefined" != typeof importScripts, readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(), contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
 function commentReplace(e, t) {
  return t || "";
 }
 function isFunction(e) {
  return "[object Function]" === ostring.call(e);
 }
 function isArray(e) {
  return "[object Array]" === ostring.call(e);
 }
 function each(e, t) {
  var i;
  if (e) for (i = 0; i < e.length && (!e[i] || !t(e[i], i, e)); i += 1) ;
 }
 function eachReverse(e, t) {
  var i;
  if (e) for (i = e.length - 1; -1 < i && (!e[i] || !t(e[i], i, e)); i -= 1) ;
 }
 function hasProp(e, t) {
  return hasOwn.call(e, t);
 }
 function getOwn(e, t) {
  return hasProp(e, t) && e[t];
 }
 function eachProp(e, t) {
  var i;
  for (i in e) if (hasProp(e, i) && t(e[i], i)) break;
 }
 function mixin(i, e, r, n) {
  return e && eachProp(e, function(e, t) {
   !r && hasProp(i, t) || (!n || "object" != typeof e || !e || isArray(e) || isFunction(e) || e instanceof RegExp ? i[t] = e : (i[t] || (i[t] = {}), 
   mixin(i[t], e, r, n)));
  }), i;
 }
 function bind(e, t) {
  return function() {
   return t.apply(e, arguments);
  };
 }
 function scripts() {
  return document.getElementsByTagName("script");
 }
 function defaultOnError(e) {
  throw e;
 }
 function getGlobal(e) {
  if (!e) return e;
  var t = global;
  return each(e.split("."), function(e) {
   t = t[e];
  }), t;
 }
 function makeError(e, t, i, r) {
  var n = new Error(t + "\nhttps://requirejs.org/docs/errors.html#" + e);
  return n.requireType = e, n.requireModules = r, i && (n.originalError = i), n;
 }
 if (void 0 === define) {
  if (void 0 !== requirejs) {
   if (isFunction(requirejs)) return;
   cfg = requirejs, requirejs = void 0;
  }
  void 0 === require || isFunction(require) || (cfg = require, require = void 0), 
  req = requirejs = function(e, t, i, r) {
   var n, o, a = defContextName;
   return isArray(e) || "string" == typeof e || (o = e, isArray(t) ? (e = t, t = i, 
   i = r) : e = []), o && o.context && (a = o.context), (n = getOwn(contexts, a)) || (n = contexts[a] = req.s.newContext(a)), 
   o && n.configure(o), n.require(e, t, i);
  }, req.config = function(e) {
   return req(e);
  }, req.nextTick = void 0 !== setTimeout ? function(e) {
   setTimeout(e, 4);
  } : function(e) {
   e();
  }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, 
  req.isBrowser = isBrowser, s = req.s = {
   contexts: contexts,
   newContext: newContext
  }, req({}), each([ "toUrl", "undef", "defined", "specified" ], function(t) {
   req[t] = function() {
    var e = contexts[defContextName];
    return e.require[t].apply(e, arguments);
   };
  }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], 
  baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, 
  req.createNode = function(e, t, i) {
   var r = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
   return r.type = e.scriptType || "text/javascript", r.charset = "utf-8", r.async = !0, 
   r;
  }, req.load = function(t, i, r) {
   var e, n = t && t.config || {};
   if (isBrowser) return (e = req.createNode(n, i, r)).setAttribute("data-requirecontext", t.contextName), 
   e.setAttribute("data-requiremodule", i), !e.attachEvent || e.attachEvent.toString && e.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (e.addEventListener("load", t.onScriptLoad, !1), 
   e.addEventListener("error", t.onScriptError, !1)) : (useInteractive = !0, e.attachEvent("onreadystatechange", t.onScriptLoad)), 
   e.src = r, n.onNodeCreated && n.onNodeCreated(e, n, i, r), currentlyAddingScript = e, 
   baseElement ? head.insertBefore(e, baseElement) : head.appendChild(e), currentlyAddingScript = null, 
   e;
   if (isWebWorker) try {
    setTimeout(function() {}, 0), importScripts(r), t.completeLoad(i);
   } catch (e) {
    t.onError(makeError("importscripts", "importScripts failed for " + i + " at " + r, e, [ i ]));
   }
  }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function(e) {
   if (head || (head = e.parentNode), dataMain = e.getAttribute("data-main")) return mainScript = dataMain, 
   cfg.baseUrl || -1 !== mainScript.indexOf("!") || (mainScript = (src = mainScript.split("/")).pop(), 
   subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), 
   req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [ mainScript ], 
   !0;
  }), define = function(e, i, t) {
   var r, n;
   "string" != typeof e && (t = i, i = e, e = null), isArray(i) || (t = i, i = null), 
   !i && isFunction(t) && (i = [], t.length && (t.toString().replace(commentRegExp, commentReplace).replace(cjsRequireRegExp, function(e, t) {
    i.push(t);
   }), i = (1 === t.length ? [ "require" ] : [ "require", "exports", "module" ]).concat(i))), 
   useInteractive && (r = currentlyAddingScript || getInteractiveScript()) && (e || (e = r.getAttribute("data-requiremodule")), 
   n = contexts[r.getAttribute("data-requirecontext")]), n ? (n.defQueue.push([ e, i, t ]), 
   n.defQueueMap[e] = !0) : globalDefQueue.push([ e, i, t ]);
  }, define.amd = {
   jQuery: !0
  }, req.exec = function(text) {
   return eval(text);
  }, req(cfg);
 }
 function newContext(u) {
  var i, e, l, c, d, g = {
   waitSeconds: 7,
   baseUrl: "./",
   paths: {},
   bundles: {},
   pkgs: {},
   shim: {},
   config: {}
  }, p = {}, f = {}, r = {}, h = [], m = {}, n = {}, v = {}, x = 1, b = 1;
  function q(e, t, i) {
   var r, n, o, a, s, u, c, d, p, f, l = t && t.split("/"), h = g.map, m = h && h["*"];
   if (e && (u = (e = e.split("/")).length - 1, g.nodeIdCompat && jsSuffixRegExp.test(e[u]) && (e[u] = e[u].replace(jsSuffixRegExp, "")), 
   "." === e[0].charAt(0) && l && (e = l.slice(0, l.length - 1).concat(e)), function(e) {
    var t, i;
    for (t = 0; t < e.length; t++) if ("." === (i = e[t])) e.splice(t, 1), t -= 1; else if (".." === i) {
     if (0 === t || 1 === t && ".." === e[2] || ".." === e[t - 1]) continue;
     0 < t && (e.splice(t - 1, 2), t -= 2);
    }
   }(e), e = e.join("/")), i && h && (l || m)) {
    e: for (o = (n = e.split("/")).length; 0 < o; o -= 1) {
     if (s = n.slice(0, o).join("/"), l) for (a = l.length; 0 < a; a -= 1) if ((r = getOwn(h, l.slice(0, a).join("/"))) && (r = getOwn(r, s))) {
      c = r, d = o;
      break e;
     }
     !p && m && getOwn(m, s) && (p = getOwn(m, s), f = o);
    }
    !c && p && (c = p, d = f), c && (n.splice(0, d, c), e = n.join("/"));
   }
   return getOwn(g.pkgs, e) || e;
  }
  function E(t) {
   isBrowser && each(scripts(), function(e) {
    if (e.getAttribute("data-requiremodule") === t && e.getAttribute("data-requirecontext") === l.contextName) return e.parentNode.removeChild(e), 
    !0;
   });
  }
  function w(e) {
   var t = getOwn(g.paths, e);
   if (t && isArray(t) && 1 < t.length) return t.shift(), l.require.undef(e), l.makeRequire(null, {
    skipMap: !0
   })([ e ]), !0;
  }
  function y(e) {
   var t, i = e ? e.indexOf("!") : -1;
   return -1 < i && (t = e.substring(0, i), e = e.substring(i + 1, e.length)), [ t, e ];
  }
  function S(e, t, i, r) {
   var n, o, a, s, u = null, c = t ? t.name : null, d = e, p = !0, f = "";
   return e || (p = !1, e = "_@r" + (x += 1)), u = (s = y(e))[0], e = s[1], u && (u = q(u, c, r), 
   o = getOwn(m, u)), e && (u ? f = i ? e : o && o.normalize ? o.normalize(e, function(e) {
    return q(e, c, r);
   }) : -1 === e.indexOf("!") ? q(e, c, r) : e : (u = (s = y(f = q(e, c, r)))[0], f = s[1], 
   i = !0, n = l.nameToUrl(f))), {
    prefix: u,
    name: f,
    parentMap: t,
    unnormalized: !!(a = !u || o || i ? "" : "_unnormalized" + (b += 1)),
    url: n,
    originalName: d,
    isDefine: p,
    id: (u ? u + "!" + f : f) + a
   };
  }
  function k(e) {
   var t = e.id, i = getOwn(p, t);
   return i || (i = p[t] = new l.Module(e)), i;
  }
  function M(e, t, i) {
   var r = e.id, n = getOwn(p, r);
   !hasProp(m, r) || n && !n.defineEmitComplete ? (n = k(e)).error && "error" === t ? i(n.error) : n.on(t, i) : "defined" === t && i(m[r]);
  }
  function O(i, e) {
   var t = i.requireModules, r = !1;
   e ? e(i) : (each(t, function(e) {
    var t = getOwn(p, e);
    t && (t.error = i, t.events.error && (r = !0, t.emit("error", i)));
   }), r || req.onError(i));
  }
  function j() {
   globalDefQueue.length && (each(globalDefQueue, function(e) {
    var t = e[0];
    "string" == typeof t && (l.defQueueMap[t] = !0), h.push(e);
   }), globalDefQueue = []);
  }
  function P(e) {
   delete p[e], delete f[e];
  }
  function R() {
   var e, r, t = 1e3 * g.waitSeconds, n = t && l.startTime + t < new Date().getTime(), o = [], a = [], s = !1, u = !0;
   if (!i) {
    if (i = !0, eachProp(f, function(e) {
     var t = e.map, i = t.id;
     if (e.enabled && (t.isDefine || a.push(e), !e.error)) if (!e.inited && n) w(i) ? s = r = !0 : (o.push(i), 
     E(i)); else if (!e.inited && e.fetched && t.isDefine && (s = !0, !t.prefix)) return u = !1;
    }), n && o.length) return (e = makeError("timeout", "Load timeout for modules: " + o, null, o)).contextName = l.contextName, 
    O(e);
    u && each(a, function(e) {
     !function n(o, a, s) {
      var e = o.map.id;
      o.error ? o.emit("error", o.error) : (a[e] = !0, each(o.depMaps, function(e, t) {
       var i = e.id, r = getOwn(p, i);
       !r || o.depMatched[t] || s[i] || (getOwn(a, i) ? (o.defineDep(t, m[i]), o.check()) : n(r, a, s));
      }), s[e] = !0);
     }(e, {}, {});
    }), n && !r || !s || !isBrowser && !isWebWorker || d || (d = setTimeout(function() {
     d = 0, R();
    }, 50)), i = !1;
   }
  }
  function a(e) {
   hasProp(m, e[0]) || k(S(e[0], null, !0)).init(e[1], e[2]);
  }
  function o(e, t, i, r) {
   e.detachEvent && !isOpera ? r && e.detachEvent(r, t) : e.removeEventListener(i, t, !1);
  }
  function s(e) {
   var t = e.currentTarget || e.srcElement;
   return o(t, l.onScriptLoad, "load", "onreadystatechange"), o(t, l.onScriptError, "error"), 
   {
    node: t,
    id: t && t.getAttribute("data-requiremodule")
   };
  }
  function T() {
   var e;
   for (j(); h.length; ) {
    if (null === (e = h.shift())[0]) return O(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
    a(e);
   }
   l.defQueueMap = {};
  }
  return c = {
   require: function(e) {
    return e.require ? e.require : e.require = l.makeRequire(e.map);
   },
   exports: function(e) {
    if (e.usingExports = !0, e.map.isDefine) return e.exports ? m[e.map.id] = e.exports : e.exports = m[e.map.id] = {};
   },
   module: function(e) {
    return e.module ? e.module : e.module = {
     id: e.map.id,
     uri: e.map.url,
     config: function() {
      return getOwn(g.config, e.map.id) || {};
     },
     exports: e.exports || (e.exports = {})
    };
   }
  }, (e = function(e) {
   this.events = getOwn(r, e.id) || {}, this.map = e, this.shim = getOwn(g.shim, e.id), 
   this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, 
   this.depCount = 0;
  }).prototype = {
   init: function(e, t, i, r) {
    r = r || {}, this.inited || (this.factory = t, i ? this.on("error", i) : this.events.error && (i = bind(this, function(e) {
     this.emit("error", e);
    })), this.depMaps = e && e.slice(0), this.errback = i, this.inited = !0, this.ignore = r.ignore, 
    r.enabled || this.enabled ? this.enable() : this.check());
   },
   defineDep: function(e, t) {
    this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t);
   },
   fetch: function() {
    if (!this.fetched) {
     this.fetched = !0, l.startTime = new Date().getTime();
     var e = this.map;
     if (!this.shim) return e.prefix ? this.callPlugin() : this.load();
     l.makeRequire(this.map, {
      enableBuildCallback: !0
     })(this.shim.deps || [], bind(this, function() {
      return e.prefix ? this.callPlugin() : this.load();
     }));
    }
   },
   load: function() {
    var e = this.map.url;
    n[e] || (n[e] = !0, l.load(this.map.id, e));
   },
   check: function() {
    if (this.enabled && !this.enabling) {
     var t, e, i = this.map.id, r = this.depExports, n = this.exports, o = this.factory;
     if (this.inited) {
      if (this.error) this.emit("error", this.error); else if (!this.defining) {
       if (this.defining = !0, this.depCount < 1 && !this.defined) {
        if (isFunction(o)) {
         if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) try {
          n = l.execCb(i, o, r, n);
         } catch (e) {
          t = e;
         } else n = l.execCb(i, o, r, n);
         if (this.map.isDefine && void 0 === n && ((e = this.module) ? n = e.exports : this.usingExports && (n = this.exports)), 
         t) return t.requireMap = this.map, t.requireModules = this.map.isDefine ? [ this.map.id ] : null, 
         t.requireType = this.map.isDefine ? "define" : "require", O(this.error = t);
        } else n = o;
        if (this.exports = n, this.map.isDefine && !this.ignore && (m[i] = n, req.onResourceLoad)) {
         var a = [];
         each(this.depMaps, function(e) {
          a.push(e.normalizedMap || e);
         }), req.onResourceLoad(l, this.map, a);
        }
        P(i), this.defined = !0;
       }
       this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, 
       this.emit("defined", this.exports), this.defineEmitComplete = !0);
      }
     } else hasProp(l.defQueueMap, i) || this.fetch();
    }
   },
   callPlugin: function() {
    var u = this.map, c = u.id, e = S(u.prefix);
    this.depMaps.push(e), M(e, "defined", bind(this, function(e) {
     var o, t, i, r = getOwn(v, this.map.id), n = this.map.name, a = this.map.parentMap ? this.map.parentMap.name : null, s = l.makeRequire(u.parentMap, {
      enableBuildCallback: !0
     });
     return this.map.unnormalized ? (e.normalize && (n = e.normalize(n, function(e) {
      return q(e, a, !0);
     }) || ""), M(t = S(u.prefix + "!" + n, this.map.parentMap, !0), "defined", bind(this, function(e) {
      this.map.normalizedMap = t, this.init([], function() {
       return e;
      }, null, {
       enabled: !0,
       ignore: !0
      });
     })), void ((i = getOwn(p, t.id)) && (this.depMaps.push(t), this.events.error && i.on("error", bind(this, function(e) {
      this.emit("error", e);
     })), i.enable()))) : r ? (this.map.url = l.nameToUrl(r), void this.load()) : ((o = bind(this, function(e) {
      this.init([], function() {
       return e;
      }, null, {
       enabled: !0
      });
     })).error = bind(this, function(e) {
      this.inited = !0, (this.error = e).requireModules = [ c ], eachProp(p, function(e) {
       0 === e.map.id.indexOf(c + "_unnormalized") && P(e.map.id);
      }), O(e);
     }), o.fromText = bind(this, function(e, t) {
      var i = u.name, r = S(i), n = useInteractive;
      t && (e = t), n && (useInteractive = !1), k(r), hasProp(g.config, c) && (g.config[i] = g.config[c]);
      try {
       req.exec(e);
      } catch (e) {
       return O(makeError("fromtexteval", "fromText eval for " + c + " failed: " + e, e, [ c ]));
      }
      n && (useInteractive = !0), this.depMaps.push(r), l.completeLoad(i), s([ i ], o);
     }), void e.load(u.name, s, o, g));
    })), l.enable(e, this), this.pluginMaps[e.id] = e;
   },
   enable: function() {
    (f[this.map.id] = this).enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function(e, t) {
     var i, r, n;
     if ("string" == typeof e) {
      if (e = S(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), 
      this.depMaps[t] = e, n = getOwn(c, e.id)) return void (this.depExports[t] = n(this));
      this.depCount += 1, M(e, "defined", bind(this, function(e) {
       this.undefed || (this.defineDep(t, e), this.check());
      })), this.errback ? M(e, "error", bind(this, this.errback)) : this.events.error && M(e, "error", bind(this, function(e) {
       this.emit("error", e);
      }));
     }
     i = e.id, r = p[i], hasProp(c, i) || !r || r.enabled || l.enable(e, this);
    })), eachProp(this.pluginMaps, bind(this, function(e) {
     var t = getOwn(p, e.id);
     t && !t.enabled && l.enable(e, this);
    })), this.enabling = !1, this.check();
   },
   on: function(e, t) {
    var i = this.events[e];
    i || (i = this.events[e] = []), i.push(t);
   },
   emit: function(e, t) {
    each(this.events[e], function(e) {
     e(t);
    }), "error" === e && delete this.events[e];
   }
  }, (l = {
   config: g,
   contextName: u,
   registry: p,
   defined: m,
   urlFetched: n,
   defQueue: h,
   defQueueMap: {},
   Module: e,
   makeModuleMap: S,
   nextTick: req.nextTick,
   onError: O,
   configure: function(e) {
    if (e.baseUrl && "/" !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += "/"), 
    "string" == typeof e.urlArgs) {
     var i = e.urlArgs;
     e.urlArgs = function(e, t) {
      return (-1 === t.indexOf("?") ? "?" : "&") + i;
     };
    }
    var r = g.shim, n = {
     paths: !0,
     bundles: !0,
     config: !0,
     map: !0
    };
    eachProp(e, function(e, t) {
     n[t] ? (g[t] || (g[t] = {}), mixin(g[t], e, !0, !0)) : g[t] = e;
    }), e.bundles && eachProp(e.bundles, function(e, t) {
     each(e, function(e) {
      e !== t && (v[e] = t);
     });
    }), e.shim && (eachProp(e.shim, function(e, t) {
     isArray(e) && (e = {
      deps: e
     }), !e.exports && !e.init || e.exportsFn || (e.exportsFn = l.makeShimExports(e)), 
     r[t] = e;
    }), g.shim = r), e.packages && each(e.packages, function(e) {
     var t;
     t = (e = "string" == typeof e ? {
      name: e
     } : e).name, e.location && (g.paths[t] = e.location), g.pkgs[t] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "");
    }), eachProp(p, function(e, t) {
     e.inited || e.map.unnormalized || (e.map = S(t, null, !0));
    }), (e.deps || e.callback) && l.require(e.deps || [], e.callback);
   },
   makeShimExports: function(t) {
    return function() {
     var e;
     return t.init && (e = t.init.apply(global, arguments)), e || t.exports && getGlobal(t.exports);
    };
   },
   makeRequire: function(o, a) {
    function s(e, t, i) {
     var r, n;
     return a.enableBuildCallback && t && isFunction(t) && (t.__requireJsBuild = !0), 
     "string" == typeof e ? isFunction(t) ? O(makeError("requireargs", "Invalid require call"), i) : o && hasProp(c, e) ? c[e](p[o.id]) : req.get ? req.get(l, e, o, s) : (r = S(e, o, !1, !0).id, 
     hasProp(m, r) ? m[r] : O(makeError("notloaded", 'Module name "' + r + '" has not been loaded yet for context: ' + u + (o ? "" : ". Use require([])")))) : (T(), 
     l.nextTick(function() {
      T(), (n = k(S(null, o))).skipMap = a.skipMap, n.init(e, t, i, {
       enabled: !0
      }), R();
     }), s);
    }
    return a = a || {}, mixin(s, {
     isBrowser: isBrowser,
     toUrl: function(e) {
      var t, i = e.lastIndexOf("."), r = e.split("/")[0];
      return -1 !== i && (!("." === r || ".." === r) || 1 < i) && (t = e.substring(i, e.length), 
      e = e.substring(0, i)), l.nameToUrl(q(e, o && o.id, !0), t, !0);
     },
     defined: function(e) {
      return hasProp(m, S(e, o, !1, !0).id);
     },
     specified: function(e) {
      return e = S(e, o, !1, !0).id, hasProp(m, e) || hasProp(p, e);
     }
    }), o || (s.undef = function(i) {
     j();
     var e = S(i, o, !0), t = getOwn(p, i);
     t.undefed = !0, E(i), delete m[i], delete n[e.url], delete r[i], eachReverse(h, function(e, t) {
      e[0] === i && h.splice(t, 1);
     }), delete l.defQueueMap[i], t && (t.events.defined && (r[i] = t.events), P(i));
    }), s;
   },
   enable: function(e) {
    getOwn(p, e.id) && k(e).enable();
   },
   completeLoad: function(e) {
    var t, i, r, n = getOwn(g.shim, e) || {}, o = n.exports;
    for (j(); h.length; ) {
     if (null === (i = h.shift())[0]) {
      if (i[0] = e, t) break;
      t = !0;
     } else i[0] === e && (t = !0);
     a(i);
    }
    if (l.defQueueMap = {}, r = getOwn(p, e), !t && !hasProp(m, e) && r && !r.inited) {
     if (!(!g.enforceDefine || o && getGlobal(o))) return w(e) ? void 0 : O(makeError("nodefine", "No define call for " + e, null, [ e ]));
     a([ e, n.deps || [], n.exportsFn ]);
    }
    R();
   },
   nameToUrl: function(e, t, i) {
    var r, n, o, a, s, u, c = getOwn(g.pkgs, e);
    if (c && (e = c), u = getOwn(v, e)) return l.nameToUrl(u, t, i);
    if (req.jsExtRegExp.test(e)) a = e + (t || ""); else {
     for (r = g.paths, o = (n = e.split("/")).length; 0 < o; o -= 1) if (s = getOwn(r, n.slice(0, o).join("/"))) {
      isArray(s) && (s = s[0]), n.splice(0, o, s);
      break;
     }
     a = n.join("/"), a = ("/" === (a += t || (/^data\:|^blob\:|\?/.test(a) || i ? "" : ".js")).charAt(0) || a.match(/^[\w\+\.\-]+:/) ? "" : g.baseUrl) + a;
    }
    return g.urlArgs && !/^blob\:/.test(a) ? a + g.urlArgs(e, a) : a;
   },
   load: function(e, t) {
    req.load(l, e, t);
   },
   execCb: function(e, t, i, r) {
    return t.apply(r, i);
   },
   onScriptLoad: function(e) {
    if ("load" === e.type || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
     interactiveScript = null;
     var t = s(e);
     l.completeLoad(t.id);
    }
   },
   onScriptError: function(e) {
    var i = s(e);
    if (!w(i.id)) {
     var r = [];
     return eachProp(p, function(e, t) {
      0 !== t.indexOf("_@r") && each(e.depMaps, function(e) {
       if (e.id === i.id) return r.push(t), !0;
      });
     }), O(makeError("scripterror", 'Script error for "' + i.id + (r.length ? '", needed by: ' + r.join(", ") : '"'), e, [ i.id ]));
    }
   }
  }).require = l.makeRequire(), l;
 }
 function getInteractiveScript() {
  return interactiveScript && "interactive" === interactiveScript.readyState || eachReverse(scripts(), function(e) {
   if ("interactive" === e.readyState) return interactiveScript = e;
  }), interactiveScript;
 }
}(this, "undefined" == typeof setTimeout ? void 0 : setTimeout);

var DotNet;

(function(DotNet) {
 window.DotNet = DotNet;
 const jsonRevivers = [];
 const pendingAsyncCalls = {};
 const cachedJSFunctions = {};
 let nextAsyncCallId = 1;
 let dotNetDispatcher = null;
 function attachDispatcher(dispatcher) {
  dotNetDispatcher = dispatcher;
 }
 DotNet.attachDispatcher = attachDispatcher;
 function attachReviver(reviver) {
  jsonRevivers.push(reviver);
 }
 DotNet.attachReviver = attachReviver;
 function invokeMethod(assemblyName, methodIdentifier, ...args) {
  return invokePossibleInstanceMethod(assemblyName, methodIdentifier, null, args);
 }
 DotNet.invokeMethod = invokeMethod;
 function invokeMethodAsync(assemblyName, methodIdentifier, ...args) {
  return invokePossibleInstanceMethodAsync(assemblyName, methodIdentifier, null, args);
 }
 DotNet.invokeMethodAsync = invokeMethodAsync;
 function invokePossibleInstanceMethod(assemblyName, methodIdentifier, dotNetObjectId, args) {
  const dispatcher = getRequiredDispatcher();
  if (dispatcher.invokeDotNetFromJS) {
   const argsJson = JSON.stringify(args, argReplacer);
   const resultJson = dispatcher.invokeDotNetFromJS(assemblyName, methodIdentifier, dotNetObjectId, argsJson);
   return resultJson ? parseJsonWithRevivers(resultJson) : null;
  } else {
   throw new Error("The current dispatcher does not support synchronous calls from JS to .NET. Use invokeMethodAsync instead.");
  }
 }
 function invokePossibleInstanceMethodAsync(assemblyName, methodIdentifier, dotNetObjectId, args) {
  if (assemblyName && dotNetObjectId) {
   throw new Error(`For instance method calls, assemblyName should be null. Received '${assemblyName}'.`);
  }
  const asyncCallId = nextAsyncCallId++;
  const resultPromise = new Promise((resolve, reject) => {
   pendingAsyncCalls[asyncCallId] = {
    resolve: resolve,
    reject: reject
   };
  });
  try {
   const argsJson = JSON.stringify(args, argReplacer);
   getRequiredDispatcher().beginInvokeDotNetFromJS(asyncCallId, assemblyName, methodIdentifier, dotNetObjectId, argsJson);
  } catch (ex) {
   completePendingCall(asyncCallId, false, ex);
  }
  return resultPromise;
 }
 function getRequiredDispatcher() {
  if (dotNetDispatcher !== null) {
   return dotNetDispatcher;
  }
  throw new Error("No .NET call dispatcher has been set.");
 }
 function completePendingCall(asyncCallId, success, resultOrError) {
  if (!pendingAsyncCalls.hasOwnProperty(asyncCallId)) {
   throw new Error(`There is no pending async call with ID ${asyncCallId}.`);
  }
  const asyncCall = pendingAsyncCalls[asyncCallId];
  delete pendingAsyncCalls[asyncCallId];
  if (success) {
   asyncCall.resolve(resultOrError);
  } else {
   asyncCall.reject(resultOrError);
  }
 }
 DotNet.jsCallDispatcher = {
  findJSFunction: findJSFunction,
  invokeJSFromDotNet: (identifier, argsJson) => {
   const result = findJSFunction(identifier).apply(null, parseJsonWithRevivers(argsJson));
   return result === null || result === undefined ? null : JSON.stringify(result, argReplacer);
  },
  beginInvokeJSFromDotNet: (asyncHandle, identifier, argsJson) => {
   const promise = new Promise(resolve => {
    const synchronousResultOrPromise = findJSFunction(identifier).apply(null, parseJsonWithRevivers(argsJson));
    resolve(synchronousResultOrPromise);
   });
   if (asyncHandle) {
    promise.then(result => getRequiredDispatcher().endInvokeJSFromDotNet(asyncHandle, true, JSON.stringify([ asyncHandle, true, result ], argReplacer)), error => getRequiredDispatcher().endInvokeJSFromDotNet(asyncHandle, false, JSON.stringify([ asyncHandle, false, formatError(error) ])));
   }
  },
  endInvokeDotNetFromJS: (asyncCallId, success, resultOrExceptionMessage) => {
   const resultOrError = success ? resultOrExceptionMessage : new Error(resultOrExceptionMessage);
   completePendingCall(parseInt(asyncCallId), success, resultOrError);
  }
 };
 function parseJsonWithRevivers(json) {
  return json ? JSON.parse(json, (key, initialValue) => {
   return jsonRevivers.reduce((latestValue, reviver) => reviver(key, latestValue), initialValue);
  }) : null;
 }
 function formatError(error) {
  if (error instanceof Error) {
   return `${error.message}\n${error.stack}`;
  } else {
   return error ? error.toString() : "null";
  }
 }
 function findJSFunction(identifier) {
  if (cachedJSFunctions.hasOwnProperty(identifier)) {
   return cachedJSFunctions[identifier];
  }
  let result = window;
  let resultIdentifier = "window";
  let lastSegmentValue;
  identifier.split(".").forEach(segment => {
   if (segment in result) {
    lastSegmentValue = result;
    result = result[segment];
    resultIdentifier += "." + segment;
   } else {
    throw new Error(`Could not find '${segment}' in '${resultIdentifier}'.`);
   }
  });
  if (result instanceof Function) {
   result = result.bind(lastSegmentValue);
   cachedJSFunctions[identifier] = result;
   return result;
  } else {
   throw new Error(`The value '${resultIdentifier}' is not a function.`);
  }
 }
 class DotNetObject {
  constructor(_id) {
   this._id = _id;
  }
  invokeMethod(methodIdentifier, ...args) {
   return invokePossibleInstanceMethod(null, methodIdentifier, this._id, args);
  }
  invokeMethodAsync(methodIdentifier, ...args) {
   return invokePossibleInstanceMethodAsync(null, methodIdentifier, this._id, args);
  }
  dispose() {
   const promise = invokePossibleInstanceMethodAsync(null, "__Dispose", this._id, null);
   promise.catch(error => console.error(error));
  }
  serializeAsArg() {
   return {
    __dotNetObject: this._id
   };
  }
 }
 const dotNetObjectRefKey = "__dotNetObject";
 attachReviver(function reviveDotNetObject(key, value) {
  if (value && typeof value === "object" && value.hasOwnProperty(dotNetObjectRefKey)) {
   return new DotNetObject(value.__dotNetObject);
  }
  return value;
 });
 function argReplacer(key, value) {
  return value instanceof DotNetObject ? value.serializeAsArg() : value;
 }
})(DotNet || (DotNet = {}));

var UnoAppManifest = {
 splashScreenImage: "Assets/SplashScreen.scale-200.png",
 splashScreenColor: "#00f",
 displayName: "UnoCoreRt"
};

if (typeof window === "object") {
 Module["arguments"] = window.location.search.substr(1).trim().split("&");
 if (!Module["arguments"][0]) {
  Module["arguments"] = [];
 }
}

var moduleOverrides = {};

var key;

for (key in Module) {
 if (Module.hasOwnProperty(key)) {
  moduleOverrides[key] = Module[key];
 }
}

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = function(status, toThrow) {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = false;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

ENVIRONMENT_IS_WEB = typeof window === "object";

ENVIRONMENT_IS_WORKER = typeof importScripts === "function";

ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";

ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module["ENVIRONMENT"]) {
 throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)");
}

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary, setWindowTitle;

var nodeFS;

var nodePath;

if (ENVIRONMENT_IS_NODE) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = require("path").dirname(scriptDirectory) + "/";
 } else {
  scriptDirectory = __dirname + "/";
 }
 read_ = function shell_read(filename, binary) {
  if (!nodeFS) nodeFS = require("fs");
  if (!nodePath) nodePath = require("path");
  filename = nodePath["normalize"](filename);
  return nodeFS["readFileSync"](filename, binary ? null : "utf8");
 };
 readBinary = function readBinary(filename) {
  var ret = read_(filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 if (process["argv"].length > 1) {
  thisProgram = process["argv"][1].replace(/\\/g, "/");
 }
 arguments_ = process["argv"].slice(2);
 if (typeof module !== "undefined") {
  module["exports"] = Module;
 }
 process["on"]("uncaughtException", function(ex) {
  if (!(ex instanceof ExitStatus)) {
   throw ex;
  }
 });
 process["on"]("unhandledRejection", abort);
 quit_ = function(status) {
  process["exit"](status);
 };
 Module["inspect"] = function() {
  return "[Emscripten Module object]";
 };
} else if (ENVIRONMENT_IS_SHELL) {
 if (typeof read != "undefined") {
  read_ = function shell_read(f) {
   return read(f);
  };
 }
 readBinary = function readBinary(f) {
  var data;
  if (typeof readbuffer === "function") {
   return new Uint8Array(readbuffer(f));
  }
  data = read(f, "binary");
  assert(typeof data === "object");
  return data;
 };
 if (typeof scriptArgs != "undefined") {
  arguments_ = scriptArgs;
 } else if (typeof arguments != "undefined") {
  arguments_ = arguments;
 }
 if (typeof quit === "function") {
  quit_ = function(status) {
   quit(status);
  };
 }
 if (typeof print !== "undefined") {
  if (typeof console === "undefined") console = {};
  console.log = print;
  console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
 }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = self.location.href;
 } else if (document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (scriptDirectory.indexOf("blob:") !== 0) {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
 } else {
  scriptDirectory = "";
 }
 {
  read_ = function shell_read(url) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = function readBinary(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(xhr.response);
   };
  }
  readAsync = function readAsync(url, onload, onerror) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = function xhr_onload() {
    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
 setWindowTitle = function(title) {
  document.title = title;
 };
} else {
 throw new Error("environment detection error");
}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.warn.bind(console);

for (key in moduleOverrides) {
 if (moduleOverrides.hasOwnProperty(key)) {
  Module[key] = moduleOverrides[key];
 }
}

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (!Object.getOwnPropertyDescriptor(Module, "arguments")) Object.defineProperty(Module, "arguments", {
 configurable: true,
 get: function() {
  abort("Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (!Object.getOwnPropertyDescriptor(Module, "thisProgram")) Object.defineProperty(Module, "thisProgram", {
 configurable: true,
 get: function() {
  abort("Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (Module["quit"]) quit_ = Module["quit"];

if (!Object.getOwnPropertyDescriptor(Module, "quit")) Object.defineProperty(Module, "quit", {
 configurable: true,
 get: function() {
  abort("Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

assert(typeof Module["memoryInitializerPrefixURL"] === "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["pthreadMainPrefixURL"] === "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["cdInitializerPrefixURL"] === "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["filePackagePrefixURL"] === "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");

assert(typeof Module["read"] === "undefined", "Module.read option was removed (modify read_ in JS)");

assert(typeof Module["readAsync"] === "undefined", "Module.readAsync option was removed (modify readAsync in JS)");

assert(typeof Module["readBinary"] === "undefined", "Module.readBinary option was removed (modify readBinary in JS)");

assert(typeof Module["setWindowTitle"] === "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");

assert(typeof Module["TOTAL_MEMORY"] === "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");

if (!Object.getOwnPropertyDescriptor(Module, "read")) Object.defineProperty(Module, "read", {
 configurable: true,
 get: function() {
  abort("Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "readAsync")) Object.defineProperty(Module, "readAsync", {
 configurable: true,
 get: function() {
  abort("Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "readBinary")) Object.defineProperty(Module, "readBinary", {
 configurable: true,
 get: function() {
  abort("Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "setWindowTitle")) Object.defineProperty(Module, "setWindowTitle", {
 configurable: true,
 get: function() {
  abort("Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";

var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";

var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";

var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";

var STACK_ALIGN = 16;

function alignMemory(size, factor) {
 if (!factor) factor = STACK_ALIGN;
 return Math.ceil(size / factor) * factor;
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
    return 4;
   } else if (type[0] === "i") {
    var bits = Number(type.substr(1));
    assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
    return bits / 8;
   } else {
    return 0;
   }
  }
 }
}

function warnOnce(text) {
 if (!warnOnce.shown) warnOnce.shown = {};
 if (!warnOnce.shown[text]) {
  warnOnce.shown[text] = 1;
  err(text);
 }
}

function convertJsFunctionToWasm(func, sig) {
 if (typeof WebAssembly.Function === "function") {
  var typeNames = {
   "i": "i32",
   "j": "i64",
   "f": "f32",
   "d": "f64"
  };
  var type = {
   parameters: [],
   results: sig[0] == "v" ? [] : [ typeNames[sig[0]] ]
  };
  for (var i = 1; i < sig.length; ++i) {
   type.parameters.push(typeNames[sig[i]]);
  }
  return new WebAssembly.Function(type, func);
 }
 var typeSection = [ 1, 0, 1, 96 ];
 var sigRet = sig.slice(0, 1);
 var sigParam = sig.slice(1);
 var typeCodes = {
  "i": 127,
  "j": 126,
  "f": 125,
  "d": 124
 };
 typeSection.push(sigParam.length);
 for (var i = 0; i < sigParam.length; ++i) {
  typeSection.push(typeCodes[sigParam[i]]);
 }
 if (sigRet == "v") {
  typeSection.push(0);
 } else {
  typeSection = typeSection.concat([ 1, typeCodes[sigRet] ]);
 }
 typeSection[1] = typeSection.length - 2;
 var bytes = new Uint8Array([ 0, 97, 115, 109, 1, 0, 0, 0 ].concat(typeSection, [ 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0 ]));
 var module = new WebAssembly.Module(bytes);
 var instance = new WebAssembly.Instance(module, {
  "e": {
   "f": func
  }
 });
 var wrappedFunc = instance.exports["f"];
 return wrappedFunc;
}

var freeTableIndexes = [];

var functionsInTableMap;

function addFunctionWasm(func, sig) {
 var table = wasmTable;
 if (!functionsInTableMap) {
  functionsInTableMap = new WeakMap();
  for (var i = 0; i < table.length; i++) {
   var item = table.get(i);
   if (item) {
    functionsInTableMap.set(item, i);
   }
  }
 }
 if (functionsInTableMap.has(func)) {
  return functionsInTableMap.get(func);
 }
 var ret;
 if (freeTableIndexes.length) {
  ret = freeTableIndexes.pop();
 } else {
  ret = table.length;
  try {
   table.grow(1);
  } catch (err) {
   if (!(err instanceof RangeError)) {
    throw err;
   }
   throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
  }
 }
 try {
  table.set(ret, func);
 } catch (err) {
  if (!(err instanceof TypeError)) {
   throw err;
  }
  assert(typeof sig !== "undefined", "Missing signature argument to addFunction");
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

function addFunction(func, sig) {
 assert(typeof func !== "undefined");
 return addFunctionWasm(func, sig);
}

function removeFunction(index) {
 removeFunctionWasm(index);
}

function makeBigInt(low, high, unsigned) {
 return unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
 tempRet0 = value;
};

var getTempRet0 = function() {
 return tempRet0;
};

function getCompilerSetting(name) {
 throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work";
}

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

if (!Object.getOwnPropertyDescriptor(Module, "wasmBinary")) Object.defineProperty(Module, "wasmBinary", {
 configurable: true,
 get: function() {
  abort("Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

var noExitRuntime;

if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

if (!Object.getOwnPropertyDescriptor(Module, "noExitRuntime")) Object.defineProperty(Module, "noExitRuntime", {
 configurable: true,
 get: function() {
  abort("Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

if (typeof WebAssembly !== "object") {
 abort("no native wasm support detected");
}

function setValue(ptr, value, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  _asan_js_store_1(ptr >> 0, value);
  break;

 case "i8":
  _asan_js_store_1(ptr >> 0, value);
  break;

 case "i16":
  _asan_js_store_2(ptr >> 1, value);
  break;

 case "i32":
  _asan_js_store_4(ptr >> 2, value);
  break;

 case "i64":
  tempI64 = [ value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  _asan_js_store_4(ptr >> 2, tempI64[0]), _asan_js_store_4(ptr + 4 >> 2, tempI64[1]);
  break;

 case "float":
  _asan_js_store_f(ptr >> 2, value);
  break;

 case "double":
  _asan_js_store_d(ptr >> 3, value);
  break;

 default:
  abort("invalid type for setValue: " + type);
 }
}

function getValue(ptr, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  return _asan_js_load_1(ptr >> 0);

 case "i8":
  return _asan_js_load_1(ptr >> 0);

 case "i16":
  return _asan_js_load_2(ptr >> 1);

 case "i32":
  return _asan_js_load_4(ptr >> 2);

 case "i64":
  return _asan_js_load_4(ptr >> 2);

 case "float":
  return _asan_js_load_f(ptr >> 2);

 case "double":
  return _asan_js_load_d(ptr >> 3);

 default:
  abort("invalid type for getValue: " + type);
 }
 return null;
}

function _asan_js_load_1(ptr) {
 if (runtimeInitialized) return _asan_c_load_1(ptr);
 return HEAP8[ptr];
}

function _asan_js_load_1u(ptr) {
 if (runtimeInitialized) return _asan_c_load_1u(ptr);
 return HEAPU8[ptr];
}

function _asan_js_load_2(ptr) {
 if (runtimeInitialized) return _asan_c_load_2(ptr);
 return HEAP16[ptr];
}

function _asan_js_load_2u(ptr) {
 if (runtimeInitialized) return _asan_c_load_2u(ptr);
 return HEAPU16[ptr];
}

function _asan_js_load_4(ptr) {
 if (runtimeInitialized) return _asan_c_load_4(ptr);
 return HEAP32[ptr];
}

function _asan_js_load_4u(ptr) {
 if (runtimeInitialized) return _asan_c_load_4u(ptr) >>> 0;
 return HEAPU32[ptr];
}

function _asan_js_load_f(ptr) {
 if (runtimeInitialized) return _asan_c_load_f(ptr);
 return HEAPF32[ptr];
}

function _asan_js_load_d(ptr) {
 if (runtimeInitialized) return _asan_c_load_d(ptr);
 return HEAPF64[ptr];
}

function _asan_js_store_1(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_1(ptr, val);
 return HEAP8[ptr] = val;
}

function _asan_js_store_1u(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_1u(ptr, val);
 return HEAPU8[ptr] = val;
}

function _asan_js_store_2(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_2(ptr, val);
 return HEAP16[ptr] = val;
}

function _asan_js_store_2u(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_2u(ptr, val);
 return HEAPU16[ptr] = val;
}

function _asan_js_store_4(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_4(ptr, val);
 return HEAP32[ptr] = val;
}

function _asan_js_store_4u(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_4u(ptr, val) >>> 0;
 return HEAPU32[ptr] = val;
}

function _asan_js_store_f(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_f(ptr, val);
 return HEAPF32[ptr] = val;
}

function _asan_js_store_d(ptr, val) {
 if (runtimeInitialized) return _asan_c_store_d(ptr, val);
 return HEAPF64[ptr] = val;
}

var wasmMemory;

var wasmTable;

var ABORT = false;

var EXITSTATUS = 0;

function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed: " + text);
 }
}

function getCFunc(ident) {
 var func = Module["_" + ident];
 assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
 return func;
}

function ccall(ident, returnType, argTypes, args, opts) {
 var toC = {
  "string": function(str) {
   var ret = 0;
   if (str !== null && str !== undefined && str !== 0) {
    var len = (str.length << 2) + 1;
    ret = stackAlloc(len);
    stringToUTF8(str, ret, len);
   }
   return ret;
  },
  "array": function(arr) {
   var ret = stackAlloc(arr.length);
   writeArrayToMemory(arr, ret);
   return ret;
  }
 };
 function convertReturnValue(ret) {
  if (returnType === "string") return UTF8ToString(ret);
  if (returnType === "boolean") return Boolean(ret);
  return ret;
 }
 var func = getCFunc(ident);
 var cArgs = [];
 var stack = 0;
 assert(returnType !== "array", 'Return type should not be "array".');
 if (args) {
  for (var i = 0; i < args.length; i++) {
   var converter = toC[argTypes[i]];
   if (converter) {
    if (stack === 0) stack = stackSave();
    cArgs[i] = converter(args[i]);
   } else {
    cArgs[i] = args[i];
   }
  }
 }
 var ret = func.apply(null, cArgs);
 ret = convertReturnValue(ret);
 if (stack !== 0) stackRestore(stack);
 return ret;
}

function cwrap(ident, returnType, argTypes, opts) {
 return function() {
  return ccall(ident, returnType, argTypes, arguments, opts);
 };
}

var ALLOC_NORMAL = 0;

var ALLOC_STACK = 1;

function allocate(slab, allocator) {
 var ret;
 assert(typeof allocator === "number", "allocate no longer takes a type argument");
 assert(typeof slab !== "number", "allocate no longer takes a number as arg0");
 if (allocator == ALLOC_STACK) {
  ret = stackAlloc(slab.length);
 } else {
  ret = _malloc(slab.length);
 }
 if (slab.subarray || slab.slice) {
  HEAPU8.set(slab, ret);
 } else {
  HEAPU8.set(new Uint8Array(slab), ret);
 }
 return ret;
}

var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(heap, idx, maxBytesToRead) {
 var endIdx = idx + maxBytesToRead;
 var endPtr = idx;
 while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
 if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
  return UTF8Decoder.decode(heap.subarray(idx, endPtr));
 } else {
  var str = "";
  while (idx < endPtr) {
   var u0 = heap[idx++];
   if (!(u0 & 128)) {
    str += String.fromCharCode(u0);
    continue;
   }
   var u1 = heap[idx++] & 63;
   if ((u0 & 224) == 192) {
    str += String.fromCharCode((u0 & 31) << 6 | u1);
    continue;
   }
   var u2 = heap[idx++] & 63;
   if ((u0 & 240) == 224) {
    u0 = (u0 & 15) << 12 | u1 << 6 | u2;
   } else {
    if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte 0x" + u0.toString(16) + " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!");
    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
   }
   if (u0 < 65536) {
    str += String.fromCharCode(u0);
   } else {
    var ch = u0 - 65536;
    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
   }
  }
 }
 return str;
}

function UTF8ToString(ptr, maxBytesToRead) {
 return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) {
   var u1 = str.charCodeAt(++i);
   u = 65536 + ((u & 1023) << 10) | u1 & 1023;
  }
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   heap[outIdx++] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   heap[outIdx++] = 192 | u >> 6;
   heap[outIdx++] = 128 | u & 63;
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   heap[outIdx++] = 224 | u >> 12;
   heap[outIdx++] = 128 | u >> 6 & 63;
   heap[outIdx++] = 128 | u & 63;
  } else {
   if (outIdx + 3 >= endIdx) break;
   if (u >= 2097152) warnOnce("Invalid Unicode code point 0x" + u.toString(16) + " encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).");
   heap[outIdx++] = 240 | u >> 18;
   heap[outIdx++] = 128 | u >> 12 & 63;
   heap[outIdx++] = 128 | u >> 6 & 63;
   heap[outIdx++] = 128 | u & 63;
  }
 }
 heap[outIdx] = 0;
 return outIdx - startIdx;
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
 assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}

function lengthBytesUTF8(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) ++len; else if (u <= 2047) len += 2; else if (u <= 65535) len += 3; else len += 4;
 }
 return len;
}

function AsciiToString(ptr) {
 var str = "";
 while (1) {
  var ch = _asan_js_load_1u(ptr++ >> 0);
  if (!ch) return str;
  str += String.fromCharCode(ch);
 }
}

function stringToAscii(str, outPtr) {
 return writeAsciiToMemory(str, outPtr, false);
}

var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
 assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
 var endPtr = ptr;
 var idx = endPtr >> 1;
 var maxIdx = idx + maxBytesToRead / 2;
 while (!(idx >= maxIdx) && _asan_js_load_2u(idx)) ++idx;
 endPtr = idx << 1;
 if (endPtr - ptr > 32 && UTF16Decoder) {
  return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
 } else {
  var i = 0;
  var str = "";
  while (1) {
   var codeUnit = _asan_js_load_2(ptr + i * 2 >> 1);
   if (codeUnit == 0 || i == maxBytesToRead / 2) return str;
   ++i;
   str += String.fromCharCode(codeUnit);
  }
 }
}

function stringToUTF16(str, outPtr, maxBytesToWrite) {
 assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 2) return 0;
 maxBytesToWrite -= 2;
 var startPtr = outPtr;
 var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
 for (var i = 0; i < numCharsToWrite; ++i) {
  var codeUnit = str.charCodeAt(i);
  _asan_js_store_2(outPtr >> 1, codeUnit);
  outPtr += 2;
 }
 _asan_js_store_2(outPtr >> 1, 0);
 return outPtr - startPtr;
}

function lengthBytesUTF16(str) {
 return str.length * 2;
}

function UTF32ToString(ptr, maxBytesToRead) {
 assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
 var i = 0;
 var str = "";
 while (!(i >= maxBytesToRead / 4)) {
  var utf32 = _asan_js_load_4(ptr + i * 4 >> 2);
  if (utf32 == 0) break;
  ++i;
  if (utf32 >= 65536) {
   var ch = utf32 - 65536;
   str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
  } else {
   str += String.fromCharCode(utf32);
  }
 }
 return str;
}

function stringToUTF32(str, outPtr, maxBytesToWrite) {
 assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
 assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 4) return 0;
 var startPtr = outPtr;
 var endPtr = startPtr + maxBytesToWrite - 4;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) {
   var trailSurrogate = str.charCodeAt(++i);
   codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
  }
  _asan_js_store_4(outPtr >> 2, codeUnit);
  outPtr += 4;
  if (outPtr + 4 > endPtr) break;
 }
 _asan_js_store_4(outPtr >> 2, 0);
 return outPtr - startPtr;
}

function lengthBytesUTF32(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
  len += 4;
 }
 return len;
}

function allocateUTF8(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = _malloc(size);
 if (ret) stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}

function allocateUTF8OnStack(str) {
 var size = lengthBytesUTF8(str) + 1;
 var ret = stackAlloc(size);
 stringToUTF8Array(str, HEAP8, ret, size);
 return ret;
}

function writeStringToMemory(string, buffer, dontAddNull) {
 warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
 var lastChar, end;
 if (dontAddNull) {
  end = buffer + lengthBytesUTF8(string);
  lastChar = _asan_js_load_1(end);
 }
 stringToUTF8(string, buffer, Infinity);
 if (dontAddNull) _asan_js_store_1(end, lastChar);
}

function writeArrayToMemory(array, buffer) {
 assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
 HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
 for (var i = 0; i < str.length; ++i) {
  assert(str.charCodeAt(i) === str.charCodeAt(i) & 255);
  _asan_js_store_1(buffer++ >> 0, str.charCodeAt(i));
 }
 if (!dontAddNull) _asan_js_store_1(buffer >> 0, 0);
}

var PAGE_SIZE = 16384;

var WASM_PAGE_SIZE = 65536;

function alignUp(x, multiple) {
 if (x % multiple > 0) {
  x += multiple - x % multiple;
 }
 return x;
}

var HEAP, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
 buffer = buf;
 Module["HEAP8"] = HEAP8 = new Int8Array(buf);
 Module["HEAP16"] = HEAP16 = new Int16Array(buf);
 Module["HEAP32"] = HEAP32 = new Int32Array(buf);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}

var STACK_BASE = 102129072, STACKTOP = STACK_BASE, STACK_MAX = 96886192;

assert(STACK_BASE % 16 === 0, "stack must start aligned");

var TOTAL_STACK = 5242880;

if (Module["TOTAL_STACK"]) assert(TOTAL_STACK === Module["TOTAL_STACK"], "the stack size can no longer be determined at runtime");

var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 385875968;

if (!Object.getOwnPropertyDescriptor(Module, "INITIAL_MEMORY")) Object.defineProperty(Module, "INITIAL_MEMORY", {
 configurable: true,
 get: function() {
  abort("Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
 }
});

assert(INITIAL_INITIAL_MEMORY >= TOTAL_STACK, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_INITIAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");

assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");

if (Module["wasmMemory"]) {
 wasmMemory = Module["wasmMemory"];
} else {
 wasmMemory = new WebAssembly.Memory({
  "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
  "maximum": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
 });
}

if (wasmMemory) {
 buffer = wasmMemory.buffer;
}

INITIAL_INITIAL_MEMORY = buffer.byteLength;

assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);

updateGlobalBufferAndViews(buffer);

function writeStackCookie() {
 assert((STACK_MAX & 3) == 0);
 _asan_js_store_4u((STACK_MAX >> 2) + 1, 34821223);
 _asan_js_store_4u((STACK_MAX >> 2) + 2, 2310721022);
}

function checkStackCookie() {
 var cookie1 = _asan_js_load_4u((STACK_MAX >> 2) + 1);
 var cookie2 = _asan_js_load_4u((STACK_MAX >> 2) + 2);
 if (cookie1 != 34821223 || cookie2 != 2310721022) {
  abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + cookie2.toString(16) + " " + cookie1.toString(16));
 }
}

(function() {
 var h16 = new Int16Array(1);
 var h8 = new Int8Array(h16.buffer);
 h16[0] = 25459;
 if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian!";
})();

function abortFnPtrError(ptr, sig) {
 abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
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
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
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
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
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
 __ATPOSTRUN__.unshift(cb);
}

assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

var runDependencyTracking = {};

function getUniqueRunDependency(id) {
 var orig = id;
 while (1) {
  if (!runDependencyTracking[id]) return id;
  id = orig + Math.random();
 }
}

function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (id) {
  assert(!runDependencyTracking[id]);
  runDependencyTracking[id] = 1;
  if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
   runDependencyWatcher = setInterval(function() {
    if (ABORT) {
     clearInterval(runDependencyWatcher);
     runDependencyWatcher = null;
     return;
    }
    var shown = false;
    for (var dep in runDependencyTracking) {
     if (!shown) {
      shown = true;
      err("still waiting on run dependencies:");
     }
     err("dependency: " + dep);
    }
    if (shown) {
     err("(end of list)");
    }
   }, 1e4);
  }
 } else {
  err("warning: run dependency added without ID");
 }
}

function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (id) {
  assert(runDependencyTracking[id]);
  delete runDependencyTracking[id];
 } else {
  err("warning: run dependency removed without ID");
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

Module["preloadedImages"] = {};

Module["preloadedAudios"] = {};

function abort(what) {
 if (Module["onAbort"]) {
  Module["onAbort"](what);
 }
 what += "";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 var output = "abort(" + what + ") at " + stackTrace();
 what = output;
 var e = new WebAssembly.RuntimeError(what);
 throw e;
}

var memoryInitializer = null;

function hasPrefix(str, prefix) {
 return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
}

var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
 return hasPrefix(filename, dataURIPrefix);
}

var fileURIPrefix = "file://";

function isFileURI(filename) {
 return hasPrefix(filename, fileURIPrefix);
}

function createExportWrapper(name, fixedasm) {
 return function() {
  var displayName = name;
  var asm = fixedasm;
  if (!fixedasm) {
   asm = Module["asm"];
  }
  assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");
  assert(!runtimeExited, "native function `" + displayName + "` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
  if (!asm[name]) {
   assert(asm[name], "exported native function `" + displayName + "` not found");
  }
  return asm[name].apply(null, arguments);
 };
}

var wasmBinaryFile = "UnoCoreRt.wasm";

if (!isDataURI(wasmBinaryFile)) {
 wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
 try {
  if (wasmBinary) {
   return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
   return readBinary(wasmBinaryFile);
  } else {
   throw "both async and sync fetching of the wasm failed";
  }
 } catch (err) {
  abort(err);
 }
}

function getBinaryPromise() {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
  return fetch(wasmBinaryFile, {
   credentials: "same-origin"
  }).then(function(response) {
   if (!response["ok"]) {
    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
   }
   return response["arrayBuffer"]();
  }).catch(function() {
   return getBinary();
  });
 }
 return Promise.resolve().then(getBinary);
}

var wasmOffsetConverter;

function WasmOffsetConverter(wasmBytes, wasmModule) {
 var offset = 8;
 var funcidx = 0;
 this.offset_map = {};
 this.func_starts = [];
 this.name_map = {};
 this.import_functions = 0;
 var buffer = wasmBytes;
 function unsignedLEB128() {
  var result = 0;
  var shift = 0;
  do {
   var byte = buffer[offset++];
   result += (byte & 127) << shift;
   shift += 7;
  } while (byte & 128);
  return result;
 }
 function skipLimits() {
  var flags = unsignedLEB128();
  unsignedLEB128();
  var hasMax = (flags & 1) != 0;
  if (hasMax) {
   unsignedLEB128();
  }
 }
 binary_parse: while (offset < buffer.length) {
  var start = offset;
  var type = buffer[offset++];
  var end = unsignedLEB128() + offset;
  switch (type) {
  case 2:
   var count = unsignedLEB128();
   while (count-- > 0) {
    offset = unsignedLEB128() + offset;
    offset = unsignedLEB128() + offset;
    switch (buffer[offset++]) {
    case 0:
     ++funcidx;
     unsignedLEB128();
     break;

    case 1:
     ++offset;
     skipLimits();
     break;

    case 2:
     skipLimits();
     break;

    case 3:
     offset += 2;
     break;

    default:
     throw "bad import kind";
    }
   }
   this.import_functions = funcidx;
   break;

  case 10:
   var count = unsignedLEB128();
   while (count-- > 0) {
    var size = unsignedLEB128();
    this.offset_map[funcidx++] = offset;
    this.func_starts.push(offset);
    offset += size;
   }
   break binary_parse;
  }
  offset = end;
 }
 var sections = WebAssembly.Module.customSections(wasmModule, "name");
 for (var i = 0; i < sections.length; ++i) {
  buffer = new Uint8Array(sections[i]);
  if (buffer[0] != 1) continue;
  offset = 1;
  unsignedLEB128();
  var count = unsignedLEB128();
  while (count-- > 0) {
   var index = unsignedLEB128();
   var length = unsignedLEB128();
   this.name_map[index] = UTF8ArrayToString(buffer, offset, length);
   offset += length;
  }
 }
}

WasmOffsetConverter.prototype.convert = function(funcidx, offset) {
 return this.offset_map[funcidx] + offset;
};

WasmOffsetConverter.prototype.getIndex = function(offset) {
 var lo = 0;
 var hi = this.func_starts.length;
 var mid;
 while (lo < hi) {
  mid = Math.floor((lo + hi) / 2);
  if (this.func_starts[mid] > offset) {
   hi = mid;
  } else {
   lo = mid + 1;
  }
 }
 return lo + this.import_functions - 1;
};

WasmOffsetConverter.prototype.isSameFunc = function(offset1, offset2) {
 return this.getIndex(offset1) == this.getIndex(offset2);
};

WasmOffsetConverter.prototype.getName = function(offset) {
 var index = this.getIndex(offset);
 return this.name_map[index] || "wasm-function[" + index + "]";
};

function createWasm() {
 var info = {
  "env": asmLibraryArg,
  "wasi_snapshot_preview1": asmLibraryArg
 };
 function receiveInstance(instance, module) {
  var exports = instance.exports;
  Module["asm"] = exports;
  wasmTable = Module["asm"]["__indirect_function_table"];
  assert(wasmTable, "table not found in wasm exports");
  removeRunDependency("wasm-instantiate");
 }
 addRunDependency("wasm-instantiate");
 var trueModule = Module;
 function receiveInstantiatedSource(output) {
  assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
  trueModule = null;
  receiveInstance(output["instance"]);
 }
 addRunDependency("offset-converter");
 function instantiateArrayBuffer(receiver) {
  return getBinaryPromise().then(function(binary) {
   var result = WebAssembly.instantiate(binary, info);
   result.then(function(instance) {
    wasmOffsetConverter = new WasmOffsetConverter(binary, instance.module);
    removeRunDependency("offset-converter");
   });
   return result;
  }).then(receiver, function(reason) {
   err("failed to asynchronously prepare wasm: " + reason);
   abort(reason);
  });
 }
 function instantiateAsync() {
  if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
   fetch(wasmBinaryFile, {
    credentials: "same-origin"
   }).then(function(response) {
    var result = WebAssembly.instantiateStreaming(response, info);
    Promise.all([ response.clone().arrayBuffer(), result ]).then(function(results) {
     wasmOffsetConverter = new WasmOffsetConverter(new Uint8Array(results[0]), results[1].module);
     removeRunDependency("offset-converter");
    }, function(reason) {
     err("failed to initialize offset-converter: " + reason);
    });
    return result.then(receiveInstantiatedSource, function(reason) {
     err("wasm streaming compile failed: " + reason);
     err("falling back to ArrayBuffer instantiation");
     return instantiateArrayBuffer(receiveInstantiatedSource);
    });
   });
  } else {
   return instantiateArrayBuffer(receiveInstantiatedSource);
  }
 }
 if (Module["instantiateWasm"]) {
  try {
   var exports = Module["instantiateWasm"](info, receiveInstance);
   return exports;
  } catch (e) {
   err("Module.instantiateWasm callback failed with error: " + e);
   return false;
  }
 }
 instantiateAsync();
 return {};
}

var tempDouble;

var tempI64;

var ASM_CONSTS = {
 68477586: function() {
  return withBuiltinMalloc(function() {
   return allocateUTF8(Module["ASAN_OPTIONS"] || 0);
  });
 },
 68477684: function() {
  return withBuiltinMalloc(function() {
   return allocateUTF8(Module["LSAN_OPTIONS"] || 0);
  });
 },
 68477781: function() {
  return withBuiltinMalloc(function() {
   return allocateUTF8(Module["UBSAN_OPTIONS"] || 0);
  });
 },
 68496784: function() {
  return STACK_BASE;
 },
 68496807: function() {
  return STACK_MAX;
 },
 68511341: function() {
  var setting = Module["printWithColors"];
  if (setting != null) {
   return setting;
  } else {
   return ENVIRONMENT_IS_NODE && process.stderr.isTTY;
  }
 }
};

function abortStackOverflow(allocSize) {
 abort("Stack overflow! Attempted to allocate " + allocSize + " bytes on the stack, but stack has only " + (STACK_MAX - stackSave() + allocSize) + " bytes available!");
}

function callRuntimeCallbacks(callbacks) {
 while (callbacks.length > 0) {
  var callback = callbacks.shift();
  if (typeof callback == "function") {
   callback(Module);
   continue;
  }
  var func = callback.func;
  if (typeof func === "number") {
   if (callback.arg === undefined) {
    wasmTable.get(func)();
   } else {
    wasmTable.get(func)(callback.arg);
   }
  } else {
   func(callback.arg === undefined ? null : callback.arg);
  }
 }
}

function demangle(func) {
 warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
 return func;
}

function demangleAll(text) {
 var regex = /\b_Z[\w\d_]+/g;
 return text.replace(regex, function(x) {
  var y = demangle(x);
  return x === y ? x : y + " [" + x + "]";
 });
}

function dynCallLegacy(sig, ptr, args) {
 assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");
 if (args && args.length) {
  assert(args.length === sig.substring(1).replace(/j/g, "--").length);
 } else {
  assert(sig.length == 1);
 }
 if (args && args.length) {
  return Module["dynCall_" + sig].apply(null, [ ptr ].concat(args));
 }
 return Module["dynCall_" + sig].call(null, ptr);
}

function dynCall(sig, ptr, args) {
 if (sig.indexOf("j") != -1) {
  return dynCallLegacy(sig, ptr, args);
 }
 return wasmTable.get(ptr).apply(null, args);
}

function jsStackTrace() {
 var error = new Error();
 if (!error.stack) {
  try {
   throw new Error();
  } catch (e) {
   error = e;
  }
  if (!error.stack) {
   return "(no stack trace available)";
  }
 }
 return error.stack.toString();
}

function stackTrace() {
 var js = jsStackTrace();
 if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
 return demangleAll(js);
}

function _CompareStringEx() {
 err("missing function: CompareStringEx");
 abort(-1);
}

function _CompareStringOrdinal() {
 err("missing function: CompareStringOrdinal");
 abort(-1);
}

function _EnumCalendarInfoExEx() {
 err("missing function: EnumCalendarInfoExEx");
 abort(-1);
}

function _EnumSystemLocalesEx() {
 err("missing function: EnumSystemLocalesEx");
 abort(-1);
}

function _EnumTimeFormatsEx() {
 err("missing function: EnumTimeFormatsEx");
 abort(-1);
}

function _FindNLSStringEx() {
 err("missing function: FindNLSStringEx");
 abort(-1);
}

function _FindStringOrdinal() {
 err("missing function: FindStringOrdinal");
 abort(-1);
}

function _GetCalendarInfoEx() {
 err("missing function: GetCalendarInfoEx");
 abort(-1);
}

function _GetLocaleInfoEx() {
 err("missing function: GetLocaleInfoEx");
 abort(-1);
}

function _GetUserPreferredUILanguages() {
 err("missing function: GetUserPreferredUILanguages");
 abort(-1);
}

function _IdnToAscii() {
 err("missing function: IdnToAscii");
 abort(-1);
}

function _IdnToUnicode() {
 err("missing function: IdnToUnicode");
 abort(-1);
}

function _LCIDToLocaleName() {
 err("missing function: LCIDToLocaleName");
 abort(-1);
}

function _LCMapStringEx() {
 err("missing function: LCMapStringEx");
 abort(-1);
}

function _LocaleNameToLCID() {
 err("missing function: LocaleNameToLCID");
 abort(-1);
}

function _NormalizeString() {
 err("missing function: NormalizeString");
 abort(-1);
}

function _ResolveLocaleName() {
 err("missing function: ResolveLocaleName");
 abort(-1);
}

function ___assert_fail(condition, filename, line, func) {
 abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

var ExceptionInfoAttrs = {
 DESTRUCTOR_OFFSET: 0,
 REFCOUNT_OFFSET: 4,
 TYPE_OFFSET: 8,
 CAUGHT_OFFSET: 12,
 RETHROWN_OFFSET: 13,
 SIZE: 16
};

function ___cxa_allocate_exception(size) {
 return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
}

function _atexit(func, arg) {
 __ATEXIT__.unshift({
  func: func,
  arg: arg
 });
}

function ___cxa_atexit(a0, a1) {
 return _atexit(a0, a1);
}

function ExceptionInfo(excPtr) {
 this.excPtr = excPtr;
 this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
 this.set_type = function(type) {
  _asan_js_store_4(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2, type);
 };
 this.get_type = function() {
  return _asan_js_load_4(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2);
 };
 this.set_destructor = function(destructor) {
  _asan_js_store_4(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2, destructor);
 };
 this.get_destructor = function() {
  return _asan_js_load_4(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2);
 };
 this.set_refcount = function(refcount) {
  _asan_js_store_4(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2, refcount);
 };
 this.set_caught = function(caught) {
  caught = caught ? 1 : 0;
  _asan_js_store_1(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0, caught);
 };
 this.get_caught = function() {
  return _asan_js_load_1(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0) != 0;
 };
 this.set_rethrown = function(rethrown) {
  rethrown = rethrown ? 1 : 0;
  _asan_js_store_1(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0, rethrown);
 };
 this.get_rethrown = function() {
  return _asan_js_load_1(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0) != 0;
 };
 this.init = function(type, destructor) {
  this.set_type(type);
  this.set_destructor(destructor);
  this.set_refcount(0);
  this.set_caught(false);
  this.set_rethrown(false);
 };
 this.add_ref = function() {
  var value = _asan_js_load_4(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2);
  _asan_js_store_4(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2, value + 1);
 };
 this.release_ref = function() {
  var prev = _asan_js_load_4(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2);
  _asan_js_store_4(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2, prev - 1);
  assert(prev > 0);
  return prev === 1;
 };
}

function CatchInfo(ptr) {
 this.free = function() {
  _free(this.ptr);
  this.ptr = 0;
 };
 this.set_base_ptr = function(basePtr) {
  _asan_js_store_4(this.ptr >> 2, basePtr);
 };
 this.get_base_ptr = function() {
  return _asan_js_load_4(this.ptr >> 2);
 };
 this.set_adjusted_ptr = function(adjustedPtr) {
  var ptrSize = 4;
  _asan_js_store_4(this.ptr + ptrSize >> 2, adjustedPtr);
 };
 this.get_adjusted_ptr = function() {
  var ptrSize = 4;
  return _asan_js_load_4(this.ptr + ptrSize >> 2);
 };
 this.get_exception_ptr = function() {
  var isPointer = ___cxa_is_pointer_type(this.get_exception_info().get_type());
  if (isPointer) {
   return _asan_js_load_4(this.get_base_ptr() >> 2);
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

var exceptionCaught = [];

function exception_addRef(info) {
 info.add_ref();
}

function ___cxa_begin_catch(ptr) {
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

var exceptionLast = 0;

function ___cxa_free_exception(ptr) {
 try {
  return _free(new ExceptionInfo(ptr).ptr);
 } catch (e) {
  err("exception during cxa_free_exception: " + e);
 }
}

function exception_decRef(info) {
 if (info.release_ref() && !info.get_rethrown()) {
  var destructor = info.get_destructor();
  if (destructor) {
   wasmTable.get(destructor)(info.excPtr);
  }
  ___cxa_free_exception(info.excPtr);
 }
}

function ___cxa_end_catch() {
 _setThrew(0);
 assert(exceptionCaught.length > 0);
 var catchInfo = exceptionCaught.pop();
 exception_decRef(catchInfo.get_exception_info());
 catchInfo.free();
 exceptionLast = 0;
}

function ___resumeException(catchInfoPtr) {
 var catchInfo = new CatchInfo(catchInfoPtr);
 var ptr = catchInfo.get_base_ptr();
 if (!exceptionLast) {
  exceptionLast = ptr;
 }
 catchInfo.free();
 throw ptr;
}

function ___cxa_find_matching_catch_3() {
 var thrown = exceptionLast;
 if (!thrown) {
  return (setTempRet0(0), 0) | 0;
 }
 var info = new ExceptionInfo(thrown);
 var thrownType = info.get_type();
 var catchInfo = new CatchInfo();
 catchInfo.set_base_ptr(thrown);
 if (!thrownType) {
  return (setTempRet0(0), catchInfo.ptr) | 0;
 }
 var typeArray = Array.prototype.slice.call(arguments);
 var stackTop = stackSave();
 var exceptionThrowBuf = stackAlloc(4);
 _asan_js_store_4(exceptionThrowBuf >> 2, thrown);
 for (var i = 0; i < typeArray.length; i++) {
  var caughtType = typeArray[i];
  if (caughtType === 0 || caughtType === thrownType) {
   break;
  }
  if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
   var adjusted = _asan_js_load_4(exceptionThrowBuf >> 2);
   if (thrown !== adjusted) {
    catchInfo.set_adjusted_ptr(adjusted);
   }
   return (setTempRet0(caughtType), catchInfo.ptr) | 0;
  }
 }
 stackRestore(stackTop);
 return (setTempRet0(thrownType), catchInfo.ptr) | 0;
}

function ___cxa_thread_atexit(a0, a1) {
 return _atexit(a0, a1);
}

function ___cxa_throw(ptr, type, destructor) {
 var info = new ExceptionInfo(ptr);
 info.init(type, destructor);
 exceptionLast = ptr;
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

var PATH = {
 splitPath: function(filename) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 },
 normalizeArray: function(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (;up; up--) {
    parts.unshift("..");
   }
  }
  return parts;
 },
 normalize: function(path) {
  var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter(function(p) {
   return !!p;
  }), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 },
 dirname: function(path) {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 },
 basename: function(path) {
  if (path === "/") return "/";
  path = PATH.normalize(path);
  path = path.replace(/\/$/, "");
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 },
 extname: function(path) {
  return PATH.splitPath(path)[3];
 },
 join: function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return PATH.normalize(paths.join("/"));
 },
 join2: function(l, r) {
  return PATH.normalize(l + "/" + r);
 }
};

function setErrNo(value) {
 _asan_js_store_4(___errno_location() >> 2, value);
 return value;
}

function getRandomDevice() {
 if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
  var randomBuffer = new Uint8Array(1);
  return function() {
   crypto.getRandomValues(randomBuffer);
   return randomBuffer[0];
  };
 } else if (ENVIRONMENT_IS_NODE) {
  try {
   var crypto_module = require("crypto");
   return function() {
    return crypto_module["randomBytes"](1)[0];
   };
  } catch (e) {}
 }
 return function() {
  abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
 };
}

var PATH_FS = {
 resolve: function() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = i >= 0 ? arguments[i] : FS.cwd();
   if (typeof path !== "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = path.charAt(0) === "/";
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
   return !!p;
  }), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
 },
 relative: function(from, to) {
  from = PATH_FS.resolve(from).substr(1);
  to = PATH_FS.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (;start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (;end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
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
  FS.registerDevice(dev, TTY.stream_ops);
 },
 stream_ops: {
  open: function(stream) {
   var tty = TTY.ttys[stream.node.rdev];
   if (!tty) {
    throw new FS.ErrnoError(43);
   }
   stream.tty = tty;
   stream.seekable = false;
  },
  close: function(stream) {
   stream.tty.ops.flush(stream.tty);
  },
  flush: function(stream) {
   stream.tty.ops.flush(stream.tty);
  },
  read: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.get_char) {
    throw new FS.ErrnoError(60);
   }
   var bytesRead = 0;
   for (var i = 0; i < length; i++) {
    var result;
    try {
     result = stream.tty.ops.get_char(stream.tty);
    } catch (e) {
     throw new FS.ErrnoError(29);
    }
    if (result === undefined && bytesRead === 0) {
     throw new FS.ErrnoError(6);
    }
    if (result === null || result === undefined) break;
    bytesRead++;
    buffer[offset + i] = result;
   }
   if (bytesRead) {
    stream.node.timestamp = Date.now();
   }
   return bytesRead;
  },
  write: function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.put_char) {
    throw new FS.ErrnoError(60);
   }
   try {
    for (var i = 0; i < length; i++) {
     stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
    }
   } catch (e) {
    throw new FS.ErrnoError(29);
   }
   if (length) {
    stream.node.timestamp = Date.now();
   }
   return i;
  }
 },
 default_tty_ops: {
  get_char: function(tty) {
   if (!tty.input.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
     var BUFSIZE = 256;
     var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
     var bytesRead = 0;
     try {
      bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
     } catch (e) {
      if (e.toString().indexOf("EOF") != -1) bytesRead = 0; else throw e;
     }
     if (bytesRead > 0) {
      result = buf.slice(0, bytesRead).toString("utf-8");
     } else {
      result = null;
     }
    } else if (typeof window != "undefined" && typeof window.prompt == "function") {
     result = window.prompt("Input: ");
     if (result !== null) {
      result += "\n";
     }
    } else if (typeof readline == "function") {
     result = readline();
     if (result !== null) {
      result += "\n";
     }
    }
    if (!result) {
     return null;
    }
    tty.input = intArrayFromString(result, true);
   }
   return tty.input.shift();
  },
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  flush: function(tty) {
   if (tty.output && tty.output.length > 0) {
    out(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  }
 },
 default_tty1_ops: {
  put_char: function(tty, val) {
   if (val === null || val === 10) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  },
  flush: function(tty) {
   if (tty.output && tty.output.length > 0) {
    err(UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  }
 }
};

function mmapAlloc(size) {
 var alignedSize = alignMemory(size, 16384);
 var ptr = _malloc(alignedSize);
 while (size < alignedSize) _asan_js_store_1(ptr + size++, 0);
 return ptr;
}

var MEMFS = {
 ops_table: null,
 mount: function(mount) {
  return MEMFS.createNode(null, "/", 16384 | 511, 0);
 },
 createNode: function(parent, name, mode, dev) {
  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
   throw new FS.ErrnoError(63);
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
   };
  }
  var node = FS.createNode(parent, name, mode, dev);
  if (FS.isDir(node.mode)) {
   node.node_ops = MEMFS.ops_table.dir.node;
   node.stream_ops = MEMFS.ops_table.dir.stream;
   node.contents = {};
  } else if (FS.isFile(node.mode)) {
   node.node_ops = MEMFS.ops_table.file.node;
   node.stream_ops = MEMFS.ops_table.file.stream;
   node.usedBytes = 0;
   node.contents = null;
  } else if (FS.isLink(node.mode)) {
   node.node_ops = MEMFS.ops_table.link.node;
   node.stream_ops = MEMFS.ops_table.link.stream;
  } else if (FS.isChrdev(node.mode)) {
   node.node_ops = MEMFS.ops_table.chrdev.node;
   node.stream_ops = MEMFS.ops_table.chrdev.stream;
  }
  node.timestamp = Date.now();
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 },
 getFileDataAsRegularArray: function(node) {
  if (node.contents && node.contents.subarray) {
   var arr = [];
   for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
   return arr;
  }
  return node.contents;
 },
 getFileDataAsTypedArray: function(node) {
  if (!node.contents) return new Uint8Array(0);
  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
  return new Uint8Array(node.contents);
 },
 expandFileStorage: function(node, newCapacity) {
  var prevCapacity = node.contents ? node.contents.length : 0;
  if (prevCapacity >= newCapacity) return;
  var CAPACITY_DOUBLING_MAX = 1024 * 1024;
  newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
  if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
  var oldContents = node.contents;
  node.contents = new Uint8Array(newCapacity);
  if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  return;
 },
 resizeFileStorage: function(node, newSize) {
  if (node.usedBytes == newSize) return;
  if (newSize == 0) {
   node.contents = null;
   node.usedBytes = 0;
   return;
  }
  if (!node.contents || node.contents.subarray) {
   var oldContents = node.contents;
   node.contents = new Uint8Array(newSize);
   if (oldContents) {
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
   }
   node.usedBytes = newSize;
   return;
  }
  if (!node.contents) node.contents = [];
  if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
  node.usedBytes = newSize;
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
    attr.size = 4096;
   } else if (FS.isFile(node.mode)) {
    attr.size = node.usedBytes;
   } else if (FS.isLink(node.mode)) {
    attr.size = node.link.length;
   } else {
    attr.size = 0;
   }
   attr.atime = new Date(node.timestamp);
   attr.mtime = new Date(node.timestamp);
   attr.ctime = new Date(node.timestamp);
   attr.blksize = 4096;
   attr.blocks = Math.ceil(attr.size / attr.blksize);
   return attr;
  },
  setattr: function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
   if (attr.size !== undefined) {
    MEMFS.resizeFileStorage(node, attr.size);
   }
  },
  lookup: function(parent, name) {
   throw FS.genericErrors[44];
  },
  mknod: function(parent, name, mode, dev) {
   return MEMFS.createNode(parent, name, mode, dev);
  },
  rename: function(old_node, new_dir, new_name) {
   if (FS.isDir(old_node.mode)) {
    var new_node;
    try {
     new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (new_node) {
     for (var i in new_node.contents) {
      throw new FS.ErrnoError(55);
     }
    }
   }
   delete old_node.parent.contents[old_node.name];
   old_node.name = new_name;
   new_dir.contents[new_name] = old_node;
   old_node.parent = new_dir;
  },
  unlink: function(parent, name) {
   delete parent.contents[name];
  },
  rmdir: function(parent, name) {
   var node = FS.lookupNode(parent, name);
   for (var i in node.contents) {
    throw new FS.ErrnoError(55);
   }
   delete parent.contents[name];
  },
  readdir: function(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  },
  symlink: function(parent, newname, oldpath) {
   var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
   node.link = oldpath;
   return node;
  },
  readlink: function(node) {
   if (!FS.isLink(node.mode)) {
    throw new FS.ErrnoError(28);
   }
   return node.link;
  }
 },
 stream_ops: {
  read: function(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= stream.node.usedBytes) return 0;
   var size = Math.min(stream.node.usedBytes - position, length);
   assert(size >= 0);
   if (size > 8 && contents.subarray) {
    buffer.set(contents.subarray(position, position + size), offset);
   } else {
    for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
   }
   return size;
  },
  write: function(stream, buffer, offset, length, position, canOwn) {
   assert(!(buffer instanceof ArrayBuffer));
   if (!length) return 0;
   var node = stream.node;
   node.timestamp = Date.now();
   if (buffer.subarray && (!node.contents || node.contents.subarray)) {
    if (canOwn) {
     assert(position === 0, "canOwn must imply no weird position inside the file");
     node.contents = buffer.subarray(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (node.usedBytes === 0 && position === 0) {
     node.contents = buffer.slice(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (position + length <= node.usedBytes) {
     node.contents.set(buffer.subarray(offset, offset + length), position);
     return length;
    }
   }
   MEMFS.expandFileStorage(node, position + length);
   if (node.contents.subarray && buffer.subarray) {
    node.contents.set(buffer.subarray(offset, offset + length), position);
   } else {
    for (var i = 0; i < length; i++) {
     node.contents[position + i] = buffer[offset + i];
    }
   }
   node.usedBytes = Math.max(node.usedBytes, position + length);
   return length;
  },
  llseek: function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.usedBytes;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(28);
   }
   return position;
  },
  allocate: function(stream, offset, length) {
   MEMFS.expandFileStorage(stream.node, offset + length);
   stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
  },
  mmap: function(stream, address, length, position, prot, flags) {
   assert(address === 0);
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(43);
   }
   var ptr;
   var allocated;
   var contents = stream.node.contents;
   if (!(flags & 2) && contents.buffer === buffer) {
    allocated = false;
    ptr = contents.byteOffset;
   } else {
    if (position > 0 || position + length < contents.length) {
     if (contents.subarray) {
      contents = contents.subarray(position, position + length);
     } else {
      contents = Array.prototype.slice.call(contents, position, position + length);
     }
    }
    allocated = true;
    ptr = mmapAlloc(length);
    if (!ptr) {
     throw new FS.ErrnoError(48);
    }
    HEAP8.set(contents, ptr);
   }
   return {
    ptr: ptr,
    allocated: allocated
   };
  },
  msync: function(stream, buffer, offset, length, mmapFlags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(43);
   }
   if (mmapFlags & 2) {
    return 0;
   }
   var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
   return 0;
  }
 }
};

var ERRNO_MESSAGES = {
 0: "Success",
 1: "Arg list too long",
 2: "Permission denied",
 3: "Address already in use",
 4: "Address not available",
 5: "Address family not supported by protocol family",
 6: "No more processes",
 7: "Socket already connected",
 8: "Bad file number",
 9: "Trying to read unreadable message",
 10: "Mount device busy",
 11: "Operation canceled",
 12: "No children",
 13: "Connection aborted",
 14: "Connection refused",
 15: "Connection reset by peer",
 16: "File locking deadlock error",
 17: "Destination address required",
 18: "Math arg out of domain of func",
 19: "Quota exceeded",
 20: "File exists",
 21: "Bad address",
 22: "File too large",
 23: "Host is unreachable",
 24: "Identifier removed",
 25: "Illegal byte sequence",
 26: "Connection already in progress",
 27: "Interrupted system call",
 28: "Invalid argument",
 29: "I/O error",
 30: "Socket is already connected",
 31: "Is a directory",
 32: "Too many symbolic links",
 33: "Too many open files",
 34: "Too many links",
 35: "Message too long",
 36: "Multihop attempted",
 37: "File or path name too long",
 38: "Network interface is not configured",
 39: "Connection reset by network",
 40: "Network is unreachable",
 41: "Too many open files in system",
 42: "No buffer space available",
 43: "No such device",
 44: "No such file or directory",
 45: "Exec format error",
 46: "No record locks available",
 47: "The link has been severed",
 48: "Not enough core",
 49: "No message of desired type",
 50: "Protocol not available",
 51: "No space left on device",
 52: "Function not implemented",
 53: "Socket is not connected",
 54: "Not a directory",
 55: "Directory not empty",
 56: "State not recoverable",
 57: "Socket operation on non-socket",
 59: "Not a typewriter",
 60: "No such device or address",
 61: "Value too large for defined data type",
 62: "Previous owner died",
 63: "Not super-user",
 64: "Broken pipe",
 65: "Protocol error",
 66: "Unknown protocol",
 67: "Protocol wrong type for socket",
 68: "Math result not representable",
 69: "Read only file system",
 70: "Illegal seek",
 71: "No such process",
 72: "Stale file handle",
 73: "Connection timed out",
 74: "Text file busy",
 75: "Cross-device link",
 100: "Device not a stream",
 101: "Bad font file fmt",
 102: "Invalid slot",
 103: "Invalid request code",
 104: "No anode",
 105: "Block device required",
 106: "Channel number out of range",
 107: "Level 3 halted",
 108: "Level 3 reset",
 109: "Link number out of range",
 110: "Protocol driver not attached",
 111: "No CSI structure available",
 112: "Level 2 halted",
 113: "Invalid exchange",
 114: "Invalid request descriptor",
 115: "Exchange full",
 116: "No data (for no delay io)",
 117: "Timer expired",
 118: "Out of streams resources",
 119: "Machine is not on the network",
 120: "Package not installed",
 121: "The object is remote",
 122: "Advertise error",
 123: "Srmount error",
 124: "Communication error on send",
 125: "Cross mount point (not really error)",
 126: "Given log. name not unique",
 127: "f.d. invalid for this operation",
 128: "Remote address changed",
 129: "Can   access a needed shared lib",
 130: "Accessing a corrupted shared lib",
 131: ".lib section in a.out corrupted",
 132: "Attempting to link in too many libs",
 133: "Attempting to exec a shared library",
 135: "Streams pipe error",
 136: "Too many users",
 137: "Socket type not supported",
 138: "Not supported",
 139: "Protocol family not supported",
 140: "Can't send after socket shutdown",
 141: "Too many references",
 142: "Host is down",
 148: "No medium (in tape drive)",
 156: "Level 2 not synchronized"
};

var ERRNO_CODES = {
 EPERM: 63,
 ENOENT: 44,
 ESRCH: 71,
 EINTR: 27,
 EIO: 29,
 ENXIO: 60,
 E2BIG: 1,
 ENOEXEC: 45,
 EBADF: 8,
 ECHILD: 12,
 EAGAIN: 6,
 EWOULDBLOCK: 6,
 ENOMEM: 48,
 EACCES: 2,
 EFAULT: 21,
 ENOTBLK: 105,
 EBUSY: 10,
 EEXIST: 20,
 EXDEV: 75,
 ENODEV: 43,
 ENOTDIR: 54,
 EISDIR: 31,
 EINVAL: 28,
 ENFILE: 41,
 EMFILE: 33,
 ENOTTY: 59,
 ETXTBSY: 74,
 EFBIG: 22,
 ENOSPC: 51,
 ESPIPE: 70,
 EROFS: 69,
 EMLINK: 34,
 EPIPE: 64,
 EDOM: 18,
 ERANGE: 68,
 ENOMSG: 49,
 EIDRM: 24,
 ECHRNG: 106,
 EL2NSYNC: 156,
 EL3HLT: 107,
 EL3RST: 108,
 ELNRNG: 109,
 EUNATCH: 110,
 ENOCSI: 111,
 EL2HLT: 112,
 EDEADLK: 16,
 ENOLCK: 46,
 EBADE: 113,
 EBADR: 114,
 EXFULL: 115,
 ENOANO: 104,
 EBADRQC: 103,
 EBADSLT: 102,
 EDEADLOCK: 16,
 EBFONT: 101,
 ENOSTR: 100,
 ENODATA: 116,
 ETIME: 117,
 ENOSR: 118,
 ENONET: 119,
 ENOPKG: 120,
 EREMOTE: 121,
 ENOLINK: 47,
 EADV: 122,
 ESRMNT: 123,
 ECOMM: 124,
 EPROTO: 65,
 EMULTIHOP: 36,
 EDOTDOT: 125,
 EBADMSG: 9,
 ENOTUNIQ: 126,
 EBADFD: 127,
 EREMCHG: 128,
 ELIBACC: 129,
 ELIBBAD: 130,
 ELIBSCN: 131,
 ELIBMAX: 132,
 ELIBEXEC: 133,
 ENOSYS: 52,
 ENOTEMPTY: 55,
 ENAMETOOLONG: 37,
 ELOOP: 32,
 EOPNOTSUPP: 138,
 EPFNOSUPPORT: 139,
 ECONNRESET: 15,
 ENOBUFS: 42,
 EAFNOSUPPORT: 5,
 EPROTOTYPE: 67,
 ENOTSOCK: 57,
 ENOPROTOOPT: 50,
 ESHUTDOWN: 140,
 ECONNREFUSED: 14,
 EADDRINUSE: 3,
 ECONNABORTED: 13,
 ENETUNREACH: 40,
 ENETDOWN: 38,
 ETIMEDOUT: 73,
 EHOSTDOWN: 142,
 EHOSTUNREACH: 23,
 EINPROGRESS: 26,
 EALREADY: 7,
 EDESTADDRREQ: 17,
 EMSGSIZE: 35,
 EPROTONOSUPPORT: 66,
 ESOCKTNOSUPPORT: 137,
 EADDRNOTAVAIL: 4,
 ENETRESET: 39,
 EISCONN: 30,
 ENOTCONN: 53,
 ETOOMANYREFS: 141,
 EUSERS: 136,
 EDQUOT: 19,
 ESTALE: 72,
 ENOTSUP: 138,
 ENOMEDIUM: 148,
 EILSEQ: 25,
 EOVERFLOW: 61,
 ECANCELED: 11,
 ENOTRECOVERABLE: 56,
 EOWNERDEAD: 62,
 ESTRPIPE: 135
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
  if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
  return setErrNo(e.errno);
 },
 lookupPath: function(path, opts) {
  path = PATH_FS.resolve(FS.cwd(), path);
  opts = opts || {};
  if (!path) return {
   path: "",
   node: null
  };
  var defaults = {
   follow_mount: true,
   recurse_count: 0
  };
  for (var key in defaults) {
   if (opts[key] === undefined) {
    opts[key] = defaults[key];
   }
  }
  if (opts.recurse_count > 8) {
   throw new FS.ErrnoError(32);
  }
  var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
   return !!p;
  }), false);
  var current = FS.root;
  var current_path = "/";
  for (var i = 0; i < parts.length; i++) {
   var islast = i === parts.length - 1;
   if (islast && opts.parent) {
    break;
   }
   current = FS.lookupNode(current, parts[i]);
   current_path = PATH.join2(current_path, parts[i]);
   if (FS.isMountpoint(current)) {
    if (!islast || islast && opts.follow_mount) {
     current = current.mounted.root;
    }
   }
   if (!islast || opts.follow) {
    var count = 0;
    while (FS.isLink(current.mode)) {
     var link = FS.readlink(current_path);
     current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
     var lookup = FS.lookupPath(current_path, {
      recurse_count: opts.recurse_count
     });
     current = lookup.node;
     if (count++ > 40) {
      throw new FS.ErrnoError(32);
     }
    }
   }
  }
  return {
   path: current_path,
   node: current
  };
 },
 getPath: function(node) {
  var path;
  while (true) {
   if (FS.isRoot(node)) {
    var mount = node.mount.mountpoint;
    if (!path) return mount;
    return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
   }
   path = path ? node.name + "/" + path : node.name;
   node = node.parent;
  }
 },
 hashName: function(parentid, name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
   hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
  }
  return (parentid + hash >>> 0) % FS.nameTable.length;
 },
 hashAddNode: function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  node.name_next = FS.nameTable[hash];
  FS.nameTable[hash] = node;
 },
 hashRemoveNode: function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  if (FS.nameTable[hash] === node) {
   FS.nameTable[hash] = node.name_next;
  } else {
   var current = FS.nameTable[hash];
   while (current) {
    if (current.name_next === node) {
     current.name_next = node.name_next;
     break;
    }
    current = current.name_next;
   }
  }
 },
 lookupNode: function(parent, name) {
  var errCode = FS.mayLookup(parent);
  if (errCode) {
   throw new FS.ErrnoError(errCode, parent);
  }
  var hash = FS.hashName(parent.id, name);
  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
   var nodeName = node.name;
   if (node.parent.id === parent.id && nodeName === name) {
    return node;
   }
  }
  return FS.lookup(parent, name);
 },
 createNode: function(parent, name, mode, rdev) {
  var node = new FS.FSNode(parent, name, mode, rdev);
  FS.hashAddNode(node);
  return node;
 },
 destroyNode: function(node) {
  FS.hashRemoveNode(node);
 },
 isRoot: function(node) {
  return node === node.parent;
 },
 isMountpoint: function(node) {
  return !!node.mounted;
 },
 isFile: function(mode) {
  return (mode & 61440) === 32768;
 },
 isDir: function(mode) {
  return (mode & 61440) === 16384;
 },
 isLink: function(mode) {
  return (mode & 61440) === 40960;
 },
 isChrdev: function(mode) {
  return (mode & 61440) === 8192;
 },
 isBlkdev: function(mode) {
  return (mode & 61440) === 24576;
 },
 isFIFO: function(mode) {
  return (mode & 61440) === 4096;
 },
 isSocket: function(mode) {
  return (mode & 49152) === 49152;
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
   throw new Error("Unknown file open mode: " + str);
  }
  return flags;
 },
 flagsToPermissionString: function(flag) {
  var perms = [ "r", "w", "rw" ][flag & 3];
  if (flag & 512) {
   perms += "w";
  }
  return perms;
 },
 nodePermissions: function(node, perms) {
  if (FS.ignorePermissions) {
   return 0;
  }
  if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
   return 2;
  } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
   return 2;
  } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
   return 2;
  }
  return 0;
 },
 mayLookup: function(dir) {
  var errCode = FS.nodePermissions(dir, "x");
  if (errCode) return errCode;
  if (!dir.node_ops.lookup) return 2;
  return 0;
 },
 mayCreate: function(dir, name) {
  try {
   var node = FS.lookupNode(dir, name);
   return 20;
  } catch (e) {}
  return FS.nodePermissions(dir, "wx");
 },
 mayDelete: function(dir, name, isdir) {
  var node;
  try {
   node = FS.lookupNode(dir, name);
  } catch (e) {
   return e.errno;
  }
  var errCode = FS.nodePermissions(dir, "wx");
  if (errCode) {
   return errCode;
  }
  if (isdir) {
   if (!FS.isDir(node.mode)) {
    return 54;
   }
   if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
    return 10;
   }
  } else {
   if (FS.isDir(node.mode)) {
    return 31;
   }
  }
  return 0;
 },
 mayOpen: function(node, flags) {
  if (!node) {
   return 44;
  }
  if (FS.isLink(node.mode)) {
   return 32;
  } else if (FS.isDir(node.mode)) {
   if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
    return 31;
   }
  }
  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
 },
 MAX_OPEN_FDS: 4096,
 nextfd: function(fd_start, fd_end) {
  fd_start = fd_start || 0;
  fd_end = fd_end || FS.MAX_OPEN_FDS;
  for (var fd = fd_start; fd <= fd_end; fd++) {
   if (!FS.streams[fd]) {
    return fd;
   }
  }
  throw new FS.ErrnoError(33);
 },
 getStream: function(fd) {
  return FS.streams[fd];
 },
 createStream: function(stream, fd_start, fd_end) {
  if (!FS.FSStream) {
   FS.FSStream = function() {};
   FS.FSStream.prototype = {
    object: {
     get: function() {
      return this.node;
     },
     set: function(val) {
      this.node = val;
     }
    },
    isRead: {
     get: function() {
      return (this.flags & 2097155) !== 1;
     }
    },
    isWrite: {
     get: function() {
      return (this.flags & 2097155) !== 0;
     }
    },
    isAppend: {
     get: function() {
      return this.flags & 1024;
     }
    }
   };
  }
  var newStream = new FS.FSStream();
  for (var p in stream) {
   newStream[p] = stream[p];
  }
  stream = newStream;
  var fd = FS.nextfd(fd_start, fd_end);
  stream.fd = fd;
  FS.streams[fd] = stream;
  return stream;
 },
 closeStream: function(fd) {
  FS.streams[fd] = null;
 },
 chrdev_stream_ops: {
  open: function(stream) {
   var device = FS.getDevice(stream.node.rdev);
   stream.stream_ops = device.stream_ops;
   if (stream.stream_ops.open) {
    stream.stream_ops.open(stream);
   }
  },
  llseek: function() {
   throw new FS.ErrnoError(70);
  }
 },
 major: function(dev) {
  return dev >> 8;
 },
 minor: function(dev) {
  return dev & 255;
 },
 makedev: function(ma, mi) {
  return ma << 8 | mi;
 },
 registerDevice: function(dev, ops) {
  FS.devices[dev] = {
   stream_ops: ops
  };
 },
 getDevice: function(dev) {
  return FS.devices[dev];
 },
 getMounts: function(mount) {
  var mounts = [];
  var check = [ mount ];
  while (check.length) {
   var m = check.pop();
   mounts.push(m);
   check.push.apply(check, m.mounts);
  }
  return mounts;
 },
 syncfs: function(populate, callback) {
  if (typeof populate === "function") {
   callback = populate;
   populate = false;
  }
  FS.syncFSRequests++;
  if (FS.syncFSRequests > 1) {
   err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
  }
  var mounts = FS.getMounts(FS.root.mount);
  var completed = 0;
  function doCallback(errCode) {
   assert(FS.syncFSRequests > 0);
   FS.syncFSRequests--;
   return callback(errCode);
  }
  function done(errCode) {
   if (errCode) {
    if (!done.errored) {
     done.errored = true;
     return doCallback(errCode);
    }
    return;
   }
   if (++completed >= mounts.length) {
    doCallback(null);
   }
  }
  mounts.forEach(function(mount) {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  });
 },
 mount: function(type, opts, mountpoint) {
  if (typeof type === "string") {
   throw type;
  }
  var root = mountpoint === "/";
  var pseudo = !mountpoint;
  var node;
  if (root && FS.root) {
   throw new FS.ErrnoError(10);
  } else if (!root && !pseudo) {
   var lookup = FS.lookupPath(mountpoint, {
    follow_mount: false
   });
   mountpoint = lookup.path;
   node = lookup.node;
   if (FS.isMountpoint(node)) {
    throw new FS.ErrnoError(10);
   }
   if (!FS.isDir(node.mode)) {
    throw new FS.ErrnoError(54);
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
   FS.root = mountRoot;
  } else if (node) {
   node.mounted = mount;
   if (node.mount) {
    node.mount.mounts.push(mount);
   }
  }
  return mountRoot;
 },
 unmount: function(mountpoint) {
  var lookup = FS.lookupPath(mountpoint, {
   follow_mount: false
  });
  if (!FS.isMountpoint(lookup.node)) {
   throw new FS.ErrnoError(28);
  }
  var node = lookup.node;
  var mount = node.mounted;
  var mounts = FS.getMounts(mount);
  Object.keys(FS.nameTable).forEach(function(hash) {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.indexOf(current.mount) !== -1) {
     FS.destroyNode(current);
    }
    current = next;
   }
  });
  node.mounted = null;
  var idx = node.mount.mounts.indexOf(mount);
  assert(idx !== -1);
  node.mount.mounts.splice(idx, 1);
 },
 lookup: function(parent, name) {
  return parent.node_ops.lookup(parent, name);
 },
 mknod: function(path, mode, dev) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  if (!name || name === "." || name === "..") {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.mayCreate(parent, name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.mknod) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.mknod(parent, name, mode, dev);
 },
 create: function(path, mode) {
  mode = mode !== undefined ? mode : 438;
  mode &= 4095;
  mode |= 32768;
  return FS.mknod(path, mode, 0);
 },
 mkdir: function(path, mode) {
  mode = mode !== undefined ? mode : 511;
  mode &= 511 | 512;
  mode |= 16384;
  return FS.mknod(path, mode, 0);
 },
 mkdirTree: function(path, mode) {
  var dirs = path.split("/");
  var d = "";
  for (var i = 0; i < dirs.length; ++i) {
   if (!dirs[i]) continue;
   d += "/" + dirs[i];
   try {
    FS.mkdir(d, mode);
   } catch (e) {
    if (e.errno != 20) throw e;
   }
  }
 },
 mkdev: function(path, mode, dev) {
  if (typeof dev === "undefined") {
   dev = mode;
   mode = 438;
  }
  mode |= 8192;
  return FS.mknod(path, mode, dev);
 },
 symlink: function(oldpath, newpath) {
  if (!PATH_FS.resolve(oldpath)) {
   throw new FS.ErrnoError(44);
  }
  var lookup = FS.lookupPath(newpath, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(44);
  }
  var newname = PATH.basename(newpath);
  var errCode = FS.mayCreate(parent, newname);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.symlink) {
   throw new FS.ErrnoError(63);
  }
  return parent.node_ops.symlink(parent, newname, oldpath);
 },
 rename: function(old_path, new_path) {
  var old_dirname = PATH.dirname(old_path);
  var new_dirname = PATH.dirname(new_path);
  var old_name = PATH.basename(old_path);
  var new_name = PATH.basename(new_path);
  var lookup, old_dir, new_dir;
  lookup = FS.lookupPath(old_path, {
   parent: true
  });
  old_dir = lookup.node;
  lookup = FS.lookupPath(new_path, {
   parent: true
  });
  new_dir = lookup.node;
  if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
  if (old_dir.mount !== new_dir.mount) {
   throw new FS.ErrnoError(75);
  }
  var old_node = FS.lookupNode(old_dir, old_name);
  var relative = PATH_FS.relative(old_path, new_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(28);
  }
  relative = PATH_FS.relative(new_path, old_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(55);
  }
  var new_node;
  try {
   new_node = FS.lookupNode(new_dir, new_name);
  } catch (e) {}
  if (old_node === new_node) {
   return;
  }
  var isdir = FS.isDir(old_node.mode);
  var errCode = FS.mayDelete(old_dir, old_name, isdir);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!old_dir.node_ops.rename) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
   throw new FS.ErrnoError(10);
  }
  if (new_dir !== old_dir) {
   errCode = FS.nodePermissions(old_dir, "w");
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  try {
   if (FS.trackingDelegate["willMovePath"]) {
    FS.trackingDelegate["willMovePath"](old_path, new_path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
  FS.hashRemoveNode(old_node);
  try {
   old_dir.node_ops.rename(old_node, new_dir, new_name);
  } catch (e) {
   throw e;
  } finally {
   FS.hashAddNode(old_node);
  }
  try {
   if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
  } catch (e) {
   err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
 },
 rmdir: function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, true);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.rmdir) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.rmdir(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 },
 readdir: function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node.node_ops.readdir) {
   throw new FS.ErrnoError(54);
  }
  return node.node_ops.readdir(node);
 },
 unlink: function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var errCode = FS.mayDelete(parent, name, false);
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  if (!parent.node_ops.unlink) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(10);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.unlink(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 },
 readlink: function(path) {
  var lookup = FS.lookupPath(path);
  var link = lookup.node;
  if (!link) {
   throw new FS.ErrnoError(44);
  }
  if (!link.node_ops.readlink) {
   throw new FS.ErrnoError(28);
  }
  return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
 },
 stat: function(path, dontFollow) {
  var lookup = FS.lookupPath(path, {
   follow: !dontFollow
  });
  var node = lookup.node;
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (!node.node_ops.getattr) {
   throw new FS.ErrnoError(63);
  }
  return node.node_ops.getattr(node);
 },
 lstat: function(path) {
  return FS.stat(path, true);
 },
 chmod: function(path, mode, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   mode: mode & 4095 | node.mode & ~4095,
   timestamp: Date.now()
  });
 },
 lchmod: function(path, mode) {
  FS.chmod(path, mode, true);
 },
 fchmod: function(fd, mode) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  FS.chmod(stream.node, mode);
 },
 chown: function(path, uid, gid, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  node.node_ops.setattr(node, {
   timestamp: Date.now()
  });
 },
 lchown: function(path, uid, gid) {
  FS.chown(path, uid, gid, true);
 },
 fchown: function(fd, uid, gid) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  FS.chown(stream.node, uid, gid);
 },
 truncate: function(path, len) {
  if (len < 0) {
   throw new FS.ErrnoError(28);
  }
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: true
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(63);
  }
  if (FS.isDir(node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!FS.isFile(node.mode)) {
   throw new FS.ErrnoError(28);
  }
  var errCode = FS.nodePermissions(node, "w");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  node.node_ops.setattr(node, {
   size: len,
   timestamp: Date.now()
  });
 },
 ftruncate: function(fd, len) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(28);
  }
  FS.truncate(stream.node, len);
 },
 utime: function(path, atime, mtime) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  node.node_ops.setattr(node, {
   timestamp: Math.max(atime, mtime)
  });
 },
 open: function(path, flags, mode, fd_start, fd_end) {
  if (path === "") {
   throw new FS.ErrnoError(44);
  }
  flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
  mode = typeof mode === "undefined" ? 438 : mode;
  if (flags & 64) {
   mode = mode & 4095 | 32768;
  } else {
   mode = 0;
  }
  var node;
  if (typeof path === "object") {
   node = path;
  } else {
   path = PATH.normalize(path);
   try {
    var lookup = FS.lookupPath(path, {
     follow: !(flags & 131072)
    });
    node = lookup.node;
   } catch (e) {}
  }
  var created = false;
  if (flags & 64) {
   if (node) {
    if (flags & 128) {
     throw new FS.ErrnoError(20);
    }
   } else {
    node = FS.mknod(path, mode, 0);
    created = true;
   }
  }
  if (!node) {
   throw new FS.ErrnoError(44);
  }
  if (FS.isChrdev(node.mode)) {
   flags &= ~512;
  }
  if (flags & 65536 && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(54);
  }
  if (!created) {
   var errCode = FS.mayOpen(node, flags);
   if (errCode) {
    throw new FS.ErrnoError(errCode);
   }
  }
  if (flags & 512) {
   FS.truncate(node, 0);
  }
  flags &= ~(128 | 512 | 131072);
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
   stream.stream_ops.open(stream);
  }
  if (Module["logReadFiles"] && !(flags & 1)) {
   if (!FS.readFiles) FS.readFiles = {};
   if (!(path in FS.readFiles)) {
    FS.readFiles[path] = 1;
    err("FS.trackingDelegate error on read file: " + path);
   }
  }
  try {
   if (FS.trackingDelegate["onOpenFile"]) {
    var trackingFlags = 0;
    if ((flags & 2097155) !== 1) {
     trackingFlags |= FS.tracking.openFlags.READ;
    }
    if ((flags & 2097155) !== 0) {
     trackingFlags |= FS.tracking.openFlags.WRITE;
    }
    FS.trackingDelegate["onOpenFile"](path, trackingFlags);
   }
  } catch (e) {
   err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
  }
  return stream;
 },
 close: function(stream) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (stream.getdents) stream.getdents = null;
  try {
   if (stream.stream_ops.close) {
    stream.stream_ops.close(stream);
   }
  } catch (e) {
   throw e;
  } finally {
   FS.closeStream(stream.fd);
  }
  stream.fd = null;
 },
 isClosed: function(stream) {
  return stream.fd === null;
 },
 llseek: function(stream, offset, whence) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (!stream.seekable || !stream.stream_ops.llseek) {
   throw new FS.ErrnoError(70);
  }
  if (whence != 0 && whence != 1 && whence != 2) {
   throw new FS.ErrnoError(28);
  }
  stream.position = stream.stream_ops.llseek(stream, offset, whence);
  stream.ungotten = [];
  return stream.position;
 },
 read: function(stream, buffer, offset, length, position) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.read) {
   throw new FS.ErrnoError(28);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
  if (!seeking) stream.position += bytesRead;
  return bytesRead;
 },
 write: function(stream, buffer, offset, length, position, canOwn) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(31);
  }
  if (!stream.stream_ops.write) {
   throw new FS.ErrnoError(28);
  }
  if (stream.seekable && stream.flags & 1024) {
   FS.llseek(stream, 0, 2);
  }
  var seeking = typeof position !== "undefined";
  if (!seeking) {
   position = stream.position;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(70);
  }
  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
  if (!seeking) stream.position += bytesWritten;
  try {
   if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
  } catch (e) {
   err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message);
  }
  return bytesWritten;
 },
 allocate: function(stream, offset, length) {
  if (FS.isClosed(stream)) {
   throw new FS.ErrnoError(8);
  }
  if (offset < 0 || length <= 0) {
   throw new FS.ErrnoError(28);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(8);
  }
  if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(43);
  }
  if (!stream.stream_ops.allocate) {
   throw new FS.ErrnoError(138);
  }
  stream.stream_ops.allocate(stream, offset, length);
 },
 mmap: function(stream, address, length, position, prot, flags) {
  if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
   throw new FS.ErrnoError(2);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(2);
  }
  if (!stream.stream_ops.mmap) {
   throw new FS.ErrnoError(43);
  }
  return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
 },
 msync: function(stream, buffer, offset, length, mmapFlags) {
  if (!stream || !stream.stream_ops.msync) {
   return 0;
  }
  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
 },
 munmap: function(stream) {
  return 0;
 },
 ioctl: function(stream, cmd, arg) {
  if (!stream.stream_ops.ioctl) {
   throw new FS.ErrnoError(59);
  }
  return stream.stream_ops.ioctl(stream, cmd, arg);
 },
 readFile: function(path, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "r";
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var ret;
  var stream = FS.open(path, opts.flags);
  var stat = FS.stat(path);
  var length = stat.size;
  var buf = new Uint8Array(length);
  FS.read(stream, buf, 0, length, 0);
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(buf, 0);
  } else if (opts.encoding === "binary") {
   ret = buf;
  }
  FS.close(stream);
  return ret;
 },
 writeFile: function(path, data, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "w";
  var stream = FS.open(path, opts.flags, opts.mode);
  if (typeof data === "string") {
   var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
   var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
   FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
  } else if (ArrayBuffer.isView(data)) {
   FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
  } else {
   throw new Error("Unsupported data type");
  }
  FS.close(stream);
 },
 cwd: function() {
  return FS.currentPath;
 },
 chdir: function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  if (lookup.node === null) {
   throw new FS.ErrnoError(44);
  }
  if (!FS.isDir(lookup.node.mode)) {
   throw new FS.ErrnoError(54);
  }
  var errCode = FS.nodePermissions(lookup.node, "x");
  if (errCode) {
   throw new FS.ErrnoError(errCode);
  }
  FS.currentPath = lookup.path;
 },
 createDefaultDirectories: function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
 },
 createDefaultDevices: function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {
   read: function() {
    return 0;
   },
   write: function(stream, buffer, offset, length, pos) {
    return length;
   }
  });
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var random_device = getRandomDevice();
  FS.createDevice("/dev", "random", random_device);
  FS.createDevice("/dev", "urandom", random_device);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
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
      if (!stream) throw new FS.ErrnoError(8);
      var ret = {
       parent: null,
       mount: {
        mountpoint: "fake"
       },
       node_ops: {
        readlink: function() {
         return stream.path;
        }
       }
      };
      ret.parent = ret;
      return ret;
     }
    };
    return node;
   }
  }, {}, "/proc/self/fd");
 },
 createStandardStreams: function() {
  if (Module["stdin"]) {
   FS.createDevice("/dev", "stdin", Module["stdin"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdin");
  }
  if (Module["stdout"]) {
   FS.createDevice("/dev", "stdout", null, Module["stdout"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdout");
  }
  if (Module["stderr"]) {
   FS.createDevice("/dev", "stderr", null, Module["stderr"]);
  } else {
   FS.symlink("/dev/tty1", "/dev/stderr");
  }
  var stdin = FS.open("/dev/stdin", "r");
  var stdout = FS.open("/dev/stdout", "w");
  var stderr = FS.open("/dev/stderr", "w");
  assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
  assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
  assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
 },
 ensureErrnoError: function() {
  if (FS.ErrnoError) return;
  FS.ErrnoError = function ErrnoError(errno, node) {
   this.node = node;
   this.setErrno = function(errno) {
    this.errno = errno;
    for (var key in ERRNO_CODES) {
     if (ERRNO_CODES[key] === errno) {
      this.code = key;
      break;
     }
    }
   };
   this.setErrno(errno);
   this.message = ERRNO_MESSAGES[errno];
   if (this.stack) {
    Object.defineProperty(this, "stack", {
     value: new Error().stack,
     writable: true
    });
    this.stack = demangleAll(this.stack);
   }
  };
  FS.ErrnoError.prototype = new Error();
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
  [ 44 ].forEach(function(code) {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  });
 },
 staticInit: function() {
  FS.ensureErrnoError();
  FS.nameTable = new Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {
   "MEMFS": MEMFS
  };
 },
 init: function(input, output, error) {
  assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  FS.init.initialized = true;
  FS.ensureErrnoError();
  Module["stdin"] = input || Module["stdin"];
  Module["stdout"] = output || Module["stdout"];
  Module["stderr"] = error || Module["stderr"];
  FS.createStandardStreams();
 },
 quit: function() {
  FS.init.initialized = false;
  var fflush = Module["_fflush"];
  if (fflush) fflush(0);
  for (var i = 0; i < FS.streams.length; i++) {
   var stream = FS.streams[i];
   if (!stream) {
    continue;
   }
   FS.close(stream);
  }
 },
 getMode: function(canRead, canWrite) {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
 },
 findObject: function(path, dontResolveLastLink) {
  var ret = FS.analyzePath(path, dontResolveLastLink);
  if (ret.exists) {
   return ret.object;
  } else {
   setErrNo(ret.error);
   return null;
  }
 },
 analyzePath: function(path, dontResolveLastLink) {
  try {
   var lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   path = lookup.path;
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
   ret.isRoot = lookup.path === "/";
  } catch (e) {
   ret.error = e.errno;
  }
  return ret;
 },
 createPath: function(parent, path, canRead, canWrite) {
  parent = typeof parent === "string" ? parent : FS.getPath(parent);
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   try {
    FS.mkdir(current);
   } catch (e) {}
   parent = current;
  }
  return current;
 },
 createFile: function(parent, name, properties, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.create(path, mode);
 },
 createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
  var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
  var mode = FS.getMode(canRead, canWrite);
  var node = FS.create(path, mode);
  if (data) {
   if (typeof data === "string") {
    var arr = new Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
    data = arr;
   }
   FS.chmod(node, mode | 146);
   var stream = FS.open(node, "w");
   FS.write(stream, data, 0, data.length, 0, canOwn);
   FS.close(stream);
   FS.chmod(node, mode);
  }
  return node;
 },
 createDevice: function(parent, name, input, output) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   open: function(stream) {
    stream.seekable = false;
   },
   close: function(stream) {
    if (output && output.buffer && output.buffer.length) {
     output(10);
    }
   },
   read: function(stream, buffer, offset, length, pos) {
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(6);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    if (bytesRead) {
     stream.node.timestamp = Date.now();
    }
    return bytesRead;
   },
   write: function(stream, buffer, offset, length, pos) {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
    }
    if (length) {
     stream.node.timestamp = Date.now();
    }
    return i;
   }
  });
  return FS.mkdev(path, mode, dev);
 },
 forceLoadFile: function(obj) {
  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
  var success = true;
  if (typeof XMLHttpRequest !== "undefined") {
   throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  } else if (read_) {
   try {
    obj.contents = intArrayFromString(read_(obj.url), true);
    obj.usedBytes = obj.contents.length;
   } catch (e) {
    success = false;
   }
  } else {
   throw new Error("Cannot load without read() or XMLHttpRequest.");
  }
  if (!success) setErrNo(29);
  return success;
 },
 createLazyFile: function(parent, name, url, canRead, canWrite) {
  function LazyUint8Array() {
   this.lengthKnown = false;
   this.chunks = [];
  }
  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
   if (idx > this.length - 1 || idx < 0) {
    return undefined;
   }
   var chunkOffset = idx % this.chunkSize;
   var chunkNum = idx / this.chunkSize | 0;
   return this.getter(chunkNum)[chunkOffset];
  };
  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
   this.getter = getter;
  };
  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
   var xhr = new XMLHttpRequest();
   xhr.open("HEAD", url, false);
   xhr.send(null);
   if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
   var datalength = Number(xhr.getResponseHeader("Content-length"));
   var header;
   var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
   var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
   var chunkSize = 1024 * 1024;
   if (!hasByteServing) chunkSize = datalength;
   var doXHR = function(from, to) {
    if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
    if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
    if (xhr.overrideMimeType) {
     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.send(null);
    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
    if (xhr.response !== undefined) {
     return new Uint8Array(xhr.response || []);
    } else {
     return intArrayFromString(xhr.responseText || "", true);
    }
   };
   var lazyArray = this;
   lazyArray.setDataGetter(function(chunkNum) {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] === "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   });
   if (usesGzip || !datalength) {
    chunkSize = datalength = 1;
    datalength = this.getter(0).length;
    chunkSize = datalength;
    out("LazyFiles on gzip forces download of the whole file when length is accessed");
   }
   this._length = datalength;
   this._chunkSize = chunkSize;
   this.lengthKnown = true;
  };
  if (typeof XMLHttpRequest !== "undefined") {
   if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
   var lazyArray = new LazyUint8Array();
   Object.defineProperties(lazyArray, {
    length: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._length;
     }
    },
    chunkSize: {
     get: function() {
      if (!this.lengthKnown) {
       this.cacheLength();
      }
      return this._chunkSize;
     }
    }
   });
   var properties = {
    isDevice: false,
    contents: lazyArray
   };
  } else {
   var properties = {
    isDevice: false,
    url: url
   };
  }
  var node = FS.createFile(parent, name, properties, canRead, canWrite);
  if (properties.contents) {
   node.contents = properties.contents;
  } else if (properties.url) {
   node.contents = null;
   node.url = properties.url;
  }
  Object.defineProperties(node, {
   usedBytes: {
    get: function() {
     return this.contents.length;
    }
   }
  });
  var stream_ops = {};
  var keys = Object.keys(node.stream_ops);
  keys.forEach(function(key) {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    if (!FS.forceLoadFile(node)) {
     throw new FS.ErrnoError(29);
    }
    return fn.apply(null, arguments);
   };
  });
  stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
   if (!FS.forceLoadFile(node)) {
    throw new FS.ErrnoError(29);
   }
   var contents = stream.node.contents;
   if (position >= contents.length) return 0;
   var size = Math.min(contents.length - position, length);
   assert(size >= 0);
   if (contents.slice) {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents[position + i];
    }
   } else {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents.get(position + i);
    }
   }
   return size;
  };
  node.stream_ops = stream_ops;
  return node;
 },
 createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
  Browser.init();
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency("cp " + fullname);
  function processData(byteArray) {
   function finish(byteArray) {
    if (preFinish) preFinish();
    if (!dontCreateFile) {
     FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
    if (onload) onload();
    removeRunDependency(dep);
   }
   var handled = false;
   Module["preloadPlugins"].forEach(function(plugin) {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
     plugin["handle"](byteArray, fullname, finish, function() {
      if (onerror) onerror();
      removeRunDependency(dep);
     });
     handled = true;
    }
   });
   if (!handled) finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
   Browser.asyncLoad(url, function(byteArray) {
    processData(byteArray);
   }, onerror);
  } else {
   processData(url);
  }
 },
 indexedDB: function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 },
 DB_NAME: function() {
  return "EM_FS_" + window.location.pathname;
 },
 DB_VERSION: 20,
 DB_STORE_NAME: "FILE_DATA",
 saveFilesToDB: function(paths, onload, onerror) {
  onload = onload || function() {};
  onerror = onerror || function() {};
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
   out("creating db");
   var db = openRequest.result;
   db.createObjectStore(FS.DB_STORE_NAME);
  };
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   var transaction = db.transaction([ FS.DB_STORE_NAME ], "readwrite");
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach(function(path) {
    var putRequest = files.put(FS.analyzePath(path).object.contents, path);
    putRequest.onsuccess = function putRequest_onsuccess() {
     ok++;
     if (ok + fail == total) finish();
    };
    putRequest.onerror = function putRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   });
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 },
 loadFilesFromDB: function(paths, onload, onerror) {
  onload = onload || function() {};
  onerror = onerror || function() {};
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = onerror;
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   try {
    var transaction = db.transaction([ FS.DB_STORE_NAME ], "readonly");
   } catch (e) {
    onerror(e);
    return;
   }
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach(function(path) {
    var getRequest = files.get(path);
    getRequest.onsuccess = function getRequest_onsuccess() {
     if (FS.analyzePath(path).exists) {
      FS.unlink(path);
     }
     FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
     ok++;
     if (ok + fail == total) finish();
    };
    getRequest.onerror = function getRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   });
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 },
 absolutePath: function() {
  abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
 },
 createFolder: function() {
  abort("FS.createFolder has been removed; use FS.mkdir instead");
 },
 createLink: function() {
  abort("FS.createLink has been removed; use FS.symlink instead");
 },
 joinPath: function() {
  abort("FS.joinPath has been removed; use PATH.join instead");
 },
 mmapAlloc: function() {
  abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
 },
 standardizePath: function() {
  abort("FS.standardizePath has been removed; use PATH.normalize instead");
 }
};

var SYSCALLS = {
 mappings: {},
 DEFAULT_POLLMASK: 5,
 umask: 511,
 calculateAt: function(dirfd, path) {
  if (path[0] !== "/") {
   var dir;
   if (dirfd === -100) {
    dir = FS.cwd();
   } else {
    var dirstream = FS.getStream(dirfd);
    if (!dirstream) throw new FS.ErrnoError(8);
    dir = dirstream.path;
   }
   path = PATH.join2(dir, path);
  }
  return path;
 },
 doStat: function(func, path, buf) {
  try {
   var stat = func(path);
  } catch (e) {
   if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
    return -54;
   }
   throw e;
  }
  _asan_js_store_4(buf >> 2, stat.dev);
  _asan_js_store_4(buf + 4 >> 2, 0);
  _asan_js_store_4(buf + 8 >> 2, stat.ino);
  _asan_js_store_4(buf + 12 >> 2, stat.mode);
  _asan_js_store_4(buf + 16 >> 2, stat.nlink);
  _asan_js_store_4(buf + 20 >> 2, stat.uid);
  _asan_js_store_4(buf + 24 >> 2, stat.gid);
  _asan_js_store_4(buf + 28 >> 2, stat.rdev);
  _asan_js_store_4(buf + 32 >> 2, 0);
  tempI64 = [ stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  _asan_js_store_4(buf + 40 >> 2, tempI64[0]), _asan_js_store_4(buf + 44 >> 2, tempI64[1]);
  _asan_js_store_4(buf + 48 >> 2, 4096);
  _asan_js_store_4(buf + 52 >> 2, stat.blocks);
  _asan_js_store_4(buf + 56 >> 2, stat.atime.getTime() / 1e3 | 0);
  _asan_js_store_4(buf + 60 >> 2, 0);
  _asan_js_store_4(buf + 64 >> 2, stat.mtime.getTime() / 1e3 | 0);
  _asan_js_store_4(buf + 68 >> 2, 0);
  _asan_js_store_4(buf + 72 >> 2, stat.ctime.getTime() / 1e3 | 0);
  _asan_js_store_4(buf + 76 >> 2, 0);
  tempI64 = [ stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  _asan_js_store_4(buf + 80 >> 2, tempI64[0]), _asan_js_store_4(buf + 84 >> 2, tempI64[1]);
  return 0;
 },
 doMsync: function(addr, stream, len, flags, offset) {
  var buffer = HEAPU8.slice(addr, addr + len);
  FS.msync(stream, buffer, offset, len, flags);
 },
 doMkdir: function(path, mode) {
  path = PATH.normalize(path);
  if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
  FS.mkdir(path, mode, 0);
  return 0;
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
   return -28;
  }
  FS.mknod(path, mode, dev);
  return 0;
 },
 doReadlink: function(path, buf, bufsize) {
  if (bufsize <= 0) return -28;
  var ret = FS.readlink(path);
  var len = Math.min(bufsize, lengthBytesUTF8(ret));
  var endChar = _asan_js_load_1(buf + len);
  stringToUTF8(ret, buf, bufsize + 1);
  _asan_js_store_1(buf + len, endChar);
  return len;
 },
 doAccess: function(path, amode) {
  if (amode & ~7) {
   return -28;
  }
  var node;
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  node = lookup.node;
  if (!node) {
   return -44;
  }
  var perms = "";
  if (amode & 4) perms += "r";
  if (amode & 2) perms += "w";
  if (amode & 1) perms += "x";
  if (perms && FS.nodePermissions(node, perms)) {
   return -2;
  }
  return 0;
 },
 doDup: function(path, flags, suggestFD) {
  var suggest = FS.getStream(suggestFD);
  if (suggest) FS.close(suggest);
  return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
 },
 doReadv: function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = _asan_js_load_4(iov + i * 8 >> 2);
   var len = _asan_js_load_4(iov + (i * 8 + 4) >> 2);
   var curr = FS.read(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
   if (curr < len) break;
  }
  return ret;
 },
 doWritev: function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = _asan_js_load_4(iov + i * 8 >> 2);
   var len = _asan_js_load_4(iov + (i * 8 + 4) >> 2);
   var curr = FS.write(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
  }
  return ret;
 },
 varargs: undefined,
 get: function() {
  assert(SYSCALLS.varargs != undefined);
  SYSCALLS.varargs += 4;
  var ret = _asan_js_load_4(SYSCALLS.varargs - 4 >> 2);
  return ret;
 },
 getStr: function(ptr) {
  var ret = UTF8ToString(ptr);
  return ret;
 },
 getStreamFromFD: function(fd) {
  var stream = FS.getStream(fd);
  if (!stream) throw new FS.ErrnoError(8);
  return stream;
 },
 get64: function(low, high) {
  if (low >= 0) assert(high === 0); else assert(high === -1);
  return low;
 }
};

function ___sys_chmod(path, mode) {
 try {
  path = SYSCALLS.getStr(path);
  FS.chmod(path, mode);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_dup(fd) {
 try {
  var old = SYSCALLS.getStreamFromFD(fd);
  return FS.open(old.path, old.flags, 0).fd;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_exit_group(status) {
 try {
  exit(status);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_fadvise64_64(fd, offset, len, advice) {
 return 0;
}

function ___sys_fchmod(fd, mode) {
 try {
  FS.fchmod(fd, mode);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_fcntl64(fd, cmd, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  switch (cmd) {
  case 0:
   {
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
   return 0;

  case 3:
   return stream.flags;

  case 4:
   {
    var arg = SYSCALLS.get();
    stream.flags |= arg;
    return 0;
   }

  case 12:
   {
    var arg = SYSCALLS.get();
    var offset = 0;
    _asan_js_store_2(arg + offset >> 1, 2);
    return 0;
   }

  case 13:
  case 14:
   return 0;

  case 16:
  case 8:
   return -28;

  case 9:
   setErrNo(28);
   return -1;

  default:
   {
    return -28;
   }
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_fstat64(fd, buf) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return SYSCALLS.doStat(FS.stat, stream.path, buf);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_ftruncate64(fd, zero, low, high) {
 try {
  var length = SYSCALLS.get64(low, high);
  FS.ftruncate(fd, length);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_getcwd(buf, size) {
 try {
  if (size === 0) return -28;
  var cwd = FS.cwd();
  var cwdLengthInBytes = lengthBytesUTF8(cwd);
  if (size < cwdLengthInBytes + 1) return -68;
  stringToUTF8(cwd, buf, size);
  return buf;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_getdents64(fd, dirp, count) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
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
   if (name[0] === ".") {
    id = 1;
    type = 4;
   } else {
    var child = FS.lookupNode(stream.node, name);
    id = child.id;
    type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
   }
   tempI64 = [ id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   _asan_js_store_4(dirp + pos >> 2, tempI64[0]), _asan_js_store_4(dirp + pos + 4 >> 2, tempI64[1]);
   tempI64 = [ (idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, 
   +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
   _asan_js_store_4(dirp + pos + 8 >> 2, tempI64[0]), _asan_js_store_4(dirp + pos + 12 >> 2, tempI64[1]);
   _asan_js_store_2(dirp + pos + 16 >> 1, 280);
   _asan_js_store_1(dirp + pos + 18 >> 0, type);
   stringToUTF8(name, dirp + pos + 19, 256);
   pos += struct_size;
   idx += 1;
  }
  FS.llseek(stream, idx * struct_size, 0);
  return pos;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_getegid32() {
 return 0;
}

function ___sys_geteuid32() {
 return ___sys_getegid32();
}

function ___sys_getgid32() {
 return ___sys_getegid32();
}

function ___sys_getpid() {
 return 42;
}

function ___sys_getrusage(who, usage) {
 try {
  _memset(usage, 0, 136);
  _asan_js_store_4(usage >> 2, 1);
  _asan_js_store_4(usage + 4 >> 2, 2);
  _asan_js_store_4(usage + 8 >> 2, 3);
  _asan_js_store_4(usage + 12 >> 2, 4);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_getuid32() {
 return ___sys_getegid32();
}

function ___sys_ioctl(fd, op, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  switch (op) {
  case 21509:
  case 21505:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21510:
  case 21511:
  case 21512:
  case 21506:
  case 21507:
  case 21508:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21519:
   {
    if (!stream.tty) return -59;
    var argp = SYSCALLS.get();
    _asan_js_store_4(argp >> 2, 0);
    return 0;
   }

  case 21520:
   {
    if (!stream.tty) return -59;
    return -28;
   }

  case 21531:
   {
    var argp = SYSCALLS.get();
    return FS.ioctl(stream, op, argp);
   }

  case 21523:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  case 21524:
   {
    if (!stream.tty) return -59;
    return 0;
   }

  default:
   abort("bad ioctl syscall " + op);
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_link(oldpath, newpath) {
 return -34;
}

function ___sys_lstat64(path, buf) {
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doStat(FS.lstat, path, buf);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_madvise1(addr, length, advice) {
 return 0;
}

function ___sys_mkdir(path, mode) {
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doMkdir(path, mode);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_mlock(addr, len) {
 return 0;
}

function syscallMmap2(addr, len, prot, flags, fd, off) {
 off <<= 12;
 var ptr;
 var allocated = false;
 if ((flags & 16) !== 0 && addr % 16384 !== 0) {
  return -28;
 }
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
 SYSCALLS.mappings[ptr] = {
  malloc: ptr,
  len: len,
  allocated: allocated,
  fd: fd,
  prot: prot,
  flags: flags,
  offset: off
 };
 return ptr;
}

function ___sys_mmap2(addr, len, prot, flags, fd, off) {
 try {
  return syscallMmap2(addr, len, prot, flags, fd, off);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_mprotect(addr, len, size) {
 return 0;
}

function ___sys_munlock(addr, len) {
 return 0;
}

function syscallMunmap(addr, len) {
 if ((addr | 0) === -1 || len === 0) {
  return -28;
 }
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
}

function ___sys_munmap(addr, len) {
 try {
  return syscallMunmap(addr, len);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_open(path, flags, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var pathname = SYSCALLS.getStr(path);
  var mode = SYSCALLS.get();
  var stream = FS.open(pathname, flags, mode);
  return stream.fd;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

var PIPEFS = {
 BUCKET_BUFFER_SIZE: 8192,
 mount: function(mount) {
  return FS.createNode(null, "/", 16384 | 511, 0);
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
  };
 },
 stream_ops: {
  poll: function(stream) {
   var pipe = stream.node.pipe;
   if ((stream.flags & 2097155) === 1) {
    return 256 | 4;
   } else {
    if (pipe.buckets.length > 0) {
     for (var i = 0; i < pipe.buckets.length; i++) {
      var bucket = pipe.buckets[i];
      if (bucket.offset - bucket.roffset > 0) {
       return 64 | 1;
      }
     }
    }
   }
   return 0;
  },
  ioctl: function(stream, request, varargs) {
   return ERRNO_CODES.EINVAL;
  },
  fsync: function(stream) {
   return ERRNO_CODES.EINVAL;
  },
  read: function(stream, buffer, offset, length, position) {
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
    toRemove--;
    pipe.buckets[toRemove].offset = 0;
    pipe.buckets[toRemove].roffset = 0;
   }
   pipe.buckets.splice(0, toRemove);
   return totalRead;
  },
  write: function(stream, buffer, offset, length, position) {
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
  },
  close: function(stream) {
   var pipe = stream.node.pipe;
   pipe.buckets = null;
  }
 },
 nextname: function() {
  if (!PIPEFS.nextname.current) {
   PIPEFS.nextname.current = 0;
  }
  return "pipe[" + PIPEFS.nextname.current++ + "]";
 }
};

function ___sys_pipe(fdPtr) {
 try {
  if (fdPtr == 0) {
   throw new FS.ErrnoError(21);
  }
  var res = PIPEFS.createPipe();
  _asan_js_store_4(fdPtr >> 2, res.readable_fd);
  _asan_js_store_4(fdPtr + 4 >> 2, res.writable_fd);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_pipe2(fds, flags) {
 return -52;
}

function ___sys_poll(fds, nfds, timeout) {
 try {
  var nonzero = 0;
  for (var i = 0; i < nfds; i++) {
   var pollfd = fds + 8 * i;
   var fd = _asan_js_load_4(pollfd >> 2);
   var events = _asan_js_load_2(pollfd + 4 >> 1);
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
   _asan_js_store_2(pollfd + 6 >> 1, mask);
  }
  return nonzero;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_prlimit64(pid, resource, new_limit, old_limit) {
 try {
  if (old_limit) {
   _asan_js_store_4(old_limit >> 2, -1);
   _asan_js_store_4(old_limit + 4 >> 2, -1);
   _asan_js_store_4(old_limit + 8 >> 2, -1);
   _asan_js_store_4(old_limit + 12 >> 2, -1);
  }
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_read(fd, buf, count) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return FS.read(stream, HEAP8, buf, count);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_readlink(path, buf, bufsize) {
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doReadlink(path, buf, bufsize);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_rename(old_path, new_path) {
 try {
  old_path = SYSCALLS.getStr(old_path);
  new_path = SYSCALLS.getStr(new_path);
  FS.rename(old_path, new_path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_rmdir(path) {
 try {
  path = SYSCALLS.getStr(path);
  FS.rmdir(path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_setrlimit(varargs) {
 return 0;
}

var SOCKFS = {
 mount: function(mount) {
  Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {};
  Module["websocket"]._callbacks = {};
  Module["websocket"]["on"] = function(event, callback) {
   if ("function" === typeof callback) {
    this._callbacks[event] = callback;
   }
   return this;
  };
  Module["websocket"].emit = function(event, param) {
   if ("function" === typeof this._callbacks[event]) {
    this._callbacks[event].call(this, param);
   }
  };
  return FS.createNode(null, "/", 16384 | 511, 0);
 },
 createSocket: function(family, type, protocol) {
  type &= ~526336;
  var streaming = type == 1;
  if (protocol) {
   assert(streaming == (protocol == 6));
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
  return sock;
 },
 getSocket: function(fd) {
  var stream = FS.getStream(fd);
  if (!stream || !FS.isSocket(stream.node.mode)) {
   return null;
  }
  return stream.node.sock;
 },
 stream_ops: {
  poll: function(stream) {
   var sock = stream.node.sock;
   return sock.sock_ops.poll(sock);
  },
  ioctl: function(stream, request, varargs) {
   var sock = stream.node.sock;
   return sock.sock_ops.ioctl(sock, request, varargs);
  },
  read: function(stream, buffer, offset, length, position) {
   var sock = stream.node.sock;
   var msg = sock.sock_ops.recvmsg(sock, length);
   if (!msg) {
    return 0;
   }
   buffer.set(msg.buffer, offset);
   return msg.buffer.length;
  },
  write: function(stream, buffer, offset, length, position) {
   var sock = stream.node.sock;
   return sock.sock_ops.sendmsg(sock, buffer, offset, length);
  },
  close: function(stream) {
   var sock = stream.node.sock;
   sock.sock_ops.close(sock);
  }
 },
 nextname: function() {
  if (!SOCKFS.nextname.current) {
   SOCKFS.nextname.current = 0;
  }
  return "socket[" + SOCKFS.nextname.current++ + "]";
 },
 websocket_sock_ops: {
  createPeer: function(sock, addr, port) {
   var ws;
   if (typeof addr === "object") {
    ws = addr;
    addr = null;
    port = null;
   }
   if (ws) {
    if (ws._socket) {
     addr = ws._socket.remoteAddress;
     port = ws._socket.remotePort;
    } else {
     var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
     if (!result) {
      throw new Error("WebSocket URL must be in the format ws(s)://address:port");
     }
     addr = result[1];
     port = parseInt(result[2], 10);
    }
   } else {
    try {
     var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
     var url = "ws:#".replace("#", "//");
     if (runtimeConfig) {
      if ("string" === typeof Module["websocket"]["url"]) {
       url = Module["websocket"]["url"];
      }
     }
     if (url === "ws://" || url === "wss://") {
      var parts = addr.split("/");
      url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
     }
     var subProtocols = "binary";
     if (runtimeConfig) {
      if ("string" === typeof Module["websocket"]["subprotocol"]) {
       subProtocols = Module["websocket"]["subprotocol"];
      }
     }
     var opts = undefined;
     if (subProtocols !== "null") {
      subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
      opts = ENVIRONMENT_IS_NODE ? {
       "protocol": subProtocols.toString()
      } : subProtocols;
     }
     if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
      subProtocols = "null";
      opts = undefined;
     }
     var WebSocketConstructor;
     if (ENVIRONMENT_IS_NODE) {
      WebSocketConstructor = require("ws");
     } else {
      WebSocketConstructor = WebSocket;
     }
     ws = new WebSocketConstructor(url, opts);
     ws.binaryType = "arraybuffer";
    } catch (e) {
     throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
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
    peer.dgram_send_queue.push(new Uint8Array([ 255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255 ]));
   }
   return peer;
  },
  getPeer: function(sock, addr, port) {
   return sock.peers[addr + ":" + port];
  },
  addPeer: function(sock, peer) {
   sock.peers[peer.addr + ":" + peer.port] = peer;
  },
  removePeer: function(sock, peer) {
   delete sock.peers[peer.addr + ":" + peer.port];
  },
  handlePeerEvents: function(sock, peer) {
   var first = true;
   var handleOpen = function() {
    Module["websocket"].emit("open", sock.stream.fd);
    try {
     var queued = peer.dgram_send_queue.shift();
     while (queued) {
      peer.socket.send(queued);
      queued = peer.dgram_send_queue.shift();
     }
    } catch (e) {
     peer.socket.close();
    }
   };
   function handleMessage(data) {
    if (typeof data === "string") {
     var encoder = new TextEncoder();
     data = encoder.encode(data);
    } else {
     assert(data.byteLength !== undefined);
     if (data.byteLength == 0) {
      return;
     } else {
      data = new Uint8Array(data);
     }
    }
    var wasfirst = first;
    first = false;
    if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
     var newport = data[8] << 8 | data[9];
     SOCKFS.websocket_sock_ops.removePeer(sock, peer);
     peer.port = newport;
     SOCKFS.websocket_sock_ops.addPeer(sock, peer);
     return;
    }
    sock.recv_queue.push({
     addr: peer.addr,
     port: peer.port,
     data: data
    });
    Module["websocket"].emit("message", sock.stream.fd);
   }
   if (ENVIRONMENT_IS_NODE) {
    peer.socket.on("open", handleOpen);
    peer.socket.on("message", function(data, flags) {
     if (!flags.binary) {
      return;
     }
     handleMessage(new Uint8Array(data).buffer);
    });
    peer.socket.on("close", function() {
     Module["websocket"].emit("close", sock.stream.fd);
    });
    peer.socket.on("error", function(error) {
     sock.error = ERRNO_CODES.ECONNREFUSED;
     Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
    });
   } else {
    peer.socket.onopen = handleOpen;
    peer.socket.onclose = function() {
     Module["websocket"].emit("close", sock.stream.fd);
    };
    peer.socket.onmessage = function peer_socket_onmessage(event) {
     handleMessage(event.data);
    };
    peer.socket.onerror = function(error) {
     sock.error = ERRNO_CODES.ECONNREFUSED;
     Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
    };
   }
  },
  poll: function(sock) {
   if (sock.type === 1 && sock.server) {
    return sock.pending.length ? 64 | 1 : 0;
   }
   var mask = 0;
   var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
   if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
    mask |= 64 | 1;
   }
   if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
    mask |= 4;
   }
   if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
    mask |= 16;
   }
   return mask;
  },
  ioctl: function(sock, request, arg) {
   switch (request) {
   case 21531:
    var bytes = 0;
    if (sock.recv_queue.length) {
     bytes = sock.recv_queue[0].data.length;
    }
    _asan_js_store_4(arg >> 2, bytes);
    return 0;

   default:
    return ERRNO_CODES.EINVAL;
   }
  },
  close: function(sock) {
   if (sock.server) {
    try {
     sock.server.close();
    } catch (e) {}
    sock.server = null;
   }
   var peers = Object.keys(sock.peers);
   for (var i = 0; i < peers.length; i++) {
    var peer = sock.peers[peers[i]];
    try {
     peer.socket.close();
    } catch (e) {}
    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
   }
   return 0;
  },
  bind: function(sock, addr, port) {
   if (typeof sock.saddr !== "undefined" || typeof sock.sport !== "undefined") {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   sock.saddr = addr;
   sock.sport = port;
   if (sock.type === 2) {
    if (sock.server) {
     sock.server.close();
     sock.server = null;
    }
    try {
     sock.sock_ops.listen(sock, 0);
    } catch (e) {
     if (!(e instanceof FS.ErrnoError)) throw e;
     if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
    }
   }
  },
  connect: function(sock, addr, port) {
   if (sock.server) {
    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
   }
   if (typeof sock.daddr !== "undefined" && typeof sock.dport !== "undefined") {
    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
    if (dest) {
     if (dest.socket.readyState === dest.socket.CONNECTING) {
      throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
     } else {
      throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
     }
    }
   }
   var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
   sock.daddr = peer.addr;
   sock.dport = peer.port;
   throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
  },
  listen: function(sock, backlog) {
   if (!ENVIRONMENT_IS_NODE) {
    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
   }
   if (sock.server) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
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
     Module["websocket"].emit("connection", newsock.stream.fd);
    } else {
     SOCKFS.websocket_sock_ops.createPeer(sock, ws);
     Module["websocket"].emit("connection", sock.stream.fd);
    }
   });
   sock.server.on("closed", function() {
    Module["websocket"].emit("close", sock.stream.fd);
    sock.server = null;
   });
   sock.server.on("error", function(error) {
    sock.error = ERRNO_CODES.EHOSTUNREACH;
    Module["websocket"].emit("error", [ sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable" ]);
   });
  },
  accept: function(listensock) {
   if (!listensock.server) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   var newsock = listensock.pending.shift();
   newsock.stream.flags = listensock.stream.flags;
   return newsock;
  },
  getname: function(sock, peer) {
   var addr, port;
   if (peer) {
    if (sock.daddr === undefined || sock.dport === undefined) {
     throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
    }
    addr = sock.daddr;
    port = sock.dport;
   } else {
    addr = sock.saddr || 0;
    port = sock.sport || 0;
   }
   return {
    addr: addr,
    port: port
   };
  },
  sendmsg: function(sock, buffer, offset, length, addr, port) {
   if (sock.type === 2) {
    if (addr === undefined || port === undefined) {
     addr = sock.daddr;
     port = sock.dport;
    }
    if (addr === undefined || port === undefined) {
     throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
    }
   } else {
    addr = sock.daddr;
    port = sock.dport;
   }
   var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
   if (sock.type === 1) {
    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
     throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
    } else if (dest.socket.readyState === dest.socket.CONNECTING) {
     throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
    }
   }
   if (ArrayBuffer.isView(buffer)) {
    offset += buffer.byteOffset;
    buffer = buffer.buffer;
   }
   var data;
   data = buffer.slice(offset, offset + length);
   if (sock.type === 2) {
    if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
     if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
      dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
     }
     dest.dgram_send_queue.push(data);
     return length;
    }
   }
   try {
    dest.socket.send(data);
    return length;
   } catch (e) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
  },
  recvmsg: function(sock, length) {
   if (sock.type === 1 && sock.server) {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
   }
   var queued = sock.recv_queue.shift();
   if (!queued) {
    if (sock.type === 1) {
     var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
     if (!dest) {
      throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
     } else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
      return null;
     } else {
      throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
     }
    } else {
     throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
    }
   }
   var queuedLength = queued.data.byteLength || queued.data.length;
   var queuedOffset = queued.data.byteOffset || 0;
   var queuedBuffer = queued.data.buffer || queued.data;
   var bytesRead = Math.min(length, queuedLength);
   var res = {
    buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
    addr: queued.addr,
    port: queued.port
   };
   if (sock.type === 1 && bytesRead < queuedLength) {
    var bytesRemaining = queuedLength - bytesRead;
    queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
    sock.recv_queue.unshift(queued);
   }
   return res;
  }
 }
};

function __inet_pton4_raw(str) {
 var b = str.split(".");
 for (var i = 0; i < 4; i++) {
  var tmp = Number(b[i]);
  if (isNaN(tmp)) return null;
  b[i] = tmp;
 }
 return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0;
}

function jstoi_q(str) {
 return parseInt(str);
}

function __inet_pton6_raw(str) {
 var words;
 var w, offset, z, i;
 var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
 var parts = [];
 if (!valid6regx.test(str)) {
  return null;
 }
 if (str === "::") {
  return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
 }
 if (str.indexOf("::") === 0) {
  str = str.replace("::", "Z:");
 } else {
  str = str.replace("::", ":Z:");
 }
 if (str.indexOf(".") > 0) {
  str = str.replace(new RegExp("[.]", "g"), ":");
  words = str.split(":");
  words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
  words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
  words = words.slice(0, words.length - 2);
 } else {
  words = str.split(":");
 }
 offset = 0;
 z = 0;
 for (w = 0; w < words.length; w++) {
  if (typeof words[w] === "string") {
   if (words[w] === "Z") {
    for (z = 0; z < 8 - words.length + 1; z++) {
     parts[w + z] = 0;
    }
    offset = z - 1;
   } else {
    parts[w + offset] = _htons(parseInt(words[w], 16));
   }
  } else {
   parts[w + offset] = words[w];
  }
 }
 return [ parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6] ];
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
   return name;
  }
  res = __inet_pton6_raw(name);
  if (res !== null) {
   return name;
  }
  var addr;
  if (DNS.address_map.addrs[name]) {
   addr = DNS.address_map.addrs[name];
  } else {
   var id = DNS.address_map.id++;
   assert(id < 65535, "exceeded max address mappings of 65535");
   addr = "172.29." + (id & 255) + "." + (id & 65280);
   DNS.address_map.names[addr] = name;
   DNS.address_map.addrs[name] = addr;
  }
  return addr;
 },
 lookup_addr: function(addr) {
  if (DNS.address_map.names[addr]) {
   return DNS.address_map.names[addr];
  }
  return null;
 }
};

var Sockets = {
 BUFFER_SIZE: 10240,
 MAX_BUFFER_SIZE: 10485760,
 nextFd: 1,
 fds: {},
 nextport: 1,
 maxport: 65535,
 peer: null,
 connections: {},
 portmap: {},
 localAddr: 4261412874,
 addrPool: [ 33554442, 50331658, 67108874, 83886090, 100663306, 117440522, 134217738, 150994954, 167772170, 184549386, 201326602, 218103818, 234881034 ]
};

function __inet_ntop4_raw(addr) {
 return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);
}

function __inet_ntop6_raw(ints) {
 var str = "";
 var word = 0;
 var longest = 0;
 var lastzero = 0;
 var zstart = 0;
 var len = 0;
 var i = 0;
 var parts = [ ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16 ];
 var hasipv4 = true;
 var v4part = "";
 for (i = 0; i < 5; i++) {
  if (parts[i] !== 0) {
   hasipv4 = false;
   break;
  }
 }
 if (hasipv4) {
  v4part = __inet_ntop4_raw(parts[6] | parts[7] << 16);
  if (parts[5] === -1) {
   str = "::ffff:";
   str += v4part;
   return str;
  }
  if (parts[5] === 0) {
   str = "::";
   if (v4part === "0.0.0.0") v4part = "";
   if (v4part === "0.0.0.1") v4part = "1";
   str += v4part;
   return str;
  }
 }
 for (word = 0; word < 8; word++) {
  if (parts[word] === 0) {
   if (word - lastzero > 1) {
    len = 0;
   }
   lastzero = word;
   len++;
  }
  if (len > longest) {
   longest = len;
   zstart = word - longest + 1;
  }
 }
 for (word = 0; word < 8; word++) {
  if (longest > 1) {
   if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
    if (word === zstart) {
     str += ":";
     if (zstart === 0) str += ":";
    }
    continue;
   }
  }
  str += Number(_ntohs(parts[word] & 65535)).toString(16);
  str += word < 7 ? ":" : "";
 }
 return str;
}

function __read_sockaddr(sa, salen) {
 var family = _asan_js_load_2(sa >> 1);
 var port = _ntohs(_asan_js_load_2u(sa + 2 >> 1));
 var addr;
 switch (family) {
 case 2:
  if (salen !== 16) {
   return {
    errno: 28
   };
  }
  addr = _asan_js_load_4(sa + 4 >> 2);
  addr = __inet_ntop4_raw(addr);
  break;

 case 10:
  if (salen !== 28) {
   return {
    errno: 28
   };
  }
  addr = [ _asan_js_load_4(sa + 8 >> 2), _asan_js_load_4(sa + 12 >> 2), _asan_js_load_4(sa + 16 >> 2), _asan_js_load_4(sa + 20 >> 2) ];
  addr = __inet_ntop6_raw(addr);
  break;

 default:
  return {
   errno: 5
  };
 }
 return {
  family: family,
  addr: addr,
  port: port
 };
}

function __write_sockaddr(sa, family, addr, port) {
 switch (family) {
 case 2:
  addr = __inet_pton4_raw(addr);
  _asan_js_store_2(sa >> 1, family);
  _asan_js_store_4(sa + 4 >> 2, addr);
  _asan_js_store_2(sa + 2 >> 1, _htons(port));
  break;

 case 10:
  addr = __inet_pton6_raw(addr);
  _asan_js_store_4(sa >> 2, family);
  _asan_js_store_4(sa + 8 >> 2, addr[0]);
  _asan_js_store_4(sa + 12 >> 2, addr[1]);
  _asan_js_store_4(sa + 16 >> 2, addr[2]);
  _asan_js_store_4(sa + 20 >> 2, addr[3]);
  _asan_js_store_2(sa + 2 >> 1, _htons(port));
  _asan_js_store_4(sa + 4 >> 2, 0);
  _asan_js_store_4(sa + 24 >> 2, 0);
  break;

 default:
  return {
   errno: 5
  };
 }
 return {};
}

function ___sys_socketcall(call, socketvararg) {
 try {
  SYSCALLS.varargs = socketvararg;
  var getSocketFromFD = function() {
   var socket = SOCKFS.getSocket(SYSCALLS.get());
   if (!socket) throw new FS.ErrnoError(8);
   return socket;
  };
  var getSocketAddress = function(allowNull) {
   var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
   if (allowNull && addrp === 0) return null;
   var info = __read_sockaddr(addrp, addrlen);
   if (info.errno) throw new FS.ErrnoError(info.errno);
   info.addr = DNS.lookup_addr(info.addr) || info.addr;
   return info;
  };
  switch (call) {
  case 1:
   {
    var domain = SYSCALLS.get(), type = SYSCALLS.get(), protocol = SYSCALLS.get();
    var sock = SOCKFS.createSocket(domain, type, protocol);
    assert(sock.stream.fd < 64);
    return sock.stream.fd;
   }

  case 2:
   {
    var sock = getSocketFromFD(), info = getSocketAddress();
    sock.sock_ops.bind(sock, info.addr, info.port);
    return 0;
   }

  case 3:
   {
    var sock = getSocketFromFD(), info = getSocketAddress();
    sock.sock_ops.connect(sock, info.addr, info.port);
    return 0;
   }

  case 4:
   {
    var sock = getSocketFromFD(), backlog = SYSCALLS.get();
    sock.sock_ops.listen(sock, backlog);
    return 0;
   }

  case 5:
   {
    var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
    var newsock = sock.sock_ops.accept(sock);
    if (addr) {
     var res = __write_sockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport);
     assert(!res.errno);
    }
    return newsock.stream.fd;
   }

  case 6:
   {
    var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
    var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport);
    assert(!res.errno);
    return 0;
   }

  case 7:
   {
    var sock = getSocketFromFD(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
    if (!sock.daddr) {
     return -53;
    }
    var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport);
    assert(!res.errno);
    return 0;
   }

  case 11:
   {
    var sock = getSocketFromFD(), message = SYSCALLS.get(), length = SYSCALLS.get(), flags = SYSCALLS.get(), dest = getSocketAddress(true);
    if (!dest) {
     return FS.write(sock.stream, HEAP8, message, length);
    } else {
     return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
    }
   }

  case 12:
   {
    var sock = getSocketFromFD(), buf = SYSCALLS.get(), len = SYSCALLS.get(), flags = SYSCALLS.get(), addr = SYSCALLS.get(), addrlen = SYSCALLS.get();
    var msg = sock.sock_ops.recvmsg(sock, len);
    if (!msg) return 0;
    if (addr) {
     var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port);
     assert(!res.errno);
    }
    HEAPU8.set(msg.buffer, buf);
    return msg.buffer.byteLength;
   }

  case 14:
   {
    return -50;
   }

  case 15:
   {
    var sock = getSocketFromFD(), level = SYSCALLS.get(), optname = SYSCALLS.get(), optval = SYSCALLS.get(), optlen = SYSCALLS.get();
    if (level === 1) {
     if (optname === 4) {
      _asan_js_store_4(optval >> 2, sock.error);
      _asan_js_store_4(optlen >> 2, 4);
      sock.error = null;
      return 0;
     }
    }
    return -50;
   }

  case 16:
   {
    var sock = getSocketFromFD(), message = SYSCALLS.get(), flags = SYSCALLS.get();
    var iov = _asan_js_load_4(message + 8 >> 2);
    var num = _asan_js_load_4(message + 12 >> 2);
    var addr, port;
    var name = _asan_js_load_4(message >> 2);
    var namelen = _asan_js_load_4(message + 4 >> 2);
    if (name) {
     var info = __read_sockaddr(name, namelen);
     if (info.errno) return -info.errno;
     port = info.port;
     addr = DNS.lookup_addr(info.addr) || info.addr;
    }
    var total = 0;
    for (var i = 0; i < num; i++) {
     total += _asan_js_load_4(iov + (8 * i + 4) >> 2);
    }
    var view = new Uint8Array(total);
    var offset = 0;
    for (var i = 0; i < num; i++) {
     var iovbase = _asan_js_load_4(iov + (8 * i + 0) >> 2);
     var iovlen = _asan_js_load_4(iov + (8 * i + 4) >> 2);
     for (var j = 0; j < iovlen; j++) {
      view[offset++] = _asan_js_load_1(iovbase + j >> 0);
     }
    }
    return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port);
   }

  case 17:
   {
    var sock = getSocketFromFD(), message = SYSCALLS.get(), flags = SYSCALLS.get();
    var iov = _asan_js_load_4(message + 8 >> 2);
    var num = _asan_js_load_4(message + 12 >> 2);
    var total = 0;
    for (var i = 0; i < num; i++) {
     total += _asan_js_load_4(iov + (8 * i + 4) >> 2);
    }
    var msg = sock.sock_ops.recvmsg(sock, total);
    if (!msg) return 0;
    var name = _asan_js_load_4(message >> 2);
    if (name) {
     var res = __write_sockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port);
     assert(!res.errno);
    }
    var bytesRead = 0;
    var bytesRemaining = msg.buffer.byteLength;
    for (var i = 0; bytesRemaining > 0 && i < num; i++) {
     var iovbase = _asan_js_load_4(iov + (8 * i + 0) >> 2);
     var iovlen = _asan_js_load_4(iov + (8 * i + 4) >> 2);
     if (!iovlen) {
      continue;
     }
     var length = Math.min(iovlen, bytesRemaining);
     var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
     HEAPU8.set(buf, iovbase + bytesRead);
     bytesRead += length;
     bytesRemaining -= length;
    }
    return bytesRead;
   }

  default:
   {
    return -52;
   }
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_stat64(path, buf) {
 try {
  path = SYSCALLS.getStr(path);
  return SYSCALLS.doStat(FS.stat, path, buf);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_ugetrlimit(resource, rlim) {
 try {
  _asan_js_store_4(rlim >> 2, -1);
  _asan_js_store_4(rlim + 4 >> 2, -1);
  _asan_js_store_4(rlim + 8 >> 2, -1);
  _asan_js_store_4(rlim + 12 >> 2, -1);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_uname(buf) {
 try {
  if (!buf) return -21;
  var layout = {
   "__size__": 390,
   "sysname": 0,
   "nodename": 65,
   "release": 130,
   "version": 195,
   "machine": 260,
   "domainname": 325
  };
  var copyString = function(element, value) {
   var offset = layout[element];
   writeAsciiToMemory(value, buf + offset);
  };
  copyString("sysname", "Emscripten");
  copyString("nodename", "emscripten");
  copyString("release", "1.0");
  copyString("version", "#1");
  copyString("machine", "x86-JS");
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_unlink(path) {
 try {
  path = SYSCALLS.getStr(path);
  FS.unlink(path);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_utimensat(dirfd, path, times, flags) {
 try {
  path = SYSCALLS.getStr(path);
  assert(flags === 0);
  path = SYSCALLS.calculateAt(dirfd, path);
  var seconds = _asan_js_load_4(times >> 2);
  var nanoseconds = _asan_js_load_4(times + 4 >> 2);
  var atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
  times += 8;
  seconds = _asan_js_load_4(times >> 2);
  nanoseconds = _asan_js_load_4(times + 4 >> 2);
  var mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
  FS.utime(path, atime, mtime);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function ___sys_write(fd, buf, count) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  return FS.write(stream, HEAP8, buf, count);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}

function _abort() {
 abort();
}

var _emscripten_get_now;

if (ENVIRONMENT_IS_NODE) {
 _emscripten_get_now = function() {
  var t = process["hrtime"]();
  return t[0] * 1e3 + t[1] / 1e6;
 };
} else if (typeof dateNow !== "undefined") {
 _emscripten_get_now = dateNow;
} else _emscripten_get_now = function() {
 return performance.now();
};

var _emscripten_get_now_is_monotonic = true;

function _clock_gettime(clk_id, tp) {
 var now;
 if (clk_id === 0) {
  now = Date.now();
 } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
  now = _emscripten_get_now();
 } else {
  setErrNo(28);
  return -1;
 }
 _asan_js_store_4(tp >> 2, now / 1e3 | 0);
 _asan_js_store_4(tp + 4 >> 2, now % 1e3 * 1e3 * 1e3 | 0);
 return 0;
}

var DOTNET = {
 _dotnet_get_global: function() {
  function testGlobal(obj) {
   obj["___dotnet_global___"] = obj;
   var success = typeof ___dotnet_global___ === "object" && obj["___dotnet_global___"] === obj;
   if (!success) {
    delete obj["___dotnet_global___"];
   }
   return success;
  }
  if (typeof ___dotnet_global___ === "object") {
   return ___dotnet_global___;
  }
  if (typeof global === "object" && testGlobal(global)) {
   ___dotnet_global___ = global;
  } else if (typeof window === "object" && testGlobal(window)) {
   ___dotnet_global___ = window;
  }
  if (typeof ___dotnet_global___ === "object") {
   return ___dotnet_global___;
  }
  throw Error("unable to get DotNet global object.");
 },
 conv_string: function(mono_obj) {
  if (mono_obj == 0) return null;
  if (!this.mono_string_get_utf8) this.mono_string_get_utf8 = Module.cwrap("mono_wasm_string_get_utf8", "number", [ "number" ]);
  var raw = this.mono_string_get_utf8(mono_obj);
  var res = Module.UTF8ToString(raw);
  Module._free(raw);
  return res;
 }
};

function _corert_wasm_invoke_js(js, length, exception) {
 var mono_string = DOTNET._dotnet_get_global()._mono_string_cached || (DOTNET._dotnet_get_global()._mono_string_cached = Module.cwrap("mono_wasm_string_from_js", "number", [ "string" ]));
 alert("wasm invoke");
 var jsFuncName = UTF8ToString(js, length);
 alert(jsFuncName);
 var res = eval(jsFuncName);
 exception = 0;
 return "" + res;
}

function _corert_wasm_invoke_js_unmarshalled(js, length, arg0, arg1, arg2, exception) {
 alert("wasm invoke unmarshalled");
 var jsFuncName = UTF8ToString(js, length);
 alert(jsFuncName);
 var dotNetExports = DOTNET._dotnet_get_global().DotNet;
 if (!dotNetExports) {
  throw new Error("The Microsoft.JSInterop.js library is not loaded.");
 }
 var funcInstance = dotNetExports.jsCallDispatcher.findJSFunction(jsFuncName);
 return funcInstance.call(null, arg0, arg1, arg2);
}

function _deflate() {
 err("missing function: deflate");
 abort(-1);
}

function _deflateEnd() {
 err("missing function: deflateEnd");
 abort(-1);
}

function _deflateInit2_() {
 err("missing function: deflateInit2_");
 abort(-1);
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

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
 var args = readAsmConstArgs(sigPtr, argbuf);
 return ASM_CONSTS[code].apply(null, args);
}

function withBuiltinMalloc(func) {
 var prev_malloc = typeof _malloc !== "undefined" ? _malloc : undefined;
 var prev_memalign = typeof _memalign !== "undefined" ? _memalign : undefined;
 var prev_free = typeof _free !== "undefined" ? _free : undefined;
 _malloc = _emscripten_builtin_malloc;
 _memalign = _emscripten_builtin_memalign;
 _free = _emscripten_builtin_free;
 var prev_memset = typeof _memset !== "undefined" ? _memset : undefined;
 _memset = _emscripten_builtin_memset;
 try {
  return func();
 } finally {
  _malloc = prev_malloc;
  _memalign = prev_memalign;
  _free = prev_free;
  _memset = prev_memset;
 }
}

function _emscripten_builtin_mmap2(addr, len, prot, flags, fd, off) {
 return withBuiltinMalloc(function() {
  return syscallMmap2(addr, len, prot, flags, fd, off);
 });
}

function _emscripten_builtin_munmap(addr, len) {
 return withBuiltinMalloc(function() {
  return syscallMunmap(addr, len);
 });
}

function _emscripten_builtin_pthread_create() {
 return 6;
}

function traverseStack(args) {
 if (!args || !args.callee || !args.callee.name) {
  return [ null, "", "" ];
 }
 var funstr = args.callee.toString();
 var funcname = args.callee.name;
 var str = "(";
 var first = true;
 for (var i in args) {
  var a = args[i];
  if (!first) {
   str += ", ";
  }
  first = false;
  if (typeof a === "number" || typeof a === "string") {
   str += a;
  } else {
   str += "(" + typeof a + ")";
  }
 }
 str += ")";
 var caller = args.callee.caller;
 args = caller ? caller.arguments : [];
 if (first) str = "";
 return [ args, funcname, str ];
}

function _emscripten_get_callstack_js(flags) {
 var callstack = jsStackTrace();
 var iThisFunc = callstack.lastIndexOf("_emscripten_log");
 var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
 var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
 callstack = callstack.slice(iNextLine);
 if (flags & 8 && typeof emscripten_source_map === "undefined") {
  warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
  flags ^= 8;
  flags |= 16;
 }
 var stack_args = null;
 if (flags & 128) {
  stack_args = traverseStack(arguments);
  while (stack_args[1].indexOf("_emscripten_") >= 0) stack_args = traverseStack(stack_args[0]);
 }
 var lines = callstack.split("\n");
 callstack = "";
 var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
 var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
 var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
 for (var l in lines) {
  var line = lines[l];
  var jsSymbolName = "";
  var file = "";
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
    column = parts[4] | 0;
   } else {
    callstack += line + "\n";
    continue;
   }
  }
  var cSymbolName = flags & 32 ? demangle(jsSymbolName) : jsSymbolName;
  if (!cSymbolName) {
   cSymbolName = jsSymbolName;
  }
  var haveSourceMap = false;
  if (flags & 8) {
   var orig = emscripten_source_map.originalPositionFor({
    line: lineno,
    column: column
   });
   haveSourceMap = orig && orig.source;
   if (haveSourceMap) {
    if (flags & 64) {
     orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1);
    }
    callstack += "    at " + cSymbolName + " (" + orig.source + ":" + orig.line + ":" + orig.column + ")\n";
   }
  }
  if (flags & 16 || !haveSourceMap) {
   if (flags & 64) {
    file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
   }
   callstack += (haveSourceMap ? "     = " + jsSymbolName : "    at " + cSymbolName) + " (" + file + ":" + lineno + ":" + column + ")\n";
  }
  if (flags & 128 && stack_args[0]) {
   if (stack_args[1] == jsSymbolName && stack_args[2].length > 0) {
    callstack = callstack.replace(/\s+$/, "");
    callstack += " with values: " + stack_args[1] + stack_args[2] + "\n";
   }
   stack_args = traverseStack(stack_args[0]);
  }
 }
 callstack = callstack.replace(/\s+$/, "");
 return callstack;
}

function _emscripten_get_callstack(flags, str, maxbytes) {
 var callstack = _emscripten_get_callstack_js(flags);
 if (!str || maxbytes <= 0) {
  return lengthBytesUTF8(callstack) + 1;
 }
 var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes);
 return bytesWrittenExcludingNull + 1;
}

function _emscripten_get_heap_size() {
 return HEAPU8.length;
}

function _emscripten_get_module_name(buf, length) {
 return stringToUTF8(wasmBinaryFile, buf, length);
}

function _emscripten_memcpy_big(dest, src, num) {
 HEAPU8.copyWithin(dest, src, src + num);
}

var UNWIND_CACHE = {};

function _emscripten_generate_pc(frame) {
 var match;
 if (match = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(frame)) {
  return +match[1];
 } else if (match = /\bwasm-function\[(\d+)\]:(\d+)/.exec(frame)) {
  return wasmOffsetConverter.convert(+match[1], +match[2]);
 } else if (match = /:(\d+):\d+(?:\)|$)/.exec(frame)) {
  return 2147483648 | +match[1];
 } else {
  return 0;
 }
}

function _emscripten_pc_get_source_js(pc) {
 if (UNWIND_CACHE.last_get_source_pc == pc) return UNWIND_CACHE.last_source;
 var match;
 var source;
 if (!source) {
  var frame = UNWIND_CACHE[pc];
  if (!frame) return null;
  if (match = /\((.*):(\d+):(\d+)\)$/.exec(frame)) {
   source = {
    file: match[1],
    line: match[2],
    column: match[3]
   };
  } else if (match = /@(.*):(\d+):(\d+)/.exec(frame)) {
   source = {
    file: match[1],
    line: match[2],
    column: match[3]
   };
  }
 }
 UNWIND_CACHE.last_get_source_pc = pc;
 UNWIND_CACHE.last_source = source;
 return source;
}

function _emscripten_pc_get_column(pc) {
 var result = _emscripten_pc_get_source_js(pc);
 return result ? result.column || 0 : 0;
}

function _emscripten_pc_get_file(pc) {
 var result = _emscripten_pc_get_source_js(pc);
 if (!result) return 0;
 withBuiltinMalloc(function() {
  if (_emscripten_pc_get_file.ret) _free(_emscripten_pc_get_file.ret);
  _emscripten_pc_get_file.ret = allocateUTF8(result.file);
 });
 return _emscripten_pc_get_file.ret;
}

function _emscripten_pc_get_function(pc) {
 var name;
 if (pc & 2147483648) {
  var frame = UNWIND_CACHE[pc];
  if (!frame) return 0;
  var match;
  if (match = /^\s+at (.*) \(.*\)$/.exec(frame)) {
   name = match[1];
  } else if (match = /^(.+?)@/.exec(frame)) {
   name = match[1];
  } else {
   return 0;
  }
 } else {
  name = wasmOffsetConverter.getName(pc);
 }
 withBuiltinMalloc(function() {
  if (_emscripten_pc_get_function.ret) _free(_emscripten_pc_get_function.ret);
  _emscripten_pc_get_function.ret = allocateUTF8(name);
 });
 return _emscripten_pc_get_function.ret;
}

function _emscripten_pc_get_line(pc) {
 var result = _emscripten_pc_get_source_js(pc);
 return result ? result.line : 0;
}

function _emscripten_resize_heap(requestedSize) {
 requestedSize = requestedSize >>> 0;
 return false;
}

function _emscripten_return_address(level) {
 var callstack = new Error().stack.split("\n");
 if (callstack[0] == "Error") {
  callstack.shift();
 }
 return _emscripten_generate_pc(callstack[level + 2]);
}

function __emscripten_save_in_unwind_cache(callstack) {
 callstack.forEach(function(frame) {
  var pc = _emscripten_generate_pc(frame);
  if (pc) {
   UNWIND_CACHE[pc] = frame;
  }
 });
}

function _emscripten_stack_snapshot() {
 var callstack = new Error().stack.split("\n");
 if (callstack[0] == "Error") {
  callstack.shift();
 }
 __emscripten_save_in_unwind_cache(callstack);
 UNWIND_CACHE.last_addr = _emscripten_generate_pc(callstack[2]);
 UNWIND_CACHE.last_stack = callstack;
 return UNWIND_CACHE.last_addr;
}

function _emscripten_stack_unwind_buffer(addr, buffer, count) {
 var stack;
 if (UNWIND_CACHE.last_addr == addr) {
  stack = UNWIND_CACHE.last_stack;
 } else {
  stack = new Error().stack.split("\n");
  if (stack[0] == "Error") {
   stack.shift();
  }
  __emscripten_save_in_unwind_cache(stack);
 }
 var offset = 2;
 while (stack[offset] && _emscripten_generate_pc(stack[offset]) != addr) {
  ++offset;
 }
 for (var i = 0; i < count && stack[i + offset]; ++i) {
  _asan_js_store_4(buffer + i * 4 >> 2, _emscripten_generate_pc(stack[i + offset]));
 }
 return i;
}

var ENV = {};

function getExecutableName() {
 return thisProgram || "./this.program";
}

function getEnvStrings() {
 if (!getEnvStrings.strings) {
  var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
  var env = {
   "USER": "web_user",
   "LOGNAME": "web_user",
   "PATH": "/",
   "PWD": "/",
   "HOME": "/home/web_user",
   "LANG": lang,
   "_": getExecutableName()
  };
  for (var x in ENV) {
   env[x] = ENV[x];
  }
  var strings = [];
  for (var x in env) {
   strings.push(x + "=" + env[x]);
  }
  getEnvStrings.strings = strings;
 }
 return getEnvStrings.strings;
}

function _environ_get(__environ, environ_buf) {
 var bufSize = 0;
 getEnvStrings().forEach(function(string, i) {
  var ptr = environ_buf + bufSize;
  _asan_js_store_4(__environ + i * 4 >> 2, ptr);
  writeAsciiToMemory(string, ptr);
  bufSize += string.length + 1;
 });
 return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
 var strings = getEnvStrings();
 _asan_js_store_4(penviron_count >> 2, strings.length);
 var bufSize = 0;
 strings.forEach(function(string) {
  bufSize += string.length + 1;
 });
 _asan_js_store_4(penviron_buf_size >> 2, bufSize);
 return 0;
}

function _exit(status) {
 exit(status);
}

function _fd_close(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  FS.close(stream);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_fdstat_get(fd, pbuf) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
  _asan_js_store_1(pbuf >> 0, type);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_read(fd, iov, iovcnt, pnum) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = SYSCALLS.doReadv(stream, iov, iovcnt);
  _asan_js_store_4(pnum >> 2, num);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var HIGH_OFFSET = 4294967296;
  var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  var DOUBLE_LIMIT = 9007199254740992;
  if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
   return -61;
  }
  FS.llseek(stream, offset, whence);
  tempI64 = [ stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0) ], 
  _asan_js_store_4(newOffset >> 2, tempI64[0]), _asan_js_store_4(newOffset + 4 >> 2, tempI64[1]);
  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_sync(fd) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  if (stream.stream_ops && stream.stream_ops.fsync) {
   return -stream.stream_ops.fsync(stream);
  }
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _fd_write(fd, iov, iovcnt, pnum) {
 try {
  var stream = SYSCALLS.getStreamFromFD(fd);
  var num = SYSCALLS.doWritev(stream, iov, iovcnt);
  _asan_js_store_4(pnum >> 2, num);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return e.errno;
 }
}

function _flock(fd, operation) {
 return 0;
}

var GAI_ERRNO_MESSAGES = {};

function _gai_strerror(val) {
 var buflen = 256;
 if (!_gai_strerror.buffer) {
  _gai_strerror.buffer = _malloc(buflen);
  GAI_ERRNO_MESSAGES["0"] = "Success";
  GAI_ERRNO_MESSAGES["" + -1] = "Invalid value for 'ai_flags' field";
  GAI_ERRNO_MESSAGES["" + -2] = "NAME or SERVICE is unknown";
  GAI_ERRNO_MESSAGES["" + -3] = "Temporary failure in name resolution";
  GAI_ERRNO_MESSAGES["" + -4] = "Non-recoverable failure in name res";
  GAI_ERRNO_MESSAGES["" + -6] = "'ai_family' not supported";
  GAI_ERRNO_MESSAGES["" + -7] = "'ai_socktype' not supported";
  GAI_ERRNO_MESSAGES["" + -8] = "SERVICE not supported for 'ai_socktype'";
  GAI_ERRNO_MESSAGES["" + -10] = "Memory allocation failure";
  GAI_ERRNO_MESSAGES["" + -11] = "System error returned in 'errno'";
  GAI_ERRNO_MESSAGES["" + -12] = "Argument buffer overflow";
 }
 var msg = "Unknown error";
 if (val in GAI_ERRNO_MESSAGES) {
  if (GAI_ERRNO_MESSAGES[val].length > buflen - 1) {
   msg = "Message too long";
  } else {
   msg = GAI_ERRNO_MESSAGES[val];
  }
 }
 writeAsciiToMemory(msg, _gai_strerror.buffer);
 return _gai_strerror.buffer;
}

function _getTempRet0() {
 return getTempRet0() | 0;
}

function _getaddrinfo(node, service, hint, out) {
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
  salen = family === 10 ? 28 : 16;
  addr = family === 10 ? __inet_ntop6_raw(addr) : __inet_ntop4_raw(addr);
  sa = _malloc(salen);
  res = __write_sockaddr(sa, family, addr, port);
  assert(!res.errno);
  ai = _malloc(32);
  _asan_js_store_4(ai + 4 >> 2, family);
  _asan_js_store_4(ai + 8 >> 2, type);
  _asan_js_store_4(ai + 12 >> 2, proto);
  _asan_js_store_4(ai + 24 >> 2, canon);
  _asan_js_store_4(ai + 20 >> 2, sa);
  if (family === 10) {
   _asan_js_store_4(ai + 16 >> 2, 28);
  } else {
   _asan_js_store_4(ai + 16 >> 2, 16);
  }
  _asan_js_store_4(ai + 28 >> 2, 0);
  return ai;
 }
 if (hint) {
  flags = _asan_js_load_4(hint >> 2);
  family = _asan_js_load_4(hint + 4 >> 2);
  type = _asan_js_load_4(hint + 8 >> 2);
  proto = _asan_js_load_4(hint + 12 >> 2);
 }
 if (type && !proto) {
  proto = type === 2 ? 17 : 6;
 }
 if (!type && proto) {
  type = proto === 17 ? 2 : 1;
 }
 if (proto === 0) {
  proto = 6;
 }
 if (type === 0) {
  type = 1;
 }
 if (!node && !service) {
  return -2;
 }
 if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
  return -1;
 }
 if (hint !== 0 && _asan_js_load_4(hint >> 2) & 2 && !node) {
  return -1;
 }
 if (flags & 32) {
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
    addr = [ 0, 0, 0, 1 ];
   }
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  _asan_js_store_4(out >> 2, ai);
  return 0;
 }
 node = UTF8ToString(node);
 addr = __inet_pton4_raw(node);
 if (addr !== null) {
  if (family === 0 || family === 2) {
   family = 2;
  } else if (family === 10 && flags & 8) {
   addr = [ 0, 0, _htonl(65535), addr ];
   family = 10;
  } else {
   return -2;
  }
 } else {
  addr = __inet_pton6_raw(node);
  if (addr !== null) {
   if (family === 0 || family === 10) {
    family = 10;
   } else {
    return -2;
   }
  }
 }
 if (addr != null) {
  ai = allocaddrinfo(family, type, proto, node, addr, port);
  _asan_js_store_4(out >> 2, ai);
  return 0;
 }
 if (flags & 4) {
  return -2;
 }
 node = DNS.lookup_name(node);
 addr = __inet_pton4_raw(node);
 if (family === 0) {
  family = 2;
 } else if (family === 10) {
  addr = [ 0, 0, _htonl(65535), addr ];
 }
 ai = allocaddrinfo(family, type, proto, null, addr, port);
 _asan_js_store_4(out >> 2, ai);
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
  if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
   if (flags & 8) {
    return -2;
   }
  } else {
   addr = lookup;
  }
  var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
  if (numBytesWrittenExclNull + 1 >= nodelen) {
   overflowed = true;
  }
 }
 if (serv && servlen) {
  port = "" + port;
  var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
  if (numBytesWrittenExclNull + 1 >= servlen) {
   overflowed = true;
  }
 }
 if (overflowed) {
  return -12;
 }
 return 0;
}

function _getpwuid_r() {
 throw "getpwuid_r: TODO";
}

function _gettimeofday(ptr) {
 var now = Date.now();
 _asan_js_store_4(ptr >> 2, now / 1e3 | 0);
 _asan_js_store_4(ptr + 4 >> 2, now % 1e3 * 1e3 | 0);
 return 0;
}

function _gmtime_r(time, tmPtr) {
 var date = new Date(_asan_js_load_4(time >> 2) * 1e3);
 _asan_js_store_4(tmPtr >> 2, date.getUTCSeconds());
 _asan_js_store_4(tmPtr + 4 >> 2, date.getUTCMinutes());
 _asan_js_store_4(tmPtr + 8 >> 2, date.getUTCHours());
 _asan_js_store_4(tmPtr + 12 >> 2, date.getUTCDate());
 _asan_js_store_4(tmPtr + 16 >> 2, date.getUTCMonth());
 _asan_js_store_4(tmPtr + 20 >> 2, date.getUTCFullYear() - 1900);
 _asan_js_store_4(tmPtr + 24 >> 2, date.getUTCDay());
 _asan_js_store_4(tmPtr + 36 >> 2, 0);
 _asan_js_store_4(tmPtr + 32 >> 2, 0);
 var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
 var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
 _asan_js_store_4(tmPtr + 28 >> 2, yday);
 if (!_gmtime_r.GMTString) _gmtime_r.GMTString = allocateUTF8("GMT");
 _asan_js_store_4(tmPtr + 40 >> 2, _gmtime_r.GMTString);
 return tmPtr;
}

function _inflate() {
 err("missing function: inflate");
 abort(-1);
}

function _inflateEnd() {
 err("missing function: inflateEnd");
 abort(-1);
}

function _inflateInit2_() {
 err("missing function: inflateInit2_");
 abort(-1);
}

function _tzset() {
 if (_tzset.called) return;
 _tzset.called = true;
 _asan_js_store_4(__get_timezone() >> 2, new Date().getTimezoneOffset() * 60);
 var currentYear = new Date().getFullYear();
 var winter = new Date(currentYear, 0, 1);
 var summer = new Date(currentYear, 6, 1);
 _asan_js_store_4(__get_daylight() >> 2, Number(winter.getTimezoneOffset() != summer.getTimezoneOffset()));
 function extractZone(date) {
  var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
  return match ? match[1] : "GMT";
 }
 var winterName = extractZone(winter);
 var summerName = extractZone(summer);
 var winterNamePtr = allocateUTF8(winterName);
 var summerNamePtr = allocateUTF8(summerName);
 if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
  _asan_js_store_4(__get_tzname() >> 2, winterNamePtr);
  _asan_js_store_4(__get_tzname() + 4 >> 2, summerNamePtr);
 } else {
  _asan_js_store_4(__get_tzname() >> 2, summerNamePtr);
  _asan_js_store_4(__get_tzname() + 4 >> 2, winterNamePtr);
 }
}

function _mktime(tmPtr) {
 _tzset();
 var date = new Date(_asan_js_load_4(tmPtr + 20 >> 2) + 1900, _asan_js_load_4(tmPtr + 16 >> 2), _asan_js_load_4(tmPtr + 12 >> 2), _asan_js_load_4(tmPtr + 8 >> 2), _asan_js_load_4(tmPtr + 4 >> 2), _asan_js_load_4(tmPtr >> 2), 0);
 var dst = _asan_js_load_4(tmPtr + 32 >> 2);
 var guessedOffset = date.getTimezoneOffset();
 var start = new Date(date.getFullYear(), 0, 1);
 var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
 var winterOffset = start.getTimezoneOffset();
 var dstOffset = Math.min(winterOffset, summerOffset);
 if (dst < 0) {
  _asan_js_store_4(tmPtr + 32 >> 2, Number(summerOffset != winterOffset && dstOffset == guessedOffset));
 } else if (dst > 0 != (dstOffset == guessedOffset)) {
  var nonDstOffset = Math.max(winterOffset, summerOffset);
  var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
  date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
 }
 _asan_js_store_4(tmPtr + 24 >> 2, date.getDay());
 var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
 _asan_js_store_4(tmPtr + 28 >> 2, yday);
 return date.getTime() / 1e3 | 0;
}

function _usleep(useconds) {
 var start = _emscripten_get_now();
 while (_emscripten_get_now() - start < useconds / 1e3) {}
}

function _nanosleep(rqtp, rmtp) {
 if (rqtp === 0) {
  setErrNo(28);
  return -1;
 }
 var seconds = _asan_js_load_4(rqtp >> 2);
 var nanoseconds = _asan_js_load_4(rqtp + 4 >> 2);
 if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
  setErrNo(28);
  return -1;
 }
 if (rmtp !== 0) {
  _asan_js_store_4(rmtp >> 2, 0);
  _asan_js_store_4(rmtp + 4 >> 2, 0);
 }
 return _usleep(seconds * 1e6 + nanoseconds / 1e3);
}

function _pthread_attr_destroy(attr) {
 return 0;
}

function _pthread_attr_getdetachstate(attr, detachstate) {
 return 0;
}

function _pthread_attr_getstack(attr, stackaddr, stacksize) {
 _asan_js_store_4(stackaddr >> 2, STACK_BASE);
 _asan_js_store_4(stacksize >> 2, TOTAL_STACK);
 return 0;
}

function _pthread_attr_init(attr) {
 return 0;
}

function _pthread_attr_setdetachstate() {}

function _pthread_attr_setstacksize() {}

function _pthread_condattr_destroy() {
 return 0;
}

function _pthread_condattr_init() {
 return 0;
}

function _pthread_condattr_setclock() {
 return 0;
}

function _pthread_getattr_np(thread, attr) {
 return 0;
}

function _pthread_rwlock_destroy() {
 return 0;
}

function _pthread_rwlock_init() {
 return 0;
}

function _pthread_rwlock_rdlock() {
 return 0;
}

function _pthread_rwlock_unlock() {
 return 0;
}

function _pthread_rwlock_wrlock() {
 return 0;
}

function _pthread_setcancelstate() {
 return 0;
}

function _setTempRet0($i) {
 setTempRet0($i | 0);
}

function _sigaction(signum, act, oldact) {
 err("Calling stub instead of sigaction()");
 return 0;
}

var __sigalrm_handler = 0;

function _signal(sig, func) {
 if (sig == 14) {
  __sigalrm_handler = func;
 } else {
  err("Calling stub instead of signal()");
 }
 return 0;
}

function __isLeapYear(year) {
 return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function __arraySum(array, index) {
 var sum = 0;
 for (var i = 0; i <= index; sum += array[i++]) {}
 return sum;
}

var __MONTH_DAYS_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var __MONTH_DAYS_REGULAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

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
    newDate.setMonth(currentMonth + 1);
   } else {
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() + 1);
   }
  } else {
   newDate.setDate(newDate.getDate() + days);
   return newDate;
  }
 }
 return newDate;
}

function _strftime(s, maxsize, format, tm) {
 var tm_zone = _asan_js_load_4(tm + 40 >> 2);
 var date = {
  tm_sec: _asan_js_load_4(tm >> 2),
  tm_min: _asan_js_load_4(tm + 4 >> 2),
  tm_hour: _asan_js_load_4(tm + 8 >> 2),
  tm_mday: _asan_js_load_4(tm + 12 >> 2),
  tm_mon: _asan_js_load_4(tm + 16 >> 2),
  tm_year: _asan_js_load_4(tm + 20 >> 2),
  tm_wday: _asan_js_load_4(tm + 24 >> 2),
  tm_yday: _asan_js_load_4(tm + 28 >> 2),
  tm_isdst: _asan_js_load_4(tm + 32 >> 2),
  tm_gmtoff: _asan_js_load_4(tm + 36 >> 2),
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
  "%X": "%H:%M:%S",
  "%Ec": "%c",
  "%EC": "%C",
  "%Ex": "%m/%d/%y",
  "%EX": "%H:%M:%S",
  "%Ey": "%y",
  "%EY": "%Y",
  "%Od": "%d",
  "%Oe": "%e",
  "%OH": "%H",
  "%OI": "%I",
  "%Om": "%m",
  "%OM": "%M",
  "%OS": "%S",
  "%Ou": "%u",
  "%OU": "%U",
  "%OV": "%V",
  "%Ow": "%w",
  "%OW": "%W",
  "%Oy": "%y"
 };
 for (var rule in EXPANSION_RULES_1) {
  pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
 }
 var WEEKDAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
 var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
 function leadingSomething(value, digits, character) {
  var str = typeof value === "number" ? value.toString() : value || "";
  while (str.length < digits) {
   str = character[0] + str;
  }
  return str;
 }
 function leadingNulls(value, digits) {
  return leadingSomething(value, digits, "0");
 }
 function compareByDay(date1, date2) {
  function sgn(value) {
   return value < 0 ? -1 : value > 0 ? 1 : 0;
  }
  var compare;
  if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
   if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
    compare = sgn(date1.getDate() - date2.getDate());
   }
  }
  return compare;
 }
 function getFirstWeekStartDate(janFourth) {
  switch (janFourth.getDay()) {
  case 0:
   return new Date(janFourth.getFullYear() - 1, 11, 29);

  case 1:
   return janFourth;

  case 2:
   return new Date(janFourth.getFullYear(), 0, 3);

  case 3:
   return new Date(janFourth.getFullYear(), 0, 2);

  case 4:
   return new Date(janFourth.getFullYear(), 0, 1);

  case 5:
   return new Date(janFourth.getFullYear() - 1, 11, 31);

  case 6:
   return new Date(janFourth.getFullYear() - 1, 11, 30);
  }
 }
 function getWeekBasedYear(date) {
  var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
  var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
  var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
  var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
  var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
   if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
    return thisDate.getFullYear() + 1;
   } else {
    return thisDate.getFullYear();
   }
  } else {
   return thisDate.getFullYear() - 1;
  }
 }
 var EXPANSION_RULES_2 = {
  "%a": function(date) {
   return WEEKDAYS[date.tm_wday].substring(0, 3);
  },
  "%A": function(date) {
   return WEEKDAYS[date.tm_wday];
  },
  "%b": function(date) {
   return MONTHS[date.tm_mon].substring(0, 3);
  },
  "%B": function(date) {
   return MONTHS[date.tm_mon];
  },
  "%C": function(date) {
   var year = date.tm_year + 1900;
   return leadingNulls(year / 100 | 0, 2);
  },
  "%d": function(date) {
   return leadingNulls(date.tm_mday, 2);
  },
  "%e": function(date) {
   return leadingSomething(date.tm_mday, 2, " ");
  },
  "%g": function(date) {
   return getWeekBasedYear(date).toString().substring(2);
  },
  "%G": function(date) {
   return getWeekBasedYear(date);
  },
  "%H": function(date) {
   return leadingNulls(date.tm_hour, 2);
  },
  "%I": function(date) {
   var twelveHour = date.tm_hour;
   if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
   return leadingNulls(twelveHour, 2);
  },
  "%j": function(date) {
   return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
  },
  "%m": function(date) {
   return leadingNulls(date.tm_mon + 1, 2);
  },
  "%M": function(date) {
   return leadingNulls(date.tm_min, 2);
  },
  "%n": function() {
   return "\n";
  },
  "%p": function(date) {
   if (date.tm_hour >= 0 && date.tm_hour < 12) {
    return "AM";
   } else {
    return "PM";
   }
  },
  "%S": function(date) {
   return leadingNulls(date.tm_sec, 2);
  },
  "%t": function() {
   return "\t";
  },
  "%u": function(date) {
   return date.tm_wday || 7;
  },
  "%U": function(date) {
   var janFirst = new Date(date.tm_year + 1900, 0, 1);
   var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstSunday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
    var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
  },
  "%V": function(date) {
   var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
   var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
   var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
   var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
   var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
   if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
    return "53";
   }
   if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
    return "01";
   }
   var daysDifference;
   if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
    daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
   } else {
    daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
   }
   return leadingNulls(Math.ceil(daysDifference / 7), 2);
  },
  "%w": function(date) {
   return date.tm_wday;
  },
  "%W": function(date) {
   var janFirst = new Date(date.tm_year, 0, 1);
   var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
   var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
   if (compareByDay(firstMonday, endDate) < 0) {
    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
    var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
    var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
    return leadingNulls(Math.ceil(days / 7), 2);
   }
   return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
  },
  "%y": function(date) {
   return (date.tm_year + 1900).toString().substring(2);
  },
  "%Y": function(date) {
   return date.tm_year + 1900;
  },
  "%z": function(date) {
   var off = date.tm_gmtoff;
   var ahead = off >= 0;
   off = Math.abs(off) / 60;
   off = off / 60 * 100 + off % 60;
   return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
  },
  "%Z": function(date) {
   return date.tm_zone;
  },
  "%%": function() {
   return "%";
  }
 };
 for (var rule in EXPANSION_RULES_2) {
  if (pattern.indexOf(rule) >= 0) {
   pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
  }
 }
 var bytes = intArrayFromString(pattern, false);
 if (bytes.length > maxsize) {
  return 0;
 }
 writeArrayToMemory(bytes, s);
 return bytes.length - 1;
}

function _sysconf(name) {
 switch (name) {
 case 30:
  return 16384;

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
   if (typeof navigator === "object") return navigator["hardwareConcurrency"] || 1;
   return 1;
  }
 }
 setErrNo(28);
 return -1;
}

function _time(ptr) {
 var ret = Date.now() / 1e3 | 0;
 if (ptr) {
  _asan_js_store_4(ptr >> 2, ret);
 }
 return ret;
}

var readAsmConstArgsArray = [];

function readAsmConstArgs(sigPtr, buf) {
 assert(Array.isArray(readAsmConstArgsArray));
 assert(buf % 16 == 0);
 readAsmConstArgsArray.length = 0;
 var ch;
 buf >>= 2;
 while (ch = _asan_js_load_1u(sigPtr++)) {
  assert(ch === 100 || ch === 102 || ch === 105);
  var double = ch < 105;
  if (double && buf & 1) buf++;
  readAsmConstArgsArray.push(double ? _asan_js_load_d(buf++ >> 1) : _asan_js_load_4(buf));
  ++buf;
 }
 return readAsmConstArgsArray;
}

var FSNode = function(parent, name, mode, rdev) {
 if (!parent) {
  parent = this;
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

var readMode = 292 | 73;

var writeMode = 146;

Object.defineProperties(FSNode.prototype, {
 read: {
  get: function() {
   return (this.mode & readMode) === readMode;
  },
  set: function(val) {
   val ? this.mode |= readMode : this.mode &= ~readMode;
  }
 },
 write: {
  get: function() {
   return (this.mode & writeMode) === writeMode;
  },
  set: function(val) {
   val ? this.mode |= writeMode : this.mode &= ~writeMode;
  }
 },
 isFolder: {
  get: function() {
   return FS.isDir(this.mode);
  }
 },
 isDevice: {
  get: function() {
   return FS.isChrdev(this.mode);
  }
 }
});

FS.FSNode = FSNode;

FS.staticInit();

var ASSERTIONS = true;

function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}

function intArrayToString(array) {
 var ret = [];
 for (var i = 0; i < array.length; i++) {
  var chr = array[i];
  if (chr > 255) {
   if (ASSERTIONS) {
    assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
   }
   chr &= 255;
  }
  ret.push(String.fromCharCode(chr));
 }
 return ret.join("");
}

__ATINIT__.push({
 func: function() {
  ___wasm_call_ctors();
 }
});

var asmLibraryArg = {
 "CompareStringEx": _CompareStringEx,
 "CompareStringOrdinal": _CompareStringOrdinal,
 "EnumCalendarInfoExEx": _EnumCalendarInfoExEx,
 "EnumSystemLocalesEx": _EnumSystemLocalesEx,
 "EnumTimeFormatsEx": _EnumTimeFormatsEx,
 "FindNLSStringEx": _FindNLSStringEx,
 "FindStringOrdinal": _FindStringOrdinal,
 "GetCalendarInfoEx": _GetCalendarInfoEx,
 "GetLocaleInfoEx": _GetLocaleInfoEx,
 "GetUserPreferredUILanguages": _GetUserPreferredUILanguages,
 "IdnToAscii": _IdnToAscii,
 "IdnToUnicode": _IdnToUnicode,
 "LCIDToLocaleName": _LCIDToLocaleName,
 "LCMapStringEx": _LCMapStringEx,
 "LocaleNameToLCID": _LocaleNameToLCID,
 "NormalizeString": _NormalizeString,
 "ResolveLocaleName": _ResolveLocaleName,
 "__assert_fail": ___assert_fail,
 "__cxa_allocate_exception": ___cxa_allocate_exception,
 "__cxa_atexit": ___cxa_atexit,
 "__cxa_begin_catch": ___cxa_begin_catch,
 "__cxa_end_catch": ___cxa_end_catch,
 "__cxa_find_matching_catch_3": ___cxa_find_matching_catch_3,
 "__cxa_thread_atexit": ___cxa_thread_atexit,
 "__cxa_throw": ___cxa_throw,
 "__cxa_uncaught_exceptions": ___cxa_uncaught_exceptions,
 "__resumeException": ___resumeException,
 "__sys_chmod": ___sys_chmod,
 "__sys_dup": ___sys_dup,
 "__sys_exit_group": ___sys_exit_group,
 "__sys_fadvise64_64": ___sys_fadvise64_64,
 "__sys_fchmod": ___sys_fchmod,
 "__sys_fcntl64": ___sys_fcntl64,
 "__sys_fstat64": ___sys_fstat64,
 "__sys_ftruncate64": ___sys_ftruncate64,
 "__sys_getcwd": ___sys_getcwd,
 "__sys_getdents64": ___sys_getdents64,
 "__sys_getegid32": ___sys_getegid32,
 "__sys_geteuid32": ___sys_geteuid32,
 "__sys_getgid32": ___sys_getgid32,
 "__sys_getpid": ___sys_getpid,
 "__sys_getrusage": ___sys_getrusage,
 "__sys_getuid32": ___sys_getuid32,
 "__sys_ioctl": ___sys_ioctl,
 "__sys_link": ___sys_link,
 "__sys_lstat64": ___sys_lstat64,
 "__sys_madvise1": ___sys_madvise1,
 "__sys_mkdir": ___sys_mkdir,
 "__sys_mlock": ___sys_mlock,
 "__sys_mmap2": ___sys_mmap2,
 "__sys_mprotect": ___sys_mprotect,
 "__sys_munlock": ___sys_munlock,
 "__sys_munmap": ___sys_munmap,
 "__sys_open": ___sys_open,
 "__sys_pipe": ___sys_pipe,
 "__sys_pipe2": ___sys_pipe2,
 "__sys_poll": ___sys_poll,
 "__sys_prlimit64": ___sys_prlimit64,
 "__sys_read": ___sys_read,
 "__sys_readlink": ___sys_readlink,
 "__sys_rename": ___sys_rename,
 "__sys_rmdir": ___sys_rmdir,
 "__sys_setrlimit": ___sys_setrlimit,
 "__sys_socketcall": ___sys_socketcall,
 "__sys_stat64": ___sys_stat64,
 "__sys_ugetrlimit": ___sys_ugetrlimit,
 "__sys_uname": ___sys_uname,
 "__sys_unlink": ___sys_unlink,
 "__sys_utimensat": ___sys_utimensat,
 "__sys_write": ___sys_write,
 "abort": _abort,
 "atexit": _atexit,
 "clock_gettime": _clock_gettime,
 "corert_wasm_invoke_js": _corert_wasm_invoke_js,
 "corert_wasm_invoke_js_unmarshalled": _corert_wasm_invoke_js_unmarshalled,
 "deflate": _deflate,
 "deflateEnd": _deflateEnd,
 "deflateInit2_": _deflateInit2_,
 "dladdr": _dladdr,
 "dlclose": _dlclose,
 "dlerror": _dlerror,
 "dlopen": _dlopen,
 "dlsym": _dlsym,
 "emscripten_asm_const_int": _emscripten_asm_const_int,
 "emscripten_builtin_mmap2": _emscripten_builtin_mmap2,
 "emscripten_builtin_munmap": _emscripten_builtin_munmap,
 "emscripten_builtin_pthread_create": _emscripten_builtin_pthread_create,
 "emscripten_get_callstack": _emscripten_get_callstack,
 "emscripten_get_heap_size": _emscripten_get_heap_size,
 "emscripten_get_module_name": _emscripten_get_module_name,
 "emscripten_memcpy_big": _emscripten_memcpy_big,
 "emscripten_pc_get_column": _emscripten_pc_get_column,
 "emscripten_pc_get_file": _emscripten_pc_get_file,
 "emscripten_pc_get_function": _emscripten_pc_get_function,
 "emscripten_pc_get_line": _emscripten_pc_get_line,
 "emscripten_resize_heap": _emscripten_resize_heap,
 "emscripten_return_address": _emscripten_return_address,
 "emscripten_stack_snapshot": _emscripten_stack_snapshot,
 "emscripten_stack_unwind_buffer": _emscripten_stack_unwind_buffer,
 "environ_get": _environ_get,
 "environ_sizes_get": _environ_sizes_get,
 "exit": _exit,
 "fd_close": _fd_close,
 "fd_fdstat_get": _fd_fdstat_get,
 "fd_read": _fd_read,
 "fd_seek": _fd_seek,
 "fd_sync": _fd_sync,
 "fd_write": _fd_write,
 "flock": _flock,
 "gai_strerror": _gai_strerror,
 "getTempRet0": _getTempRet0,
 "getaddrinfo": _getaddrinfo,
 "getnameinfo": _getnameinfo,
 "getpwuid_r": _getpwuid_r,
 "gettimeofday": _gettimeofday,
 "gmtime_r": _gmtime_r,
 "inflate": _inflate,
 "inflateEnd": _inflateEnd,
 "inflateInit2_": _inflateInit2_,
 "invoke_di": invoke_di,
 "invoke_did": invoke_did,
 "invoke_didd": invoke_didd,
 "invoke_dii": invoke_dii,
 "invoke_diid": invoke_diid,
 "invoke_diii": invoke_diii,
 "invoke_diiii": invoke_diiii,
 "invoke_diiiii": invoke_diiiii,
 "invoke_fi": invoke_fi,
 "invoke_fid": invoke_fid,
 "invoke_ii": invoke_ii,
 "invoke_iid": invoke_iid,
 "invoke_iidd": invoke_iidd,
 "invoke_iidddd": invoke_iidddd,
 "invoke_iidddddddd": invoke_iidddddddd,
 "invoke_iiddi": invoke_iiddi,
 "invoke_iiddiiiiiiiiii": invoke_iiddiiiiiiiiii,
 "invoke_iii": invoke_iii,
 "invoke_iiii": invoke_iiii,
 "invoke_iiiii": invoke_iiiii,
 "invoke_iiiiii": invoke_iiiiii,
 "invoke_iiiiiii": invoke_iiiiiii,
 "invoke_iiiiiiii": invoke_iiiiiiii,
 "invoke_iiiiiiiii": invoke_iiiiiiiii,
 "invoke_iiiiiiiiii": invoke_iiiiiiiiii,
 "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii,
 "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii,
 "invoke_iiiiiiiiiiiii": invoke_iiiiiiiiiiiii,
 "invoke_iiiiiiiiiiiiiiiiiiiiiiii": invoke_iiiiiiiiiiiiiiiiiiiiiiii,
 "invoke_iiiiij": invoke_iiiiij,
 "invoke_iiiij": invoke_iiiij,
 "invoke_iiij": invoke_iiij,
 "invoke_iij": invoke_iij,
 "invoke_iiji": invoke_iiji,
 "invoke_iijj": invoke_iijj,
 "invoke_iijjj": invoke_iijjj,
 "invoke_iijjji": invoke_iijjji,
 "invoke_ji": invoke_ji,
 "invoke_jid": invoke_jid,
 "invoke_jii": invoke_jii,
 "invoke_jiii": invoke_jiii,
 "invoke_jiiiiiiiii": invoke_jiiiiiiiii,
 "invoke_jij": invoke_jij,
 "invoke_jiji": invoke_jiji,
 "invoke_jijj": invoke_jijj,
 "invoke_vi": invoke_vi,
 "invoke_vid": invoke_vid,
 "invoke_vidd": invoke_vidd,
 "invoke_vidddd": invoke_vidddd,
 "invoke_vidddddd": invoke_vidddddd,
 "invoke_viddddii": invoke_viddddii,
 "invoke_viddi": invoke_viddi,
 "invoke_viddii": invoke_viddii,
 "invoke_vif": invoke_vif,
 "invoke_viffffff": invoke_viffffff,
 "invoke_vii": invoke_vii,
 "invoke_viid": invoke_viid,
 "invoke_viidd": invoke_viidd,
 "invoke_viidddd": invoke_viidddd,
 "invoke_viiddi": invoke_viiddi,
 "invoke_viiddiiiiiii": invoke_viiddiiiiiii,
 "invoke_viiddiiiiiiiii": invoke_viiddiiiiiiiii,
 "invoke_viiffffffffffff": invoke_viiffffffffffff,
 "invoke_viii": invoke_viii,
 "invoke_viiid": invoke_viiid,
 "invoke_viiiddddddiiiiiii": invoke_viiiddddddiiiiiii,
 "invoke_viiiddii": invoke_viiiddii,
 "invoke_viiii": invoke_viiii,
 "invoke_viiiid": invoke_viiiid,
 "invoke_viiiii": invoke_viiiii,
 "invoke_viiiiid": invoke_viiiiid,
 "invoke_viiiiii": invoke_viiiiii,
 "invoke_viiiiiid": invoke_viiiiiid,
 "invoke_viiiiiii": invoke_viiiiiii,
 "invoke_viiiiiiii": invoke_viiiiiiii,
 "invoke_viiiiiiiidiiiiid": invoke_viiiiiiiidiiiiid,
 "invoke_viiiiiiiii": invoke_viiiiiiiii,
 "invoke_viiiiiiiiii": invoke_viiiiiiiiii,
 "invoke_viiiiiiiiiii": invoke_viiiiiiiiiii,
 "invoke_viiiiiiiiiiii": invoke_viiiiiiiiiiii,
 "invoke_viiiiiiiiiiiii": invoke_viiiiiiiiiiiii,
 "invoke_viiiiiiiiiiiij": invoke_viiiiiiiiiiiij,
 "invoke_viiiiiiiiiiiiji": invoke_viiiiiiiiiiiiji,
 "invoke_viiiiiiij": invoke_viiiiiiij,
 "invoke_viiiiiij": invoke_viiiiiij,
 "invoke_viiiiiijj": invoke_viiiiiijj,
 "invoke_viiiiijj": invoke_viiiiijj,
 "invoke_viiij": invoke_viiij,
 "invoke_viij": invoke_viij,
 "invoke_viijj": invoke_viijj,
 "invoke_vij": invoke_vij,
 "invoke_viji": invoke_viji,
 "invoke_vijj": invoke_vijj,
 "memory": wasmMemory,
 "mktime": _mktime,
 "nanosleep": _nanosleep,
 "pthread_attr_destroy": _pthread_attr_destroy,
 "pthread_attr_getdetachstate": _pthread_attr_getdetachstate,
 "pthread_attr_getstack": _pthread_attr_getstack,
 "pthread_attr_init": _pthread_attr_init,
 "pthread_attr_setdetachstate": _pthread_attr_setdetachstate,
 "pthread_attr_setstacksize": _pthread_attr_setstacksize,
 "pthread_condattr_destroy": _pthread_condattr_destroy,
 "pthread_condattr_init": _pthread_condattr_init,
 "pthread_condattr_setclock": _pthread_condattr_setclock,
 "pthread_getattr_np": _pthread_getattr_np,
 "pthread_rwlock_destroy": _pthread_rwlock_destroy,
 "pthread_rwlock_init": _pthread_rwlock_init,
 "pthread_rwlock_rdlock": _pthread_rwlock_rdlock,
 "pthread_rwlock_unlock": _pthread_rwlock_unlock,
 "pthread_rwlock_wrlock": _pthread_rwlock_wrlock,
 "pthread_setcancelstate": _pthread_setcancelstate,
 "setTempRet0": _setTempRet0,
 "sigaction": _sigaction,
 "signal": _signal,
 "strftime": _strftime,
 "sysconf": _sysconf,
 "time": _time
};

var asm = createWasm();

var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

var _malloc = Module["_malloc"] = createExportWrapper("malloc");

var _memset = Module["_memset"] = createExportWrapper("memset");

var _uno_windows_ui_core_coredispatcher_dispatchercallback = Module["_uno_windows_ui_core_coredispatcher_dispatchercallback"] = createExportWrapper("uno_windows_ui_core_coredispatcher_dispatchercallback");

var _corert_wasm_invoke_method = Module["_corert_wasm_invoke_method"] = createExportWrapper("corert_wasm_invoke_method");

var _memcpy = Module["_memcpy"] = createExportWrapper("memcpy");

var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

var _free = Module["_free"] = createExportWrapper("free");

var _main = Module["_main"] = createExportWrapper("main");

var _ntohs = Module["_ntohs"] = createExportWrapper("ntohs");

var _fflush = Module["_fflush"] = createExportWrapper("fflush");

var _htons = Module["_htons"] = createExportWrapper("htons");

var _htonl = Module["_htonl"] = createExportWrapper("htonl");

var __get_tzname = Module["__get_tzname"] = createExportWrapper("_get_tzname");

var __get_daylight = Module["__get_daylight"] = createExportWrapper("_get_daylight");

var __get_timezone = Module["__get_timezone"] = createExportWrapper("_get_timezone");

var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = createExportWrapper("_ZSt18uncaught_exceptionv");

var ___cxa_can_catch = Module["___cxa_can_catch"] = createExportWrapper("__cxa_can_catch");

var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = createExportWrapper("__cxa_is_pointer_type");

var _memalign = Module["_memalign"] = createExportWrapper("memalign");

var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = createExportWrapper("emscripten_builtin_malloc");

var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = createExportWrapper("emscripten_builtin_free");

var _emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = createExportWrapper("emscripten_builtin_memalign");

var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = createExportWrapper("emscripten_main_thread_process_queued_calls");

var _emscripten_builtin_memset = Module["_emscripten_builtin_memset"] = createExportWrapper("emscripten_builtin_memset");

var __ZN6__asan9FakeStack17AddrIsInFakeStackEm = Module["__ZN6__asan9FakeStack17AddrIsInFakeStackEm"] = createExportWrapper("_ZN6__asan9FakeStack17AddrIsInFakeStackEm");

var __ZN6__asan9FakeStack8AllocateEmmm = Module["__ZN6__asan9FakeStack8AllocateEmmm"] = createExportWrapper("_ZN6__asan9FakeStack8AllocateEmmm");

var _asan_c_load_1 = Module["_asan_c_load_1"] = createExportWrapper("asan_c_load_1");

var _asan_c_load_1u = Module["_asan_c_load_1u"] = createExportWrapper("asan_c_load_1u");

var _asan_c_load_2 = Module["_asan_c_load_2"] = createExportWrapper("asan_c_load_2");

var _asan_c_load_2u = Module["_asan_c_load_2u"] = createExportWrapper("asan_c_load_2u");

var _asan_c_load_4 = Module["_asan_c_load_4"] = createExportWrapper("asan_c_load_4");

var _asan_c_load_4u = Module["_asan_c_load_4u"] = createExportWrapper("asan_c_load_4u");

var _asan_c_load_f = Module["_asan_c_load_f"] = createExportWrapper("asan_c_load_f");

var _asan_c_load_d = Module["_asan_c_load_d"] = createExportWrapper("asan_c_load_d");

var _asan_c_store_1 = Module["_asan_c_store_1"] = createExportWrapper("asan_c_store_1");

var _asan_c_store_1u = Module["_asan_c_store_1u"] = createExportWrapper("asan_c_store_1u");

var _asan_c_store_2 = Module["_asan_c_store_2"] = createExportWrapper("asan_c_store_2");

var _asan_c_store_2u = Module["_asan_c_store_2u"] = createExportWrapper("asan_c_store_2u");

var _asan_c_store_4 = Module["_asan_c_store_4"] = createExportWrapper("asan_c_store_4");

var _asan_c_store_4u = Module["_asan_c_store_4u"] = createExportWrapper("asan_c_store_4u");

var _asan_c_store_f = Module["_asan_c_store_f"] = createExportWrapper("asan_c_store_f");

var _asan_c_store_d = Module["_asan_c_store_d"] = createExportWrapper("asan_c_store_d");

var dynCall_iiij = Module["dynCall_iiij"] = createExportWrapper("dynCall_iiij");

var dynCall_viji = Module["dynCall_viji"] = createExportWrapper("dynCall_viji");

var dynCall_iiiij = Module["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");

var dynCall_jii = Module["dynCall_jii"] = createExportWrapper("dynCall_jii");

var dynCall_iijj = Module["dynCall_iijj"] = createExportWrapper("dynCall_iijj");

var dynCall_iij = Module["dynCall_iij"] = createExportWrapper("dynCall_iij");

var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");

var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");

var dynCall_jid = Module["dynCall_jid"] = createExportWrapper("dynCall_jid");

var dynCall_viij = Module["dynCall_viij"] = createExportWrapper("dynCall_viij");

var dynCall_vij = Module["dynCall_vij"] = createExportWrapper("dynCall_vij");

var dynCall_jijj = Module["dynCall_jijj"] = createExportWrapper("dynCall_jijj");

var dynCall_viiiiiiij = Module["dynCall_viiiiiiij"] = createExportWrapper("dynCall_viiiiiiij");

var dynCall_viiij = Module["dynCall_viiij"] = createExportWrapper("dynCall_viiij");

var dynCall_jij = Module["dynCall_jij"] = createExportWrapper("dynCall_jij");

var dynCall_viiiiiiiiiiiij = Module["dynCall_viiiiiiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiiiiiij");

var dynCall_viiiiiiiiiiiiji = Module["dynCall_viiiiiiiiiiiiji"] = createExportWrapper("dynCall_viiiiiiiiiiiiji");

var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

var dynCall_viijj = Module["dynCall_viijj"] = createExportWrapper("dynCall_viijj");

var dynCall_vijj = Module["dynCall_vijj"] = createExportWrapper("dynCall_vijj");

var dynCall_viiiiiij = Module["dynCall_viiiiiij"] = createExportWrapper("dynCall_viiiiiij");

var dynCall_iijjj = Module["dynCall_iijjj"] = createExportWrapper("dynCall_iijjj");

var dynCall_iijjji = Module["dynCall_iijjji"] = createExportWrapper("dynCall_iijjji");

var dynCall_viiiiijj = Module["dynCall_viiiiijj"] = createExportWrapper("dynCall_viiiiijj");

var dynCall_jiii = Module["dynCall_jiii"] = createExportWrapper("dynCall_jiii");

var dynCall_iiji = Module["dynCall_iiji"] = createExportWrapper("dynCall_iiji");

var dynCall_viiiiiijj = Module["dynCall_viiiiiijj"] = createExportWrapper("dynCall_viiiiiijj");

var dynCall_iijiji = Module["dynCall_iijiji"] = createExportWrapper("dynCall_iijiji");

var dynCall_jif = Module["dynCall_jif"] = createExportWrapper("dynCall_jif");

var dynCall_jiiiijiiij = Module["dynCall_jiiiijiiij"] = createExportWrapper("dynCall_jiiiijiiij");

var dynCall_viiiiiiiiiijijj = Module["dynCall_viiiiiiiiiijijj"] = createExportWrapper("dynCall_viiiiiiiiiijijj");

var dynCall_viijjjj = Module["dynCall_viijjjj"] = createExportWrapper("dynCall_viijjjj");

var dynCall_viijjjjjjjj = Module["dynCall_viijjjjjjjj"] = createExportWrapper("dynCall_viijjjjjjjj");

var dynCall_iijjjj = Module["dynCall_iijjjj"] = createExportWrapper("dynCall_iijjjj");

var dynCall_viiji = Module["dynCall_viiji"] = createExportWrapper("dynCall_viiji");

var dynCall_viijjjjjji = Module["dynCall_viijjjjjji"] = createExportWrapper("dynCall_viijjjjjji");

var dynCall_viijji = Module["dynCall_viijji"] = createExportWrapper("dynCall_viijji");

var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");

var dynCall_iijiiii = Module["dynCall_iijiiii"] = createExportWrapper("dynCall_iijiiii");

var dynCall_iijiiiij = Module["dynCall_iijiiiij"] = createExportWrapper("dynCall_iijiiiij");

var dynCall_jiiiii = Module["dynCall_jiiiii"] = createExportWrapper("dynCall_jiiiii");

var dynCall_iijii = Module["dynCall_iijii"] = createExportWrapper("dynCall_iijii");

var dynCall_iijji = Module["dynCall_iijji"] = createExportWrapper("dynCall_iijji");

var dynCall_iijjjji = Module["dynCall_iijjjji"] = createExportWrapper("dynCall_iijjjji");

var dynCall_vijiiii = Module["dynCall_vijiiii"] = createExportWrapper("dynCall_vijiiii");

var dynCall_iiiji = Module["dynCall_iiiji"] = createExportWrapper("dynCall_iiiji");

var dynCall_iijjii = Module["dynCall_iijjii"] = createExportWrapper("dynCall_iijjii");

var dynCall_viijiij = Module["dynCall_viijiij"] = createExportWrapper("dynCall_viijiij");

var dynCall_jiiii = Module["dynCall_jiiii"] = createExportWrapper("dynCall_jiiii");

var dynCall_viiiij = Module["dynCall_viiiij"] = createExportWrapper("dynCall_viiiij");

var dynCall_vijii = Module["dynCall_vijii"] = createExportWrapper("dynCall_vijii");

var dynCall_iijiii = Module["dynCall_iijiii"] = createExportWrapper("dynCall_iijiii");

var dynCall_jidd = Module["dynCall_jidd"] = createExportWrapper("dynCall_jidd");

var dynCall_iiiijiji = Module["dynCall_iiiijiji"] = createExportWrapper("dynCall_iiiijiji");

var dynCall_viijiiii = Module["dynCall_viijiiii"] = createExportWrapper("dynCall_viijiiii");

var dynCall_iijiiiiiii = Module["dynCall_iijiiiiiii"] = createExportWrapper("dynCall_iijiiiiiii");

var dynCall_dij = Module["dynCall_dij"] = createExportWrapper("dynCall_dij");

var dynCall_dijj = Module["dynCall_dijj"] = createExportWrapper("dynCall_dijj");

var dynCall_fijj = Module["dynCall_fijj"] = createExportWrapper("dynCall_fijj");

var dynCall_viiiiij = Module["dynCall_viiiiij"] = createExportWrapper("dynCall_viiiiij");

var dynCall_fij = Module["dynCall_fij"] = createExportWrapper("dynCall_fij");

var dynCall_jijjj = Module["dynCall_jijjj"] = createExportWrapper("dynCall_jijjj");

var dynCall_vijjj = Module["dynCall_vijjj"] = createExportWrapper("dynCall_vijjj");

var dynCall_jiijiiiiiiiii = Module["dynCall_jiijiiiiiiiii"] = createExportWrapper("dynCall_jiijiiiiiiiii");

var dynCall_iijiiiiiiiiijiiiiiiiii = Module["dynCall_iijiiiiiiiiijiiiiiiiii"] = createExportWrapper("dynCall_iijiiiiiiiiijiiiiiiiii");

var dynCall_vijjii = Module["dynCall_vijjii"] = createExportWrapper("dynCall_vijjii");

var dynCall_viijjjjjj = Module["dynCall_viijjjjjj"] = createExportWrapper("dynCall_viijjjjjj");

var dynCall_viiijj = Module["dynCall_viiijj"] = createExportWrapper("dynCall_viiijj");

var dynCall_jidi = Module["dynCall_jidi"] = createExportWrapper("dynCall_jidi");

var dynCall_iijiiiiiiiii = Module["dynCall_iijiiiiiiiii"] = createExportWrapper("dynCall_iijiiiiiiiii");

var dynCall_jijjji = Module["dynCall_jijjji"] = createExportWrapper("dynCall_jijjji");

var dynCall_iijijiiiii = Module["dynCall_iijijiiiii"] = createExportWrapper("dynCall_iijijiiiii");

var dynCall_jijii = Module["dynCall_jijii"] = createExportWrapper("dynCall_jijii");

var dynCall_iiiiijjjjj = Module["dynCall_iiiiijjjjj"] = createExportWrapper("dynCall_iiiiijjjjj");

var dynCall_iiiiijjj = Module["dynCall_iiiiijjj"] = createExportWrapper("dynCall_iiiiijjj");

var dynCall_viijiddddi = Module["dynCall_viijiddddi"] = createExportWrapper("dynCall_viijiddddi");

var dynCall_iijjiii = Module["dynCall_iijjiii"] = createExportWrapper("dynCall_iijjiii");

var dynCall_jijiiiii = Module["dynCall_jijiiiii"] = createExportWrapper("dynCall_jijiiiii");

var dynCall_fijji = Module["dynCall_fijji"] = createExportWrapper("dynCall_fijji");

var dynCall_dijji = Module["dynCall_dijji"] = createExportWrapper("dynCall_dijji");

var dynCall_jijji = Module["dynCall_jijji"] = createExportWrapper("dynCall_jijji");

var dynCall_vijjjjj = Module["dynCall_vijjjjj"] = createExportWrapper("dynCall_vijjjjj");

var dynCall_vijiiiiiiiiiiii = Module["dynCall_vijiiiiiiiiiiii"] = createExportWrapper("dynCall_vijiiiiiiiiiiii");

var dynCall_viijjjjjjjji = Module["dynCall_viijjjjjjjji"] = createExportWrapper("dynCall_viijjjjjjjji");

var dynCall_viiiiiiiijiiiiiiij = Module["dynCall_viiiiiiiijiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiijiiiiiiij");

var dynCall_viiiijiiij = Module["dynCall_viiiijiiij"] = createExportWrapper("dynCall_viiiijiiij");

var dynCall_iidjii = Module["dynCall_iidjii"] = createExportWrapper("dynCall_iidjii");

var dynCall_iiiiijiiij = Module["dynCall_iiiiijiiij"] = createExportWrapper("dynCall_iiiiijiiij");

var dynCall_viiiiiiiij = Module["dynCall_viiiiiiiij"] = createExportWrapper("dynCall_viiiiiiiij");

var dynCall_viijjj = Module["dynCall_viijjj"] = createExportWrapper("dynCall_viijjj");

var dynCall_viijjjjiiiiiiiiijiiiiiiiiiji = Module["dynCall_viijjjjiiiiiiiiijiiiiiiiiiji"] = createExportWrapper("dynCall_viijjjjiiiiiiiiijiiiiiiiiiji");

var dynCall_iiiiiij = Module["dynCall_iiiiiij"] = createExportWrapper("dynCall_iiiiiij");

var dynCall_viijiiiiijiiiii = Module["dynCall_viijiiiiijiiiii"] = createExportWrapper("dynCall_viijiiiiijiiiii");

var dynCall_iijiiiiijiiiii = Module["dynCall_iijiiiiijiiiii"] = createExportWrapper("dynCall_iijiiiiijiiiii");

var dynCall_vijiiiii = Module["dynCall_vijiiiii"] = createExportWrapper("dynCall_vijiiiii");

var dynCall_vijjjjiiiiiiiiijiiiiiiiiiji = Module["dynCall_vijjjjiiiiiiiiijiiiiiiiiiji"] = createExportWrapper("dynCall_vijjjjiiiiiiiiijiiiiiiiiiji");

var dynCall_vijjjjiiiiiiiiijiiiiiiiiii = Module["dynCall_vijjjjiiiiiiiiijiiiiiiiiii"] = createExportWrapper("dynCall_vijjjjiiiiiiiiijiiiiiiiiii");

var dynCall_viijiii = Module["dynCall_viijiii"] = createExportWrapper("dynCall_viijiii");

var dynCall_fijjjji = Module["dynCall_fijjjji"] = createExportWrapper("dynCall_fijjjji");

var dynCall_dijjjji = Module["dynCall_dijjjji"] = createExportWrapper("dynCall_dijjjji");

var dynCall_vidjii = Module["dynCall_vidjii"] = createExportWrapper("dynCall_vidjii");

var dynCall_iiiiiji = Module["dynCall_iiiiiji"] = createExportWrapper("dynCall_iiiiiji");

var dynCall_viiiiiijiiiiij = Module["dynCall_viiiiiijiiiiij"] = createExportWrapper("dynCall_viiiiiijiiiiij");

var dynCall_vijjdd = Module["dynCall_vijjdd"] = createExportWrapper("dynCall_vijjdd");

var dynCall_jiiiiiiiii = Module["dynCall_jiiiiiiiii"] = createExportWrapper("dynCall_jiiiiiiiii");

var dynCall_iijjdd = Module["dynCall_iijjdd"] = createExportWrapper("dynCall_iijjdd");

var dynCall_viijiiiii = Module["dynCall_viijiiiii"] = createExportWrapper("dynCall_viijiiiii");

var dynCall_iiiijiij = Module["dynCall_iiiijiij"] = createExportWrapper("dynCall_iiiijiij");

var dynCall_viiiji = Module["dynCall_viiiji"] = createExportWrapper("dynCall_viiiji");

var dynCall_jijd = Module["dynCall_jijd"] = createExportWrapper("dynCall_jijd");

var dynCall_vijiiiijii = Module["dynCall_vijiiiijii"] = createExportWrapper("dynCall_vijiiiijii");

var dynCall_iiijii = Module["dynCall_iiijii"] = createExportWrapper("dynCall_iiijii");

var dynCall_iijjiiii = Module["dynCall_iijjiiii"] = createExportWrapper("dynCall_iijjiiii");

var dynCall_vijiiiij = Module["dynCall_vijiiiij"] = createExportWrapper("dynCall_vijiiiij");

var dynCall_viijiiiij = Module["dynCall_viijiiiij"] = createExportWrapper("dynCall_viijiiiij");

var dynCall_jiiij = Module["dynCall_jiiij"] = createExportWrapper("dynCall_jiiij");

var dynCall_viijjji = Module["dynCall_viijjji"] = createExportWrapper("dynCall_viijjji");

var dynCall_viijiiiiji = Module["dynCall_viijiiiiji"] = createExportWrapper("dynCall_viijiiiiji");

var dynCall_iijiiiijjiiiij = Module["dynCall_iijiiiijjiiiij"] = createExportWrapper("dynCall_iijiiiijjiiiij");

var dynCall_iiiiiijiiiij = Module["dynCall_iiiiiijiiiij"] = createExportWrapper("dynCall_iiiiiijiiiij");

var dynCall_jijjjji = Module["dynCall_jijjjji"] = createExportWrapper("dynCall_jijjjji");

var dynCall_iiiijj = Module["dynCall_iiiijj"] = createExportWrapper("dynCall_iiiijj");

var dynCall_iiijj = Module["dynCall_iiijj"] = createExportWrapper("dynCall_iiijj");

var ___heap_base = Module["___heap_base"] = 102129072;

var ___global_base = Module["___global_base"] = 48234496;

function invoke_vi(index, a1) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_ii(index, a1) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vii(index, a1, a2) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iii(index, a1, a2) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiiiiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_di(index, a1) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viddi(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iid(index, a1, a2) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vidd(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_didd(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vid(index, a1, a2) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viidd(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiffffffffffff(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viid(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iidd(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiddi(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiid(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viddddii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiddddddiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiid(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vidddd(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_dii(index, a1, a2) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viidddd(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiddiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiddiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_diii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiidiiiiid(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_diiiii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_diid(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_diiii(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vidddddd(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiid(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiid(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_fi(index, a1) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vif(index, a1, a2) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiddiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viffffff(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_did(index, a1, a2) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_fid(index, a1, a2) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iidddddddd(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiddii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viddii(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiddi(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iidddd(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
 var sp = stackSave();
 try {
  return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
 var sp = stackSave();
 try {
  wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiij(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return dynCall_iiij(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiij(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return dynCall_iiiij(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viji(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  dynCall_viji(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jii(index, a1, a2) {
 var sp = stackSave();
 try {
  return dynCall_jii(index, a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iijj(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return dynCall_iijj(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iij(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return dynCall_iij(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_ji(index, a1) {
 var sp = stackSave();
 try {
  return dynCall_ji(index, a1);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jid(index, a1, a2) {
 var sp = stackSave();
 try {
  return dynCall_jid(index, a1, a2);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viij(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  dynCall_viij(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jiji(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return dynCall_jiji(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiiiij(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  return dynCall_iiiiij(index, a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vij(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  dynCall_vij(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jijj(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  return dynCall_jijj(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jij(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return dynCall_jij(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  return dynCall_jiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiij(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  dynCall_viiij(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  dynCall_viiiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
 var sp = stackSave();
 try {
  dynCall_viiiiiiiiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiiiiiiiiji(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
 var sp = stackSave();
 try {
  dynCall_viiiiiiiiiiiiji(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viijj(index, a1, a2, a3, a4, a5, a6) {
 var sp = stackSave();
 try {
  dynCall_viijj(index, a1, a2, a3, a4, a5, a6);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_vijj(index, a1, a2, a3, a4, a5) {
 var sp = stackSave();
 try {
  dynCall_vijj(index, a1, a2, a3, a4, a5);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8) {
 var sp = stackSave();
 try {
  dynCall_viiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iijjj(index, a1, a2, a3, a4, a5, a6, a7) {
 var sp = stackSave();
 try {
  return dynCall_iijjj(index, a1, a2, a3, a4, a5, a6, a7);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iijjji(index, a1, a2, a3, a4, a5, a6, a7, a8) {
 var sp = stackSave();
 try {
  return dynCall_iijjji(index, a1, a2, a3, a4, a5, a6, a7, a8);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiijj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
 var sp = stackSave();
 try {
  dynCall_viiiiijj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_jiii(index, a1, a2, a3) {
 var sp = stackSave();
 try {
  return dynCall_jiii(index, a1, a2, a3);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_iiji(index, a1, a2, a3, a4) {
 var sp = stackSave();
 try {
  return dynCall_iiji(index, a1, a2, a3, a4);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

function invoke_viiiiiijj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
 var sp = stackSave();
 try {
  dynCall_viiiiiijj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
 } catch (e) {
  stackRestore(sp);
  if (e !== e + 0 && e !== "longjmp") throw e;
  _setThrew(1, 0);
 }
}

if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() {
 abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() {
 abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() {
 abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["getValue"] = getValue;

if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() {
 abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() {
 abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString")) Module["UTF8ToString"] = function() {
 abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() {
 abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8")) Module["stringToUTF8"] = function() {
 abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() {
 abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() {
 abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() {
 abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() {
 abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() {
 abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["addOnExit"] = addOnExit;

if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() {
 abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() {
 abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() {
 abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() {
 abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency")) Module["addRunDependency"] = function() {
 abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency")) Module["removeRunDependency"] = function() {
 abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder")) Module["FS_createFolder"] = function() {
 abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath")) Module["FS_createPath"] = function() {
 abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile")) Module["FS_createDataFile"] = function() {
 abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile")) Module["FS_createPreloadedFile"] = function() {
 abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile")) Module["FS_createLazyFile"] = function() {
 abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink")) Module["FS_createLink"] = function() {
 abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice")) Module["FS_createDevice"] = function() {
 abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink")) Module["FS_unlink"] = function() {
 abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
};

if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() {
 abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() {
 abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() {
 abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() {
 abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() {
 abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() {
 abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() {
 abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() {
 abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() {
 abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() {
 abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() {
 abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() {
 abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() {
 abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() {
 abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() {
 abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() {
 abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() {
 abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8")) Module["stringToNewUTF8"] = function() {
 abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer")) Module["emscripten_realloc_buffer"] = function() {
 abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() {
 abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES")) Module["ERRNO_CODES"] = function() {
 abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES")) Module["ERRNO_MESSAGES"] = function() {
 abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setErrNo")) Module["setErrNo"] = function() {
 abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "DNS")) Module["DNS"] = function() {
 abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getHostByName")) Module["getHostByName"] = function() {
 abort("'getHostByName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES")) Module["GAI_ERRNO_MESSAGES"] = function() {
 abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Protocols")) Module["Protocols"] = function() {
 abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Sockets")) Module["Sockets"] = function() {
 abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getRandomDevice")) Module["getRandomDevice"] = function() {
 abort("'getRandomDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "traverseStack")) Module["traverseStack"] = function() {
 abort("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE")) Module["UNWIND_CACHE"] = function() {
 abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc")) Module["withBuiltinMalloc"] = function() {
 abort("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray")) Module["readAsmConstArgsArray"] = function() {
 abort("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs")) Module["readAsmConstArgs"] = function() {
 abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "mainThreadEM_ASM")) Module["mainThreadEM_ASM"] = function() {
 abort("'mainThreadEM_ASM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q")) Module["jstoi_q"] = function() {
 abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s")) Module["jstoi_s"] = function() {
 abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName")) Module["getExecutableName"] = function() {
 abort("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "listenOnce")) Module["listenOnce"] = function() {
 abort("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext")) Module["autoResumeAudioContext"] = function() {
 abort("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCallLegacy")) Module["dynCallLegacy"] = function() {
 abort("'dynCallLegacy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getDynCaller")) Module["getDynCaller"] = function() {
 abort("'getDynCaller' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() {
 abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "callRuntimeCallbacks")) Module["callRuntimeCallbacks"] = function() {
 abort("'callRuntimeCallbacks' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "abortStackOverflow")) Module["abortStackOverflow"] = function() {
 abort("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative")) Module["reallyNegative"] = function() {
 abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "unSign")) Module["unSign"] = function() {
 abort("'unSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "reSign")) Module["reSign"] = function() {
 abort("'reSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "formatString")) Module["formatString"] = function() {
 abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PATH")) Module["PATH"] = function() {
 abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS")) Module["PATH_FS"] = function() {
 abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS")) Module["SYSCALLS"] = function() {
 abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2")) Module["syscallMmap2"] = function() {
 abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap")) Module["syscallMunmap"] = function() {
 abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "JSEvents")) Module["JSEvents"] = function() {
 abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets")) Module["specialHTMLTargets"] = function() {
 abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString")) Module["maybeCStringToJsString"] = function() {
 abort("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget")) Module["findEventTarget"] = function() {
 abort("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget")) Module["findCanvasEventTarget"] = function() {
 abort("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate")) Module["polyfillSetImmediate"] = function() {
 abort("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "demangle")) Module["demangle"] = function() {
 abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "demangleAll")) Module["demangleAll"] = function() {
 abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace")) Module["jsStackTrace"] = function() {
 abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() {
 abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings")) Module["getEnvStrings"] = function() {
 abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock")) Module["checkWasiClock"] = function() {
 abort("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64")) Module["writeI53ToI64"] = function() {
 abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped")) Module["writeI53ToI64Clamped"] = function() {
 abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling")) Module["writeI53ToI64Signaling"] = function() {
 abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped")) Module["writeI53ToU64Clamped"] = function() {
 abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling")) Module["writeI53ToU64Signaling"] = function() {
 abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64")) Module["readI53FromI64"] = function() {
 abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64")) Module["readI53FromU64"] = function() {
 abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53")) Module["convertI32PairToI53"] = function() {
 abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53")) Module["convertU32PairToI53"] = function() {
 abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exceptionLast")) Module["exceptionLast"] = function() {
 abort("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exceptionCaught")) Module["exceptionCaught"] = function() {
 abort("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfoAttrs")) Module["ExceptionInfoAttrs"] = function() {
 abort("'ExceptionInfoAttrs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfo")) Module["ExceptionInfo"] = function() {
 abort("'ExceptionInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "CatchInfo")) Module["CatchInfo"] = function() {
 abort("'CatchInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exception_addRef")) Module["exception_addRef"] = function() {
 abort("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "exception_decRef")) Module["exception_decRef"] = function() {
 abort("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "Browser")) Module["Browser"] = function() {
 abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "funcWrappers")) Module["funcWrappers"] = function() {
 abort("'funcWrappers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() {
 abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "setMainLoop")) Module["setMainLoop"] = function() {
 abort("'setMainLoop' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() {
 abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "mmapAlloc")) Module["mmapAlloc"] = function() {
 abort("'mmapAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "MEMFS")) Module["MEMFS"] = function() {
 abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "TTY")) Module["TTY"] = function() {
 abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS")) Module["PIPEFS"] = function() {
 abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS")) Module["SOCKFS"] = function() {
 abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray")) Module["tempFixedLengthArray"] = function() {
 abort("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers")) Module["miniTempWebGLFloatBuffers"] = function() {
 abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType")) Module["heapObjectForWebGLType"] = function() {
 abort("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap")) Module["heapAccessShiftForWebGLHeap"] = function() {
 abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() {
 abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet")) Module["emscriptenWebGLGet"] = function() {
 abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize")) Module["computeUnpackAlignedImageSize"] = function() {
 abort("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData")) Module["emscriptenWebGLGetTexPixelData"] = function() {
 abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform")) Module["emscriptenWebGLGetUniform"] = function() {
 abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib")) Module["emscriptenWebGLGetVertexAttrib"] = function() {
 abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray")) Module["writeGLArray"] = function() {
 abort("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "AL")) Module["AL"] = function() {
 abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode")) Module["SDL_unicode"] = function() {
 abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext")) Module["SDL_ttfContext"] = function() {
 abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio")) Module["SDL_audio"] = function() {
 abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL")) Module["SDL"] = function() {
 abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx")) Module["SDL_gfx"] = function() {
 abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLUT")) Module["GLUT"] = function() {
 abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "EGL")) Module["EGL"] = function() {
 abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window")) Module["GLFW_Window"] = function() {
 abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLFW")) Module["GLFW"] = function() {
 abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "GLEW")) Module["GLEW"] = function() {
 abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "IDBStore")) Module["IDBStore"] = function() {
 abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError")) Module["runAndAbortIfError"] = function() {
 abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "DOTNET")) Module["DOTNET"] = function() {
 abort("'DOTNET' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "BINDING")) Module["BINDING"] = function() {
 abort("'BINDING' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() {
 abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() {
 abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() {
 abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() {
 abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() {
 abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() {
 abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() {
 abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() {
 abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() {
 abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() {
 abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() {
 abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() {
 abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() {
 abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack")) Module["allocateUTF8OnStack"] = function() {
 abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
};

Module["writeStackCookie"] = writeStackCookie;

Module["checkStackCookie"] = checkStackCookie;

if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", {
 configurable: true,
 get: function() {
  abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
 }
});

if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", {
 configurable: true,
 get: function() {
  abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
 }
});

var calledRun;

function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = "Program terminated with exit(" + status + ")";
 this.status = status;
}

var calledMain = false;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function callMain(args) {
 assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
 assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
 var entryFunction = Module["_main"];
 args = args || [];
 var argc = args.length + 1;
 var argv = stackAlloc((argc + 1) * 4);
 _asan_js_store_4(argv >> 2, allocateUTF8OnStack(thisProgram));
 for (var i = 1; i < argc; i++) {
  _asan_js_store_4((argv >> 2) + i, allocateUTF8OnStack(args[i - 1]));
 }
 _asan_js_store_4((argv >> 2) + argc, 0);
 try {
  var ret = entryFunction(argc, argv);
  exit(ret, true);
 } catch (e) {
  if (e instanceof ExitStatus) {
   return;
  } else if (e == "unwind") {
   noExitRuntime = true;
   return;
  } else {
   var toLog = e;
   if (e && typeof e === "object" && e.stack) {
    toLog = [ e, e.stack ];
   }
   err("exception thrown: " + toLog);
   quit_(1, e);
  }
 } finally {
  calledMain = true;
 }
}

function run(args) {
 args = args || arguments_;
 if (runDependencies > 0) {
  return;
 }
 writeStackCookie();
 preRun();
 if (runDependencies > 0) return;
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  preMain();
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  if (shouldRunNow) callMain(args);
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
 if (!ABORT) checkStackCookie();
}

Module["run"] = run;

function exit(status, implicit) {
 if (implicit && noExitRuntime && status === 0) {
  return;
 }
 if (noExitRuntime) {
  if (!implicit) {
   var msg = "program exited (with status: " + status + "), but noExitRuntime is set due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)";
   err(msg);
  }
 } else {
  EXITSTATUS = status;
  exitRuntime();
  if (Module["onExit"]) Module["onExit"](status);
  ABORT = true;
 }
 quit_(status, new ExitStatus(status));
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

var shouldRunNow = true;

if (Module["noInitialRun"]) shouldRunNow = false;

run();

var BINDING = {
 BINDING_ASM: "[WebAssembly.Bindings]WebAssembly.Runtime",
 mono_wasm_object_registry: [],
 mono_wasm_ref_counter: 0,
 mono_wasm_free_list: [],
 mono_wasm_marshal_enum_as_int: false,
 mono_bindings_init: function(binding_asm) {
  this.BINDING_ASM = binding_asm;
 },
 export_functions: function(module) {
  module["mono_bindings_init"] = BINDING.mono_bindings_init.bind(BINDING);
  module["mono_method_invoke"] = BINDING.call_method.bind(BINDING);
  module["mono_method_get_call_signature"] = BINDING.mono_method_get_call_signature.bind(BINDING);
  module["mono_method_resolve"] = BINDING.resolve_method_fqn.bind(BINDING);
  module["mono_bind_static_method"] = BINDING.bind_static_method.bind(BINDING);
  module["mono_call_static_method"] = BINDING.call_static_method.bind(BINDING);
 },
 bindings_lazy_init: function() {
  if (this.init) return;
  this.assembly_load = Module.cwrap("mono_wasm_assembly_load", "number", [ "string" ]);
  this.find_class = Module.cwrap("mono_wasm_assembly_find_class", "number", [ "number", "string", "string" ]);
  this.find_method = Module.cwrap("mono_wasm_assembly_find_method", "number", [ "number", "string", "number" ]);
  this.invoke_method = Module.cwrap("mono_wasm_invoke_method", "number", [ "number", "number", "number", "number" ]);
  this.mono_string_get_utf8 = Module.cwrap("mono_wasm_string_get_utf8", "number", [ "number" ]);
  this.js_string_to_mono_string = Module.cwrap("mono_wasm_string_from_js", "number", [ "string" ]);
  this.mono_get_obj_type = Module.cwrap("mono_wasm_get_obj_type", "number", [ "number" ]);
  this.mono_unbox_int = Module.cwrap("mono_unbox_int", "number", [ "number" ]);
  this.mono_unbox_float = Module.cwrap("mono_wasm_unbox_float", "number", [ "number" ]);
  this.mono_array_length = Module.cwrap("mono_wasm_array_length", "number", [ "number" ]);
  this.mono_array_get = Module.cwrap("mono_wasm_array_get", "number", [ "number", "number" ]);
  this.mono_obj_array_new = Module.cwrap("mono_wasm_obj_array_new", "number", [ "number" ]);
  this.mono_obj_array_set = Module.cwrap("mono_wasm_obj_array_set", "void", [ "number", "number", "number" ]);
  this.mono_unbox_enum = Module.cwrap("mono_wasm_unbox_enum", "number", [ "number" ]);
  this.mono_typed_array_new = Module.cwrap("mono_wasm_typed_array_new", "number", [ "number", "number", "number", "number" ]);
  var binding_fqn_asm = this.BINDING_ASM.substring(this.BINDING_ASM.indexOf("[") + 1, this.BINDING_ASM.indexOf("]")).trim();
  var binding_fqn_class = this.BINDING_ASM.substring(this.BINDING_ASM.indexOf("]") + 1).trim();
  this.binding_module = this.assembly_load(binding_fqn_asm);
  if (!this.binding_module) throw "Can't find bindings module assembly: " + binding_fqn_asm;
  if (binding_fqn_class !== null && typeof binding_fqn_class !== "undefined") {
   var namespace = "WebAssembly";
   var classname = binding_fqn_class.length > 0 ? binding_fqn_class : "Runtime";
   if (binding_fqn_class.indexOf(".") != -1) {
    var idx = binding_fqn_class.lastIndexOf(".");
    namespace = binding_fqn_class.substring(0, idx);
    classname = binding_fqn_class.substring(idx + 1);
   }
  }
  var wasm_runtime_class = this.find_class(this.binding_module, namespace, classname);
  if (!wasm_runtime_class) throw "Can't find " + binding_fqn_class + " class";
  var get_method = function(method_name) {
   var res = BINDING.find_method(wasm_runtime_class, method_name, -1);
   if (!res) throw "Can't find method " + namespace + "." + classname + ":" + method_name;
   return res;
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
  this.init = true;
 },
 get_js_obj: function(js_handle) {
  if (js_handle > 0) return this.mono_wasm_require_handle(js_handle);
  return null;
 },
 conv_string: function(mono_obj) {
  if (mono_obj == 0) return null;
  var raw = this.mono_string_get_utf8(mono_obj);
  var res = Module.UTF8ToString(raw);
  Module._free(raw);
  return res;
 },
 is_nested_array: function(ele) {
  return this.call_method(this.is_simple_array, null, "mi", [ ele ]);
 },
 mono_array_to_js_array: function(mono_array) {
  if (mono_array == 0) return null;
  var res = [];
  var len = this.mono_array_length(mono_array);
  for (var i = 0; i < len; ++i) {
   var ele = this.mono_array_get(mono_array, i);
   if (this.is_nested_array(ele)) res.push(this.mono_array_to_js_array(ele)); else res.push(this.unbox_mono_obj(ele));
  }
  return res;
 },
 js_array_to_mono_array: function(js_array) {
  var mono_array = this.mono_obj_array_new(js_array.length);
  for (var i = 0; i < js_array.length; ++i) {
   this.mono_obj_array_set(mono_array, i, this.js_to_mono_obj(js_array[i]));
  }
  return mono_array;
 },
 unbox_mono_obj: function(mono_obj) {
  if (mono_obj == 0) return undefined;
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
     return BINDING.invoke_delegate(obj, arguments);
    };
   }

  case 6:
   {
    if (typeof Promise === "undefined" || typeof Promise.resolve === "undefined") throw new Error("Promises are not supported thus C# Tasks can not work in this context.");
    var obj = this.extract_js_obj(mono_obj);
    var cont_obj = null;
    var promise = new Promise(function(resolve, reject) {
     cont_obj = {
      resolve: resolve,
      reject: reject
     };
    });
    this.call_method(this.setup_js_cont, null, "mo", [ mono_obj, cont_obj ]);
    obj.__mono_js_cont__ = cont_obj.__mono_gchandle__;
    cont_obj.__mono_js_task__ = obj.__mono_gchandle__;
    return promise;
   }

  case 7:
   return this.extract_js_obj(mono_obj);

  case 8:
   return this.mono_unbox_int(mono_obj) != 0;

  case 9:
   if (this.mono_wasm_marshal_enum_as_int) {
    return this.mono_unbox_enum(mono_obj);
   } else {
    enumValue = this.call_method(this.object_to_string, null, "m", [ mono_obj ]);
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
    throw new Error("Marshalling of primitive arrays are not supported.  Use the corresponding TypedArray instead.");
   }

  case 20:
   var dateValue = this.call_method(this.get_date_value, null, "md", [ mono_obj ]);
   return new Date(dateValue);

  case 21:
   var dateoffsetValue = this.call_method(this.object_to_string, null, "m", [ mono_obj ]);
   return dateoffsetValue;

  default:
   throw new Error("no idea on how to unbox object kind " + type);
  }
 },
 create_task_completion_source: function() {
  return this.call_method(this.create_tcs, null, "i", [ -1 ]);
 },
 set_task_result: function(tcs, result) {
  tcs.is_mono_tcs_result_set = true;
  this.call_method(this.set_tcs_result, null, "oo", [ tcs, result ]);
  if (tcs.is_mono_tcs_task_bound) this.free_task_completion_source(tcs);
 },
 set_task_failure: function(tcs, reason) {
  tcs.is_mono_tcs_result_set = true;
  this.call_method(this.set_tcs_failure, null, "os", [ tcs, reason.toString() ]);
  if (tcs.is_mono_tcs_task_bound) this.free_task_completion_source(tcs);
 },
 js_typedarray_to_heap: function(typedArray) {
  var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
  var ptr = Module._malloc(numBytes);
  var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
  heapBytes.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, numBytes));
  return heapBytes;
 },
 js_to_mono_obj: function(js_obj) {
  this.bindings_lazy_init();
  if (js_obj == null || js_obj == undefined) return 0;
  if (typeof js_obj === "number") {
   if (parseInt(js_obj) == js_obj) return this.call_method(this.box_js_int, null, "im", [ js_obj ]);
   return this.call_method(this.box_js_double, null, "dm", [ js_obj ]);
  }
  if (typeof js_obj === "string") return this.js_string_to_mono_string(js_obj);
  if (typeof js_obj === "boolean") return this.call_method(this.box_js_bool, null, "im", [ js_obj ]);
  if (Promise.resolve(js_obj) === js_obj) {
   var the_task = this.try_extract_mono_obj(js_obj);
   if (the_task) return the_task;
   var tcs = this.create_task_completion_source();
   js_obj.then(function(result) {
    BINDING.set_task_result(tcs, result);
   }, function(reason) {
    BINDING.set_task_failure(tcs, reason);
   });
   return this.get_task_and_bind(tcs, js_obj);
  }
  if (js_obj.constructor.name === "Date") return this.call_method(this.create_date_time, null, "dm", [ js_obj.getTime() ]);
  return this.extract_mono_obj(js_obj);
 },
 js_typed_array_to_array: function(js_obj) {
  if (!!(js_obj.buffer instanceof ArrayBuffer && js_obj.BYTES_PER_ELEMENT)) {
   var arrayType = 0;
   if (js_obj instanceof Int8Array) arrayType = 11;
   if (js_obj instanceof Uint8Array) arrayType = 12;
   if (js_obj instanceof Uint8ClampedArray) arrayType = 12;
   if (js_obj instanceof Int16Array) arrayType = 13;
   if (js_obj instanceof Uint16Array) arrayType = 14;
   if (js_obj instanceof Int32Array) arrayType = 15;
   if (js_obj instanceof Uint32Array) arrayType = 16;
   if (js_obj instanceof Float32Array) arrayType = 17;
   if (js_obj instanceof Float64Array) arrayType = 18;
   var heapBytes = this.js_typedarray_to_heap(js_obj);
   var bufferArray = this.mono_typed_array_new(heapBytes.byteOffset, js_obj.length, js_obj.BYTES_PER_ELEMENT, arrayType);
   Module._free(heapBytes.byteOffset);
   return bufferArray;
  } else {
   throw new Error("Object '" + js_obj + "' is not a typed array");
  }
 },
 typedarray_copy_to: function(typed_array, pinned_array, begin, end, bytes_per_element) {
  if (!!(typed_array.buffer instanceof ArrayBuffer && typed_array.BYTES_PER_ELEMENT)) {
   if (bytes_per_element !== typed_array.BYTES_PER_ELEMENT) throw new Error("Inconsistent element sizes: TypedArray.BYTES_PER_ELEMENT '" + typed_array.BYTES_PER_ELEMENT + "' sizeof managed element: '" + bytes_per_element + "'");
   var num_of_bytes = (end - begin) * bytes_per_element;
   var view_bytes = typed_array.length * typed_array.BYTES_PER_ELEMENT;
   if (num_of_bytes > view_bytes) num_of_bytes = view_bytes;
   var offset = begin * bytes_per_element;
   var heapBytes = new Uint8Array(Module.HEAPU8.buffer, pinned_array + offset, num_of_bytes);
   heapBytes.set(new Uint8Array(typed_array.buffer, typed_array.byteOffset, num_of_bytes));
   return num_of_bytes;
  } else {
   throw new Error("Object '" + typed_array + "' is not a typed array");
  }
 },
 typedarray_copy_from: function(typed_array, pinned_array, begin, end, bytes_per_element) {
  if (!!(typed_array.buffer instanceof ArrayBuffer && typed_array.BYTES_PER_ELEMENT)) {
   if (bytes_per_element !== typed_array.BYTES_PER_ELEMENT) throw new Error("Inconsistent element sizes: TypedArray.BYTES_PER_ELEMENT '" + typed_array.BYTES_PER_ELEMENT + "' sizeof managed element: '" + bytes_per_element + "'");
   var num_of_bytes = (end - begin) * bytes_per_element;
   var view_bytes = typed_array.length * typed_array.BYTES_PER_ELEMENT;
   if (num_of_bytes > view_bytes) num_of_bytes = view_bytes;
   var typedarrayBytes = new Uint8Array(typed_array.buffer, 0, num_of_bytes);
   var offset = begin * bytes_per_element;
   typedarrayBytes.set(Module.HEAPU8.subarray(pinned_array + offset, pinned_array + offset + num_of_bytes));
   return num_of_bytes;
  } else {
   throw new Error("Object '" + typed_array + "' is not a typed array");
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
   break;
  }
  this.typedarray_copy_from(newTypedArray, pinned_array, begin, end, bytes_per_element);
  return newTypedArray;
 },
 js_to_mono_enum: function(method, parmIdx, js_obj) {
  this.bindings_lazy_init();
  if (js_obj === null || typeof js_obj === "undefined") return 0;
  var monoObj = this.js_to_mono_obj(js_obj);
  var monoEnum = this.call_method(this.object_to_enum, null, "iimm", [ method, parmIdx, monoObj ]);
  return this.mono_unbox_enum(monoEnum);
 },
 wasm_binding_obj_new: function(js_obj_id, type) {
  return this.call_method(this.bind_js_obj, null, "io", [ js_obj_id, type ]);
 },
 wasm_bind_existing: function(mono_obj, js_id) {
  return this.call_method(this.bind_existing_obj, null, "mi", [ mono_obj, js_id ]);
 },
 wasm_bind_core_clr_obj: function(js_id, gc_handle) {
  return this.call_method(this.bind_core_clr_obj, null, "ii", [ js_id, gc_handle ]);
 },
 wasm_unbind_js_obj: function(js_obj_id) {
  this.call_method(this.unbind_js_obj, null, "i", [ js_obj_id ]);
 },
 wasm_unbind_js_obj_and_free: function(js_obj_id) {
  this.call_method(this.unbind_js_obj_and_free, null, "i", [ js_obj_id ]);
 },
 wasm_get_js_id: function(mono_obj) {
  return this.call_method(this.get_js_id, null, "m", [ mono_obj ]);
 },
 wasm_get_raw_obj: function(gchandle) {
  return this.call_method(this.get_raw_mono_obj, null, "im", [ gchandle ]);
 },
 try_extract_mono_obj: function(js_obj) {
  if (js_obj === null || typeof js_obj === "undefined" || typeof js_obj.__mono_gchandle__ === "undefined") return 0;
  return this.wasm_get_raw_obj(js_obj.__mono_gchandle__);
 },
 mono_method_get_call_signature: function(method) {
  this.bindings_lazy_init();
  return this.call_method(this.get_call_sig, null, "i", [ method ]);
 },
 get_task_and_bind: function(tcs, js_obj) {
  var gc_handle = this.mono_wasm_free_list.length ? this.mono_wasm_free_list.pop() : this.mono_wasm_ref_counter++;
  var task_gchandle = this.call_method(this.tcs_get_task_and_bind, null, "oi", [ tcs, gc_handle + 1 ]);
  js_obj.__mono_gchandle__ = task_gchandle;
  this.mono_wasm_object_registry[gc_handle] = js_obj;
  this.free_task_completion_source(tcs);
  tcs.is_mono_tcs_task_bound = true;
  js_obj.__mono_bound_tcs__ = tcs.__mono_gchandle__;
  tcs.__mono_bound_task__ = js_obj.__mono_gchandle__;
  return this.wasm_get_raw_obj(js_obj.__mono_gchandle__);
 },
 free_task_completion_source: function(tcs) {
  if (tcs.is_mono_tcs_result_set) {
   this.call_method(this.unbind_raw_obj_and_free, null, "ii", [ tcs.__mono_gchandle__ ]);
  }
  if (tcs.__mono_bound_task__) {
   this.call_method(this.unbind_raw_obj_and_free, null, "ii", [ tcs.__mono_bound_task__ ]);
  }
 },
 extract_mono_obj: function(js_obj) {
  if (js_obj === null || typeof js_obj === "undefined") return 0;
  if (!js_obj.is_mono_bridged_obj) {
   var gc_handle = this.mono_wasm_register_obj(js_obj);
   return this.wasm_get_raw_obj(gc_handle);
  }
  return this.wasm_get_raw_obj(js_obj.__mono_gchandle__);
 },
 extract_js_obj: function(mono_obj) {
  if (mono_obj == 0) return null;
  var js_id = this.wasm_get_js_id(mono_obj);
  if (js_id > 0) return this.mono_wasm_require_handle(js_id);
  var gcHandle = this.mono_wasm_free_list.length ? this.mono_wasm_free_list.pop() : this.mono_wasm_ref_counter++;
  var js_obj = {
   __mono_gchandle__: this.wasm_bind_existing(mono_obj, gcHandle + 1),
   is_mono_bridged_obj: true
  };
  this.mono_wasm_object_registry[gcHandle] = js_obj;
  return js_obj;
 },
 call_method: function(method, this_arg, args_marshal, args) {
  this.bindings_lazy_init();
  var extra_args_mem = 0;
  for (var i = 0; i < args.length; ++i) {
   if (args_marshal[i] == "i" || args_marshal[i] == "f" || args_marshal[i] == "l" || args_marshal[i] == "d" || args_marshal[i] == "j" || args_marshal[i] == "k") extra_args_mem += 8;
  }
  var extra_args_mem = extra_args_mem ? Module._malloc(extra_args_mem) : 0;
  var extra_arg_idx = 0;
  var args_mem = Module._malloc(args.length * 4);
  var eh_throw = Module._malloc(4);
  for (var i = 0; i < args.length; ++i) {
   if (args_marshal[i] == "s") {
    Module.setValue(args_mem + i * 4, this.js_string_to_mono_string(args[i]), "i32");
   } else if (args_marshal[i] == "m") {
    Module.setValue(args_mem + i * 4, args[i], "i32");
   } else if (args_marshal[i] == "o") {
    Module.setValue(args_mem + i * 4, this.js_to_mono_obj(args[i]), "i32");
   } else if (args_marshal[i] == "j" || args_marshal[i] == "k") {
    var enumVal = this.js_to_mono_enum(method, i, args[i]);
    var extra_cell = extra_args_mem + extra_arg_idx;
    extra_arg_idx += 8;
    if (args_marshal[i] == "j") Module.setValue(extra_cell, enumVal, "i32"); else if (args_marshal[i] == "k") Module.setValue(extra_cell, enumVal, "i64");
    Module.setValue(args_mem + i * 4, extra_cell, "i32");
   } else if (args_marshal[i] == "i" || args_marshal[i] == "f" || args_marshal[i] == "l" || args_marshal[i] == "d") {
    var extra_cell = extra_args_mem + extra_arg_idx;
    extra_arg_idx += 8;
    if (args_marshal[i] == "i") Module.setValue(extra_cell, args[i], "i32"); else if (args_marshal[i] == "l") Module.setValue(extra_cell, args[i], "i64"); else if (args_marshal[i] == "f") Module.setValue(extra_cell, args[i], "float"); else Module.setValue(extra_cell, args[i], "double");
    Module.setValue(args_mem + i * 4, extra_cell, "i32");
   }
  }
  Module.setValue(eh_throw, 0, "i32");
  var res = this.invoke_method(method, this_arg, args_mem, eh_throw);
  var eh_res = Module.getValue(eh_throw, "i32");
  if (extra_args_mem) Module._free(extra_args_mem);
  Module._free(args_mem);
  Module._free(eh_throw);
  if (eh_res != 0) {
   var msg = this.conv_string(res);
   throw new Error(msg);
  }
  if (args_marshal !== null && typeof args_marshal !== "undefined") {
   if (args_marshal.length >= args.length && args_marshal[args.length] === "m") return res;
  }
  return this.unbox_mono_obj(res);
 },
 invoke_delegate: function(delegate_obj, js_args) {
  this.bindings_lazy_init();
  if (!this.delegate_dynamic_invoke) {
   if (!this.corlib) this.corlib = this.assembly_load("mscorlib");
   if (!this.delegate_class) this.delegate_class = this.find_class(this.corlib, "System", "Delegate");
   if (!this.delegate_class) {
    throw new Error("System.Delegate class can not be resolved.");
   }
   this.delegate_dynamic_invoke = this.find_method(this.delegate_class, "DynamicInvoke", -1);
  }
  var mono_args = this.js_array_to_mono_array(js_args);
  if (!this.delegate_dynamic_invoke) throw new Error("System.Delegate.DynamicInvoke method can not be resolved.");
  return this.call_method(this.delegate_dynamic_invoke, this.extract_mono_obj(delegate_obj), "mo", [ mono_args ]);
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
   classname = fqn.substring(idx + 1);
  }
  var asm = this.assembly_load(assembly);
  if (!asm) throw new Error("Could not find assembly: " + assembly);
  var klass = this.find_class(asm, namespace, classname);
  if (!klass) throw new Error("Could not find class: " + namespace + ":" + classname);
  var method = this.find_method(klass, methodname, -1);
  if (!method) throw new Error("Could not find method: " + methodname);
  return method;
 },
 call_static_method: function(fqn, args, signature) {
  this.bindings_lazy_init();
  var method = this.resolve_method_fqn(fqn);
  if (typeof signature === "undefined") signature = Module.mono_method_get_call_signature(method);
  return this.call_method(method, null, signature, args);
 },
 bind_static_method: function(fqn, signature) {
  this.bindings_lazy_init();
  var method = this.resolve_method_fqn(fqn);
  if (typeof signature === "undefined") signature = Module.mono_method_get_call_signature(method);
  return function() {
   return BINDING.call_method(method, null, signature, arguments);
  };
 },
 wasm_get_core_type: function(obj) {
  return this.call_method(this.get_core_type, null, "so", [ "WebAssembly.Core." + obj.constructor.name ]);
 },
 get_wasm_type: function(obj) {
  var coreType = obj[Symbol.for("wasm type")];
  if (typeof coreType === "undefined") {
   switch (obj.constructor.name) {
   case "Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "ArrayBuffer":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     ArrayBuffer.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Int8Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Int8Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Uint8Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Uint8Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Uint8ClampedArray":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Uint8ClampedArray.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Int16Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Int16Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Uint16Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Uint16Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Int32Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Int32Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Uint32Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Uint32Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    return coreType;

   case "Float32Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Float32Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Float64Array":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Float64Array.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "Function":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     Function.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;

   case "SharedArrayBuffer":
    coreType = this.wasm_get_core_type(obj);
    if (typeof coreType !== "undefined") {
     SharedArrayBuffer.prototype[Symbol.for("wasm type")] = coreType;
    }
    break;
   }
  }
  return coreType;
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
    this.mono_wasm_object_registry[handle] = obj;
   }
  }
  return gc_handle;
 },
 mono_wasm_require_handle: function(handle) {
  if (handle > 0) return this.mono_wasm_object_registry[handle - 1];
  return null;
 },
 mono_wasm_unregister_obj: function(js_id) {
  var obj = this.mono_wasm_object_registry[js_id - 1];
  if (typeof obj !== "undefined" && obj !== null) {
   if (typeof ___mono_wasm_global___ !== "undefined" && ___mono_wasm_global___ === obj) return obj;
   var gc_handle = obj.__mono_gchandle__;
   if (typeof gc_handle !== "undefined") {
    this.wasm_unbind_js_obj_and_free(js_id);
    obj.__mono_gchandle__ = undefined;
    obj.__mono_jshandle__ = undefined;
    this.mono_wasm_object_registry[js_id - 1] = undefined;
    this.mono_wasm_free_list.push(js_id - 1);
   }
  }
  return obj;
 },
 mono_wasm_free_handle: function(handle) {
  this.mono_wasm_unregister_obj(handle);
 },
 mono_wasm_free_raw_object: function(js_id) {
  var obj = this.mono_wasm_object_registry[js_id - 1];
  if (typeof obj !== "undefined" && obj !== null) {
   if (typeof ___mono_wasm_global___ !== "undefined" && ___mono_wasm_global___ === obj) return obj;
   var gc_handle = obj.__mono_gchandle__;
   if (typeof gc_handle !== "undefined") {
    obj.__mono_gchandle__ = undefined;
    obj.__mono_jshandle__ = undefined;
    this.mono_wasm_object_registry[js_id - 1] = undefined;
    this.mono_wasm_free_list.push(js_id - 1);
   }
  }
  return obj;
 },
 mono_wasm_get_global: function() {
  function testGlobal(obj) {
   obj["___mono_wasm_global___"] = obj;
   var success = typeof ___mono_wasm_global___ === "object" && obj["___mono_wasm_global___"] === obj;
   if (!success) {
    delete obj["___mono_wasm_global___"];
   }
   return success;
  }
  if (typeof ___mono_wasm_global___ === "object") {
   return ___mono_wasm_global___;
  }
  if (typeof global === "object" && testGlobal(global)) {
   ___mono_wasm_global___ = global;
  } else if (typeof window === "object" && testGlobal(window)) {
   ___mono_wasm_global___ = window;
  } else if (testGlobal(function() {
   return Function;
  }()("return this")())) {
   ___mono_wasm_global___ = function() {
    return Function;
   }()("return this")();
  }
  if (typeof ___mono_wasm_global___ === "object") {
   return ___mono_wasm_global___;
  }
  throw Error("unable to get mono wasm global object.");
 }
};

var Uno;

(function(Uno) {
 var Utils;
 (function(Utils) {
  class Clipboard {
   static setText(text) {
    const nav = navigator;
    if (nav.clipboard) {
     nav.clipboard.setText(text);
    } else {
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

(function(Windows) {
 var UI;
 (function(UI) {
  var Core;
  (function(Core) {
   class CoreDispatcher {
    static init(isReady) {
     MonoSupport.jsCallDispatcher.registerScope("CoreDispatcher", Windows.UI.Core.CoreDispatcher);
     CoreDispatcher.initMethods();
     CoreDispatcher._isReady = isReady;
     CoreDispatcher._isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
     CoreDispatcher._isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    static WakeUp() {
     if (CoreDispatcher._isReady) {
      if (!CoreDispatcher._isWaitingReady) {
       CoreDispatcher._isReady.then(() => {
        CoreDispatcher.InnerWakeUp();
        CoreDispatcher._isReady = null;
       });
       CoreDispatcher._isWaitingReady = true;
      }
     } else {
      CoreDispatcher.InnerWakeUp();
     }
     return true;
    }
    static InnerWakeUp() {
     if ((CoreDispatcher._isIOS || CoreDispatcher._isSafari) && CoreDispatcher._isFirstCall) {
      CoreDispatcher._isFirstCall = false;
      console.warn("Detected iOS, delaying first CoreDispatcher dispatch for 5 seconds (see https://github.com/mono/mono/issues/12357)");
      window.setTimeout(() => this.WakeUp(), 5e3);
     } else {
      window.setImmediate(() => {
       try {
        CoreDispatcher._coreDispatcherCallback();
       } catch (e) {
        console.error(`Unhandled dispatcher exception: ${e} (${e.stack})`);
        throw e;
       }
      });
     }
    }
    static initMethods() {
     if (Uno.UI.WindowManager.isHosted) {
      console.debug("Hosted Mode: Skipping CoreDispatcher initialization ");
     } else {
      if (!CoreDispatcher._coreDispatcherCallback) {
       CoreDispatcher._coreDispatcherCallback = Module.mono_bind_static_method("[Uno] Windows.UI.Core.CoreDispatcher:DispatcherCallback");
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

(function(Uno) {
 var UI;
 (function(UI) {
  class HtmlDom {
   static initPolyfills() {
    this.isConnectedPolyfill();
   }
   static isConnectedPolyfill() {
    function get() {
     return document.contains(this);
    }
    (supported => {
     if (!supported) {
      Object.defineProperty(Node.prototype, "isConnected", {
       get: get
      });
     }
    })("isConnected" in Node.prototype);
   }
  }
  UI.HtmlDom = HtmlDom;
 })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));

var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
 return new (P || (P = Promise))(function(resolve, reject) {
  function fulfilled(value) {
   try {
    step(generator.next(value));
   } catch (e) {
    reject(e);
   }
  }
  function rejected(value) {
   try {
    step(generator["throw"](value));
   } catch (e) {
    reject(e);
   }
  }
  function step(result) {
   result.done ? resolve(result.value) : new P(function(resolve) {
    resolve(result.value);
   }).then(fulfilled, rejected);
  }
  step((generator = generator.apply(thisArg, _arguments || [])).next());
 });
};

var Uno;

(function(Uno) {
 var Http;
 (function(Http) {
  class HttpClient {
   static send(config) {
    return __awaiter(this, void 0, void 0, function*() {
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
     } catch (error) {
      this.dispatchError(config.id, `${error.message || error}`);
      console.error(error);
     }
    });
   }
   static blobFromBase64(base64, contentType) {
    return __awaiter(this, void 0, void 0, function*() {
     contentType = contentType || "application/octet-stream";
     const url = `data:${contentType};base64,${base64}`;
     return yield (yield fetch(url)).blob();
    });
   }
   static base64FromBlob(blob) {
    return new Promise(resolve => {
     const reader = new FileReader();
     reader.onloadend = (() => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",", 2)[1];
      resolve(base64);
     });
     reader.readAsDataURL(blob);
    });
   }
   static dispatchResponse(requestId, status, headers, payload) {
    this.initMethods();
    const requestIdStr = MonoRuntime.mono_string(requestId);
    const statusStr = MonoRuntime.mono_string("" + status);
    const headersStr = MonoRuntime.mono_string(headers);
    const payloadStr = MonoRuntime.mono_string(payload);
    MonoRuntime.call_method(this.dispatchResponseMethod, null, [ requestIdStr, statusStr, headersStr, payloadStr ]);
   }
   static dispatchError(requestId, error) {
    this.initMethods();
    const requestIdStr = MonoRuntime.mono_string(requestId);
    const errorStr = MonoRuntime.mono_string(error);
    MonoRuntime.call_method(this.dispatchErrorMethod, null, [ requestIdStr, errorStr ]);
   }
   static initMethods() {
    if (this.dispatchResponseMethod) {
     return;
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

(function(MonoSupport) {
 class jsCallDispatcher {
  static registerScope(identifier, instance) {
   jsCallDispatcher.registrations.set(identifier, instance);
  }
  static findJSFunction(identifier) {
   if (!identifier) {
    return jsCallDispatcher.dispatch;
   } else {
    if (!jsCallDispatcher._isUnoRegistered) {
     jsCallDispatcher.registerScope("UnoStatic", Uno.UI.WindowManager);
     jsCallDispatcher.registerScope("UnoStatic_Windows_Storage_StorageFolder", Windows.Storage.StorageFolder);
     jsCallDispatcher._isUnoRegistered = true;
    }
    const {ns: ns, methodName: methodName} = jsCallDispatcher.parseIdentifier(identifier);
    var instance = jsCallDispatcher.registrations.get(ns);
    if (instance) {
     var boundMethod = instance[methodName].bind(instance);
     var methodId = jsCallDispatcher.cacheMethod(boundMethod);
     return () => methodId;
    } else {
     throw `Unknown scope ${ns}`;
    }
   }
  }
  static dispatch(id, pParams, pRet) {
   return jsCallDispatcher.methodMap[id](pParams, pRet);
  }
  static parseIdentifier(identifier) {
   var parts = identifier.split(":");
   const ns = parts[0];
   const methodName = parts[1];
   return {
    ns: ns,
    methodName: methodName
   };
  }
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

window.DotNet = MonoSupport;

var Uno;

(function(Uno) {
 var UI;
 (function(UI) {
  class WindowManager {
   constructor(containerElementId, loadingElementId) {
    this.containerElementId = containerElementId;
    this.loadingElementId = loadingElementId;
    this.allActiveElementsById = {};
    this.initDom();
   }
   static get isHosted() {
    return WindowManager._isHosted;
   }
   static get isLoadEventsEnabled() {
    return WindowManager._isLoadEventsEnabled;
   }
   static init(isHosted, isLoadEventsEnabled, containerElementId = "uno-body", loadingElementId = "uno-loading") {
    WindowManager._isHosted = isHosted;
    WindowManager._isLoadEventsEnabled = isLoadEventsEnabled;
    Windows.UI.Core.CoreDispatcher.init(WindowManager.buildReadyPromise());
    this.current = new WindowManager(containerElementId, loadingElementId);
    MonoSupport.jsCallDispatcher.registerScope("Uno", this.current);
    this.current.init();
    return "ok";
   }
   static buildReadyPromise() {
    return new Promise(resolve => {
     Promise.all([ WindowManager.buildSplashScreen() ]).then(() => resolve(true));
    });
   }
   static buildSplashScreen() {
    return new Promise(resolve => {
     const img = new Image();
     let loaded = false;
     let loadingDone = () => {
      if (!loaded) {
       loaded = true;
       if (img.width !== 0 && img.height !== 0) {
        let canvas = document.createElement("canvas");
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
       } else {
        WindowManager.setupSplashScreen(img);
        resolve(true);
       }
      }
     };
     img.onload = loadingDone;
     img.onerror = loadingDone;
     img.src = String(UnoAppManifest.splashScreenImage);
     setTimeout(loadingDone, 2e3);
    });
   }
   static initNative(pParams) {
    const params = WindowManagerInitParams.unmarshal(pParams);
    WindowManager.init(params.IsHostedMode, params.IsLoadEventsEnabled);
    return true;
   }
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
   static findLaunchArguments() {
    if (typeof URLSearchParams === "function") {
     return new URLSearchParams(window.location.search).toString();
    } else {
     const queryIndex = document.location.search.indexOf("?");
     if (queryIndex !== -1) {
      return document.location.search.substring(queryIndex + 1);
     }
     return "";
    }
   }
   createContent(contentDefinition) {
    this.createContentInternal(contentDefinition);
    return "ok";
   }
   createContentNative(pParams) {
    const params = WindowManagerCreateContentParams.unmarshal(pParams);
    const def = {
     id: params.HtmlId,
     handle: params.Handle,
     isFocusable: params.IsFocusable,
     isFrameworkElement: params.IsFrameworkElement,
     isSvg: params.IsSvg,
     tagName: params.TagName,
     type: params.Type,
     classes: params.Classes
    };
    this.createContentInternal(def);
    return true;
   }
   createContentInternal(contentDefinition) {
    const element = contentDefinition.isSvg ? document.createElementNS("http://www.w3.org/2000/svg", contentDefinition.tagName) : document.createElement(contentDefinition.tagName);
    element.id = String(contentDefinition.id);
    element.setAttribute("XamlType", contentDefinition.type);
    element.setAttribute("XamlHandle", `${contentDefinition.handle}`);
    if (contentDefinition.isFrameworkElement) {
     this.setAsUnarranged(element);
    }
    if (element.hasOwnProperty("tabindex")) {
     element["tabindex"] = contentDefinition.isFocusable ? 0 : -1;
    } else {
     element.setAttribute("tabindex", contentDefinition.isFocusable ? "0" : "-1");
    }
    if (contentDefinition) {
     for (const className of contentDefinition.classes) {
      element.classList.add(`uno-${className}`);
     }
    }
    this.allActiveElementsById[contentDefinition.id] = element;
   }
   getView(elementHandle) {
    const element = this.allActiveElementsById[elementHandle];
    if (!element) {
     throw `Element id ${elementHandle} not found.`;
    }
    return element;
   }
   setName(elementId, name) {
    this.setNameInternal(elementId, name);
    return "ok";
   }
   setNameNative(pParam) {
    const params = WindowManagerSetNameParams.unmarshal(pParam);
    this.setNameInternal(params.HtmlId, params.Name);
    return true;
   }
   setNameInternal(elementId, name) {
    this.getView(elementId).setAttribute("xamlname", name);
   }
   setXUid(elementId, name) {
    this.setXUidInternal(elementId, name);
    return "ok";
   }
   setXUidNative(pParam) {
    const params = WindowManagerSetXUidParams.unmarshal(pParam);
    this.setXUidInternal(params.HtmlId, params.Uid);
    return true;
   }
   setXUidInternal(elementId, name) {
    this.getView(elementId).setAttribute("xuid", name);
   }
   setAttributes(elementId, attributes) {
    const element = this.getView(elementId);
    for (const name in attributes) {
     if (attributes.hasOwnProperty(name)) {
      element.setAttribute(name, attributes[name]);
     }
    }
    return "ok";
   }
   setAttributesNative(pParams) {
    const params = WindowManagerSetAttributesParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    for (let i = 0; i < params.Pairs_Length; i += 2) {
     element.setAttribute(params.Pairs[i], params.Pairs[i + 1]);
    }
    return true;
   }
   setAttributeNative(pParams) {
    const params = WindowManagerSetAttributeParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    element.setAttribute(params.Name, params.Value);
    return true;
   }
   removeAttribute(elementId, name) {
    const element = this.getView(elementId);
    element.removeAttribute(name);
    return "ok";
   }
   removeAttributeNative(pParams) {
    const params = WindowManagerRemoveAttributeParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    element.removeAttribute(params.Name);
    return true;
   }
   getAttribute(elementId, name) {
    return this.getView(elementId).getAttribute(name);
   }
   setProperty(elementId, properties) {
    const element = this.getView(elementId);
    for (const name in properties) {
     if (properties.hasOwnProperty(name)) {
      var setVal = properties[name];
      if (setVal === "true") {
       element[name] = true;
      } else if (setVal === "false") {
       element[name] = false;
      } else {
       element[name] = setVal;
      }
     }
    }
    return "ok";
   }
   setPropertyNative(pParams) {
    const params = WindowManagerSetPropertyParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    for (let i = 0; i < params.Pairs_Length; i += 2) {
     var setVal = params.Pairs[i + 1];
     if (setVal === "true") {
      element[params.Pairs[i]] = true;
     } else if (setVal === "false") {
      element[params.Pairs[i]] = false;
     } else {
      element[params.Pairs[i]] = setVal;
     }
    }
    return true;
   }
   getProperty(elementId, name) {
    const element = this.getView(elementId);
    return element[name] || "";
   }
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
   setStyleDoubleNative(pParams) {
    const params = WindowManagerSetStyleDoubleParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    element.style.setProperty(params.Name, String(params.Value));
    return true;
   }
   resetStyle(elementId, names) {
    this.resetStyleInternal(elementId, names);
    return "ok";
   }
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
   setClasses(elementId, cssClassesList, classIndex) {
    const element = this.getView(elementId);
    for (let i = 0; i < cssClassesList.length; i++) {
     if (i === classIndex) {
      element.classList.add(cssClassesList[i]);
     } else {
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
    } else {
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
    } else {
     element.classList.remove(WindowManager.unoClippedToBoundsClassName);
    }
   }
   setElementTransformNative(pParams) {
    const params = WindowManagerSetElementTransformParams.unmarshal(pParams);
    const element = this.getView(params.HtmlId);
    var style = element.style;
    style.transform = `matrix(${params.M11},${params.M12},${params.M21},${params.M22},${params.M31},${params.M32})`;
    element.classList.remove(WindowManager.unoUnarrangedClassName);
    return true;
   }
   open(url) {
    const newWindow = window.open(url, "_blank");
    return newWindow != null ? "True" : "False";
   }
   alert(message) {
    window.alert(message);
    return "ok";
   }
   setWindowTitle(title) {
    document.title = title || UnoAppManifest.displayName;
    return "ok";
   }
   getWindowTitle() {
    return document.title || UnoAppManifest.displayName;
   }
   registerEventOnView(elementId, eventName, onCapturePhase = false, eventFilterName, eventExtractorName) {
    this.registerEventOnViewInternal(elementId, eventName, onCapturePhase, eventFilterName, eventExtractorName);
    return "ok";
   }
   registerEventOnViewNative(pParams) {
    const params = WindowManagerRegisterEventOnViewParams.unmarshal(pParams);
    this.registerEventOnViewInternal(params.HtmlId, params.EventName, params.OnCapturePhase, params.EventFilterName, params.EventExtractorName);
    return true;
   }
   ensurePendingLeaveEventProcessing() {
    if (this._isPendingLeaveProcessingEnabled) {
     return;
    }
    document.addEventListener("pointermove", evt => {
     if (this.processPendingLeaveEvent) {
      this.processPendingLeaveEvent(evt);
     }
    }, true);
    this._isPendingLeaveProcessingEnabled = true;
   }
   registerEventOnViewInternal(elementId, eventName, onCapturePhase = false, eventFilterName, eventExtractorName) {
    const element = this.getView(elementId);
    const eventExtractor = this.getEventExtractor(eventExtractorName);
    const eventHandler = event => {
     const eventPayload = eventExtractor ? `${eventExtractor(event)}` : "";
     var handled = this.dispatchEvent(element, eventName, eventPayload);
     if (handled) {
      event.stopPropagation();
     }
    };
    if (eventName == "pointerenter") {
     const enterPointerHandler = event => {
      const e = event;
      if (e.explicitOriginalTarget) {
       const evt = event;
       for (let elt of document.elementsFromPoint(evt.pageX, evt.pageY)) {
        if (elt == element) {
         eventHandler(event);
         return;
        }
        let htmlElt = elt;
        if (htmlElt.style.pointerEvents != "none") {
         while (htmlElt.parentElement) {
          htmlElt = htmlElt.parentElement;
          if (htmlElt == element) {
           eventHandler(event);
           return;
          }
         }
         return;
        }
       }
      } else {
       eventHandler(event);
      }
     };
     element.addEventListener(eventName, enterPointerHandler, onCapturePhase);
    } else if (eventName == "pointerleave") {
     const leavePointerHandler = event => {
      const e = event;
      if (e.explicitOriginalTarget && e.explicitOriginalTarget !== event.currentTarget && event.isOver(element)) {
       var attempt = 3;
       this.ensurePendingLeaveEventProcessing();
       this.processPendingLeaveEvent = (move => {
        if (!move.isOverDeep(element)) {
         console.log("Raising deferred pointerleave on element " + elementId);
         eventHandler(event);
         this.processPendingLeaveEvent = null;
        } else if (--attempt <= 0) {
         console.log("Drop deferred pointerleave on element " + elementId);
         this.processPendingLeaveEvent = null;
        } else {
         console.log("Requeue deferred pointerleave on element " + elementId);
        }
       });
      } else {
       eventHandler(event);
      }
     };
     element.addEventListener(eventName, leavePointerHandler, onCapturePhase);
    } else {
     element.addEventListener(eventName, eventHandler, onCapturePhase);
    }
   }
   leftPointerEventFilter(evt) {
    return evt ? evt.eventPhase === 2 || evt.eventPhase === 3 && (!evt.button || evt.button === 0) : false;
   }
   defaultEventFilter(evt) {
    return evt ? evt.eventPhase === 2 || evt.eventPhase === 3 : false;
   }
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
    return `${evt.pointerId};${evt.clientX};${evt.clientY};${evt.ctrlKey ? "1" : "0"};${evt.shiftKey ? "1" : "0"};${evt.button};${evt.pointerType};${srcHandle};${evt.timeStamp}`;
   }
   keyboardEventExtractor(evt) {
    return evt instanceof KeyboardEvent ? evt.key : "0";
   }
   tappedEventExtractor(evt) {
    return evt ? `0;${evt.clientX};${evt.clientY};${evt.ctrlKey ? "1" : "0"};${evt.shiftKey ? "1" : "0"};${evt.button};mouse` : "";
   }
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
   setRootContent(elementId) {
    if (this.rootContent && Number(this.rootContent.id) === elementId) {
     return null;
    }
    if (this.rootContent) {
     this.containerElement.removeChild(this.rootContent);
     if (WindowManager.isLoadEventsEnabled) {
      this.dispatchEvent(this.rootContent, "unloaded");
     }
     this.rootContent.classList.remove(WindowManager.unoRootClassName);
    }
    if (!elementId) {
     return null;
    }
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
    this.setAsArranged(newRootElement);
    this.resize();
    return "ok";
   }
   addView(parentId, childId, index) {
    this.addViewInternal(parentId, childId, index);
    return "ok";
   }
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
    if (index && index < parentElement.childElementCount) {
     const insertBeforeElement = parentElement.children[index];
     parentElement.insertBefore(childElement, insertBeforeElement);
    } else {
     parentElement.appendChild(childElement);
    }
    if (shouldRaiseLoadEvents) {
     this.dispatchEvent(childElement, "loaded");
    }
   }
   removeView(parentId, childId) {
    this.removeViewInternal(parentId, childId);
    return "ok";
   }
   removeViewNative(pParams) {
    const params = WindowManagerRemoveViewParams.unmarshal(pParams);
    this.removeViewInternal(params.HtmlId, params.ChildView);
    return true;
   }
   removeViewInternal(parentId, childId) {
    const parentElement = this.getView(parentId);
    const childElement = this.getView(childId);
    const shouldRaiseLoadEvents = WindowManager.isLoadEventsEnabled && this.getIsConnectedToRootElement(childElement);
    parentElement.removeChild(childElement);
    this.setAsUnarranged(childElement);
    if (shouldRaiseLoadEvents) {
     this.dispatchEvent(childElement, "unloaded");
    }
   }
   destroyView(elementId) {
    this.destroyViewInternal(elementId);
    return "ok";
   }
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
   measureView(viewId, maxWidth, maxHeight) {
    const ret = this.measureViewInternal(Number(viewId), maxWidth ? Number(maxWidth) : NaN, maxHeight ? Number(maxHeight) : NaN);
    return `${ret[0]};${ret[1]}`;
   }
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
    return [ resultWidth + 1, resultHeight ];
   }
   measureViewInternal(viewId, maxWidth, maxHeight) {
    const element = this.getView(viewId);
    const elementStyle = element.style;
    const originalStyleCssText = elementStyle.cssText;
    let parentElement = null;
    let parentElementWidthHeight = null;
    let unconnectedRoot = null;
    let cleanupUnconnectedRoot = function(owner) {
     if (unconnectedRoot !== null) {
      owner.removeChild(unconnectedRoot);
     }
    };
    try {
     if (!element.isConnected) {
      unconnectedRoot = element;
      while (unconnectedRoot.parentElement) {
       unconnectedRoot = unconnectedRoot.parentElement;
      }
      this.containerElement.appendChild(unconnectedRoot);
     }
     parentElement = element.parentElement;
     parentElementWidthHeight = {
      width: parentElement.style.width,
      height: parentElement.style.height
     };
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
     updatedStyles.position = "fixed";
     updatedStyles["max-width"] = Number.isFinite(maxWidth) ? maxWidth + "px" : "none";
     updatedStyles["max-height"] = Number.isFinite(maxHeight) ? maxHeight + "px" : "none";
     let updatedStyleString = "";
     for (let key in updatedStyles) {
      if (updatedStyles.hasOwnProperty(key)) {
       updatedStyleString += key + ": " + updatedStyles[key] + "; ";
      }
     }
     elementStyle.cssText = updatedStyleString;
     if (element instanceof HTMLImageElement) {
      const imgElement = element;
      return [ imgElement.naturalWidth, imgElement.naturalHeight ];
     } else if (element instanceof HTMLInputElement) {
      const inputElement = element;
      cleanupUnconnectedRoot(this.containerElement);
      var textOnlyElement = document.createElement("p");
      textOnlyElement.style.cssText = updatedStyleString;
      textOnlyElement.innerText = inputElement.value;
      unconnectedRoot = textOnlyElement;
      this.containerElement.appendChild(unconnectedRoot);
      var textSize = this.measureElement(textOnlyElement);
      var inputSize = this.measureElement(element);
      return [ textSize[0], inputSize[1] ];
     } else {
      return this.measureElement(element);
     }
    } finally {
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
    const opts = {
     left: params.HasLeft ? params.Left : undefined,
     top: params.HasTop ? params.Top : undefined,
     behavior: params.DisableAnimation ? "auto" : "smooth"
    };
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
   setImageAsMonochrome(viewId, url, color) {
    const element = this.getView(viewId);
    if (element.tagName.toUpperCase() === "IMG") {
     const imgElement = element;
     var img = new Image();
     img.onload = buildMonochromeImage;
     img.src = url;
     function buildMonochromeImage() {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.globalCompositeOperation = "source-over";
      imgElement.src = c.toDataURL();
     }
     return "ok";
    } else {
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
   setHtmlContent(viewId, html) {
    this.setHtmlContentInternal(viewId, html);
    return "ok";
   }
   setHtmlContentNative(pParams) {
    const params = WindowManagerSetContentHtmlParams.unmarshal(pParams);
    this.setHtmlContentInternal(params.HtmlId, params.Html);
    return true;
   }
   setHtmlContentInternal(viewId, html) {
    this.getView(viewId).innerHTML = html;
   }
   getClientViewSize(elementId) {
    const element = this.getView(elementId);
    return `${element.clientWidth};${element.clientHeight};${element.offsetWidth};${element.offsetHeight}`;
   }
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
   GetDependencyPropertyValue(elementId, propertyName) {
    if (!WindowManager.getDependencyPropertyValueMethod) {
     WindowManager.getDependencyPropertyValueMethod = Module.mono_bind_static_method("[Uno.UI] Uno.UI.Helpers.Automation:GetDependencyPropertyValue");
    }
    const element = this.getView(elementId);
    const htmlId = Number(element.getAttribute("XamlHandle"));
    return WindowManager.getDependencyPropertyValueMethod(htmlId, propertyName);
   }
   SetDependencyPropertyValue(elementId, propertyNameAndValue) {
    if (!WindowManager.setDependencyPropertyValueMethod) {
     WindowManager.setDependencyPropertyValueMethod = Module.mono_bind_static_method("[Uno.UI] Uno.UI.Helpers.Automation:SetDependencyPropertyValue");
    }
    const element = this.getView(elementId);
    const htmlId = Number(element.getAttribute("XamlHandle"));
    return WindowManager.setDependencyPropertyValueMethod(htmlId, propertyNameAndValue);
   }
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
    } else {
     if (!WindowManager.resizeMethod) {
      WindowManager.resizeMethod = Module.mono_bind_static_method("[Uno.UI] Windows.UI.Xaml.Window:Resize");
     }
     if (!WindowManager.dispatchEventMethod) {
      WindowManager.dispatchEventMethod = Module.mono_bind_static_method("[Uno.UI] Windows.UI.Xaml.UIElement:DispatchEvent");
     }
    }
   }
   initDom() {
    this.containerElement = document.getElementById(this.containerElementId);
    if (!this.containerElement) {
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
    const body = document.getElementsByTagName("body")[0];
    body.style.backgroundColor = "#fff";
   }
   resize() {
    if (WindowManager.isHosted) {
     UnoDispatch.resize(`${document.documentElement.clientWidth};${document.documentElement.clientHeight}`);
    } else {
     WindowManager.resizeMethod(document.documentElement.clientWidth, document.documentElement.clientHeight);
    }
   }
   dispatchEvent(element, eventName, eventPayload = null) {
    const htmlId = Number(element.getAttribute("XamlHandle"));
    if (!htmlId) {
     throw `No attribute XamlHandle on element ${element}. Can't raise event.`;
    }
    if (WindowManager.isHosted) {
     UnoDispatch.dispatch(String(htmlId), eventName, eventPayload);
     return true;
    } else {
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
   define([ "AppManifest" ], () => {});
  } else {
   throw `The Uno.Wasm.Boostrap is not up to date, please upgrade to a later version`;
  }
 })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));

window.Uno = Uno;

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
     } else {
      ret.Paths.push(null);
     }
    }
   } else {
    ret.Paths = null;
   }
  }
  return ret;
 }
}

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

class WindowManagerCreateContentParams {
 static unmarshal(pData) {
  let ret = new WindowManagerCreateContentParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  {
   var ptr = Module.getValue(pData + 4, "*");
   if (ptr !== 0) {
    ret.TagName = String(Module.UTF8ToString(ptr));
   } else {
    ret.TagName = null;
   }
  }
  {
   ret.Handle = Number(Module.getValue(pData + 8, "*"));
  }
  {
   var ptr = Module.getValue(pData + 12, "*");
   if (ptr !== 0) {
    ret.Type = String(Module.UTF8ToString(ptr));
   } else {
    ret.Type = null;
   }
  }
  {
   ret.IsSvg = Boolean(Module.getValue(pData + 16, "i32"));
  }
  {
   ret.IsFrameworkElement = Boolean(Module.getValue(pData + 20, "i32"));
  }
  {
   ret.IsFocusable = Boolean(Module.getValue(pData + 24, "i32"));
  }
  {
   ret.Classes_Length = Number(Module.getValue(pData + 28, "i32"));
  }
  {
   var pArray = Module.getValue(pData + 32, "*");
   if (pArray !== 0) {
    ret.Classes = new Array();
    for (var i = 0; i < ret.Classes_Length; i++) {
     var value = Module.getValue(pArray + i * 4, "*");
     if (value !== 0) {
      ret.Classes.push(String(MonoRuntime.conv_string(value)));
     } else {
      ret.Classes.push(null);
     }
    }
   } else {
    ret.Classes = null;
   }
  }
  return ret;
 }
}

class WindowManagerDestroyViewParams {
 static unmarshal(pData) {
  let ret = new WindowManagerDestroyViewParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  return ret;
 }
}

class WindowManagerGetBBoxParams {
 static unmarshal(pData) {
  let ret = new WindowManagerGetBBoxParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  return ret;
 }
}

class WindowManagerGetBBoxReturn {
 marshal(pData) {
  Module.setValue(pData + 0, this.X, "double");
  Module.setValue(pData + 8, this.Y, "double");
  Module.setValue(pData + 16, this.Width, "double");
  Module.setValue(pData + 24, this.Height, "double");
 }
}

class WindowManagerGetClientViewSizeParams {
 static unmarshal(pData) {
  let ret = new WindowManagerGetClientViewSizeParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  return ret;
 }
}

class WindowManagerGetClientViewSizeReturn {
 marshal(pData) {
  Module.setValue(pData + 0, this.OffsetWidth, "double");
  Module.setValue(pData + 8, this.OffsetHeight, "double");
  Module.setValue(pData + 16, this.ClientWidth, "double");
  Module.setValue(pData + 24, this.ClientHeight, "double");
 }
}

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

class WindowManagerMeasureViewReturn {
 marshal(pData) {
  Module.setValue(pData + 0, this.DesiredWidth, "double");
  Module.setValue(pData + 8, this.DesiredHeight, "double");
 }
}

class WindowManagerRegisterEventOnViewParams {
 static unmarshal(pData) {
  let ret = new WindowManagerRegisterEventOnViewParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  {
   var ptr = Module.getValue(pData + 4, "*");
   if (ptr !== 0) {
    ret.EventName = String(Module.UTF8ToString(ptr));
   } else {
    ret.EventName = null;
   }
  }
  {
   ret.OnCapturePhase = Boolean(Module.getValue(pData + 8, "i32"));
  }
  {
   var ptr = Module.getValue(pData + 12, "*");
   if (ptr !== 0) {
    ret.EventFilterName = String(Module.UTF8ToString(ptr));
   } else {
    ret.EventFilterName = null;
   }
  }
  {
   var ptr = Module.getValue(pData + 16, "*");
   if (ptr !== 0) {
    ret.EventExtractorName = String(Module.UTF8ToString(ptr));
   } else {
    ret.EventExtractorName = null;
   }
  }
  return ret;
 }
}

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
   } else {
    ret.Name = null;
   }
  }
  return ret;
 }
}

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

class WindowManagerResetStyleParams {
 static unmarshal(pData) {
  let ret = new WindowManagerResetStyleParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  {
   ret.Styles_Length = Number(Module.getValue(pData + 4, "i32"));
  }
  {
   var pArray = Module.getValue(pData + 8, "*");
   if (pArray !== 0) {
    ret.Styles = new Array();
    for (var i = 0; i < ret.Styles_Length; i++) {
     var value = Module.getValue(pArray + i * 4, "*");
     if (value !== 0) {
      ret.Styles.push(String(MonoRuntime.conv_string(value)));
     } else {
      ret.Styles.push(null);
     }
    }
   } else {
    ret.Styles = null;
   }
  }
  return ret;
 }
}

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
   } else {
    ret.Name = null;
   }
  }
  {
   var ptr = Module.getValue(pData + 8, "*");
   if (ptr !== 0) {
    ret.Value = String(Module.UTF8ToString(ptr));
   } else {
    ret.Value = null;
   }
  }
  return ret;
 }
}

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
     } else {
      ret.Pairs.push(null);
     }
    }
   } else {
    ret.Pairs = null;
   }
  }
  return ret;
 }
}

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
     } else {
      ret.CssClasses.push(null);
     }
    }
   } else {
    ret.CssClasses = null;
   }
  }
  {
   ret.Index = Number(Module.getValue(pData + 12, "i32"));
  }
  return ret;
 }
}

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
   } else {
    ret.Html = null;
   }
  }
  return ret;
 }
}

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
   } else {
    ret.Name = null;
   }
  }
  return ret;
 }
}

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
     } else {
      ret.Pairs.push(null);
     }
    }
   } else {
    ret.Pairs = null;
   }
  }
  return ret;
 }
}

class WindowManagerSetStyleDoubleParams {
 static unmarshal(pData) {
  let ret = new WindowManagerSetStyleDoubleParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  {
   var ptr = Module.getValue(pData + 4, "*");
   if (ptr !== 0) {
    ret.Name = String(Module.UTF8ToString(ptr));
   } else {
    ret.Name = null;
   }
  }
  {
   ret.Value = Number(Module.getValue(pData + 8, "double"));
  }
  return ret;
 }
}

class WindowManagerSetStylesParams {
 static unmarshal(pData) {
  let ret = new WindowManagerSetStylesParams();
  {
   ret.HtmlId = Number(Module.getValue(pData + 0, "*"));
  }
  {
   ret.SetAsArranged = Boolean(Module.getValue(pData + 4, "i32"));
  }
  {
   ret.Pairs_Length = Number(Module.getValue(pData + 8, "i32"));
  }
  {
   var pArray = Module.getValue(pData + 12, "*");
   if (pArray !== 0) {
    ret.Pairs = new Array();
    for (var i = 0; i < ret.Pairs_Length; i++) {
     var value = Module.getValue(pArray + i * 4, "*");
     if (value !== 0) {
      ret.Pairs.push(String(MonoRuntime.conv_string(value)));
     } else {
      ret.Pairs.push(null);
     }
    }
   } else {
    ret.Pairs = null;
   }
  }
  {
   ret.ClipToBounds = Boolean(Module.getValue(pData + 16, "i32"));
  }
  return ret;
 }
}

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
   } else {
    ret.Uid = null;
   }
  }
  return ret;
 }
}

PointerEvent.prototype.isOver = function(element) {
 const bounds = element.getBoundingClientRect();
 return this.pageX >= bounds.left && this.pageX < bounds.right && this.pageY >= bounds.top && this.pageY < bounds.bottom;
};

PointerEvent.prototype.isOverDeep = function(element) {
 if (!element) {
  return false;
 } else if (element.style.pointerEvents != "none") {
  return this.isOver(element);
 } else {
  for (let elt of element.children) {
   if (this.isOverDeep(elt)) {
    return true;
   }
  }
 }
};

var Uno;

(function(Uno) {
 var Foundation;
 (function(Foundation) {
  var Interop;
  (function(Interop) {
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

(function(Uno) {
 var UI;
 (function(UI) {
  var Interop;
  (function(Interop) {
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

(function(Uno) {
 var UI;
 (function(UI) {
  var Interop;
  (function(Interop) {
   class Xaml {}
   Interop.Xaml = Xaml;
  })(Interop = UI.Interop || (UI.Interop = {}));
 })(UI = Uno.UI || (Uno.UI = {}));
})(Uno || (Uno = {}));

var Windows;

(function(Windows) {
 var Storage;
 (function(Storage) {
  class StorageFolder {
   static isIndexDBAvailable() {
    try {
     window.indexedDB;
     return true;
    } catch (err) {
     return false;
    }
   }
   static makePersistent(pParams) {
    const params = StorageFolderMakePersistentParams.unmarshal(pParams);
    for (var i = 0; i < params.Paths.length; i++) {
     this.setupStorage(params.Paths[i]);
    }
   }
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
    const that = this;
    FS.syncfs(true, err => {
     if (err) {
      console.error(`Error synchronizing filesystem from IndexDB: ${err}`);
     }
    });
    if (!this._isInit) {
     window.addEventListener("beforeunload", this.synchronizeFileSystem);
     setInterval(this.synchronizeFileSystem, 1e4);
     this._isInit = true;
    }
   }
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

(function(Windows) {
 var Devices;
 (function(Devices) {
  var Geolocation;
  (function(Geolocation) {
   let GeolocationAccessStatus;
   (function(GeolocationAccessStatus) {
    GeolocationAccessStatus["Allowed"] = "Allowed";
    GeolocationAccessStatus["Denied"] = "Denied";
    GeolocationAccessStatus["Unspecified"] = "Unspecified";
   })(GeolocationAccessStatus || (GeolocationAccessStatus = {}));
   let PositionStatus;
   (function(PositionStatus) {
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
    static requestAccess() {
     Geolocator.initialize();
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(_ => {
       Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Allowed);
      }, error => {
       if (error.code == error.PERMISSION_DENIED) {
        Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Denied);
       } else if (error.code == error.POSITION_UNAVAILABLE || error.code == error.TIMEOUT) {
        Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Allowed);
       } else {
        Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Unspecified);
       }
      }, {
       enableHighAccuracy: false,
       maximumAge: 864e5,
       timeout: 100
      });
     } else {
      Geolocator.dispatchAccessRequest(GeolocationAccessStatus.Denied);
     }
    }
    static getGeoposition(desiredAccuracyInMeters, maximumAge, timeout, requestId) {
     Geolocator.initialize();
     if (navigator.geolocation) {
      this.getAccurateCurrentPosition(position => Geolocator.handleGeoposition(position, requestId), error => Geolocator.handleError(error, requestId), desiredAccuracyInMeters, {
       enableHighAccuracy: desiredAccuracyInMeters < 50,
       maximumAge: maximumAge,
       timeout: timeout
      });
     } else {
      Geolocator.dispatchError(PositionStatus.NotAvailable, requestId);
     }
    }
    static startPositionWatch(desiredAccuracyInMeters, requestId) {
     Geolocator.initialize();
     if (navigator.geolocation) {
      Geolocator.positionWatches[requestId] = navigator.geolocation.watchPosition(position => Geolocator.handleGeoposition(position, requestId), error => Geolocator.handleError(error, requestId));
      return true;
     } else {
      return false;
     }
    }
    static stopPositionWatch(desiredAccuracyInMeters, requestId) {
     navigator.geolocation.clearWatch(Geolocator.positionWatches[requestId]);
     delete Geolocator.positionWatches[requestId];
    }
    static handleGeoposition(position, requestId) {
     var serializedGeoposition = position.coords.latitude + ":" + position.coords.longitude + ":" + position.coords.altitude + ":" + position.coords.altitudeAccuracy + ":" + position.coords.accuracy + ":" + position.coords.heading + ":" + position.coords.speed + ":" + position.timestamp;
     Geolocator.dispatchGeoposition(serializedGeoposition, requestId);
    }
    static handleError(error, requestId) {
     if (error.code == error.TIMEOUT) {
      Geolocator.dispatchError(PositionStatus.NoData, requestId);
     } else if (error.code == error.PERMISSION_DENIED) {
      Geolocator.dispatchError(PositionStatus.Disabled, requestId);
     } else if (error.code == error.POSITION_UNAVAILABLE) {
      Geolocator.dispatchError(PositionStatus.NotAvailable, requestId);
     }
    }
    static getAccurateCurrentPosition(geolocationSuccess, geolocationError, desiredAccuracy, options) {
     var lastCheckedPosition;
     var locationEventCount = 0;
     var watchId;
     var timerId;
     var checkLocation = function(position) {
      lastCheckedPosition = position;
      locationEventCount = locationEventCount + 1;
      if (position.coords.accuracy <= desiredAccuracy) {
       clearTimeout(timerId);
       navigator.geolocation.clearWatch(watchId);
       foundPosition(position);
      }
     };
     var stopTrying = function() {
      navigator.geolocation.clearWatch(watchId);
      foundPosition(lastCheckedPosition);
     };
     var onError = function(error) {
      clearTimeout(timerId);
      navigator.geolocation.clearWatch(watchId);
      geolocationError(error);
     };
     var foundPosition = function(position) {
      geolocationSuccess(position);
     };
     watchId = navigator.geolocation.watchPosition(checkLocation, onError, options);
     timerId = setTimeout(stopTrying, options.timeout);
    }
   }
   Geolocation.Geolocator = Geolocator;
  })(Geolocation = Devices.Geolocation || (Devices.Geolocation = {}));
 })(Devices = Windows.Devices || (Windows.Devices = {}));
})(Windows || (Windows = {}));

var Windows;

(function(Windows) {
 var Devices;
 (function(Devices) {
  var Sensors;
  (function(Sensors) {
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

(function(Windows) {
 var Devices;
 (function(Devices) {
  var Sensors;
  (function(Sensors) {
   class Gyrometer {
    static initialize() {
     try {
      if (typeof window.Gyroscope === "function") {
       this.dispatchReading = Module.mono_bind_static_method("[Uno] Windows.Devices.Sensors.Gyrometer:DispatchReading");
       let GyroscopeClass = window.Gyroscope;
       this.gyroscope = new GyroscopeClass({
        referenceFrame: "device"
       });
       return true;
      }
     } catch (error) {
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

(function(Windows) {
 var Devices;
 (function(Devices) {
  var Sensors;
  (function(Sensors) {
   class Magnetometer {
    static initialize() {
     try {
      if (typeof window.Magnetometer === "function") {
       this.dispatchReading = Module.mono_bind_static_method("[Uno] Windows.Devices.Sensors.Magnetometer:DispatchReading");
       let MagnetometerClass = window.Magnetometer;
       this.magnetometer = new MagnetometerClass({
        referenceFrame: "device"
       });
       return true;
      }
     } catch (error) {
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

(function(Windows) {
 var System;
 (function(System) {
  var Profile;
  (function(Profile) {
   class AnalyticsVersionInfo {
    static getUserAgent() {
     return navigator.userAgent;
    }
    static getBrowserName() {
     if (!!window.opr && !!window.opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0) {
      return "Opera";
     }
     if (typeof window.InstallTrigger !== "undefined") {
      return "Firefox";
     }
     if (/constructor/i.test(window.HTMLElement) || (p => p.toString() === "[object SafariRemoteNotification]")(typeof window.safari !== "undefined" && window.safari.pushNotification)) {
      return "Safari";
     }
     if (!!window.StyleMedia) {
      return "Edge";
     }
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

(function(Windows) {
 var UI;
 (function(UI) {
  var Core;
  (function(Core) {
   class SystemNavigationManager {
    constructor() {
     var that = this;
     var dispatchBackRequest = Module.mono_bind_static_method("[Uno] Windows.UI.Core.SystemNavigationManager:DispatchBackRequest");
     window.history.replaceState(0, document.title, null);
     window.addEventListener("popstate", function(evt) {
      if (that._isEnabled) {
       if (evt.state === 0) {
        window.history.pushState(1, document.title, null);
       }
       dispatchBackRequest();
      } else if (evt.state === 1) {
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
     this.clearStack();
     window.history.pushState(1, document.title, null);
     this._isEnabled = true;
    }
    disable() {
     if (!this._isEnabled) {
      return;
     }
     this._isEnabled = false;
     this.clearStack();
    }
    clearStack() {
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

(function(Windows) {
 var UI;
 (function(UI) {
  var Xaml;
  (function(Xaml) {
   class Application {
    static getDefaultSystemTheme() {
     if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return Xaml.ApplicationTheme.Dark;
     }
     if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return Xaml.ApplicationTheme.Light;
     }
     return null;
    }
   }
   Xaml.Application = Application;
  })(Xaml = UI.Xaml || (UI.Xaml = {}));
 })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));

var Windows;

(function(Windows) {
 var UI;
 (function(UI) {
  var Xaml;
  (function(Xaml) {
   let ApplicationTheme;
   (function(ApplicationTheme) {
    ApplicationTheme["Light"] = "Light";
    ApplicationTheme["Dark"] = "Dark";
   })(ApplicationTheme = Xaml.ApplicationTheme || (Xaml.ApplicationTheme = {}));
  })(Xaml = UI.Xaml || (UI.Xaml = {}));
 })(UI = Windows.UI || (Windows.UI = {}));
})(Windows || (Windows = {}));

var Windows;

(function(Windows) {
 var Phone;
 (function(Phone) {
  var Devices;
  (function(Devices) {
   var Notification;
   (function(Notification) {
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

(function(global, undefined) {
 "use strict";
 if (global.setImmediate) {
  return;
 }
 var nextHandle = 1;
 var tasksByHandle = {};
 var currentlyRunningATask = false;
 var doc = global.document;
 var registerImmediate;
 function setImmediate(callback) {
  if (typeof callback !== "function") {
   callback = new Function("" + callback);
  }
  var args = new Array(arguments.length - 1);
  for (var i = 0; i < args.length; i++) {
   args[i] = arguments[i + 1];
  }
  var task = {
   callback: callback,
   args: args
  };
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
  if (currentlyRunningATask) {
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
  registerImmediate = function(handle) {
   process.nextTick(function() {
    runIfPresent(handle);
   });
  };
 }
 function canUsePostMessage() {
  if (global.postMessage && !global.importScripts) {
   var postMessageIsAsynchronous = true;
   var oldOnMessage = global.onmessage;
   global.onmessage = function() {
    postMessageIsAsynchronous = false;
   };
   global.postMessage("", "*");
   global.onmessage = oldOnMessage;
   return postMessageIsAsynchronous;
  }
 }
 function installPostMessageImplementation() {
  var messagePrefix = "setImmediate$" + Math.random() + "$";
  var onGlobalMessage = function(event) {
   if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
    runIfPresent(+event.data.slice(messagePrefix.length));
   }
  };
  if (global.addEventListener) {
   global.addEventListener("message", onGlobalMessage, false);
  } else {
   global.attachEvent("onmessage", onGlobalMessage);
  }
  registerImmediate = function(handle) {
   global.postMessage(messagePrefix + handle, "*");
  };
 }
 function installMessageChannelImplementation() {
  var channel = new MessageChannel();
  channel.port1.onmessage = function(event) {
   var handle = event.data;
   runIfPresent(handle);
  };
  registerImmediate = function(handle) {
   channel.port2.postMessage(handle);
  };
 }
 function installReadyStateChangeImplementation() {
  var html = doc.documentElement;
  registerImmediate = function(handle) {
   var script = doc.createElement("script");
   script.onreadystatechange = function() {
    runIfPresent(handle);
    script.onreadystatechange = null;
    html.removeChild(script);
    script = null;
   };
   html.appendChild(script);
  };
 }
 function installSetTimeoutImplementation() {
  registerImmediate = function(handle) {
   setTimeout(runIfPresent, 0, handle);
  };
 }
 var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
 attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
 if ({}.toString.call(global.process) === "[object process]") {
  installNextTickImplementation();
 } else if (canUsePostMessage()) {
  installPostMessageImplementation();
 } else if (global.MessageChannel) {
  installMessageChannelImplementation();
 } else if (doc && "onreadystatechange" in doc.createElement("script")) {
  installReadyStateChangeImplementation();
 } else {
  installSetTimeoutImplementation();
 }
 attachTo.setImmediate = setImmediate;
 attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);

if (typeof window === "object" && (typeof ENVIRONMENT_IS_PTHREAD === "undefined" || !ENVIRONMENT_IS_PTHREAD)) {
 var emrun_register_handlers = function() {
  var emrun_num_post_messages_in_flight = 0;
  var emrun_should_close_itself = false;
  var postExit = function(msg) {
   var http = new XMLHttpRequest();
   http.open("POST", "stdio.html", false);
   http.send(msg);
   try {
    window.close();
   } catch (e) {}
  };
  var post = function(msg) {
   var http = new XMLHttpRequest();
   ++emrun_num_post_messages_in_flight;
   http.onreadystatechange = function() {
    if (http.readyState == 4) {
     if (--emrun_num_post_messages_in_flight == 0 && emrun_should_close_itself) postExit("^exit^" + EXITSTATUS);
    }
   };
   http.open("POST", "stdio.html", true);
   http.send(msg);
  };
  if (document.URL.search("localhost") != -1 || document.URL.search(":6931/") != -1) {
   var emrun_http_sequence_number = 1;
   var prevPrint = out;
   var prevErr = err;
   Module["addOnExit"](function() {
    if (emrun_num_post_messages_in_flight == 0) postExit("^exit^" + EXITSTATUS); else emrun_should_close_itself = true;
   });
   out = function(text) {
    post("^out^" + emrun_http_sequence_number++ + "^" + encodeURIComponent(text));
    prevPrint(text);
   };
   err = function(text) {
    post("^err^" + emrun_http_sequence_number++ + "^" + encodeURIComponent(text));
    prevErr(text);
   };
   var tryToSendPageload = function() {
    try {
     post("^pageload^");
    } catch (e) {
     setTimeout(tryToSendPageload, 50);
    }
   };
   tryToSendPageload();
  }
 };
 var emrun_file_dump = function(filename, data) {
  var http = new XMLHttpRequest();
  out('Dumping out file "' + filename + '" with ' + data.length + " bytes of data.");
  http.open("POST", "stdio.html?file=" + filename, true);
  http.send(data);
 };
 if (typeof Module !== "undefined" && typeof document !== "undefined") emrun_register_handlers();
}

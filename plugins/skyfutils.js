/*!
 * skyfutils
 * Version: 0.1.2
 * Author: huangxin
 * Group: 360 SkyEye FrontEnd
 * Build Time: 11/11/2016, 2:15:56 PM
 */


(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["skyfutils"] = factory();
	else
		root["skyfutils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/skyfutils/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _env = __webpack_require__(1);

	var _env2 = _interopRequireDefault(_env);

	var _logs = __webpack_require__(3);

	var _logs2 = _interopRequireDefault(_logs);

	var _install2 = __webpack_require__(4);

	var _install3 = _interopRequireDefault(_install2);

	var _commons = __webpack_require__(5);

	var _FileRead = __webpack_require__(6);

	var _FileRead2 = _interopRequireDefault(_FileRead);

	var _localStorage = __webpack_require__(7);

	var _localStorage2 = _interopRequireDefault(_localStorage);

	var _Notice = __webpack_require__(8);

	var _Notice2 = _interopRequireDefault(_Notice);

	var _banner = __webpack_require__(9);

	var _banner2 = _interopRequireDefault(_banner);

	var _random = __webpack_require__(11);

	var _random2 = _interopRequireDefault(_random);

	var _strBordered = __webpack_require__(12);

	var _strBordered2 = _interopRequireDefault(_strBordered);

	var _regExp = __webpack_require__(13);

	var _regExp2 = _interopRequireDefault(_regExp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  install: function install(envConfig, modulesConfig) {
	    if ((0, _install3.default)(envConfig, modulesConfig)) {
	      var envVar = null;
	      var components = {};
	      if (_env2.default._isBrowser) {
	        components[(0, _commons.getVarName)('FileRead')] = _FileRead2.default;
	        components[(0, _commons.getVarName)('LocalStorage')] = _localStorage2.default;
	        components[(0, _commons.getVarName)('Notice')] = _Notice2.default;
	        try {
	          envVar = window;
	        } catch (err) {
	          _logs2.default.error(err);
	          throw err;
	        }
	      }
	      if (_env2.default._isNode) {
	        // todo node
	        try {
	          envVar = global;
	        } catch (err) {
	          _logs2.default.error(err);
	          throw err;
	        }
	      }
	      components[(0, _commons.getVarName)('Banner')] = _banner2.default;
	      components[(0, _commons.getVarName)('Random')] = _random2.default;
	      components[(0, _commons.getVarName)('StrBordered')] = _strBordered2.default;
	      components[(0, _commons.getVarName)('RegExp')] = _regExp2.default;
	      _logs2.default.info('模块安装成功:', Object.keys(components));
	      if (_env2.default.globalInstall) {
	        if (envVar) {
	          for (var k in components) {
	            if (components.hasOwnProperty(k)) {
	              envVar[k] = components[k];
	            }
	          }
	        }
	      } else {
	        return components;
	      }
	    }
	  }
	}; /**
	    * Created by huangxinxin on 16/8/23.
	    */

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _package = __webpack_require__(2);

	var _package2 = _interopRequireDefault(_package);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  name: _package2.default.name,
	  debug: false,
	  prefix: 'SkyEye',
	  env: 'browser', // browser | node
	  globalInstall: true,
	  modulesConfig: {},
	  _isBrowser: true,
	  _isNode: false,
	  _envChoices: ['browser', 'node']
	}; /**
	    * Created by huangxinxin on 16/8/23.
	    */
	exports.default = config;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		"main": "index.js",
		"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1"
		},
		"license": "ISC",
		"name": "@qnpm/skyfutils",
		"version": "0.1.2",
		"description": "SkyFUtils 通用模块集合",
		"keywords": [
			"util",
			"module",
			"skyeye"
		],
		"author": {
			"name": "huangxin",
			"email": "huangxin-xy@360.cn"
		},
		"contributors": [
			{
				"name": "huangxin",
				"email": "huangxin-xy@360.cn"
			},
			{
				"name": "huangwei",
				"email": "j-huangwei-ty@360.cn"
			}
		],
		"maintainers": [
			{
				"name": "huangxin",
				"email": "huangxin-xy@360.cn"
			},
			{
				"name": "huangwei",
				"email": "j-huangwei-ty@360.cn"
			}
		],
		"_addons": {
			"group": "360 SkyEye FrontEnd"
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _env = __webpack_require__(1);

	var _env2 = _interopRequireDefault(_env);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var prefix = function prefix() {
	  return '[' + _env2.default.name + ', global=' + _env2.default.globalInstall + ']';
	}; /**
	    * Created by huangxinxin on 16/5/18.
	    */
	exports.default = {
	  log: function log() {
	    if (_env2.default.debug) {
	      var _console;

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [prefix()].concat(args));
	    }
	  },
	  info: function info() {
	    if (_env2.default.debug) {
	      var _console2;

	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      (_console2 = console).info.apply(_console2, [prefix()].concat(args));
	    }
	  },
	  warn: function warn() {
	    if (_env2.default.debug) {
	      var _console3;

	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      (_console3 = console).warn.apply(_console3, [prefix()].concat(args));
	    }
	  },
	  error: function error() {
	    if (_env2.default.debug) {
	      var _console4;

	      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }

	      (_console4 = console).error.apply(_console4, [prefix()].concat(args));
	    }
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var _ref$env = _ref.env;
	  var env = _ref$env === undefined ? 'browser' : _ref$env;
	  var _ref$debug = _ref.debug;
	  var debug = _ref$debug === undefined ? false : _ref$debug;
	  var _ref$prefix = _ref.prefix;
	  var prefix = _ref$prefix === undefined ? 'SkyEye' : _ref$prefix;
	  var _ref$globalInstall = _ref.globalInstall;
	  var globalInstall = _ref$globalInstall === undefined ? true : _ref$globalInstall;
	  var modulesConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  _env2.default.env = env;
	  _env2.default.debug = debug;
	  _env2.default.prefix = prefix;
	  _env2.default.globalInstall = globalInstall;
	  _env2.default.modulesConfig = modulesConfig;
	  if (_env2.default._envChoices.indexOf(_env2.default.env) === -1) {
	    _logs2.default.error('环境依赖安装失败, 原因: `' + _env2.default.env + '`不在' + _env2.default._envChoices + '中');
	    return false;
	  } else {
	    if (_env2.default.env === 'browser') {
	      _env2.default._isBrowser = true;
	      _env2.default._isNode = false;
	    } else if (_env2.default.env === 'node') {
	      _env2.default._isBrowser = false;
	      _env2.default._isNode = true;
	    }
	    _logs2.default.info('环境依赖安装成功', _env2.default);
	    return true;
	  }
	};

	var _env = __webpack_require__(1);

	var _env2 = _interopRequireDefault(_env);

	var _logs = __webpack_require__(3);

	var _logs2 = _interopRequireDefault(_logs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default']; /**
	                                      * Created by huangxinxin on 16/8/23.
	                                      */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getVarName = undefined;

	var _env = __webpack_require__(1);

	var _env2 = _interopRequireDefault(_env);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getVarName = exports.getVarName = function getVarName(name) {
	  var prefix = _env2.default.prefix;
	  name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
	  return prefix + name;
	}; /**
	    * Created by huangxinxin on 16/9/2.
	    */

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by huangxinxin on 16/9/5.
	 */

	var FileRead = function () {
	  function FileRead(files) {
	    _classCallCheck(this, FileRead);

	    this.files = files;
	    this.readTypeChoice = ['readAsArrayBuffer', 'readAsBinaryString', 'readAsDataURL', 'readAsText'];
	    return this;
	  }

	  _createClass(FileRead, [{
	    key: 'filter',
	    value: function filter(callback) {
	      this.filterCallback = callback;

	      return this;
	    }
	  }, {
	    key: 'readAs',
	    value: function readAs(type) {
	      if (this.readTypeChoice.indexOf(type) === -1) {
	        throw new Error('readAs type not in ' + JSON.stringify(this.readTypeChoice));
	      }
	      this.readType = type;
	      return this;
	    }
	  }, {
	    key: 'onReadStart',
	    value: function onReadStart(callback) {
	      this.onLoadStartCallback = callback;
	      return this;
	    }
	  }, {
	    key: 'onReadEnd',
	    value: function onReadEnd(callback) {
	      this.onLoadEndCallback = callback;
	      return this;
	    }
	  }, {
	    key: 'read',
	    value: function read() {
	      var self = this;
	      if (this.files instanceof FileList) {
	        for (var i = 0; i < this.files.length; i++) {
	          var file = this.files[i];
	          if (file instanceof File) {
	            _read(file);
	          }
	        }
	      } else if (this.files instanceof File) {
	        _read(this.files);
	      }

	      function _read(f) {
	        var reader = new FileReader();
	        if (reader[self.readType] instanceof Function) {
	          reader[self.readType](f);
	          if (self.filterCallback instanceof Function && self.filterCallback(f) || !self.filterCallback) {
	            reader.onloadstart = function (e) {
	              self.onLoadStartCallback instanceof Function && self.onLoadStartCallback(e, f);
	            };
	            reader.onloadend = function (e) {
	              self.onLoadEndCallback instanceof Function && self.onLoadEndCallback(e, f, e.target.result);
	            };
	          }
	        }
	      }
	    }
	  }]);

	  return FileRead;
	}();

	exports.default = FileRead;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by huangxinxin on 16/9/5.
	 */
	exports.default = {
	  set: function set(key, value) {
	    try {
	      window.localStorage.setItem(key, JSON.stringify(value));
	      return true;
	    } catch (err) {
	      throw err;
	    }
	  },
	  get: function get(key) {
	    var str = window.localStorage.getItem(key);
	    return JSON.parse(str);
	  },
	  remove: function remove(key) {
	    delete window.localStorage[key];
	  },
	  clear: function clear() {
	    for (var key in window.localStorage) {
	      delete window.localStorage[key];
	    }
	  },
	  getAll: function getAll() {
	    return window.localStorage;
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by huangxinxin on 16/9/2.
	 */
	var requestPermission = Symbol('requestPermission');
	var newNotification = Symbol('newNotification');

	var Notice = function () {
	  function Notice() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref$noPermissionMess = _ref.noPermissionMessage;
	    var noPermissionMessage = _ref$noPermissionMess === undefined ? 'Sorry, 没有桌面通知的权限' : _ref$noPermissionMess;

	    _classCallCheck(this, Notice);

	    this.permission = false;
	    this.noPermissionMessage = noPermissionMessage;
	    this.onclick = null;
	    this.onerror = null;
	    this.onclose = null;
	    this.onshow = null;
	    this[requestPermission]();
	    this.setEvents();
	    this.setOptions();
	    return this;
	  }

	  /**
	   * @param onclick
	   * @param onerror
	   * @param onclose
	   * @param onshow
	   * @returns {Notice}
	   */


	  _createClass(Notice, [{
	    key: 'setEvents',
	    value: function setEvents() {
	      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var _ref2$onclick = _ref2.onclick;
	      var onclick = _ref2$onclick === undefined ? null : _ref2$onclick;
	      var _ref2$onerror = _ref2.onerror;
	      var onerror = _ref2$onerror === undefined ? null : _ref2$onerror;
	      var _ref2$onclose = _ref2.onclose;
	      var onclose = _ref2$onclose === undefined ? null : _ref2$onclose;
	      var _ref2$onshow = _ref2.onshow;
	      var onshow = _ref2$onshow === undefined ? null : _ref2$onshow;

	      this.onclick = onclick;
	      this.onerror = onerror;
	      this.onclose = onclose;
	      this.onshow = onshow;
	      return this;
	    }

	    /**
	     * @param dir  文本方向, 默认auto, 可以是ltr或rtl
	     * @param lang 提示的语言, 默认UTF-8
	     * @param body 提示主体内容(字符串)
	     * @param tag  当前通知的唯一标识(字符串)
	     * @param icon 图标地址(字符串)
	     * @param data 和通知相关联的数据(任意类型), 通过事件回调函数参数进行访问
	     * @param renotify 新通知出现的时候是否替换之前的(布尔型), 默认false, 必须配合tag进行使用, 设置一致的tag才能进行替换
	     * @returns {Notice}
	     */

	  }, {
	    key: 'setOptions',
	    value: function setOptions() {
	      var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var _ref3$dir = _ref3.dir;
	      var dir = _ref3$dir === undefined ? 'auto' : _ref3$dir;
	      var _ref3$lang = _ref3.lang;
	      var lang = _ref3$lang === undefined ? 'UTF-8' : _ref3$lang;
	      var _ref3$body = _ref3.body;
	      var body = _ref3$body === undefined ? '' : _ref3$body;
	      var _ref3$tag = _ref3.tag;
	      var tag = _ref3$tag === undefined ? '' : _ref3$tag;
	      var _ref3$icon = _ref3.icon;
	      var icon = _ref3$icon === undefined ? '' : _ref3$icon;
	      var _ref3$data = _ref3.data;
	      var data = _ref3$data === undefined ? '' : _ref3$data;
	      var _ref3$renotify = _ref3.renotify;
	      var renotify = _ref3$renotify === undefined ? false : _ref3$renotify;

	      this.options = {
	        dir: dir, lang: lang, body: body, tag: tag, icon: icon, data: data, renotify: renotify
	      };
	      return this;
	    }

	    /**
	     * @param title
	     * @param options
	     * @param onclick
	     * @param onerror
	     * @param onclose
	     * @param onshow
	     * @returns {*}
	     */

	  }, {
	    key: 'show',
	    value: function show(title, options) {
	      var _ref4 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      var _ref4$onclick = _ref4.onclick;
	      var onclick = _ref4$onclick === undefined ? null : _ref4$onclick;
	      var _ref4$onerror = _ref4.onerror;
	      var onerror = _ref4$onerror === undefined ? null : _ref4$onerror;
	      var _ref4$onclose = _ref4.onclose;
	      var onclose = _ref4$onclose === undefined ? null : _ref4$onclose;
	      var _ref4$onshow = _ref4.onshow;
	      var onshow = _ref4$onshow === undefined ? null : _ref4$onshow;

	      options = Object.assign({}, this.options, options);
	      if (Notification.permission === 'granted') {
	        return this[newNotification](title, options, onclick, onerror, onclose, onshow);
	      }
	      return null;
	    }
	  }, {
	    key: requestPermission,
	    value: function value() {
	      Notification.requestPermission(function (permission) {
	        if (permission === 'granted') {
	          this.permission = true;
	        } else {
	          console.warn(this.noPermissionMessage);
	        }
	      }.bind(this));
	      return this;
	    }
	  }, {
	    key: newNotification,
	    value: function value(title, options, onclick, onerror, onclose, onshow) {
	      var instance = new Notification(title, options);

	      if (onclick instanceof Function) {
	        instance.onclick = onclick;
	      } else if (this.onclick instanceof Function) {
	        instance.onclick = this.onclick;
	      }

	      if (onerror instanceof Function) {
	        instance.onerror = onerror;
	      } else if (this.onerror instanceof Function) {
	        instance.onerror = this.onerror;
	      }

	      if (onclose instanceof Function) {
	        instance.onclose = onclose;
	      } else if (this.onclose instanceof Function) {
	        instance.onclose = this.onclose;
	      }

	      if (onshow instanceof Function) {
	        instance.onshow = onshow;
	      } else if (this.onshow instanceof Function) {
	        instance.onshow = this.onshow;
	      }

	      return instance;
	    }
	  }]);

	  return Notice;
	}();

	exports.default = Notice;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Created by huangxinxin on  6/9/2.
	                                                                                                                                                                                                                                                   */


	exports.default = function (str) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var _ref$scale = _ref.scale;
	  var scale = _ref$scale === undefined ? 1 : _ref$scale;
	  var _ref$wordSpace = _ref.wordSpace;
	  var wordSpace = _ref$wordSpace === undefined ? 4 : _ref$wordSpace;
	  var _ref$notPrint = _ref.notPrint;
	  var notPrint = _ref$notPrint === undefined ? false : _ref$notPrint;

	  if (['string', 'number'].indexOf(typeof str === 'undefined' ? 'undefined' : _typeof(str)) === -1) {
	    throw new Error('第一个参数`str`类型错误, 类型必须是string或number');
	  }
	  str = str || 'skyeye';
	  str = str.toUpperCase();
	  scale = +scale;
	  wordSpace = +wordSpace;
	  scale = isNaN(scale) ? 1 : scale || 1;
	  wordSpace = isNaN(wordSpace) ? 4 : wordSpace;
	  if (scale > 3) {
	    scale = 3;
	  } else if (scale < 1) {
	    scale = 1;
	  }
	  if (wordSpace > 8) {
	    wordSpace = 8;
	  } else if (wordSpace < 0) {
	    wordSpace = 0;
	  }
	  var wordSpaceStr = ' '.repeat(wordSpace);
	  var inputArr = str.split('');
	  var result = [];
	  for (var i = 0; i < scale * baseSize; i++) {
	    result[i] = '';
	  }
	  inputArr.forEach(function (character) {
	    if (_bannerDict2.default[character]) {
	      var charArr = scaledLetter(_bannerDict2.default[character], scale);
	      for (var _i = 0; _i < charArr.length; _i++) {
	        result[_i] += wordSpaceStr + charArr[_i];
	      }
	    }
	  });
	  str = getJointStr(result);
	  if (notPrint) {
	    return str;
	  }
	  console.log(str);
	};

	var _bannerDict = __webpack_require__(10);

	var _bannerDict2 = _interopRequireDefault(_bannerDict);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 基元字母大小
	var baseSize = 7;

	/**
	 * 返回输入字符串对应的像素化字符
	 * @param str 输入字符串
	 * @param scale 缩放倍数
	 * @param wordSpace 字符间距
	 * @param notPrint  是否不打印
	 * @returns String
	 */


	/**
	 * 得到字母缩放scaleTimes倍数后的字母
	 * @param letterArr
	 * @param scaleTimes
	 * @returns {Array}
	 */
	function scaledLetter(letterArr, scaleTimes) {
	  var scaleSize = baseSize * scaleTimes;
	  var twoDimArrBefore = [];
	  letterArr.forEach(function (row) {
	    twoDimArrBefore.push(row.split(''));
	  });
	  var twoDimArrAfter = [];
	  for (var i = 0; i < scaleSize; i++) {
	    twoDimArrAfter[i] = [];
	    for (var j = 0; j < scaleSize; j++) {
	      twoDimArrAfter[i][j] = ' ';
	    }
	  }
	  var result = [];
	  for (var _i2 = 0; _i2 < baseSize; _i2++) {
	    for (var _j = 0; _j < baseSize; _j++) {
	      twoDimArrAfter[_i2 * scaleTimes][_j * scaleTimes] = twoDimArrBefore[_i2][_j];
	    }
	    result.push(twoDimArrAfter[_i2 * scaleTimes].join(''));
	    for (var k = 1; k < scaleTimes; k++) {
	      result.push(twoDimArrAfter[_i2 * scaleTimes + scaleTimes - k].join(''));
	    }
	  }
	  return result;
	}

	/**
	 * 得到一位数组的拼接字符串
	 * @param arr
	 * @returns {string}
	 */
	function getJointStr(arr) {
	  return '\n' + arr.join('\n') + '\n';
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  A: ['  ***  ', ' *   * ', '*     *', '* * * *', '*     *', '*     *', '*     *'],
	  B: ['****** ', '*     *', '*     *', '* * * *', '*     *', '*     *', '****** '],
	  C: [' ******', '*      ', '*      ', '*      ', '*      ', '*      ', ' ***** '],
	  D: ['****** ', '*     *', '*     *', '*     *', '*     *', '*     *', '****** '],
	  E: ['*******', '*      ', '*      ', '*******', '*      ', '*      ', '*******'],
	  F: ['*******', '*      ', '*      ', '*******', '*      ', '*      ', '*      '],
	  G: ['*******', '*      ', '*      ', '*  ****', '*     *', '*     *', '*******'],
	  H: ['*     *', '*     *', '*     *', '*******', '*     *', '*     *', '*     *'],
	  I: ['*******', '   *   ', '   *   ', '   *   ', '   *   ', '   *   ', '*******'],
	  J: ['*******', '    *  ', '    *  ', '    *  ', '    *  ', '*   *  ', ' **    '],
	  K: ['*     *', '*   *  ', '* *    ', '*      ', '* *    ', '*   *  ', '*     *'],
	  L: ['*      ', '*      ', '*      ', '*      ', '*      ', '*      ', '*******'],
	  M: ['*     *', '* * * *', '*  *  *', '*     *', '*     *', '*     *', '*     *'],
	  N: ['*     *', '**    *', '* *   *', '*  *  *', '*   * *', '*    **', '*     *'],
	  O: [' ***** ', '*     *', '*     *', '*     *', '*     *', '*     *', ' ***** '],
	  P: ['****** ', '*     *', '*     *', '****** ', '*      ', '*      ', '*      '],
	  Q: [' ****  ', '*    * ', '*    * ', '*    * ', '*    * ', '*    * ', ' ******'],
	  R: ['****** ', '*     *', '*     *', '****** ', '*  *   ', '*   *  ', '*    * '],
	  S: ['*******', '*      ', '*      ', '*******', '      *', '      *', '*******'],
	  T: ['*******', '   *   ', '   *   ', '   *   ', '   *   ', '   *   ', '   *   '],
	  U: ['*     *', '*     *', '*     *', '*     *', '*     *', '*     *', ' ***** '],
	  V: ['*     *', '*     *', '*     *', '*     *', ' *   * ', '  * *  ', '   *   '],
	  W: ['*     *', '*     *', '*     *', '*     *', '*  *  *', '* * * *', '*     *'],
	  X: ['*     *', ' *   * ', '  * *  ', '   *   ', '  * *  ', ' *   * ', '*     *'],
	  Y: ['*     *', '*     *', '*     *', '  * *  ', '   *   ', '   *   ', '   *   '],
	  Z: ['*******', '     * ', '    *  ', '   *   ', '  *    ', ' *     ', '*******'],
	  1: ['   *   ', ' * *   ', '   *   ', '   *   ', '   *   ', '   *   ', '  ***  '],
	  2: [' ***** ', '*     *', '      *', '     * ', '* * *  ', '*      ', '*******'],
	  3: ['*******', '     * ', '    *  ', '  ***  ', '      *', '*     *', ' ***** '],
	  4: ['     * ', '   * * ', '  *  * ', ' *   * ', '*******', '     * ', '     * '],
	  5: ['*******', '*      ', '****** ', '      *', '      *', '*     *', ' ***** '],
	  6: [' ***** ', '*     *', '*      ', '* * * *', '*     *', '*     *', ' ***** '],
	  7: ['*******', '      *', '    *  ', '  *    ', '*      ', '*      ', '*      '],
	  8: [' ***** ', '*     *', '*     *', '* * * *', '*     *', '*     *', ' ***** '],
	  9: [' ***** ', '*     *', '*     *', '  * * *', '      *', '*     *', ' ***** '],
	  0: [' ***** ', '*     *', '*   * *', '*  *  *', '* *   *', '*    *', ' ***** ']
	};
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by huangxinxin on 16/9/5.
	 */

	// 随机颜色
	function _rgba(a) {
	  var r = _int(255);
	  var g = _int(255);
	  var b = _int(255);
	  a = a && !isNaN(+a) ? a : Math.random();
	  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	}

	// 随机整数
	function _int(num) {
	  num = num && !isNaN(+num) ? num : 100;
	  return parseInt(Math.random() * num);
	}

	function _id() {
	  var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	  var pow = arguments.length <= 1 || arguments[1] === undefined ? 32 : arguments[1];

	  prefix = typeof prefix === 'string' ? prefix : '';
	  pow = pow && !isNaN(+pow) ? pow : 32;
	  if (pow < 0) pow = 1;
	  if (pow > 32) pow = 32;
	  return prefix + +new Date() + '' + Math.abs(~~(Math.random() * Math.pow(2, pow)));
	}

	exports.default = {
	  id: _id,
	  int: _int,
	  rgba: _rgba
	};
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (str, notPrint) {
	  str = '| ' + str.replace(/\n/g, ' ').replace(/\t/g, ' ') + ' |';
	  var str1 = '\n' + '-'.repeat(str.length) + '\n';
	  if (notPrint) {
	    return str1 + str + str1;
	  }
	  console.log(str1 + str + str1);
	};

	module.exports = exports['default']; /**
	                                      * Created by huangxinxin on 16/9/2.
	                                      * 字符串加边框(不支持中文)
	                                      */

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var regDict = {
	  id: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
	  email: /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i,
	  mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
	  tel: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
	  ipv4: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
	  md5: /^[a-z0-9]{32}$/,
	  url: /^((https|http):\/\/)?(((([0-9]|1[0-9]{2}|[1-9][0-9]|2[0-4][0-9]|25[0-5])[.]{1}){3}([0-9]|1[0-9]{2}|[1-9][0-9]|2[0-4][0-9]|25[0-5]))|([0-9a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D-]+[.]{1})+[a-zA-Z-]+)(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().?:@&=+$,%#-]+)+\/?){1}/,
	  clearSymbol: /[ |~|`|!|@|#|\$|%|\^|&|\*|\(|\)|\-|_|\+|=|\||\\|\[|\]|\{|\}|\|:|"|'|,|<|\.|>|\/|\?]/g
	};

	var regValidator = {};

	regValidator.isId = function (v) {
	  return regDict.id.test(v);
	};
	regValidator.isEmail = function (v) {
	  return regDict.email.test(v);
	};
	regValidator.isMobile = function (v) {
	  return regDict.mobile.test(v);
	};
	regValidator.isTel = function (v) {
	  return regDict.tel.test(v);
	};
	regValidator.isIpv4 = function (v) {
	  return regDict.ipv4.test(v);
	};
	regValidator.isMd5 = function (v) {
	  return regDict.md5.test(v);
	};
	regValidator.isUrl = function (v) {
	  return regDict.url.test(v);
	};
	regValidator.isClearSymbol = function (v) {
	  return regDict.clearSymbol.test(v);
	};
	regValidator.testRegExp = function (exp, str) {
	  if (exp.substring(0, 1) === '/' && exp.substring(exp.length - 1, exp.length) === '/') {
	    exp = exp.substring(1, exp.length - 1);
	  }
	  return new RegExp(exp).test(str);
	};

	exports.default = regValidator;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=skyfutils.js.map
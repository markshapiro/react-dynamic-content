(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("lodash"), require("react-addons-update"), require("rx"), require("jquery"), require("react-addons-css-transition-group"), require("jquery.waitforimages"));
	else if(typeof define === 'function' && define.amd)
		define("DynamicContent", ["react", "react-dom", "lodash", "react-addons-update", "rx", "jquery", "react-addons-css-transition-group", "jquery.waitforimages"], factory);
	else if(typeof exports === 'object')
		exports["DynamicContent"] = factory(require("react"), require("react-dom"), require("lodash"), require("react-addons-update"), require("rx"), require("jquery"), require("react-addons-css-transition-group"), require("jquery.waitforimages"));
	else
		root["DynamicContent"] = factory(root["react"], root["react-dom"], root["lodash"], root["react-addons-update"], root["rx"], root["jquery"], root["react-addons-css-transition-group"], root["jquery.waitforimages"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__) {
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
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	var _reactAddonsUpdate = __webpack_require__(5);

	var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

	var _rx = __webpack_require__(6);

	var _rx2 = _interopRequireDefault(_rx);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _reactAddonsCssTransitionGroup = __webpack_require__(8);

	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(9);

	var mouseUp$ = _rx2.default.Observable.merge(_rx2.default.Observable.fromEvent(document, "mouseup"), _rx2.default.Observable.fromEvent(document, "touchend")),
	    mouseMoves$ = _rx2.default.Observable.merge(_rx2.default.Observable.fromEvent(document, "mousemove"), _rx2.default.Observable.fromEvent(document, "touchmove").map(function (e) {
	  return _lodash2.default.extend(e, e.touches[0]);
	}));

	var imgState = {
	  PENDING: 'PENDING', //pending to start loading (not queued for loading yet)
	  LOADING: 'LOADING', //loading (invisible) (before onLoad or onError call)
	  FAILED: 'FAILED', //failed to load (after onError call)
	  NOT_POSITIONED: 'NOT_POSITIONED', //loaded (and still invisible) but not positioned yet (directly after onLoad call)
	  FINISHED: 'FINISHED' //final phase (positioned and is should be displayed)
	};

	var LOADING_QUEUE_SIZE = 15; //max num of elements loading simultaneously (loading from top to bottom)

	var repositionMethods = { //resize & reposition methods for each layout option
	  cascading: utils.repositionCascadingLayout,
	  images: utils.repositionImagesLayout
	};

	var propsThatTriggerRender = ["layout", "numOfColumns", "columnWidth", "maxHeight", "verticalCellSpacing", "horizontalCellSpacing"];
	var propsPassed2positionMethods = ["maxHeight", "numOfColumns", "columnWidth", "verticalCellSpacing", "horizontalCellSpacing"];

	var WrappingElement = function () {
	  function WrappingElement(elm) {
	    var _this = this;

	    _classCallCheck(this, WrappingElement);

	    this.elm = elm;
	    this.ref = _lodash2.default.uniqueId();
	    this.state = imgState.PENDING;
	    this._renderedElm = new Promise(function (resolve, reject) {
	      _this._resolveRenderedElm = resolve;
	    });
	  }

	  _createClass(WrappingElement, [{
	    key: 'assignRenderedElm',
	    value: function assignRenderedElm(elm) {
	      this._resolveRenderedElm(elm);
	      this.renderedElmResult = elm;
	    }
	  }, {
	    key: 'getRenderedElm',
	    value: function getRenderedElm() {
	      return this._renderedElm;
	    }
	  }, {
	    key: 'isPresent',
	    value: function isPresent() {
	      return this.state === imgState.FINISHED || this.state === imgState.NOT_POSITIONED;
	    }
	  }, {
	    key: 'isVisible',
	    value: function isVisible() {
	      return this.state === imgState.FINISHED;
	    }
	  }]);

	  return WrappingElement;
	}();

	var InlineElement = function (_Component) {
	  _inherits(InlineElement, _Component);

	  function InlineElement(props) {
	    _classCallCheck(this, InlineElement);

	    return _possibleConstructorReturn(this, (InlineElement.__proto__ || Object.getPrototypeOf(InlineElement)).call(this, props));
	  }

	  _createClass(InlineElement, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _this3 = this;

	      this.props.elmData.getRenderedElm().then(function (elm) {
	        elm.classList.toggle('displayNone', true);
	        var failed = false;
	        (0, _jquery2.default)(elm).waitForImages({
	          each: function each(loaded, count, success) {
	            if (!success) {
	              failed = true;
	            }
	          },
	          finished: function finished() {
	            return failed ? _this3.props.onError() : _this3.props.onLoad();
	          },
	          waitForAll: true
	        });
	        elm.addEventListener("mouseup", _this3.props.onEventDesktop);
	        elm.addEventListener("mousemove", _this3.props.onEventDesktop);
	        elm.addEventListener("mousedown", _this3.props.onEventDesktop);
	        elm.addEventListener("touchstart", _this3.props.onEventMobile);
	        elm.addEventListener("touchmove", _this3.props.onEventMobile);
	        elm.addEventListener("touchend", _this3.props.onEventMobile);
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      if (!this.renderedOnce) {
	        this.renderedOnce = true;
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.props.elmData.getRenderedElm().then(function (elm) {
	        var newClassList = nextProps.className.trim().split(/\s+/g);
	        ['dragging', 'visible'].forEach(function (cname) {
	          return elm.classList.toggle(cname, newClassList.indexOf(cname) >= 0);
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.elmData.elm;
	    }
	  }]);

	  return InlineElement;
	}(_react.Component);

	var DynamicContent = function (_Component2) {
	  _inherits(DynamicContent, _Component2);

	  function DynamicContent(props) {
	    _classCallCheck(this, DynamicContent);

	    var _this4 = _possibleConstructorReturn(this, (DynamicContent.__proto__ || Object.getPrototypeOf(DynamicContent)).call(this, props));

	    _initialiseProps.call(_this4);

	    _this4.state = {
	      data: []
	    };
	    return _this4;
	  } //streams of elements loadings (onLoad) successes or failures
	  //stream of mouse/tap events on elements


	  _createClass(DynamicContent, [{
	    key: 'componentWillMount',
	    //initial css of elements, to revert back before layout switch

	    value: function componentWillMount() {
	      var _this5 = this;

	      //stream of sequences of loaded element refs
	      var nextLoadedElements$ = this.elmLoaded$.scan(function (acc, elm) {
	        return acc.concat(elm);
	      }, []).map(function (arr) {
	        return _this5.getFirstLoadedElements(arr);
	      }).filter(function (arr) {
	        return arr.length;
	      }).shareReplay(1);

	      //flow of making loaded elements visible and queuing next elements for to loading queue
	      nextLoadedElements$.buffer(nextLoadedElements$.debounce(150)) //nextLoadedElements$ debounced and buffered
	      .map(function (arrs) {
	        return _lodash2.default.uniq(_lodash2.default.flatten(arrs));
	      }).map(function (arr) {
	        return _this5.setElementsStateAfterLoaded(_this5.state.data, arr, imgState.NOT_POSITIONED, imgState.FAILED);
	      }).map(function (data) {
	        return _this5.queueNext(data);
	      }).subscribe(function (data) {
	        return _this5.setState({ data: data });
	      });

	      //stream of results of confirmElementDrag(event) applied on events from this.elmEvent$
	      var event2resultOfConfirmDrag$ = this.elmEvent$.do(function (_ref) {
	        var e = _ref.e;
	        return e.preventDefault();
	      }).map(function (_ref2) {
	        var e = _ref2.e,
	            ref = _ref2.ref;

	        var elmDataIndex = _lodash2.default.findIndex(_this5.state.data, function (elm) {
	          return elm.ref === ref;
	        });
	        return {
	          data: { e: _lodash2.default.extend({}, e), ref: ref },
	          res: (_this5.props.confirmElementDrag || function (e) {
	            return e.type === "mousedown" || e.type === "touchstart";
	          })(e, elmDataIndex)
	        };
	      }).shareReplay(1);

	      //stream for dragging elements after drag confirmation received
	      event2resultOfConfirmDrag$.startWith({ res: false })
	      //first we need to receive confirmation
	      .flatMap(function (_ref3) {
	        var data = _ref3.data,
	            res = _ref3.res;
	        return (utils.isPromise(res) ? _rx2.default.Observable.fromPromise(res.then(function (promRes) {
	          return { data: data, res: promRes };
	        }).catch(function () {
	          return false;
	        })) : _rx2.default.Observable.from([{ data: data, res: res }])).
	        //all later results (that were pushed after) should cancel all deferring (promise) results that were pushed before
	        takeUntil(event2resultOfConfirmDrag$.flatMap(function (_ref4) {
	          var data = _ref4.data,
	              res = _ref4.res;
	          return utils.isPromise(res) ? _rx2.default.Observable.fromPromise(res.catch(function () {
	            return false;
	          })) : _rx2.default.Observable.from([res]);
	        }).filter(function (x) {
	          return !x;
	        }));
	      }).pairwise().filter(function (arr) {
	        return !arr[0].res && arr[1].res;
	      }).map(function (arr) {
	        return arr[1];
	      }).do(function (_ref5) {
	        var data = _ref5.data;
	        return _this5.onElementDown(data);
	      }).flatMap(function (_ref6) {
	        var data = _ref6.data;
	        return mouseMoves$.do(function (e) {
	          return _this5.onElementMove(e, data);
	        }).takeUntil(mouseUp$.withLatestFrom(mouseMoves$.startWith(data.e), function (upEvt, mvEvt) {
	          return mvEvt;
	        }).do(function (data) {
	          return _this5.onElementDrop(data);
	        }));
	      }).subscribe(function () {});

	      var data = this.props.elements.map(function (el) {
	        return new WrappingElement(el);
	      });
	      this.setState({ data: this.queueNext(data) });
	    }
	  }, {
	    key: 'onElementDown',
	    value: function onElementDown(data) {
	      var elmDataIndex = _lodash2.default.findIndex(this.state.data, function (elm) {
	        return elm.ref === data.ref;
	      });
	      var initOffset = utils.getWindowOffset(this.findDOMNode(data.ref));
	      data.initOffset = initOffset;
	      this.setState({
	        data: (0, _reactAddonsUpdate2.default)(this.state.data, _defineProperty({}, elmDataIndex, { isDragging: { $set: true } }))
	      });
	    }

	    //forcefully place element under cursor to prevent misplacement in case of scroll change or delay

	  }, {
	    key: 'onElementMove',
	    value: function onElementMove(evt, data) {
	      var elm = this.findDOMNode(data.ref);
	      var currOffset = utils.getWindowOffset(elm);
	      var diffX = currOffset.left - data.initOffset.left - (evt.clientX - data.e.clientX);
	      var diffY = currOffset.top - data.initOffset.top - (evt.clientY - data.e.clientY);
	      elm.style.left = elm.offsetLeft - diffX + "px";
	      elm.style.top = elm.offsetTop - diffY + "px";
	    }
	  }, {
	    key: 'onElementDrop',
	    value: function onElementDrop(evt) {
	      if (_lodash2.default.findIndex(this.state.data, function (elm) {
	        return elm.isDragging;
	      }) === -1) {
	        return;
	      }
	      var elmInd = _lodash2.default.findIndex(this.state.data, function (elm) {
	        return elm.isDragging;
	      }),
	          elmRecent = this.state.data[elmInd],
	          data = this.state.data,
	          otherRef = null;
	      _lodash2.default.each(this.state.data, function (elm) {
	        if (!elm.isDragging && elm.isVisible()) {
	          var offs = utils.getWindowOffset(elm.renderedElmResult);
	          if (elm.renderedElmResult.offsetHeight + offs.top > evt.clientY && offs.top < evt.clientY && elm.renderedElmResult.offsetWidth + offs.left > evt.clientX && offs.left < evt.clientX) {
	            otherRef = elm.ref;
	          }
	        }
	      });
	      if (otherRef) {
	        data = (0, _reactAddonsUpdate2.default)(data, {
	          $splice: [[elmInd, 1]]
	        });
	        var maxElmInd = _lodash2.default.findIndex(data, function (el) {
	          return el.ref === otherRef;
	        });
	        data = (0, _reactAddonsUpdate2.default)(data, {
	          $splice: [[maxElmInd, 0, elmRecent]]
	        });
	      }
	      var newElmInd = _lodash2.default.findIndex(data, function (elm) {
	        return elm.isDragging;
	      });
	      data = (0, _reactAddonsUpdate2.default)(data, _defineProperty({}, newElmInd, { isDragging: { $set: false } }));
	      elmRecent.renderedElmResult.classList.toggle('dragging', false);
	      this.setState({ data: data });
	      if (otherRef && this.props.onChange) {
	        this.props.onChange(data.map(function (w) {
	          return w.elm;
	        }));
	      }
	    }
	  }, {
	    key: 'getFirstLoadedElements',
	    value: function getFirstLoadedElements(arr) {
	      var _this6 = this;

	      var result = [];
	      _lodash2.default.takeWhile(this.state.data, function (elm, ind) {
	        if (elm.state !== imgState.LOADING) {
	          return true;
	        }
	        var data = _lodash2.default.find(arr, function (d) {
	          return d.ref === _this6.state.data[ind].ref;
	        });
	        if (data) {
	          result.push(data);
	        }
	        return data;
	      });
	      return result;
	    }
	  }, {
	    key: 'queueNext',
	    value: function queueNext(data) {
	      var current = _lodash2.default.filter(data, function (e) {
	        return e.state == imgState.LOADING;
	      }).length;
	      var toQueueSize = LOADING_QUEUE_SIZE - current;
	      var updateStatement = {};
	      _lodash2.default.takeWhile(data, function (elm, ind) {
	        if (elm.state === imgState.PENDING) {
	          toQueueSize--;
	          updateStatement[ind] = { state: { $set: imgState.LOADING } };
	        }
	        return toQueueSize;
	      });
	      return (0, _reactAddonsUpdate2.default)(data, updateStatement);
	    }
	  }, {
	    key: 'setElementsStateAfterLoaded',
	    value: function setElementsStateAfterLoaded(data, arr, successState, failedState) {
	      var updateStatement = {};
	      _lodash2.default.each(arr, function (elm) {
	        var index = _lodash2.default.findIndex(data, function (e) {
	          return e.ref === elm.ref;
	        });
	        if (index >= 0 && elm.success && successState) {
	          updateStatement[index] = { state: { $set: successState } };
	        } else if (index >= 0 && failedState) {
	          updateStatement[index] = { state: { $set: failedState } };
	        }
	      });
	      return (0, _reactAddonsUpdate2.default)(data, updateStatement);
	    }
	  }, {
	    key: 'reposition',
	    value: function reposition() {
	      var wrapper = (0, _reactDom.findDOMNode)(this.refs.wrapper),
	          renderedElms = {},
	          props = _lodash2.default.extend({ parentWidth: wrapper.clientWidth }, _lodash2.default.pick(this.props, propsPassed2positionMethods));
	      this.state.data.forEach(function (elmData, elmInd) {
	        if (elmData.isPresent() && !elmData.isDragging) {
	          renderedElms[elmInd] = elmData.renderedElmResult;
	          if (elmData.state === imgState.NOT_POSITIONED) {
	            renderedElms[elmInd].classList.toggle('displayNone', false);
	            renderedElms[elmInd].classList.toggle('positionAbsolute', true);
	          }
	        }
	      });
	      if (this.props.layout !== 'custom') {
	        repositionMethods[this.props.layout](renderedElms, props);
	      } else {
	        this.props.customLayoutMethod(renderedElms, props);
	      }
	      this.makeNotPositionedFinished();
	    }
	  }, {
	    key: 'makeNotPositionedFinished',
	    value: function makeNotPositionedFinished() {
	      var updateStatement = {};
	      this.state.data.forEach(function (elmData, elmInd) {
	        if (elmData.isPresent() && !elmData.isDragging) {
	          if (elmData.state === imgState.NOT_POSITIONED) {
	            updateStatement[elmInd] = {
	              state: { $set: imgState.FINISHED }
	            };
	          }
	        }
	      });
	      if (_lodash2.default.keys(updateStatement).length > 0) {
	        this.setState({ data: (0, _reactAddonsUpdate2.default)(this.state.data, updateStatement) });
	      }
	    }
	  }, {
	    key: 'findDOMNode',
	    value: function findDOMNode(ref) {
	      var elm = _lodash2.default.find(this.state.data, function (elm) {
	        return elm.ref === ref;
	      });
	      return elm && elm.renderedElmResult;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this7 = this;

	      console.debug("render");
	      return _react2.default.createElement(
	        _reactAddonsCssTransitionGroup2.default,
	        { transitionAppear: true,
	          transitionEnterTimeout: 0, transitionLeaveTimeout: 0,
	          transitionName: 'fadeInOut', ref: 'wrapper', className: 'CustomContentWrapper' },
	        this.state.data.filter(function (elm) {
	          return elm.state !== imgState.PENDING;
	        }).map(function (elm, index) {
	          return _react2.default.createElement(InlineElement, { elmData: elm, key: elm.ref,
	            onLoad: function onLoad() {
	              return _this7.elmLoaded$.onNext({ ref: elm.ref, success: true });
	            },
	            onError: function onError() {
	              return _this7.elmLoaded$.onNext({ ref: elm.ref, success: false });
	            },
	            onEventDesktop: function onEventDesktop(e) {
	              return _this7.elmEventDesktop(e, elm);
	            },
	            onEventMobile: function onEventMobile(e) {
	              return _this7.elmEventMobile(e, elm);
	            },
	            className: (elm.isDragging && 'dragging') + ' ' + (elm.isVisible() && 'visible') });
	        })
	      );
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this8 = this;

	      if (!_lodash2.default.isEqual(this.props.elements, nextProps.elements)) {
	        var data = nextProps.elements.map(function (elm) {
	          var found = _lodash2.default.find(_this8.state.data, function (elm2) {
	            return elm2.elm === elm;
	          });
	          return found ? found : new WrappingElement(elm);
	        });
	        this.setState({ data: this.queueNext(data) });
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      var _this9 = this;

	      if (this.shouldReposition(prevProps, prevState)) {
	        if (this.props.layout !== prevProps.layout) {
	          //if layout switch then reset height/width to initial
	          this.state.data.filter(function (elm) {
	            return elm.isVisible();
	          }).forEach(function (_ref7) {
	            var ref = _ref7.ref;

	            var elm = _this9.findDOMNode(ref);
	            elm.style.height = _this9.initialCss[ref].height;
	            elm.style.width = _this9.initialCss[ref].width;
	            elm.style.position = _this9.initialCss[ref].position;
	          });
	        }
	        this.repositionThrottled();
	      }
	      this.assignRenderedElms();
	    }
	  }, {
	    key: 'assignRenderedElms',
	    value: function assignRenderedElms() {
	      var _this10 = this;

	      var children = (0, _reactDom.findDOMNode)(this.refs.wrapper).children;
	      this.state.data.filter(function (elm) {
	        return elm.state !== imgState.PENDING;
	      }).forEach(function (elmData, ind) {
	        if (!elmData.renderedElmResult) {
	          elmData.assignRenderedElm(children[ind]);
	          _this10.initialCss[elmData.ref] = {
	            height: children[ind].style.height,
	            width: children[ind].style.width,
	            position: children[ind].style.position
	          };
	        }
	      });
	    }
	  }, {
	    key: 'elmEventDesktop',
	    value: function elmEventDesktop(e, elm) {
	      this.props.allowDraggingDesktop ? this.elmEvent$.onNext({ e: e, ref: elm.ref }) : null;
	    }
	  }, {
	    key: 'elmEventMobile',
	    value: function elmEventMobile(e, elm) {
	      this.props.allowDraggingMobile ? this.elmEvent$.onNext({ e: _lodash2.default.extend(e, e.touches[0]), ref: elm.ref }) : null;
	    }
	  }, {
	    key: 'shouldReposition',
	    value: function shouldReposition(prevProps, prevState) {
	      var _this11 = this;

	      var should = false;
	      _lodash2.default.each(prevState.data, function (elmData, ind) {
	        should = should || _this11.state.data[ind] && (_this11.state.data[ind].ref !== prevState.data[ind].ref || _this11.state.data[ind].state !== prevState.data[ind].state && !(prevState.data[ind].state === imgState.NOT_POSITIONED && _this11.state.data[ind].state === imgState.FINISHED) || _this11.state.data[ind].isDragging !== prevState.data[ind].isDragging) || !_this11.state.data[ind];
	      });
	      should = should || prevState.data.length !== this.state.data.length || !_lodash2.default.isEqual(_lodash2.default.pick(prevProps, propsThatTriggerRender), _lodash2.default.pick(this.props, propsThatTriggerRender));
	      console.debug("shouldReposition : ", should);
	      return should;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.assignRenderedElms();
	      if (typeof window !== 'undefined') window.addEventListener('resize', this.repositionDebounced.bind(this), false);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (typeof window !== 'undefined') window.removeEventListener('resize', this.repositionDebounced.bind(this));
	    }
	  }]);

	  return DynamicContent;
	}(_react.Component);

	DynamicContent.propTypes = {
	  elements: _react2.default.PropTypes.array,
	  layout: _react2.default.PropTypes.string,
	  customLayoutMethod: _react2.default.PropTypes.func,
	  numOfColumns: _react2.default.PropTypes.number,
	  columnWidth: _react2.default.PropTypes.number,
	  maxHeight: _react2.default.PropTypes.number,
	  verticalCellSpacing: _react2.default.PropTypes.number,
	  horizontalCellSpacing: _react2.default.PropTypes.number,
	  onChange: _react2.default.PropTypes.func,
	  confirmElementDrag: _react2.default.PropTypes.func,
	  allowDraggingMobile: _react2.default.PropTypes.bool,
	  allowDraggingDesktop: _react2.default.PropTypes.bool,
	  custom: function custom(props) {
	    if (props.layout === "cascading" && props.numOfColumns === undefined && props.columnWidth === undefined) {
	      return new Error('either numOfColumns or columnWidth required with "cacading" layout');
	    }
	    if (props.layout === "images" && props.maxHeight === undefined) {
	      return new Error('maxHeight required with "images" layout');
	    }
	    return props.elements.reduce(function (prev, curr) {
	      if (!_react2.default.isValidElement(curr)) {
	        return new Error('"elements" prop arr must have only react elements');
	      }
	      return prev;
	    }, undefined);
	  }
	};

	var _initialiseProps = function _initialiseProps() {
	  this.elmLoaded$ = new _rx2.default.Subject();
	  this.elmEvent$ = new _rx2.default.Subject();
	  this.initialCss = {};
	  this.repositionThrottled = _lodash2.default.throttle(this.reposition, 100);
	  this.repositionDebounced = _lodash2.default.debounce(this.reposition, 100);
	};

	exports.default = DynamicContent;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.repositionCascadingLayout = repositionCascadingLayout;
	exports.repositionImagesLayout = repositionImagesLayout;
	exports.getWindowOffset = getWindowOffset;
	exports.isPromise = isPromise;

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getWidthAndSpacing(elm) {
	    var compStyle = window.getComputedStyle(elm, null);
	    var result = {
	        width: Number(compStyle.getPropertyValue('width').replace("px", "")),
	        height: Number(compStyle.getPropertyValue('height').replace("px", "")),
	        margin: {}
	    };
	    _lodash2.default.each(['left', 'right', 'top', 'bottom'], function (dir) {
	        result[dir] = Number(compStyle.getPropertyValue('padding-' + dir).replace("px", "")) + Number(compStyle.getPropertyValue('border-' + dir + '-width').replace("px", ""));
	        result.margin[dir] = Number(compStyle.getPropertyValue('margin-' + dir).replace("px", ""));
	    });
	    result.boxSizing = compStyle.getPropertyValue('box-sizing');
	    return result;
	}

	function repositionCascadingLayout(elements, props) {
	    var mvert = props.verticalCellSpacing || 0;
	    var mhor = props.horizontalCellSpacing || 0;
	    var columnWidth = props.columnWidth !== undefined ? props.columnWidth : (props.parentWidth - (props.numOfColumns - 1) * mhor) / props.numOfColumns - 0.3;
	    var count = 0,
	        sums = [],
	        spacings = {},
	        numOfColumns = props.numOfColumns !== undefined ? props.numOfColumns : Math.floor((props.parentWidth + mhor) / (props.columnWidth + mhor));
	    for (var i = 0; i < numOfColumns; i++) {
	        sums.push(0);
	    }
	    _lodash2.default.each(elements, function (elm, key) {
	        var col = 0,
	            max = 999999;
	        spacings[key] = getWidthAndSpacing(elm);
	        elm.style.position = "absolute";
	        elm.style.width = columnWidth - (spacings[key].boxSizing !== "border-box" ? spacings[key].left + spacings[key].right : 0) - (spacings[key].margin.left + spacings[key].margin.right) + "px";
	        _lodash2.default.each(sums, function (sum, ind) {
	            if (sum < max) {
	                col = ind;
	                max = sum;
	            }
	        });
	        elm.style.left = col * (columnWidth + mhor) + "px";
	        elm.style.top = sums[col] + "px";
	        sums[col] += elm.offsetHeight + mvert + spacings[key].margin.top + spacings[key].margin.left;
	        count = (col + 1) % numOfColumns;
	    });
	}

	function repositionImagesLayout(elements, props) {
	    var mvert = props.verticalCellSpacing || 0;
	    var mhor = props.horizontalCellSpacing || 0;
	    elements = _lodash2.default.values(elements);
	    var aspectRatio = []; //initial asp ratio before changes
	    var hMargins = [],
	        vMargins = [];
	    _lodash2.default.each(elements, function (elm) {
	        var prevWidth = null;
	        if (elm.clientWidth === 0) {
	            //if width initially 0 for any reason
	            prevWidth = elm.style.width;
	            elm.style.width = "300px"; //set to some width in order to hopefully extend height for asp. ratio calc
	            if (elm.clientHeight === 0) {
	                //if height didn't respond to width change, then try changing only height
	                elm.style.width = prevWidth;
	                elm.style.height = "300px";
	                if (elm.clientWidth === 0) {
	                    //if width didn't respond to height now, the elm is not responsive in any way
	                    console.error("element is not responsive when resized!");
	                }
	            }
	        }
	        aspectRatio.push(elm.clientHeight !== 0 ? elm.clientWidth / elm.clientHeight : 0);
	        var spacings = getWidthAndSpacing(elm);
	        hMargins.push(spacings.left + spacings.margin.left);
	        hMargins.push(spacings.right + spacings.margin.right);
	        vMargins.push(spacings.top + spacings.margin.top);
	        vMargins.push(spacings.bottom + spacings.margin.bottom);
	    });
	    var ind = 0,
	        top = 0,
	        left = 0,
	        H;
	    while (ind < elements.length) {
	        var last = ind;
	        var ratioSum = 0,
	            hMarginSum = 0,
	            vMarginSum = 0;
	        do {
	            var dividerSum = mhor * (last - ind);
	            ratioSum += aspectRatio[last];
	            hMarginSum += hMargins[2 * last] + hMargins[2 * last + 1];
	            vMarginSum += (vMargins[2 * last] + vMargins[2 * last + 1]) * aspectRatio[last];
	            H = (props.parentWidth - hMarginSum - dividerSum + vMarginSum) / ratioSum;
	            last++;
	        } while (last < elements.length && H > props.maxHeight);
	        if (H > props.maxHeight) {
	            H = props.maxHeight;
	        }
	        H = Math.floor(H);
	        for (var k = ind; k < last; k++) {
	            var current = elements[k];
	            var spacings = getWidthAndSpacing(elements[k]);
	            var decreaseVertMargins = spacings.margin.top + spacings.margin.bottom,
	                decreaseHorMargins = spacings.margin.left + spacings.margin.right;
	            var finalHeight, finalWidth;
	            if (spacings.boxSizing === "content-box") {
	                decreaseVertMargins += spacings.top + spacings.bottom;
	                decreaseHorMargins += spacings.left + spacings.right;
	                finalHeight = H - decreaseVertMargins;
	                finalWidth = finalHeight * aspectRatio[k];
	            } else {
	                finalHeight = H - decreaseVertMargins;
	                finalWidth = (finalHeight - (spacings.top + spacings.bottom)) * aspectRatio[k] + spacings.left + spacings.right;
	            }
	            var prevValue = current.style.width;
	            current.style.width = finalWidth + "px";
	            var aspRatio = current.clientHeight !== 0 ? current.clientWidth / current.clientHeight : 0;
	            if (Math.abs(aspectRatio[k] - aspRatio) > 0.05) {
	                //in case not maintains asp ratio when changed by width
	                current.style.width = prevValue; //then try changing height
	                current.style.height = finalHeight + "px";
	                aspRatio = current.clientHeight !== 0 ? current.clientWidth / current.clientHeight : 0;
	                if (Math.abs(aspectRatio[k] - aspRatio) > 0.05) {
	                    //if still not, force both height & width
	                    current.style.width = finalWidth + "px";
	                }
	            }
	            current.style.position = "absolute";
	            current.style.top = top + "px";
	            current.style.left = left + "px";
	            left += current.offsetWidth + mhor + spacings.margin.left + spacings.margin.right;
	        }
	        top += H + mvert;
	        left = 0;
	        ind = last;
	    }
	}

	function getWindowOffset(node) {
	    var curtop = 0;
	    var curleft = 0;
	    var curtopscroll = 0,
	        curleftscroll = 0;
	    if (node.offsetParent) {
	        do {
	            curtop += node.offsetTop;
	            curleft += node.offsetLeft;
	            curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
	            curleftscroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
	        } while (node = node.offsetParent);
	        return {
	            top: curtop - curtopscroll,
	            left: curleft - curleftscroll
	        };
	    }
	}

	function isPromise(obj) {
	    return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }
/******/ ])
});
;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var closeDelim = {
  '{': '}',
  '(': ')',
  '[': ']',
  '|': '|'
};

var TeXInput = function (_React$Component) {
  _inherits(TeXInput, _React$Component);

  function TeXInput(props) {
    _classCallCheck(this, TeXInput);

    var _this = _possibleConstructorReturn(this, (TeXInput.__proto__ || Object.getPrototypeOf(TeXInput)).call(this, props));

    var _this$props = _this.props,
        onChange = _this$props.onChange,
        caretPosFn = _this$props.caretPosFn;

    var pos = caretPosFn();
    _this.state = {
      start: pos,
      end: pos
    };

    _this._onChange = function () {
      return onChange({
        teX: _this.teXinput.value
      });
    };

    _this._onSelect = function () {
      var _this$teXinput = _this.teXinput,
          start = _this$teXinput.selectionStart,
          end = _this$teXinput.selectionEnd;

      _this.setState({ start: start, end: end });
    };

    _this._moveCaret = function (offset) {
      var relatif = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var value = _this.props.teX;
      var _this$state = _this.state,
          start = _this$state.start,
          end = _this$state.end;


      if (start !== end) return;

      var newOffset = relatif ? start + offset : offset;
      if (newOffset < 0) {
        newOffset = 0;
      } else if (newOffset > value.length) {
        newOffset = value.length;
      }

      _this.setState({ start: newOffset, end: newOffset }, function () {
        return _this.teXinput.setSelectionRange(newOffset, newOffset);
      });
    };

    _this._insertText = function (text) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var value = _this.props.teX;
      var _this$state2 = _this.state,
          start = _this$state2.start,
          end = _this$state2.end;

      value = value.slice(0, start) + text + value.slice(end);
      start += text.length + offset;
      if (start < 0) {
        start = 0;
      } else if (start > value.length) {
        start = value.length;
      }
      end = start;
      _this.setState({ start: start, end: end }, function () {
        return _this.teXinput.setSelectionRange(start, end);
      });
      onChange({ teX: value });
    };

    _this.onBlur = function () {
      return _this.props.finishEdit();
    };

    _this.handleKey = _this.handleKey.bind(_this);
    return _this;
  }

  _createClass(TeXInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _state = this.state,
          start = _state.start,
          end = _state.end;

      setTimeout(function () {
        _this2.teXinput.focus();
        _this2.teXinput.setSelectionRange(start, end);
      }, 0);
    }
  }, {
    key: 'handleKey',
    value: function handleKey(evt) {
      var key = evt.key;
      var _props = this.props,
          finishEdit = _props.finishEdit,
          onChange = _props.onChange,
          displaystyle = _props.displaystyle;
      var _teXinput = this.teXinput,
          text = _teXinput.value,
          selectionEnd = _teXinput.selectionEnd,
          selectionStart = _teXinput.selectionStart;


      if (key === 'ArrowRight' || key === 'Tab') {
        if (selectionStart === selectionEnd && (text.length === selectionEnd || key === 'Tab')) {
          evt.preventDefault();
          finishEdit(1);
        }
      }
      if (key === 'ArrowLeft') {
        if (selectionStart === selectionEnd && selectionEnd === 0) {
          evt.preventDefault();
          finishEdit(0);
        }
      }
      if (key === '$' && displaystyle !== undefined) {
        evt.preventDefault();
        onChange({ displaystyle: !displaystyle });
      }
      if (Object.prototype.hasOwnProperty.call(closeDelim, key)) {
        evt.preventDefault();
        this._insertText(key + closeDelim[key], -1);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          teX = _props2.teX,
          className = _props2.className,
          style = _props2.style;

      var teXArray = teX.split('\n');
      var rows = teXArray.length;
      var cols = teXArray.map(function (tl) {
        return tl.length;
      }).reduce(function (acc, size) {
        return size > acc ? size : acc;
      }, 1);
      return _react2.default.createElement('textarea', {
        rows: rows,
        cols: cols,
        className: className,
        value: teX,
        onChange: this._onChange,
        onSelect: this._onSelect,
        onBlur: this.onBlur,
        onKeyDown: this.handleKey,
        ref: function ref(teXinput) {
          _this3.teXinput = teXinput;
        },
        style: style
      });
    }
  }]);

  return TeXInput;
}(_react2.default.Component);

exports.default = TeXInput;
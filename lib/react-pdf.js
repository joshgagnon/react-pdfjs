'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _pdfjsDist = require('pdfjs-dist');

var _pdfjsDist2 = _interopRequireDefault(_pdfjsDist);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_bluebird2.default.config({
    cancellation: true
});

var PDF = function (_React$Component) {
    _inherits(PDF, _React$Component);

    function PDF(props) {
        _classCallCheck(this, PDF);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PDF).call(this, props));

        _this._pdfPromise = null;
        _this._pagePromises = null;
        _this.state = {};
        return _this;
    }

    _createClass(PDF, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.worker === false) {
                _pdfjsDist2.default.disableWorker = true;
            }
            this.loadDocument(this.props);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (newProps.data && newProps.data !== this.props.data) {
                this.loadDocument(newProps);
            }
        }
    }, {
        key: 'loadDocument',
        value: function loadDocument(props) {
            var _this2 = this;

            if (props.data || props.url) {
                this.cleanup();
                this._pdfPromise = _bluebird2.default.resolve(_pdfjsDist2.default.getDocument(props.data ? { data: props.data } : props.url)).then(this.completeDocument.bind(this)).catch(_pdfjsDist2.default.MissingPDFException, function () {
                    return _this2.setState({ error: "Can't find PDF" });
                }).catch(function (e) {
                    return _this2.setState({ error: e.message });
                });
            }
        }
    }, {
        key: 'completeDocument',
        value: function completeDocument(pdf) {
            var _this3 = this;

            this.setState({ pdf: pdf, error: null });
            this._pagePromises && this._pagePromises.isPending() && this._pagePromises.cancel();
            return this._pagePromises = _bluebird2.default.map(Array(this.state.pdf.numPages).fill(), function (p, i) {
                return pdf.getPage(i + 1);
            }).then(function (pages) {
                _this3.setState({ pages: pages });
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.cleanup();
        }
    }, {
        key: 'cleanup',
        value: function cleanup() {
            this._pdfPromise && this._pdfPromise.isPending() && this._pdfPromise.cancel();
            this._pagePromises && this._pagePromises.isPending() && this._pagePromises.cancel();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var _this4 = this;

            if (this.state.pdf && this.state.pages) {
                this.state.pages.map(function (page, i) {
                    var canvas = (0, _reactDom.findDOMNode)(_this4.refs[i]),
                        context = canvas.getContext('2d'),
                        scale = _this4.props.scale || 1,
                        viewport = page.getViewport(canvas.width / page.getViewport(scale).width);
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    });
                });
                this.props.finished && this.props.finished();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            if (this.state.error) {
                return _react2.default.createElement(
                    'div',
                    null,
                    this.state.error
                );
            }
            if (!this.state.pdf) {
                return _react2.default.createElement(
                    'div',
                    null,
                    'No Document to show'
                );
            }
            return _react2.default.createElement(
                'div',
                null,
                Array(this.state.pdf.numPages).fill().map(function (page, i) {
                    return _react2.default.createElement('canvas', { key: i, ref: i, width: _this5.props.width || 1500 });
                })
            );
        }
    }]);

    return PDF;
}(_react2.default.Component);

PDF.propTypes = {
    data: function data(props) {
        if (props.data && !(props.data instanceof ArrayBuffer) && !(props.data instanceof Buffer)) {
            return new Error('Validation failed!');
        }
    },
    url: _react2.default.PropTypes.string,
    width: _react2.default.PropTypes.number,
    finished: _react2.default.PropTypes.func
};

exports.default = PDF;
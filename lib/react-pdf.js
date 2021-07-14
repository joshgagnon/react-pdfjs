'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PDFJS = require('pdfjs-dist');


PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

var DEFAULT_WIDTH = 1500;

_bluebird2.default.config({
    cancellation: true
});

var PDF = function (_React$PureComponent) {
    _inherits(PDF, _React$PureComponent);

    function PDF(props) {
        _classCallCheck(this, PDF);

        var _this = _possibleConstructorReturn(this, (PDF.__proto__ || Object.getPrototypeOf(PDF)).call(this, props));

        _this._pdfPromise = null;
        _this._pagePromises = null;
        _this.completeDocument = _this.completeDocument.bind(_this);
        _this.state = {};
        return _this;
    }

    _createClass(PDF, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.worker === false) {
                PDFJS.GlobalWorkerOptions.disableWorker = true;
            }
            this.loadDocument(this.props);
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
                // convert to bluebird
                this._pdfPromise = _bluebird2.default.resolve(PDFJS.getDocument(props.data ? { data: props.data } : props.url)).then(this.completeDocument).catch(PDFJS.MissingPDFException, function () {
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
            return this._pagePromises = pdf.promise.then(function (pdf) {
                _this3.setState({ pdf: pdf, error: null });
                return _bluebird2.default.map(Array(pdf.numPages).fill(), function (p, i) {
                    return pdf.getPage(i + 1);
                });
            }).then(function (pages) {
                _this3.setState({ pages: pages });
            }).catch(function (e) {
                console.log(e);
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
                    var canvas = (0, _reactDom.findDOMNode)(_this4.refs[i]);
                    var context = canvas.getContext('2d'),
                        scale = _this4.props.scale || 1,
                        viewport = page.getViewport({ scale: scale });

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
                    this.props.noPDFMsg || 'No Document to show'
                );
            }
            return _react2.default.createElement(
                'div',
                null,
                Array(this.state.pdf.numPages).fill().map(function (page, i) {
                    return _react2.default.createElement('canvas', { key: i, ref: i });
                })
            );
        }
    }]);

    return PDF;
}(_react2.default.PureComponent);

PDF.propTypes = {
    data: function data(props) {
        if (props.data && !(props.data instanceof ArrayBuffer) && !(props.data instanceof Buffer)) {
            return new Error('Validation failed!');
        }
    },
    url: _propTypes2.default.string,
    width: _propTypes2.default.number,
    finished: _propTypes2.default.func
};

PDF.PDFJS = PDFJS;

exports.default = PDF;
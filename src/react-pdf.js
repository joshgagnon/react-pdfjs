'use strict';
import React from 'react';
import { findDOMNode } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import PDFJS from 'pdfjs-dist'
import pureRender from 'pure-render-decorator';
import Promise from 'bluebird';

Promise.config({
    cancellation: true
});

class PDF extends React.Component {
    constructor(props) {
        super(props);
        this._pdfPromise = null;
        this._pagePromises = null;
        this.state = {};
    }

    componentDidMount() {
        if(this.props.worker === false){
            PDFJS.disableWorker = true;
        }
        this.loadDocument(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillReceiveProps(newProps) {
        if((newProps.data && newProps.data !== this.props.data)) {
            this.loadDocument(newProps);
        }
    }

    loadDocument(props) {
        if(props.data || props.url){
            this.cleanup();
            this._pdfPromise = Promise.resolve(PDFJS.getDocument(props.data ? { data: props.data } : props.url))
                .then(::this.completeDocument)
                .catch(PDFJS.MissingPDFException, () => this.setState({error: "Can't find PDF"}))
                .catch((e) => this.setState({error: e.message}))
        }
    }

    completeDocument(pdf) {
        this.setState({ pdf: pdf, error: null });
        this._pagePromises && this._pagePromises.isPending() && this._pagePromises.cancel();
        return this._pagePromises = Promise.map(Array(this.state.pdf.numPages).fill(), (p, i) => {
            return pdf.getPage(i + 1);
        })
        .then((pages) => {
            this.setState({ pages: pages });
        })
    }

    componentWillUnmount() {
        this.cleanup();
    }

    cleanup() {
        this._pdfPromise && this._pdfPromise.isPending() && this._pdfPromise.cancel();
        this._pagePromises && this._pagePromises.isPending() && this._pagePromises.cancel();
    }

    componentDidUpdate() {
        if(this.state.pdf && this.state.pages){
            this.state.pages.map((page, i) => {
                const canvas = findDOMNode(this.refs[i]),
                    context = canvas.getContext('2d'),
                    scale = this.props.scale || 1,
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

    render() {
        if(this.state.error){
            return <div>{ this.state.error }</div>
        }
        if(!this.state.pdf){
            return <div>No Document to show</div>
        }
        return <div>
            { Array(this.state.pdf.numPages).fill().map((page, i) => {
                return <canvas key={i} ref={i} width={ this.props.width || 1500}  />
            }) }
        </div>
    }
}

PDF.propTypes = {
    data: (props) => {
        if(props.data && (!(props.data instanceof ArrayBuffer) && !(props.data instanceof Buffer))){
           return new Error('Validation failed!');
        }
    },
    url: React.PropTypes.string,
    width: React.PropTypes.number,
    finished: React.PropTypes.func
};


export default PDF;
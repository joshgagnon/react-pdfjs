import React from 'react';
import assert from 'assert';
import PDF from '../src/react-pdf';
import TestUtils from 'react-dom/test-utils';
import fs from 'fs';
import PDFJS from 'pdfjs-dist'

//PDFJS.workerSrc = 'examples/pdf.worker.js';
PDFJS.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

describe('Test PDF component', function() {

    before('render and locate element', function(done){
        this.timeout(10000);
        fs.readFile('examples/example.pdf', (err, data) => {
            if(err){
                throw err;
            }
            this.renderedComponent = TestUtils.renderIntoDocument(
              <PDF data={data} disableWorker={true} finished={() => done()} />
            );
        });
    });

    it('should have have ten pages', function(){
        const canvases = TestUtils.scryRenderedDOMComponentsWithTag(
          this.renderedComponent,
          'canvas'
        );
        assert(canvases.length === 10);
    });


});
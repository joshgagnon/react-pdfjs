import React from 'react';
import assert from 'assert';
import PDF from '../src/react-pdf';
import TestUtils from 'react-addons-test-utils'
import fs from 'fs';


describe('Test PDF component', function() {

    before('render and locate element', function(done){
        fs.readFile('examples/example.pdf', (err, data) => {
            if(err){
                throw err;
            }
            this.renderedComponent = TestUtils.renderIntoDocument(
              <PDF data={data} finished={() => done()} />
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
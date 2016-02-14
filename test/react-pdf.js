import React from 'react';
import asert from 'assert';
import PDF from '../src/react-pdf';
import TestUtils from 'react-addons-test-utils'

describe('Test PDF component', function() {

    before('render and locate element', function(done){
        this.renderedComponent = TestUtils.renderIntoDocument(
          <PDF url='example.pdf' finished={done}/>
        );
  });

    it('should have have ten pages', function(){
        const canvases = TestUtils.findRenderedDOMComponentsWithTag(
          this.renderedComponent,
          'canvas'
        );
        assert(canvases.length === 10)
    })


});
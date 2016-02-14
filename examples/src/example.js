'use strict';
import PDF from '../../lib/react-pdf';
import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(<PDF url='example.pdf' />, document.querySelector('#root'))

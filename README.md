# react-pdfjs
A react component for rendering pdfs, using Mozilla's PDF.js

[![Build Status](https://travis-ci.org/joshgagnon/react-pdfjs.svg)](https://travis-ci.org/joshgagnon/react-pdfjs)

This component retrieves a PDF from url or from an ArrayBuffer/Buffer.  Once it has loaded it will create a canvas for each page.

###Demo
A simple demo is available [here](http://joshgagnon.github.io/react-pdfjs/).

###Usage

```js
  import PDF from 'react-pdfjs';

  class PDFWrapper extends React.Component {
    render() {
      return <PDF file="example.pdf" />
    }
  }
```
Or supply a ArrayBuffer/Buffer
```js
  const data = getSomeBuffer();

  class PDFWrapper extends React.Component {
    render() {
      return <PDF data={data} />
    }
  }
```


###Credits
Inspired by [react-pdf](https://github.com/nnarhinen/react-pdf)

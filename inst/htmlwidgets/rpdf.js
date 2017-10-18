HTMLWidgets.widget({

  name: 'rpdf',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        $elem = $('#' + el.id);

      // css definitions
        $elem.css('overflow', 'auto');
        $elem.css('width', '100%');

  var mainDiv  = document.createElement("DIV");
  var prevBtn  = document.createElement("BUTTON");
  var nextBtn  = document.createElement("BUTTON");
  var canv     = document.createElement('CANVAS');
  var myspan = document.createElement('SPAN');
  var pagenum = document.createElement('SPAN');
  var pagecount = document.createElement('SPAN');


/*
  <span>Page:
  <span id="page_num"></span>
  /
  <span id="page_count"></span>
  </span>
*/

  var prevText   = document.createTextNode("Previous");
  var nextText = document.createTextNode("Next");
  var myspanTextNode = document.createTextNode('Page:');
  var pagenumTextNode = document.createTextNode('');
  var pagecountTextNode = document.createTextNode('');


  mainDiv.id   = 'rpdf' + el.id;
  prevBtn.id   = 'prev' + el.id;
  nextBtn.id   = 'next' + el.id;
  myspan.id   = 'myspan' + el.id;
  pagenum.id   = 'pagenum' + el.id;
  pagecount.id   = 'pagecount' + el.id;
  canv.id = 'canvas'+ el.id ;

  myspan.appendChild(myspanTextNode);
  pagenum.appendChild(pagenumTextNode);
  pagecount.appendChild(pagecountTextNode);

  prevBtn.appendChild(prevText);
  nextBtn.appendChild(nextText);

  myspan.appendChild(pagenum);
  myspan.appendChild(pagecount);

  mainDiv.appendChild(prevBtn);
  mainDiv.appendChild(nextBtn);
  mainDiv.appendChild(myspan);

  el.appendChild(mainDiv);
  el.appendChild(canv);

 // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = x.path;

// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = x.scale,
    canvas = document.getElementById('canvas' + el.id),
    ctx = canvas.getContext('2d');

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('pagenum' + el.id).textContent = ' ' + pageNum;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev' + el.id).addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next' + el.id).addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  debugger;
  document.getElementById('pagecount' + el.id).textContent = ' of ' + pdfDoc.numPages;

  // Initial/first page rendering
  renderPage(pageNum);
});


      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

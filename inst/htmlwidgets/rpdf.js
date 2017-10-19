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

    $('#mainDiv' + el.id).detach();
    $('#canvas' + el.id).detach();

  var mainDiv  = document.createElement("DIV");

  var prevBtn  = document.createElement("BUTTON");
  var nextBtn  = document.createElement("BUTTON");

  var firstBtn  = document.createElement("BUTTON");
  var lastBtn  = document.createElement("BUTTON");

  var zoominBtn  = document.createElement("BUTTON");
  var zoomoutBtn  = document.createElement("BUTTON");

  var canv     = document.createElement('CANVAS');
  var myspan = document.createElement('SPAN');
  var pagenum = document.createElement('SPAN');
  var pagecount = document.createElement('SPAN');
  var currentzoom = document.createElement('SPAN');


  var prevText   = document.createTextNode("<-");
  var nextText = document.createTextNode("->");

  var firstText   = document.createTextNode("<<-");
  var lastText = document.createTextNode("->>");

  var zoominText   = document.createTextNode("+");
  var zoomoutText = document.createTextNode("-");

  var myspanTextNode = document.createTextNode('Page:');
  var pagenumTextNode = document.createTextNode('');
  var pagecountTextNode = document.createTextNode('');
  var currentzoomTextNode = document.createTextNode('  Zoom: ' + x.scale*100 +'%');


  mainDiv.id   = 'rpdf' + el.id;

  prevBtn.id   = 'prev' + el.id;
  nextBtn.id   = 'next' + el.id;

  firstBtn.id   = 'first' + el.id;
  lastBtn.id   = 'last' + el.id;

  zoominBtn.id   = 'zoomin' + el.id;
  zoomoutBtn.id   = 'zoomout' + el.id;

  myspan.id   = 'myspan' + el.id;
  pagenum.id   = 'pagenum' + el.id;
  pagecount.id   = 'pagecount' + el.id;
  currentzoom.id   = 'currentzoom' + el.id;
  canv.id = 'canvas'+ el.id ;

  myspan.appendChild(myspanTextNode);
  pagenum.appendChild(pagenumTextNode);
  pagecount.appendChild(pagecountTextNode);
  currentzoom.appendChild(currentzoomTextNode);

  prevBtn.appendChild(prevText);
  nextBtn.appendChild(nextText);

  firstBtn.appendChild(firstText);
  lastBtn.appendChild(lastText);

  zoominBtn.appendChild(zoominText);
  zoomoutBtn.appendChild(zoomoutText);

  myspan.appendChild(pagenum);
  myspan.appendChild(pagecount);
  myspan.appendChild(currentzoom);

  mainDiv.appendChild(firstBtn);
  mainDiv.appendChild(prevBtn);
  mainDiv.appendChild(nextBtn);
  mainDiv.appendChild(lastBtn);

  mainDiv.appendChild(zoominBtn);
  mainDiv.appendChild(zoomoutBtn);

  mainDiv.appendChild(myspan);

  el.appendChild(mainDiv);
  el.appendChild(canv);

 // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = '//getcors.com/' + x.path;

// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
//'/htmlwidgets/lib/pdf_worker/pdf.worker.js';

var pdfDoc = null,
    pageNum = x.startpage,
    pageRendering = false,
    pageNumPending = null,
    scale = x.scale,
    zoom=200;
    canvas = document.getElementById('canvas' + el.id),
    ctx = canvas.getContext('2d');

var shownPdf;

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

function onFirstPage() {
  pageNum=1;
  queueRenderPage(pageNum);
}
document.getElementById('first' + el.id).addEventListener('click', onFirstPage);

function onLastPage() {
  pageNum=pdfDoc.numPages;
  queueRenderPage(pageNum);
}
document.getElementById('last' + el.id).addEventListener('click', onLastPage);

function onZoomIn() {
  scale = scale + 0.25;
  queueRenderPage(pageNum);
  document.getElementById('currentzoom' + el.id).textContent = '  Zoom: ' + scale*100 +'%';
}
document.getElementById('zoomin' + el.id).addEventListener('click', onZoomIn);

function onZoomOut() {
  if (scale <= 0.25) {
     return;
  }
  scale = scale - 0.25;
  queueRenderPage(pageNum);
  document.getElementById('currentzoom' + el.id).textContent = '  Zoom: ' + scale*100 +'%';
}
document.getElementById('zoomout' + el.id).addEventListener('click', onZoomOut);

/**
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
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

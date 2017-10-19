#' @title View pdf files in R
#' @description Htmlwidget to view pdf files in R
#' @param path character, remote location of file
#' @param scale numeric, initial zoom factor Default: 1
#' @param startpage numeric, page to open viewer, Default: 1
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param elementId The input slot that will be used to access the element.
#' @return nothing
#' @examples
#' if(interactive()){
#' rpdf(path = 'http://www.pdf995.com/samples/pdf.pdf',scale=0.75)
#'  }
#' @rdname rpdf
#' @export
#' @importFrom htmlwidgets createWidget
rpdf <- function(path, scale = 1, startpage = 1, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    path = path,
    scale=scale,
    startpage=startpage
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'rpdf',
    x,
    width = width,
    height = height,
    package = 'rpdf',
    elementId = elementId
  )
}

#' Shiny bindings for rpdf
#'
#' Output and render functions for using rpdf within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a rpdf
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name rpdf-shiny
#'
#' @export
rpdfOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'rpdf', width, height, package = 'rpdf')
}

#' @rdname rpdf-shiny
#' @export
renderRpdf <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, rpdfOutput, env, quoted = TRUE)
}

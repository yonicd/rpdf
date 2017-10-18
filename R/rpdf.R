#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
rpdf <- function(path, scale = 1, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    path = path,
    scale=scale
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

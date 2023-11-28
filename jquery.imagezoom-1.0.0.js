(function($) {
  $.fn.imagezoom = function(inputOptions) {

      var options = $.extend({}, $.fn.imagezoom.defaults, inputOptions);
      return this.each(function() {
            var node = this;
            var $this = $(this);
            var nodeOptions = $.extend({}, options, $this.data());
            var newNodes = createImageDiv(node, nodeOptions.highres, nodeOptions.border);
            var divElement = newNodes[0].get(0);
            var $divElement = $(divElement);
            var imageElement = newNodes[1].get(0);
            var $imageElement = $(imageElement);
            var sizeOfZoom = nodeOptions.sizeOfZoom;
            var halfDivWidth = 0;
            var halfDivHeight = 0;

            setSizes();

            $this.on("mousemove", place);
            $imageElement.on("mousemove", place);

            if ("mousewheel" in $this) {
              $this.mousewheel(resizeZoom);
              $imageElement.mousewheel(resizeZoom);
            }

            $imageElement.on("keyup", pressed);
            $this.on("keyup", pressed);
            $divElement.on("keyup", pressed);

            function pressed(event) {
              switch (event.originalEvent.key)
              {
                  case '+': resizeZoom(event, 1); break;
                  case '-': resizeZoom(event, -1); break;
                  default:
                    break;
              }
            }

            function resizeZoom(event, delta) {
                if (delta > 0) {
                    sizeOfZoom -= 0.1;
                } else {
                    sizeOfZoom += 0.1;
                }
                setSizes();
                place(event);
                event.preventDefault();
                event.stopPropagation();
            }
            function setSizes() {
                $divElement.css("width", node.width / sizeOfZoom);
                $divElement.css("height", node.height / sizeOfZoom);
                halfDivWidth = node.width / sizeOfZoom / 2;
                halfDivHeight = node.height / sizeOfZoom / 2;
            }
            function place(event) {
                // position divelement
                $divElement.show();
                $divElement.css("left", getX(event, node) - $divElement.outerWidth() / 2);
                $divElement.css("top", getY(event, node) - $divElement.outerHeight() / 2);

                //position highresimage
                var xPosInImage = getX(event, node);
                var yPosInImage = getY(event, node);

                var xPercent = xPosInImage / node.width;
                var yPercent = yPosInImage / node.height;

                var imageXPos = -xPercent * imageElement.clientWidth;
                var imageYPos = -yPercent * imageElement.clientHeight;
                $imageElement.css("left", imageXPos+halfDivWidth);
                $imageElement.css("top", imageYPos+halfDivHeight);
            }

            function getX(event, parent) {
                return event.pageX - parent.offsetParent.offsetLeft;
            }
            function getY(event, parent) {
                return event.pageY - parent.offsetParent.offsetTop;
            }
        });
    };

    function debug(o) {
        if (window.console && window.console.log) {
            window.console.log(o);
        }
    }

    function createImageDiv(originalImage, url, border) {
        var display = "display: none;";
        var absPosition = "position: absolute;";
        var overflow = "overflow: hidden;";
        var zindex = "z-index: 1;";
        var borderRadius = "border-radius: 10%;";
        var div = $('<div id="' + originalImage.id + 'zoom" style="' + display + border + absPosition + zindex + overflow + borderRadius + '" tabindex="1" />');
        var image = $('<img style="position: relative;" src="' + url + '" />');
        div.get(0).appendChild(image.get(0));

        $(originalImage).after(div);
        return [div, image];
    }

    $.fn.imagezoom.defaults = {
        sizeOfZoom: 4,
        border: "border: outset 1px black;"
    };

}(jQuery));

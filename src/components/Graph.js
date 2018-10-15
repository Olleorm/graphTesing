import React from "react";
import PropTypes from "prop-types";

class Graph extends React.Component {
  componentDidMount() {
    // prep test data
    let data = [];
    for (let i = 0; i < 50000; i++) {
      data.push(Math.floor(Math.random() * 300));
    }
    console.time(this.props.canvasId);

    var margin_bottom = 20;
    var margin_left = 50;

    var data_max = 300; // Maximum value of data available
    var data_min = 0; // Minimum value of data available
    var data_no = data.length; // Number of data ( elements in array )
    var x_gap = 0.006; // gap in X axis between data points
    var range = 100; //
    var y_max = Math.ceil(data_max / range) * range; // Adjust the highest value for grid
    var y_min = Math.floor(data_min / range) * range; // Lower limit of the grid, can be set to zero.

    ///////// No edit //////////
    //var my_canvas=$('#my_canvas').get(0)  // Jquery
    var my_canvas = document.getElementById(this.props.canvasId); // JavaScript
    var gctx = my_canvas.getContext("2d");

    // set the canvas height and width ///
    my_canvas.height = y_max - y_min + margin_bottom;
    my_canvas.width = data_no * x_gap + margin_left;

    draw(gctx, x_gap, y_max, data, data_no);

    // Draw X & Y axis //
    // gctx.moveTo(margin_left, 0);
    // gctx.lineTo(margin_left, my_canvas.height);
    // gctx.moveTo(0, my_canvas.height - margin_bottom);
    // gctx.lineTo(my_canvas.width, my_canvas.height - margin_bottom);
    // gctx.strokeStyle = "#f54600";
    // gctx.stroke();

    ///////Draw Grid //////////////////
    // gctx.font = "18px serif";
    // for (let i = 0; i <= y_max; i += range) {
    //   gctx.fillText(i + "-", margin_left - 35, y_max - i);
    // }

    trackTransforms(gctx);

    function redrawXmove() {
      console.log("redrawXmove!");
      console.log("gctx: ", gctx);
      // Clear the entire canvas
      // var p1 = gctx.transformedPoint(0, 0);
      // var p2 = gctx.transformedPoint(my_canvas.width, my_canvas.height);
      // gctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

      // gctx.save();
      // gctx.setTransform(1, 0, 0, 1, 0, 0);
      // gctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
      // gctx.restore();

      drawXmovment(gctx);
    }

    function redraw() {
      console.log("REDRAW!");
      console.log("gctx: ", gctx);
      // Clear the entire canvas
      // var p1 = gctx.transformedPoint(0, 0);
      // var p2 = gctx.transformedPoint(my_canvas.width, my_canvas.height);
      // gctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

      gctx.save();
      gctx.setTransform(1, 0, 0, 1, 0, 0);
      gctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
      gctx.restore();

      draw(gctx, x_gap, y_max, data, data_no);
    }
    let lastX = my_canvas.width / 2;
    var lastY = my_canvas.height / 2;

    let yMidCordinate = my_canvas.height / 2;

    var dragStart, dragged;

    my_canvas.addEventListener(
      "mousedown",
      function(evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
          "none";
        lastX = evt.offsetX || evt.pageX - my_canvas.offsetLeft;
        // lastY = evt.offsetY || evt.pageY - my_canvas.offsetTop;
        dragStart = gctx.transformedPoint(lastX, yMidCordinate);
        dragged = false;
      },
      false
    );

    my_canvas.addEventListener(
      "mousemove",
      function(evt) {
        lastX = evt.offsetX || evt.pageX - my_canvas.offsetLeft;
        // lastY = evt.offsetY || evt.pageY - my_canvas.offsetTop;
        dragged = true;
        if (dragStart) {
          var pt = gctx.transformedPoint(lastX, yMidCordinate);
          gctx.translate(pt.x - dragStart.x, 0);

          redrawXmove();
        }
      },
      false
    );

    my_canvas.addEventListener(
      "mouseup",
      function(evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
      },
      false
    );

    var scaleFactor = 1.1;

    var zoom = function(clicks) {
      const pt = gctx.transformedPoint(lastX, yMidCordinate);
      gctx.translate(pt.x, pt.y);
      var factor = Math.pow(scaleFactor, clicks);
      gctx.scale(factor, 1);
      gctx.translate(-pt.x, -pt.y);
      redraw();
    };

    var handleScroll = function(evt) {
      var delta = evt.wheelDelta
        ? evt.wheelDelta / 40
        : evt.detail
          ? -evt.detail
          : 0;
      if (delta) zoom(delta);
      return evt.preventDefault() && false;
    };

    my_canvas.addEventListener("DOMMouseScroll", handleScroll, false);
    my_canvas.addEventListener("mousewheel", handleScroll, false);

    console.timeEnd(this.props.canvasId);
  }

  render() {
    return (
      <div className="graph-of-the-day">
        <canvas id={this.props.canvasId} width="1200px" height="1200px" />
      </div>
    );
  }
}

function drawXmovment(gctx) {
  gctx.beginPath();
  gctx.stroke();
}

function draw(gctx, x_gap, y_max, data, data_no) {
  // Moving to first Point of the line graph //
  gctx.beginPath();
  gctx.lineWidth = 0.5;
  gctx.strokeStyle = "#2369f5";
  gctx.moveTo(x_gap, y_max - data[0]);
  // gctx.fillText(data[0], x_gap - 30, y_max - data[0]);

  let offset = x_gap;
  // drawing graph from first points
  for (let i = 1; i <= data_no; i++) {
    offset = offset + x_gap;
    gctx.lineTo(offset, y_max - data[i]);
    // gctx.fillText(data[i], x1 - 30, y_max - data[i]);
  }
  // /// Adding shadow to line graph //////////////
  // gctx.shadowColor = "black";
  // gctx.shadowOffsetX = 5;
  // gctx.shadowOffsetY = 5;
  // gctx.shadowBlur = 5;
  gctx.save();
  console.log("DRAW!!! gctx: ", gctx);
  gctx.stroke();
}

function trackTransforms(gctx) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var xform = svg.createSVGMatrix();
  gctx.getTransform = function() {
    return xform;
  };

  var savedTransforms = [];
  var save = gctx.save;
  gctx.save = function() {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(gctx);
  };

  var restore = gctx.restore;
  gctx.restore = function() {
    xform = savedTransforms.pop();
    return restore.call(gctx);
  };

  var scale = gctx.scale;
  gctx.scale = function(sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(gctx, sx, sy);
  };

  var rotate = gctx.rotate;
  gctx.rotate = function(radians) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(gctx, radians);
  };

  var translate = gctx.translate;
  gctx.translate = function(dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(gctx, dx, dy);
  };

  var transform = gctx.transform;
  gctx.transform = function(a, b, c, d, e, f) {
    var m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(gctx, a, b, c, d, e, f);
  };

  var setTransform = gctx.setTransform;
  gctx.setTransform = function(a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(gctx, a, b, c, d, e, f);
  };

  var pt = svg.createSVGPoint();
  gctx.transformedPoint = function(x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };
}

Graph.propTypes = {
  canvasId: PropTypes.string
};

export default Graph;

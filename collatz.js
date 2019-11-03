const canvas = document.getElementById("collatz-canvas");
const context = canvas.getContext("2d");

const MAX_FPS = 60;
var previousTime = 0;

var lines;
var pointCount;
var mouseOnPoint;

function debounce(func, delay) {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout();
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  }
}

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function mainloop(timestamp) {
  if (timestamp < previousTime + (1000 / MAX_FPS)) {
    requestAnimationFrame(mainloop);
    return;
  }

  update();
  draw();

  requestAnimationFrame(mainloop);
}

function update() {
  updateLines();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let l of lines) {
    context.strokeStyle = l.colour;
    for (let pi = 0; pi < l.points.length; pi++) {
      if (l.points.length > 1 && pi > 0) {
        context.beginPath();
        context.moveTo(l.points[pi - 1].x, l.points[pi - 1].y * l.pointSpacingVertical);
        context.lineTo(l.points[pi].x, l.points[pi].y * l.pointSpacingVertical);
        context.closePath();
        context.stroke();
      }
      context.fillStyle = l.points[pi].colour;
      context.fillRect(l.points[pi].x - 2, l.points[pi].y * l.pointSpacingVertical - 2, 4, 4);
    }
  }
}

function updateLines() {
  for (let l of lines) {
    let lastPoint = l.getLastPoint();
    if (lastPoint.y != 1)
      l.addPoint(lastPoint.x + l.pointSpacingHorizontal, calcCollatz(lastPoint.y));
    }
}

function isMouseOnPoint(e) {
  for (let l of lines) {
    for (let p of l.points) {
      if (p) {
        let grace = 5;
        if ((Math.floor(p.x) <= e.clientX + grace && Math.floor(p.x) >= e.clientX - grace) &&
            (Math.floor(p.y * l.pointSpacingVertical) <= e.clientY + grace && Math.floor(p.y * l.pointSpacingVertical) >= e.clientY - grace)) {
              return l.points.indexOf(p);
            }
      }
    } return null;
  }
}

function activePoint(pointIndex) {
  if (pointIndex) {
    for (let l of lines) {
      for (let p of l.points) {
        if (p) { p.colour = p.defaultColour; }
      } l.points[pointIndex].colour = l.points[pointIndex].activeColour;
    }
  }
}

function calcCollatz(currentHeight) {
  return (currentHeight % 2 == 0) ? currentHeight / 2 : currentHeight * 3 + 1;
}

function genLines(numOfLines) {
  let lines = [];
  for (let l = 0; l < numOfLines; l++) {
    let line = new CollatzLine(0, Math.floor(Math.random() * (canvas.height * 1)));
    lines.push(line);
  } return lines;
}

function calcAllCollatzRecursive() {
  for (let l of lines) {
    pointCount = 0;
    collatzRecursive(l.points[0].y, l);
    l.totalPointCount = pointCount;
    l.pointSpacingHorizontal = canvas.width / pointCount;
    l.pointSpacingVertical = canvas.height / l.maxY;
  } pointCount = 0;
}

function collatzRecursive(num, line) {
  function cal(num, result) { // must surround in a tail call function, this stops stack issues
    pointCount++;
    if (num > line.maxY || line.maxY == undefined)
      line.maxY = num;
    return (num == 1) ? result : cal(calcCollatz(num), num);
  } cal(num, calcCollatz(num));
}

$(document).ready(function() {
  setCanvasSize();

  $(window).on("resize", debounce(setCanvasSize, 50));

  canvas.addEventListener("mousemove", function(e) {
    activePoint(isMouseOnPoint(e));
  });

  lines = genLines(1);
  calcAllCollatzRecursive();

  mainloop();
});

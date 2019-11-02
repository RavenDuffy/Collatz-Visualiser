const canvas = document.getElementById("collatz-canvas");
const context = canvas.getContext("2d");

const MAX_FPS = 60;
var previousTime = 0;

var lines;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
      context.fillStyle = l.points[pi].colour;
      context.fillRect(l.points[pi].x, l.points[pi].y, 1, 1);
      if (l.points.length > 1 && pi > 0) {
        context.beginPath();
        context.moveTo(l.points[pi - 1].x, l.points[pi - 1].y);
        context.lineTo(l.points[pi].x, l.points[pi].y);
        context.closePath();
        context.stroke();
      }
    }
  }
}

function updateLines() {
  for (let l of lines) {
    let lastPoint = l.getLastPoint();
    if (lastPoint.y != 1)
      l.addPoint(lastPoint.x + 10, calcCollatz(lastPoint.y));
  }
}

function calcCollatz(currentHeight) {
  return (currentHeight % 2 == 0) ? currentHeight / 2 : currentHeight * 3 + 1;
}

function genLines(numOfLines) {
  let lines = [];
  for (let l = 0; l < numOfLines; l++) {
    let line = new CollatzLine(0, Math.floor(Math.random() * (canvas.height * .5)));
    lines.push(line);
  } return lines;
}

$(window).on("resize", debounce(setCanvasSize, 50));

$(document).ready(function() {
  lines = genLines(1);
  mainloop();
});

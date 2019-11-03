class CollatzLine {
  constructor(startX, startY) {
    this.points = [];
    this.points.push(new Point(startX, startY));
    this.colour = "#fff";
    // Variables below should not be initialised here
    this.totalPointCount;
    this.pointSpacingHorizontal;
    this.pointSpacingVertical;
    this.maxY;
  }

  addPoint(x, y) {
    this.points.push(new Point(x, y));
  }

  getLastPoint() {
    return this.points[this.points.length - 1];
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.defaultColour = "#f6f";
    this.activeColour = "#3f5";
    this.colour = this.defaultColour;
  }
}


// ADD REFRESH BUTTON

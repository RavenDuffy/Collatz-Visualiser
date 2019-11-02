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
    this.colour = "#f6f";
  }
}


// ADD REFRESH BUTTON

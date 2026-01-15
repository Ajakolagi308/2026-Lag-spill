/**
 * BARANS SPILLVERKSTED - Collision Detection
 * Various collision detection utilities
 */

const Collision = {
  /**
   * Check AABB (Axis-Aligned Bounding Box) collision
   */
  checkAABB(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  },

  /**
   * Get AABB overlap
   */
  getAABBOverlap(a, b) {
    if (!this.checkAABB(a, b)) return null;

    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

    return { x: overlapX, y: overlapY };
  },

  /**
   * Check circle collision
   */
  checkCircles(a, b) {
    const dx = (a.x + a.radius) - (b.x + b.radius);
    const dy = (a.y + a.radius) - (b.y + b.radius);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < a.radius + b.radius;
  },

  /**
   * Check point in rectangle
   */
  pointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.width &&
           py >= rect.y && py <= rect.y + rect.height;
  },

  /**
   * Check point in circle
   */
  pointInCircle(px, py, circle) {
    const dx = px - (circle.x + circle.radius);
    const dy = py - (circle.y + circle.radius);
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
  },

  /**
   * Check circle vs rectangle collision
   */
  checkCircleRect(circle, rect) {
    // Find closest point on rectangle to circle center
    const cx = circle.x + circle.radius;
    const cy = circle.y + circle.radius;

    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  },

  /**
   * Check line vs line intersection
   */
  lineIntersection(line1Start, line1End, line2Start, line2End) {
    const x1 = line1Start.x, y1 = line1Start.y;
    const x2 = line1End.x, y2 = line1End.y;
    const x3 = line2Start.x, y3 = line2Start.y;
    const x4 = line2End.x, y4 = line2End.y;

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (Math.abs(denom) < 0.0001) {
      return null; // Lines are parallel
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1)
      };
    }

    return null;
  },

  /**
   * Check line vs rectangle intersection
   */
  lineRect(lineStart, lineEnd, rect) {
    const left = this.lineIntersection(lineStart, lineEnd,
      { x: rect.x, y: rect.y },
      { x: rect.x, y: rect.y + rect.height }
    );

    const right = this.lineIntersection(lineStart, lineEnd,
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height }
    );

    const top = this.lineIntersection(lineStart, lineEnd,
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y }
    );

    const bottom = this.lineIntersection(lineStart, lineEnd,
      { x: rect.x, y: rect.y + rect.height },
      { x: rect.x + rect.width, y: rect.y + rect.height }
    );

    const intersections = [left, right, top, bottom].filter(i => i !== null);

    if (intersections.length === 0) return null;

    // Return closest intersection
    let closest = intersections[0];
    let minDist = this.distance(lineStart, closest);

    for (const intersection of intersections) {
      const dist = this.distance(lineStart, intersection);
      if (dist < minDist) {
        minDist = dist;
        closest = intersection;
      }
    }

    return { point: closest, distance: minDist };
  },

  /**
   * Get distance between two points
   */
  distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Check if player passed through a gate (for ski games)
   */
  checkGatePass(playerPrevPos, playerPos, gate) {
    // Gate is defined by two points (left pole and right pole)
    const intersection = this.lineIntersection(
      playerPrevPos,
      playerPos,
      { x: gate.x, y: gate.y },
      { x: gate.x + gate.width, y: gate.y }
    );

    return intersection !== null;
  },

  /**
   * Check if moving object will collide (predictive)
   */
  willCollide(movingObj, velocity, staticObj, steps = 10) {
    const stepX = velocity.x / steps;
    const stepY = velocity.y / steps;

    for (let i = 1; i <= steps; i++) {
      const futurePos = {
        x: movingObj.x + stepX * i,
        y: movingObj.y + stepY * i,
        width: movingObj.width,
        height: movingObj.height
      };

      if (this.checkAABB(futurePos, staticObj)) {
        return {
          collides: true,
          step: i,
          position: futurePos
        };
      }
    }

    return { collides: false };
  },

  /**
   * Get collision response (bounce direction)
   */
  getCollisionResponse(movingObj, staticObj, velocity) {
    const overlap = this.getAABBOverlap(movingObj, staticObj);
    if (!overlap) return velocity;

    const response = { x: velocity.x, y: velocity.y };

    // Determine collision side based on overlap
    if (overlap.x < overlap.y) {
      // Horizontal collision
      response.x = -velocity.x;
    } else {
      // Vertical collision
      response.y = -velocity.y;
    }

    return response;
  },

  /**
   * Separate overlapping objects
   */
  separate(a, b) {
    const overlap = this.getAABBOverlap(a, b);
    if (!overlap) return { x: 0, y: 0 };

    // Push in direction of least overlap
    if (overlap.x < overlap.y) {
      const centerA = a.x + a.width / 2;
      const centerB = b.x + b.width / 2;
      return {
        x: centerA < centerB ? -overlap.x : overlap.x,
        y: 0
      };
    } else {
      const centerA = a.y + a.height / 2;
      const centerB = b.y + b.height / 2;
      return {
        x: 0,
        y: centerA < centerB ? -overlap.y : overlap.y
      };
    }
  },

  /**
   * Check polygon collision (for complex shapes)
   */
  checkPolygons(polyA, polyB) {
    // Separating Axis Theorem implementation
    const polygons = [polyA, polyB];

    for (const polygon of polygons) {
      for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length;

        // Get edge normal
        const edge = {
          x: polygon[j].x - polygon[i].x,
          y: polygon[j].y - polygon[i].y
        };

        const normal = { x: -edge.y, y: edge.x };

        // Project both polygons onto the axis
        const projA = this.projectPolygon(polyA, normal);
        const projB = this.projectPolygon(polyB, normal);

        // Check for gap
        if (projA.max < projB.min || projB.max < projA.min) {
          return false; // Separating axis found
        }
      }
    }

    return true; // No separating axis found, polygons intersect
  },

  /**
   * Project polygon onto axis
   */
  projectPolygon(polygon, axis) {
    let min = Infinity;
    let max = -Infinity;

    for (const point of polygon) {
      const projection = point.x * axis.x + point.y * axis.y;
      min = Math.min(min, projection);
      max = Math.max(max, projection);
    }

    return { min, max };
  },

  /**
   * Check if point is inside polygon
   */
  pointInPolygon(px, py, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      if (((yi > py) !== (yj > py)) &&
          (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  },

  /**
   * Get bounding box of a polygon
   */
  getPolygonBounds(polygon) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const point of polygon) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Collision;
}

/**
 * BARANS SPILLVERKSTED - Physics Engine
 * Simple 2D physics for games
 */

class PhysicsEngine {
  constructor(options = {}) {
    this.gravity = options.gravity ?? 0.6;
    this.friction = options.friction ?? 0.8;
    this.airResistance = options.airResistance ?? 0.99;
    this.bounceRestitution = options.bounceRestitution ?? 0.5;
    this.maxVelocity = options.maxVelocity ?? 15;

    this.bodies = [];
    this.staticBodies = [];
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDeltaTime = 1000 / 60; // 60 FPS physics
  }

  /**
   * Create a physics body
   */
  createBody(options) {
    const body = {
      id: options.id || `body_${Date.now()}`,
      x: options.x || 0,
      y: options.y || 0,
      width: options.width || 40,
      height: options.height || 40,
      vx: options.vx || 0,
      vy: options.vy || 0,
      ax: 0,
      ay: 0,
      mass: options.mass || 1,
      restitution: options.restitution ?? this.bounceRestitution,
      friction: options.friction ?? this.friction,
      isStatic: options.isStatic || false,
      isSensor: options.isSensor || false, // Triggers but doesn't collide
      gravityScale: options.gravityScale ?? 1,
      onGround: false,
      collisionMask: options.collisionMask || 0xFFFF,
      collisionCategory: options.collisionCategory || 0x0001,
      userData: options.userData || {},
      onCollision: options.onCollision || null
    };

    if (body.isStatic) {
      this.staticBodies.push(body);
    } else {
      this.bodies.push(body);
    }

    return body;
  }

  /**
   * Remove a body
   */
  removeBody(body) {
    const dynamicIndex = this.bodies.indexOf(body);
    if (dynamicIndex >= 0) {
      this.bodies.splice(dynamicIndex, 1);
    }

    const staticIndex = this.staticBodies.indexOf(body);
    if (staticIndex >= 0) {
      this.staticBodies.splice(staticIndex, 1);
    }
  }

  /**
   * Clear all bodies
   */
  clear() {
    this.bodies = [];
    this.staticBodies = [];
  }

  /**
   * Apply force to a body
   */
  applyForce(body, fx, fy) {
    if (!body.isStatic) {
      body.ax += fx / body.mass;
      body.ay += fy / body.mass;
    }
  }

  /**
   * Apply impulse (instant velocity change)
   */
  applyImpulse(body, ix, iy) {
    if (!body.isStatic) {
      body.vx += ix / body.mass;
      body.vy += iy / body.mass;
    }
  }

  /**
   * Set velocity directly
   */
  setVelocity(body, vx, vy) {
    if (!body.isStatic) {
      body.vx = vx;
      body.vy = vy;
    }
  }

  /**
   * Main update loop
   */
  update(deltaTime) {
    // Fixed timestep accumulator
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedDeltaTime) {
      this.fixedUpdate(this.fixedDeltaTime / 1000);
      this.accumulator -= this.fixedDeltaTime;
    }
  }

  /**
   * Fixed timestep physics update
   */
  fixedUpdate(dt) {
    // Update dynamic bodies
    for (const body of this.bodies) {
      // Apply gravity
      body.ay += this.gravity * body.gravityScale;

      // Update velocity with acceleration
      body.vx += body.ax * dt * 60;
      body.vy += body.ay * dt * 60;

      // Apply air resistance
      body.vx *= this.airResistance;
      body.vy *= this.airResistance;

      // Clamp velocity
      body.vx = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, body.vx));
      body.vy = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, body.vy));

      // Update position
      body.x += body.vx;
      body.y += body.vy;

      // Reset acceleration
      body.ax = 0;
      body.ay = 0;

      // Reset ground state
      body.onGround = false;
    }

    // Check collisions
    this.checkCollisions();
  }

  /**
   * Check all collisions
   */
  checkCollisions() {
    // Dynamic vs Static
    for (const body of this.bodies) {
      for (const staticBody of this.staticBodies) {
        if (this.canCollide(body, staticBody)) {
          const collision = this.checkAABBCollision(body, staticBody);
          if (collision) {
            this.resolveCollision(body, staticBody, collision);
          }
        }
      }
    }

    // Dynamic vs Dynamic
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        if (this.canCollide(bodyA, bodyB)) {
          const collision = this.checkAABBCollision(bodyA, bodyB);
          if (collision) {
            this.resolveDynamicCollision(bodyA, bodyB, collision);
          }
        }
      }
    }
  }

  /**
   * Check if two bodies can collide based on masks
   */
  canCollide(bodyA, bodyB) {
    return (bodyA.collisionMask & bodyB.collisionCategory) !== 0 &&
           (bodyB.collisionMask & bodyA.collisionCategory) !== 0;
  }

  /**
   * AABB collision detection
   */
  checkAABBCollision(bodyA, bodyB) {
    const overlapX = Math.min(bodyA.x + bodyA.width, bodyB.x + bodyB.width) -
                     Math.max(bodyA.x, bodyB.x);
    const overlapY = Math.min(bodyA.y + bodyA.height, bodyB.y + bodyB.height) -
                     Math.max(bodyA.y, bodyB.y);

    if (overlapX > 0 && overlapY > 0) {
      // Determine collision normal (smallest overlap)
      if (overlapX < overlapY) {
        const nx = bodyA.x + bodyA.width / 2 < bodyB.x + bodyB.width / 2 ? -1 : 1;
        return { overlapX, overlapY, nx, ny: 0 };
      } else {
        const ny = bodyA.y + bodyA.height / 2 < bodyB.y + bodyB.height / 2 ? -1 : 1;
        return { overlapX, overlapY, nx: 0, ny };
      }
    }

    return null;
  }

  /**
   * Resolve collision with static body
   */
  resolveCollision(body, staticBody, collision) {
    // Trigger callback
    if (body.onCollision) {
      body.onCollision(staticBody, collision);
    }
    if (staticBody.onCollision) {
      staticBody.onCollision(body, collision);
    }

    // Skip physics resolution for sensors
    if (body.isSensor || staticBody.isSensor) {
      return;
    }

    // Separate bodies
    if (collision.nx !== 0) {
      body.x += collision.overlapX * collision.nx;
      body.vx *= -body.restitution;
    }

    if (collision.ny !== 0) {
      body.y += collision.overlapY * collision.ny;

      if (collision.ny < 0) {
        // Landing on top
        body.onGround = true;
        body.vy = 0;
        body.vx *= body.friction;
      } else {
        // Hitting from below
        body.vy *= -body.restitution;
      }
    }
  }

  /**
   * Resolve collision between two dynamic bodies
   */
  resolveDynamicCollision(bodyA, bodyB, collision) {
    // Trigger callbacks
    if (bodyA.onCollision) {
      bodyA.onCollision(bodyB, collision);
    }
    if (bodyB.onCollision) {
      bodyB.onCollision(bodyA, collision);
    }

    // Skip physics resolution for sensors
    if (bodyA.isSensor || bodyB.isSensor) {
      return;
    }

    // Calculate relative velocity
    const relVelX = bodyA.vx - bodyB.vx;
    const relVelY = bodyA.vy - bodyB.vy;

    // Calculate relative velocity along normal
    const velAlongNormal = relVelX * collision.nx + relVelY * collision.ny;

    // Don't resolve if velocities are separating
    if (velAlongNormal > 0) return;

    // Calculate restitution
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);

    // Calculate impulse scalar
    const totalMass = bodyA.mass + bodyB.mass;
    const impulse = -(1 + restitution) * velAlongNormal / totalMass;

    // Apply impulse
    bodyA.vx += impulse * collision.nx * bodyB.mass;
    bodyA.vy += impulse * collision.ny * bodyB.mass;
    bodyB.vx -= impulse * collision.nx * bodyA.mass;
    bodyB.vy -= impulse * collision.ny * bodyA.mass;

    // Positional correction
    const percent = 0.2;
    const slop = 0.01;
    const penetration = collision.nx !== 0 ? collision.overlapX : collision.overlapY;
    const correction = Math.max(penetration - slop, 0) / totalMass * percent;

    if (collision.nx !== 0) {
      bodyA.x -= correction * bodyB.mass * collision.nx;
      bodyB.x += correction * bodyA.mass * collision.nx;
    } else {
      bodyA.y -= correction * bodyB.mass * collision.ny;
      bodyB.y += correction * bodyA.mass * collision.ny;
    }
  }

  /**
   * Raycast against all bodies
   */
  raycast(startX, startY, dirX, dirY, maxDistance = 1000) {
    const hits = [];
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const ndx = dirX / length;
    const ndy = dirY / length;

    const allBodies = [...this.bodies, ...this.staticBodies];

    for (const body of allBodies) {
      const hit = this.raycastAABB(startX, startY, ndx, ndy, maxDistance, body);
      if (hit) {
        hits.push({ body, ...hit });
      }
    }

    // Sort by distance
    hits.sort((a, b) => a.distance - b.distance);

    return hits;
  }

  /**
   * Raycast against single AABB
   */
  raycastAABB(ox, oy, dx, dy, maxDist, body) {
    let tmin = 0;
    let tmax = maxDist;

    // X axis
    if (dx !== 0) {
      const tx1 = (body.x - ox) / dx;
      const tx2 = (body.x + body.width - ox) / dx;
      tmin = Math.max(tmin, Math.min(tx1, tx2));
      tmax = Math.min(tmax, Math.max(tx1, tx2));
    } else if (ox < body.x || ox > body.x + body.width) {
      return null;
    }

    // Y axis
    if (dy !== 0) {
      const ty1 = (body.y - oy) / dy;
      const ty2 = (body.y + body.height - oy) / dy;
      tmin = Math.max(tmin, Math.min(ty1, ty2));
      tmax = Math.min(tmax, Math.max(ty1, ty2));
    } else if (oy < body.y || oy > body.y + body.height) {
      return null;
    }

    if (tmax >= tmin && tmin >= 0) {
      return {
        distance: tmin,
        point: { x: ox + dx * tmin, y: oy + dy * tmin }
      };
    }

    return null;
  }

  /**
   * Get bodies at a point
   */
  getBodiesAtPoint(x, y) {
    const result = [];
    const allBodies = [...this.bodies, ...this.staticBodies];

    for (const body of allBodies) {
      if (x >= body.x && x <= body.x + body.width &&
          y >= body.y && y <= body.y + body.height) {
        result.push(body);
      }
    }

    return result;
  }

  /**
   * Get bodies in area
   */
  getBodiesInArea(x, y, width, height) {
    const result = [];
    const allBodies = [...this.bodies, ...this.staticBodies];

    for (const body of allBodies) {
      if (body.x < x + width && body.x + body.width > x &&
          body.y < y + height && body.y + body.height > y) {
        result.push(body);
      }
    }

    return result;
  }
}

/**
 * Preset physics configurations for different game types
 */
const PhysicsPresets = {
  platformer: {
    gravity: 0.6,
    friction: 0.8,
    airResistance: 0.99,
    bounceRestitution: 0.3,
    maxVelocity: 15
  },
  racing: {
    gravity: 0,
    friction: 0.95,
    airResistance: 0.98,
    bounceRestitution: 0.5,
    maxVelocity: 12
  },
  marbleRun: {
    gravity: 0.4,
    friction: 0.99,
    airResistance: 0.995,
    bounceRestitution: 0.6,
    maxVelocity: 20
  },
  space: {
    gravity: 0,
    friction: 1,
    airResistance: 1,
    bounceRestitution: 0.8,
    maxVelocity: 10
  },
  ski: {
    gravity: 0.3,
    friction: 0.98,
    airResistance: 0.99,
    bounceRestitution: 0.2,
    maxVelocity: 18
  },
  underwater: {
    gravity: 0.1,
    friction: 0.7,
    airResistance: 0.95,
    bounceRestitution: 0.4,
    maxVelocity: 8
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhysicsEngine, PhysicsPresets };
}

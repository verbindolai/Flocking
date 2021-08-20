const EVASION_RANGE = 140;
const SEPARATION_WEIGHT = 1.3

class Particle {

    position;
    velocity;
    acceleration;
    radiusX = 5;
    radiusY = 10;
    alive = true;
    color = "black";
    rotation;
    id;

    constructor(x, y, vx, vy, id) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(vx, vy);
        this.acceleration = new Vector(0, 0);
        this.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
        this.id = id;

        if (this.id === 0) this.color = "FireBrick"
    }

    // veloX = Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1);
    // veloY = Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1);


    draw() {
        context.beginPath();
        context.ellipse(this.position.x, this.position.y, this.radiusX, this.radiusY, this.rotation, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();

        if (this.id != 0) {
            context.strokeStyle = "rgba(0,0,0,0.2)";
        } else {
            context.strokeStyle = "rgba(0,0,0,1)";

        }

        context.beginPath();
        context.arc(this.position.x, this.position.y, EVASION_RANGE, 0, 2 * Math.PI);
        context.stroke();

    }

    calculateAcceleration() {

        const alignmentVector = new Vector(0, 0);
        const separationVector = new Vector(0, 0);
        const cohesionVector = new Vector(0, 0);

        let particlesInRange = 0;

        for (const particle of PARTICLES[Math.floor(this.position.x / chunkSize)][Math.floor(this.position.y / chunkSize)]) {
            if (!particle) {
                return;
            }
            const distance = this.position.dist(particle.position);

            if (distance > 0 && distance < EVASION_RANGE) {

                if (this.id === 0) {
                    particle.color = "green"
                }

                particlesInRange++;
                const diff = this.position.copy().sub(particle.position).div(distance);
                separationVector.add(diff);


            } else {
                if (this.id === 0 && particle.id != 0) {
                    particle.color = "black"
                }
            }


        }

        if (particlesInRange > 0) {
            this.acceleration.add(separationVector.div(particlesInRange).normalise().mul(SEPARATION_WEIGHT))
        }

    }



    update() {
        this.calculateAcceleration();

        this.velocity.add(this.acceleration);
        this.velocity.limit(4);

        const POS = PARTICLES[Math.floor(this.position.x / chunkSize)][Math.floor(this.position.y / chunkSize)];
        POS.splice(POS.indexOf(this), 1);

        this.position.add(this.velocity);

        PARTICLES[Math.floor(this.position.x / chunkSize)][Math.floor(this.position.y / chunkSize)] = this;



        if (this.position.x > WIDTH) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = WIDTH;
        }

        if (this.position.y > HEIGHT) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = HEIGHT;
        }

        this.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
    }


    checkCollision(particle) {
        return distance(this.xPos, this.yPos, particle.xPos, particle.yPos) < this.radiusX + particle.radiusX;
    }

}


class Vector {

    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    add(v) {

        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += parseFloat(v);
            this.y += parseFloat(v);
        }
    }

    sub(v) {
        if (v instanceof Vector) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= parseFloat(v);
            this.y -= parseFloat(v);
        }
        return this;
    }

    mul(v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    div(v) {
        if (v instanceof Vector) {
            this.x /= v.x;
            this.y /= v.y;
        } else {
            this.x /= v;
            this.y /= v;
        }
        return this;
    }

    /**
     * Maths - Distance to another position vector. Is calculated
     * by subtracting this Vector from new Vector, the Magnitude of this
     * Vector is returned as the distance.
     *
     * @param {Vector} v - The second vector
     * @returns {Float} The distance to the second vector
     */
    dist(v) {
        let d = new Vector(v.x, v.y);
        d.sub(this);
        return d.mag;
    }

    /**
     * Tools - Normalise this vector - mag = 1
     * Divide by its own Magnitude ( 3/3 = 1 )
     */
    normalise() {
        this.div(this.mag);
        return this;
    }

    /**
     * Tools - Set the magnitude of this Vector without changing the direction
     * value.
     *
     * @param m - The new magnitude
     */
    setMag(m) {
        this.normalise();
        this.mul(m);
    }

    limit(max) {
        if (this.mag > max) {
            this.setMag(max);
        }
    }

}
let settings = new Settings();

class Boid {
    constructor(position, velocity, type, render_function, shape) {
        this.type = type;
        this.render_function = render_function;
        this.shape = shape; // for pixi only

        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Victor(0, 0);

        // Eigenschaften und Einschränkungen
        this.maxSpeed = settings.maxSpeed;
        this.maxForce = settings.maxForce;
        this.detectionRange = settings.detectionRange;

        this.alignmentFactor = settings.alignmentFactor;
        this.seperationFactor = settings.seperationFactor;
        this.cohesionFactor = settings.cohesionFactor;
    }

    run(boids) {
        this.flock(boids);
        this.update();
        if (this.type === "p5") {
            this.render_function(this.position, this.velocity);
        } else if (this.type === "pixi") {
            this.render_function(this.position, this.velocity, this.shape);
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.norm().multiplyScalar(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);
        this.borders();
    }

    borders() {
        if (this.position.x < 0)  this.position.x = settings.width;
        if (this.position.y < 0)  this.position.y = settings.height;
        if (this.position.x > settings.width) this.position.x = 0;
        if (this.position.y > settings.height) this.position.y = 0;
    }

    detection(boids) {
        let detectedBoids = [];

        boids.forEach(b => {
            let d = this.position.distance(b.position);
            if (this !== b && d < this.detectionRange) {
                detectedBoids.push(b);
            }
        });

        nDetectedBoids += detectedBoids.length;
        return detectedBoids;
    }

    flock(boids) {
        let detectedBoids = this.detection(boids);

        let separation = this.seperation(detectedBoids);
        let alignment = this.alignment(detectedBoids);
        let cohesion = this.cohesion(detectedBoids);

        separation.multiplyScalar(this.seperationFactor);
        alignment.multiplyScalar(this.alignmentFactor);
        cohesion.multiplyScalar(this.cohesionFactor);

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    seperation(detectedBoids) {
        let desired = new Victor(0, 0);
        let steer = new Victor(0, 0);

        detectedBoids.forEach(b => {
            let dist = this.position.distance(b.position);
            let diff = this.position.clone().subtract(b.position);

            if (dist > 0) {
                diff.divideScalar(dist*dist);
            }
            desired.add(diff);
        });
        if (detectedBoids.length > 0) {
            desired.divideScalar(detectedBoids.length);
            desired.norm().multiplyScalar(this.maxSpeed);

            steer = desired;
            steer.subtract(this.velocity);
            steer.multiplyScalar(this.maxForce);
        }

        return steer;
    }

    alignment(detectedBoids) {
        let desired = new Victor(0, 0);
        let steer = new Victor(0, 0);

        detectedBoids.forEach(b => {
            desired.add(b.velocity);
        });
        if (detectedBoids.length > 0) {
            desired.divideScalar(detectedBoids.length);
            desired = desired.norm().multiplyScalar(this.maxSpeed);

            steer = desired;
            steer.subtract(this.velocity);
            steer.multiplyScalar(this.maxForce);
        }

        return steer;
    }

    cohesion(detectedBoids) {
        let desired = new Victor(0, 0);
        let steer = new Victor(0, 0);

        detectedBoids.forEach(b => {
            desired.add(b.position);
        });
        if (detectedBoids.length > 0) {
            desired.divideScalar(detectedBoids.length);
            desired.subtract(this.position);
            desired = desired.norm().multiplyScalar(this.maxSpeed);

            steer = desired;
            steer.subtract(this.velocity);
            steer.multiplyScalar(this.maxForce);
        }

        return steer;
    }
}
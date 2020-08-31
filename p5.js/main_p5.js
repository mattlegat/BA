
let measure = new MeasurePerformance();
let nDetectedBoids = 0;

let flock;

function setup() {
    createCanvas(settings.width, settings.height);

    flock = new Flock(100);
    measure.startMeasurement();
}

function draw() {
    background(100);
    flock.run();

    if (frameCount > 1000) {
        measure.stopMeasurement();
        noLoop();
        console.log("Time taken in sec: " + measure.getTimeTaken()/1000);
        console.log("Amount of detected Boids: " + nDetectedBoids);
        console.log("Average FPS: " + 1000 / (measure.getTimeTaken()/1000));
    }
}

// Wrapper Klasse für den Schwarm für P5.js
class Flock {
    constructor(amount) {
        this.entities = [];

        for (let i = 0; i < amount; i++) {
            let seededPosition = generateSeededPositionVector(i);
            let seededVelocity = generateSeededVelocityVector(i);
            this.addBoid(seededPosition, seededVelocity);
        }
    }

    addBoid(position, velocity) {
        this.entities.push(new Boid(position, velocity, "p5", this.render_p5));
    }

    run() {
        this.entities.forEach(b => b.run(this.entities))
    }

    render_p5(position, velocity) {
        push();
        translate(position.x, position.y);
        rotate(velocity.direction());
        beginShape();
        vertex(8, 0);
        vertex(-8, -4);
        vertex(-8, 4);
        endShape(CLOSE);
        pop();
    }
}
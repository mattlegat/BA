
let measure = new MeasurePerformance();
let nDetectedBoids = 0;
let nFrames = 0;

let flock;
let app;

window.onload = function() {
    app = new PIXI.Application({
            width: settings.width,
            height: settings.height,
            backgroundColor: 0x666666,
            forceCanvas: true
        }
    );
    document.body.appendChild(app.view);

    flock = new Flock(100);
    measure.startMeasurement();

    app.ticker.add(tick => appLoop(tick));
};

function appLoop(tick) {
    nFrames++;
    flock.run();

    if (nFrames > 1000) {
        measure.stopMeasurement();
        app.ticker.stop();
        console.log("Time taken in sec: " + measure.getTimeTaken()/1000);
        console.log("Amount of detected Boids: " + nDetectedBoids);
        console.log("Average FPS: " + 1000 / (measure.getTimeTaken()/1000));
    }
}

// Wrapper Klasse für den Schwarm für Pixi.js
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
        let shape = new PIXI.Graphics();
        shape.lineStyle(1, 0x000000, 1);
        shape.beginFill(0xFFFFFF);
        shape.drawPolygon([
            8, 0,
            -8, -4,
            -8, 4
        ]);
        shape.endFill();
        shape.x = position.x;
        shape.y = position.y;
        shape.rotation = velocity.direction();
        app.stage.addChild(shape);

        this.entities.push(new Boid(position, velocity, "pixi", this.render_pixi, shape));
    }

    run() {
        this.entities.forEach(b => b.run(this.entities))
    }

    render_pixi(position, velocity, shape) {
        shape.x = position.x;
        shape.y = position.y;
        shape.rotation = velocity.direction();
    }
}
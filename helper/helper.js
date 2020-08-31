
function generateSeededPositionVector(seed) {
    let seededRng = new Math.seedrandom("position_" + seed);
    let x = Math.floor(seededRng() * settings.width);
    let y = Math.floor(seededRng() * settings.height);
    return new Victor(x, y);
}

function generateSeededVelocityVector(seed) {
    let seededRng = new Math.seedrandom("velocity_" + seed);
    let x = seededRng() * 2 - 1;
    let y = seededRng() * 2 - 1;
    return new Victor(x, y);
}

class MeasurePerformance {
    constructor() {
        this.timeTaken = 0;
        this.startTime = 0;
        this.stopTime = 0;
    }

    startMeasurement() {
        this.startTime = performance.now();
    }

    stopMeasurement() {
        this.stopTime = performance.now();
        this.timeTaken = this.stopTime - this.startTime;
    }

    getTimeTaken() {
        return this.timeTaken;
    }
}

class Settings {
    constructor() {
        this.width = 640;
        this.height = 360;

        this.maxSpeed = 2.5;
        this.maxForce = 0.0025;
        this.detectionRange = 22;

        this.alignmentFactor = 38;
        this.seperationFactor = 43;
        this.cohesionFactor = 42;
    }
}
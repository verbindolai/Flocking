
const CHUNCK_NUMBER = 20;

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const HEIGHT = 1000;
const WIDTH = 1000;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const PARTICLE_NUM = 1000;
const PARTICLES = [];

function init() {

    for (let i = 0; i < PARTICLE_NUM; i++) {

        PARTICLES[i] = new Particle(Math.random() * 60, Math.random() * 60, Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1), Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1), i);
    }

}

function mainLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of PARTICLES) {
        particle.draw();
        particle.update();
    }

    //setTimeout(() => {
    requestAnimationFrame(mainLoop)
    //}, 1000)

}


init();
mainLoop();
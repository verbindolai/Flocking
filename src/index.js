
const CHUNCK_NUMBER = 10;

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const HEIGHT = 800;
const WIDTH = 800;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const PARTICLE_NUM = 10;
let chunkSize = 0;
const PARTICLES = [];



function init() {

    chunkSize = WIDTH / CHUNCK_NUMBER;

    for (let i = 0; i < CHUNCK_NUMBER; i++) {
        PARTICLES[i] = [];
    }


    for (let i = 0; i < PARTICLE_NUM; i++) {

        const particle = new Particle(Math.random() * WIDTH, Math.random() * HEIGHT, Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1), Math.random() * 2 * (Math.round(Math.random()) ? 1 : -1), i);

        PARTICLES[Math.floor(particle.position.x / chunkSize)][Math.floor(particle.position.y / chunkSize)] = particle;
    }

}

function mainLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    console.log(PARTICLES)

    for (const chunk of PARTICLES) {
        for (particle of chunk) {
            if (particle) {
                particle.update();
                particle.draw();
            }

        }
    }

    //setTimeout(() => {
    requestAnimationFrame(mainLoop)
    //}, 1000)

}


init();
mainLoop();
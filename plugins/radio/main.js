import BalenaAudio from '@balenalabs/audio-block';

const play = require('audio-play');
const load = require('audio-loader');

console.log(`Running PLAY script with the following configuration:`);
console.log(`PULSE_SERVER: ${process.env.PULSE_SERVER}`);
console.log(`PULSE_SINK: ${process.env.PULSE_SINK}`);

let mplayer;
let isPaused = false;
const PULSE_SERVER = process.env.PULSE_SERVER;
const RADIO_URL = process.env.RADIO_URL;

if (!RADIO_URL) {
    console.error('You need to set RADIO_URL variable!');
    process.exit(1);
}

async function main() {
    // Connect to audio block server
    let client = new BalenaAudio(PULSE_SERVER);

    // Listen for play/stop events
    client.on('play', (sink) => {
        // sink.name = "balena-sound-radio.input" || "balena-sound.input"
        //console.log(sink);
        if (sink.name === 'balena-sound.input' && !isPaused) {
            console.log('Started playing, pausing radio!');
            pause();
        }
    });
    client.on('stop', (sink) => {
        //console.log(sink);

        if (sink.name === 'balena-sound.input' && isPaused) {
            console.log('Stopped playing, unpausing radio!');
            unpause();
        }
    });

    await client.listen();

    await startMPlayer();
}

main();

let playback;

function pause() {
    isPaused = !isPaused;
    console.log('PAUSE');
    if (playback) playback.pause();
}

function unpause() {
    isPaused = !isPaused;
    console.log('UNPAUSE');
    if (playback) playback.play();
}

async function startMPlayer() {
    console.log('Starting mplayer...');
    const audioBuffer = await load('./sample.mp3');
    play(audioBuffer);
}

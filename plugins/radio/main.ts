import BalenaAudio from '@balenalabs/audio-block';
import { spawn } from "child_process";

console.log(`Running PLAY script with the following configuration:`);
console.log(`PULSE_SERVER: ${process.env.PULSE_SERVER}`);
console.log(`PULSE_SINK: ${process.env.PULSE_SINK}`);

let mplayer;
let isPaused = false;
const PULSE_SERVER = process.env.PULSE_SERVER;
const RADIO_URL = process.env.RADIO_URL;

if (!RADIO_URL) {
    console.error("You need to set RADIO_URL variable!")
    process.exit(1)
}

async function main() {
    // Connect to audio block server
    let client = new BalenaAudio(PULSE_SERVER);

    // Listen for play/stop events
    client.on('play', (sink) => {
        // sink.name = "balena-sound-radio.input" || "balena-sound.input"
        //console.log(sink);
        if (sink.name === "balena-sound.input" && !isPaused) {
            console.log('Started playing, pausing radio!');
            pause();
        }
    });
    client.on('stop', (sink) => {
        //console.log(sink);

        if (sink.name === "balena-sound.input" && isPaused) {
            console.log('Stopped playing, unpausing radio!');
            pause();
        }
    });

    await client.listen()

    startMPlayer()
}

main();

function pause() {
    isPaused = !isPaused;
    console.log('PAUSE');
    mplayer.stdin.write('pause\n');
}

function startMPlayer() {
    console.log("Starting mplayer...");
    mplayer = spawn('mplayer', ['-slave', '-quiet', RADIO_URL]);
    mplayer.on('exit', function () {
        console.log('EXIT.');
        process.exit(1);
    });
    mplayer.stdout.on('data', function (data) { console.log('mplayer stdout: ' + data); });
    mplayer.stderr.on('data', function (data) { console.log('mplayer stderr: ' + data); });
}
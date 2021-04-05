# balena-radio
Modified project of `balena-sound` to add internet radio playback when not playing from any other source. After boot `mplayer` is loaded with provided radio from enviroment variable `RADIO_URL`. It`s automatically paused when playing from any other source (airplay/bluetooth/spotify/upnp) and then is automatically resumed.

# Required steps
```bash
git clone git@github.com:founek2/balena-radio.git
cd balena-radio
balena push name-of-your-application

# now set RADIO_URL for your favourite radio station url in balena Dashboard for service Radio (select device -> Device service Variables)
```
> replace `name-of-your-application` with your application name

## How it works
I have added another sink (in Pulseaudio server) to differ radio from other sources. Plugin `Radio` starts NodeJS, which connects to Pulseaudio server and listen to state changes of sinks and starts `mplayer` in separete process. Actions on state changes of default sink:
-  on "playing", NodeJS pauses `mplayer`
-  on "stopped", NodeJS unpauses `mplayer`
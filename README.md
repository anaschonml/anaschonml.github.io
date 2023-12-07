WebSyn is a web-based polyphonic synthesizer with effects for desktop browsers. Video demo: https://youtu.be/FR-Aubk0Fog
It can be downloaded as well as accessed online on https://anaschonml.github.io (test version).

It is compatible with Firefox, Safari, Chrome, and Microsoft Edge (tested on all of these). It has not yet been implemented for mobile devices (although maybe one day). WebSyn is implemented with the Web Audio API and the Media Capture and Streams API that are standard across all modern browsers. Very old computers might have trouble using it. The main functionality is audio output, so a way to listen to audio is essential. It is also made for a standard English language keyboard, so alternative layouts might have trouble with the functionality (for example, the Spanish language keyboard has a ñ instead of a ;, and the German keyboard has the Z and Y keys swapped relative to the QWERTY layout).

WebSyn is a fun introduction to modular synthesis that can be played in real time and recorded. Let's take a tour of the features, from top to bottom.

The header of the site includes a link to a page with reference documentation similar to this document but with some extra links to references, as well as images and graphs!

Under that we can access the controls for the synth. The "master volume" slider controls how loud the synthesizer is overall. The default value, 1, is full volume. It can be pushed into "extra loud" by going up to 2, or quieted down by going down towards 0.
Next to it are two buttons: "Stop All Audio" (which fully stops audio from playing; it's very useful as a killswitch when certain bugs happen or when audio gets too loud ), and "Reset" (which reloads the page. On some browsers this will save the values on the controls, but on others it will reset them to the default).

The "attack", "decay", "sustain", and "release" controls (also known as ADSR colloquially) define the envelope (that is, volume curve) of each note that is played. "Attack" controls how long it takes for the sound to go from 0% to its full volume. "Decay" controls how long it takes for the sound to go from full volume to the "Sustain" level (defined as a proportion of the full volume) while the note is still being pressed. "Release" controls how long it takes for the sound to go from the "sustain" level to 0 once the note stops being pressed. These values are shown in seconds, and updated on the screen when they are changed by the user. By default, A=0.01, D=1, S=1, R=0.1 (meaning, by default, the note starts basically as soon as it is pressed, does not sound like it decays, and stops almost as soon as it is unpressed). When these values are changed, they do not affect a note that is already being played, but will affect the next one.

The "octave" buttons change the pitch of the notes being played by an octave up (+) or down (-). They can also be activated by pressing the Z (-) and X (+) notes on the user's computer keyboard.

WebSyn plays 2 oscillators at once by default. The wave shape of each can be chosen with the dropdown menus around the "wave shape balance" slider, which defines their volume relative to each other. Having it all the way to the left will only play the left oscillator, and vice versa. Different wave shapes have different harmonic responses, so they will give very distinctive effects.

This is where we get to the actual keyboard, the part of the synthesizer that makes sound happen. The keyboard is click-and-holdable, but can also be controlled by the user playing the corresponding keys on their computer keyboard (for a diagram of which key activates which note, look at the instructions). This makes the synth polyphonic! It is able to play chords as well as melodies. Notes can be held.
There is one known bug with the computer keyboard functionality - when a key is pressed and unpressed several times in quick succession, sometimes the "note off" signal is not generated and this creates an "infinite note". Unfortunately the only way to stop this is by resetting the page, which may clear the parameters. However, this bug can also be exploited to create longer drones...

WebSyn has 3 sets of effects. They are routed linearly, that is, each one will affect the audio signal in the next node of the chain.
The first is a series of filters that modify the frequency proportions of the audio signal.
The high-pass filter (left) only 'lets through' frequencies higher than its threshold frequency, which is controlled by the slider. It has a minimum frequency of 20Hz (the bottom of the human audible spectrum).
The bell filter (center) selects a frequency (controlled by the 'frequency' slider) and raises or lowers its volume as defined by the 'gain' slider, as well as a certain amount of frequencies around it defined by the 'q' slider (the higher the q value the fewer frequencies, this is a convention in audio).
The low-pass filter (right) only 'lets through' frequencies below its threshold frequency, which is controlled by the slider. It has a minimum frequency of 300Hz and a maximum of 20kHz (the top of the human audible spectrum).

The distortion effect is built on a waveshaper - it enlarges and compresses the sound. This adds harmonics to the sound that make it sound gritty. A little distortion goes a long way, but I left it open so it can get pretty extreme!

The delay effect repeats the sound it receives after a certain amount of time defined by the "time" slider (in seconds). The "feedback" slider controls what proportion of the repeated sound is fed back (hence the name) into the repeater, allowing it to repeat the sound just once, a few times, or an infinite number of times... . The "mix" slider defines how loud the delay is in proportion to the dry (non-delayed) signal.

The last feature allows the user to record what they play with WebSyn, listen to the recording, and download it as an .ogg file, which can be opened with Reaper, Pro Tools, Audacity, and many other Digital Audio Workstations. The recording begins when they press "start" and ends when they press "stop". Once the data is available, the audio player is populated with what was just recorded and pressing play allows the user to listen to it. By right- or control-clicking on the audio player (when it is not actively playing), the user can save the file through their OS's "Save Audio As..." dialog. There isn't a defined limit on the length of the recording, as it is only stored client-side, but I would discourage very long performances because they can create a really large file. Starting to record again after a file has been created will overwrite the previous one, so users should make sure to save their creation before making a new one.

Hope you have fun playing WebSyn!

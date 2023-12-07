WebSyn - made by Ana Schon as a final project for CS50!

WebSyn is a web-based modular-ish synthesizer for desktop browsers (tested on Chrome, Safari, and Firefox). Its functionality relies primarily on the Web Audio API, which is standard with all modern browsers and programmable on JavaScript. The Web Audio API uses a modular system of connecting nodes with each other that produce, route, process, and output audio.

My original plan was to use Python audio, but since WAAPI was so easily accessible and well-documented, as well as more efficient for real-time audio on servers, I decided to go with this. I could have used a library called Tone.js, but chose to program a more basic layer of the functionality myself so I could really understand how it works.

WebSyn's routing model is as follows:

LeftOscillator           RightOscillator
       \                         /
    leftGain  <-balance->   rightGain
         \_____________________/
                    |
                 oscEnv
                    |
                   LPF
                    |
                   HPF
                    |                     _Delay____
                   BPF ------ Distortion / --------- Output
                                                        \____
                                                             \ Recording

In this document, I will explain how each of these elements is implemented, what it is, and how I chose to do it this way. Some general implementation details first that are present across all of them:
- I thought it was important for all the parameters that are controlled by the sliders on the HTML file to have their value reflected on the webpage. This way, users are able to control the synth more granularly, and also capture settings they want to recreate later more precisely. In order to implement this, at the beginning of the section with the backend for each controllable parameter there are a few lines with a querySelector that captures the specific controller, a parseFloat that makes it useful for calculations, and a couple lines that output the value back into the HTML (for example for the Attack slider):
    atxt = document.createTextNode(attackControl.value);
    atxt.className = 'info';
    adsrdata.insertBefore(atxt, alabel.nextSibling);
Within the eventListener that handles the value changing, there is another line that updates the value back to the HTML (again with Attack):  atxt.textContent = attackTime; . For the most part, this uses the same variable that the processing uses, so it's more efficient.
- Because the Web Audio API is modular, it connects elements to each other. This means that several nodes are initialized way before they need to be used mainly because another node needs to know it exists in order to work.
- Because this project is designed to work in real time, a lot of the implementation relies on knowing when things start and stop. Web Audio API also has some quirks in the ways it controls things like gain, using mainly functions instead of assignments. That took me by surprise a couple times!
- I kept most of the console.log functions for changes in parameter values for debugging's sake.

Let's step through the code, audio.js, and see what's going on.
Line 1 ensures the website is fully loaded before the script is allowed to start. I had issues with this a couple of times during development, so I added this as an extra layer of reliability.

Lines 2 -7 set up the audio context that WAAPI needs to function and the primary gain control/master volume, which defines the main output. After this we have all the input/UI feedback and control for the primary gain control.

Directly under this are the controls for the ADSR, which are really similar to one another. These output values that get used in the oscillator functions. A slider defines the time, the program catches the change and updates to match.

Under this are the controls for the octave. The way to change the octave of a sound (that is, move it so it's the same note but higher pitched) is to duplicate its frequency to raise it and half it to lower it. Initializing the octave back end as 1 means the frequencies are not duplicated. However, the user doesn't need to know the notes are being duplicated and halved, they want to know how many octaves they went up or down. Thus, there is another variable named "octcount" that keeps track of this. This variable is what gets returned to the HTML, and it gets updated whenever the octaves are changed. I also wanted to include functionality to change the octave with computer keyboard presses in the same layout that Logic Pro X and Ableton Live use, since they are 2 of the most widely used Digital Audio Workstations and the chances of users already being familiar with the layout are really high!

This is where the visible order of elements and the order in which they're placed in the backend starts to differ. I decided to write the effects above the core keyboard functionality (and wave shape balance) because they're smaller units and putting them up here made them easier to find and debug.

The filters use pretty standard syntax and they're almost all the same, with the main difference being that the bell filter has 2 more parameters which control not only the frequency but also the gain applied to that frequency and how many frequencies around it are affected. The bell is initialized to connect directly to the primaryGainControl, as the distortion is not activated until its slider has a value  other than 0.

The distortion effect is written with a WaveShaper node that comes standard with WAAPI. The curve, as defined in the documentation, creates harmonics above the fundamental frequency, making the sound gritty. Because it is not linear, it doesn't quite disappear even when the input is set to 0, so as a workaround the effect is not activated unless the value is a different number, at which point the makeDistortionCurve function is called, and the output of the bell filter is disconnected from the primaryGainControl, connected to the input of the distortion node, and the distortion node is connected to the primaryGainControl. This is not my favorite way to solve this, on the other hand the curve sounds really good like this when the distortion is enabled, so maybe it's worth it. If the distortion's value is returned to 0, the connections are reversed: the distortion node's output is disconnected from the primaryGainControl and the bell filter's output is disconnected from the distortion node, then reconnected to the primaryGainControl and delay nodes.

The delay effect is implemented so that it is parallel to the main output. This way, its volume is controllable separate from the rest of the synth and the effect it creates can be more similar to the way delays tend to be used in other software. The output of the bell filter (or the distortion filter, if it's enabled) is connected to the input of the delay. The signal is then processed so that it gets repeated after an amount of time specified by the "time" slider, and the repeat gets "fed back" into the input of the delay at a proportion specified by the "feedback" slider (hence the name). The volume of all of this is controlled by the "mix" slider. At maximum, the volume of the first repeat will be equal to the dry signal.

The section below creates and controls the actual keyboard. An array of notes defines the note name, base frequency, and key that activates it. This is done for all Western scale notes for about an octave and a half, starting at a C and ending at the subsequent E.
The code immediately after that has to do with the oscillator balance, which controls and outputs the volume of the 2 oscillators WebSyn plays relative to each other as well as the type of wave that each of the two oscillators generate (defined by waveL and waveR).
Below this is the code that creates the note buttons. It was much more straighforward to create this with a for loop that iterates over the array of notes and assigns each button the correct value. Because the Western scale is visually arranged the way it is on a keyboard, there are 2 classes depending on whether the note contains a # sign or not, making them look visually like notes on a piano.

After this are the conditions that activate and deactivate notes. It was important to me that WebSyn supported being played by clicking and holding, as well as by playing them with the computer keyboard. The first 3 conditions activate and deactivate the note based on whether the mouse is down And on the key button. The last 2 check if the right note is being pressed or unpressed, then activate or deactivate the note. The buttons with these properties are then "printed" on the html file.
For events that activate the note, the eventListener calls the startOscillator() function, and if supposed to deactivate it, the stopOscillator() function.

As for the startOscillator() and stopOscillator() functions, they kind of showcase the limits of the Web Audio API. The way the API handles oscillators (and I assume other audio events), they can only be started once. Some nodes, like the AudioContext in general, can be paused and resumed. But the most reliable way to handle starting and stopping things like oscillators is to create it, start it, and when the program says it should end, stop it and destroy it.
This is exactly how startOscillator() is built. Every time it gets called, it checks whether or not an oscillator already exists within the scope of each note (and whether or not there is already a sound playing, for another layer of security), (the function is built within the forEach() loop). If it doesn't, it creates two (remember that WebSyn runs on 2 oscillators?), and sets the frequency to that of the note whose index it is being called in. It also calls the wave type for each oscillator based on the waveL and waveR selections. A gain node for each oscillator sets the max volume to (1-oscbalValue) for the left and oscbalValue for the right (this way, they're inversely proportional to each other). Then it connects the outputs of both these nodes to another (shared) gain node, oscEnv.
oscEnv handles the ADSR (using a fantastic function from the API called linearRampToValueAtTime): it ramps up to the full volume over the attack time, and falls to the sustain volume over the delay time.
Then, the output of oscEnv is connected to the next node in the chain (which in this version is the low-pass filter). And the oscillators start. The program logs that there is sound active in that note with prevNoteOff = false.

stopOscillator() is a little shorter, but has some tricks in its own way. First, it ramps the volume of oscEnv down to 0 over the release time. Then it checks if the oscillators exist, and if they do, it stops them and empties them out after the release time. The reason it has to check if the oscillators exist is because you can't empty something that doesn't exist, and if you attempted to, it would cause an error.

The last few pieces of functionality are the "MUTE ALL" button, which just closes the audioContext, stopping all the audio, the reset button (in the html, not in the script) which reloads the page, and the recording functionality.

The recording is built on the Media Capture and Streams API (Media Stream). The functionality used here is supported by all modern web browsers! And the two APIs communicate with each other really well. So much so that the media recorder destination is defined within the audioContext commands. The functionality of the recorder is pretty straightforward. It creates a MediaRecorder and chunks (which allow it to record longer files)When the "start" button is pressed it checks if there is already a recording happening, if there isn't it starts one and keeps going until the "stop" button is pressed. the "stop" button checks if there is a recording happening, and if there is it stops it. When the recording has stopped, the MediaRecorder recognizes it has data available, and handles the chunks, putting them together to create an audio file that gets linked to the audio placeholder in the HTML file.

I believe this is all of the functionality. I had so much fun and learned a lot making this project, which was my first real foray into text-based audio programming! I've been working with tools like this synth for a long time, and knew a lot about how they were built, but had never gone into trying to make them myself. Using the web audio API was also great because the documentation is really good and gives a lot of examples, which were great references. It was a lot of work, but I'm really happy with the result!





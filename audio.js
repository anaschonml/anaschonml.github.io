addEventListener("DOMContentLoaded", (event) => {
    // creating and setting up audioContext
    const audioContext = new AudioContext();

    // creating primary gain control from fader in html and assigning it as destination.
    const primaryGainControl = audioContext.createGain();
    primaryGainControl.connect(audioContext.destination);

    // defaults to 1
    volcontrol = document.querySelector("#mastervolume");
    // input, control, UI feedback
    primaryGainControl.gain.value = parseFloat(volcontrol.value);
    let voltxt = document.createTextNode(volcontrol.value);
    voltxt.className = 'info';
    master.insertBefore(voltxt, mastervolume.nextSibling);

    // handles change from html
    volcontrol.addEventListener("change", function() {
        console.log(volcontrol.value);
        primaryGainControl.gain.setValueAtTime(parseFloat(volcontrol.value), 0);
        voltxt.textContent = volcontrol.value;
    });
    console.log(primaryGainControl.gain.value);



    //adsr
    //attack
    //input, control, UI feedback
    const attackControl = document.querySelector("#attack");
    let attackTime = parseFloat(attackControl.value);
    atxt = document.createTextNode(attackControl.value);
    atxt.className = 'info';
    adsrdata.insertBefore(atxt, alabel.nextSibling);
    // controlling with slider
    attackControl.addEventListener(
        "change",
        (ev) => {
            attackTime = parseFloat(ev.target.value, 10);
            console.log(attackTime)
            atxt.textContent = attackTime;
            return attackTime;
        },
        false,
    );

    //decay
    // input, control, UI feedback
    const decayControl = document.querySelector("#decay");
    let decayTime = parseFloat(decayControl.value);
    dtxt = document.createTextNode(decayControl.value);
    dtxt.className = 'info';

    adsrdata.insertBefore(dtxt, dlabel.nextSibling);
    // controlling with slider
    decayControl.addEventListener(
        "change",
        (ev) => {
            console.log(decayControl.value);
            decayTime = parseFloat(ev.target.value, 10);
            dtxt.textContent = decayTime;
            return decayTime;
        },
        false,
    );

    //sustain
    // input, control, UI feedback
    const sustainControl = document.querySelector("#sustain");
    let sustainLevel = parseFloat(sustainControl.value);
    stxt = document.createTextNode(sustainControl.value);
    stxt.className = 'info';

    adsrdata.insertBefore(stxt, slabel.nextSibling);
    // controlling with slider
    sustainControl.addEventListener(
        "change",
        (ev) => {
            console.log(sustainControl.value);
            sustainLevel = parseFloat(ev.target.value, 10);
            stxt.textContent = sustainLevel;
            return sustainLevel;
        },
        false,
    );

    //release
    // input, control, UI feedback
    const releaseControl = document.querySelector("#release");
    let releaseTime = parseFloat(releaseControl.value);
    rtxt = document.createTextNode(releaseControl.value);
    rtxt.className = 'info';
    // controlling with slider
    adsrdata.insertBefore(rtxt, rlabel.nextSibling);
    releaseControl.addEventListener(
        "change",
        (ev) => {
            console.log(releaseControl.value)
            releaseTime = parseFloat(ev.target.value, 10);
            rtxt.textContent = releaseTime;
            return releaseTime;
        },
        false,
    );

    // octave control
    let octave = 1.0;
    let octcount = 0;
    // UI, input, controls (with octaves the number on screen and in backend don't match, so it's a lil more complicated)
    console.log(octcount);
    let octno = document.createElement('span');
    octno.className = 'info';
    octxt = document.createTextNode(octcount);
    octno.appendChild(octxt);
    octcontrol.insertBefore(octxt, octup.nextSibling);

    // controlling octave with on-screen buttons
    const octUp = document.querySelector("#octup");
    octUp.addEventListener("click", () => {
        octave = octave * 2;
        octcount++;
        octxt.textContent = octcount;
    });
    const octDwn = document.querySelector("#octdwn");
    octDwn.addEventListener("click", () => {
        octave = octave / 2;
        octcount--;
        octxt.textContent = octcount;
    });
    // controlling octave with z and x keys on keyboard
    // a sound is an octave higher when its primary frequency is doubled, an octave lower when halved
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyZ") {
            octave = octave / 2;
            octcount--;
            octxt.textContent = octcount;
        } else if (event.code === "KeyX") {
            octave = octave * 2;
            octcount++;
            octxt.textContent = octcount;
        }
    });

    // effects:
    // filters
    let lpf = audioContext.createBiquadFilter();
    let hpf = audioContext.createBiquadFilter();
    let bpf = audioContext.createBiquadFilter();
    const distortion = audioContext.createWaveShaper();
    const delay = audioContext.createDelay();

    // low-pass: filters out all frequencies above freq
    // input, control, UI feedback
    lpfreq = document.querySelector("#lpf");
    lptxt = document.createTextNode(lpfreq.value);
    lptxt.className = 'info';

    lpdata.insertBefore(lptxt, lpf.nextSibling);

    // controlling hpf with UI inputs
    lpf.type = "lowpass";
    lpf.frequency.value = lpfreq.value;
    lpfreq.addEventListener("change",
        (ev) => {
            console.log(lpfreq.value)
            lpf.frequency.value = parseFloat(ev.target.value, 10);
            lptxt.textContent = lpfreq.value;
            return lpf;
        },
        false,
    );
    lpf.connect(hpf);

    //high-pass: filters out all frequencies below freq
    //input, control, UI feedback
    hpfreq = document.querySelector("#hpf");
    hptxt = document.createTextNode(hpfreq.value);
    hptxt.className = 'info';

    hpdata.insertBefore(hptxt, hpf.nextSibling);

    //controlling hpf with UI inputs
    hpf.type = "highpass";
    hpf.frequency.value = hpfreq.value;
    hpfreq.addEventListener("change", (ev) => {
            console.log(hpfreq.value)
            hpf.frequency.value = parseFloat(ev.target.value, 10);
            hptxt.textContent = hpfreq.value;
            return lpf;
        },
        false,
    );
    hpf.connect(bpf);

    //bell: boosts or cuts a frequency and the surrounding ones by amounts defined by "gain" (how much) and "q" (how accurate to the specified frequency)
    //inputs, controls, UI feedback
    bpfreq = document.querySelector("#bpfreq");
    bpfq = document.querySelector("#bpfq");
    bpfg = document.querySelector("#bpfg");

    bptxt = document.createTextNode(bpfreq.value);
    bpqtxt = document.createTextNode(bpfq.value);
    bpgtxt = document.createTextNode(bpfg.value);
    bptxt.className = 'info';
    bpqtxt.className = 'info';
    bpgtxt.className = 'info';

    bpdata.insertBefore(bptxt, bpfbr);
    bpdata.insertBefore(bpqtxt, bpqbr);
    bpdata.insertBefore(bpgtxt, bpgbr);

    //controlling frequency
    bpf.type = "peaking";
    bpf.frequency.value = bpfreq.value;
    bpfreq.addEventListener("change", (ev) => {
        console.log(bpfreq.value)
        bpf.frequency.value = parseFloat(ev.target.value, 10);
        bptxt.textContent = bpfreq.value;
    }, false);

    // controlling Q
    bpfq.addEventListener("change", (ev) => {
        console.log(bpfq.value)
        bpf.Q.value = parseFloat(ev.target.value, 10);
        bpqtxt.textContent = bpfq.value
    }, false);

    // controlling gain
    bpfg.addEventListener("change", (ev) => {
            console.log(bpfg.value)
            bpf.gain.value = parseFloat(ev.target.value, 10);
            bpgtxt.textContent = bpfg.value
            return bpf;
        },
        false);
    bpf.connect(primaryGainControl);


    // distortion
    // create distortion curve for non-zero amts
    function makeDistortionCurve(amount) {
        const k = typeof amount === "number" ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        console.log(amount)

        for (let i = 0; i < n_samples; i++) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;

    };

    // initial value
    let distamt = document.querySelector("#distControl");
    let distamtValue = parseFloat(distamt.value, 10);
    //print info
    distxt = document.createTextNode(distamtValue);
    distxt.className = 'info';
    distortiondata.insertBefore(distxt, distbr);

    distamt.addEventListener("change", (ev) => {
        distamtValue = parseFloat(ev.target.value, 10);
        console.log(distamtValue);
        // disable if amount is 0
        if (distamtValue == 0) {
            bpf.disconnect();
            distortion.disconnect();
            bpf.connect(primaryGainControl);
            bpf.connect(delay);
            console.log(distamtValue);
            distxt.textContent = distamtValue;

            // enable otherwise
        } else {
            distortion.curve = makeDistortionCurve(distamtValue);
            distortion.oversample = "none";
            bpf.disconnect();
            bpf.connect(distortion);
            distortion.connect(primaryGainControl);
            distortion.connect(delay);
        }
        distxt.textContent = distamtValue;
    });

    // delay - establishing inputs and UI feedback:
    // mix (volume of delay)
    let dlymix = document.querySelector("#dlymix");
    let dlymixValue = parseFloat(dlymix.value, 10);

    // time
    let dlytime = document.querySelector("#dlytime");
    let dlytimeValue = parseFloat(dlytime.value, 10);

    // feedback (amount that gets repeated multiple times)
    let dlyfb = document.querySelector("#dlyfb")
    let dlyfbValue = parseFloat(dlyfb.value, 10);

    // displaying values in page
    let dlyttxt = document.createTextNode(dlytimeValue);
    let dlymtxt = document.createTextNode(dlymixValue);
    let dlyftxt = document.createTextNode(dlyfbValue);
    dlyttxt.className = 'info';
    dlymtxt.className = 'info';
    dlyftxt.className = 'info';

    dlydata.insertBefore(dlyttxt, dlytbr);
    dlydata.insertBefore(dlymtxt, dlymbr);
    dlydata.insertBefore(dlyftxt, dlyfbr);

    // controls mix as defined by volume of delay relative to dry signal
    bpf.connect(delay);
    let dlyGainControl = audioContext.createGain();
    dlyGainControl.gain.value = dlymixValue;

    dlymix.addEventListener("change", (ev) => {
        dlymixValue = parseFloat(ev.target.value, 10);
        console.log(dlymixValue);
        dlyGainControl.gain.value = dlymixValue;
        dlymtxt.textContent = dlymixValue;
    });
    dlyGainControl.connect(primaryGainControl);

    // delay time as defined by slider on page
    delay.delayTime.value = dlytimeValue;

    dlytime.addEventListener("change", (ev) => {
        dlytimeValue = parseFloat(ev.target.value, 10);
        console.log(dlytimeValue)
        delay.delayTime.value = dlytimeValue;
        dlyttxt.textContent = dlytimeValue;
    });

    // feedback defines amount of repeats, defined by what proportion of the delayed signal gets "fed back" into the delay's input.
    const dlyfeedback = audioContext.createGain();
    dlyfeedback.gain.value = dlyfbValue;

    dlyfb.addEventListener("change", (ev) => {
        dlyfbValue = parseFloat(ev.target.value, 10);
        dlyfeedback.gain.value = dlyfbValue;
        dlyftxt.textContent = dlyfbValue;
    });
    delay.connect(dlyfeedback);
    dlyfeedback.connect(delay);
    dlyfeedback.connect(dlyGainControl);
    delay.connect(dlyGainControl);


    // creating keyboard data - note, frequency, key that activates it
    const notes = [{
            name: "C",
            frequency: 261.63,
            keyCode: "KeyA"
        },
        {
            name: "C#",
            frequency: 277.18,
            keyCode: "KeyW"
        },
        {
            name: "D",
            frequency: 293.66,
            keyCode: "KeyS"
        },
        {
            name: "D#",
            frequency: 311.13,
            keyCode: "KeyE"
        },
        {
            name: "E",
            frequency: 329.63,
            keyCode: "KeyD"
        },
        {
            name: "F",
            frequency: 349.23,
            keyCode: "KeyF"
        },
        {
            name: "F#",
            frequency: 369.99,
            keyCode: "KeyT"
        },
        {
            name: "G",
            frequency: 392.0,
            keyCode: "KeyG"
        },
        {
            name: "G#",
            frequency: 415.3,
            keyCode: "KeyY"
        },
        {
            name: "A",
            frequency: 440.0,
            keyCode: "KeyH"
        },
        {
            name: "A#",
            frequency: 466.16,
            keyCode: "KeyU"
        },
        {
            name: "B",
            frequency: 493.88,
            keyCode: "KeyJ"
        },
        {
            name: "C2",
            frequency: 523.25,
            keyCode: "KeyK"
        },
        {
            name: "C#2",
            frequency: 554.37,
            keyCode: "KeyO"
        },
        {
            name: "D2",
            frequency: 587.33,
            keyCode: "KeyL"
        },
        {
            name: "D#2",
            frequency: 622.25,
            keyCode: "KeyP"
        },
        {
            name: "E2",
            frequency: 659.25,
            keyCode: "Semicolon"
        },
    ];

    // wave shapes
    const waveL = document.querySelector("#waveL");
    const waveR = document.querySelector("#waveR");

    // creating oscillator balance function and display
    oscbal = document.querySelector("#oscbal");
    let osctext = oscbal.value;
    let osctxt = document.createTextNode(osctext);
    oscbalance.insertBefore(osctxt, oscbaltxt.nextSibling);
    oscbal.addEventListener("change", (ev) => {
        osctxt.textContent = oscbal.value
        console.log(oscbal.value);
    });

    // creating buttons & classes etc for keyboard in html
    let sharp = "#";

    let divk = document.createElement('div');
    divk.className = 'keyboard';
    // create button for each note
    notes.forEach(({
        name,
        frequency,
        keyCode
    }) => {
        let noteButton = document.createElement('button');
        noteButton.innerText = name;
        if (name.includes(sharp)) {
            noteButton.className = "blkKey";
        } else {
            noteButton.className = "whtKey";
        }
        divk.appendChild(noteButton);
        keyboardiv.insertBefore(noteButton, empty);

        let noteActive = false

        // conditions that activate and deactivate notes:
        // with mouse click:
        // start
        noteButton.addEventListener("mousedown", () => {
            noteActive = true;
            startOscillator(name, (frequency * octave));
            noteButton.classList.add("pressed");
        })
        // stop (unclicked)
        noteButton.addEventListener("mouseup", () => {
            if (noteActive) {
                noteActive = false;
                stopOscillator(name);
                noteButton.classList.remove("pressed");
            }
        })
        // stop (mouse moved away from note)
        noteButton.addEventListener("mouseleave", () => {
            if (noteActive) {
                noteActive = false;
                stopOscillator(name);
                noteButton.classList.remove("pressed");
            }
        })
        // with key presses on keyboard:
        let KeyDown = false;
        //start
        window.addEventListener('keydown', (event) => {
            if (event.code === keyCode) {
                if (KeyDown) return;
                KeyDown = true;
                noteActive = true;
                startOscillator(name, (frequency * octave));
                noteButton.classList.add("pressed");

            }
        });
        //stop
        window.addEventListener('keyup', (event) => {
            if (event.code === keyCode) {
                KeyDown = false;
                noteActive = false;
                stopOscillator(name);
                noteButton.classList.remove("pressed");
            }
        });
        document.body.appendChild(divk);

        // creating oscillators & envelope node
        let leftOscillator;
        let rightOscillator;
        const oscEnv = new GainNode(audioContext);
        const leftGain = new GainNode(audioContext);
        const rightGain = new GainNode(audioContext);

        let prevNoteOff = true;
        // activates note
        function startOscillator(name, frequency) {
            if (noteActive == true && prevNoteOff == true) {

                leftOscillator = audioContext.createOscillator();
                leftOscillator.type = waveL.options[waveL.selectedIndex].value;
                leftOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                leftGain.gain.setValueAtTime(1 - oscbal.value, 0);
                // console.log(leftGain.value);

                leftOscillator.connect(leftGain);
                leftGain.connect(oscEnv);

                rightOscillator = audioContext.createOscillator();
                rightOscillator.type = waveR.options[waveR.selectedIndex].value;
                rightOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                rightGain.gain.setValueAtTime(oscbal.value, 0);
                // console.log(rightGain.value)

                rightOscillator.connect(rightGain);
                rightGain.connect(oscEnv);

                oscEnv.gain.cancelScheduledValues(0);
                oscEnv.gain.setValueAtTime(0, 0);
                oscEnv.gain.linearRampToValueAtTime(1, audioContext.currentTime + attackTime);
                oscEnv.gain.linearRampToValueAtTime(sustainLevel, audioContext.currentTime + decayTime);

                oscEnv.connect(lpf);
                leftOscillator.start();
                rightOscillator.start();
                console.log(name, "on");
                prevNoteOff = false;
            };
        };
        // kills note
        function stopOscillator(name) {

            console.log(name, "off");
            prevNoteOff = true;
            oscEnv.gain.linearRampToValueAtTime(0, audioContext.currentTime + releaseTime);
            if (leftOscillator != null && rightOscillator != null) {
                setTimeout(() => {
                    leftOscillator.stop();
                    leftOscillator = null;
                    rightOscillator.stop();
                    rightOscillator = null;
                }, (releaseTime * 1000));
            };
        };
    });

    //muting all sound (for emergencies)
    muteall = document.querySelector("#muteall")
    muteall.addEventListener("click", () => {
        if (audioContext.state !== 'closed') {
            audioContext.close().then(function() {
                console.log('AudioContext is closed');
            });
        };
    });


    //recording
    dest = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(dest.stream, {
        mimeType: 'audio/ogg'
    });
    primaryGainControl.connect(dest);
    let recording = false;
    const chunks = [];
    recstart = document.querySelector("#recstart");
    recstart.addEventListener("click", (ev) => {
        if (recording == false) {
            mediaRecorder.start();
            recording = true;
            console.log("recording started")
        }
    });
    recstop = document.querySelector("#recstop");
    recstop.addEventListener("click", (ev) => {
        if (recording == true) {
            mediaRecorder.stop()
            recording = false
            console.log("recording stopped")
        }
    });

    mediaRecorder.ondataavailable = (evt) => {
        // push each chunk (blobs) in an array
        chunks.push(evt.data);
    };

    mediaRecorder.onstop = (evt) => {
        // make blob out of our blobs, and open it.
        const blob = new Blob(chunks, {
            type: mediaRecorder.mimeType
        });
        document.querySelector("#recording").src = URL.createObjectURL(blob);

    };

});

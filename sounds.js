const piano = Synth.createInstrument("piano");

const noteDuration = 2;
const keysWithSound = {
	q     : [ "G#", 3, noteDuration ],
	w     : [ "F#", 4, noteDuration ],
	e     : [ "A", 3, noteDuration ],
	r     : [ "D", 4, noteDuration ],
	t     : [ "G", 3, noteDuration ],
	y     : [ "D#", 4, noteDuration ],
	u     : [ "F#", 2, noteDuration ],
	i     : [ "E", 3, noteDuration ],
	o     : [ "F", 3, noteDuration ],
	p     : [ "G#", 4, noteDuration ],
	a     : [ "B", 3, noteDuration ],
	s     : [ "C", 3, noteDuration ],
	d     : [ "F", 4, noteDuration ],
	f     : [ "C#", 4, noteDuration ],
	g     : [ "A#", 4, noteDuration ],
	h     : [ "E", 4, noteDuration ],
	j     : [ "A#", 3, noteDuration ],
	k     : [ "D", 3, noteDuration ],
	l     : [ "G", 3, noteDuration ],
	z     : [ "G", 4, noteDuration ],
	x     : [ "F#", 3, noteDuration ],
	c     : [ "G#", 2, noteDuration ],
	v     : [ "D#", 3, noteDuration ],
	b     : [ "C#", 3, noteDuration ],
	n     : [ "C", 4, noteDuration ],
	m     : [ "A#", 2, noteDuration ],
	"1"   : [ "F#", 4, noteDuration ],
	"2"   : [ "A#", 4, noteDuration ],
	"3"   : [ "G#", 4, noteDuration ],
	"4"   : [ "D#", 3, noteDuration ],
	"5"   : [ "D", 3, noteDuration ],
	"6"   : [ "A#", 3, noteDuration ],
	"7"   : [ "G", 4, noteDuration ],
	"8"   : [ "G#", 3, noteDuration ],
	"9"   : [ "F#", 3, noteDuration ],
	"0"   : [ "C#", 3, noteDuration ],
	"["   : [ "B", 2, noteDuration ],
	"]"   : [ "B", 2, noteDuration ],
	"{"   : [ "B", 2, noteDuration ],
	"}"   : [ "B", 2, noteDuration ],
	"\\"  : [ "B", 2, noteDuration ],
	"/"   : [ "B", 2, noteDuration ],
	"'"   : [ "G", 2, noteDuration ],
	'"'   : [ "G", 2, noteDuration ],
	"-"   : [ "D", 2, noteDuration ],
	_     : [ "D", 2, noteDuration ],
	"."   : [ "A", 2, noteDuration ],
	","   : [ "A", 2, noteDuration ],
	":"   : [ "E", 2, noteDuration ],
	";"   : [ "E", 2, noteDuration ],
	"!"   : [ "F", 2, noteDuration ],
	"?"   : [ "F", 2, noteDuration ],
	" "   : [ "A#", 2, noteDuration ],
	enter : [ "A#", 2, noteDuration ]
};

const keysWithoutSound = [ "backspace", "arrowup", "arrowdown", "arrowleft", "arrowright" ];

const textarea = document.querySelector("#text");
const muteBtn = document.querySelector("i");

const timeouts = [];
let isSoundOn = true;
let timeoutID;
let intervalID;

Synth.setVolume(0.1337);
muteBtn.addEventListener("click", () => {
	if (isSoundOn) {
		Synth.setVolume(0);
		isSoundOn = false;
	} else {
		Synth.setVolume(0.1337);
		isSoundOn = true;
	}
});

window.onload = () => {
	textarea.focus();
};

textarea.addEventListener("keydown", onInput);
textarea.addEventListener("cut", (event) => {
	event.preventDefault();
});
textarea.addEventListener("paste", (event) => {
	event.preventDefault();
});

function onInput ({ key }) {
	const pressedKey = key.toLowerCase();
	const sound = keysWithSound[pressedKey];

	if (!(sound || keysWithoutSound.includes(pressedKey))) {
		event.preventDefault();
	} else {
		if (sound) {
			piano.play(...sound);
		}

		clearTimeouts();
		if (timeoutID) {
			clearTimeout(timeoutID);

			if (intervalID) {
				clearInterval(intervalID);
			}
		}

		timeoutID = setTimeout(() => {
			const innerText = this.innerText.toLowerCase();
			const keys = [ ...innerText ];

			if (keys[0] === "\n") {
				keys.shift();
			}
			if (keys.length > 0) {
				playAll(keys);

				intervalID = setInterval(() => {
					clearTimeouts();
					playAll(keys);
				}, 400 * keys.length + 1000);
				// this.blur();
			}
		}, 4000);
	}
}

const playAll = (keys) => {
	keys.forEach((key, i) => {
		const timeout = setTimeout(() => {
			if (key === "\n") {
				const { enter } = keysWithSound;
				piano.play(...enter);
			} else {
				const sound = keysWithSound[key];
				piano.play(...sound);
				highlight(i);
			}
		}, i * 400);

		timeouts.push(timeout);
	});
};

const clearTimeouts = () => {
	if (timeouts.length > 0) {
		for (id of timeouts) {
			clearTimeout(id);
		}
		timeouts.splice(0);
	}
};

const highlight = (index) => {
	const innerText = textarea.innerText;
	const newHTML = `${innerText.substring(0, index)}<span>${innerText.charAt(index)}</span>${innerText.substring(
		index + 1
	)}`;

	textarea.innerHTML = newHTML;
	setEndOfContenteditable(textarea);
};

function setEndOfContenteditable (contentEditableElement) {
	var range, selection;
	if (document.createRange) {
		//Firefox, Chrome, Opera, Safari, IE 9+
		range = document.createRange(); //Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
		range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection(); //get the selection object (allows you to change selection)
		selection.removeAllRanges(); //remove any selections already made
		selection.addRange(range); //make the range you have just created the visible selection
	} else if (document.selection) {
		//IE 8 and lower
		range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
		range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
		range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
		range.select(); //Select the range (make it the visible selection
	}
}

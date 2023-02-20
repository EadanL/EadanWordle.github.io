// set loading...

document.addEventListener("DOMContentLoaded", () => {
	// drawGrid();
	// keyboardInputEvents();
	// darkmode();

	let hint = "";
	let word = "";

	const start = () =>
		getWord().then((obj) => {
			word = obj.word;
			hint = obj.hint;
			console.log(word);
		});

	start();

	const words = document.querySelectorAll(".word");
	let i = 0;
	let j = 0;

	window.addEventListener("keydown", (e) => {
		const key = e.key;
		const letters = words[i].querySelectorAll(".box");
		displaykeys(key);
		console.log(j);

		// normal key press
		if (j <= 3 && key.length === 1 && key.match(/[a-z]/i)) {
			if (j <= 3) {
				letters[j].textContent = key;
				j++;
			}
		}

		// enter
		if (j < 4 && key === "Enter") {
			window.alert("You must complete the word first");
		}

		if (j === 4 && key === "Enter") {
			validate(letters);
			if (i === 3 && j === 4) {
				const messageBox = document.getElementById("player-message");
				messageBox.innerText = `You lost, the word was: ${word}`;
				messageBox.classList.add("lose");
			} else {
				j = 0;
				i++;
			}
		}

		// delete
		if (j > 0 && key === "Backspace") {
			letters[--j].textContent = "";
		}

		// out of guesses
	});

	// start over click
	document.getElementById("start-over").addEventListener("click", () => {
		start();

		// reset boxes
		const boxes = document.querySelectorAll(".box");
		const messageBox = document.getElementById("player-message");
		for (let i = 0; i < boxes.length; i++) {
			boxes[i].innerText = "";
			const classes = boxes[i].classList;
			if (classes.contains("wrong")) classes.remove("wrong");
			if (classes.contains("right")) classes.remove("right");
			if (classes.contains("included")) classes.remove("included");
			messageBox.classList.remove("lose");
		}
		document.getElementById("congrats-message").style.display = "none";
		document.getElementById("grid").style.display = "grid";

		i = 0;
		j = 0;
	});

	// toggle dark mode
	document.getElementById("dark-mode").addEventListener("click", () => {
		if (document.body.classList.contains("dark")) {
			document.body.classList.remove("dark");
		} else {
			document.body.classList.add("dark");
		}
	});

	document.getElementById("hint").addEventListener("click", () => {
		// TODO: show hint...
		const messageBox = document.getElementById("player-message");
		if (messageBox.classList.contains("visible")) {
			messageBox.classList.remove("visible");
		} else {
			messageBox.innerText = hint;
			messageBox.classList.add("visible");
		}
	});

	document.getElementById("info").addEventListener("click", () => {
		// TODO: show hint...
		const el = document.getElementById("instructions");
		if (el.classList.contains("open")) {
			el.classList.remove("open");
		} else {
			el.classList.add("open");
		}
	});

	// Function to get word from api
	async function getWord() {
		// TODO: SET LOADING STATE
		const startOverButton = document.getElementById("start-over");
		startOverButton.disabled = true;
		startOverButton.textContent = "Loading...";

		/* res will fetch the result word (ADDED THE ASYNC AT THE VERY TOP) */
		const res = await fetch("https://api.masoudkf.com/v1/wordle", {
			headers: {
				"x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
			},
		});
		const result = await res.json();
		let randomNumber = Number.parseInt(
			Math.random() * result.dictionary.length
		);

		startOverButton.disabled = false;
		startOverButton.textContent = "Start Over";
		return result.dictionary[randomNumber];
	}

	// FUNCTIONS

	// validates guess
	function validate(inputs) {
		const correctLetters = word.toLowerCase().split("");
		let letterCorrect = 0;
		// const wordTemp = getCurrentGuess();
		for (let i = 0; i < inputs.length; i++) {
			const letter = inputs[i].textContent.toLowerCase();
			if (letter === correctLetters[i]) {
				inputs[i].classList.add("right");
				letterCorrect++;
			} else if (correctLetters.includes(letter)) {
				inputs[i].classList.add("included");
			} else {
				inputs[i].classList.add("wrong");
			}
		}
		if (letterCorrect === 4) {
			// win condition
			document.getElementById("grid").style.display = "none";
			document.getElementById("congrats-message").style.display = "flex";
		}
		letterCorrect = 0;
	}

	function displaykeys(key) {
		const displayEl = document.getElementById("keypress");
		displayEl.innerText = key;
		displayEl.style.visibility = "visible";
		setTimeout(() => {
			displayEl.style.visibility = "hidden";
		}, 500);
	}
});

let steps = [];

// populate steps based on local storage:
chrome.storage.local.get('steps', function getSettings(data) {
	steps = data.steps;
	let input = null;
	for (let i=0; i<steps.length; i++) {
		input = createInput(steps[i]); // p5.js
		input.class('step');
	}
});

// TODO: decide if I need this listener:
chrome.runtime.onMessage.addListener(function doThis(request, sender, sendResponse) {
	console.log(request);
});

function setup() { // p5.js
	noCanvas();
	
	let clearButton = select('#clear');
	clearButton.mousePressed(clear);
	function clear() {
		chrome.storage.local.set({'steps': []}, function() {});
		let steps = select('.step');
		for (let i=0; i<steps.length; i++) {
			steps[i].remove();
		}
		window.close();
	}

	// let userInput = select('#userInput');
	// userInput.value(steps);
	// userInput.input(onChangeInput);
	// function onChangeInput() {
	// 	let params = {
	// 		active: true,
	// 		currentWindow: true
	// 	}
	// 	chrome.tabs.query(params, processTabs);

	// 	function processTabs(tabs) {
	// 		console.log("got tabs");
	// 		console.log(tabs);
	// 		let message = userInput.value();
	// 		let msg = {
	// 			userInput: message
	// 		};
	// 		chrome.tabs.sendMessage(tabs[0].id, msg); // tab ID is required
	// 	}
	// }
}
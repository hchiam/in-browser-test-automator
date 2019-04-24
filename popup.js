let runButton = document.getElementById('start-button');

runButton.addEventListener('click', function() {
	chrome.tabs.executeScript(null, {file: 'jquery.min.js'});
	chrome.tabs.executeScript(null, {file: 'jquery-ui.min.js'});
	chrome.tabs.executeScript(null, {file: 'test.js'});
	window.close();
});
var runButton = document.getElementById('start-button');

runButton.addEventListener('click', function() {
	chrome.tabs.executeScript(null, {file: 'test.js'});
	window.close();
});
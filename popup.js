var savedSteps = '';
chrome.storage.local.get('savedSteps', function getSettings(data) {
	savedSteps = data.savedSteps ? 'var savedSteps = ' + JSON.stringify(data.savedSteps) + ';' : 
		`var savedSteps = [
			{
				'action':'click',
				'value':''
			}
		];`;
});

var numberOfStepsCreated = 0;
chrome.storage.local.get('numberOfStepsCreated', function getSettings(data) {
	numberOfStepsCreated++;
	numberOfStepsCreated = data.numberOfStepsCreated ? 'var numberOfStepsCreated = ' + numberOfStepsCreated + ';' : 
		`var numberOfStepsCreated = 1;`;
});

let runButton = document.getElementById('start-button');
runButton.addEventListener('click', function() {
	chrome.tabs.executeScript(null, {file: 'jquery.min.js'});
	chrome.tabs.executeScript(null, {file: 'jquery-ui.min.js'});
	chrome.tabs.executeScript(null, {
		code: numberOfStepsCreated + savedSteps
	}, function(){
		chrome.tabs.executeScript(null, {file: 'test.js'});
		window.close();
	});
});
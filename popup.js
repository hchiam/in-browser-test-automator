var savedSteps = '';
var numberOfStepsCreated = 1;
let runButton = document.getElementById('start-button');

chrome.storage.local.get('savedSteps', function getSettings(data) {
	if (data.savedSteps && data.savedSteps.length > 0) {
		savedSteps = `var savedSteps = ${JSON.stringify(data.savedSteps)};`;
		numberOfStepsCreated = `var numberOfStepsCreated = ${data.savedSteps.length};`;
	} else {
		savedSteps = `
			var savedSteps = [
				{
					'action':'click',
					'value':''
				}
			];`
		numberOfStepsCreated = 'var numberOfStepsCreated = 1;';
	}
});

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
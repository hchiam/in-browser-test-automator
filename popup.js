var numberOfStepsCreated = 1;
var savedSteps = '';
let runButton = document.getElementById('start-button');

chrome.storage.local.get('savedSteps', function getSettings(data) {
	// TODO: clean up nulls and then update numberOfStepsCreated
	let hasSteps = data.savedSteps && data.savedSteps.length > 0;
	let hasValidSteps = data.savedSteps && data.savedSteps.find(s => s);
	let hasLastStepFilled = data.savedSteps && data.savedSteps.slice().reverse().find(s => s && s.value !== '');
	if (!hasSteps || !hasValidSteps) {
		numberOfStepsCreated = 'var numberOfStepsCreated = 1;';
		savedSteps = `
			var savedSteps = [
				{
					'action':'click',
					'value':''
				}
			];`
	} else if (hasLastStepFilled) {
		data.savedSteps.push(
			{
				'action':'click',
				'value':''
			}
		);
		numberOfStepsCreated = `var numberOfStepsCreated = ${data.savedSteps.length};`;
		savedSteps = `var savedSteps = ${JSON.stringify(data.savedSteps)};`;
	} else {
		numberOfStepsCreated = `var numberOfStepsCreated = ${data.savedSteps.length};`;
		savedSteps = `var savedSteps = ${JSON.stringify(data.savedSteps)};`;
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
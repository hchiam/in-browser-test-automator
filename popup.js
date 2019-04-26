var numberOfStepsCreated_init = 1;
var savedSteps_init = '';
let runButton = document.getElementById('start-button');

chrome.storage.local.get('savedSteps', function getSettings(data) {
	// TODO: clean up nulls and then update numberOfStepsCreated
	let hasSteps = data.savedSteps && data.savedSteps.length > 0;
	let hasValidSteps = data.savedSteps && data.savedSteps.find(s => s);
	let hasLastStepFilled = data.savedSteps && data.savedSteps.slice().reverse().find(s => s && s.value !== '');
	if (!hasSteps || !hasValidSteps) {
		numberOfStepsCreated_init = 'var numberOfStepsCreated = 1;';
		savedSteps_init = `
			var savedSteps = [
				{
					'action':'click',
					'value':''
				}
			];`
	} else if (hasLastStepFilled) {
		let savedSteps = cleanUpNullSteps(data.savedSteps);
		savedSteps.push(
			{
				'action':'click',
				'value':''
			}
		);
		numberOfStepsCreated_init = `var numberOfStepsCreated = ${savedSteps.length};`;
		savedSteps_init = `var savedSteps = ${JSON.stringify(savedSteps)};`;
	} else {
		let savedSteps = cleanUpNullSteps(data.savedSteps);
		numberOfStepsCreated_init = `var numberOfStepsCreated = ${savedSteps.length};`;
		savedSteps_init = `var savedSteps = ${JSON.stringify(savedSteps)};`;
	}
});

runButton.addEventListener('click', function() {
	chrome.tabs.executeScript(null, {file: 'jquery.min.js'});
	chrome.tabs.executeScript(null, {file: 'jquery-ui.min.js'});
	chrome.tabs.executeScript(null, {
		code: numberOfStepsCreated_init + savedSteps_init
	}, function(){
		chrome.tabs.executeScript(null, {file: 'test.js'});
		window.close();
	});
});

function cleanUpNullSteps(steps) {
	return steps.filter(s => s !== null);
}

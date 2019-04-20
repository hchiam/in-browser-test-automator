(function() {

	var numberOfStepsCreated = 0;
	addStep();
	function addStep() {
		numberOfStepsCreated++;
		$('#steps').add(`
		<div id="step-${numberOfStepsCreated}">
			<select class="action">
				<option value="click">Click on</option>
				<option value="select">Select</option>
				<option value="enter">Enter</option>
				<option value="check">Should show</option>
			</select> : 
			<input placeholder="">
			<button id="remove-step-${numberOfStepsCreated}">-</button>
		</div>
		`).appendTo('#steps');

		$('#remove-step-' + numberOfStepsCreated).click(function useSettings(e) {
			var step = e.target.id.replace(/^remove-step-/,'');
			$("#step-" + step).remove();
		})
	}

	$('#start-button').click(function useSettings() {
		chrome.tabs.executeScript(null, {file: 'test.js'});
	})

	$('#add-step').click(function useSettings() {
		addStep();
	})

})();
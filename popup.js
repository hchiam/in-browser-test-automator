let numberOfStepsCreated_init = 1;
let savedSteps_init = "";
let runButton = document.getElementById("start-button");

chrome.storage.local.get("savedSteps", function getSettings(data) {
  let savedSteps = cleanUpNullSteps(data.savedSteps);
  let hasSteps = savedSteps.length > 0;
  if (!hasSteps) {
    numberOfStepsCreated_init = "var numberOfStepsCreated = 1;";
    savedSteps_init = `var savedSteps = [
      {
        'action':'click',
        'value':''
      }
    ];`;
  } else {
    numberOfStepsCreated_init = `var numberOfStepsCreated = ${savedSteps.length};`;
    savedSteps_init = `var savedSteps = ${JSON.stringify(savedSteps)};`;
  }
});

runButton.addEventListener("click", function () {
  chrome.tabs.executeScript(null, { file: "jquery.min.js" });
  chrome.tabs.executeScript(null, { file: "jquery-ui.min.js" });
  chrome.tabs.executeScript(
    null,
    {
      code: numberOfStepsCreated_init + savedSteps_init,
    },
    function () {
      chrome.tabs.executeScript(null, { file: "test.js" });
      window.close();
    }
  );
});

function cleanUpNullSteps(steps) {
  if (steps && Array.isArray(steps)) {
    return steps.filter((s) => s !== null);
  } else {
    return [];
  }
}

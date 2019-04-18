'use strict';

let runButton = document.getElementById('start-button');

runButton.addEventListener("click", function useSettings() {
  chrome.tabs.executeScript(null, {file: 'test.js'});
  window.close();
});

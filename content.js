// when the user clicks on an element on the page,
// then that element's "identifier" should be added to a list stored locally:
document.addEventListener('click', function(e) {
	e = e || window.event;
	let target = e.target || e.srcElement;

	let tagName = target.localName || target.nodeName;
	let id = target.getAttribute('id');
	let className = target.getAttribute('class');
	
	let identifier = tagName.trim();
	identifier += id ? '#' + id.trim() : '';
	identifier += className ? '.' + className.trim().replace(/ /g, '.') : '';
	
	// TODO: if identifier is not unique, recursively check if combining with parent info helps
	
	// TODO: if identifier cannot be unique, tell user

	// TODO: if identifier changed, then save any last input entry text as a separate step

	let message = {
		identifier: identifier
	};
	chrome.runtime.sendMessage(message); // -> chrome.runtime.onMessage.addListener(...)
	chrome.storage.local.get('steps', function getSettings(data) {
		let steps = data.steps || [];
		steps.push(identifier)
		chrome.storage.local.set({'steps': steps}, function() {});
	});
}, false);
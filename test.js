(function() {

    var numberOfStepsCreated = 0;
    var currentElement = '';

    var baseStyle = 'all: initial; padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; ';
    var onHoverStyle = baseStyle + 'background: rgba(0,100,255,1); ';
    var offHoverStyle = baseStyle + 'background: rgba(0,100,255,0.5); ';

    createModal();

    addStep(); // initialize

    function createModal() {
        var div = document.createElement("div");
        div.style.cssText = 'all: initial; position: fixed; left: 25%; top: 25vh; width: 50%; height: 50%; padding: 1rem; z-index: 9999; border: 1rem solid rgba(0,100,255,0.5); background: rgba(255,255,255,0.75); color: black; overflow-y: auto; border-radius: 5px; font-family: avenir, arial, tahoma; box-shadow: inset 0 -50px 50px -55px rgba(0, 0, 0, 1);';
        div.id = 'in-browser-test-modal';
        div.className = 'in-browser-test-modal';
        makeElementDraggable(div);

        var h1 = document.createElement("H1");
        h1.id = 'in-browser-test-modal-h1';
        h1.className = 'in-browser-test-modal';
        h1.innerHTML = 'Test Automation Steps:';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold;';
        div.appendChild(h1);

        createCloseButton(div);

        createInput(div);

        createPointerPreview(div);

        createRunButton(div);

        var steps = document.createElement("div");
        steps.id = 'steps';
        steps.className = 'in-browser-test-modal';
        div.appendChild(steps);

        document.body.insertBefore(div, document.body.firstChild);
    }

    function createCloseButton(container) {
        var button = document.createElement("button");
        button.id = 'in-browser-test-modal-close';
        button.className = 'in-browser-test-modal';
        button.innerHTML = 'X';
        button.style.cssText = 'all: initial; position: absolute; right: 1rem; background: rgba(0,100,255,0.5); padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma;';
        button.title = 'Close';
        button.onclick = function() {
            removeModal();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'position: absolute; right: 1rem; ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'position: absolute; right: 1rem; ';
        };
        container.appendChild(button);
    }

    function createPointerPreview(container) {
        var h1 = document.createElement("H1");
        h1.id = 'in-browser-test-modal-pointer-preview-h1';
        h1.className = 'in-browser-test-modal';
        h1.innerHTML = 'Your pointer is hovering over: ';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold; color: grey; text-align: center; ';
        container.appendChild(h1);
        var div = document.createElement("div");
        div.id = 'in-browser-test-modal-pointer-preview';
        div.className = 'in-browser-test-modal';
        div.innerHTML = '-';
        div.style.cssText = 'color: grey; background: white; text-align: center; ';
        container.appendChild(div);
    }

    function createInput(container) {
        var sharedStyle = 'min-height: 20px; width: 90%; border: none; font-family: avenir, arial; font-size: 1rem; font-weight: bold; padding: 10px; border-radius: 3px; margin-bottom: 1rem; '
        
        var div = document.createElement("div");
        div.className = 'in-browser-test-modal';
        div.style.cssText = 'margin-top: 1rem; position: relative; ';
        
        var input = document.createElement("input");
        input.id = 'in-browser-test-modal-input';
        input.className = 'in-browser-test-modal';
        input.style.cssText = 'position: relative; display: block; color: rgba(255,255,255,0); background: rgba(255,255,255,0); caret-color: black; ' + sharedStyle;
        input.placeholder = 'click/type/check something';
        input.onkeyup = function() {
            // TODO: find element/elements, point to it/them, if >1 tell user to be more specific, if <1 tell user not found and give a suggestion
            // processInput(input.value);
        };
        div.appendChild(input);
        
        var colorOverlay = document.createElement("div");
        colorOverlay.id = 'in-browser-test-modal-input-overlay';
        colorOverlay.className = 'in-browser-test-modal';
        colorOverlay.style.cssText = 'position: absolute; top: 0; left: 0; z-index: -1; color: grey; background: rgba(100,200,255,0.5); ' + sharedStyle;
        input.onmouseover = function() {
            colorOverlay.style.cssText = 'position: absolute; top: 0; left: 0; z-index: -1; color: grey; background: rgba(66,134,244,0.5); ' + sharedStyle;
        };
        input.onmouseout = function() {
            colorOverlay.style.cssText = 'position: absolute; top: 0; left: 0; z-index: -1; color: grey; background: rgba(100,200,255,0.5); ' + sharedStyle;
        };
        div.appendChild(colorOverlay);
        
        container.appendChild(div);
    }
    
	function addStep() {
        numberOfStepsCreated++;

        var div = document.createElement("div");
        div.id = 'step-' + numberOfStepsCreated;
        div.className = 'in-browser-test-modal';
        
        var select = document.createElement('select');
        select.className = 'action';
        select.className = 'in-browser-test-modal';

        var optionClick = document.createElement('option');
        optionClick.className = 'in-browser-test-modal';
        optionClick.value = 'click';
        optionClick.innerHTML = 'Click on:';
        select.appendChild(optionClick);

        var optionSelect = document.createElement('option');
        optionSelect.className = 'in-browser-test-modal';
        optionSelect.value = 'select';
        optionSelect.innerHTML = 'Select:';
        select.appendChild(optionSelect);

        var optionEnter = document.createElement('option');
        optionEnter.className = 'in-browser-test-modal';
        optionEnter.value = 'enter';
        optionEnter.innerHTML = 'Enter:';
        select.appendChild(optionEnter);

        var optionShouldShow = document.createElement('option');
        optionShouldShow.className = 'in-browser-test-modal';
        optionShouldShow.value = 'check';
        optionShouldShow.innerHTML = 'Should show:';
        select.appendChild(optionShouldShow);

        var input = document.createElement('input');
        input.className = 'in-browser-test-modal';
        input.placeholder = '';

        var button = document.createElement('button');
        button.id = 'remove-step-' + numberOfStepsCreated;
        button.className = 'in-browser-test-modal';
        button.innerHTML = '-';

        div.appendChild(select);
        div.appendChild(input);
        div.appendChild(button);

        var steps = document.getElementById('steps');
        steps.appendChild(div);
        
		// $('#remove-step-' + numberOfStepsCreated).click(function useSettings(e) {
		// 	var step = e.target.id.replace(/^remove-step-/,'');
		// 	$("#step-" + step).remove();
		// })
	}

    function createRunButton(container) {
        var button = document.createElement("button");
        button.id = 'in-browser-test-modal-run';
        button.className = 'in-browser-test-modal';
        button.innerHTML = '&#9658; Run the following steps:';
        button.style.cssText = 'all: initial; left: 1rem; background: rgba(0,100,255,0.5); padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; margin: 0.5rem; margin-top: 2rem; ';
        button.onclick = function() {
            runSteps();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'left: 1rem; margin: 0.5rem; margin-top: 2rem; ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'left: 1rem; margin: 0.5rem; margin-top: 2rem; ';
        };
        container.appendChild(button);
    }

    function removeModal() {
        var modal = document.getElementById('in-browser-test-modal');
        if (modal) {
            modal.parentNode.removeChild(modal);
        }
    }

    function runSteps() {
        currentElement = '';
        var overallPassed = true;
        var message = '';
        for (var i=0; i<steps.length; i++) {
            var step = steps[i];
            
            // TODO: maybe do goto elsewhere:

//             var go = step.match(/^go (to )?(.+)/);
//             if (go) {
//                 var url = go[go.length-1];
//                 message += '\nStep ' + (i+1) + ': go to ' + url;
//                 window.location.href = url;
//                 continue;
//             }
            var click = step.match(/^(click|tap) (on )?(.+)/);
            if (click) {
                currentElement = click[click.length-1];
                message += '\nStep ' + (i+1);
                if (findElement(currentElement)) {
                    message += ': click on ' + currentElement;
                    findElement(currentElement).click()
                } else {
                    message += ' FAILED: could not find ' + currentElement;
                    overallPassed = false;
                    break;
                }
                continue;
            }
            var type = step.match(/^(type|enter) (in )?(.+)/);
            if (type) {
                var value = type[type.length-1];
                message += '\nStep ' + (i+1) + ': type in ' + currentElement + ': "' + value + '"';
                findElement(currentElement).value = value;
                findElement(currentElement).innerHTML = value;
                continue;
            }
            var check = step.match(/^(check|verify)( that (it('| i)s))? (.+)/);
            if (check) {
                var expectedValue = check[check.length-1];
                var actualValue = findElement(currentElement).value || findElement(currentElement).innerHTML;
                var equals = (actualValue === expectedValue);
                message += '\nStep ' + (i+1) + ' ';
                message += equals ? ('PASSED: "' + actualValue + '" is "' + expectedValue + '"') : ('FAILED: "' + actualValue + '" is NOT "' + expectedValue + '"');
                if (!equals) {
                    overallPassed = false;
                    break;
                }
                continue;
            }
        }
        message += '\n\nOverall status: ';
        message += overallPassed ? 'PASSED' : 'FAILED';
        alert(message);
    }

    function findElement(elementSelector) {
        try {
            return document.querySelector(currentElement);
        } catch {
            return null;
        }
    }

    function autoFillClickIdentifier(event) {
        var e = event.target;
        var tag = (e.tagName) ? e.tagName.toLowerCase() : '';
        var id = (e.id) ? '#' + e.id : '';
        var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';
        var isInput = (id == '#in-browser-test-modal-input');
        var isRunButton = (id == '#in-browser-test-modal-run');
        var isModalUIElement = (classes == '.in-browser-test-modal');
        if (!isInput && !isRunButton && !isModalUIElement) {
            var sentence = 'click ' + tag + id + classes;
            document.getElementById('in-browser-test-modal-input').value = sentence;
            document.getElementById('in-browser-test-modal-input-overlay').innerHTML = sentence;
            
            // prevent click from triggering button action (and prevent event propagation):
            (event || window.event).preventDefault();
            (event || window.event).stopPropagation();
            return false;
        }
    }

    document.addEventListener('click', autoFillClickIdentifier, false);

    document.addEventListener('contextmenu', autoFillClickIdentifier, false);

    document.addEventListener('mouseover', function(event) {
        var e = event.target;
        var tag = (e.tagName) ? e.tagName.toLowerCase() : '';
        var id = (e.id) ? '#' + e.id : '';
        var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';

        document.getElementById('in-browser-test-modal-pointer-preview').innerHTML = tag + id + classes;
    }, false);

    function makeElementDraggable(element) {
        var xChange = 0;
        var yChange = 0;
        var x = 0;
        var y = 0;
        element.onmousedown = dragOnMouseDown;

        function dragOnMouseDown(event) {
            if ((event.target.className = 'in-browser-test-modal') || (event.target.id == 'in-browser-test-modal-input') || (event.target.id == 'in-browser-test-modal-run')) {
                return;
            }
            var event = event || window.event;
            event.preventDefault();
            x = event.clientX;
            y = event.clientY;
            document.onmouseup = stopDragging;
            document.onmousemove = dragElement;
        }

        function stopDragging() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function dragElement(event) {
            var event = event || window.event;
            event.preventDefault();
            xChange = event.clientX - x;
            yChange = event.clientY - y;
            x = event.clientX;
            y = event.clientY;
            element.style.left = (element.offsetLeft + xChange) + "px";
            element.style.top = (element.offsetTop + yChange) + "px";
        }
    }

})();

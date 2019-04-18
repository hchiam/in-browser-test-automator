(function() {

    var steps = [
//         'go to https://www.google.com/', // TODO: maybe do goto elsewhere
        'click on .gLFyf',
        'type chrome extensions and where to find them',
        "check that it's chrome extensions and where to find them",
        "click on input[value='Google Search']",
//         "click on button[aria-label='Google Search']",
    ];

    var currentElement = '';

    var baseStyle = 'all: initial; padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; ';
    var onHoverStyle = baseStyle + 'background: rgba(0,100,255,1); ';
    var offHoverStyle = baseStyle + 'background: rgba(0,100,255,0.5); ';

    createModal(steps);

    function createModal(errors) {
        var div = document.createElement("div");
        div.style.cssText = 'all: initial; position: fixed; left: 25%; top: 25vh; width: 50%; height: 50%; padding: 1rem; z-index: 9999; border: 1rem solid rgba(0,100,255,0.5); background: rgba(255,255,255,0.75); color: black; overflow-y: auto; border-radius: 5px; font-family: avenir, arial, tahoma; box-shadow: inset 0 -50px 50px -55px rgba(0, 0, 0, 1);';
        div.id = 'in-browser-test-modal';
        makeElementDraggable(div);

        var h1 = document.createElement("H1");
        h1.id = 'in-browser-test-modal-h1';
        h1.innerHTML = 'Test Automation Steps:';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold;';
        div.appendChild(h1);

        createCloseButton(div);

        createInput(div);

        createPointerPreview(div);

        createRunButton(div);

        if (!Array.isArray(steps)) {
            steps = steps.split('\n');
        }
        for (var i=0; i<steps.length; i++) {
            var step = steps[i];
            createStep(step, i, div);
        }

        document.body.insertBefore(div, document.body.firstChild);
    }

    function createCloseButton(container) {
        var button = document.createElement("button");
        button.id = 'in-browser-test-modal-close';
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
        h1.innerHTML = 'Your pointer is hovering over: ';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold; color: grey; text-align: center; ';
        container.appendChild(h1);
        var div = document.createElement("div");
        div.id = 'in-browser-test-modal-pointer-preview';
        div.innerHTML = '-';
        div.style.cssText = 'color: grey; background: white; text-align: center; ';
        container.appendChild(div);
    }

    function createInput(container) {
        var sharedStyle = 'min-height: 20px; width: 90%; border: none; font-family: avenir, arial; font-size: 1rem; font-weight: bold; padding: 10px; border-radius: 3px; margin-bottom: 1rem; '
        
        var div = document.createElement("div");
        div.style.cssText = 'margin-top: 1rem; position: relative; ';
        
        var input = document.createElement("input");
        input.id = 'in-browser-test-modal-input';
        input.style.cssText = 'position: relative; display: block; color: rgba(255,255,255,0); background: rgba(255,255,255,0); caret-color: black; ' + sharedStyle;
        input.placeholder = 'click/type/check something';
        input.onkeyup = function() {
            // TODO: find element/elements, point to it/them, if >1 tell user to be more specific, if <1 tell user not found and give a suggestion
            processInput(input.value);
        };
        div.appendChild(input);
        
        var colorOverlay = document.createElement("div");
        colorOverlay.id = 'in-browser-test-modal-input-overlay';
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

    function createStep(step, stepNumber, container) {
        var p = document.createElement("p");
        p.id = 'in-browser-test-modal-step-' + stepNumber;
        p.innerHTML = step;
        container.appendChild(p);
    }

    function createRunButton(container) {
        var button = document.createElement("button");
        button.id = 'in-browser-test-modal-run';
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

    function processInput(input) {

        colorizeInput();

        // TODO: find element/elements, point to it/them, if >1 tell user to be more specific, if <1 tell user not found and give a suggestion

        currentElement = '';
        var matches = '';

        // TODO: maybe do goto elsewhere

        if (input == 'click') {
            document.getElementById('in-browser-test-modal-input-overlay').innerHTML += ' <span style="font-size:small;">(Right-click an element to auto-fill this.)</span>';
        }

        var click = input.match(/^(click|tap) (on )?(.+)/);
        if (click) {
            currentElement = click[click.length-1];
            matches = document.querySelector(currentElement);
            if (matches) {
                // TODO: point to it/them
            }
        }
        var type = input.match(/^(type|enter) (in )?(.+)/);
        if (type) {
            // TODO: figure out allowed fields before use this line: currentElement = click[click.length-1];
            matches = findElement(currentElement);
            if (matches) {
                // TODO: point to it/them
            }
        }
        var check = input.match(/^(check|verify)( that (it('| i)s))? (.+)/);
        if (check) {
            // TODO: figure out allowed fields before use this line: currentElement = click[click.length-1];
            matches = findElement(currentElement);
            if (matches) {
                // TODO: point to it/them
            }
        }
        if (!matches) {
            console.log(currentElement + ' not found. Try this: ...'); // TODO: figure out this message
        }
    }

    function findElement(elementSelector) {
        try {
            return document.querySelector(currentElement);
        } catch {
            return null;
        }
    }

    function colorizeInput() {
        var newText = document.getElementById('in-browser-test-modal-input').value;
        newText = highlightInputWord(newText, 'click', 'blue');
        newText = highlightInputWord(newText, 'hit', 'blue');
        newText = highlightInputWord(newText, 'type', 'red');
        newText = highlightInputWord(newText, 'enter', 'red');
        newText = highlightInputWord(newText, 'check', 'green');
        newText = highlightInputWord(newText, 'verify', 'green');
        if (findElement(currentElement)) {
            newText = highlightInputWord(newText, currentElement, 'black');
        }
        document.getElementById('in-browser-test-modal-input-overlay').innerHTML = newText;
    }

    function highlightInputWord(sentence, word, color) {
        return sentence.replace(
            word,
            '<span style="color:' + color + ';">' + word + '</span>'
        );
    }

    document.addEventListener('contextmenu', function autoFillClickIdentifier(event) {
        var e = event.target;
        var tag = (e.tagName) ? e.tagName.toLowerCase() : '';
        var id = (e.id) ? '#' + e.id : '';
        var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';
        var isInput = (id == '#in-browser-test-modal-input');
        var isRunButton = (id == '#in-browser-test-modal-run');
        var input = document.getElementById('in-browser-test-modal-input');
        var isClick = (input && input.value && input.value.match(/^(click |hit )/));
        if (input && !isInput && !isRunButton && (input.value === '' || isClick && startsWithCommandVerb(document.getElementById('in-browser-test-modal-input').value))) {
            var sentence = 'click ' + tag + id + classes;
            document.getElementById('in-browser-test-modal-input').value = sentence;
            document.getElementById('in-browser-test-modal-input-overlay').innerHTML = sentence;
            colorizeInput();

            // prevent click from triggering button action (and prevent event propagation):
            (event || window.event).preventDefault();
            (event || window.event).stopPropagation();
            return false;
        }
    }, false);

    document.addEventListener('mouseover', function(event) {
        var e = event.target;
        var tag = (e.tagName) ? e.tagName.toLowerCase() : '';
        var id = (e.id) ? '#' + e.id : '';
        var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';

        document.getElementById('in-browser-test-modal-pointer-preview').innerHTML = tag + id + classes;
    }, false);

    function startsWithCommandVerb(sentence) {
        var commandVerbs = ['click', 'hit', 'type', 'enter', 'check', 'verify'];
        for (var i=0; i<commandVerbs.length; i++) {
            var startsWith = sentence.indexOf(commandVerbs[i]) === 0;
            if (startsWith) {
                return true;
            }
        }
        return false;
    }

    function makeElementDraggable(element) {
        var xChange = 0;
        var yChange = 0;
        var x = 0;
        var y = 0;
        element.onmousedown = dragOnMouseDown;

        function dragOnMouseDown(event) {
            if ((event.target.id == 'in-browser-test-modal-input') || (event.target.id == 'in-browser-test-modal-run')) {
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

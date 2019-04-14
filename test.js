(function() {

    var steps = [
//         'go to https://www.google.com/', // TODO: maybe do goto elsewhere
        'click on .gLFyf', // TODO: get ID of element clicked on (see document.addEventListener below)
        'type chrome extensions and where to find them',
        "check that it's chrome extensions and where to find them",
        "click on input[value='Google Search']",
//         "click on button[aria-label='Google Search']",
    ];

    var currentElement = '';

    var baseStyle = 'all: initial; padding: 0.5rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; ';
    var onHoverStyle = baseStyle + 'background: rgba(0,100,255,1); ';
    var offHoverStyle = baseStyle + 'background: rgba(0,100,255,0.5); ';

    createModal(steps);

    function createModal(errors) {
        var div = document.createElement("div");
        div.style.cssText = 'all: initial; position: fixed; left: 25%; top: 25vh; width: 50%; height: 50%; padding: 1rem; z-index: 9999; border: 1rem solid rgba(0,100,255,0.5); background: rgba(255,255,255,0.75); color: black; overflow-y: auto; border-radius: 5px; font-family: avenir, arial, tahoma; box-shadow: inset 0 -50px 50px -55px rgba(0, 0, 0, 1);';
        div.id = 'in-browser-test-modal';

        var h1 = document.createElement("H1");
        h1.innerHTML = 'Test Automation Steps:';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold;';
        div.appendChild(h1);

        createCloseButton(div);

        createInput(div);

        if (!Array.isArray(steps)) {
            steps = steps.split('\n');
        }
        for (var i=0; i<steps.length; i++) {
            var step = steps[i];
            createStep(step, i, div);
        }

        createRunButton(div);

        document.body.insertBefore(div, document.body.firstChild);
    }

    function createCloseButton(container) {
        var button = document.createElement("button");
        button.innerHTML = 'X';
        button.style.cssText = 'all: initial; position: absolute; right: 1rem; background: rgba(0,100,255,0.5); padding: 0.5rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma;';
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

    function createInput(container) {
        var div = document.createElement("div");
        div.style.cssText = 'margin-top: 1rem; ';
        var input = document.createElement("input");
        input.placeholder = 'Type here';
        input.style.cssText = 'position: relative; display: block; ';
        input.onkeypress = function() {
            // TODO: find element/elements, point to it/them, if >1 tell user to be more specific, if <1 tell user not found and give a suggestion
            processInput(input.value);
        };
        div.appendChild(input)
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
        button.innerHTML = '&#9658; Run steps';
        button.style.cssText = 'all: initial; position: absolute; left: 1rem; background: rgba(0,100,255,0.5); padding: 0.5rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma;';
        button.onclick = function() {
            runSteps();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'position: absolute; left: 1rem; ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'position: absolute; left: 1rem; ';
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
        removeModal();
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
        
        // TODO: find element/elements, point to it/them, if >1 tell user to be more specific, if <1 tell user not found and give a suggestion

        currentElement = '';
        var matches = '';

        // TODO: maybe do goto elsewhere

        var click = input.match(/^(click|tap) (on )?(.+)/);
        if (click) {
            currentElement = click[click.length-1];
            matches = findElement(currentElement);
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
            console.log(currentElement + ' not found. Try this: ...'); // TODO: figure this out
        }
    }

    function findElement(elementSelector) {
        try {
            return document.querySelector(currentElement);
        } catch {
            return null;
        }
    }

})();

// document.addEventListener('click', function(event) {
//     var e = event.target;
//     var tag = (e.tagName) ? e.tagName : '';
//     var id = (e.id) ? e.id : '';
//     var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';
//     alert(tag + ' ' + id + ' ' + classes);
// }, false);

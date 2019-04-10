(function() {

    var steps = [
//         'go to https://www.google.com/', // TODO: maybe do goto elsewhere
        'click on .gLFyf', // TODO: get ID of element clicked on (see document.addEventListener below)
        'type test value',
        'check test value'
    ];

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

    var currentElement = '';
    function runSteps() {
        removeModal();
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
                message += '\nStep ' + (i+1) + ': click on ' + currentElement;
                document.querySelector(currentElement).click();
                continue;
            }
            var type = step.match(/^(type|enter) (in )?(.+)/);
            if (type) {
                var value = type[type.length-1];
                message += '\nStep ' + (i+1) + ': type in ' + currentElement + ': "' + value + '"';
                document.querySelector(currentElement).value = value;
                document.querySelector(currentElement).innerHTML = value;
                continue;
            }
            var check = step.match(/^(check|verify) (that (it('| i)s))?(.+)/);
            if (check) {
                var expectedValue = check[check.length-1];
                var actualValue = document.querySelector(currentElement).value || document.querySelector(currentElement).innerHTML;
                var equals = (actualValue === expectedValue);
                message += '\nStep ' + (i+1) + ' ';
                message += equals ? ('PASSED: "' + actualValue + '" is "' + expectedValue + '"') : ('FAILED: "' + actualValue + '" is NOT "' + expectedValue + '"');
                if (!equals) {
                    overallPassed = false;
                }
                continue;
            }
        }
        message += '\n\nOverall status: ';
        message += overallPassed ? 'PASSED' : 'FAILED';
        alert(message);
    }

})();

// document.addEventListener('click', function(event) {
//     var e = event.target;
//     var tag = (e.tagName) ? e.tagName : '';
//     var id = (e.id) ? e.id : '';
//     var classes = (e.className) ? '.' + e.className.replace(' ','.') : '';
//     alert(tag + ' ' + id + ' ' + classes);
// }, false);

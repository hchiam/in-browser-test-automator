(function() {
    
    if (typeof savedSteps === 'undefined') {
        alert('An error occurred: could not find savedSteps.');
        return;
    } else if (typeof numberOfStepsCreated === 'undefined') {
        alert('An error occurred: could not find savedSteps.');
        return;
    }
    
    let currentElement = '';
    let haveEventListeners = false;

    let baseStyle = 'all:initial; padding:0.25rem; margin:0.25rem; display:inline; border-radius:5px; font-family:avenir,arial,tahoma; ';
    let onHoverStyle = baseStyle + 'background:rgba(0,100,255,1); ';
    let offHoverStyle = baseStyle + 'background:rgba(0,100,255,0.5); ';
    
    removeModal(); // reset
    createModal();

    regenerateSteps(); // initialize

    function createModal() {
        let div = document.createElement("div");
        div.style.cssText = 'all:initial; position:fixed; left:25%; top:25vh; width:50%; height:50%; padding:1rem; z-index:9999; border:1rem solid rgba(0,100,255,0.5); background:rgba(255,255,255,0.75); color:black; overflow-y:auto; border-radius:5px; font-family:avenir,arial,tahoma; box-shadow:inset 0 -50px 50px -55px rgba(0, 0, 0, 1); font-size:16px; ';
        div.id = 'in-browser-test-modal';
        div.className = 'in-browser-test-modal';
        makeElementDraggable(div);

        createCloseButton(div);

        createPointerPreview(div);

        createRunButton(div);

        let steps = document.createElement("div");
        steps.id = 'steps';
        steps.className = 'in-browser-test-modal';
        div.appendChild(steps);

        document.body.insertBefore(div, document.body.firstChild);

        $('#in-browser-test-modal').append(`
            <button id="add-step" 
                class="in-browser-test-modal"
                title="Add step"
                style="all:initial; background:rgba(0,100,255,0.5); width:2rem; height:2rem; border-radius:1rem; text-align:center; margin-top:0.5rem; font-family:avenir,arial,tahoma; ">+</button>
        `);

        $("#add-step").mouseover(function() {
            $(this).css("background","rgba(0,100,255,1)").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","rgba(0,100,255,0.5)").css('box-shadow', 'none');
        });

        $('#add-step').click(debounce(function useSettings() {
            addStep();
        }, 250));
    }

    function debounce(callback, milliseconds){
        let timer; 
        return function(){
            clearTimeout(timer); 
            timer = setTimeout(function(){
                callback(); 
            }, milliseconds); 
        };
    }

    function createCloseButton(container) {
        let button = document.createElement("button");
        button.id = 'in-browser-test-modal-close';
        button.className = 'in-browser-test-modal';
        button.innerHTML = 'X';
        button.style.cssText = 'all:initial; position:absolute; right:1rem; background:rgba(0,100,255,0.5); padding:0.25rem; margin:0.25rem; display:inline; border-radius:5px; font-family:avenir,arial,tahoma; width:2rem; height:2rem; border-radius:2rem; text-align:center; ';
        button.title = 'Close';
        button.onclick = function() {
            removeModal();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'position:absolute; right:1rem;  width:2rem; height:2rem; border-radius:2rem; text-align:center; box-shadow:0 3px 3px rgba(0,0,0,0.5); ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'position:absolute; right:1rem;  width:2rem; height:2rem; border-radius:2rem; text-align:center; box-shadow:none; ';
        };
        container.appendChild(button);
    }

    function createPointerPreview(container) {
        let h1 = document.createElement("H1");
        h1.id = 'in-browser-test-modal-pointer-preview-h1';
        h1.className = 'in-browser-test-modal';
        h1.innerHTML = 'Your pointer is hovering over: ';
        h1.style.cssText = 'all:initial; font-family:avenir,arial,tahoma; font-weight:bold; color:grey; text-align:center; background:white; padding:0 0.5rem; border-radius:0.5rem; ';
        container.appendChild(h1);
        let div = document.createElement("div");
        div.id = 'in-browser-test-modal-pointer-preview';
        div.className = 'in-browser-test-modal';
        div.innerHTML = '-';
        div.style.cssText = 'color:grey; text-align:center; min-height:3rem; border-radius:0.5rem; padding:0.5rem; transition:0.5s; ';
        container.appendChild(div);
    }

    function createStep(stepNumber) {
        let savedStep = savedSteps[stepNumber-1];
        
        if (savedStep == null) {
            return;
        }

        $('#steps').append(`
            <div id="step-${stepNumber}" class="in-browser-test-modal" style="margin-bottom:0.25rem;">
                <select id="select-step-${stepNumber}" class="in-browser-test-modal" style="all:initial; background:lightgrey; border:1px solid grey; border-radius:0.5rem; padding:0.1rem 0.75rem; font-family:avenir,arial,tahoma; ">
                    <option value="click" class="in-browser-test-modal" ${(savedStep.action=='click') ? 'selected="selected"' : ''}>
                        Click on:</option>
                    <option value="select" class="in-browser-test-modal" ${(savedStep.action=='select') ? 'selected="selected"' : ''}>
                        Select:</option>
                    <option value="enter" class="in-browser-test-modal" ${(savedStep.action=='enter') ? 'selected="selected"' : ''}>
                        Enter:</option>
                    <option value="hit-enter" class="in-browser-test-modal" ${(savedStep.action=='hit-enter') ? 'selected="selected"' : ''}>
                        Hit enter:</option>
                    <option value="check" class="in-browser-test-modal" ${(savedStep.action=='check') ? 'selected="selected"' : ''}>
                        Should show:</option>
                    ${''/* TODO: may need background script (for issue #5)
                    <option value="goto" class="in-browser-test-modal" ${(savedStep.action=='goto') ? 'selected="selected"' : ''}>
                        Go to URL:</option>*/}
                </select> : 
                <input id="input-step-${stepNumber}" placeholder="(Right-click an element to get its identifier.)" 
                    class="in-browser-test-modal" 
                    style="${savedStep.action=='hit-enter'?'display:none; ':''}background:white; border:1px solid grey; border-radius:0.5rem; padding-left:0.5rem; width:50%; text-overflow:ellipsis; font-family:avenir,arial,tahoma; font-size:16px; caret-color:red; "
                    value="${savedStep.value}">
                <button id="remove-step-${stepNumber}" 
                    class="in-browser-test-modal"
                    title="Remove step"
                    style="all:initial; background:lightgrey; width:2rem; height:2rem; border-radius:1rem; text-align:center;font-family:avenir,arial,tahoma; ">-</button>
            </div>
        `);

        $('#remove-step-' + (stepNumber)).click(function useSettings(event) {
            let step = event.target.id.replace(/^remove-step-/,'');
            savedSteps[step-1] = null;
            chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
            $("#step-" + step).remove();
        })

        $(`#steps>div#step-${(stepNumber)}>select`).change(function changeAction(event) {
            let action = $(this).find("option:selected").attr('value');
            let selector = '#steps>div#' + event.target.parentNode.id + '>input';
            let step = event.target.id.replace(/^select-step-/,'');
            savedSteps[step-1].action = action;
            chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
            if (action == 'click' || action == 'select') {
                $(selector).attr('placeholder', '(Right-click an element to get its identifier.)');
            } else if (action == 'enter' || action == 'check') {
                $(selector).val('');
                $(selector).attr('placeholder', '(Some text.)');
                $(selector).focus();
            // // TODO: may need background script (for issue #5)
            // } else if (action == 'goto') {
            //     $(selector).val('');
            //     $(selector).attr('placeholder', '(Enter a link like https://www.google.com/)');
            //     $(selector).focus();
            } else {
                $(selector).val('');
                $(selector).attr('placeholder', '');
            }
            
            if (action == 'hit-enter') {
                $(selector).val('');
                $(selector).hide();
            } else {
                $(selector).show();
            }
        });

        $("select.in-browser-test-modal, input.in-browser-test-modal").focus(function() {
            $(this).css("outline","none");
        });

        $("select.in-browser-test-modal").mouseover(function() {
            $(this).css("background","grey").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","lightgrey").css('box-shadow', 'none');
        });

        $("input.in-browser-test-modal").mouseover(function() {
            $(this).css("background","lightgrey").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","white").css('box-shadow', 'none');
        }).keyup(function(event) {
            let step = event.target.id.replace(/^input-step-/,'');
            let value = $('input.in-browser-test-modal#input-step-' + step).val();
            savedSteps[step-1].value = value;
            chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
        });

        $("#remove-step-" + (stepNumber)).mouseover(function() {
            $(this).css("background","grey").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","lightgrey").css('box-shadow', 'none');
        });

        if (!haveEventListeners) {
            document.addEventListener('click', autoFillClickIdentifier, false);
            document.addEventListener('contextmenu', autoFillClickIdentifier, false);
            document.addEventListener('mouseover', pointerPreviewOnMouseOver, false);
            document.addEventListener('keyup', autoFillEnterValue, false);
            haveEventListeners = true;
        }
    }

	function regenerateSteps() {
        for (let i=0; i<savedSteps.length; i++) {
            let stepNumber = i+1;
            createStep(stepNumber);
        }
	}

	function addStep() {
        numberOfStepsCreated++;
        
        savedSteps[numberOfStepsCreated-1] = {
            'action':'click',
            'value':''
        };

        chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
        chrome.storage.local.set({'numberOfStepsCreated': numberOfStepsCreated}, function() {});
        
        createStep(numberOfStepsCreated);
	}

    function createRunButton(container) {
        let button = document.createElement("button");
        button.id = 'in-browser-test-modal-run';
        button.className = 'in-browser-test-modal';
        button.innerHTML = '&#9658; Run the following steps:';
        button.style.cssText = 'all:initial; background:rgba(0,100,255,0.5); padding:0.25rem; margin:0.25rem; display:inline; border-radius:5px; font-family:avenir,arial,tahoma; ';
        button.onclick = function() {
            runSteps();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'box-shadow:0 3px 3px rgba(0,0,0,0.5); ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'box-shadow:none; ';
        };
        container.appendChild(button);
    }

    function removeModal() {
        let modal = document.getElementById('in-browser-test-modal');
        if (modal) {
            modal.parentNode.removeChild(modal);
        }
        if (typeof autoFillClickIdentifier !== 'undefined') {
            document.removeEventListener('click', autoFillClickIdentifier, false);
            document.removeEventListener('contextmenu', autoFillClickIdentifier, false);
            document.removeEventListener('mouseover', pointerPreviewOnMouseOver, false);
            document.removeEventListener('keyup', autoFillEnterValue, false);
            haveEventListeners = false;
        }
        if (typeof onMouseOver !== 'undefined') {
            document.removeEventListener('mouseover', onMouseOver, false);
        }
    }

    function isIdentifierUnique(identifier) {
        return (typeof document.querySelectorAll(identifier)[1]) === 'undefined'; // index 1 should not exist
    }

    function getIdentifier(event) {
        let e = event.target || event;
        let tag = (e.tagName) ? e.tagName.trim().toLowerCase() : '';
        let id = (e.id) ? '#' + e.id.trim() : '';
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let identifier = tag + id + classes;
        return identifier;
    }

    function getParentIdentifier(event) {
        let e = event.parentElement || event.target.parentElement;
        let tag = (e.tagName) ? e.tagName.trim().toLowerCase() : '';
        let id = (e.id) ? '#' + e.id.trim() : '';
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let identifier = tag + id + classes;
        return identifier;
    }

    function getIdentifierBeforeClicked() {
        // when you want the identifier before you click, use this instead of getIdentifier(event)
        let identifier = document.getElementById('in-browser-test-modal-pointer-preview').innerHTML
        return identifier;
    }

    function autoFillClickIdentifier(event) { // different from autoFillEnterIdentifier
        let e = event.target;
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let isInModal = classes.includes('in-browser-test-modal') || getIdentifierBeforeClicked().includes('in-browser-test-modal');
        if (!isInModal) {
            let identifier = getIdentifierBeforeClicked(); // not getIdentifier(event);
            let selectedAction = document.querySelector(`#steps>div#step-${numberOfStepsCreated}>select`);
            let shouldUseValue = (selectedAction.value == 'click') || (selectedAction.value == 'select');
            let actionInput = document.querySelector(`#steps>div#step-${numberOfStepsCreated}>input`);
            let isUnique = isIdentifierUnique(identifier);
            if (shouldUseValue && actionInput && isUnique) {
                actionInput.value = identifier;
                savedSteps[numberOfStepsCreated-1].value = identifier;
                chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
                currentElement = identifier;
            } else if (!isUnique) {
                let parentIdentifier = getParentIdentifier(event);
                let identifierWithParentPrepended = parentIdentifier + '>' + identifier;
                let doesPrependingParentHelp = isIdentifierUnique(identifierWithParentPrepended);
                if (!doesPrependingParentHelp) {
                    alert("Couldn't uniquely identify that element. \n\nTry a different part of the element? \nTry editing the identifier?");
                    $(`#steps>div#step-${numberOfStepsCreated}>input`).focus();
                }
                // show identifier either way
                identifier = identifierWithParentPrepended;
                actionInput.value = identifier;
                savedSteps[numberOfStepsCreated-1].value = identifier;
                chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
                currentElement = identifier;
            }
            
            // prevent click from triggering button action (and prevent event propagation):
            (window.event || event).preventDefault();
            (window.event || event).stopPropagation();
            return false;
        }
    }

    function pointerPreviewOnMouseOver(event) {
        let isModalOpen = document.getElementById('in-browser-test-modal');
        if (!isModalOpen) {
            return;
        }
        let e = event.target;
        let classes = (e.className && e.className !== '') ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let isInModal = classes.includes('in-browser-test-modal');
        if (!isInModal) {
            let identifier = getIdentifier(event);
            document.getElementById('in-browser-test-modal-pointer-preview').innerHTML = identifier;
            let isUnique = isIdentifierUnique(identifier);
            if (isUnique) {
                $('#in-browser-test-modal-pointer-preview').css('background', '#41f4ca');
            } else {
                $('#in-browser-test-modal-pointer-preview').css('background', '#f4bc42 ');
            }
        } else {
            $('#in-browser-test-modal-pointer-preview').css('background', 'white');
        }
    }

    function autoFillEnterIdentifier(event) { // different from autoFillClickIdentifier
        let e = document.activeElement;
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let isInModal = classes.includes('in-browser-test-modal') || getIdentifierBeforeClicked().includes('in-browser-test-modal');
        if (!isInModal) {
            let identifier = getIdentifier(event); // not getIdentifierBeforeClicked();
            let actionInput = document.querySelector(`#steps>div#step-${numberOfStepsCreated}>input`);
            let isUnique = isIdentifierUnique(identifier);
            if (isUnique) {
                // TODO: if changed, then add instead of edit step (useful to convert tab to click)
                actionInput.value = identifier;
                savedSteps[numberOfStepsCreated-1].value = identifier;
                chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
                currentElement = identifier;
            } else if (!isUnique) {
                let parentIdentifier = getParentIdentifier(event);
                let identifierWithParentPrepended = parentIdentifier + '>' + identifier;
                let doesPrependingParentHelp = isIdentifierUnique(identifierWithParentPrepended);
                if (!doesPrependingParentHelp) {
                    alert("Couldn't uniquely identify that element. \n\nTry a different part of the element? \nTry editing the identifier?");
                    $(`#steps>div#step-${numberOfStepsCreated}>input`).focus();
                }
                // TODO: if changed, then add instead of edit step (useful to convert tab to click)
                // show identifier either way
                identifier = identifierWithParentPrepended;
                actionInput.value = identifier;
                savedSteps[numberOfStepsCreated-1].value = identifier;
                chrome.storage.local.set({'savedSteps': savedSteps}, function() {});
                currentElement = identifier;
            }
        }
    }

    function autoFillEnterValue(event) {
        autoFillEnterIdentifier(document.activeElement); // different from autoFillClickIdentifier
        let keyCode = (event.keyCode || event.which);
        if (keyCode == 13) {
            console.log('hit-enter'); // TODO: use for issue #3
        }
        // TODO: use for issue #3
        console.log(currentElement);
        let element = findElement(currentElement);
        let currentText = element ? (element.value || element.innerHTML) : '';
        console.log('currentText = ' + currentText); // TODO: use for issue #3
    }

    document.addEventListener('click', autoFillClickIdentifier, false);
    document.addEventListener('contextmenu', autoFillClickIdentifier, false);
    document.addEventListener('mouseover', pointerPreviewOnMouseOver, false);
    document.addEventListener('keyup', autoFillEnterValue, false);
    haveEventListeners = true;

    function makeElementDraggable(element) {
        let xChange = 0;
        let yChange = 0;
        let x = 0;
        let y = 0;
        element.onmousedown = dragOnMouseDown;

        function dragOnMouseDown(event) {
            let e = event || window.event;
            if (e.target.id != 'in-browser-test-modal') {
                return;
            }
            e.preventDefault();
            x = e.clientX;
            y = e.clientY;
            document.onmouseup = stopDragging;
            document.onmousemove = dragElement;
        }

        function stopDragging() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function dragElement(event) {
            let e = event || window.event;
            e.preventDefault();
            xChange = e.clientX - x;
            yChange = e.clientY - y;
            x = e.clientX;
            y = e.clientY;
            element.style.left = (element.offsetLeft + xChange) + "px";
            element.style.top = (element.offsetTop + yChange) + "px";
        }
    }

    function findElement(elementSelector) {
        try {
            return document.querySelector(elementSelector);
        } catch {
            return null;
        }
    }

    function runSteps() {
        document.removeEventListener('click', autoFillClickIdentifier, false);
        document.removeEventListener('contextmenu', autoFillClickIdentifier, false);
        document.removeEventListener('mouseover', pointerPreviewOnMouseOver, false);
        document.removeEventListener('keyup', autoFillEnterValue, false);
        haveEventListeners = false;

        currentElement = '';
        let overallPassed = true;
        let message = '';
        let delay = 1000;
        let numberOfStepsToRun = $("#steps").find('select').length;
        $('#steps').find('select').each(function (i) {
            if (!overallPassed) {
                return;
            }
            let self = this; // so self inside setTimeout points to the right "this"
            setTimeout(function () { // add delay between each action
                let action = self.value;
                let value = $(`#steps>div:nth-child(${i+1})>input`).val();
                if (action == 'click' && value !== '') {
                    currentElement = value;
                    message += '\nStep ' + (i+1);
                    if (findElement(currentElement)) {
                        message += ': click on ' + currentElement;
                        findElement(currentElement).click();
                    } else {
                        message += ' FAILED: could not find ' + currentElement;
                        overallPassed = false;
                        return false;
                    }
                } else if (action == 'select') {
                    currentElement = value;
                    message += '\nStep ' + (i+1);
                    if (findElement(currentElement)) {
                        message += ': click on ' + currentElement;
                        findElement(currentElement).trigger("select");
                    } else {
                        message += ' FAILED: could not find ' + currentElement;
                        overallPassed = false;
                        return false;
                    }
                } else if (action == 'enter') {
                    message += '\nStep ' + (i+1) + ': type in ' + currentElement + ': "' + value + '"';
                    findElement(currentElement).value = value;
                } else if (action == 'hit-enter') {
                    message += '\nStep ' + (i+1) + ': hit enter';
                    $(currentElement).closest('form').submit();
                } else if (action == 'check') {
                    let expectedValue = value;
                    let actualValue = findElement(currentElement).value || findElement(currentElement).innerHTML;
                    let equals = (actualValue === expectedValue);
                    message += '\nStep ' + (i+1) + ' ';
                    message += equals ? ('PASSED: "' + actualValue + '" is "' + expectedValue + '"') : ('FAILED: "' + actualValue + '" is NOT "' + expectedValue + '"');
                    if (!equals) {
                        overallPassed = false;
                        return false;
                    }
                }
                // // TODO: may need background script (for issue #5)
                // } else if (action == 'goto') {
                //     message += '\nStep ' + (i+1) + ': go to URL ' + currentElement + ': "' + value + '"';
                //     let url = value;
                //     window.location.href = url;
                //     alert('hi')
                // }
                
                let finishedLastStep = (i === numberOfStepsToRun-1);
                if (finishedLastStep) {
                    message += '\n\nOverall status: ';
                    message += overallPassed ? 'PASSED' : 'FAILED';
                    alert(message)
                    // TODO: instead of alert(message), just make the steps colour as red-orange #f4bc42 / green-blue #41f4ca (for issue #4)
                }
            }, i*delay); // setTimeout
        }); // each()
    }

})();

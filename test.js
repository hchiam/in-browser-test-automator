(function() {

    let numberOfStepsCreated = 0;
    let currentElement = '';
    let haveClickEventListener = false;

    let baseStyle = 'all: initial; padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; ';
    let onHoverStyle = baseStyle + 'background: rgba(0,100,255,1); ';
    let offHoverStyle = baseStyle + 'background: rgba(0,100,255,0.5); ';

    removeModal(); // reset
    createModal();

    addStep(); // initialize

    function createModal() {
        let div = document.createElement("div");
        div.style.cssText = 'all: initial; position: fixed; left: 25%; top: 25vh; width: 50%; height: 50%; padding: 1rem; z-index: 9999; border: 1rem solid rgba(0,100,255,0.5); background: rgba(255,255,255,0.75); color: black; overflow-y: auto; border-radius: 5px; font-family: avenir, arial, tahoma; box-shadow: inset 0 -50px 50px -55px rgba(0, 0, 0, 1);';
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
                style="all:initial; background:rgba(0,100,255,0.5); width:2rem; height:2rem; border-radius:1rem; text-align:center; margin-top:0.5rem; ">+</button>
        `);

        $("#add-step").mouseover(function() {
            $(this).css("background","rgba(0,100,255,1)").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","rgba(0,100,255,0.5)").css('box-shadow', 'none');
        });

        $('#add-step').click(function useSettings() {
            addStep();
        })
    }

    function createCloseButton(container) {
        let button = document.createElement("button");
        button.id = 'in-browser-test-modal-close';
        button.className = 'in-browser-test-modal';
        button.innerHTML = 'X';
        button.style.cssText = 'all: initial; position: absolute; right: 1rem; background: rgba(0,100,255,0.5); padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; width:2rem; height:2rem; border-radius:2rem; text-align:center; ';
        button.title = 'Close';
        button.onclick = function() {
            removeModal();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'position: absolute; right: 1rem;  width:2rem; height:2rem; border-radius:2rem; text-align:center; box-shadow:0 3px 3px rgba(0,0,0,0.5); ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'position: absolute; right: 1rem;  width:2rem; height:2rem; border-radius:2rem; text-align:center; box-shadow:none; ';
        };
        container.appendChild(button);
    }

    function createPointerPreview(container) {
        let h1 = document.createElement("H1");
        h1.id = 'in-browser-test-modal-pointer-preview-h1';
        h1.className = 'in-browser-test-modal';
        h1.innerHTML = 'Your pointer is hovering over: ';
        h1.style.cssText = 'all: initial; font-family: avenir, arial, tahoma; font-weight: bold; color: grey; text-align: center; ';
        container.appendChild(h1);
        let div = document.createElement("div");
        div.id = 'in-browser-test-modal-pointer-preview';
        div.className = 'in-browser-test-modal';
        div.innerHTML = '-';
        div.style.cssText = 'color: grey; background: white; text-align: center; min-height:3rem; ';
        container.appendChild(div);
    }

	function addStep() {
        numberOfStepsCreated++;
        
        $('#steps').append(`
            <div id="step-${numberOfStepsCreated}" class="in-browser-test-modal" style="margin-bottom:0.25rem;">
                <select class="in-browser-test-modal" style="background:lightgrey;">
                    <option value="click" class="in-browser-test-modal">
                        Click on:</option>
                    <option value="select" class="in-browser-test-modal">
                        Select:</option>
                    <option value="enter" class="in-browser-test-modal">
                        Enter:</option>
                    <option value="check" class="in-browser-test-modal">
                        Should show:</option>
                </select> : 
                <input placeholder="(Right-click an element to get its identifier.)" 
                    class="in-browser-test-modal" 
                    style="background:white; border:1px solid grey; border-radius:0.5rem; padding-left:0.5rem; width:50%; text-overflow:ellipsis; ">
                <button id="remove-step-${numberOfStepsCreated}" 
                    class="in-browser-test-modal"
                    title="Remove step"
                    style="all:initial; background:lightgrey; width:2rem; height:2rem; border-radius:1rem; text-align:center;">-</button>
            </div>
		`);

		$('#remove-step-' + numberOfStepsCreated).click(function useSettings(e) {
			let step = e.target.id.replace(/^remove-step-/,'');
			$("#step-" + step).remove();
        })

        $(`#steps>div#step-${numberOfStepsCreated}>select`).change(function(event){
            let value = $(this).find("option:selected").attr('value');
            let selector = '#steps>div#' + event.target.parentNode.id + '>input';
            if (value == 'click' || value == 'select') {
                $(selector).attr('placeholder', '(Right-click an element to get its identifier.)');
            } else if (value == 'enter' || value == 'check') {
                $(selector).val('');
                $(selector).attr('placeholder', '(Some text.)');
                $(selector).focus();
            } else {
                $(selector).val('');
                $(selector).attr('placeholder', '');
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
        });

        $("#remove-step-" + numberOfStepsCreated).mouseover(function() {
            $(this).css("background","grey").css('box-shadow', '0 3px 3px rgba(0,0,0,0.5)');
        }).mouseout(function() {
            $(this).css("background","lightgrey").css('box-shadow', 'none');
        });

        if (!haveClickEventListener) {
            document.addEventListener('click', autoFillClickIdentifier, false);
            document.addEventListener('contextmenu', autoFillClickIdentifier, false);
            haveClickEventListener = true;
        }
	}

    function createRunButton(container) {
        let button = document.createElement("button");
        button.id = 'in-browser-test-modal-run';
        button.className = 'in-browser-test-modal';
        button.innerHTML = '&#9658; Run the following steps:';
        button.style.cssText = 'all: initial; left: 1rem; background: rgba(0,100,255,0.5); padding: 0.25rem; margin: 0.25rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma; ';
        button.onclick = function() {
            runSteps();
        };
        button.onmouseover = function() {
            button.style.cssText = onHoverStyle + 'left: 1rem; margin: 0.5rem; margin-top: 2rem; box-shadow:0 3px 3px rgba(0,0,0,0.5); ';
        };
        button.onmouseout = function() {
            button.style.cssText = offHoverStyle + 'left: 1rem; margin: 0.5rem; margin-top: 2rem; box-shadow:none; ';
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
            haveClickEventListener = false;
        }
        if (typeof onMouseOver !== 'undefined') {
            document.removeEventListener('mouseover', onMouseOver, false);
        }
    }

    function findElement(elementSelector) {
        try {
            return document.querySelector(elementSelector);
        } catch {
            return null;
        }
    }

    function getIdentifier(event) {
        let e = event.target;
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

    function autoFillClickIdentifier(event) {
        let e = event.target;
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let isInModal = classes.includes('in-browser-test-modal') || getIdentifierBeforeClicked().includes('in-browser-test-modal');
        if (!isInModal) {
            let identifier = getIdentifierBeforeClicked(); // not getIdentifier(event);
            let selectFound = document.querySelector(`#steps>div#step-${numberOfStepsCreated}>select`);
            let useValue = (selectFound.value == 'click') || (selectFound.value == 'select');
            let inputFound = document.querySelector(`#steps>div#step-${numberOfStepsCreated}>input`);
            if (useValue && inputFound) {
                inputFound.value = identifier;
            }
            
            // prevent click from triggering button action (and prevent event propagation):
            (event || window.event).preventDefault();
            (event || window.event).stopPropagation();
            return false;
        }
    }

    document.addEventListener('click', autoFillClickIdentifier, false);
    document.addEventListener('contextmenu', autoFillClickIdentifier, false);
    haveClickEventListener = true;

    document.addEventListener('mouseover', function onMouseOver(event) {
        let e = event.target;
        let classes = (e.className) ? '.' + e.className.trim().replace(/ /g,'.') : '';
        let isInModal = classes.includes('in-browser-test-modal');
        if (!isInModal) {
            let identifier = getIdentifier(event);
            document.getElementById('in-browser-test-modal-pointer-preview').innerHTML = identifier;
        }
    }, false);

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

    function runSteps() {
        document.removeEventListener('click', autoFillClickIdentifier, false);
        document.removeEventListener('contextmenu', autoFillClickIdentifier, false);
        haveClickEventListener = false;

        currentElement = '';
        let overallPassed = true;
        let message = '';
        let delay = 1000;
        let done = $("element").length;
        $('#steps').find('select').each(function (i) {
            let self = this; // so self inside setTimeout points to the right "this"
            setTimeout(function () { // add delay between each action
                let action = self.value;
                let value = $(`#steps>div:nth-child(${i+1})>input`).val();
                
                // TODO: maybe do goto elsewhere:

    //             let go = step.match(/^go (to )?(.+)/);
    //             if (go) {
    //                 let url = go[go.length-1];
    //                 message += '\nStep ' + (i+1) + ': go to ' + url;
    //                 window.location.href = url;
    //                 continue;
    //             }
                if (action == 'click') {
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
                
                if (i === done+1) {
                    message += '\n\nOverall status: ';
                    message += overallPassed ? 'PASSED' : 'FAILED';
                    // TODO: instead of alert(message), just make the steps colour as red-orange #f4bc42 / green-blue #41f4ca
                }
            }, i*delay); // setTimeout
        }); // each()
    }

})();

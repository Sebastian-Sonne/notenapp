import * as toggleModule from './toggle.js';

/*
 * form 
 */

/**
 * function to open the new student box
 */
export function openNewStudentBox() {
    toggleModule.toggleBox('create-new-student-box', true)
    toggleModule.toggleBodyOverflow(true);
}

/**
 * function to reset new student form
 */
export function resetNewStudentForm() {
    document.getElementById('add-student-form').reset();
    clearGradeInputs('writtenGradesContainer');
    clearGradeInputs('oralGradesContainer');

    //reset input borders
    ['id', 'name', 'email'].forEach(id => { toggleModule.toggleInputValidatedBorder(document.getElementById(id), false); });

    //re add default inputs to grades
    addWrittenGrade(1);
    addOralGrade(2);
}

/**
 * function to clear all grade input fields in a container (for add new student form)
 * @param {container} containerId 
 */
export function clearGradeInputs(containerId) {
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.writtenGrade, .oralGrade');
    inputs.forEach(input => {
        input.parentNode.removeChild(input);
    });
}

/**
 * function to add a written grade input field to the add new student form
 * @param {int} placeholder 
 */
export function addWrittenGrade(placeholder) {
    var container = document.getElementById('writtenGradesContainer');
    var input = document.createElement('input');
    input.type = 'number';
    if (placeholder) {
        input.placeholder = placeholder;
    }
    input.classList = 'writtenGrade w-full mt-2 px-4 py-2 rounded-lg border border-transparent focus:border-green-600 focus:outline-none';
    input.name = 'writtenGrade[]';
    container.appendChild(input);

    //set focus for better ux
    input.focus();
}

/**
 * function to remove the last written grade input field of the add new student array
 */
export function removeWrittenGrade() {
    var container = document.getElementById('writtenGradesContainer');
    var lastChild = container.lastElementChild;
    if (lastChild && lastChild.classList.contains('writtenGrade')) {
        container.removeChild(lastChild);
    }
}

/**
 * function to add a oral grade input field to the add new student form
 * @param {int} placeholder 
 */
export function addOralGrade(placeholder) {
    var container = document.getElementById('oralGradesContainer');
    var input = document.createElement('input');
    input.type = 'number';
    if (placeholder) {
        input.placeholder = placeholder;
    }
    input.classList = 'oralGrade w-full mt-2 px-4 py-2 rounded-lg border border-transparent focus:border-green-600 focus:outline-none';
    input.name = 'oralGrade[]';
    container.appendChild(input);

    //set focus for better ux
    input.focus();
}

/**
 * function to remove the last written grade input field of the add new student array
 */
export function removeOralGrade() {
    var container = document.getElementById('oralGradesContainer');
    var lastChild = container.lastElementChild;
    if (lastChild && lastChild.classList.contains('oralGrade')) {
        container.removeChild(lastChild);
    }
}

/*
 * form validation 
 */

/**
 * function to validate the add new student form
 * @returns true if invalid
 */
export function validateForm() {
    const idElement = document.getElementById('id');
    const nameElement = document.getElementById('name');
    const emailElement = document.getElementById('email');

    return (validateInput(idElement) || validateInput(nameElement) || validateInput(emailElement));
}

/**
 * general function to validate input
 * @param {*} input input element
 * @param {*} leaving true if user is leaving input field
 * @returns true if invalid
 */
export function validateInput(input, leaving = false) {
    const value = input.value.trim(); // remove white spaces in beginning and end
    const errorElement = document.getElementById(input.id + '-error');
    const errorMessage = getFormErrorMessage(input.id, value);

    if (errorMessage) {
        //show error message
        toggleModule.toggleInputErrorBorder(input, true);
        toggleModule.toggleInputError(errorElement, errorMessage);
    } else {
        //hide error message
        toggleModule.toggleInputErrorBorder(input, false);
        toggleModule.toggleInputError(errorElement, '', false);
    }

    //if invalid, but leaving, hide message but keep border ed
    if (leaving) toggleModule.toggleInputError(errorElement, '', false);

    return (errorMessage) ? true : false;
}

/**
 * function to get the corresponding error message
 * @param {*} inputId id of input element
 * @param {*} value value of said element
 * @returns error message
 */
export function getFormErrorMessage(inputId, value) {
    switch (inputId) {
        case 'id':
            if (!/^\d+$/.test(value)) {
                return 'ID darf nur aus Zahlen bestehen';
            }
            if (value.length < 6) {
                return 'ID muss mindestens 6 Zeichen lang sein';
            }
            if (value.length > 16) {
                return 'ID darf maximal 16 Zeichen lang sein';
            }
            return '';
        case 'name':
            if (value.length < 1) {
                return 'Name ist erforderlich';
            }
            if (value.length > 40) {
                return 'Name überschreitet maximale Länge';
            }
            return '';
        case 'email':
            if (value.length < 1) {
                return 'E-Mail ist erforderlich';
            }
            if (!validateEmailPattern(value)) {
                return 'Ungültige E-Mail';
            }
            return '';
        default:
            return '';
    }
}


/**
 * function to validate an email
 * @param {*} email email to be validated
 * @returns true if correct
 */
function validateEmailPattern(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email regular expression
    return emailPattern.test(email);
}

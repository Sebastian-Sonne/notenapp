import * as toggleModule from './toggle.js';

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
            return value.length < 6 ? 'ID muss mindestens 6 Zeichen lang sein' : (value.length > 16 ? 'ID darf maximal 16 Zeichen lang sein' : '');
        case 'name':
            return value.length < 1 ? 'Name ist erforderlich' : (value.length > 40 ? 'Name überschreitet maximale Länge' : '');
        case 'email':
            return value.length < 1 ? 'E-Mail ist erforderlich' : (validateEmailPattern(value) ? '' : 'Ungültige E-Mail');
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
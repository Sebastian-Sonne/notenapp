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
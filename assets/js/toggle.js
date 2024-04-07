/**
 * function to toggle visibility of a html element
 * @param {*} boxID element id
 * @param {*} visible visibility
 */
export const toggleBox = (boxID, visible) => {
    const box = document.getElementById(boxID);
    box.classList.toggle('hidden', !visible);
    box.classList.toggle('flex', visible);
};

/**
 * function to toggle the overflow hidden property of body
 * @param {boolean} visible true if active
 */
export const toggleBodyOverflow = (visible) => {
    document.body.classList.toggle('overflow-hidden', visible);
}

/**
 * function to check visibility of elements
 * @param {id} boxID id of element to be checked
 * @returns true if element is visible
 */
export const isVisible = (boxID) => {return (document.getElementById(boxID).classList.contains('hidden')) ? false : true};

/**
 * function to toggle the borders a input element to react to an error
 * @param {*} inputElement input element
 * @param {*} visible true if error exists
 */
export const toggleInputErrorBorder = (inputElement, visible) => {
    toggleInputValidatedBorder(inputElement, !visible);
    inputElement.classList.toggle('!border-red-600', visible);
};

/**
 * function to toggle the input validation success border
 * @param {*} inputElement input element
 * @param {*} visible true if set visisble
 */
export const toggleInputValidatedBorder = (inputElement, visible) => { inputElement.classList.toggle('!border-green-600', visible) };

/**
 * function to toggle the input error element 
 * @param {*} inputElement input element
 * @param {*} errorMessage error messge
 * @param {*} visible true if set visible
 */
export const toggleInputError = (inputElement, errorMessage, visible = true) => {
    inputElement.textContent = errorMessage;
    toggleBox(inputElement.id, visible);
}
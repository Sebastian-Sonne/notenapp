/**
 * function to toggle visibility of a html element
 * @param {*} boxID element id
 * @param {*} visible visibility
 */
export function toggleBox(boxID, visible) {
    const box = document.getElementById(boxID);
    box.classList.toggle('hidden', !visible);
    box.classList.toggle('flex', visible);
}

/**
 * function to check visibility of elements
 * @param {id} boxID id of element to be checked
 * @returns true if element is visible
 */
export function isVisible(boxID) {
    return (document.getElementById(boxID).classList.contains('hidden')) ? false : true;
}
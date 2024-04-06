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
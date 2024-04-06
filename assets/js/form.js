export function handleFormSubmit(event) {
    // Code for handling form submission
}

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



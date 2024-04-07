import * as studentModule from './student.js';
import * as tableModule from './table.js';
import * as toggleModule from './toggle.js';
import * as storageModule from './storage.js';

/**
 * executed when html content load is complete
 */
document.addEventListener('DOMContentLoaded', function () {
    //check if local storage is supported
    if (typeof (Storage) === undefined) {
        console.log('Dein Browser unterstützt kein local storage :(');
        //! @me handle error
    }

    //setup button event listeners
    setupButtonEventListeners();

    //add keydown event listener
    document.addEventListener('keydown', handleKeyDown);

    //add form event listener
    document.getElementById('add-student-form').addEventListener('submit', handleFormSubmit);
    setupInputEventListeners();

    //update table after initial load
    updateTable();
});


/**
 * function to handle keyDown evemts
 * @param {keyEvent} event 
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        if (toggleModule.isVisible('create-new-student-box')) {
            toggleModule.toggleBox('create-new-student-box', false);
            document.body.classList.remove('overflow-hidden');
        }

        if (toggleModule.isVisible('confirm-delete-box')) {
            toggleModule.toggleBox('confirm-delete-box', false);
        } else {
            toggleModule.toggleBox('student-info-box', false);
            document.body.classList.remove('overflow-hidden');
        }
    }
}

/**
 * function to add the button event listeners
 */
function setupButtonEventListeners() {
    //add new student button action listener
    const newStudentButton = document.getElementById('add-student-button');
    newStudentButton.addEventListener('click', () => openNewStudentBox());

    //escape delete student sequence button action listener 
    const escDeleteStudentButton = document.getElementById('escape-delete-student-button');
    escDeleteStudentButton.addEventListener('click', () => toggleModule.toggleBox('confirm-delete-box', false));

    //open confirm delete student box button action listener
    const confirmDelteStudentButton = document.getElementById('confirm-delete-student-button');
    confirmDelteStudentButton.addEventListener('click', () => toggleModule.toggleBox('confirm-delete-box', true));

    //delete student button action listener
    const deleteStudentButton = document.getElementById('delete-student-button');
    deleteStudentButton.addEventListener('click', () => deleteStudent());

    //close buttons action listeners
    ['close-student-info-button', 'close-new-student-box-button'].forEach(element => {
        element = document.getElementById(element);
        element.addEventListener('click', () => handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' })));
    });

    //new student form add/remove grades action listeners
    const addWrittenGradeButton = document.getElementById('add-written-grade-button');
    addWrittenGradeButton.addEventListener('click', () => addWrittenGrade());

    const removeWrittenGradeButton = document.getElementById('remove-written-grade-button');
    removeWrittenGradeButton.addEventListener('click', () => removeWrittenGrade());

    const addOralGradeButton = document.getElementById('add-oral-grade-button');
    addOralGradeButton.addEventListener('click', () => addOralGrade());

    const removeOralGradeButton = document.getElementById('remove-oral-grade-button');
    removeOralGradeButton.addEventListener('click', () => removeOralGrade());
}

/**
 * function to setup the form input event listeners
 */
function setupInputEventListeners() {
    ['id', 'name', 'email'].forEach(element => {
        const input = document.getElementById(element);
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('focusout', () => validateInput(input, true));
    });
}

/*
 * main students table 
 */

/**
 * function to update the students table
 */
function updateTable() {
    //parse existing student data
    var data = storageModule.loadData('students');

    //clear table
    document.getElementById('students-table-body').innerHTML = '';

    if (data.length > 0) {
        //sort student based on their average
        data.sort(studentModule.compareStudents);

        //add students to table
        for (var key in data) {
            tableModule.addStudentToTable(data[key]);
        }
        toggleModule.toggleBox('no-students-found', false)
    } else {
        console.log('called');
        toggleModule.toggleBox('no-students-found', true)
    }
}

/*
 * students actions
 */

/**
 * function to delete a student
 */
function deleteStudent() {
    //retrieve studentID
    const studentId = document.getElementById('info-id').value;

    //retrieve, modify, update student data
    var data = storageModule.loadData('students');
    data = studentModule.deleteStudent(studentId, data);
    storageModule.saveData('students', data);

    //update ui
    updateTable();
    document.body.classList.remove('overflow-hidden');
    toggleModule.toggleBox('student-info-box', false);
    toggleModule.toggleBox('confirm-delete-box', false);
}

/*
 * new student form 
 */

/**
 * function to handle the new student from submit
 * @param {*} event submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();

    //if form valid, submit student
    if (!validateForm()) submitNewStudent();
}

/**
 * function to submit a new student
 */
function submitNewStudent() {
    // Create student object
    var studentData = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        //convert grade inputs to array of their values, and remove any empty spaces
        writtenGrades: Array.from(document.getElementsByClassName('writtenGrade'))
            .map(input => input.value)
            .filter(value => value.trim() !== ''),
        oralGrades: Array.from(document.getElementsByClassName('oralGrade'))
            .map(input => input.value)
            .filter(value => value.trim() !== '')
    };

    studentData.average = studentModule.calculateAverage(studentData);

    //save student data to local storage
    storageModule.saveStudent(studentData);
    updateTable();

    //clear, reset and hide form
    resetNewStudentForm();

    toggleModule.toggleBox('create-new-student-box', false);
    document.body.classList.remove('overflow-hidden');
}

/**
 * function to open the new student box
 */
function openNewStudentBox() {
    toggleModule.toggleBox('create-new-student-box', true)
    document.body.classList.add('overflow-hidden');
}

/**
 * function to clear new student form
 */
function resetNewStudentForm() {
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
 * function to add a written grade input field to the add new student form
 * @param {int} placeholder 
 */
function addWrittenGrade(placeholder) {
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
function removeWrittenGrade() {
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
function addOralGrade(placeholder) {
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
function removeOralGrade() {
    var container = document.getElementById('oralGradesContainer');
    var lastChild = container.lastElementChild;
    if (lastChild && lastChild.classList.contains('oralGrade')) {
        container.removeChild(lastChild);
    }
}

/**
 * function to clear all grade input fields in a container (for add new student form)
 * @param {container} containerId 
 */
function clearGradeInputs(containerId) {
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.writtenGrade, .oralGrade');
    inputs.forEach(input => {
        input.parentNode.removeChild(input);
    });
}

/*
 * validate inputs
 */

/**
 * function to validate the add new student form
 * @returns true if invalid
 */
function validateForm() {
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
function validateInput(input, leaving = false) {
    const value = input.value.trim(); // remove white spaces in beginning and end
    const errorElement = document.getElementById(input.id + '-error');
    const errorMessage = getErrorMessage(input.id, value);

    if (errorMessage) {
        toggleModule.toggleInputErrorBorder(input, true);
        toggleInputError(errorElement, errorMessage);
    } else {
        toggleModule.toggleInputErrorBorder(input, false);
        toggleInputError(errorElement, '', false);
    }

    if (leaving) toggleInputError(errorElement, '', false);

    return (errorMessage) ? true : false;
}

/**
 * function to get the corresponding error message
 * @param {*} inputId id of input element
 * @param {*} value value of said element
 * @returns error message
 */
function getErrorMessage(inputId, value) {
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
 * function to toggle the input error element 
 * @param {*} inputElement input element
 * @param {*} errorMessage error messge
 * @param {*} visible true if set visible
 */
function toggleInputError(inputElement, errorMessage, visible = true) {
    inputElement.textContent = errorMessage;
    toggleModule.toggleBox(inputElement.id, visible);
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
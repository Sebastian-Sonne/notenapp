import * as studentModule from './student.js';
import * as tableModule from './table.js';
import * as toggleModule from './toggle.js';
import * as storageModule from './storage.js';
import * as formModule from './form.js';

/**
 * executed when html content load is complete
 */
document.addEventListener('DOMContentLoaded', function () {
    //check if local storage is supported
    if (typeof (Storage) === undefined) {
        console.log('Dein Browser unterstützt kein local storage :(');
        return;
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
    tableModule.updateTable();
});

/**
 * function to handle keyDown evemts
 * @param {keyEvent} event 
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        if (toggleModule.isVisible('create-new-student-box')) {
            toggleModule.toggleBox('create-new-student-box', false);
            toggleModule.toggleBodyOverflow(false);
        }

        if (toggleModule.isVisible('confirm-delete-box')) {
            toggleModule.toggleBox('confirm-delete-box', false);
        } else {
            toggleModule.toggleBox('student-info-box', false);
            toggleModule.toggleBodyOverflow(false);
        }
    }
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
    if (!formModule.validateForm()) submitNewStudent();
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
    tableModule.updateTable();

    //clear, reset and hide form
    formModule.resetNewStudentForm();

    toggleModule.toggleBox('create-new-student-box', false);
    toggleModule.toggleBodyOverflow(false);
}

/*
 *  setup functions
 */

/**
 * function to add the button event listeners
 */
function setupButtonEventListeners() {
    //add new student button action listener
    const newStudentButton = document.getElementById('add-student-button');
    newStudentButton.addEventListener('click', () => formModule.openNewStudentBox());

    //escape delete student sequence button action listener 
    const escDeleteStudentButton = document.getElementById('escape-delete-student-button');
    escDeleteStudentButton.addEventListener('click', () => toggleModule.toggleBox('confirm-delete-box', false));

    //open confirm delete student box button action listener
    const confirmDelteStudentButton = document.getElementById('confirm-delete-student-button');
    confirmDelteStudentButton.addEventListener('click', () => toggleModule.toggleBox('confirm-delete-box', true));

    //delete student button action listener
    const deleteStudentButton = document.getElementById('delete-student-button');
    deleteStudentButton.addEventListener('click', () => studentModule.deleteStudent());

    //close buttons action listeners
    ['close-student-info-button', 'close-new-student-box-button'].forEach(element => {
        element = document.getElementById(element);
        element.addEventListener('click', () => handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' })));
    });

    //new student form add/remove grades action listeners
    const addWrittenGradeButton = document.getElementById('add-written-grade-button');
    addWrittenGradeButton.addEventListener('click', () => formModule.addWrittenGrade());

    const removeWrittenGradeButton = document.getElementById('remove-written-grade-button');
    removeWrittenGradeButton.addEventListener('click', () => formModule.removeWrittenGrade());

    const addOralGradeButton = document.getElementById('add-oral-grade-button');
    addOralGradeButton.addEventListener('click', () => formModule.addOralGrade());

    const removeOralGradeButton = document.getElementById('remove-oral-grade-button');
    removeOralGradeButton.addEventListener('click', () => formModule.removeOralGrade());
}

/**
 * function to setup the form input event listeners
 */
function setupInputEventListeners() {
    ['id', 'name', 'email'].forEach(element => {
        const input = document.getElementById(element);
        input.addEventListener('input', () => formModule.validateInput(input));
        input.addEventListener('focusout', () => formModule.validateInput(input, true));
    });
}
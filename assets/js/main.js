import * as tableModule from './table.js';
import * as eventModule from './eventHandler.js';
import * as formModule from './form.js';
import * as studentModule from './student.js';
import * as storageModule from './storage.js'
import { toggleBox } from './toggle.js';

/**
 * executed when html content load is complete intialize the application
 */
document.addEventListener('DOMContentLoaded', function () {
    //display error if local storage is unsuppoerted
    if (typeof (Storage) === undefined) {
        toggleBox('no-local-storage', true);
        console.log('Dein Browser unterstützt kein local storage :(');
        return; //return early
    }

    //setup button event listeners
    eventModule.setupButtonEventListeners();

    //setup keydown event listener
    eventModule.setupDocumentEvenListener();

    //setup form event listener
    eventModule.setupFormSubmit();

    //setup input event listeners
    eventModule.setupInputEventListeners();

    //update table setup complete
    tableModule.updateTable();

    document.getElementById('gen-students').addEventListener('click', () => generateStudents());
    document.getElementById('delete-all-students').addEventListener('click', () => deleteAllStudents());
    document.getElementById('to-top-button').addEventListener('click', () => toTop());
});

function generateStudents() {
    for (var i = 0; i < 1000; i++) {
        document.getElementById('id').value = i;
        document.getElementById('name').value = 'student' + i;
        document.getElementById('email').value = 'generated-' + i + '@example.com';

        for (var j = 0; j < 20; j++) {
            formModule.addWrittenGrade(Math.round(Math.random() * 6));
            formModule.addOralGrade(Math.round(Math.random() * 6));
        }

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

        //calulate and set student average
        studentData.average = studentModule.calculateAverage(studentData);

        //save student data to local storage
        storageModule.saveStudent(studentData);
        tableModule.updateTable();

        console.log('generated student: ' + i);
        //clear, reset and hide form
        formModule.resetNewStudentForm();
    }
}

function deleteAllStudents() {
    var confirmation = confirm('Möchten Sie all Schüler Löschen? Dieser Vorgang kann nicht rückgangig gemach werden');

    if (confirmation) {
        storageModule.saveData('students', '');
        tableModule.updateTable();
    }
}

function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
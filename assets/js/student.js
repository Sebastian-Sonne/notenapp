import * as storageModule from './storage.js';
import * as toggleModule from './toggle.js';
import { updateTable } from './table.js';
import { resetNewStudentForm } from './form.js';

/**
 * function to submit a new student
 */
export function submitNewStudent() {
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

    //calulate average and set two digits after decimal point
    studentData.average = calculateAverage(studentData).toFixed(2);

    //save student data to local storage
    storageModule.saveStudent(studentData);
    updateTable();

    //clear, reset and hide form
    resetNewStudentForm();

    toggleModule.toggleBox('create-new-student-box', false);
    toggleModule.toggleBodyOverflow(false);
}

/**
 * function to delete a student
 */
export function deleteStudent() {
    //retrieve studentID
    const studentId = document.getElementById('info-id').value;

    //retrieve data
    var data = storageModule.loadData('students');
    //remove student from data
    data = findStudent(studentId, data);
    //save modified data
    storageModule.saveData('students', data);

    //update ui
    updateTable();
    toggleModule.toggleBodyOverflow(false);
    toggleModule.toggleBox('student-info-box', false);
    toggleModule.toggleBox('confirm-delete-box', false);
}

/**
 * function to delete student from array of students using id
 * @param {*} studentId id of student to be deleted
 * @param {*} data students
 * @returns modified data
 */
function findStudent(studentId, data) {
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === studentId) {
            index = i;
            break;
        }
    }

    //if student with id is found remove it
    if (index !== -1) {
        data.splice(index, 1);
    }

    return data;
}

/**
 * function to compare the average of two students
 * @param {*} studentA reference to student a
 * @param {*} studentB reference to student b
 * @returns negative if avg1 > avg2, 0 if avg1 = avg2, positive if avg1 < avg2
 */
export function compareStudents(student1, student2) {
    // If one of the students has an average grade of 0, move it to the end
    if (student1.average === 0 && student2.average !== 0) {
        return 1;
    } else if (student1.average !== 0 && student2.average === 0) {
        return -1;
    }

    return student1.average - student2.average;
}

/**
 * function to calculate weighted the average grade of student
 * @param {} student student
 * @returns average as double
 */
function calculateAverage(student) {
    var oralGrades = student.oralGrades;
    const oralGradesLength = oralGrades.length;

    var writtenGrades = student.writtenGrades;
    const writtenGradesLength = writtenGrades.length;

    var sumOral = oralGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
    var sumWritten = writtenGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);

    var average = 0;
    if (oralGradesLength + writtenGradesLength > 0) {
        //calculate average weighted 2writtem / 1oral
        average = (2 * sumWritten + sumOral) / (oralGradesLength + 2 * writtenGradesLength);
    }

    //round to two decimal points
    average = Number(average.toFixed(2));

    return average;
}
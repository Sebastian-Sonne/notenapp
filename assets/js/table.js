import * as toggleModule from './toggle.js';
import * as storageModule from './storage.js';
import { compareStudents } from './student.js';

/**
 * function to update the students table
 */
export function updateTable() {
    //parse existing student data
    var data = storageModule.loadData('students');

    //clear table
    document.getElementById('students-table-body').innerHTML = '';

    if (data.length > 0) {
        //sort student based on their average
        data.sort(compareStudents);

        //add students to table
        for (var key in data) {
            addStudentToTable(data[key]);
        }
        toggleModule.toggleBox('no-students-found', false)
    } else {
        toggleModule.toggleBox('no-students-found', true)
    }
}

/**
 * function to add a student overview table
 * @param {*} student student to be added
 */
function addStudentToTable(student) {
    const table = document.getElementById('students-table-body');
    const tableRow = document.createElement('tr');

    //set class properties
    tableRow.classList = 'hover:bg-gray-100 cursor-pointer';

    // add eventListener to open student info
    tableRow.addEventListener('click', () => openStudentInfoTable(student));

    //add id, name, email
    ['id', 'name', 'email'].forEach(key => {
        if (student.hasOwnProperty(key)) {
            tableRow.appendChild(createTableCell(student[key], 'border px-4 py-2'));
        }
    });

    //add average Grade
    var avg = (student.average == 0) ? '-' : student.average.toFixed(2).replace('.', ','); //make avg look consistent
    tableRow.appendChild(createTableCell(avg, 'border px-4 py-2 text-center'));


    // Add learn more button
    const learnMoreHtml = '<a class=\"m-2 py-1 px-2 text-center text-white font-semibold bg-notenapp-blue hover:bg-notenapp-blue-hover rounded-lg cursor-pointer transition-all\">Info</a>';
    tableRow.appendChild(createTableCell(learnMoreHtml, 'border-y'));

    table.appendChild(tableRow);
}

/**
 * function to create a table celle 'td' with content and classes
 * @param {String} content (html) content of cell
 * @param {String} classList classlist of cell
 * @returns html element
 */
function createTableCell(content, classList) {
    const element = document.createElement('td');
    element.classList = classList;
    element.innerHTML = content;
    return element;
}

/**
 * function to open the student properties for a student
 * @param {*} student 
 */
function openStudentInfoTable(student) {
    //assign student values to info box   
    document.getElementById('info-name').value = student.name;
    document.getElementById('info-id').value = student.id;
    document.getElementById('info-email').value = student.email;

    //print student grades to grades table
    clearStudentInfoTable();
    const table = document.getElementById('grade-table-body');
    const length = Math.max(student.oralGrades.length, student.writtenGrades.length);

    for (let i = 0; i < length; i++) {
        addGradeToStudentInfoTable(table, student.oralGrades[i], student.writtenGrades[i]);
    }

    //show info box
    toggleModule.toggleBox('student-info-box', true);
    toggleModule.toggleBodyOverflow(true);
}

/**
 * function to add a pair of oral and written grades to the student info talbe
 * @param {*} table student info grades table
 * @param {*} oralGrade 
 * @param {*} writtenGrade 
 */
function addGradeToStudentInfoTable(table, oralGrade, writtenGrade) {
    const tableItem = document.createElement('tr');

    //helper function to set up grade table element
    const createGradeElement = (grade) => {
        const gradeElement = document.createElement('td');
        gradeElement.classList = 'border px-4 py-2';
        gradeElement.textContent = (grade !== undefined) ? grade : '-';
        return gradeElement;
    };

    //create grade elements using helper function
    const writtenGradeElement = createGradeElement(writtenGrade);
    const oralGradeElement = createGradeElement(oralGrade);

    //add grades to table row
    tableItem.appendChild(writtenGradeElement);
    tableItem.appendChild(oralGradeElement);

    //add table row to table
    table.appendChild(tableItem);
}

/**
 * function to clear the student info grade table
 */
const clearStudentInfoTable = () => document.getElementById('grade-table-body').innerHTML = '';

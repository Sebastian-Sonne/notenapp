/**
 * executed when html content load is complete
 */
document.addEventListener("DOMContentLoaded", function () {
    //add new student button action listener
    const newStudentButton = document.getElementById('add-student-button');
    newStudentButton.addEventListener("click", () => openNewStudentBox());

    //escape delete student sequence button action listener 
    const escDeleteStudentButton = document.getElementById('escape-delete-student-button');
    escDeleteStudentButton.addEventListener("click", () => toggleBox('confirm-delete-box', false));

    //open confirm delete student box button action listener
    const confirmDelteStudentButton = document.getElementById('confirm-delete-student-button');
    confirmDelteStudentButton.addEventListener("click", () => toggleBox('confirm-delete-box', true));

    //delete student button action listener
    const deleteStudentButton = document.getElementById('delete-student-button');
    deleteStudentButton.addEventListener("click", () => deleteStudent());

    //close buttons action listeners
    ['close-student-info-button', 'close-new-student-box-button'].forEach(element => {
        element = document.getElementById(element);
        element.addEventListener("click", () => handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' })));
    });

    //add keydown event listener
    document.addEventListener('keydown', handleKeyDown);

    // Validation inputs event listeners
    ['id', 'name', 'email'].forEach(element => {
        const input = document.getElementById(element);
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('focusout', () => validateInput(input, true));
    });

    //update table after initial load
    updateTable();

    //fuction to handle the form submit to add a new student
    document.getElementById('add-student-form').addEventListener('submit', (event) => {
        event.preventDefault();

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

        studentData.average = calculateAverage(studentData);

        saveStudentData(studentData);

        //clear, reset and hide form
        clearNewStudentBox();
        ['id', 'name', 'email'].forEach(id => { toggleInputValidatedBorder(document.getElementById(id), false); });
        toggleBox('create-new-student-box', false);
        document.body.classList.remove('overflow-hidden');
    });
});

/**
 * function to save a new student to local storage
 * @param {*} student student object to be added
 */
function saveStudentData(student) {
    if (typeof (Storage) !== undefined) {
        //retrive existing data or create empty array
        var data = JSON.parse(localStorage.getItem("students")) || [];

        //add new student data to data
        data.push(student);

        //save the updated data
        localStorage.setItem("students", JSON.stringify(data));

        updateTable();
    } else {
        console.log('Dein Browser unterstützt kein local storage :(');
        //! handle error
    }
}

/**
 * function to toggle visibility of a html element
 * @param {*} boxID element id
 * @param {*} visible visibility
 */
function toggleBox(boxID, visible) {
    const newStudentBox = document.getElementById(boxID);
    newStudentBox.classList.toggle('hidden', !visible);
    newStudentBox.classList.toggle('flex', visible);
}

/**
 * function to check visibility of elements
 * @param {id} boxID id of element to be checked
 * @returns true if element is visible
 */
function isVisible(boxID) {
    const element = document.getElementById(boxID);
    return (document.getElementById(boxID).classList.contains('hidden')) ? false : true;
}

/**
 * function to handle keyDown evemts
 * @param {keyEvent} event 
 */
function handleKeyDown(event) {
    if (event.key === "Escape") {
        if (isVisible('create-new-student-box')) {
            toggleBox('create-new-student-box', false);
            document.body.classList.remove('overflow-hidden');
        }

        if (isVisible('confirm-delete-box')) {
            toggleBox('confirm-delete-box', false);
        } else {
            toggleBox('student-info-box', false);
            document.body.classList.remove('overflow-hidden');
        }
    }
}

/*
 * main students table 
 */

/**
 * function to update the students table
 */
function updateTable() {
    //parse existing student data
    var storedData = JSON.parse(localStorage.getItem("students"));

    if (storedData) {
        //clear table
        document.getElementById('students-table-body').innerHTML = '';

        //sort student based on their average
        storedData.sort(compareStudents);

        //add students to table
        for (var key in storedData) {
            addStudentToTable(storedData[key]);
        }
        toggleBox('no-students-found', false)
    } else {
        toggleBox('no-students-found', true)
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

    //add eventListener to open student info
    tableRow.addEventListener('click', () => openStudentInfoTable(student));

    //add id, name, email
    ['id', 'name', 'email'].forEach(key => {
        if (student.hasOwnProperty(key)) {
            tableRow.appendChild(createTableCell(student[key], 'border px-4 py-2'));
        }
    });

    //add average Grade
    const avg = (student.average == 0) ? '-' : student.average;
    tableRow.appendChild(createTableCell(avg, 'border px-4 py-2'));

    // Add learn more button
    const learnMoreHtml = '<a class=\"m-2 py-1 px-2 text-center text-white font-semibold bg-notenapp-blue hover:bg-notenapp-blue-hover rounded-lg cursor-pointer transition-all\">Info</a>';
    tableRow.appendChild(createTableCell(learnMoreHtml, "border-y"));

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

/*
 * student info table 
 */

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
    toggleBox('student-info-box', true);
    document.body.classList.add('overflow-hidden');
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

/*
 * students actions
 */

/**
 * function to delete a student
 */
function deleteStudent() {
    //retrieve studentID
    const studentID = document.getElementById('info-id').value;

    //retrieve student data
    var data = JSON.parse(localStorage.getItem("students")) || [];

    //find index of to be removed student in student dat
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === studentID) {
            index = i;
            break;
        }
    }

    //if student with id is found remove it
    if (index !== -1) {
        data.splice(index, 1);
    }

    //save changes
    localStorage.setItem("students", JSON.stringify(data));

    //update ui
    updateTable();
    toggleBox('student-info-box', false);
    toggleBox('confirm-delete-box', false);
}

/*
 * math functions
 */

/**
 * function to compare the average of two students
 * @param {*} studentA reference to student a
 * @param {*} studentB reference to student b
 * @returns negative if avg1 > avg2, 0 if avg1 = avg2, positive if avg1 < avg2
 */
function compareStudents(student1, student2) {
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

/*
 * new student form 
 */

function openNewStudentBox() {
    toggleBox('create-new-student-box', true)
    document.body.classList.add('overflow-hidden');
}

/**
 * function to clear new student form
 */
function clearNewStudentBox() {
    document.getElementById('add-student-form').reset();
    clearGradeInputs('writtenGradesContainer');
    clearGradeInputs('oralGradesContainer');

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
 * general function to validate input
 * @param {*} input input element
 * @param {*} leaving true if user is leaving input field
 */
function validateInput(input, leaving = false) {
    const value = input.value.trim(); // remove white spaces in beginning and end
    const errorElement = document.getElementById(input.id + '-error');
    const errorMessage = getErrorMessage(input.id, value);

    if (errorMessage) {
        toggleInputErrorBorder(input, true);
        toggleInputError(errorElement, errorMessage);
    } else {
        toggleInputErrorBorder(input, false);
        toggleInputError(errorElement, '', false);
    }

    if (leaving) toggleInputError(errorElement, '', false);
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
    toggleBox(inputElement.id, visible);
}

/**
 * function to toggle the borders a input element to react to an error
 * @param {*} inputElement input element
 * @param {*} visible true if error exists
 */
const toggleInputErrorBorder = (inputElement, visible) => {
    toggleInputValidatedBorder(inputElement, !visible);
    inputElement.classList.toggle('!border-red-600', visible);
};


/**
 * function to toggle the input validation success border
 * @param {*} inputElement input element
 * @param {*} visible true if set visisble
 */
const toggleInputValidatedBorder = (inputElement, visible) => { inputElement.classList.toggle('!border-green-600', visible) };


/**
 * function to validate an email
 * @param {*} email email to be validated
 * @returns true if correct
 */
function validateEmailPattern(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email regular expression
    return emailPattern.test(email);
}
/**
 * executed when html content load is complete
 */
document.addEventListener("DOMContentLoaded", function () {
    const newStudentButton = document.getElementById('add-student-button');
    const newStudentBox = document.getElementById('create-new-student-box');

    newStudentButton.addEventListener("click", toggleNewStudentBox);
    document.addEventListener('keydown', handleKeyDown);

    /**
     * function to toggle the new student box
     */
    function toggleNewStudentBox() {
        newStudentBox.classList.toggle('hidden');
        newStudentBox.classList.toggle('flex');
    }

    /**
     * function to close (if applicable) any in screen windows
     * @param {*} event 
     */
    function handleKeyDown(event) {
        if (event.key === "Escape") {
            hideNewStudentBox();
        }
    }

    updateTable();

    /**
     * fuction to handle the form submit to add a new student
     */
    document.getElementById('add-student-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Create student object
        var studentData = {
            id: document.getElementById('id').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            writtenGrades: Array.from(document.getElementsByClassName('writtenGrade')).map(input => input.value),
            oralGrades: Array.from(document.getElementsByClassName('oralGrade')).map(input => input.value)
        };

        studentData.average = calculateAverage(studentData);

        saveStudentData(studentData);

        clearNewStudentForm();
        hideNewStudentBox();
    });
});

function saveStudentData(studentData) {
    if (typeof (Storage) !== undefined) {
        //retrive existing data or create empty array
        var data = JSON.parse(localStorage.getItem("students")) || [];

        //add new student data to data
        data.push(studentData);

        //save the updated data
        localStorage.setItem("students", JSON.stringify(data));

        updateTable();
    } else {
        console.log('Dein Browser unterstützt kein local storage :(');
        //! handle error
    }
}

function toggleNoStudentsFound(studentsFound) {
    const noStudentsFound = document.getElementById('no-students-found');
    if (studentsFound) {
        noStudentsFound.classList.remove('flex');
        noStudentsFound.classList.add('hidden');
    } else {
        noStudentsFound.classList.remove('hidden');
        noStudentsFound.classList.add('flex');
    }

}

function updateTable() {
    var storedData = JSON.parse(localStorage.getItem("students"));

    if (storedData) {
        for (var key in storedData) {
            //! clear old table
            setupTable(storedData[key]);
        }
        toggleNoStudentsFound(true);
    } else {
        toggleNoStudentsFound(false);
    }
}


function setupTable(student) {
    const table = document.getElementById('students-table-body');
    var tableItem = document.createElement('tr');
    tableItem.classList.add('hover:bg-gray-100');

    var keys = ['id', 'name', 'email', 'average'];

    keys.forEach(key => {
        if (student.hasOwnProperty(key)) {
            const element = document.createElement('td');
            element.classList = 'border px-4 py-2';
            element.textContent = student[key];
            tableItem.appendChild(element);
        }
    });

    const infoButton = document.createElement('td');
    infoButton.classList.add('border-y');
    infoButton.innerHTML = "<a id=\"learn-more-about-student\" class=\"m-2 py-1 px-2 text-center text-white font-semibold bg-notenapp-blue hover:bg-notenapp-blue-hover rounded-lg cursor-pointer transition-all\">Info</a>";
    tableItem.appendChild(infoButton);

    table.appendChild(tableItem);
}

/**
 * function to add a new student to the student table
 * @param {} student 
 */
function addStudentToList(student) {
    console.log(student);
    const table = document.getElementById('students-table-body');
    var tableItem = document.createElement('tr');

    for (var key in student) {
        if (student.hasOwnProperty(key)) {
            const element = document.createElement('td');
            element.classList = 'border px-4 py-2';
            element.textContent = student[key];
            tableItem.appendChild(element);
        }
    }

    //! verify input in form

    table.appendChild(tableItem);
}

/**
 * function to calculate the average grade of student
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
        average = (2 * sumWritten + sumOral) / (oralGradesLength + 2 * writtenGradesLength);
    }

    //round to two decimal points
    average = Number(average.toFixed(2));

    return average;
}

/*
 *  
 */

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

/**
 * function to clear new student form
 */
function clearNewStudentForm() {
    document.getElementById('add-student-form').reset();
    clearGradeInputs('writtenGradesContainer');
    clearGradeInputs('oralGradesContainer');

    //re add default inputs to grades
    addWrittenGrade(1);
    addOralGrade(2);
}

/**
 * function to hide the add new student box
 */
function hideNewStudentBox() {
    const newStudentBox = document.getElementById('create-new-student-box');
    newStudentBox.classList.remove('flex');
    newStudentBox.classList.add('hidden');
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
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

    /**
     * fuction to handle the form submit to add a new student
     */
    document.getElementById('add-student-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        var id = document.getElementById('id').value;
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var writtenGrades = Array.from(document.getElementsByClassName('writtenGrade')).map(input => input.value);
        var oralGrades = Array.from(document.getElementsByClassName('oralGrade')).map(input => input.value);
    
        // Create student object
        var student = {
            id: id,
            name: name,
            email: email,
            writtenGrades: writtenGrades,
            oralGrades: oralGrades
        };
    
        // Add student to list
        addStudentToList(student);
    
        // Clear form fields
        document.getElementById('id').value = '';
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        clearGradeInputs('writtenGradesContainer');
        clearGradeInputs('oralGradesContainer');

        //re add default inputs
        addWrittenGrade(1);
        addOralGrade(2);

        //hide form field
        hideNewStudentBox();
    });
});

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
    input.classList =  'oralGrade w-full mt-2 px-4 py-2 rounded-lg border border-transparent focus:border-green-600 focus:outline-none';
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

/**
 * function to add a new student to the student table
 * @param {} student 
 */
function addStudentToList(student) {
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
 * function to calcutlate the average grade
 */
function calculateAverage() {

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
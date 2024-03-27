document.addEventListener("DOMContentLoaded", function () {
    const newStudentButton = document.getElementById('add-student-button');
    const newStudentBox = document.getElementById('create-new-student-box');

    newStudentButton.addEventListener("click", toggleNewStudentBox);
    document.addEventListener('keydown', handleKeyDown);

    function toggleNewStudentBox() {
        newStudentBox.classList.toggle('hidden');
        newStudentBox.classList.toggle('flex');
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            hideNewStudentBox();
        }
    }

    function hideNewStudentBox() {
        newStudentBox.classList.remove('flex');
        newStudentBox.classList.add('hidden');
    }

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
    });
});


function addWrittenGrade() {
    var container = document.getElementById('writtenGradesContainer');
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'writtenGrade';
    input.name = 'writtenGrade[]';
    input.required = true;
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}

function addOralGrade() {
    var container = document.getElementById('oralGradesContainer');
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'oralGrade';
    input.name = 'oralGrade[]';
    input.required = true;
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}

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

    table.appendChild(tableItem);
}

function calculateGPA() {
    
}

function clearGradeInputs(containerId) {
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.writtenGrade, .oralGrade');
    inputs.forEach(input => {
        input.parentNode.removeChild(input);
    });
}
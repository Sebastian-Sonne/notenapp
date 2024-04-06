/**
 * function to add a student overview table
 * @param {*} student student to be added
 */
export function addStudentToTable(student) {
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
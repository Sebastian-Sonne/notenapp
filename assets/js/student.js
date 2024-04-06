/**
 * function to delete student from array of students using id
 * @param {*} studentId id of student to be deleted
 * @param {*} data students
 * @returns modified data
 */
export function deleteStudent(studentId, data) {
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
export function calculateAverage(student) {
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
function getDepartment() {
    const URL = 'http://localhost:5000/api/get-department';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.responseText);
            let result = '';

            for (let i = 0; i < res.length; i++) {
                result += `<option value="${res[i].dname}">${res[i].dname}</option>`;
            }

            document.getElementById('chooseDept').innerHTML = result;
        }
    };

    xhttp.open('GET', URL, true);
    xhttp.send();
}

function getCourses(dept) {

    const URL = `http://localhost:5000/api/get-courses?deptName=${dept}`;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            console.log(response);
            let output = '';

            for (let i = 0; i < response.length; i++) {
                output += `<option value="${response[i].courseName}">${response[i].courseName}</option>`;
            }
            document.getElementById('course').innerHTML = output;
        }
    };

    xhttp.open("GET", URL, true);
    xhttp.send();
}

function getStudentInfo(studentRollNo) {
    const URL = `http://localhost:5000/api/getStudentInfo?studentRollNo=${studentRollNo}`;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.responseText);
            let student = {
                studentName: res.StudentName.FirstName + " " + res.StudentName.LastName,
                class: res.Class,
                section: res.Section,
                department: res.CourseName,
                course: res.BranchName
            }
            document.getElementById('studentName').value = student.studentName;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('studentSection').value = student.section;
            document.getElementById('studentDept').value = student.department;
            document.getElementById('studentCourse').value = student.course;
        }
    };

    xhttp.open("GET", URL, true);
    xhttp.send();
}
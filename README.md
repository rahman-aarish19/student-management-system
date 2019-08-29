# Student Management Sytem
 Note:- This is my ongoing project, so it's not complete yet.

A Full Stack Web Application built with Node.js, Express.js, MongoDB and Bootstrap for managing all the tasks and activities of a student within an Institution.

# Modules

  - A powerful Login and Authentication System - Role based authentication and authorization.
  - Student Details – Displays the details of all the students, and provides following services:
        a. Adding a new student.
        b. Editing / Modifying the data of an existing student.
        c. Deleting / Removing the data of an existing student.

  - Course Details – Lis the details of all the courses available in the institution, and provides following services:
        a. Adding a new course.
        b. Editing an existing course.
        c. Deleting a course.
  - Fee Details.
  - Marks and Grades.
  - Attendance.

### Technology Stack Used

This project uses a number of open source tools, technologies and frameworks to work properly:

* [Visual Studio Code](https://code.visualstudio.com) - A code editor redefined and optimized for building and debugging modern web and cloud applications. 
* [Twitter Bootstrap](https://www.getbootstrap.com) - Great UI boilerplate for modern web apps.
* [node.js](https://www.nodejs.org) - Evented I/O for the backend. Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Express](https://www.expressjs.com) - Express is a minimal and flexible Node.js web application framework.
* [Html, CSS, JavaScript](#)
* [MongoDB](https://www.mongodb.com)

### Installation

This project requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd student-management-system
$ npm install -d
$ nodemon
```



### Todos

 - Import the users.json file to the local MongoDB server.
 ```sh
$ mongoimport --db student-mgmt-sys --collection users --file users.json
```
 - And run the application in the development mode.

License
----

MIT

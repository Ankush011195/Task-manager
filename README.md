# Task Manager Project

## About

This is a task manager web application where users can register, login and manage their tasks.
Admin can create projects and assign tasks to users.

## Features

* User Register & Login
* Admin and User roles
* Admin can create projects
* Admin can assign tasks
* Users can update task status (pending, in-progress, completed)

How to Use
1. First open the website and register a new user

2. By default, every user is created as a "member"

3. To make an Admin:

   * Go to MongoDB database
   * Open **users collection**
   * Find your user
   * Change role from `"member"` to `"admin"`

4. Now login again → you will see admin features

5. Admin can:

   * Create projects
   * Assign tasks to users

6. Users can:

   * View their tasks
   * Update task status

 Technologies Used

* React (Frontend)
* Node.js & Express (Backend)
* MongoDB (Database)

Ankush Mehra

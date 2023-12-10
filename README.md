# Project Name

## Overview

This project is a full-stack web application developed using React for the frontend and Express and Node.js for the backend. The backend is deployed on a separate DigitalOcean Droplet. The application includes features such as a signup page, login page, add expenses page, view expenses page, budget management page, and a visualization page with line chart, pie chart, bar chart, and bubble chart options on expenses. Automated testing is implemented using Cypress for end-to-end tests and Applitools for visual regression tests.

## Technology Stack

- **Frontend:**
  - React

- **Backend:**
  - Express
  - Node.js

## Features

### Signup Page

- The signup page allows users to create a new account.
- Users can provide their first name, last name, email, password, and phone number to sign up.

### Login Page

- The login page enables users to log in to their accounts.
- Users need to enter their email and password to access the application.

### Token Refresh Popup

- The application includes a token refresh popup for enhanced security.
- When a user's authentication token is about to expire, a popup prompts the user to refresh their token.
- This feature ensures a seamless user experience without requiring manual logouts or disruptions.

### Add Expenses Page

- The add expenses page allows users to record their expenses.
- Users can specify the date, category, and amount of the expense.

### View Expenses Page

- The view expenses page displays a list of recorded expenses.
- Users can view their expenses and have the option to delete any entry.

### Budget Management Page

- The budget management page allows users to add, view, and delete budgets.
- Users can define budget categories and set the budget amount for each category.

### Visualization Page

- The visualization page allows users to analyze their expenses with various chart options.
- Users can select a month and visualize their data using line charts, pie charts, bar charts, and bubble charts.

## Testing

The project includes automated testing using Cypress for end-to-end tests and Applitools for visual regression tests.

### End-to-End Tests with Cypress

- Two end-to-end tests are implemented using Cypress.
- These tests cover the signup process, login functionality that are in cypress/e2e folder.

### Visual Regression Tests with Applitools

- One visual regression test is performed using Applitools and that is in cypress/integration.
- This test ensures that the application's visual elements remain consistent across updates.


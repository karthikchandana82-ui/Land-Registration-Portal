# Land Registration Portal

A web-based Land Registration Portal designed to simplify the land registration application process through a digital platform.

## About the Project

The Land Registration Portal allows applicants to submit land registration applications online, upload supporting documents, complete a demonstration payment process, and track application status. Officers can review applications, view submitted documents, and approve or reject applications.

This project was developed using React, Java Spring Boot, and MySQL.

## Features

- Online land registration application
- Applicant and land details submission
- Sale deed and identity document uploads
- Demonstration payment workflow
- Automatic Application ID generation
- Application status tracking
- Officer login and dashboard
- Document review
- Application approval and registration
- Application rejection with a reason
- Registered and rejected status tracking

## Technology Stack

### Frontend
- React
- Vite
- JavaScript (JSX)
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database
- MySQL

## Project Structure

```text
Land-Registration-Portal/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
└── README.md
```

## Requirements

Install the following software before running the project:

- Node.js and npm
- Java Development Kit (JDK 21)
- MySQL Server
- Git

## Running the Project Locally

### 1. Configure MySQL

Create the database:

```sql
CREATE DATABASE land_registration_db;
```

Configure the database connection and credentials in your local Spring Boot `application.properties` file. Do not publish real passwords or private credentials to GitHub.

### 2. Start the Backend

Open a terminal in the `backend` folder and run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 3. Start the Frontend

Open another terminal in the `frontend` folder and run:

```powershell
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Application Workflow

1. Applicant enters land and personal details.
2. Applicant uploads the required documents.
3. Applicant completes the demonstration payment step.
4. The system generates an Application ID.
5. The applicant tracks the application status.
6. An officer reviews the application and documents.
7. The officer approves and registers or rejects the application with a reason.

## Important Notes

- The payment workflow is a demonstration and does not process real payments.
- Database credentials must be configured locally.
- This is an academic project and should not be treated as an official government registration service.
- Production deployment would require appropriate authentication, authorization, security, and data protection measures.

## Author

Developed as an academic project using React, Spring Boot, and MySQL.

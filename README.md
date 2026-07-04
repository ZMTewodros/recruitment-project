# Recruitment Platform

A full-stack Recruitment Platform that connects job seekers and employers through a modern, secure, and scalable web application. The platform simplifies the hiring process by allowing employers to post jobs, manage applications, and monitor recruitment activities, while enabling job seekers to create professional profiles, search for jobs, and apply online.

---

## Features

### Authentication
- User Registration
- Email Verification
- Secure Login & Logout
- Forgot Password
- Reset Password
- JWT Authentication
- Role-Based Access Control (Admin, Employer, Job Seeker)

---

### Job Seeker Features
- Create and update profile
- Upload profile picture
- Upload CV/Resume
- Manage skills, education, and experience
- Browse available jobs
- Search jobs by:
  - Title
  - Category
  - Company
  - Location
  - Salary Range
- Apply for jobs
- Track application status

---

### Employer Features
- Employer Dashboard
- Create and manage company profile
- Post new jobs
- Edit and delete job postings
- View all posted jobs
- View applicants for each job
- Manage recruitment process

---

### Admin Features
- Admin Dashboard
- Manage users
- Manage employers
- Manage companies
- Manage job listings
- Monitor applications
- System administration

---

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Bootstrap

### Backend
- NestJS
- TypeScript
- TypeORM
- RESTful API
- JWT Authentication
- Passport.js
- Nodemailer
- Multer

### Database
- PostgreSQL

### Tools
- Git
- GitHub
- Postman
- Visual Studio Code

---

## Database Tables

### Users
- id
- name
- email
- password
- role
- phone
- address
- bio
- skills
- experience
- education
- cv
- avatar
- isEmailVerified

### Roles
- id
- name

### Companies
- id
- name
- description
- logo
- website
- ownerId

### Jobs
- id
- title
- description
- category
- location
- salary
- deadline
- status
- companyId

### Applications
- id
- userId
- jobId
- coverLetter
- status
- appliedAt

---

## Project Structure

```
src
│
├── auth
├── users
├── profile
├── jobs
├── companies
├── applications
├── roles
├── common
│
├── app.module.ts
└── main.ts
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/ZMTewodros/recruitment-project.git
```

Navigate to the project

```bash
cd recruitment-project
```

Install dependencies

```bash
npm install
```

---

## Running the Project

Development

```bash
npm run start:dev
```

Production

```bash
npm run build
npm run start:prod
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/verify-email` |
| POST | `/api/auth/login` |
| POST | `/api/auth/forgot-password` |
| POST | `/api/auth/reset-password` |

---

### Profile

| Method | Endpoint |
|---------|----------|
| GET | `/api/profile/me` |
| PUT | `/api/profile/me` |
| POST | `/api/profile/upload/avatar` |
| POST | `/api/profile/upload/cv` |

---

### Jobs

| Method | Endpoint |
|---------|----------|
| POST | `/api/jobs` |
| GET | `/api/jobs` |
| GET | `/api/jobs?title=Developer` |
| GET | `/api/jobs?category=IT` |
| GET | `/api/jobs?location=Addis` |
| GET | `/api/jobs?company=ABC` |
| GET | `/api/jobs?minSalary=10000&maxSalary=30000` |

---

### Companies

| Method | Endpoint |
|---------|----------|
| POST | `/api/companies` |
| GET | `/api/companies` |

---

### Applications

| Method | Endpoint |
|---------|----------|
| POST | `/api/applications` |
| GET | `/api/applications` |
| PUT | `/api/applications/:id/status` |

---

## Security

- JWT Authentication
- Password Hashing using bcrypt
- Email Verification
- Password Reset via Email
- Request Validation
- Role-Based Authorization
- Secure File Uploads

---

## Future Improvements

- Real-time notifications
- Interview scheduling
- Saved jobs
- Company analytics
- Email notifications for applications
- Docker deployment
- CI/CD pipeline
- Cloud storage integration (AWS S3 / Google Cloud Storage)

---

## Author

**Tewodros Melkamu**

- GitHub: https://github.com/ZMTewodros
- LinkedIn: https://www.linkedin.com/in/tewodros-melkamu-32987436b

---

## License

This project is licensed under the MIT License.

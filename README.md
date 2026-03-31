# Authentication System

This project is an implementation of an advanced authentication system using Node.js, Express, and MongoDB. It includes features like user registration, login, email verification with OTP, and session management.

## Features

*   **User Registration:** New users can create an account.
*   **User Login:** Registered users can log in to their accounts.
*   **Email Verification:** Users need to verify their email address using an OTP (One-Time Password) sent to them.
*   **Secure Password Storage:** User passwords are encrypted before being saved to the database.
*   **Session Management:** User sessions are created and managed upon successful login.
*   **Protected Routes:** Certain routes are protected and can only be accessed by authenticated users.

## Tech Stack

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web framework for Node.js.
*   **MongoDB:** NoSQL database for storing user data.
*   **Mongoose:** ODM library for MongoDB and Node.js.
*   **JSON Web Tokens (JWT):** For creating secure access tokens.
*   **Nodemailer:** For sending emails (e.g., OTP for verification)
*   **bcrypt:** For hashing passwords.

## Project Structure

```
.
├── src
│   ├── config
│   │   ├── config.js           # Environment variables
│   │   └── database.js         # Database connection
│   ├── controllers
│   │   └── auth.controller.js  # Authentication logic
│   ├── models
│   │   ├── otp.model.js        # OTP schema
│   │   ├── session.model.js    # Session schema
│   │   └── user.model.js       # User schema
│   ├── routes
│   │   └── auth.routes.js      # Authentication API routes
│   ├── services
│   │   └── email.service.js    # Email sending service
│   └── utils
│       └── util.js             # Utility functions
├── .env                        # Environment variables file
├── server.js                   # Main server file
└── package.json
```

## Getting Started

### Prerequisites

*   Node.js installed
*   MongoDB installed and running

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/your-db-name
    EMAIL_HOST=your-email-host
    EMAIL_PORT=your-email-port
    EMAIL_USER=your-email-user
    EMAIL_PASS=your-email-password
    JWT_SECRET=your-jwt-secret
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```

The server will start on `http://localhost:3000`.

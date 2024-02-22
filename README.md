# -road-construction-Expense-Monitoring-System

### Project Dependencies

1. **bcryptjs (v2.4.3):**

   - Library for hashing and salting passwords.
   - Used for securely storing user passwords in the database.

2. **cookie-parser (v1.4.6):**

   - Middleware for parsing cookies in Express.js.
   - Used for handling cookies and extracting information from them.

3. **dotenv (v16.3.1):**

   - Zero-dependency module to load environment variables from a `.env` file.
   - Used for managing environment variables, such as database connection strings or API keys.

4. **express (v4.18.2):**

   - Web application framework for Node.js.
   - Core framework for building the web server and handling HTTP requests and responses.

5. **jsonwebtoken (v9.0.2):**

   - Library for creating and verifying JSON Web Tokens (JWT).
   - Used for secure communication between the server and clients, often for user authentication.

6. **mongoose (v8.0.2):**

   - MongoDB object modeling tool designed for Node.js.
   - Used for interacting with MongoDB databases, defining schemas, and performing database operations.

7. **nodemon (v3.0.2):**
   - Utility that monitors for changes in the Node.js application and automatically restarts the server.
   - Used during development to streamline the development process by auto-restarting the server on file changes.

### Installation

To install project dependencies, run the following command:

```bash
npm install
```

This command installs all the dependencies listed in the `package.json` file.

### Running the Application

To start the application in development mode with automatic restarts (using `nodemon`), run:

```bash
npm run dev
```

This script is configured in the `package.json` file to use `nodemon` for development.

Feel free to customize and expand this section based on the specific features and usage details of each dependency in your project.

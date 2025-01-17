# express-api-ts-boilerplate

Welcome to `express-api-ts-boilerplate` – a developer-friendly boilerplate that equips you with essential tools and a clear structure to build robust, scalable RESTful APIs using Express.js and TypeScript.

## 🚀 Why Choose This Boilerplate?

- **Ready-to-use Architecture**: Begin your project with a thoughtfully organized structure.
- **Secure by Design**: Strengthen your API with built-in middleware such as Helmet and CORS.
- **Database Integration**: Use SQLite3 with TypeORM or easily swap it out for MySQL, PostgreSQL, or MongoDB as needed.
- **Validation Made Easy**: Utilize `class-validator` and `class-transformer` for streamlined data validation.
- **API Documentation**: Effortlessly generate comprehensive API documentation using `swagger-jsdoc`.
- **Enhanced Password Security**: Securely hash passwords with `bcrypt`.
- **Type Safety**: Harness the power of TypeScript to catch errors early and improve code quality.
- **Customizable**: Swap and customize packages as needed to suit your project requirements.

## 🛠 Getting Started

### Without Docker

1. **Clone the repository**:
    ```shell
    git clone https://github.com/svijaykoushik/express-api-ts-boilerplate.git
    cd express-api-ts-boilerplate
    ```

2. **Install dependencies**:
    ```shell
    npm install
    ```

3. **Configure the application**:
    - Create a `.env` file in the root directory for environment variables. Refer to the provided `.env.example` file.

4. **Run the application**:
    ```shell
    npm start
    ```

    Your server will start on the port specified in the configuration, typically `http://localhost:5050/`.

### With Docker

1. **Clone the repository**:
   ```shell
    git clone https://github.com/svijaykoushik/express-api-ts-boilerplate.git
    cd express-api-ts-boilerplate
   ```

2. **Create a .env file**:
    ```shell
    cp .env.example .env
    ```

3. **Run the application with Docker**:

    - For development:
        ```shell
        docker compose up --watch
        ```

    - Run the application:
        ```shell
        docker compose up --build
        ```

For more information on using docker please check this [guide](README.Docker.md)

## 🏗 Project Structure

Explore the organized file structure designed to streamline your development workflow:

- `src/`: Main source code directory.
    - `app/`: Application logic
        - `routes/`: API route definitions.
        - `controllers/`: Functions for handling requests and responses.
        - `dtos/`: Data transfer objects to validate and structure requests.
        - `error/`: Custom error handling.
        - `models/`: Database schema and ORM models.
        - `middleware/`: Middleware for handling requests.
        - `services/`: Business logic and reusable functions.
        - `config/`: Configuration files for database, security, and environment variables.
        - `scripts/`: Standalone scripts and jobs.

## 📦 Key Packages

- **Helmet**: Secures the API with additional HTTP headers. [Learn More](https://helmetjs.github.io/)
- **CORS**: Configures cross-origin resource sharing. [Learn More](https://github.com/expressjs/cors)
- **TypeORM**: ORM for various databases. [Learn More](https://typeorm.io/)
- **SQLite3**: Non-blocking SQLite3 bindings for Node.js. [Learn More](https://github.com/TryGhost/node-sqlite3)
- **class-validator**: Simplifies data validation with decorators. [Learn More](https://github.com/typestack/class-validator)
- **class-transformer**: Transforms plain objects into class instances. [Learn More](https://github.com/typestack/class-transformer)
- **swagger-jsdoc**: Generates OpenAPI (Swagger) specs from source code. [Learn More](https://github.com/Surnet/swagger-jsdoc)
- **bcrypt**: Securely hashes passwords for enhanced security. [Learn More](https://github.com/kelektiv/node.bcrypt.js)
- **dotenv**: Manages environment variables effortlessly. [Learn More](https://github.com/motdotla/dotenv)

## 🧪 Development Tools

- **Mocha**: Powerful testing framework. [Learn More](https://mochajs.org/)
- **Chai**: Assertion library for comprehensive testing. Includes **chai-as-promised** for handling and asserting promises. [Learn More](https://www.chaijs.com/)
- **Sinon**: For mocking and stubbing in test suites. [Learn More](https://sinonjs.org/)
- **TypeScript Execute (tsx)**: Run TypeScript code directly without compilation. [Learn More](https://tsx.is)
- **Nodemon**: Automatically restarts the server on file changes to streamline development. [Learn More](https://nodemon.io/)
- **Docker**: Build and test applications in a production-like environment. [Learn More](https://www.docker.com)

## 🔑 Authentication and Authorization

This boilerplate includes built-in authentication support compliant with OAuth 2.0 standards. The supported flows are:

1. **Resource Owner Password Grant**: Sign in using a username and password.
2. **Refresh Token Grant**: Refresh access tokens for continued access without re-authentication.

Additionally, the following endpoints are provided:

- **Registration**: Create a new user account.
- **Logout**: End the user session.
- **Userinfo**: Retrieve information about the authenticated user.

## 🤝 Join Us

We welcome contributions and collaborations! Here's how you can get involved:

- **Contribute**: Submit pull requests for new features, bug fixes, or enhancements.
- **Report Issues**: Let us know if you encounter any issues, and we'll work together to find solutions.
- **Feedback**: Share your thoughts and suggestions to help us improve the project.

Let’s build amazing APIs together! Feel free to star the repo and watch for future updates.
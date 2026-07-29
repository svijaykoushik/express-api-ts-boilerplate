# express-api-ts-boilerplate

Welcome to `express-api-ts-boilerplate` – a developer-friendly boilerplate that equips you with essential tools and a clear structure to build robust, scalable RESTful APIs using Express.js and TypeScript.

## 🚀 Why Choose This Boilerplate?

- **Ready-to-use Architecture**: Begin your project with a thoughtfully organized structure.
- **Secure by Design**: Strengthen your API with built-in middleware such as Helmet and CORS.
- **Database Integration**: Use SQLite3 with TypeORM by default, or switch to MySQL/PostgreSQL via the `DB_TYPE` environment variable, with connection pooling configured out of the box.
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
    - By default the app uses SQLite (`DB_TYPE=sqlite`). To use MySQL or PostgreSQL instead, set `DB_TYPE` to `mysql` or `postgres` and configure `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `TYPEORM_DATABASE`. Connection pool size can be tuned with `DB_POOL_MAX` (defaults to 10).

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
        - `services/`: Business logic and reusable functions, including a `queue/` module for background job processing.
        - `helpers/`: Shared utilities, including a `transaction.ts` helper for running work inside a database transaction.
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

This boilerplate ships a **first-party-only** authentication model built on OAuth 2.0 token semantics (token endpoint shape, scopes, bearer tokens). It intentionally does **not** implement the parts of OAuth 2.0 that exist to protect users from *third-party* apps — there is no client registry, `/authorize` endpoint, consent screen, or PKCE support.

This is a deliberate scoping decision, not a missing feature: this boilerplate is meant for setups where the web UI and this API are operated by the same party (e.g. `app.example.com` talking to `api.app.example.com`), so there's never a third party handling user credentials or consuming tokens on a user's behalf. Redirect-based Authorization Code / consent-screen flows add real complexity (client registration, an `/authorize` UI, redirect_uri validation, consent screens) for no benefit in that scenario, and go against this project's minimal, no-bloat goal.

If you do need to support third-party client apps later, this is additive on top of the existing token endpoint/scope model rather than a rewrite — you'd add a client registry, an `/authorize` endpoint with login + consent, and PKCE support.

The supported flows are:

1. **Resource Owner Password Grant**: Sign in using a username and password.
2. **Refresh Token Grant**: Refresh access tokens for continued access without re-authentication.

Additionally, the following endpoints are provided:

- **Registration**: Create a new user account.
- **Logout**: End the user session (token revocation implementation tracked in [#75](https://github.com/svijaykoushik/express-api-ts-boilerplate/issues/75)).
- **Userinfo**: Retrieve information about the authenticated user.

## 🔄 Transactions and Background Jobs

- **Transaction Helper**: `src/app/helpers/transaction.ts` exposes `runInTransaction`, which wraps a callback in a TypeORM `QueryRunner` transaction — committing on success and rolling back automatically on error.
- **Background Job Queue**: `src/app/services/queue/` provides an `IQueueService` interface and an in-memory implementation (`InMemoryQueueService`) built on Node's `EventEmitter`, letting you `add()` jobs and register `process()` handlers that run off the request/response cycle. It's a drop-in interface, so it can be swapped for a real queue (e.g. BullMQ, SQS) without changing calling code.
- **Demo**: `POST /sample/action` shows both together — it creates a record inside a transaction and queues a background "welcome email" job, returning `202 Accepted` immediately.

## 🤝 Join Us

We welcome contributions and collaborations! Here's how you can get involved:

- **Contribute**: Submit pull requests for new features, bug fixes, or enhancements.
- **Report Issues**: Let us know if you encounter any issues, and we'll work together to find solutions.
- **Feedback**: Share your thoughts and suggestions to help us improve the project.

Let’s build amazing APIs together! Feel free to star the repo and watch for future updates.
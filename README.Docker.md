# Docker Support

We're excited to announce the addition of Docker support to our boilerplate! This feature enables you to containerize your application, making it easier to develop, test, and deploy.

## Instructions

To get started with Docker, follow these steps:

1. Copy the example environment file:
   ```shell
   cp .env.example .env
   ```
2. Start the application in development mode:
    ```shell
    docker compose up --watch
    ```

    This command will start the application in development mode, watching for changes to the code.

3. Build and start the application:
    ```shell
    docker compose up --build
    ```

    This command will build the Docker image and start the application.
    Your application will be available at http://localhost:5050.

## Benefits of Docker Support

With Docker support, you can:

- Simplify development: Docker provides a consistent and reliable development environment, eliminating the need to worry about compatibility issues.
- Improve testing: Docker enables you to test your application in a production-like environment, ensuring that it works as expected.
- Streamline deployment: Docker makes it easy to deploy your application to any environment, whether it's a local server or a cloud platform.

## Deploying Your Application to the Cloud

First, build your image, e.g.:
```shell
docker build -t myapp .
```

If your cloud uses a different CPU architecture than your development machine (e.g., you are on a Mac M1 and your cloud provider is amd64), you'll want to build the image for that platform, e.g.:

```shell
docker build --platform=linux/amd64 -t myapp .
```

Then, push it to your registry, e.g.:

```
docker push myregistry.com/myapp
```

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

## What's Next?

Now that you've got Docker support up and running, you can focus on developing your application. Remember to explore the other features of our boilerplate, including:

- API Documentation: Generate comprehensive API documentation using Swagger.
- Database Integration: Use TypeORM to interact with your database.
- Security: Take advantage of built-in security features, such as Helmet and CORS.

Happy coding!

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
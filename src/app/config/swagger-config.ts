import { SwaggerDefinition } from 'swagger-jsdoc';

export const apiDefintion: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API DOCUMENTATION',
        version: '1.0.0',
        description: 'CANAM API',
        termsOfService: '',
    },
    host: `localhost:3000`,
    basePath: '/',
    schemes: ['http', 'https'],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

import { OAS3Definition } from 'swagger-jsdoc';
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../../../.env') });

export const apiDefintion: OAS3Definition = {
    openapi: '3.0.0',
    info: {
        title: 'API DOCUMENTATION',
        version: '1.0.0',
        description: 'Project X API',
        termsOfService: ''
    },
    servers: [
        {
            url: `http://${process.env.SWAGGER_DOMAIN}:${process.env.SWAGGER_PORT}`
        }
    ],
    components: {
        securitySchemes: {
            oAuth: {
                type: 'oauth2',
                flows: {
                    password: {
                        tokenUrl: '/auth/token',
                        scopes: {
                            read: 'Grant read only access to all resources',
                            write: 'Grant write only access to all resources',
                            profile: 'Grant read only access to userinfo'
                        }
                    }
                }
            }
        }
    }
};

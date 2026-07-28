import { expect } from 'chai';
import { resolve } from 'path';

describe('Database Configuration Factory', function () {
    const configPath = resolve(__dirname, './db-options');

    beforeEach(() => {
        // Clear require cache for dynamic loading testing
        delete require.cache[require.resolve(configPath)];
    });

    afterEach(() => {
        delete require.cache[require.resolve(configPath)];
        delete process.env.DB_TYPE;
        delete process.env.DB_HOST;
        delete process.env.DB_PORT;
        delete process.env.DB_USERNAME;
        delete process.env.DB_PASSWORD;
        delete process.env.TYPEORM_DATABASE;
    });

    it('should default to sqlite configuration when DB_TYPE is undefined', function () {
        process.env.TYPEORM_DATABASE = 'test_sqlite.db';
        
        const { getDatabaseConfig } = require(configPath);
        const options = getDatabaseConfig();
        
        expect(options.type).to.equal('sqlite');
        expect(options.database).to.equal('test_sqlite.db');
    });

    it('should configure postgres connection details when DB_TYPE is postgres', function () {
        process.env.DB_TYPE = 'postgres';
        process.env.DB_HOST = 'localhost';
        process.env.DB_PORT = '5432';
        process.env.DB_USERNAME = 'postgres_user';
        process.env.DB_PASSWORD = 'postgres_password';
        process.env.TYPEORM_DATABASE = 'postgres_db';

        const { getDatabaseConfig } = require(configPath);
        const options = getDatabaseConfig();

        expect(options.type).to.equal('postgres');
        expect(options.host).to.equal('localhost');
        expect(options.port).to.equal(5432);
        expect(options.username).to.equal('postgres_user');
        expect(options.password).to.equal('postgres_password');
        expect(options.database).to.equal('postgres_db');
        expect(options.extra).to.have.property('max', 10);
    });
});

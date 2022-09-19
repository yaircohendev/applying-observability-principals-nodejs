import {Pool} from 'pg';
import Knex from 'knex';

const config = {
    password: process.env.POSTGRES_USER || 'changeme',
    user: process.env.POSTGRES_USER || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    host: process.env.POSTGRES_HOST || 'host.docker.internal',
    port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT, 10)
        : 5432,
};

export const knex = Knex({
    client: 'pg',
    connection: {
        host : config.host,
        port : config.port,
        user : config.user,
        password : config.password,
        database : config.database
    }
});


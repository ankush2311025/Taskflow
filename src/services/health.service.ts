import {checkDatabaseConnection} from '../repositories/health.repository.js';

export async function getDatabaseHealth(){
    await checkDatabaseConnection()

    return {
        database: "connected"
    }
}
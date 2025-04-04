import path from 'path';

export const dbConfig = {
    dbPath: path.join(__dirname, '../db/database.sqlite'),
    dbOptions: {
        verbose: console.log
    }
}
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import Database from 'better-sqlite3';
import { dbConfig } from '../config/database';
import { DatabaseInterface, User } from '../types';
import fs from 'fs';
import path from 'path';

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  try {
    const dbDir = path.dirname(dbConfig.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new Database(dbConfig.dbPath, dbConfig.dbOptions);

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const databaseInterface: DatabaseInterface = {
      findAllUsers: () => {
        return db.prepare('SELECT id, name, email, password, created_at as createdAt FROM users').all() as User[];
      },

      findUserById: (id: number) => {
        return db.prepare('SELECT id, name, email, created_at as createdAt FROM users WHERE id = ?').get(id) as User | undefined;
      },

      findUserByEmail: (email: string) => {
        return db.prepare('SELECT id, name, email, created_at as createdAt FROM users WHERE email = ?').get(email) as User | undefined;
      },

      createUser: (user) => {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(user.name, user.email, user.password);
        return {
          id: info.lastInsertRowid as number,
          ...user,
          createdAt: new Date().toISOString()
        };
      },

      updateUser: (id: number, user) => {
        const existingUser = databaseInterface.findUserById(id);
        if (!existingUser) return false;

        const { name, email } = { ...existingUser, ...user };
        const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
        const info = stmt.run(name, email, id);
        return info.changes > 0;
      },

      deleteUser: (id: number) => {
        const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return info.changes > 0;
      }
    };

    fastify.decorate('db', databaseInterface);

    fastify.addHook('onClose', (instance, done) => {
      if (db) {
        db.close();
      }
      done();
    });
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

export default fp(dbPlugin);
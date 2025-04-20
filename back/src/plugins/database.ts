import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import Database from 'better-sqlite3';
import { dbConfig } from '../config/database';
import { DatabaseInterface, User, Otp } from '../types';
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
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        mail_verified NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS otp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        otp TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const databaseInterface: DatabaseInterface = {
      findAllUsers: () => {
        return db.prepare('SELECT id, firstname, lastname, username, email, mail_verified, password, created_at as createdAt FROM users').all() as User[];
      },

      findUserById: (id: number) => {
        return db.prepare('SELECT id, firstname, lastname, username, email, mail_verified, created_at as createdAt FROM users WHERE id = ?').get(id) as User | undefined;
      },

      findUserByEmail: (email: string) => {
        return db.prepare('SELECT id, firstname, lastname, username, email, mail_verified, created_at as createdAt FROM users WHERE email = ?').get(email) as User | undefined;
      },

      createUser: (user) => {
        const stmt = db.prepare('INSERT INTO users (firstname, lastname, username, email, mail_verified, password) VALUES (?, ?, ?, ?, 0 ,?)');
        const info = stmt.run(user.firstname, user.lastname, user.username, user.email, user.password);
        return {
          id: info.lastInsertRowid as number,
          ...user,
          createdAt: new Date().toISOString()
        };
      },

      updateUser: (id: number, user) => {
        const existingUser = databaseInterface.findUserById(id);
        if (!existingUser) return false;

        const { username, email } = { ...existingUser, ...user };
        const stmt = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
        const info = stmt.run(username, email, id);
        return info.changes > 0;
      },

      deleteUser: (id: number) => {
        const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return info.changes > 0;
      },

      findEmailOtp: (email: string) => {
        return db.prepare('SELECT id, email, otp, created_at as createdAt FROM otp WHERE otp = ? order by createdAt DESC').get(email) as Otp | undefined;
      },

      findOtp: (otp: string) => {
        return db.prepare('SELECT id, email, otp, created_at as createdAt FROM otp WHERE otp = ?').get(otp) as Otp | undefined;
      },

      createOtp: (otp) => {
        const stmt = db.prepare('INSERT INTO otp (email, otp) VALUES (?, ?)');
        const info = stmt.run(otp.email, otp.otp);
        return {
          id: info.lastInsertRowid as number,
          ...otp,
          createdAt: new Date().toISOString()
        };
      },
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
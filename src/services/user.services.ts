import { Console } from 'console';
import client from '../config/db';
import { User } from '../models/users.model';
import bcrypt from 'bcrypt';
import { query } from 'express';
export class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM usersinfo';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`获取用户列表失败:  ${err}`);
    }
  }
  async getUser(id: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM usersinfo WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`获取失败, ${err}`);
    }
  }

  async getUserByName(name: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM usersinfo WHERE name=($1)';
      const result = await conn.query(sql, [name]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`获取失败, ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO usersinfo (name, address, description,password) VALUES($1, $2, $3,$4) RETURNING *;';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        user.name,
        user.address,
        user.description,
        user.password
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error(`创建失败 Error: ${err}`);
    }
  }

  async update(id: string, user: User): Promise<User> {
    try {
      const sql =
        'UPDATE usersinfo SET name= ($1), address= ($2), description=($3) WHERE id = ($4);';
      const conn = await client.connect();
      await conn.query(sql, [user.name, user.address, user.description, id]);
      const querySql = 'SELECT * FROM usersinfo WHERE id=($1)';
      const queryResult = await conn.query(querySql, [id]);
      conn.release();
      return queryResult.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error(`更新失败 id=${id} and name ${user.name}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const sql = 'DELETE FROM usersinfo WHERE id=($1);';
      const conn = await client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`删除失败 id = ${id}`);
    }
  }
}

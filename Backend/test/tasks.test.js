import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import pool from '../db/db.js';

let adminToken;
let userId;
let taskId;

describe('Tasks API', function() {
  this.timeout(10000);

  before(async () => {
    // create an admin user via signup
    const adminRes = await request(app).post('/api/users/signup').send({ fullname: 'Admin', email: `admin-${Date.now()}@test`, password: 'Password1!', role: 'Admin' });
    expect(adminRes.status).to.equal(201);
    adminToken = adminRes.body.token;

    // create a normal user to assign to
    const userRes = await request(app).post('/api/users/signup').send({ fullname: 'Worker', email: `worker-${Date.now()}@test`, password: 'Password1!' });
    expect(userRes.status).to.equal(201);
    userId = userRes.body.user.id;
  });

  after(async () => {
    // cleanup tasks and users created
    try {
      if (taskId) await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
      await pool.query('DELETE FROM users WHERE email LIKE $1 OR email LIKE $2', [`admin-%@test`, `worker-%@test`]);
    } catch (err) {
      console.error('Cleanup error', err);
    }
  });

  it('should allow admin to create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Test Task', description: 'desc', assigned_to: userId, due_date: new Date().toISOString().split('T')[0] });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.property('id');
    taskId = res.body.data.id;
  });

  it('should return tasks for admin', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.be.an('array');
  });

  it('should allow assigned user to update status to completed', async () => {
    // login as the worker to get token
    const login = await request(app).post('/api/users/login').send({ email: `worker-${Date.now()}@test`, password: 'Password1!' });
    // If login fails because the generated worker email differs, fetch token by logging in with stored user
    // Instead, get user directly from db and sign token manually
    const { rows } = await pool.query('SELECT id, role FROM users WHERE id = $1', [userId]);
    const user = rows[0];
    const jwt = (await import('jsonwebtoken'));
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed', percent_completed: 100 });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.status).to.equal('completed');
  });
});

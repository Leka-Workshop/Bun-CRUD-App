import { describe, expect, it, afterAll } from 'bun:test';
import { app } from '../src/index';

const baseUrl = `${app.server?.hostname}:${app.server?.port}/api/users`; // localhost:3000/api/users

describe('USERS Test suite', () => {

  describe('GET Users suite', () => {

    it('should return a list of users successfully', async () => {
      const req = new Request(baseUrl);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);
    });

    it('should return a user successfully using existing id', async () => {

      const expected = {
        username: 'Jack31',
        email: 'jack31g@doe.com'
      };

      const userId = '64e87ae42400ef4b2cd1ae95';

      const req = new Request(`${baseUrl}/${userId}`);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();

      expect(responseBody.username).toEqual(expected.username);
      expect(responseBody.email).toEqual(expected.email);
    });

    it('should not return a user password', async () => {

      const userId = '64e87ae42400ef4b2cd1ae95';

      const req = new Request(`${baseUrl}/${userId}`);
      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();
      expect(responseBody.password).toEqual(undefined);
    });

    it('should fail to return a user that does not exist', async () => {

      const userId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${userId}`);
      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  describe('CREATE Users suite', () => {

    it('should create a new user successfully', async () => {

      const newUser = {
        username: 'BruceWayne',
        email: 'bruce.wayne@gotham.com',
        password: 'batm4n'
      }

      const expected = {
        username: 'BruceWayne',
        email: 'bruce.wayne@gotham.com'
      }

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(201);

      const responseBody = await res.json();
      expect(responseBody.username).toEqual(expected.username);
      expect(responseBody.email).toEqual(expected.email);
    });

    it('should fail to create a user that already exists', async () => {

      const existingUser = {
        username: 'Jack31',
        email: 'jack31g@doe.com',
        password: 'test123'
      }

      const expected = {
        message: 'Resource already exists!'
      };

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(existingUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(422);

      const responseBody = await res.json();
      expect(responseBody.message).toEqual(expected.message);
    });

    it('should fail to create a user when mandatory fields are not provided', async () => {

      const newUser = {
        username: 'JamesBond'
      }

      const expected =  {
        message: 'Unable to process the data!',
        status: 400,
      };

      const req = new Request(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(expected.status);

      const responseBody = await res.json();
      expect(responseBody.message).toEqual(expected.message);
    });

  });

  describe('PATCH Users suite', () => {

    it('should update a user successfully', async () => {

      const originalUser = {
        username: 'Batman',
      }

      const updatedUser = {
        username: 'DarkKnight',
      }

      const userId = '6469eeacf5b9a7f1b1608de7';

      const req = new Request(`${baseUrl}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(200);

      const responseBody = await res.json();
      expect(responseBody.username).not.toEqual(originalUser.username);
      expect(responseBody.username).toEqual(updatedUser.username);
    });

    it('should fail to update a user that does not exist', async () => {

      const updatedUser = {
        username: 'DarkKnight',
      }

      const userId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  describe('DELETE Users suite', () => {

    it('should delete a user successfully', async () => {

      const userId = '6505d25d2ffbf55d5b958c45';

      const req = new Request(`${baseUrl}/${userId}`, {
        method: 'DELETE',
      });

      const res = await app.fetch(req);
      expect(res.status).toEqual(200);
    });

    it('should fail to delete a user that does not exist', async () => {

      const userId = 'FAKE-ID-FAKE-ID-FAKE-ID-';

      const req = new Request(`${baseUrl}/${userId}`, {
        method: 'DELETE'
      });

      const res = await app.fetch(req);
      expect(res.status).not.toEqual(200);
    });

  });

  // In case Bun does not automatically terminate the test runner after all tests run
  afterAll(() => {
    process.exit(0);
  })

});

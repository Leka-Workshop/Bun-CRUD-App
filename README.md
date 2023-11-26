# Bun CRUD API with Elysia.js & MongoDB
Learn how to set up a starter Bun Rest API app from scratch that uses:

* Database
* Controllers
* Hooks (Error Handling & Logging)
* Guards
* Security (CORS, JWT, Helmet, Rate Limiter)
* Tests
#
### [>>> Read Full Blog <<<](https://mirzaleka.medium.com/bun-crud-api-with-elysia-js-mongodb-10e73d484723)
#

## Project Structure

```js
📁 src
|__ 📁 controllers
|   ├── static-data.controller.ts
|   |__ users.controller.ts
|__ 📁 database
|   |__ db.setup.ts
|__ 📁 entities
|   |__ user.schema.ts
|__ 📁 startup
|   ├── docs.ts
|   ├── hooks.ts
|   |__ security.ts
📁 test
    |__ users.test.ts
.env
package.json
```

## Get Started

* Clone repository
* Install dependencies `bun i`
* Create `.env` file
* Paste database connections
* Have fun!

### Scripts

Development

```bash
> bun dev
```

Test
```bash
> bun test
```

Production
```bash
> bun start
```
#

### Built with:
* Bun: v1.0
* Elysia: v0.6

tshamugia: how to setup connection to postgres db using prisma

GitHub Copilot: I'll help you set up Prisma with PostgreSQL. Here are the steps:

1. First, install the required dependencies:

```bash
npm install @prisma/client prisma
```

2. Initialize Prisma in your project:

```bash
npx prisma init
```

3. Create the Prisma schema file:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Example models
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

4. Update your .env file with the PostgreSQL connection URL:

```plaintext
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

5. Create a Prisma client utility file:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

6. Update your app.js to include the Prisma client:

```javascript
const express = require('express');
const path = require('path');
const prisma = require('./utils/prisma');
require('dotenv').config();

// ...existing code...

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });

// ...existing code...
```

7. After setting up your schema, run the following commands to create and apply migrations:

```bash
npx prisma migrate dev --name init
```

Remember to:

- Replace the `DATABASE_URL` placeholder values with your actual PostgreSQL credentials
- Never commit the .env file containing sensitive credentials to version control
- Add node_modules and .env to your `.gitignore` file

Now you can use the Prisma client in your routes to interact with the database. For example:

```javascript
// Example route usage
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
```

Similar code found with 1 license type

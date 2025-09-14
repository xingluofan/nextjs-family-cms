// Define database connection via the `DATABASE_URL` env var
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

// Define custom output path for generated Prisma Client
generator client {
provider = "prisma-client-js"
output = "/app/generated/prisma-client"
}

// Example data model
model User {
id Int @id @default(autoincrement())
createdAt DateTime @default(now())
email String @unique
name String?
}

# Run in terminal to generate Prisma Client

# into the output path: `app/generated-prisma-client`

npx prisma generate --no-engine

import { PrismaClient } from 'app/generated-prisma-client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

const users = await prisma.user.findMany({
where: {
email: { endsWith: "prisma.io" }
},
})

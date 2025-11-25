import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type DbInstance = ReturnType<typeof drizzle<typeof schema>>

let dbInstance: DbInstance | null = null
let clientInstance: ReturnType<typeof postgres> | null = null

function getDb(): DbInstance {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL
    clientInstance = postgres(connectionString, { max: 1 })
    dbInstance = drizzle(clientInstance, { schema })
  }

  return dbInstance
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL
}

// Create a proxy that lazily initializes the database connection
export const db = new Proxy({} as DbInstance, {
  get(_target, prop) {
    const db = getDb()
    const value = db[prop as keyof typeof db]
    if (typeof value === 'function') {
      return value.bind(db)
    }
    return value
  },
})

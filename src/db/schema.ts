import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccountType } from "next-auth/adapters"
import { create } from "domain";
 
export const db = drizzle({ connection: {
  url: process.env.DATABASE_URL!, 
  authToken: process.env.DATABASE_AUTH_TOKEN!
}},);
 
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})
 
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)
 
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})
 
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
)
 
export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ]
)

export const coupleInvitations = sqliteTable(
  "coupleInvitation", 
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    inviterId: text("inviterId").notNull().references(() => users.id, { onDelete: "cascade"}),
    inviteeId: text("inviteeId").notNull().references(() => users.id, { onDelete: "cascade"}),
    status: text("status").notNull(),
  }
)

export const couples = sqliteTable(
  "couple",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userAId: text("userAId").notNull().references(() => users.id, { onDelete: "cascade"}),
    userBId: text("userBId").notNull().references(() => users.id, { onDelete: "cascade"}),
  }
)

export const movies = sqliteTable(
  "movie",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    coupleId: text("coupleId").notNull().references(() => couples.id, { onDelete: "cascade"}),
    title: text("title").notNull(),
  }
)

export const movieReviews = sqliteTable(
  "movieReview",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    movieId: text("movieId").notNull().references(() => movies.id, { onDelete: "cascade"}),
    reviewerId: text("reviewerId").notNull().references(() => users.id, { onDelete: "cascade"}),
    rating: integer("rating").notNull(),
    reviewText: text("reviewText"),
  }
)
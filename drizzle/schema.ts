import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// File Storage — metadata stored in DB, bytes stored in S3
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 512 }).notNull(),
  originalName: varchar("originalName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 1024 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mimeType", { length: 256 }).notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  category: varchar("category", { length: 128 }).default("general").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type FileRecord = typeof files.$inferSelect;
export type InsertFileRecord = typeof files.$inferInsert;

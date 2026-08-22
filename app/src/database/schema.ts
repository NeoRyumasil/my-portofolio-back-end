import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), 
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: text('password').notNull(), 
  createdAt: timestamp('created_at').defaultNow()
});

export const profile = pgTable('profile', {
  id: varchar('id', { length: 255 }).primaryKey(), 
  role: varchar('role', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  tagline: text('tagline').notNull(),
  bio: text('bio').notNull(),
  cvLink: text('cv_link'),
  profileImage: text('profile_image')
});


export const tools = pgTable('tools', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), 
  icon: text('icon').notNull()
});

export const webProjects = pgTable('web_projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  year: varchar('year', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  tech: text('tech').array().notNull(), 
  role: varchar('role', { length: 255 }).notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  url: text('url')
});


export const gameProjects = pgTable('game_projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  year: varchar('year', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  tech: text('tech').array().notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  url: text('url')
});

export const credentials = pgTable('credentials', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  image: text('image').notNull(),
  url: text('url')
});

export const contacts = pgTable('contacts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  platform: varchar('platform', { length: 100 }).notNull(),
  url: text('url').notNull(),
  iconType: varchar('icon_type', { length: 50 }).notNull(), 
  iconValue: text('icon_value').notNull()
});

export const journeys = pgTable('journeys', {
  id: varchar('id', { length: 255 }).primaryKey(),
  year: varchar('year', { length: 100 }).notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull()
});
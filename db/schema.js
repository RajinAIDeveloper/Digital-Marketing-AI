import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'seller']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  companyName: text('company_name').notNull(),
  userId: text('user_id').notNull().unique(), // For login
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  userType: userRoleEnum('user_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Products Table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  image: text('image_url'),
  price: integer('price').notNull(), // Stored in cents
  sellingPrice: integer('selling_price').notNull(), // Stored in cents
  quantity: integer('quantity').notNull(),
  unitCommission: integer('unit_commission').notNull(), // Stored in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// Sales Table
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  quantity: integer('quantity').notNull(),
  totalAmount: integer('total_amount').notNull(), // Stored in cents
  commission: integer('commission').notNull(), // Stored in cents
  commissionPaid: boolean('commission_paid').default(false).notNull(),
  paymentMethod: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  orderNumber: text('order_number').notNull().unique() // Format: DEVM110001
});

// Operation History Table
export const operationHistory = pgTable('operation_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  action: text('action').notNull(), // e.g., 'product_added', 'sale_created', 'commission_paid'
  details: text('details').notNull(), // JSON string with operation details
  createdAt: timestamp('created_at').defaultNow().notNull()
});
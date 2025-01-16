CREATE TYPE "public"."user_role" AS ENUM('admin', 'seller');--> statement-breakpoint
CREATE TABLE "operation_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"price" integer NOT NULL,
	"selling_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_commission" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_address" text NOT NULL,
	"quantity" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"commission" integer NOT NULL,
	"commission_paid" boolean DEFAULT false NOT NULL,
	"payment_method" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"order_number" text NOT NULL,
	CONSTRAINT "sales_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"company_name" text NOT NULL,
	"user_id" text NOT NULL,
	"password" text NOT NULL,
	"user_type" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "operation_history" ADD CONSTRAINT "operation_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
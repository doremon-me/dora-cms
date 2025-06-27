CREATE TYPE "public"."logs_actions" AS ENUM('CREATED', 'UPDATED', 'DELETED', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."types_enum" AS ENUM('ECOMMERCE', 'BLOG', 'LMS', 'EDUCATION', 'RESEARCH');--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar NOT NULL,
	"permissions" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" "logs_actions" DEFAULT 'CREATED' NOT NULL,
	"target_table" varchar(100) NOT NULL,
	"target_id" varchar NOT NULL,
	"field" varchar(100),
	"old_value" jsonb,
	"new_value" jsonb,
	"done_by" uuid,
	"done_at" timestamp with time zone DEFAULT now(),
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text,
	"origin" text,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_done_by_users_id_fk" FOREIGN KEY ("done_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."public_projects_view" AS (  
        SELECT id, 
        name, 
        description, 
        type, 
        origin
        FROM projects 
        WHERE is_deleted = false
    );
CREATE TYPE "public"."project_category" AS ENUM('app', 'logo', 'branding', 'design');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"company" text,
	"category" "project_category" NOT NULL,
	"description" text NOT NULL,
	"skills" text[] NOT NULL,
	"body" text NOT NULL,
	"image_src" text NOT NULL,
	"image_alt" text NOT NULL,
	"image_width" integer NOT NULL,
	"image_height" integer NOT NULL,
	"url" text,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

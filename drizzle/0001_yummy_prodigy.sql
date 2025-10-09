CREATE TABLE "actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"power" double precision NOT NULL,
	"frames" integer NOT NULL,
	"max_usage" integer DEFAULT 1 NOT NULL,
	"weapon_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weapons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "actions_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE no action ON UPDATE no action;
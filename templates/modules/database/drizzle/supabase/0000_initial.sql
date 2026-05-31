CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice" text NOT NULL,
	"preimage" text NOT NULL,
	"paid_at" timestamp with time zone,
	"metadata" jsonb
);

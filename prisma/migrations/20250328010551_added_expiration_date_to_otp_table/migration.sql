/*
  Warnings:

  - Added the required column `expires_at` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_otps" (
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_otps" ("code", "created_at", "email", "user_id") SELECT "code", "created_at", "email", "user_id" FROM "otps";
DROP TABLE "otps";
ALTER TABLE "new_otps" RENAME TO "otps";
CREATE UNIQUE INDEX "otps_user_id_key" ON "otps"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

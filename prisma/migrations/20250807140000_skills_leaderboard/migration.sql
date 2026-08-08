-- Skills Test daily global leaderboard
CREATE TABLE "skills_leaderboard_entries" (
    "id" TEXT NOT NULL,
    "session_date" TEXT NOT NULL,
    "initials" VARCHAR(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "flawless" BOOLEAN NOT NULL DEFAULT false,
    "rounds_won" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_leaderboard_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "skills_leaderboard_entries_session_date_score_idx"
ON "skills_leaderboard_entries"("session_date", "score" DESC);

"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ApiResponse } from "@/types";

type EmailLogItem = {
  id: string;
  type: string;
  subject: string;
  status: string;
  createdAt: string;
};

async function fetchEmails(): Promise<EmailLogItem[]> {
  const response = await fetch("/api/user/emails");
  if (response.status === 401) return [];
  if (!response.ok) throw new Error("Failed to fetch emails");

  const json = (await response.json()) as ApiResponse<EmailLogItem[]>;
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function EmailHistorySection() {
  const { data: emails = [], isLoading, isError } = useQuery({
    queryKey: ["user", "emails"],
    queryFn: fetchEmails,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-5" aria-hidden />
          Email notifications
        </CardTitle>
        <CardDescription>
          Recent emails sent to your account, including deal alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load email history.</p>
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No emails sent yet. Deal alerts run hourly when prices hit your
            target.
          </p>
        ) : (
          <ul className="space-y-2">
            {emails.map((email) => (
              <li
                key={email.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{email.subject}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {email.type.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
                <time
                  dateTime={email.createdAt}
                  className="shrink-0 text-xs text-muted-foreground"
                >
                  {new Date(email.createdAt).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

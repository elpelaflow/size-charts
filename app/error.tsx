"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log to Sentry
		Sentry.captureException(error);
	}, [error]);

	const { t } = useLocale();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
				<AlertTriangle className="h-10 w-10 text-destructive" />
			</div>

			<h1 className="text-2xl font-bold text-foreground mb-2">
				{t("error.title")}
			</h1>

			<p className="text-muted-foreground max-w-md mb-2">
				{t("error.description")}
			</p>

			{error.digest && (
				<p className="text-xs text-muted-foreground/60 mb-6 font-mono">
					{t("error.errorId").replace("{digest}", error.digest)}
				</p>
			)}

			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="outline" onClick={reset}>
					<RefreshCw className="h-4 w-4" />
					{t("error.tryAgain")}
				</Button>
				<Button asChild>
					<Link href="/">
						<Home className="h-4 w-4" />
						{t("common.home")}
					</Link>
				</Button>
			</div>
		</div>
	);
}

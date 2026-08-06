"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

export default function NotFound() {
	const router = useRouter();
	const { t } = useLocale();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
				<FileQuestion className="h-10 w-10 text-muted-foreground" />
			</div>

			<h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
			<h2 className="text-xl font-semibold text-foreground mb-4">
				{t("notFound.title")}
			</h2>

			<p className="text-muted-foreground max-w-md mb-8">
				{t("notFound.description")}
			</p>

			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="outline" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4" />
					{t("notFound.goBack")}
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

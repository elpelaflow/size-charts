"use client";

import { TemplateBrowser } from "@/components/templates/template-browser";
import { useLocale } from "@/hooks/use-locale";

export default function TemplatesPage() {
	const { t } = useLocale();

	return (
		<div>
			<div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
						{t("templates.pageTitle")}
					</h1>
					<p className="mt-2 text-muted-foreground">
						{t("templates.pageSubtitle")}
					</p>
				</div>
			</div>

			<TemplateBrowser allowCreate={false} />
		</div>
	);
}

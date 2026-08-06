import type { Metadata } from "next";
import { ChangelogContent } from "@/components/docs";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.changelog.title"),
		description: t("seo.changelog.desc"),
		openGraph: {
			title: `${t("seo.changelog.title")} | Size Charts`,
			description: t("seo.changelog.desc"),
		},
	};
}

export default function ChangelogPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<ChangelogContent />
		</div>
	);
}

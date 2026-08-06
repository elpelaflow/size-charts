import type { Metadata } from "next";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.embedWidget.title"),
		description: t("seo.embedWidget.desc"),
		openGraph: {
			title: `${t("seo.embedWidget.title")} | Size Charts`,
			description: t("seo.embedWidget.desc"),
		},
	};
}

export default function EmbedDocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}

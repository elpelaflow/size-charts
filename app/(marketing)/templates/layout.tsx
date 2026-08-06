import type { Metadata } from "next";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("templates.title"),
		description: t("seo.templates.desc"),
		openGraph: {
			title: `${t("seo.templates.title")} | Size Charts`,
			description: t("seo.templates.desc"),
		},
	};
}

export default function TemplatesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}

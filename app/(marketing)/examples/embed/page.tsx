import type { Metadata } from "next";
import { EmbedExample } from "@/components/examples/embed-example";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.embedExamples.title"),
		description: t("seo.embedExamples.desc"),
		openGraph: {
			title: `${t("seo.embedExamples.title")} | Size Charts`,
			description: t("seo.embedExamples.desc"),
		},
	};
}

export default function EmbedExamplePage() {
	return <EmbedExample />;
}

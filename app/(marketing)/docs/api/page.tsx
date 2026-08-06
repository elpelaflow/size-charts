import type { Metadata } from "next";
import { ApiReferenceContent } from "@/components/docs";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.api.title"),
		description: t("seo.api.desc"),
		openGraph: {
			title: `${t("seo.api.title")} | Size Charts`,
			description: t("seo.api.desc"),
		},
	};
}

export default function ApiDocsPage() {
	return <ApiReferenceContent showNavigation={true} />;
}

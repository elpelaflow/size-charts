import type { Metadata } from "next";
import { GettingStartedContent } from "@/components/docs";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.gettingStarted.title"),
		description: t("seo.gettingStarted.desc"),
		openGraph: {
			title: `${t("seo.gettingStarted.title")} | Size Charts`,
			description: t("seo.gettingStarted.desc"),
		},
	};
}

export default function GettingStartedPage() {
	return <GettingStartedContent showAdminLinks={false} />;
}

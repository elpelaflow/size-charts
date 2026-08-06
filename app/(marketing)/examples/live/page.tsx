import type { Metadata } from "next";
import { LiveBuilder } from "@/components/examples/live-builder";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: t("seo.liveBuilder.title"),
		description: t("seo.liveBuilder.desc"),
		openGraph: {
			title: `${t("seo.liveBuilder.title")} | Size Charts`,
			description: t("seo.liveBuilder.desc"),
		},
	};
}

export default function LiveBuilderPage() {
	return <LiveBuilder />;
}

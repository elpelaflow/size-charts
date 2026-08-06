import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DevToolbar } from "@/components/vercel-toolbar";
import { Providers } from "./providers";
import { getT } from "@/lib/i18n";
import "./globals.css";

// Primary font - Sora: A soft, rounded geometric sans-serif
// Modern but friendly, with beautiful curves and excellent readability
const sora = Sora({
	variable: "--font-sora",
	subsets: ["latin"],
	display: "swap",
});

// Monospace for code blocks
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getT();
	return {
		title: {
			default: t("seo.default.title"),
			template: "%s | Size Charts",
		},
		description: t("seo.default.desc"),
		keywords: ["size chart", "e-commerce", "sizing guide", "clothing sizes", "open source"],
		authors: [{ name: "Matt Decrevel" }],
		metadataBase: new URL("https://www.sizecharts.dev"),
		openGraph: {
			title: t("seo.default.title"),
			description: t("seo.default.ogDesc"),
			url: "https://www.sizecharts.dev",
			siteName: "Size Charts",
			type: "website",
		},
	twitter: {
		card: "summary_large_image",
		title: t("seo.default.title"),
		description: t("seo.default.ogDesc"),
	},
	robots: {
		index: true,
		follow: true,
	},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${sora.variable} ${geistMono.variable} font-sans antialiased`}
			>
				<Providers>
					{children}
				</Providers>
				<Analytics />
				<SpeedInsights />
				<DevToolbar />
			</body>
		</html>
	);
}

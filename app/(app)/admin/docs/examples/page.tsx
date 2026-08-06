"use client";

import Link from "next/link";
import { Code2, Wand2, ExternalLink, ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export default function AdminExamplesPage() {
	const { t } = useLocale();

	const examples = [
		{
			href: "/admin/docs/examples/embed",
			icon: Code2,
			title: t("examples.embedWidget.title"),
			description: t("examples.embedWidget.desc"),
		},
		{
			href: "/admin/docs/examples/live",
			icon: Wand2,
			title: t("examples.live.title"),
			description: t("examples.live.desc"),
		},
		{
			href: "/examples/example.html",
			icon: ExternalLink,
			title: t("examples.standaloneHtml"),
			description: t("examples.standalone.desc"),
			external: true,
		},
	];

	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">{t("examples.title")}</h1>
				<p className="mt-2 text-muted-foreground">
					{t("examples.pageSubtitle")}
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{examples.map((example) =>
					example.external ? (
						<a
							key={example.href}
							href={example.href}
							target="_blank"
							rel="noopener noreferrer"
							className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
						>
							<example.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
							<h2 className="font-semibold mb-1">{example.title}</h2>
							<p className="text-sm text-muted-foreground mb-4">
								{example.description}
							</p>
							<span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
								{t("examples.open")}
								<ExternalLink className="h-4 w-4" />
							</span>
						</a>
					) : (
						<Link
							key={example.href}
							href={example.href}
							className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
						>
							<example.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
							<h2 className="font-semibold mb-1">{example.title}</h2>
							<p className="text-sm text-muted-foreground mb-4">
								{example.description}
							</p>
							<span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
								{t("examples.view")}
								<ArrowRight className="h-4 w-4" />
							</span>
						</Link>
					)
				)}
			</div>

			<div className="mt-8 rounded-xl border border-border bg-muted/30 p-6">
				<h2 className="font-semibold mb-3">{t("examples.quickEmbed")}</h2>
				<p className="text-sm text-muted-foreground mb-4">
					{t("examples.quickEmbedDesc")}
				</p>
				<pre className="rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 overflow-x-auto">
					<code>{`<div data-chart="mens-tops"></div>
<script src="https://www.sizecharts.dev/embed/size-charts.js" data-api="https://www.sizecharts.dev"></script>`}</code>
				</pre>
			</div>
		</div>
	);
}
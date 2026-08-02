"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

interface EmbedGuideContentProps {
	showTitle?: boolean;
	className?: string;
	apiBaseUrl?: string;
}

export function EmbedGuideContent({ showTitle = true, className = "", apiBaseUrl = "" }: EmbedGuideContentProps) {
	const [copied, setCopied] = useState(false);
	const [chartSlug, setChartSlug] = useState("mens-tops");
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [unit, setUnit] = useState<"in" | "cm">("in");
	const [compact, setCompact] = useState(false);
	const { t } = useLocale();

	const getBaseUrl = () => {
		if (apiBaseUrl) return apiBaseUrl;
		if (typeof window !== "undefined") return window.location.origin;
		return "https://www.sizecharts.dev";
	};

	const embedCode = `<!-- Size Chart Widget -->
<div data-chart="${chartSlug}"${theme !== "light" ? ` data-theme="${theme}"` : ""}${unit !== "in" ? ` data-unit="${unit}"` : ""}${compact ? ' data-compact="true"' : ""}></div>
<script src="${getBaseUrl()}/embed/size-charts.js"
        data-api="${getBaseUrl()}"></script>`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(embedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={className}>
			{showTitle && (
				<div className="mb-8">
					<h1 className="text-2xl font-bold">{t("docs.embedWidget")}</h1>
					<p className="mt-2 text-muted-foreground">
						{t("docs.embed.intro")}
					</p>
				</div>
			)}

			{/* Code Generator */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold mb-4">{t("docs.embed.codeGenerator")}</h2>
				<div className="rounded-lg border bg-card p-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
						<div>
							<label className="text-sm font-medium mb-1 block">{t("docs.embed.chartSlug")}</label>
							<input
								type="text"
								value={chartSlug}
								onChange={(e) => setChartSlug(e.target.value)}
								className="w-full rounded-md border bg-background px-3 py-2 text-sm"
								placeholder="e.g., mens-tops"
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">{t("docs.embed.theme")}</label>
							<select
								value={theme}
								onChange={(e) => setTheme(e.target.value as "light" | "dark")}
								className="w-full rounded-md border bg-background px-3 py-2 text-sm"
							>
								<option value="light">{t("docs.embed.light")}</option>
								<option value="dark">{t("docs.embed.dark")}</option>
							</select>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">{t("docs.embed.defaultUnit")}</label>
							<select
								value={unit}
								onChange={(e) => setUnit(e.target.value as "in" | "cm")}
								className="w-full rounded-md border bg-background px-3 py-2 text-sm"
							>
								<option value="in">{t("docs.embed.inches")}</option>
								<option value="cm">{t("docs.embed.centimeters")}</option>
							</select>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">{t("docs.embed.compactMode")}</label>
							<select
								value={compact ? "true" : "false"}
								onChange={(e) => setCompact(e.target.value === "true")}
								className="w-full rounded-md border bg-background px-3 py-2 text-sm"
							>
								<option value="false">{t("docs.embed.normal")}</option>
								<option value="true">{t("docs.embed.compact")}</option>
							</select>
						</div>
					</div>

					<div className="relative">
						<pre className="rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 overflow-x-auto">
							<code>{embedCode}</code>
						</pre>
						<button
							onClick={copyToClipboard}
							className="absolute top-3 right-3 flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-100 hover:bg-zinc-600"
						>
							{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
							{copied ? t("docs.embed.copied") : t("docs.embed.copy")}
						</button>
					</div>
				</div>
			</section>

			{/* Configuration Options */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold mb-4">{t("docs.embed.configOptions")}</h2>
				<div className="rounded-lg border overflow-hidden">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/50">
								<th className="px-4 py-2 text-left font-medium">{t("docs.embed.attribute")}</th>
								<th className="px-4 py-2 text-left font-medium">{t("docs.embed.type")}</th>
								<th className="px-4 py-2 text-left font-medium">{t("docs.embed.default")}</th>
								<th className="px-4 py-2 text-left font-medium">{t("docs.embed.description")}</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b">
								<td className="px-4 py-2"><code className="bg-muted px-1 rounded">data-chart</code></td>
								<td className="px-4 py-2 text-muted-foreground">string</td>
								<td className="px-4 py-2 text-muted-foreground">-</td>
								<td className="px-4 py-2 text-muted-foreground">{t("docs.embed.attrChart")}</td>
							</tr>
							<tr className="border-b">
								<td className="px-4 py-2"><code className="bg-muted px-1 rounded">data-theme</code></td>
								<td className="px-4 py-2 text-muted-foreground">&quot;light&quot; | &quot;dark&quot;</td>
								<td className="px-4 py-2 text-muted-foreground">light</td>
								<td className="px-4 py-2 text-muted-foreground">{t("docs.embed.attrTheme")}</td>
							</tr>
							<tr className="border-b">
								<td className="px-4 py-2"><code className="bg-muted px-1 rounded">data-unit</code></td>
								<td className="px-4 py-2 text-muted-foreground">&quot;in&quot; | &quot;cm&quot;</td>
								<td className="px-4 py-2 text-muted-foreground">in</td>
								<td className="px-4 py-2 text-muted-foreground">{t("docs.embed.attrUnit")}</td>
							</tr>
							<tr className="border-b">
								<td className="px-4 py-2"><code className="bg-muted px-1 rounded">data-compact</code></td>
								<td className="px-4 py-2 text-muted-foreground">&quot;true&quot;</td>
								<td className="px-4 py-2 text-muted-foreground">false</td>
								<td className="px-4 py-2 text-muted-foreground">{t("docs.embed.attrCompact")}</td>
							</tr>
							<tr>
								<td className="px-4 py-2"><code className="bg-muted px-1 rounded">data-api-key</code></td>
								<td className="px-4 py-2 text-muted-foreground">string</td>
								<td className="px-4 py-2 text-muted-foreground">-</td>
								<td className="px-4 py-2 text-muted-foreground">{t("docs.embed.attrApiKey")}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			{/* JavaScript API */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold mb-4">{t("docs.embed.jsApi")}</h2>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm mb-3">
						{t("docs.embed.jsApiDesc")}
					</p>
					<pre className="rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 overflow-x-auto">
						{`// Re-initialize all widgets
SizeCharts.init();

// Initialize a specific container
SizeCharts.render(document.getElementById("my-chart"));

// Set API URL at runtime
SizeCharts.setApiUrl("https://www.sizecharts.dev");`}
					</pre>
				</div>
			</section>

			{/* Example Links */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold mb-4">{t("docs.embed.liveDemos")}</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<a
						href="/examples/embed"
						className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
					>
						<ExternalLink className="h-5 w-5 text-muted-foreground" />
						<div>
							<div className="font-medium">{t("docs.embed.widgetExamples")}</div>
							<div className="text-sm text-muted-foreground">{t("docs.embed.widgetExamplesDesc")}</div>
						</div>
					</a>
					<a
						href="/examples/live"
						className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
					>
						<ExternalLink className="h-5 w-5 text-muted-foreground" />
						<div>
							<div className="font-medium">{t("docs.embed.liveBuilder")}</div>
							<div className="text-sm text-muted-foreground">{t("docs.embed.liveBuilderDesc")}</div>
						</div>
					</a>
					<a
						href="/examples/example.html"
						className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
					>
						<ExternalLink className="h-5 w-5 text-muted-foreground" />
						<div>
							<div className="font-medium">{t("docs.embed.standaloneExample")}</div>
							<div className="text-sm text-muted-foreground">{t("docs.embed.standaloneExampleDesc")}</div>
						</div>
					</a>
				</div>
			</section>

			{/* Troubleshooting */}
			<section className="mb-8">
				<h2 className="text-lg font-semibold mb-4">{t("docs.embed.troubleshooting")}</h2>
				<div className="space-y-4">
					<div className="rounded-lg border bg-card p-4">
						<h3 className="font-medium mb-2">{t("docs.embed.ts1Title")}</h3>
						<p className="text-sm text-muted-foreground">
							{t("docs.embed.ts1Desc")} <code className="bg-muted px-1 rounded">GET /api/v1/size-charts?slug=your-slug</code>
						</p>
					</div>
					<div className="rounded-lg border bg-card p-4">
						<h3 className="font-medium mb-2">{t("docs.embed.ts2Title")}</h3>
						<p className="text-sm text-muted-foreground">
							{t("docs.embed.ts2Desc")}
						</p>
					</div>
					<div className="rounded-lg border bg-card p-4">
						<h3 className="font-medium mb-2">{t("docs.embed.ts3Title")}</h3>
						<p className="text-sm text-muted-foreground">
							{t("docs.embed.ts3Desc")}
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}

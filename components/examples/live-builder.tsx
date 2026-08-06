"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function LiveBuilder() {
	const [chartSlug, setChartSlug] = useState("mens-tops");
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [unit, setUnit] = useState<"in" | "cm">("in");
	const [compact, setCompact] = useState(false);
	const [copied, setCopied] = useState(false);
	const [previewKey, setPreviewKey] = useState(0);

	const { t } = useLocale();

	const getBaseUrl = () => {
		if (typeof window !== "undefined") return window.location.origin;
		return "https://www.sizecharts.dev";
	};

	const embedCode = `<div data-chart="${chartSlug}"${theme !== "light" ? ` data-theme="${theme}"` : ""}${unit !== "in" ? ` data-unit="${unit}"` : ""}${compact ? ' data-compact="true"' : ""}></div>
<script src="${getBaseUrl()}/embed/size-charts.js" data-api="${getBaseUrl()}"></script>`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(embedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const refreshPreview = () => {
		setPreviewKey((k) => k + 1);
	};

	// Re-init widget when config changes
	useEffect(() => {
		// @ts-expect-error - SizeCharts is loaded from external script
		if (typeof window !== "undefined" && window.SizeCharts) {
			// @ts-expect-error - SizeCharts is loaded from external script
			window.SizeCharts.init();
		}
	}, [previewKey, chartSlug, theme, unit, compact]);

	return (
		<div className="max-w-5xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">{t("examples.live.title")}</h1>
				<p className="mt-2 text-muted-foreground">
					{t("examples.builder.subtitle")}
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Configuration Panel */}
				<div>
					<h2 className="text-lg font-semibold mb-4">{t("examples.builder.configuration")}</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								{t("docs.embed.chartSlug")}
							</label>
							<input
								type="text"
								value={chartSlug}
								onChange={(e) => setChartSlug(e.target.value)}
								className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
								placeholder={t("examples.builder.slugPlaceholder")}
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								{t("examples.builder.slugHint")}
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								{t("docs.embed.theme")}
							</label>
							<div className="flex gap-2">
								<button
									onClick={() => setTheme("light")}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${theme === "light"
											? "border-primary bg-primary text-primary-foreground"
											: "border-border hover:bg-muted"
										}`}
								>
									{t("docs.embed.light")}
								</button>
								<button
									onClick={() => setTheme("dark")}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${theme === "dark"
											? "border-primary bg-primary text-primary-foreground"
											: "border-border hover:bg-muted"
										}`}
								>
									{t("docs.embed.dark")}
								</button>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								{t("docs.embed.defaultUnit")}
							</label>
							<div className="flex gap-2">
								<button
									onClick={() => setUnit("in")}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${unit === "in"
											? "border-primary bg-primary text-primary-foreground"
											: "border-border hover:bg-muted"
										}`}
								>
									{t("docs.embed.inches")}
								</button>
								<button
									onClick={() => setUnit("cm")}
									className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${unit === "cm"
											? "border-primary bg-primary text-primary-foreground"
											: "border-border hover:bg-muted"
										}`}
								>
									{t("docs.embed.centimeters")}
								</button>
							</div>
						</div>

						<div>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={compact}
									onChange={(e) => setCompact(e.target.checked)}
									className="rounded border-border"
								/>
								<span className="text-sm font-medium">
									{t("docs.embed.compactMode")}
								</span>
							</label>
							<p className="mt-1 text-xs text-muted-foreground ml-6">
								{t("examples.builder.compactDesc")}
							</p>
						</div>
					</div>

					{/* Generated Code */}
					<div className="mt-6">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold">{t("examples.builder.embedCode")}</h3>
							<button
								onClick={copyToClipboard}
								className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
								{copied ? t("docs.embed.copied") : t("docs.embed.copy")}
							</button>
						</div>
						<pre className="rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 overflow-x-auto">
							<code>{embedCode}</code>
						</pre>
					</div>
				</div>

				{/* Preview Panel */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">{t("examples.builder.preview")}</h2>
						<button
							onClick={refreshPreview}
							className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							<RefreshCw className="h-4 w-4" />
							{t("examples.builder.refresh")}
						</button>
					</div>

					<div
						className={`rounded-xl border p-6 ${theme === "dark"
								? "border-zinc-800 bg-zinc-900"
								: "border-zinc-200 bg-white"
							}`}
					>
						<div
							key={previewKey}
							data-chart={chartSlug}
							data-theme={theme}
							data-unit={unit}
							data-compact={compact ? "true" : undefined}
						></div>
					</div>
				</div>
			</div>

			{/* Load the embed script */}
			<Script
				src="/embed/size-charts.js"
				data-api=""
				strategy="afterInteractive"
				onLoad={() => {
					// @ts-expect-error - SizeCharts is loaded from external script
					if (window.SizeCharts) {
						// @ts-expect-error - SizeCharts is loaded from external script
						window.SizeCharts.init();
					}
				}}
			/>
		</div>
	);
}

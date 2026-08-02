"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeChartDisplay } from "@/components/public/size-chart-display";
import { UnitSwitcher } from "@/components/public/unit-switcher";
import { useUnitPreference } from "@/hooks/use-unit-preference";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Printer } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { translateCategoryName, translateSubcategoryName, translateChartName, translateChartDescription, translateInstructionName, translateInstructionText } from "@/lib/i18n/data-translations";
import type { SizeChartFull } from "@/types";

interface PageProps {
	params: Promise<{ category: string; subcategory: string; chart: string }>;
}

export default function ChartPage({ params }: PageProps) {
	const { category: categorySlug, subcategory: subcategorySlug, chart: chartSlug } = use(params);
	const { unit, setUnit, isLoaded } = useUnitPreference();
	const { t, locale } = useLocale();
	const [chart, setChart] = useState<SizeChartFull | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function fetchChart() {
			try {
				const response = await fetch(
					`/api/size-charts/public?category=${categorySlug}&subcategory=${subcategorySlug}&chart=${chartSlug}`
				);
				if (!response.ok) {
					setError(true);
					return;
				}
				const data = await response.json();
				setChart(data);
			} catch {
				setError(true);
			} finally {
				setLoading(false);
			}
		}

		fetchChart();
	}, [categorySlug, subcategorySlug, chartSlug]);

	if (error) {
		notFound();
	}

	if (loading || !chart) {
		return (
			<div>
				<div className="mb-6 flex items-center gap-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="mb-4 h-10 w-64" />
				<Skeleton className="mb-8 h-6 w-96" />
				<Skeleton className="h-64 w-full rounded-lg" />
			</div>
		);
	}

	// Check if the chart name is essentially the same as the subcategory
	// (avoid breadcrumb like "Gloves > Gloves")
	const subcategoryName = chart.subcategory?.name || "";
	const chartNameMatchesSubcategory =
		chart.name.toLowerCase().trim() === subcategoryName.toLowerCase().trim() ||
		chart.name.toLowerCase().includes(subcategoryName.toLowerCase());

	return (
		<div>
			<nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
				<Link href="/size-guide" className="hover:text-foreground transition-colors">
					{t("sizeGuide.title")}
				</Link>
				<ChevronRight className="h-4 w-4" />
				<Link
					href={`/size-guide/${categorySlug}`}
					className="hover:text-foreground transition-colors"
				>
					{translateCategoryName(categorySlug, chart.subcategory?.category.name || "", locale)}
				</Link>
				<ChevronRight className="h-4 w-4" />
				{chartNameMatchesSubcategory ? (
					// If chart name matches subcategory, just show the chart name as the final item
					<span className="text-foreground">{translateChartName(chartSlug, chart.name, locale)}</span>
				) : (
					// Otherwise show both subcategory and chart name
					<>
						<Link
							href={`/size-guide/${categorySlug}/${subcategorySlug}`}
							className="hover:text-foreground transition-colors"
						>
							{translateSubcategoryName(subcategorySlug, subcategoryName, locale)}
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">{translateChartName(chartSlug, chart.name, locale)}</span>
					</>
				)}
			</nav>

			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
						{translateChartName(chartSlug, chart.name, locale)}
					</h1>
					{chart.description && (
						<p className="mt-2 text-muted-foreground">{translateChartDescription(chartSlug, chart.description, locale)}</p>
					)}
				</div>
				<div className="flex items-center gap-3">
					{isLoaded && <UnitSwitcher value={unit} onChange={setUnit} />}
					<button
						onClick={() => window.print()}
						className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
					>
						<Printer className="h-4 w-4" />
						{t("sizeGuide.print")}
					</button>
				</div>
			</div>

			<SizeChartDisplay chart={chart} unit={unit} />

			{chart.measurementInstructions && chart.measurementInstructions.length > 0 && (
				<div className="mt-8 rounded-xl border border-border bg-card p-6">
					<h2 className="mb-3 text-lg font-semibold text-foreground">
						{t("sizeGuide.howToMeasure")}
					</h2>
					<ul className="space-y-2 text-sm text-muted-foreground">
						{chart.measurementInstructions.map((mi) => (
							<li key={mi.instruction.id}>
								<strong className="text-foreground">{translateInstructionName(mi.instruction.name, locale)}:</strong> {translateInstructionText(mi.instruction.instruction, locale)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

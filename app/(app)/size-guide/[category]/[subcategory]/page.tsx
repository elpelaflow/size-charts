import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getT, getLocale } from "@/lib/i18n";
import { translateCategoryName, translateSubcategoryName, translateChartName, translateChartDescription } from "@/lib/i18n/data-translations";
import { ChevronRight } from "lucide-react";

interface PageProps {
	params: Promise<{ category: string; subcategory: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { category: categorySlug, subcategory: subcategorySlug } = await params;
	const subcategory = await db.subcategory.findFirst({
		where: {
			slug: subcategorySlug,
			category: { slug: categorySlug },
		},
		include: { category: { select: { name: true } } },
	});

	if (!subcategory) {
		return { title: "Not Found" };
	}

	return {
		title: `${subcategory.name} Size Charts`,
		description: `${subcategory.category.name} ${subcategory.name.toLowerCase()} size charts. Find measurements and sizing guides for the perfect fit.`,
		openGraph: {
			title: `${subcategory.name} Size Charts | Size Charts`,
			description: `${subcategory.category.name} ${subcategory.name.toLowerCase()} size charts for the perfect fit.`,
		},
	};
}

export default async function SubcategoryPage({ params }: PageProps) {
	const { category: categorySlug, subcategory: subcategorySlug } = await params;
	const t = await getT();
	const locale = await getLocale();

	const subcategory = await db.subcategory.findFirst({
		where: {
			slug: subcategorySlug,
			category: { slug: categorySlug },
		},
		include: {
			category: true,
		},
	});

	if (!subcategory) {
		notFound();
	}

	// Get published size charts for this subcategory via many-to-many
	const sizeCharts = await db.sizeChart.findMany({
		where: {
			isPublished: true,
			subcategories: {
				some: { subcategoryId: subcategory.id },
			},
		},
		orderBy: { name: "asc" },
	});

	const subcategoryWithCharts = {
		...subcategory,
		sizeCharts,
	};

	// If only one chart, redirect directly to it
	if (subcategoryWithCharts.sizeCharts.length === 1) {
		redirect(`/size-guide/${categorySlug}/${subcategorySlug}/${subcategoryWithCharts.sizeCharts[0].slug}`);
	}

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
					{translateCategoryName(subcategoryWithCharts.category.slug, subcategoryWithCharts.category.name, locale)}
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-foreground">{translateSubcategoryName(subcategoryWithCharts.slug, subcategoryWithCharts.name, locale)}</span>
			</nav>

			<h1 className="mb-8 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
				{t("sizeGuide.categoryCharts").replace("{category}", translateSubcategoryName(subcategoryWithCharts.slug, subcategoryWithCharts.name, locale))}
			</h1>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{subcategoryWithCharts.sizeCharts.map((chart) => (
					<Link
						key={chart.id}
						href={`/size-guide/${categorySlug}/${subcategorySlug}/${chart.slug}`}
						className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:bg-primary/5 transition-colors"
					>
						<h2 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
							{translateChartName(chart.slug, chart.name, locale)}
						</h2>
						{chart.description && (
							<p className="text-sm text-muted-foreground">{translateChartDescription(chart.slug, chart.description, locale)}</p>
						)}
					</Link>
				))}
			</div>

			{subcategoryWithCharts.sizeCharts.length === 0 && (
				<p className="text-center text-muted-foreground">{t("sizeGuide.noChartsYet")}</p>
			)}
		</div>
	);
}

import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Wand2, ExternalLink, ArrowRight, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { getT } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
	const seoT = await getT();
	return {
		title: seoT("seo.examples.title"),
		description: seoT("seo.examples.desc"),
		openGraph: {
			title: `${seoT("seo.examples.title")} | Size Charts`,
			description: seoT("seo.examples.desc"),
		},
	};
}

const exampleDefs = [
	{
		href: "/examples/embed",
		icon: Code2,
		titleKey: "examples.embedWidget.title",
		descKey: "examples.embedWidget.desc",
		external: false,
	},
	{
		href: "/examples/live",
		icon: Wand2,
		titleKey: "examples.live.title",
		descKey: "examples.liveBuilder.desc",
		external: false,
	},
	{
		href: "/examples/example.html",
		icon: ExternalLink,
		titleKey: "examples.standalone.title",
		descKey: "examples.standalone.desc",
		external: true,
	},
];

export default async function ExamplesPage() {
	const t = await getT();

	// Fetch categories with chart counts for size guide section
	const categories = await db.category.findMany({
		orderBy: { displayOrder: "asc" },
		include: {
			subcategories: {
				orderBy: { displayOrder: "asc" },
			},
		},
	});

	const subcategoryCounts = await db.sizeChartSubcategory.groupBy({
		by: ["subcategoryId"],
		where: {
			sizeChart: { isPublished: true },
		},
		_count: {
			sizeChartId: true,
		},
	});

	const countMap = new Map(
		subcategoryCounts.map((c) => [c.subcategoryId, c._count.sizeChartId])
	);

	const categoriesWithCounts = categories.map((category) => ({
		...category,
		subcategories: category.subcategories.map((sub) => ({
			...sub,
			chartCount: countMap.get(sub.id) || 0,
		})),
		totalCharts: category.subcategories.reduce(
			(sum, sub) => sum + (countMap.get(sub.id) || 0),
			0
		),
	}));

	return (
		<div className="mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t("examples.title")}</h1>
				<p className="mt-2 text-zinc-600 dark:text-zinc-400">
					{t("examples.pageSubtitle")}
				</p>
			</div>

			{/* Example Links */}
			<div className="grid gap-4 md:grid-cols-3">
				{exampleDefs.map((example) =>
					example.external ? (
						<a
							key={example.href}
							href={example.href}
							target="_blank"
							rel="noopener noreferrer"
							className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
						>
							<example.icon className="h-8 w-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mb-4" />
							<h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
								{t(example.titleKey)}
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
								{t(example.descKey)}
							</p>
							<span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:gap-2 transition-all">
								{t("examples.open")}
								<ExternalLink className="h-4 w-4" />
							</span>
						</a>
					) : (
						<Link
							key={example.href}
							href={example.href}
							className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
						>
							<example.icon className="h-8 w-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mb-4" />
							<h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
								{t(example.titleKey)}
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
								{t(example.descKey)}
							</p>
							<span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:gap-2 transition-all">
								{t("examples.view")}
								<ArrowRight className="h-4 w-4" />
							</span>
						</Link>
					)
				)}
			</div>

			{/* Size Guide Section */}
			<div className="mt-12">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t("sizeGuide.title")}</h2>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							{t("examples.browseByCategory")}
						</p>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{categoriesWithCounts.map((category) => (
						<div
							key={category.id}
							className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
						>
							<div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
										{category.name}
									</h3>
									<span className="text-xs text-zinc-500">
										{category.totalCharts} {t("home.charts")}
									</span>
								</div>
							</div>

							<div className="divide-y divide-zinc-200 dark:divide-zinc-800">
								{category.subcategories
									.filter((sub) => sub.chartCount > 0)
									.slice(0, 5)
									.map((subcategory) => (
										<Link
											key={subcategory.id}
											href={`/size-guide/${category.slug}/${subcategory.slug}`}
											className="flex items-center justify-between px-5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-sm"
										>
											<span className="text-zinc-700 dark:text-zinc-300">
												{subcategory.name}
											</span>
											<ChevronRight className="h-4 w-4 text-zinc-400" />
										</Link>
									))}

								{category.subcategories.filter((sub) => sub.chartCount > 0).length > 5 && (
									<Link
										href={`/size-guide/${category.slug}`}
										className="block px-5 py-2.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
									>
										+{category.subcategories.filter((sub) => sub.chartCount > 0).length - 5} {t("home.more")}
									</Link>
								)}

								{category.subcategories.filter((sub) => sub.chartCount > 0).length === 0 && (
									<div className="px-5 py-3 text-sm text-zinc-500 italic">
										{t("examples.noChartsYet")}
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<p className="mt-4 text-xs text-zinc-500">
					{t("examples.unitsNote")}
				</p>
			</div>

			{/* Quick Embed */}
			<div className="mt-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
				<h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">{t("examples.quickEmbed")}</h2>
				<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
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

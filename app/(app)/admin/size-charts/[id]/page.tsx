"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button, InputWithLabel, Badge, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { SizeChartEditor, MeasurementInstructionsSelector, type EditorState } from "@/components/admin/size-chart-editor";
import { useSizeChart } from "@/hooks/use-size-charts";
import { useCategories } from "@/hooks/use-categories";
import { useLabels } from "@/hooks/use-labels";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Eye, EyeOff, ExternalLink, Pencil, Check, Info } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function EditSizeChartPage({ params }: PageProps) {
	const { id } = use(params);
	const { addToast } = useToast();
	const { t } = useLocale();

	const { data: chart, isLoading } = useSizeChart(id);
	const { data: categories } = useCategories();
	const { data: labels } = useLabels();
	const { isProtectedSizeChartSlug } = useDemoMode();

	const [state, setState] = useState<EditorState | null>(null);
	const [saving, setSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [slug, setSlug] = useState("");
	const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
	const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (chart && !state) {
			setState({
				name: chart.name,
				description: chart.description || "",
				subcategoryIds: chart.subcategories.map((sc) => sc.subcategoryId),
				measurementInstructionIds: chart.measurementInstructions?.map((mi: { instructionId: string }) => mi.instructionId) || [],
				isPublished: chart.isPublished,
				columns: chart.columns.map((col) => ({
					id: col.id,
					name: col.name,
					columnType: col.columnType,
					displayOrder: col.displayOrder,
				})),
				rows: chart.rows.map((row) => ({
					id: row.id,
					displayOrder: row.displayOrder,
					cells: chart.columns.map((col, colIndex) => {
						const cell = row.cells.find((c) => c.columnId === col.id);
						return {
							id: cell?.id,
							columnId: col.id,
							columnIndex: colIndex,
							valueInches: cell?.valueInches ?? null,
							valueCm: cell?.valueCm ?? null,
							valueText: cell?.valueText ?? null,
							valueMinInches: cell?.valueMinInches ?? null,
							valueMaxInches: cell?.valueMaxInches ?? null,
							valueMinCm: cell?.valueMinCm ?? null,
							valueMaxCm: cell?.valueMaxCm ?? null,
							labelId: cell?.labelId ?? null,
						};
					}),
				})),
			});
			setSlug(chart.slug);
		}
	}, [chart, state]);

	const handleStateChange = (newState: EditorState) => {
		setState(newState);
		setHasChanges(true);
	};

	const handleSave = async () => {
		if (!state) return;

		if (!state.name.trim()) {
			addToast(t("admin.enterChartName"), "error");
			return;
		}

		setSaving(true);

		try {
			const response = await fetch(`/api/size-charts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: state.name,
					slug: slug,
					description: state.description || null,
					subcategoryIds: state.subcategoryIds,
					measurementInstructionIds: state.measurementInstructionIds,
					columns: state.columns.map((col, index) => ({
						id: col.id,
						name: col.name,
						columnType: col.columnType,
						displayOrder: index,
					})),
					rows: state.rows.map((row, rowIndex) => ({
						id: row.id,
						displayOrder: rowIndex,
						cells: row.cells.map((cell, cellIndex) => ({
							id: cell.id,
							columnId: cell.columnId,
							columnIndex: cellIndex,
							valueInches: cell.valueInches,
							valueCm: cell.valueCm,
							valueText: cell.valueText,
							valueMinInches: cell.valueMinInches,
							valueMaxInches: cell.valueMaxInches,
							valueMinCm: cell.valueMinCm,
							valueMaxCm: cell.valueMaxCm,
							labelId: cell.labelId,
						})),
					})),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to save size chart");
			}

			addToast(t("admin.chartSaved"), "success");
			setHasChanges(false);
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.chartSaveFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	const handleTogglePublish = async () => {
		if (!state) return;

		setSaving(true);

		try {
			const response = await fetch(`/api/size-charts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isPublished: !state.isPublished }),
			});

			if (!response.ok) {
				throw new Error("Failed to update publish status");
			}

			setState({ ...state, isPublished: !state.isPublished });
			addToast(state.isPublished ? t("admin.chartUnpublished") : t("admin.chartPublished"), "success");
		} catch {
			addToast(t("admin.publishStatusFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	if (isLoading || !state) {
		return (
			<div>
				<div className="mb-6">
					<Skeleton className="h-4 w-32 mb-4" />
					<Skeleton className="h-10 w-64" />
				</div>
				<div className="space-y-6">
					<Skeleton className="h-48 w-full rounded-lg" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<Link
					href="/admin/size-charts"
					className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					{t("admin.backToSizeCharts")}
				</Link>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold">
							{state.name || t("admin.untitledChart")}
						</h1>
						<Badge variant={state.isPublished ? "default" : "secondary"}>
							{state.isPublished ? t("admin.published") : t("admin.draft")}
						</Badge>
						{hasChanges && (
							<Badge variant="outline">{t("admin.unsavedChanges")}</Badge>
						)}
					</div>
					<div className="flex items-center gap-2">
						{state.isPublished && chart && chart.subcategories.length > 0 && (
							<Link
								href={`/size-guide/${chart.subcategories[0].subcategory.category.slug}/${chart.subcategories[0].subcategory.slug}/${chart.slug}`}
								target="_blank"
							>
								<Button variant="outline">
									<ExternalLink className="h-4 w-4" />
									{t("admin.viewLive")}
								</Button>
							</Link>
						)}
						<Button
							variant="outline"
							onClick={handleTogglePublish}
							disabled={saving}
						>
							{state.isPublished ? (
								<>
									<EyeOff className="h-4 w-4" />
									{t("admin.unpublish")}
								</>
							) : (
								<>
									<Eye className="h-4 w-4" />
									{t("admin.publish")}
								</>
							)}
						</Button>
						<Button onClick={handleSave} disabled={saving || !hasChanges}>
							<Save className="h-4 w-4" />
							{t("admin.saveChanges")}
						</Button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="mb-4 text-lg font-semibold">
						{t("admin.basicInfo")}
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<InputWithLabel
							label={t("admin.name")}
							value={state.name}
							onChange={(e) => handleStateChange({ ...state, name: e.target.value })}
							placeholder="e.g., Regular Fit, Contour Fit"
						/>
						<div className="relative">
							<InputWithLabel
								label={t("admin.chartIdSlug")}
								value={slug}
								onChange={(e) => {
									if (!isProtectedSizeChartSlug(chart?.slug || "")) {
										setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
										setHasChanges(true);
									}
								}}
								placeholder="e.g., regular-fit"
								disabled={isProtectedSizeChartSlug(chart?.slug || "")}
								className={isProtectedSizeChartSlug(chart?.slug || "") ? "cursor-not-allowed" : ""}
							/>
							{isProtectedSizeChartSlug(chart?.slug || "") && (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="absolute right-2 top-8 cursor-help">
											<Info className="h-4 w-4 text-muted-foreground" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{t("admin.slugProtected")}</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
						<div className="sm:col-span-2">
							<InputWithLabel
								label={t("admin.descriptionOptional")}
								value={state.description}
								onChange={(e) => handleStateChange({ ...state, description: e.target.value })}
								placeholder="Brief description of this size chart"
							/>
						</div>
						<div className="sm:col-span-2">
							<div className="mb-2 flex items-center justify-between">
								<span className="text-sm font-medium">{t("admin.categories")}</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSelectedSubcategoryIds(new Set(state.subcategoryIds));
										setCategoriesDialogOpen(true);
									}}
								>
									<Pencil className="h-4 w-4" />
									{t("admin.edit")}
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{state.subcategoryIds.length > 0 ? (
									categories
										?.flatMap((cat) =>
											cat.subcategories
												.filter((sub) => state.subcategoryIds.includes(sub.id))
												.map((sub) => (
													<Badge key={sub.id} variant="secondary">
														{cat.name} → {sub.name}
													</Badge>
												))
										)
								) : (
									<span className="text-sm text-muted-foreground">{t("admin.noCategoriesAssigned")}</span>
								)}
							</div>
						</div>
						{slug && chart && chart.subcategories.length > 0 && (
							<div className="text-sm text-muted-foreground">
								<span className="font-medium">{t("admin.publicUrl")}</span>{" "}
								<code className="bg-muted px-1 py-0.5 rounded text-xs">
									/size-guide/{chart.subcategories[0].subcategory.category.slug}/{chart.subcategories[0].subcategory.slug}/{slug}
								</code>
							</div>
						)}
					</div>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h2 className="mb-4 text-lg font-semibold">
						{t("admin.measurementInstructions")}
					</h2>
					<p className="mb-4 text-sm text-muted-foreground">
						{t("admin.measurementInstructionsDesc")}
					</p>
					<MeasurementInstructionsSelector
						selectedIds={state.measurementInstructionIds}
						onChange={(ids) => handleStateChange({ ...state, measurementInstructionIds: ids })}
					/>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h2 className="mb-4 text-lg font-semibold">
						{t("admin.sizeChartData")}
					</h2>
					<p className="mb-4 text-sm text-muted-foreground">
						{t("admin.sizeChartDataDesc")}
					</p>
					<SizeChartEditor state={state} onChange={handleStateChange} labels={labels} />
				</div>
			</div>

			{/* Categories Edit Dialog */}
			<Dialog open={categoriesDialogOpen} onOpenChange={setCategoriesDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{t("admin.editCategories")}</DialogTitle>
						<DialogDescription>
							{t("admin.editCategoriesDesc")}
						</DialogDescription>
					</DialogHeader>
					<div className="max-h-96 overflow-y-auto py-4">
						{categories?.map((category) => (
							<div key={category.id} className="mb-4">
								<h3 className="mb-2 font-medium text-sm text-muted-foreground">{category.name}</h3>
								<div className="grid grid-cols-2 gap-2">
									{category.subcategories.map((subcategory) => {
										const isSelected = selectedSubcategoryIds.has(subcategory.id);
										return (
											<button
												key={subcategory.id}
												onClick={() => {
													const newSet = new Set(selectedSubcategoryIds);
													if (isSelected) {
														newSet.delete(subcategory.id);
													} else {
														newSet.add(subcategory.id);
													}
													setSelectedSubcategoryIds(newSet);
												}}
												className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${isSelected
														? "border-primary bg-primary/10 text-primary"
														: "border-border hover:bg-accent"
													}`}
											>
												<span>{subcategory.name}</span>
												{isSelected && <Check className="h-4 w-4" />}
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCategoriesDialogOpen(false)}>
							{t("admin.cancel")}
						</Button>
						<Button
							onClick={() => {
								handleStateChange({
									...state,
									subcategoryIds: Array.from(selectedSubcategoryIds),
								});
								setCategoriesDialogOpen(false);
							}}
						>
							{t("admin.saveCategories")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

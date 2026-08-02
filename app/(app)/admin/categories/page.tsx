"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Button,
	Input,
	Skeleton,
	Badge,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	InputWithLabel,
} from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import {
	Plus,
	ChevronRight,
	ChevronDown,
	FolderTree,
	TableProperties,
	FileText,
	ExternalLink,
	Pencil,
	Trash2,
} from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocale } from "@/hooks/use-locale";

interface SizeChartSummary {
	id: string;
	name: string;
	slug: string;
	isPublished: boolean;
}

interface SubcategoryWithCharts {
	id: string;
	name: string;
	slug: string;
	_count: { sizeCharts: number };
	sizeCharts?: { sizeChart: SizeChartSummary }[];
}

interface CategoryWithCharts {
	id: string;
	name: string;
	slug: string;
	subcategories: SubcategoryWithCharts[];
}

export default function CategoriesPage() {
	const { addToast } = useToast();
	const { t } = useLocale();
	const queryClient = useQueryClient();

	// Fetch categories with charts included
	const { data: categories, isLoading } = useQuery<CategoryWithCharts[]>({
		queryKey: ["categories", "with-charts"],
		queryFn: async () => {
			const res = await fetch("/api/size-charts/categories?includeCharts=true");
			if (!res.ok) throw new Error("Failed to fetch categories");
			return res.json();
		},
	});

	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
	const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
	const [saving, setSaving] = useState(false);

	// Category dialogs
	const [showAddCategory, setShowAddCategory] = useState(false);
	const [editingCategory, setEditingCategory] = useState<CategoryWithCharts | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<CategoryWithCharts | null>(null);
	const [categoryName, setCategoryName] = useState("");

	// Subcategory dialogs
	const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null);
	const [editingSubcategory, setEditingSubcategory] = useState<{ sub: SubcategoryWithCharts; categoryId: string } | null>(null);
	const [deletingSubcategory, setDeletingSubcategory] = useState<SubcategoryWithCharts | null>(null);
	const [subcategoryName, setSubcategoryName] = useState("");

	const invalidateCategories = () => {
		queryClient.invalidateQueries({ queryKey: ["categories", "with-charts"] });
		queryClient.invalidateQueries({ queryKey: ["categories"] });
	};

	const toggleExpand = (id: string) => {
		setExpandedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const toggleSubcategoryExpand = (id: string) => {
		setExpandedSubcategories((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	// Category CRUD
	const handleAddCategory = async () => {
		if (!categoryName.trim()) {
			addToast(t("admin.enterCategoryName"), "error");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch("/api/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: categoryName }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to create category");
			}

			addToast(t("admin.categoryCreated"), "success");
			setCategoryName("");
			setShowAddCategory(false);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.categoryCreateFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	const handleEditCategory = async () => {
		if (!editingCategory || !categoryName.trim()) return;

		setSaving(true);
		try {
			const response = await fetch(`/api/categories/${editingCategory.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: categoryName }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update category");
			}

			addToast(t("admin.categoryUpdated"), "success");
			setCategoryName("");
			setEditingCategory(null);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.categoryUpdateFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteCategory = async () => {
		if (!deletingCategory) return;

		setSaving(true);
		try {
			const response = await fetch(`/api/categories/${deletingCategory.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete category");
			}

			addToast(t("admin.categoryDeleted"), "success");
			setDeletingCategory(null);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.categoryDeleteFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	// Subcategory CRUD
	const handleAddSubcategory = async (categoryId: string) => {
		if (!subcategoryName.trim()) {
			addToast(t("admin.enterSubcategoryName"), "error");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch("/api/categories/subcategories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: subcategoryName,
					categoryId,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to create subcategory");
			}

			addToast(t("admin.subcategoryCreated"), "success");
			setSubcategoryName("");
			setAddingSubcategoryTo(null);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.subcategoryCreateFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	const handleEditSubcategory = async () => {
		if (!editingSubcategory || !subcategoryName.trim()) return;

		setSaving(true);
		try {
			const response = await fetch(`/api/categories/subcategories/${editingSubcategory.sub.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: subcategoryName }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update subcategory");
			}

			addToast(t("admin.subcategoryUpdated"), "success");
			setSubcategoryName("");
			setEditingSubcategory(null);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.subcategoryUpdateFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteSubcategory = async () => {
		if (!deletingSubcategory) return;

		setSaving(true);
		try {
			const response = await fetch(`/api/categories/subcategories/${deletingSubcategory.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete subcategory");
			}

			addToast(t("admin.subcategoryDeleted"), "success");
			setDeletingSubcategory(null);
			invalidateCategories();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.subcategoryDeleteFailed"), "error");
		} finally {
			setSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div>
				<h1 className="mb-6 text-2xl font-bold">{t("admin.categories")}</h1>
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">{t("admin.categories")}</h1>
					<p className="text-muted-foreground">
						{t("admin.categoriesSubtitle")}
					</p>
				</div>
				<Button onClick={() => setShowAddCategory(true)}>
					<Plus className="h-4 w-4" />
					{t("admin.addCategory")}
				</Button>
			</div>

			<div className="space-y-4">
				{categories?.map((category) => {
					const isExpanded = expandedCategories.has(category.id);
					const totalCharts = category.subcategories.reduce(
						(sum, sub) => sum + sub._count.sizeCharts,
						0
					);

					return (
						<div key={category.id} className="rounded-lg border bg-card">
							<div className="flex items-center justify-between px-4 py-3 hover:bg-muted rounded-lg">
								<div
									className="flex flex-1 cursor-pointer items-center gap-3"
									onClick={() => toggleExpand(category.id)}
								>
									<ChevronRight
										className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""
											}`}
									/>
									<FolderTree className="h-5 w-5 text-muted-foreground" />
									<span className="font-medium">{category.name}</span>
									<Badge variant="outline" className="text-xs">
										{category.subcategories.length} {t("admin.subcategories")}
									</Badge>
									<Badge variant="secondary" className="text-xs">
										{totalCharts} {t("admin.charts")}
									</Badge>
								</div>
								<div className="flex items-center gap-1">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setCategoryName(category.name);
											setEditingCategory(category);
										}}
										className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
										title={t("admin.editCategoryTitle")}
									>
										<Pencil className="h-4 w-4" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setDeletingCategory(category);
										}}
										className="rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
										title={t("admin.deleteCategoryTitle")}
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>

							{isExpanded && (
								<div className="border-t">
									{category.subcategories.length === 0 ? (
										<div className="px-12 py-4 text-sm text-muted-foreground">
											{t("admin.noSubcategories")}
										</div>
									) : (
										<div className="divide-y">
											{category.subcategories.map((subcategory) => {
												const isSubExpanded = expandedSubcategories.has(subcategory.id);
												const charts = subcategory.sizeCharts || [];
												const hasCharts = charts.length > 0;

												return (
													<div key={subcategory.id}>
														<div className="flex items-center justify-between px-8 py-3 hover:bg-muted">
															<div
																className="flex flex-1 cursor-pointer items-center gap-3"
																onClick={() => hasCharts && toggleSubcategoryExpand(subcategory.id)}
															>
																{hasCharts ? (
																	isSubExpanded ? (
																		<ChevronDown className="h-4 w-4 text-muted-foreground" />
																	) : (
																		<ChevronRight className="h-4 w-4 text-muted-foreground" />
																	)
																) : (
																	<div className="w-4" />
																)}
																<TableProperties className="h-4 w-4 text-muted-foreground" />
																<span>{subcategory.name}</span>
																<Badge variant="secondary" className="text-xs">
																	{subcategory._count.sizeCharts} {t("admin.charts")}
																</Badge>
															</div>
															<div className="flex items-center gap-1">
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		setSubcategoryName(subcategory.name);
																		setEditingSubcategory({ sub: subcategory, categoryId: category.id });
																	}}
																	className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
																	title={t("admin.editSubcategoryTitle")}
																>
																	<Pencil className="h-3.5 w-3.5" />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		setDeletingSubcategory(subcategory);
																	}}
																	className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
																	title={t("admin.deleteSubcategoryTitle")}
																>
																	<Trash2 className="h-3.5 w-3.5" />
																</button>
															</div>
														</div>

														{isSubExpanded && hasCharts && (
															<div className="border-t bg-muted/30">
																{charts.map(({ sizeChart }) => (
																	<div
																		key={sizeChart.id}
																		className="flex items-center justify-between px-16 py-2 hover:bg-muted"
																	>
																		<div className="flex items-center gap-3">
																			<FileText className="h-3.5 w-3.5 text-muted-foreground" />
																			<span className="text-sm">{sizeChart.name}</span>
																			{sizeChart.isPublished ? (
																				<Badge variant="default" className="text-xs">
																					{t("admin.published")}
																				</Badge>
																			) : (
																				<Badge variant="outline" className="text-xs">
																					{t("admin.draft")}
																				</Badge>
																			)}
																		</div>
																		<Link
																			href={`/admin/size-charts/${sizeChart.id}`}
																			className="flex items-center gap-1 text-xs text-primary hover:underline"
																			onClick={(e) => e.stopPropagation()}
																		>
																			{t("admin.edit")} <ExternalLink className="h-3 w-3" />
																		</Link>
																	</div>
																))}
															</div>
														)}
													</div>
												);
											})}
										</div>
									)}

									{addingSubcategoryTo === category.id ? (
										<div className="flex items-center gap-2 border-t px-12 py-3">
											<Input
												value={subcategoryName}
												onChange={(e) => setSubcategoryName(e.target.value)}
												placeholder={t("admin.subcategoryNamePlaceholder")}
												className="max-w-xs"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleAddSubcategory(category.id);
													}
													if (e.key === "Escape") {
														setAddingSubcategoryTo(null);
														setSubcategoryName("");
													}
												}}
												autoFocus
											/>
											<Button
												size="sm"
												onClick={() => handleAddSubcategory(category.id)}
												disabled={saving}
											>
												{t("admin.add")}
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => {
													setAddingSubcategoryTo(null);
													setSubcategoryName("");
												}}
											>
												{t("admin.cancel")}
											</Button>
										</div>
									) : (
										<div className="border-t px-12 py-3">
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													setAddingSubcategoryTo(category.id);
												}}
											>
												<Plus className="h-4 w-4" />
												{t("admin.addSubcategory")}
											</Button>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Add Category Dialog */}
			<Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.addCategory")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<InputWithLabel
							label={t("admin.categoryName")}
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							placeholder={t("admin.categoryPlaceholder")}
							onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowAddCategory(false)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleAddCategory} disabled={saving}>
							{saving ? t("admin.creating") : t("admin.createCategory")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Category Dialog */}
			<Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.editCategoryTitle")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<InputWithLabel
							label={t("admin.categoryName")}
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							placeholder={t("admin.categoryName")}
							onKeyDown={(e) => e.key === "Enter" && handleEditCategory()}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingCategory(null)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleEditCategory} disabled={saving}>
							{saving ? t("admin.saving") : t("admin.saveChanges")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Category Dialog */}
			<Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.deleteCategoryTitle")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<p className="text-muted-foreground">
							{t("admin.confirmDelete")} <strong>{deletingCategory?.name}</strong>?
						</p>
						{deletingCategory && deletingCategory.subcategories.some((s) => s._count.sizeCharts > 0) && (
							<p className="mt-2 text-sm text-amber-600">
								{t("admin.categoryHasCharts")}
							</p>
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeletingCategory(null)}>
							{t("admin.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteCategory}
							disabled={saving}
						>
							{saving ? t("admin.deleting") : t("admin.deleteCategoryBtn")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Subcategory Dialog */}
			<Dialog open={!!editingSubcategory} onOpenChange={() => setEditingSubcategory(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.editSubcategoryTitle")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<InputWithLabel
							label={t("admin.subcategoryName")}
							value={subcategoryName}
							onChange={(e) => setSubcategoryName(e.target.value)}
							placeholder={t("admin.subcategoryNamePlaceholder")}
							onKeyDown={(e) => e.key === "Enter" && handleEditSubcategory()}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingSubcategory(null)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleEditSubcategory} disabled={saving}>
							{saving ? t("admin.saving") : t("admin.saveChanges")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Subcategory Dialog */}
			<Dialog open={!!deletingSubcategory} onOpenChange={() => setDeletingSubcategory(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.deleteSubcategoryTitle")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<p className="text-muted-foreground">
							{t("admin.confirmDelete")} <strong>{deletingSubcategory?.name}</strong>?
						</p>
						{deletingSubcategory && deletingSubcategory._count.sizeCharts > 0 && (
							<p className="mt-2 text-sm text-amber-600">
								{t("admin.subcategoryHasCharts")}
							</p>
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeletingSubcategory(null)}>
							{t("admin.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteSubcategory}
							disabled={saving}
						>
							{saving ? t("admin.deleting") : t("admin.deleteSubcategoryBtn")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

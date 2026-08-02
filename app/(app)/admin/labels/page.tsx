"use client";

import { useState, useMemo } from "react";
import {
	Button,
	Input,
	Badge,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	SimpleSelect,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Skeleton,
	InputWithLabel,
	SelectWithLabel,
} from "@/components/ui";
import {
	useLabels,
	useCreateLabel,
	useUpdateLabel,
	useDeleteLabel,
	useLabelTypeConfigs,
	useUpdateLabelTypeConfig,
	useResetLabelTypeConfig,
	type LabelTypeConfigData,
} from "@/hooks/use-labels";
import { useToast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, Tag, Search, Settings, RotateCcw } from "lucide-react";
import { LABEL_TYPES } from "@/lib/constants";
import type { LabelType, SizeLabel } from "@prisma/client";
import { useLocale } from "@/hooks/use-locale";

export default function LabelsPage() {
	const [filterType, setFilterType] = useState<string>("");
	const [search, setSearch] = useState("");
	const [editingLabel, setEditingLabel] = useState<SizeLabel | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [labelToDelete, setLabelToDelete] = useState<SizeLabel | null>(null);

	// Label type config state
	const [editingLabelType, setEditingLabelType] = useState<LabelTypeConfigData | null>(null);
	const [labelTypeDisplayName, setLabelTypeDisplayName] = useState("");
	const [labelTypeDescription, setLabelTypeDescription] = useState("");
	const [showLabelTypeSettings, setShowLabelTypeSettings] = useState(false);

	// Form state
	const [formKey, setFormKey] = useState("");
	const [formDisplayValue, setFormDisplayValue] = useState("");
	const [formLabelType, setFormLabelType] = useState<LabelType>("ALPHA_SIZE");
	const [formSortOrder, setFormSortOrder] = useState("0");
	const [formDescription, setFormDescription] = useState("");

	const { addToast } = useToast();
	const { t } = useLocale();
	const { data: labels, isLoading } = useLabels({
		type: filterType as LabelType | undefined,
	});
	const { data: labelTypeConfigs } = useLabelTypeConfigs();
	const createMutation = useCreateLabel();
	const updateMutation = useUpdateLabel();
	const deleteMutation = useDeleteLabel();
	const updateLabelTypeMutation = useUpdateLabelTypeConfig();
	const resetLabelTypeMutation = useResetLabelTypeConfig();

	// Group labels by type for display
	const groupedLabels = useMemo(() => {
		if (!labels) return {};

		let filtered = labels;
		if (search) {
			const searchLower = search.toLowerCase();
			filtered = labels.filter(
				(l) =>
					l.key.toLowerCase().includes(searchLower) ||
					l.displayValue.toLowerCase().includes(searchLower)
			);
		}

		return filtered.reduce((acc, label) => {
			const type = label.labelType;
			if (!acc[type]) acc[type] = [];
			acc[type].push(label);
			return acc;
		}, {} as Record<string, SizeLabel[]>);
	}, [labels, search]);

	// Generate select options using custom configs when available
	// Must be before any early returns to maintain hook order
	const labelTypeOptions = useMemo(() => {
		if (!labelTypeConfigs) {
			return LABEL_TYPES.map((t) => ({ value: t.value, label: t.label }));
		}
		return labelTypeConfigs.map((c) => ({
			value: c.labelType,
			label: c.displayName,
		}));
	}, [labelTypeConfigs]);

	const resetForm = () => {
		setFormKey("");
		setFormDisplayValue("");
		setFormLabelType("ALPHA_SIZE");
		setFormSortOrder("0");
		setFormDescription("");
	};

	const openCreateDialog = () => {
		resetForm();
		setIsCreateOpen(true);
	};

	const openEditDialog = (label: SizeLabel) => {
		setEditingLabel(label);
		setFormKey(label.key);
		setFormDisplayValue(label.displayValue);
		setFormLabelType(label.labelType);
		setFormSortOrder(label.sortOrder.toString());
		setFormDescription(label.description || "");
	};

	const handleCreate = async () => {
		if (!formKey.trim() || !formDisplayValue.trim()) {
			addToast(t("admin.labelRequired"), "error");
			return;
		}

		try {
			await createMutation.mutateAsync({
				key: formKey.toUpperCase().replace(/[^A-Z0-9_]/g, "_"),
				displayValue: formDisplayValue,
				labelType: formLabelType,
				sortOrder: parseInt(formSortOrder) || 0,
				description: formDescription || null,
			});
			addToast(t("admin.labelCreated"), "success");
			setIsCreateOpen(false);
			resetForm();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.labelCreateFailed"), "error");
		}
	};

	const handleUpdate = async () => {
		if (!editingLabel) return;
		if (!formKey.trim() || !formDisplayValue.trim()) {
			addToast(t("admin.labelRequired"), "error");
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: editingLabel.id,
				key: formKey.toUpperCase().replace(/[^A-Z0-9_]/g, "_"),
				displayValue: formDisplayValue,
				labelType: formLabelType,
				sortOrder: parseInt(formSortOrder) || 0,
				description: formDescription || null,
			});
			addToast(t("admin.labelUpdated"), "success");
			setEditingLabel(null);
			resetForm();
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.labelUpdateFailed"), "error");
		}
	};

	const handleDelete = async () => {
		if (!labelToDelete) return;

		try {
			await deleteMutation.mutateAsync(labelToDelete.id);
			addToast(t("admin.labelDeleted"), "success");
			setDeleteDialogOpen(false);
			setLabelToDelete(null);
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.labelDeleteFailed"), "error");
		}
	};

	const getLabelTypeInfo = (type: string) => {
		// Use custom config if available, otherwise fall back to defaults
		const customConfig = labelTypeConfigs?.find((c) => c.labelType === type);
		const defaultConfig = LABEL_TYPES.find((t) => t.value === type);

		return {
			label: customConfig?.displayName ?? defaultConfig?.label ?? type,
			description: customConfig?.description ?? defaultConfig?.description ?? "",
			isCustomized: customConfig?.isCustomized ?? false,
		};
	};

	const openEditLabelTypeDialog = (config: LabelTypeConfigData) => {
		setEditingLabelType(config);
		setLabelTypeDisplayName(config.displayName);
		setLabelTypeDescription(config.description || "");
	};

	const handleUpdateLabelType = async () => {
		if (!editingLabelType) return;
		if (!labelTypeDisplayName.trim()) {
			addToast(t("admin.displayNameRequired"), "error");
			return;
		}

		try {
			await updateLabelTypeMutation.mutateAsync({
				labelType: editingLabelType.labelType,
				displayName: labelTypeDisplayName,
				description: labelTypeDescription || null,
			});
			addToast(t("admin.labelTypeUpdated"), "success");
			setEditingLabelType(null);
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.labelTypeUpdateFailed"), "error");
		}
	};

	const handleResetLabelType = async (labelType: string) => {
		try {
			await resetLabelTypeMutation.mutateAsync(labelType);
			addToast(t("admin.labelTypeReset"), "success");
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.labelTypeResetFailed"), "error");
		}
	};

	if (isLoading) {
		return (
			<div>
				<h1 className="mb-6 text-2xl font-bold">{t("admin.sizeLabels")}</h1>
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
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
					<h1 className="text-2xl font-bold">{t("admin.sizeLabels")}</h1>
					<p className="text-muted-foreground">
						{t("admin.labelsSubtitle")}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setShowLabelTypeSettings(!showLabelTypeSettings)}>
						<Settings className="h-4 w-4" />
						{showLabelTypeSettings ? t("admin.hide") : t("admin.labelTypes")}
					</Button>
					<Button onClick={openCreateDialog}>
						<Plus className="h-4 w-4" />
						{t("admin.newLabel")}
					</Button>
				</div>
			</div>

			{/* Label Type Settings Panel */}
			{showLabelTypeSettings && (
				<div className="mb-6 rounded-lg border bg-muted/30 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Settings className="h-5 w-5 text-muted-foreground" />
						<h2 className="font-semibold">{t("admin.labelTypeSettings")}</h2>
						<span className="text-sm text-muted-foreground">{t("admin.labelTypeSettingsDesc")}</span>
					</div>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{labelTypeConfigs?.map((config) => {
							const defaultConfig = LABEL_TYPES.find((t) => t.value === config.labelType);
							return (
								<div
									key={config.labelType}
									className="flex items-center justify-between rounded-md border bg-background p-3"
								>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium truncate">{config.displayName}</span>
											{config.isCustomized && (
												<Badge variant="secondary" className="shrink-0 text-xs">{t("admin.custom")}</Badge>
											)}
										</div>
										{config.displayName !== defaultConfig?.label && (
											<p className="text-xs text-muted-foreground truncate">
												{t("admin.default")}: {defaultConfig?.label}
											</p>
										)}
									</div>
									<div className="flex items-center gap-1 ml-2">
										<button
											onClick={() => openEditLabelTypeDialog(config)}
											className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
											title={t("admin.editDisplayName")}
										>
											<Pencil className="h-4 w-4" />
										</button>
										{config.isCustomized && (
											<button
												onClick={() => handleResetLabelType(config.labelType)}
												className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
												title={t("admin.resetToDefault")}
												disabled={resetLabelTypeMutation.isPending}
											>
												<RotateCcw className="h-4 w-4" />
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="flex-1 min-w-[200px] max-w-xs relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder={t("admin.searchLabels")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<SimpleSelect
					options={[
						{ value: "", label: t("admin.allTypes") },
						...labelTypeOptions,
					]}
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					className="w-44"
				/>
			</div>

			{Object.keys(groupedLabels).length === 0 ? (
				<div className="rounded-lg border-2 border-dashed p-8 text-center">
					<Tag className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-semibold">{t("admin.noLabels")}</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						{search ? t("admin.tryDifferentSearch") : t("admin.createFirstLabel")}
					</p>
					{!search && (
						<Button className="mt-4" onClick={openCreateDialog}>
							<Plus className="h-4 w-4" />
							{t("admin.createLabel")}
						</Button>
					)}
				</div>
			) : (
				<div className="space-y-6">
					{Object.entries(groupedLabels)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([type, typeLabels]) => {
							const typeInfo = getLabelTypeInfo(type);
							return (
								<div key={type} className="rounded-lg border">
									<div className="border-b bg-muted/50 px-4 py-3">
										<div className="flex items-center gap-2">
											<Tag className="h-4 w-4 text-muted-foreground" />
											<span className="font-semibold">{typeInfo.label}</span>
											<span className="text-sm text-muted-foreground">
												({typeLabels.length})
											</span>
										</div>
										{typeInfo.description && (
											<p className="mt-1 text-sm text-muted-foreground">
												{typeInfo.description}
											</p>
										)}
									</div>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-40">{t("admin.keyLabel")}</TableHead>
												<TableHead>{t("admin.displayValue")}</TableHead>
												<TableHead className="w-24">{t("admin.sortOrder")}</TableHead>
												<TableHead>{t("admin.description")}</TableHead>
												<TableHead className="w-24"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{typeLabels
												.sort((a, b) => a.sortOrder - b.sortOrder || a.displayValue.localeCompare(b.displayValue))
												.map((label) => (
													<TableRow key={label.id}>
														<TableCell>
															<code className="rounded bg-muted px-1.5 py-0.5 text-sm">
																{label.key}
															</code>
														</TableCell>
														<TableCell className="font-medium">
															{label.displayValue}
														</TableCell>
														<TableCell className="text-muted-foreground">
															{label.sortOrder}
														</TableCell>
														<TableCell className="text-sm text-muted-foreground">
															{label.description || "—"}
														</TableCell>
														<TableCell>
															<div className="flex items-center justify-end gap-1">
																<button
																	onClick={() => openEditDialog(label)}
																	className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
																	title={t("admin.edit")}
																>
																	<Pencil className="h-4 w-4" />
																</button>
																<button
																	onClick={() => {
																		setLabelToDelete(label);
																		setDeleteDialogOpen(true);
																	}}
																	className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
																	title={t("admin.delete")}
																>
																	<Trash2 className="h-4 w-4" />
																</button>
															</div>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</div>
							);
						})}
				</div>
			)}

			{/* Create Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.createSizeLabel")}</DialogTitle>
						<DialogDescription>
							{t("admin.createSizeLabelDesc")}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<InputWithLabel
								label={t("admin.keyLabel")}
								value={formKey}
								onChange={(e) => setFormKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
								placeholder="SIZE_XS"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.keyHint")}</p>
						</div>
						<div>
							<InputWithLabel
								label={t("admin.displayValue")}
								value={formDisplayValue}
								onChange={(e) => setFormDisplayValue(e.target.value)}
								placeholder="XS"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.displayValueHint")}</p>
						</div>
						<SelectWithLabel
							label={t("admin.labelType")}
							options={(labelTypeConfigs || LABEL_TYPES.map((t) => ({ labelType: t.value, displayName: t.label, description: t.description }))).map((c) => {
								const defaultDesc = LABEL_TYPES.find((t) => t.value === c.labelType)?.description;
								return {
									value: c.labelType,
									label: `${c.displayName} - ${c.description || defaultDesc || ""}`,
								};
							})}
							value={formLabelType}
							onChange={(e) => setFormLabelType(e.target.value as LabelType)}
						/>
						<div>
							<InputWithLabel
								label={t("admin.sortOrder")}
								type="number"
								value={formSortOrder}
								onChange={(e) => setFormSortOrder(e.target.value)}
								placeholder="0"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.sortOrderHint")}</p>
						</div>
						<InputWithLabel
							label={t("admin.descriptionOptional")}
							value={formDescription}
							onChange={(e) => setFormDescription(e.target.value)}
							placeholder="Extra small size"
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleCreate} disabled={createMutation.isPending}>
							{t("admin.create")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={!!editingLabel} onOpenChange={(open) => !open && setEditingLabel(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.editSizeLabel")}</DialogTitle>
						<DialogDescription>
							{t("admin.editSizeLabelDesc")}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<InputWithLabel
								label={t("admin.keyLabel")}
								value={formKey}
								onChange={(e) => setFormKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
								placeholder="SIZE_XS"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.keyHint")}</p>
						</div>
						<div>
							<InputWithLabel
								label={t("admin.displayValue")}
								value={formDisplayValue}
								onChange={(e) => setFormDisplayValue(e.target.value)}
								placeholder="XS"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.displayValueHint")}</p>
						</div>
						<SelectWithLabel
							label={t("admin.labelType")}
							options={(labelTypeConfigs || LABEL_TYPES.map((t) => ({ labelType: t.value, displayName: t.label, description: t.description }))).map((c) => {
								const defaultDesc = LABEL_TYPES.find((t) => t.value === c.labelType)?.description;
								return {
									value: c.labelType,
									label: `${c.displayName} - ${c.description || defaultDesc || ""}`,
								};
							})}
							value={formLabelType}
							onChange={(e) => setFormLabelType(e.target.value as LabelType)}
						/>
						<div>
							<InputWithLabel
								label={t("admin.sortOrder")}
								type="number"
								value={formSortOrder}
								onChange={(e) => setFormSortOrder(e.target.value)}
								placeholder="0"
							/>
							<p className="mt-1 text-xs text-muted-foreground">{t("admin.sortOrderHint")}</p>
						</div>
						<InputWithLabel
							label={t("admin.descriptionOptional")}
							value={formDescription}
							onChange={(e) => setFormDescription(e.target.value)}
							placeholder="Extra small size"
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingLabel(null)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleUpdate} disabled={updateMutation.isPending}>
							{t("admin.saveChanges")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.deleteLabel")}</DialogTitle>
						<DialogDescription>
							{t("admin.deleteLabelDesc")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setLabelToDelete(null);
							}}
						>
							{t("admin.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
						>
							{t("admin.delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Label Type Dialog */}
			<Dialog open={!!editingLabelType} onOpenChange={(open) => !open && setEditingLabelType(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.editLabelType")}</DialogTitle>
						<DialogDescription>
							{t("admin.editLabelTypeDesc")} &quot;{
								LABEL_TYPES.find((t) => t.value === editingLabelType?.labelType)?.label
							}&quot;
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<InputWithLabel
								label={t("admin.displayName")}
								value={labelTypeDisplayName}
								onChange={(e) => setLabelTypeDisplayName(e.target.value)}
								placeholder="e.g., General Size, Shirt Size"
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								{t("admin.displayNameHint")}
							</p>
						</div>
						<div>
							<InputWithLabel
								label={t("admin.descriptionOptional")}
								value={labelTypeDescription}
								onChange={(e) => setLabelTypeDescription(e.target.value)}
								placeholder="Brief description of this label type"
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								{t("admin.labelTypeDescHint")}
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingLabelType(null)}>
							{t("admin.cancel")}
						</Button>
						<Button onClick={handleUpdateLabelType} disabled={updateLabelTypeMutation.isPending}>
							{t("admin.saveChanges")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, InputWithLabel, SelectWithLabel } from "@/components/ui";
import { SizeChartEditor, MeasurementInstructionsSelector, type EditorState, type EditorColumn, type EditorRow, type EditorCell } from "@/components/admin/size-chart-editor";
import { TemplatePicker } from "@/components/admin/template-picker";
import { useCategories } from "@/hooks/use-categories";
import { useLabels } from "@/hooks/use-labels";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Save, Eye, LayoutTemplate, Plus } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const initialState: EditorState = {
  name: "",
  description: "",
  subcategoryIds: [],
  measurementInstructionIds: [],
  isPublished: false,
  columns: [
    { name: "Size", columnType: "SIZE_LABEL", displayOrder: 0 },
    { name: "Waist", columnType: "MEASUREMENT", displayOrder: 1 },
    { name: "Hip", columnType: "MEASUREMENT", displayOrder: 2 },
  ],
  rows: [],
};

// Map template column types to editor column types
function mapTemplateColumnType(type: string): EditorColumn["columnType"] {
  switch (type) {
    case "SIZE_LABEL":
      return "SIZE_LABEL";
    case "SHOE_SIZE":
      return "SHOE_SIZE";
    case "MEASUREMENT":
      return "MEASUREMENT";
    case "BAND_SIZE":
      return "BAND_SIZE";
    case "CUP_SIZE":
      return "CUP_SIZE";
    case "TEXT":
    default:
      return "TEXT";
  }
}

// Helper to convert inches to cm
function inToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

// Template type for type safety
interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  suggestedCategories: string[];
  measurementInstructions: string[];
  columns: Array<{ name: string; type: string }>;
  rows: Array<Record<string, unknown>>;
  variants?: Record<string, { name: string; description: string; rows: Array<Record<string, unknown>> }>;
}

export default function NewSizeChartPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useLocale();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: labels } = useLabels();

  const [state, setState] = useState<EditorState>(initialState);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [fromTemplate, setFromTemplate] = useState(false);

  // Handle template selection
  const handleTemplateSelect = (template: TemplateData, variantKey?: string) => {
    // Get the rows to use
    const templateRows = variantKey && template.variants?.[variantKey]
      ? template.variants[variantKey].rows
      : template.rows;

    // Map template columns to editor columns
    const columns: EditorColumn[] = template.columns.map((col, idx) => ({
      name: col.name,
      columnType: mapTemplateColumnType(col.type),
      displayOrder: idx,
    }));

    // Map template rows to editor rows with cells
    const rows: EditorRow[] = templateRows.map((templateRow, rowIdx) => {
      const cells: EditorCell[] = columns.map((col, colIdx) => {
        const cellValue = templateRow[col.name];

        // Initialize cell with all required properties
        const cell: EditorCell = {
          columnIndex: colIdx,
          valueInches: null,
          valueCm: null,
          valueText: null,
          valueMinInches: null,
          valueMaxInches: null,
          valueMinCm: null,
          valueMaxCm: null,
          labelId: null,
        };

        if (typeof cellValue === "string") {
          cell.valueText = cellValue;
        } else if (typeof cellValue === "object" && cellValue !== null) {
          if ("min" in cellValue && "max" in cellValue) {
            const range = cellValue as { min: number; max: number };
            cell.valueMinInches = range.min;
            cell.valueMaxInches = range.max;
            cell.valueMinCm = inToCm(range.min);
            cell.valueMaxCm = inToCm(range.max);
          } else if ("value" in cellValue) {
            const single = cellValue as { value: number };
            cell.valueInches = single.value;
            cell.valueCm = inToCm(single.value);
          }
        }

        return cell;
      });

      return { displayOrder: rowIdx, cells };
    });

    // Set the state with template data
    setState({
      name: template.name + (variantKey ? ` (${variantKey})` : ""),
      description: template.description,
      subcategoryIds: [],
      measurementInstructionIds: [],
      isPublished: false,
      columns,
      rows,
    });

    setFromTemplate(true);
    addToast(`${t("admin.templateLoaded")}: ${template.name}`, "success");
  };

  // Reset to blank state
  const handleStartBlank = () => {
    setState(initialState);
    setFromTemplate(false);
    setSelectedCategory("");
    setCustomSlug("");
  };

  const subcategories = selectedCategory
    ? categories?.find((c) => c.id === selectedCategory)?.subcategories || []
    : [];

  const handleSave = async (publish = false) => {
    if (!state.name.trim()) {
      addToast(t("admin.enterChartName"), "error");
      return;
    }

    if (state.subcategoryIds.length === 0) {
      addToast(t("admin.selectCategorySubcategory"), "error");
      return;
    }

    if (state.columns.length === 0) {
      addToast(t("admin.addOneColumn"), "error");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/size-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          slug: customSlug || undefined,
          description: state.description || undefined,
          subcategoryIds: state.subcategoryIds,
          columns: state.columns.map((col, index) => ({
            name: col.name,
            columnType: col.columnType,
            displayOrder: index,
          })),
          rows: state.rows.map((row, rowIndex) => ({
            displayOrder: rowIndex,
            cells: row.cells.map((cell, cellIndex) => ({
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
        throw new Error(error.error || "Failed to create size chart");
      }

      const chart = await response.json();

      if (publish) {
        await fetch(`/api/size-charts/${chart.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: true }),
        });
      }

      addToast(t("admin.chartCreated"), "success");
      router.push(`/admin/size-charts/${chart.id}`);
    } catch (error) {
      addToast(error instanceof Error ? error.message : t("admin.chartCreateFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

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
          <div>
            <h1 className="text-2xl font-bold">
              {t("admin.newSizeChart")}
            </h1>
            {fromTemplate && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("admin.fromTemplateHint")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TemplatePicker
              onSelect={handleTemplateSelect}
              trigger={
                <Button variant="outline">
                  <LayoutTemplate className="h-4 w-4" />
                  {fromTemplate ? t("admin.changeTemplate") : t("admin.startFromTemplate")}
                </Button>
              }
            />
            {fromTemplate && (
              <Button variant="ghost" onClick={handleStartBlank}>
                <Plus className="h-4 w-4" />
                {t("admin.startBlank")}
              </Button>
            )}
            <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
              <Save className="h-4 w-4" />
              {t("admin.saveAsDraft")}
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              <Eye className="h-4 w-4" />
              {t("admin.saveAndPublish")}
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
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="e.g., Regular Fit, Contour Fit"
            />
            <InputWithLabel
              label={t("admin.chartId")}
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g., regular-fit (auto-generated if empty)"
            />
            <div className="sm:col-span-2">
              <InputWithLabel
                label={t("admin.descriptionOptional")}
                value={state.description}
                onChange={(e) => setState({ ...state, description: e.target.value })}
                placeholder="Brief description of this size chart"
              />
            </div>
            <SelectWithLabel
              label={t("admin.category")}
              options={[
                { value: "", label: t("admin.selectCategory") },
                ...(categories?.map((c) => ({ value: c.id, label: c.name })) || []),
              ]}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setState({ ...state, subcategoryIds: [] });
              }}
              disabled={categoriesLoading}
            />
            <SelectWithLabel
              label={t("admin.subcategory")}
              options={[
                { value: "", label: t("admin.selectSubcategory") },
                ...subcategories.map((s) => ({ value: s.id, label: s.name })),
              ]}
              value={state.subcategoryIds[0] || ""}
              onChange={(e) => setState({ ...state, subcategoryIds: e.target.value ? [e.target.value] : [] })}
              disabled={!selectedCategory}
            />
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
            onChange={(ids) => setState({ ...state, measurementInstructionIds: ids })}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {t("admin.sizeChartData")}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("admin.sizeChartDataDesc")}
          </p>
          <SizeChartEditor state={state} onChange={setState} labels={labels} />
        </div>
      </div>
    </div>
  );
}

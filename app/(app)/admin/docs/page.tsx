"use client";

import Link from "next/link";
import { BookOpen, Code, History, ArrowRight, Code2, FileUp, ExternalLink } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const docsDefs = [
  {
    titleKey: "admin.gettingStarted",
    descKey: "admin.docs.gsDesc",
    href: "/admin/docs/getting-started",
    icon: BookOpen,
  },
  {
    titleKey: "admin.apiReference",
    descKey: "admin.docs.apiDesc",
    href: "/admin/docs/api",
    icon: Code,
  },
  {
    titleKey: "docs.embedWidget",
    descKey: "admin.docs.embedDesc",
    href: "/admin/docs/embed",
    icon: Code2,
  },
  {
    titleKey: "admin.docs.changelogTitle",
    descKey: "admin.docs.changelogDesc",
    href: "/admin/docs/changelog",
    icon: History,
  },
];

export default function DocsPage() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("admin.documentation")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("admin.docs.intro")}
        </p>
      </div>

      <div className="grid gap-4">
        {docsDefs.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="group rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <doc.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {t(doc.titleKey)}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {t(doc.descKey)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 font-semibold">{t("admin.docs.quickLinks")}</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <Link href="/admin/size-charts/new" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlNewChart")}
          </Link>
          <Link href="/admin/labels" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlLabels")}
          </Link>
          <Link href="/admin/categories" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlCategories")}
          </Link>
          <Link href="/admin/api-keys" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlApiKeys")}
          </Link>
          <Link href="/size-guide" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlSizeGuide")}
          </Link>
          <Link href="/examples/embed" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlEmbed")}
          </Link>
          <a href="/examples/example.html" className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            → {t("admin.docs.qlStandalone")} <ExternalLink className="inline h-3 w-3 ml-1" />
          </a>
          <Link href="/api/docs" className="text-sm text-primary hover:underline">
            → {t("admin.docs.qlSwagger")}
          </Link>
        </div>
      </div>

      {/* Import/Export Info */}
      <div className="mt-6 rounded-lg border bg-muted/50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{t("admin.docs.importExport")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("admin.docs.importExportDesc")}{" "}
              <Link href="/admin/size-charts" className="text-primary hover:underline">
                {t("admin.docs.sizeChartsPage")}
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

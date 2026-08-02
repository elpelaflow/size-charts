"use client";

import { CheckCircle2, Clock, HelpCircle } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

interface ReleaseItemProps {
	title: string;
	items: string[];
}

function ReleaseItem({ title, items }: ReleaseItemProps) {
	return (
		<div className="pl-6 border-l-2 border-primary/20">
			<h3 className="font-medium text-foreground">{title}</h3>
			<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
				{items.map((item, i) => (
					<li key={i}>{item}</li>
				))}
			</ul>
		</div>
	);
}

interface ChangelogContentProps {
	showTitle?: boolean;
	className?: string;
}

export function ChangelogContent({ showTitle = true, className = "" }: ChangelogContentProps) {
	const { t } = useLocale();

	return (
		<div className={className}>
			{showTitle && (
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-foreground">{t("docs.changelog")}</h1>
					<p className="mt-2 text-muted-foreground">
						{t("docs.changelog.intro")}
					</p>
				</div>
			)}

			{/* Current Version Banner */}
			<div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
				<div className="flex items-center gap-2 mb-1">
					<div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
					<span className="text-sm font-medium text-primary">{t("docs.changelog.inDev")}</span>
				</div>
				<p className="text-sm text-muted-foreground">
					{t("docs.changelog.inDevDesc")}
				</p>
			</div>

			{/* v0.6.0 - Latest Stable */}
			<section className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<CheckCircle2 className="h-5 w-5 text-[oklch(0.65_0.20_160)]" />
					<h2 className="text-lg font-semibold text-foreground">v0.6.0</h2>
					<span className="text-sm text-muted-foreground">{t("docs.changelog.productionReady")}</span>
				</div>
				<div className="space-y-4">
					<ReleaseItem
						title={t("docs.changelog.security")}
						items={[
							t("docs.changelog.security1"),
							t("docs.changelog.security2"),
							t("docs.changelog.security3"),
							t("docs.changelog.security4"),
						]}
					/>
					<ReleaseItem
						title={t("docs.changelog.dataMgmt")}
						items={[
							t("docs.changelog.data1"),
							t("docs.changelog.data2"),
							t("docs.changelog.data3"),
							t("docs.changelog.data4"),
						]}
					/>
					<ReleaseItem
						title={t("docs.changelog.infra")}
						items={[
							t("docs.changelog.infra1"),
							t("docs.changelog.infra2"),
						]}
					/>
				</div>
			</section>

			{/* v0.1.0 - Alpha */}
			<section className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<CheckCircle2 className="h-5 w-5 text-[oklch(0.65_0.20_160)]" />
					<h2 className="text-lg font-semibold text-foreground">v0.1.0</h2>
					<span className="text-sm text-muted-foreground">{t("docs.changelog.alpha")}</span>
				</div>
				<div className="space-y-4">
					<ReleaseItem
						title={t("docs.changelog.core")}
						items={[
							t("docs.changelog.core1"),
							t("docs.changelog.core2"),
							t("docs.changelog.core3"),
							t("docs.changelog.core4"),
						]}
					/>
					<ReleaseItem
						title={t("docs.changelog.adminInterface")}
						items={[
							t("docs.changelog.admin1"),
							t("docs.changelog.admin2"),
							t("docs.changelog.admin3"),
						]}
					/>
				</div>
			</section>

			{/* In Progress */}
			<section className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<Clock className="h-5 w-5 text-primary" />
					<h2 className="text-lg font-semibold text-foreground">v1.0</h2>
					<span className="text-sm text-muted-foreground">{t("docs.changelog.inProgress")}</span>
				</div>
				<div className="space-y-4">
					<ReleaseItem
						title={t("docs.changelog.integration")}
						items={[
							t("docs.changelog.integration1"),
							t("docs.changelog.integration2"),
						]}
					/>
					<ReleaseItem
						title={t("docs.changelog.productivity")}
						items={[
							t("docs.changelog.productivity1"),
							t("docs.changelog.productivity2"),
						]}
					/>
				</div>
			</section>

			{/* Considering */}
			<section>
				<div className="flex items-center gap-2 mb-4">
					<HelpCircle className="h-5 w-5 text-muted-foreground" />
					<h2 className="text-lg font-semibold text-foreground">{t("docs.changelog.considering")}</h2>
				</div>
				<ul className="pl-6 text-sm text-muted-foreground space-y-1">
					<li>{t("docs.changelog.consider1")}</li>
					<li>{t("docs.changelog.consider2")}</li>
					<li>{t("docs.changelog.consider3")}</li>
					<li>{t("docs.changelog.consider4")}</li>
					<li>{t("docs.changelog.consider5")}</li>
					<li>{t("docs.changelog.consider6")}</li>
					<li>{t("docs.changelog.consider7")}</li>
				</ul>
			</section>
		</div>
	);
}

"use client";

import { useLocale } from "@/hooks/use-locale";

interface DemoBannerProps {
	className?: string;
}

export function DemoBanner({ className }: DemoBannerProps) {
	const { t } = useLocale();

	return (
		<div
			className={`w-full bg-gradient-to-r from-primary via-[oklch(0.58_0.28_305)] to-accent shadow-[0_2px_12px_oklch(0.55_0.28_295_/_0.35)] px-4 py-2.5 relative z-50 ${className}`}
		>
			<div className="flex items-center justify-center text-sm">
				<span className="font-semibold text-white tracking-widest uppercase">
					{t("admin.demoMode")}
				</span>
			</div>
		</div>
	);
}

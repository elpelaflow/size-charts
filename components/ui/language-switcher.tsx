"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

/**
 * Language switcher button that toggles between EN and ES.
 * Placed next to the ThemeToggle in headers.
 */
export function LanguageSwitcher() {
	const { locale, setLocale, isLoaded } = useLocale();

	if (!isLoaded) {
		return (
			<button
				className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground"
				aria-label="Switch language"
			>
				<Languages className="h-5 w-5" />
			</button>
		);
	}

	const nextLocale = locale === "en" ? "es" : "en";

	return (
		<button
			onClick={() => setLocale(nextLocale)}
			className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
			aria-label={`Switch to ${nextLocale === "es" ? "Spanish" : "English"}`}
			title={nextLocale === "es" ? "Cambiar a Español" : "Switch to English"}
		>
			<Languages className="h-5 w-5" />
			<span className="text-xs font-semibold uppercase">{locale}</span>
		</button>
	);
}

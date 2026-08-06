"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/hooks/use-locale";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const { t } = useLocale();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground"
				aria-label={t("a11y.toggleTheme")}
			>
				<Sun className="h-5 w-5" />
			</button>
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
			aria-label={theme === "dark" ? t("a11y.switchToLight") : t("a11y.switchToDark")}
		>
			{theme === "dark" ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</button>
	);
}

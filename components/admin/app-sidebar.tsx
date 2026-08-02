"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutGrid,
	TableProperties,
	FolderTree,
	ExternalLink,
	Ruler,
	Tag,
	BookOpen,
	Code,
	History,
	KeyRound,
	LogOut,
	LayoutTemplate,
	Play,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useLocale } from "@/hooks/use-locale";

const navigationDefs = [
	{ nameKey: "admin.dashboard", href: "/admin", icon: LayoutGrid },
	{ nameKey: "admin.sizeCharts", href: "/admin/size-charts", icon: TableProperties },
	{ nameKey: "admin.templates", href: "/admin/templates", icon: LayoutTemplate },
	{ nameKey: "admin.categories", href: "/admin/categories", icon: FolderTree },
	{ nameKey: "admin.labels", href: "/admin/labels", icon: Tag },
	{ nameKey: "admin.apiKeys", href: "/admin/api-keys", icon: KeyRound },
];

const docsDefs = [
	{ nameKey: "admin.gettingStarted", href: "/admin/docs/getting-started", icon: BookOpen },
	{ nameKey: "admin.apiReference", href: "/admin/docs/api", icon: Code },
	{ nameKey: "admin.examples", href: "/admin/docs/examples", icon: Play },
	{ nameKey: "admin.changelog", href: "/admin/docs/changelog", icon: History },
];

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { setOpenMobile } = useSidebar();
	const { t } = useLocale();
	const [authEnabled, setAuthEnabled] = useState(false);

	useEffect(() => {
		fetch("/api/admin/auth")
			.then((res) => res.json())
			.then((data) => setAuthEnabled(data.authEnabled))
			.catch(() => setAuthEnabled(false));
	}, []);

	const handleLogout = async () => {
		try {
			await fetch("/api/admin/auth", { method: "DELETE" });
			router.push("/admin/login");
			router.refresh();
		} catch {
			router.push("/admin/login");
		}
	};

	// Close mobile menu when navigating
	const handleNavClick = () => {
		setOpenMobile(false);
	};

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/admin">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Ruler className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Size Charts</span>
									<span className="truncate text-xs">{t("admin.title")}</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("admin.navigation")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationDefs.map((item) => {
								const isActive =
									item.href === "/admin"
										? pathname === "/admin"
										: pathname.startsWith(item.href);

								return (
									<SidebarMenuItem key={item.nameKey}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={t(item.nameKey)}
											className="transition-colors"
										>
											<Link href={item.href} onClick={handleNavClick}>
												<item.icon className="size-4" />
												<span>{t(item.nameKey)}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>{t("admin.documentation")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{docsDefs.map((item) => {
								const isActive = pathname.startsWith(item.href);

								return (
									<SidebarMenuItem key={item.nameKey}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={t(item.nameKey)}
											className="transition-colors"
										>
											<Link href={item.href} onClick={handleNavClick}>
												<item.icon className="size-4" />
												<span>{t(item.nameKey)}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={t("admin.viewSite")} className="transition-colors">
							<Link href="/">
								<ExternalLink className="size-4" />
								<span>{t("admin.viewSite")}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={t("admin.sizeGuide")} className="transition-colors">
							<Link href="/size-guide">
								<Ruler className="size-4" />
								<span>{t("admin.sizeGuide")}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					{authEnabled && (
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={handleLogout}
								tooltip={t("admin.signOut")}
								className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
							>
								<LogOut className="size-4" />
								<span>{t("admin.signOut")}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

"use client";

import { useState } from "react";
import {
	Button,
	Badge,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Skeleton,
	InputWithLabel,
} from "@/components/ui";
import {
	useApiKeys,
	useCreateApiKey,
	useUpdateApiKey,
	useDeleteApiKey,
	type ApiKey,
	type CreateApiKeyResponse,
} from "@/hooks/use-api-keys";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Key, Copy, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useLocale } from "@/hooks/use-locale";

export default function ApiKeysPage() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
	const [newKeyData, setNewKeyData] = useState<CreateApiKeyResponse | null>(null);
	const [copied, setCopied] = useState(false);

	// Form state
	const [formName, setFormName] = useState("");
	const [formScopes, setFormScopes] = useState<string[]>(["read"]);

	const { addToast } = useToast();
	const { t, locale } = useLocale();
	const dateLocale = locale === "es" ? es : undefined;
	const { data: keys, isLoading } = useApiKeys();
	const createMutation = useCreateApiKey();
	const updateMutation = useUpdateApiKey();
	const deleteMutation = useDeleteApiKey();

	const resetForm = () => {
		setFormName("");
		setFormScopes(["read"]);
	};

	const openCreateDialog = () => {
		resetForm();
		setNewKeyData(null);
		setIsCreateOpen(true);
	};

	const handleCreate = async () => {
		if (!formName.trim()) {
			addToast(t("admin.enterKeyName"), "error");
			return;
		}

		try {
			const result = await createMutation.mutateAsync({
				name: formName,
				scopes: formScopes,
			});
			setNewKeyData(result);
			addToast(t("admin.apiKeyCreatedToast"), "success");
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.apiKeyCreateFailed"), "error");
		}
	};

	const handleToggleActive = async (key: ApiKey) => {
		try {
			await updateMutation.mutateAsync({
				id: key.id,
				isActive: !key.isActive,
			});
			addToast(key.isActive ? t("admin.apiKeyDeactivated") : t("admin.apiKeyActivated"), "success");
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.apiKeyUpdateFailed"), "error");
		}
	};

	const handleDelete = async () => {
		if (!keyToDelete) return;

		try {
			await deleteMutation.mutateAsync(keyToDelete.id);
			addToast(t("admin.apiKeyDeleted"), "success");
			setDeleteDialogOpen(false);
			setKeyToDelete(null);
		} catch (error) {
			addToast(error instanceof Error ? error.message : t("admin.apiKeyDeleteFailed"), "error");
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const toggleScope = (scope: string) => {
		if (formScopes.includes(scope)) {
			setFormScopes(formScopes.filter((s) => s !== scope));
		} else {
			setFormScopes([...formScopes, scope]);
		}
	};

	if (isLoading) {
		return (
			<div>
				<h1 className="mb-6 text-2xl font-bold">{t("admin.apiKeys")}</h1>
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
					<h1 className="text-2xl font-bold">{t("admin.apiKeys")}</h1>
					<p className="text-muted-foreground">
						{t("admin.apiKeysSubtitle")}
					</p>
				</div>
				<Button onClick={openCreateDialog}>
					<Plus className="h-4 w-4" />
					{t("admin.newApiKey")}
				</Button>
			</div>

			{/* Info Box */}
			<div className="mb-6 rounded-lg border bg-primary/5 border-primary/20 p-4">
				<h3 className="font-medium text-primary mb-2">{t("admin.usingApiKeys")}</h3>
				<p className="text-sm text-muted-foreground mb-2">
					{t("admin.usingApiKeysDesc")}
				</p>
				<div className="space-y-2 font-mono text-xs bg-muted/50 rounded p-3">
					<div><span className="text-muted-foreground"># Header:</span> X-API-Key: your_key_here</div>
					<div><span className="text-muted-foreground"># Bearer:</span> Authorization: Bearer your_key_here</div>
				</div>
			</div>

			{keys?.length === 0 ? (
				<div className="rounded-lg border-2 border-dashed p-8 text-center">
					<Key className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-semibold">{t("admin.noApiKeys")}</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						{t("admin.noApiKeysDesc")}
					</p>
					<Button className="mt-4" onClick={openCreateDialog}>
						<Plus className="h-4 w-4" />
						{t("admin.createApiKey")}
					</Button>
				</div>
			) : (
				<div className="rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("admin.name")}</TableHead>
								<TableHead>{t("admin.key")}</TableHead>
								<TableHead>{t("admin.scopes")}</TableHead>
								<TableHead>{t("admin.status")}</TableHead>
								<TableHead>{t("admin.lastUsed")}</TableHead>
								<TableHead>{t("admin.created")}</TableHead>
								<TableHead className="w-24"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{keys?.map((key) => (
								<TableRow key={key.id}>
									<TableCell className="font-medium">{key.name}</TableCell>
									<TableCell>
										<code className="rounded bg-muted px-1.5 py-0.5 text-sm">
											{key.keyPrefix}...
										</code>
									</TableCell>
									<TableCell>
										<div className="flex gap-1">
											{key.scopes.map((scope) => (
												<Badge key={scope} variant="secondary" className="text-xs">
													{scope}
												</Badge>
											))}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={key.isActive ? "default" : "secondary"}>
											{key.isActive ? t("admin.active") : t("admin.inactive")}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{key.lastUsedAt
											? formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true, locale: dateLocale })
											: t("admin.never")}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDistanceToNow(new Date(key.createdAt), { addSuffix: true, locale: dateLocale })}
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-end gap-1">
											<button
												onClick={() => handleToggleActive(key)}
												className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
												title={key.isActive ? t("admin.deactivate") : t("admin.activate")}
											>
												{key.isActive ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
											<button
												onClick={() => {
													setKeyToDelete(key);
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
			)}

			{/* Create Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={(open) => {
				if (!open && !newKeyData) {
					setIsCreateOpen(false);
				} else if (!open && newKeyData) {
					setIsCreateOpen(false);
					setNewKeyData(null);
				} else {
					setIsCreateOpen(open);
				}
			}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{newKeyData ? t("admin.apiKeyCreated") : t("admin.createApiKey")}
						</DialogTitle>
						<DialogDescription>
							{newKeyData
								? t("admin.apiKeyCreatedDesc")
								: t("admin.createApiKeyDesc")}
						</DialogDescription>
					</DialogHeader>

					{newKeyData ? (
						<div className="py-4">
							<div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-4 mb-4">
								<div className="flex items-start gap-2">
									<AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
									<div>
										<p className="font-medium text-amber-600">{t("admin.saveKeyNow")}</p>
										<p className="text-sm text-muted-foreground">
											{t("admin.saveKeyDesc")}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">{t("admin.yourApiKey")}</label>
								<div className="flex items-center gap-2">
									<code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
										{newKeyData.key}
									</code>
									<Button
										variant="outline"
										size="sm"
										onClick={() => copyToClipboard(newKeyData.key)}
									>
										{copied ? (
											<Check className="h-4 w-4" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4 py-4">
							<InputWithLabel
								label={t("admin.name")}
								value={formName}
								onChange={(e) => setFormName(e.target.value)}
								placeholder={t("admin.namePlaceholder")}
							/>

							<div>
								<label className="text-sm font-medium">{t("admin.scopes")}</label>
								<p className="text-xs text-muted-foreground mb-2">
									{t("admin.scopesDesc")}
								</p>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => toggleScope("read")}
										className={`rounded-md border px-3 py-2 text-sm transition-colors ${
											formScopes.includes("read")
												? "border-primary bg-primary/10 text-primary"
												: "border-border hover:bg-accent"
										}`}
									>
										{t("admin.read")}
									</button>
									<button
										type="button"
										onClick={() => toggleScope("write")}
										className={`rounded-md border px-3 py-2 text-sm transition-colors ${
											formScopes.includes("write")
												? "border-primary bg-primary/10 text-primary"
												: "border-border hover:bg-accent"
										}`}
									>
										{t("admin.write")}
									</button>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						{newKeyData ? (
							<Button onClick={() => {
								setIsCreateOpen(false);
								setNewKeyData(null);
								resetForm();
							}}>
								{t("admin.done")}
							</Button>
						) : (
							<>
								<Button variant="outline" onClick={() => setIsCreateOpen(false)}>
									{t("admin.cancel")}
								</Button>
								<Button onClick={handleCreate} disabled={createMutation.isPending}>
									{t("admin.createKey")}
								</Button>
							</>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.deleteApiKey")}</DialogTitle>
						<DialogDescription>
							{t("admin.deleteApiKeyDesc")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setKeyToDelete(null);
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
		</div>
	);
}

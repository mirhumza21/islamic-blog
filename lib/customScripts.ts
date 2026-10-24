export type ScriptPlacement = "header" | "footer";

export type CustomScript = {
  id: string;
  name: string;
  placement: ScriptPlacement;
  enabled: boolean;
  code: string;
};

export function createEmptyScript(placement: ScriptPlacement = "header"): CustomScript {
  return {
    id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    placement,
    enabled: true,
    code: "",
  };
}

export function normalizeCustomScripts(settings: {
  customScripts?: CustomScript[] | null;
}): CustomScript[] {
  const existing = Array.isArray(settings.customScripts) ? settings.customScripts : [];
  return existing.map((script) => ({
    id: script.id || createEmptyScript().id,
    name: script.name || "",
    placement: script.placement === "footer" ? "footer" : "header",
    enabled: script.enabled !== false,
    code: script.code || "",
  }));
}

export function splitScriptsByPlacement(scripts: CustomScript[]): {
  header: string;
  footer: string;
} {
  const enabled = scripts.filter((script) => script.enabled && script.code?.trim());
  return {
    header: enabled
      .filter((script) => script.placement === "header")
      .map((script) => script.code.trim())
      .join("\n"),
    footer: enabled
      .filter((script) => script.placement === "footer")
      .map((script) => script.code.trim())
      .join("\n"),
  };
}

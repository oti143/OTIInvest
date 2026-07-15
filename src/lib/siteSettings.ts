import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  technicalAuthorizedPerson: string;
  showCommissionSection: boolean;
  showMarketChartSection: boolean;
  showCommunitySection: boolean;
  showTermsSection: boolean;
  showContactSection: boolean;
  showDisclaimerSection: boolean;
  showFinalCtaSection: boolean;
  contactEmail: string;
  whatsappContact: string;
}

const STORAGE_KEY = "oti_technical_settings";
const SETTINGS_TABLE = "site_settings";
const SETTINGS_ID = "default";

function mergeWithDefaults(partial?: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...getDefaultSiteSettings(),
    ...(partial || {}),
  };
}

export function getDefaultSiteSettings(): SiteSettings {
  return {
    heroBadge: "Limited — Only 6,000 Seats Available",
    heroTitle: "Secure Today. Prosper Tomorrow.",
    heroSubtitle: "A trusted long-term share investment plan designed for your future wealth. Managed by Co-Applicant Mr. Manoj.",
    heroPrimaryCta: "Apply Now",
    heroSecondaryCta: "View Plan Details",
    technicalAuthorizedPerson: "Mr. Manoj",
    showCommissionSection: true,
    showMarketChartSection: true,
    showCommunitySection: true,
    showTermsSection: true,
    showContactSection: true,
    showDisclaimerSection: true,
    showFinalCtaSection: true,
    contactEmail: "otiinvenstment1@gmail.com",
    whatsappContact: "917026984838",
  };
}

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return getDefaultSiteSettings();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSiteSettings();

    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return mergeWithDefaults(parsed);
  } catch {
    return getDefaultSiteSettings();
  }
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  if (typeof window === "undefined") return getDefaultSiteSettings();

  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    if (!error && data) {
      const merged = mergeWithDefaults(data as Partial<SiteSettings>);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    if (error) {
      console.warn("Supabase site settings unavailable, using local fallback:", error.message);
    }
  } catch (error) {
    console.warn("Unable to load site settings from Supabase:", error);
  }

  return getSiteSettings();
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  if (typeof window === "undefined") return;

  const payload = {
    id: SETTINGS_ID,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  try {
    const { error } = await supabase.from(SETTINGS_TABLE).upsert(payload, { onConflict: "id" });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn("Unable to sync site settings to Supabase, keeping local fallback:", error);
  }
}

export async function resetSiteSettings(): Promise<void> {
  if (typeof window === "undefined") return;

  const defaults = getDefaultSiteSettings();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));

  try {
    await supabase.from(SETTINGS_TABLE).delete().eq("id", SETTINGS_ID);
  } catch (error) {
    console.warn("Unable to reset site settings in Supabase:", error);
  }
}

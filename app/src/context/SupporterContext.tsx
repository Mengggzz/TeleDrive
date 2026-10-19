import { createContext, useContext, useMemo, type ReactNode } from 'react';

export const SUPPORTER_STATUS_READ_ATTEMPTS = 3;

export type SupporterState = 'loading' | 'inactive' | 'active' | 'needs_refresh' | 'expired' | 'revoked' | 'unavailable';

export interface SupporterStatus {
  state: SupporterState;
  ad_free: boolean;
  message: string;
  terms_version: string;
  terms_url: string | null;
  expires_at: number | null;
  offline_until: number | null;
  recovery_code_saved: boolean;
  checkout_pending?: boolean;
}

interface CheckoutStarted {
  approval_url: string;
  expires_at: number;
}

export interface CheckoutPollResult {
  status: string;
  recovery_code: string | null;
  message: string;
}

interface SupporterContextValue {
  status: SupporterStatus;
  latestRecoveryCode: string | null;
  refreshStatus: () => Promise<SupporterStatus>;
  beginCheckout: (termsVersion: string) => Promise<CheckoutStarted>;
  pollCheckout: () => Promise<CheckoutPollResult>;
  activate: (recoveryCode: string, termsVersion: string) => Promise<SupporterStatus>;
  refreshEntitlement: () => Promise<SupporterStatus>;
}

const activeStatus: SupporterStatus = {
  state: 'active',
  ad_free: true,
  message: 'TeleDrive is permanently ad-free.',
  terms_version: '2026-08-11',
  terms_url: null,
  expires_at: null,
  offline_until: null,
  recovery_code_saved: true,
  checkout_pending: false,
};

const SupporterContext = createContext<SupporterContextValue | null>(null);

export function SupporterProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SupporterContextValue>(() => ({
    status: activeStatus,
    latestRecoveryCode: null,
    refreshStatus: async () => activeStatus,
    refreshEntitlement: async () => activeStatus,
    beginCheckout: async () => ({ approval_url: '', expires_at: 0 }),
    pollCheckout: async () => ({ status: 'completed', recovery_code: null, message: '' }),
    activate: async () => activeStatus,
  }), []);

  return <SupporterContext.Provider value={value}>{children}</SupporterContext.Provider>;
}

export function useSupporter() {
  return useContext(SupporterContext) ?? {
    status: activeStatus,
    latestRecoveryCode: null,
    refreshStatus: async () => activeStatus,
    beginCheckout: async () => ({ approval_url: '', expires_at: 0 }),
    pollCheckout: async () => ({ status: 'completed', recovery_code: null, message: '' }),
    activate: async () => activeStatus,
    refreshEntitlement: async () => activeStatus,
  };
}

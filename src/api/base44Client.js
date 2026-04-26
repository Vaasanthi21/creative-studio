import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Ensure the appBaseUrl has the correct format for external access
const baseUrl = appParams.appBaseUrl || 'https://vashanthi-task-core.base44.app';

export const base44 = createClient({
  appId: appParams.appId || '69ea3fc78db8825f0359f854',
  appBaseUrl: baseUrl,
});

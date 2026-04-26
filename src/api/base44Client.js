import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Ensure the appBaseUrl has the correct format for external access
const baseUrl = appParams.appBaseUrl || 'https://vashanthi-task-core.base44.app';

// Check if we're running in development mode (localhost)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const base44 = createClient({
  appId: appParams.appId || '69ea3fc78db8825f0359f854',
  appBaseUrl: baseUrl,
  // In development mode, we'll handle authentication errors gracefully
  // Production requires access through Base44 platform
});

// Export development mode flag for components to use
export { isDevelopment };

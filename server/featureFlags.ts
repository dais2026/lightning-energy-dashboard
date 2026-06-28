/**
 * Feature Flags System
 * 
 * Provides runtime feature toggling for gradual rollout, A/B testing,
 * and feature management without redeployment.
 */

export type FeatureFlag = 
  | 'admin_dashboard'
  | 'analytics_module'
  | 'advanced_charts'
  | 'api_v2'
  | 'dark_mode'
  | 'export_reports'
  | 'ai_recommendations'
  | 'batch_operations'
  | 'webhook_integration'
  | 'custom_themes';

interface FlagConfig {
  enabled: boolean;
  rolloutPercentage?: number; // 0-100, default 100 if enabled
  targetUsers?: string[]; // Specific user IDs to enable for
  targetRoles?: string[]; // User roles to enable for
  startDate?: Date; // When to enable flag
  endDate?: Date; // When to disable flag
  description: string;
  owner: string; // Slack/email of feature owner
}

type FeatureFlagMap = Record<FeatureFlag, FlagConfig>;

/**
 * Feature flag configuration
 * Update these values to control feature availability
 */
const featureFlags: FeatureFlagMap = {
  admin_dashboard: {
    enabled: true,
    rolloutPercentage: 100,
    description: 'Admin dashboard for system management',
    owner: 'admin-team',
  },
  analytics_module: {
    enabled: true,
    rolloutPercentage: 80, // Gradual rollout to 80% of users
    description: 'Advanced analytics and reporting',
    owner: 'analytics-team',
  },
  advanced_charts: {
    enabled: false,
    description: 'Advanced charting capabilities',
    owner: 'frontend-team',
  },
  api_v2: {
    enabled: false,
    description: 'New API v2 with GraphQL support',
    owner: 'backend-team',
  },
  dark_mode: {
    enabled: true,
    rolloutPercentage: 100,
    description: 'Dark mode theme support',
    owner: 'design-team',
  },
  export_reports: {
    enabled: true,
    rolloutPercentage: 100,
    description: 'Export reports to PDF/Excel',
    owner: 'product-team',
  },
  ai_recommendations: {
    enabled: false,
    description: 'AI-powered recommendations engine',
    owner: 'ai-team',
  },
  batch_operations: {
    enabled: false,
    description: 'Batch operations on multiple items',
    owner: 'backend-team',
  },
  webhook_integration: {
    enabled: false,
    description: 'Webhook integration for events',
    owner: 'integration-team',
  },
  custom_themes: {
    enabled: false,
    description: 'Custom theme builder',
    owner: 'design-team',
  },
};

/**
 * Check if a feature flag is enabled
 * Considers rollout percentage, user targeting, and date ranges
 */
export function isFeatureEnabled(
  flagName: FeatureFlag,
  context?: {
    userId?: string;
    userRole?: string;
    userPercentage?: number; // 0-100, for consistent rollout
  }
): boolean {
  const flag = featureFlags[flagName];

  if (!flag) {
    console.warn(`Unknown feature flag: ${flagName}`);
    return false;
  }

  // Check if flag is enabled at all
  if (!flag.enabled) {
    return false;
  }

  // Check date range
  const now = new Date();
  if (flag.startDate && now < flag.startDate) {
    return false;
  }
  if (flag.endDate && now > flag.endDate) {
    return false;
  }

  // Check user-specific targeting
  if (flag.targetUsers && context?.userId) {
    if (!flag.targetUsers.includes(context.userId)) {
      return false;
    }
    return true; // User is explicitly targeted
  }

  // Check role-based targeting
  if (flag.targetRoles && context?.userRole) {
    if (!flag.targetRoles.includes(context.userRole)) {
      return false;
    }
    return true; // User has correct role
  }

  // Check rollout percentage
  if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
    const percentage = context?.userPercentage ?? Math.random() * 100;
    return percentage < flag.rolloutPercentage;
  }

  return true;
}

/**
 * Get all feature flags and their status
 */
export function getAllFeatureFlags(
  context?: {
    userId?: string;
    userRole?: string;
    userPercentage?: number;
  }
): Record<FeatureFlag, boolean> {
  const result: Partial<Record<FeatureFlag, boolean>> = {};

  (Object.keys(featureFlags) as FeatureFlag[]).forEach((flag) => {
    result[flag] = isFeatureEnabled(flag, context);
  });

  return result as Record<FeatureFlag, boolean>;
}

/**
 * Get feature flag configuration (for admin dashboard)
 */
export function getFeatureFlagConfig(flagName: FeatureFlag): FlagConfig | undefined {
  return featureFlags[flagName];
}

/**
 * Update feature flag configuration (for admin dashboard)
 * In production, this should be persisted to database
 */
export function updateFeatureFlagConfig(
  flagName: FeatureFlag,
  config: Partial<FlagConfig>
): void {
  const flag = featureFlags[flagName];
  if (!flag) {
    throw new Error(`Unknown feature flag: ${flagName}`);
  }

  Object.assign(flag, config);
  console.log(`Updated feature flag: ${flagName}`, config);
}

/**
 * Get statistics about feature flag usage
 */
export function getFeatureFlagStats() {
  const stats = {
    totalFlags: Object.keys(featureFlags).length,
    enabledFlags: 0,
    disabledFlags: 0,
    averageRolloutPercentage: 0,
  };

  let totalRollout = 0;
  let flagsWithRollout = 0;

  (Object.keys(featureFlags) as FeatureFlag[]).forEach((flagName) => {
    const flag = featureFlags[flagName];
    if (flag.enabled) {
      stats.enabledFlags++;
    } else {
      stats.disabledFlags++;
    }

    if (flag.rolloutPercentage !== undefined) {
      totalRollout += flag.rolloutPercentage;
      flagsWithRollout++;
    }
  });

  if (flagsWithRollout > 0) {
    stats.averageRolloutPercentage = Math.round(totalRollout / flagsWithRollout);
  }

  return stats;
}

export default featureFlags;

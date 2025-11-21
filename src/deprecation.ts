/**
 * Deprecation warnings system for iterflow
 *
 * This module provides utilities for marking APIs as deprecated and emitting
 * warnings to help users migrate away from deprecated functionality.
 *
 * @module deprecation
 */

/**
 * Configuration options for deprecation warnings
 */
export interface DeprecationConfig {
  /** Whether to show deprecation warnings (default: true in development, false in production) */
  enabled: boolean;
  /** Whether to show stack traces with warnings (default: false) */
  showStackTrace: boolean;
  /** Custom handler for deprecation warnings */
  handler?: (warning: DeprecationWarning) => void;
}

/**
 * Information about a deprecated API
 */
export interface DeprecationWarning {
  /** The deprecated feature name */
  feature: string;
  /** Version when it was deprecated */
  since: string;
  /** Version when it will be removed (if known) */
  removeIn?: string;
  /** Alternative to use instead */
  alternative?: string;
  /** Additional message with migration guidance */
  message?: string;
  /** Stack trace (if enabled) */
  stack?: string;
}

/**
 * Global deprecation configuration
 */
let config: DeprecationConfig = {
  enabled:
    typeof process !== "undefined" && process.env.NODE_ENV !== "production",
  showStackTrace: false,
};

/**
 * Set of features that have already shown a warning (to avoid duplicate warnings)
 */
const warnedFeatures = new Set<string>();

/**
 * Configure the deprecation warning system
 *
 * @param options - Configuration options to update
 * @example
 * ```typescript
 * // Disable all deprecation warnings
 * configureDeprecation({ enabled: false });
 *
 * // Enable stack traces
 * configureDeprecation({ showStackTrace: true });
 *
 * // Use custom handler
 * configureDeprecation({
 *   handler: (warning) => {
 *     logger.warn(`Deprecated: ${warning.feature}`, warning);
 *   }
 * });
 * ```
 */
export function configureDeprecation(
  options: Partial<DeprecationConfig>,
): void {
  config = { ...config, ...options };
}

/**
 * Get current deprecation configuration
 *
 * @returns Current deprecation configuration
 */
export function getDeprecationConfig(): Readonly<DeprecationConfig> {
  return { ...config };
}

/**
 * Clear the set of warned features (mainly for testing)
 */
export function clearDeprecationWarnings(): void {
  warnedFeatures.clear();
}

/**
 * Emit a deprecation warning (internal implementation)
 *
 * @param warning - The deprecation warning to emit
 */
function emitWarning(warning: DeprecationWarning): void {
  if (!config.enabled) return;

  // Only warn once per feature
  if (warnedFeatures.has(warning.feature)) return;
  warnedFeatures.add(warning.feature);

  // Use custom handler if provided
  if (config.handler) {
    config.handler(warning);
    return;
  }

  // Build warning message
  let message = `[iterflow] DEPRECATED: ${warning.feature} has been deprecated since v${warning.since}`;

  if (warning.removeIn) {
    message += ` and will be removed in v${warning.removeIn}`;
  }

  if (warning.alternative) {
    message += `\nPlease use ${warning.alternative} instead.`;
  }

  if (warning.message) {
    message += `\n${warning.message}`;
  }

  // Emit the warning
  if (typeof process !== "undefined" && process.emitWarning) {
    // Node.js environment
    const options: any = {
      type: "DeprecationWarning",
      code: "ITERFLOW_DEPRECATION",
      detail: warning.message,
    };

    process.emitWarning(message, options);
  } else {
    // Browser or other environment
    console.warn(message);
  }

  // Show stack trace if enabled
  if (config.showStackTrace && warning.stack) {
    console.warn("Stack trace:", warning.stack);
  }
}

/**
 * Mark a feature as deprecated and emit a warning when called
 *
 * @param options - Deprecation warning details
 * @example
 * ```typescript
 * // In your code
 * function oldMethod() {
 *   deprecate({
 *     feature: 'oldMethod()',
 *     since: '0.9.0',
 *     removeIn: '2.0.0',
 *     alternative: 'newMethod()',
 *     message: 'See migration guide: https://...'
 *   });
 *
 *   // ... implementation
 * }
 * ```
 */
export function deprecate(options: Omit<DeprecationWarning, "stack">): void {
  const warning: DeprecationWarning = {
    ...options,
    stack: config.showStackTrace ? new Error().stack : undefined,
  };

  emitWarning(warning);
}

/**
 * Decorator to mark a method or function as deprecated
 *
 * @param options - Deprecation warning details
 * @returns Decorator function
 * @example
 * ```typescript
 * class MyClass {
 *   @deprecated({
 *     feature: 'MyClass.oldMethod',
 *     since: '0.9.0',
 *     alternative: 'MyClass.newMethod'
 *   })
 *   oldMethod() {
 *     // implementation
 *   }
 * }
 * ```
 */
export function deprecated(
  options: Omit<DeprecationWarning, "stack" | "feature">,
) {
  return function <T extends Function>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void {
    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    const className = target.constructor?.name || "Object";
    const feature = `${className}.${propertyKey}`;

    descriptor.value = function (this: any, ...args: any[]) {
      deprecate({ ...options, feature });
      return originalMethod.apply(this, args);
    } as any;

    return descriptor;
  };
}

/**
 * Create a wrapper function that marks the original function as deprecated
 *
 * @param fn - The function to wrap
 * @param options - Deprecation warning details
 * @returns Wrapped function that emits deprecation warning
 * @example
 * ```typescript
 * const oldFunction = deprecatedFunction(
 *   (x: number) => x * 2,
 *   {
 *     feature: 'oldFunction',
 *     since: '0.9.0',
 *     alternative: 'newFunction'
 *   }
 * );
 * ```
 */
export function deprecatedFunction<T extends (...args: any[]) => any>(
  fn: T,
  options: Omit<DeprecationWarning, "stack">,
): T {
  return function (this: any, ...args: any[]) {
    deprecate(options);
    return fn.apply(this, args);
  } as T;
}

/**
 * Check if a feature has been marked as deprecated (for testing)
 *
 * @param feature - The feature name to check
 * @returns True if the feature has been warned about
 */
export function hasDeprecationWarning(feature: string): boolean {
  return warnedFeatures.has(feature);
}

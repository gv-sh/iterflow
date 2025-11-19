/**
 * Debug mode and operation tracing utilities for IterFlow
 * @module debug
 */

/**
 * Trace entry representing a single operation execution
 */
export interface TraceEntry {
  operation: string;
  timestamp: number;
  input?: unknown;
  output?: unknown;
  error?: Error;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Debug configuration options
 */
export interface DebugConfig {
  enabled: boolean;
  traceOperations: boolean;
  traceInput: boolean;
  traceOutput: boolean;
  logToConsole: boolean;
  maxTraceEntries?: number;
}

/**
 * Global debug state
 */
class DebugState {
  private config: DebugConfig = {
    enabled: false,
    traceOperations: false,
    traceInput: false,
    traceOutput: false,
    logToConsole: false,
    maxTraceEntries: 1000,
  };

  private traces: TraceEntry[] = [];

  /**
   * Enable debug mode with optional configuration
   */
  enable(config?: Partial<DebugConfig>): void {
    this.config = {
      ...this.config,
      enabled: true,
      traceOperations: true,
      ...config,
    };

    if (this.config.logToConsole) {
      console.log('[IterFlow Debug] Debug mode enabled', this.config);
    }
  }

  /**
   * Disable debug mode
   */
  disable(): void {
    this.config.enabled = false;
    this.config.traceOperations = false;

    if (this.config.logToConsole) {
      console.log('[IterFlow Debug] Debug mode disabled');
    }
  }

  /**
   * Check if debug mode is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<DebugConfig> {
    return { ...this.config };
  }

  /**
   * Add a trace entry
   */
  trace(entry: TraceEntry): void {
    if (!this.config.traceOperations) {
      return;
    }

    // Limit trace entries to prevent memory issues
    if (this.traces.length >= (this.config.maxTraceEntries || 1000)) {
      this.traces.shift(); // Remove oldest entry
    }

    this.traces.push(entry);

    if (this.config.logToConsole) {
      this.logTrace(entry);
    }
  }

  /**
   * Get all trace entries
   */
  getTraces(): readonly TraceEntry[] {
    return [...this.traces];
  }

  /**
   * Clear all traces
   */
  clearTraces(): void {
    this.traces = [];

    if (this.config.logToConsole) {
      console.log('[IterFlow Debug] Traces cleared');
    }
  }

  /**
   * Get traces for a specific operation
   */
  getTracesForOperation(operation: string): TraceEntry[] {
    return this.traces.filter((t) => t.operation === operation);
  }

  /**
   * Get summary statistics for traces
   */
  getTraceSummary(): Record<string, { count: number; avgDuration: number; errors: number }> {
    const summary: Record<string, { count: number; totalDuration: number; errors: number }> = {};

    for (const trace of this.traces) {
      if (!summary[trace.operation]) {
        summary[trace.operation] = { count: 0, totalDuration: 0, errors: 0 };
      }

      summary[trace.operation].count++;

      if (trace.duration !== undefined) {
        summary[trace.operation].totalDuration += trace.duration;
      }

      if (trace.error) {
        summary[trace.operation].errors++;
      }
    }

    // Convert to final format with average duration
    const result: Record<string, { count: number; avgDuration: number; errors: number }> = {};

    for (const [op, stats] of Object.entries(summary)) {
      result[op] = {
        count: stats.count,
        avgDuration: stats.count > 0 ? stats.totalDuration / stats.count : 0,
        errors: stats.errors,
      };
    }

    return result;
  }

  /**
   * Log a trace entry to console
   */
  private logTrace(entry: TraceEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const duration = entry.duration !== undefined ? `${entry.duration.toFixed(2)}ms` : 'N/A';

    if (entry.error) {
      console.error(
        `[IterFlow Debug] ${timestamp} | ${entry.operation} | ERROR | ${duration}`,
        entry.error
      );
    } else {
      console.log(
        `[IterFlow Debug] ${timestamp} | ${entry.operation} | ${duration}`
      );

      if (this.config.traceInput && entry.input !== undefined) {
        console.log('  Input:', entry.input);
      }

      if (this.config.traceOutput && entry.output !== undefined) {
        console.log('  Output:', entry.output);
      }

      if (entry.metadata) {
        console.log('  Metadata:', entry.metadata);
      }
    }
  }
}

// Global debug instance
const debugState = new DebugState();

/**
 * Enable debug mode
 */
export function enableDebug(config?: Partial<DebugConfig>): void {
  debugState.enable(config);
}

/**
 * Disable debug mode
 */
export function disableDebug(): void {
  debugState.disable();
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return debugState.isEnabled();
}

/**
 * Get debug configuration
 */
export function getDebugConfig(): Readonly<DebugConfig> {
  return debugState.getConfig();
}

/**
 * Add a trace entry
 */
export function addTrace(entry: TraceEntry): void {
  debugState.trace(entry);
}

/**
 * Get all trace entries
 */
export function getTraces(): readonly TraceEntry[] {
  return debugState.getTraces();
}

/**
 * Clear all traces
 */
export function clearTraces(): void {
  debugState.clearTraces();
}

/**
 * Get traces for a specific operation
 */
export function getTracesForOperation(operation: string): TraceEntry[] {
  return debugState.getTracesForOperation(operation);
}

/**
 * Get trace summary statistics
 */
export function getTraceSummary(): Record<string, { count: number; avgDuration: number; errors: number }> {
  return debugState.getTraceSummary();
}

/**
 * Wrapper function to trace operation execution
 */
export function traceOperation<T>(
  operation: string,
  fn: () => T,
  metadata?: Record<string, unknown>
): T {
  if (!debugState.isEnabled()) {
    return fn();
  }

  const startTime = performance.now();
  const timestamp = Date.now();

  try {
    const result = fn();
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      output: debugState.getConfig().traceOutput ? result : undefined,
      metadata,
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      error: error as Error,
      metadata,
    });

    throw error;
  }
}

/**
 * Async version of traceOperation
 */
export async function traceOperationAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  if (!debugState.isEnabled()) {
    return fn();
  }

  const startTime = performance.now();
  const timestamp = Date.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      output: debugState.getConfig().traceOutput ? result : undefined,
      metadata,
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    debugState.trace({
      operation,
      timestamp,
      duration,
      error: error as Error,
      metadata,
    });

    throw error;
  }
}

/**
 * Basic debounce function
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | number | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        clearTimeout(timeoutId as NodeJS.Timeout);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Debounced function with cancel and flush methods
 */
interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
    flush(...args: Parameters<T>): void;
}

/**
 * Options for advanced debounce
 */
interface DebounceOptions {
    leading?: boolean;   // Execute on the leading edge
    trailing?: boolean;  // Execute on the trailing edge
    maxWait?: number;   // Maximum time to wait before execution
}

/**
 * Advanced debounce function with options
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @param options - Configuration options
 * @returns Object with debounced function and control methods
 */
function advancedDebounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    options: DebounceOptions = {}
): DebouncedFunction<T> {
    const { leading = false, trailing = true, maxWait } = options;

    let timeoutId: NodeJS.Timeout | number | undefined;
    let maxTimeoutId: NodeJS.Timeout | number | undefined;
    let lastCallTime = 0;
    let hasExecuted = false;
    let lastArgs: Parameters<T> | undefined;
    let lastContext: ThisParameterType<T>;

    function execute(context: ThisParameterType<T>, args: Parameters<T>): void {
        func.apply(context, args);
        hasExecuted = true;
        lastCallTime = Date.now();
    }

    function cancel(): void {
        if (timeoutId) {
            clearTimeout(timeoutId as NodeJS.Timeout);
            timeoutId = undefined;
        }
        if (maxTimeoutId) {
            clearTimeout(maxTimeoutId as NodeJS.Timeout);
            maxTimeoutId = undefined;
        }
        hasExecuted = false;
        lastArgs = undefined;
    }

    function flush(...args: Parameters<T>): void {
        cancel();
        if (args.length > 0 || lastArgs) {
            execute(lastContext, args.length > 0 ? args : lastArgs!);
        }
    }

    const debouncedFunction = function (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ): void {
        const now = Date.now();
        lastArgs = args;
        lastContext = this;

        // Leading edge execution
        if (leading && !hasExecuted) {
            execute(this, args);
            return;
        }

        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId as NodeJS.Timeout);
        }

        // Set up max wait timeout
        if (maxWait && !maxTimeoutId) {
            maxTimeoutId = setTimeout(() => {
                execute(lastContext, lastArgs!);
                cancel();
            }, maxWait) as NodeJS.Timeout;
        }

        // Trailing edge execution
        if (trailing) {
            timeoutId = setTimeout(() => {
                execute(lastContext, lastArgs!);
                cancel();
            }, delay) as NodeJS.Timeout;
        }
    } as DebouncedFunction<T>;

    // Attach control methods
    debouncedFunction.cancel = cancel;
    debouncedFunction.flush = flush;

    return debouncedFunction;
}

/**
 * Throttle function (bonus utility)
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns The throttled function
 */
function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastExecTime = 0;
    let timeoutId: NodeJS.Timeout | number | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const now = Date.now();

        if (now - lastExecTime >= delay) {
            func.apply(this, args);
            lastExecTime = now;
        } else {
            clearTimeout(timeoutId as NodeJS.Timeout);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (now - lastExecTime)) as NodeJS.Timeout;
        }
    };
}

/**
 * Utility type for async functions
 */
type AsyncFunction<T extends any[] = any[], R = any> = (...args: T) => Promise<R>;

/**
 * Debounce for async functions with proper error handling
 * @param func - The async function to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced async function
 */
function debounceAsync<T extends AsyncFunction>(
    func: T,
    delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    let timeoutId: NodeJS.Timeout | number | undefined;
    let latestPromiseReject: ((reason?: any) => void) | undefined;

    return function (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> {
        return new Promise((resolve, reject) => {
            // Cancel previous promise
            if (latestPromiseReject) {
                latestPromiseReject(new Error('Debounced async call cancelled'));
            }

            latestPromiseReject = reject;

            // Clear previous timeout
            clearTimeout(timeoutId as NodeJS.Timeout);

            // Set new timeout
            timeoutId = setTimeout(async () => {
                try {
                    const result = await func.apply(this, args);
                    latestPromiseReject = undefined;
                    resolve(result);
                } catch (error) {
                    latestPromiseReject = undefined;
                    reject(error);
                }
            }, delay);
        });
    };
}
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 第${attempt}次尝试`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ 第${attempt}次尝试失败:`, lastError.message);

      if (attempt < maxRetries) {
        const delay = baseDelay * attempt;
        console.log(`⏳ ${delay}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`❌ 所有${maxRetries}次重试都失败了`);
  throw lastError!;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function logRequest(method: string, path: string): void {
  console.log(`${getCurrentTimestamp()} - ${method} ${path}`);
}
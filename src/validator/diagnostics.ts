export interface Diagnostic {
  code: string;
  severity: 'error' | 'warning';
  path?: string;
  message: string;
  actionId?: string;
  nodeId?: string;
}
export interface ValidationResult {
  status: 'valid' | 'invalid' | 'tool-error';
  diagnostics: Diagnostic[];
}
export function toolError(code: string, message: string): ValidationResult {
  return {status: 'tool-error', diagnostics: [{code, severity: 'error', message}]};
}

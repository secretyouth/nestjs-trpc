export type ProcedureOptions = {
  ctx: any;
  input: any;
  rawInput: any;
  type: string;
  path: string;
  signal?: AbortSignal;
  meta?: Record<string, unknown>;
};

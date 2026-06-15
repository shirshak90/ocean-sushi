/** Shared react-hook-form options for zod-validated forms. */
export const zodFormOptions = {
  mode: "onSubmit" as const,
  reValidateMode: "onChange" as const,
  shouldFocusError: true,
}

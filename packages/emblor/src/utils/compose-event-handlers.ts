export const composeEventHandlers = <E>(
  originalFn?: (event: E) => void,
  ourFn?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) => {
  return (event: E) => {
    originalFn?.(event);
    if (checkForDefaultPrevented && (event as unknown as { defaultPrevented?: boolean }).defaultPrevented) {
      return;
    }
    return ourFn?.(event);
  };
};

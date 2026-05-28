export function getReturnPath(state: unknown) {
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    typeof state.from === "string" &&
    state.from.startsWith("/client")
  ) {
    return state.from;
  }

  return "/client";
}

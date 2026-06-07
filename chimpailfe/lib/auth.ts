export const SESSION_COOKIE = "chimpmail_session";

export const SESSION_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
};

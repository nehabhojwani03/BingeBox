// Hard cap on how long a signed-in session may live. Once this much time has
// passed since the user signed in, they are signed out automatically — on the
// next app launch or when the app returns to the foreground — regardless of
// activity. Tune the number of days here (2-3 is the intended range).
const SESSION_MAX_AGE_DAYS = 3;

export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

// AsyncStorage key holding the epoch-millis timestamp of the current sign-in.
export const SESSION_STARTED_AT_KEY = '@bingebox/session_started_at';

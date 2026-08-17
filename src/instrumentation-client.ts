import { initBotId } from "botid/client/core";

// The English homepage is internally rewritten to /en, so protect both the
// public URL and every localized route that can host the Server Action form.
initBotId({
  protect: [
    { path: "/", method: "POST" },
    { path: "/en", method: "POST" },
    { path: "/es", method: "POST" },
  ],
});

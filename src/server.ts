import "dotenv/config";
import { env } from "./infra/env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(`[ach-pet-api] listening on :${env.PORT}`);
});

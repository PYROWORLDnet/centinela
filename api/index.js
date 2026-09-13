import { loadEnv } from "../backend/src/db/loadEnv.js";
loadEnv();

import { createApp } from "../backend/src/app.js";

const app = createApp();

export default app;

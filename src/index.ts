// imports de bibliotecas
import { config } from "dotenv";
import session from "express-session";
import cors from "cors";
import express from "express";
import pool from "./database/connection";

// imports de arquivos da aplicação
import createMemoryStore from "memorystore";
import { webRouter } from "./routes/web-routes";
import { mobileRouter } from "./routes/mobile-routes";

config();
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

const sessionStore = createMemoryStore(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    },
    store: new sessionStore({
      checkPeriod: 86400,
    }),
    proxy: true,
    name: "session",
  })
);

app.set("trust proxy", 1);

app.use("/web", webRouter);
app.use("/mobile", mobileRouter);

app.use((req, _, next) => {
  console.log("Headers recebidos:", {
    origin: req.headers.origin,
    cookies: req.headers.cookie,
    "x-forwarded-proto": req.headers["x-forwarded-proto"],
  });
  next();
});

pool
  .connect()
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(`Database connection error: ${err}`));

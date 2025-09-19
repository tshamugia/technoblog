console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log(
  "All env vars with DB:",
  Object.keys(process.env).filter((key) => key.includes("DB")),
);
console.log("NODE_ENV:", process.env.NODE_ENV);

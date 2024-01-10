import app from "./app/index.js";

import database from "./app/models/database.js";

const run = async () => {
  try {
    const port = process.env.PORT || "3001";
    await database.sync();
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (err) {
    console.log(`FAILED TO START: ${err}`);
  }
};

run();

process.on("SIGINT", async () => {
  await database.close();
  process.exit(0);
});

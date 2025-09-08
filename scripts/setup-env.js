const fs = require("fs");
const path = require("path");

const serverDir = path.resolve(__dirname, "..", "server");
const templatePath = path.join(serverDir, ".env.example");
const localEnvPath = path.join(serverDir, ".env");

if (fs.existsSync(localEnvPath)) {
  console.log("ℹ️  `server/.env` found!");
  return;
}

if (!fs.existsSync(templatePath)) {
  console.error(
    "❌ Error: `server/.env.example` not found! Cannot create .env file."
  );
  process.exit(1);
}

try {
  const templateContent = fs.readFileSync(templatePath, "utf8");
  //we only copy from the actual variables on
  const variablesStartIndex = templateContent.indexOf("# REQUIRED VARIABLES");

  //we exit if not found
  if (variablesStartIndex === -1) {
    throw new Error(
      "Could not find the '# REQUIRED VARIABLES' marker in the template."
    );
  }
  //the actual content of the .env.example file
  const variablesContent = templateContent.substring(variablesStartIndex);
  const newHeader = `# This file was generated from '.env.example'.
#
# --------------------------------------------------------------------
# 👉 EDIT THIS FILE with your personal secrets and configuration.
# --------------------------------------------------------------------
#
# Do NOT commit this file to your repository.
`;
  //we add the new header to the content and write the result
  const newEnvContent = `${newHeader}\n${variablesContent}`;
  fs.writeFileSync(localEnvPath, newEnvContent);

  console.log(
    "✅  Created `server/.env`! Please update it with your environment variables."
  );
} catch (error) {
  console.error("❌  Error: Failed to create `server/.env`.", error);
  process.exit(1);
}

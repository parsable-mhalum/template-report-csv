#!/usr/bin/env node

const auth = require("./src/functions/auth");
const templates = require("./src/functions/templates");
const file_process = require("./src/file_process/write");

const handler = async () => {
  console.info("Extract Templates with no attributes");
  const AUTH_TOKEN = await auth.loginUser();
  const TEAM_DATA = await auth.selectTeam(AUTH_TOKEN);
  const TEMPLATES = await templates.getTemplates(TEAM_DATA.id, AUTH_TOKEN);
  // const FINAL_DATA = await templates.processTemplates(TEMPLATES);

  await file_process.write(TEMPLATES);
};

exports.module = handler();

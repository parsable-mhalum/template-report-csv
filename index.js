#!/usr/bin/env node
const yargs = require("yargs");
const prompts = require("prompts");
const storage = require("node-persist");

const auth = require("./src/functions/auth");
const templates = require("./src/functions/templates");
const file_process = require("./src/file_process/write");
const constants = require("./src/configs");
const { auth_prompts, team_prompt, archive_prompt, drafts_prompt } = constants;

const handler = async () => {
  await storage.init({
    dir: "./src/.storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
  });

  let authToken = await storage.getItem("AUTH_TOKEN");
  let archived = false;
  let published = false;
  let team = "";
  let error = false;

  console.info("Extract Templates to csv");
  const argv = yargs
    .command("login", "Login into Parsable Account", {
      login: {
        description: "Login into Parsable Account",
        alias: "l",
        type: "string",
      },
    })
    .option("team", {
      alias: "t",
      description: "Parsable subdomain for the team",
      type: "string",
    })
    .option("published", {
      alias: "p",
      description: "Extract Published Templates",
      type: "boolean",
    })
    .option("drafts", {
      alias: "d",
      description: "Extract Draft Templates",
      type: "boolean",
    })
    .option("archived", {
      alias: "a",
      description: "Extract Archived Templates",
      type: "boolean",
    })
    .option("unarchived", {
      alias: "u",
      description: "Extract Un-archived Templates",
      type: "boolean",
    })
    .version()
    .alias("version", "v")
    .help()
    .alias("help", "h").argv;

  if (argv.l || authToken === undefined) {
    const auth_data = await prompts(auth_prompts);

    const { email, password } = auth_data;

    authToken = await auth.loginUser(email, password);
    await storage.setItem("AUTH_TOKEN", authToken);
  }

  if (argv.t === undefined) {
    const { subdomain } = await prompts(team_prompt);
    team = subdomain;
  } else {
    team = argv.t;
  }

  const TEAM_DATA = await auth.selectTeam(authToken, team);

  if (!argv.a && !argv.u) {
    const { archivedTemplates } = await prompts(archive_prompt);

    archived = archivedTemplates;
  } else if (argv.a && !argv.u) {
    archived = argv.a;
  } else if (!argv.a && argv.u) {
    archived = !argv.u;
  } else {
    console.log("Error: Can only select either Archived or Un-archived");
    error = true;
  }

  if (!argv.d && !argv.p) {
    const { draftTemplates } = await prompts(drafts_prompt);

    published = !draftTemplates;
  } else if (argv.p && !argv.d) {
    published = argv.p;
  } else if (argv.d && !argv.p) {
    published = !argv.d;
  } else {
    console.log("Error: Can only select either Published or Drafts");
    error = true;
  }

  if (!error) {
    const TEMPLATES = await templates.getTemplates(
      TEAM_DATA.id,
      authToken,
      archived,
      published
    );
    const FINAL_DATA = await templates.processTemplates(TEMPLATES);

    await file_process.write(TEMPLATES, team, published, archived);
  }
};

exports.module = handler();

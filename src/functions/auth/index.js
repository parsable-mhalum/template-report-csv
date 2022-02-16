#!/usr/bin/env node

const { Curl, CurlFeature, curly } = require("node-libcurl");
const { cli } = require("cli-ux");

const constants = require("../../configs");
const { authUrl, teamsUrl, apiHeader } = constants;

const loginUser = async (email, password) => {
  cli.action.start("Logging into Parsable");

  const apiUrl = authUrl;

  const apiData = JSON.stringify({
    method: "login",
    arguments: {
      email: email,
      password: password,
    },
  });

  const { statusCode, data, headers } = await curly.get(apiUrl, {
    httpHeader: apiHeader,
    postFields: apiData,
  });
  cli.action.stop();

  return data.result.success.authToken;
};

const selectTeam = async (authToken, team) => {
  cli.action.start("Logging into Team");

  const apiUrl = teamsUrl;

  apiHeader.push(`Authorization: Token ${authToken}`);

  const apiData = JSON.stringify({
    method: "index",
    arguments: {},
  });

  const { statusCode, data, headers } = await curly.get(apiUrl, {
    httpHeader: apiHeader,
    postFields: apiData,
  });

  const { result } = data;
  const { success } = result;
  let teamData = [];

  success.forEach((item, index) => {
    const { subdomain } = item;
    if (team === subdomain) {
      teamData = success[index];
    }
  });

  cli.action.stop();

  return teamData;
};

module.exports = {
  loginUser: loginUser,
  selectTeam: selectTeam,
};

#!/usr/bin/env node

const { Curl, CurlFeature, curly } = require("node-libcurl");
const { cli } = require("cli-ux");
const _ = require("lodash");

const constants = require("../../configs");

const { templatesUrl, apiHeader, templateSelectOpts } = constants;

const getTemplates = async (teamId, token) => {
  cli.action.start("Fetching Templates");
  const template_data = [];

  const apiUrl = templatesUrl;
  const apiData = JSON.stringify({
    method: "query",
    arguments: {
      selectOpts: templateSelectOpts,
      whereOpts: {
        teamId: teamId,
      },
    },
  });

  const { statusCode, data, headers } = await curly.get(apiUrl, {
    httpHeader: apiHeader,
    postFields: apiData,
  });

  const templates = _.get(data.result.success, "templates");

  cli.action.stop();
  return templates;
};

const processTemplates = async (templates) => {
  cli.action.start("Processing Templates");

  const noAttributes = [];

  templates.forEach((data) => {
    if (data.attributes === undefined && data.metadataEntry.length === 0) {
      noAttributes.push(data);
    }
  });

  return noAttributes;
  cli.action.done();
};

module.exports = {
  getTemplates,
  processTemplates,
};

#!/usr/bin/env node

const { Curl, CurlFeature, curly } = require("node-libcurl");
const { cli } = require("cli-ux");
const _ = require("lodash");

const constants = require("../../configs");

const { templatesUrl, apiHeader, templateSelectOpts } = constants;

const getTemplates = async (teamId, token) => {
  cli.action.start("Fetching Templates");

  const apiUrl = templatesUrl;
  const apiData = JSON.stringify({
    method: "query",
    arguments: {
      selectOpts: templateSelectOpts,
      whereOpts: {
        teamId: teamId,
        isArchived: false,
        isPublished: false,
      },
    },
  });

  const { statusCode, data, headers } = await curly.get(apiUrl, {
    httpHeader: apiHeader,
    postFields: apiData,
  });

  const templates = _.get(data.result.success, "templates");

  if (templates) {
    templates.forEach((value) => {
      const {
        lastAuthoredAt,
        publishedAt,
        archivedAt,
        lastModifiedAt,
        lastAuthor,
        originalAuthor,
        typ,
      } = value;
      const metadataEntry = _.get(value, "metadataEntry");
      const attributes = _.get(value, "attributes");
      const lastAuthorName = _.get(lastAuthor, "name");
      const originalAuthorName = _.get(originalAuthor, "name");
      const newAuthoredAt = new Date(lastAuthoredAt * 1000).toISOString();
      const newPublishedAt = new Date(publishedAt * 1000).toISOString();
      const newArchivedAt = new Date(archivedAt * 1000).toISOString();
      const newModifiedAt = new Date(lastModifiedAt * 1000).toISOString();
      const attributesLabel = [];
      const parameters = [];
      if (metadataEntry) {
        metadataEntry.forEach((data) => {
          const { value, key } = data;
          const text = _.get(value, "text");
          parameters.push(`${key}: ${text}`);
        });
      }
      if (attributes) {
        attributes.forEach((value) => {
          const { values, label } = value;
          const attributesData = [];
          values.forEach((data) => {
            const { label } = data;
            attributesData.push(label);
          });
          attributesLabel.push(`${label}: ${attributesData.toString()}`);
        });
      }
      value["lastAuthoredAt"] = newAuthoredAt;
      value["publishedAt"] = newPublishedAt;
      value["archivedAt"] = archivedAt === 0 ? archivedAt : newArchivedAt;
      value["lastModifiedAt"] = newModifiedAt;
      value["lastAuthor"] = lastAuthorName;
      value["originalAuthor"] = originalAuthorName;
      value["attributes"] = attributesLabel.toString();
      value["parameters"] = parameters.toString();
      value["typ"] = typ === 0 ? "Current" : "Archived";
    });
  }

  // console.log(templates);

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

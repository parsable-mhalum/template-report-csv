#!/usr/bin/env node

const { curly } = require("node-libcurl");
const { cli } = require("cli-ux");
const nodemailer = require("nodemailer");
const _ = require("lodash");

const constants = require("../../configs");

const {
  templatesUrl,
  apiHeader,
  email,
  appPassword,
  templateSelectOpts,
  templateSetSelectOpts,
} = constants;

const getToDelete = async () => {
  cli.action.start("Fetching Templates");

  const apiUrl = `https://api.eu-west-1.parsable.net/api/jobs`;

  const apiData = JSON.stringify({
    method: "query",
    arguments: {
      selectOpts: {
        includeTeam: false,
        includeTemplate: false,
        includeRootHeaders: false,
        includeSteps: false,
        includeDocuments: false,
        includeUsers: false,
        includeStats: false,
        includeActivity: false,
        includeTemplates: false,
        includeCreator: false,
        includeRoles: false,
        includePermissions: false,
        includeExecSnippets: false,
        includeMessages: false,
        includeIssues: false,
        includeDeviationCounts: false,
        includeDeviations: false,
        includeRefMap: false,
        includePlannedDataSheetIds: false,
        includeSnapshottedDataSheetValues: false,
        includeAttributes: false,
      },
      whereOpts: {
        sourceTemplateIds: ["63679104-6094-49bf-beee-2279092520d7"],
        teamId: "470234f8-dea8-40be-b687-3a67f346599a",
        maxCreatedAt: 1641945599,
      },
    },
  });

  const { data } = await curly.get(apiUrl, {
    httpHeader: [
      "Authorization:Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA3MjY2NzEsImlhdCI6MTY0ODEzNDY3MSwiaXNzIjoiYXV0aDpwcm9kdWN0aW9uIiwic2VyYTpzaWQiOiI2M2M5ZjlkMS1mNzliLTQwYWUtODI4OS01MjE2NzAyYjc2NDQiLCJzZXJhOnRlYW1JZCI6IiIsInNlcmE6dHlwIjoiYXV0aCIsInN1YiI6IjBiZWI2NzExLWVmMzAtNDQxYi1iYTg0LTM1NmQ5NmZmYjZmOCJ9.-zFKbkaqyan5zKRVTPQHw86gSFGlaDzXhIxomxI3F4w",
      "Content-Type:application/json",
      "Accept:application/json",
    ],
    postFields: apiData,
  });

  console.log(JSON.stringify(data));
};

const getTemplates = async (teamId, type, archived, published) => {
  cli.action.start("Fetching Templates");

  const apiUrl = `${templatesUrl}${type}`;

  const apiData = JSON.stringify({
    method: "query",
    arguments: {
      selectOpts:
        type === "job_templates" ? templateSelectOpts : templateSetSelectOpts,
      whereOpts: {
        teamId: teamId,
        isArchived: archived,
        isPublished: published,
      },
    },
  });

  const { data } = await curly.get(apiUrl, {
    httpHeader: apiHeader,
    postFields: apiData,
  });

  const templates = _.get(
    data.result.success,
    type === "job_templates" ? "templates" : "templateSets"
  );

  // console.log(data.result);

  if (templates) {
    templates.forEach((value) => {
      const {
        id,
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
      value["id"] = id;
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

  cli.action.done();
  return noAttributes;
};

const sendEmail = async (subdomain, recipient) => {
  const date_ob = new Date();
  const dateToday = date_ob.toLocaleDateString();

  const mail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  var mailOptions = {
    from: email,
    to: recipient,
    subject: `${subdomain} template report ${dateToday}`,
    text: `Hi ${subdomain}\n\nHere is this week's template report!\n\nBest Regards,\nMartin Jaycy Halum\nCustomer Reliability Engineer`,
    attachments: [
      {
        path: `${subdomain}.zip`,
      },
    ],
  };

  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  getToDelete,
  getTemplates,
  processTemplates,
  sendEmail,
};

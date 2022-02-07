#!/usr/bin/env node

require("dotenv").config();
const { BASE_URL, EMAIL, PASSWORD, SUBDOMAIN } = process.env;

const authUrl = `${BASE_URL}/api/auth`;
const teamsUrl = `${BASE_URL}/api/teams`;
const templatesUrl = `${BASE_URL}/api/job_templates`;
const email = EMAIL;
const password = PASSWORD;
const subdomain = SUBDOMAIN;
const apiHeader = [
  "Content-Type: application/json",
  "Accept: application/json",
  "Custom-Parsable-Touchstone: parsable-extract-templates",
];
const templateSelectOpts = {
  includeTeam: false,
  includeRootHeaders: false,
  includeSteps: false,
  includeDocuments: false,
  includeLastPublished: false,
  includeStats: false,
  includeTags: false,
  includeDrafts: false,
  includeLastModified: true,
  includeAttributes: true,
  includeRefMap: false,
  includeOriginalAuthor: true,
  includeLastAuthor: true,
};

const fileHeaders = [
  {
    id: "id",
    title: "id",
  },
  {
    id: "internalVersion",
    title: "internalVersion",
  },
  {
    id: "publicVersion",
    title: "publicVersion",
  },
  {
    id: "title",
    title: "title",
  },
  {
    id: "descrip",
    title: "descrip",
  },
  {
    id: "status",
    title: "status",
  },
  {
    id: "stepGroupId",
    title: "stepGroupId",
  },
  {
    id: "teamId",
    title: "teamId",
  },
  {
    id: "UNSUPPORTEDdocumentEmailAddress",
    title: "UNSUPPORTEDdocumentEmailAddress",
  },
  {
    id: "lastAuthoredAt",
    title: "lastAuthoredAt",
  },
  {
    id: "publishedAt",
    title: "publishedAt",
  },
  {
    id: "archivedAt",
    title: "archivedAt",
  },
  {
    id: "lastAuthorId",
    title: "lastAuthorId",
  },
  {
    id: "system",
    title: "system",
  },
  {
    id: "metadataEntry",
    title: "metadataEntry",
  },
  {
    id: "metadataById",
    title: "metadataById",
  },
  {
    id: "publishedVersion",
    title: "publishedVersion",
  },
  {
    id: "typ",
    title: "typ",
  },
  {
    id: "drafts",
    title: "drafts",
  },
  {
    id: "lastModifiedAt",
    title: "lastModifiedAt",
  },
];

module.exports = {
  authUrl,
  teamsUrl,
  templatesUrl,
  email,
  password,
  subdomain,
  apiHeader,
  templateSelectOpts,
  fileHeaders,
};

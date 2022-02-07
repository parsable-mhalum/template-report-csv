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
    id: "publishedVersion",
    title: "Published Version",
  },
  {
    id: "title",
    title: "Title",
  },
  {
    id: "descrip",
    title: "Description",
  },
  {
    id: "status",
    title: "Status",
  },
  {
    id: "lastAuthoredAt",
    title: "Last Authored At",
  },
  {
    id: "publishedAt",
    title: "Published At",
  },
  {
    id: "archivedAt",
    title: "Archived At",
  },
  {
    id: "lastModifiedAt",
    title: "lastModifiedAt",
  },
  {
    id: "typ",
    title: "Type",
  },
  {
    id: "drafts",
    title: "Drafts",
  },
  {
    id: "attributes",
    title: "Attributes",
  },
  {
    id: "parameters",
    title: "Parameters",
  },
  {
    id: "originalAuthor",
    title: "Original Author",
  },
  {
    id: "lastAuthor",
    title: "Last Author",
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

#!/usr/bin/env node

require("dotenv").config();
const { BASE_URL, EMAIL, PASSWORD, SUBDOMAIN } = process.env;

const authUrl = `${BASE_URL}/api/auth`;
const teamsUrl = `${BASE_URL}/api/teams`;
const templatesUrl = `${BASE_URL}/api/`;
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

const templateSetSelectOpts = {
  includeTeam: false,
  includeLastPublished: false,
  includeLastAuthor: true,
  includeTemplates: false,
  includeTags: false,
  includeCounts: false,
  includeLastModified: true,
  includeAttributes: true,
  includeOriginalAuthor: true,
};

const fileHeaders = [
  {
    id: "id",
    title: "ID",
  },
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

const auth_prompts = [
  {
    type: "text",
    name: "email",
    message: "Please enter your email:",
  },
  {
    type: "password",
    name: "password",
    message: "Please enter your password:",
  },
];

const type_prompt = [
  {
    type: "select",
    name: "template_type",
    message: "Select Template Type:",
    choices: [
      {
        title: "Job Templates",
        description: "Extract Job Templates",
        value: "job_templates",
      },
      {
        title: "Template Sets",
        description: "Extract Template Sets",
        value: "template_sets",
      },
    ],
  },
];

const team_prompt = [
  {
    type: "text",
    name: "subdomain",
    message: "Please enter your subdomain:",
  },
];

const archive_prompt = {
  type: "toggle",
  name: "archivedTemplates",
  message: "Include Archived?",
  initial: false,
  active: "yes",
  inactive: "no",
};

const drafts_prompt = {
  type: "toggle",
  name: "draftTemplates",
  message: "Include Drafts?",
  initial: false,
  active: "yes",
  inactive: "no",
};

module.exports = {
  authUrl,
  teamsUrl,
  templatesUrl,
  email,
  password,
  subdomain,
  apiHeader,
  templateSelectOpts,
  templateSetSelectOpts,
  fileHeaders,
  auth_prompts,
  type_prompt,
  team_prompt,
  archive_prompt,
  drafts_prompt,
};

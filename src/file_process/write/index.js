#!/usr/bin/env node

const { cli } = require("cli-ux");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const constants = require("../../configs");

const { fileHeaders } = constants;

const write = (type, templates, subdomain, published, archived) => {
  cli.action.start("Writing Templates CSV");
  const csvWriter = createCsvWriter({
    path: `${type === "template_sets" ? "TS-" : ""}${subdomain}${
      published ? "-published" : "-drafts"
    }${archived ? "-archived" : ""}.csv`,
    header: fileHeaders,
  });

  csvWriter
    .writeRecords(templates)
    .then(() => console.log("The CSV file was written successfully"));

  cli.action.stop();
};

module.exports = {
  write,
};

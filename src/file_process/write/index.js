#!/usr/bin/env node

const { cli } = require("cli-ux");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const constants = require("../../configs");

const { fileHeaders, subdomain } = constants;

const write = (templates) => {
  cli.action.start("Writing Templates CSV");
  const csvWriter = createCsvWriter({
    path: `${subdomain}-drafts.csv`,
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

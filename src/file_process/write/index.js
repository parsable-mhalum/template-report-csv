#!/usr/bin/env node

const { cli } = require("cli-ux");
const AdmZip = require("adm-zip");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const constants = require("../../configs");

const { fileHeaders } = constants;

const write = (type, templates, subdomain, published, archived) => {
  cli.action.start("Writing Templates CSV");
  const csvWriter = createCsvWriter({
    path: `output/${type === "template_sets" ? "TS-" : ""}${subdomain}${
      published ? "-published" : "-drafts"
    }${archived ? "-archived" : ""}.csv`,
    header: fileHeaders,
  });

  csvWriter
    .writeRecords(templates)
    .then(() => console.log("The CSV file was written successfully"));

  cli.action.stop();
};

const createZip = async (subdomain) => {
  try {
    const zip = new AdmZip();
    const outputFile = `${subdomain}.zip`;
    zip.addLocalFolder("./output");
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
};

module.exports = {
  write,
  createZip,
};

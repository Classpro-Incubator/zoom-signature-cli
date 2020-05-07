#!/usr/bin/env node

const crypto = require("crypto");
const program = require("commander");

program.version("0.0.1").description("Zoom signature generatore");
program
  .requiredOption("-k, --api-key <value>", "Zoom JWT API Key")
  .requiredOption("-s, --api-secret <value>", "Zoom JWT API Secret")
  .requiredOption("-n, --meeting-number <value>", "Zoom Meeting Number")
  .requiredOption("-r, --role <value>", "0 for join and 1 for start meeting")
  .parse(process.argv);

const apiKey = program.apiKey;
const meetingNumber = program.meetingNumber;
const apiSecret = program.apiSecret;
const role = program.role;

console.log(generateSignature(apiKey, apiSecret, meetingNumber, role));

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  const timestamp = new Date().getTime() - 30000;

  const message = Buffer.from(
    apiKey + meetingNumber + timestamp + role
  ).toString("base64");

  const hash = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("base64");

  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");

  return signature;
}

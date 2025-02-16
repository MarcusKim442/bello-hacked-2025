const sc = require("./searchClaim.js");
const mce = require("./matchClaimEvidence.js");

const sampleClaim = "the moon landing was faked by the american government";

async function labelClaim(claim) {
  const webResults = await sc.getResults(claim);
  const labelling = await mce.getSource(claim, webResults);
  const splitStrings = labelling.trim().split(/\r?\n/);
  const resultIndex = +splitStrings[1].trim() - 1;
  const result = webResults[resultIndex];
  const truth = splitStrings[2].trim() == "True";

  return {
    title: result.title,
    link: result.link,
    summary: splitStrings[0],
    truth: truth,
  };
}

async function main() {
  console.log(`Claim: ${sampleClaim}`);
  try {
    const data = await labelClaim(sampleClaim);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

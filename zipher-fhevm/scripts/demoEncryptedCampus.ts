import { ethers } from "hardhat";

async function main() {
  const campusAddr = "0x6b6bE0dF48174829e10F7BDdFc5ee57B57571b9f";

  const [admin] = await ethers.getSigners();
  console.log("Admin:", admin.address);

  const campus = await ethers.getContractAt("EncryptedCampusState", campusAddr);

  // Example IDs
  const groupId = ethers.id("zipher-devs");       // keccak256("zipher-devs")
  const metricId = ethers.id("daily_signups");    // keccak256("daily_signups")
  const pollId = ethers.id("welcome_poll");       // keccak256("welcome_poll")

  const someUser = admin.address; // for now, test with yourself

  // 1) Membership (plaintext)
  console.log("→ Setting membership...");
  await (await campus.setMembership(groupId, someUser, true)).wait();

  const membershipHandle = await campus.getMembershipHandle(groupId, someUser);
  console.log("membership handle =", membershipHandle);

  // 2) Reputation (plaintext)
  console.log("→ Init + add reputation...");
  await (await campus.initReputation(groupId, someUser, 10)).wait();
  await (await campus.addReputation(groupId, someUser, 5)).wait();

  const repHandle = await campus.getReputationHandle(groupId, someUser);
  console.log("reputation handle =", repHandle);

  // 3) Poll
  console.log("→ Creating poll...");
  await (await campus.createPoll(pollId, 2)).wait(); // options 0,1,2

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const { getAddress, Wallet } = require("ethers");

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

function normalise(addr) {
  return getAddress(addr.trim());
}

function parseUintEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") {
    if (fallback === undefined) {
      throw new Error(`${name} env var is required`);
    }
    return BigInt(fallback);
  }
  const value = BigInt(raw.trim());
  if (value < 0n) throw new Error(`${name} must be positive`);
  return value;
}

function parseNumberEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") {
    if (fallback === undefined) {
      throw new Error(`${name} env var is required`);
    }
    return fallback;
  }
  const value = Number(raw.trim());
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

/* -------------------------------------------------------------------------- */
/*                             ENV VARIABLES                                  */
/* -------------------------------------------------------------------------- */

const privateKey = process.env.PRIVATE_KEY || "";
const adminAddress = process.env.ADMIN_ADDRESS
  ? normalise(process.env.ADMIN_ADDRESS)
  : privateKey.length === 66 || privateKey.length === 64
    ? new Wallet(privateKey).address
    : "";

if (!adminAddress) {
  throw new Error("ADMIN_ADDRESS or PRIVATE_KEY must be provided");
}

const membershipURI = process.env.MEMBERSHIP_METADATA_URI;
const badgeURI = process.env.BADGE_METADATA_URI;

const existingMembershipAddress = process.env.MEMBERSHIP_CONTRACT_ADDRESS
  ? normalise(process.env.MEMBERSHIP_CONTRACT_ADDRESS)
  : "";

const existingRegistrarAddress = process.env.REGISTRAR_CONTRACT_ADDRESS
  ? normalise(process.env.REGISTRAR_CONTRACT_ADDRESS)
  : "";

const membershipDurationSeconds = parseUintEnv("MEMBERSHIP_DURATION_SECONDS", 60 * 60 * 24 * 30);
const membershipTransferCooldownSeconds = parseUintEnv(
  "MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS",
  60 * 60 * 24
);

const treasuryEnv =
  process.env.MARKETPLACE_TREASURY_ADDRESS || process.env.PLATFORM_TREASURY_ADDRESS;

const marketplaceTreasuryAddress = treasuryEnv ? normalise(treasuryEnv) : "";
if (!marketplaceTreasuryAddress) {
  throw new Error("MARKETPLACE_TREASURY_ADDRESS or PLATFORM_TREASURY_ADDRESS is required");
}

const marketplaceFeeBps = parseNumberEnv("MARKETPLACE_FEE_BPS", 250);
const marketplaceMaxListingDuration = parseUintEnv(
  "MARKETPLACE_MAX_LISTING_DURATION_SECONDS",
  60 * 60 * 24 * 7
);

/* -------------------------------------------------------------------------- */
/*                                 EXPORTS                                     */
/* -------------------------------------------------------------------------- */

module.exports = {
  adminAddress,
  membershipURI,
  badgeURI,
  existingMembershipAddress,
  existingRegistrarAddress,
  membershipDurationSeconds,
  membershipTransferCooldownSeconds,
  marketplaceTreasuryAddress,
  marketplaceFeeBps,
  marketplaceMaxListingDuration
};

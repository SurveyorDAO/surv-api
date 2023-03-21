const BN = require("bn.js")
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3002'
const CHAIN_ID = process.env.CHAIN_ID || 250
const RPC = process.env.RPC_URL || 'https://rpc.ankr.com/fantom'

// addresses //
const DAO_ADDRESS = "0x91b331dbb368A89EdB9Bb3e2A7e16b1A4e18B43D"
const TEAM_ADDRESS = "0x1a4eA35FF39a886B8EDf347712B02A1A1fBbF2a6"
const AIRDROP_ADDRESS = "0x2424e81b10EB66BF89d1Ddf54b120F19B0d930c5"
const FARM_ADDRESS = "0x87ED587e2a52bA28c6dA63199E9988067d10Fe34"

const TOKEN_ADDRESS = "0x5d9EaFC54567F34164A269Ba6C099068df6ef651"

// numeric //
const _1E18 = new BN("1000000000000000000")
const MAX_SUPPLY = 25_000_000 // aka 25M

// exports constants //
module.exports = {
  API_BASE_URL, CHAIN_ID, RPC, 
  DAO_ADDRESS, TEAM_ADDRESS, AIRDROP_ADDRESS, FARM_ADDRESS, 
  TOKEN_ADDRESS, MAX_SUPPLY, _1E18
}
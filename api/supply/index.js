'use strict'

const { web3Factory } = require("../../utils/web3")
const ERC20ContractABI = require('../../abis/ERC20ContractABI.json')
const { _1E18, CHAIN_ID, DAO_ADDRESS, TEAM_ADDRESS, AIRDROP_ADDRESS, FARM_ADDRESS, TOKEN_ADDRESS, MAX_SUPPLY } = require("../../constants")
const BN = require('bn.js')

const web3 = web3Factory(CHAIN_ID)
const tokenContract = new web3.eth.Contract(ERC20ContractABI, TOKEN_ADDRESS)

class Cache {
    minElapsedTimeInMs = 10000 // 10 seconds

    constructor() {
        this.cachedCirculatingSupply = undefined
        this.cachedMaxSupply = undefined
        this.cachedTotalSupply = undefined
    }

    async getTotalSupply() {
        if (!this.cachedTotalSupply ||
            this.cachedTotalSupply.lastRequestTimestamp + this.minElapsedTimeInMs < Date.now() // check if supply needs to be updated
        ) {
            const totalSupply = new BN(await tokenContract.methods.totalSupply().call())
            const lastRequestTimestamp = Date.now()
            this.cachedTotalSupply = {totalSupply, lastRequestTimestamp}
        }
        
        return this.cachedTotalSupply.totalSupply
    }
    
    async getMaxSupply() {
        if (!this.cachedMaxSupply) {
            const tokenDecimals = await tokenContract.methods.decimals().call()
            const maxSupply = MAX_SUPPLY * 10**tokenDecimals
            const lastRequestTimestamp = Date.now()
            this.cachedMaxSupply = {maxSupply, lastRequestTimestamp}
        }
        return this.cachedMaxSupply.maxSupply
    }

    async getCirculatingSupply() {
        if (!this.cachedCirculatingSupply ||
            this.cachedCirculatingSupply.lastRequestTimestamp + this.minElapsedTimeInMs < Date.now() // check if supply needs to be updated
        ) {
            const results = await Promise.all([
                this.getTotalSupply(),          // SUPPLY [0]
                getBalanceOf(DAO_ADDRESS),      // DAO RESERVES [1]
                getBalanceOf(TEAM_ADDRESS),     // TEAM RESERVES [2]
                getBalanceOf(AIRDROP_ADDRESS),  // AIRDROP [3]
                getBalanceOf(FARM_ADDRESS),     // INCENTIVES [4]
            ])

            // SUPPLY [0] - DAO [1] - TEAM [2] - AIRDROP [3] - INCENTIVES [4]
            const circulatingSupply 
                = new BN(results[0]).sub(new BN(results[1]))
                    .sub(new BN(results[2])).sub(new BN(results[3])).sub(new BN(results[4]))

            const lastRequestTimestamp = Date.now()
            this.cachedCirculatingSupply = {circulatingSupply, lastRequestTimestamp}
        }
        return this.cachedCirculatingSupply.circulatingSupply
    }
}

async function getBalanceOf(address) {
    return await tokenContract.methods.balanceOf(address).call()
}

async function circulatingSupply(ctx) {
    ctx.body = (await cache.getCirculatingSupply()).toString()
}

async function circulatingSupplyAdjusted(ctx) {
    ctx.body = ((await cache.getCirculatingSupply()).div(_1E18)).toString()
}

async function totalSupply(ctx) {
    ctx.body = (await cache.getTotalSupply()).toString()
}

async function totalSupplyAdjusted(ctx) {
    ctx.body = ((await cache.getTotalSupply()).div(_1E18)).toString()
}

async function maxSupply(ctx) {
    ctx.body = (await cache.getMaxSupply()).toString()
}

const cache = new Cache()
module.exports = { circulatingSupply, circulatingSupplyAdjusted, totalSupply, totalSupplyAdjusted, maxSupply }
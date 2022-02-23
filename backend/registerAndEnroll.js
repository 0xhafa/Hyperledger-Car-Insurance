/*
 * SPDX-License-Identifier: MIT
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./utils/CAUtil.js');
const { buildCCP, buildWallet } = require('./utils/AppUtil.js');

const orgMSP = process.env.ORG_MSP;
const walletPath = path.join(__dirname, 'wallet');

const registerAndEnroll = async () => {
    try {
        const identities = JSON.parse(fs.readFileSync(process.env.INITIAL_IDENTITIES));
        const ccp = buildCCP();
        const caClient = buildCAClient(FabricCAServices, ccp, `ca.${orgMSP}.example.com`);
        const wallet = await buildWallet(Wallets, walletPath);
    
        await enrollAdmin(caClient, wallet, orgMSP);
    
        for(let identity of identities) {
            await registerAndEnrollUser(caClient, wallet, orgMSP, identity);
        }
        console.log('Initial identities added successfully');
    } catch(error) {
        console.log(`Error while adding initial identities:\n${error.message}`);
    }
}

registerAndEnroll();
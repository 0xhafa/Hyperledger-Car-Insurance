/*
 * SPDX-License-Identifier: MIT
 */

'use strict';

const path = require('path');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const crypto = require('crypto');
require('dotenv').config();

const { buildCAClient } = require('./CAUtil.js');
const { buildCCP, buildWallet } = require('./AppUtil.js');

const channelName = process.env.CHANNEL_NAME;
const chaincodeName =  process.env.CHAINCODE_NAME;
const orgMSP = process.env.ORG_MSP;
const walletPath = path.join(__dirname, '..', 'wallet');

function defaultPolicy() {
    const defaultCoverage = {
        Active: false,  
        CoveredAmount: 0, 
        ClaimedToDate: 0
    };

    return {
        StartDate: '',
        EndDate: '',
        MainDriver: {
            FirstName: '', 
            LastName: '', 
            DriversLicenseNo: ''
        },
        Car: {
            Model: '',
            Year: '',
            LicensePlate: ''
        },
        Coverage: {
            BodilyInjuryLiability:    {...defaultCoverage},
            PropertyDamageLiability:  {...defaultCoverage},
            Collision:                {...defaultCoverage},
            PersonalInjuryProtection: {...defaultCoverage},
            UnderinsuredMotorist:     {...defaultCoverage}
        }
    }
}

class Insurance {
    constructor(userId) {
        this.channelName = channelName;
        this.chaincodeName = chaincodeName;
        this.orgMSP = orgMSP;
        this.walletPath = walletPath;
        this.userId = userId;
        this.ccp = buildCCP();
        this.caClient = buildCAClient(FabricCAServices, this.ccp, `ca.${this.orgMSP}.example.com`);
        this.gateway = new Gateway();
        return this;
    }

    async init() {
        console.log('Initializing InsuranceConnector');
        this.wallet = await buildWallet(Wallets, this.walletPath);

        await this.gateway.connect(this.ccp, {
            wallet: this.wallet,
            identity: this.userId,
            discovery: { enabled: true, asLocalhost: true }
        });

        this.network = await this.gateway.getNetwork(this.channelName);
        this.contract = this.network.getContract(this.chaincodeName);
        return this;
    }

    disconnect() {
        this.gateway.disconnect();
    }

    async submitPolicy(policy) {
        console.log('Submitting new policy');
        const tx = this.contract.createTransaction('SubmitPolicy');
        
        tx.setEndorsingOrganizations(this.orgMSP);
        tx.setTransient({
            policy: Buffer.from(JSON.stringify(policy)).toString('base64')
        });
			
        return (await tx.submit()).toString();
    }

    async addClaim(policyNo, claimDescription) {
        console.log(`Adding new claim for policy ${policyNo}`);
        const tx = this.contract.createTransaction('AddClaim');
        
        tx.setEndorsingOrganizations(this.orgMSP);
        tx.setTransient({
            claim: Buffer.from(JSON.stringify(claimDescription)).toString('base64')
        });
			
        return (await tx.submit(policyNo)).toString();
    }

    async activatePolicy(policyNo) {
        console.log(`Activating policy ${policyNo}`);
        const tx = this.contract.createTransaction('ActivatePolicy');
        tx.setEndorsingOrganizations(this.orgMSP);
        return (await tx.submit(policyNo)).toString();
    }

    async expirePolicy(policyNo) {
        console.log(`Expiring policy ${policyNo}`);
        const tx = this.contract.createTransaction('ExpirePolicy');
        tx.setEndorsingOrganizations(this.orgMSP);
        return (await tx.submit(policyNo)).toString();
    }
    
    async suspendPolicy(policyNo) {
        console.log(`Suspending policy ${policyNo}`);
        const tx = this.contract.createTransaction('SuspendPolicy');
        tx.setEndorsingOrganizations(this.orgMSP);
        return (await tx.submit(policyNo)).toString();
    }

    async reviewClaim(policyNo, claimNo, newState, amounts={}) {
        console.log(`Reviewing claim ${claimNo} of policy ${policyNo} ---> ${newState}`);
        const tx = this.contract.createTransaction('ReviewClaim');
        tx.setEndorsingOrganizations(this.orgMSP);
        await tx.submit(policyNo, claimNo, newState, JSON.stringify(amounts));
    }

    async payoutClaim(policyNo, claimNo) {
        console.log(`Paying out claim ${claimNo} of policy ${policyNo}`);
        const tx = this.contract.createTransaction('PayoutClaim');
        tx.setEndorsingOrganizations(this.orgMSP);
        return (await tx.submit(policyNo, claimNo)).toString();
    }

    async updatePolicyMetadata(policyNo) {
        console.log(`Updating metadata for policy ${policyNo}`);
        const tx = this.contract.createTransaction('UpdatePolicyMetadata');
        tx.setEndorsingOrganizations(this.orgMSP);
        return (await tx.submit(policyNo)).toString();
    }

    async readPolicy(policyNo) {
        const tx = this.contract.createTransaction('ReadPolicy');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate(policyNo)).toString());
    }

    async readClaims(policyNo) {
        const tx = this.contract.createTransaction('ReadClaims');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate(policyNo)).toString());
    }

    async readPolicyMetadata(policyNo) {
        const tx = this.contract.createTransaction('ReadPolicyMetadata');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate(policyNo)).toString());
    }

    async calculatePolicyHash(policy) {
        policy.Claims = [];
        return crypto.createHash('sha256').update(Buffer.from(JSON.stringify(policy))).digest('hex');
    }

    async getAllPolicies() {
        const tx = this.contract.createTransaction('GetAllPolicies');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate()).toString());
    }

    async getAllClaims() {
        const tx = this.contract.createTransaction('GetAllClaims');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate()).toString());
    }

    async getAllPoliciesForClient(clientId) {
        const tx = this.contract.createTransaction('GetAllPoliciesForClient');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate(clientId)).toString());
    }

    async getAllClaimsForClient(clientId) {
        const tx = this.contract.createTransaction('GetAllClaimsForClient');
        tx.setEndorsingOrganizations(this.orgMSP);
        return JSON.parse((await tx.evaluate(clientId)).toString());
    }
}

module.exports = {defaultPolicy, Insurance};
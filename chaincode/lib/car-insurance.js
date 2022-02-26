/*
 * SPDX-License-Identifier: MIT
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');
const axios = require('axios');
const backendUrl = require('./backend.json').url;

const POLICY_STATE = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    EXPIRED: 'EXPIRED'
}

const CLAIM_STATE = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    PAID_OUT: 'PAID_OUT'
}

class CarInsurance extends Contract {
    /*
    * Rewrites the customer provided policy object to the standard form.
    * 
    * @param policy    Customer's policy object.
    * @return Standard policy object.
    */
    ConformPolicy(policy) {
        return Object.fromEntries([
            ['StartDate', policy.StartDate],
            ['EndDate', policy.EndDate],
            ['MainDriver', {
                FirstName: policy.MainDriver.FirstName,
                LastName: policy.MainDriver.LastName,
                DriversLicenseNo: policy.MainDriver.DriversLicenseNo
            }],
            ['Car', {
                Model: policy.Car.Model,
                Year: policy.Car.Year,
                LicensePlate: policy.Car.LicensePlate
            }],
            ['Coverage', {
                BodilyInjuryLiability: {
                    Active: policy.Coverage.BodilyInjuryLiability.Active,  
                    CoveredAmount: policy.Coverage.BodilyInjuryLiability.CoveredAmount,
                    ClaimedToDate: 0
                },
                PropertyDamageLiability: {
                    Active: policy.Coverage.PropertyDamageLiability.Active,  
                    CoveredAmount: policy.Coverage.PropertyDamageLiability.CoveredAmount,
                    ClaimedToDate: 0
                },
                Collision: {
                    Active: policy.Coverage.Collision.Active,  
                    CoveredAmount: policy.Coverage.Collision.CoveredAmount,
                    ClaimedToDate: 0
                },
                PersonalInjuryProtection: {
                    Active: policy.Coverage.PersonalInjuryProtection.Active,  
                    CoveredAmount: policy.Coverage.PersonalInjuryProtection.CoveredAmount,
                    ClaimedToDate: 0
                },
                UnderinsuredMotorist: {
                    Active: policy.Coverage.UnderinsuredMotorist.Active,  
                    CoveredAmount: policy.Coverage.UnderinsuredMotorist.CoveredAmount,
                    ClaimedToDate: 0
                },
            }],
            ['Claims', []]
        ]);
    }

    /*
    * Takes transient policy object from customer and saves its standard form in a private collection.
    * 
    * @return Policy number.
    */
    async SubmitPolicy(ctx) {
        if(!ctx.clientIdentity.assertAttributeValue('role', 'customer')) {
            throw new Error('Client is not authorized to submit the policy');
        }

        const policy = this.ConformPolicy(JSON.parse(ctx.stub.getTransient().get('policy').toString('utf8')));
        policy.Timestamp = ctx.stub.getTxTimestamp();
        policy.PolicyNo = ctx.stub.getTxID();
        policy.ClientID = this.ExtractClientName(ctx.clientIdentity.getID());
        policy.InsuranceCompany = ctx.clientIdentity.getMSPID();
        policy.State = POLICY_STATE.PENDING;

        await ctx.stub.putPrivateData("policies", policy.PolicyNo, JSON.stringify(policy));
        return policy.PolicyNo;
    }

    /*
    * Takes transient claim description from customer and saves it under given policy number.
    * 
    * @param policyNo   Policy number.
    * @return Claim number.
    */
    async AddClaim(ctx, policyNo) {
        const policy = await this.ReadPolicy(ctx, policyNo);
        const clientID = this.ExtractClientName(ctx.clientIdentity.getID());
        if (clientID !== policy.ClientID) {
            throw new Error(`Client ${clientID} is not authorized to make a claim on policy ${policyNo}`);
        }

        if(policy.State !== POLICY_STATE.ACTIVE) {
            throw new Error(`The policy ${policyNo} is in inactive state`);
        }

        const claimDescription = ctx.stub.getTransient().get('claim').toString('utf8');
        
        const claimNo = ctx.stub.getTxID();
        policy.Claims.push({
            Timestamp: ctx.stub.getTxTimestamp(),
            Description: claimDescription,
            PolicyNo: policyNo,
            ClaimNo: claimNo,
            State: CLAIM_STATE.PENDING
        });

        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
        return claimNo;
    }

    /*
    * Activates pending or suspended policy.
    * 
    * @param policyNo   Policy number.
    * @return Hash of the active policy.
    */
    async ActivatePolicy(ctx, policyNo) {
        const policy = await this.ReadPolicy(ctx, policyNo);
        
        if(policy.State !== POLICY_STATE.PENDING && policy.State !== POLICY_STATE.SUSPENDED) {
            throw new Error(`The policy ${policyNo} is not in pending nor suspended state`);
        }

        if(policy.State === POLICY_STATE.PENDING) {
            await this.AuthorizeRole(ctx, policyNo, 'worker');
        } else {
            await this.AuthorizeRole(ctx, policyNo, 'manager');
        }

        await axios.get(`${backendUrl}/isPaid?policyNo=${policyNo}`)
        .then(result => {
            if(result.data !== 'PAID') 
                throw new Error(`The policy ${policyNo} premium is not paid yet`);
        })

        policy.State = POLICY_STATE.ACTIVE;
        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
        return this.CalculatePolicyHash(policy);
    }

    /*
    * Expires active or suspended policy.
    * 
    * @param policyNo   Policy number.
    * @return Hash of the expired policy.
    */
    async ExpirePolicy(ctx, policyNo) {
        await this.AuthorizeRole(ctx, policyNo, 'worker');
        const policy = await this.ReadPolicy(ctx, policyNo);

        if(policy.State !== POLICY_STATE.ACTIVE && policy.state !== POLICY_STATE.SUSPENDED) {
            throw new Error(`The policy ${policyNo} is not in active nor suspended state`);
        }

        if(policy.Claims.some(claim => claim.State === CLAIM_STATE.PENDING)) {
            throw new Error(`At least one claim for policy ${policyNo} is in pending state`);
        }

        policy.State = POLICY_STATE.EXPIRED;
        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
        return this.CalculatePolicyHash(policy);
    }

    /*
    * Suspends active policy.
    * 
    * @param policyNo   Policy number.
    * @return Hash of the suspended policy.
    */
    async SuspendPolicy(ctx, policyNo) {
        await this.AuthorizeRole(ctx, policyNo, 'worker');
        const policy = await this.ReadPolicy(ctx, policyNo);

        if(policy.State !== POLICY_STATE.ACTIVE) {
            throw new Error(`The policy ${policyNo} is not in active state`);
        }

        policy.State = POLICY_STATE.SUSPENDED;
        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
        return this.CalculatePolicyHash(policy);
    }    

    /*
    * Accepts or rejects a given claim. Sets the amounts and coverage type from which damage will be covered.
    * 
    * @param policyNo   Policy number.
    * @param claimNo    Claim number.
    * @param newState   Accepted or Rejected state.
    * @param amounts    Coverage type to amount map
    */
    async ReviewClaim(ctx, policyNo, claimNo, newState, amounts) {     
        await this.AuthorizeRole(ctx, policyNo, 'adjuster');
        const policy = await this.ReadPolicy(ctx, policyNo);
    
        const claimIndex = policy.Claims.findIndex(claim => claim.ClaimNo === claimNo);
        if(claimIndex === -1) {
            throw new Error(`Claim ${claimNo} doesn't exist for the policy ${policyNo}`);
        }
        
        if(newState === CLAIM_STATE.REJECTED) {
            policy.Claims[claimIndex].State = CLAIM_STATE.REJECTED;
        } else if(newState === CLAIM_STATE.ACCEPTED) {
            policy.Claims[claimIndex].State = CLAIM_STATE.ACCEPTED;
            policy.Claims[claimIndex].Amounts = {};
            amounts = JSON.parse(amounts);

            for(const type in amounts) {
                if(!policy.Coverage[type] || !policy.Coverage[type].Active) {
                    continue;
                }
                policy.Claims[claimIndex].Amounts[type] = 
                    (policy.Coverage[type].ClaimedToDate + parseFloat(amounts[type]) >=
                    policy.Coverage[type].CoveredAmount) ? 
                    policy.Coverage[type].CoveredAmount - policy.Coverage[type].ClaimedToDate :
                    parseFloat(amounts[type]);
            }

            if(Object.keys(policy.Claims[claimIndex].Amounts).length === 0) {
                throw new Error(`Error while reviewing claim ${claimNo} of the policy ${policyNo}. Provide coverage types and amounts`);
            }
        } else {
            throw new Error(`Cannot set the claim state to ${newState} for claim ${claimNo} of the policy ${policyNo}`);
        }

        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
    }

    /*
    * Pays out accepted claim.
    * 
    * @param policyNo   Policy number.
    * @param claimNo    Claim number.
    * @return Hash of the policy.
    */
    async PayoutClaim(ctx, policyNo, claimNo) {
        await this.AuthorizeRole(ctx, policyNo, 'bookkeeper');
        const policy = await this.ReadPolicy(ctx, policyNo);

        if(policy.State !== POLICY_STATE.ACTIVE) {
            throw new Error(`The policy ${policyNo} is in inactive state`);
        }
    
        const claimIndex = policy.Claims.findIndex(claim => claim.ClaimNo === claimNo);
        if(claimIndex === -1) {
            throw new Error(`Claim ${claimNo} doesn't exist for the policy ${policyNo}`);
        }
        
        if(policy.Claims[claimIndex].State === CLAIM_STATE.ACCEPTED) {
            policy.Claims[claimIndex].State = CLAIM_STATE.PAID_OUT;

            for(const type in policy.Claims[claimIndex].Amounts) {
                policy.Coverage[type].ClaimedToDate += policy.Claims[claimIndex].Amounts[type];
            }
        } else {
            throw new Error(`Cannot set the claim state to ${CLAIM_STATE.PAID_OUT} for claim ${claimNo} of the policy ${policyNo}`);
        }

        await ctx.stub.putPrivateData("policies", policyNo, JSON.stringify(policy));
        return this.CalculatePolicyHash(policy);
    }

    /*
    * Saves hash of the policy and its state to the world state.
    * 
    * @param policyNo   Policy number.
    * @return Hash of the policy.
    */
    async UpdatePolicyMetadata(ctx, policyNo) {
        if (!(await this.PolicyExists(ctx, policyNo))) {
            throw new Error(`The policy ${policyNo} does not exist`);
        }

        const policy = JSON.parse(await ctx.stub.getPrivateData("policies", policyNo));
        const hash = this.CalculatePolicyHash(policy);
        await ctx.stub.putState(policy.PolicyNo, JSON.stringify({State: policy.State, Hash: hash}));
        return hash;
    }

    /*
    * Saves hash of the policy to the world state.
    * 
    * @param policyNo   Policy number.
    * @return Hash of the policy.
    */
    async ReadPolicyMetadata(ctx, policyNo) {
        return JSON.parse(await ctx.stub.getState(policyNo));
    }

    /*
    * Checks whether given policy exists.
    * 
    * @param policyNo     Policy number.
    * @return True if policy exists, false otherwise.
    */
    async PolicyExists(ctx, policyNo) {
        try {
            const policy = JSON.parse(await ctx.stub.getPrivateData("policies", policyNo));
            return policy.PolicyNo.length === 64;
        } catch {
            return false;
        }
    }

    /*
    * Retrieves given policy from private collection.
    * 
    * @param policyNo     Policy number.
    * @return Policy object.
    */
    async ReadPolicy(ctx, policyNo) {
        if (!(await this.PolicyExists(ctx, policyNo))) {
            throw new Error(`The policy ${policyNo} does not exist`);
        }

        if(!(await this.IsAuthorizedToReadGiven(ctx, policyNo))) {
            throw new Error(`Client is not authorized to read the policy ${policyNo}`);
        }

        return JSON.parse(await ctx.stub.getPrivateData("policies", policyNo));
    }

    /*
    * Retrieves claims for a given policy.
    * 
    * @param policyNo     Policy number.
    * @return Claims object for a given policy.
    */
    async ReadClaims(ctx, policyNo) {
        return (await this.ReadPolicy(ctx, policyNo)).Claims;
    }

    /*
    * Checks whether given client is authorized to read a policy.
    * 
    * @param policyNo     Policy number.
    * @return True if authorized, false otherwise.
    */
    async IsAuthorizedToReadGiven(ctx, policyNo) {
        const policy = JSON.parse(await ctx.stub.getPrivateData("policies", policyNo));
        const clientMSPID = ctx.clientIdentity.getMSPID();
        const clientID = this.ExtractClientName(ctx.clientIdentity.getID());

        if (clientMSPID === policy.InsuranceCompany &&
           (clientID    === policy.ClientID ||
            await this.IsAuthorizedToReadAll(ctx))) {
            return true;
        }
        return false;
    }

    /*
    * Checks whether given client is authorized to read all the policies and claims.
    * 
    * @return True if authorized, false otherwise.
    */
    async IsAuthorizedToReadAll(ctx) {
        const authRoles = ['worker', 'manager', 'adjuster', 'bookkeeper', 'reader'];
        const role = ctx.clientIdentity.getAttributeValue('role');

        if(authRoles.includes(role)) {
            return true;
        }
        return false;
    }

    /*
    * Asserts whether role of a given client is sufficient to perform the action.
    * 
    * @param policyNo     Policy number.
    * @param authRole     Desired client role.
    * @return True if condition fulfilled, throws error otherwise.
    */
    async AuthorizeRole(ctx, policyNo, authRole) {
        const policy = JSON.parse(await ctx.stub.getPrivateData("policies", policyNo));
        const clientMSPID = ctx.clientIdentity.getMSPID();
        const role = ctx.clientIdentity.getAttributeValue('role');

        let isAuthorized = false;
        if(authRole === role  || 
          (authRole === 'worker' && role === 'manager')) {
            isAuthorized = true;
        }

        if (clientMSPID !== policy.InsuranceCompany || !isAuthorized) {
            throw new Error(`Client ${clientMSPID}/${role} is not authorized to change the policy ${policyNo}`);
        }

        return true;
    }

    /*
    * Returns all the policies objects stored in the private collection.
    * 
    * @return Array of policies.
    */
    async GetAllPolicies(ctx) {
        if(!(await this.IsAuthorizedToReadAll(ctx))) {
            throw new Error(`Client is not authorized to read the policies`);
        }

        const query = {
            selector: {
                InsuranceCompany: ctx.clientIdentity.getMSPID()
            },
            use_index: ["indexClientID"]
        };
		const resultsIterator = await ctx.stub.getPrivateDataQueryResult("policies", JSON.stringify(query));
		return (await this.GetAllResults(resultsIterator, false)).map(result => result.Record);
	}

    /*
    * Returns all the claims objects stored in the private collection.
    * 
    * @return Array of claims.
    */
    async GetAllClaims(ctx) {
        const policies = await this.GetAllPolicies(ctx);
        return policies.map(policy => policy.Claims).reduce((acc, cur) => [...acc, ...cur], []);
	}

    /*
    * Returns all the policies objects stored in the private collection for a given clientId
    * 
    * @param clientId     ID of the client.
    * @return Array of policies.
    */
    async GetAllPoliciesForClient(ctx, clientId) {
        const clientID = this.ExtractClientName(ctx.clientIdentity.getID());
		
        if(!(await this.IsAuthorizedToReadAll(ctx)) && clientID !== clientId) {
            throw new Error(`Client is not authorized to read the policies`);
        }       
        
        const query = {
            selector: {
                ClientID: clientId,
                InsuranceCompany: ctx.clientIdentity.getMSPID()
            },
            use_index: ["indexClientID"]
        };
        const resultsIterator = await ctx.stub.getPrivateDataQueryResult("policies", JSON.stringify(query));
		return (await this.GetAllResults(resultsIterator, false)).map(result => result.Record);
	}

    /*
    * Returns all the claims objects stored in the private collection for a given clientId
    * 
    * @param clientId     ID of the client.
    * @return Array of policies.
    */
    async GetAllClaimsForClient(ctx, clientId) {
        const policies = await this.GetAllPoliciesForClient(ctx, clientId);
        return policies.map(policy => policy.Claims).reduce((acc, cur) => [...acc, ...cur], []);
	}

    /*
    * Auxiliary function that eeturns the query results based on the iterator.
    * 
    * @param iterator     Iterator.
    * @param isHistory    If true, shows changes to the object over time.
    * @return Query results.
    */
    async GetAllResults(iterator, isHistory) {
		const allResults = [];
        iterator = iterator.iterator;
		let res;
		do {
            res = await iterator.next();
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
		} while(!res.done)
		iterator.close();
		return allResults;
	}

    /*
    * Calculates hash of a given policy.
    * 
    * @param policy     Policy object.
    * @return Hash of the policy.
    */
    CalculatePolicyHash(policy) {
        policy.Claims = [];
        return crypto.createHash('sha256').update(Buffer.from(JSON.stringify(policy))).digest('hex');
    }

    /*
    * Extracts client name from client ID
    * 
    * @param clientId   Client ID.
    * @return Client name.
    */
    ExtractClientName(clientId) {
        return clientId.match(/(?<=CN=)\w+/)[0];
    }
}

module.exports = CarInsurance;

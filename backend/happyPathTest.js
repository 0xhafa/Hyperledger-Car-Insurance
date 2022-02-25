const {defaultPolicy, Insurance} = require('./utils/insuranceLib');
const fs = require('fs');
const axios = require('axios');

const makePaymentEndpoint = `${process.env.BACKEND_URL}/makePayment`;
const identities = JSON.parse(fs.readFileSync(process.env.INITIAL_IDENTITIES));

const main = async () => {
    const customer1 = await new Insurance(identities[0].userId).init();
    const customer2 = await new Insurance(identities[1].userId).init();
    const worker = await new Insurance(identities[2].userId).init();
    const manager = await new Insurance(identities[3].userId).init();
    const adjuster = await new Insurance(identities[4].userId).init();
    const bookkeeper = await new Insurance(identities[5].userId).init();
    const reader = await new Insurance(identities[6].userId).init();

    const policy = defaultPolicy();
    policy.Coverage.BodilyInjuryLiability.Active = true;
    policy.Coverage.BodilyInjuryLiability.CoveredAmount = 10000;
    policy.Coverage.PropertyDamageLiability.Active = true;
    policy.Coverage.PropertyDamageLiability.CoveredAmount = 10000;
    policy.Coverage.Collision.Active = true;
    policy.Coverage.Collision.CoveredAmount = 10000;

    const policyNo1 = await customer1.submitPolicy(policy);
    console.log(policyNo1);
    const policyNo2 = await customer2.submitPolicy(policy);
    console.log(policyNo2);

    console.log(`Making premium payment for policy ${policyNo1}`);
    await axios.get(`${makePaymentEndpoint}?policyNo=${policyNo1}`);
    let hash = await worker.activatePolicy(policyNo1);
    let hashConfirmation = await worker.updatePolicyMetadata(policyNo1);
    console.log(hash);
    console.log(hashConfirmation);

    console.log(`Making premium payment for policy ${policyNo2}`);
    await axios.get(`${makePaymentEndpoint}?policyNo=${policyNo2}`);
    hash = await manager.activatePolicy(policyNo2);
    hashConfirmation = await manager.updatePolicyMetadata(policyNo2);
    console.log(hash);
    console.log(hashConfirmation);

    const claimNo1 = await customer1.addClaim(policyNo1, "I got drunk accidentally and hit that car. Please pay me, not him!");
    console.log(claimNo1);
    const claimNo2 = await customer2.addClaim(policyNo2, "That drunk idiot was on the passenger seat when I was hit!");
    console.log(claimNo2);

    hash = await worker.suspendPolicy(policyNo1);
    hashConfirmation = await worker.updatePolicyMetadata(policyNo1);
    console.log(hash);
    console.log(hashConfirmation);

    await adjuster.reviewClaim(policyNo1, claimNo1, "REJECTED");
    await adjuster.reviewClaim(policyNo2, claimNo2, "ACCEPTED", 
        {
            BodilyInjuryLiability: 1000,
            PropertyDamageLiability: 2000,
            Collision: 3000
        }
    );

    hash = await bookkeeper.payoutClaim(policyNo2, claimNo2);
    hashConfirmation = await bookkeeper.updatePolicyMetadata(policyNo2);
    console.log(hash);
    console.log(hashConfirmation);

    hash = await manager.activatePolicy(policyNo1);
    hashConfirmation = await manager.updatePolicyMetadata(policyNo1);
    console.log(hash);
    console.log(hashConfirmation);
    hash = await worker.expirePolicy(policyNo1);
    hashConfirmation = await worker.updatePolicyMetadata(policyNo1);
    console.log(hash);
    console.log(hashConfirmation);
    hash = await worker.expirePolicy(policyNo2);
    hashConfirmation = await worker.updatePolicyMetadata(policyNo2);
    console.log(hash);
    console.log(hashConfirmation);

    const policy1 = await reader.readPolicy(policyNo1);
    const policy2 = await reader.readPolicy(policyNo2);
    const claims1 = await reader.readClaims(policyNo1);
    const claims2 = await reader.readClaims(policyNo2);
    const metadata1 = await customer1.readPolicyMetadata(policyNo1);
    const metadata2 = await customer1.readPolicyMetadata(policyNo2);
    const hash1 = await customer1.calculatePolicyHash(policy1);
    const hash2 = await customer1.calculatePolicyHash(policy2);

    console.log(policy1);
    console.log(claims1);
    console.log(metadata1);
    console.log(hash1);
    console.log(policy2);
    console.log(claims2);
    console.log(metadata2);
    console.log(hash2);
    process.exit(0);
}

main();
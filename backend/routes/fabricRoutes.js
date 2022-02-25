const fs = require('fs');
const express = require('express');
const {Insurance} = require('../utils/insuranceLib');
require('dotenv').config();

const router = express.Router();
const offersPath = process.env.OFFERS;

router.post('/submitPolicy', async function(req, res) {
  let selectedId = req.body.offerId;
  let storedOffers = JSON.parse(fs.readFileSync(offersPath));
  let selectedOffer = storedOffers[selectedId];

  if(!selectedOffer) {
    res.sendStatus(500);
    return;
  }

  try {
    let insurance = await new Insurance(selectedOffer.userId).init();
    let policyNo = await insurance.submitPolicy(selectedOffer);
    res.status(200).json({policyNo});

    for(let id in storedOffers) {
      if(storedOffers[id].userId !== selectedOffer.userId) continue;
      delete storedOffers[id];
    }
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
  fs.writeFileSync(offersPath, JSON.stringify(storedOffers, null, 2));
});

router.post('/addClaim', async function(req, res) {
  let {userId, policyNo, claimDescription} = req.body;

  try {
    let insurance = await new Insurance(userId).init();
    let claimNo = await insurance.addClaim(policyNo, claimDescription);
    res.status(200).json({claimNo});  
    insurance.disconnect(); 
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

router.get('/activatePolicy', async function(req, res) {
  let userId = req.query.userId;
  let policyNo = req.query.policyNo;

  try {
    let insurance = await new Insurance(userId).init();
    await insurance.activatePolicy(policyNo);
    let hash = await insurance.updatePolicyMetadata(policyNo);
    res.status(200).json({hash});   
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

router.get('/expirePolicy', async function(req, res) {
  let userId = req.query.userId;
  let policyNo = req.query.policyNo;

  try {
    let insurance = await new Insurance(userId).init();
    await insurance.expirePolicy(policyNo);
    let hash = await insurance.updatePolicyMetadata(policyNo);
    res.status(200).json({hash});   
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

router.get('/suspendPolicy', async function(req, res) {
  let userId = req.query.userId;
  let policyNo = req.query.policyNo;

  try {
    let insurance = await new Insurance(userId).init();
    await insurance.suspendPolicy(policyNo);
    let hash = await insurance.updatePolicyMetadata(policyNo);
    res.status(200).json({hash});   
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

router.post('/reviewClaim', async function(req, res) {
  let {userId, policyNo, claimNo, newState, amounts} = req.body;

  try {
    let insurance = await new Insurance(userId).init();
    await insurance.reviewClaim(policyNo, claimNo, newState, amounts);
    res.status(200).send('SUCCESS');
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

router.post('/payoutClaim', async function(req, res) {
  let {userId, policyNo, claimNo} = req.body;

  try {
    let insurance = await new Insurance(userId).init();
    await insurance.payoutClaim(policyNo, claimNo);
    let hash = await insurance.updatePolicyMetadata(policyNo);
    res.status(200).json({hash});
    insurance.disconnect();
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;

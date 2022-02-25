const fs = require('fs');
const express = require('express');
const {Insurance} = require('../utils/insuranceLib');
require('dotenv').config();

const router = express.Router();
const offersPath = process.env.OFFERS;
const paymentsPath = process.env.PAYMENTS;

function simulatePayment(policyNo) {
  let payments = {};
  if(fs.existsSync(paymentsPath)) {
    payments = JSON.parse(fs.readFileSync(paymentsPath));
  }
  payments[policyNo] = true;
  fs.writeFileSync(paymentsPath, JSON.stringify(payments, null, 2));
}

router.post('/selectOffer', async function(req, res) {
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

    setTimeout(() => {
      simulatePayment(policyNo);
    }, 10000);

    for(let id in storedOffers) {
      if(storedOffers[id].userId !== selectedOffer.userId) continue;
      delete storedOffers[id];
    }
  } catch(error) {
    res.status(500).json({error: error.message});
  }
  fs.writeFileSync(offersPath, JSON.stringify(storedOffers, null, 2));
});

// router.get('/submitpolicy', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.submitPolicy(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   })
// });

// router.get('/activatepolicy', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.activatePolicy(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   }) 
// });

// router.get('/expirepolicy', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.expirePolicy(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   })
// });

// router.get('/suspendpolicy', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.suspendPolicy(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   }) 
// });

// router.post('/addclaim', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.addClaim(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   })
// });

// router.get('/reviewclaim', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.reviewClaim(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   })
// });

// router.get('/payoutclaim', function(req, res) {
//   let data = req.body.data;
//   let insuranceNetwork = new InsuranceNetwork(req.body.user);

//   insuranceNetwork.payoutClaim(data)
//   .then((data) => {
//     res.status(200).json(data)
//   })
//   .catch((err) => {
//     res.status(500).json({error: err.toString()})
//   })
// });


module.exports = router;

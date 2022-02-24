const express = require('express');
const router = express.Router();
//const jsonManager = require('../utils/jsonManager');
//const InsuranceNetwork = require('./InsuranceNetwork');
const fs = require('fs')
const Isurance = require('../insuranceLib');

const identities = JSON.parse(fs.readFileSync(process.env.INITIAL_IDENTITIES));

router.post('/quote', function(req, res) {
  let baseOffers = JSON.parse(fs.readFileSync("./json/base_offers.json"));
  let id = 0;
  let offers = baseOffers.map(offer => {
    offer.offerId = id++;
    offer.selected = false;
    return {...req.body, ...offer}
  });
  fs.writeFileSync("./json/offers.json", JSON.stringify(offers, null, 2));
  res.json(offers);
});

router.post('/selectOffer', function(req, res) {
  let offers = JSON.parse(fs.readFileSync("./json/offers.json"));
  let index = offers.findIndex(offer => offer.offerId == req.body.offerId);
  //offers[index].selected = true;

  const customer = await new Insurance(identities[0]).init();
  const policyNo1 = await customer.submitPolicy(policy);

  //fs.writeFileSync("./json/offers.json", JSON.stringify(offers, null, 2))
  res.json({});
})

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

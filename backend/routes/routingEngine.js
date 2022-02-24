const express = require('express');
const router = express.Router();
const jsonManager = require('../utils/jsonManager');
//const InsuranceNetwork = require('./InsuranceNetwork');
const fs = require('fs')
const offers = require('../json/offers.json')

router.post('/quote', function(req, res) {
  let quote = jsonManager.addToJson("./json/quotes.json", req.body);
  let baseOffers = JSON.parse(jsonManager.getJson("./json/base_offers.json"));
  let id = 0;
  let offers = baseOffers.map(offer => {
    offer.quoteId = quote.id;
    offer.offerId = id++;
    offer.selected = false;
    offer.completed = false;
    return offer
  });
  jsonManager.addToJson("./json/offers.json", offers)
  res.json(offers);
});

router.get('/offers', function(req, res) {
  res.json(offers)
})

router.post('/selectOffer', function(req, res) {
  let quotes = JSON.parse(fs.readFileSync("./json/offers.json"))
  let index = quotes.findIndex(quote => quote.every(offer => (offer.quoteId == req.body.quoteId)))
  quotes[index] = quotes[index].map(offer => ({...offer, completed: true}))
  fs.writeFileSync("./json/offers.json", JSON.stringify(quotes, null, 2))
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

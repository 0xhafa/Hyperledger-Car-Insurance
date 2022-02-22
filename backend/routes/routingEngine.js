const express = require('express');
const router = express.Router();

const InsuranceNetwork = require('./InsuranceNetwork');

router.post('/askquote', function(req, res) {

});

router.get('/submitpolicy', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.submitPolicy(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  })
});

router.get('/activatepolicy', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.activatePolicy(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  }) 
});

router.get('/expirepolicy', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.expirePolicy(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  })
});

router.get('/suspendpolicy', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.suspendPolicy(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  }) 
});

router.post('/addclaim', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.addClaim(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  })
});

router.get('/reviewclaim', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.reviewClaim(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  })
});

router.get('/payoutclaim', function(req, res) {
  let data = req.body.data;
  let insuranceNetwork = new InsuranceNetwork(req.body.user);

  insuranceNetwork.payoutClaim(data)
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(500).json({error: err.toString()})
  })
});


module.exports = router;

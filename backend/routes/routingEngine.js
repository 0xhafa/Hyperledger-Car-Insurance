const express = require('express');

const router = express.Router();

router.post('/askquote', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});

router.get('/submitpolicy', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});

router.get('/activatepolicy', function(req, res) {
  res.json({success: true, id: storage.saveMetadata(req.body)});
});

router.get('/expirepolicy', function(req, res) {
  const result = storage.getContractAddress();
  if(!result) {
    res.json({success: false});
  } else {
    res.json({success: true, address: result});
  }
});

router.get('/suspendpolicy', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});


router.post('/addclaim', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});

router.get('/reviewclaim', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});

router.get('/payoutclaim', function(req, res) {
  storage.saveContractAddress(req.body.address);
  res.json({success: true});
});


module.exports = router;

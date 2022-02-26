const fs = require('fs');
const express = require('express');
const moment = require('moment');
const {defaultPolicy, Insurance} = require('../utils/insuranceLib');
require('dotenv').config();

const router = express.Router();
const offersPath = process.env.OFFERS;
const paymentsPath = process.env.PAYMENTS;

async function simulatePayment(policyNo) {
  let payments = {};
  if(fs.existsSync(paymentsPath)) {
    payments = JSON.parse(fs.readFileSync(paymentsPath));
  }

  let success = false;
  try {
    let insurance = await new Insurance('worker').init();
    let policy = await insurance.readPolicy(policyNo);
    if(policy.State === 'PENDING') success = true;
  } catch(error) {
    console.log(error.message);
  }

  if(success) payments[policyNo] = true;
  fs.writeFileSync(paymentsPath, JSON.stringify(payments, null, 2));
  await new Promise(resolve => setTimeout(resolve, 3000));
  return success;
}

router.post('/getOffers', function(req, res) {
  let userData = req.body;

  if(!(userData.userId && userData.firstName && userData.lastName &&
       userData.driversLicenseNo && userData.carModel && userData.carYear &&
       userData.carLicensePlate)) {
      res.sendStatus(500);
      return;
    }

  let offers = [];
  for(let i=0; i<3; i++) {
    const policy = defaultPolicy();
    policy.userId = userData.userId;
    policy.offerId = Date.now().toString() + '-' + i;
    policy.StartDate = moment().format('DD-MM-YYYY');
    policy.EndDate = moment().add(1, 'year').format('DD-MM-YYYY');
    policy.MainDriver.FirstName = userData.firstName;
    policy.MainDriver.LastName = userData.lastName;
    policy.MainDriver.DriversLicenseNo = userData.driversLicenseNo;
    policy.Car.Model = userData.carModel;
    policy.Car.Year = userData.carYear;
    policy.Car.LicensePlate = userData.carLicensePlate;
    policy.Coverage.BodilyInjuryLiability.Active = true;
    policy.Coverage.BodilyInjuryLiability.CoveredAmount = 50000;
    policy.Coverage.PropertyDamageLiability.Active = true;
    policy.Coverage.PropertyDamageLiability.CoveredAmount = 50000;

    switch(i) {
      case 0:
        policy.price = 999;
        break;
      case 1:
        policy.Coverage.Collision.Active = true;
        policy.Coverage.Collision.CoveredAmount = 50000;
        policy.price = 1199;
        break;
      case 2:
        policy.Coverage.Collision.Active = true;
        policy.Coverage.Collision.CoveredAmount = 50000;
        policy.Coverage.PersonalInjuryProtection.Active = true;
        policy.Coverage.PersonalInjuryProtection.CoveredAmount = 20000;
        policy.price = 1249;
        break;
      default:
        break;
    }
    offers.push(policy);
  }
  res.status(200).json(offers);

  let storedOffers = {};
  if(fs.existsSync(offersPath)) {
    storedOffers = JSON.parse(fs.readFileSync(offersPath));
  }
  storedOffers = offers.reduce((acc, cur) => (
    {
      ...acc, 
      [cur.offerId]: cur
    }
  ), storedOffers);
  fs.writeFileSync(offersPath, JSON.stringify(storedOffers, null, 2));
});

router.get('/makePayment', async function(req, res) {
  let policyNo = req.query.policyNo;
  let result = await simulatePayment(policyNo);

  if(result) res.status(200).send('SUCCESS');
  else res.status(200).send('DECLINED');
});

router.get('/isPaid', function(req, res) {
  if(!fs.existsSync(paymentsPath)) {
    res.status(200).send('NOT PAID');
    return;
  }
  
  let policyNo = req.query.policyNo;
  let payments = JSON.parse(fs.readFileSync(paymentsPath));
  if(payments[policyNo]) res.status(200).send('PAID');
  else res.status(200).send('NOT PAID');
});

module.exports = router;

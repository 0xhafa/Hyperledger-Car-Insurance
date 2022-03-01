# Hyperledger Car Insurance
<img src="./frontend/src/img/InsuranceLogo.png" width="500">

This project showcases the use of blockchain for insurance companies. Rasper Car Insurance network is a basic Hyperledger Fabric-based application to connect insurance companies, customers, and authorities in order to create, read and update insurance contracts and add and payout claims. 
This project aimed to set up a basic Hyperledger Fabric use case and test out Chaincode interactions.

## Authors

Name  | GitHub
------------- | ------------- 
Rafael Albuquerque | [@albuquerque-rafael](https://github.com/albuquerque-rafael) 
Kasper Pawlowski |  [@kasperpawlowski](https://github.com/kasperpawlowski)

Project Gantt Chart: https://docs.google.com/spreadsheets/d/1Azrs2l__uOtwhwyx1QeFw0hHLNr3ZQckCqy_ETUVKu8/

# Business Case
## Problem Statement
Using blockchain technology, insurance companies are able to solve a lot of problems that the car insurance world currently faces. As a start, insurers will be able to track polcies and claims in an unprecedented way only by looking at a shared trusted ledger. 

For example, a car insurance company will be able to follow the driving history and behavior of an insured customer, and they will be able to adjust their policies accordingly. If the corresponding driver is reckless, he/she won’t be able to fraudulently claim eligibility for some premiums or bonuses.

The insurance info can be easily shared with designated authorities improving the transperancy and reducing the burocracy when requesting relevant information or processing claims.

The value of running this network using Hyperledger Fabric is that you can easily customize the network infrastructure as needed, whether that is the location of the nodes, the CPU and RAM of the hardware, the endorsement policy needed to reach consensus, or adding new organizations and members to the network.
<br />

## Goals
The project's goal is to simulate the life flow of a vehicle insurance policy in a simplified way.
The application enables the user to test its different functionalities using any profile. In this way, it is possible to submit quotes, select offers and pay, activate, suspend and expire policies, add claims, accept and pay claims.

## Stakeholders
The main stakeholders affected by this solution are the insurance companies, insurance customers and public authorities.

<br />

# Requirements
## Prerequisites
The following prerequisites are required to run a Docker-based Fabric test network on your local machine.
```
# Update your Linux system
$ apt-get update
$ apt-get upgrade

# Install the latest version of git if it is not already installed.
$ sudo apt-get install git

# Install the latest version of cURL if it is not already installed.
$ sudo apt-get install curl

# Optional: Install the latest version of jq if it is not already installed (only required for the tutorials related to channel configuration transactions).
$ sudo apt-get install jq

# Install Node JS
$ sudo apt-get install nodejs
$ npm
```

## Setting up Docker
```
# Install the latest version of Docker if it is not already installed.
$ sudo apt-get -y install docker-compose

# Make sure the Docker daemon is running.
$ sudo systemctl start docker

# Optional: If you want the Docker daemon to start when the system starts, use the following:
$ sudo systemctl enable docker

#Add your user to the Docker group.
$ sudo usermod -a -G docker <username>

$ sudo groupadd docker
$ sudo usermod -aG docker alexandrebarros $USER

$ newgrp docker
$ docker run hello-world
$ docker ps
$ docker ps -a
$ docker images
$ docker logs --tail 20 [processIdNumber]
$ docker restart

# Reboot if still got error
$ reboot
```
## Install Fabric SDK for NodeJS
The Hyperledger Fabric SDK allows applications to interact with a Fabric blockchain network. It provides a simple API to submit transactions to a ledger or query the contents of a ledger with minimal code.
The client API is published to the npm registry in the fabric-network package.
```
npm install fabric-network
```
## Install Docker Images, Fabric Tools and Fabric Samples
Clone from Github Hyperledger Fabric Samples.
1. Run Docker on your machine
2. Create a project folder and cd into it
```
mkdir new-network
cd new-network
```
3. Run script:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9

# sudo curl -sSL https://goo.gl/6wtTN5 | sudo bash -s 1.1.0
# curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s 1.1.0
# sudo chmod 777 -R fabric-samples
```

Now you'll have:
- Fabric-samples downloaded
- Binary tools installed in /bin
- Docker Images downloaded

## Featured Tech
- **Hyperledger Fabric** (https://www.hyperledger.org/use/fabric) is intended as a foundation for developing applications or solutions with a modular architecture. Its modular and versatile design satisfies a broad range of industry use cases.
- **Nodejs** (https://www.nodejs.org/) is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side.
- **Docker** (https://www.docker.com/) is a computer program that performs operating-system-level virtualization, also known as Containerization.

More info:
- Docker - latest
- Docker Compose - latest
- NPM - latest
- nvm - latest
- Node.js - v14.17
- HyperLedger Read the Docs
- HyperLedger Test Network

You could use your local docker containers or create a cloud account in IBM Cloud, Azure, AWS or Google Cloud Platform.



# Architecture
## Roles
Profile  | Actions
------------- | ------------- 
Insurance Manager | Activate, suspend and expire polcies. 
Insurance Worker | Suspend and expire polcies. 
Insurance Adjuster | Approve or decline claims.
Insurance Bookkeeper | Pay out claims.
Customer | Quote and select offers, add claims to active policies.
Authority | read all customers policies and claims.

<br />

## Functions
Profile  | Actions | Roles
------------- | ------------- | -------------
getOffers | Offchain process, ask for offers when quote is submmited. | All.  Customers can get only their polcies and claims
submitPolicy | Add selected offer to blockchain. | Customer
activatePolicy | Changes policy state to ACTIVE. | Insurance Manager
suspendPolicy | Changes policy state to SUSPENDED. | Insurance Manager and Worker
expirePolicy | Changes policy state to EXPIRED. | Insurance Manager and Worker
addClaim | Add claim to policy in the blockchain. | Customer
reviewClaim | Changes claim state to DECLINED or ACCEPTED. | Insurance Adjuster
payoutClaim | Changes claim state to PAID_OUT. | Insurance Bookkeeper
<br />

## State Diagram
<img src="./frontend/src/img/Hyperledger-Insurance-State.png">
<br />
<br />
<br />

## Complete Application Flowchart

<img src="./frontend/src/img/Hyperledger-Insurance-Flow.svg">

<br />

## Data
Insurance data (policies and claims) is stored in a private collection. Only the insurance company personnel and authorities may have access to this data. The public world state contains only the hash of the policy and its state. 

Policy:
```json
// Policy
{
    "StartDate": '',
    "EndDate": '',
    "MainDriver": {
        "FirstName": '', 
        "LastName": '', 
        "DriversLicenseNo": ''
    },
    "Car": {
        "Model": '',
        "Year": '',
        "LicensePlate": ''
    },
    "Coverage": {
        "BodilyInjuryLiability":    {...defaultCoverage},
        "PropertyDamageLiability":  {...defaultCoverage},
        "Collision":                {...defaultCoverage},
        "PersonalInjuryProtection": {...defaultCoverage},
        "UnderinsuredMotorist":     {...defaultCoverage}
    }
}
}
```
Default Coverage:
```json
// defaultCoverage
{
  "Active": false,  
  "CoveredAmount": 0, 
  "ClaimedToDate": 0
}
```
<br />


## Deploy & Run Application
### Step 1. Start Hyperledger network, generate certificates and deploy the chaincode
On the root folder run network setup:
```
./setup.sh
```
### Step 2. Install & Run Server
Move to backend folder and start the server:
```
cd backend/
npm install
npm start
```
### Step 3. Install & Run Interface
Move to frontend folder and start the frontend locally:
```
cd frontend/
npm install
npm start
```
### Stop network
To stop the network run:
```
./network.sh down
```
<br />

## User Interface
Select user profile: 
<img src="./frontend/src/img/screenshots/1-UserTypeSelect.png">
With "Customer" profile selected, fill out the quote form:
<img src="./frontend/src/img/screenshots/2-QuoteForm.png">
After quote submition, different offers appear: 
<img src="./frontend/src/img/screenshots/3-SelectOffer.png">
Select one of the offers and click "pay":
<img src="./frontend/src/img/screenshots/4-PayOffer.png">
In the Policies tab, Select "Insurance Manager" and activate the selected policy:
<img src="./frontend/src/img/screenshots/5-ActivatePolicy.png">
With "Customer" profile selected, click add claim: 
<img src="./frontend/src/img/screenshots/6-AddClaim.png">
Fill the claim form with info about the incident:
<img src="./frontend/src/img/screenshots/6-ClaimForm.png">
"Insurance Worker" and "Insurance Manager" have access to expire or suspend the policy:
<img src="./frontend/src/img/screenshots/7-SuspendExpire.png">
In the Claim tab, with "Insurance Adjuster" selected you can approve or decline the claim: 
<img src="./frontend/src/img/screenshots/8-ApproveDeclineClaim.png">
To approve, fill the approved amounts:
<img src="./frontend/src/img/screenshots/9-ApprovedAmounts.png">
If the claim was approved, select "Insurance Bookkeeper" profile and pay out the claim: 
<img src="./frontend/src/img/screenshots/10-PayoutClaim.png">
The claim now appears with "Paid" status:
<img src="./frontend/src/img/screenshots/11-PaidClaim.png">
<br />


# Appendix
- Hyperledger Org: https://www.hyperledger.org/
- Hyperledger Intro: https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html
- Hyperledger GitHub: https://github.com/hyperledger/fabric
- Hyperledger Wiki: https://wiki.hyperledger.org/display/fabric
- Hyperledger Explorer: https://github.com/hyperledger/blockchain-explorer
- Using Private Data in Fabric: https://hyperledger-fabric.readthedocs.io/en/release-2.2/private_data_tutorial.html
- Whiting your first Chaincode: https://hyperledger-fabric.readthedocs.io/en/release-2.2/chaincode4ade.html
- Private Data Collections on Hyperledger Fabric: https://github.com/IBM/private-data-collections-on-fabric
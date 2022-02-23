#!/bin/bash

# install backend dependencies
#cd ./backend
#npm install
#cd ..

cd ./network

# create a network with a channel and couch DB instance
./network.sh down
./network.sh up createChannel -c insurancechannel -ca -s couchdb

# install chaincode dependencies
cd ../chaincode
npm install
cd ../network

# prepare chaincode package
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer lifecycle chaincode package insurance.tar.gz --path ../chaincode/ --lang node --label insurance

# deploy the chaincode for the first insurance company
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="InsuranceCompany1"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/peers/peer0.InsuranceCompany1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/users/Admin@InsuranceCompany1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install insurance.tar.gz

# deploy the chaincode for the second insurance company
export CORE_PEER_LOCALMSPID="InsuranceCompany2"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/InsuranceCompany2.example.com/peers/peer0.InsuranceCompany2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/InsuranceCompany2.example.com/users/Admin@InsuranceCompany2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install insurance.tar.gz

# check whether the chaincode was successfully installed
peer lifecycle chaincode queryinstalled

# approve the deployed chaincode for the second insurance company 
export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep 'insurance:[a-f0-9]*' -o)
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID insurancechannel --name insurance --version 1.0 --collections-config ../chaincode/collections_config.json --signature-policy "OR('InsuranceCompany1.peer','InsuranceCompany2.peer')" --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# approve the deployed chaincode for the first insurance company 
export CORE_PEER_LOCALMSPID="InsuranceCompany1"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/users/Admin@InsuranceCompany1.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/peers/peer0.InsuranceCompany1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID insurancechannel --name insurance --version 1.0 --collections-config ../chaincode/collections_config.json --signature-policy "OR('InsuranceCompany1.peer','InsuranceCompany2.peer')" --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# commit the chaincode
peer lifecycle chaincode checkcommitreadiness --channelID insurancechannel --name insurance --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID insurancechannel --name insurance --version 1.0 --sequence 1 --collections-config ../chaincode/collections_config.json --signature-policy "OR('InsuranceCompany1.peer','InsuranceCompany2.peer')" --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/peers/peer0.InsuranceCompany1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/InsuranceCompany2.example.com/peers/peer0.InsuranceCompany2.example.com/tls/ca.crt"

# query if chaincode commited - optional
peer lifecycle chaincode querycommitted --channelID insurancechannel --name insurance --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

# remove previously created identities and create new ones
cd ../backend
rm -r ./wallet
node registerAndEnroll.js
cd ..

#export PATH=${PWD}/../bin:${PWD}:$PATH
#export FABRIC_CFG_PATH=$PWD/../config/
#export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/
#fabric-ca-client register --caname ca-InsuranceCompany1 --id.name kasper --id.secret kasperpw --id.type client --id.attrs role=customer:ecert --tls.certfiles "${PWD}/organizations/fabric-ca/InsuranceCompany1/tls-cert.pem"
#fabric-ca-client enroll -u https://kasper:kasperpw@localhost:7054 --caname ca-InsuranceCompany1 -M "${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/users/kasper@InsuranceCompany1.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/InsuranceCompany1/tls-cert.pem"
#cp "${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/users/kasper@InsuranceCompany1.example.com/msp/config.yaml"
#
#export CORE_PEER_TLS_ENABLED=true
#export CORE_PEER_LOCALMSPID="InsuranceCompany1"
#export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/peers/peer0.InsuranceCompany1.example.com/tls/ca.crt
#export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/users/kasper@InsuranceCompany1.example.com/msp
#export CORE_PEER_ADDRESS=localhost:7051
#
#export POLICY=$(echo -n "{\"color\":\"blue\",\"size\":30,\"appraisedValue\":100}" | base64 | tr -d \\n)
#peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C insurancechannel -n insurance --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/InsuranceCompany1.example.com/peers/peer0.InsuranceCompany1.example.com/tls/ca.crt" -c '{"function":"SubmitPolicy","Args":[]}' --transient "{\"policy\":\"$POLICY\"}"

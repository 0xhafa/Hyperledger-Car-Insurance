import React, {useEffect, useState} from 'react'
import Offers from './Offers';
import QuoteForm from './QuoteForm';
import Axios from 'axios';
import { urlContext } from './urlContext';

const Quotes = (props) => {
  const url = React.useContext(urlContext);
  const [offers, setOffers] = useState([]);
  const [policyNo, setPolicyNo] = useState({});

  function selectOffer(event) {
    const offerId = event.target.id
    let index = offers.findIndex(offer => offer.offerId == offerId);
    let offers_ = [...offers];
    offers_[index].selected = true;
    setOffers(offers_);
    Axios.post(`${url}/submitPolicy`, {offerId: offerId})
    .then((res)=>{
      setPolicyNo(res.data.policyNo)
    })
  }

  return (
    <div>
      <QuoteForm user = {props.user} setOffers={setOffers}/>
      { props.user == "customer1" || props.user == "customer2"  ? <Offers policyNo={policyNo} offers={offers} selectOffer={selectOffer}/> : ""}
    </div>
  );
};

export default Quotes;
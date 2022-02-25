import React, {useEffect, useState} from 'react'
import Offers from './Offers';
import QuoteForm from './QuoteForm';
import Axios from 'axios';
import { urlContext } from './urlContext';

const Quotes = (props) => {
  const url = React.useContext(urlContext);
  const [offers, setOffers] = useState([]);

  function selectOffer(event) {
    const offerId = event.target.id
    let index = offers.findIndex(offer => offer.offerId == offerId);
    let offers_ = [...offers];
    offers_[index].selected = true;
    setOffers(offers_);
    //Axios.post(`${url}/selectOffer`, {offerId: offerId})
  }

  return (
    <div>
      <QuoteForm user = {props.user} setOffers={setOffers}/>
      { props.user == "Customer 1" || props.user == "Customer 2"  ? <Offers offers={offers} selectOffer={selectOffer}/> : ""}
    </div>
  );
};

export default Quotes;
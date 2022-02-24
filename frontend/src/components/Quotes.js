import React, {useEffect, useState} from 'react'
import Offers from './Offers';
import QuoteForm from './QuoteForm';
import Axios from 'axios';

const Quotes = (props) => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    getOffers()
  }, [])

  async function selectOffer(event) {
    const quoteId = event.target.id
    await Axios.post("http://localhost:3001/selectOffer", {quoteId: quoteId})
    getOffers()
  }

  function getOffers() {
    Axios.get("http://localhost:3001/offers")
    .then(res => {
        setOffers(res.data);
        console.log(res.data);
    });
  }

  return (
    <div>
      <QuoteForm user = {props.user}/>
      { props.user == "Customer" ? <Offers offers={offers} selectOffer={selectOffer}/> : ""}
    </div>
  );
};

export default Quotes;
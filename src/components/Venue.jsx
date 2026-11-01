import React from "react";
import {MapPin,ExternalLink} from "lucide-react";
const themeNames={royal:"Royal",floral:"Floral Garden",minimal:"Modern",traditional:"Traditional",rajasthani:"Rajasthani",jaipuri:"Jaipur",gujarati:"Gujarati",marathi:"Marathi","up-bihar":"Traditional",mughal:"Mughal Garden",udaipur:"Udaipur",santorini:"Santorini",beach:"Beachside",tuscany:"Tuscan",mountain:"Mountain",kashmir:"Kashmir",midnight:"Midnight Luxe"};
const titles={wedding:"THE WEDDING DESTINATION",engagement:"THE CELEBRATION VENUE",birthday:"PARTY VENUE",anniversary:"CELEBRATION VENUE",baby_shower:"BABY SHOWER VENUE",housewarming:"OUR NEW HOME",puja:"VENUE & PRAYER LOCATION",corporate:"EVENT LOCATION",party:"PARTY LOCATION",other:"EVENT LOCATION"};
export default function Venue({invitation}){
 const {name,address,mapLink}=invitation.venue||{};const city=invitation.wedding?.city||"";const theme=invitation.invitation?.theme||"royal";const type=invitation.eventType||"wedding";const link=mapLink||(address?`https://maps.google.com/?q=${encodeURIComponent(address)}`:"");
 return <section className="venue" id="venue"><div className="kicker light"><MapPin size={15}/>{titles[type]||titles.other}</div><h2>{themeNames[theme]||"Beautiful"} <em>{city?`in ${city}`:""}</em></h2>{name&&<h3 className="venue-name">{name}</h3>}{address&&<p>{address}</p>}{link&&<a className="outline" href={link} target="_blank" rel="noreferrer">GET DIRECTIONS <ExternalLink size={15}/></a>}{!name&&!address&&<p>Location details will be announced soon.</p>}</section>;
}

import React from "react";
import { CalendarDays, Sparkles, ArrowDown } from "lucide-react";

const copy = {
  wedding: { eyebrow:"WITH THE BLESSINGS OF OUR FAMILIES", cta:"EXPLORE THE WEDDING", fallback:"Joyfully invite you to celebrate the beginning of our forever." },
  engagement: { eyebrow:"A NEW CHAPTER BEGINS", cta:"EXPLORE THE CELEBRATION", fallback:"Join us as we celebrate our engagement and the promise of a beautiful future." },
  birthday: { eyebrow:"LET THE CELEBRATION BEGIN", cta:"EXPLORE THE BIRTHDAY", fallback:"Join us for a day filled with happiness, laughter and unforgettable memories." },
  anniversary: { eyebrow:"CELEBRATING LOVE & TOGETHERNESS", cta:"EXPLORE THE CELEBRATION", fallback:"Join us as we celebrate another beautiful year of love, memories and togetherness." },
  baby_shower: { eyebrow:"A LITTLE MIRACLE IS ON THE WAY", cta:"EXPLORE THE CELEBRATION", fallback:"Join us to shower the parents-to-be with love, blessings and happiness." },
  housewarming: { eyebrow:"A NEW HOME, A NEW BEGINNING", cta:"EXPLORE THE CELEBRATION", fallback:"Please join us as we celebrate our new home and share this happy beginning." },
  puja: { eyebrow:"WITH PRAYERS & BLESSINGS", cta:"VIEW THE PROGRAMME", fallback:"Your presence is requested as we gather for prayers, devotion and blessings." },
  corporate: { eyebrow:"YOU ARE CORDIALLY INVITED", cta:"VIEW THE EVENT", fallback:"We are delighted to invite you to this special gathering." },
  party: { eyebrow:"GOOD TIMES ARE BETTER TOGETHER", cta:"EXPLORE THE PARTY", fallback:"Come celebrate, connect and make wonderful memories with us." },
  other: { eyebrow:"YOU ARE CORDIALLY INVITED", cta:"EXPLORE THE EVENT", fallback:"Join us for a memorable celebration." }
};

export default function Hero({ invitation }) {
  const type = invitation.eventType || "wedding";
  const text = copy[type] || copy.other;
  const { groom = "Our Host", bride = "" } = invitation.couple || {};
  const { date, city = "" } = invitation.wedding || {};
  const formattedDate = date ? new Date(date + "T12:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) : "";
  const title = type === "wedding" && bride ? `${groom} & ${bride}` : groom;
  const goToEvents = () => document.getElementById("events")?.scrollIntoView({behavior:"smooth"});
  return <header id="home"><div className="hero">
    <div className="eyebrow"><Sparkles size={14}/>{text.eyebrow}</div>
    <p className="script">{invitation.invitation?.welcomeMessage || "You are invited"}</p>
    <h1>{title}</h1><div className="rule">✦</div>
    <p className="introline">{invitation.invitation?.description || text.fallback}</p>
    {(formattedDate || city) && <p className="date"><CalendarDays size={16}/>{[formattedDate,city].filter(Boolean).join("　•　").toUpperCase()}</p>}
    <button className="outline" onClick={goToEvents}>{text.cta}<ArrowDown size={15}/></button>
  </div>
  {type === "wedding" && <div className="ganesh">॥ श्री गणेशाय नमः ॥</div>}
  </header>;
}

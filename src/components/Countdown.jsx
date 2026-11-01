import React,{useEffect,useState} from "react";
import { Sparkles } from "lucide-react";
const labels={wedding:["THE BIG DAY IS APPROACHING","Until our forever"],engagement:["THE SPECIAL MOMENT IS NEAR","Until we celebrate"],birthday:["THE PARTY IS ALMOST HERE","The countdown is on"],anniversary:["OUR DAY OF CELEBRATION IS NEAR","Counting our memories"],baby_shower:["A LITTLE JOY IS ON THE WAY","The celebration begins in"],housewarming:["A NEW BEGINNING AWAITS","Counting down to our new home"],puja:["THE AUSPICIOUS DAY IS NEAR","Until the prayers begin"],corporate:["THE EVENT IS APPROACHING","See you soon"],party:["GET READY TO CELEBRATE","The party begins in"],other:["THE DAY IS APPROACHING","Counting every moment"]};
export default function Countdown({invitation}){
 const [now,setNow]=useState(new Date()); useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
 const date=invitation.wedding?.date; const target=date?new Date(`${date}T${invitation.wedding?.time||"19:00"}:00`):null;
 const diff=target?Math.max(0,target-now):0; const type=invitation.eventType||"wedding"; const [eyebrow,heading]=labels[type]||labels.other;
 const units={Days:Math.floor(diff/86400000),Hours:Math.floor(diff%86400000/3600000),Minutes:Math.floor(diff%3600000/60000),Seconds:Math.floor(diff%60000/1000)};
 return <section className="count"><div className="kicker light"><Sparkles size={14}/>{eyebrow}</div><h2>{heading}</h2>
 {target?<div className="timer">{Object.entries(units).map(([label,value])=><div key={label}><strong>{String(value).padStart(2,"0")}</strong><small>{label}</small></div>)}</div>:<p>Date will be announced soon.</p>}</section>;
}

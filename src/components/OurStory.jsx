import React from "react";
import { Flower2 } from "lucide-react";

const stories = {
 wedding:["A LITTLE STORY","Two hearts, one beautiful journey.","Some moments become memories, and some memories become the beginning of a lifetime. With the love and blessings of our families, we invite you to be part of our most cherished celebration."],
 engagement:["A PROMISE TOGETHER","A beautiful beginning.","Two hearts have found a reason to dream together. Join us as we celebrate the promise of a lifetime and the beginning of a new chapter."],
 birthday:["A DAY TO REMEMBER","Another year, more memories.","Life is better when celebrated together. Come share laughter, happiness, good wishes and wonderful memories on this special day."],
 anniversary:["OUR JOURNEY","A love that grows with time.","Every year brings new memories, countless smiles and more reasons to be grateful. Join us as we celebrate the love, companionship and beautiful journey we share."],
 baby_shower:["A LITTLE MIRACLE","A bundle of joy is on the way.","A tiny heartbeat, a world of love. Join our family as we celebrate the parents-to-be and shower the little one with blessings."],
 housewarming:["NEW BEGINNINGS","A place to call home.","A new home becomes special when shared with the people we love. Please join us as we open our doors and hearts to you."],
 puja:["A MOMENT OF DEVOTION","Together in prayer and blessings.","With faith in our hearts, we invite you to join us for prayers and seek blessings for peace, prosperity and happiness."],
 corporate:["THE OCCASION","Ideas, people and possibilities.","We are bringing people together for an engaging occasion. Your presence will make the gathering more meaningful."],
 party:["LET'S CELEBRATE","Good friends, great moments.","The best memories are made together. Join us for a celebration filled with fun, laughter and good company."],
 other:["A SPECIAL OCCASION","A moment worth celebrating.","We would be delighted to have you with us as we come together to celebrate this special occasion."]
};
export default function OurStory({ invitation }) {
 const type=invitation.eventType||"wedding"; const [kicker,title,copy]=stories[type]||stories.other;
 const {groom="",bride="",groomSurname="",brideSurname=""}=invitation.couple||{};
 const names=type==="wedding"?`${groom} ${groomSurname} ♥ ${bride} ${brideSurname}`:groom;
 return <section id="story"><div className="kicker"><Flower2 size={15}/>{kicker}</div>
 <h2>{title}</h2><p className="copy">{copy}</p><div className="names">{names}</div></section>;
}

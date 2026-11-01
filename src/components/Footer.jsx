import React from "react";
export default function Footer({invitation}){
 const type=invitation.eventType||"wedding";const {groom="",bride=""}=invitation.couple||{};const title=type==="wedding"?`${groom} & ${bride}`:groom;
 return <footer><div>{type==="wedding"?`${groom.charAt(0)} ♥ ${bride.charAt(0)}`:groom.charAt(0)}</div><p>With love, {title}</p><small>INVITATION CRAFTED WITH LOVE BY <b>INVITEAURA</b></small></footer>;
}

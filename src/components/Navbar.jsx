
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  return (
    <nav>
      <a className="brand" href="#home">
        <b>IA</b>
        <span>
          InviteAura
          <small>THE ART OF INVITING</small>
        </span>
      </a>

      <button
        className="hamb"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <div className={open ? "links show" : "links"}>
        {[
          ["Our Story", "story"],
          ["Celebrations", "events"],
          ["The Venue", "venue"],
          ["RSVP", "rsvp"],
        ].map(([name, id]) => (
          <button key={id} onClick={() => go(id)}>
            {name}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;


import React from "react";
import {
  Settings,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function Customization({
  invitation,
  updateInvitation,
  resetInvitation,
}) {
  const handleChange = (section, field, value) => {
    updateInvitation(section, field, value);
  };

  return (
    <section id="customize" className="customize">
      <div className="kicker">
        <Settings size={15} />
        INVITEAURA EDITOR
      </div>

      <h2>
        Customize your <em>invitation</em>
      </h2>

      <p className="copy">
        Update the details below and see your invitation
        preview change instantly.
      </p>

      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          Groom Name

          <input
            type="text"
            value={invitation.couple.groom}
            onChange={(event) =>
              handleChange(
                "couple",
                "groom",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Bride Name

          <input
            type="text"
            value={invitation.couple.bride}
            onChange={(event) =>
              handleChange(
                "couple",
                "bride",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Groom Surname

          <input
            type="text"
            value={invitation.couple.groomSurname}
            onChange={(event) =>
              handleChange(
                "couple",
                "groomSurname",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Bride Surname

          <input
            type="text"
            value={invitation.couple.brideSurname}
            onChange={(event) =>
              handleChange(
                "couple",
                "brideSurname",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Wedding Date

          <input
            type="date"
            value={invitation.wedding.date}
            onChange={(event) =>
              handleChange(
                "wedding",
                "date",
                event.target.value
              )
            }
            required
          />
        </label>

        <label>
          Wedding Time

          <input
            type="text"
            value={invitation.wedding.time}
            onChange={(event) =>
              handleChange(
                "wedding",
                "time",
                event.target.value
              )
            }
          />
        </label>

        <label>
          City

          <input
            type="text"
            value={invitation.wedding.city}
            onChange={(event) =>
              handleChange(
                "wedding",
                "city",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Venue Name

          <input
            type="text"
            value={invitation.venue.name}
            onChange={(event) =>
              handleChange(
                "venue",
                "name",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Venue Address

          <input
            type="text"
            value={invitation.venue.address}
            onChange={(event) =>
              handleChange(
                "venue",
                "address",
                event.target.value
              )
            }
          />
        </label>

        <label>
          Google Maps Link

          <input
            type="url"
            value={invitation.venue.mapLink}
            onChange={(event) =>
              handleChange(
                "venue",
                "mapLink",
                event.target.value
              )
            }
          />
        </label>

        <button
          type="button"
          className="submit"
          onClick={resetInvitation}
        >
          <RotateCcw size={15} />
          RESET DETAILS
        </button>
      </form>

      <p className="demo">
        <Sparkles size={13} />
        Changes are currently temporary and reset
        when the page is refreshed.
      </p>
    </section>
  );
}

export default Customization;

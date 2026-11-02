
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function RSVP({ invitation, isPreview = false }) {
  const type = invitation.eventType || "wedding";

  const rsvpCopy = {
    wedding: {
      subtitle: "WE WOULD LOVE TO SEE YOU",
      title: "Kindly RSVP",
      description:
        "Your presence would make our wedding celebration even more special.",
      yes: "Joyfully Accept",
      no: "Regretfully Decline",
      yesHelp: "Looking forward to celebrating together",
      noHelp: "We'll miss you",
      attend: "Will you be attending our wedding?",
      message: "Share your wishes with us...",
      submit: "Submit RSVP",
    },
    engagement: {
      subtitle: "CELEBRATE WITH US",
      title: "Kindly RSVP",
      description:
        "We would love you to be part of our engagement celebration.",
      yes: "Happily Accept",
      no: "Unable to Attend",
      yesHelp: "Looking forward to celebrating together",
      noHelp: "We'll miss you",
      attend: "Will you join our engagement celebration?",
      message: "Share your wishes with us...",
      submit: "Confirm Attendance",
    },
    birthday: {
      subtitle: "YOUR PRESENCE IS THE BEST GIFT",
      title: "Are you joining the party?",
      description:
        "Let us know if you can make it to the birthday celebration.",
      yes: "Yes, I'll Be There",
      no: "Sorry, Can't Make It",
      yesHelp: "Ready to celebrate!",
      noHelp: "Sending birthday wishes",
      attend: "Will you join the birthday celebration?",
      message: "Leave a birthday wish...",
      submit: "Confirm Attendance",
    },
    anniversary: {
      subtitle: "CELEBRATE THIS MILESTONE WITH US",
      title: "Kindly RSVP",
      description:
        "We would love to celebrate this special anniversary with you.",
      yes: "Happily Accept",
      no: "Unable to Attend",
      yesHelp: "Looking forward to seeing you",
      noHelp: "You'll be missed",
      attend: "Will you join our anniversary celebration?",
      message: "Share your wishes with us...",
      submit: "Confirm Attendance",
    },
    baby_shower: {
      subtitle: "SHOWER THE FAMILY WITH LOVE",
      title: "Kindly RSVP",
      description:
        "Please let us know if you can join the baby shower celebration.",
      yes: "Count Me In",
      no: "Unable to Attend",
      yesHelp: "Can't wait to celebrate the little one",
      noHelp: "Sending love and blessings",
      attend: "Will you join the baby shower?",
      message: "Leave your blessings for the family...",
      submit: "Confirm Attendance",
    },
    housewarming: {
      subtitle: "WE HOPE YOU CAN JOIN US",
      title: "Kindly RSVP",
      description:
        "Please let us know if you can join us at our new home.",
      yes: "I'll Be There",
      no: "Unable to Attend",
      yesHelp: "Looking forward to welcoming you",
      noHelp: "We'll miss you",
      attend: "Will you join our housewarming?",
      message: "Share your good wishes...",
      submit: "Confirm Attendance",
    },
    puja: {
      subtitle: "YOUR PRESENCE IS A BLESSING",
      title: "Kindly Confirm Attendance",
      description:
        "Please let us know if you can join us for the prayers and ceremonies.",
      yes: "I Will Attend",
      no: "Unable to Attend",
      yesHelp: "Looking forward to praying together",
      noHelp: "Your blessings are with us",
      attend: "Will you attend the ceremony?",
      message: "Share your blessings...",
      submit: "Confirm Attendance",
    },
    corporate: {
      subtitle: "PLEASE CONFIRM YOUR PARTICIPATION",
      title: "Event Registration",
      description:
        "Kindly confirm whether you will be attending the event.",
      yes: "Yes, I'll Attend",
      no: "Unable to Attend",
      yesHelp: "Looking forward to the event",
      noHelp: "Thank you for letting us know",
      attend: "Will you attend this event?",
      message: "Add a note (optional)...",
      submit: "Confirm Registration",
    },
    party: {
      subtitle: "LET US KNOW YOU'RE COMING",
      title: "Are you in?",
      description: "Please confirm if you can join the party.",
      yes: "Absolutely!",
      no: "Can't Make It",
      yesHelp: "Let's have a great time",
      noHelp: "We'll catch up soon",
      attend: "Will you join the party?",
      message: "Leave a message...",
      submit: "Confirm Attendance",
    },
    other: {
      subtitle: "WE WOULD LOVE TO SEE YOU",
      title: "Kindly RSVP",
      description:
        "Please let us know if you can join this special occasion.",
      yes: "Happily Accept",
      no: "Unable to Attend",
      yesHelp: "Looking forward to seeing you",
      noHelp: "We'll miss you",
      attend: "Will you be attending?",
      message: "Leave a message...",
      submit: "Confirm Attendance",
    },
  };

  const copy = rsvpCopy[type] || rsvpCopy.other;

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    attendance: "yes",
    guestCount: 1,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guestCount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPreview) return;

    setStatus({ type: "", message: "" });

    if (!invitation?.id) {
      setStatus({
        type: "error",
        message: "Invitation details are missing. Please try again.",
      });
      return;
    }

    if (!formData.guestName.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your name.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: savedRsvp, error } = await supabase
        .from("rsvps")
        .insert([
          {
            client_id: invitation.id,
            guest_name: formData.guestName.trim(),
            guest_email: formData.guestEmail.trim() || null,
            attendance: formData.attendance,
            guest_count:
              formData.attendance === "yes"
                ? formData.guestCount
                : 1,
            message: formData.message.trim() || null,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      // Send RSVP notification email.
      try {
        const emailResponse = await fetch("/api/send-rsvp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rsvpId: savedRsvp.id,
          }),
        });

        if (!emailResponse.ok) {
          console.error(
            "RSVP saved, but email notification failed:",
            await emailResponse.text()
          );
        }
      } catch (emailError) {
        console.error("RSVP email notification error:", emailError);
      }

      setStatus({
        type: "success",
        message:
          "Thank you! Your RSVP has been submitted successfully.",
      });

      setFormData({
        guestName: "",
        guestEmail: "",
        attendance: "yes",
        guestCount: 1,
        message: "",
      });
    } catch (error) {
      console.error("RSVP submission error:", error);

      setStatus({
        type: "error",
        message:
          error.message || "Unable to submit RSVP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rsvp-section" id="rsvp">
      <div className="rsvp-container">
        <p className="section-subtitle">{copy.subtitle}</p>

        <h2 className="section-title">{copy.title}</h2>

        <p className="rsvp-description">{copy.description}</p>

        {isPreview && (
          <div
            className="rsvp-status"
            role="status"
            style={{
              marginBottom: "20px",
              padding: "14px",
              borderRadius: "8px",
              background: "#f8f0e5",
              color: "#702d3d",
              textAlign: "center",
            }}
          >
            Admin Preview: RSVP is available on the published invitation.
          </div>
        )}

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <fieldset
            disabled={isPreview || loading}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
            }}
          >
            <div className="form-group">
              <label htmlFor="guestName">Your Name *</label>
              <input
                id="guestName"
                type="text"
                name="guestName"
                placeholder="Enter your full name"
                value={formData.guestName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guestEmail">Email Address</label>
              <input
                id="guestEmail"
                type="email"
                name="guestEmail"
                placeholder="Enter your email"
                value={formData.guestEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>{copy.attend} *</label>

              <div className="rsvp-options">
                <label
                  className={`rsvp-choice ${
                    formData.attendance === "yes" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === "yes"}
                    onChange={handleChange}
                  />
                  <span className="rsvp-choice-mark">✓</span>
                  <span className="rsvp-choice-copy">
                    <strong>{copy.yes}</strong>
                    <small>{copy.yesHelp}</small>
                  </span>
                </label>

                <label
                  className={`rsvp-choice ${
                    formData.attendance === "no" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === "no"}
                    onChange={handleChange}
                  />
                  <span className="rsvp-choice-mark">×</span>
                  <span className="rsvp-choice-copy">
                    <strong>{copy.no}</strong>
                    <small>{copy.noHelp}</small>
                  </span>
                </label>
              </div>
            </div>

            {formData.attendance === "yes" && (
              <div className="form-group">
                <label htmlFor="guestCount">Number of Guests</label>

                <select
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(
                    (number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder={copy.message}
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {status.message && (
              <div
                className={`rsvp-status ${status.type}`}
                role="status"
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="rsvp-submit-btn"
              disabled={loading || isPreview}
            >
              {isPreview
                ? "Preview Only"
                : loading
                  ? "Submitting..."
                  : copy.submit}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export default RSVP;

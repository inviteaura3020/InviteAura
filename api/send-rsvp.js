
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY,
      RESEND_FROM_EMAIL,
      INVITEAURA_NOTIFY_EMAIL,
    } = process.env;

    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY ||
      !RESEND_API_KEY ||
      !RESEND_FROM_EMAIL
    ) {
      return res.status(500).json({
        error: "Server environment variables are missing.",
      });
    }

    const { rsvpId } = req.body || {};

    if (
      typeof rsvpId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rsvpId)
    ) {
      return res.status(400).json({
        error: "A valid RSVP ID is required.",
      });
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const resend = new Resend(RESEND_API_KEY);

    // Fetch RSVP details
    const { data: rsvp, error: rsvpError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("id", rsvpId)
      .single();

    if (rsvpError || !rsvp) {
      return res.status(404).json({
        error: "RSVP not found.",
      });
    }

    // Fetch invitation details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("groom_name, bride_name, client_email, status")
      .eq("id", rsvp.client_id)
      .single();

    if (clientError || !client || client.status !== "published") {
      return res.status(404).json({
        error: "Published invitation not found.",
      });
    }

    const attendance =
      rsvp.attendance === "yes"
        ? "Joyfully Accepts"
        : "Regretfully Declines";

    const guestName = escapeHTML(rsvp.guest_name);
    const guestEmail = escapeHTML(rsvp.guest_email || "Not provided");
    const guestMessage = escapeHTML(rsvp.message || "No message");
    const guestCount = Number(rsvp.guest_count) || 1;
    const groomName = escapeHTML(client.groom_name);
    const brideName = escapeHTML(client.bride_name);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fffaf4;color:#382329;border:1px solid #ead9c5;border-radius:12px;">
        <h1 style="color:#792d3b;text-align:center;">InviteAura</h1>
        <h2 style="text-align:center;">New Wedding RSVP</h2>
        <p>A guest has responded to the wedding invitation of
          <strong>${groomName} & ${brideName}</strong>.
        </p>
        <hr style="border:0;border-top:1px solid #ead9c5;" />
        <p><strong>Guest:</strong> ${guestName}</p>
        <p><strong>Email:</strong> ${guestEmail}</p>
        <p><strong>Response:</strong> ${attendance}</p>
        <p><strong>Number of guests:</strong> ${guestCount}</p>
        <p><strong>Message:</strong> ${guestMessage}</p>
        <hr style="border:0;border-top:1px solid #ead9c5;" />
        <p style="font-size:12px;color:#806d70;text-align:center;">
          Sent automatically by InviteAura.
        </p>
      </div>
    `;

    const recipients = [
      client.client_email,
      INVITEAURA_NOTIFY_EMAIL,
    ].filter(Boolean);

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: recipients,
      subject: `New Wedding RSVP – ${client.groom_name} & ${client.bride_name}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({
        error: "RSVP was saved, but email delivery could not be requested.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "RSVP notification email sent successfully.",
      emailId: data?.id,
    });
  } catch (error) {
    console.error("RSVP API error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
}

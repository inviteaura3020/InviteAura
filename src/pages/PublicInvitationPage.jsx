
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import OurStory from "../components/OurStory";
import Countdown from "../components/Countdown";
import Events from "../components/Events";
import Venue from "../components/Venue";
import RSVP from "../components/RSVP";
import Footer from "../components/Footer";
import PhotoGallery from "../components/PhotoGallery";

function PublicInvitationPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvitation() {
      setLoading(true);
      setError("");

      try {
        let query = supabase
          .from("clients")
          .select("*")
          .eq("slug", slug);

        if (isPreview) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          const user = sessionData?.session?.user;

          if (sessionError || !user) {
            throw new Error("Please login as admin to preview this invitation.");
          }

          // Admin can preview only their own invitation.
          query = query.eq("owner_id", user.id);
        } else {
          // Public visitors can only see published invitations.
          query = query.eq("status", "published");
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          throw new Error(
            "This invitation is unavailable or not published."
          );
        }

        if (!active) return;

        setInvitation({
          id: data.id,
          eventType: data.event_type || "wedding",
          couple: {
            groom: data.groom_name,
            bride: data.bride_name,
            groomSurname: data.groom_surname || "",
            brideSurname: data.bride_surname || "",
          },
          wedding: {
            date: data.wedding_date,
            time: data.wedding_time || "7:00 PM",
            city: data.city || "",
          },
          venue: {
            name: data.venue_name || "",
            address: data.venue_address || "",
            mapLink: data.map_link || "",
          },
          events: Array.isArray(data.events) ? data.events : [],
          photos: Array.isArray(data.photos) ? data.photos : [],
          invitation: {
            welcomeMessage:
              data.welcome_message ||
              (data.event_type === "wedding"
                ? "Together with our families"
                : "You are warmly invited"),
            description: data.invitation_description || "",
            theme: data.theme || "royal",
          },
        });
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load invitation.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInvitation();

    return () => {
      active = false;
    };
  }, [slug, isPreview]);

  if (loading) {
    return <main className="auth-loading">Loading invitation...</main>;
  }

  if (error || !invitation) {
    return (
      <main className="auth-loading">
        {error || "Invitation not found."}
      </main>
    );
  }

  return (
    <div
      data-theme={invitation.invitation.theme || "royal"}
      className={`public-invitation theme-${(
        invitation.invitation.theme || "royal"
      ).toLowerCase()}`}
    >
      {isPreview && (
        <div
          style={{
            padding: "10px",
            textAlign: "center",
            background: "#7b2435",
            color: "#fff",
            fontWeight: "600",
          }}
        >
          ADMIN PREVIEW — This invitation is not public yet.
        </div>
      )}

      <Navbar />
      <Hero invitation={invitation} />
      <OurStory invitation={invitation} />
      <Countdown invitation={invitation} />
      <Events invitation={invitation} />
      <Venue invitation={invitation} />
      <PhotoGallery photos={invitation.photos} />
      <RSVP invitation={invitation} />
      <Footer invitation={invitation} />
    </div>
  );
}

export default PublicInvitationPage;

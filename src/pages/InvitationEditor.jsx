import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Eye, ImagePlus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const occasionLabel = (v) => ({wedding:"Wedding",engagement:"Engagement",birthday:"Birthday",anniversary:"Anniversary",baby_shower:"Baby Shower",housewarming:"Housewarming",puja:"Puja / Religious Ceremony",corporate:"Corporate Event",party:"Party / Get-together",other:"Celebration"}[v] || "Wedding");
const starterEvents = [
  { id: 1, icon: "🌼", name: "Haldi", daysBefore: 2, time: "11:00 AM onwards", description: "A morning of sunshine, marigolds and blessings.", venueName: "", venueAddress: "", mapLink: "" },
  { id: 2, icon: "🌿", name: "Mehendi", daysBefore: 1, time: "4:00 PM onwards", description: "An evening of music, henna and happy hearts.", venueName: "", venueAddress: "", mapLink: "" },
  { id: 3, icon: "♡", name: "The Wedding", daysBefore: 0, time: "7:00 PM onwards", description: "Join us as we begin our forever together.", venueName: "", venueAddress: "", mapLink: "" }
];

export default function InvitationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [eventType, setEventType] = useState("wedding");
  const [form, setForm] = useState({
    groom_name: "", bride_name: "", groom_surname: "", bride_surname: "",
    wedding_date: "", wedding_time: "7:00 PM", city: "", venue_name: "",
    venue_address: "", map_link: "", welcome_message: "Together with our families",
    invitation_description: "Joyfully invite you to celebrate the beginning of our forever.",
    theme: "royal"
  });
  const [events, setEvents] = useState(starterEvents);
  const [photos, setPhotos] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!auth.user) { navigate("/admin/login", { replace: true }); return; }
      const { data, error: fetchError } = await supabase.from("clients").select("*")
        .eq("id", id).eq("owner_id", auth.user.id).single();
      if (fetchError) throw fetchError;
      setClient(data);
      setForm({
        groom_name: data.groom_name || "", bride_name: data.bride_name || "",
        groom_surname: data.groom_surname || "", bride_surname: data.bride_surname || "",
        wedding_date: data.wedding_date || "", wedding_time: data.wedding_time || "7:00 PM",
        city: data.city || "", venue_name: data.venue_name || "", venue_address: data.venue_address || "",
        map_link: data.map_link || "", welcome_message: data.welcome_message || "Together with our families",
        invitation_description: data.invitation_description || "Joyfully invite you to celebrate the beginning of our forever.",
        theme: data.theme || "royal"
      });
      setEvents(Array.isArray(data.events) && data.events.length
        ? data.events
        : (data.event_type === "wedding" || !data.event_type ? starterEvents : []));
      setPhotos(Array.isArray(data.photos) ? data.photos : []);
    } catch (e) { setError(e.message || "Unable to load invitation."); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);
  const change = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const changeEvent = (eventId, key, value) => setEvents(old => old.map(ev => ev.id === eventId ? { ...ev, [key]: value } : ev));
  const addEvent = () => setEvents(old => [...old, { id: Date.now(), icon: "✨", name: "New Event", daysBefore: 0, time: "6:00 PM onwards", description: "", venueName: "", venueAddress: "", mapLink: "" }]);
  const deleteEvent = (eventId) => setEvents(old => old.filter(ev => ev.id !== eventId));
  const addPhoto = () => {
    const value = photoUrl.trim();
    if (!value) return;
    try { new URL(value); } catch { setError("Please enter a valid image URL."); return; }
    setPhotos(old => [...old, value]); setPhotoUrl(""); setError("");
  };

  const uploadPhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      const uploaded = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
        if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} exceeds the 8 MB limit.`);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("wedding-photos").upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("wedding-photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setPhotos(old => [...old, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError.message || "Photo upload failed. Check the wedding-photos bucket and its policies.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const payload = { ...form, event_type: eventType, wedding_date: form.wedding_date || null, events, photos };
      const { error: updateError } = await supabase.from("clients").update(payload).eq("id", id);
      if (updateError) throw updateError;
      setMessage("Invitation details saved successfully.");
      await load();
    } catch (e2) { setError(e2.message || "Could not save invitation."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="ia-editor-loading">Loading invitation editor…</div>;
  if (!client) return <div className="ia-editor-loading">{error || "Invitation not found."}<button onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</button></div>;

  return <div className="ia-editor-page">
    <header className="ia-editor-header">
      <button className="ia-secondary" onClick={() => navigate("/admin/dashboard")}><ArrowLeft size={16}/> Dashboard</button>
      <div><span>INVITEAURA · INVITATION STUDIO</span><h1>Edit {occasionLabel(eventType)} Invitation</h1></div>
      <div className="ia-editor-header-actions">
        <button className="ia-secondary" onClick={() => window.open(`/invite/${client.slug}`, "_blank", "noopener,noreferrer")}><Eye size={16}/> Preview</button>
        <button className="ia-primary" onClick={save} disabled={saving}><Save size={16}/>{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </header>
    {error && <div className="ia-alert error">{error}</div>}
    {message && <div className="ia-alert success">{message}</div>}
    <form onSubmit={save} className="ia-editor-layout">
      <main className="ia-editor-main">
        <section className="ia-editor-card"><div className="ia-editor-card-title"><h2>{eventType === "wedding" ? "Couple Details" : "Host Details"}</h2><p>Names displayed on the invitation</p></div>
          <div className="ia-form-grid">
            <label>{eventType === "wedding" ? "Groom / Host first name *" : "Host / Celebrant name *"}<input required value={form.groom_name} onChange={e => change("groom_name",e.target.value)}/></label>
            {eventType === "wedding" && <label>Bride first name *<input required value={form.bride_name} onChange={e => change("bride_name",e.target.value)}/></label>}
            <label>Groom surname<input value={form.groom_surname} onChange={e => change("groom_surname",e.target.value)}/></label>
            <label>Bride surname<input value={form.bride_surname} onChange={e => change("bride_surname",e.target.value)}/></label>
          </div>
        </section>
        <section className="ia-editor-card"><div className="ia-editor-card-title"><h2>{occasionLabel(eventType)} Information</h2><p>Date, time and venue information</p></div>
          <div className="ia-form-grid">
            <label>{eventType === "wedding" ? "Wedding date" : "Event date"}<input type="date" value={form.wedding_date} onChange={e => change("wedding_date",e.target.value)}/></label>
            <label>Event time<input value={form.wedding_time} onChange={e => change("wedding_time",e.target.value)}/></label>
            <label>City<input value={form.city} onChange={e => change("city",e.target.value)}/></label>
            <label>Venue name<input value={form.venue_name} onChange={e => change("venue_name",e.target.value)}/></label>
            <label className="full">Venue address<input value={form.venue_address} onChange={e => change("venue_address",e.target.value)}/></label>
            <label className="full">Google Maps URL<input type="url" value={form.map_link} onChange={e => change("map_link",e.target.value)}/></label>
          </div>
        </section>
        <section className="ia-editor-card"><div className="ia-editor-card-title"><h2>Invitation Message</h2><p>Personalise the opening message</p></div>
          <div className="ia-form-grid">
            <label className="full">Welcome message<input value={form.welcome_message} onChange={e => change("welcome_message",e.target.value)}/></label>
            <label className="full">Invitation description<textarea rows="3" value={form.invitation_description} onChange={e => change("invitation_description",e.target.value)}/></label>
            <label>Visual theme<select value={form.theme} onChange={e => change("theme",e.target.value)}>
              <option value="royal">Luxury Royal</option><option value="floral">Floral Garden</option><option value="minimal">Modern Minimal</option><option value="traditional">Traditional Indian</option>
              <option value="rajasthani">Rajasthani Royal</option><option value="jaipuri">Jaipuri Pink Palace</option><option value="gujarati">Gujarati Celebration</option><option value="marathi">Marathi Classic</option><option value="up-bihar">UP / Bihar Traditional</option>
              <option value="mughal">Mughal Garden</option><option value="udaipur">Udaipur Palace</option><option value="santorini">Santorini Destination</option><option value="beach">Beach Wedding</option><option value="tuscany">Tuscan Romance</option><option value="mountain">Mountain Wedding</option><option value="kashmir">Kashmir Valley</option><option value="midnight">Midnight Luxe</option>
            </select></label>
          </div>
        </section>
        <section className="ia-editor-card"><div className="ia-editor-card-title ia-event-title"><div><h2>{eventType === "wedding" ? "Wedding Events" : "Event Schedule"}</h2><p>Each event can have its own date, time, venue, address and Google Maps location. Haldi, Mehendi and Wedding do not need to share one venue.</p></div><button type="button" className="ia-secondary" onClick={addEvent}><Plus size={15}/> Add event</button></div>
          <div className="ia-event-list">{events.map((ev) => <article className="ia-event-edit" key={ev.id}>
            <div className="ia-event-edit-head"><b>{ev.icon} {ev.name || "Event"}</b><button type="button" className="ia-icon-danger" onClick={() => deleteEvent(ev.id)} title="Remove event"><Trash2 size={16}/></button></div>
            <div className="ia-form-grid">
              <label>Icon / emoji<input value={ev.icon || ""} onChange={e => changeEvent(ev.id,"icon",e.target.value)}/></label>
              <label>Event name<input value={ev.name || ""} onChange={e => changeEvent(ev.id,"name",e.target.value)}/></label>
              <label>Days before wedding<input type="number" min="0" max="30" value={ev.daysBefore ?? 0} onChange={e => changeEvent(ev.id,"daysBefore",Number(e.target.value))}/></label>
              <label>Event time<input value={ev.time || ""} onChange={e => changeEvent(ev.id,"time",e.target.value)}/></label>
              <label className="full">Description<textarea rows="2" value={ev.description || ""} onChange={e => changeEvent(ev.id,"description",e.target.value)}/></label>
              <label>Event venue name<input value={ev.venueName || ""} placeholder="e.g. The Garden Palace" onChange={e => changeEvent(ev.id,"venueName",e.target.value)}/></label>
              <label>Event venue address<input value={ev.venueAddress || ""} placeholder="Full address for this event" onChange={e => changeEvent(ev.id,"venueAddress",e.target.value)}/></label>
              <label className="full">Event Google Maps URL<input type="url" value={ev.mapLink || ""} placeholder="https://maps.google.com/..." onChange={e => changeEvent(ev.id,"mapLink",e.target.value)}/></label>
            </div>
          </article>)}
          {!events.length && <p className="ia-empty">No events yet. Add your first event.</p>}</div>
        </section>
        <section className="ia-editor-card"><div className="ia-editor-card-title"><h2>Photo Gallery</h2><p>Upload images to Supabase Storage or add publicly accessible image URLs.</p></div>
          <div className="ia-photo-add"><input type="url" placeholder="https://example.com/wedding-photo.jpg" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}/><button type="button" className="ia-secondary" onClick={addPhoto}><ImagePlus size={15}/> Add photo URL</button><label className="ia-secondary ia-upload-label">{uploading ? "Uploading…" : "Upload files"}<input type="file" accept="image/*" multiple disabled={uploading} onChange={uploadPhotos}/></label></div>
          <div className="ia-photo-grid">{photos.map((url,index) => <div className="ia-photo-item" key={`${url}-${index}`}><img src={url} alt={`Wedding gallery ${index+1}`} onError={e => {e.currentTarget.style.opacity=".25";}}/><button type="button" onClick={() => setPhotos(old => old.filter((_,i) => i !== index))}><Trash2 size={15}/></button></div>)}</div>
          {!photos.length && <p className="ia-empty">No gallery photos added.</p>}
        </section>
      </main>
      <aside className="ia-editor-side"><div className="ia-editor-card"><span className={`ia-status ${client.status}`}>{client.status}</span><h3>{form.groom_name || "Host"}{eventType === "wedding" && ` & ${form.bride_name || "Bride"}`}</h3><p>{form.wedding_date || "Wedding date not set"}</p><p>{form.city || "City not set"}</p><hr/><button type="submit" className="ia-primary ia-full-button" disabled={saving}><Save size={16}/>{saving ? "Saving…" : "Save all changes"}</button><button type="button" className="ia-secondary ia-full-button" onClick={() => window.open(`/invite/${client.slug}`,"_blank","noopener,noreferrer")}><Eye size={16}/> Open preview</button></div></aside>
    </form>
  </div>;
}

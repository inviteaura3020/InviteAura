import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Users, Heart, Mail, LogOut, Plus, Search, Pencil,
  Trash2, Eye, Globe, EyeOff, CalendarDays, X, RefreshCw, ExternalLink,
  CheckCircle2, Clock3, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const OCCASIONS = [
  ["wedding","Wedding"],["engagement","Engagement"],["birthday","Birthday"],["anniversary","Anniversary"],
  ["baby_shower","Baby Shower"],["housewarming","Housewarming / Griha Pravesh"],["puja","Puja / Religious Ceremony"],
  ["corporate","Corporate Event"],["party","Party / Get-together"],["other","Other Celebration"]
];
const occasionLabel = (v) => OCCASIONS.find(([k]) => k === v)?.[1] || "Wedding";
const isWedding = (v) => !v || v === "wedding";
const emptyForm = { eventType:"wedding", groom:"", bride:"", email:"", date:"", time:"7:00 PM", city:"", venue:"", address:"", mapLink:"" };

const defaultEvents = [
  { id: 1, icon: "🌼", name: "Haldi", daysBefore: 2, time: "11:00 AM onwards", description: "A morning of sunshine, marigolds and blessings." },
  { id: 2, icon: "🌿", name: "Mehendi", daysBefore: 1, time: "4:00 PM onwards", description: "An evening of music, henna and happy hearts." },
  { id: 3, icon: "♡", name: "The Wedding", daysBefore: 0, time: "7:00 PM onwards", description: "Join us as we begin our forever together." }
];

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const dateLabel = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date not set";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true); setError(""); setNotice("");
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!auth?.user) { navigate("/admin/login", { replace: true }); return; }
      setUser(auth.user);
      const { data: clientRows, error: clientError } = await supabase
        .from("clients").select("*").eq("owner_id", auth.user.id).order("created_at", { ascending: false });
      if (clientError) throw clientError;
      const rows = clientRows || [];
      setClients(rows);
      if (rows.length) {
        const ids = rows.map((c) => c.id);
        const { data: rsvpRows, error: rsvpError } = await supabase
          .from("rsvps").select("*").in("client_id", ids).order("created_at", { ascending: false });
        if (rsvpError) throw rsvpError;
        setRsvps(rsvpRows || []);
      } else setRsvps([]);
    } catch (e) {
      setError(e?.message || "Unable to load dashboard data.");
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredClients = useMemo(() => clients.filter((c) =>
    `${c.groom_name} ${c.bride_name} ${c.client_email} ${c.city} ${c.event_type || "wedding"}`.toLowerCase().includes(search.toLowerCase())
  ), [clients, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true); setError(""); };
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ eventType: c.event_type || "wedding", groom: c.groom_name || "", bride: c.bride_name || "", email: c.client_email || "",
      date: c.wedding_date || "", time: c.wedding_time || "7:00 PM", city: c.city || "",
      venue: c.venue_name || "", address: c.venue_address || "", mapLink: c.map_link || "" });
    setModal(true); setError("");
  };
  const setField = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const saveClient = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!form.groom.trim() || !form.email.trim() || (isWedding(form.eventType) && !form.bride.trim())) throw new Error(isWedding(form.eventType) ? "Groom, bride and client email are required." : "Host / celebrant name and client email are required.");
      const record = {
        event_type: form.eventType, groom_name: form.groom.trim(), bride_name: isWedding(form.eventType) ? form.bride.trim() : "", client_email: form.email.trim(),
        wedding_date: form.date || null, wedding_time: form.time.trim(), city: form.city.trim(),
        venue_name: form.venue.trim(), venue_address: form.address.trim(), map_link: form.mapLink.trim() || null
      };
      if (editing) {
        const { error: updateError } = await supabase.from("clients").update(record).eq("id", editing).eq("owner_id", user.id);
        if (updateError) throw updateError;
      } else {
        const slug = `${slugify(form.groom)}-${slugify(isWedding(form.eventType) ? form.bride : form.eventType)}-${Math.random().toString(36).slice(2, 7)}`;
        const { error: insertError } = await supabase.from("clients").insert({
          ...record, owner_id: user.id, slug, status: "draft", events: defaultEvents, photos: []
        });
        if (insertError) throw insertError;
      }
      setModal(false); setNotice(editing ? "Client details updated." : "Client created successfully.");
      await loadData();
    } catch (e2) { setError(e2?.message || "Unable to save client."); }
    finally { setSaving(false); }
  };

  const togglePublish = async (client) => {
    setError(""); setNotice("");
    const next = client.status === "published" ? "draft" : "published";
    const { error: updateError } = await supabase.from("clients").update({ status: next }).eq("id", client.id).eq("owner_id", user.id);
    if (updateError) setError(updateError.message);
    else { setNotice(next === "published" ? "Invitation published." : "Invitation moved to draft."); await loadData(); }
  };

  const removeClient = async (client) => {
    if (!window.confirm(`Delete ${client.groom_name} & ${client.bride_name}? Their RSVP records will also be deleted.`)) return;
    const { error: deleteError } = await supabase.from("clients").delete().eq("id", client.id).eq("owner_id", user.id);
    if (deleteError) setError(deleteError.message);
    else { setNotice("Client and linked RSVP records deleted."); await loadData(); }
  };

  const logout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError(logoutError.message);
    else navigate("/admin/login", { replace: true });
  };

  const totalAttending = rsvps.filter((r) => r.attendance === "yes").length;
  const totalDeclined = rsvps.filter((r) => r.attendance === "no").length;
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Clients", icon: Users },
    { name: "Invitations", icon: Heart },
    { name: "RSVP Management", icon: Mail }
  ];

  const ClientTable = ({ rows, mode = "clients" }) => (
    <div className="ia-table-wrap"><table className="ia-table">
      <thead><tr><th>Event / Client</th><th>Date & occasion</th><th>Status</th><th>Public link</th><th>Actions</th></tr></thead>
      <tbody>{rows.map((c) => <tr key={c.id}>
        <td><strong>{c.groom_name}{c.bride_name ? ` & ${c.bride_name}` : ""}</strong><small>{c.client_email}</small></td>
        <td>{dateLabel(c.wedding_date)}<small>{occasionLabel(c.event_type)} · {c.city || "City not set"}</small></td>
        <td><span className={`ia-status ${c.status}`}>{c.status}</span></td>
        <td><button className="ia-link" onClick={() => window.open(`/invite/${c.slug}`, "_blank", "noopener,noreferrer")} disabled={c.status !== "published"}><ExternalLink size={14}/> Preview</button></td>
        <td><div className="ia-actions">
          <button title="Edit client" onClick={() => openEdit(c)}><Pencil size={16}/></button>
          <button title={c.status === "published" ? "Unpublish" : "Publish"} onClick={() => togglePublish(c)}>{c.status === "published" ? <EyeOff size={16}/> : <Globe size={16}/>}</button>
          <button title="Delete client" className="danger" onClick={() => removeClient(c)}><Trash2 size={16}/></button>
        </div></td>
      </tr>)}
      {!rows.length && <tr><td colSpan="5" className="ia-empty">No records found. Add your first client to get started.</td></tr>}
      </tbody></table></div>
  );

  return <div className="ia-admin">
    <aside className="ia-sidebar">
      <div className="ia-brand"><span>IA</span><b>InviteAura</b></div>
      <p className="ia-nav-label">WORKSPACE</p>
      {navItems.map(({ name, icon: Icon }) => <button key={name} className={`ia-nav ${section === name ? "active" : ""}`} onClick={() => { setSection(name); setError(""); setNotice(""); }}>
        <Icon size={18}/><span>{name}</span>{name === "RSVP Management" && <i>{rsvps.length}</i>}
      </button>)}
      <div className="ia-sidebar-bottom"><div className="ia-user"><span>{(user?.email || "A").slice(0,1).toUpperCase()}</span><div><b>Administrator</b><small>{user?.email || "InviteAura"}</small></div></div>
        <button className="ia-nav" onClick={logout}><LogOut size={18}/> Logout</button></div>
    </aside>

    <main className="ia-main">
      <header className="ia-topbar"><div><p>INVITEAURA ADMINISTRATION</p><h1>{section}</h1></div>
        <button className="ia-secondary" onClick={loadData}><RefreshCw size={16}/> Refresh</button></header>
      {error && <div className="ia-alert error">{error}</div>}
      {notice && <div className="ia-alert success"><CheckCircle2 size={17}/>{notice}</div>}
      {loading ? <div className="ia-loading">Loading your workspace…</div> : <>
        {section === "Dashboard" && <>
          <section className="ia-welcome"><div><span>WELCOME BACK</span><h2>Manage your celebrations.</h2><p>Create, publish and track beautiful digital invitations.</p></div><button className="ia-primary" onClick={openCreate}><Plus size={17}/> Add New Client</button></section>
          <div className="ia-stats">
            <article><Users/><span>Total Clients</span><strong>{clients.length}</strong></article>
            <article><Heart/><span>Published Invitations</span><strong>{clients.filter(c => c.status === "published").length}</strong></article>
            <article><Mail/><span>Total RSVP Responses</span><strong>{rsvps.length}</strong></article>
            <article><CheckCircle2/><span>Guests Attending</span><strong>{totalAttending}</strong></article>
          </div>
          <section className="ia-panel"><div className="ia-panel-head"><div><h2>Recent Clients</h2><p>Your latest invitation projects</p></div><button className="ia-text-btn" onClick={() => setSection("Clients")}>View all clients →</button></div><ClientTable rows={clients.slice(0, 5)}/></section>
        </>}
        {section === "Clients" && <section className="ia-panel"><div className="ia-panel-head"><div><h2>Clients</h2><p>Add and manage your wedding clients.</p></div><button className="ia-primary" onClick={openCreate}><Plus size={17}/> Add Client</button></div>
          <div className="ia-search"><Search size={17}/><input placeholder="Search by couple, email or city…" value={search} onChange={e => setSearch(e.target.value)}/></div><ClientTable rows={filteredClients}/></section>}
        {section === "Invitations" && <section className="ia-panel"><div className="ia-panel-head"><div><h2>Invitation Projects</h2><p>Publish or preview the public invitation pages.</p></div><button className="ia-primary" onClick={openCreate}><Plus size={17}/> New Invitation</button></div>
          <div className="ia-invite-grid">{clients.map(c => <article key={c.id} className="ia-invite-card"><div className="ia-invite-art">♡<small>{occasionLabel(c.event_type).toUpperCase()}</small><strong>{c.groom_name}{c.bride_name ? ` & ${c.bride_name}` : ""}</strong><small>{dateLabel(c.wedding_date)}</small></div><div className="ia-invite-info"><span className={`ia-status ${c.status}`}>{c.status}</span><p><MapPin size={14}/>{c.venue_name || c.city || "Venue not added"}</p><div><button onClick={() => navigate(`/admin/invitation-editor/${c.id}`)}><Pencil size={15}/> Edit invitation</button><button onClick={() => openEdit(c)}><Pencil size={15}/> Client details</button><button onClick={() => togglePublish(c)}>{c.status === "published" ? <EyeOff size={15}/> : <Globe size={15}/>} {c.status === "published" ? "Unpublish" : "Publish"}</button>{c.status === "published" && <button onClick={() => window.open(`/invite/${c.slug}`, "_blank", "noopener,noreferrer")}><Eye size={15}/> Preview</button>}</div></div></article>)}
            {!clients.length && <div className="ia-empty">No invitations yet. Create a client to start an invitation.</div>}</div></section>}
        {section === "RSVP Management" && <section className="ia-panel"><div className="ia-panel-head"><div><h2>Guest Responses</h2><p>Responses received for your published invitations.</p></div><div className="ia-rsvp-summary"><span>Attending: <b>{totalAttending}</b></span><span>Declined: <b>{totalDeclined}</b></span></div></div>
          <div className="ia-table-wrap"><table className="ia-table"><thead><tr><th>Guest</th><th>Wedding</th><th>Attendance</th><th>Guests</th><th>Message</th><th>Received</th></tr></thead><tbody>
            {rsvps.map(r => { const c = clients.find(x => x.id === r.client_id); return <tr key={r.id}><td><strong>{r.guest_name}</strong><small>{r.guest_email || "No email provided"}</small></td><td>{c ? `${c.groom_name}${c.bride_name ? ` & ${c.bride_name}` : ""}` : "Invitation"}</td><td><span className={`ia-status ${r.attendance === "yes" ? "published" : "draft"}`}>{r.attendance === "yes" ? "Attending" : "Declined"}</span></td><td>{r.guest_count}</td><td className="ia-message">{r.message || "—"}</td><td>{r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—"}</td></tr>; })}
            {!rsvps.length && <tr><td colSpan="6" className="ia-empty">No RSVP responses received yet.</td></tr>}
          </tbody></table></div></section>}
      </>}
    </main>

    {modal && <div className="ia-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><div className="ia-modal"><div className="ia-modal-head"><div><span>INVITEAURA · {occasionLabel(form.eventType).toUpperCase()}</span><h2>{editing ? "Edit client" : "Add new client"}</h2></div><button onClick={() => setModal(false)}><X/></button></div>
      <form onSubmit={saveClient}><div className="ia-form-grid">
        <label className="full">Invitation type *
          <select value={form.eventType} onChange={e => { setField("eventType",e.target.value); setField("bride",""); }} required>
            {OCCASIONS.map(([value,label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label>{isWedding(form.eventType) ? "Groom name *" : form.eventType === "birthday" ? "Birthday person name *" : form.eventType === "baby_shower" ? "Parent / Family name *" : "Host / Celebrant name *"}
          <input value={form.groom} onChange={e => setField("groom",e.target.value)} required/>
        </label>
        {isWedding(form.eventType) && <label>Bride name *<input value={form.bride} onChange={e => setField("bride",e.target.value)} required/></label>}
        <label className="full">Client email *<input type="email" value={form.email} onChange={e => setField("email",e.target.value)} required/></label>
        <label>{isWedding(form.eventType) ? "Wedding date" : "Event date"}<input type="date" value={form.date} onChange={e => setField("date",e.target.value)}/></label>
        <label>Event time<input value={form.time} onChange={e => setField("time",e.target.value)} placeholder="7:00 PM"/></label>
        <label>City<input value={form.city} onChange={e => setField("city",e.target.value)}/></label>
        <label>Venue name<input value={form.venue} onChange={e => setField("venue",e.target.value)}/></label>
        <label className="full">Venue address<input value={form.address} onChange={e => setField("address",e.target.value)}/></label>
        <label className="full">Google Maps link<input type="url" value={form.mapLink} onChange={e => setField("mapLink",e.target.value)} placeholder="https://maps.google.com/..."/></label>
      </div>
      {error && <div className="ia-alert error">{error}</div>}
      <div className="ia-modal-actions"><button type="button" className="ia-secondary" onClick={() => setModal(false)}>Cancel</button><button className="ia-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create client"}</button></div></form>
    </div></div>}
  </div>;
}

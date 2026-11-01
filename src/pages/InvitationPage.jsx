import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, Sparkles, Heart, Cake, PartyPopper, Baby, Home,
  BriefcaseBusiness, Flower2, CalendarDays, Mail, Phone, Instagram,
  Palette, MapPin, MessageCircle
} from "lucide-react";

const CONTACT_EMAIL = "inviteaura3020@gmail.com";
const CONTACT_PHONE = "8447704819";
const WHATSAPP_URL = `https://wa.me/91${CONTACT_PHONE}`;

const invitationTypes = [
  { title: "Wedding Invitations", text: "Elegant wedding websites with couple stories, celebrations, multiple venues, photo galleries and guest RSVP.", icon: Heart, tag: "Most loved", tone: "rose" },
  { title: "Engagement Ceremony", text: "Announce the beginning of a beautiful new chapter with a memorable engagement invitation.", icon: Sparkles, tone: "gold" },
  { title: "Birthday Celebrations", text: "Make birthdays and milestone parties feel personal, colourful and unforgettable.", icon: Cake, tone: "peach" },
  { title: "Anniversary", text: "Celebrate years of love and togetherness with a dedicated anniversary invitation.", icon: CalendarDays, tone: "plum" },
  { title: "Baby Shower", text: "Share the happiness, schedule and venue as you celebrate the little one on the way.", icon: Baby, tone: "blue" },
  { title: "Housewarming / Griha Pravesh", text: "Invite family and friends to bless your new home and new beginnings.", icon: Home, tone: "green" },
  { title: "Festivals & Pooja", text: "Thoughtful digital invitations for puja, jagran, festive gatherings and religious ceremonies.", icon: Flower2, tone: "saffron" },
  { title: "Corporate & Special Events", text: "Professional invitations for launches, reunions, business gatherings and special occasions.", icon: BriefcaseBusiness, tone: "slate" },
  { title: "Parties & Get-togethers", text: "A stylish way to share party details, location and collect guest responses.", icon: PartyPopper, tone: "pink" },
];

const features = [
  { icon: Palette, title: "Personalised themes", text: "Choose a visual style that suits the occasion and your taste." },
  { icon: CalendarDays, title: "Event schedules", text: "Show all functions, timings and separate venues in one place." },
  { icon: MapPin, title: "Venue & directions", text: "Add addresses and map links so guests know exactly where to go." },
  { icon: MessageCircle, title: "Guest RSVP", text: "Collect attendance responses and guest counts online." },
];

export default function InvitationPage() {
  const emailSubject = encodeURIComponent("Enquiry about a digital invitation");
  const emailBody = encodeURIComponent("Hello InviteAura,\n\nI would like to create a digital invitation.\n\nOccasion: \nEvent date: \nCity: \nAdditional details: ");
  return (
    <main className="ia-homepage">
      <header className="ia-home-nav">
        <Link to="/" className="ia-home-brand" aria-label="InviteAura home">
          <span>IA</span><b>InviteAura<small>THE ART OF INVITING</small></b>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#invitation-types">Occasions</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact us</a>
        </nav>
        <a href="#contact" className="ia-home-login">Create your invite <ArrowUpRight size={16}/></a>
      </header>

      <section className="ia-home-hero">
        <div className="ia-home-hero-copy">
          <span className="ia-home-eyebrow"><Sparkles size={15}/> EVERY MOMENT DESERVES AN INVITATION</span>
          <h1>Make every occasion<br/><em>beautifully memorable.</em></h1>
          <p>Beautiful, personalised digital invitations for weddings, birthdays, anniversaries, engagements, baby showers and every celebration worth sharing.</p>
          <div className="ia-home-actions">
            <a href="#invitation-types" className="ia-home-primary">Explore invitation styles <ArrowUpRight size={17}/></a>
            <a href="#contact" className="ia-home-secondary">Talk to InviteAura</a>
          </div>
          <div className="ia-home-proof"><span>✦ Personalised designs</span><span>✦ Easy guest RSVP</span><span>✦ Shareable invitation link</span></div>
        </div>
        <div className="ia-home-art" aria-label="InviteAura invitation showcase">
          <div className="ia-home-art-back"></div>
          <div className="ia-home-invite-card">
            <span>YOU ARE INVITED</span><i>Celebrate</i>
            <strong>Life’s<br/>Beautiful<br/>Moments</strong>
            <small>WEDDINGS · PARTIES · FAMILY EVENTS</small><div>✦ &nbsp; ✦ &nbsp; ✦</div>
          </div>
          <div className="ia-home-floating ia-float-one">A moment to remember</div>
          <div className="ia-home-floating ia-float-two">Made with love ♡</div>
        </div>
      </section>

      <section className="ia-home-types" id="invitation-types">
        <div className="ia-home-section-heading">
          <span>ONE PLATFORM, EVERY OCCASION</span>
          <h2>Find the perfect invite<br/><em>for your celebration.</em></h2>
          <p>From intimate family functions to grand celebrations, explore invitation styles made for your special occasion.</p>
        </div>
        <div className="ia-home-type-grid">
          {invitationTypes.map(({title,text,icon:Icon,tag,tone}) => (
            <article className={`ia-type-card ${tone}`} key={title}>
              <div className="ia-type-icon"><Icon size={23}/></div>
              {tag && <span className="ia-type-tag">{tag}</span>}
              <h3>{title}</h3><p>{text}</p>
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`InviteAura enquiry: ${title}`)}`}>Enquire about this style <ArrowUpRight size={15}/></a>
            </article>
          ))}
        </div>
      </section>

      <section className="ia-home-features" id="features">
        <div className="ia-home-section-heading">
          <span>MORE THAN AN INVITATION</span>
          <h2>Everything your guests need,<br/><em>beautifully brought together.</em></h2>
          <p>A thoughtful digital experience that makes sharing your occasion simple.</p>
        </div>
        <div className="ia-home-feature-grid">
          {features.map(({icon:Icon,title,text}) => (
            <article key={title}><span><Icon size={22}/></span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="ia-home-how" id="how-it-works">
        <div><span>MADE SIMPLE</span><h2>Your invitation,<br/><em>in three easy steps.</em></h2></div>
        <div className="ia-home-steps">
          <article><b>01</b><h3>Choose an occasion</h3><p>Tell us what you are celebrating.</p></article>
          <article><b>02</b><h3>Make it personal</h3><p>Add names, photos, schedule, venues and a theme.</p></article>
          <article><b>03</b><h3>Share the joy</h3><p>Receive your invitation link and share it with guests.</p></article>
        </div>
      </section>

      <section className="ia-home-contact" id="contact">
        <div className="ia-contact-heading">
          <span>LET'S CREATE SOMETHING MEMORABLE</span>
          <h2>Have a celebration coming up?<br/><em>Let’s make its invitation special.</em></h2>
          <p>Tell us what you are celebrating. Contact InviteAura to discuss your personalised digital invitation.</p>
        </div>
        <div className="ia-contact-grid">
          <article>
            <span className="ia-contact-icon"><Mail size={20}/></span>
            <small>EMAIL US</small>
            <strong><a href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}>{CONTACT_EMAIL}</a></strong>
            <p>For enquiries, designs and collaboration.</p>
          </article>
          <article>
            <span className="ia-contact-icon"><Phone size={20}/></span>
            <small>CALL / WHATSAPP</small>
            <strong><a href={`tel:+91${CONTACT_PHONE}`}>+91 {CONTACT_PHONE}</a></strong>
            <p><a className="ia-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Chat with us on WhatsApp <ArrowUpRight size={13}/></a></p>
          </article>
          <article>
            <span className="ia-contact-icon"><Instagram size={20}/></span>
            <small>FOLLOW OUR WORK</small>
            <strong>INSTAGRAM</strong>
            <p>Our Instagram profile will be added soon.</p>
            <span className="ia-instagram-placeholder">Instagram link coming soon</span>
          </article>
        </div>
        <div className="ia-contact-cta">
          <p>Have something special in mind?</p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}`} className="ia-home-primary">Start your invitation <ArrowUpRight size={16}/></a>
        </div>
      </section>

      <footer className="ia-home-footer">
        <Link to="/" className="ia-home-brand"><span>IA</span><b>InviteAura<small>THE ART OF INVITING</small></b></Link>
        <p>Thoughtfully made invitations for life’s most meaningful moments.</p>
        <div className="ia-home-footer-links">
          <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="#contact">Instagram · Coming soon</a>
          <Link to="/admin/login">Admin Login <ArrowUpRight size={14}/></Link>
        </div>
        <small>© {new Date().getFullYear()} InviteAura. All rights reserved.</small>
      </footer>
    </main>
  );
}

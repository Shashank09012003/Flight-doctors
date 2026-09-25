import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
 Check,
  ChevronDown,
  Clock3,
  Facebook,
  Globe2,
  Headphones,
  HelpCircle,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Plane,
  Printer,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
  X,
} from 'lucide-react';

type TripType = 'return' | 'one-way';
type Status = 'idle' | 'loading' | 'success' | 'error';

type Booking = {
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  departure: string;
  returnDate: string;
  tripType: TripType;
  occupants: string;
  cabin: string;
  notes: string;
  consent: boolean;
};

const imageUrl = 'https://images.pexels.com/photos/13343883/pexels-photo-13343883.jpeg?auto=compress&cs=tinysrgb&w=1800';

const locations = {
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
  Victoria: ['Melbourne', 'Geelong'],
  Queensland: ['Brisbane', 'Gold Coast', 'Cairns'],
  'Western Australia': ['Perth'],
  'South Australia': ['Adelaide'],
  Tasmania: ['Hobart'],
  'Australian Capital Territory': ['Canberra'],
  'Northern Territory': ['Darwin'],
};

const routes = [
  ['Sydney', 'Melbourne', '$80 – $250'],
  ['Sydney', 'Gold Coast', '$100 – $280'],
  ['Melbourne', 'Adelaide', '$90 – $250'],
  ['Brisbane', 'Perth', '$150 – $350'],
  ['Cairns', 'Sydney', '$120 – $300'],
  ['Melbourne', 'Hobart', '$60 – $200'],
];

const terms = [
  ['Travel Requirements', 'Infants are eligible to travel at infant fare rates until they reach 2 years of age. If an infant turns 2 during the journey, the ticket must be reissued at the applicable child fare, and any fare difference, taxes, and airline charges will apply. By submitting payment, you acknowledge and agree to these Terms & Conditions. Passengers are solely responsible for ensuring they hold valid passports, visas, transit visas, and any other travel documentation required by the destination or transit countries. Please verify all travel requirements with the relevant embassy or consulate before departure.'],
  ['Airfares & Ticketing', 'Airfares are not guaranteed until tickets have been issued. Airlines may revise fares, taxes, or surcharges without prior notice before ticket issuance. Once final approval and payment confirmation are received, ticket issuance will be processed within 24–48 hours, subject to payment verification and booking validation by our Accounts Team. Bank transfers should be completed at least 48 hours before the final payment due date, using the booking reference as the payment reference. Airfares, taxes, and airline-imposed charges remain subject to change until the full payment has been received and verified. Completion of payment confirms your acceptance of these Terms & Conditions and our Privacy Policy.'],
  ['Schedule & Check-in', 'Passengers are advised to reconfirm their flight schedule, dates, meal requests, and seat requests 72 hours before departure. Flights Doctor is not responsible for airline schedule changes, delays, or cancellations. In the event of a No-Show or Missed Flight, airline penalties, fare differences, and applicable taxes will apply. Flights Doctor will assist with rebooking where possible; however, all additional costs are the passenger\'s responsibility. Unless otherwise specified by the airline, tickets are generally valid for 3 months from the date of issue.'],
  ['Amendments & Refunds', 'All amendment requests must be submitted via email at least 48 hours before departure and remain subject to airline approval, applicable fare differences, taxes, airline penalties, and Flights Doctor administrative fees. Non-Flexible Tickets cannot be changed, amended, cancelled, or refunded unless otherwise permitted under the airline\'s fare rules. Flexible Tickets may be changed subject to airline penalties, fare differences, tax differences, and seat availability at the time of the requested change. Refunds, where permitted, are subject to airline approval, applicable penalties, and administrative fees. Refund processing may take approximately 14–16 weeks or longer depending on the airline. Refunds are processed only after the airline has released the funds to Flights Doctor. Processing times are determined by the airline and cannot be guaranteed.'],
  ['Passenger Responsibilities', 'Passengers are responsible for reviewing all passenger names, travel dates, destinations, and flight details before making payment. Flights Doctor accepts no responsibility for errors identified after payment or ticket issuance. Seating, bassinet, wheelchair, meal, and other special service requests are subject to airline availability and are not guaranteed. Passports must remain valid for a minimum of 6 months from the date of travel unless different requirements apply to your destination. Airlines generally do not provide accommodation during transit unless specifically included under their policy or due to operational disruptions. Requests for cabin upgrades (Premium Economy, Business Class, or First Class) should be made before ticket issuance and are subject to airline availability. Passengers must comply with all health, vaccination, testing, and entry requirements imposed by airlines and government authorities at the time of travel.'],
  ['Limited Liability', 'Flights Doctor shall not be liable for delays, cancellations, schedule changes, denied boarding, missed connections, baggage issues, weather disruptions, industrial action, government restrictions, or any circumstances beyond our reasonable control. Flights Doctor is not responsible for services booked independently by passengers, including hotels, transfers, cruises, tours, insurance, or other travel-related products.'],
  ['Travel Documentation & Insurance', 'Passengers are solely responsible for ensuring all passports, visas, permits, vaccination certificates, and other travel documents are valid and available before travel. Flights Doctor accepts no liability for denied boarding or entry resulting from incomplete or incorrect documentation. Flights Doctor strongly recommends that all passengers purchase comprehensive travel insurance covering cancellations, medical emergencies, baggage loss, travel delays, and unforeseen events.'],
  ['Payment Disputes', 'Any payment discrepancy or dispute must be reported within 24 hours of payment. Failure to settle outstanding balances may result in cancellation of the booking.'],
  ['Force Majeure', 'Flights Doctor shall not be liable for any interruption or failure to perform its obligations due to events beyond its control, including but not limited to natural disasters, pandemics, war, terrorism, civil unrest, strikes, government actions, or airline operational disruptions. Flights Doctor is not responsible for travel disruptions arising from changes to immigration laws, border closures, quarantine requirements, or government travel advisories.'],
  ['Privacy & Data Protection', 'Passenger information will be used solely for booking and travel-related purposes and may be shared with airlines, payment providers, and other travel service providers where necessary to complete your booking.'],
];

const banks = [
  { name: 'CBA', bsb: '062 692', acc: '4931 6037' },
  { name: 'ANZ', bsb: '012 055', acc: '1559 54159' },
  { name: 'NAB', bsb: '082 356', acc: '2732 63156' },
];

const stats = [
  ['15K+', 'Happy travellers'],
  ['500+', 'Routes covered'],
  ['7 days', 'Expert support'],
  ['4.9★', 'Customer rating'],
];

const steps = [
  [Plane, 'Tell us your plans', 'Share your route, dates and preferences through our quick booking form.'],
  [WalletCards, 'Get a tailored quote', 'Our team compares fares and finds the best value for your journey.'],
  [BadgeCheck, 'Confirm & fly', 'Approve your quote, complete payment, and receive your ticket within 24–48 hours.'],
];

const testimonials = [
  ['Ravi Sharma', 'Sydney → Delhi', 'Flights Doctor found me a fare $400 cheaper than anything I saw online. The team was patient and thorough.'],
  ['Sarah Williams', 'Melbourne → Singapore', 'Booked a complex family trip with stopovers effortlessly. They handled every detail.'],
  ['James Nguyen', 'Brisbane → Ho Chi Minh', 'Great service and honest advice. They rebooked my cancelled flight without any hassle.'],
];

const faqs = [
  ['How quickly will I receive my ticket?', 'Once payment is confirmed, tickets are typically issued within 24–48 hours, subject to airline verification.'],
  ['Can I change my booking after payment?', 'Amendment requests must be emailed at least 48 hours before departure. Changes depend on the airline fare rules and may attract fees.'],
  ['What happens if I miss my flight?', 'Airline penalties and fare differences will apply. We will assist with rebooking wherever possible, but additional costs are your responsibility.'],
  ['How long do refunds take?', 'Refunds can take approximately 14–16 weeks or longer, depending on the airline. We process them only after the airline releases the funds.'],
  ['Do I need travel insurance?', 'We strongly recommend comprehensive travel insurance for all passengers to cover cancellations, medical emergencies and unforeseen events.'],
];

const initialBooking: Booking = {
  name: '', email: '', phone: '', from: 'Sydney', to: 'Melbourne', departure: '', returnDate: '', tripType: 'return', occupants: '1', cabin: 'Economy', notes: '', consent: false,
};

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Logo() {
  return <a className="logo" href="#top" aria-label="Flights Doctor home"><span className="logo-mark"><Plane size={20} /></span><span>FLIGHTS<strong>DOCTOR</strong><small>YOUR COMFORT OUR DUTY</small></span></a>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState<'home' | 'terms' | 'contact'>(window.location.pathname === '/terms' ? 'terms' : window.location.pathname === '/contact' ? 'contact' : 'home');
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36);
    const onPop = () => setPage(window.location.pathname === '/terms' ? 'terms' : window.location.pathname === '/contact' ? 'contact' : 'home');
    window.addEventListener('scroll', onScroll);
    window.addEventListener('popstate', onPop);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('popstate', onPop); };
  }, []);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const updateBooking = (key: keyof Booking, value: string | boolean) => setBooking((current) => ({ ...current, [key]: value }));
  const goTo = (path: string) => { window.history.pushState({}, '', path); setPage(path === '/terms' ? 'terms' : path === '/contact' ? 'contact' : 'home'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const validate = () => {
    if (!booking.name.trim() || !booking.email.trim() || !booking.phone.trim() || !booking.departure || !booking.consent) return 'Please complete the required fields and accept the terms.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) return 'Please enter a valid email address.';
    if (!/^(?:\+?61|0)4\d{8}$/.test(booking.phone.replace(/[\s()-]/g, ''))) return 'Please enter a valid Australian mobile number.';
    if (booking.tripType === 'return' && (!booking.returnDate || booking.returnDate < booking.departure)) return 'Your return date must be on or after your departure date.';
    return '';
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) { setFormError(error); setStatus('error'); return; }
    setFormError(''); setStatus('loading');
    const payload = { ...booking, access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, subject: 'Flight Request from Website', to: 'info@flightsdoctor.com.au', botcheck: '' };
    try {
      if (!payload.access_key) throw new Error('Form endpoint is not configured');
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Unable to submit');
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFormError('We could not send the request online. You can still email your details directly below.');
    }
  };

  if (page === 'terms') return <><Header compact={compact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} solid /><Terms /></>;
  if (page === 'contact') return <><Header compact={compact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} solid /><ContactPage goTo={goTo} /></>;

  return <div id="top"><Header compact={compact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} /><main><section className="hero"><div className="hero-image" style={{ backgroundImage: `url(${imageUrl})` }} /><div className="hero-shade" /><div className="hero-inner"><div className="hero-copy reveal"><p className="eyebrow light"><span /> Independent travel specialists</p><h1>Travel further.<br /><em>Feel looked after.</em></h1><p className="hero-text">Smart fares, thoughtful advice and a human touch for every journey from Australia.</p><button className="button button-light" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>Check pricing <ArrowRight size={17} /></button><div className="trust-line"><ShieldCheck size={16} /> Personal service, every step of the way</div></div><BookingForm booking={booking} updateBooking={updateBooking} submitBooking={submitBooking} today={today} status={status} formError={formError} goTo={goTo} /></div></section><StatsBar /><Features /><Routes onRequest={(from, to) => { updateBooking('from', from); updateBooking('to', to); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }} /><HowItWorks /><Testimonials /><Faq /><Callout goTo={goTo} /></main><Footer goTo={goTo} /></div>;
}

function Header({ compact, menuOpen, setMenuOpen, goTo, solid }: { compact: boolean; menuOpen: boolean; setMenuOpen: (value: boolean) => void; goTo: (path: string) => void; solid?: boolean }) {
  return <header className={`site-header ${compact ? 'compact' : ''} ${solid ? 'solid' : ''}`}><div className="nav-wrap"><Logo /><nav className={menuOpen ? 'open' : ''}><button onClick={() => goTo('/')}>Home</button><a href="#routes" onClick={() => setMenuOpen(false)}>Domestic flights</a><a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a><button onClick={() => goTo('/terms')}>Terms</button><button onClick={() => goTo('/contact')} className="mobile-link">Contact</button></nav><a className="nav-cta" href="tel:0287597722"><Headphones size={17} /> Talk to an expert</a><button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>;
}

function BookingForm({ booking, updateBooking, submitBooking, today, status, formError, goTo }: { booking: Booking; updateBooking: (key: keyof Booking, value: string | boolean) => void; submitBooking: (event: FormEvent<HTMLFormElement>) => void; today: string; status: Status; formError: string; goTo: (path: string) => void }) {
  return <section className="booking-card" id="booking"><div className="card-heading"><div><p className="eyebrow"><span /> Start planning</p><h2>Find your best way there.</h2></div><Plane className="heading-plane" size={25} /></div><form onSubmit={submitBooking} noValidate><div className="form-grid two"><label>Name<input value={booking.name} onChange={(e) => updateBooking('name', e.target.value)} placeholder="Your full name" /></label><label>Email<input type="email" value={booking.email} onChange={(e) => updateBooking('email', e.target.value)} placeholder="you@email.com" /></label></div><label>Phone number<input type="tel" value={booking.phone} onChange={(e) => updateBooking('phone', e.target.value)} placeholder="04XX XXX XXX" /></label><div className="trip-switch"><span>Trip type</span><label><input type="radio" checked={booking.tripType === 'return'} onChange={() => updateBooking('tripType', 'return')} /> Return</label><label><input type="radio" checked={booking.tripType === 'one-way'} onChange={() => updateBooking('tripType', 'one-way')} /> One way</label></div><div className="form-grid two"><Select label="Leaving from" value={booking.from} onChange={(value) => updateBooking('from', value)} /><Select label="Going to" value={booking.to} onChange={(value) => updateBooking('to', value)} /></div><div className="form-grid two"><label>Departure<input type="date" min={today} value={booking.departure} onChange={(e) => updateBooking('departure', e.target.value)} /></label>{booking.tripType === 'return' && <label>Return<input type="date" min={booking.departure || today} value={booking.returnDate} onChange={(e) => updateBooking('returnDate', e.target.value)} /></label>}</div><div className="form-grid two"><Select label="Travellers" value={booking.occupants} onChange={(value) => updateBooking('occupants', value)} options={['1', '2', '3', '4+']} /><Select label="Cabin class" value={booking.cabin} onChange={(value) => updateBooking('cabin', value)} options={['Economy', 'Premium Economy', 'Business', 'First']} /></div><label>Notes <span className="optional">optional</span><textarea rows={2} value={booking.notes} onChange={(e) => updateBooking('notes', e.target.value)} placeholder="Anything we should know?" /></label><label className="consent"><input type="checkbox" checked={booking.consent} onChange={(e) => updateBooking('consent', e.target.checked)} /><span>I accept the <button type="button" onClick={() => goTo('/terms')}>Terms & Conditions</button> and Privacy Policy.</span></label>{formError && <p className="form-message error">{formError} {status === 'error' && <a href={`mailto:info@flightsdoctor.com.au?subject=Flight%20Request%20from%20Website&body=${encodeURIComponent(JSON.stringify(booking, null, 2))}`}>Email us instead</a>}</p>}{status === 'success' && <div className="form-message success"><Check size={17} /> Request received. Our team will be in touch shortly.</div>}<button disabled={status === 'loading'} className="button button-primary full" type="submit">{status === 'loading' ? 'Sending request…' : 'Request flight details'} <Send size={16} /></button><p className="secure-note"><ShieldCheck size={14} /> No obligation. We reply during business hours.</p></form></section>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options?: string[] }) {
  const values = options || Object.values(locations).flat();
  return <label>{label}<span className="select-wrap"><select value={value} onChange={(e) => onChange(e.target.value)}>{options ? values.map((option) => <option key={option}>{option}</option>) : Object.entries(locations).map(([state, cities]) => <optgroup key={state} label={state}>{cities.map((city) => <option key={city}>{city}</option>)}</optgroup>)}</select><ChevronDown size={15} /></span></label>;
}

function StatsBar() { const ref = useReveal(); return <section className="stats-bar reveal" ref={ref as React.RefObject<HTMLElement>}>{stats.map(([figure, label]) => <div key={figure}><strong>{figure}</strong><span>{label}</span></div>)}</section>; }

function Features() { const items = [[WalletCards, 'Better value', 'We compare the details, not just the headline fare, to find a trip that fits.'], [Globe2, 'Local knowledge', 'From quick getaways to complex itineraries, our advice is always human.'], [Headphones, 'Here when needed', 'A friendly Australian team is ready to help before, during and after you fly.']]; const ref = useReveal(); return <section className="features reveal" id="why-us" ref={ref as React.RefObject<HTMLElement>}><div className="section-label">The Flights Doctor difference</div><div className="feature-grid">{items.map(([Icon, title, copy]) => <article className="feature" key={title as string}><span className="feature-icon"><Icon size={22} /></span><h3>{title as string}</h3><p>{copy as string}</p></article>)}</div></section>; }

function Routes({ onRequest }: { onRequest: (from: string, to: string) => void }) { const ref = useReveal(); return <section className="routes-section reveal" id="routes" ref={ref as React.RefObject<HTMLElement>}><div className="section-intro"><div><p className="eyebrow"><span /> Popular routes</p><h2>Go where the good<br /><em>stories begin.</em></h2></div><p>Indicative domestic fares, updated regularly. Ask our team about international flights and bespoke itineraries.</p></div><div className="route-list">{routes.map(([from, to, price]) => <article className="route-card" key={`${from}-${to}`}><div className="route-line"><strong>{from}</strong><div><span className="route-dot" /><span className="route-track" /><Plane size={15} /><span className="route-track" /><span className="route-dot filled" /></div><strong>{to}</strong></div><div className="price-block"><small>from</small><strong>{price}</strong><button onClick={() => onRequest(from, to)}>Request details <ArrowUpRight size={15} /></button></div></article>)}</div></section>; }

function HowItWorks() { const ref = useReveal(); return <section className="how-it-works reveal" ref={ref as React.RefObject<HTMLElement>}><div className="section-label">How it works</div><div className="steps-grid">{steps.map(([Icon, title, copy], index) => <article className="step-card" key={title as string}><span className="step-number">0{index + 1}</span><span className="step-icon"><Icon size={24} /></span><h3>{title as string}</h3><p>{copy as string}</p>{index < steps.length - 1 && <ArrowRight className="step-arrow" size={20} />}</article>)}</div></section>; }

function Testimonials() { const ref = useReveal(); return <section className="testimonials reveal" ref={ref as React.RefObject<HTMLElement>}><div className="section-label light">What travellers say</div><div className="testimonial-grid">{testimonials.map(([name, route, quote]) => <article className="testimonial-card" key={name as string}><Quote className="quote-mark" size={28} /><div className="stars">{[...Array(5)].map((_, i) => <Star key={i} size={15} />)}</div><p>{quote as string}</p><div className="testimonial-author"><strong>{name as string}</strong><span>{route as string}</span></div></article>)}</div></section>; }

function Faq() { const [open, setOpen] = useState<number | null>(0); const ref = useReveal(); return <section className="faq-section reveal" id="faq" ref={ref as React.RefObject<HTMLElement>}><div className="faq-inner"><div className="faq-intro"><p className="eyebrow"><span /> Good to know</p><h2>Questions, answered.</h2><p>Everything you need to know before booking with us. Can't find your answer? Our team is one call away.</p><a className="button button-primary" href="tel:0287597722"><Phone size={16} /> Call us</a></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><HelpCircle size={18} /> {question}<ChevronDown size={19} /></button>{open === index && <p>{answer}</p>}</article>)}</div></div></section>; }

function Callout({ goTo }: { goTo: (path: string) => void }) { return <section className="callout"><div><p className="eyebrow light"><span /> Take the easy route</p><h2>Good journeys start<br />with a good conversation.</h2></div><a className="button button-light" href="tel:0287597722">Talk to an expert <ArrowRight size={17} /></a></section>; }

function Footer({ goTo }: { goTo: (path: string) => void }) { return <footer><div className="footer-grid"><div><Logo /><p className="footer-copy">Independent travel advice for people who like their journeys to feel effortless.</p><div className="socials"><a href="https://www.facebook.com/flightsdoctorau" aria-label="Facebook"><Facebook size={17} /></a><a href="https://www.instagram.com" aria-label="Instagram"><Instagram size={17} /></a></div></div><div><h4>Visit us</h4><a href="https://maps.google.com/?q=3+Parramatta+Square+Parramatta+NSW"><MapPin size={15} /> Level 14, 3 Parramatta Square,<br />153 Macquarie St, Parramatta<br />NSW 2150 Australia</a><p><Clock3 size={15} /> 9:30 AM – 10:00 PM AEST, 7 days</p><a href="https://www.flightsdoctor.com.au"><Globe2 size={15} /> www.flightsdoctor.com.au</a></div><div><h4>Contact</h4><a href="tel:0287597722"><Phone size={15} /> TEL: 02 87597722</a><a href="mailto:info@flightsdoctor.com.au"><Mail size={15} /> info@flightsdoctor.com.au</a><a href="https://www.facebook.com/flightsdoctorau"><Facebook size={15} /> facebook.com/flightsdoctorau</a></div><div><h4>Bank transfer</h4><p className="bank-name"><Landmark size={15} /> FLIGHTS DOCTOR</p>{banks.map((bank) => <div className="bank-row" key={bank.name}><strong>{bank.name}</strong><span>BSB: {bank.bsb}</span><span>Acc: {bank.acc}</span></div>)}</div><div><h4>Explore</h4><button onClick={() => goTo('/')}>Home</button><a href="#routes">Domestic flights</a><a href="#faq">FAQ</a><button onClick={() => goTo('/terms')}>Terms & Conditions</button><button onClick={() => goTo('/contact')}>Contact</button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Flights Doctor Pty Ltd</span><span>Travel made personal</span></div></footer>; }

type ContactForm = { name: string; email: string; phone: string; message: string; consent: boolean };
const initialContact: ContactForm = { name: '', email: '', phone: '', message: '', consent: false };

function ContactPage({ goTo }: { goTo: (path: string) => void }) {
  const [form, setForm] = useState<ContactForm>(initialContact);
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const update = (key: keyof ContactForm, value: string | boolean) => setForm((c) => ({ ...c, [key]: value }));

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim() || !form.consent) return 'Please complete all required fields and accept the terms.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 8) return 'Please enter a valid phone number.';
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) { setFormError(error); setStatus('error'); return; }
    setFormError(''); setStatus('loading');
    const payload = { ...form, access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, subject: 'Contact Page Enquiry', to: 'info@flightsdoctor.com.au', botcheck: '' };
    try {
      if (!payload.access_key) throw new Error('Form endpoint is not configured');
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Unable to submit');
      setStatus('success'); setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFormError('We could not send your message online. You can still email us directly below.');
    }
  };

  return <main className="contact-page"><section className="contact-hero"><div className="container"><motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}><span /> We're here to help</motion.p><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}>Contact <em>Flights Doctor</em></motion.h1><motion.p className="contact-subtext" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .2 }}>We're here to help with enquiries, complaints, or travel questions.</motion.p></div></section><div className="container contact-layout"><motion.div className="contact-form-wrap" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .3 }}><div className="contact-form-heading"><MessageSquare size={24} /><h2>Send us a message</h2></div><form onSubmit={handleSubmit} noValidate><label className="contact-label">Name<input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" aria-label="Your full name" /></label><label className="contact-label">Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" aria-label="Your email address" /></label><label className="contact-label">Phone number<div className="phone-wrap"><PhoneInput country={'au'} value={form.phone} onChange={(value: string) => update('phone', value)} inputClass="contact-phone-input" buttonClass="contact-phone-button" containerClass="contact-phone-container" dropdownClass="contact-phone-dropdown" inputProps={{ name: 'phone', required: true, 'aria-label': 'Phone number' }} /></div></label><label className="contact-label">Message<textarea rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Type your enquiry, complaint, or question here…" aria-label="Your message" /><span className="char-count">{form.message.length} characters</span></label><label className="consent contact-consent"><input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} /><span>I accept the <button type="button" onClick={() => goTo('/terms')}>Terms & Conditions</button> and Privacy Policy.</span></label>{formError && <p className="form-message error">{formError} {status === 'error' && <a href={`mailto:info@flightsdoctor.com.au?subject=Contact%20Page%20Enquiry&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`)}`}>Email us instead</a>}</p>}<button disabled={status === 'loading'} className="button button-primary full" type="submit">{status === 'loading' ? 'Sending…' : 'Send Message'} <Send size={16} /></button></form></motion.div><motion.aside className="contact-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .4 }}><h3>Get in touch</h3><div className="contact-info-item"><MapPin size={18} /><div><strong>Visit us</strong><p>Level 14, 3 Parramatta Square,<br />153 Macquarie St, Parramatta<br />NSW 2150 Australia</p></div></div><div className="contact-info-item"><Phone size={18} /><div><strong>Call us</strong><a href="tel:0287597722">02 87597722</a></div></div><div className="contact-info-item"><Mail size={18} /><div><strong>Email us</strong><a href="mailto:info@flightsdoctor.com.au">info@flightsdoctor.com.au</a></div></div><div className="contact-info-item"><Clock3 size={18} /><div><strong>Business hours</strong><p>9:30 AM – 10:00 PM AEST<br />7 days a week</p></div></div><div className="contact-info-item"><Globe2 size={18} /><div><strong>Website</strong><a href="https://www.flightsdoctor.com.au">www.flightsdoctor.com.au</a></div></div><div className="contact-socials"><a href="https://www.facebook.com/flightsdoctorau" aria-label="Facebook"><Facebook size={18} /></a><a href="https://www.instagram.com" aria-label="Instagram"><Instagram size={18} /></a></div></motion.aside></div><AnimatePresence>{showModal && <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}><motion.div className="success-modal" initial={{ scale: .8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: .9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 18, stiffness: 260 }} onClick={(e) => e.stopPropagation()}><motion.div className="success-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .2, type: 'spring', damping: 12, stiffness: 200 }}><Check size={40} /></motion.div><h2>Thank you!</h2><p>Your message has been sent. Our team will get back to you shortly.</p><button className="button button-primary" onClick={() => { setShowModal(false); setForm(initialContact); setStatus('idle'); }}>Done</button></motion.div></motion.div>}</AnimatePresence><Footer goTo={goTo} /></main>;
}

function Terms() { const [open, setOpen] = useState(terms.map((_, index) => index === 0)); return <main className="terms-page"><div className="terms-hero"><div className="container"><p className="eyebrow"><span /> Customer care</p><h1>Terms &<br /><em>conditions.</em></h1><p>Clear expectations make for better journeys. Here is the information you need before booking with Flights Doctor.</p><div className="terms-actions"><button className="button button-primary" onClick={() => window.print()}><Printer size={16} /> Print this page</button><a className="button button-quiet" href="mailto:info@flightsdoctor.com.au">Questions? Email us <ArrowUpRight size={15} /></a></div></div></div><div className="container terms-content"><aside><span>Flights Doctor Pty Ltd</span><small>Last updated September 2026</small><div className="privacy-badge"><ShieldCheck size={18} /><strong>Your privacy matters</strong><p>We use your details only to arrange and support your travel.</p></div></aside><div className="terms-list">{terms.map(([title, copy], index) => <article className={`term-item ${open[index] ? 'open' : ''}`} key={title}><button onClick={() => setOpen((current) => current.map((value, i) => i === index ? !value : value))} aria-expanded={open[index]}><span>0{index + 1}</span><strong>{title}</strong><ChevronDown size={19} /></button>{open[index] && <p>{copy}</p>}</article>)}</div></div></main>; }

export default App;

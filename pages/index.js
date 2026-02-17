import Layout from '../components/Layout';
import { getLangContent } from '../lib/content';

export default function Home({ lang = 'it' }) {
    const content = getLangContent(lang);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `/${path}`;
    };

    return (
        <Layout content={content} lang={lang}>
            {/* Hero Section */}
            <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('${getImageUrl(content.hero.image)}')` }}>
                <div className="hero-content">
                    <h1>{content.hero.title}</h1>
                    <p className="hero-subtitle">{content.hero.subtitle}</p>
                    <div className="mt-4">
                        <a href="#chi-siamo" className="btn btn-primary">{content.hero.cta}</a>
                    </div>
                </div>
            </section>

            {/* Chi Siamo */}
            <section id="chi-siamo" className="fade-in">
                <div className="container">
                    <h2 className="section-title">{content.about.title}</h2>
                    <p className="section-subtitle">{content.about.subtitle}</p>
                    <div className="about-grid">
                        <div className="about-text">
                            {content.about.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                        <div className="about-image img-container" data-alt="Vista panoramica del borgo di Sillico"
                            style={{ backgroundImage: `url('${getImageUrl(content.about.image)}')` }}></div>
                    </div>
                </div>
            </section>

            {/* I Sentieri del Moro */}
            <section id="sentieri" className="section-alt fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-route"></i> {content.trails.title}</h2>
                    <p className="section-subtitle">{content.trails.subtitle}</p>

                    <div className="trail-filters">
                        <button className="filter-btn active" data-filter="all">{content.trails.labels.filters.all}</button>
                        <button className="filter-btn" data-filter="T">T (Turistico)</button>
                        <button className="filter-btn" data-filter="E">E (Escursionistico)</button>
                        <button className="filter-btn-duration active" data-duration="all">{content.trails.labels.filters.any}</button>
                        <button className="filter-btn-duration" data-duration="short">&lt; 1h</button>
                        <button className="filter-btn-duration" data-duration="medium">1-2h</button>
                        <button className="filter-btn-duration" data-duration="long">&gt; 2h</button>
                    </div>

                    <div className="trails-grid">
                        {content.trails.items.map((trail) => (
                            <div className="trail-card" key={trail.id} data-difficolta={trail.difficulty} data-duration={trail.duration}>
                                <div className="trail-image"
                                    style={{ backgroundImage: `url('${getImageUrl(trail.image)}')`, height: '200px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--border-radius)', marginBottom: '1rem' }}>
                                </div>
                                <div className="trail-meta">
                                    <span className={`trail-badge badge-${trail.difficulty}`}>{content.trails.labels.time}: {trail.durationText}</span>
                                    <span className="trail-badge" style={{ background: '#eee', color: '#333' }}><i
                                        className="fa-solid fa-mountain"></i> {content.trails.labels.difficulty}: {trail.difficulty} {trail.difficulty === 'T' ? '(turistico)' : '(escursionistico)'}</span>
                                </div>
                                <h3>{trail.title}</h3>
                                <p>{trail.description}</p>
                                <div className="trail-actions">
                                    <a href={getImageUrl(trail.gpx)} className="btn btn-secondary btn-trail" download><i
                                        className="fa-solid fa-download"></i> GPX</a>
                                    {trail.gpxViewerUrl && (
                                        <button className="btn btn-secondary btn-trail" onClick={() => typeof window !== 'undefined' && window.openGpxViewer(trail.gpxViewerUrl)}><i
                                            className="fa-solid fa-map"></i> Mappa</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sillico Bike Rent */}
            <section id="bike-rent" className="fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-bicycle"></i> {content.bike_rent.title}</h2>
                    <p className="section-subtitle">{content.bike_rent.subtitle}</p>
                    <div className="bike-grid">
                        <div>
                            <p className="bike-intro">{content.bike_rent.intro}</p>
                            <ul className="bike-features">
                                {content.bike_rent.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <a href={content.bike_rent.cta.url} target={content.bike_rent.cta.target} className="btn btn-booking">{content.bike_rent.cta.text}</a>
                            </div>
                        </div>
                        <div className="bike-image img-container"
                            style={{ backgroundImage: `url('${getImageUrl(content.bike_rent.image)}')`, height: '350px' }}></div>
                    </div>
                </div>
            </section>

            {/* Eventi */}
            <section id="eventi" className="section-alt fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-calendar-days"></i> {content.events.title}</h2>
                    <p className="section-subtitle">{content.events.subtitle}</p>

                    <div className="events-grid">
                        {content.events.items && content.events.items.length > 0 ? (
                            content.events.items.map((event, i) => (
                                <div key={i} className="event-card" onClick={() => typeof window !== 'undefined' && window.openLightbox(`evento-${i}`)}>
                                    <div className="event-image">
                                        <img src={getImageUrl(event.image)} alt={event.title} id={`evento-${i}-img`} loading="lazy" />
                                        <div className="event-date"><i className="fa-regular fa-calendar"></i> {event.date}</div>
                                    </div>
                                    <div className="event-content">
                                        <h3>{event.title}</h3>
                                        <p>{event.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Nessun evento in programma al momento.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Cosa Vedere */}
            <section id="cosa-vedere" className="fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-monument"></i> {content.attractions.title}</h2>
                    <p className="section-subtitle">{content.attractions.subtitle}</p>
                    <div className="attractions-grid">
                        {content.attractions.items.map((item, i) => (
                            <div key={i} className="attraction-card">
                                <div className="attraction-image img-container"
                                    style={{ backgroundImage: `url('${getImageUrl(item.image)}')` }}></div>
                                <div className="attraction-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ristoranti e Ospitalità */}
            <section id="ospitalita" className="section-alt fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-utensils"></i> {content.hospitality.title}</h2>
                    <p className="section-subtitle">{content.hospitality.subtitle}</p>

                    <div className="hospitality-filters">
                        <button className="hospitality-filter-btn active" data-type="all">{content.hospitality.filters.all}</button>
                        <button className="hospitality-filter-btn" data-type="ristorante">{content.hospitality.filters.restaurants}</button>
                        <button className="hospitality-filter-btn" data-type="alloggio">{content.hospitality.filters.accommodation}</button>
                    </div>

                    <div className="hospitality-list">
                        {content.hospitality.items.map((item, i) => (
                            <div key={i} className="stay-item" data-type={item.type}>
                                <h4>{item.name}</h4>
                                <div className="stay-contact">
                                    {item.contacts.map((contact, j) => (
                                        <a key={j} href={contact.type === 'email' ? `mailto:${contact.value}` : contact.type === 'phone' || contact.type === 'mobile' ? `tel:${contact.value.replace(/\s/g, '')}` : contact.value} target={contact.type === 'web' ? "_blank" : undefined}>
                                            <i className={`fa-solid fa-${contact.type === 'web' ? 'globe' : contact.type === 'email' ? 'envelope' : contact.type === 'mobile' ? 'mobile' : 'phone'}`}></i> {contact.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contatti */}
            <section id="contatti" className="fade-in">
                <div className="container">
                    <h2 className="section-title"><i className="fa-solid fa-address-book"></i> {content.contacts.title}</h2>
                    <p className="section-subtitle">{content.contacts.subtitle}</p>
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon"><i className="fa-solid fa-users"></i></div>
                                <div className="contact-details">
                                    <h4>{content.contacts.associations.title}</h4>
                                    {content.contacts.associations.items.map((assoc, i) => (
                                        <p key={i}><strong>{assoc.name}:</strong> <a href={`mailto:${assoc.email}`}>{assoc.email}</a></p>
                                    ))}
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon"><i className="fa-solid fa-share-nodes"></i></div>
                                <div className="contact-details">
                                    <h4>{content.contacts.social.title}</h4>
                                    <div className="social-links" style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                                        <a href={content.contacts.social.facebook}
                                            target="_blank" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}><i
                                                className="fa-brands fa-facebook"></i></a>
                                        <a href={content.contacts.social.instagram} target="_blank"
                                            style={{ color: 'var(--primary)', fontSize: '1.5rem' }}><i
                                                className="fa-brands fa-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contact-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1396.3852099135363!2d10.442952938823897!3d44.132561417875905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d565f419e20ebf%3A0x74d57d917d501a1!2s55036%20Sillico%2C%20Province%20of%20Lucca!5e1!3m2!1sen!2sit!4v1770041247813!5m2!1sen!2sit"
                                width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export async function getStaticProps() {
    const content = getLangContent('it');
    return {
        props: {
            content,
            lang: 'it'
        }
    };
}

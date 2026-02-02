import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getContent } from '../../lib/content';

export default function AdminDashboard() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [blobStats, setBlobStats] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        } else {
            setContent(getContent());
            fetchBlobStats();
            setLoading(false);
        }
    }, []);

    const fetchBlobStats = async () => {
        try {
            const response = await fetch('/api/admin/blob-stats', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
            });
            if (response.ok) {
                const stats = await response.json();
                setBlobStats(stats);
            }
        } catch (e) {
            console.error('Failed to fetch blob stats');
        }
    };

    const StorageBar = () => {
        if (!blobStats) return null;
        const formatBytes = (bytes) => (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (
            <div className="storage-bar-container">
                <div className="storage-info">
                    <span><i className="fa-solid fa-cloud"></i> Storage Vercel Blob</span>
                    <span>{formatBytes(blobStats.used)} / {formatBytes(blobStats.limit)}</span>
                </div>
                <div className="storage-bar">
                    <div className="storage-progress" style={{ width: `${Math.min(blobStats.percentage, 100)}%` }}></div>
                </div>
            </div>
        );
    };

    const FileUploader = ({ label, path, currentUrl, accept = "image/*" }) => {
        const [uploading, setUploading] = useState(false);
        const [uploadError, setUploadError] = useState('');

        const isImage = accept.includes('image');

        const onFileSelect = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            uploadFile(file);
        };

        const onDrop = async (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            uploadFile(file);
        };

        const uploadFile = async (file) => {
            setUploading(true);
            setUploadError('');
            try {
                const response = await fetch(`/api/admin/upload?filename=${file.name}&contentType=${file.type}&oldUrl=${currentUrl}`, {
                    method: 'POST',
                    body: file,
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
                });

                if (response.ok) {
                    const blob = await response.json();
                    updateField(path, blob.url);
                    fetchBlobStats();
                } else {
                    const errorData = await response.json();
                    setUploadError(errorData.error || 'Errore durante il caricamento');
                    console.error('Upload failed:', errorData);
                }
            } catch (err) {
                setUploadError('Errore di connessione. Verifica che il server Node.js sia in esecuzione (npm run dev).');
                console.error('Upload connection error:', err);
            } finally {
                setUploading(false);
            }
        };

        return (
            <div className="input-group">
                <label>{label}</label>
                <div
                    className={`drop-zone ${uploading ? 'uploading' : ''} ${uploadError ? 'error' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                >
                    {uploading ? (
                        <span><i className="fa-solid fa-spinner fa-spin"></i> Caricamento...</span>
                    ) : (
                        <>
                            {currentUrl && isImage ? (
                                <div className="preview-container">
                                    <img src={currentUrl.startsWith('http') ? currentUrl : `/${currentUrl}`} alt="Preview" />
                                    <div className="preview-overlay">
                                        <span>Trascina per sostituire</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="uploader-placeholder">
                                    <i className={`fa-solid ${isImage ? 'fa-image' : 'fa-file-code'}`}></i>
                                    <span>{currentUrl ? (isImage ? 'Immagine presente' : 'File GPX presente') : (isImage ? 'Trascina immagine o clicca' : 'Trascina file GPX o clicca')}</span>
                                </div>
                            )}
                            <input type="file" accept={accept} onChange={onFileSelect} />
                        </>
                    )}
                </div>
                {uploadError && <div className="upload-error-msg"><i className="fa-solid fa-triangle-exclamation"></i> {uploadError}</div>}
                <div className="input-group" style={{ marginTop: '0.5rem' }}>
                    <input
                        type="text"
                        value={currentUrl}
                        placeholder={isImage ? "O incolla URL immagine" : "O incolla URL file GPX"}
                        onChange={(e) => updateField(path, e.target.value)}
                    />
                </div>
            </div>
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: 'info', text: 'Salvataggio in corso...' });

        try {
            const response = await fetch('/api/admin/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Sito aggiornato! Il redeploy è stato avviato su Vercel.' });
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: `Errore: ${data.error || 'Impossibile salvare'}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Errore di connessione' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (path, value) => {
        const newContent = { ...content };
        const parts = path.split('.');
        let current = newContent;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setContent(newContent);
    };

    if (loading) return <div>Caricamento...</div>;

    const TabButton = ({ id, label, icon }) => (
        <button
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
        >
            <i className={`fa-solid fa-${icon}`}></i> {label}
        </button>
    );

    const TextInput = ({ label, path, lang }) => (
        <div className="input-group">
            <label>{label} ({lang.toUpperCase()})</label>
            <input
                type="text"
                value={content[activeTab][path][lang]}
                onChange={(e) => updateField(`${activeTab}.${path}.${lang}`, e.target.value)}
            />
        </div>
    );

    return (
        <div className="admin-layout">
            <Head>
                <title>Dashboard Admin - Sillico</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link rel="stylesheet" href="/css/style.css" />
                <style>{`
                    .admin-layout {
                        display: flex;
                        min-height: 100vh;
                        background: #f4f6f8;
                    }
                    .admin-sidebar {
                        width: 250px;
                        background: #2c3e50;
                        color: white;
                        padding: 2rem 0;
                        display: flex;
                        flex-direction: column;
                    }
                    .admin-sidebar h2 {
                        padding: 0 1.5rem;
                        margin-bottom: 2rem;
                        font-family: var(--font-header);
                        font-size: 1.5rem;
                    }
                    .tab-btn {
                        background: none;
                        border: none;
                        color: #bdc3c7;
                        padding: 1rem 1.5rem;
                        text-align: left;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 0.8rem;
                    }
                    .tab-btn:hover {
                        background: #34495e;
                        color: white;
                    }
                    .tab-btn.active {
                        background: var(--primary);
                        color: white;
                        border-left: 4px solid var(--secondary);
                    }
                    .admin-main {
                        flex: 1;
                        padding: 2rem;
                        overflow-y: auto;
                    }
                    .admin-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 2rem;
                    }
                    .card {
                        background: white;
                        padding: 2rem;
                        border-radius: var(--border-radius);
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                    .input-group {
                        margin-bottom: 1.5rem;
                    }
                    .input-group label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        color: #333;
                    }
                    .input-group input, .input-group textarea {
                        width: 100%;
                        padding: 0.8rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-family: inherit;
                    }
                    .message {
                        padding: 1rem;
                        border-radius: 4px;
                        margin-bottom: 1.5rem;
                    }
                    .message.info { background: #e3f2fd; color: #0d47a1; }
                    .message.success { background: #e8f5e9; color: #1b5e20; }
                    .message.error { background: #ffebee; color: #b71c1c; }
                    
                    .logout-btn {
                        margin-top: auto;
                        padding: 1rem 1.5rem;
                        color: #e74c3c;
                        text-decoration: none;
                        font-size: 0.9rem;
                    }

                    /* Vercel Blob Styles */
                    .storage-bar-container {
                        padding: 1rem 1.5rem;
                        background: rgba(0,0,0,0.1);
                        margin: 1rem 1rem 2rem 1rem;
                        border-radius: 8px;
                    }
                    .storage-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.8rem;
                        margin-bottom: 0.5rem;
                        color: #bdc3c7;
                    }
                    .storage-bar {
                        height: 6px;
                        background: #455a64;
                        border-radius: 3px;
                        overflow: hidden;
                    }
                    .storage-progress {
                        height: 100%;
                        background: var(--secondary);
                        transition: width 0.3s;
                    }
                    
                    .drop-zone {
                        border: 2px dashed #ddd;
                        border-radius: 8px;
                        padding: 1rem;
                        text-align: center;
                        position: relative;
                        transition: all 0.2s;
                        background: #fdfdfd;
                        cursor: pointer;
                        min-height: 120px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .drop-zone:hover {
                        border-color: var(--primary);
                        background: #f0f7ff;
                    }
                    .drop-zone input[type="file"] {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        opacity: 0;
                        cursor: pointer;
                    }
                    .preview-container {
                        width: 100%;
                        max-height: 200px;
                        overflow: hidden;
                        border-radius: 4px;
                    }
                    .preview-container img {
                        width: 100%;
                        object-fit: cover;
                    }
                    .preview-overlay {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0,0,0,0.4);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.2s;
                    }
                    .drop-zone:hover .preview-overlay {
                        opacity: 1;
                    }
                    .upload-error-msg {
                        color: #e74c3c;
                        font-size: 0.85rem;
                        margin-top: 5px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    .drop-zone.error {
                        border-color: #e74c3c;
                        background: #fdf2f2;
                    }
                    .uploader-placeholder {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                    }
                    .uploader-placeholder i {
                        font-size: 2rem;
                        color: #bdc3c7;
                    }
                `}</style>
            </Head>

            <aside className="admin-sidebar">
                <h2>Sillico Admin</h2>
                <StorageBar />
                <TabButton id="hero" label="Hero" icon="wand-magic-sparkles" />
                <TabButton id="about" label="Chi Siamo" icon="circle-info" />
                <TabButton id="trails" label="Sentieri" icon="route" />
                <TabButton id="events" label="Eventi" icon="calendar-days" />
                <TabButton id="bike-rent" label="Bike Rent" icon="bicycle" />
                <TabButton id="attractions" label="Cosa Vedere" icon="camera-retro" />
                <TabButton id="hospitality" label="Ospitalità" icon="bed" />
                <TabButton id="contacts" label="Contatti" icon="address-book" />

                <a href="#" className="logout-btn" onClick={() => {
                    localStorage.removeItem('admin_token');
                    router.push('/admin/login');
                }}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <div>
                        <h1>Modifica {activeTab.toUpperCase()}</h1>
                        <p style={{ color: '#e67e22', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> Nota: Per caricare file e vedere statistiche è necessario il server Node.js attivo (npm run dev).
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="card">
                    {activeTab === 'hero' && (
                        <div>
                            <div className="grid-2">
                                <div className="col-it">
                                    <h3>Italiano</h3>
                                    <TextInput label="Titolo" path="title" lang="it" />
                                    <TextInput label="Sottotitolo" path="subtitle" lang="it" />
                                    <TextInput label="Testo Bottone" path="cta" lang="it" />
                                </div>
                                <div className="col-en">
                                    <h3>English</h3>
                                    <TextInput label="Title" path="title" lang="en" />
                                    <TextInput label="Subtitle" path="subtitle" lang="en" />
                                    <TextInput label="Button Text" path="cta" lang="en" />
                                </div>
                            </div>
                            <FileUploader
                                label="Immagine di Sfondo Hero"
                                path="hero.image"
                                currentUrl={content.hero.image}
                            />
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div>
                            <div className="grid-2">
                                <div className="col-it">
                                    <h3>Italiano</h3>
                                    <TextInput label="Titolo" path="title" lang="it" />
                                    <TextInput label="Sottotitolo" path="subtitle" lang="it" />
                                    {content.about.paragraphs.map((_, i) => (
                                        <div key={i} className="input-group">
                                            <label>Paragrafo {i + 1}</label>
                                            <textarea
                                                rows="4"
                                                value={content.about.paragraphs[i].it}
                                                onChange={(e) => {
                                                    const newContent = { ...content };
                                                    newContent.about.paragraphs[i].it = e.target.value;
                                                    setContent(newContent);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="col-en">
                                    <h3>English</h3>
                                    <TextInput label="Title" path="title" lang="en" />
                                    <TextInput label="Subtitle" path="subtitle" lang="en" />
                                    {content.about.paragraphs.map((_, i) => (
                                        <div key={i} className="input-group">
                                            <label>Paragraph {i + 1}</label>
                                            <textarea
                                                rows="4"
                                                value={content.about.paragraphs[i].en}
                                                onChange={(e) => {
                                                    const newContent = { ...content };
                                                    newContent.about.paragraphs[i].en = e.target.value;
                                                    setContent(newContent);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FileUploader
                                label="Immagine 'Chi Siamo'"
                                path="about.image"
                                currentUrl={content.about.image}
                            />
                        </div>
                    )}

                    {activeTab === 'trails' && (
                        <div>
                            <p>Modifica i sentieri esistenti o aggiungine di nuovi.</p>
                            {content.trails.items.map((trail, idx) => (
                                <div key={trail.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                                    <div className="grid-2">
                                        <div>
                                            <div className="input-group">
                                                <label>Titolo (IT)</label>
                                                <input type="text" value={trail.title.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.trails.items[idx].title.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Durata (IT - es: "1 ora")</label>
                                                <input type="text" value={trail.durationText.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.trails.items[idx].durationText.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Difficoltà</label>
                                                <select value={trail.difficulty} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.trails.items[idx].difficulty = e.target.value;
                                                    setContent(nc);
                                                }}>
                                                    <option value="T">T (Turistico)</option>
                                                    <option value="E">E (Escursionistico)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="input-group">
                                                <label>Title (EN)</label>
                                                <input type="text" value={trail.title.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.trails.items[idx].title.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Duration (EN - ex: "1 hour")</label>
                                                <input type="text" value={trail.durationText.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.trails.items[idx].durationText.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <FileUploader
                                                label="Immagine"
                                                path={`trails.items.${idx}.image`}
                                                currentUrl={trail.image}
                                            />
                                            <FileUploader
                                                label="File GPX"
                                                path={`trails.items.${idx}.gpx`}
                                                currentUrl={trail.gpx}
                                                accept=".gpx,application/gpx+xml"
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary" style={{ color: 'red', border: '1px solid red' }} onClick={() => {
                                        const nc = { ...content };
                                        nc.trails.items.splice(idx, 1);
                                        setContent(nc);
                                    }}>Elimina Sentiero</button>
                                </div>
                            ))}
                            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                                const nc = { ...content };
                                const newId = String(Math.max(...nc.trails.items.map(t => parseInt(t.id))) + 1);
                                nc.trails.items.push({
                                    id: newId,
                                    title: { it: 'Nuovo Sentiero', en: 'New Trail' },
                                    difficulty: 'T',
                                    duration: 60,
                                    durationText: { it: '1 ora', en: '1 hour' },
                                    image: 'images/sentiero-maesta.jpg',
                                    description: { it: '', en: '' },
                                    gpx: 'gpx/caprasecca.gpx'
                                });
                                setContent(nc);
                            }}>+ Aggiungi Nuovo Sentiero</button>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div>
                            {content.events.items.map((event, idx) => (
                                <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                                    <div className="grid-2">
                                        <div>
                                            <div className="input-group">
                                                <label>Titolo (IT)</label>
                                                <input type="text" value={event.title.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.events.items[idx].title.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Data (IT)</label>
                                                <input type="text" value={event.date.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.events.items[idx].date.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="input-group">
                                                <label>Title (EN)</label>
                                                <input type="text" value={event.title.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.events.items[idx].title.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Date (EN)</label>
                                                <input type="text" value={event.date.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.events.items[idx].date.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                    <FileUploader
                                        label="Immagine Evento"
                                        path={`events.items.${idx}.image`}
                                        currentUrl={event.image}
                                    />
                                    <div className="grid-2">
                                        <div className="input-group">
                                            <label>Descrizione (IT)</label>
                                            <textarea rows="3" value={event.description.it} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.events.items[idx].description.it = e.target.value;
                                                setContent(nc);
                                            }} />
                                        </div>
                                        <div className="input-group">
                                            <label>Description (EN)</label>
                                            <textarea rows="3" value={event.description.en} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.events.items[idx].description.en = e.target.value;
                                                setContent(nc);
                                            }} />
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary" style={{ color: 'red', border: '1px solid red' }} onClick={() => {
                                        const nc = { ...content };
                                        nc.events.items.splice(idx, 1);
                                        setContent(nc);
                                    }}>Elimina Evento</button>
                                </div>
                            ))}
                            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                                const nc = { ...content };
                                if (!nc.events.items) nc.events.items = [];
                                nc.events.items.push({
                                    title: { it: 'Nuovo Evento', en: 'New Event' },
                                    date: { it: '', en: '' },
                                    image: '',
                                    description: { it: '', en: '' }
                                });
                                setContent(nc);
                            }}>+ Aggiungi Nuovo Evento</button>
                        </div>
                    )}

                    {activeTab === 'bike-rent' && (
                        <div>
                            <div className="grid-2">
                                <div className="col-it">
                                    <h3>Italiano</h3>
                                    <TextInput label="Titolo" path="bike_rent.title" lang="it" />
                                    <TextInput label="Sottotitolo" path="bike_rent.subtitle" lang="it" />
                                    <TextInput label="Intro" path="bike_rent.intro" lang="it" />
                                </div>
                                <div className="col-en">
                                    <h3>English</h3>
                                    <TextInput label="Title" path="bike_rent.title" lang="en" />
                                    <TextInput label="Subtitle" path="bike_rent.subtitle" lang="en" />
                                    <TextInput label="Intro" path="bike_rent.intro" lang="en" />
                                </div>
                            </div>
                            <FileUploader
                                label="Immagine Bike Rent"
                                path="bike_rent.image"
                                currentUrl={content.bike_rent.image}
                            />
                            <div className="input-group">
                                <label>Caratteristiche (Lista)</label>
                                {content.bike_rent.features.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                        <input type="text" value={feature.it} placeholder="IT" onChange={(e) => {
                                            const nc = { ...content };
                                            nc.bike_rent.features[i].it = e.target.value;
                                            setContent(nc);
                                        }} />
                                        <input type="text" value={feature.en} placeholder="EN" onChange={(e) => {
                                            const nc = { ...content };
                                            nc.bike_rent.features[i].en = e.target.value;
                                            setContent(nc);
                                        }} />
                                        <button className="btn-small" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => {
                                            const nc = { ...content };
                                            nc.bike_rent.features.splice(i, 1);
                                            setContent(nc);
                                        }}>×</button>
                                    </div>
                                ))}
                                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => {
                                    const nc = { ...content };
                                    nc.bike_rent.features.push({ it: '', en: '' });
                                    setContent(nc);
                                }}>+ Aggiungi Caratteristica</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hospitality' && (
                        <div>
                            {content.hospitality.items.map((item, idx) => (
                                <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                                    <div className="grid-2">
                                        <div className="input-group">
                                            <label>Nome</label>
                                            <input type="text" value={item.name} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.hospitality.items[idx].name = e.target.value;
                                                setContent(nc);
                                            }} />
                                        </div>
                                        <div className="input-group">
                                            <label>Tipo</label>
                                            <select value={item.type} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.hospitality.items[idx].type = e.target.value;
                                                setContent(nc);
                                            }}>
                                                <option value="ristorante">Ristorante</option>
                                                <option value="alloggio">Alloggio</option>
                                            </select>
                                        </div>
                                    </div>
                                    {item.contacts.map((contact, cIdx) => (
                                        <div key={cIdx} className="grid-2" style={{ marginLeft: '2rem', background: '#f9f9f9', padding: '0.5rem' }}>
                                            <div className="input-group">
                                                <label>Tipo Contatto</label>
                                                <select value={contact.type} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.hospitality.items[idx].contacts[cIdx].type = e.target.value;
                                                    setContent(nc);
                                                }}>
                                                    <option value="phone">Telefono</option>
                                                    <option value="mobile">Cellulare</option>
                                                    <option value="email">Email</option>
                                                    <option value="web">Sito Web</option>
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label>Valore</label>
                                                <input type="text" value={contact.value} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.hospitality.items[idx].contacts[cIdx].value = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn btn-secondary" style={{ color: 'red', border: '1px solid red', marginTop: '1rem' }} onClick={() => {
                                        const nc = { ...content };
                                        nc.hospitality.items.splice(idx, 1);
                                        setContent(nc);
                                    }}>Elimina Struttura</button>
                                </div>
                            ))}
                            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                                const nc = { ...content };
                                nc.hospitality.items.push({
                                    name: 'Nuova Struttura',
                                    type: 'alloggio',
                                    contacts: [{ type: 'phone', value: '', label: 'Telefono' }]
                                });
                                setContent(nc);
                            }}>+ Aggiungi Nuova Struttura</button>
                        </div>
                    )}

                    {activeTab === 'attractions' && (
                        <div>
                            {content.attractions.items.map((item, idx) => (
                                <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                                    <div className="grid-2">
                                        <div className="col-it">
                                            <h3>Italiano</h3>
                                            <div className="input-group">
                                                <label>Titolo</label>
                                                <input type="text" value={item.title.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.attractions.items[idx].title.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Descrizione</label>
                                                <textarea rows="4" value={item.description.it} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.attractions.items[idx].description.it = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                        </div>
                                        <div className="col-en">
                                            <h3>English</h3>
                                            <div className="input-group">
                                                <label>Title</label>
                                                <input type="text" value={item.title.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.attractions.items[idx].title.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                            <div className="input-group">
                                                <label>Description</label>
                                                <textarea rows="4" value={item.description.en} onChange={(e) => {
                                                    const nc = { ...content };
                                                    nc.attractions.items[idx].description.en = e.target.value;
                                                    setContent(nc);
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                    <FileUploader
                                        label="Immagine Attrazione"
                                        path={`attractions.items.${idx}.image`}
                                        currentUrl={item.image}
                                    />
                                    <button className="btn btn-secondary" style={{ color: 'red', border: '1px solid red' }} onClick={() => {
                                        const nc = { ...content };
                                        nc.attractions.items.splice(idx, 1);
                                        setContent(nc);
                                    }}>Elimina Attrazione</button>
                                </div>
                            ))}
                            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                                const nc = { ...content };
                                nc.attractions.items.push({
                                    title: { it: 'Nuova Attrazione', en: 'New Attraction' },
                                    image: '',
                                    description: { it: '', en: '' }
                                });
                                setContent(nc);
                            }}>+ Aggiungi Nuova Attrazione</button>
                        </div>
                    )}

                    {activeTab === 'contacts' && (
                        <div className="grid-2">
                            <div className="col-it">
                                <h3>Social & Info</h3>
                                <div className="input-group">
                                    <label>Facebook URL</label>
                                    <input type="text" value={content.contacts.social.facebook} onChange={(e) => {
                                        const nc = { ...content };
                                        nc.contacts.social.facebook = e.target.value;
                                        setContent(nc);
                                    }} />
                                </div>
                                <div className="input-group">
                                    <label>Instagram URL</label>
                                    <input type="text" value={content.contacts.social.instagram} onChange={(e) => {
                                        const nc = { ...content };
                                        nc.contacts.social.instagram = e.target.value;
                                        setContent(nc);
                                    }} />
                                </div>
                                <div className="input-group">
                                    <label>Copyright (IT)</label>
                                    <input type="text" value={content.footer.copyright.it} onChange={(e) => {
                                        const nc = { ...content };
                                        nc.footer.copyright.it = e.target.value;
                                        setContent(nc);
                                    }} />
                                </div>
                                <div className="input-group">
                                    <label>Copyright (EN)</label>
                                    <input type="text" value={content.footer.copyright.en} onChange={(e) => {
                                        const nc = { ...content };
                                        nc.footer.copyright.en = e.target.value;
                                        setContent(nc);
                                    }} />
                                </div>
                            </div>
                            <div className="col-en">
                                <h3>Associazioni</h3>
                                {content.contacts.associations.items.map((assoc, i) => (
                                    <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9' }}>
                                        <div className="input-group">
                                            <label>Nome</label>
                                            <input type="text" value={assoc.name} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.contacts.associations.items[i].name = e.target.value;
                                                setContent(nc);
                                            }} />
                                        </div>
                                        <div className="input-group">
                                            <label>Email</label>
                                            <input type="text" value={assoc.email} onChange={(e) => {
                                                const nc = { ...content };
                                                nc.contacts.associations.items[i].email = e.target.value;
                                                setContent(nc);
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

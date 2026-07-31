import React, { useState } from 'react';
import { Quote, Copy, Check, X, Download } from 'lucide-react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication: {
    title: string;
    author_name?: string;
    co_authors?: string[];
    published_date?: string;
    outlet_name?: string;
    external_url?: string;
  } | null;
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, publication }) => {
  const [activeTab, setActiveTab] = useState<'APA' | 'BibTeX' | 'RIS'>('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !publication) return null;

  const authors = [publication.author_name || 'Dr. Rashid', ...(publication.co_authors || [])].join(', ');
  const year = publication.published_date ? publication.published_date.substring(0, 4) : '2025';
  const journal = publication.outlet_name || 'WenClims Extreme Events Attribution Journal';
  const url = publication.external_url || 'https://wenclims.org/publications';

  const apaCitation = `${authors} (${year}). ${publication.title}. ${journal}. Available at: ${url}`;

  const bibtexCitation = `@article{wenclims_${year}_${publication.title.substring(0, 10).toLowerCase().replace(/[^a-z0-9]/g, '')},
  title = {${publication.title}},
  author = {${authors}},
  journal = {${journal}},
  year = {${year}},
  url = {${url}}
}`;

  const risCitation = `TY  - JOUR
TI  - ${publication.title}
AU  - ${authors}
JO  - ${journal}
PY  - ${year}
UR  - ${url}
ER  -`;

  const getActiveText = () => {
    if (activeTab === 'BibTeX') return bibtexCitation;
    if (activeTab === 'RIS') return risCitation;
    return apaCitation;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = getActiveText();
    const ext = activeTab === 'BibTeX' ? 'bib' : activeTab === 'RIS' ? 'ris' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `citation_${year}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(11, 30, 61, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '640px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: '1px solid #E2E8F4',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.5rem 1.75rem', background: '#0B1E3D', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,200,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Quote size={20} color="#00C8C8" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                Academic Citation Generator
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#94A3B8', margin: 0 }}>Cite this paper in APA, BibTeX, or RIS format</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.75rem' }}>
          {/* Format Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #F0F4FA', paddingBottom: '0.5rem' }}>
            {(['APA', 'BibTeX', 'RIS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? '#0B1E3D' : '#F1F5F9',
                  color: activeTab === tab ? '#00C8C8' : '#64748B',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab} Format
              </button>
            ))}
          </div>

          {/* Citation Text Area */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F4', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', fontFamily: activeTab === 'APA' ? 'Inter, sans-serif' : 'monospace', fontSize: '0.875rem', color: '#1E293B', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {getActiveText()}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={handleDownload} className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
              <Download size={16} /> Download .{activeTab === 'BibTeX' ? 'bib' : activeTab === 'RIS' ? 'ris' : 'txt'}
            </button>
            <button onClick={handleCopy} className="btn-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

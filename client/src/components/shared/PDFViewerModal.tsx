import React from 'react';
import { X, FileText, Download, ExternalLink, ArrowUpRight } from 'lucide-react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  externalUrl?: string;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  externalUrl,
}) => {
  if (!isOpen) return null;

  const isPdf = (() => {
    if (!pdfUrl) return false;
    const clean = pdfUrl.trim().toLowerCase().split('?')[0];
    return clean.endsWith('.pdf') || clean.includes('/assets/docs/') || clean.includes('/uploads/pdf/');
  })();

  const redirectUrl = externalUrl || pdfUrl;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(11, 30, 61, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: isPdf ? '960px' : '600px',
          height: isPdf ? '85vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: '1px solid #E2E8F4',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#0B1E3D',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <FileText size={20} color="#00C8C8" style={{ flexShrink: 0 }} />
            <h3
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 700,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#fff',
              }}
            >
              {title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {redirectUrl && (
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                }}
              >
                {isPdf ? <Download size={14} /> : <ExternalLink size={14} />}
                <span>{isPdf ? 'Download PDF' : 'Open External Link'}</span>
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isPdf ? (
          <div style={{ flex: 1, background: '#F1F5F9', position: 'relative' }}>
            <iframe
              src={pdfUrl}
              title={title}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          /* High-end External Publication Card Fallback (Never blocks with iframe error) */
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center', background: '#F8FAFC' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(0, 200, 200, 0.12)',
                color: '#00C8C8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <ExternalLink size={30} />
            </div>
            <h4
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0B1E3D',
                margin: '0 0 0.5rem',
              }}
            >
              External Journal Publication
            </h4>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#64748B',
                maxWidth: '460px',
                margin: '0 auto 1.5rem',
                lineHeight: 1.6,
              }}
            >
              This publication is hosted externally on an official academic journal platform. Due to publisher security policies, it will open directly in a new tab.
            </p>
            {redirectUrl && (
              <div
                style={{
                  background: '#EDF2F7',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#475569',
                  maxWidth: '480px',
                  margin: '0 auto 1.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {redirectUrl}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={onClose}
                className="btn-ghost"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
              >
                Close
              </button>
              {redirectUrl && (
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-teal"
                  style={{
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                    borderRadius: '12px',
                  }}
                  onClick={onClose}
                >
                  <span>Open Article in New Tab</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

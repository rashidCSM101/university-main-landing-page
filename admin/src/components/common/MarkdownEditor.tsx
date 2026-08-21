import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Minus,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write blog content in markdown format...',
  rows = 8,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('write');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  // Simple, safe Markdown to HTML parser for instant preview
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p style="color:#94a3b8;font-style:italic;">Nothing to preview yet. Start typing on the Write tab.</p>';

    let html = text
      // Escape HTML tags to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.15rem;font-weight:700;color:#0B1E3D;margin-top:1.2rem;margin-bottom:0.5rem;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.35rem;font-weight:800;color:#0B1E3D;margin-top:1.5rem;margin-bottom:0.6rem;border-bottom:1px solid #E2E8F0;padding-bottom:0.3rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:1.6rem;font-weight:900;color:#0B1E3D;margin-top:1.8rem;margin-bottom:0.8rem;">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="font-weight:700;color:#0B1E3D;">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left:3px solid #00C8C8;padding-left:1rem;margin:0.8rem 0;color:#475569;font-style:italic;background:#F8FAFC;padding-top:0.4rem;padding-bottom:0.4rem;border-radius:0 6px 6px 0;">$1</blockquote>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre style="background:#0B1E3D;color:#38BDF8;padding:0.75rem 1rem;border-radius:8px;font-family:monospace;font-size:0.85rem;overflow-x:auto;margin:0.8rem 0;"><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code style="background:#F1F5F9;color:#0B1E3D;padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85rem;font-family:monospace;">$1</code>');

    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li style="margin-left:1.5rem;list-style-type:disc;margin-bottom:0.25rem;">$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li style="margin-left:1.5rem;list-style-type:decimal;margin-bottom:0.25rem;">$1</li>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr style="border:none;border-top:1px solid #E2E8F0;margin:1.2rem 0;" />');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#007A7A;text-decoration:underline;font-weight:600;">$1</a>');

    // Paragraphs / line breaks
    html = html.replace(/\n\n+/g, '</p><p style="margin-bottom:0.8rem;line-height:1.6;color:#334155;">');
    html = html.replace(/\n/g, '<br />');

    return `<p style="margin-bottom:0.8rem;line-height:1.6;color:#334155;">${html}</p>`;
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Editor Header Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          gap: '0.5rem',
        }}
      >
        {/* Formatting Actions */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.2rem' }}>
          <button
            type="button"
            title="Bold (**text**)"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            style={btnStyle}
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            title="Italic (*text*)"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            style={btnStyle}
          >
            <Italic size={15} />
          </button>
          <div style={dividerStyle} />
          <button
            type="button"
            title="Heading 2 (## Title)"
            onClick={() => insertFormatting('## ', '\n', 'Heading 2')}
            style={btnStyle}
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            title="Heading 3 (### Title)"
            onClick={() => insertFormatting('### ', '\n', 'Heading 3')}
            style={btnStyle}
          >
            <Heading3 size={15} />
          </button>
          <div style={dividerStyle} />
          <button
            type="button"
            title="Bullet List (- item)"
            onClick={() => insertFormatting('- ', '\n', 'List item')}
            style={btnStyle}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            title="Numbered List (1. item)"
            onClick={() => insertFormatting('1. ', '\n', 'List item')}
            style={btnStyle}
          >
            <ListOrdered size={15} />
          </button>
          <div style={dividerStyle} />
          <button
            type="button"
            title="Blockquote (> quote)"
            onClick={() => insertFormatting('> ', '\n', 'Quote text')}
            style={btnStyle}
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={() => insertFormatting('```\n', '\n```', 'code block')}
            style={btnStyle}
          >
            <Code size={15} />
          </button>
          <button
            type="button"
            title="Link ([title](url))"
            onClick={() => insertFormatting('[', '](https://example.com)', 'Link Title')}
            style={btnStyle}
          >
            <Link size={15} />
          </button>
          <button
            type="button"
            title="Horizontal Divider"
            onClick={() => insertFormatting('\n---\n')}
            style={btnStyle}
          >
            <Minus size={15} />
          </button>
        </div>

        {/* View Mode Toggle Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: '2px', borderRadius: '8px', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            style={tabBtnStyle(activeTab === 'write')}
          >
            <Edit3 size={13} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={tabBtnStyle(activeTab === 'preview')}
          >
            <Eye size={13} /> Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            style={tabBtnStyle(activeTab === 'split')}
            className="hidden sm:inline-flex"
          >
            <Columns size={13} /> Split
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div
        style={{
          display: activeTab === 'split' ? 'grid' : 'block',
          gridTemplateColumns: activeTab === 'split' ? '1fr 1fr' : undefined,
          minHeight: '220px',
        }}
      >
        {/* Write View */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: '220px',
              padding: '1rem',
              fontFamily: "'Fira Code', Menlo, Consolas, Monaco, monospace",
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: '#0B1E3D',
              background: '#FAFCFF',
              border: 'none',
              borderRight: activeTab === 'split' ? '1px solid #E2E8F0' : 'none',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        )}

        {/* Live Preview View */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            style={{
              padding: '1rem',
              minHeight: '220px',
              maxHeight: activeTab === 'split' ? '400px' : undefined,
              overflowY: 'auto',
              background: '#FFFFFF',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        )}
      </div>

      {/* Status Bar Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.35rem 0.85rem',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          fontSize: '0.75rem',
          color: '#64748B',
        }}
      >
        <span>Markdown supported (headings, bold, lists, links, code)</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#475569',
  padding: '5px 7px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s, color 0.15s',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '16px',
  background: '#CBD5E1',
  margin: '0 4px',
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#FFFFFF' : 'transparent',
  color: active ? '#0B1E3D' : '#64748B',
  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: active ? 700 : 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  transition: 'all 0.15s',
});

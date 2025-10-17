import { useEffect, useRef, useState } from "react";

export default function SearchBar({ value, onChange, onGemini }) {
  const [text, setText] = useState(value || "");
  const timer = useRef(null);

  useEffect(() => setText(value || ""), [value]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange?.(text), 400);
    return () => clearTimeout(timer.current);
  }, [text, onChange]);

  return (
    <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
      <input
        className="form-control form-control-lg rounded-pill shadow-sm"
        placeholder="🔍 Search recipes, e.g. 'chocolate cake', 'pasta'..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s'
        }}
        onFocus={(e) => {
          e.target.style.border = '2px solid #667eea';
          e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.border = '2px solid transparent';
          e.target.style.boxShadow = '';
        }}
      />
      <button 
        className="btn btn-lg px-4 rounded-pill text-white fw-semibold shadow-sm position-relative overflow-hidden"
        type="button" 
        onClick={() => onGemini?.(text)}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          minWidth: '150px',
          transition: 'all 0.3s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <span className="me-2">✨</span>
        AI Generate
      </button>
    </div>
  );
}

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
    <div className="d-flex gap-2">
      <input
        className="form-control form-control-lg"
        placeholder="Search recipes, e.g. 'chicken', 'mexican'…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn btn-outline-primary btn-lg" type="button" onClick={() => onGemini?.(text)}>
        Gemini ✨
      </button>
    </div>
  );
}

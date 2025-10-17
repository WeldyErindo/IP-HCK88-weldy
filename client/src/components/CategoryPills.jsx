export default function CategoryPills({ categories = [], active, onChange }) {
  return (
    <div 
      className="d-flex gap-3 pb-3 mb-3 overflow-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#667eea #f0f0f0',
        msOverflowStyle: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style>
        {`
          .category-pill {
            transition: all 0.3s ease;
            white-space: nowrap;
            flex-shrink: 0;
            font-weight: 500;
            border: 2px solid transparent;
          }
          .category-pill:not(.active):hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            border-color: #667eea;
          }
          .category-pill.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            transform: scale(1.05);
          }
          .category-pill:not(.active) {
            background: white;
            color: #667eea;
            border-color: #e0e0e0;
          }
        `}
      </style>
      
      {categories.map((cat) => {
        const emoji = cat === "All" ? "🍽️" : 
                     cat.toLowerCase().includes("beef") ? "🥩" :
                     cat.toLowerCase().includes("chicken") ? "🍗" :
                     cat.toLowerCase().includes("dessert") ? "🍰" :
                     cat.toLowerCase().includes("lamb") ? "🍖" :
                     cat.toLowerCase().includes("pasta") ? "🍝" :
                     cat.toLowerCase().includes("pork") ? "🥓" :
                     cat.toLowerCase().includes("seafood") ? "🦐" :
                     cat.toLowerCase().includes("vegetarian") ? "🥗" :
                     cat.toLowerCase().includes("breakfast") ? "🍳" :
                     cat.toLowerCase().includes("side") ? "🥙" :
                     cat.toLowerCase().includes("starter") ? "🥗" :
                     cat.toLowerCase().includes("vegan") ? "🌱" :
                     cat.toLowerCase().includes("goat") ? "🐐" : "🍴";
        
        return (
          <button
            key={cat}
            type="button"
            className={`btn btn-lg rounded-pill px-4 py-2 category-pill ${active === cat ? "active" : ""}`}
            onClick={() => onChange?.(cat)}
          >
            <span className="me-2">{emoji}</span>
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
}

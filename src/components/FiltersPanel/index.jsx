// src/components/FiltersPanel/index.jsx
import React from "react";

export default function FiltersPanel({
  configFilters = [],
  activeFilters = {},
  onToggle,
  onReset,
  onApply,
}) {
  return (
    <div
      role="dialog"
      aria-label="Filtres produits"
      style={{
        border: "1px solid #E6E6E6",
        borderRadius: 12,
        padding: 16,
        margin: "12px 0 8px",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {Array.isArray(configFilters) &&
          configFilters.map((group) => (
            <div key={group.category}>
              <h4 style={{ margin: "0 0 8px", fontSize: 16 }}>
                {group.category}
              </h4>
              <div style={{ display: "grid", gap: 6 }}>
                {group.items.map((it) => {
                  const checked = (activeFilters[group.category] || []).includes(
                    it.name
                  );
                  const inputId = `${group.category}-${it.name}`
                    .replace(/\s+/g, "-")
                    .toLowerCase();
                  return (
                    <label
                      key={it.name}
                      htmlFor={inputId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(group.category, it.name)}
                      />
                      <span>{it.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#f7f7f7",
            cursor: "pointer",
          }}
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={onApply}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #b59f66",
            background: "#b59f66",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
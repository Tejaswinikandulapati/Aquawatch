import React, { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import PondCard from "../components/cards/PondCard";
import PondDetailModal from "../components/modal/PondDetailModal";
import { useAqua } from "../context/AquaDataContext";
import { latestByPond, healthStatus } from "../utils/derive";

const FILTERS = ["All", "Healthy", "Watch", "Critical"];

export default function Ponds() {
  const { ponds, readings, simulateReading } = useAqua();
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const byPond = latestByPond(readings);

  const list = useMemo(() => {
    return ponds.filter((p) => {
      const matchQ = `${p.name} ${p.species} ${p.location}`.toLowerCase().includes(q.toLowerCase());
      if (!matchQ) return false;
      if (filter === "All") return true;
      const h = healthStatus(byPond[p.id]);
      if (filter === "Healthy") return h.level === "ok";
      if (filter === "Critical") return h.level === "crit";
      if (filter === "Watch") return h.level === "warn";
      return true;
    });
  }, [ponds, byPond, q, filter]);

  return (
    <>
      <PageHeader title="Ponds" desc={`${ponds.length} ponds under management`} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <div className="search" style={{ maxWidth: 320, margin: 0 }}>
          <FiSearch />
          <input placeholder="Search ponds…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "btn btn-sm" : "btn btn-ghost btn-sm"}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty">No ponds match your filters.</p>
      ) : (
        <div className="pond-grid">
          {list.map((pond, i) => (
            <PondCard
              key={pond.id} pond={pond} reading={byPond[pond.id]} index={i}
              onView={setSelected} onSimulate={simulateReading}
            />
          ))}
        </div>
      )}

      <PondDetailModal pond={selected} readings={readings} onClose={() => setSelected(null)} onSimulate={simulateReading} />
    </>
  );
}

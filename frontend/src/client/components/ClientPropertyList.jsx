import React, { useContext, useMemo } from "react";
import CardDesign from "./CardDesign";
import { clientContext } from "../context/ClientContext";

const ClientPropertyList = ({ clientID }) => {
  const { hotSales, stayToBuy, stayToRent, lands, loading } = useContext(clientContext);
  const resolvedClientId = clientID || localStorage.getItem("clientId") || "";

  const properties = useMemo(() => {
    if (!resolvedClientId) return [];

    const merged = [
      ...hotSales.map((item) => ({ ...item, _categoryLabel: "Hot Sales" })),
      ...stayToBuy.map((item) => ({ ...item, _categoryLabel: "Stay To Buy" })),
      ...stayToRent.map((item) => ({ ...item, _categoryLabel: "Stay To Rent" })),
      ...lands.map((item) => ({ ...item, _categoryLabel: "Lands" })),
    ];

    return merged
      .filter((item) => Number(item.client_id) === Number(resolvedClientId))
      .sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at || 0).getTime();
        const bDate = new Date(b.updated_at || b.created_at || 0).getTime();
        return bDate - aDate;
      });
  }, [hotSales, stayToBuy, stayToRent, lands, resolvedClientId]);

  if (!resolvedClientId) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Your Properties</h2>
          <p className="text-sm text-slate-500">Properties added by this client, sorted by most recent update.</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {properties.length} properties
        </span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          No properties found for this client.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((item) => (
            <CardDesign
              key={`property-${item.id}-${item._categoryLabel}`}
              title={item.title}
              main_image={item.main_image || item.image || ""}
              property_type={item.property_type || item._categoryLabel}
              location={item.location || item.city || "Unknown"}
              price={item.price}
              rate={item.rate}
              duration={item.duration || item.duration || "month"}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ClientPropertyList;

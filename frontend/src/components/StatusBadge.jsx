import React from "react";

export default function StatusBadge({ status, text }) {
  const display = text || status;
  const normalized = (status || "").toLowerCase();

  let className = "badge badge-neutral";
  if (normalized === "active" || normalized === "online" || normalized === "available") {
    className = "badge badge-success";
  } else if (normalized === "completed") {
    className = "badge badge-primary";
  } else if (normalized === "dropped" || normalized === "full" || normalized === "offline") {
    className = "badge badge-danger";
  } else if (normalized === "admin") {
    className = "badge badge-warning";
  } else if (normalized === "student") {
    className = "badge badge-info";
  }

  return <span className={className}>{display}</span>;
}

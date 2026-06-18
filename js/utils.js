const AppUtils = {
  $(sel, root = document) {
    return root.querySelector(sel);
  },

  esc(value) {
    return (value ?? "")
      .toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  getGradeClass(grade) {
    if (!grade) return "";
    const g = grade.toString().toLowerCase();
    if (g.includes("отл") || g.includes("5")) return "excellent";
    if (g.includes("хор") || g.includes("4")) return "good";
    if (g.includes("удовл") || g.includes("3")) return "satisfactory";
    if (g.includes("неуд") || g.includes("2")) return "fail";
    if (g.includes("зачет")) return "excellent";
    return "";
  },

  getIcon(gender) {
    const path =
      gender === "m"
        ? "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        : "M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z";
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg viewBox="0 0 24 24" fill="%2364748b" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`)}`;
  },

  initials(name) {
    const parts = name.split(" ");
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`;
  },
};

window.AppUtils = AppUtils;

const AppApi = {
  async request(path, options = {}) {
    const sep = path.includes("?") ? "&" : "?";
    const res = await fetch(`${path}${sep}_=${Date.now()}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Ошибка ${res.status}`);
    }
    return res.json();
  },

  getStudents() {
    return this.request("/api/students");
  },

  getStudent(id) {
    return this.request(`/api/students/${id}`);
  },

  getMeta() {
    return this.request("/api/meta");
  },

  getStatus() {
    return this.request("/api/status");
  },
};

window.AppApi = AppApi;

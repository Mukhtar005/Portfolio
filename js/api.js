const AppApi = {
  async fetch(path, options = {}) {
    const sep = path.includes("?") ? "&" : "?";
    const res = await fetch(`${path}${sep}_=${Date.now()}`, {
      cache: "no-store",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    return res;
  },

  async request(path, options = {}) {
    const res = await this.fetch(path, options);
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

  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
};

window.AppApi = AppApi;

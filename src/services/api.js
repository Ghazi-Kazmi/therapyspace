const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Mood API
export const moodAPI = {
  getAll: () => apiRequest('/mood'),
  create: (moodData) => apiRequest('/mood', { method: 'POST', body: moodData }),
  getById: (id) => apiRequest(`/mood/${id}`),
  delete: (id) => apiRequest(`/mood/${id}`, { method: 'DELETE' }),
};

// Journal API
export const journalAPI = {
  getAll: () => apiRequest('/journal'),
  create: (entryData) => apiRequest('/journal', { method: 'POST', body: entryData }),
  getById: (id) => apiRequest(`/journal/${id}`),
  update: (id, entryData) => apiRequest(`/journal/${id}`, { method: 'PUT', body: entryData }),
  delete: (id) => apiRequest(`/journal/${id}`, { method: 'DELETE' }),
};

// Gratitude API
export const gratitudeAPI = {
  getAll: () => apiRequest('/gratitude'),
  create: (entryData) => apiRequest('/gratitude', { method: 'POST', body: entryData }),
  getById: (id) => apiRequest(`/gratitude/${id}`),
  delete: (id) => apiRequest(`/gratitude/${id}`, { method: 'DELETE' }),
};

// Chat API
export const chatAPI = {
  getAll: () => apiRequest('/chat'),
  create: (messageData) => apiRequest('/chat', { method: 'POST', body: messageData }),
  delete: (id) => apiRequest(`/chat/${id}`, { method: 'DELETE' }),
  clear: () => apiRequest('/chat', { method: 'DELETE' }),
};

// Emotion API
export const emotionAPI = {
  getAll: () => apiRequest('/emotions'),
  create: (emotionData) => apiRequest('/emotions', { method: 'POST', body: emotionData }),
  getById: (id) => apiRequest(`/emotions/${id}`),
  delete: (id) => apiRequest(`/emotions/${id}`, { method: 'DELETE' }),
};

// Reminder API
export const reminderAPI = {
  getAll: () => apiRequest('/reminders'),
  create: (reminderData) => apiRequest('/reminders', { method: 'POST', body: reminderData }),
  update: (id, reminderData) => apiRequest(`/reminders/${id}`, { method: 'PUT', body: reminderData }),
  toggle: (id) => apiRequest(`/reminders/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => apiRequest(`/reminders/${id}`, { method: 'DELETE' }),
};

// Meditation API
export const meditationAPI = {
  getAll: () => apiRequest('/meditation'),
  create: (sessionData) => apiRequest('/meditation', { method: 'POST', body: sessionData }),
};

// Preferences API
export const preferencesAPI = {
  get: () => apiRequest('/preferences'),
  update: (preferences) => apiRequest('/preferences', { method: 'PUT', body: preferences }),
};

// Analytics API
export const analyticsAPI = {
  getProgress: () => apiRequest('/analytics'),
  getStreak: () => apiRequest('/analytics/streak'),
  getMoodStats: () => apiRequest('/analytics/mood-stats'),
};

// AI API (Gemini-powered)
export const aiAPI = {
  getQuote: () => apiRequest('/ai/quote'),
  getAffirmation: () => apiRequest('/ai/affirmation'),
};

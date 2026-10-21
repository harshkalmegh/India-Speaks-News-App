const STORAGE_KEY = 'india-speaks:preferred-topics';

export const readPreferredTopics = allowedPaths => {
  try {
    const topics = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(topics)
      ? [...new Set(topics.filter(topic => allowedPaths.has(topic)))]
      : [];
  } catch (error) {
    console.error('Could not read preferred topics:', error);
    return [];
  }
};

export const writePreferredTopics = topics => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  window.dispatchEvent(new Event('india-speaks:preferred-topics-change'));
};

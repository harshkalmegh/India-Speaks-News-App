const STORAGE_KEY = 'india-speaks:saved-stories';

export const getSafeHttpUrl = value => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
};

export const readSavedStories = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter(story => story && typeof story.title === 'string' && getSafeHttpUrl(story.newsUrl))
      : [];
  } catch (error) {
    console.error('Could not read saved stories:', error);
    return [];
  }
};

export const writeSavedStories = stories => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  window.dispatchEvent(new Event('india-speaks:saved-stories-change'));
};

export const createStoryPath = story => {
  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(story)) {
    if (typeof value === 'string' && value) parameters.set(key, value.slice(0, key === 'description' ? 500 : 200));
  }
  return `/story?${parameters.toString()}`;
};

export const storyFromSearchParams = parameters => ({
  title: parameters.get('title') || '',
  description: parameters.get('description') || '',
  imageUrl: getSafeHttpUrl(parameters.get('imageUrl')),
  newsUrl: getSafeHttpUrl(parameters.get('newsUrl')),
  author: parameters.get('author') || '',
  date: parameters.get('date') || '',
  source: parameters.get('source') || '',
});

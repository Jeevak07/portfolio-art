import { API_URL } from '../config/env';

const API_BASE = API_URL || 'http://localhost:8000';

export async function getWorks(signal) {
  const response = await fetch(`${API_BASE}/api/works`, { signal });
  if (!response.ok) {
    throw new Error('Failed to load works');
  }
  return response.json();
}

export async function verifyAdmin(adminKey) {
  const response = await fetch(`${API_BASE}/api/admin/verify`, {
    headers: { 'X-Admin-Key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Unauthorized');
  }
  return response.json();
}

export async function uploadWork(formData, adminKey) {
  const response = await fetch(`${API_BASE}/api/works`, {
    method: 'POST',
    body: formData,
    headers: { 'X-Admin-Key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  return response.json();
}

export async function deleteWork(workId, adminKey) {
  const response = await fetch(`${API_BASE}/api/works/${workId}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': adminKey },
  });
  if (!response.ok) {
    throw new Error('Delete failed');
  }
  return response.json();
}

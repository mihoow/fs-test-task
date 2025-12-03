export async function getRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { method: 'GET', ...init });

  if (!res.ok) {
    const isJSON = !!res.headers.get('content-type')?.includes('application/json');

    if (isJSON) {
      const errorData = await res.json();
      throw new Error(`${res.status}: ${errorData.message}`);
    }

    throw new Error(`Request failed with status code: ${res.status}`);
  }

  return res.json();
}

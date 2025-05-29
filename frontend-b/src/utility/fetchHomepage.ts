export async function fetchHomepage() {
  const url = typeof window !== 'undefined' ? 'http://localhost:9090/homepage' : 'http://api:3000/homepage';
  const res = await fetch(url);

  return res.json();
}
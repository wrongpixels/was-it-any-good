// TMDB Trending API test with Node.js (no TypeScript)

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YjQyMjdmZmM0YTdmZGI1NmQ1MGE4Yjg4MzUzMjNiYyIsIm5iZiI6MTc0ODI3MjkzNi4xNzQsInN1YiI6IjY4MzQ4NzI4OTU4ODI2ZDNiMTQxNDY2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-Afevq-Bw6safixhyqetwcxUF2Kv0rNeQSkwTFLct-M";

async function getTrending() {
  const url = "https://api.themoviedb.org/3/trending/all/week?&page=2";

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ HTTP Error:", response.status, response.statusText);
      console.error(text);
      return;
    }

    const data = await response.json();
    console.log("✅ Trending results:");
    for (const item of data.results || []) {
      console.log(
        `${item.media_type?.toUpperCase() || "UNKNOWN"}: ${item.title || item.name}`
      );
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

getTrending();

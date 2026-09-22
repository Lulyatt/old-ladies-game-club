export async function getSteamGame(appId) {
    if (!appId) return null;

    const DAY_IN_SECONDS = 86400;
  
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
      { next: { revalidate: DAY_IN_SECONDS } }
    );
  
    if (!res.ok) return null;
  
    const json = await res.json();
    const entry = json[String(appId)];
  
    if (!entry?.success) return null;
  
    return entry.data;
  }
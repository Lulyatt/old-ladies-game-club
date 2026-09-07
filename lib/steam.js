export async function getSteamGame(appId) {
    if (!appId) return null;
  
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
      { next: { revalidate: 86400 } } // cache 24h — Steam doesn't love hammering
    );
  
    if (!res.ok) return null;
  
    const json = await res.json();
    const entry = json[String(appId)];
  
    if (!entry?.success) return null;
  
    return entry.data;
  }
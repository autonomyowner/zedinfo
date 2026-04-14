import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://tidy-rabbit-678.eu-west-1.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

async function downloadImage(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": url.includes("unitech-dz.com") ? "https://unitech-dz.com/" : "https://wifidjelfa.com/",
    },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.blob();
}

async function uploadToConvex(blob) {
  const uploadUrl = await client.mutation(api.storage.generateUploadUrl);
  const r = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": blob.type },
    body: blob,
  });
  if (!r.ok) throw new Error(`Upload failed: ${r.status}`);
  const { storageId } = await r.json();
  return storageId;
}

async function main() {
  const products = await client.query(api.products.list, {});
  console.log(`Found ${products.length} products`);

  // Collect unique external URLs
  const urlToStorageUrl = new Map();
  const externalUrls = new Set();
  for (const p of products) {
    for (const img of p.images) {
      if (img && !img.includes("convex.cloud") && !img.includes("convex.site") && !img.includes("placeholder")) {
        externalUrls.add(img);
      }
    }
  }
  console.log(`${externalUrls.size} unique external images to upload`);

  // Download and upload each
  let i = 0;
  for (const url of externalUrls) {
    i++;
    try {
      process.stdout.write(`[${i}/${externalUrls.size}] ${url.split("/").pop()} ... `);
      const blob = await downloadImage(url);
      const storageId = await uploadToConvex(blob);
      // Get the public URL
      const storedUrl = await client.query(api.storage.getUrl, { storageId });
      urlToStorageUrl.set(url, storedUrl);
      console.log(`OK (${Math.round(blob.size/1024)}KB)`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  console.log(`\nUploaded ${urlToStorageUrl.size} images. Updating products...`);

  // Update products with new URLs
  let updated = 0;
  for (const p of products) {
    const newImages = p.images.map(img => urlToStorageUrl.get(img) || img);
    const changed = newImages.some((img, idx) => img !== p.images[idx]);
    if (changed) {
      await client.mutation(api.products.update, { id: p._id, patch: { images: newImages } });
      updated++;
    }
  }
  console.log(`Updated ${updated} products. Done!`);
}

main().catch(console.error);

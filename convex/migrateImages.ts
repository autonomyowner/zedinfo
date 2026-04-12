"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Downloads all external product images and stores them in Convex file storage.
 * Run: npx convex run migrateImages:default
 */
export default action({
  args: {},
  handler: async (ctx) => {
    const products: any[] = await ctx.runQuery(api.products.list, {});
    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of products) {
      const newImages: string[] = [];
      let changed = false;

      for (const imgUrl of product.images) {
        // Skip if already a Convex storage URL or placeholder
        if (
          !imgUrl ||
          imgUrl.includes("convex.cloud") ||
          imgUrl.includes("placeholder")
        ) {
          newImages.push(imgUrl);
          continue;
        }

        try {
          // Download the image
          const response = await fetch(imgUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Referer: "https://wifidjelfa.com/",
            },
          });

          if (!response.ok) {
            console.log(`Failed to fetch ${imgUrl}: ${response.status}`);
            newImages.push(imgUrl);
            failed++;
            continue;
          }

          const contentType =
            response.headers.get("content-type") || "image/jpeg";
          const blob = await response.blob();

          // Store in Convex
          const storageId = await ctx.storage.store(blob);
          const storedUrl = await ctx.storage.getUrl(storageId);

          if (storedUrl) {
            newImages.push(storedUrl);
            changed = true;
          } else {
            newImages.push(imgUrl);
            failed++;
          }
        } catch (e) {
          console.log(`Error processing ${imgUrl}:`, e);
          newImages.push(imgUrl);
          failed++;
        }
      }

      if (changed) {
        await ctx.runMutation(api.products.update, {
          id: product._id,
          patch: { images: newImages },
        });
        migrated++;
      } else {
        skipped++;
      }
    }

    return { migrated, skipped, failed, total: products.length };
  },
});

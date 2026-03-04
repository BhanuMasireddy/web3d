import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";

const userIdParamSchema = z.object({
  userId: z.string().regex(/^\d+$/, "Invalid user id"),
});

export function registerShareRoutes() {
  const router = Router();

  router.get("/:userId", async (req, res) => {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const bookmarks = await storage.getBookmarks(userId);

      const sharedBookmarks = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        category: bookmark.category,
        position: {
          x: bookmark.x ?? 0,
          y: bookmark.y ?? 0,
          z: bookmark.z ?? 0,
        },
      }));

      return res.json(sharedBookmarks);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid share request" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}

import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Search } from "lucide-react";
import Scene, { type SceneBookmark } from "@/components/Scene";
import { useSharedBookmarks } from "@/hooks/use-bookmarks";

export default function ShareSpace() {
  const [matched, params] = useRoute("/share/:userId");
  const userId = matched ? params.userId : undefined;
  const { data, isLoading, error } = useSharedBookmarks(userId);
  const [search, setSearch] = useState("");

  const bookmarks: SceneBookmark[] = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    category: item.category,
    x: item.position.x,
    y: item.position.y,
    z: item.position.z,
    scale: 1,
    pinned: false,
  }));
  const filteredBookmarks = useMemo(
    () =>
      bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [bookmarks, search],
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-cyan-100">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-red-300 p-4 text-center">
        <h2 className="text-2xl font-semibold">Unable to load shared space</h2>
        <p className="mt-2 text-sm text-red-200/80">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Scene
          bookmarks={filteredBookmarks}
          viewOnly
          onLayoutSave={undefined}
        />
      </div>

      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card holo-panel rounded-2xl px-3 py-3 md:px-4 md:py-4 pointer-events-auto">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[150px]">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-cyan-50 tracking-tighter drop-shadow-lg">
                  Web<span className="text-primary">3D</span>
                </h1>
                <p className="text-cyan-100/70 text-xs md:text-sm font-light">
                  Spatial Bookmark Manager
                </p>
              </div>

              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyan-100/60" />
                <Input
                  placeholder="Search bookmarks..."
                  className="pl-9 bg-cyan-950/20 border-cyan-200/20 text-cyan-50 placeholder:text-cyan-100/40"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button variant="glass" className="gap-2 px-3" disabled>
                <Eye className="h-4 w-4" />
                Read-only
              </Button>
              <Button variant="glass" className="px-3" disabled>
                Visible Items ({filteredBookmarks.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-right pointer-events-none hidden md:block">
        <div className="holo-instruction px-4 py-2 rounded-full text-xs text-cyan-100/75 font-mono">
          Shared View | Rotate + Zoom Enabled | Editing Disabled
        </div>
      </div>
    </div>
  );
}

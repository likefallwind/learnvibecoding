import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Wand2, UploadCloud, Loader2, Download, Copy } from "lucide-react";

const stylePresets = {
  Minimalist: {
    mood: "clean, airy",
    palette: "soft neutrals",
    voice: "calm, premium",
    accents: ["Matte finish", "Quiet elegance", "Thoughtful details"],
  },
  Cyberpunk: {
    mood: "neon, high-tech",
    palette: "electric gradients",
    voice: "bold, futuristic",
    accents: ["Pulse lighting", "Hyper-detailed edges", "Next-gen texture"],
  },
  Festive: {
    mood: "warm, joyful",
    palette: "vibrant pops",
    voice: "cheerful, inviting",
    accents: ["Celebration-ready", "Giftable charm", "Seasonal sparkle"],
  },
};

const buildBullets = (sellingPoints, styleKey, index) => {
  const preset = stylePresets[styleKey] || stylePresets.Minimalist;
  const rawPoints = sellingPoints
    .split(/[\n,]+/)
    .map((point) => point.trim())
    .filter(Boolean);
  const seeded = [
    `${preset.accents[(index + 0) % preset.accents.length]}`,
    `${preset.mood} presentation with ${preset.palette}`,
    `Voice feels ${preset.voice} and ready to ship`,
  ];
  const combined = [...rawPoints, ...seeded].filter(Boolean);
  return combined.slice(0, 3);
};

const buildTitle = (name, styleKey, index) => {
  const preset = stylePresets[styleKey] || stylePresets.Minimalist;
  const variations = [
    `${name} — ${preset.voice} hero shot`,
    `${name} with ${preset.palette}`,
    `${name} in a ${preset.mood} scene`,
    `${name}: studio-ready angle`,
  ];
  return variations[index % variations.length];
};

const buildSubtitle = (name, styleKey) => {
  const preset = stylePresets[styleKey] || stylePresets.Minimalist;
  return `AI-styled to feel ${preset.voice}, polished, and conversion-ready.`;
};

export default function App() {
  const [productName, setProductName] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [style, setStyle] = useState("Minimalist");
  const [previewUrl, setPreviewUrl] = useState("");
  const [assets, setAssets] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef(null);

  const displayName = useMemo(
    () => (productName.trim() ? productName.trim() : "Your Product"),
    [productName]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleGenerate = () => {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);
    setAssets([]);
    timeoutRef.current = setTimeout(() => {
      const nextAssets = Array.from({ length: 4 }, (_, index) => {
        const bullets = buildBullets(sellingPoints, style, index);
        return {
          id: `${style}-${index}-${Date.now()}`,
          title: buildTitle(displayName, style, index),
          subtitle: buildSubtitle(displayName, style),
          bullets,
          overlay: displayName,
        };
      });
      setAssets(nextAssets);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-100 font-sans text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-[380px] shrink-0 border-r border-slate-200 bg-white">
          <div className="flex h-full flex-col gap-8 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">AI E-com Studio</p>
                <p className="text-sm text-slate-500">Generate product visuals + copy</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Image Upload</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-slate-400">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-40 w-40 rounded-xl object-cover shadow-md"
                  />
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="Minimal Ceramic Mug"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Selling Points</label>
                <textarea
                  value={sellingPoints}
                  onChange={(event) => setSellingPoints(event.target.value)}
                  placeholder="Hand-finished glaze, Dishwasher safe, 350ml capacity"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Style</label>
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  {Object.keys(stylePresets).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-sm font-semibold text-white shadow-xl transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating assets...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Marketing Assets
                </>
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-100">
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-10 py-10">
            {isGenerating ? (
              <div className="flex flex-1 items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  <p className="text-sm font-medium text-slate-700">
                    Generating {style.toLowerCase()} visuals for {displayName}
                  </p>
                </motion.div>
              </div>
            ) : assets.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white/70 px-12 py-16 text-center shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      Your AI creations will appear here
                    </p>
                    <p className="text-sm text-slate-500">
                      Upload a product shot and generate styled assets.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                layout
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 },
                  },
                }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg"
                  >
                    <div className="relative aspect-square w-full">
                      <img
                        src="https://placehold.co/800x800"
                        alt={asset.overlay}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <p className="text-lg font-semibold text-white">{asset.overlay}</p>
                        <p className="text-xs text-slate-200">{style} concept</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                          Generated Copy
                        </p>
                        <p className="text-base font-semibold text-slate-900">{asset.title}</p>
                        <p className="text-sm text-slate-500">{asset.subtitle}</p>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {asset.bullets.map((bullet, index) => (
                          <li key={`${asset.id}-${index}`} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-center gap-3">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                        >
                          <Download className="h-4 w-4" />
                          Download Image
                        </button>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Text
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

import { pipeline, env } from "@huggingface/transformers";
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
let extractor;
let vectors;
self.onmessage = async ({ data }) => {
  const { job, query, corpus } = data;
  try {
    if (!extractor)
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        {
          dtype: "q8",
          device: "wasm",
          progress_callback: (p) => {
            if (p.status === "progress")
              self.postMessage({
                job,
                type: "progress",
                text: "Loading the small AI model",
                progress: Math.round(p.progress || 0),
              });
          },
        },
      );
    self.postMessage({
      job,
      type: "progress",
      text: vectors
        ? "Matching your mood to local places"
        : "Learning the neighbourhood guide",
      progress: null,
    });
    if (!vectors) {
      vectors = [];
      for (const item of corpus) {
        const v = await extractor(item.text, {
          pooling: "mean",
          normalize: true,
        });
        vectors.push({ id: item.id, vector: Array.from(v.data) });
      }
    }
    const result = await extractor(query, { pooling: "mean", normalize: true });
    const q = Array.from(result.data);
    const scores = Object.fromEntries(
      vectors.map((v) => [
        v.id,
        v.vector.reduce((sum, x, i) => sum + x * q[i], 0),
      ]),
    );
    self.postMessage({ job, type: "result", scores });
  } catch {
    extractor = null;
    vectors = null;
    self.postMessage({ job, type: "error" });
  }
};

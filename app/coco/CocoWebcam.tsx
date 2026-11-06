"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

// shadcn (عدّل المسارات حسب مشروعك)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type Prediction = {
  bbox: [number, number, number, number]; // [x,y,w,h]
  class: string;
  score: number;
};

type CocoModel = {
  detect: (
    input: HTMLVideoElement,
    maxNumBoxes?: number,
    minScore?: number
  ) => Promise<Prediction[]>;
};

type DetectorState = "idle" | "loading-model" | "ready" | "running" | "error";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Unknown error";
}

export default function CocoWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<CocoModel | null>(null);

  const [state, setState] = useState<DetectorState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [minScore, setMinScore] = useState(0.5); // 0..1
  const [maxBoxes, setMaxBoxes] = useState(20);

  const [preds, setPreds] = useState<Prediction[]>([]);
  const [fps, setFps] = useState<number>(0);

  // ✅ تجميد الإطار
  const [isFrozen, setIsFrozen] = useState(false);

  const lastTsRef = useRef<number>(0);
  const fpsSmootherRef = useRef<number>(0);

  const statusText = useMemo(() => {
    if (state === "idle") return "Idle";
    if (state === "loading-model") return "Loading model...";
    if (state === "ready") return "Ready";
    if (state === "running") return isFrozen ? "Frozen" : "Running";
    if (state === "error") return "Error";
    return state;
  }, [state, isFrozen]);

  // تحميل الموديل مرة واحدة
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setState("loading-model");
        setError(null);

        const tf = await import("@tensorflow/tfjs");
        const cocoSsd = await import("@tensorflow-models/coco-ssd");

        await tf.ready();

        const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });

        if (cancelled) return;
        modelRef.current = model as unknown as CocoModel;
        setState("ready");
      } catch (e: unknown) {
        setState("error");
        setError(getErrorMessage(e) || "Failed to load model.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stopLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const stopCamera = () => {
    stopLoop();

    const s = streamRef.current;
    if (s) {
      for (const t of s.getTracks()) t.stop();
    }
    streamRef.current = null;

    const v = videoRef.current;
    if (v) v.srcObject = null;

    setPreds([]);
    setFps(0);
    setIsFrozen(false);
  };

  const setupCanvasSize = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    canvas.width = w;
    canvas.height = h;
  };

  const draw = (predictions: Prediction[]) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ لو frozen: سنبقي آخر رسم موجود كما هو (لا نعيد رسم الفيديو)
    // لذلك draw() تُستدعى فقط عندما لسنا frozen أو عند عمل freeze مرة واحدة.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.font = "16px sans-serif";

    for (const p of predictions) {
      const [x, y, w, h] = p.bbox;
      ctx.strokeRect(x, y, w, h);

      const label = `${p.class} ${(p.score * 100).toFixed(1)}%`;
      const tx = x;
      const ty = clamp(y - 6, 18, canvas.height - 6);
      ctx.fillText(label, tx, ty);
    }
  };

  const detectFrame = async () => {
    const model = modelRef.current;
    const video = videoRef.current;

    if (!model || !video) return;

    // ✅ لو Frozen: لا نكمل loop
    if (isFrozen) return;

    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    // FPS (تقريبي) مع تنعيم
    const now = performance.now();
    const dt = now - (lastTsRef.current || now);
    lastTsRef.current = now;

    const instFps = dt > 0 ? 1000 / dt : 0;
    fpsSmootherRef.current = fpsSmootherRef.current * 0.9 + instFps * 0.1;
    setFps(Math.round(fpsSmootherRef.current));

    try {
      const predictions: Prediction[] = await model.detect(
        video,
        maxBoxes,
        minScore
      );

      setPreds(predictions);
      draw(predictions);
    } catch (e: unknown) {
      setState("error");
      setError(getErrorMessage(e) || "Detection failed.");
      stopCamera();
      return;
    }

    rafRef.current = requestAnimationFrame(detectFrame);
  };

  const start = async () => {
    try {
      if (!modelRef.current) {
        setError("Model not ready yet.");
        return;
      }

      setError(null);

      // لو فيه Stream قديم أوقفه
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: useFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;

      await video.play();

      setupCanvasSize();

      setIsFrozen(false);
      setState("running");
      rafRef.current = requestAnimationFrame(detectFrame);
    } catch (e: unknown) {
      setState("error");
      setError(
        getErrorMessage(e) ||
          "Camera start failed. Check permission and HTTPS (or localhost)."
      );
    }
  };

  const stop = () => {
    setState("ready");
    setError(null);
    stopCamera();
  };

  // ✅ Freeze: يوقف loop ويثبت آخر frame على canvas
  const freeze = async () => {
    if (state !== "running" || isFrozen) return;

    const model = modelRef.current;
    const video = videoRef.current;
    if (!model || !video) return;

    try {
      // أوقف loop أولاً
      stopLoop();

      // خذ قراءة واحدة نهائية ثم ارسمها
      const predictions: Prediction[] = await model.detect(
        video,
        maxBoxes,
        minScore
      );
      setPreds(predictions);
      draw(predictions);

      setIsFrozen(true);
      setFps(0);
    } catch (e: unknown) {
      setState("error");
      setError(getErrorMessage(e) || "Freeze failed.");
    }
  };

  // ✅ Resume: يرجّع loop
  const resume = () => {
    if (state !== "running" || !isFrozen) return;

    setIsFrozen(false);
    lastTsRef.current = 0;
    fpsSmootherRef.current = 0;
    rafRef.current = requestAnimationFrame(detectFrame);
  };

  // ✅ Save snapshot: يحفظ canvas كصورة PNG
  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");

    const ts = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .replace("Z", "");

    a.href = dataUrl;
    a.download = `coco_snapshot_${ts}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // تنظيف عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // لو المستخدم غيّر نوع الكاميرا أثناء التشغيل: أعد التشغيل تلقائيًا
  useEffect(() => {
    if (state === "running") {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useFrontCamera]);

  const canStart = state === "ready" || state === "running";
  const isRunning = state === "running";

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>تعلم</CardTitle>

          <Link
            href="/content"
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded w-fit"
          >
            <FaArrowLeft />
            <span>العودة للمحتوى</span>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={start} disabled={!canStart || isRunning}>
              Start
            </Button>

            <Button onClick={stop} disabled={!isRunning} variant="secondary">
              Stop
            </Button>

            {/* ✅ Freeze / Resume */}
            <Button
              onClick={freeze}
              disabled={!isRunning || isFrozen}
              variant="outline"
            >
              Freeze
            </Button>
            <Button
              onClick={resume}
              disabled={!isRunning || !isFrozen}
              variant="outline"
            >
              Resume
            </Button>

            {/* ✅ Save snapshot */}
            <Button
              onClick={saveSnapshot}
              disabled={!isRunning && preds.length === 0}
              variant="default"
            >
              Save snapshot
            </Button>

            <div className="ml-auto text-sm">
              Status: <span className="font-medium">{statusText}</span>{" "}
              {isRunning && !isFrozen && (
                <>
                  — FPS: <span className="font-medium">{fps}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={useFrontCamera}
                onCheckedChange={setUseFrontCamera}
                disabled={state === "loading-model"}
              />
              <Label>Front camera</Label>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto md:min-w-90">
              <Label className="min-w-90">Min score</Label>
              <Slider
                value={[Math.round(minScore * 100)]}
                onValueChange={(v) => setMinScore(v[0] / 100)}
                min={10}
                max={90}
                step={5}
                disabled={state === "loading-model" || isFrozen}
              />
              <div className="w-14 text-sm text-right">
                {(minScore * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto md:min-w-90">
              <Label className="min-w-90">Max boxes</Label>
              <Slider
                value={[maxBoxes]}
                onValueChange={(v) => setMaxBoxes(v[0])}
                min={1}
                max={50}
                step={1}
                disabled={state === "loading-model" || isFrozen}
              />
              <div className="w-14 text-sm text-right">{maxBoxes}</div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
              <div className="text-xs text-muted-foreground mt-1">
                ملاحظة: الكاميرا تحتاج HTTPS أو localhost للسماح بالوصول.
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 items-start">
            <div className="space-y-2">
              <video ref={videoRef} className="hidden" playsInline muted />

              <canvas ref={canvasRef} className="w-full border rounded-lg" />

              <div className="text-xs text-muted-foreground">
                يتم الرسم على Canvas لتضمين مربعات الكشف والنصوص. عند Freeze يتم
                تثبيت آخر إطار.
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Top detections</div>
              <div className="text-sm text-muted-foreground">
                يعرض آخر نتيجة (مرتبة حسب الثقة).
              </div>

              <ul className="text-sm space-y-1">
                {preds
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 12)
                  .map((p, i) => (
                    <li key={`${p.class}-${i}`} className="flex justify-between">
                      <span>{p.class}</span>
                      <span>{(p.score * 100).toFixed(1)}%</span>
                    </li>
                  ))}

                {preds.length === 0 && (
                  <li className="text-muted-foreground">
                    لا توجد نتائج بعد. اضغط Start ووجّه الكاميرا نحو شيء واضح.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import 'dotenv/config';
import dns from 'node:dns';
import express, { NextFunction, Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const SYSTEM_INSTRUCTION = `You are Mini Meadow Customer Care, a warm, grounded, and concise botanical apothecary specialist for Mini Meadow ("Small Products. Big Changes. A Greener Tomorrow.", Marketed by Mini Meadow, Hinjawadi Phase 3, Pune - 411057).

STRICT GUIDELINES:
- Answer only about Mini Meadow products, ingredients, perfume layering, usage rituals, zero-plastic packaging, INR pricing, India shipping, and order policies.
- Never fabricate customer reviews, clinical/medical cure claims, or batch codes not listed below.
- If asked something outside Mini Meadow customer care, politely steer back to our products and orders.
- Keep responses clear, helpful, and concise (under 110 words unless a full comparison is requested). Do not output raw HTML or markdown code blocks.

MINI MEADOW CATALOG & FACTS:
1. Herbal Shampoo Bar (₹449 for 100g / ₹849 Twin Pack):
   - Ingredients: Acacia Concinna (Shikakai) Pod Powder, Emblica Officinalis (Amla) Extract, Eclipta Prostrata (Bhringraj) Extract, Coconut Oil, Neem Oil, Natural Essential Oils.
   - 100% Plant-Based, Zero Plastic, Cruelty-Free & Vegan, AYUSH Compliant, Batch MM-SB04.

2. Plant-Based All-Purpose Cleaner (₹399 for 500ml amber glass trigger / ₹699 for 1L refill):
   - Ingredients: Water, Plant-derived Surfactants (Coconut & Corn based), Essential Oils of Lemon & Eucalyptus, Citric Acid, Plant-based Preservatives.
   - Pet & child safe, biodegradable, non-toxic. Batch MM-APC-02.

3. Organic Tulsi Infusion (₹249 for 100g kraft pouch / ₹549 for 250g refill):
   - Ingredients: 100% Organic Holy Basil (Tulsi) Leaves (Krishna, Rama & Vana varieties). Natural, Caffeine-Free & Vegan. FSSAI Lic. No. 11526000000000. Batch MM-TI-01.
   - Brewing: 1 tsp (2g) per cup, 90°C–95°C water, steep 3–5 mins.

4. Botanical Eau de Parfums (₹499 for 50 ml Kraft Edition / ₹999 for 100 ml Apothecary Flacon):
   - Vetiver & Cedar (MM-EDP-VC01): Earthy Woody · Smoked Amber · Grounding.
   - Tulsi & Neroli (MM-EDP-TN01): Spiced Herbal · Citrus Blossom · Uplifting.
   - Jasmine & Sandalwood (MM-EDP-JS01): Velvety Floral · Warm Woody · Serene.
   - Moringa & White Tea (MM-EDP-MW01): Crisp Green · Herbal · Delicate.

SHIPPING & DISCOUNTS:
- Currency: Indian Rupees (INR / ₹).
- Shipping: Complimentary plastic-free shipping across India on orders of ₹1,499 or more; ₹99 flat shipping below ₹1,499.
- Payment methods: UPI / Card or Cash on Delivery (COD).
- Promo code: MEADOW10 gives 10% off (unlocked by scoring 3+ on the Botanical Craft Quiz).`;

const PERFUME_CATALOG: Record<
  string,
  { name: string; top: string; heart: string; base: string; character: string }
> = {
  'vetiver-cedar-edp': {
    name: 'Vetiver & Cedar Eau de Parfum',
    top: 'Crushed Cedar Needle, Wild Grass Dew',
    heart: 'Kannauj Khus Vetiver Root, Smoked Amber',
    base: 'Himalayan Deodar Cedarwood, Dry Earth',
    character: 'Earthy Woody · Smoked Amber · Grounding',
  },
  'tulsi-neroli-edp': {
    name: 'Tulsi & Neroli Eau de Parfum',
    top: 'Bitter Orange Neroli, Bright Citrus Peel',
    heart: 'Crushed Holy Basil (Tulsi), Fresh Blossom',
    base: 'Warm Spiced Herb, Light Resinous Wood',
    character: 'Spiced Herbal · Citrus Blossom · Uplifting',
  },
  'jasmine-sandalwood-edp': {
    name: 'Jasmine & Sandalwood Eau de Parfum',
    top: 'Dewy White Jasmine Bud, Soft Floral Mist',
    heart: 'Madurai Jasmine Sambac Petals',
    base: 'Creamy Mysuru Sandalwood, Warm Heartwood',
    character: 'Velvety Floral · Warm Woody · Serene',
  },
  'moringa-white-tea-edp': {
    name: 'Moringa & White Tea Eau de Parfum',
    top: 'Crisp Green Moringa Leaf, Rain Dew',
    heart: 'Silver-Needle White Tea, Gentle Floral',
    base: 'Calming Soft Herb, Subtle Pale Wood',
    character: 'Crisp Green · Herbal · Delicate',
  },
};

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

const rateBucket = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateBucket.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    rateBucket.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  rateBucket.set(ip, timestamps);
  return true;
}

function validateChatMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) {
    return null;
  }
  const cleaned: ChatTurn[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') return null;
    const role = (entry as Record<string, unknown>).role;
    const text = (entry as Record<string, unknown>).text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') {
      return null;
    }
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 600) {
      return null;
    }
    cleaned.push({ role, text: trimmed });
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    return null;
  }
  return cleaned;
}

function toGeminiContents(messages: ChatTurn[]) {
  const firstUserIdx = messages.findIndex((m) => m.role === 'user');
  const sliced = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;
  const normalized: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const turn of sliced) {
    const geminiRole = turn.role === 'assistant' ? 'model' : 'user';
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === geminiRole) {
      prev.parts.push({ text: turn.text });
    } else {
      normalized.push({ role: geminiRole, parts: [{ text: turn.text }] });
    }
  }
  return normalized;
}

function mapGeminiError(err: unknown, fallbackMessage: string): { status: number; error: string } {
  const message = err instanceof Error ? err.message : String(err);
  const statusProp =
    err && typeof err === 'object' && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : undefined;

  console.error('[MiniMeadow AI Error]', { status: statusProp, message });

  if (message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED') || statusProp === 403) {
    return {
      status: 403,
      error: 'API key validation failed. Please check GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (message.includes('RESOURCE_EXHAUSTED') || statusProp === 429) {
    return {
      status: 429,
      error: 'Mini Meadow AI is temporarily busy due to rate limits. Please wait a moment and click Retry.',
    };
  }
  if (message.includes('UNAVAILABLE') || statusProp === 503) {
    return {
      status: 503,
      error: 'Our botanical assistant is experiencing high demand right now. Please click Retry in a moment.',
    };
  }
  if (message.includes('NOT_FOUND') || statusProp === 404) {
    return {
      status: 502,
      error: 'Configured Gemini model is currently unavailable. Please try again shortly.',
    };
  }
  if (message.includes('INVALID_ARGUMENT') || statusProp === 400) {
    return {
      status: 400,
      error: 'Unable to process this request format. Please rephrase and try again.',
    };
  }
  return {
    status: 502,
    error: fallbackMessage,
  };
}

async function generateTextWithRetry(
  apiKey: string,
  contents: string | Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  systemInstruction: string
): Promise<string | undefined> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 15_000,
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });

  const attempts: Array<{ model: string; thinkingLevel: ThinkingLevel; delayMs: number; abortMs: number }> = [
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW, delayMs: 0, abortMs: 14_000 },
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW, delayMs: 900, abortMs: 14_000 },
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW, delayMs: 1800, abortMs: 14_000 },
  ];

  let lastErr: unknown;
  const trace: string[] = [];

  for (const attempt of attempts) {
    if (attempt.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, attempt.delayMs));
    }
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attempt.abortMs);
    try {
      const response = await ai.models.generateContent({
        model: attempt.model,
        contents,
        config: {
          systemInstruction,
          abortSignal: controller.signal,
          thinkingConfig: { thinkingLevel: attempt.thinkingLevel },
        },
      });
      const text = response.text?.trim();
      if (text) return text;
      trace.push(`${attempt.model}:empty(${Date.now() - started}ms)`);
    } catch (err: unknown) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const statusProp =
        err && typeof err === 'object' && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : undefined;

      trace.push(`${attempt.model}:${statusProp ?? 'ERR'}(${Date.now() - started}ms)`);
      console.error(`[MiniMeadow AI Attempt Failed] ${attempt.model}`, {
        status: statusProp,
        ms: Date.now() - started,
        message: msg,
      });

      // Immediately propagate permanent auth/key errors without retrying
      if (
        statusProp === 401 ||
        statusProp === 403 ||
        msg.includes('API_KEY_INVALID') ||
        msg.includes('PERMISSION_DENIED')
      ) {
        throw err;
      }
    } finally {
      clearTimeout(timer);
    }
  }
  console.error('[MiniMeadow AI All Attempts Failed]', trace.join(' -> '));
  throw lastErr ?? new Error('Empty response from Gemini API');
}

async function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.use(express.json({ limit: '16kb' }));

  app.post('/api/customer-care', async (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many customer care messages. Please wait a minute before trying again.',
      });
      return;
    }

    const messages = validateChatMessages(req.body?.messages);
    if (!messages) {
      res.status(400).json({
        error: 'Please enter a valid message under 600 characters.',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Customer care assistant is awaiting API key configuration in Settings > Secrets.',
      });
      return;
    }

    try {
      const contents = toGeminiContents(messages);
      const replyText = await generateTextWithRetry(apiKey, contents, SYSTEM_INSTRUCTION);

      if (!replyText) {
        res.status(502).json({
          error: 'Could not generate a response right now. Please try again.',
        });
        return;
      }

      res.status(200).json({ reply: replyText });
    } catch (err: unknown) {
      const mapped = mapGeminiError(
        err,
        'Unable to reach Mini Meadow Customer Care right now. Please try again shortly.'
      );
      res.status(mapped.status).json({ error: mapped.error });
    }
  });

  // Perfume Layering Summary endpoint — strictly allowlists known catalog perfume IDs
  app.post('/api/layering-summary', async (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Rate limit reached. Please wait a minute before generating another layering summary.',
      });
      return;
    }

    const rawIds = req.body?.perfumeIds;
    const rawRatio = req.body?.ratio;

    if (!Array.isArray(rawIds) || rawIds.length < 2 || rawIds.length > 4) {
      res.status(400).json({ error: 'Select between 2 and 4 Mini Meadow perfumes to layer.' });
      return;
    }

    const validIds: string[] = [];
    for (const id of rawIds) {
      if (typeof id !== 'string' || !Object.prototype.hasOwnProperty.call(PERFUME_CATALOG, id)) {
        res.status(400).json({ error: 'Unknown perfume selection.' });
        return;
      }
      if (!validIds.includes(id)) validIds.push(id);
    }

    if (validIds.length < 2) {
      res.status(400).json({ error: 'Select at least 2 distinct Mini Meadow perfumes to layer.' });
      return;
    }

    const ratio =
      rawRatio === 'base-heavy' || rawRatio === 'veil-heavy' ? rawRatio : 'balanced';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'AI layering summary requires GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const orderedDetails = validIds
      .map((id, idx) => {
        const p = PERFUME_CATALOG[id];
        const role = idx === 0 ? 'Anchor Base Layer (applied first)' : `Upper Veil Layer ${idx}`;
        return `${role}: ${p.name} (${p.character}) | Top: ${p.top} | Heart: ${p.heart} | Base: ${p.base}`;
      })
      .join('\n');

    try {
      const summary = await generateTextWithRetry(
        apiKey,
        `Generate a concise 3-sentence fragrance layering summary for this Mini Meadow Eau de Parfum combination (ratio preference: ${ratio}):\n${orderedDetails}`,
        'You are Mini Meadow’s botanical perfumer. Write a grounded, sensory 3-sentence summary describing how the ordered layers unfold from opening top notes through the interwoven heart to the dry-down base, plus best time of day to wear it. Do not invent notes outside the provided catalog and do not output HTML.'
      );

      if (!summary) {
        res.status(502).json({ error: 'Could not generate layering summary.' });
        return;
      }

      res.status(200).json({ summary });
    } catch (err: unknown) {
      const mapped = mapGeminiError(err, 'Unable to generate layering summary right now.');
      res.status(mapped.status).json({ error: mapped.error });
    }
  });

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (
      err &&
      typeof err === 'object' &&
      'type' in err &&
      (err as { type?: string }).type === 'entity.too.large'
    ) {
      res.status(413).json({ error: 'Request payload too large.' });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: 'Malformed JSON body.' });
      return;
    }
    next(err);
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mini Meadow server running on http://0.0.0.0:${PORT}`);
  });
}

createApp();

import fs from "fs";
import { extractText, getDocumentProxy } from "unpdf";
import { getGeminiClient, isGeminiConfigured } from "./llm/gemini.provider.js";
import { env } from "../config/env.js";

const MAX_STORED_CHARS = 16_000;
const MIN_USEFUL_TEXT = 120;

export interface ExtractedSource {
  text: string;
  fileName: string;
  mimeType: string;
  extractionMethod: "plain" | "pdf" | "gemini-vision" | "gemini-pdf";
}

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_STORED_CHARS);
}

async function extractWithGeminiDocument(
  filePath: string,
  mimeType: string,
  purpose: "image" | "pdf",
): Promise<string> {
  const client = getGeminiClient();
  if (!client) return "";

  const model = client.getGenerativeModel({ model: env.geminiModel });
  const data = fs.readFileSync(filePath).toString("base64");

  const instruction =
    purpose === "image"
      ? "This is a photo/scan of study material. Extract ALL readable educational content: chapter titles, topics, definitions, facts, examples, formulas, and bullet points. Return plain text only (no markdown)."
      : "This is a PDF of study material. Extract ALL educational content: headings, topics, definitions, examples, and key facts. Return plain text only (no markdown).";

  const result = await model.generateContent([
    { text: instruction },
    { inlineData: { mimeType, data } },
  ]);

  return normalizeText(result.response.text() ?? "");
}

/** Node-safe PDF text extraction (serverless pdf.js via unpdf). */
async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return normalizeText(text ?? "");
}

/**
 * Extract source material from uploaded teacher file for question generation.
 */
export async function extractSourceMaterial(
  filePath: string,
  fileName: string,
  mimeType: string,
): Promise<ExtractedSource> {
  let text = "";
  let extractionMethod: ExtractedSource["extractionMethod"] = "plain";

  if (mimeType === "text/plain") {
    text = normalizeText(fs.readFileSync(filePath, "utf-8"));
    extractionMethod = "plain";
  } else if (mimeType === "application/pdf") {
    try {
      text = await extractPdfText(filePath);
      extractionMethod = "pdf";
    } catch (err) {
      console.warn("[extract] PDF parse failed, trying Gemini:", err);
      text = "";
    }

    if (text.length < MIN_USEFUL_TEXT && isGeminiConfigured()) {
      const visionText = await extractWithGeminiDocument(
        filePath,
        mimeType,
        "pdf",
      );
      if (visionText.length > text.length) {
        text = visionText;
        extractionMethod = "gemini-pdf";
      }
    } else if (!text && isGeminiConfigured()) {
      text = await extractWithGeminiDocument(filePath, mimeType, "pdf");
      extractionMethod = "gemini-pdf";
    }
  } else if (mimeType === "image/jpeg" || mimeType === "image/png") {
    if (isGeminiConfigured()) {
      text = await extractWithGeminiDocument(filePath, mimeType, "image");
      extractionMethod = "gemini-vision";
    } else {
      throw new Error(
        "GEMINI_API_KEY is required to read image uploads. Add your key in server/.env",
      );
    }
  }

  if (!text || text.length < 30) {
    throw new Error(
      `Could not extract enough text from "${fileName}". Try a clearer PDF/photo or a .txt file.`,
    );
  }

  console.log(
    `[extract] ${fileName} → ${text.length} chars via ${extractionMethod}`,
  );

  return { text, fileName, mimeType, extractionMethod };
}

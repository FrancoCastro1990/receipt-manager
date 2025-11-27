import { GoogleGenAI } from '@google/genai';

/**
 * Result of analyzing a receipt image
 */
export interface ReceiptAnalysisResult {
  name: string | null;
  amount: number | null;
}

/**
 * Interface for receipt analyzer services
 */
export interface IReceiptAnalyzerService {
  analyze(imageBase64: string): Promise<ReceiptAnalysisResult>;
}

/**
 * Receipt analyzer service using Google Gemini API
 */
export class GeminiReceiptAnalyzerService implements IReceiptAnalyzerService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyze(imageBase64: string): Promise<ReceiptAnalysisResult> {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
            {
              text: `Analyze this receipt image and extract:
1. The store/merchant name or the main item/product name
2. The total amount

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"name": "store or item name", "amount": 12345}

Rules:
- If you cannot identify a field, use null for that field
- Do not include currency symbols in the amount
- The amount should be a number, not a string
- Extract the total or final amount, not individual item prices
- For the name, prefer the store/merchant name if visible, otherwise use the main item name`,
            },
          ],
        },
      ],
    });

    const text = response.text?.trim() || '';

    // Try to extract JSON from the response (in case it includes markdown code blocks)
    let jsonText = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const json = JSON.parse(jsonText);

    return {
      name: typeof json.name === 'string' ? json.name : null,
      amount: typeof json.amount === 'number' ? json.amount : null,
    };
  }
}

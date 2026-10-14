/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '30mb' }));

  // Status endpoint
  app.get('/api/gemini/status', (_req: Request, res: Response) => {
    const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({ serverKeyConfigured: hasEnvKey });
  });

  // Export full project as ZIP archive (safely excluding sensitive env, build and git files)
  app.get('/api/export/zip', async (_req: Request, res: Response): Promise<void> => {
    try {
      const zip = new JSZip();
      const rootDir = process.cwd();

      function addDirToZip(currentDir: string, zipFolder: JSZip) {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
          // Strictly exclude private, environment, binary and heavy folders
          if (
            item === 'node_modules' ||
            item === 'dist' ||
            item === '.git' ||
            item === '.aistudio' ||
            item.startsWith('.env') && item !== '.env.example' ||
            item.endsWith('.zip') ||
            item.endsWith('.log') ||
            item === '.DS_Store'
          ) {
            continue;
          }
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            const subFolder = zipFolder.folder(item);
            if (subFolder) {
              addDirToZip(fullPath, subFolder);
            }
          } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(item, content);
          }
        }
      }

      addDirToZip(rootDir, zip);

      const buffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="EcoAI-SourceCode.zip"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.end(buffer);
    } catch (err) {
      console.error('Error generating zip:', err);
      res.status(500).json({ error: 'Failed to generate zip file' });
    }
  });

  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  // 1. CHAT ENDPOINT (Socratic Eco Mentor)
  app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
    try {
      const customKey = req.headers['x-gemini-api-key'] as string | undefined;
      const ai = getGeminiClient(customKey);

      if (!ai) {
        res.status(200).json({ text: null, isMock: true, reason: 'no_api_key' });
        return;
      }

      const { message, history } = req.body;
      const systemInstruction = `Bạn là EcoAI - Cố vấn Xanh, chuyên gia sư phạm giáo dục môi trường và biến đổi khí hậu dành cho học sinh THPT Việt Nam.
Nguyên tắc sư phạm:
1. Khi học sinh đặt câu hỏi hoặc thắc mắc: Hãy giải thích ngắn gọn, chuẩn xác khoa học và dễ hiểu trước (khoảng 2-3 câu).
2. Sau khi giải thích: Hãy áp dụng phương pháp gợi mở Socratic bằng cách đặt 1-2 câu hỏi mở liên hệ thực tế Việt Nam (địa phương, bão lũ miền Trung, hạn mặn ĐBSCL, năng lượng sạch, hoặc thói quen tại trường THPT) để học sinh tự suy nghĩ và liên hệ bản thân.
3. Luôn đưa ra gợi ý hành động xanh cụ thể, thiết thực và vừa sức với lứa tuổi học sinh.
4. Xưng hô chuẩn mực và thân thiện: 'Thầy/Cô EcoAI' và 'em'. Trình bày thoáng, dùng gạch đầu dòng rõ ràng.`;

      // Build chat contents with history
      const formattedContents = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          formattedContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || '';
      res.json({ text: replyText, isMock: false });
    } catch (error) {
      console.error('Error in /api/gemini/chat:', error);
      res.status(200).json({ text: null, isMock: true, error: String(error) });
    }
  });

  // 2. CARBON DIAGNOSIS ENDPOINT
  app.post('/api/gemini/carbon-diagnose', async (req: Request, res: Response): Promise<void> => {
    try {
      const customKey = req.headers['x-gemini-api-key'] as string | undefined;
      const ai = getGeminiClient(customKey);

      if (!ai) {
        res.status(200).json({ diagnosis: null, isMock: true, reason: 'no_api_key' });
        return;
      }

      const { inputs, breakdown } = req.body;

      const prompt = `Phân tích dấu chân carbon học sinh THPT Việt Nam:
Dữ liệu đầu vào:
- Đi lại: ${inputs.transportType} (${inputs.transportKmPerDay} km/ngày, ${inputs.schoolDaysPerMonth} ngày/tháng) => ${breakdown.transportCO2} kg CO2/tháng
- Năng lượng: Điều hòa ${inputs.acHoursPerDay}h/ngày (dùng chung ${inputs.acSharingPeople || 1} người), Sạc thiết bị ${inputs.deviceChargingHoursPerDay}h/ngày => ${breakdown.energyCO2} kg CO2/tháng
- Tiêu dùng đồ nhựa: ${inputs.singleUsePlasticsPerWeek} ly/chai một lần mỗi tuần => ${breakdown.consumptionCO2} kg CO2/tháng
- Khẩu phần thịt đỏ: ${inputs.redMeatMealsPerWeek} bữa/tuần => ${breakdown.nutritionCO2} kg CO2/tháng
- Tổng phát thải: ${breakdown.totalCO2} kg CO2/tháng (Mức phát thải trung bình học sinh THPT: ~35-55 kg CO2/tháng theo nghiên cứu kiểm kê khí nhà kính học đường).

Hãy phân tích và trả về đúng JSON Schema yêu cầu với đầy đủ 7 NGÀY HÀNH ĐỘNG THỰC TẾ (Day 1 đến Day 7) phù hợp với môi trường trường THPT Việt Nam.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ratingLevel: {
                type: Type.STRING,
                description: 'green hoặc moderate hoặc alarm',
              },
              ratingTitle: {
                type: Type.STRING,
                description: 'Tiêu đề xếp loại với biểu tượng cảm xúc',
              },
              summaryAssessment: {
                type: Type.STRING,
                description: 'Đánh giá tổng quan ngắn gọn 2-3 câu có trích dẫn khoa học',
              },
              biggestBottleneck: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  description: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                },
                required: ['source', 'description', 'percentage'],
              },
              sevenDayChallenge: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    day: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    schoolContext: { type: Type.STRING },
                    impactScore: { type: Type.NUMBER },
                    completed: { type: Type.BOOLEAN },
                  },
                  required: ['id', 'day', 'title', 'description', 'schoolContext', 'impactScore', 'completed'],
                },
              },
              ecoQuote: {
                type: Type.STRING,
                description: 'Một danh ngôn hoặc câu khẩu hiệu xanh ý nghĩa',
              },
            },
            required: ['ratingLevel', 'ratingTitle', 'summaryAssessment', 'biggestBottleneck', 'sevenDayChallenge', 'ecoQuote'],
          },
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      res.json({ diagnosis: parsed, isMock: false });
    } catch (error) {
      console.error('Error in /api/gemini/carbon-diagnose:', error);
      res.status(200).json({ diagnosis: null, isMock: true, error: String(error) });
    }
  });

  // 3. WASTE CLASSIFICATION (MULTIMODAL VISION)
  app.post('/api/gemini/waste-classify', async (req: Request, res: Response): Promise<void> => {
    try {
      const customKey = req.headers['x-gemini-api-key'] as string | undefined;
      const ai = getGeminiClient(customKey);

      if (!ai) {
        res.status(200).json({ analysis: null, isMock: true, reason: 'no_api_key' });
        return;
      }

      const { image, mimeType } = req.body;

      if (!image) {
        res.status(400).json({ error: 'Image data is required' });
        return;
      }

      // Clean base64 string if it contains data URI prefix
      const cleanBase64 = image.includes(',') ? image.split(',')[1] : image;

      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      };

      const promptText = `Bạn là chuyên gia phân loại rác thải học đường theo quy định Luật Bảo vệ môi trường 2020 của Việt Nam.
Hãy nhận diện và phân tích vật thể rác thải trong ảnh này.
Phân loại rác theo các nhóm:
- "Rác tái chế" (Giấy, bìa carton, chai lọ nhựa PET/HDPE, kim loại nhôm/sắt, thủy tinh...)
- "Rác thực phẩm" (Thức ăn thừa, vỏ rau củ quả, lá cây, bã chè/cà phê...)
- "Rác nguy hại" (Pin cũ, bóng đèn huỳnh quang, bình ắc quy, vỏ chai hóa chất, rác y tế...)
- "Rác sinh hoạt khác" (Túi nilon, màng bọc thực phẩm, hộp xốp, vỏ bánh kẹo màng nhôm, tàn thuốc, rác cặn...)

Trả về JSON thuần túy theo đúng cấu trúc:
{
  "item_name": "Tên đồ vật cụ thể",
  "waste_type": "Rác tái chế" | "Rác thực phẩm" | "Rác nguy hại" | "Rác sinh hoạt khác",
  "decomposition_time": "Thời gian phân hủy ước tính ngoài tự nhiên kèm chú thích nghiên cứu (ví dụ: 'Khoảng 450 - 500 năm (ước tính theo NOAA/EPA)')",
  "instruction": "Cách xử lý và bỏ đúng thùng rác trường học (màu sắc thùng theo quy định phổ biến)",
  "eco_impact": "Tác hại môi trường nếu vứt bừa bãi hoặc xử lý sai cách",
  "alternative": "Giải pháp xanh hoặc sản phẩm thay thế bền vững cho học sinh THPT"
}`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: {
          parts: [imagePart, { text: promptText }],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              item_name: { type: Type.STRING },
              waste_type: { type: Type.STRING },
              decomposition_time: { type: Type.STRING },
              instruction: { type: Type.STRING },
              eco_impact: { type: Type.STRING },
              alternative: { type: Type.STRING },
            },
            required: ['item_name', 'waste_type', 'decomposition_time', 'instruction', 'eco_impact', 'alternative'],
          },
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      res.json({ analysis: parsed, isMock: false });
    } catch (error) {
      console.error('Error in /api/gemini/waste-classify:', error);
      res.status(200).json({ analysis: null, isMock: true, error: String(error) });
    }
  });

  // Serve static assets (production) or mount Vite in development mode
  const distDir = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distDir, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    console.log('Serving production build from dist/ directory');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    console.log('Mounting Vite dev middleware');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`EcoAI Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

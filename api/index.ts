/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '30mb' }));

const router = Router();

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

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Status endpoint
router.get('/gemini/status', (_req: Request, res: Response) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({ serverKeyConfigured: hasEnvKey });
});

// Export ZIP endpoint
router.get('/export/zip', async (_req: Request, res: Response): Promise<void> => {
  try {
    const zip = new JSZip();
    const rootDir = process.cwd();

    function addDirToZip(currentDir: string, zipFolder: JSZip) {
      if (!fs.existsSync(currentDir)) return;
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (
          item === 'node_modules' ||
          item === 'dist' ||
          item === '.git' ||
          item === '.vercel' ||
          item === '.aistudio' ||
          (item.startsWith('.env') && item !== '.env.example') ||
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

// 1. CHAT ENDPOINT
router.post('/gemini/chat', async (req: Request, res: Response): Promise<void> => {
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

// 2. CARBON DIAGNOSE ENDPOINT
router.post('/gemini/carbon-diagnose', async (req: Request, res: Response): Promise<void> => {
  try {
    const customKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getGeminiClient(customKey);

    if (!ai) {
      res.status(200).json({ diagnosis: null, isMock: true, reason: 'no_api_key' });
      return;
    }

    const { inputs, totalEmission, schoolScore, rating, breakdown } = req.body;

    const prompt = `Phân tích dấu chân carbon của học sinh THPT Việt Nam:
Thông số sinh hoạt:
- Đi lại: ${inputs.motorbikeKmPerDay} km/ngày bằng xe máy (chu kỳ học đường 26 ngày/tháng, hệ số tiêu chuẩn 0.048 kg CO2/km).
- Tiêu thụ điện tại nhà: ${inputs.electricityKwhPerMonth} kWh/tháng (lưới điện VN 2024: 0.681 tCO2e/MWh).
- Điều hòa: ${inputs.acHoursPerDay} giờ/ngày, dùng chung phòng ${inputs.acSharingPeople || 1} người.
- Chế độ ăn: ${inputs.meatMealsPerWeek} bữa thịt/tuần.
- Chai/cốc nhựa một lần: ${inputs.singleUsePlasticPerWeek} cái/tuần.
- Phân loại rác: ${inputs.wasteSortingHabit ? 'Có thực hiện' : 'Chưa thực hiện'}.

Kết quả tính toán:
- Tổng phát thải cá nhân: ${totalEmission} kg CO2/tháng.
- Đánh giá phát thải: ${rating}.
- Điểm xanh học đường: ${schoolScore}/100.
- Chi tiết phát thải theo nguồn:
  + Đi lại: ${breakdown.transport} kg CO2
  + Điều hòa: ${breakdown.ac} kg CO2
  + Điện sinh hoạt khác: ${breakdown.electricity} kg CO2
  + Ăn uống: ${breakdown.diet} kg CO2
  + Rác nhựa: ${breakdown.plastic} kg CO2

Nhiệm vụ sư phạm:
1. Đưa ra nhận xét khách quan, khích lệ học sinh, chỉ ra 2 nguồn phát thải lớn nhất.
2. Xây dựng LỘ TRÌNH 7 NGÀY HÀNH ĐỘNG SINH THÁI (Action Plan) thiết thực, vừa sức với học sinh THPT Việt Nam từ Ngày 1 đến Ngày 7.
3. Dự báo mức giảm CO2 và cây xanh ảo bảo tồn nếu hoàn thành trọn vẹn 7 ngày.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            biggestContributors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            potentialReductionKg: { type: Type.NUMBER },
            potentialTreesSaved: { type: Type.NUMBER },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  targetReductionKg: { type: Type.NUMBER },
                },
                required: ['day', 'title', 'description', 'targetReductionKg'],
              },
            },
          },
          required: ['summary', 'biggestContributors', 'potentialReductionKg', 'potentialTreesSaved', 'actionPlan'],
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

// 3. WASTE CLASSIFY ENDPOINT
router.post('/gemini/waste-classify', async (req: Request, res: Response): Promise<void> => {
  try {
    const customKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getGeminiClient(customKey);

    if (!ai) {
      res.status(200).json({ analysis: null, isMock: true, reason: 'no_api_key' });
      return;
    }

    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'Thiếu dữ liệu hình ảnh' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Phân loại rác thải trong hình ảnh theo quy định của Luật Bảo vệ môi trường 2020 tại Việt Nam và hướng dẫn môi trường học đường.
Cần phân loại vào ĐÚNG MỘT trong 4 nhóm sau:
1. 'recyclable': Nhóm chất thải rắn có khả năng tái sử dụng, tái chế (Giấy, bìa carton, chai nhựa PET, lon nhôm, kim loại, thủy tinh lành).
2. 'organic': Nhóm chất thải thực phẩm / hữu cơ dễ phân hủy (Thức ăn thừa, vỏ hoa quả, bã trà, lá cây trường học).
3. 'hazardous': Nhóm chất thải nguy hại học đường (Pin cũ, ắc quy, bóng đèn huỳnh quang hỏng, chai lọ hóa chất thí nghiệm).
4. 'other': Nhóm chất thải rắn sinh hoạt khác (Túi nilon bẩn một lần, hộp xốp dính dầu mỡ, tã lót, gốm sứ vỡ, rác vụn).

Hãy phân tích chi tiết:
- Tên đồ vật (item_name): Tiếng Việt rõ ràng.
- Nhóm rác (waste_type): Một trong 4 giá trị chuẩn: 'recyclable' | 'organic' | 'hazardous' | 'other'.
- Thời gian phân hủy ước tính trong tự nhiên (decomposition_time): ví dụ '10-20 năm', '450 năm', '2-4 tuần'...
- Hướng dẫn phân loại xử lý chuẩn tại trường học/gia đình (instruction): Hướng dẫn ngắn gọn, dễ làm.
- Tác động môi trường nếu xả bừa bãi (eco_impact).
- Giải pháp thay thế xanh hoặc tái sử dụng (alternative).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
          ],
        },
      ],
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

// 4. DYNAMIC AI QUIZ GENERATION ENDPOINT
router.post('/gemini/generate-quiz', async (req: Request, res: Response): Promise<void> => {
  try {
    const customKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getGeminiClient(customKey);

    if (!ai) {
      res.status(200).json({ questions: null, isMock: true, reason: 'no_api_key' });
      return;
    }

    const prompt = `Bạn là chuyên gia sư phạm bộ môn Địa lí, Sinh học và Hoạt động trải nghiệm THPT Việt Nam.
Hãy tạo ngẫu nhiên một bộ 5 câu hỏi trắc nghiệm mới lạ (mỗi câu 4 lựa chọn A, B, C, D) kiểm tra kiến thức và nhận thức môi trường của học sinh THPT:
Nội dung 5 câu bao gồm:
- Câu 1: Về Khí hậu Việt Nam theo Atlat Địa lí Việt Nam (2 miền khí hậu Bắc - Nam ngăn bởi dãy Bạch Mã, hoặc 7 vùng khí hậu, gió mùa Đông Bắc, gió mùa Tây Nam, gió phơn Tây Nam khô nóng, hoặc quy luật di chuyển của bão theo các tháng).
- Câu 2: Về tính toán Dấu chân Carbon, hệ số phát thải lưới điện Việt Nam 2024 (~0.681 tCO2e/MWh) hoặc ý nghĩa tiết kiệm năng lượng tại trường học.
- Câu 3: Về Phân loại rác thải sinh hoạt theo Luật Bảo vệ môi trường 2020 (3 nhóm: Rác tái chế, Rác thực phẩm, Rác sinh hoạt khác) và xử lý rác nguy hại học đường (pin cũ, bóng đèn hỏng).
- Câu 4: Tác hại môi trường của rác thải nhựa dùng 1 lần hoặc thời gian phân hủy của đồ nhựa/hộp xốp trong tự nhiên.
- Câu 5: Hành vi, lối sống xanh thiết thực học đường hướng tới Net Zero 2050 (đi xe đạp/buýt điện, dùng bình nước cá nhân, giữ nhiệt độ điều hòa 26°C...).

Mỗi câu hỏi cần:
- question: Câu hỏi súc tích, rõ ràng, giàu tính thực tiễn Việt Nam.
- options: Mảng đúng 4 đáp án (1 đáp án đúng và 3 đáp án nhiễu hợp lý).
- correctIndex: Chỉ số đáp án đúng (0, 1, 2, hoặc 3).
- explanation: Lời giải thích khoa học ngắn gọn (2-3 câu) vì sao đáp án đó đúng.
- subjectDomain: Một trong các môn: 'Địa lí' | 'Sinh học' | 'HĐTN' | 'Môi trường'.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              subjectDomain: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'subjectDomain'],
          },
        },
      },
    });

    const responseText = response.text || '[]';
    const parsed = JSON.parse(responseText);
    res.json({ questions: parsed, isMock: false });
  } catch (error) {
    console.error('Error in /api/gemini/generate-quiz:', error);
    res.status(200).json({ questions: null, isMock: true, error: String(error) });
  }
});

// Support both /api/* and /* paths seamlessly on Vercel
app.use('/api', router);
app.use('/', router);

export default app;

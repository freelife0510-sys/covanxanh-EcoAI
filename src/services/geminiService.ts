/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CarbonBreakdown,
  CarbonDiagnosisResult,
  CarbonInputs,
  ChatMessage,
  GreenActionChallenge,
  QuizQuestion,
  WasteAnalysisResult,
} from '../types';

const STORAGE_KEY_GEMINI_KEY = 'ecoai_custom_gemini_api_key';

export const getStoredApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || '';
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_GEMINI_KEY, key.trim());
  }
};

export const hasUserApiKey = (): boolean => {
  return Boolean(getStoredApiKey().trim());
};

// Helper: Normalize Vietnamese unicode string for robust keyword matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

// ==========================================
// 1. CHAT SERVICE (Socratic Eco Mentor)
// ==========================================

export async function sendChatMessage(
  history: ChatMessage[],
  newMessage: string
): Promise<{ text: string; isMock: boolean }> {
  const customKey = getStoredApiKey();

  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
      },
      body: JSON.stringify({
        message: newMessage,
        history: history.slice(-8).map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          text: msg.text,
        })),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return { text: data.text, isMock: Boolean(data.isMock) };
      }
    }
  } catch {
    // Graceful fallback to rich educational mock response
  }

  // Fallback to pedagogically sound Socratic Mock Response
  const mockReply = generateSocraticMockReply(newMessage);
  return { text: mockReply, isMock: true };
}

function generateSocraticMockReply(query: string): string {
  const norm = normalizeText(query);

  if (norm.includes('mien trung') || norm.includes('bao lu') || norm.includes('nang nong') || norm.includes('gio lao')) {
    return `Chào em! Đây là câu hỏi rất hay, gắn liền trực tiếp với bài học Địa lý khí hậu Việt Nam và thời sự đất nước.

**Giải thích khoa học**:
Miền Trung hẹp ngang, phía Tây là dải Trường Sơn chắn gió, phía Đông là Biển Đông sâu và ấm. Vào mùa hè, gió mùa Tây Nam vượt núi Trường Sơn bị mất ẩm ở sườn Tây và tràn xuống sườn Đông thành gió Phơn (gió Lào) cực kỳ khô nóng. Đến mùa thu - đông, các đợt áp thấp nhiệt đới và bão di chuyển từ biển vào gặp bức tường địa hình Trường Sơn nâng khí ẩm lên cao gây mưa dồn dập, kết hợp sông ngòi ngắn, dốc khiến lũ dâng rất nhanh.

**Gợi mở suy nghĩ (Socratic)**:
- Theo em, hệ sinh thái rừng nào đóng vai trò xung yếu nhất tại miền Trung: Rừng phòng hộ ven biển (phi lao, bàng biển) chắn cát bay, hay rừng tự nhiên đầu nguồn Trường Sơn giữ đất chống sạt lở?
- Nếu trường em tổ chức diễn tập "Trường học an toàn thích ứng thiên tai", em nghĩ nhóm học sinh lớp em có thể đề xuất giải pháp kỹ thuật số hoặc phương án hỗ trợ nào thiết thực nhất?`;
  }

  if (norm.includes('el nino') || norm.includes('la nina') || norm.includes('nha kinh') || norm.includes('bien doi khi hau')) {
    return `Chào em! Thầy/Cô rất khen ngợi em đã phân biệt các khái niệm khoa học môi trường cốt lõi này.

**Giải thích khoa học**:
- **Hiệu ứng nhà kính nhân tạo**: Là hiện tượng nhiệt độ bề mặt Trái Đất tăng lên liên tục do con người phát thải quá mức CO2, CH4, N2O từ đốt than đá, xăng dầu và phá rừng. Đây là nguyên nhân gốc rễ của biến đổi khí hậu toàn cầu.
- **Hiện tượng El Niño**: Là pha dao động tự nhiên của đại dương - khí quyển (chu kỳ 2 - 7 năm), khi nước biển phía đông Thái Bình Dương ấm lên bất thường. Tại Việt Nam, El Niño thường làm giảm lượng mưa từ 25-50%, gây nắng nóng kỷ lục và hạn mặn gay gắt ở ĐBSCL và Tây Nguyên.

**Gợi mở suy nghĩ (Socratic)**:
- Khi Trái Đất vốn đang "sốt cao" vì hiệu ứng nhà kính, nay cộng hưởng thêm một đợt El Niño mạnh, em hình dung nguồn nước ngọt sinh hoạt và tưới tiêu của bà con nông dân sẽ bị đe dọa ra sao?
- Tại trường học, hành động tiết kiệm từng lít nước sạch và hạn chế bật máy lạnh lãng phí có ý nghĩa gì đối với an ninh năng lượng quốc gia trong những đợt cao điểm nắng nóng này?`;
  }

  if (norm.includes('rac thai nhua') || norm.includes('cang tin') || norm.includes('tra sua') || norm.includes('ong hut') || norm.includes('hop xop')) {
    return `Chào em! Thầy/Cô rất trân trọng sự nhạy bén và tinh thần trách nhiệm của em với cảnh quan học đường.

**Giải thích khoa học**:
Đồ nhựa dùng một lần (ly trà sữa PP/PET, hộp xốp PS, ống hút) chỉ phục vụ chúng ta trong 10-15 phút nhưng mất từ 400 đến hơn 500 năm để rã nhỏ thành vi nhựa (microplastics). Khi chôn lấp hoặc đốt sai quy định, chúng sinh ra độc tố Dioxin và ngấm vào chuỗi thức ăn thủy sản.

**Gợi mở suy nghĩ (Socratic)**:
- Em hãy thử quan sát: Trong 1 tuần, một học sinh dùng trung bình 3-4 ly trà sữa/nước ngọt thì cả trường 1.500 học sinh sẽ thải ra bao nhiêu nghìn chiếc ly nhựa?
- Nếu Đoàn trường phát động chiến dịch "Căng tin xanh - Refill nước giảm giá", theo em giải pháp nào sẽ thuyết phục được cô chú chủ căng tin và các bạn học sinh hưởng ứng nhiệt tình nhất?`;
  }

  if (norm.includes('du an') || norm.includes('skkn') || norm.includes('sang kien') || norm.includes('hoat dong trai nghiem') || norm.includes('y tuong')) {
    return `Ý tưởng tuyệt vời! Đây chính là tinh thần của Hoạt động trải nghiệm, hướng nghiệp và nghiên cứu khoa học kỹ thuật THPT theo chương trình GDPT 2018.

**Gợi ý 3 mô hình dự án khả thi cao cho học sinh THPT**:
1. **Trạm Thu Gom Pin Cũ & Rác Điện Tử Học Đường (Eco-Drop Box)**: Thiết kế thùng thu gom pin an toàn tại từng hành lang lớp học, phối hợp với các tổ chức môi trường để vận chuyển đi xử lý chất thải nguy hại chuẩn.
2. **Chiến Dịch "Bữa Trưa Xanh — Không Thừa Thức Ăn" (Zero Food Waste)**: Cân đo lượng thức ăn thừa mỗi ngày của các lớp, tính toán lượng khí Methane (CH4) giảm thải và trao cờ thi đua xanh cho chi đoàn xuất sắc.
3. **Ứng Dụng Bản Đồ Cây Xanh & Đo Dấu Chân Carbon Lớp Học**: Học sinh tự khảo sát thói quen đi lại, điều hòa của lớp mình bằng công cụ EcoAI để xây dựng cam kết giảm phát thải 15% trong học kỳ.

**Gợi mở suy nghĩ (Socratic)**:
- Trong 3 ý tưởng trên, mô hình nào phù hợp nhất với điều kiện thực tế và sở trường của nhóm em? Hãy cùng Thầy/Cô thảo luận các bước lập kế hoạch triển khai nhé!`;
  }

  if (norm.includes('phan loai rac') || norm.includes('thung rac') || norm.includes('nguy hai') || norm.includes('pin cu')) {
    return `Một câu hỏi rất thiết thực và đúng với quy định pháp luật môi trường mới của nước ta!

**Giải thích khoa học & luật định**:
Theo Luật Bảo vệ môi trường 2020 của Việt Nam, chất thải rắn sinh hoạt được chia thành 3 nhóm chính:
1. **Rác tái sử dụng, tái chế**: Giấy, bìa carton, chai nhựa, kim loại, thủy tinh.
2. **Chất thải thực phẩm (rác hữu cơ)**: Vỏ trái cây, thức ăn thừa, lá cây.
3. **Chất thải rắn sinh hoạt khác**: Bao gồm rác khó phân hủy (túi nilon, màng bọc thức ăn) và đặc biệt là **Rác nguy hại** (pin cũ, bóng đèn neon hỏng, bình xịt).

**Gợi mở suy nghĩ (Socratic)**:
- Em có biết vì sao tuyệt đối không được vứt pin cũ vào thùng rác chung không? (Kim loại nặng chì, thủy ngân, cadmium trong 1 viên pin có thể làm ô nhiễm 500 lít nước hoặc 1 mét khối đất trong 50 năm).
- Tại trường của em, hệ thống thùng rác hiện tại đã phân chia rõ ràng chưa? Làm thế nào để các bạn không còn vứt nhầm rác thực phẩm vào thùng rác giấy tái chế?`;
  }

  // Generic Socratic Eco Mentor Response
  return `Chào em! Thầy/Cô EcoAI đã lắng nghe chia sẻ của em.

Vấn đề môi trường và khí hậu luôn bắt đầu từ những thói quen giản dị nhất quanh ta: chiếc bình nước cá nhân em mang theo mỗi sáng, chiếc xe đạp em đi học, hay nút công tắc đèn em tắt trước khi rời phòng học.

**Thầy/Cô muốn cùng em suy nghĩ**:
- Theo em, trong các nguyên nhân gây ô nhiễm hoặc phát thải tại trường học, đâu là thói quen dễ thay đổi nhất đối với học sinh lớp em?
- Em có mong muốn cùng EcoAI đo thử lượng phát thải carbon của chính mình trong tháng qua để tìm ra điểm nghẽn lớn nhất không? Hãy nhắn cho Thầy/Cô nhé!`;
}

// ==========================================
// 2. CARBON CALCULATOR & AI DIAGNOSIS
// ==========================================

export function calculateCarbonEmissions(inputs: CarbonInputs): CarbonBreakdown {
  // 1. Transportation (kg CO2 / passenger-km) based on Vietnam Transport Studies
  // - Bicycle: 0
  // - Electric bike / scooter: ~0.02 kg CO2/km (0.03 kWh/km * 0.681 kg CO2/kWh)
  // - Public bus: ~0.035 kg CO2/km (urban bus per passenger)
  // - Motorbike 110-150cc: ~0.048 kg CO2/km (~2.0L gasoline / 100km * 2.31 kg CO2/L)
  const transportFactorMap: Record<string, number> = {
    bicycle: 0,
    electric_bike: 0.02,
    bus: 0.035,
    motorbike: 0.048,
  };
  const transportRate = transportFactorMap[inputs.transportType] ?? 0.048;
  const schoolDays = inputs.schoolDaysPerMonth || 26;
  const transportCO2 = Math.round(inputs.transportKmPerDay * transportRate * schoolDays * 10) / 10;

  // 2. Energy Consumption
  // Air Conditioner: ~0.7 kWh/hr for 1 HP inverter unit. Grid emission factor Vietnam 2024: 0.681 tCO2e/MWh = 0.681 kg/kWh.
  // Emission per hour for AC = 0.7 * 0.681 = ~0.476 kg CO2/hour.
  // Crucial: AC is shared by people in the room! Divided by acSharingPeople (1 - 4 people).
  const sharingPeople = Math.max(1, Math.min(4, inputs.acSharingPeople || 2));
  const acPerHourPerPerson = 0.476 / sharingPeople;
  const acMonthlyCO2 = inputs.acHoursPerDay * acPerHourPerPerson * 30;

  // Device Charging (phone, laptop, tablet): ~0.03 kWh per charge session ~ 0.02 kg CO2 / session-hour.
  const chargingMonthlyCO2 = inputs.deviceChargingHoursPerDay * 0.02 * 30;
  const energyCO2 = Math.round((acMonthlyCO2 + chargingMonthlyCO2) * 10) / 10;

  // 3. Single-Use Plastics
  // 1 PET bottle or plastic cup with lid + straw generates ~0.08 kg CO2 equivalent across production & disposal.
  // Calculated for 4.3 weeks per month.
  const consumptionCO2 = Math.round(inputs.singleUsePlasticsPerWeek * 0.08 * 4.3 * 10) / 10;

  // 4. Nutrition (Red Meat Meals)
  // High school diet: beef (~2.5 kg CO2e/meal), pork/poultry (~0.9 kg CO2e/meal). Average red meat meal ~1.2 kg CO2e.
  const nutritionCO2 = Math.round(inputs.redMeatMealsPerWeek * 1.2 * 4.3 * 10) / 10;

  const totalCO2 = Math.round((transportCO2 + energyCO2 + consumptionCO2 + nutritionCO2) * 10) / 10;

  // Trees needed per year: 1 mature urban tree absorbs ~21 kg CO2/year.
  // Student monthly total * 12 / 21
  const annualTotal = totalCO2 * 12;
  const treesNeeded = Math.max(1, Math.round(annualTotal / 21));

  // Scientific benchmarks for Vietnamese High School Students:
  // - Green (Low emission): < 35 kg CO2/month
  // - Moderate (Standard average): 35 - 55 kg CO2/month
  // - Alarm (High emission): > 55 kg CO2/month
  let ratingLevel: 'green' | 'moderate' | 'alarm' = 'green';
  if (totalCO2 > 55) {
    ratingLevel = 'alarm';
  } else if (totalCO2 >= 35) {
    ratingLevel = 'moderate';
  } else {
    ratingLevel = 'green';
  }

  return {
    transportCO2,
    energyCO2,
    consumptionCO2,
    nutritionCO2,
    totalCO2,
    treesNeeded,
    ratingLevel,
  };
}

export async function diagnoseCarbonFootprint(
  inputs: CarbonInputs,
  breakdown: CarbonBreakdown
): Promise<CarbonDiagnosisResult> {
  const customKey = getStoredApiKey();

  try {
    const response = await fetch('/api/gemini/carbon-diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
      },
      body: JSON.stringify({ inputs, breakdown }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.diagnosis) {
        return { ...data.diagnosis, isMock: Boolean(data.isMock) };
      }
    }
  } catch {
    // Fallback to intelligent local diagnosis generator
  }

  return generateMockCarbonDiagnosis(inputs, breakdown);
}

function generateMockCarbonDiagnosis(
  _inputs: CarbonInputs,
  breakdown: CarbonBreakdown
): CarbonDiagnosisResult {
  const sources = [
    { source: 'Năng lượng điện (Điều hòa & Thiết bị)', val: breakdown.energyCO2 },
    { source: 'Giao thông đi lại học đường', val: breakdown.transportCO2 },
    { source: 'Khẩu phần ăn (Thịt đỏ)', val: breakdown.nutritionCO2 },
    { source: 'Đồ nhựa dùng một lần', val: breakdown.consumptionCO2 },
  ];
  sources.sort((a, b) => b.val - a.val);
  const highest = sources[0];
  const highestPct = breakdown.totalCO2 > 0 ? Math.round((highest.val / breakdown.totalCO2) * 100) : 0;

  let ratingTitle = 'Mức độ Xanh Tích Cực 🌿';
  let summary = `Dấu chân carbon của em là ${breakdown.totalCO2} kg CO2/tháng, nằm ở mức thấp và rất tích cực so với mức trung bình học sinh THPT (35 - 55 kg CO2/tháng). Hãy tiếp tục lan tỏa thói quen sống xanh này đến bạn bè trong lớp nhé!`;

  if (breakdown.ratingLevel === 'alarm') {
    ratingTitle = 'Mức độ Báo Động Đỏ ⚠️';
    summary = `Dấu chân carbon của em là ${breakdown.totalCO2} kg CO2/tháng, cao hơn đáng kể so với mức chuẩn học sinh THPT (35 - 55 kg CO2/tháng). Điểm phát thải chính cần ưu tiên điều chỉnh là ${highest.source}.`;
  } else if (breakdown.ratingLevel === 'moderate') {
    ratingTitle = 'Mức độ Cân Bằng Trung Bình ⚖️';
    summary = `Dấu chân carbon của em là ${breakdown.totalCO2} kg CO2/tháng, tương đương mức trung bình học sinh THPT Việt Nam. Em hoàn toàn có thể cắt giảm thêm 15-25% thông qua thử thách 7 ngày hành động xanh.`;
  }

  // Full 7-Day Green Action Challenge tailored for Vietnamese high schools
  const challenges: GreenActionChallenge[] = [
    {
      id: 'day-1',
      day: 1,
      title: 'Thiết lập điều hòa 26°C - 27°C kết hợp quạt trần',
      description: 'Mỗi 1°C tăng lên giúp tiết kiệm 7-10% điện năng tiêu thụ của máy lạnh, giảm trực tiếp khí nhà kính từ nhiệt điện than.',
      schoolContext: 'Đề xuất ban cán sự lớp thống nhất nhiệt độ phòng học chuẩn 26°C và tắt điều hòa 30 phút trước khi tan trường.',
      impactScore: 15,
      completed: false,
    },
    {
      id: 'day-2',
      day: 2,
      title: 'Ngày Thứ Hai "Bình cá nhân — Cự tuyệt ly nhựa trà sữa"',
      description: 'Mang theo bình giữ nhiệt inox cá nhân để lấy nước uống tại cây lọc nước trường học thay vì mua nước đóng chai dùng 1 lần.',
      schoolContext: 'Cứ mỗi chai/ly nhựa giảm được sẽ ngăn ngừa 80g khí CO2e và chấm dứt nguy cơ rác thải tồn đọng bãi chôn lấp.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-3',
      day: 3,
      title: 'Khởi động "Green Commute" (Xe buýt / Xe đạp / Đi bộ)',
      description: 'Chuyển đổi ít nhất 2 ngày trong tuần sang đi xe buýt công cộng, xe đạp hoặc đi bộ cùng bạn bè cùng tuyến đường.',
      schoolContext: 'Vừa rèn luyện thể lực vừa giảm ngay từ 2 - 4 kg phát thải khói bụi carbon mỗi tháng ra bầu không khí đô thị.',
      impactScore: 25,
      completed: false,
    },
    {
      id: 'day-4',
      day: 4,
      title: 'Thu gom pin cũ và thiết bị điện tử hỏng vào hộp riêng',
      description: 'Không vứt pin tiểu, pin đồng hồ vào sọt rác sinh hoạt thông thường để tránh nhiễm độc chì, thủy ngân vào nguồn nước ngầm.',
      schoolContext: 'Đem pin cũ đến gửi tại "Hộp thu gom pin cũ" của Đoàn trường hoặc câu lạc bộ môi trường.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-5',
      day: 5,
      title: 'Bữa trưa Thứ Sáu Xanh (Zero Food Waste) — Ăn hết khẩu phần',
      description: 'Ăn hết khẩu phần thức ăn, không để thừa thức ăn và ưu tiên rau xanh, củ quả tươi thay thế một phần thịt đỏ.',
      schoolContext: 'Ngăn chặn thức ăn thừa bị chôn lấp yếm khí sinh ra khí Methane (CH4) — khí nhà kính mạnh gấp 28 lần CO2.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-6',
      day: 6,
      title: 'Rút phích cắm & Tắt hẳn thiết bị điện (Phantom Load Hunt)',
      description: 'Tắt công tắc ổ cắm sạc máy tính, tivi, quạt khi không dùng để triệt tiêu dòng điện chờ (tiêu tốn 5-10% hóa đơn điện).',
      schoolContext: 'Kiểm tra và ngắt cầu dao điện phòng học trước khi đóng cửa phòng vào cuối tuần.',
      impactScore: 15,
      completed: false,
    },
    {
      id: 'day-7',
      day: 7,
      title: 'Lan tỏa sáng kiến xanh — Chia sẻ kết quả & Cam kết cùng lớp',
      description: 'Chia sẻ chỉ số Dấu chân Carbon và thành tích 7 ngày sống xanh của em lên bảng tin lớp hoặc nhóm Zalo học tập.',
      schoolContext: 'Rủ thêm 2 người bạn thân cùng tính toán carbon và cùng ký cam kết giữ gìn lớp học xanh Net Zero 2050.',
      impactScore: 30,
      completed: false,
    },
  ];

  return {
    ratingLevel: breakdown.ratingLevel,
    ratingTitle,
    summaryAssessment: summary,
    biggestBottleneck: {
      source: highest.source,
      percentage: highestPct,
      description: `Chiếm tới ${highestPct}% tổng lượng phát thải cá nhân của em (${highest.val} kg CO2/tháng). Đây là nguồn em cần tập trung tối ưu trước tiên.`,
    },
    sevenDayChallenge: challenges,
    ecoQuote: 'Mỗi hành động xanh nhỏ của một học sinh hôm nay là một tán rừng mát lành cho thế hệ mai sau.',
    isMock: true,
  };
}

// ==========================================
// 3. WASTE CLASSIFIER (Multimodal Vision)
// ==========================================

export async function classifyWasteImage(
  base64Data: string,
  mimeType: string
): Promise<WasteAnalysisResult> {
  const customKey = getStoredApiKey();

  try {
    const response = await fetch('/api/gemini/waste-classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
      },
      body: JSON.stringify({
        image: base64Data,
        mimeType: mimeType || 'image/jpeg',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.analysis) {
        return { ...data.analysis, isDemo: Boolean(data.isMock) };
      }
    }
  } catch {
    // Fallback
  }

  // Transparent Educational Fallback (NEVER fake classification for arbitrary uploaded photos!)
  return {
    item_name: 'Vật thể chưa xác thực (Chế độ mô phỏng offline)',
    waste_type: 'Rác sinh hoạt khác',
    decomposition_time: 'Cần phân tích vật liệu thực tế ngoài tự nhiên',
    instruction: 'Hệ thống đang ở chế độ mô phỏng ngoại tuyến. Vui lòng chọn 1 trong 4 mẫu ảnh chuẩn ở trên hoặc cài đặt Google Gemini API Key để nhận diện vật thể chụp thực tế của bạn bằng AI Vision!',
    eco_impact: 'Phân loại rác tại nguồn là trách nhiệm bắt buộc theo Luật BVMT 2020 nhằm giảm tải cho các bãi chôn lấp.',
    alternative: 'Khuyến khích học sinh chụp lại ảnh cận cảnh rõ nét vật thể rác và kiểm tra kết nối mạng.',
    isDemo: true,
    isFallbackWarning: true,
  };
}

// ==========================================
// 4. DYNAMIC QUIZ GENERATOR (AI + BANK)
// ==========================================

export const CURATED_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 101,
    question: 'Theo Atlat Địa lí Việt Nam, ranh giới tự nhiên phân chia 2 miền khí hậu Bắc và Nam của nước ta là dãy núi nào?',
    options: [
      'Dãy Hoàng Liên Sơn',
      'Dãy Bạch Mã (khoảng vĩ độ 16°B)',
      'Dãy Hoành Sơn (Đèo Ngang)',
      'Dãy Trường Sơn Nam',
    ],
    correctIndex: 1,
    explanation: 'Dãy Bạch Mã đâm ngang ra biển ở khoảng vĩ tuyến 16°B (phía nam Thừa Thiên Huế/Đà Nẵng), là bức tường tự nhiên ngăn cản gió mùa Đông Bắc, phân định miền khí hậu phía Bắc (có mùa đông lạnh) và miền khí hậu phía Nam (nóng quanh năm).',
    subjectDomain: 'Địa lí',
  },
  {
    id: 102,
    question: 'Tại sao vùng khí hậu Tây Bắc Bộ vào mùa đông lại có nền nhiệt đỡ lạnh hơn so với vùng Đông Bắc Bộ cùng vĩ độ?',
    options: [
      'Do nằm gần đường xích đạo hơn',
      'Do có dãy núi cao Hoàng Liên Sơn chạy hướng Tây Bắc - Đông Nam chắn gió mùa Đông Bắc',
      'Do có biển bao bọc điều hòa nhiệt độ',
      'Do không có các khối không khí lạnh tràn về',
    ],
    correctIndex: 1,
    explanation: 'Dãy Hoàng Liên Sơn cao đồ sộ (>2000-3000m) tạo bức bình phong chắn gió mùa Đông Bắc, khiến luồng gió lạnh từ phương bắc bị suy yếu khi tràn sang sườn phía tây, nên thung lũng Tây Bắc đỡ rét buốt hơn vùng Đông Bắc.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 103,
    question: 'Hiện tượng gió Phơn (gió Lào) ở vùng Bắc Trung Bộ vào đầu mùa hạ có đặc tính cực kỳ khô và nóng là do nguyên nhân nào?',
    options: [
      'Gió thổi trực tiếp từ sa mạc Gobi xuống',
      'Gió mùa Tây Nam trút hết mưa ở sườn tây Trường Sơn (Lào), khi vượt đỉnh sang sườn đông bị nén đoạn nhiệt khô và nóng lên',
      'Do nhiệt độ cát ven biển đốt nóng không khí',
      'Do ảnh hưởng của các tâm áp thấp trên Biển Đông',
    ],
    correctIndex: 1,
    explanation: 'Khi khối khí ẩm Tây Nam từ Vịnh Bengal leo dốc sườn Tây Trường Sơn gây mưa lớn, khi sang sườn Đông (Việt Nam) đã cạn ẩm và hạ dốc theo quy luật đoạn nhiệt khô (cứ xuống 100m nhiệt độ tăng 1°C), tạo thành luồng gió Phơn khô rát.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 104,
    question: 'Đặc điểm mùa mưa ở vùng khí hậu Nam Trung Bộ có sự khác biệt rõ rệt nào so với các vùng khí hậu khác của nước ta?',
    options: [
      'Mưa chủ yếu vào các tháng mùa xuân',
      'Mưa lệch hẳn về thời kỳ thu - đông (từ tháng 9 đến tháng 12)',
      'Không có mùa mưa trong năm',
      'Mưa đều đặn suốt 12 tháng không đổi',
    ],
    correctIndex: 1,
    explanation: 'Vùng Nam Trung Bộ có địa hình sườn đón gió mùa Đông Bắc qua biển kết hợp dải hội tụ nhiệt đới và bão, tạo nên mùa mưa muộn lệch về thu đông (tháng 9-12), trong khi mùa hè lại khô hạn.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 105,
    question: 'Theo quy luật khí hậu nhiệt đới gió mùa của Việt Nam, hướng di chuyển và thời gian đổ bộ của bão biến động như thế nào?',
    options: [
      'Bão xuất hiện đồng loạt trên cả nước vào tháng 1',
      'Bão đổ bộ từ Nam ra Bắc, sớm nhất ở Cà Mau',
      'Bão di chuyển chậm dần từ Bắc vào Nam (tháng 6-8 ở Bắc Bộ, tháng 9-11 ở Trung Bộ, tháng 12 ở Nam Bộ)',
      'Chỉ duy nhất miền Trung có bão, miền Bắc và Nam không có',
    ],
    correctIndex: 2,
    explanation: 'Theo Atlat Địa lí Việt Nam, tâm bão và dải hội tụ nhiệt đới dịch chuyển dần từ bắc xuống nam theo chuyển động biểu kiến của Mặt Trời: tháng 6-8 bão vào Bắc Bộ, tháng 9-11 dồn dập vào Trung Bộ, tháng 12 dịch xuống Nam Bộ.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 106,
    question: 'Quần đảo Hoàng Sa và Quần đảo Trường Sa thiêng liêng của Việt Nam lần lượt thuộc đơn vị hành chính nào?',
    options: [
      'Huyện Hoàng Sa (TP. Đà Nẵng) và Huyện Trường Sa (tỉnh Khánh Hòa)',
      'Huyện Hoàng Sa (tỉnh Quảng Nam) và Huyện Trường Sa (tỉnh Ninh Thuận)',
      'Cả hai cùng thuộc tỉnh Bình Định',
      'Huyện đảo Phú Quốc (Kiên Giang)',
    ],
    correctIndex: 0,
    explanation: 'Nhà nước Việt Nam xác lập chủ quyền liên tục và hòa bình: Quần đảo Hoàng Sa trực thuộc huyện Hoàng Sa (TP. Đà Nẵng) và Quần đảo Trường Sa trực thuộc huyện Trường Sa (tỉnh Khánh Hòa).',
    subjectDomain: 'Địa lí',
  },
  {
    id: 107,
    question: 'Theo số liệu nghiên cứu công bố năm 2024 (ĐH Bách khoa Hà Nội & Bộ TN&MT), hệ số phát thải của lưới điện Việt Nam là bao nhiêu?',
    options: [
      'Khoảng 0.15 tCO2e/MWh',
      'Khoảng 0.681 tCO2e/MWh (~0.681 kg CO2 cho mỗi kWh điện)',
      'Bằng 0 vì sử dụng 100% năng lượng mặt trời',
      'Khoảng 2.5 tCO2e/MWh',
    ],
    correctIndex: 1,
    explanation: 'Hệ số lưới điện Việt Nam đạt ~0.681 tCO2e/MWh do cơ cấu điện lực vẫn còn nhiệt điện than, vì vậy mỗi kWh điện học sinh tiết kiệm được tương đương giảm trực tiếp gần 0.7 kg CO2 vào bầu khí quyển.',
    subjectDomain: 'Môi trường',
  },
  {
    id: 108,
    question: 'Tại sao việc duy trì nhiệt độ điều hòa ở mức 26°C - 27°C kèm bật quạt gió lại là hành động tiết kiệm điện tối ưu cho trường học?',
    options: [
      'Vì điều hòa sẽ tự động tắt khi để 26°C',
      'Vì mỗi 1°C cài đặt tăng lên giúp giảm từ 7% đến 10% lượng điện tiêu thụ của máy nén, trong khi gió quạt vẫn mang lại cảm giác mát mẻ',
      'Vì 26°C là nhiệt độ của băng tan',
      'Không có sự khác biệt giữa 18°C và 26°C',
    ],
    correctIndex: 1,
    explanation: 'Khi đặt nhiệt độ điều hòa ở 26-27°C, máy nén làm việc ít hơn, chênh lệch nhiệt độ với môi trường ngoài giảm, tiết kiệm 7-10% điện năng mỗi độ C, kết hợp quạt gió giúp lưu thông không khí thoáng mát.',
    subjectDomain: 'Môi trường',
  },
  {
    id: 109,
    question: 'Theo quy định của Luật Bảo vệ môi trường 2020, chất thải rắn sinh hoạt bắt buộc phải phân loại thành những nhóm nào?',
    options: [
      'Rác đốt được và rác không đốt được',
      '3 nhóm: Rác tái sử dụng/tái chế, Chất thải thực phẩm, và Chất thải rắn sinh hoạt khác (kèm lưu trữ an toàn rác nguy hại)',
      'Chỉ cần gom chung vào túi nilon đen',
      '5 nhóm không có quy định phân loại thực phẩm',
    ],
    correctIndex: 1,
    explanation: 'Khoản 1 Điều 75 Luật BVMT 2020 quy định phân loại 3 nhóm: 1. Chất thải rắn có khả năng tái sử dụng, tái chế; 2. Chất thải thực phẩm; 3. Chất thải rắn sinh hoạt khác. Rác nguy hại như pin, bóng đèn hỏng được quản lý riêng.',
    subjectDomain: 'Sinh học',
  },
  {
    id: 110,
    question: 'Pin cũ, ắc quy và bóng đèn huỳnh quang hỏng tại trường học thuộc nhóm chất thải nào và phải xử lý ra sao?',
    options: [
      'Thuộc rác hữu cơ, có thể chôn vào gốc cây',
      'Thuộc rác nguy hại học đường; phải gom vào hộp riêng và gửi về các điểm thu hồi chuyên trách, tuyệt đối không vứt vào thùng rác thường',
      'Đốt cùng lá cây trong sân trường',
      'Nghiền nát rồi đổ xuống cống',
    ],
    correctIndex: 1,
    explanation: 'Pin và bóng đèn chứa thủy ngân, chì, cadmi cực độc. Khi rò rỉ ra môi trường, 1 viên pin có thể gây ô nhiễm 500 lít nước sạch hoặc 1m3 đất suốt 50 năm, gây hại nghiêm trọng cho sức khỏe con người.',
    subjectDomain: 'Sinh học',
  },
  {
    id: 111,
    question: 'Một chiếc túi nilon hoặc cốc nhựa trà sữa một lần khi vứt ra bãi chôn lấp tự nhiên cần khoảng bao nhiêu năm để phân hủy hoàn toàn?',
    options: [
      'Khoảng 2 - 3 tuần',
      'Khoảng 6 tháng đến 1 năm',
      'Khoảng 400 - 500 năm, phân rã thành vi nhựa độc hại',
      'Không bao giờ bị phân rã dù chỉ một phần',
    ],
    correctIndex: 2,
    explanation: 'Nhựa dùng một lần có liên kết polyme nhân tạo rất bền vững, mất 400-500 năm mới phân rã ngoài tự nhiên, phân tách thành các hạt vi nhựa (microplastics) đi vào chuỗi thức ăn và nguồn nước uống.',
    subjectDomain: 'Sinh học',
  },
  {
    id: 112,
    question: 'Hành động nào của học sinh THPT đem lại hiệu quả kép vừa giảm rác nhựa dùng một lần vừa tiết kiệm chi tiêu?',
    options: [
      'Mang theo bình nước giữ nhiệt cá nhân để lấy nước sạch từ máy lọc trường học thay vì mua nước đóng chai',
      'Mỗi ngày mua 2 cốc trà sữa mang đi',
      'Bọc tất cả sách vở bằng nhiều lớp nilon dẻo',
      'Vứt chai nhựa vào thùng rác thực phẩm',
    ],
    correctIndex: 0,
    explanation: 'Sử dụng bình nước cá nhân giúp một học sinh giảm phát thải trung bình 150-200 chai/ly nhựa mỗi năm, đồng thời hình thành nếp sống văn minh học đường.',
    subjectDomain: 'HĐTN',
  },
  {
    id: 113,
    question: 'Mục tiêu "Net Zero 2050" mà Thủ tướng Chính phủ Việt Nam cam kết tại Hội nghị COP26 mang ý nghĩa gì?',
    options: [
      'Việt Nam sẽ không sử dụng bất kỳ nguồn điện nào vào năm 2050',
      'Đạt mức phát thải ròng bằng 0, nghĩa là lượng khí nhà kính phát thải tương đương lượng được hấp thụ bởi rừng và công nghệ lưu trữ carbon',
      'Ngừng toàn bộ hoạt động giao thông vận tải',
      'Chỉ áp dụng cho các nước phát triển, không liên quan đến học sinh',
    ],
    correctIndex: 1,
    explanation: 'Net Zero 2050 là trạng thái cân bằng sinh thái: tổng lượng khí nhà kính phát thải do con người tạo ra được bù đắp và hấp thụ hoàn toàn bằng rừng phòng hộ, rừng ngập mặn và công nghệ xanh, bảo vệ khí hậu Trái Đất.',
    subjectDomain: 'HĐTN',
  },
  {
    id: 114,
    question: 'Phân loại rác thực phẩm (vỏ hoa quả, thức ăn thừa) tại trường học đem lại giá trị sinh thái nổi bật nào?',
    options: [
      'Có thể ủ thành phân bón hữu cơ compost giàu dinh dưỡng cho vườn cây học sinh và tránh làm ướt, bốc mùi rác tái chế',
      'Làm tăng khối lượng rác chôn lấp',
      'Để đốt nhanh hơn',
      'Làm hỏng các loại rác khác',
    ],
    correctIndex: 0,
    explanation: 'Rác thực phẩm chiếm hơn 50% khối lượng rác sinh hoạt. Khi tách riêng, rác thực phẩm có thể ủ thành phân hữu cơ bón cho cây, giảm phát thải khí metan (CH4) tại các bãi rác lộ thiên.',
    subjectDomain: 'Sinh học',
  },
];

export async function generateDynamicQuiz(): Promise<{ questions: QuizQuestion[]; isMock: boolean }> {
  const customKey = getStoredApiKey();

  try {
    const response = await fetch('/api/gemini/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.questions) && data.questions.length >= 5) {
        return { questions: data.questions.slice(0, 5), isMock: false };
      }
    }
  } catch {
    // Graceful fallback to dynamic shuffled bank
  }

  // Shuffle and pick 5 distinct questions from curated bank
  const shuffled = [...CURATED_QUIZ_BANK].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5).map((q, idx) => ({ ...q, id: idx + 1 }));

  return { questions: selected, isMock: true };
}


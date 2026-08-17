// Dữ liệu lý thuyết và bài tập trắc nghiệm về Basel Accords (Basel I, II, III)
const BASEL_DATA = {
  // Dòng thời gian tiến hóa
  timeline: [
    {
      id: "basel-i",
      year: "1988",
      title: "Basel I - Khởi đầu tỷ lệ an toàn vốn",
      context: "Ra đời trong bối cảnh các ngân hàng lớn trên thế giới gia tăng đòn bẩy tài chính và đối mặt với rủi ro tín dụng ngày càng cao sau cuộc khủng hoảng nợ thập niên 1980.",
      objective: "Tập trung đo lường rủi ro tín dụng và thiết lập mức vốn tối thiểu toàn cầu để bảo vệ hệ thống ngân hàng tránh khỏi đổ vỡ.",
      keyRules: [
        "Định nghĩa Vốn tự có thành 2 cấp: Vốn cấp 1 (Vốn cốt lõi như cổ phần thường, thặng dư vốn) và Vốn cấp 2 (Vốn bổ sung như dự phòng tổn thất tín dụng, nợ thứ cấp).",
        "Đưa ra khái niệm Tài sản có rủi ro (Risk-Weighted Assets - RWA) với các trọng số rủi ro cố định: 0% (tiền mặt, trái phiếu chính phủ), 20% (nợ ngân hàng OECD), 50% (cho vay thế chấp nhà ở), 100% (cho vay thương mại, doanh nghiệp).",
        "Quy định Tỷ lệ an toàn vốn tối thiểu (Capital Adequacy Ratio - CAR) đạt ít nhất **8%**: `CAR = (Vốn cấp 1 + Vốn cấp 2) / RWA >= 8%`."
      ],
      limitations: [
        "Chỉ tập trung vào Rủi ro Tín dụng, bỏ qua Rủi ro Thị trường và Rủi ro Hoạt động.",
        "Trọng số rủi ro quá đơn giản và mang tính cào bằng (ví dụ: cho vay doanh nghiệp xếp hạng tín dụng tốt AAA hay doanh nghiệp yếu đều chịu trọng số rủi ro 100%).",
        "Tạo cơ hội cho việc 'lách luật' cấu trúc bảng cân đối kế toán (Regulatory Arbitrage) thông qua chứng khoán hóa tài sản."
      ]
    },
    {
      id: "basel-ii",
      year: "2004",
      title: "Basel II - Ba trụ cột vững chắc",
      context: "Được công bố nhằm khắc phục các lỗ hổng của Basel I, đặc biệt là tính cào bằng trong đo lường rủi ro tín dụng và sự xuất hiện của các loại rủi ro mới trong kỷ nguyên tài chính số.",
      objective: "Nâng cao chất lượng quản trị rủi ro bằng cách đưa ra cấu trúc 3 trụ cột toàn diện và đo lường rủi ro chính xác, nhạy cảm hơn.",
      keyRules: [
        "**Trụ cột 1 (Pillar 1) - Yêu cầu vốn tối thiểu**: Bổ sung thêm Rủi ro Thị trường (Market Risk) và Rủi ro Hoạt động (Operational Risk) vào mẫu số RWA. Phương thức tính RWA tín dụng linh hoạt hơn (Phương pháp Chuẩn hóa SA hoặc Phương pháp Đánh giá nội bộ IRB). `CAR = Vốn / (RWA Tín dụng + RWA Thị trường + RWA Hoạt động) >= 8%`.",
        "**Trụ cột 2 (Pillar 2) - Giám sát của cơ quan quản lý (ICAAP)**: Yêu cầu ngân hàng tự đánh giá mức độ đủ vốn nội bộ đối với toàn bộ các rủi ro (bao gồm cả rủi ro danh tiếng, rủi ro lãi suất trên sổ ngân hàng...) và cơ quan quản lý giám sát quy trình này.",
        "**Trụ cột 3 (Pillar 3) - Kỷ luật thị trường**: Yêu cầu công khai thông tin định kỳ về cơ cấu vốn, mức độ nhạy cảm rủi ro và các chỉ số tài chính để thị trường và các nhà đầu tư cùng giám sát."
      ],
      limitations: [
        "Vẫn chưa quản lý tốt rủi ro thanh khoản hệ thống.",
        "Mô hình đánh giá rủi ro nội bộ (IRB) có tính chu kỳ cao (Pro-cyclicality) - trong thời kỳ kinh tế tốt, rủi ro đánh giá thấp nên ngân hàng cho vay nhiều, khi kinh tế suy thoái rủi ro tăng cao buộc ngân hàng siết chặt cho vay, làm trầm trọng thêm khủng hoảng tài chính toàn cầu 2007-2008."
      ]
    },
    {
      id: "basel-iii",
      year: "2010",
      title: "Basel III - Lá chắn khủng hoảng thanh khoản",
      context: "Được xây dựng trực tiếp sau cuộc khủng hoảng tài chính toàn cầu năm 2007 - 2008, khi nhiều ngân hàng lớn sụp đổ do cạn kiệt thanh khoản dù vẫn đạt tỷ lệ CAR danh nghĩa rất cao theo Basel II.",
      objective: "Củng cố năng lực chống đỡ của hệ thống ngân hàng toàn cầu bằng cách nâng cao chất lượng vốn, thiết lập các đệm dự phòng vốn và giới hạn thanh khoản bắt buộc.",
      keyRules: [
        "**Nâng cao chất lượng vốn**: Thắt chặt định nghĩa vốn tự có, tập trung vào Vốn cổ phần phổ thông cấp 1 (CET1 >= 4.5%), Vốn cấp 1 (Tier 1 >= 6.0%) và Tổng vốn tối thiểu (CAR >= 8%).",
        "**Thiết lập Đệm dự phòng vốn**: Bổ sung Đệm bảo toàn vốn (Capital Conservation Buffer - CCB) cố định **2.5%** bằng CET1 (nâng tổng CAR tối thiểu lên **10.5%** để tránh bị hạn chế chia cổ tức/thưởng), và Đệm vốn chống chu kỳ (Countercyclical Capital Buffer - CCyB) từ **0% - 2.5%** áp dụng khi tăng trưởng tín dụng quá nóng.",
        "**Giới hạn Tỷ lệ Đòn bẩy phi rủi ro (Leverage Ratio)**: Đặt tỷ lệ tối thiểu **3%** (Vốn cấp 1 / Tổng tài sản và cam kết ngoại bảng không trọng số rủi ro) nhằm ngăn chặn việc sử dụng đòn bẩy quá mức.",
        "**Quy định Tỷ lệ Thanh khoản bắt buộc**: Đưa ra 2 chỉ số thanh khoản quan trọng là **LCR** (Tỷ lệ khả năng chi trả thanh khoản - đảm bảo tài sản thanh khoản cao HQLA đủ sống sót qua 30 ngày khủng hoảng, yêu cầu >= 100%) và **NSFR** (Tỷ lệ nguồn vốn ổn định ròng - đảm bảo cơ cấu nguồn vốn ổn định trong vòng 1 năm, yêu cầu >= 100%)"
      ],
      limitations: [
        "Tăng đáng kể chi phí tuân thủ và vận hành của ngân hàng.",
        "Có thể làm giảm tốc độ tăng trưởng tín dụng trong ngắn hạn do các yêu cầu khắt khe về đệm vốn và thanh khoản ổn định."
      ]
    },
    {
      id: "basel-iv",
      year: "2023+",
      title: "Basel IV - Chuẩn hóa và Minh bạch hóa",
      context: "Thực chất là các cải cách bổ sung cho Basel III (thường được gọi là Basel III Reforms), có hiệu lực dần từ năm 2023 đến 2028 nhằm giải quyết sự thiếu nhất quán trong việc áp dụng mô hình nội bộ giữa các ngân hàng toàn cầu.",
      objective: "Hạn chế tính tùy biến của các mô hình nội bộ của ngân hàng, tăng tính so sánh giữa các tổ chức tài chính.",
      keyRules: [
        "Áp dụng sàn đầu ra (Output Floor) ở mức **72.5%** - nghĩa là RWA tính theo mô hình nội bộ của ngân hàng không được phép thấp hơn 72.5% so với RWA tính theo phương pháp chuẩn hóa thông thường.",
        "Hạn chế việc áp dụng phương pháp Đánh giá nội bộ nâng cao (Advanced IRB) cho một số loại tài sản khó đo lường (như nợ của các doanh nghiệp lớn hoặc các tổ chức tài chính).",
        "Chuẩn hóa phương pháp tính Rủi ro Hoạt động (loại bỏ phương pháp đo lường nâng cao AMA, thay bằng phương pháp chuẩn hóa duy nhất dựa trên thu nhập và lịch sử tổn thất)."
      ],
      limitations: [
        "Tác động lớn đến các ngân hàng lớn ở Châu Âu - nơi đang áp dụng mạnh mẽ các mô hình nội bộ để tối ưu hóa RWA.",
        "Tiếp tục thắt chặt điều kiện tín dụng đối với một số lĩnh vực đặc thù."
      ]
    }
  ],

  // Bảng so sánh
  comparison: {
    headers: ["Tiêu chí", "Basel I (1988)", "Basel II (2004)", "Basel III (2010)", "Basel IV / Cải cách III (2023+)"],
    rows: [
      {
        criterion: "Trọng tâm chính",
        basel1: "Vốn tối thiểu phòng ngừa Rủi ro Tín dụng.",
        basel2: "Cấu trúc 3 Trụ cột, nhạy cảm rủi ro hơn, bổ sung Rủi ro Vận hành và Thị trường.",
        basel3: "Tăng chất lượng vốn, Đệm dự phòng vốn, Quản trị thanh khoản và Đòn bẩy tài chính.",
        basel4: "Chuẩn hóa tính toán RWA, hạn chế sự sai khác của các mô hình nội bộ (Sàn đầu ra 72.5%)."
      },
      {
        criterion: "Tỷ lệ vốn tối thiểu (CAR)",
        basel1: "Tổng Vốn / RWA >= 8% (Chỉ tính RWA Tín dụng)",
        basel2: "Tổng Vốn / RWA >= 8% (RWA gồm Tín dụng + Thị trường + Hoạt động)",
        basel3: "CAR tối thiểu 8% + Đệm bảo toàn vốn (CCB) 2.5% = 10.5%. Tỷ lệ CET1 tối thiểu tăng từ 2% lên 4.5% (7% gồm CCB).",
        basel4: "Giữ nguyên các tỷ lệ tối thiểu của Basel III nhưng thay đổi cách tính mẫu số (RWA)."
      },
      {
        criterion: "Loại rủi ro bao phủ",
        basel1: "Rủi ro Tín dụng (Credit Risk)",
        basel2: "Rủi ro Tín dụng, Rủi ro Thị trường (Market Risk), Rủi ro Hoạt động (Operational Risk)",
        basel3: "Tất cả của Basel II + Rủi ro điều chỉnh giá trị tín dụng (CVA), rủi ro thanh khoản hệ thống.",
        basel4: "Tiếp tục chuẩn hóa sâu sắc cách tính RWA của cả 3 loại rủi ro trên."
      },
      {
        criterion: "Đệm vốn dự phòng",
        basel1: "Không có",
        basel2: "Không có",
        basel3: "Có (Đệm bảo toàn CCB 2.5% và Đệm chống chu kỳ CCyB 0 - 2.5%)",
        basel4: "Có (Thừa hưởng từ Basel III và siết chặt hơn với các ngân hàng lớn toàn cầu G-SIBs)"
      },
      {
        criterion: "Yêu cầu Thanh khoản",
        basel1: "Không quy định định lượng cụ thể",
        basel2: "Không quy định định lượng cụ thể (chủ yếu giám sát định tính ở Trụ cột 2)",
        basel3: "Bắt buộc: LCR (ngắn hạn 30 ngày) >= 100% và NSFR (dài hạn 1 năm) >= 100%",
        basel4: "Duy trì và tối ưu hóa các chỉ số thanh khoản LCR và NSFR"
      },
      {
        criterion: "Tỷ lệ đòn bẩy (Leverage Ratio)",
        basel1: "Không quy định",
        basel2: "Không quy định",
        basel3: "Tối thiểu 3% (Vốn cấp 1 / Tổng tài sản và cam kết ngoại bảng không trọng số rủi ro)",
        basel4: "Tối thiểu 3% (Bổ sung đệm tỷ lệ đòn bẩy đối với các ngân hàng G-SIBs)"
      }
    ]
  },

  // Câu hỏi trắc nghiệm
  quizzes: [
    {
      question: "Tỷ lệ an toàn vốn tối thiểu (CAR) quy định tại Basel I là bao nhiêu phần trăm và dựa trên rủi ro nào?",
      options: [
        "8%, dựa trên rủi ro tín dụng và rủi ro thị trường",
        "8%, chỉ dựa trên rủi ro tín dụng",
        "10.5%, dựa trên rủi ro tín dụng và rủi ro hoạt động",
        "4.5%, chỉ dựa trên rủi ro tín dụng"
      ],
      answer: 1,
      explanation: "Basel I (1988) quy định tỷ lệ CAR tối thiểu là 8% và chỉ tập trung duy nhất vào đo lường Rủi ro Tín dụng (Credit Risk) dựa trên mẫu số RWA tương đối đơn giản."
    },
    {
      question: "Ba trụ cột (3 Pillars) được giới thiệu lần đầu tiên trong phiên bản Basel nào?",
      options: [
        "Basel I",
        "Basel II",
        "Basel III",
        "Basel IV"
      ],
      answer: 1,
      explanation: "Basel II (2004) thiết lập cấu trúc 3 Trụ cột toàn diện: Trụ cột 1 - Yêu cầu vốn tối thiểu; Trụ cột 2 - Giám sát của cơ quan quản lý (ICAAP); Trụ cột 3 - Kỷ luật thị trường (Công bố thông tin công khai)."
    },
    {
      question: "Trụ cột 1 của Basel II bổ sung thêm những loại rủi ro nào vào tính toán RWA so với Basel I?",
      options: [
        "Rủi ro Thanh khoản và Rủi ro Lãi suất",
        "Rủi ro Tín dụng và Rủi ro Tập trung",
        "Rủi ro Thị trường và Rủi ro Hoạt động (Vận hành)",
        "Rủi ro Danh tiếng và Rủi ro Pháp lý"
      ],
      answer: 2,
      explanation: "Trụ cột 1 của Basel II yêu cầu tính toán vốn tối thiểu cho 3 loại rủi ro: Rủi ro Tín dụng, Rủi ro Thị trường, và Rủi ro Hoạt động (Operational Risk)."
    },
    {
      question: "Vì sao Basel III lại giới thiệu các đệm vốn dự phòng như Đệm bảo toàn vốn (Capital Conservation Buffer - CCB)?",
      options: [
        "Để tăng lợi nhuận cho các cổ đông ngân hàng",
        "Để khuyến khích ngân hàng cho vay bất động sản nhiều hơn",
        "Để buộc ngân hàng tích lũy vốn trong thời kỳ kinh tế bình thường, giúp hấp thụ tổn thất tốt hơn khi khủng hoảng xảy ra",
        "Để giảm thiểu thủ tục hành chính khi báo cáo tài chính"
      ],
      answer: 2,
      explanation: "Đệm vốn CCB (2.5% bằng vốn cổ phần thường CET1) giúp ngân hàng tích trữ vốn trong giai đoạn kinh tế thuận lợi, để khi gặp khó khăn, ngân hàng có thể hấp thụ tổn thất mà không bị rơi xuống dưới mức tối thiểu 8%, tránh nguy cơ sụp đổ dây chuyền."
    },
    {
      question: "Tỷ lệ đòn bẩy (Leverage Ratio) tối thiểu 3% được giới thiệu ở Basel III có đặc điểm gì nổi bật?",
      options: [
        "Được tính toán bằng cách chia Vốn cấp 1 cho Tổng tài sản và cam kết ngoại bảng không điều chỉnh trọng số rủi ro (RWA)",
        "Được tính dựa trên tài sản có rủi ro cao nhất",
        "Chỉ áp dụng cho các khoản vay tiêu dùng cá nhân",
        "Là một chỉ số tùy chọn, không bắt buộc tuân thủ"
      ],
      answer: 0,
      explanation: "Tỷ lệ đòn bẩy là một công cụ phi rủi ro (non-risk-based measure) bổ trợ cho tỷ lệ CAR, được tính bằng Vốn cấp 1 / Tổng tài sản (gồm cả ngoại bảng) mà KHÔNG nhân trọng số rủi ro, nhằm ngăn chặn việc tích tụ đòn bẩy quá mức mà CAR không phản ánh hết được."
    },
    {
      question: "Trong Basel III, hai tỷ lệ thanh khoản mới nào được bắt buộc áp dụng để ngăn ngừa khủng hoảng thanh khoản hệ thống?",
      options: [
        "Tỷ lệ dự trữ bắt buộc và Tỷ lệ khả năng chi trả nhanh",
        "Chỉ số LCR (thanh khoản ngắn hạn 30 ngày) và NSFR (nguồn vốn ổn định ròng dài hạn 1 năm)",
        "Tỷ lệ nợ xấu NPL và Tỷ lệ biên lãi ròng NIM",
        "Tỷ lệ vốn khả dụng và Tỷ lệ tăng trưởng tín dụng tối đa"
      ],
      answer: 1,
      explanation: "Basel III bổ sung hai tiêu chuẩn thanh khoản định lượng: LCR (Liquidity Coverage Ratio - sống sót trong 30 ngày khủng hoảng) và NSFR (Net Stable Funding Ratio - đảm bảo cân đối nguồn vốn ổn định trong vòng 1 năm), cả hai đều yêu cầu tối thiểu >= 100%."
    },
    {
      question: "Đệm vốn chống chu kỳ (Countercyclical Capital Buffer - CCyB) trong Basel III dao động trong khoảng nào và do ai quyết định?",
      options: [
        "Cố định ở mức 2.5% do Hiệp hội ngân hàng quyết định",
        "Dao động từ 0% đến 2.5% do Ngân hàng Trung ương hoặc cơ quan quản lý quốc gia quyết định tùy thuộc tình hình vĩ mô",
        "Từ 1% đến 5% do Tổng giám đốc các ngân hàng tự thỏa thuận",
        "Cố định ở mức 8% do Ủy ban Basel kiểm soát trực tiếp"
      ],
      answer: 1,
      explanation: "CCyB dao động từ 0% đến 2.5% (bằng CET1), được áp dụng bởi các cơ quan quản lý quốc gia trong thời kỳ tín dụng tăng trưởng quá nóng để giảm bớt rủi ro hệ thống tích tụ và xả ra khi nền kinh tế suy thoái."
    },
    {
      question: "Điểm cốt lõi của cải cách Basel IV (Basel III Reforms - hiệu lực 2023+) là gì?",
      options: [
        "Xóa bỏ hoàn toàn khái niệm Vốn cấp 2",
        "Áp dụng sàn đầu ra (Output Floor) 72.5% nhằm chuẩn hóa và hạn chế sự tối ưu hóa RWA quá mức từ các mô hình nội bộ của ngân hàng",
        "Hạ thấp tỷ lệ CAR tối thiểu xuống 6% để hỗ trợ doanh nghiệp",
        "Thay thế hoàn toàn cấu trúc 3 trụ cột của Basel II"
      ],
      answer: 1,
      explanation: "Basel IV đưa ra cơ chế sàn đầu ra (Output Floor) ở mức 72.5%, quy định RWA tính theo mô hình nội bộ nâng cao của ngân hàng không được phép thấp hơn 72.5% so với cách tính theo phương pháp chuẩn hóa tiêu chuẩn. Điều này giúp ngăn chặn các ngân hàng 'làm đẹp' chỉ số bằng mô hình toán học nội bộ phức tạp."
    }
  ]
};

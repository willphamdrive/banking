// Dữ liệu lý thuyết và bài tập trắc nghiệm về Basel Accords (Basel I, II, III) và Luật Ngân hàng Việt Nam
const BASEL_DATA = {
  // Dòng thời gian tiến hóa
  timeline: [
    {
      id: "basel-i",
      year: "1988",
      title: "Basel I - Khởi đầu tỷ lệ an toàn vốn",
      sourceUrl: "docs/basel_i.pdf",
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
      sourceUrl: "docs/basel_ii.pdf",
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
      sourceUrl: "docs/basel_iii_capital.pdf",
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
      sourceUrl: "docs/basel_iv.pdf",
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

  // Câu hỏi trắc nghiệm Basel
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
  ],

  // Dữ liệu Văn bản Pháp luật Việt Nam
  laws: [
    {
      id: "law-tctd-2024",
      type: "Luật",
      code: "Luật số 32/2024/QH15",
      title: "Luật Các tổ chức tín dụng 2024",
      category: "core",
      sourceUrl: "docs/luat_tctd_2024.pdf",
      summary: "Đây là văn bản luật tối cao điều chỉnh việc thành lập, tổ chức, hoạt động, kiểm soát đặc biệt, tổ chức lại, giải thể các tổ chức tín dụng tại Việt Nam, thay thế Luật 2010.",
      effectDate: "01/07/2024",
      highlights: [
        "**Giảm tỷ lệ sở hữu cổ phần**: Giảm giới hạn sở hữu của cổ đông cá nhân từ 5% xuống **10%** đối với cổ đông tổ chức (không quá 15% đối với nhóm người có liên quan) nhằm chống sở hữu chéo và thao túng ngân hàng.",
        "**Giảm giới hạn cấp tín dụng**: Giảm dần giới hạn cho vay đối với một khách hàng từ 15% xuống **10%** vốn tự có, và một nhóm khách hàng liên quan từ 20% xuống **15%** vốn tự có (lộ trình giảm dần từ 2024 đến 2029).",
        "**Công khai thông tin cổ đông**: Bắt buộc công bố thông tin cổ đông sở hữu từ **1%** vốn điều lệ trở lên kèm người có liên quan để tăng tính minh bạch.",
        "**Quy chế kiểm soát đặc biệt**: Quy định rõ ràng hơn các biện pháp can thiệp sớm và xử lý khẩn cấp khi ngân hàng có dấu hiệu mất thanh khoản."
      ]
    },
    {
      id: "law-nhnn-2010",
      type: "Luật",
      code: "Luật số 46/2010/QH12",
      title: "Luật Ngân hàng Nhà nước Việt Nam 2010",
      category: "core",
      sourceUrl: "docs/luat_nhnn_2010.pdf",
      summary: "Quy định về tổ chức và hoạt động của Ngân hàng Nhà nước Việt Nam (NHNN) - cơ quan vị thế Thống đốc, chịu trách nhiệm quản lý nhà nước về tiền tệ và hoạt động ngân hàng.",
      effectDate: "01/01/2011",
      highlights: [
        "Xác định NHNN là Ngân hàng trung ương của nước Cộng hòa xã hội chủ nghĩa Việt Nam, thực hiện chức năng phát hành tiền, ngân hàng của các ngân hàng và ngân hàng đại lý cho Chính phủ.",
        "Quy định mục tiêu xây dựng và thực thi Chính sách tiền tệ quốc gia nhằm ổn định giá trị đồng tiền, kiểm soát lạm phát, góp phần thúc đẩy phát triển kinh tế.",
        "Quy định thẩm quyền thanh tra, giám sát ngân hàng và quyền can thiệp, áp dụng các biện pháp xử lý để đảm bảo an toàn hệ thống tài chính."
      ]
    },
    {
      id: "tt-41-2016",
      type: "Thông tư",
      code: "Thông tư 41/2016/TT-NHNN",
      category: "safety",
      title: "Quy định tỷ lệ an toàn vốn (CAR) theo chuẩn Basel II",
      sourceUrl: "docs/thong_tu_41_2016.pdf",
      summary: "Thông tư cốt lõi nội địa hóa Trụ cột 1 của chuẩn mực Basel II tại Việt Nam, áp dụng phương pháp chuẩn hóa đối với các ngân hàng thương mại.",
      effectDate: "01/01/2020",
      highlights: [
        "Quy định tỷ lệ CAR tối thiểu tại Việt Nam là **8%** (thay vì 9% trước đây theo Thông tư 13/36, phù hợp với thông lệ thế giới của Basel II).",
        "Công thức tính RWA chi tiết gồm cả 3 cấu phần: RWA Tín dụng, RWA Thị trường, RWA Hoạt động.",
        "Hướng dẫn chi tiết trọng số rủi ro tài sản tín dụng nhạy cảm hơn: Trái phiếu chính phủ (0%), nợ ngân hàng khác từ 20-50%, cho vay mua nhà ở xã hội từ 30-50% tùy tỷ lệ LTV, cho vay tiêu dùng thông thường chịu trọng số cao 100-150%."
      ]
    },
    {
      id: "tt-22-2023",
      type: "Thông tư",
      code: "Thông tư 22/2023/TT-NHNN",
      category: "safety",
      title: "Sửa đổi, bổ sung Thông tư 41/2016/TT-NHNN về tỷ lệ an toàn vốn",
      sourceUrl: "docs/thong_tu_22_2023.pdf",
      summary: "Thông tư sửa đổi, bổ sung một số điều về việc tính trọng số rủi ro tài sản đối với các khoản cho vay mua nhà, cho vay tiêu dùng và dự án bất động sản.",
      effectDate: "01/07/2024",
      highlights: [
        "**Ưu đãi cho vay nhà ở xã hội**: Áp dụng trọng số rủi ro ưu đãi từ **30% đến 50%** đối với các khoản cho vay mua nhà ở xã hội và nhà ở theo chương trình hỗ trợ của Chính phủ.",
        "**Thế chấp bất động sản chặt chẽ**: Quy định chi tiết các điều kiện để khoản cho vay được coi là cho vay thế chấp nhà (nhà đã hoàn thành bàn giao, nguồn trả nợ không phải từ tiền cho thuê nhà hình thành từ khoản vay).",
        "**Khuyến khích hạ tầng công nghiệp**: Điều chỉnh giảm trọng số rủi ro đối với khoản cấp tín dụng cho dự án bất động sản khu công nghiệp xuống **160%** (so với 200% trước đây)."
      ]
    },
    {
      id: "tt-14-2025",
      type: "Thông tư",
      code: "Thông tư 14/2025/TT-NHNN",
      category: "safety",
      title: "Quy định mới về tỷ lệ an toàn vốn đối với ngân hàng thương mại",
      sourceUrl: "docs/thong_tu_14_2025.pdf",
      summary: "Thông tư mới nhất ban hành giữa năm 2025 nhằm hoàn thiện khung tỷ lệ an toàn vốn (CAR) phù hợp với xu hướng chuẩn bị triển khai Basel III tại Việt Nam.",
      effectDate: "30/06/2025",
      highlights: [
        "**Cập nhật quy chuẩn tính RWA**: Hoàn thiện các phương pháp tính tài sản có rủi ro nhạy cảm hơn, đồng bộ hóa hệ số rủi ro với Luật Các TCTD 2024 mới nhất.",
        "**Ngoại trừ ngân hàng đặc biệt**: Quy định không áp dụng tỷ lệ an toàn vốn đối với ngân hàng thương mại được kiểm soát đặc biệt hoặc đang trong giai đoạn can thiệp sớm.",
        "**Nâng cao năng lực phòng vệ**: Bổ sung các cấu phần đệm vốn bảo toàn và yêu cầu quản trị rủi ro thanh khoản nâng cao đi kèm với tỷ lệ an toàn vốn."
      ]
    },
    {
      id: "tt-22-2019",
      type: "Thông tư",
      code: "Thông tư 22/2019/TT-NHNN",
      category: "safety",
      title: "Quy định các giới hạn, tỷ lệ bảo đảm an toàn hoạt động",
      sourceUrl: "docs/thong_tu_22_2019.pdf",
      summary: "Quy định các giới hạn an toàn thực tế nhằm đảm bảo khả năng chi trả thanh khoản khẩn cấp và cơ cấu vốn ổn định của tổ chức tín dụng.",
      effectDate: "01/01/2020",
      highlights: [
        "**Tỷ lệ dư nợ cho vay so với tổng vốn huy động (LDR)** tối đa bắt buộc ở mức **85%** đối với tất cả các ngân hàng thương mại.",
        "**Tỷ lệ nguồn vốn ngắn hạn cho vay trung và dài hạn** bị siết chặt và giảm dần theo lộ trình để quản trị rủi ro kỳ hạn (hiện tại khống chế tối đa **30%**).",
        "Quy định **Tỷ lệ khả năng chi trả** trong vòng 24 giờ và Tỷ lệ trữ lượng thanh khoản tối thiểu 10%."
      ]
    },
    {
      id: "tt-11-2021",
      type: "Thông tư",
      code: "Thông tư 11/2021/TT-NHNN",
      category: "provision",
      title: "Quy định về phân loại tài sản có và trích lập dự phòng rủi ro",
      sourceUrl: "docs/thong_tu_11_2021.pdf",
      summary: "Vản bản hướng dẫn chi tiết cách xếp hạng tín dụng nội bộ, phân loại các nhóm nợ từ 1 đến 5 và tỷ lệ trích dự phòng tổn thất tín dụng tương ứng.",
      effectDate: "01/10/2021",
      highlights: [
        "**Phân loại 5 nhóm nợ chính**: Nhóm 1 (Nợ đủ tiêu chuẩn - quá hạn < 10 ngày); Nhóm 2 (Nợ cần chú ý - quá hạn 10-90 ngày); Nhóm 3 (Nợ dưới tiêu chuẩn - quá hạn 91-180 ngày); Nhóm 4 (Nợ nghi ngờ - quá hạn 181-360 ngày); Nhóm 5 (Nợ có khả năng mất vốn - quá hạn > 360 ngày).",
        "**Dự phòng cụ thể**: Quy định tỷ lệ trích lập bắt buộc theo từng nhóm nợ: Nhóm 1 (0%), Nhóm 2 (5%), Nhóm 3 (20%), Nhóm 4 (50%), Nhóm 5 (100%). Giá trị trích lập = (Dư nợ - Giá trị tài sản bảo đảm đã khấu trừ) x Tỷ lệ trích lập.",
        "**Dự phòng chung**: Yêu cầu trích lập **0.75%** trên tổng số dư nợ từ nhóm 1 đến nhóm 4 (ngoại trừ các khoản tiền gửi tại TCTD khác, trái phiếu chính phủ,...)."
      ]
    }
  ],

  // Trắc nghiệm Pháp luật Việt Nam
  lawQuizzes: [
    {
      question: "Theo Luật Các tổ chức tín dụng 2024 mới nhất, giới hạn cấp tín dụng tối đa cho một khách hàng của ngân hàng thương mại là bao nhiêu phần trăm vốn tự có?",
      options: [
        "15% vốn tự có",
        "10% vốn tự có",
        "5% vốn tự có",
        "20% vốn tự có"
      ],
      answer: 1,
      explanation: "Luật Các tổ chức tín dụng 2024 quy định giảm giới hạn cấp tín dụng của một khách hàng từ 15% (theo Luật 2010) xuống còn **10%** vốn tự có của ngân hàng thương mại (có lộ trình thực hiện từ 2024 đến 2029 để các ngân hàng điều chỉnh)."
    },
    {
      question: "Tỷ lệ an toàn vốn tối thiểu (CAR) bắt buộc đối với ngân hàng áp dụng Thông tư 41/2016/TT-NHNN tại Việt Nam là bao nhiêu?",
      options: [
        "9% theo Basel I",
        "10.5% bao gồm đệm vốn",
        "8% theo Basel II chuẩn hóa",
        "6% đối với vốn cấp 1"
      ],
      answer: 2,
      explanation: "Thông tư 41/2016/TT-NHNN nội địa hóa Basel II tại Việt Nam quy định tỷ lệ CAR tối thiểu là **8%**, tính dựa trên 3 loại rủi ro: Tín dụng, Thị trường, và Hoạt động."
    },
    {
      question: "Theo Thông tư 22/2019/TT-NHNN, tỷ lệ dư nợ cho vay so với tổng tiền gửi huy động (LDR) tối đa của ngân hàng thương mại Việt Nam là bao nhiêu?",
      options: [
        "80%",
        "85%",
        "90%",
        "75%"
      ],
      answer: 1,
      explanation: "Thông tư 22 quy định tỷ lệ LDR tối đa của các ngân hàng thương mại cổ phần, ngân hàng liên doanh, ngân hàng 100% vốn nước ngoài là **85%**."
    },
    {
      question: "Một khoản vay quá hạn thanh toán 120 ngày sẽ bị xếp vào nhóm nợ nào theo quy định tại Thông tư 11/2021/TT-NHNN?",
      options: [
        "Nhóm 2 - Nợ cần chú ý",
        "Nhóm 3 - Nợ dưới tiêu chuẩn",
        "Nhóm 4 - Nợ nghi ngờ",
        "Nhóm 5 - Nợ có khả năng mất vốn"
      ],
      answer: 1,
      explanation: "Nợ quá hạn từ 91 ngày đến 180 ngày thuộc định nghĩa của **Nhóm 3 (Nợ dưới tiêu chuẩn)**. Khoản nợ này bắt đầu bị tính là nợ xấu (NPL)."
    },
    {
      question: "Tỷ lệ trích lập dự phòng cụ thể đối với một khoản nợ thuộc nhóm 4 (Nợ nghi ngờ) theo Thông tư 11/2021/TT-NHNN là bao nhiêu?",
      options: [
        "20%",
        "50%",
        "100%",
        "5%"
      ],
      answer: 1,
      explanation: "Tỷ lệ trích lập dự phòng cụ thể quy định tại Thông tư 11 đối với nợ nhóm 4 (Nợ nghi ngờ) là **50%**. Đối với nợ nhóm 3 là 20%, nợ nhóm 5 là 100%."
    },
    {
      question: "Tỷ lệ trích lập dự phòng chung bắt buộc đối với dư nợ từ Nhóm 1 đến Nhóm 4 (ngoại trừ các tài sản được loại trừ) là bao nhiêu?",
      options: [
        "0.50%",
        "0.75%",
        "1.00%",
        "2.00%"
      ],
      answer: 1,
      explanation: "Thông tư 11/2021/TT-NHNN quy định tỷ lệ trích lập dự phòng chung là **0.75%** trên tổng số dư các khoản nợ từ nhóm 1 đến nhóm 4."
    },
    {
      question: "Theo Luật Các tổ chức tín dụng 2024, một cổ đông là tổ chức không được sở hữu vượt quá bao nhiêu phần trăm vốn điều lệ của một TCTD (trừ một số trường hợp đặc biệt)?",
      options: [
        "5% vốn điều lệ",
        "10% vốn điều lệ",
        "15% vốn điều lệ",
        "20% vốn điều lệ"
      ],
      answer: 1,
      explanation: "Luật Các tổ chức tín dụng 2024 quy định cổ đông tổ chức không được sở hữu vượt quá **10%** vốn điều lệ của một TCTD (Luật 2010 quy định giới hạn này là 15%). Điều này giúp hạn chế mức độ tập trung quyền lực và rủi ro sở hữu chéo."
    }
  ]
};

// Phụ lục thuật ngữ - Cơ sở dữ liệu và Logic lọc tìm kiếm

const GLOSSARY_TERMS = [
  {
    id: "car",
    term: "CAR (Capital Adequacy Ratio)",
    vietnamese: "Tỷ lệ an toàn vốn",
    category: "risk",
    definition: "Tỷ lệ đo lường năng lực tài chính và mức độ an toàn của một ngân hàng, biểu thị khả năng tự bảo vệ trước các rủi ro tổn thất tài chính.",
    explanation: "Được tính bằng tỷ lệ phần trăm giữa Vốn tự có hợp lệ so với Tổng tài sản có rủi ro (RWA). Theo quy chuẩn Basel II/III và Thông tư 41/2016/TT-NHNN của Việt Nam, tỷ lệ CAR tối thiểu bắt buộc là 8.00%.",
    formula: "CAR = [Vốn tự có / Tổng tài sản có rủi ro (RWA)] x 100%"
  },
  {
    id: "rwa",
    term: "RWA (Risk-Weighted Assets)",
    vietnamese: "Tài sản có rủi ro",
    category: "risk",
    definition: "Tổng giá trị tài sản nội bảng và ngoại bảng của ngân hàng được điều chỉnh bằng các hệ số rủi ro tương ứng.",
    explanation: "Tài sản có rủi ro bao gồm ba cấu phần rủi ro chính được đo lường riêng biệt: Rủi ro Tín dụng, Rủi ro Hoạt động, và Rủi ro Thị trường. Hệ số rủi ro áp dụng tùy thuộc vào loại khách hàng vay, xếp hạng tín dụng, và tài sản bảo đảm.",
    formula: "RWA = RWA (Tín dụng) + [12.5 x (Vốn yêu cầu cho rủi ro hoạt động + Rủi ro thị trường)]"
  },
  {
    id: "tier1",
    term: "Vốn cấp 1 (Tier 1 Capital)",
    vietnamese: "Vốn cấp 1 / Vốn cơ bản",
    category: "risk",
    definition: "Phần vốn cốt lõi và chất lượng nhất của ngân hàng, có khả năng hấp thụ rủi ro tổn thất ngay cả khi ngân hàng vẫn đang hoạt động bình thường.",
    explanation: "Bao gồm chủ yếu là vốn điều lệ thực góp, thặng dư vốn cổ phần, các quỹ dự trữ tích lũy từ lợi nhuận và lợi nhuận chưa phân phối. Đây là bộ đệm vốn quan trọng nhất để duy trì niềm tin của người gửi tiền.",
    formula: "Vốn cấp 1 = Vốn điều lệ + Các quỹ dự trữ + Lợi nhuận giữ lại - Các khoản giảm trừ"
  },
  {
    id: "tier2",
    term: "Vốn cấp 2 (Tier 2 Capital)",
    vietnamese: "Vốn cấp 2 / Vốn bổ sung",
    category: "risk",
    definition: "Cấu phần vốn bổ sung chất lượng thấp hơn vốn cấp 1, dùng để hấp thụ tổn thất của ngân hàng khi có nguy cơ phá sản.",
    explanation: "Bao gồm nợ thứ cấp có kỳ hạn dài (đáp ứng điều kiện chuyển đổi hoặc giảm giá trị khi xảy ra sự kiện vi phạm), dự phòng chung (tối đa 1.25% tài sản rủi ro tín dụng) và các công cụ lai hỗn hợp.",
    formula: "Vốn cấp 2 = Nợ thứ cấp đủ điều kiện + Dự phòng chung (tối đa 1.25% RWA tín dụng)"
  },
  {
    id: "ldr",
    term: "LDR (Loan-to-Deposit Ratio)",
    vietnamese: "Tỷ lệ dư nợ cho vay trên tổng vốn huy động",
    category: "vietnam",
    definition: "Tỷ lệ kiểm soát giới hạn rủi ro thanh khoản của ngân hàng thương mại tại Việt Nam, đánh giá cân đối giữa hoạt động cho vay và nguồn vốn huy động ổn định.",
    explanation: "Được quy định chi tiết tại Thông tư 22/2019/TT-NHNN. Hiện tại, NHNN áp dụng trần tỷ lệ LDR tối đa là 85% cho tất cả các ngân hàng thương mại.",
    formula: "LDR = [Tổng dư nợ cho vay / (Huy động thị trường 1 + Phát hành giấy tờ có giá)] x 100% <= 85%"
  },
  {
    id: "sfl",
    term: "SFL (Short-term Funds for Medium/Long-term Loans)",
    vietnamese: "Tỷ lệ nguồn vốn ngắn hạn cho vay trung và dài hạn",
    category: "vietnam",
    definition: "Tỷ lệ an toàn thanh khoản quy định nhằm hạn chế rủi ro chênh lệch kỳ hạn (Maturity Mismatch), kiểm soát việc ngân hàng dùng vốn huy động ngắn hạn để cho vay trung và dài hạn.",
    explanation: "Được quản lý theo lộ trình siết chặt của Ngân hàng Nhà nước để tăng cường tính ổn định của hệ thống ngân hàng (trần giới hạn tối đa hiện tại áp dụng là 30%). Theo quy định điều chỉnh linh hoạt gần đây của NHNN, tỷ lệ này có thể được điều chỉnh tăng lên để hỗ trợ tăng trưởng tín dụng tùy theo tình hình kinh tế.",
    formula: "SFL = [Dư nợ cho vay trung dài hạn từ nguồn vốn ngắn hạn / Nguồn vốn ngắn hạn huy động] x 100% <= 30%"
  },
  {
    id: "lcr",
    term: "LCR (Liquidity Coverage Ratio)",
    vietnamese: "Tỷ lệ khả năng chi trả thanh khoản",
    category: "basel",
    definition: "Chỉ số an toàn thanh khoản ngắn hạn theo chuẩn Basel III, bảo đảm ngân hàng duy trì đủ tài sản có tính thanh khoản cao (HQLA) để đáp ứng nhu cầu rút tiền trong 30 ngày khủng hoảng.",
    explanation: "Tài sản có tính thanh khoản cao phải bao gồm tiền mặt, tiền gửi tại Ngân hàng Trung ương và các trái phiếu chính phủ có độ rủi ro cực thấp.",
    formula: "LCR = [Tài sản thanh khoản chất lượng cao (HQLA) / Tổng dòng tiền ra ròng trong 30 ngày] x 100% >= 100%"
  },
  {
    id: "nsfr",
    term: "NSFR (Net Stable Funding Ratio)",
    vietnamese: "Tỷ lệ nguồn vốn ổn định ròng",
    category: "basel",
    definition: "Chỉ số an toàn thanh khoản dài hạn theo chuẩn Basel III nhằm đảm bảo cấu trúc nguồn vốn của ngân hàng có tính bền vững trong vòng 1 năm.",
    explanation: "Ngân hàng phải hạn chế việc lấy nguồn vốn ngắn hạn có tính biến động cao để tài trợ cho các tài sản dài hạn (như các khoản cho vay mua nhà dài hạn).",
    formula: "NSFR = [Nguồn vốn ổn định thực tế (ASF) / Nguồn vốn ổn định yêu cầu (RSF)] x 100% >= 100%"
  },
  {
    id: "creditrisk",
    term: "Credit Risk",
    vietnamese: "Rủi ro tín dụng",
    category: "risk",
    definition: "Rủi ro phát sinh do khách hàng vay không thực hiện hoặc không có khả năng thực hiện một phần hoặc toàn bộ nghĩa vụ trả nợ gốc và lãi theo cam kết.",
    explanation: "Là nguồn rủi ro lớn nhất chiếm từ 80-90% tổng tài sản có rủi ro của ngân hàng thương mại Việt Nam. Đo lường theo Thông tư 41 bằng phương pháp tiêu chuẩn hóa (SA) hoặc phương pháp nội bộ (IRB) của Basel.",
    formula: "Tổn thất dự kiến (EL) = PD (Xác suất vỡ nợ) x LGD (Tỷ lệ tổn thất khi vỡ nợ) x EAD (Dư nợ tại thời điểm vỡ nợ)"
  },
  {
    id: "marketrisk",
    term: "Market Risk",
    vietnamese: "Rủi ro thị trường",
    category: "risk",
    definition: "Rủi ro phát sinh do những biến động bất lợi của lãi suất, tỷ giá, giá chứng khoán và giá hàng hóa trên thị trường tác động đến danh mục tự doanh của ngân hàng.",
    explanation: "Được quản lý thông qua các giới hạn trạng thái ngoại tệ, giới hạn trạng thái giao dịch nợ/vốn, và đo lường giá trị rủi ro tối đa (Value at Risk - VaR).",
    formula: "Yêu cầu vốn Rủi ro Thị trường = Vốn cho rủi ro lãi suất + rủi ro cổ phiếu + rủi ro tỷ giá + rủi ro hàng hóa"
  },
  {
    id: "operationalrisk",
    term: "Operational Risk",
    vietnamese: "Rủi ro hoạt động",
    category: "risk",
    definition: "Rủi ro gây ra tổn thất do các quy trình nội bộ không đầy đủ hoặc bị lỗi, do con người, lỗi hệ thống công nghệ, hoặc do các sự kiện bên ngoài.",
    explanation: "Bao gồm rủi ro pháp lý, rủi ro gian lận nội bộ và bên ngoài (ví dụ: hacker tấn công hệ thống thanh toán ngân hàng), không bao gồm rủi ro chiến lược và rủi ro uy tín.",
    formula: "Yêu cầu vốn rủi ro hoạt động = Chỉ số thu nhập hoạt động trung bình (GI) x Hệ số Alpha (thường là 15%)"
  },
  {
    id: "npl",
    term: "NPL (Non-Performing Loan)",
    vietnamese: "Tỷ lệ nợ xấu",
    category: "vietnam",
    definition: "Chỉ tiêu đánh giá chất lượng tài sản có tín dụng của ngân hàng thương mại, tỷ lệ nợ xấu trên tổng dư nợ cho vay.",
    explanation: "Theo quy định phân loại nợ của NHNN (Thông tư 11/2021/TT-NHNN), nợ xấu bao gồm các khoản nợ được phân loại vào Nhóm 3 (Nợ dưới chuẩn - quá hạn 91-180 ngày), Nhóm 4 (Nợ nghi ngờ - quá hạn 181-360 ngày) và Nhóm 5 (Nợ có khả năng mất vốn - quá hạn trên 360 ngày). Mục tiêu kiểm soát của NHNN thường là dưới 3.00%.",
    formula: "Tỷ lệ nợ xấu = [(Nợ Nhóm 3 + Nhóm 4 + Nhóm 5) / Tổng dư nợ cho vay] x 100%"
  },
  {
    id: "basel",
    term: "Các Hiệp ước Basel (Basel I, II, III)",
    vietnamese: "Khung tiêu chuẩn giám sát ngân hàng toàn cầu",
    category: "basel",
    definition: "Các bộ chuẩn mực an toàn vốn và thanh khoản ngân hàng do Ủy ban Basel về Giám sát Ngân hàng (BCBS) ban hành nhằm tăng cường sự ổn định của hệ thống tài chính toàn cầu.",
    explanation: "Basel I (1988) tập trung vào rủi ro tín dụng và CAR tối thiểu 8%. Basel II (2004) đưa ra cấu trúc 3 trụ cột (Vốn tối thiểu, Giám sát, Kỷ luật thị trường) mở rộng rủi ro hoạt động và thị trường. Basel III (2010) siết chặt chất lượng vốn tự có và bổ sung các chỉ số an toàn thanh khoản đề phòng khủng hoảng hệ thống.",
    formula: "Lộ trình tiến hóa: Basel I -> Basel II (3 Trụ cột) -> Basel III (Siết chất lượng vốn & thanh khoản)"
  },
  {
    id: "nim",
    term: "NIM (Net Interest Margin)",
    vietnamese: "Biên lãi ròng",
    category: "vietnam",
    definition: "Tỷ lệ đo lường sự chênh lệch giữa thu nhập lãi thuần của ngân hàng và lượng tài sản sinh lời trung bình.",
    explanation: "Chỉ số này phản ánh hiệu quả sử dụng nguồn vốn và biên lợi nhuận của hoạt động tín dụng cốt lõi của ngân hàng thương mại.",
    formula: "NIM = [Thu nhập lãi thuần / Tài sản sinh lời trung bình] x 100%"
  },
  {
    id: "casa",
    term: "CASA (Current Account Saving Account)",
    vietnamese: "Tiền gửi không kỳ hạn",
    category: "vietnam",
    definition: "Tỷ lệ tiền gửi không kỳ hạn trong tổng tiền gửi của khách hàng tại ngân hàng thương mại.",
    explanation: "CASA là nguồn vốn giá rẻ quan trọng giúp ngân hàng tối ưu hóa chi phí vốn (COF), gia tăng NIM và lợi thế cạnh tranh. TCB và MBB thường dẫn đầu về CASA tại Việt Nam.",
    formula: "Tỷ lệ CASA = [Tiền gửi không kỳ hạn / Tổng tiền gửi khách hàng] x 100%"
  },
  {
    id: "cir",
    term: "CIR (Cost-to-Income Ratio)",
    vietnamese: "Tỷ lệ chi phí trên thu nhập",
    category: "vietnam",
    definition: "Chỉ số đo lường hiệu quả hoạt động của ngân hàng, tính bằng tỷ lệ chi phí hoạt động so với tổng thu nhập hoạt động.",
    explanation: "Chỉ số CIR càng thấp chứng tỏ ngân hàng hoạt động càng hiệu quả và quản lý chi phí vận hành tốt.",
    formula: "CIR = [Chi phí hoạt động / Tổng thu nhập hoạt động] x 100%"
  },
  {
    id: "llcr",
    term: "LLCR (Loan Loss Coverage Ratio)",
    vietnamese: "Tỷ lệ bao phủ nợ xấu",
    category: "vietnam",
    definition: "Tỷ lệ dự phòng rủi ro tín dụng cụ thể và dự phòng chung của ngân hàng so với tổng dư nợ xấu.",
    explanation: "Đo lường mức độ dự phòng sẵn có để hấp thụ tổn thất nợ xấu. Tỷ lệ này trên 100% chứng tỏ bộ đệm dự phòng mạnh mẽ.",
    formula: "LLCR = [Dự phòng rủi ro tín dụng / Tổng nợ xấu (Nhóm 3-5)] x 100%"
  },
  {
    id: "roe",
    term: "ROE (Return on Equity)",
    vietnamese: "Tỷ suất lợi nhuận trên vốn chủ sở hữu",
    category: "vietnam",
    definition: "Chỉ tiêu tài chính đo lường mức sinh lời của vốn chủ sở hữu tại ngân hàng thương mại.",
    explanation: "Thể hiện hiệu quả sử dụng nguồn vốn tự có của các cổ đông đầu tư vào ngân hàng.",
    formula: "ROE = [Lợi nhuận sau thuế / Vốn chủ sở hữu trung bình] x 100%"
  },
  {
    id: "roa",
    term: "ROA (Return on Assets)",
    vietnamese: "Tỷ suất lợi nhuận trên tổng tài sản",
    category: "vietnam",
    definition: "Chỉ tiêu đo lường hiệu quả sử dụng toàn bộ tài sản sinh lời để tạo ra lợi nhuận của ngân hàng.",
    explanation: "Đánh giá mức sinh lời trên mỗi đơn vị tài sản mà ngân hàng quản lý.",
    formula: "ROA = [Lợi nhuận sau thuế / Tổng tài sản trung bình] x 100%"
  },
  {
    id: "omo",
    term: "OMO (Open Market Operations)",
    vietnamese: "Nghiệp vụ thị trường mở",
    category: "vietnam",
    definition: "Nghiệp vụ mua bán giấy tờ có giá ngắn hạn do Ngân hàng Trung ương (NHNN) thực hiện nhằm điều tiết thanh khoản tiền tệ trên thị trường liên ngân hàng.",
    explanation: "NHNN sử dụng OMO mua (bơm tiền) hoặc bán (hút tiền) qua các công cụ như tín phiếu (SBV Bill) hoặc hợp đồng mua lại (Repo/Reverse Repo).",
    formula: "Công cụ điều tiết: Tín phiếu NHNN (Hút thanh khoản) <-> Repo giấy tờ có giá (Bơm thanh khoản)"
  },
  {
    id: "fed",
    term: "FED (Federal Reserve System)",
    vietnamese: "Cục Dự trữ Liên bang Mỹ",
    category: "basel",
    definition: "Ngân hàng Trung ương của Hoa Kỳ, tổ chức tài chính quyền lực nhất thế giới điều hành chính sách tiền tệ toàn cầu thông qua đồng USD.",
    explanation: "FOMC là ủy ban ra quyết định lãi suất của FED. Động thái tăng/hạ lãi suất của FED ảnh hưởng sâu sắc đến tỷ giá USD/VND và chính sách tiền tệ của SBV.",
    formula: "Chính sách: Lãi suất quỹ liên bang (Fed Funds Rate) & Thắt chặt/Nới lỏng định lượng"
  },
  {
    id: "sbv",
    term: "SBV / NHNN (State Bank of Vietnam)",
    vietnamese: "Ngân hàng Nhà nước Việt Nam",
    category: "vietnam",
    definition: "Cơ quan ngang bộ của Chính phủ, giữ vai trò là Ngân hàng Trung ương của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.",
    explanation: "Chịu trách nhiệm phát hành tiền, quản lý dự trữ ngoại hối, điều hành chính sách tiền tệ (lãi suất điều hành, hạn mức tăng trưởng tín dụng) và thanh tra giám sát hệ thống tổ chức tín dụng Việt Nam.",
    formula: "Mục tiêu: Ổn định giá trị đồng tiền + Đảm bảo an toàn hoạt động ngân hàng + Hỗ trợ tăng trưởng"
  },
  {
    id: "cof",
    term: "COF (Cost of Funds)",
    vietnamese: "Chi phí vốn",
    category: "vietnam",
    definition: "Tỷ lệ chi phí lãi bình quân gia quyền mà ngân hàng phải chi trả để huy động nguồn vốn từ thị trường.",
    explanation: "Nguồn vốn huy động bao gồm tiền gửi khách hàng (không kỳ hạn/có kỳ hạn), phát hành giấy tờ có giá, vay liên ngân hàng hoặc vay Ngân hàng Trung ương. Tối ưu hóa CASA giúp hạ COF.",
    formula: "COF = [Tổng chi phí trả lãi / Tổng nguồn vốn huy động chịu lãi trung bình] x 100%"
  },
  {
    id: "alm",
    term: "ALM (Asset Liability Management)",
    vietnamese: "Quản trị Tài sản Nợ - Có",
    category: "risk",
    definition: "Hoạt động quản trị rủi ro tài chính nhằm giảm thiểu sự không cân xứng giữa tài sản Có và tài sản Nợ của ngân hàng.",
    explanation: "Tập trung giải quyết các rủi ro về kỳ hạn (khe hở nhạy cảm lãi suất), rủi ro thanh khoản và rủi ro tỷ giá nhằm bảo vệ biên lợi nhuận lãi thuần (NIM) và giá trị ròng của ngân hàng.",
    formula: "ALM: Kiểm soát khe hở lãi suất (Interest Rate Gap) & Khe hở thanh khoản (Liquidity Gap)"
  },
  {
    id: "qe_qt",
    term: "QE & QT (Quantitative Easing & Tightening)",
    vietnamese: "Nới lỏng & Thắt chặt định lượng",
    category: "basel",
    definition: "Các chính sách tiền tệ phi truyền thống của Ngân hàng Trung ương nhằm điều tiết quy mô lượng tiền cung ứng trong nền kinh tế.",
    explanation: "QE (Nới lỏng): Ngân hàng Trung ương mua trái phiếu chính phủ để bơm tiền ra thị trường. QT (Thắt chặt): Ngân hàng Trung ương bán hoặc dừng tái đầu tư trái phiếu để thu hồi tiền mặt về, thắt chặt thanh khoản hệ thống.",
    formula: "Bảng cân đối kế toán CB: QE (Mở rộng quy mô tài sản) <-> QT (Thu hẹp quy mô tài sản)"
  },
  {
    id: "ust",
    term: "UST (US Treasury Bond)",
    vietnamese: "Trái phiếu Chính phủ Mỹ",
    category: "basel",
    definition: "Công cụ nợ do Bộ Tài chính Hoa Kỳ phát hành nhằm tài trợ cho các khoản chi tiêu công của chính phủ Mỹ.",
    explanation: "Được coi là tài sản phi rủi ro tiêu chuẩn (Risk-free Asset) trên thị trường tài chính toàn cầu và là chỉ báo quan trọng cho lợi suất phi rủi ro tham chiếu khi định giá các loại tài sản khác.",
    formula: "Lợi suất tham chiếu: UST 10-Year Yield (Chỉ báo lãi suất phi rủi ro dài hạn toàn cầu)"
  },
  {
    id: "tga",
    term: "TGA (Treasury General Account)",
    vietnamese: "Tài khoản Tổng kho bạc Mỹ",
    category: "basel",
    definition: "Tài khoản thanh toán chính của Bộ Tài chính Hoa Kỳ được mở trực tiếp tại Cục Dự trữ Liên bang Mỹ (Fed).",
    explanation: "Được sử dụng để quản lý các dòng tiền thu (thuế, tiền bán trái phiếu) và chi (chi tiêu công, trả nợ) của chính phủ Mỹ. Số dư TGA có tác động ngược chiều trực tiếp đến thanh khoản (lượng tiền dự trữ) của các ngân hàng thương mại trên hệ thống tài chính.",
    formula: "Hệ quả thanh khoản: TGA tăng -> Dự trữ NHTM giảm (Hút tiền) | TGA giảm -> Dự trữ NHTM tăng (Bơm tiền)"
  },
  {
    id: "dxy",
    term: "DXY (US Dollar Index)",
    vietnamese: "Chỉ số sức mạnh đồng đô la Mỹ",
    category: "basel",
    definition: "Chỉ số đo lường giá trị tương đối của đồng USD so với rổ gồm 6 loại tiền tệ lớn của các đối tác thương mại của Mỹ.",
    explanation: "Rổ tiền tệ bao gồm Euro (EUR), Yên Nhật (JPY), Bảng Anh (GBP), Đô la Canada (CAD), Krona Thụy Điển (SEK), và Franc Thụy Sĩ (CHF). DXY tăng mạnh gây áp lực lên tỷ giá USD/VND.",
    formula: "Rổ tỷ trọng: EUR (57.6%) + JPY (13.6%) + GBP (11.9%) + CAD (9.1%) + SEK (4.2%) + CHF (3.6%)"
  },
  {
    id: "frm",
    term: "FRM (Financial Risk Manager)",
    vietnamese: "Chứng chỉ Quản trị rủi ro tài chính",
    category: "basel",
    definition: "Chứng chỉ quốc tế uy tín chuyên sâu về năng lực quản trị rủi ro tài chính do Hiệp hội các Chuyên gia Quản trị Rủi ro Toàn cầu (GARP) cấp.",
    explanation: "Đây là chuẩn mực đào tạo nhân lực trình độ cao cho bộ phận quản trị rủi ro (ALM, tín dụng, thị trường) của các ngân hàng thương mại áp dụng hiệp ước Basel II/III.",
    formula: "Chuyên môn: Quản trị Rủi ro Tín dụng + Hoạt động + Thị trường + Quản trị thanh khoản và nguồn vốn"
  },
  {
    id: "hpr",
    term: "HPR (Holding Period Return)",
    vietnamese: "Lợi suất nắm giữ",
    category: "risk",
    definition: "Tỷ suất sinh lời tổng thể của một tài sản hoặc danh mục đầu tư trong toàn bộ khoảng thời gian được nắm giữ bởi nhà đầu tư.",
    explanation: "Đo lường sự gia tăng giá trị vốn đầu tư ban đầu cộng thêm bất kỳ khoản thu nhập phát sinh nào (cổ tức, tiền lãi) nhận được trong kỳ nắm giữ, chia cho giá trị đầu tư ban đầu.",
    formula: "HPR = [(Giá trị cuối kỳ - Giá trị đầu kỳ) + Thu nhập phát sinh] / Giá trị đầu kỳ x 100%"
  },
  {
    id: "cp",
    term: "CP (Counterparty)",
    vietnamese: "Đối tác giao dịch",
    category: "risk",
    definition: "Tổ chức hoặc cá nhân tham gia vào bên đối ứng của một giao dịch tài chính hoặc hợp đồng phái sinh (thường là ngân hàng hoặc tổ chức tài chính cung cấp sản phẩm).",
    explanation: "Trong quản trị rủi ro, rủi ro đối tác (Counterparty Credit Risk - CCR) là rủi ro đối tác không thực hiện nghĩa vụ thanh toán trước khi hợp đồng đáo hạn (ví dụ như trong các giao dịch FX Hedging).",
    formula: "Rủi ro đối tác: CCR = EAD (Dư nợ tại thời điểm vỡ nợ) x PD (Xác suất vỡ nợ đối tác) x LGD (Tỷ lệ tổn thất)"
  },
  {
    id: "tarf",
    term: "TARF (Target Redemption Forward) / FX Target",
    vietnamese: "Hợp đồng kỳ hạn mục tiêu",
    category: "risk",
    definition: "Một sản phẩm cấu trúc FX phái sinh phức tạp dành cho doanh nghiệp để phòng ngừa rủi ro tỷ giá (FX hedging), có cơ chế lợi nhuận giới hạn nhưng nghĩa vụ lỗ không giới hạn.",
    explanation: "Được thiết kế bất đối xứng: Khi lợi nhuận tích lũy của khách hàng đạt mức mục tiêu (Target), hợp đồng sẽ tự động chấm dứt (gõ cửa ra - Knock-out). Ngược lại, nếu tỷ giá biến động bất lợi, khách hàng buộc phải tiếp tục mua/bán FX với tỷ giá xấu hơn thị trường và khối lượng nhân đôi mà không có giới hạn cắt lỗ, dẫn đến việc đối tác giao dịch (CP) thu lợi nhuận cực lớn còn khách hàng chịu lỗ nặng.",
    formula: "Cơ chế: Tích lũy lãi đạt Target -> Hợp đồng tự hủy | Lỗ -> Thực hiện bắt buộc x2 khối lượng"
  }
];

class GlossaryManager {
  constructor() {
    this.currentCategory = "all";
    this.searchQuery = "";

    this.initElements();
    this.bindEvents();
    this.render();
  }

  // Định dạng công thức chữ thành giao diện trực quan (Phân số, timeline...)
  formatFormula(formula) {
    if (!formula) return "";

    // 1. Dạng tiến trình/timeline (chứa ->)
    if (formula.includes("->")) {
      const steps = formula.split("->").map(s => s.trim());
      return `
        <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
          ${steps.map((s, idx) => `
            <span style="font-size: 0.76rem; font-weight: 700; background: rgba(99, 102, 241, 0.08); color: #818cf8; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(99,102,241,0.15);">${s}</span>
            ${idx < steps.length - 1 ? '<span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 900;">&rarr;</span>' : ''}
          `).join("")}
        </div>
      `;
    }

    // Định dạng các toán tử toán học
    const formatSymbols = (text) => {
      if (!text) return "";
      let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return escaped
        .replace(/ \+ /g, ' <span style="color: #10b981; font-weight: bold; margin: 0 4px;">+</span> ')
        .replace(/ - /g, ' <span style="color: #ef4444; font-weight: bold; margin: 0 4px;">-</span> ')
        .replace(/ x /g, ' <span style="color: #3b82f6; font-weight: bold; margin: 0 4px;">&times;</span> ')
        .replace(/ \* /g, ' <span style="color: #3b82f6; font-weight: bold; margin: 0 4px;">&times;</span> ')
        .replace(/ &gt;= /g, ' <span style="color: #10b981; font-weight: bold; margin: 0 6px;">&ge;</span> ')
        .replace(/ &lt;= /g, ' <span style="color: #ef4444; font-weight: bold; margin: 0 6px;">&le;</span> ');
    };

    // 2. Dạng phân số: LHS = [Numerator / Denominator] Multiplier
    if (formula.includes("=") && formula.includes("[") && formula.includes("]") && formula.includes("/")) {
      const eqIdx = formula.indexOf("=");
      const lhs = formula.substring(0, eqIdx).trim();
      const rhs = formula.substring(eqIdx + 1).trim();

      const bracketStart = rhs.indexOf("[");
      const bracketEnd = rhs.indexOf("]");
      if (bracketStart !== -1 && bracketEnd !== -1) {
        const pre = rhs.substring(0, bracketStart).trim();
        const post = rhs.substring(bracketEnd + 1).trim();
        const inside = rhs.substring(bracketStart + 1, bracketEnd).trim();
        const slashIdx = inside.indexOf("/");

        if (slashIdx !== -1) {
          const num = inside.substring(0, slashIdx).trim();
          const den = inside.substring(slashIdx + 1).trim();

          return `
            <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-main); white-space: nowrap;">
              <span style="font-weight: 700; color: var(--primary);">${lhs}</span>
              <span style="color: var(--text-muted); font-weight: bold;">=</span>
              ${pre ? `<span>${formatSymbols(pre)}</span>` : ""}
              <span style="font-size: 1.5rem; font-weight: 300; color: var(--text-muted); margin: 0 1px; display: inline-flex; align-items: center; line-height: 1;">[</span>
              <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 2px; vertical-align: middle;">
                <span style="border-bottom: 1.5px solid var(--border-color); padding-bottom: 2px; text-align: center; font-weight: 600; color: var(--text-main); font-size: 0.78rem; display: block; width: 100%;">${formatSymbols(num)}</span>
                <span style="padding-top: 2px; text-align: center; color: var(--text-muted); font-size: 0.74rem; display: block; width: 100%;">${formatSymbols(den)}</span>
              </div>
              <span style="font-size: 1.5rem; font-weight: 300; color: var(--text-muted); margin: 0 1px; display: inline-flex; align-items: center; line-height: 1;">]</span>
              ${post ? `<span>${formatSymbols(post)}</span>` : ""}
            </div>
          `;
        }
      }
    }

    // 3. Phương trình thường (chứa dấu =)
    if (formula.includes("=")) {
      const eqIdx = formula.indexOf("=");
      const lhs = formula.substring(0, eqIdx).trim();
      const rhs = formula.substring(eqIdx + 1).trim();
      return `
        <div style="font-size: 0.8rem; color: var(--text-main); line-height: 1.4; white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;">
          <span style="font-weight: 700; color: var(--primary);">${lhs}</span>
          <span style="color: var(--text-muted); font-weight: bold;">=</span>
          <span>${formatSymbols(rhs)}</span>
        </div>
      `;
    }

    // Fallback thông thường
    return `
      <div style="font-size: 0.8rem; color: var(--text-main); font-weight: 500; white-space: nowrap;">
        ${formatSymbols(formula)}
      </div>
    `;
  }

  initElements() {
    this.container = document.getElementById("glossary-list-container");
    this.searchInput = document.getElementById("glossary-search-input");
    this.categoryBtns = document.querySelectorAll("#glossary-category-selectors .law-cat-btn");
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    this.categoryBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.categoryBtns.forEach(b => {
          b.classList.remove("active");
          b.style.background = "none";
          b.style.color = "var(--text-muted)";
          b.style.borderColor = "var(--border-color)";
        });
        
        btn.classList.add("active");
        btn.style.background = "var(--primary)";
        btn.style.color = "white";
        btn.style.borderColor = "var(--primary)";

        this.currentCategory = btn.getAttribute("data-category");
        this.render();
      });
    });
  }

  render() {
    if (!this.container) return;

    // Lọc dữ liệu
    const filtered = GLOSSARY_TERMS.filter(item => {
      const matchCategory = this.currentCategory === "all" || item.category === this.currentCategory;
      const matchSearch = item.term.toLowerCase().includes(this.searchQuery) ||
                          item.vietnamese.toLowerCase().includes(this.searchQuery) ||
                          item.definition.toLowerCase().includes(this.searchQuery) ||
                          item.explanation.toLowerCase().includes(this.searchQuery);
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i data-lucide="info" style="width: 40px; height: 40px; margin-bottom: 1rem; stroke: var(--text-muted);"></i>
          <p style="font-size: 1rem; font-weight: 500;">Không tìm thấy thuật ngữ nào khớp với từ khóa tìm kiếm.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    this.container.innerHTML = filtered.map(item => `
      <div class="card" id="term-${item.id}" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--primary); transition: all 0.2s ease;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
            <h4 style="margin: 0; font-size: 1.15rem; color: var(--primary);">${item.term}</h4>
            <span class="law-code-badge badge-${this.getBadgeClass(item.category)}" style="font-size: 0.75rem; text-transform: uppercase;">
              ${this.getCategoryLabel(item.category)}
            </span>
          </div>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.75rem; font-style: italic;">
            ${item.vietnamese}
          </span>
          <p style="font-size: 0.9rem; text-align: justify; line-height: 1.5; color: var(--text-main); margin-bottom: 0.75rem;">
            ${item.definition}
          </p>
          <p style="font-size: 0.85rem; text-align: justify; line-height: 1.5; color: var(--text-muted); margin-bottom: 1rem;">
            ${item.explanation}
          </p>
        </div>
        <div>
          <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.75rem 0; opacity: 0.3;">
          <div style="background: rgba(99, 102, 241, 0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; min-height: 60px;">
            <span style="font-size: 0.65rem; color: var(--text-muted); display: block; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 2px;">Công thức / Cơ chế:</span>
            <div style="width: 100%; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; -ms-overflow-style: none;">
              ${this.formatFormula(item.formula)}
            </div>
          </div>
        </div>
      </div>
    `).join("");

    lucide.createIcons();
  }

  getBadgeClass(category) {
    if (category === "basel") return "law";
    if (category === "vietnam") return "circular";
    return "tag";
  }

  getCategoryLabel(category) {
    if (category === "basel") return "Basel Standard";
    if (category === "vietnam") return "Luật VN";
    return "Đo lường Rủi ro";
  }
}

// Khởi chạy khi DOM tải xong
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("glossary-section")) {
    window.glossaryManager = new GlossaryManager();
    
    // Logic chuyển đổi chế độ xem Sơ đồ mối liên hệ chỉ số an toàn vốn
    const btnInteractive = document.getElementById("btn-flow-interactive");
    const btnGraphic = document.getElementById("btn-flow-graphic");
    const viewInteractive = document.getElementById("flow-interactive-view");
    const viewGraphic = document.getElementById("flow-graphic-view");
    
    if (btnInteractive && btnGraphic && viewInteractive && viewGraphic) {
      btnInteractive.addEventListener("click", () => {
        // Active Interactive Button
        btnInteractive.style.background = "var(--primary)";
        btnInteractive.style.color = "white";
        btnInteractive.style.borderColor = "var(--primary)";
        
        // Inactive Graphic Button
        btnGraphic.style.background = "rgba(255,255,255,0.05)";
        btnGraphic.style.color = "var(--text-muted)";
        btnGraphic.style.borderColor = "var(--border-color)";
        
        // Show/Hide Views
        viewInteractive.style.display = "block";
        viewGraphic.style.display = "none";
      });
      
      btnGraphic.addEventListener("click", () => {
        // Active Graphic Button
        btnGraphic.style.background = "var(--primary)";
        btnGraphic.style.color = "white";
        btnGraphic.style.borderColor = "var(--primary)";
        
        // Inactive Interactive Button
        btnInteractive.style.background = "rgba(255,255,255,0.05)";
        btnInteractive.style.color = "var(--text-muted)";
        btnInteractive.style.borderColor = "var(--border-color)";
        
        // Show/Hide Views
        viewInteractive.style.display = "none";
        viewGraphic.style.display = "block";
      });
    }
  }
});

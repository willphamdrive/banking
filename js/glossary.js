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
          <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); border-radius: 6px; padding: 0.5rem 0.75rem;">
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Công thức / Cơ chế:</span>
            <code style="font-family: monospace; font-size: 0.85rem; color: var(--success); font-weight: 600; word-break: break-all;">${item.formula}</code>
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
  }
});

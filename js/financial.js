// Phân tích Báo cáo Tài chính (BCTC) Ngân hàng - Balance Sheet, Income Statement, Cash Flow
class FinancialAnalysis {
  constructor() {
    this.currentSubTab = "financial-analysis";
    this.currentFinancialSub = "balance-sheet";
    this.indBank = "TCB";
    this.indYear = "2025";
    
    this.compBanks = ["TCB", "VCB", "BID", "MBB"];
    this.compYear = "2025";
    this.compMetric = "total_assets";
    this.compYScale = "auto";
    
    this.charts = {};
    
    this.initElements();
    this.bindEvents();
    
    // Khởi tạo render lần đầu
    setTimeout(() => {
      this.syncFromGlobal();
      this.render();
    }, 100);
  }

  initElements() {
    this.section = document.getElementById("financial-analysis-section");
    if (!this.section) return;

    // Sub-tab lớn
    this.subTabBtns = this.section.querySelectorAll(".sub-tab-btn");
    this.subTabPanels = this.section.querySelectorAll(".sub-tab-panel");

    // Sub-tab nhỏ (Báo cáo Đơn lẻ)
    this.financialSubTabBtns = this.section.querySelectorAll(".financial-sub-tab-btn");

    // Controls Phân tích Đơn lẻ
    this.indBankSelect = document.getElementById("financial-bank-select");
    this.indYearBtns = this.section.querySelectorAll("#financial-year-selectors .year-btn");
    this.indRender = document.getElementById("financial-individual-render");

    // Controls So sánh
    this.compCheckboxes = this.section.querySelectorAll("#financial-compare-banks-checkboxes input");
    this.compYearBtns = this.section.querySelectorAll("#financial-compare-year-selectors .year-btn");
    this.compMetricSelect = document.getElementById("financial-compare-metric-select");
    this.compYScaleSelect = document.getElementById("financial-compare-y-scale-select");
    this.compRender = document.getElementById("financial-compare-render");
    this.selectAllCheckbox = document.getElementById("financial-compare-select-all");
  }

  bindEvents() {
    if (!this.section) return;

    // 1. Chuyển đổi Sub-tab lớn (Đơn lẻ vs So sánh)
    this.subTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.subTabBtns.forEach(b => {
          b.classList.remove("active");
          b.style.borderBottomColor = "transparent";
          b.style.color = "var(--text-muted)";
        });
        btn.classList.add("active");
        btn.style.borderBottomColor = "var(--primary)";
        btn.style.color = "var(--text-main)";

        const subTabId = btn.getAttribute("data-subtab");
        this.currentSubTab = subTabId;

        this.subTabPanels.forEach(panel => {
          if (panel.id === `${subTabId}-tab-content`) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });
        
        lucide.createIcons();
        this.render();
      });
    });

    // 2. Chuyển đổi Sub-tab nhỏ BCTC (Balance Sheet, Income, Cash Flow)
    this.financialSubTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.financialSubTabBtns.forEach(b => {
          b.style.background = "rgba(255,255,255,0.05)";
          b.style.color = "var(--text-muted)";
        });
        btn.style.background = "var(--primary)";
        btn.style.color = "white";

        const subId = btn.getAttribute("data-financialsub");
        this.currentFinancialSub = subId;

        lucide.createIcons();
        this.renderIndividualFinancial();
      });
    });

    // 3. Phân tích Đơn lẻ - Chọn Ngân hàng
    if (this.indBankSelect) {
      this.indBankSelect.addEventListener("change", (e) => {
        this.indBank = e.target.value;
        this.syncToGlobal("indBank", this.indBank);
        this.renderIndividualFinancial();
      });
    }

    // 4. Phân tích Đơn lẻ - Chọn Năm / Time Series
    this.indYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.indYearBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.indYear = btn.getAttribute("data-year");
        this.syncToGlobal("indYear", this.indYear);
        this.renderIndividualFinancial();
      });
    });

    // 5. So sánh - Checkbox chọn Ngân hàng
    this.compCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = [];
        this.compCheckboxes.forEach(c => {
          if (c.checked) checked.push(c.value);
        });
        this.compBanks = checked;
        this.syncToGlobal("compBanks", this.compBanks);
        this.renderCompareFinancial();
      });
    });

    // 6. So sánh - Nút chọn tất cả
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        this.compCheckboxes.forEach(cb => {
          cb.checked = isChecked;
        });
        const checked = [];
        this.compCheckboxes.forEach(c => {
          if (c.checked) checked.push(c.value);
        });
        this.compBanks = checked;
        this.syncToGlobal("compBanks", this.compBanks);
        this.renderCompareFinancial();
      });
    }

    // 7. So sánh - Chọn Năm / Time Series
    this.compYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.compYearBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.compYear = btn.getAttribute("data-year");
        this.syncToGlobal("compYear", this.compYear);
        this.renderCompareFinancial();
      });
    });

    // 8. So sánh - Chọn chỉ số so sánh
    if (this.compMetricSelect) {
      this.compMetricSelect.addEventListener("change", (e) => {
        this.compMetric = e.target.value;
        this.renderCompareFinancial();
      });
    }

    // 9. So sánh - Chọn Trục dọc
    if (this.compYScaleSelect) {
      this.compYScaleSelect.addEventListener("change", (e) => {
        this.compYScale = e.target.value;
        this.syncToGlobal("compYScale", this.compYScale);
        this.renderCompareFinancial();
      });
    }

    // Lắng nghe sự kiện đổi theme để vẽ lại biểu đồ BCTC
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        setTimeout(() => {
          this.render();
        }, 150);
      });
    }
  }

  syncFromGlobal() {
    if (!window.baselAnalysis) return;
    const global = window.baselAnalysis;
    
    // Đồng bộ đơn lẻ
    if (global.indBank) {
      this.indBank = global.indBank;
      if (this.indBankSelect) this.indBankSelect.value = this.indBank;
    }
    if (global.indYear) {
      this.indYear = global.indYear;
      this.indYearBtns.forEach(btn => {
        if (btn.getAttribute("data-year") === this.indYear) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Đồng bộ so sánh
    if (global.compBanks && global.compBanks.length > 0) {
      this.compBanks = global.compBanks;
      this.compCheckboxes.forEach(cb => {
        cb.checked = this.compBanks.includes(cb.value);
      });
    }
    if (global.compYear) {
      this.compYear = global.compYear;
      this.compYearBtns.forEach(btn => {
        if (btn.getAttribute("data-year") === this.compYear) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    if (global.compYScale) {
      this.compYScale = global.compYScale;
      if (this.compYScaleSelect) this.compYScaleSelect.value = this.compYScale;
    }
  }

  syncToGlobal(key, value) {
    if (!window.baselAnalysis) return;
    const global = window.baselAnalysis;

    if (key === "indBank") {
      global.indBank = value;
      global.ratioBank = value;
      const el1 = document.getElementById("analysis-bank-select");
      if (el1) el1.value = value;
      const el2 = document.getElementById("ratio-bank-select");
      if (el2) el2.value = value;
      global.renderIndividualAnalysis();
      global.renderRatioAnalysis();
    } else if (key === "indYear") {
      global.indYear = value;
      global.ratioYear = value;
      const selectors = ["#analysis-year-selectors", "#ratio-year-selectors"];
      selectors.forEach(sel => {
        const btns = document.querySelectorAll(`${sel} .year-btn`);
        btns.forEach(btn => {
          if (btn.getAttribute("data-year") === value) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      });
      global.renderIndividualAnalysis();
      global.renderRatioAnalysis();
    } else if (key === "compBanks") {
      global.compBanks = value;
      global.ratioCompBanks = value;
      const selectors = ["#compare-banks-checkboxes", "#ratio-compare-banks-checkboxes"];
      selectors.forEach(sel => {
        const cbs = document.querySelectorAll(`${sel} input`);
        cbs.forEach(cb => {
          cb.checked = value.includes(cb.value);
        });
      });
      global.renderCompareAnalysis();
      global.renderRatioAnalysis();
    } else if (key === "compYear") {
      global.compYear = value;
      global.ratioCompYear = value;
      const selectors = ["#compare-year-selectors", "#ratio-compare-year-selectors"];
      selectors.forEach(sel => {
        const btns = document.querySelectorAll(`${sel} .year-btn`);
        btns.forEach(btn => {
          if (btn.getAttribute("data-year") === value) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      });
      global.renderCompareAnalysis();
      global.renderRatioAnalysis();
    } else if (key === "compYScale") {
      global.compYScale = value;
      global.ratioCompYScale = value;
      const el1 = document.getElementById("compare-y-scale-select");
      if (el1) el1.value = value;
      const el2 = document.getElementById("ratio-compare-y-scale-select");
      if (el2) el2.value = value;
      global.renderCompareAnalysis();
      global.renderRatioAnalysis();
    }
  }

  destroyChart(key) {
    if (this.charts[key]) {
      this.charts[key].destroy();
      delete this.charts[key];
    }
  }

  render() {
    this.syncFromGlobal();
    if (this.currentSubTab === "financial-analysis") {
      this.renderIndividualFinancial();
    } else {
      this.renderCompareFinancial();
    }
  }

  formatNumber(val) {
    if (val === undefined || val === null || isNaN(val)) return "-";
    return new Intl.NumberFormat("vi-VN").format(val);
  }

  renderIndividualFinancial() {
    if (!this.indRender) return;

    const bankInfo = window.BANK_DATABASE[this.indBank];
    this.destroyChart("indFinStructure");
    this.destroyChart("indFinStructure2");
    this.destroyChart("indFinTrend");

    if (!bankInfo || !bankInfo.bctc_data) {
      this.indRender.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Không có dữ liệu báo cáo tài chính cho ngân hàng ${this.indBank}</p></div>`;
      return;
    }

    if (this.indYear === "series") {
      this.renderIndividualSeries(bankInfo);
      return;
    }

    const yearData = bankInfo.bctc_data[this.indYear];
    if (!yearData) {
      this.indRender.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Không có dữ liệu BCTC của năm ${this.indYear} cho ngân hàng ${this.indBank}</p></div>`;
      return;
    }

    // RENDER SINGLE YEAR TABLES & STRUCTURE CHARTS
    if (this.currentFinancialSub === "balance-sheet") {
      this.renderBalanceSheetTable(yearData.balance_sheet);
    } else if (this.currentFinancialSub === "income-statement") {
      this.renderIncomeStatementTable(yearData.income_statement);
    } else {
      this.renderCashFlowTable(yearData.cash_flow);
    }
    this.attachTableClickHandlers();
  }

  // 1. Balance Sheet Table & Doughnut Chart
  renderBalanceSheetTable(bs) {
    this.indRender.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
        <!-- Table -->
        <div class="card" style="padding: 1.5rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="table"></i> Bảng Cân đối Kế toán năm ${this.indYear} (Đơn vị: Tỷ VND)
          </h3>
          <table class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Khoản mục</th>
                <th style="text-align: right; padding: 0.75rem; width: 120px;">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr style="font-weight: bold; color: var(--primary);">
                <td style="padding: 0.65rem 0.75rem;">A. TÀI SẢN</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.total_assets)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">1. Tiền mặt và vàng</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.cash)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">2. Tiền gửi tại NHNN</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.sbv_deposits)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">3. Tiền gửi & Cho vay các TCTD khác</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.fi_deposits_loans)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">4. Chứng khoán kinh doanh & đầu tư</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.securities)}</td>
              </tr>
              <tr style="font-weight: 600;">
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem; color: var(--text-main);">5. Cho vay khách hàng</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--text-main);">${this.formatNumber(bs.customer_loans)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">6. Tài sản cố định & tài sản khác</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.other_assets)}</td>
              </tr>
              
              <tr style="font-weight: bold; color: var(--primary); border-top: 1.5px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">B. NGUỒN VỐN (NỢ PHẢI TRẢ & VỐN CSH)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.total_liabilities_equity)}</td>
              </tr>
              <tr style="font-weight: 600;">
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">I. Nợ phải trả</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.total_liabilities_equity - bs.equity)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 2.25rem;">1. Tiền gửi và vay các TCTD khác</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.fi_deposits_borrowings)}</td>
              </tr>
              <tr style="font-weight: 600;">
                <td style="padding: 0.65rem 0.75rem; padding-left: 2.25rem; color: var(--text-main);">2. Tiền gửi của khách hàng</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--text-main);">${this.formatNumber(bs.customer_deposits)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 2.25rem;">3. Phát hành giấy tờ có giá</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.valuable_papers)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 2.25rem;">4. Các khoản nợ khác</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.other_liabilities)}</td>
              </tr>
              <tr style="font-weight: bold; color: var(--text-main);">
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">II. Vốn chủ sở hữu</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(bs.equity)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Charts -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="card" style="padding: 1.25rem; flex-grow: 1; min-height: 250px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.75rem; font-size: 0.95rem;"><i data-lucide="pie-chart"></i> Cơ cấu Tài sản</h3>
            <div style="flex-grow: 1; position: relative; height: 180px;">
              <canvas id="chart-ind-fin-structure"></canvas>
            </div>
          </div>
          <div class="card" style="padding: 1.25rem; flex-grow: 1; min-height: 250px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.75rem; font-size: 0.95rem;"><i data-lucide="pie-chart"></i> Cơ cấu Nguồn vốn</h3>
            <div style="flex-grow: 1; position: relative; height: 180px;">
              <canvas id="chart-ind-fin-structure2"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    // Chart 1: Asset Structure
    this.charts.indFinStructure = new Chart(document.getElementById("chart-ind-fin-structure").getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Tiền mặt", "Gửi NHNN", "Gửi TCTD", "Chứng khoán", "Cho vay KH", "Tài sản khác"],
        datasets: [{
          data: [bs.cash, bs.sbv_deposits, bs.fi_deposits_loans, bs.securities, bs.customer_loans, bs.other_assets],
          backgroundColor: ["#f59e0b", "#10b981", "#06b6d4", "#6366f1", "#dc2626", "#6b7280"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } }
        }
      }
    });

    // Chart 2: Liabilities Structure
    const liabilities = bs.total_assets - bs.equity;
    this.charts.indFinStructure2 = new Chart(document.getElementById("chart-ind-fin-structure2").getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Gửi & Vay TCTD", "Tiền gửi KH", "Giấy tờ có giá", "Nợ khác", "Vốn chủ sở hữu"],
        datasets: [{
          data: [bs.fi_deposits_borrowings, bs.customer_deposits, bs.valuable_papers, bs.other_liabilities, bs.equity],
          backgroundColor: ["#fb7185", "#dc2626", "#a78bfa", "#f3f4f6", "#059669"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } }
        }
      }
    });
  }

  // 2. Income Statement Table & Horizontal Bar Chart
  renderIncomeStatementTable(is) {
    this.indRender.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
        <!-- Table -->
        <div class="card" style="padding: 1.5rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="table"></i> Kết quả Kinh doanh năm ${this.indYear} (Đơn vị: Tỷ VND)
          </h3>
          <table class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Chỉ tiêu kinh doanh</th>
                <th style="text-align: right; padding: 0.75rem; width: 120px;">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.65rem 0.75rem;">1. Thu nhập lãi và các khoản tương tự</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.interest_income)}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">2. Chi phí lãi và các khoản tương tự</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--danger);">-(${this.formatNumber(is.interest_expense)})</td>
              </tr>
              <tr style="font-weight: bold; color: var(--primary);">
                <td style="padding: 0.65rem 0.75rem;">I. THU NHẬP LÃI THUẦN (NII)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.nii)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem;">3. Lãi thuần từ hoạt động dịch vụ</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.service_income)}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">4. Lãi/lỗ hoạt động khác</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.other_income)}</td>
              </tr>
              <tr style="font-weight: bold; color: var(--text-main);">
                <td style="padding: 0.65rem 0.75rem;">II. TỔNG THU NHẬP HOẠT ĐỘNG (TOI)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.toi)}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">5. Chi phí hoạt động (OPEX)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--danger);">-(${this.formatNumber(is.opex)})</td>
              </tr>
              <tr style="font-weight: bold;">
                <td style="padding: 0.65rem 0.75rem;">III. LỢI NHUẬN TRƯỚC DỰ PHÒNG</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.pre_provision_profit)}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">6. Chi phí dự phòng rủi ro tín dụng</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--danger);">-(${this.formatNumber(is.provision_expense)})</td>
              </tr>
              <tr style="font-weight: bold; color: var(--primary);">
                <td style="padding: 0.65rem 0.75rem;">IV. LỢI NHUẬN TRƯỚC THUẾ (PBT)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(is.pbt)}</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">7. Thuế TNDN (20%)</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right; color: var(--danger);">-(${this.formatNumber(is.tax)})</td>
              </tr>
              <tr style="font-weight: bold; color: var(--success); border-top: 1.5px solid var(--border-color);">
                <td style="padding: 0.75rem 0.75rem; font-size: 0.95rem;">V. LỢI NHUẬN SAU THUẾ (PAT)</td>
                <td style="padding: 0.75rem 0.75rem; text-align: right; font-size: 0.95rem;">${this.formatNumber(is.pat)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Breakdown Chart -->
        <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; min-height: 400px;">
          <h3 style="margin-bottom: 1.5rem; font-size: 1.05rem;"><i data-lucide="bar-chart-2"></i> Cơ cấu Thu nhập & Lợi nhuận (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 300px;">
            <canvas id="chart-ind-fin-structure"></canvas>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    this.charts.indFinStructure = new Chart(document.getElementById("chart-ind-fin-structure").getContext("2d"), {
      type: "bar",
      data: {
        labels: ["NII (Lãi thuần)", "Thu nhập Dịch vụ", "Thu nhập khác", "OPEX", "Dự phòng", "PAT (Lợi nhuận ròng)"],
        datasets: [{
          label: "Số tiền (Tỷ VND)",
          data: [is.nii, is.service_income, is.other_income, -is.opex, -is.provision_expense, is.pat],
          backgroundColor: ["#2563eb", "#60a5fa", "#34d399", "#ef4444", "#fb923c", "#10b981"]
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  // 3. Cash Flow Table & Waterfall Bar Chart
  renderCashFlowTable(cf) {
    this.indRender.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
        <!-- Table -->
        <div class="card" style="padding: 1.5rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="table"></i> Lưu chuyển Tiền tệ năm ${this.indYear} (Đơn vị: Tỷ VND)
          </h3>
          <table class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Dòng lưu chuyển tiền</th>
                <th style="text-align: right; padding: 0.75rem; width: 120px;">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.75rem 0.75rem; font-weight: 600;">1. Dòng tiền từ Hoạt động Kinh doanh</td>
                <td style="padding: 0.75rem 0.75rem; text-align: right; font-weight: 600; color: ${cf.operating_cf >= 0 ? "var(--success)" : "var(--danger)"};">${this.formatNumber(cf.operating_cf)}</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem 0.75rem; font-weight: 600;">2. Dòng tiền từ Hoạt động Đầu tư</td>
                <td style="padding: 0.75rem 0.75rem; text-align: right; font-weight: 600; color: ${cf.investing_cf >= 0 ? "var(--success)" : "var(--danger)"};">${this.formatNumber(cf.investing_cf)}</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem 0.75rem; font-weight: 600;">3. Dòng tiền từ Hoạt động Tài chính</td>
                <td style="padding: 0.75rem 0.75rem; text-align: right; font-weight: 600; color: ${cf.financing_cf >= 0 ? "var(--success)" : "var(--danger)"};">${this.formatNumber(cf.financing_cf)}</td>
              </tr>
              <tr style="font-weight: bold; color: var(--primary);">
                <td style="padding: 0.85rem 0.75rem;">LƯU CHUYỂN TIỀN THUẦN TRONG KỲ</td>
                <td style="padding: 0.85rem 0.75rem; text-align: right; color: ${cf.net_cf >= 0 ? "var(--success)" : "var(--danger)"};">${this.formatNumber(cf.net_cf)}</td>
              </tr>
              <tr style="border-top: 1.5px solid var(--border-color);">
                <td style="padding: 0.65rem 0.75rem;">- Tiền và tương đương tiền đầu kỳ</td>
                <td style="padding: 0.65rem 0.75rem; text-align: right;">${this.formatNumber(cf.beginning_cash)}</td>
              </tr>
              <tr style="font-weight: bold; border-top: 1.5px solid var(--border-color); color: var(--text-main);">
                <td style="padding: 0.75rem 0.75rem;">- Tiền và tương đương tiền cuối kỳ</td>
                <td style="padding: 0.75rem 0.75rem; text-align: right;">${this.formatNumber(cf.ending_cash)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Chart -->
        <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; min-height: 400px;">
          <h3 style="margin-bottom: 1.5rem; font-size: 1.05rem;"><i data-lucide="bar-chart-2"></i> Lưu chuyển dòng tiền hoạt động (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 300px;">
            <canvas id="chart-ind-fin-structure"></canvas>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    this.charts.indFinStructure = new Chart(document.getElementById("chart-ind-fin-structure").getContext("2d"), {
      type: "bar",
      data: {
        labels: ["HĐ Kinh doanh", "HĐ Đầu tư", "HĐ Tài chính", "Lưu chuyển Thuần"],
        datasets: [{
          label: "Dòng tiền (Tỷ VND)",
          data: [cf.operating_cf, cf.investing_cf, cf.financing_cf, cf.net_cf],
          backgroundColor: [
            cf.operating_cf >= 0 ? "#10b981" : "#ef4444",
            cf.investing_cf >= 0 ? "#10b981" : "#ef4444",
            cf.financing_cf >= 0 ? "#10b981" : "#ef4444",
            cf.net_cf >= 0 ? "#2563eb" : "#f59e0b"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  // 4. Individual Time Series Trends
  renderIndividualSeries(bankInfo) {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    
    this.indRender.innerHTML = `
      <div class="card" style="padding: 1.5rem; min-height: 380px; display: flex; flex-direction: column;">
        <h3 style="margin-bottom: 1.5rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="trending-up"></i> Xu thái tăng trưởng BCTC - ${bankInfo.name} (${this.indBank})
        </h3>
        <div style="flex-grow: 1; position: relative; height: 300px;">
          <canvas id="chart-ind-fin-trend"></canvas>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    let datasets = [];
    const bctc = bankInfo.bctc_data;

    if (this.currentFinancialSub === "balance-sheet") {
      datasets = [
        {
          label: "Tổng tài sản",
          data: years.map(y => bctc[y] ? bctc[y].balance_sheet.total_assets : null),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.05)",
          fill: true,
          tension: 0.15
        },
        {
          label: "Cho vay khách hàng",
          data: years.map(y => bctc[y] ? bctc[y].balance_sheet.customer_loans : null),
          borderColor: "#dc2626",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Tiền gửi khách hàng",
          data: years.map(y => bctc[y] ? bctc[y].balance_sheet.customer_deposits : null),
          borderColor: "#f59e0b",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Vốn chủ sở hữu",
          data: years.map(y => bctc[y] ? bctc[y].balance_sheet.equity : null),
          borderColor: "#059669",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        }
      ];
    } else if (this.currentFinancialSub === "income-statement") {
      datasets = [
        {
          label: "Thu nhập lãi thuần (NII)",
          data: years.map(y => bctc[y] ? bctc[y].income_statement.nii : null),
          borderColor: "#6366f1",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Tổng thu nhập hoạt động (TOI)",
          data: years.map(y => bctc[y] ? bctc[y].income_statement.toi : null),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.05)",
          fill: true,
          tension: 0.15
        },
        {
          label: "Chi phí hoạt động (OPEX)",
          data: years.map(y => bctc[y] ? -bctc[y].income_statement.opex : null),
          borderColor: "#ef4444",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Lợi nhuận ròng (PAT)",
          data: years.map(y => bctc[y] ? bctc[y].income_statement.pat : null),
          borderColor: "#10b981",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        }
      ];
    } else {
      datasets = [
        {
          label: "Dòng tiền Kinh doanh",
          data: years.map(y => bctc[y] ? bctc[y].cash_flow.operating_cf : null),
          borderColor: "#10b981",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Dòng tiền Đầu tư",
          data: years.map(y => bctc[y] ? bctc[y].cash_flow.investing_cf : null),
          borderColor: "#ef4444",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Dòng tiền Tài chính",
          data: years.map(y => bctc[y] ? bctc[y].cash_flow.financing_cf : null),
          borderColor: "#8b5cf6",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.15
        },
        {
          label: "Lưu chuyển tiền thuần",
          data: years.map(y => bctc[y] ? bctc[y].cash_flow.net_cf : null),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.05)",
          fill: true,
          tension: 0.15
        }
      ];
    }

    this.charts.indFinTrend = new Chart(document.getElementById("chart-ind-fin-trend").getContext("2d"), {
      type: "line",
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 15 } }
        },
        scales: {
          y: {},
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // 5. Compare Financial Page
  renderCompareFinancial() {
    if (!this.compRender) return;

    this.destroyChart("compFinChartTotalAssets");
    this.destroyChart("compFinChartCustomerLoans");
    this.destroyChart("compFinChartCustomerDeposits");
    this.destroyChart("compFinChartPat");
    this.destroyChart("compFinChartNetCf");

    if (this.compBanks.length < 2) {
      this.compRender.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Vui lòng chọn tối thiểu 2 ngân hàng để so sánh.</p></div>`;
      return;
    }

    // Determine Y axis scale config
    const getScale = (allValues) => {
      if (this.compYScale === "zero") {
        const mx = Math.max(...allValues, 0) * 1.15;
        const mn = Math.min(...allValues, 0) * 1.15;
        return { min: mn < 0 ? mn : 0, max: mx };
      }
      return {}; // auto scale
    };

    if (this.compYear === "series") {
      this.renderCompareSeries(getScale);
      return;
    }

    // COMPARE SINGLE YEAR
    const metrics = ["total_assets", "customer_loans", "customer_deposits", "pat", "net_cf"];
    const metricLabels = {
      "total_assets": "Tổng tài sản",
      "customer_loans": "Cho vay khách hàng",
      "customer_deposits": "Tiền gửi của khách hàng",
      "pat": "Lợi nhuận sau thuế (PAT)",
      "net_cf": "Lưu chuyển tiền thuần"
    };

    // Prepare datasets for charts
    const chartData = {};
    metrics.forEach(m => {
      chartData[m] = {
        values: [],
        colors: [],
        labels: []
      };
      this.compBanks.forEach(b => {
        const bankInfo = window.BANK_DATABASE[b];
        if (bankInfo && bankInfo.bctc_data && bankInfo.bctc_data[this.compYear]) {
          const yr = bankInfo.bctc_data[this.compYear];
          let val = 0;
          if (yr.balance_sheet[m] !== undefined) val = yr.balance_sheet[m];
          else if (yr.income_statement[m] !== undefined) val = yr.income_statement[m];
          else if (yr.cash_flow[m] !== undefined) val = yr.cash_flow[m];
          
          chartData[m].values.push(val);
          chartData[m].colors.push(bankInfo.color);
          chartData[m].labels.push(b);
        }
      });
    });

    // Build Table Rows
    let tableRows = "";
    this.compBanks.forEach(b => {
      const bankInfo = window.BANK_DATABASE[b];
      const yr = bankInfo.bctc_data[this.compYear];
      
      const getValStr = (m) => {
        if (!yr) return "-";
        let val = 0;
        if (yr.balance_sheet[m] !== undefined) val = yr.balance_sheet[m];
        else if (yr.income_statement[m] !== undefined) val = yr.income_statement[m];
        else if (yr.cash_flow[m] !== undefined) val = yr.cash_flow[m];
        return this.formatNumber(val);
      };

      // Audited BCTC file link
      let auditedLink = `<span style="color: var(--text-muted); font-size: 0.82rem;">Không có file</span>`;
      if (bankInfo.bctc_files && bankInfo.bctc_files[this.compYear]) {
        const filename = bankInfo.bctc_files[this.compYear];
        auditedLink = `
          <button class="pdf-btn" onclick="window.baselAnalysis.openPDF('docs/banks_bctc/${filename}')" style="background: rgba(5,150,105,0.1); border: 1px solid var(--success); color: var(--success); padding: 0.3rem 0.75rem; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.82rem; display: flex; align-items: center; gap: 0.25rem;">
            <i data-lucide="external-link" style="width:13px;height:13px;"></i> Mở BCTC
          </button>
        `;
      }

      tableRows += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${bankInfo.color};"></span>
            ${bankInfo.name} (${b})
          </td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 600;">${getValStr("total_assets")}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 600;">${getValStr("customer_loans")}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 600;">${getValStr("customer_deposits")}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: var(--success);">${getValStr("pat")}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 600;">${getValStr("net_cf")}</td>
          <td style="padding: 0.75rem; text-align: center;">${auditedLink}</td>
        </tr>
      `;
    });

    this.compRender.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <!-- Chart 1: Tổng tài sản -->
        <div class="card" style="padding: 1.5rem; min-height: 300px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="bar-chart-2"></i> So sánh Tổng tài sản năm ${this.compYear} (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 220px;">
            <canvas id="chart-comp-fin-total-assets"></canvas>
          </div>
        </div>

        <!-- Chart 2: Cho vay khách hàng -->
        <div class="card" style="padding: 1.5rem; min-height: 300px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="bar-chart-2"></i> So sánh Cho vay Khách hàng năm ${this.compYear} (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 220px;">
            <canvas id="chart-comp-fin-customer-loans"></canvas>
          </div>
        </div>

        <!-- Chart 3: Tiền gửi khách hàng -->
        <div class="card" style="padding: 1.5rem; min-height: 300px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="bar-chart-2"></i> So sánh Tiền gửi Khách hàng năm ${this.compYear} (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 220px;">
            <canvas id="chart-comp-fin-customer-deposits"></canvas>
          </div>
        </div>

        <!-- Chart 4: Lợi nhuận sau thuế -->
        <div class="card" style="padding: 1.5rem; min-height: 300px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="bar-chart-2"></i> So sánh Lợi nhuận sau thuế (PAT) năm ${this.compYear} (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 220px;">
            <canvas id="chart-comp-fin-pat"></canvas>
          </div>
        </div>

        <!-- Chart 5: Dòng tiền thuần -->
        <div class="card" style="padding: 1.5rem; min-height: 300px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="bar-chart-2"></i> So sánh Lưu chuyển tiền thuần năm ${this.compYear} (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 220px;">
            <canvas id="chart-comp-fin-net-cf"></canvas>
          </div>
        </div>

        <!-- Table -->
        <div class="card" style="padding: 1.5rem; overflow-x: auto;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;"><i data-lucide="table"></i> Chi tiết Đối chiếu Chỉ số năm ${this.compYear} (Tỷ VND)</h3>
          <table id="financial-compare-yearly-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Ngân hàng</th>
                <th style="text-align: right; padding: 0.75rem;">Tổng tài sản</th>
                <th style="text-align: right; padding: 0.75rem;">Cho vay KH</th>
                <th style="text-align: right; padding: 0.75rem;">Tiền gửi KH</th>
                <th style="text-align: right; padding: 0.75rem;">Lợi nhuận (PAT)</th>
                <th style="text-align: right; padding: 0.75rem;">Dòng tiền thuần</th>
                <th style="text-align: center; padding: 0.75rem; width: 140px;">BCTC Kiểm toán</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    // Helper function to render compare bar charts
    const createCompareBarChart = (canvasId, dataKey) => {
      const info = chartData[dataKey];
      return new Chart(document.getElementById(canvasId).getContext("2d"), {
        type: "bar",
        data: {
          labels: info.labels,
          datasets: [{
            label: metricLabels[dataKey],
            data: info.values,
            backgroundColor: info.colors,
            borderWidth: 0,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              
              
              ...getScale(info.values)
            },
            x: {
              grid: { display: false },
              
            }
          }
        }
      });
    };

    // Instantiate 5 charts
    this.charts.compFinChartTotalAssets = createCompareBarChart("chart-comp-fin-total-assets", "total_assets");
    this.charts.compFinChartCustomerLoans = createCompareBarChart("chart-comp-fin-customer-loans", "customer_loans");
    this.charts.compFinChartCustomerDeposits = createCompareBarChart("chart-comp-fin-customer-deposits", "customer_deposits");
    this.charts.compFinChartPat = createCompareBarChart("chart-comp-fin-pat", "pat");
    this.charts.compFinChartNetCf = createCompareBarChart("chart-comp-fin-net-cf", "net_cf");
    this.setupSortableTable("financial-compare-yearly-table");
    this.attachCompareTableClickHandlers();
  }

  // 6. Compare Time Series
  renderCompareSeries(getScale) {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    const metrics = ["total_assets", "customer_loans", "customer_deposits", "pat", "net_cf"];
    const metricLabels = {
      "total_assets": "Tổng tài sản",
      "customer_loans": "Cho vay khách hàng",
      "customer_deposits": "Tiền gửi của khách hàng",
      "pat": "Lợi nhuận sau thuế (PAT)",
      "net_cf": "Lưu chuyển tiền thuần"
    };

    if (!this.compTableMetric) this.compTableMetric = "pat";

    // Prepare datasets for all 5 metrics
    const chartDatasets = {};
    const chartAllValues = {};

    metrics.forEach(m => {
      chartDatasets[m] = [];
      chartAllValues[m] = [];

      this.compBanks.forEach(b => {
        const bankInfo = window.BANK_DATABASE[b];
        if (bankInfo && bankInfo.bctc_data) {
          const data = years.map(y => {
            const yr = bankInfo.bctc_data[y];
            if (!yr) return null;
            let val = 0;
            if (yr.balance_sheet[m] !== undefined) val = yr.balance_sheet[m];
            else if (yr.income_statement[m] !== undefined) val = yr.income_statement[m];
            else if (yr.cash_flow[m] !== undefined) val = yr.cash_flow[m];
            chartAllValues[m].push(val);
            return val;
          });

          chartDatasets[m].push({
            label: `${bankInfo.name} (${b})`,
            shortLabel: b,
            data: data,
            borderColor: bankInfo.color,
            backgroundColor: bankInfo.color + "10",
            fill: false,
            tension: 0.15,
            borderWidth: 2.5,
            pointRadius: 4
          });
        }
      });
    });

    // Build metric toggle buttons for the table
    let toggleButtons = "";
    metrics.forEach(m => {
      const activeStyle = this.compTableMetric === m ? "background: var(--primary); color: white;" : "background: rgba(255,255,255,0.05); color: var(--text-muted);";
      toggleButtons += `
        <button class="metric-toggle-btn" data-metric="${m}" style="padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; border: none; cursor: pointer; ${activeStyle}">
          ${metricLabels[m]}
        </button>
      `;
    });

    // Build Table Headers & Rows for the selected metric
    let tableHeaders = `<th style="text-align: left; padding: 0.75rem;">Ngân hàng</th>`;
    years.forEach(y => {
      tableHeaders += `<th style="text-align: right; padding: 0.75rem; min-width: 90px;">${y}</th>`;
    });

    let tableRows = "";
    chartDatasets[this.compTableMetric].forEach((ds, idx) => {
      const bankCode = this.compBanks[idx];
      const bankInfo = window.BANK_DATABASE[bankCode];
      
      let cells = "";
      ds.data.forEach(val => {
        cells += `<td style="padding: 0.75rem; text-align: right; font-weight: 600;">${this.formatNumber(val)}</td>`;
      });

      tableRows += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${ds.borderColor};"></span>
            ${bankInfo.name} (${bankCode})
          </td>
          ${cells}
        </tr>
      `;
    });

    this.compRender.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <!-- Chart 1: Tổng tài sản -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="trending-up"></i> Xu hướng so sánh Tổng tài sản (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-fin-total-assets"></canvas>
          </div>
        </div>

        <!-- Chart 2: Cho vay khách hàng -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="trending-up"></i> Xu hướng so sánh Cho vay Khách hàng (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-fin-customer-loans"></canvas>
          </div>
        </div>

        <!-- Chart 3: Tiền gửi khách hàng -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="trending-up"></i> Xu hướng so sánh Tiền gửi Khách hàng (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-fin-customer-deposits"></canvas>
          </div>
        </div>

        <!-- Chart 4: Lợi nhuận sau thuế -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="trending-up"></i> Xu hướng so sánh Lợi nhuận sau thuế (PAT) (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-fin-pat"></canvas>
          </div>
        </div>

        <!-- Chart 5: Dòng tiền thuần -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; font-size: 1.02rem;"><i data-lucide="trending-up"></i> Xu hướng so sánh Lưu chuyển tiền thuần (Tỷ VND)</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-fin-net-cf"></canvas>
          </div>
        </div>

        <!-- Table with metric selector tabs -->
        <div class="card" style="padding: 1.5rem; overflow-x: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <h3 style="margin: 0; font-size: 1.05rem;"><i data-lucide="table"></i> Chi tiết chuỗi thời gian (Tỷ VND)</h3>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              ${toggleButtons}
            </div>
          </div>
          <table id="financial-compare-series-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                ${tableHeaders}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();
    if (!window.Chart) return;

    // Attach click events to toggle buttons
    const buttons = this.compRender.querySelectorAll(".metric-toggle-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.compTableMetric = btn.getAttribute("data-metric");
        this.renderCompareFinancial();
      });
    });

    const endLabelPlugin = window.baselAnalysis ? window.baselAnalysis.getEndLabelPlugin() : null;

    const createCompareSeriesChart = (canvasId, dataKey) => {
      const dsets = chartDatasets[dataKey];
      const allVals = chartAllValues[dataKey];
      
      return new Chart(document.getElementById(canvasId).getContext("2d"), {
        type: "line",
        data: {
          labels: years,
          datasets: dsets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: endLabelPlugin ? 80 : 10 } },
          plugins: {
            legend: { display: !endLabelPlugin, position: "bottom", labels: { boxWidth: 15 } }
          },
          scales: {
            y: {
              
              
              ...getScale(allVals)
            },
            x: {
              grid: { display: false },
              
            }
          }
        },
        plugins: endLabelPlugin ? [endLabelPlugin] : []
      });
    };

    // Instantiate 5 charts
    this.charts.compFinChartTotalAssets = createCompareSeriesChart("chart-comp-fin-total-assets", "total_assets");
    this.charts.compFinChartCustomerLoans = createCompareSeriesChart("chart-comp-fin-customer-loans", "customer_loans");
    this.charts.compFinChartCustomerDeposits = createCompareSeriesChart("chart-comp-fin-customer-deposits", "customer_deposits");
    this.charts.compFinChartPat = createCompareSeriesChart("chart-comp-fin-pat", "pat");
    this.charts.compFinChartNetCf = createCompareSeriesChart("chart-comp-fin-net-cf", "net_cf");
    this.setupSortableTable("financial-compare-series-table");
    this.attachCompareTableClickHandlers();
  }

  // Biến bảng thường thành bảng sắp xếp được khi click vào header
  setupSortableTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    let sortState = { col: -1, asc: true };

    headers.forEach((th, colIdx) => {
      if (th.textContent.includes("BCTC") || th.textContent.includes("Bản BCTC")) return;

      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      th.title = 'Click để sắp xếp';
      const icon = document.createElement('span');
      icon.className = 'sort-icon';
      icon.style.cssText = 'margin-left:4px;opacity:0.35;font-size:0.75em;transition:opacity 0.15s';
      icon.textContent = '⇅';
      th.appendChild(icon);

      th.addEventListener('click', () => {
        const isActive = sortState.col === colIdx;
        sortState.asc = isActive ? !sortState.asc : true;
        sortState.col = colIdx;

        headers.forEach((h, i) => {
          const ic = h.querySelector('.sort-icon');
          if (!ic) return;
          if (i === colIdx) {
            ic.textContent = sortState.asc ? '▲' : '▼';
            ic.style.opacity = '1';
            ic.style.color = 'var(--primary)';
          } else {
            ic.textContent = '⇅';
            ic.style.opacity = '0.35';
            ic.style.color = '';
          }
        });

        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
          const aCell = a.cells[colIdx];
          const bCell = b.cells[colIdx];
          if (!aCell || !bCell) return 0;
          const aText = aCell.textContent.replace(/[%,\s]/g, '').trim();
          const bText = bCell.textContent.replace(/[%,\s]/g, '').trim();
          const aNum = parseFloat(aText);
          const bNum = parseFloat(bText);
          const useNum = !isNaN(aNum) && !isNaN(bNum);
          const cmp = useNum ? aNum - bNum : aText.localeCompare(bText, 'vi');
          return sortState.asc ? cmp : -cmp;
        });

        tbody.style.opacity = '0.3';
        setTimeout(() => {
          rows.forEach(r => tbody.appendChild(r));
          tbody.style.transition = 'opacity 0.18s';
          tbody.style.opacity = '1';
        }, 80);
      });
    });
  }

  attachTableClickHandlers() {
    const bankInfo = window.BANK_DATABASE[this.indBank];
    if (!bankInfo) return;
    
    if (this.indYear !== "series") {
      const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[this.indYear];
      if (bctcFile) {
        const cells = this.indRender.querySelectorAll("table.basel-table tbody td:nth-child(2)");
        cells.forEach(td => {
          const text = td.textContent.trim();
          if (text !== "" && text !== "-" && text !== "A. TÀI SẢN" && text !== "B. NGUỒN VỐN (NỢ PHẢI TRẢ & VỐN CSH)") {
            td.style.cursor = "pointer";
            td.style.textDecoration = "underline dashed var(--primary)";
            td.addEventListener("click", () => {
              window.documentFinder.openPdfViewer(`docs/banks_bctc/${bctcFile}`, `${bankInfo.name} - BCTC ${this.indYear}`);
            });
          }
        });
      }
    }
  }

  attachCompareTableClickHandlers() {
    if (this.compYear !== "series") {
      const table = document.getElementById("financial-compare-yearly-table");
      if (!table) return;
      
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.querySelector("td:nth-child(1)");
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        const bankInfo = window.BANK_DATABASE[bankCode];
        if (!bankInfo) return;
        
        const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[this.compYear];
        if (bctcFile) {
          for (let i = 1; i <= 5; i++) {
            const td = row.cells[i];
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                window.documentFinder.openPdfViewer(`docs/banks_bctc/${bctcFile}`, `${bankInfo.name} - BCTC ${this.compYear}`);
              });
            }
          }
          bankCell.style.cursor = "pointer";
          bankCell.style.textDecoration = "underline dashed var(--primary)";
          bankCell.addEventListener("click", () => {
            window.documentFinder.openPdfViewer(`docs/banks_bctc/${bctcFile}`, `${bankInfo.name} - BCTC ${this.compYear}`);
          });
        }
      });
    } else {
      const table = document.getElementById("financial-compare-series-table");
      if (!table) return;
      
      const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.querySelector("td:nth-child(1)");
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        const bankInfo = window.BANK_DATABASE[bankCode];
        if (!bankInfo) return;
        
        years.forEach((y, yIdx) => {
          const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[y];
          if (bctcFile) {
            const td = row.cells[yIdx + 1];
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                window.documentFinder.openPdfViewer(`docs/banks_bctc/${bctcFile}`, `${bankInfo.name} - BCTC ${y}`);
              });
            }
          }
        });
      });
    }
  }
}

// Khởi tạo đối tượng toàn cục
window.financialAnalysis = new FinancialAnalysis();

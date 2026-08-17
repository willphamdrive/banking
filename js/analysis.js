// Cơ sở dữ liệu và Logic Phân tích CAR Đơn lẻ & So sánh Đối chiếu (10 Ngân hàng VN, 2022 - 2025)
// Tích hợp biểu đồ Chart.js tương tác cao và hỗ trợ SVG failover ngoại tuyến

const BANK_NAMES = {
  TCB: "Techcombank",
  VCB: "Vietcombank",
  BID: "BIDV",
  CTG: "VietinBank",
  MBB: "MBBank",
  VPB: "VPBank",
  ACB: "ACB",
  STB: "Sacombank",
  TPB: "TPBank",
  HDB: "HDBank"
};

const BANK_COLORS = {
  TCB: "#dc2626", // Đỏ đậm (Techcombank)
  VCB: "#059669", // Xanh lá đậm (Vietcombank)
  BID: "#1e3a8a", // Xanh navy đậm (BIDV)
  CTG: "#06b6d4", // Xanh da trời Cyan (VietinBank)
  MBB: "#2563eb", // Xanh dương Royal (MBBank)
  VPB: "#10b981", // Xanh lục Mint (VPBank)
  ACB: "#d946ef", // Hồng cánh sen Magenta (ACB - có độ tương phản cao)
  STB: "#ea580c", // Cam tươi (Sacombank)
  TPB: "#7c3aed", // Tím đậm Orchid (TPBank)
  HDB: "#f59e0b"  // Vàng hổ phách Amber (HDBank)
};

// Dữ liệu tài chính thực tế & ước tính hợp lý từ báo cáo CAR 10 Ngân hàng (2019 - 2025)
const BANK_CAR_DATABASE = {
  TCB: {
    2019: { car: 15.50, capital: 70000, rwa: 451000, charter: 34965, pdf: "TCB_CAR_2019_Nam.pdf" },
    2020: { car: 16.10, capital: 90000, rwa: 559000, charter: 35001, pdf: "TCB_CAR_2020_Nam.pdf" },
    2021: { car: 15.00, capital: 122000, rwa: 813000, charter: 35049, pdf: "TCB_CAR_2021_Nam.pdf" },
    2022: { car: 15.20, capital: 151200, rwa: 994700, charter: 35172, pdf: "TCB_CAR_2022_Nam.pdf" },
    2023: { car: 14.40, capital: 161500, rwa: 1121500, charter: 35229, pdf: "TCB_CAR_2023_Nam.pdf" },
    2024: { car: 15.00, capital: 165500, rwa: 1103300, charter: 70450, pdf: "TCB_CAR_2024_Nam.pdf" },
    2025: { car: 14.61, capital: 181870, rwa: 1244531, charter: 70450, pdf: "TCB_CAR_2025_Nam.pdf" }
  },
  VCB: {
    2019: { car: 10.80, capital: 93000, rwa: 861000, charter: 37088, pdf: "VCB_CAR_2019_Nam.pdf" },
    2020: { car: 11.10, capital: 112000, rwa: 1009000, charter: 37088, pdf: "VCB_CAR_2020_Nam.pdf" },
    2021: { car: 11.20, capital: 135000, rwa: 1205000, charter: 47325, pdf: "VCB_CAR_2021_Nam.pdf" },
    2022: { car: 11.50, capital: 153000, rwa: 1330400, charter: 47325, pdf: "VCB_CAR_2022_Nam.pdf" },
    2023: { car: 11.60, capital: 172338, rwa: 1485600, charter: 55891, pdf: "VCB_CAR_2023_Nam.pdf" },
    2024: { car: 11.80, capital: 173000, rwa: 1466100, charter: 55891, pdf: "VCB_CAR_2024_Nam.pdf" },
    2025: { car: 11.70, capital: 175000, rwa: 1495000, charter: 83557, pdf: "VCB_CAR_2025_Nam.pdf" }
  },
  BID: {
    2019: { car: 9.20, capital: 85000, rwa: 923000, charter: 40220, pdf: "BID_CAR_2019_Nam.pdf" },
    2020: { car: 9.50, capital: 94000, rwa: 989000, charter: 40220, pdf: "BID_CAR_2020_Nam.pdf" },
    2021: { car: 9.60, capital: 104000, rwa: 1083000, charter: 50585, pdf: "BID_CAR_2021_Nam.pdf" },
    2022: { car: 9.80, capital: 112000, rwa: 1142800, charter: 50585, pdf: "BID_CAR_2022_Nam.pdf" },
    2023: { car: 9.90, capital: 123400, rwa: 1246400, charter: 57004, pdf: "BID_CAR_2023_Nam.pdf" },
    2024: { car: 10.10, capital: 128500, rwa: 1272200, charter: 57004, pdf: "BID_CAR_2024_Nam.pdf" },
    2025: { car: 10.20, capital: 135000, rwa: 1323500, charter: 70958, pdf: "BID_CAR_2025_Nam.pdf" }
  },
  CTG: {
    2021: { car: 9.00, capital: 90500, rwa: 1005000, charter: 48058, pdf: "CTG_CAR_2021_Nam.pdf" },
    2022: { car: 9.20, capital: 101000, rwa: 1097800, charter: 48058, pdf: "CTG_CAR_2022_Nam.pdf" },
    2023: { car: 9.40, capital: 115200, rwa: 1225500, charter: 53700, pdf: "CTG_CAR_2023_Nam.pdf" },
    2024: { car: 9.60, capital: 120100, rwa: 1251000, charter: 53700, pdf: "CTG_CAR_2024_Nam.pdf" },
    2025: { car: 9.80, capital: 124000, rwa: 1265300, charter: 53700, pdf: "CTG_CAR_2025_Nam.pdf" }
  },
  MBB: {
    2019: { car: 10.50, capital: 41000, rwa: 390000, charter: 23727, pdf: "MBB_CAR_2019_Nam.pdf" },
    2020: { car: 10.90, capital: 52000, rwa: 477000, charter: 27987, pdf: "MBB_CAR_2020_Nam.pdf" },
    2021: { car: 11.10, capital: 68000, rwa: 612000, charter: 37783, pdf: "MBB_CAR_2021_Nam.pdf" },
    2022: { car: 11.20, capital: 78000, rwa: 696400, charter: 45339, pdf: "MBB_CAR_2022_Nam.pdf" },
    2023: { car: 11.50, capital: 93400, rwa: 812100, charter: 52141, pdf: "MBB_CAR_2023_Nam.pdf" },
    2024: { car: 11.60, capital: 98000, rwa: 844800, charter: 52141, pdf: "MBB_CAR_2024_Nam.pdf" },
    2025: { car: 11.40, capital: 105000, rwa: 921000, charter: 52871, pdf: "MBB_CAR_2025_Nam.pdf" }
  },
  VPB: {
    2019: { car: 11.90, capital: 58000, rwa: 487000, charter: 25299, pdf: "VPB_CAR_2019_Nam.pdf" },
    2020: { car: 12.10, capital: 70000, rwa: 578000, charter: 25299, pdf: "VPB_CAR_2020_Nam.pdf" },
    2021: { car: 12.30, capital: 88000, rwa: 715000, charter: 45057, pdf: "VPB_CAR_2021_Nam.pdf" },
    2022: { car: 12.50, capital: 108000, rwa: 864000, charter: 67434, pdf: "VPB_CAR_2022_Nam.pdf" },
    2023: { car: 12.30, capital: 128000, rwa: 1040600, charter: 79339, pdf: "VPB_CAR_2023_Nam.pdf" },
    2024: { car: 12.20, capital: 135000, rwa: 1106500, charter: 79339, pdf: "VPB_CAR_2024_Nam.pdf" },
    2025: { car: 12.00, capital: 142000, rwa: 1183300, charter: 79339, pdf: "VPB_CAR_2025_Nam.pdf" }
  },
  ACB: {
    2019: { car: 11.20, capital: 40000, rwa: 357000, charter: 16627, pdf: "ACB_CAR_2019_Nam.pdf" },
    2020: { car: 11.60, capital: 49000, rwa: 422000, charter: 21615, pdf: "ACB_CAR_2020_Nam.pdf" },
    2021: { car: 11.80, capital: 59000, rwa: 500000, charter: 27019, pdf: "ACB_CAR_2021_Nam.pdf" },
    2022: { car: 12.20, capital: 65200, rwa: 534400, charter: 33774, pdf: "ACB_CAR_2022_Nam.pdf" },
    2023: { car: 12.40, capital: 74500, rwa: 600800, charter: 38840, pdf: "ACB_CAR_2023_Nam.pdf" },
    2024: { car: 12.50, capital: 81200, rwa: 649600, charter: 44666, pdf: "ACB_CAR_2024_Nam.pdf" },
    2025: { car: 12.30, capital: 88500, rwa: 719500, charter: 44666, pdf: "ACB_CAR_2025_Nam.pdf" }
  },
  STB: {
    2020: { car: 9.10, capital: 31000, rwa: 340000, charter: 18852, pdf: "STB_CAR_2020_Nam.pdf" },
    2021: { car: 9.30, capital: 36000, rwa: 387000, charter: 18852, pdf: "STB_CAR_2021_Nam.pdf" },
    2022: { car: 9.40, capital: 43200, rwa: 459500, charter: 18852, pdf: "STB_CAR_2022_Nam.pdf" },
    2023: { car: 9.60, capital: 51200, rwa: 533300, charter: 18852, pdf: "STB_CAR_2023_Nam.pdf" },
    2024: { car: 9.80, capital: 55400, rwa: 565300, charter: 18852, pdf: "STB_CAR_2024_Nam.pdf" },
    2025: { car: 9.90, capital: 61500, rwa: 621200, charter: 18852, pdf: "STB_CAR_2025_Nam.pdf" }
  },
  TPB: {
    2019: { car: 11.50, capital: 19000, rwa: 165000, charter: 8565, pdf: "TPB_CAR_2019_Nam.pdf" },
    2020: { car: 11.80, capital: 24000, rwa: 203000, charter: 10716, pdf: "TPB_CAR_2020_Nam.pdf" },
    2021: { car: 12.00, capital: 29000, rwa: 241000, charter: 15817, pdf: "TPB_CAR_2021_Nam.pdf" },
    2022: { car: 12.10, capital: 31200, rwa: 257800, charter: 15817, pdf: "TPB_CAR_2022_Nam.pdf" },
    2023: { car: 12.20, capital: 36500, rwa: 299100, charter: 22016, pdf: "TPB_CAR_2023_Nam.pdf" },
    2024: { car: 11.80, capital: 38200, rwa: 323700, charter: 22016, pdf: "TPB_CAR_2024_Nam.pdf" },
    2025: { car: 11.60, capital: 42300, rwa: 364600, charter: 22016, pdf: "TPB_CAR_2025_Nam.pdf" }
  },
  HDB: {
    2020: { car: 11.50, capital: 26000, rwa: 226000, charter: 12707, pdf: "HDB_CAR_2020_Nam.pdf" },
    2021: { car: 12.10, capital: 36000, rwa: 297000, charter: 20072, pdf: "HDB_CAR_2021_Nam.pdf" },
    2022: { car: 12.40, capital: 41200, rwa: 332200, charter: 25303, pdf: "HDB_CAR_2022_Nam.pdf" },
    2023: { car: 12.20, capital: 48500, rwa: 397500, charter: 29076, pdf: "HDB_CAR_2023_Nam.pdf" },
    2024: { car: 12.30, capital: 53200, rwa: 432500, charter: 29076, pdf: "HDB_CAR_2024_Nam.pdf" },
    2025: { car: 12.10, capital: 61000, rwa: 504100, charter: 34702, pdf: "HDB_CAR_2025_Nam.pdf" }
  }
};

class BaselAnalysis {
  constructor() {
    this.currentSubTab = "individual";
    
    // Trạng thái Phân tích Đơn lẻ
    this.indBank = "TCB";
    this.indYear = "2025";
    
    // Trạng thái So sánh Đối chiếu
    this.compBanks = ["TCB", "VCB", "BID", "MBB"];
    this.compYear = "2025";

    // Quản lý các phiên bản Chart.js active để destroy khi redraw
    this.charts = {};

    this.initElements();
    this.bindEvents();
    this.setupChartTheme();
    
    // Render ban đầu
    this.renderIndividualAnalysis();
    this.renderCompareAnalysis();
  }

  initElements() {
    this.section = document.getElementById("bank-analysis-section");
    if (!this.section) return;

    // Sub-tab buttons
    this.subTabBtns = this.section.querySelectorAll(".sub-tab-btn");
    this.subTabPanels = this.section.querySelectorAll(".sub-tab-panel");

    // Phân tích Đơn lẻ Controllers
    this.indBankSelect = document.getElementById("analysis-bank-select");
    this.indYearBtns = this.section.querySelectorAll("#analysis-year-selectors .year-btn");
    this.indRender = document.getElementById("individual-analysis-render");

    // So sánh Đối chiếu Controllers
    this.compCheckboxes = this.section.querySelectorAll("#compare-banks-checkboxes input");
    this.compYearBtns = this.section.querySelectorAll("#compare-year-selectors .year-btn");
    this.compRender = document.getElementById("compare-analysis-render");
  }

  bindEvents() {
    // 1. Chuyển đổi Sub-tab
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
        this.renderIndividualAnalysis();
        this.renderCompareAnalysis();
      });
    });

    // 2. Event Phân tích Đơn lẻ
    if (this.indBankSelect) {
      this.indBankSelect.addEventListener("change", (e) => {
        this.indBank = e.target.value;
        this.renderIndividualAnalysis();
      });
    }

    this.indYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.indYearBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.indYear = btn.getAttribute("data-year");
        this.renderIndividualAnalysis();
      });
    });

    // 3. Event So sánh Đối chiếu
    const selectAllCb = document.getElementById("compare-select-all");
    if (selectAllCb) {
      selectAllCb.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        this.compCheckboxes.forEach(cb => {
          cb.checked = isChecked;
        });

        if (!isChecked) {
          // Nếu bỏ chọn tất cả, giữ lại ít nhất 2 ngân hàng đầu tiên để tránh lỗi (TCB và VCB)
          this.compCheckboxes[0].checked = true;
          this.compCheckboxes[1].checked = true;
          selectAllCb.checked = false; // Tắt trạng thái Chọn tất cả
        }

        const checked = Array.from(this.compCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);

        this.compBanks = checked;
        this.renderCompareAnalysis();
      });
    }

    this.compCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = Array.from(this.compCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        
        if (checked.length < 2) {
          cb.checked = true;
          alert("Vui lòng chọn tối thiểu 2 ngân hàng để so sánh đối chiếu!");
          return;
        }

        if (selectAllCb) {
          selectAllCb.checked = (checked.length === this.compCheckboxes.length);
        }

        this.compBanks = checked;
        this.renderCompareAnalysis();
      });
    });

    this.compYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.compYearBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.compYear = btn.getAttribute("data-year");
        this.renderCompareAnalysis();
      });
    });

    // Lắng nghe sự kiện đổi theme để vẽ lại biểu đồ
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        setTimeout(() => {
          this.setupChartTheme();
          this.renderIndividualAnalysis();
          this.renderCompareAnalysis();
        }, 100);
      });
    }
  }

  // Cấu hình phông chữ và màu sắc trục tọa độ Chart.js phù hợp chế độ giao diện sáng/tối
  setupChartTheme() {
    if (!window.Chart) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textThemeColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)";
    const gridThemeColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    Chart.defaults.color = textThemeColor;
    Chart.defaults.borderColor = gridThemeColor;
    Chart.defaults.font.family = "'Outfit', sans-serif";
  }

  // Hủy instance Chart.js cũ để tránh lỗi chồng chéo canvas
  destroyChart(key) {
    if (this.charts[key]) {
      this.charts[key].destroy();
      delete this.charts[key];
    }
  }

  // === RENDER TRANG PHỤ 1: PHÂN TÍCH ĐƠN LẺ ===
  renderIndividualAnalysis() {
    if (!this.indRender) return;

    const bankData = BANK_CAR_DATABASE[this.indBank];
    const bankName = BANK_NAMES[this.indBank];
    const color = BANK_COLORS[this.indBank];

    // Hủy các chart cũ của trang đơn lẻ
    this.destroyChart("indCar");
    this.destroyChart("indScale");
    this.destroyChart("indCarTrend");
    this.destroyChart("indGrowth");

    if (this.indYear !== "series") {
      const yearData = bankData[this.indYear];
      if (!yearData) {
        this.indRender.innerHTML = `
          <div class="card" style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--warning);"></i>
            <h3>Dữ liệu không khả dụng</h3>
            <p style="font-size: 0.88rem; max-width: 400px; margin-top: 4px;">Báo cáo CAR năm ${this.indYear} của ${bankName} chưa được công bố hoặc không có sẵn trong hệ thống.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }
      const isMet = yearData.car >= 8.0;
      const margin = (yearData.car - 8.0).toFixed(2);

      this.indRender.innerHTML = `
        <!-- KPI Row -->
        <div class="ratios-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card" style="border-left: 5px solid ${color};">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Hệ số an toàn vốn (CAR)</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2.2rem; font-weight: 800; color: ${color};">${yearData.car.toFixed(2)}%</span>
            </div>
            <span style="font-size: 0.75rem; color: ${isMet ? 'var(--success)' : 'var(--danger)'}; font-weight: 600; display: block; margin-top: 8px;">
              ${isMet ? `✔️ Đạt chuẩn (Vượt +${margin}%)` : `❌ Chưa đạt (Thiếu ${Math.abs(margin)}%)`}
            </span>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Vốn tự có</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.capital.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Tài sản rủi ro (RWA)</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.rwa.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Vốn điều lệ</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.charter.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>
        </div>

        <!-- Chart Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Chart.js Canvas for CAR comparison -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 250px;">
            <h4 style="margin: 0 0 1rem 0; color: var(--text-muted); text-align: center;">Tỷ lệ CAR so với ngưỡng tối thiểu (8.00%)</h4>
            <div style="flex-grow: 1; position: relative; height: 180px;">
              <canvas id="chart-ind-car"></canvas>
            </div>
          </div>

          <!-- Chart.js Canvas for Capital vs RWA -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 250px;">
            <h4 style="margin: 0 0 1rem 0; color: var(--text-muted); text-align: center;">Cơ cấu Vốn tự có đối ứng RWA</h4>
            <div style="flex-grow: 1; position: relative; height: 180px;">
              <canvas id="chart-ind-scale"></canvas>
            </div>
          </div>
        </div>

        <!-- Document Link -->
        <div class="card" style="border-color: rgba(16, 185, 129, 0.2); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--success); margin: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.15rem;">
                <i data-lucide="file-text"></i> Tài liệu công bố thông tin gốc năm ${this.indYear} (Offline)
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Bạn có thể trực tiếp mở đọc bản PDF báo cáo CAR chính thức cuối năm ${this.indYear} của ${bankName}:</p>
            </div>
            <a href="docs/banks/${yearData.pdf}" target="_blank" class="source-link-btn" style="margin-top: 0; background: ${color}20; border-color: ${color}40; color: ${color};">
              Mở file PDF gốc
            </a>
          </div>
        </div>
      `;

      // Khởi tạo Chart.js sau khi đã nạp DOM
      this.initIndYearlyCharts(yearData, color, bankName);
    } else {
      // RENDERING TIME SERIES FOR INDIVIDUAL BANK
      const years = Object.keys(bankData).map(Number).sort();
      const carDataPoints = years.map(yr => bankData[yr].car);
      const capDataPoints = years.map(yr => bankData[yr].capital);
      const rwaDataPoints = years.map(yr => bankData[yr].rwa);

      this.indRender.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- CAR Time Series Line Chart -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;">Xu hướng CAR (%) ${years[0]} - ${years[years.length-1]}</h3>
            <div style="flex-grow: 1; position: relative;">
              <canvas id="chart-ind-car-trend"></canvas>
            </div>
          </div>

          <!-- RWA vs Capital growth bar chart -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;">Tăng trưởng Vốn tự có vs RWA (Tỷ VND)</h3>
            <div style="flex-grow: 1; position: relative;">
              <canvas id="chart-ind-growth"></canvas>
            </div>
          </div>
        </div>

        <!-- Available reports grid -->
        <div class="card">
          <h3 style="margin-bottom: 1rem;"><i data-lucide="folder-open"></i> Thư viện Báo cáo CAR ngoại tuyến (${bankName})</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            ${years.map(yr => `
              <div class="ratio-box" style="text-align: left; padding: 1rem; border-color: var(--border-color); display: flex; flex-direction: column; gap: 0.5rem; justify-content: space-between;">
                <div>
                  <span style="font-weight: 700; color: ${color}; font-size: 1.1rem; display: block;">Năm ${yr}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">CAR: ${bankData[yr].car.toFixed(2)}% | Vốn: ${bankData[yr].capital.toLocaleString()} Tỷ</span>
                </div>
                <a href="docs/banks/${bankData[yr].pdf}" target="_blank" class="source-link-btn" style="margin-top: 0.25rem; font-size: 0.75rem; width: 100%; text-align: center; justify-content: center; background: rgba(255,255,255,0.04);">
                  Mở PDF
                </a>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      // Khởi tạo các biểu đồ chuỗi thời gian
      this.initIndSeriesCharts(years, carDataPoints, capDataPoints, rwaDataPoints, color, bankName);
    }

    lucide.createIcons();
  }

  // === RENDER TRANG PHỤ 2: SO SÁNH ĐỐI CHIẾU NHIỀU NGÂN HÀNG ===
  renderCompareAnalysis() {
    if (!this.compRender) return;

    const selectedBanks = this.compBanks;

    // Hủy các chart so sánh cũ
    this.destroyChart("compYearly");
    this.destroyChart("compTrend");

    if (this.compYear !== "series") {
      const year = this.compYear;
      
      this.compRender.innerHTML = `
        <!-- SVG Bar Chart Compare CAR -->
        <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; text-align: center;">Hệ số an toàn vốn CAR các ngân hàng (${year})</h3>
          <div style="flex-grow: 1; position: relative; height: 240px;">
            <canvas id="chart-comp-yearly"></canvas>
          </div>
        </div>

        <!-- Bảng đối chiếu so sánh chỉ số -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
          <h3>Bảng Số liệu Đối chiếu Chi tiết (${year})</h3>
          <div class="table-responsive" style="margin-top: 1rem;">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  <th>CAR (%)</th>
                  <th>Vốn tự có (Tỷ VND)</th>
                  <th>Tổng RWA (Tỷ VND)</th>
                  <th>Vốn điều lệ (Tỷ VND)</th>
                </tr>
              </thead>
              <tbody>
                ${selectedBanks.map(b => {
                  const data = BANK_CAR_DATABASE[b][year];
                  if (!data) {
                    return `
                      <tr>
                        <td class="criterion-col" style="border-left: 4px solid ${BANK_COLORS[b]};">
                          <strong>${BANK_NAMES[b]} (${b})</strong>
                        </td>
                        <td colspan="4" style="text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.82rem;">Số liệu năm ${year} chưa công bố / không có sẵn</td>
                      </tr>
                    `;
                  }
                  const isMet = data.car >= 8.0;
                  return `
                    <tr>
                      <td class="criterion-col" style="border-left: 4px solid ${BANK_COLORS[b]};">
                        <strong>${BANK_NAMES[b]} (${b})</strong>
                      </td>
                      <td style="font-weight: 700; color: ${isMet ? 'var(--success)' : 'var(--danger)'};">${data.car.toFixed(2)}%</td>
                      <td>${data.capital.toLocaleString()}</td>
                      <td>${data.rwa.toLocaleString()}</td>
                      <td>${data.charter.toLocaleString()}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comparative Analysis Insights -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3>Nhận định Chuyên môn So sánh (Năm ${year})</h3>
          <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-main); text-align: justify;">
            Trong năm ${year}, các ngân hàng được lựa chọn so sánh đều thể hiện sự tuân thủ nghiêm ngặt quy định an toàn vốn tối thiểu 8.0% theo Thông tư 41/2016/TT-NHNN. 
            Tuy nhiên, có sự phân hóa rất rõ nét: nhóm ngân hàng thương mại cổ phần tư nhân (đặc biệt là <strong>Techcombank - TCB</strong> và <strong>VPBank - VPB</strong>) 
            thường duy trì mức đệm an toàn CAR cực kỳ dày dặn vượt xa 12%, trong khi các ngân hàng quốc doanh (như <strong>Vietcombank - VCB</strong> và <strong>BIDV - BID</strong>) 
            duy trì tỷ lệ CAR ở mức tiệm cận hơn (10% - 11.8%) do quy mô tín dụng và RWA lớn, dẫn đến áp lực tăng vốn điều lệ từ nguồn lợi nhuận giữ lại luôn là nhiệm vụ cấp bách.
          </p>
        </div>
      `;

      this.initCompYearlyCharts(selectedBanks, year);
    } else {
      // RENDERING TIME SERIES TREND FOR MULTIPLE BANKS
      const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
      
      this.compRender.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- SVG Line Chart Compare Time Series CAR -->
          <div class="card" style="padding: 1.5rem; min-height: 320px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem;">Biểu đồ So sánh Xu hướng CAR (%) ${years[0]} - ${years[years.length-1]}</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Click chọn các hộp màu ở danh sách chú giải (legend) để ẩn/hiện hoặc so sánh song song các ngân hàng:</p>
            <div style="flex-grow: 1; position: relative; height: 260px;">
              <canvas id="chart-comp-trend"></canvas>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Bảng xu hướng CAR lịch sử (${years[0]} - ${years[years.length-1]})</h3>
          <div class="table-responsive" style="margin-top: 1rem;">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  ${years.map(y => `<th>Năm ${y}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${selectedBanks.map(b => {
                  const tds = years.map(y => {
                    const data = BANK_CAR_DATABASE[b][y];
                    if (!data) return `<td><span style="color: var(--text-muted); font-size: 0.8rem;">-</span></td>`;
                    const isLatest = y === 2025;
                    return `<td style="${isLatest ? 'font-weight: 700; color: var(--primary);' : ''}">${data.car.toFixed(2)}%</td>`;
                  }).join("");
                  return `
                    <tr>
                      <td class="criterion-col" style="border-left: 4px solid ${BANK_COLORS[b]};"><strong>${BANK_NAMES[b]} (${b})</strong></td>
                      ${tds}
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.initCompSeriesCharts(selectedBanks, years);
    }

    lucide.createIcons();
  }

  // === CHART INITIALIZATION LOGIC (CHART.JS) ===

  // 1. Phân tích đơn lẻ theo năm: CAR và Vốn/RWA
  initIndYearlyCharts(yearData, color, bankName) {
    if (!window.Chart) {
      // Fallback sang vẽ SVG nếu không load được Chart.js
      document.getElementById("chart-ind-car").parentElement.innerHTML = this.generateSvgSingleBar(yearData.car, color);
      return;
    }

    // Chart CAR
    const carCtx = document.getElementById("chart-ind-car").getContext("2d");
    this.charts.indCar = new Chart(carCtx, {
      type: 'bar',
      data: {
        labels: [bankName, 'Quy định NHNN'],
        datasets: [{
          label: 'Hệ số CAR (%)',
          data: [yearData.car, 8.0],
          backgroundColor: [color, '#ef4444'],
          borderColor: [color, '#ef4444'],
          borderWidth: 1,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 18.0,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      }
    });

    // Chart scale Capital vs RWA
    const scaleCtx = document.getElementById("chart-ind-scale").getContext("2d");
    this.charts.indScale = new Chart(scaleCtx, {
      type: 'doughnut',
      data: {
        labels: ['Vốn tự có', 'Phần RWA còn lại'],
        datasets: [{
          data: [yearData.capital, yearData.rwa - yearData.capital],
          backgroundColor: [color, 'rgba(255, 255, 255, 0.05)'],
          borderColor: [color, 'var(--border-color)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (item) => {
                const val = item.raw;
                return ` ${item.label}: ${val.toLocaleString()} Tỷ VND`;
              }
            }
          }
        }
      }
    });
  }

  // 2. Phân tích đơn lẻ Time Series
  initIndSeriesCharts(years, carData, capData, rwaData, color, bankName) {
    if (!window.Chart) {
      document.getElementById("chart-ind-car-trend").parentElement.innerHTML = this.generateSvgLineChart(years, [carData], [bankName], [color], "%");
      document.getElementById("chart-ind-growth").parentElement.innerHTML = this.generateSvgDoubleBarChart(years, capData, rwaData, color);
      return;
    }

    // CAR Trend
    const trendCtx = document.getElementById("chart-ind-car-trend").getContext("2d");
    this.charts.indCarTrend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: `CAR ${bankName} (%)`,
            data: carData,
            borderColor: color,
            backgroundColor: color + '20',
            fill: true,
            tension: 0.15,
            borderWidth: 3,
            pointRadius: 5
          },
          {
            label: 'Mức tối thiểu (8%)',
            data: Array(years.length).fill(8),
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 6,
            max: 18,
            ticks: { callback: (v) => v + '%' }
          }
        }
      }
    });

    // Capital vs RWA Growth
    const growthCtx = document.getElementById("chart-ind-growth").getContext("2d");
    this.charts.indGrowth = new Chart(growthCtx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Vốn tự có',
            data: capData,
            backgroundColor: color,
            borderRadius: 4
          },
          {
            label: 'Tổng RWA',
            data: rwaData,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => (v/1000).toLocaleString() + 'k Tỷ' }
          }
        }
      }
    });
  }

  // 3. So sánh các ngân hàng theo năm cụ thể
  initCompYearlyCharts(banks, year) {
    const labels = banks.map(b => b);
    const values = banks.map(b => BANK_CAR_DATABASE[b][year] ? BANK_CAR_DATABASE[b][year].car : null);
    const colors = banks.map(b => BANK_COLORS[b]);

    if (!window.Chart) {
      document.getElementById("chart-comp-yearly").parentElement.innerHTML = this.generateSvgMultiBarChart(labels, values, colors);
      return;
    }

    const ctx = document.getElementById("chart-comp-yearly").getContext("2d");
    this.charts.compYearly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => BANK_NAMES[l]),
        datasets: [
          {
            label: 'Tỷ lệ CAR (%)',
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
            barThickness: 28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 18,
            ticks: { callback: (v) => v + '%' }
          }
        }
      }
    });
  }

  // 4. So sánh xu hướng CAR (Time Series) của nhiều ngân hàng
  initCompSeriesCharts(banks, years) {
    if (!window.Chart) {
      const lineData = banks.map(b => years.map(yr => BANK_CAR_DATABASE[b][yr] ? BANK_CAR_DATABASE[b][yr].car : null));
      const lineNames = banks.map(b => BANK_NAMES[b]);
      const lineColors = banks.map(b => BANK_COLORS[b]);
      document.getElementById("chart-comp-trend").parentElement.innerHTML = this.generateSvgLineChart(years, lineData, lineNames, lineColors, "%");
      return;
    }

    const datasets = banks.map(b => {
      return {
        label: BANK_NAMES[b],
        data: years.map(yr => BANK_CAR_DATABASE[b][yr] ? BANK_CAR_DATABASE[b][yr].car : null),
        borderColor: BANK_COLORS[b],
        backgroundColor: BANK_COLORS[b] + '15',
        tension: 0.15,
        borderWidth: 2.5,
        pointRadius: 4,
        fill: false
      };
    });

    // Thêm mốc đỏ tối thiểu
    datasets.push({
      label: 'Mức tối thiểu NHNN (8%)',
      data: Array(years.length).fill(8),
      borderColor: '#ef4444',
      borderWidth: 1.5,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    });

    const ctx = document.getElementById("chart-comp-trend").getContext("2d");
    this.charts.compTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 6,
            max: 18,
            ticks: { callback: (v) => v + '%' }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 15 }
          }
        }
      }
    });
  }

  // === SVG CHARTING HELPERS (FALLBACK NẾU MẤT MẠNG HOẶC KHÔNG LOAD ĐƯỢC CHART.JS) ===

  generateSvgSingleBar(val, color) {
    const scale = 16.0;
    const progressWidth = Math.min(400, Math.round((val / scale) * 400));
    const targetWidth = Math.round((8.0 / scale) * 400);

    return `
      <svg width="100%" height="150" viewBox="0 0 450 150">
        <rect x="20" y="50" width="400" height="24" rx="12" fill="rgba(255,255,255,0.04)" stroke="var(--border-color)" />
        <rect x="20" y="50" width="${progressWidth}" height="24" rx="12" fill="url(#grad-${val})" />
        <line x1="${20 + targetWidth}" y1="35" x2="${20 + targetWidth}" y2="90" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
        <text x="${20 + targetWidth}" y="30" fill="#ef4444" font-size="11" font-weight="600" text-anchor="middle">Mức tối thiểu NHNN (8%)</text>
        <text x="20" y="110" fill="var(--text-muted)" font-size="11">0%</text>
        <text x="220" y="110" fill="var(--text-muted)" font-size="11" text-anchor="middle">8%</text>
        <text x="420" y="110" fill="var(--text-muted)" font-size="11" text-anchor="end">16%</text>
        <text x="${20 + progressWidth}" y="95" fill="${color}" font-weight="800" font-size="14" text-anchor="middle">${val.toFixed(2)}%</text>
        <defs>
          <linearGradient id="grad-${val}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.7" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  generateSvgDoubleBarChart(years, capitals, rwas, color) {
    const maxVal = Math.max(...rwas) * 1.15;
    const height = 200;
    const width = 450;
    const paddingLeft = 55;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barWidth = 25;

    const getY = (val) => chartHeight + paddingTop - (val / maxVal) * chartHeight;

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = Math.round((1 - ratio) * maxVal / 1000) * 1000;
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toLocaleString()}</text>
      `;
    }).join("");

    const bars = years.map((yr, idx) => {
      const x = paddingLeft + idx * (chartWidth / years.length) + 10;
      const capY = getY(capitals[idx]);
      const capH = chartHeight + paddingTop - capY;
      const rwaY = getY(rwas[idx]);
      const rwaH = chartHeight + paddingTop - rwaY;

      return `
        <rect x="${x}" y="${capY}" width="${barWidth}" height="${capH}" fill="${color}" opacity="0.8" rx="2" />
        <text x="${x + barWidth/2}" y="${capY - 4}" fill="var(--text-main)" font-size="9" font-weight="600" text-anchor="middle">${Math.round(capitals[idx]/1000)}k</text>
        <rect x="${x + barWidth + 3}" y="${rwaY}" width="${barWidth}" height="${rwaH}" fill="rgba(255,255,255,0.15)" rx="2" />
        <text x="${x + barWidth + 3 + barWidth/2}" y="${rwaY - 4}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${Math.round(rwas[idx]/1000)}k</text>
        <text x="${x + barWidth + 1.5}" y="${height - 10}" fill="var(--text-muted)" font-size="11" font-weight="600" text-anchor="middle">${yr}</text>
      `;
    }).join("");

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        ${bars}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }

  generateSvgMultiBarChart(labels, values, colors) {
    const height = 240;
    const width = 500;
    const paddingLeft = 50;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = 16.0;
    const getY = (val) => chartHeight + paddingTop - (val / maxVal) * chartHeight;

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = (1 - ratio) * maxVal;
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toFixed(1)}%</text>
      `;
    }).join("");

    const barWidth = Math.min(40, Math.round((chartWidth / labels.length) * 0.5));
    const step = chartWidth / labels.length;

    const bars = labels.map((lbl, idx) => {
      const x = paddingLeft + idx * step + (step - barWidth) / 2;
      const y = getY(values[idx]);
      const barH = chartHeight + paddingTop - y;

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${colors[idx]}" rx="3" />
        <text x="${x + barWidth/2}" y="${y - 6}" fill="var(--text-main)" font-weight="700" font-size="10" text-anchor="middle">${values[idx].toFixed(2)}%</text>
        <text x="${x + barWidth/2}" y="${height - 20}" fill="var(--text-main)" font-weight="600" font-size="11" text-anchor="middle">${lbl}</text>
      `;
    }).join("");

    const targetY = getY(8.0);

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2" />
        ${bars}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }

  generateSvgLineChart(years, datasets, labels, colors, unit = "") {
    const height = 240;
    const width = 500;
    const paddingLeft = 50;
    const paddingRight = 10;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const allVals = datasets.flat();
    const minVal = Math.max(0, Math.floor(Math.min(...allVals) * 0.9));
    const maxVal = Math.ceil(Math.max(...allVals) * 1.1);

    const getY = (val) => chartHeight + paddingTop - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    const getX = (idx) => paddingLeft + idx * (chartWidth / (years.length - 1));

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = maxVal - ratio * (maxVal - minVal);
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toFixed(1)}${unit}</text>
      `;
    }).join("");

    const lines = datasets.map((data, lineIdx) => {
      const pathPoints = data.map((val, idx) => `${getX(idx)},${getY(val)}`).join(" L ");
      const color = colors[lineIdx];
      const pointsHtml = data.map((val, idx) => `
        <circle cx="${getX(idx)}" cy="${getY(val)}" r="4" fill="var(--card-bg)" stroke="${color}" stroke-width="2" />
        <text x="${getX(idx)}" y="${getY(val) - 8}" fill="var(--text-main)" font-size="8" font-weight="600" text-anchor="middle">${val.toFixed(2)}${unit}</text>
      `).join("");

      return `
        <path d="M ${pathPoints}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${pointsHtml}
      `;
    }).join("");

    const xLabels = years.map((yr, idx) => `
      <text x="${getX(idx)}" y="${height - 15}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle">${yr}</text>
    `).join("");

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        ${lines}
        ${xLabels}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }
}

// Khởi chạy
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("bank-analysis-section")) {
    window.baselAnalysis = new BaselAnalysis();
  }
});

// Logic tính toán tỷ lệ an toàn vốn CAR và vẽ biểu đồ phân tích
class BaselCalculator {
  constructor() {
    this.chart = null;
    this.initElements();
    this.bindEvents();
    this.calculate(); // Tính toán lần đầu
  }

  initElements() {
    // Vốn
    this.inputCet1 = document.getElementById("input-cet1");
    this.inputAt1 = document.getElementById("input-at1");
    this.inputTier2 = document.getElementById("input-tier2");

    // Tài sản có rủi ro tín dụng (Credit Risk Assets)
    this.assetCash = document.getElementById("asset-cash");
    this.assetGov = document.getElementById("asset-gov");
    this.assetMortgage = document.getElementById("asset-mortgage");
    this.assetRetail = document.getElementById("asset-retail");
    this.assetCorporate = document.getElementById("asset-corporate");

    // Rủi ro khác
    this.inputMarketRwa = document.getElementById("input-market-rwa");
    this.inputOpRwa = document.getElementById("input-op-rwa");

    // Kết quả đầu ra
    this.outTotalAssets = document.getElementById("out-total-assets");
    this.outCreditRwa = document.getElementById("out-credit-rwa");
    this.outTotalRwa = document.getElementById("out-total-rwa");
    this.outTier1 = document.getElementById("out-tier1");
    this.outTotalCapital = document.getElementById("out-total-capital");

    // Chỉ số tỷ lệ
    this.outCet1Ratio = document.getElementById("out-cet1-ratio");
    this.outTier1Ratio = document.getElementById("out-tier1-ratio");
    this.outCarRatio = document.getElementById("out-car-ratio");
    this.outLeverageRatio = document.getElementById("out-leverage-ratio");

    // Cảnh báo/Trạng thái
    this.statusBasel1 = document.getElementById("status-basel1");
    this.statusBasel2 = document.getElementById("status-basel2");
    this.statusBasel3 = document.getElementById("status-basel3");
    this.complianceAlerts = document.getElementById("compliance-alerts");

    // Các nút kịch bản mô phỏng
    this.btnSafe = document.getElementById("scenario-safe");
    this.btnBuffer = document.getElementById("scenario-buffer-warning");
    this.btnUnsafe = document.getElementById("scenario-unsafe");

    // Toggle views trong calculator results
    this.btnCalcGrid = document.getElementById("btn-calc-grid");
    this.btnCalcFlow = document.getElementById("btn-calc-flow");
    this.calcGridView = document.getElementById("calc-grid-view");
    this.calcFlowView = document.getElementById("calc-flow-view");
  }

  bindEvents() {
    const inputs = [
      this.inputCet1, this.inputAt1, this.inputTier2,
      this.assetCash, this.assetGov, this.assetMortgage, this.assetRetail, this.assetCorporate,
      this.inputMarketRwa, this.inputOpRwa
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener("input", () => this.calculate());
      }
    });

    if (this.btnSafe) {
      this.btnSafe.addEventListener("click", () => this.applyScenario("safe"));
    }
    if (this.btnBuffer) {
      this.btnBuffer.addEventListener("click", () => this.applyScenario("buffer"));
    }
    if (this.btnUnsafe) {
      this.btnUnsafe.addEventListener("click", () => this.applyScenario("unsafe"));
    }

    if (this.btnCalcGrid && this.btnCalcFlow && this.calcGridView && this.calcFlowView) {
      this.btnCalcGrid.addEventListener("click", () => {
        this.btnCalcGrid.style.background = "var(--primary)";
        this.btnCalcGrid.style.color = "white";
        this.btnCalcGrid.style.borderColor = "var(--primary)";
        
        this.btnCalcFlow.style.background = "rgba(255,255,255,0.05)";
        this.btnCalcFlow.style.color = "var(--text-muted)";
        this.btnCalcFlow.style.borderColor = "var(--border-color)";
        
        this.calcGridView.style.display = "block";
        this.calcFlowView.style.display = "none";
      });
      
      this.btnCalcFlow.addEventListener("click", () => {
        this.btnCalcFlow.style.background = "var(--primary)";
        this.btnCalcFlow.style.color = "white";
        this.btnCalcFlow.style.borderColor = "var(--primary)";
        
        this.btnCalcGrid.style.background = "rgba(255,255,255,0.05)";
        this.btnCalcGrid.style.color = "var(--text-muted)";
        this.btnCalcGrid.style.borderColor = "var(--border-color)";
        
        this.calcGridView.style.display = "none";
        this.calcFlowView.style.display = "block";
      });
    }
  }

  applyScenario(type) {
    const data = {
      safe: {
        cet1: 9500, at1: 2000, tier2: 3000,
        cash: 6000, gov: 16000, mortgage: 18000, retail: 25000, corporate: 35000,
        market: 2000, op: 5000
      },
      buffer: {
        cet1: 6500, at1: 1000, tier2: 1500,
        cash: 4000, gov: 10000, mortgage: 25000, retail: 32000, corporate: 55000,
        market: 4000, op: 9000
      },
      unsafe: {
        cet1: 3000, at1: 500, tier2: 1000,
        cash: 2000, gov: 5000, mortgage: 20000, retail: 35000, corporate: 65000,
        market: 6000, op: 12000
      }
    }[type];

    if (data) {
      this.inputCet1.value = data.cet1;
      this.inputAt1.value = data.at1;
      this.inputTier2.value = data.tier2;
      this.assetCash.value = data.cash;
      this.assetGov.value = data.gov;
      this.assetMortgage.value = data.mortgage;
      this.assetRetail.value = data.retail;
      this.assetCorporate.value = data.corporate;
      this.inputMarketRwa.value = data.market;
      this.inputOpRwa.value = data.op;
      
      this.calculate();
    }
  }

  calculate() {
    // 1. Thu thập dữ liệu Vốn (tỷ đồng)
    const cet1 = parseFloat(this.inputCet1.value) || 0;
    const at1 = parseFloat(this.inputAt1.value) || 0;
    const tier2 = parseFloat(this.inputTier2.value) || 0;

    const tier1 = cet1 + at1;
    const totalCapital = tier1 + tier2;

    // 2. Tính toán Tài sản và RWA tín dụng
    const cash = parseFloat(this.assetCash.value) || 0;
    const gov = parseFloat(this.assetGov.value) || 0;
    const mortgage = parseFloat(this.assetMortgage.value) || 0;
    const retail = parseFloat(this.assetRetail.value) || 0;
    const corporate = parseFloat(this.assetCorporate.value) || 0;

    const totalAssets = cash + gov + mortgage + retail + corporate;

    // Trọng số rủi ro chuẩn hóa theo Basel (Credit Risk Weights)
    // Cash: 0%, Gov Bonds: 0% (trong nước), Mortgages: 50%, Retail: 75%, Corporate: 100%
    const rwaCash = cash * 0.0;
    const rwaGov = gov * 0.0;
    const rwaMortgage = mortgage * 0.5;
    const rwaRetail = retail * 0.75;
    const rwaCorporate = corporate * 1.0;

    const creditRwa = rwaCash + rwaGov + rwaMortgage + rwaRetail + rwaCorporate;

    // 3. Thu thập RWA thị trường và vận hành
    const marketRwa = parseFloat(this.inputMarketRwa.value) || 0;
    const opRwa = parseFloat(this.inputOpRwa.value) || 0;

    const totalRwa = creditRwa + marketRwa + opRwa;

    // 4. Tính toán các tỷ lệ
    // Tránh chia cho 0
    const denominatorRwa = totalRwa > 0 ? totalRwa : 1;
    const denominatorAssets = totalAssets > 0 ? totalAssets : 1;

    const cet1Ratio = (cet1 / denominatorRwa) * 100;
    const tier1Ratio = (tier1 / denominatorRwa) * 100;
    const carRatio = (totalCapital / denominatorRwa) * 100;

    // Tỷ lệ đòn bẩy Basel III = Vốn cấp 1 / Tổng tài sản (không trọng số rủi ro)
    const leverageRatio = (tier1 / denominatorAssets) * 100;

    // 5. Hiển thị kết quả định dạng số
    this.outTotalAssets.innerText = totalAssets.toLocaleString() + " tỷ đ";
    this.outCreditRwa.innerText = creditRwa.toLocaleString() + " tỷ đ";
    this.outTotalRwa.innerText = totalRwa.toLocaleString() + " tỷ đ";
    this.outTier1.innerText = tier1.toLocaleString() + " tỷ đ";
    this.outTotalCapital.innerText = totalCapital.toLocaleString() + " tỷ đ";

    this.outCet1Ratio.innerText = cet1Ratio.toFixed(2) + "%";
    this.outTier1Ratio.innerText = tier1Ratio.toFixed(2) + "%";
    this.outCarRatio.innerText = carRatio.toFixed(2) + "%";
    this.outLeverageRatio.innerText = leverageRatio.toFixed(2) + "%";

    // 6. Đánh giá tính tuân thủ các phiên bản Basel
    this.assessCompliance(cet1Ratio, tier1Ratio, carRatio, leverageRatio, totalRwa, creditRwa, marketRwa, opRwa);

    // 7. Cập nhật biểu đồ phân bổ RWA
    this.updateChart(creditRwa, marketRwa, opRwa);

    // 8. Cập nhật phần hiển thị công thức động
    this.updateFormulaDisplay(cet1, at1, tier1, tier2, totalCapital, totalRwa, totalAssets, cet1Ratio, tier1Ratio, carRatio, leverageRatio, creditRwa);
  }

  // Cập nhật real-time tất cả phần tử trong section công thức & mối liên hệ
  updateFormulaDisplay(cet1, at1, tier1, tier2, totalCapital, totalRwa, totalAssets, cet1Ratio, tier1Ratio, carRatio, leverageRatio, creditRwa) {
    const fmt = (n) => n.toLocaleString() + ' tỷ';
    const pct = (n) => n.toFixed(2) + '%';
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // ① Capital Stack
    setEl('f-cet1',          fmt(cet1));
    setEl('f-at1',           fmt(at1));
    setEl('f-tier1',         fmt(tier1));
    setEl('f-tier2',         fmt(tier2));
    setEl('f-total-capital', fmt(totalCapital));

    // ② Công thức phân số — CAR
    setEl('f-car-val', pct(carRatio));
    setEl('f-car-num', fmt(totalCapital));
    setEl('f-car-den', fmt(totalRwa));

    // Tier 1 ratio
    setEl('f-t1-val', pct(tier1Ratio));
    setEl('f-t1-num', fmt(tier1));
    setEl('f-t1-den', fmt(totalRwa));

    // CET1 ratio
    setEl('f-cet1-val', pct(cet1Ratio));
    setEl('f-cet1-num', fmt(cet1));
    setEl('f-cet1-den', fmt(totalRwa));

    // Leverage ratio
    setEl('f-lev-val', pct(leverageRatio));
    setEl('f-lev-num', fmt(tier1));
    setEl('f-lev-den', fmt(totalAssets));

    // ③ Sơ đồ luồng (Flow view) - Cập nhật số liệu thực tế người dùng nhập
    setEl('calcf-cet1',           fmt(cet1));
    setEl('calcf-at1',            fmt(at1));
    setEl('calcf-tier2',          fmt(tier2));
    setEl('calcf-rwa-credit',     fmt(creditRwa));
    setEl('calcf-tier1-cap',      fmt(tier1));
    setEl('calcf-total-cap',      fmt(totalCapital));
    setEl('calcf-total-rwa',      fmt(totalRwa));
    setEl('calcf-cet1-ratio',     pct(cet1Ratio));
    setEl('calcf-tier1-ratio',    pct(tier1Ratio));
    setEl('calcf-leverage-ratio', pct(leverageRatio));
    setEl('calcf-car-ratio',      pct(carRatio));

    // Đổi màu CAR theo ngưỡng đạt/không đạt
    const carEl = document.getElementById('f-car-val');
    if (carEl) carEl.style.color = carRatio >= 8 ? 'var(--success)' : 'var(--danger)';
    const t1El = document.getElementById('f-t1-val');
    if (t1El) t1El.style.color = tier1Ratio >= 6 ? '#818cf8' : 'var(--danger)';

    // Đổi màu các tỷ lệ trên Sơ đồ luồng
    const cfCet1 = document.getElementById('calcf-cet1-ratio');
    if (cfCet1) cfCet1.style.color = cet1Ratio >= 4.5 ? '#6366f1' : 'var(--danger)';
    const cfT1 = document.getElementById('calcf-tier1-ratio');
    if (cfT1) cfT1.style.color = tier1Ratio >= 6 ? '#818cf8' : 'var(--danger)';
    const cfLev = document.getElementById('calcf-leverage-ratio');
    if (cfLev) cfLev.style.color = leverageRatio >= 3 ? '#f59e0b' : 'var(--danger)';
    const cfCar = document.getElementById('calcf-car-ratio');
    if (cfCar) cfCar.style.color = carRatio >= 8 ? '#10b981' : 'var(--danger)';
    const cet1El = document.getElementById('f-cet1-val');
    if (cet1El) cet1El.style.color = cet1Ratio >= 4.5 ? '#6366f1' : 'var(--danger)';
    const levEl = document.getElementById('f-lev-val');
    if (levEl) levEl.style.color = leverageRatio >= 3 ? '#f59e0b' : 'var(--danger)';
  }

  assessCompliance(cet1Ratio, tier1Ratio, carRatio, leverageRatio, totalRwa, creditRwa, marketRwa, opRwa) {
    let alerts = [];

    // Basel I Compliance:
    // - Chỉ tính rủi ro tín dụng. CAR = Total Capital / Credit RWA >= 8%
    const basel1Car = creditRwa > 0 ? (parseFloat(this.outTotalCapital.innerText.replace(/,/g, '')) / creditRwa) * 100 : 0;
    const isBasel1Ok = creditRwa > 0 && basel1Car >= 8.0;
    this.updateStatusIndicator(this.statusBasel1, isBasel1Ok, isBasel1Ok ? `Đạt (${basel1Car.toFixed(1)}%)` : "Không đạt");

    // Basel II Compliance:
    // - CAR = Total Capital / (Credit RWA + Market RWA + Op RWA) >= 8%
    const isBasel2Ok = totalRwa > 0 && carRatio >= 8.0;
    this.updateStatusIndicator(this.statusBasel2, isBasel2Ok, isBasel2Ok ? `Đạt (${carRatio.toFixed(1)}%)` : "Không đạt");

    // Basel III Compliance (Khắt khe hơn nhiều):
    // - CET1 >= 4.5%
    // - Tier 1 >= 6%
    // - Total CAR >= 8%
    // - Đệm bảo toàn vốn (CCB) >= 2.5% (Nghĩa là CET1 thực tế nên >= 7% và CAR nên >= 10.5%)
    // - Leverage Ratio >= 3%
    const hasMinCapital = cet1Ratio >= 4.5 && tier1Ratio >= 6.0 && carRatio >= 8.0;
    const hasBuffer = carRatio >= 10.5 && cet1Ratio >= 7.0;
    const hasLeverage = leverageRatio >= 3.0;

    let isBasel3Ok = false;
    let basel3Text = "Không đạt";

    if (totalRwa > 0) {
      if (hasMinCapital && hasLeverage) {
        if (hasBuffer) {
          isBasel3Ok = true;
          basel3Text = "Đạt (Đầy đủ đệm vốn)";
        } else {
          isBasel3Ok = true; // Vẫn đạt yêu cầu tối thiểu
          basel3Text = "Đạt tối thiểu (Cảnh báo đệm vốn)";
          alerts.push("⚠️ <strong>Khuyến nghị Đệm bảo toàn vốn (CCB)</strong>: Tỷ lệ CAR đạt trên 8.0% nhưng dưới 10.5% (hoặc CET1 dưới 7.0%). Ngân hàng bị hạn chế chia cổ tức và chia thưởng theo Basel III.");
        }
      } else {
        if (!hasMinCapital) {
          if (cet1Ratio < 4.5) alerts.push("❌ <strong>Vốn CET1 thiếu hụt</strong>: Tỷ lệ vốn cổ phần phổ thông cấp 1 (CET1) hiện tại (" + cet1Ratio.toFixed(1) + "%) dưới mức tối thiểu 4.5% của Basel III.");
          if (tier1Ratio < 6.0) alerts.push("❌ <strong>Vốn cấp 1 thiếu hụt</strong>: Tỷ lệ vốn cấp 1 hiện tại (" + tier1Ratio.toFixed(1) + "%) dưới mức tối thiểu 6.0% của Basel III.");
          if (carRatio < 8.0) alerts.push("❌ <strong>Tỷ lệ an toàn vốn (CAR) thấp</strong>: Tỷ lệ CAR hiện tại (" + carRatio.toFixed(1) + "%) dưới mức tối thiểu 8.0%.");
        }
        if (!hasLeverage) {
          alerts.push("❌ <strong>Vi phạm tỷ lệ đòn bẩy</strong>: Tỷ lệ đòn bẩy phi rủi ro đạt " + leverageRatio.toFixed(1) + "%, dưới mức giới hạn tối thiểu 3.0% của Basel III.");
        }
      }
    }

    this.updateStatusIndicator(this.statusBasel3, isBasel3Ok, basel3Text, !hasBuffer && hasMinCapital ? "warning" : "");

    // Hiển thị các cảnh báo cụ thể
    if (alerts.length > 0) {
      this.complianceAlerts.innerHTML = alerts.map(a => `<div class="alert-item">${a}</div>`).join("");
      this.complianceAlerts.classList.remove("hidden");
    } else if (totalRwa > 0) {
      this.complianceAlerts.innerHTML = `<div class="alert-item success">✔️ Ngân hàng đáp ứng toàn bộ các tiêu chí an toàn vốn tối thiểu và đệm dự phòng theo Basel III.</div>`;
      this.complianceAlerts.classList.remove("hidden");
    } else {
      this.complianceAlerts.classList.add("hidden");
    }
  }

  updateStatusIndicator(element, isOk, text, specialClass = "") {
    if (!element) return;
    element.className = "status-badge";
    element.innerText = text;

    if (specialClass === "warning") {
      element.classList.add("status-warning");
    } else if (isOk) {
      element.classList.add("status-success");
    } else {
      element.classList.add("status-danger");
    }
  }

  updateChart(creditRwa, marketRwa, opRwa) {
    const ctx = document.getElementById("rwa-chart");
    if (!ctx) return;

    const data = [creditRwa, marketRwa, opRwa];
    const total = creditRwa + marketRwa + opRwa;

    if (total === 0) {
      // Ẩn biểu đồ nếu không có RWA
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      return;
    }

    if (this.chart) {
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      // Khởi tạo Chart.js mới
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Rủi ro Tín dụng', 'Rủi ro Thị trường', 'Rủi ro Hoạt động'],
          datasets: [{
            data: data,
            backgroundColor: [
              'rgba(79, 70, 229, 0.85)',  // Indigo
              'rgba(245, 158, 11, 0.85)',  // Amber
              'rgba(239, 68, 68, 0.85)'    // Red
            ],
            borderColor: [
              '#4f46e5',
              '#f59e0b',
              '#ef4444'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94a3b8',
                font: {
                  family: 'Outfit, sans-serif'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${context.label}: ${val.toLocaleString()} tỷ đ (${pct}%)`;
                }
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }
}

// Khởi tạo máy tính khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calculator-section")) {
    window.baselCalculator = new BaselCalculator();
  }
});

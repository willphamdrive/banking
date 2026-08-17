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

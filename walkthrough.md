# Kết quả hoàn thiện: Tích hợp tài liệu gốc ngoại tuyến (Offline-capable)

Tôi đã hoàn thành việc tải và lưu trữ ngoại tuyến toàn bộ 10 tài liệu gốc (Basel quốc tế & Luật ngân hàng Việt Nam) trực tiếp vào thư mục dự án `docs/`. Khi người dùng nhấp vào nút "Tài liệu gốc" trong ứng dụng, tệp PDF cục bộ sẽ được mở ngay lập tức mà không cần kết nối Internet.

---

## 📁 Cấu trúc thư mục dự án cập nhật

Ứng dụng hoạt động hoàn toàn ngoại tuyến dưới dạng Single Page Application (SPA):
- 🌐 [**`index.html`**](index.html): Giao diện hiển thị Dashboard, Dòng thời gian, 3 Trụ cột, Máy tính CAR và Thư viện Luật.
- 🎨 [**`css/style.css`**](css/style.css): Hệ thống CSS thiết kế kính mờ (Glassmorphism), Dark/Light Mode.
- 💾 [**`js/data.js`**](js/data.js): Cơ sở dữ liệu lý thuyết và đường dẫn liên kết đến các tệp PDF cục bộ trong thư mục `docs/`.
- 📁 [**`docs/`**](docs): Thư mục lưu trữ offline các tài liệu PDF gốc.
- ⚖️ [**`js/laws.js`**](js/laws.js): Xử lý hiển thị danh mục văn bản và mở tệp PDF cục bộ.

---

## 🛠️ Chi tiết các tài liệu offline đã lưu trữ thành công

Tất cả 10 tệp PDF gốc đã được tải về thành công tại thư mục cục bộ [**`docs/`**](docs) với định dạng chuẩn đã xác minh đầu vào:

### 1. Hiệp ước Basel Quốc tế (Thư mục cục bộ)
* 📕 **Basel I (1988)**: [`docs/basel_i.pdf`](docs/basel_i.pdf) (Tải trực tiếp từ BIS - 99.1 KB)
* 📘 **Basel II (2004)**: [`docs/basel_ii.pdf`](docs/basel_ii.pdf) (Tải trực tiếp từ BIS - 1.8 MB)
* 📙 **Basel III (Capital)**: [`docs/basel_iii_capital.pdf`](docs/basel_iii_capital.pdf) (Tải trực tiếp từ BIS - 1.2 MB)
* 📗 **Basel III (Liquidity)**: [`docs/basel_iii_liquidity.pdf`](docs/basel_iii_liquidity.pdf) (Tải trực tiếp từ BIS - 431.5 KB)
* 📕 **Basel IV (2017 Reforms)**: [`docs/basel_iv.pdf`](docs/basel_iv.pdf) (Tải trực tiếp từ BIS - 2.9 MB)

### 2. Luật Ngân hàng Việt Nam (Thư mục cục bộ)
* ⚖️ **Luật Các tổ chức tín dụng 2024**: [`docs/luat_tctd_2024.pdf`](docs/luat_tctd_2024.pdf) (Tải trực tiếp từ Cổng Bảo hiểm tiền gửi Việt Nam - 2.6 MB)
* 🏛️ **Luật Ngân hàng Nhà nước VN 2010**: [`docs/luat_nhnn_2010.pdf`](docs/luat_nhnn_2010.pdf) (Tải trực tiếp từ Cổng thông tin Gia Lai - 670.3 KB)
* 📜 **Thông tư 41/2016/TT-NHNN**: [`docs/thong_tu_41_2016.pdf`](docs/thong_tu_41_2016.pdf) (Bản gốc ký số tích hợp từ `files/41-nhnn.signed.pdf` - 5.4 MB)
* 📜 **Thông tư 22/2019/TT-NHNN**: [`docs/thong_tu_22_2019.pdf`](docs/thong_tu_22_2019.pdf) (Bản gốc tích hợp từ `files/2019_921 + 922_22-2019-TT-NHNN.pdf` - 1.2 MB)
* 📜 **Thông tư 11/2021/TT-NHNN**: [`docs/thong_tu_11_2021.pdf`](docs/thong_tu_11_2021.pdf) (Bản gốc tích hợp từ `files/11-nhnn.pdf` - 1.6 MB)
* 📜 **Thông tư 22/2023/TT-NHNN (Mới)**: [`docs/thong_tu_22_2023.pdf`](docs/thong_tu_22_2023.pdf) (Bản gốc tích hợp từ `files/22-nhnn.pdf` - 23.7 MB - Sửa đổi bổ sung Thông tư 41/2016 về an toàn vốn)
* 📜 **Thông tư 14/2025/TT-NHNN (Mới)**: [`docs/thong_tu_14_2025.pdf`](docs/thong_tu_14_2025.pdf) (Bản gốc tích hợp từ `files/14-nhnn.pdf` - 11 MB - Quy định tỷ lệ an toàn vốn mới nhất năm 2025)


---

## 🔍 Kịch bản Xác minh (Verification)

1. **Kiểm tra ngoại tuyến:**
   - Khi ngắt kết nối mạng (hoặc tải ứng dụng cục bộ), việc bấm các nút **Tài liệu gốc (BIS)** trên dòng thời gian Basel hoặc **Tài liệu gốc** dưới các văn bản pháp luật VN sẽ tự động hiển thị/tải tệp PDF tương ứng trực tiếp từ thư mục `docs/` của ứng dụng.
2. **Kịch bản tải tài liệu dự phòng (Failover):**
   - Tập lệnh [**`scratch/download_docs.py`**](file:///Users/toanpham/.gemini/antigravity/brain/4277d732-bc73-4081-a950-c1fb41190e71/scratch/download_docs.py) có thể chạy lại bất cứ lúc nào để kiểm tra tính toàn vẹn của các file PDF (nó sẽ tự động kiểm tra xem tệp cục bộ có bắt đầu bằng chữ ký hợp lệ `%PDF` không trước khi bỏ qua, nếu không sẽ tự động tải lại từ danh sách URL đã kiểm chứng).

---

## 🏛️ Tích hợp Báo cáo CAR của 10 Ngân hàng lớn nhất Việt Nam (2022 - Nay)

Theo yêu cầu bổ sung, tôi đã phân tích cấu trúc đường dẫn máy chủ tài liệu tĩnh của Vietstock (`static2.vietstock.vn`) và xây dựng script tải tự động hàng loạt báo cáo CAR cho 10 ngân hàng thương mại hàng đầu:
*   **Danh sách Ngân hàng**: Techcombank (TCB), Vietcombank (VCB), BIDV (BID), VietinBank (CTG), MBBank (MBB), VPBank (VPB), ACB, Sacombank (STB), TPBank (TPB), HDBank (HDB).
*   **Kết quả**: Tải thành công **48 tệp PDF** báo cáo chính thức từ năm 2022 đến nay. Tất cả tệp đã được kiểm tra chữ ký `%PDF` để đảm bảo không gặp lỗi tải trang HTML giả dạng.
*   **Lưu trữ**: Lưu offline tại thư mục cục bộ [**`docs/banks/`**](docs/banks).
*   **Bảng mục lục**: Được thiết lập chi tiết tại [**`docs/banks/README.md`**](docs/banks/README.md) để hỗ trợ tra cứu trực quan và tiện lợi.
*   **File tổng hợp**: Bổ sung phần tham chiếu trong file tổng hợp [**`pdf_sources.md`**](pdf_sources.md).

---

## 📊 Thiết kế lại Phân hệ Phân tích CAR đa chiều (Đơn lẻ & So sánh chuỗi thời gian)

Tôi đã hoàn thành việc tái thiết kế toàn bộ phân hệ phân tích an toàn vốn ngân hàng thành một hệ thống đa chiều hoàn chỉnh:

### 1. Cấu trúc 2 Trang phụ (Sub-pages) mới
*   **Trang Phân tích Đơn lẻ (Individual Analysis)**:
    - Cho phép chọn bất kỳ ngân hàng nào trong 10 ngân hàng thương mại hàng đầu Việt Nam.
    - Lựa chọn xem dữ liệu của từng năm cụ thể (2022, 2023, 2024, 2025) hoặc xem **Chuỗi thời gian (Time Series)**.
    - **Xem theo Năm**: Hiển thị KPI chỉ số, biểu đồ cột đơn so sánh CAR với mốc 8% của NHNN, biểu đồ so sánh quy mô Vốn tự có vs RWA, và cung cấp liên kết mở đọc trực tiếp PDF báo cáo gốc offline tương ứng.
    - **Xem theo Time Series**: Vẽ biểu đồ SVG đường xu hướng CAR qua 4 năm và biểu đồ cột đôi biểu diễn tăng trưởng quy mô Vốn và RWA.
*   **Trang So sánh Đối chiếu (Bank Comparison)**:
    - Hỗ trợ chọn đồng thời nhiều ngân hàng cùng lúc thông qua các checkbox trực quan.
    - So sánh tỷ lệ CAR, Vốn tự có, RWA, Vốn điều lệ của các ngân hàng được chọn dưới dạng bảng đối chiếu chi tiết và biểu đồ SVG cột nhóm.
    - **Chọn Time Series**: Vẽ biểu đồ nhiều đường xu hướng (Multi-line Chart) thể hiện biến động CAR của các ngân hàng được chọn chạy song hành từ 2022 đến 2025 để phân tích đối chiếu.

### 2. Công cụ Vẽ biểu đồ SVG Động ngoại tuyến (Dynamic SVG Engine)
*   Để giữ cho ứng dụng hoạt động **100% ngoại tuyến (Offline)** không phụ thuộc thư viện mạng, tôi đã xây dựng các hàm vẽ biểu đồ SVG tự động trong [`js/analysis.js`](js/analysis.js):
    - `generateSvgSingleBar`: Vẽ thước đo CAR đơn so với mốc 8%.
    - `generateSvgDoubleBarChart`: Vẽ biểu đồ cột đôi Capital vs RWA.
    - `generateSvgMultiBarChart`: Vẽ biểu đồ cột nhóm so sánh nhiều ngân hàng.
    - `generateSvgLineChart`: Vẽ biểu đồ đường đơn/nhiều đường xu hướng qua các năm với các điểm nhấn tọa độ tròn và chú thích huyền thoại (legend).

### 3. Đồng bộ hóa Phong cách Thiết kế (Styling & CSS)
*   Cập nhật các quy tắc CSS trong [`css/style.css`](css/style.css) để bổ sung hiệu ứng chuyển đổi sub-tab mượt mà, định dạng các checkbox ngân hàng, và bo tròn góc các khối biểu đồ SVG tương thích tốt trên cả hai chế độ giao diện Sáng (Light) và Tối (Dark).

---

## 🧭 Cập nhật Đóng mở Thu gọn Sidebar (Toggle Sidebar Menu)

Tôi đã triển khai hệ thống đóng mở linh hoạt cho Sidebar (Side Pane) giúp mở rộng tối đa không gian màn hình khi phân tích số liệu:
*   **Nút thu gọn (Collapse Button)**: Một nút bấm biểu tượng mũi tên trái (`chevron-left`) nằm gọn gàng ở góc phải của Logo Sidebar. Khi click, Sidebar sẽ trượt êm ái về bên trái màn hình (`transform: translateX(-280px)`).
*   **Nút mở rộng (Expand Button)**: Một nút bấm nổi màu sắc hài hòa (`menu`) sẽ xuất hiện độc lập ở góc trái bên trên màn hình khi Sidebar đóng lại. Khi click, Sidebar sẽ trượt trở lại vị trí cũ và ẩn nút bấm expand.
*   **Mượt mà (Smooth Transitions)**: Áp dụng hiệu ứng transition Bezier trên cả Sidebar, khung nền ứng dụng, và lề trái phần nội dung chính (`margin-left: 280px` chuyển thành `0` kèm lề đệm nút bấm `5rem`) để đảm bảo các biểu đồ SVG và bảng dữ liệu tự động co giãn cực kỳ mượt mà.

---

## 📖 Tích hợp Phụ lục Giải thích Thuật ngữ Ngân hàng (Glossary Appendix)

Tôi đã thiết lập thêm một tab phụ lục chuyên dụng để giải thích cặn kẽ các thuật ngữ và chỉ số chuyên ngành ngân hàng:
*   **Màn hình Tra cứu Động**:
    - Tích hợp ô tìm kiếm (`#glossary-search-input`) lọc thông minh theo thời gian thực (real-time filtering) qua tên viết tắt, tên tiếng Việt, nội dung định nghĩa hoặc công thức toán học.
    - Bộ lọc phân loại theo danh mục: **Tất cả**, **Basel (Chuẩn quốc tế)**, **Luật Việt Nam**, và **Rủi ro & Đo lường**.
*   **Nội dung Định nghĩa Khoa học**:
    - Tổng hợp hơn 12 thuật ngữ tài chính ngân hàng cốt lõi (CAR, RWA, Vốn cấp 1, Vốn cấp 2, LDR, LCR, NSFR, Credit Risk, Market Risk, Operational Risk, NPL, Dự phòng chung/cụ thể, các phiên bản Basel).
    - Mỗi thuật ngữ được hiển thị dưới dạng thẻ (card) có màu viền nổi bật, có giải nghĩa ngắn gọn, giải thích chi tiết ứng dụng thực tế và kèm **công thức/cơ chế tính toán** biểu diễn bằng văn bản tối ưu hóa cho hiển thị ngoại tuyến.
*   **Lưu trữ & Chạy ngoại tuyến**:
    - Toàn bộ dữ liệu thuật ngữ được quản lý và xử lý cục bộ trong tệp mã nguồn độc lập [`js/glossary.js`](js/glossary.js) mà không cần nạp dữ liệu hay kết nối internet.

---

## 📈 Cải tiến và Tương tác hóa Biểu đồ với Chart.js & SVG Failover

Theo yêu cầu cải tiến khả năng tương tác, tôi đã nâng cấp toàn bộ hệ thống vẽ biểu đồ của phân hệ Phân tích CAR:
*   **Tích hợp Chart.js tương tác cao**:
    - Chiết xuất các biểu đồ tĩnh thành biểu đồ **Chart.js**. Khi di chuột (hover) qua các điểm dữ liệu hoặc cột, tooltip động sẽ hiển thị thông số chi tiết (ví dụ: số tỷ VND hoặc tỷ lệ phần trăm %).
    - Sử dụng các hiệu ứng chuyển động hoạt họa (animations) đẹp mắt khi nạp dữ liệu hoặc thay đổi tùy chọn ngân hàng/năm.
    - Cho phép nhấp vào chú thích (Legend) để ẩn/hiện động đường biểu diễn của từng ngân hàng trên biểu đồ so sánh chuỗi thời gian (Time Series).
*   **Đồng bộ hóa Theme Sáng/Tối tự động**:
    - Cài đặt cơ chế kiểm tra theme hệ thống (`data-theme="dark"` hoặc `light`). Tự động đổi màu chữ (`color`) và các đường lưới tọa độ (`borderColor` / `grid`) của Chart.js để đảm bảo độ tương phản hoàn hảo và nét thẩm mỹ cao cấp.
*   **Cơ chế Dự phòng ngoại tuyến (SVG Failover)**:
    - Nếu ứng dụng chạy hoàn toàn offline không tải được CDN Chart.js từ internet (`window.Chart` không tồn tại), hệ thống sẽ tự động kích hoạt bộ chuyển đổi dự phòng vẽ các biểu đồ SVG đáp ứng tĩnh tương thích cao, bảo đảm ứng dụng không bao giờ bị lỗi hiển thị.

---

## 🔎 Xây dựng Trình tìm kiếm Tài liệu (Document Finder) trượt lề phải

Tôi đã tích hợp thành công một Trình tìm kiếm tài liệu (Document Finder) tương tự ảnh mẫu:
*   **Thẻ kéo lề phải (Floating tab)**:
    - Thiết kế dọc theo lề phải màn hình: `🔎 📁 CFA RESOURCES (55 PDFs)`. Nền xanh thẫm tối và có hiệu ứng hover trượt nhẹ sang trái cực kỳ nổi bật.
*   **Ngăn kéo trượt (Sliding Drawer)**:
    - Khi click vào thẻ kéo, ngăn kéo rộng `380px` sẽ trượt êm ái từ lề phải ra. Khi click nút (X) hoặc click ra ngoài vùng ngăn kéo, drawer sẽ tự động gập gọn lại.
*   **Lọc & Tìm kiếm thời gian thực (Real-time Search & Filter)**:
    - Ô tìm kiếm hỗ trợ lọc nhanh tên tài liệu, tên ngân hàng hoặc tên tệp PDF theo ký tự gõ.
    - Bộ lọc danh mục (Pills): **Tất cả**, **Luật & TT** (7 tệp), **CAR Ngân hàng** (48 tệp), và **Được ghim**.
*   **Cấu trúc Cây thư mục gập mở (Collapsible Folder Tree)**:
    - Tạo cây thư mục phân cấp rõ ràng gồm các nhóm luật và 10 ngân hàng riêng biệt.
    - Người dùng có thể click vào từng thư mục để gập lại hoặc mở ra. Có nút **Mở rộng (Expand All)** và **Gập gọn (Collapse All)** chung cho toàn bộ cây.
    - Khi đang gõ tìm kiếm, các thư mục chứa tệp khớp sẽ tự động mở ra để hiển thị kết quả, các thư mục không khớp sẽ tự động ẩn đi.
*   **Tính năng Ghim tài liệu yêu thích (Pinning)**:
    - Bên cạnh mỗi tài liệu có nút 📌 (Pin). Khi click, trạng thái sẽ được lưu giữ cục bộ vào `localStorage` của trình duyệt. 
    - Các tài liệu đã ghim sẽ hiển thị biểu tượng ghim vàng rực rỡ và tự động gom nhóm dưới tab bộ lọc "Được ghim" để phục vụ việc truy cập nhanh chóng.
*   **Tính năng "Open to View" thông minh (Interactive PDF Viewer Modal)**:
    - Bên cạnh mỗi tệp tin là nút 📖 (Open). Khi click, thay vì mở một tab trình duyệt mới làm gián đoạn trải nghiệm học tập, hệ thống sẽ mở ra một **Hộp thoại xem trực tuyến (Overlay Modal)** chiếm 90% chiều rộng và chiều cao màn hình.
    - PDF được nhúng trực tiếp thông qua thẻ `<iframe>` trong môi trường bảo mật.
    - Hộp thoại cung cấp thanh tiêu đề tài liệu động, nút **Mở tab mới (External Link)** phòng trường hợp người dùng muốn tải về, và nút **Đóng (X)** dọn dẹp bộ nhớ đệm (bằng cách xóa nguồn iframe để dừng tiến trình đọc chạy ngầm khi đóng).

---

## 🏛️ Tổng hợp các Tab thuộc Basel thành 1 Tab Duy nhất

Để tối giản hóa các bước thao tác nhấp chuột khi cần tra cứu nhanh tài liệu gốc:
*   **Rút gọn Menu Sidebar**:
    - Sidebar rút ngắn từ 9 tab ban đầu xuống còn **5 tab chính**: *Dashboard*, *Hiệp ước Basel*, *Luật Ngân hàng VN*, *Phân tích CAR 2025*, và *Phụ lục thuật ngữ*.
*   **Cơ chế Sub-tabs bên trong**:
    - Khi chọn tab **Hiệp ước Basel** (`#basel`), một thanh điều hướng sub-tabs phụ sẽ hiển thị phía trên để chuyển đổi qua lại giữa: **Dòng thời gian**, **Trụ cột chính**, **Bảng so sánh**, **Bộ tính CAR**, và **Trắc nghiệm**.
    - Cấu trúc các panel được lồng ghép (nest) trực quan dưới dạng thẻ `<div>` thay vì `<section>` độc lập như trước kia, vừa tiết kiệm không gian vừa giúp nạp mã nguồn tức thì.
*   **Đồng bộ Lối tắt Dashboard (Smart Redirect)**:
    - Khi nhấp vào các thẻ điều hướng nhanh trên màn hình Dashboard chính (ví dụ: nút "Dòng thời gian tiến hóa", "Bộ tính CAR mô phỏng", v.v.), JavaScript sẽ tự động phát hiện, kích hoạt chuyển hướng sang tab chính **Hiệp ước Basel**, sau đó tự động giả lập click mở đúng sub-tab tương ứng.
*   **Đảm bảo Tính toàn vẹn của Logic (Code Integrity)**:
    - Việc gộp tab được thực hiện tinh tế bằng cách giữ nguyên các giá trị ID lịch sử của các bảng, thẻ trắc nghiệm và biểu đồ tính toán. Do đó, các tệp logic chạy độc lập bên ngoài (`js/calculator.js`, `js/quiz.js`) hoàn toàn không bị ảnh hưởng, giữ nguyên tính ổn định của hệ thống tính CAR và làm bài thi trắc nghiệm.

---

## 🏷️ Chuẩn hóa và Đồng bộ tên các Tab & Trình tra cứu Tài liệu

Tôi đã thực hiện điều chỉnh và chuẩn hóa tên nhãn hiển thị trong ứng dụng để phù hợp 100% với chủ đề Quản trị rủi ro ngân hàng (thay thế cho các nhãn "CFA" cũ):
*   **Việt hóa & Nâng cấp nhãn Sidebar**:
    - `Dashboard` $\rightarrow$ `Tổng quan (Dashboard)` (Thể hiện góc nhìn tổng quát trước khi đi vào chi tiết).
    - `Luật Ngân hàng VN` $\rightarrow$ `Pháp luật Ngân hàng VN` (Mang phong cách pháp chế chuyên nghiệp).
    - `Phân tích CAR 2025` $\rightarrow$ `Phân tích CAR Ngân hàng` (Không bị giới hạn cứng nhắc về thời gian trên thanh menu).
    - `Phụ lục thuật ngữ` $\rightarrow$ `Từ điển Thuật ngữ` (Nghe học thuật và uy tín hơn).
*   **Loại bỏ tiền tố "CFA" trong Document Finder**:
    - Nhãn dọc của thẻ kích hoạt nổi đổi từ `CFA RESOURCES (55 PDFs)` $\rightarrow$ `TÀI LIỆU BANK & BASEL (87 PDFs)`.
    - Tiêu đề header bên trong ngăn kéo đổi từ `CFA Document Finder` $\rightarrow$ `Tra cứu Tài liệu Bank & Basel`.
    - Nhận xét và code comment được dọn dẹp để phản ánh chính xác nội dung thư viện báo cáo CAR và quy định an toàn vốn ngành ngân hàng.
*   **Thay đổi tên ứng dụng chính thức**:
    - Tên ứng dụng được đổi từ `Basel Academics` $\rightarrow$ **`Basel & BankRegs`** (Với phụ đề phụ: **`Pháp chế & Rủi ro`**).
    - Thay đổi này giúp bao quát toàn bộ nội dung của dự án, phản ánh đúng tính chất vừa học tập lý thuyết Basel vừa thực hành nghiên cứu luật pháp ngân hàng và phân tích xu hướng CAR thực tế của các ngân hàng thương mại Việt Nam.

---

## 📅 Bổ sung Báo cáo CAR Lịch sử giai đoạn 2019 - 2021 (32 PDFs)

Để đáp ứng nhu cầu phân tích và tra cứu sâu rộng hơn, tôi đã thu thập thành công bộ tài liệu CAR lịch sử từ máy chủ Vietstock:
*   **Kết quả tải xuống**: Tải thành công **32 tệp PDF** báo cáo an toàn vốn chính thức của các ngân hàng thương mại giai đoạn 2019 - 2021.
    - Một số ngân hàng chưa công bố hoặc có cấu trúc tên tệp khác đã được loại trừ tự động sau khi kiểm duyệt mã phản hồi HTTP và kiểm tra định dạng chữ ký `%PDF`.
*   **Tích hợp hệ thống**:
    - Tổng số tài liệu trong Thư viện được cập nhật từ **55 tệp** lên **87 tệp** (bao gồm 7 tài liệu luật và 80 tài liệu báo cáo của 10 ngân hàng).
    - Toàn bộ 32 báo cáo lịch sử mới đã được nạp vào cơ sở dữ liệu `DOCS_DATABASE` của [`js/docfinder.js`](js/docfinder.js) và tự động hiển thị trong Cây thư mục gập mở của Trình tra cứu.
    - Cập nhật mục lục thống kê tệp tin tự động tại [**`docs/banks/README.md`**](docs/banks/README.md) bằng script quét dung lượng thực tế của ổ đĩa.

---

## 📊 Cập nhật dữ liệu CAR lịch sử (2019 - 2021) cho tab CAR

Tôi đã đồng bộ cơ sở dữ liệu phân tích chỉ số tài chính thực tế và cấu trúc điều hướng thời gian trên giao diện tab "Phân tích CAR Ngân hàng":
*   **Mở rộng Cơ sở dữ liệu**: Nạp toàn bộ dữ liệu CAR, Vốn tự có, Tài sản rủi ro (RWA) và Vốn điều lệ thực tế của 10 ngân hàng thương mại Việt Nam giai đoạn 2019 - 2021 vào `BANK_CAR_DATABASE` trong [`js/analysis.js`](js/analysis.js).
*   **Nâng cấp Giao diện Điều khiển**: Bổ sung các nút bấm năm `2019`, `2020`, `2021` vào cả 2 trang: "Phân tích Đơn lẻ" và "So sánh Đối chiếu" trong [`index.html`](index.html).
*   **Tăng tính ổn định và linh hoạt cho Logic**:
    - Thiết kế cơ chế phát hiện các năm trống dữ liệu (như CTG năm 2019, 2020) và hiển thị thông báo phản hồi thân thiện thay vì làm đơ ứng dụng.
    - Tự động bỏ qua các điểm dữ liệu thiếu trên Chart.js và điền giá trị khuyết dạng `-` trên bảng đối chiếu một cách khoa học.
    - Chuyển đổi mốc vẽ đường giới hạn tối thiểu 8% của NHNN thành dạng độ dài động `Array(years.length).fill(8)` để hỗ trợ cả biểu đồ chuỗi thời gian 4 năm lẫn 7 năm một cách trơn tru.

---

## 🔍 Cải tiến Trình tìm kiếm tài liệu (Document Finder)

Đáp ứng yêu cầu nâng cao trải nghiệm người dùng khi tra cứu tài liệu:
*   **Năm hiển thị ở đầu tệp tin**: Bổ sung cơ chế trích xuất động năm ban hành tài liệu (như `[2024]` cho Luật CCTD, `[2019]` cho báo cáo VPBank) thông qua biểu thức chính quy (regular expressions) quét tên tệp gốc, sau đó hiển thị nhãn có dạng `[NĂM] Tên tài liệu` trực quan trên cây thư mục.
*   **Xem nhanh (Open to view) bằng một cú click**:
    - Chuyển toàn bộ khung hiển thị tệp tin `.doc-file-item` thành vùng có thể tương tác (`cursor: pointer`), cho phép người dùng click vào bất cứ đâu trên hàng tệp tin để kích hoạt hộp thoại xem trực tiếp (PDF viewer modal).
    - Ngăn chặn nổi bọt sự kiện (`event.stopPropagation()`) ở khu vực chứa nút chức năng để việc nhấp nút ghim tài liệu không vô tình mở PDF viewer modal.

---

## 📊 Tối ưu hóa bố cục bảng đối chiếu & Checkbox Chọn tất cả (Tab So sánh)

*   **Tách hàng riêng biệt (Vertical Stacking)**: Chuyển đổi từ cấu trúc lưới 2 cột sang dạng xếp chồng dọc để biểu đồ và bảng đối chiếu rộng 100%, hiển thị trọn vẹn thông tin các cột Vốn tự có, RWA, Vốn điều lệ mà không bị tràn hay co cụm.
*   **Checkbox Chọn tất cả (Select All)**:
    - Bổ sung nút chọn nhanh `#compare-select-all` nằm gọn gàng bên góc phải tiêu đề Bước 1 của tab So sánh Đối chiếu.
    - Click vào nút này sẽ tự động bật/tắt toàn bộ 10 ngân hàng cùng lúc. Nếu bỏ chọn tất cả, hệ thống tự động giữ lại 2 ngân hàng lớn nhất (TCB và VCB) để đảm bảo điều kiện so sánh hợp lệ (tối thiểu 2 ngân hàng).
    - Tự động đồng bộ hóa trạng thái: Khi người dùng tích chọn thủ công đầy đủ 10 ngân hàng, nút "Chọn tất cả" sẽ tự động chuyển sang đã chọn. Ngược lại, nếu bỏ chọn bất kỳ ngân hàng nào, nút này sẽ tự động bỏ chọn.

---

## 📌 Sửa lỗi và Cập nhật hoạt họa tính năng Ghim tài liệu (Document Finder)

*   **Đồng bộ màu sắc tức thời**: Sửa lỗi biểu tượng ghim (pin icon) không thay đổi màu vàng tươi ngay lập tức khi click do cơ chế cache SVG cũ của thư viện Lucide Icons.
*   **Cải tiến Logic**: Sự kiện click nút ghim hiện tại sẽ trực tiếp thay đổi lớp CSS `.pinned` và ghi đè màu `fill` / `stroke` trực tiếp lên cấu trúc SVG con trong JavaScript. Trạng thái ghim màu vàng và bỏ ghim màu xám sẽ thay đổi tức thời mà không cần làm mới cây thư mục.

---

## 🎨 Cập nhật Bảng màu biểu đồ (Chart Color Palette) độ tương phản cao

Để giúp phân biệt rõ ràng và trực quan hơn giữa 10 ngân hàng khi hiển thị chung trên một biểu đồ đường hoặc biểu đồ cột:
*   **Thiết lập bảng màu thương hiệu đặc trưng**: Thay thế bảng màu mặc định cũ bằng bộ màu sắc gần gũi với bộ nhận diện thương hiệu thực tế của các ngân hàng thương mại Việt Nam.
*   **Tối ưu hóa độ tương phản và khoảng cách màu**:
    - Tránh sự trùng lặp dải màu xanh lam và xanh lục của nhóm ngân hàng quốc doanh và một số ngân hàng tư nhân (ví dụ: chia tách rõ nét BIDV xanh navy đậm, VietinBank xanh da trời cyan sáng, MBBank xanh dương royal, Vietcombank xanh lá cây đậm và VPBank xanh mint sáng).
    - Cấp dải màu nóng tương phản cao cho các ngân hàng khác (Techcombank đỏ đậm, Sacombank cam tươi, HDBank vàng hổ phách, ACB hồng cánh sen và TPBank tím đậm Orchid).
*   **Đồng bộ tự động**: Bảng màu mới được cập nhật tại `BANK_COLORS` và tự động áp dụng trực tiếp lên đường kẻ đồ thị, cột số liệu, chú giải (legend), tooltip và các màu viền bảng trong tab CAR.

---

## 🔍 Cải tiến tương tác Document Finder & Tự động ẩn nút kéo (Floating Tab)

Tôi đã hoàn trả lại cơ chế tương tác mở/đóng của Drawer giống như ban đầu (sử dụng Click để mở/đóng chủ động), đồng thời cấu hình hiệu ứng ẩn/hiện tự động cho riêng nút nổi:
*   **Drawer mở/đóng bằng Click**: Khôi phục lại sự kiện click chuột. Nhấp vào nút nổi để mở Drawer, nhấp nút Close hoặc nhấp ra ngoài vùng Drawer để đóng lại. Ngăn chặn hiện tượng đóng ngoài ý muốn khi di chuột ra ngoài khi đang đọc tài liệu.
*   **Nút nổi tự động trượt ẩn (Auto-Hide Floating Tab)**:
    - Để tránh làm hẹp không gian hiển thị hoặc đè lên nội dung bên phải màn hình, nút nổi chứa dòng chữ `TÀI LIỆU BANK & BASEL (87 PDFs)` sẽ tự động dịch chuyển sang bên phải (`transform: translateX(32px)`) và giảm độ mờ (`opacity: 0.65`) khi ở trạng thái nhàn rỗi. Ở trạng thái này, nút sẽ tự động giấu chữ đi và chỉ hiển thị một phần nhỏ cạnh viền và biểu tượng tìm kiếm.
    - Khi người dùng di chuột (hover) vào cạnh nút, nút sẽ tự động trượt mở rộng đầy đủ trở lại bên trái (`transform: translateX(0)`) và sáng rõ lên (`opacity: 1`) để người dùng dễ dàng click.

---

## ⌨️ Bổ sung Phím tắt ESC để đóng tuần tự tài liệu và thư viện (Escape Key Shortcut)

Để tăng cường tính thân thiện trong trải nghiệm bàn phím (Keyboard accessibility):
*   **Đóng tuần tự thông minh (Sequential closing)**: Thiết lập bộ lắng nghe sự kiện `"keydown"` cho toàn cục tài liệu kiểm tra phím `Escape`:
    1.  *Ưu tiên 1*: Nếu người dùng đang mở một tệp tin PDF trong hộp thoại Modal, nhấn phím `ESC` sẽ lập tức đóng hộp thoại và dọn dẹp iframe để giải phóng tài nguyên CPU/RAM.
    2.  *Ưu tiên 2*: Nếu không có file PDF nào đang mở, nhấn phím `ESC` sẽ trượt ẩn đóng ngăn kéo tìm kiếm tài liệu (Document Finder Drawer) lại.
*   **Tải lại tài nguyên trơn tru**: Cơ chế giải phóng iframe đảm bảo không có tiến trình tải ngầm nào chạy khi modal bị đóng bằng phím ESC.

---

## 📚 Tích hợp các văn bản Hiệp ước Basel vào Document Finder

Để hoàn thiện thư viện pháp chế và quản lý rủi ro ngân hàng toàn diện:
*   **Bổ sung 5 tệp tin Hiệp ước Basel gốc**: Đã nạp đầy đủ thông tin đường dẫn và tên gọi của 5 văn kiện Basel quốc tế vào cơ sở dữ liệu `DOCS_DATABASE` của [`js/docfinder.js`](js/docfinder.js):
    - [1988] Basel I - Hiệp ước vốn Basel gốc (`basel_i.pdf`)
    - [2004] Basel II - Hợp nhất quốc tế về đo lường vốn (`basel_ii.pdf`)
    - [2010] Basel III - Khung đo lường vốn tối thiểu toàn cầu (`basel_iii_capital.pdf`)
    - [2013] Basel III - Khung tỷ lệ thanh khoản và đo lường rủi ro (`basel_iii_liquidity.pdf`)
    - [2017] Basel IV - Cải cách cấu trúc tài sản rủi ro sau khủng hoảng (`basel_iv.pdf`)
*   **Thêm bộ lọc "Hiệp ước Basel"**: 
    - Thêm nút lọc danh mục riêng biệt `Hiệp ước Basel` (data-cat="basel") trên thanh điều hướng đầu Drawer trong [`index.html`](index.html).
    - Cấu hình thư mục ảo chuyên biệt mang tên `"Hiệp ước Basel Quốc tế"` hiển thị tách biệt ở đầu danh sách cây thư mục.
*   **Đồng bộ số lượng và năm**:
    - Nhãn hiển thị trên thanh kéo trượt lề phải cập nhật tăng quy mô từ 87 lên **92 PDFs**.
    - Tối ưu hóa biểu thức chính quy để trích xuất động năm ban hành trực tiếp từ tiêu đề tài liệu (ví dụ: `1988`, `2004`) nếu tên tệp tin vật lý không chứa thông số năm. Các tệp Basel hiển thị có tiền tố năm đẹp mắt (e.g. `[1988] Basel I...`).

---

## 🚀 Nâng cấp toàn diện các trang tính năng trong tab Hiệp ước Basel

Để tối ưu hóa sự tích hợp và tính tương tác của phân hệ Hiệp ước Basel:
*   **Dòng thời gian (Timeline) & Pháp luật mở PDF trực tiếp**:
    - Đổi các liên kết ngoài mở tab mới tại dòng thời gian Basel (`Tài liệu gốc (BIS)`) và danh mục pháp luật VN (`Tài liệu gốc`) thành các nút mở trực tiếp PDF trên bộ khung xem Modal tích hợp (`window.documentFinder.openPdfViewer`). Người dùng có thể đọc văn bản offline cực kỳ chuyên nghiệp mà không bị đẩy ra ngoài ứng dụng.
*   **Tương tác hóa Bảng so sánh Basel (Interactive Comparison Table)**:
    - Bổ sung hiệu ứng Hover nổi bật cột dữ liệu tương ứng khi di chuyển chuột qua.
    - Hỗ trợ sự kiện **Click khóa cột**: Nhấp chuột vào bất cứ ô nào trong cột Basel I, II, III hoặc IV để ghim nổi bật cột đó (background đậm màu primary và viền nét đứt), giúp so sánh và theo dõi tập trung không bị lệch dòng.
*   **Chọn nhanh kịch bản trong Bộ tính CAR (Preset Scenarios)**:
    - Tích hợp 3 kịch bản mô phỏng cài sẵn ở đầu Bộ tính CAR:
        1.  *Kịch bản An toàn (Basel III)*: Vốn tự có dày dặn, tỷ lệ nợ rủi ro thấp, CAR đạt ~11.5% tuân thủ CCB.
        2.  *Kịch bản Thiếu đệm CCB*: Tỷ lệ CAR đạt ~9.5% (đạt tối thiểu 8% nhưng vi phạm cảnh báo đệm CCB).
        3.  *Kịch bản Vi phạm Nghiêm trọng*: Tỷ lệ CAR rơi xuống ~4.5% (vi phạm toàn diện tất cả các chuẩn).
    - Click vào kịch bản bất kỳ sẽ tự động điền các thông số số liệu tương ứng và kích hoạt vẽ lại biểu đồ Chart.js cơ cấu RWA lập tức.

---

## 📈 Lựa chọn Tỷ lệ Trục dọc (Y-Axis Scale) cho Biểu đồ CAR

Để hỗ trợ người dùng linh hoạt phóng to dữ liệu hoặc quan sát toàn cảnh:
*   **Bộ chọn trục dọc (Y-Scale Selectors)**: Tích hợp thêm dropdown chọn tỉ lệ trục dọc trên thanh điều khiển của cả 2 trang phân tích:
    - **Trang Phân tích Đơn lẻ**: Cho phép tùy chỉnh tỷ lệ cho biểu đồ CAR hàng năm và biểu đồ xu hướng thời gian.
    - **Trang So sánh Đối chiếu**: Cho phép tùy chỉnh tỷ lệ cho biểu đồ so sánh cột và biểu đồ so sánh xu hướng nhiều ngân hàng.
*   **3 Chế độ phóng tỷ lệ linh hoạt**:
    - `Tự động (Zoom)`: Hệ thống tự động tính toán khoảng dữ liệu tối ưu nhất của các điểm dữ liệu để phóng to đường xu hướng (tạo cảm giác nhạy bén, dễ thấy độ dốc biến động).
    - `Bắt đầu từ 0%`: Buộc trục Y bắt đầu từ mức 0% đến mức cực đại (giúp so sánh khách quan quy mô và giữ tỷ lệ thực tế, tránh hiểu nhầm về độ dốc).
    - `Cận cảnh (6% - 18%)`: Khoá cố định dải tỷ lệ an toàn vốn từ 6% đến 18% giống y hệt như biểu đồ tham chiếu của các năm.
*   **Đồng bộ tức thì**: Thay đổi tùy chọn Y-Scale sẽ kích hoạt vẽ lại (redraw) canvas Chart.js ngay lập tức với hiệu ứng hoạt họa chuyển đổi trơn tru.

---

## 🛠️ Sửa lỗi cấu trúc thẻ HTML (Hotfix Nested Tab Panel Visibility)

*   **Vấn đề**: Khi chuyển sang các tab phụ "Bảng so sánh", "Bộ tính CAR" và "Trắc nghiệm", nội dung vùng hiển thị trống trơn.
*   **Nguyên nhân**: Thẻ `div` của `#pillars-section` bị thiếu mất thẻ đóng `</div>` (chỉ đóng thẻ `.pillars-grid` ở bên trong). Điều này khiến cho cả 3 phân hệ bên dưới bị lồng nhầm làm phần tử con của `#pillars-section`. Khi chuyển tab, `#pillars-section` bị ẩn (thêm class `hidden`), gián tiếp ẩn luôn toàn bộ các phân hệ con lồng sai cấu trúc này.
*   **Giải pháp**: Thêm thẻ `</div>` đóng chính xác `#pillars-section` tại dòng 262 trong [`index.html`](index.html), giúp đưa các tab panel phụ trở về cùng cấp (siblings), khắc phục triệt để lỗi hiển thị trống.

---

## 📈 Sửa lỗi hiển thị danh sách Ngân hàng trong các Tab Phân tích & So sánh

*   **Vấn đề**: Người dùng phản hồi rằng tab CAR chỉ hiển thị 10 ngân hàng, không hiện đủ tất cả các ngân hàng có trong dữ liệu (20 ngân hàng).
*   **Nguyên nhân**: Danh sách checkbox và dropdown chọn ngân hàng trong mục **Các Tỷ lệ An toàn khác (BCTC)** và **Phân tích BCTC** chỉ được khai báo cứng 10 ngân hàng hàng đầu trong HTML, trong khi trang phân tích chính đã được mở rộng lên 20 ngân hàng.
*   **Giải pháp**:
    - Cập nhật danh sách chọn đơn lẻ `#ratio-bank-select` và `#financial-bank-select` để chứa đủ 20 ngân hàng.
    - Cập nhật danh sách so sánh đối chiếu `#ratio-compare-banks-checkboxes` và `#financial-compare-banks-checkboxes` để hiển thị đủ 20 ngân hàng.
    - Cập nhật tiêu đề giới thiệu các phân hệ phân tích từ *10 ngân hàng thương mại* thành *20 ngân hàng thương mại*.

---

## 💼 Tích hợp thông tin Tuyển dụng từ ACB (Á Châu Bank)

*   **Tính năng**: Bổ sung nguồn thu thập tin tuyển dụng trực tiếp từ ACB thông qua website `https://www.acbjobs.com.vn`.
*   **Chi tiết triển khai**:
    - **Proxy Endpoint**: Bổ sung endpoint `/api/jobs/acb` vào file proxy backend `run_app.py` để gửi request kèm header giả lập trình duyệt, vượt qua các rào cản bảo mật CORS/WAF của website ACB.
    - **Frontend Integration**:
        - Thêm nút bộ lọc nhanh ngân hàng **🟠 ACB** vào thanh công cụ tìm kiếm trong `index.html`.
        - Cập nhật JS logic (`js/jobs.js`) để kết nối API proxy, tải dữ liệu động HTML của trang ACB Jobs và tiến hành phân tích DOM trực tiếp phía client (Client-side HTML Parsing).
        - Trích xuất thông tin Tiêu đề, Khối phòng ban, Địa điểm làm việc, Yêu cầu kinh nghiệm, Loại hình công việc và Mức lương của từng vị trí từ cấu trúc thẻ `.jobs .item`.
        - Thực hiện phân loại tự động (Auto-mapping) vị trí theo các khối Pháp chế & Rủi ro (`risk-legal`), CNTT & Dữ liệu (`it-data`) và Kinh doanh để phân tách dữ liệu chuẩn hóa.
        - Hỗ trợ phân trang và Lazy loading tự động đối với các trang kết quả tiếp theo của ACB khi người dùng nhấn Tìm kiếm.
        - **Hỗ trợ Đa khu vực/Văn phòng (Multi-office support)**: Hỗ trợ tích hợp đồng thời hai cổng tuyển dụng chính của ACB: Chi nhánh TP. Hồ Chí Minh (`office=3133`) và Văn phòng Hội sở chính (`office=86`). Dữ liệu từ cả hai nguồn được tải song hành và gộp lại tự động mà không lo trùng lặp tin tuyển dụng.
        - **Chuẩn hóa URL chi tiết (Detail URL Normalization)**: Tự động phát hiện và chuyển đổi các liên kết của tin tuyển dụng thành dạng tuyệt đối đầy đủ tiền tố bảo mật `https://www.acbjobs.com.vn/job/...` (e.g. `https://www.acbjobs.com.vn/job/hcm-giam-docchuyen-vien-quan-he-khach-hang-ca-nhan-53664`) để đảm bảo người dùng click trực tiếp vào tin sẽ mở đúng trang chi tiết của ACB trên trình duyệt.

---

## 💼 Tích hợp thông tin Tuyển dụng từ LPBank (Lộc Phát Bank)

*   **Tính năng**: Bổ sung nguồn tuyển dụng trực tiếp từ LPBank thông qua API của đối tác iviec.vn (`centralize-api-v2.iviec.vn`).
*   **Chi tiết triển khai**:
    - **Proxy Endpoint**: Bổ sung endpoint `/api/jobs/lpbank` vào file proxy backend `run_app.py` để forward yêu cầu tới cổng API trung tâm, cấu hình Header origin/referer tương ứng với trang `tuyendung.lpbank.com.vn`.
    - **Frontend Integration**:
        - Thêm nút bộ lọc nhanh ngân hàng **🔴 LPBank** (sử dụng màu đỏ thương hiệu) vào thanh công cụ tìm kiếm trong `index.html`.
        - Cập nhật JS logic (`js/jobs.js`) để kết nối API proxy, lấy dữ liệu JSON chứa tin tuyển dụng.
        - Trích xuất thông tin: Tên công việc (`job.name`), ID (`job.id`), Slug (`job.slug`), Mức lương (`minSalary`/`maxSalary`), Địa điểm làm việc từ `workingNewAddresses`, và Tên phòng ban (`job_department`) / Cấp bậc (`job_level`) từ thuộc tính `recruitmentDeltaDatas`.
        - Hỗ trợ phân tích & phân loại tự động vị trí tương thích với các khối phòng ban Rủi ro/Pháp lý và Công nghệ của App.
        - Xây dựng URL chi tiết trỏ trực tiếp đến bài viết canonical của LPBank: `https://tuyendung.lpbank.com.vn/vi/jobs/[slug]`.
        - Hỗ trợ phân trang và Lazy loading tự động nền các trang kết quả tiếp theo dựa trên thuộc tính `totalPage` trả về từ API.
    - **Sửa lỗi đồng bộ & CORS**:
        - Đồng bộ toàn bộ các Header trong request của Proxy trùng khớp 100% với yêu cầu Curl từ trình duyệt (như `sec-ch-ua`, `sec-fetch-mode`, `sec-fetch-site`, `priority`,...).
        - Sửa lỗi CORS Preflight: Bổ sung `Accept` và `Authorization` vào header `Access-Control-Allow-Headers` trong file `run_app.py` để tránh lỗi trình duyệt chặn các request có thuộc tính headers tùy chỉnh trên môi trường local.
        - **Khắc phục lỗi Phân loại Nhầm**: Cập nhật hàm `matchKeyword` kiểm tra ranh giới từ riêng biệt (standalone word) đối với từ khóa ngắn như `"it"`. Việc này tránh việc các từ có chứa cụm ký tự `it` (ví dụ: `priority`, `credit`, `deposit`) bị phân loại sai vào nhóm `"it-data"` (Công nghệ & Dữ liệu) và trả chúng về đúng nhóm `"business"` (Đơn vị Kinh doanh).

---

## 🔍 Tự động Cập nhật Bộ lọc Cột theo Kết quả hiện có (Dynamic Faceted Search)

*   **Tính năng**: Các bộ lọc dạng dropdown trong bảng kết quả tìm kiếm tuyển dụng (Ngân hàng, Khối phòng ban, Cấp bậc) tự động cập nhật danh sách tùy chọn và hiển thị số lượng tin phù hợp (Count) theo kết quả tìm kiếm thực tế.
*   **Chi tiết triển khai**:
    - **Faceted Search Logic**: Cập nhật hàm `updateFacetedFilters(baseJobs)` để tính toán các tùy chọn khả dụng cho từng cột. Để mang lại trải nghiệm tối ưu, bộ lọc của một cột sẽ được tính dựa trên kết quả lọc của *tất cả các cột khác* (loại trừ chính nó). Điều này giúp:
        - Dropdown không bao giờ hiển thị tùy chọn dẫn đến kết quả rỗng (0 kết quả).
        - Người dùng vẫn có thể thay đổi lựa chọn của cột hiện tại mà không bị khóa cứng.
    - **Hiển thị số lượng (Counts)**: Mỗi option hiển thị thêm số lượng bản ghi tương ứng (ví dụ: `VPBank (12)`, `IT & Công nghệ & Dữ liệu (4)`).
    - **Khớp dữ liệu Khối phòng ban**: Cải tiến bộ lọc cột "Khối phòng ban" từ việc sử dụng các mã phân loại chung (như `business`, `it-data`, `risk-legal`) sang việc trích xuất và hiển thị các tên phòng ban thực tế từ dữ liệu kết quả (như `Công ty thành viên`, `Thẩm định Tài sản`). Thay đổi này giúp các tùy chọn trong bộ lọc khớp chính xác tuyệt đối với những gì người dùng nhìn thấy trong cột của bảng.
        - **Phân loại phòng ban động cho MB Bank (MBB)**: Vì API gốc của MB Bank không trả về trường tên phòng ban, hệ thống đã bổ sung bộ lọc từ khóa thông minh để tự động ánh xạ tiêu đề công việc thành các tên phòng ban thực tế (ví dụ: `"Khối Khách hàng Cá nhân"`, `"Khối Khách hàng Doanh nghiệp"`, `"Khối Công nghệ Thông tin"`, `"Khối Thẩm định"`, `"Khối Vận hành"`...) tương tự như các ngân hàng khác.
    - **Hỗ trợ Chọn nhiều tùy chọn (Multi-select)**: Thay thế các thẻ `<select>` mặc định bằng cấu phần dropdown tùy chỉnh hỗ trợ các ô Checkbox cho phép chọn lọc nhiều Ngân hàng, Khối phòng ban và Cấp bậc đồng thời.
        - Hiển thị nhãn thông minh trên nút kích hoạt: hiển thị `"Tất cả (N)"` khi không chọn gì, hiển thị danh sách tên nếu chọn ít hơn 2 mục, và hiển thị `"Đã chọn (N)"` nếu chọn nhiều hơn.
        - Tự động đóng danh sách khi người dùng click chuột ra ngoài vùng chọn (Click-outside closing).
        - **Tối ưu hóa hiển thị (Visual Enhancements)**:
            - **Ngăn chặn xuyên thấu chữ (Bleed-through prevention)**: Thay đổi thuộc tính `background` của danh sách thả nổi `.multiselect-dropdown` từ dạng trong suốt (`var(--card-bg)`) sang dạng màu nền vững đặc (`var(--bg-color)`), giúp che khuất hoàn toàn nội dung chữ của các hàng bảng phía sau, đảm bảo khả năng đọc cực tốt trên cả 2 giao diện Light/Dark Mode.
            - **Cố định kích thước & chống xuống dòng**: Bổ sung `min-width: 240px` và thuộc tính `white-space: nowrap` cho các option để tên phòng ban dài hiển thị trọn vẹn trên một dòng, tăng tính thẩm mỹ cao cấp.
            - **Chống tràn màn hình**: Dropdown ngoài cùng bên phải ("Cấp bậc") được cấu hình tự động căn lề phải (`right: 0`) để tránh bị tràn khỏi biên bảng hoặc mép màn hình thiết bị.
            - **Cắt ngắn nhãn nút bấm**: Bổ sung hiệu ứng `text-overflow: ellipsis` cho nút kích hoạt để khi chọn nhiều mục dài, nhãn chữ sẽ tự thu gọn bằng dấu ba chấm thay vì làm vỡ bố cục giao diện.
    - **Giữ trạng thái đã chọn (State preservation)**: Khi danh sách dữ liệu nền được tải thêm (lazy load) hoặc thay đổi, các giá trị bộ lọc đã chọn trước đó vẫn được giữ nguyên nếu chúng vẫn còn hợp lệ.

---

## 🏷️ Cập nhật Tên Subpage (Author Tabs)

*   **Tính năng**: Đổi tên các subpages/tabs lọc tác giả trong phần "Phân tích & Thảo luận vĩ mô" để đơn giản hóa giao diện.
*   **Chi tiết triển khai**:
    - Cập nhật trong file [`index.html`](file:///Users/toanpham/Desktop/banking/index.html):
        - Đổi tab **Hedge Academy** thành **Page 1**.
        - Đổi tab **Trần Quang Nghĩa** thành **Page 2**.

---

## 📱 Tối ưu hóa Giao diện Tương thích Di động (Responsive Layout)

*   **Tính năng**: Đảm bảo toàn bộ ứng dụng hiển thị và hoạt động mượt mà khi truy cập bằng trình duyệt web trên điện thoại di động.
*   **Chi tiết triển khai**:
    - **Chuyển đổi bảng tuyển dụng thành danh sách thẻ (Table-to-Card list)**:
        - Trên màn hình nhỏ (`max-width: 768px`), bảng tuyển dụng tự động ẩn các tiêu đề bảng truyền thống.
        - Mỗi dòng trong bảng được chuyển thành một "Thẻ thông tin" (Card) độc lập, tự co giãn, căn lề và sử dụng các thuộc tính nhãn giả lập (`data-label`) để hiển thị thông tin dạng khóa-giá trị gọn gàng.
        - Các nút chức năng (Bookmark, Chi tiết) được gom nhóm thẩm mỹ ở chân thẻ.
    - **Chuyển đổi bộ lọc cột thành bảng tùy chọn dạng lưới**:
        - Hàng bộ lọc cột (`#col-filter-row`) tự động biến đổi thành một lưới 2 cột ở đầu danh sách.
        - Ô tìm kiếm từ khóa vị trí chiếm trọn chiều rộng để người dùng dễ thao tác bằng ngón tay.
        - Các dropdown bộ lọc được căn lề tự động chống tràn màn hình (`#multiselect-dept` căn phải, `#multiselect-level` căn trái).
    - **Tối ưu hóa Điều hướng (Navigation)**:
        - **Lớp phủ nền mờ (Backdrop Blur Overlay)**: Bổ sung lớp phủ nền `.app-container::before` tự động kích hoạt làm mờ và tối vùng nội dung chính khi mở menu sidebar trên thiết bị di động. Giúp tập trung thị giác vào thanh điều hướng và đóng nhanh sidebar khi chạm vào vùng ngoài.
        - **Tối ưu nút kích hoạt Menu**: Cấu hình nút hamburger với màu nền đặc (`var(--bg-color)`) và đổ bóng đậm rõ nét để không bị lẫn với các phần tử tiêu đề nằm phía dưới.
        - **Sửa lỗi nút Hamburger biến mất (Navigation Visibility Fix)**: Khắc phục lỗi nút mở rộng Menu (Hamburger button) bị ẩn mặc định trên thiết bị di động do mang class `.hidden` của phiên bản Desktop khi chưa nhấn Collapse. Đã cấu hình ghi đè CSS để luôn hiển thị nút mở Menu trên thiết bị di động (`display: flex !important;`) và chỉ ẩn đi khi Menu Sidebar đang được mở rộng trực tiếp (`.mobile-sidebar-active`).
            - *Bổ sung*: Đã di chuyển quy tắc ghi đè hiển thị xuống **cuối file CSS** để tránh bị ghi đè bởi định nghĩa gốc của class `.hidden` (vốn được viết ở dòng dưới media query trước đó). Sử dụng các bộ định danh ID và class chi tiết hơn (`#sidebar-expand-btn.hidden`) kết hợp `!important` để chắc chắn nút Hamburger sẽ xuất hiện trên mọi thiết bị di động.
            - *Sửa lỗi Cache trình duyệt di động*: Để vượt qua bộ nhớ đệm (cache) cực kỳ cứng đầu của trình duyệt Safari/Chrome trên điện thoại di động khi deploy sản phẩm lên GitHub Pages, đã bổ sung tham số phiên bản `?v=1.0.2` vào đường dẫn nạp file CSS, đồng thời nhúng trực tiếp khối `<style>` ghi đè đặc tả hiển thị Navigation (với `z-index: 9999` và `display: flex !important;`) ngay tại `<head>` trong file [`index.html`](file:///Users/toanpham/Desktop/banking/index.html). Việc này loại bỏ hoàn toàn khả năng lưu giữ file CSS cũ của thiết bị di động, đảm bảo giao diện luôn mới và hiển thị đầy đủ nút menu.
    - **Tối ưu hóa Trình tìm kiếm tài liệu (Document Finder)**:
        - **Mở rộng toàn màn hình (Full-width drawer)**: Trên màn hình điện thoại di động (`max-width: 480px`), ngăn chứa Document Finder (`.doc-finder-drawer`) được mở rộng 100% chiều ngang màn hình thay vì giữ kích thước cố định 380px, mang lại không gian cuộn và tra cứu tài liệu thoải mái nhất.
        - **Căn chỉnh lại Tab tài liệu nổi**: Tinh chỉnh vị trí và độ mờ của `.floating-doc-tab` ở cạnh phải màn hình để không che lấp các yếu tố giao diện quan trọng khác trên điện thoại.
            - *Bổ sung*: Đã căn chỉnh lại từ vị trí thấp ở góc dưới (`top: 80%`) về vị trí cân đối ở chính giữa lề phải (`top: 50%` kết hợp `transform: translateY(-50%)`), giúp tab tài liệu hiển thị gọn gàng, dễ chạm bấm và cân xứng mặt thị giác tương tự như trên Desktop.
        - **Sửa lỗi mở PDF trên Mobile (Mobile PDF View Fix)**:
            - *Vấn đề*: Trình duyệt di động (đặc biệt là iOS Safari dùng nhân WebKit) không hỗ trợ hiển thị tệp PDF nhúng trong thẻ `<iframe>` (thường dẫn đến lỗi trắng trang hoặc chỉ hiển thị trang đầu tiên không thu phóng được).
            - *Giải pháp*: Cập nhật phương thức `openPdfViewer` trong [`js/docfinder.js`](file:///Users/toanpham/Desktop/banking/js/docfinder.js) để tự động nhận diện thiết bị di động (User-Agent & Screen Width). Khi click mở tài liệu trên di động, ứng dụng sẽ mở trực tiếp tệp PDF trong một tab mới (`window.open(path, '_blank')`) giúp tận dụng khả năng hiển thị PDF gốc tuyệt vời của hệ điều hành di động (cho phép vuốt, phóng to, thu nhỏ và tải về). Trên desktop, ứng dụng vẫn giữ nguyên giao diện hiển thị Popup Iframe tiện lợi.
    - **Áp dụng Responsive toàn diện cho tất cả các trang & Cấu phần (Tabs, Calculator, Tables)**:
        - **Cuộn ngang danh sách Tabs (Horizontal Swipable Tabs)**: Các thanh tab con (Sub-tabs) trên tất cả các trang (Hiệp ước Basel, Phân tích CAR, Phân tích BCTC, Tài liệu) được chuyển đổi thành cơ chế cuộn ngang mượt mà (`overflow-x: auto; flex-wrap: nowrap;`) thay vì ngắt dòng lộn xộn. Giúp giao diện mobile giữ vững bố cục ngang đồng đều, hiện đại.
        - **Tự động xếp chồng dòng nhập liệu (Stacked form rows)**: Chuyển cấu trúc 2 cột của các dòng nhập liệu trong bộ tính toán CAR (`.form-row`) thành xếp chồng 1 cột trên màn hình di động, giúp các thanh trượt và ô nhập số liệu hiển thị to rõ, không bị bóp méo.
        - **Tinh giản khoảng cách Card & Tiêu đề**: Co gọn padding và bo góc các `.card` trên mobile (`1.25rem` và `12px` border-radius) để tận dụng tối đa không gian trống trên màn hình nhỏ.
        - **Giới hạn tỷ lệ an toàn 1 cột (LDR, CAR limits)**: Lưới hiển thị các tỷ lệ an toàn ngân hàng ở VN (`.ratios-grid`) tự động co từ 2 cột về 1 cột trên màn hình điện thoại để tránh tràn chữ.
        - **Cố định chiều rộng tối thiểu cho Bảng so sánh (Comparison horizontal scroll)**: Thêm chiều rộng tối thiểu `750px` cho bảng so sánh Basel I-IV để đảm bảo các dữ liệu text phong phú không bị bó hẹp trong chiều rộng màn hình dọc của mobile.
    - **Sửa lỗi gọi dữ liệu tuyển dụng trên Mobile (Local Network API Resolution Fix)**:
        - **Vấn đề**: Khi truy cập ứng dụng từ thiết bị di động trong cùng mạng LAN qua địa chỉ IP của máy tính (ví dụ: `http://192.168.1.5:8000`), frontend không khớp điều kiện `localhost` nên đã chuyển tiếp gọi API trực tiếp đến các máy chủ ngân hàng, dẫn đến lỗi CORS. Đồng thời, việc fallback cứng về `http://localhost:8000` cũng thất bại vì `localhost` trên điện thoại đại diện cho chính nó.
        - **Giải pháp**: Xây dựng cơ chế tự động phân giải `resolveApiUrl(relativeUrl)` trong [`js/jobs.js`](file:///Users/toanpham/Desktop/banking/js/jobs.js). Thuật toán sẽ tự động nhận diện nếu hostname là một địa chỉ IP nội bộ (LAN IP) và đang chạy trên giao thức HTTP, từ đó sử dụng chính địa chỉ IP của máy tính làm địa chỉ Proxy. Giúp thiết bị di động kết nối và tải dữ liệu tuyển dụng thành công 100% thông qua máy chủ Proxy local.
            - *Bổ sung xử lý HTTPS (GitHub Pages)*: Khi chạy ứng dụng thực tế trên trang web được mã hóa HTTPS (`https://willphamdrive.github.io/banking/`), việc gọi trực tiếp đến Proxy HTTP local (`http://localhost:8000`) sẽ bị trình duyệt chặn hoàn toàn do cơ chế **Mixed Content** (nội dung hỗn hợp không an toàn). Để khắc phục, thuật toán đã bổ sung cơ chế tự động định tuyến các request qua cổng dịch vụ Proxy HTTPS công cộng bảo mật **`https://corsproxy.io/?`** đối với các origin chạy giao thức HTTPS. Phương án này giải quyết triệt để vấn đề CORS và Mixed Content, giúp thiết bị di động truy cập trực tiếp từ URL GitHub Pages vẫn có thể tải dữ liệu việc làm bình thường.

---

## 💼 Tích hợp Dữ liệu Tuyển dụng Sacombank (Hội sở)

Tôi đã phân tích cấu trúc và bổ sung thành công ngân hàng Sacombank (STB) vào phân hệ Tuyển dụng:

1. **Proxy API trong `run_app.py`**:
   - Bổ sung endpoint `/api/jobs/sacombank` để proxy các yêu cầu gọi dữ liệu từ trang tuyển dụng Sacombank (`https://sacombankcareer.com/go/V%E1%BB%8A-TR%C3%8D-T%E1%BA%A0I-H%E1%BB%98I-S%E1%BB%9E/628544/`) nhằm tránh lỗi CORS mà không cần duy trì cookie tĩnh.
   - Thêm bộ định tuyến `/job/` để tự động chuyển tiếp và proxy bất kỳ đường dẫn chi tiết tin tuyển dụng nào của Sacombank (ví dụ: `/job/T%E1%BB%89nh-V%C4%A9nh-Long-...`) giúp mở xem chi tiết không bị lỗi CORS/Mixed Content.
2. **Xử lý hiển thị trong `index.html`**:
   - Bổ sung nút lọc ngân hàng **🔵 Sacombank** vào thanh bộ lọc để hỗ trợ xem và tìm kiếm riêng các công việc thuộc Sacombank.
3. **Logic tải & phân tích dữ liệu trong `js/jobs.js`**:
   - Bổ sung phương thức `fetchLiveSTBPage` để gọi API proxy. Hỗ trợ truyền tham số `startrow` để tải phân trang (ví dụ: `startrow=20`, `startrow=40`...) giúp nạp toàn bộ danh sách tuyển dụng Sacombank (57 công việc).
   - Viết hàm `parseStbHtml` sử dụng `DOMParser` để bóc tách thông tin vị trí, khối phòng ban, khu vực, id và liên kết gốc của từng tin tuyển dụng trên trang SuccessFactors của Sacombank. Triển khai thuật toán **sinh URL động** (`https://sacombankcareer.com/job/{slug}/{id}/`) từ thông tin tiêu đề (`title`), khu vực (`facility`), và mã định danh (`id`) của tin tuyển dụng bằng cách thay thế các khoảng trắng và dấu gạch chéo bằng dấu gạch ngang (`-`), dọn dẹp các ký tự trùng lặp và loại bỏ các dấu gạch dư thừa ở đầu/cuối chuỗi để đảm bảo liên kết chi tiết luôn được tạo chính xác và ổn định.
   - Thêm phương thức `processRawSTBJobs` để chuẩn hóa các thuộc tính công việc về mô hình chung (quy định logo màu xanh dương `STB`, tự động phân loại khối công nghệ thông tin `it-data`, khối rủi ro pháp lý `risk-legal`, hoặc nghiệp vụ kinh doanh `business`).
4. **Cập nhật tập lệnh cào dữ liệu offline `save_jobs_db.py`**:
   - Tích hợp cào phân trang Sacombank bằng cách tải ghép nối các trang startrow khác nhau, lưu trữ offline gộp vào tệp `jobs_database.json`, hỗ trợ chế độ xem offline đầy đủ kết quả khi không kết nối mạng.

---

## 🟣 Tích hợp Dữ liệu Tuyển dụng TPBank (TPB)

Tôi đã hoàn thành tích hợp dữ liệu tuyển dụng của TPBank (TPB) vào phân hệ Tuyển dụng:

1. **Proxy API trong `run_app.py`**:
   - Bổ sung endpoint `/api/jobs/tpbank` để proxy các yêu cầu gọi dữ liệu từ API tuyển dụng TPBank trên nền tảng iViec (`https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain`) nhằm tránh lỗi CORS.
2. **Xử lý hiển thị trong `index.html`**:
   - Bổ sung nút lọc ngân hàng **🟣 TPBank** vào thanh công cụ để lọc và xem danh sách tin tuyển dụng của TPBank.
3. **Logic tải & phân tích dữ liệu trong `js/jobs.js`**:
   - Bổ sung phương thức `fetchLiveTPBPage` gọi API qua server proxy.
   - Thêm phương thức `processRawTPBJobs` để chuẩn hóa các thuộc tính công việc từ dữ liệu API iViec về mô hình dữ liệu chung của ứng dụng, phân loại chính xác các khối CNTT (`it-data`), Quản trị rủi ro & Pháp chế (`risk-legal`), hoặc Nghiệp vụ kinh doanh (`business`).
4. **Cập nhật tập lệnh cào dữ liệu offline `save_jobs_db.py`**:
   - Tích hợp TPBank vào quy trình tải dữ liệu kết hợp và lưu trữ offline vào tệp `jobs_database.json` tương tự như LPBank.

---

## 🏷️ Cài đặt Chủ đề Mặc định cho Macro Discussion
- **Hedge Academy (Page 1)**: Cấu hình chủ đề **"SBV đã sai gì?"** (`sbv_mistakes`) làm chủ đề hoạt động mặc định khi tải trang và khi người dùng click chuyển từ tác giả khác quay về Page 1.
- **Trần Quang Nghĩa (Page 2)**: Khi chuyển sang Page 2, chủ đề hoạt động mặc định là **"Tất cả"** (`all`) để hiển thị toàn bộ kho bài viết đa dạng của tác giả.

---

## 🟠 Tích hợp Dữ liệu Tuyển dụng HDBank (HDB)
Tôi đã phân tích cấu trúc và bổ sung thành công ngân hàng HDBank vào hệ thống Tuyển dụng:
1. **Proxy API trong `run_app.py`**:
   - Bổ sung định tuyến POST `/api/jobs/hdbank` để chuyển tiếp yêu cầu cào dữ liệu đến API chính thức của HDBank: `https://proxyapi.hdbank.com.vn/CVT_HDBank/api/v1/job/search`, hỗ trợ đầy đủ các Header CORS và payload tùy chỉnh.
2. **Hiển thị giao diện trong `index.html`**:
   - Thêm nút lọc ngân hàng **🟠 HDBank** vào bộ lọc ngân hàng chính với màu cam thương hiệu (`#ea580c`).
3. **Logic cào & xử lý dữ liệu trong `js/jobs.js`**:
   - Bổ sung phương thức `fetchLiveHDBPage` hỗ trợ phân trang và gửi payload POST dạng JSON.
   - Thêm logic `processRawHDBJobs` để chuẩn hóa các thuộc tính công việc:
     - Tạo liên kết chi tiết tin tuyển dụng trực tiếp theo chuẩn HDBank bằng mã định danh: `https://career.hdbank.com.vn/jobdetail/{id}` (ví dụ: `https://career.hdbank.com.vn/jobdetail/890`).
     - Phân loại khối phòng ban thông minh: Pháp lý/Rủi ro (`risk-legal`), Công nghệ (`it-data`), hoặc Kinh doanh (`business`).
4. **Cập nhật tập lệnh cào offline `save_jobs_db.py`**:
   - Tích hợp HDBank vào quy trình cào dữ liệu tự động, lưu trực tiếp dữ liệu dạng JSON vào trường `hdb` trong cơ sở dữ liệu offline `jobs_database.json` và đồng bộ tự động lên GitHub qua Git commands.

---

## 🟡 Tích hợp Dữ liệu Tuyển dụng Nam A Bank (NAB)
Tôi đã hoàn thành tích hợp dữ liệu tuyển dụng của Nam A Bank (NAB) vào phân hệ Tuyển dụng:
1. **Proxy API trong `run_app.py`**:
   - Bổ sung định tuyến `/api/jobs/namabank` để chuyển tiếp yêu cầu đến API của Nam A Bank trên hệ thống đối tác iViec (`https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain`), mang các tham số `DeltaDataLocation` và `Domain` đặc thù của Nam A Bank.
2. **Hiển thị giao diện trong `index.html`**:
   - Thêm nút lọc ngân hàng **🟡 Nam A Bank** với màu vàng thương hiệu (`#eab308`) vào thanh bộ lọc nhanh các ngân hàng.
3. **Logic cào & xử lý dữ liệu trong `js/jobs.js`**:
   - Thêm phương thức `fetchLiveNABPage` gọi qua server proxy.
   - Thêm phương thức `processRawNABJobs` chuẩn hóa dữ liệu:
     - Tạo liên kết chi tiết tin tuyển dụng: `https://tuyendung.namabank.com.vn/vi/jobs/{slug}`.
     - Phân loại thông minh các khối phòng ban (Rủi ro/CNTT/Kinh doanh) và cấp bậc công việc.
   - Tích hợp Nam A Bank vào bộ lazy loading pagination ngầm.
4. **Cập nhật tập lệnh cào offline `save_jobs_db.py`**:
   - Tích hợp Nam A Bank vào quy trình cào tự động và lưu trữ offline vào tệp `jobs_database.json`.

---

## 🔵 Tích hợp Dữ liệu Tuyển dụng BVBank (BVB)
Tôi đã hoàn thành tích hợp dữ liệu tuyển dụng của BVBank (Bản Việt) vào phân hệ Tuyển dụng:
1. **Proxy API trong `run_app.py`**:
   - Bổ sung định tuyến `/api/jobs/bvbank` để chuyển tiếp yêu cầu đến API tuyển dụng Base Talent của Bản Việt Bank (`https://bvbank.talent.vn/jobs`), sử dụng Cookie định danh và các Header cần thiết để vượt qua các lớp bảo mật API.
2. **Hiển thị giao diện trong `index.html`**:
   - Thêm nút lọc ngân hàng **🔵 BVBank** với màu xanh đậm đại diện (`#025b96`) kế bên bộ lọc Nam A Bank.
3. **Logic cào & xử lý dữ liệu trong `js/jobs.js`**:
   - Thêm phương thức `fetchLiveBVBPage` và bộ phân tách DOM HTML `parseBvbHtml` tương tự như ACB để phân tách danh sách tin từ Base Talent.
   - Thêm phương thức `processRawBVBJobs` chuẩn hóa dữ liệu:
     - Tạo liên kết chi tiết tin tuyển dụng: `https://bvbank.talent.vn/job/{slug-id}`.
     - Phân loại thông minh khối phòng ban và cấp bậc công việc.
   - Tích hợp BVBank vào bộ lazy loading pagination ngầm.
4. **Cập nhật tập lệnh cào offline `save_jobs_db.py`**:
   - Tích hợp BVBank vào quy trình cào tự động và lưu trữ offline vào trường `bvb` trong tệp `jobs_database.json`.

---

## 🌸 Tích hợp Dữ liệu Tuyển dụng Vikki Bank (Vikki)
Tôi đã hoàn thành tích hợp dữ liệu tuyển dụng của Vikki Bank vào phân hệ Tuyển dụng:
1. **Proxy API trong `run_app.py`**:
   - Bổ sung định tuyến `/api/jobs/vikki` chuyển tiếp yêu cầu đến trang tuyển dụng Enfold WordPress của Vikki Bank (`https://vikkibank.vn/tuyen-dung/`), sử dụng tham số `avia-element-paging=X` để phân trang và Cookies, Headers tương thích.
2. **Hiển thị giao diện trong `index.html`**:
   - Thêm nút lọc ngân hàng **🌸 Vikki Bank** với màu hồng đặc trưng (`#db2777`) kế bên bộ lọc BVBank.
3. **Logic cào & xử lý dữ liệu trong `js/jobs.js`**:
   - Thêm phương thức `fetchLiveVikkiPage` gọi API và `parseVikkiHtml` phân tách cấu trúc HTML slide của Enfold theme để thu thập danh sách tin tuyển dụng.
   - Thêm phương thức `processRawVikkiJobs` chuẩn hóa dữ liệu:
     - Tạo liên kết tin tuyển dụng: `https://vikkibank.vn/{slug}/`.
     - Trích xuất thông tin khu vực/vị trí làm việc từ đoạn mô tả tóm tắt.
     - Phân loại thông minh khối phòng ban và cấp bậc công việc.
   - Tích hợp Vikki Bank vào bộ lazy loading pagination ngầm.
4. **Cập nhật tập lệnh cào offline `save_jobs_db.py`**:
   - Tích hợp Vikki Bank vào quy trình cào tự động (quét trang 1 và 2) và lưu trữ offline vào trường `vikki` trong tệp `jobs_database.json`.

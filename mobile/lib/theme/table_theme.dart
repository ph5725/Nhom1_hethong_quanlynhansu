// lib/widgets/custom_data_table.dart

import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart'; // Đảm bảo đường dẫn đúng

@Deprecated('Use g instead. Will be removed in 4.0.0.')
class CustomDataTable extends StatelessWidget {
  final List<String> columns;
  final List<List<Widget>> rows; // Nội dung hàng là List<Widget>
  final Function(int rowIndex)? onRowTap; // Callback khi chạm vào hàng
  final bool showActions; // Cờ để hiển thị cột Actions

  const CustomDataTable({
    super.key,
    required this.columns,
    required this.rows,
    this.onRowTap,
    this.showActions = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Xử lý overflow-x: auto bằng SingleChildScrollView
    return Card(
      // Tương ứng với .table (background, border-radius, box-shadow)
      // CardTheme đã được định nghĩa trong AppTheme
      // Các thuộc tính của CardTheme sẽ tự động áp dụng
      child: Container(
        // Cần đảm bảo padding của Card không bị áp dụng vào bên trong bảng nếu CardTheme có padding
        // Hoặc bạn có thể dùng Container thay cho Card nếu muốn kiểm soát chặt chẽ hơn.
        // Ở đây, CardTheme không có padding, nên không cần phức tạp.
        margin: const EdgeInsets.only(
            top: 24.0), // margin-top: 24px cho .table-wrapper
        child: SingleChildScrollView(
          // overflow-x: auto; width: 100%;
          scrollDirection: Axis.horizontal, // Cho phép cuộn ngang
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minWidth: MediaQuery.of(context).size.width -
                  36 * 2, // Đảm bảo bảng đủ rộng để không bị tràn
              // - 36*2 là trừ đi padding của .user-container
            ),
            child: DataTable(
              columnSpacing: 15.0, // Khoảng cách giữa các cột
              dataRowMinHeight:
                  48, // min-height cho hàng (ước tính từ padding 12px)
              dataRowMaxHeight: 48,
              headingRowHeight:
                  48, // Chiều cao header (ước tính từ padding 12px)
              horizontalMargin: 15.0, // horizontal padding cho cell
              // Các đường viền và màu nền được tùy chỉnh ở đây
              decoration: BoxDecoration(
                color: AppTheme.backgroundLight, // Nền bảng màu trắng
                borderRadius: BorderRadius.circular(16), // Bo tròn góc bảng
                // box-shadow đã được xử lý bởi Card
              ),
              border: TableBorder.all(
                color: AppTheme.tableBorderColor, // Viền cho bảng
                width: 1,
              ),
              // Màu nền cho hàng header (tùy chỉnh trong AppTheme)
              headingRowColor: MaterialStateProperty.resolveWith(
                  (states) => AppTheme.brandDark), // Màu nền cho header bảng
              dataRowColor: MaterialStateProperty.resolveWith<Color?>(
                (Set<MaterialState> states) {
                  // Màu nền cho hàng lẻ và hàng chẵn
                  if (rows.indexOf(rows.firstWhere(
                              (element) => element == states.first.data)) %
                          2 ==
                      0) {
                    // Đây là một cách phức tạp để kiểm tra chỉ số hàng
                    return AppTheme
                        .backgroundLight; // Hàng chẵn (index 0, 2...)
                  }
                  return AppTheme.brandLight; // Hàng lẻ (index 1, 3...)
                },
              ),
              showCheckboxColumn: false, // Tắt cột checkbox nếu không dùng

              columns: columns.map((col) {
                return DataColumn(
                  label: Expanded(
                    // Expanded để tiêu đề cột có thể chiếm đủ không gian
                    child: Text(
                      col,
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: AppTheme.brandLight, // Màu chữ brand-light
                      ),
                      textAlign: TextAlign.center, // Căn giữa tiêu đề cột
                    ),
                  ),
                );
              }).toList(),
              rows: rows.map((rowContent) {
                int rowIndex = rows.indexOf(rowContent);
                return DataRow(
                  // Thêm hiệu ứng hover cho các hàng
                  color: MaterialStateProperty.resolveWith<Color?>(
                    (Set<MaterialState> states) {
                      if (states.contains(MaterialState.hovered)) {
                        return AppTheme
                            .tableHoverColor; // Màu nền khi di chuột qua hàng
                      }
                      // Màu nền hàng lẻ/chẵn đã được định nghĩa ở trên
                      return (rowIndex % 2 == 0)
                          ? AppTheme.backgroundLight
                          : AppTheme.brandLight;
                    },
                  ),
                  cells: rowContent.map((cellWidget) {
                    return DataCell(
                      cellWidget,
                      onTap:
                          onRowTap != null ? () => onRowTap!(rowIndex) : null,
                    );
                  }).toList(),
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

// Ví dụ cách sử dụng icon action trong bảng
class TableActionIcons extends StatelessWidget {
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const TableActionIcons({
    super.key,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisAlignment:
          MainAxisAlignment.center, // Căn giữa các icon trong cột Action
      mainAxisSize: MainAxisSize.min, // Giúp Row chỉ chiếm đủ không gian
      children: [
        InkWell(
          onTap: onEdit,
          borderRadius:
              BorderRadius.circular(4), // Tạo hiệu ứng bo tròn khi nhấn
          child: Padding(
            padding: const EdgeInsets.all(4.0), // Padding cho vùng chạm
            child: Icon(
              Icons.edit,
              size: 18,
              color: theme.iconTheme.color, // Sử dụng màu icon từ theme
            ),
          ),
        ),
        const SizedBox(width: 6), // margin: 0 6px
        InkWell(
          onTap: onDelete,
          borderRadius: BorderRadius.circular(4),
          child: Padding(
            padding: const EdgeInsets.all(4.0),
            child: Icon(
              Icons.delete,
              size: 18,
              color: theme.iconTheme.color,
            ),
          ),
        ),
      ],
    );
  }
}

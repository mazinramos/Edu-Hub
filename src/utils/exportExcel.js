import * as XLSX from 'xlsx'

/**
 * يصدّر مصفوفة كائنات كملف Excel (.xlsx) وينزّله على جهاز المستخدم.
 * sheets: [{ name: 'الطلاب', rows: [{...}, {...}] }, ...]
 */
export function exportToExcel(sheets, filename = 'report.xlsx') {
  const workbook = XLSX.utils.book_new()
  sheets.forEach(({ name, rows }) => {
    const sheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, sheet, name.slice(0, 31))
  })
  XLSX.writeFile(workbook, filename)
}

//generateExcel.js
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export async function generateExcel(data, issuesDetails, budget) {
    const wsData = data.map((d, index) => {
        const issueDetails = issuesDetails[index];
        let timeSpent = d.timeSpentSeconds / 3600;

        if (issueDetails.fields.issuetype.name === 'Solicitação de Melhoria') {
            timeSpent *= 1.5;
        }

        return {
            'Orçamento Mensal': budget,
            'Issue Type': issueDetails.fields.issuetype.name,
            'Issue Key': issueDetails.key,
            'Summary': issueDetails.fields.summary,
            'Worklog Description': d.description,
            'Data': d.startDate,
            'Time Spent (hours)': timeSpent
        };
    });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const binary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i) & 0xFF;
    }

    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}

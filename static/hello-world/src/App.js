import React, { useState, useContext } from 'react';
import { invoke } from '@forge/bridge';
import PesquisaCliente from './Componentes/PesquisaCliente';
import SelectedKeyContext from './Componentes/SelectedKeyContext';
import DatePickerDropdown from './Componentes/DatePickerDropdown';
import TabelaPage from './Componentes/TabelaPage';
import Modal from './Componentes/Modal';
import { generateExcel } from './Excel/generateExcel';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tabelaData, setTabelaData] = useState([]);
    const [showRelatorio, setShowRelatorio] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { selectedKey } = useContext(SelectedKeyContext);

    const handleSosClick = () => {
        setShowRelatorio(!showRelatorio);
        setShowDatePicker(false);
    };

    const handleRelatorioClick = () => {
        setShowDatePicker(true);
    };

    const handleGenerateReport = async (startDate, endDate) => {
        console.log('Gerar relatório para:', startDate, endDate);
        console.log('Buscando para a key:', selectedKey.key);

        if (!selectedKey) {
            console.error('selectedKey é null ou undefined');
            return;
        }

        try {
            const worklogs = await invoke('fetchWorklogs', { accountKey: selectedKey.key, startDate, endDate });
            console.log(worklogs);

            const issuesDetails = await Promise.all(
                worklogs.map(async (worklog) => {
                    const issueId = worklog.issue.id;
                    console.log(`Buscando detalhes para issueId: ${issueId}`);
                    return await invoke('fetchIssueDetails', { issueId });
                })
            );
            console.log(issuesDetails);

            const budget = 2000;
            const blob = await generateExcel(worklogs, issuesDetails, budget);

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Relatorio.xlsx';
            link.click();
        } catch (error) {
            console.error('Erro ao gerar relatório', error);
        }
    };

    const handleVisualizar = async (monthlyBudget, startDate, endDate) => {
        try {
            const worklogs = await invoke('fetchWorklogs', { accountKey: selectedKey.key, startDate, endDate });
            const issuesDetails = await Promise.all(
                worklogs.map(async (worklog) => {
                    const issueId = worklog.issue.id;
                    return await invoke('fetchIssueDetails', { issueId });
                })
            );

            const budget = monthlyBudget;
            const wsData = worklogs.map((d, index) => {
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

            setTabelaData(wsData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar dados para visualizar', error);
        }
    };


    return (
        <div className="container">
            <h1 className='Title'>Simple WMS</h1>
            {isModalOpen ? (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <TabelaPage dados={tabelaData} />
                </Modal>
            ) : (
                <>
                    <PesquisaCliente />
                    <div className='Categorias'>
                        <div className='categoria'>
                            <span id='SOS' onClick={handleSosClick}>Simples SOS</span>
                            <div className='list-hidden' style={{ display: showRelatorio ? 'block' : 'none' }}>
                                <ul>
                                    {showRelatorio && (
                                        <li id='SOS_relatorio' onClick={handleRelatorioClick}>Relatório de horas</li>
                                    )}
                                </ul>
                            </div>
                            {showDatePicker && (
                                <DatePickerDropdown
                                    onGenerate={handleGenerateReport}
                                    onVisualizar={(startDate, endDate) => handleVisualizar(selectedKey.budget, startDate, endDate)}
                                />
                            )}
                        </div>
                        <div className='categoria'>
                            <span>Projetos Estruturantes</span>
                        </div>
                        <div className='categoria'>
                            <span>Outros</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;

const TabelaPage = ({ dados }) => {
    const totalHorasRegistradas = dados.reduce((total, linha) => total + linha['Time Spent (hours)'], 0);

    const orcamentoMensal = dados.length > 0 ? dados[0]['Orçamento Mensal'] : 0;
    const orcamentoRestante = orcamentoMensal - totalHorasRegistradas;

    return (
        <>
            <div className="tabela-page">
                <h1>
                    Simple SOS
                    <span style={{ float: 'right' }}>
                        Orçamento Mensal: {orcamentoMensal}
                    </span>
                </h1>
                <table>
                    <thead>
                        <tr>
                            <th>Issue Type</th>
                            <th>Issue Key</th>
                            <th>Summary</th>
                            <th>Descrição</th>
                            <th>Data</th>
                            <th>Horas registradas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((linha, index) => (
                            <tr key={index}>
                                <td>{linha['Issue Type']}</td>
                                <td>{linha['Issue Key']}</td>
                                <td>{linha['Summary']}</td>
                                <td>{linha['Worklog Description']}</td>
                                <td>{linha['Data']}</td>
                                <td>{linha['Time Spent (hours)']}</td>
                            </tr>
                        ))}
                        <tr className="total-horas">
                            <td colSpan={5}>Total Horas Registradas</td>
                            <td>{totalHorasRegistradas}</td>
                        </tr>
                        <tr className="orcamento-restante">
                            <td colSpan={5}>Orçamento Restante</td>
                            <td>{orcamentoRestante}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TabelaPage;

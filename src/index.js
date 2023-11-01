import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('fetchClientes', async (req) => {
    const url = 'https://api.tempo.io/4/accounts';

    console.log(`Chamando a URL: ${url}`);

    try {
        const response = await api.fetch(url, {
            headers: {
                Authorization: 'Bearer XXXXXXXXXXXXXXXXXXXXXXX'
            }
        });

        const data = await response.json();
        const accountsByClient = data.results.reduce((acc, account) => {
            const name = account.customer?.name;
            if (name) {
                acc[name] = acc[name] || [];
                acc[name].push(account);
            }
            return acc;
        }, {});
        const uniqueData = Object.entries(accountsByClient)
            .map(([name, accounts]) => ({ name, accounts }))
            .filter(data => data.name);

        return uniqueData;
    } catch (error) {
        console.error('Erro ao buscar clientes', error);
        return [];
    }
});

resolver.define('fetchWorklogs', async (req) => {
    const { accountKey, startDate, endDate } = req.payload;
    const url = `https://api.tempo.io/4/worklogs/account/${accountKey}?from=${startDate}&to=${endDate}`;

    console.log(`Chamando a URL: ${url}`);

    const response = await api.fetch(url, {
        headers: {
            'Authorization': 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxx',
        }
    });

    if (!response.ok) {
        console.error(`Erro ao buscar registros de trabalho: ${response.status} ${response.statusText}`);
        return {};
    }
    const data = await response.json();
    return data.results;
});

resolver.define('fetchIssueDetails', async (req) => {
    const { issueId } = req.payload;
    const url = `https://simplewms.atlassian.net/rest/api/2/issue/${issueId}`;

    console.log(`Chamando a URL: ${url}`);

    const response = await api.fetch(url, {
        headers: {
            'Authorization': 'Basic xxxxxxxxxxxxxxxxxxxx',
        }
    });

    if (!response.ok) {
        console.error(`Erro ao buscar detalhes da issue: ${response.status} ${response.statusText}`);
        return null;
    }

    const data = await response.json();
    return data;
});

export const handler = resolver.getDefinitions();

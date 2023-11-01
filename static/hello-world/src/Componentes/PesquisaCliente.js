import React, { useState, useEffect, useContext } from 'react';
import { invoke } from '@forge/bridge';
import { SelectedKeyContext } from './SelectedKeyContext';

const PesquisaCliente = () => {
    const [nomeCliente, setNomeCliente] = useState('');
    const [clientes, setClientes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const { setSelectedKey } = useContext(SelectedKeyContext);

    useEffect(() => {
        if (nomeCliente) {
            invoke('fetchClientes', { nomeCliente })
                .then(data => setClientes(data))
                .catch(error => console.error('Erro ao buscar clientes', error));

            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [nomeCliente]);

    const handleChange = (event) => {
        setNomeCliente(event.target.value);
    }

    const handleClienteMouseDown = async (cliente) => {
        setNomeCliente(cliente.name);
        setShowDropdown(false);

        const sosKey = cliente.accounts.find(c => c.key.startsWith('SOS'));

        const selectedKey = sosKey ? sosKey.key : 'NSOS';

        const monthlyBudget = sosKey ? sosKey.monthlyBudget : 0;

        setSelectedKey({ key: selectedKey, budget: monthlyBudget });
        console.log('Chave selecionada:', selectedKey);
        console.log('Orçamento mensal selecionado:', monthlyBudget);
    }

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.name.toLowerCase().includes(nomeCliente.toLowerCase())
    );

    return (
        <div className='containerInput'>
            <input
                type='text'
                placeholder='Digite um nome de cliente'
                value={nomeCliente}
                onChange={handleChange}
                onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && (
                <div className="dropdown">
                    <ul>
                        {clientesFiltrados.map((cliente, index) => (
                            <li key={index} onMouseDown={() => handleClienteMouseDown(cliente)}>
                                {cliente.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PesquisaCliente;

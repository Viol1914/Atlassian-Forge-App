import { createContext, useState, useContext } from 'react';

export const SelectedKeyContext = createContext({
    selectedKey: null,
    setSelectedKey: () => { },
});

export const SelectedKeyProvider = ({ children }) => {
    const [selectedKey, setSelectedKey] = useState(null);
    return (
        <SelectedKeyContext.Provider value={{ selectedKey, setSelectedKey }}>
            {children}
        </SelectedKeyContext.Provider>
    );
}

export const useSelectedKey = () => {
    const context = useContext(SelectedKeyContext);
    if (!context) {
        throw new Error('useSelectedKey must be used within a SelectedKeyProvider');
    }
    return context;
}

export default SelectedKeyContext;

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type DialogMode = 'signin' | 'signup';

interface DialogContextType {
  openDialog: (mode: DialogMode) => void;
  closeDialog: () => void;
  isOpen: boolean;
  mode: DialogMode;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>('signin');

  const openDialog = useCallback((newMode: DialogMode) => {
    setMode(newMode);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, isOpen, mode }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};


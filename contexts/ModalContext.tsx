import React, { createContext, useState, useRef, useContext } from "react";
import BottomSheet from "reanimated-bottom-sheet";

interface ModalContextType {
  handleOpenModal: (content: React.ReactNode) => void;
  handleCloseModal: () => void;
  setSnapPoints: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}

export const ModalContext = createContext<ModalContextType>({
  handleOpenModal: () => {},
  handleCloseModal: () => {},
  setSnapPoints: () => {},
});

export const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }: any) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>([
    "80%",
    "20%",
    "0",
  ]);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenModal = (content: React.ReactNode) => {
    setModalContent(content);
    bottomSheetRef.current?.snapTo(0);
  };

  const handleCloseModal = () => {
    bottomSheetRef.current?.snapTo(2);
  };

  const renderContent = () => <>{modalContent}</>;

  return (
    <ModalContext.Provider
      value={{ handleOpenModal, handleCloseModal, setSnapPoints }}
    >
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        renderContent={renderContent}
        initialSnap={2}
        borderRadius={15}
        onCloseEnd={() => setModalContent(null)}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;

import React, { createContext, useState, useRef, useContext } from "react";
import BottomSheet from "reanimated-bottom-sheet";

interface ModalContextType {
  handleOpenModal: (
    content: React.ReactNode,
    snapPoints?: (string | number)[]
  ) => void;
  handleCloseModal: () => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export const ModalContext = createContext<ModalContextType>({
  handleOpenModal: () => {},
  handleCloseModal: () => {},
  bottomSheetRef: { current: null },
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

  const handleOpenModal = (
    content: React.ReactNode,
    snapPoints?: (string | number)[]
  ) => {
    if (snapPoints) {
      setSnapPoints(snapPoints);
    }
    setModalContent(content);
    bottomSheetRef.current?.snapTo(0);
  };

  const handleCloseModal = () => {
    bottomSheetRef.current?.snapTo(2);
  };

  const renderContent = () => <>{modalContent}</>;

  return (
    <ModalContext.Provider
      value={{ handleOpenModal, handleCloseModal, bottomSheetRef }}
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

import { useEffect, useState } from "react";

export function useBeforeUnload() {
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Show save modal
      setShowSaveModal(true);
      
      // Show browser's default dialog
      event.preventDefault();
      event.returnValue = "You have unsaved progress. Would you like to save your progress before leaving?";
      return event.returnValue;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowSaveModal(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { showSaveModal, setShowSaveModal };
}
import { MethodType, requester } from "api/common";
import { createContext, useContext, useState } from "react";

interface ARState {
  marker: any;
  model: any;
}
interface ARActions {
  handleSetMarker(marker: any): void;
  handleSetModel(model: any): void;
  getResourceLocalUrl(model: any, returnBuffer?: boolean): Promise<string>;
}
const initialState: ARState = {
  marker: null,
  model: null,
};
const ARState = createContext<ARState>(initialState);
const ARActions = createContext<ARActions>({} as ARActions);

const ARProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState<ARState>(initialState);
  const handleSetMarker = (marker: any) => {
    setState((prevState) => ({ ...prevState, marker }));
  };
  const handleSetModel = (model: any) => {
    setState((prevState) => ({ ...prevState, model }));
  };
  const getResourceLocalUrl = async (path: any, returnBuffer: boolean = false) => {
    const res = await requester({ path, methodType: MethodType.GET }, { responseType: returnBuffer ? "arraybuffer" : "blob" });
    if (returnBuffer) return Buffer.from(res.data, "binary") as any;
    return window.URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));
  };

  return (
    <ARState.Provider value={state}>
      <ARActions.Provider value={{ handleSetMarker, handleSetModel, getResourceLocalUrl }}>{children}</ARActions.Provider>
    </ARState.Provider>
  );
};
const useARState = () => {
  const context = useContext(ARState);
  if (context === undefined) {
    throw new Error("useARState must be used within a ARProvider");
  }
  return context;
};
const useARActions = () => {
  const context = useContext(ARActions);
  if (context === undefined) {
    throw new Error("useARActions must be used within a ARProvider");
  }
  return context;
};

export { ARProvider, useARState, useARActions };

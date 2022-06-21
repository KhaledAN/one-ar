import { ImageTracker, ZapparCamera, ZapparCanvas } from "@zappar/zappar-react-three-fiber";
import Model from "components/AR/Model";
import ModelSelection from "components/Fragments/ModelSelection";
import { useARState } from "providers/ARProvider";
import React, { Suspense } from "react";

const MarkerPage = () => {
  const { marker, model } = useARState();
  const [isMarkerVisible, setIsMarkerVisible] = React.useState(false);
  if (!marker) return null;
  return (
    <>
      <ModelSelection />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <ZapparCanvas>
          {/* @ts-ignore */}
          <ZapparCamera />
          <Suspense>
            {/* @ts-ignore */}
            <ImageTracker
              visible={isMarkerVisible}
              onVisible={() => setIsMarkerVisible(true)}
              onNotVisible={() => setIsMarkerVisible(false)}
              targetImage={marker}
            >
              {model && isMarkerVisible && <Model src={model} />}{" "}
            </ImageTracker>
          </Suspense>
        </ZapparCanvas>
      </div>
    </>
  );
};
export default MarkerPage;

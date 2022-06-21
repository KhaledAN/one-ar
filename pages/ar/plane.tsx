// eslint-disable react-hooks/exhaustive-deps
import { Button, Typography } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { ARCanvas, DefaultXRControllers, useHitTest } from "@react-three/xr";
import Model from "components/AR/Model";
import ModelOptions from "components/Fragments/ModelOptions";
import ModelSelection from "components/Fragments/ModelSelection";
import type { NextPage } from "next";
import { useARState } from "providers/ARProvider";
import { Suspense, useEffect, useRef, useState } from "react";
import { Matrix4, Quaternion } from "three";

const HitTest: React.FC<any> = ({ model, isRunning, setIsRunning }) => {
  const ref = useRef<any>();
  const [placedObjects, setPlacedObjects] = useState<{ matrix: Matrix4; model: string }[]>([]);
  const [rotation, setRotation] = useState(0);
  useHitTest((hitMatrix) => {
    if (!isRunning) setIsRunning(true);
    if (model && ref.current) {
      const [x, y, z] = ref.current.rotation;
      hitMatrix.decompose(ref.current.position, new Quaternion(x, y, z + rotation), ref.current.scale);
    }
  });
  useEffect(() => () => setIsRunning(false), []);

  useEffect(() => {
    document?.getElementById("rotateLeft")?.addEventListener("click", () => {
      setRotation(rotation + Math.PI / 2);
    });
    document?.getElementById("rotateRight")?.addEventListener("click", () => {
      setRotation(rotation - Math.PI / 2);
    });
  }, [ref.current]);

  useEffect(() => {
    document?.getElementById("placeBtn")?.addEventListener("click", () => {
      setPlacedObjects([...placedObjects, { matrix: ref.current.matrix.clone(), model }]);
    });
  }, [placedObjects, ref.current, model]);
  if (!model) return null;
  return (
    <Suspense>
      <>
        <Model src={model} containerRef={ref} />
        {placedObjects.map((object, i) => (
          <Model key={i} src={object.model} matrix={object.matrix} />
        ))}
      </>
    </Suspense>
  );
};

const PlanePage: NextPage = ({}) => {
  const { model } = useARState();
  const [isRunning, setIsRunning] = useState(false);
  const [domOverlay, setDomOverlay] = useState(null);
  useEffect(() => {
    setDomOverlay({
      root: document.getElementById("content"),
    } as any);
  }, [isRunning]);
  return (
    <>
      <div id="content" style={{ display: isRunning ? "block" : "none" }}>
        {!model && (
          <Typography sx={{ position: "absolute", left: "50%", bottom: "50%", transform: "translate(-50%,50%)", color: "#fff", zIndex: 5000000 }}>
            Select a model to start
          </Typography>
        )}
        <ModelSelection />
        <Button id="placeBtn" sx={{ position: "absolute", bottom: 100, left: "50%", transform: "translate(-50%,50%)" }}>
          Place
        </Button>
        <ModelOptions />
      </div>
      <ARCanvas sessionInit={{ requiredFeatures: ["hit-test"], optionalFeatures: ["dom-overlay"], domOverlay }}>
        <ambientLight />
        <directionalLight position={[-20, 10, -20]} />
        <HitTest isRunning={isRunning} setIsRunning={setIsRunning} model={model} />
        <OrbitControls />
        <DefaultXRControllers />
      </ARCanvas>
    </>
  );
};

export default PlanePage;

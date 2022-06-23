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
import { Matrix4 } from "three";

const HitTest: React.FC<any> = ({ model, options, isRunning, setIsRunning }) => {
  const ref = useRef<any>();
  const [placedObjects, setPlacedObjects] = useState<{ matrix: Matrix4; model: string }[]>([]);
  useHitTest((hitMatrix) => {
    if (!isRunning) setIsRunning(true);
    if (model && ref.current) {
      hitMatrix.decompose(ref.current.position, ref.current.rotation, ref.current.scale);
      ref.current.scale.fromArray([options.scale, options.scale, options.scale]);
      if (options.rotation) {
        const planeIndex = ref.current.rotation.toArray().findIndex((v: number) => v != 0);
        const axes = ["x", "y", "z", "w"];
        for (let i = 0; i < 4; i++) {
          if (i == planeIndex) axes[i] = options.rotation;
          else axes[i] = ref.current.rotation[axes[i]];
        }
        ref.current.rotation.set(...axes);
      }
    }
  });
  useEffect(() => () => setIsRunning(false), []);

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
  const [options, setOptions] = useState({ rotation: 0, scale: 1 });
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
        <ModelOptions {...{ options, setOptions }} />
      </div>
      <ARCanvas sessionInit={{ requiredFeatures: ["hit-test"], optionalFeatures: ["dom-overlay"], domOverlay }}>
        <ambientLight />
        <directionalLight position={[-20, 10, -20]} />
        <HitTest options={options} isRunning={isRunning} setIsRunning={setIsRunning} model={model} />
        <OrbitControls />
        <DefaultXRControllers />
      </ARCanvas>
    </>
  );
};

export default PlanePage;

import { useGLTF } from "@react-three/drei";
import { Interactive, RayGrab } from "@react-three/xr";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Matrix4 } from "three";

interface ModelProps {
  src: string;
  [key: string]: any;
}
const Model: React.FC<ModelProps> = ({ src, ...props }) => {
  const gltf = useGLTF(src);
  const sceneMatrix = useMemo<Matrix4>(() => props.matrix, [props.matrix]);
  const copiedScene = useMemo(() => gltf.scene.clone(), [gltf]);
  const [isControlsEnabled, setIsControlsEnabled] = useState(false);

  useEffect(() => {
    if (sceneMatrix) copiedScene.applyMatrix4(props.matrix);
  }, [sceneMatrix]);
  const Wrapper = sceneMatrix ? RayGrab : Fragment;
  return (
    <Wrapper>
      <Interactive onSelect={() => setIsControlsEnabled(!isControlsEnabled)}>
        <primitive ref={props.containerRef} object={copiedScene} />
      </Interactive>
    </Wrapper>
  );
};

export default Model;

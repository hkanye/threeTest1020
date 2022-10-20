import * as THREE from "three"
import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useFrame, useThree } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import "./styles.css"

function Model(props) {
  const gltf = useLoader(GLTFLoader, "/simple-model.gltf")
  const { camera: defaultCamera, setDefaultCamera } = useThree()
  const mixer = useMemo(() => new THREE.AnimationMixer(), [])
  const camera = useRef()
  const group = useRef()
  // Update animation mixer every frame
  useFrame((state, delta) => mixer.update(delta))
  // Set default cam, collect actions and play them on mount
  useEffect(() => {
    setDefaultCamera(camera.current)
    const actions = { CameraAction: mixer.clipAction(gltf.animations[0], group.current) }
    actions.CameraAction.play()
    // Uncache animations and set back the original cam on unmount
    return () => {
      setDefaultCamera(defaultCamera)
      gltf.animations.forEach(clip => mixer.uncacheClip(clip))
    }
  }, [])

  return (
    <group ref={group} {...props}>
      <scene name="Scene">
        <object3D
          name="Light"
          position={[4.076245307922363, 5.903861999511719, -1.0054539442062378]}
          rotation={[1.8901259643076738, 0.8805683470227423, -2.045215994363619]}
        >
          <pointLight name="Light_Orientation" rotation={[-1.5707962925663537, 0, 0]} />
        </object3D>
        <object3D
          name="Camera"
          position={[7.358891487121582, 4.958309173583984, 6.925790786743164]}
          rotation={[1.2420707302048006, 0.32996876609352715, -0.7597118623571987]}
        >
          <perspectiveCamera ref={camera} name="Camera_Orientation" rotation={[-1.5707962925663537, 0, 0]} />
        </object3D>
        <mesh name="Cube">
          <bufferGeometry attach="geometry" {...gltf.__$[5].geometry} />
          <meshStandardMaterial attach="material" {...gltf.__$[5].material} name="Material" />
        </mesh>
      </scene>
    </group>
  )
}

function Castle() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  )
}

ReactDOM.render(<Castle />, document.getElementById("root"))

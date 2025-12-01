import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export function useFBX(path: string) {
  return useLoader(FBXLoader, path);
}

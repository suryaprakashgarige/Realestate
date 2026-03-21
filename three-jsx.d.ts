import { ThreeElement } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElement<any> {}
  }
}

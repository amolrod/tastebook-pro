/**
 * Configuración global de Framer Motion
 * Permite desactivar animaciones en desarrollo para mejor performance
 */

// Detectar si estamos en desarrollo
const isDev = import.meta.env.DEV;

// Flag para desactivar animaciones en desarrollo (cambiar a true si tu Mac va lento)
const DISABLE_ANIMATIONS_IN_DEV = false;

/**
 * Indica si las animaciones deben estar activas
 */
export const shouldAnimate = !isDev || !DISABLE_ANIMATIONS_IN_DEV;

/**
 * Variantes de animación optimizadas
 * Usa estas en lugar de valores inline para mejor performance
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Transiciones optimizadas
 */
export const fastTransition = { duration: 0.2 };
export const normalTransition = { duration: 0.3 };
export const slowTransition = { duration: 0.5 };

/**
 * Helper para crear props de motion condicionales
 * Si las animaciones están desactivadas, devuelve props vacías
 */
export function motionProps(props: Record<string, any>) {
  if (!shouldAnimate) {
    return {};
  }
  return props;
}

/**
 * Configuración de AnimatePresence
 */
export const animatePresenceProps = {
  mode: 'wait' as const,
  initial: shouldAnimate,
};

/**
 * Ejemplo de uso:
 * 
 * import { motionProps, slideUpVariants, normalTransition } from '@/utils/motionConfig';
 * 
 * <motion.div
 *   {...motionProps({
 *     variants: slideUpVariants,
 *     initial: "hidden",
 *     animate: "visible",
 *     transition: normalTransition
 *   })}
 * >
 *   Contenido
 * </motion.div>
 */

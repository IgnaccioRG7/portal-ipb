import { router } from '@inertiajs/react'

let _isNavigatingAway = false

// Escuchar finish de Inertia a nivel global, una sola vez
// No depende del ciclo de vida de ningún componente
router.on('finish', () => {
  if (_isNavigatingAway) {
    _isNavigatingAway = false
  }
})

export const navigationGuard = {
  get isNavigatingAway() {
    return _isNavigatingAway
  },
  setNavigatingAway(val: boolean) {
    _isNavigatingAway = val
  }
}
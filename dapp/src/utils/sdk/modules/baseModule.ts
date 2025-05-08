import { ModuleType } from "./moduleType"

export interface BaseModule {
  type: ModuleType
  enabled: boolean
  validate: () => boolean
}
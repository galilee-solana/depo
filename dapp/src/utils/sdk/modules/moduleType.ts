export enum ModuleType {
  Timelock = 'Timelock',
  TargetAmount = 'TargetAmount',
  MinimumAmount = 'MinimumAmount',
}

export interface Module {
  type: ModuleType;
  enabled: boolean;
}

export interface TimelockModule extends Module {
  type: ModuleType.Timelock;
  releaseAfter: string; // timestamp
}

export interface MinimumAmountModule extends Module {
  type: ModuleType.MinimumAmount;
  amount: string; // Decimal as string
}

export interface TargetAmountModule extends Module {
  type: ModuleType.TargetAmount;
  amount: string; // Decimal as string
}

export type AnyModule = TimelockModule | MinimumAmountModule | TargetAmountModule;
// Add more modules as you implement them
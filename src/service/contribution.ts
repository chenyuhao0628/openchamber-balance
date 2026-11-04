import type { Balance, UsageWindow } from '../shared/types.ts';

export type Contribution = {
  configured?: boolean;
  plan?: string | null;
  balance?: Balance | null;
  detail?: string | null;
  windows?: UsageWindow[];
};

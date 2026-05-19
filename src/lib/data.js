import config from '../../config.yaml';

export const BINS             = config.bins;
export const BIN_ITEMS        = config.bin_items;
export const CONNECTIONS_GROUPS = config.connections_groups;
export const ORDER_STEPS      = config.order_steps;
export const BIN_SORT_TIME    = config.settings.bin_sort_time;
export const SECRET_CODE      = config.secret.unlock_code;

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

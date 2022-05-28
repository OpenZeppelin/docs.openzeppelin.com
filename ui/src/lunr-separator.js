import { separator } from '../../lunr-tokenizer.js';

import { onLoad } from './utils/on-load';

onLoad(() => {
  if (globalThis.lunr) {
    globalThis.lunr.tokenizer.separator = separator;
  }
});

import { onLoad } from './utils/on-load';
import hljs from 'highlight.js/lib/core';

import markdown from 'highlight.js/lib/languages/markdown';
hljs.registerLanguage('markdown', markdown);

import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);

import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);

import diff from 'highlight.js/lib/languages/diff';
hljs.registerLanguage('diff', diff);

import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sh', shell);

import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);

import hljsDefineSolidity from 'highlightjs-solidity';
hljsDefineSolidity(hljs);

onLoad(hljs.highlightAll);

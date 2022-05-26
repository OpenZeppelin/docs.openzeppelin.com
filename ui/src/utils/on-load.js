export function onLoad(fn) {
  if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

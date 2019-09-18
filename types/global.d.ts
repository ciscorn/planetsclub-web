import 'node'

declare global {
  type GlobalFetch = WindowOrWorkerGlobalScope
  interface Window {
    FB: any
    // adsbygoogle: Array<any>
    // googletag: any
    // gapi: any
  }
}

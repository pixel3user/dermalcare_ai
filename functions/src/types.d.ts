/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@genkit-ai/firebase/functions" {
  export function onFlowRequest(flow: any): any;
}

declare module "@gradio/client" {
  export const Client: any;
  // eslint-disable-next-line camelcase
  export const handle_file: any;
}


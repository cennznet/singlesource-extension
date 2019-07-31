import { PortStreams } from "../streams";

export const getPageInfoFromRouter = (router: PortStreams, origin: string): string => {
  const stream = router.streams.find(stream => stream.port.name === origin);
  if (!stream) throw new Error(`Stream ${origin} not found`);

  return new URL(stream.port.sender.url).hostname;
}
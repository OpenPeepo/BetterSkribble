// TODO: Add actual API to run backend on. Use socket.IO and the next.js API routing.

import { IncomingMessage, ServerResponse } from "http";

let t = 1;

export default (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode= 200;
    res.end("" + t++);
};
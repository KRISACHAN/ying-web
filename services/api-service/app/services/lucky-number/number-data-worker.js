import { parentPort, workerData } from 'node:worker_threads';

import { parseNumberData } from './number-data-parser';

parseNumberData(workerData.buffer, workerData.options).then(result => {
    parentPort.postMessage(result);
});

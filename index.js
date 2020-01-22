
import { getTrackInfo, addOrUpdateData, lastEntries } from './src/handleData';
import { createTable } from './db/create';

(async () => {
    // createTable();
    const data = await getTrackInfo('RP877761813CN')
    console.log(data);
    addOrUpdateData({ userId: 1, trackingNumber: 'RP877761813CN', data })
    // lastEntries();
    console.log('da')

})()
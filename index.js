
import { getTrackInfo, deleteData } from './src/handleData';
import Bot from './src/tgBot';
// initialize mongoose
import _DB from './db';

// init process vars
require('dotenv').config();

(async () => {
    // const data = await getTrackInfo('RG910688822BE')
   
    // console.log(data);
    // const rs = await deleteData({ userId: 2, trackingNumber: 'RG910688822BE' });
    // console.log(rs);

    Bot.init();

})()
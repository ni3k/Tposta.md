import mongose from 'mongoose';
import trackSchema from '../schemas/tracks';

const Track = mongose.model('Track', trackSchema);

export default Track;

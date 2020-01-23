import trackSchema from '../schemas/tracks'
import mongose from 'mongoose';

const Track = mongose.model('Track', trackSchema);

export default Track;
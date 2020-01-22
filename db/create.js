import DB from './index';

export const createTable = () => {
    DB.run('CREATE TABLE TRACKS("user_id" INTEGER, trackingNumber varchar(256), "trackinfo" nvarchar(1000), "id" INTEGER PRIMARY KEY AUTOINCREMENT)', (err) => {
        console.log(err);
    });

    DB.close();
}
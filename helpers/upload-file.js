const path = require('path');

const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

    return new Promise((resolve, reject) => {

        const { archive } = files;

        const nameSplit = archive.name.split('.');
        const extension = nameSplit[nameSplit.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(`Invalid extension. Valid extensions are: ${validExtensions}`);
        }

        const fileNameTemp = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', folder, fileNameTemp);

        archive.mv(uploadPath, err => {
            if (err) {
                return reject(err);
            }

            return resolve( fileNameTemp );
        });
    });
}

module.exports = {
    uploadFile
}

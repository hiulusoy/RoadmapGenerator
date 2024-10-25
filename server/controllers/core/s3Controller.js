const S3Service = require('../../service/s3Service');

class S3Controller {
    constructor() {
        this.s3Service = new S3Service();
    }

    uploadImage = async (req, res) => {
        try {
            const fileName = req.file.filename; // Assuming file is attached in 'file' field
            const imageUrl = await this.s3Service.uploadImage(fileName);
            return res.json({
                imageUrl
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    deleteImage = async (req, res) => {
        try {
            const fileName = req.params.fileName;
            await this.s3Service.deleteFile(fileName);
            return res.json({
                message: 'File successfully deleted from S3'
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getImageUrl = async (req, res) => {
        try {
            const fileName = req.params.fileName;
            const imageUrl = await this.s3Service.getImageUrl(fileName);
            return res.json({
                imageUrl
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = new S3Controller();
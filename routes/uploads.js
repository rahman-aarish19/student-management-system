const express = require('express');;
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    SaveImage
} = require('../models/upload');

// Setting the storage engine.
const storage = multer.diskStorage({
    destination: './public/uploads/files/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initializing the upload.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000000
    },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('importcsv');

// Check file type.
function checkFileType(file, callback) {
    // Allowed extensions.
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension.
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type.
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Images only.');
    }
}

router.get('/', async (req, res) => {
    const images = await SaveImage.find();

    if (images) {
        res.render('upload', {
            title: 'Uploaded Images',
            breadcrumbs: true,
            images: images
        });
    } else {
        res.render('upload', {
            title: 'Uploaded Images',
            breadcrumbs: true
        });
    }
});

router.delete('/:id', async (req, res) => {
    const result = await SaveImage.findByIdAndRemove({
        _id: req.params.id
    });

    if (result) {
        console.log(result);
        fs.unlinkSync(result.path);
        req.flash('success_msg', 'Image deleted successfully.');
        res.redirect('/uploads');
    } else {
        req.flash('error_msg', 'Error occured.');
        res.redirect('/uploads');
    }
});

router.post('/import-csv', async (req, res) => {
    /*console.log(req.file);
    fs.unlinkSync(req.file.path);*/

    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            res.redirect('/students');
        } else {
            if (req.file == undefined) {
                console.log('No file selected');
                res.redirect('/students');
            } else {
                console.log('File uploaded successfully.');

                const img = new SaveImage({
                    filename: req.file.filename,
                    path: req.file.path,
                    caption: req.body.imgCaption
                });

                const result = await img.save();

                if (result) {
                    req.flash('success_msg', 'Image saved successfully.');
                    res.redirect('/uploads');
                }

                req.flash('error_msg', 'Error uploading image.');
                res.redirect('/students');
            }
        }
    });
});

module.exports = router;
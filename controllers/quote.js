const Sauce = require('../models/Quote');
const fs = require('fs');
const { urlToHttpOptions } = require('url');

//genration de l'url de l'image pour multer
const generateImgUrl = (req) => {
    return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
}

//recuperation de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

//récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

//création d'une sauce
exports.postOneSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        likes : 0, 
        dislikes : 0,
        usersLiked: [], 
        usersDisliked : [],
        imageUrl : generateImgUrl(req)
    });
    sauce.save()
        .then(() => res.status(201).json({ message : 'Sauce ajoutée avec succès !'}))
        .catch(error => res.status(400).json({error}));
};

//modification d'une sauce
exports.modifyOneSauce = (req, res, next) => {

    Sauce.findOne({_id : req.params.id})
    .then( sauce => {
        if(!sauce) {
            return res.status(404).json({
                error : (new Error('Sauce introuvable !')).message
            });
        }
        if (sauce.userId !== req.auth.userId) {
            return res.status(403).json({
                error : (new Error('unauthorized request')).message
            });
        }

        const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl :  generateImgUrl(req)
        } : { ...req.body };

        Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id : req.params.id})
            .then(() => res.status(200).json({ message : 'Sauce modifiée avec succès !'}))
            .catch(error => res.status(400).json({error}));
    })
    .catch( error => res.status(500).json({error}));
};

//Supression d'une sauce
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
        .then( sauce => {
            if(!sauce) {
                return res.status(404).json({
                    error : (new Error('Sauce introuvable !')).message
                });
            }
            if (sauce.userId !== req.auth.userId) { //verification que l'utilisateur qui supprime est bien le propriétaire de la sauce
                return res.status(403).json({
                    error : (new Error('unauthorized request')).message
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id : req.params.id})
                .then(() => res.status(200).json({message : 'Sauce supprimée avec succès !'}))
                .catch(error => res.status(500).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}))
};

//like dislike sauces
exports.like = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
        .then( sauce => {
            if(!sauce) {
                return res.status(404).json({
                    error : (new Error('sauce introuvable !')).message
                })
            }
            if(req.body.like === 0) {
                if(sauce.usersLiked.indexOf(req.auth.userId) !== -1) {
                    sauce.likes--
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.auth.userId),1)
                    console.log(sauce)
                }
                if(sauce.usersDisliked.indexOf(req.auth.userId) !== -1) {
                    sauce.dislikes--
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.auth.userId),1)
                }
            }
            if(req.body.like === -1 && sauce.usersDisliked.indexOf(req.auth.userId) === -1 && sauce.usersLiked.indexOf(req.auth.userId) === -1) {
                sauce.dislikes++
                sauce.usersDisliked.push(req.auth.userId)
            }
            if(req.body.like === 1 && sauce.usersLiked.indexOf(req.auth.userId) === -1 && sauce.usersDisliked.indexOf(req.auth.userId) === -1) {
                sauce.likes++
                sauce.usersLiked.push(req.auth.userId)
                // console.log(sauce)
            }
            Sauce.updateOne({_id : req.params.id}, {likes : sauce.likes, usersLiked : sauce.usersLiked, dislikes : sauce.dislikes, usersDisliked : sauce.usersDisliked})
                .then(() => res.status(200).json({message : 'Like / Dislike mis à jour !'}))
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
}
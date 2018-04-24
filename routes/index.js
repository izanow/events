const express = require('express');
const router = express.Router();
const Event = require('../models/event-user').Events;

router.get('/', ensureAuthenticated, function(req, res){
    const scripts = [{script: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.6/angular.min.js'}, {script: 'app.controller.js'}, {script: 'js/date.js'}];
    res.render('index', {scripts: scripts});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/users/login');
    }
}

router.route('/page/:currentPage')
    .get(async (req, res) => {
        console.log(req);
        console.log(req.user);
        const page = req.params.currentPage;
        const events = await Event.findAll({
            order: [['id']],
            offset: (page - 1) * 10,
            limit: 10,
            where: {user_id: req.user.id}
        });
        res.json(events);
    });

router.route('/numberOfRows')
    .get(async (req, res) => {
        const count = await Event.count();
        res.json(count);
    });

router.route('/events')
    .post(async (req, res) => {
        req.body.user_id = req.user.id;
        const event = new Event(req.body);
        await event.save();
        res.json(event);
    });

router.route('/events/:eventId')
    .get(async (req, res) => {
        const event = await Event.findById(Number(req.params.eventId));
        res.json(event);
    })
    .delete(async (req, res) => {
        const result = await Event.destroy({
            where: {
                id: req.params.eventId,
                user_id: req.user.id
            }
        });
        res.json({
            message: "Event succesfully deleted!",
            result
        });
    })
    .put(async (req, res) => {
        const event = await Event.findById(req.params.eventId);
        event.name = req.body.name;
        event.description = req.body.description;
        event.start_date = req.body.start_date;
        event.end_date = req.body.end_date;
        event.people = req.body.people;
        event.price = req.body.price;
        event.user_id = req.user.id;
        await event.save();
        res.json(event);
    });

router.route('/search/:eventIdToSearch')
    .get(async (req, res) => {
        const event = await Event.findById(Number(req.params.eventIdToSearch));
        res.json(event);
    });

module.exports = router;
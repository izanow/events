const Event = require('../models/event-user');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);

it('should GET all events', async () => {
    const event = new Event({name: "newEvent"});
    await event.save();
    const res = await chai.request(server)
        .get('/page/1');

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('array');
    expect(res.body[0]).to.have.property('name');
    expect(res.body[0]).to.have.property('description');
    expect(res.body[0]).to.have.property('start_date');
    expect(res.body[0]).to.have.property('end_date');
    expect(res.body[0]).to.have.property('people');
    expect(res.body[0]).to.have.property('price');
});

it('should GET number of all events', async () => {
    const res = await chai.request(server)
        .get('/numberOfRows');

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('number');
});

it('should POST a event', async () => {
    const res = await chai.request(server)
        .post('/events')
        .send({
            'name': 'postedEvent',
            'description': 'postedEventDescription'
        });

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('name');
    expect(res.body).to.have.property('description');
    expect(res.body).to.have.property('start_date');
    expect(res.body).to.have.property('end_date');
    expect(res.body).to.have.property('people');
    expect(res.body).to.have.property('price');
    expect(res.body.name).to.eq('postedEvent');
    expect(res.body.description).to.eq('postedEventDescription');
});

it('should GET a event by the given id', async () => {
    const event = new Event({name: "newEvent"});
    await event.save();
    const res = await chai.request(server)
        .get('/events/' + event.id);

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('name');
    expect(res.body).to.have.property('description');
    expect(res.body).to.have.property('start_date');
    expect(res.body).to.have.property('end_date');
    expect(res.body).to.have.property('people');
    expect(res.body).to.have.property('price');
});

it('should DELETE a event given the id', async () => {
    const event = new Event({name: "newEvent"});
    await event.save();
    const res = await chai.request(server)
        .delete('/events/' + event.id);

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message').eq('Event succesfully deleted!');

});

it('should UPDATE a event given the id', async () => {
    const event = new Event({name: "newEvent", description: "newDescription"});
    await event.save();
    const res = await chai.request(server)
        .put('/events/' + event.id)
        .send({description: "editedDescription"});

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('description');
    expect(res.body.description).to.eq('editedDescription');
});

it('should SEARCH a event by the given id', async () => {
    const event = new Event({name: "searchedEvent"});
    await event.save();
    const res = await chai.request(server)
        .get('/events/' + event.id);

    expect(res.status).to.eq(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('name');
    expect(res.body).to.have.property('description');
    expect(res.body).to.have.property('start_date');
    expect(res.body).to.have.property('end_date');
    expect(res.body).to.have.property('people');
    expect(res.body).to.have.property('price');
    expect(res.body.name).to.eq('searchedEvent');
});
const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const application = res.body[0];
                expect(application).to.include.all.keys('Rating', 'App', 'Reviews', 'Genres', 'Installs');
            });
    });
    it('should be 400 error if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'MISTAKE'})
            .expect(400, 'Sort must be either rating or app');
    });
    it('should be 400 error if genre filter is not one of the selectable options', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: 'Sports'})
            .expect(400, 'Genre must be one of either Action, Puzzle, Strategy, Casual, Arcade, or Card');
    });
    it('should sort by App name if selected', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'App'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length -1) {
                    const appAtI = res.body[i];
                    const appAtIPlusOne = res.body[i + 1];
                    if (appAtIPlusOne.App < appAtI.App) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
    it('should sort by Rating in descending order if selected', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: "Rating"})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlusOne = res.body[i + 1];
                    if (appAtIPlusOne.Rating > appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
    it('should filter out non-applicable apps when using the genre filter', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: "Action"})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filtered = true;
                let i = 0;
                while (i < res.body.length) {
                    const appGenre = res.body[i].Genres;
                    if (!appGenre.includes('Action')) {
                        filtered = false;
                        break;
                    }
                    i++;
                }
                expect(filtered).to.be.true;
            })
        
    })
});
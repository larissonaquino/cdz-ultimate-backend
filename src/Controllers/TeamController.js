const Team = require('../Models/Team.model')

module.exports = {
    async index(req, res) {
        const team = await Team.find().sort('_id')
        return res.json(team);
    },

    async register(req, res) {
        const { username, job, description, image } = req.body
        let team = await Team.findOne({ username })
        
        if (!team) {
            team = await Team.create({
                username,
                job,
                description,
                image
            })
            .catch(e => {
                console.error('error in register a team member', e)
                return res.sendStatus(500)
            })
        }
        else return res.sendStatus(422)
        
        return res.json(user)
    }
}
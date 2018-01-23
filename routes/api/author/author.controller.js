'use strict';


// Get all Authors
exports.getAuthors = (req, res) => {
	Author.find({}).exec((err, authors) => {
		if(err)
			return res.send(500, {message: err.message});
		if(!authors)
			return res.send(404, {message: 'Authors not found'});
		return res.send(200, authors);
	});
};

// Get one author
exports.getAuthorById = (req, res) => {
	let id = req.params.id;
	Author.findOne({_id: id}).exec((err, author) => {
		if(err)
			return res.send(500, {message: err.message});
		if(!author)
			return res.send(404, {message: 'Author not found'});
		return res.send(200, author);
	});
};

// Create new author
exports.newAuthor = (req, res) => {
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;

	if(!firstName || !lastName)
		return res.send(402, {message: 'First name and Last name are required.'});
	let dateOfBirth = req.body.date_of_birth || Date();
	let created = req.body.created || '';
	let about = req.body.about || '';

	let author = new Author({
		first_name: firstName,
		last_name: lastName,
		date_of_birth: dateOfBirth,
		created: created,
		about: about
	});

	author.save((err, author) => {
		if(err)
			return res.send(500, {message: err.message});
		return res.send(200, author);
	});
};

// Update author
exports.updateAuthor = (req, res) => {
	let id = req.params.id;

	Author.findOne({_id: id}).exec((err, author) => {
		if(err)
			return res.send(500, {message: err.message});
		if(!author)
			return res.send(404, {message: 'Author not found'});
		author.first_name = req.body.first_name || author.first_name;
		author.last_name = req.body.last_name || author.last_name;
		author.date_of_birth = req.body.date_of_birth || author.date_of_birth;
		author.created = req.body.created || author.created;
		author.about = req.body.about || author.about;

		author.save((err, author) => {
			if(err)
				return res.send(500, {message: err.message});
			res.send(200, author);
		});
	});
};

// Delete author
exports.deleteAuthor = (req, res) => {
	let id = req.params.id;

	Author.remove({_id: id}).exec((err, author) => {
		if(err)
			return res.send(500, {message: err.message});
		if(!author)
			return res.send(404, {message: 'Author not found'});
		return res.send(200, author);
	});
};

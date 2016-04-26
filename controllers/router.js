var models = require('../models/models');

module.exports = {
	index : function ( req, res, next ){
		var user_id = req.cookies ?
		req.cookies.user_id : undefined;

		Todo.
		find({ user_id : user_id }).
		sort( '-updated_at' ).
		exec( function ( err, todos ){
		  if( err ) return next( err );

		  res.render( 'index', {
			  title : 'Express Todo Example',
			  todos : todos
		  });
		});
	};

	create : function ( req, res, next ){
	  new Todo({
		  user_id    : req.cookies.user_id,
		  content    : req.body.content,
		  updated_at : Date.now()
	  }).save( function ( err, todo, count ){
		if( err ) return next( err );

		res.redirect( '/' );
	  });
	};

	destroy : function ( req, res, next ){
	  Todo.findById( req.params.id, function ( err, todo ){
		var user_id = req.cookies ?
		  req.cookies.user_id : undefined;

		if( todo.user_id !== user_id ){
		  return utils.forbidden( res );
		}

		todo.remove( function ( err, todo ){
		  if( err ) return next( err );

		  res.redirect( '/' );
		});
	  });
	};

	edit : function( req, res, next ){
	  var user_id = req.cookies ?
		  req.cookies.user_id : undefined;

	  Todo.
		find({ user_id : user_id }).
		sort( '-updated_at' ).
		exec( function ( err, todos ){
		  if( err ) return next( err );

		  res.render( 'edit', {
			title   : 'Express Todo Example',
			todos   : todos,
			current : req.params.id
		  });
		});
	};

	update : function( req, res, next ){
	  Todo.findById( req.params.id, function ( err, todo ){
		var user_id = req.cookies ?
		  req.cookies.user_id : undefined;

		if( todo.user_id !== user_id ){
		  return utils.forbidden( res );
		}

		todo.content    = req.body.content;
		todo.updated_at = Date.now();
		todo.save( function ( err, todo, count ){
		  if( err ) return next( err );

		  res.redirect( '/' );
		});
	  });
	};

	// ** express turns the cookie key to lowercase **
	current_user : function ( req, res, next ){
	  var user_id = req.cookies ?
		  req.cookies.user_id : undefined;

	  if( !user_id ){
		res.cookie( 'user_id', utils.uid( 32 ));
	  }

	  next();
	};
};

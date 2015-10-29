Parse.initialize('tg9Ax8JRS0DdO7e9IHPLyIw2M9fz2Txs5TPjl2q4','p4A5EfNznc5jdR991CmU8mvXkNCMAitLny0CD1eL');

var Review = Parse.Object.extend('Review');
var INITIAL_COUNT = 0;
var THUMBS_UP = 'fa fa-thumbs-up clickable';
var THUMBS_DOWN = 'fa fa-thumbs-down clickable';


//Resets the form, once it has been submitted
var reset_form = function(){
	$('#title').val('');
	$('#body').val('');
	$('#star').raty({
		half:true
	});

	$('#reviewArea').empty();
}

//Launches the query to get reviews from the Parse database
var loadReviews = function(){
	var query = new Parse.Query(Review);

	query.notEqualTo('body','');

	query.find({
		success:buildReview
	});
}

//builds the list of reviews from the Parse database
var buildReview = function(data){
	$('#reviewArea').empty();
	var total_score = 0;

	data.forEach(function(d){
		total_score += d.get('score');
		addReview(d);
	});

	var average = total_score/data.length;
	$('#average').raty({
		score:average,
		half:true,
		readOnly:true
	});

}

//Adds reviews individually to the review area
var addReview = function(item){
	var reviewBox = $('<div></div>').addClass('reviewContainer');
	var title = $('<h4></h4>').text(item.get('title'));
	var body = $('<p></p>').text(item.get('body'));
	var star_rating = $('<div></div>').raty({
		score:item.get('score'),
		half:true,
		readOnly:true
	});

	var num_helpful = item.get('help_count');
	var count = item.get('total_count');
	//var date = item.get('createdAt'); Look at later?

	//var date_p = $('<text></text>').text("created on " + date);
	var help_p = $('<text></text>').text(num_helpful + " out of " + count + " found this review helpful.");

	var helpful_icon = $('<i></i>').addClass(THUMBS_UP);
	helpful_icon.click(function(d) {
		item.increment('help_count');
		item.increment('total_count');
		item.save();
		loadReviews();
	})

	var unhelpful_icon = $('<i></i>').addClass(THUMBS_DOWN);
	unhelpful_icon.click(function(d) {
		item.increment('total_count');
		item.save();
		loadReviews();
	})

	var delete_icon = $('<span></span>').addClass('glyphicon glyphicon-remove-sign clickable');
	delete_icon.click(function(){
		item.destroy({
			success:loadReviews
		})
	});

	reviewBox.append(delete_icon);
	reviewBox.append(title);
	reviewBox.append(helpful_icon);
	reviewBox.append(unhelpful_icon);
	reviewBox.append(star_rating);
	//reviewBox.append(date_p);
	reviewBox.append(body);
	reviewBox.append(help_p);
		

	$('#reviewArea').append(reviewBox);
}



//Sets up the page
$(document).ready(function(){
	$('#star').raty({
		half:true
	});


	//Create an average review rate and insert here.

	//WHen the page loads, get all previous review and load them
	loadReviews();


	//When the user submits the form, create a new review and add it to Parse
	$('form').submit(function(){

		var review = new Review();

		var score = parseInt($('#star').raty('score'));
		var title = $('#title').val();
		var body = $('#body').val()

		//Make sure the user enters a valid score;
		if(isNaN(score)) {
			score = 0;
		}
		review.set('title', title);
		review.set('body', body);
		review.set('score', score);
		review.set('help_count', INITIAL_COUNT);
		review.set('total_count', INITIAL_COUNT);

		reset_form()

		review.save();

		loadReviews();

		return false;
	})

})






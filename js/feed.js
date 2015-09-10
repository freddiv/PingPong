function refresh(listEl, lastID, limit,feed, interval ) {

     	var listEl  = listEl || $('#tweets-list'),
     	    html = ''; 
	// get the latest ID and limit, or set default 
     	 
		lastID = lastID || "",
        limit = limit || 20,
        feed = feed || "http://api.massrelevance.com/MassRelDemo/kindle.json",
        interval = interval || 30,
        feedUrl = feed + '?limit=' + limit + '&since_id=' + lastID;

	// the URL now passes the limit and lastID back to the server/API 

	$.ajax({
		  url: feedUrl, 
          success: function(data) {
				for (var i=0,  tot=data.length; i < tot; i++) {
				  var tweet = data[i];
				  
				  if(lastID === ""){
					  html = html + '<blockquote class="twitter-tweet">' + tweet.text + '<p>Tweeted by: ' + tweet.user.name + '</p><p>' + tweet.created_at + '</p></blockquote>';
					// update list with original feed return 
						if( html.length ) listEl.html( html ); 
				  }
					else{
					listEl.prepend('<blockquote class="twitter-tweet">' + tweet.text + '<p>Tweeted by: ' + tweet.user.name + '</p><p>' + tweet.created_at + '</p></blockquote>');		
	                }
				}

	        // remove any tweets from the list over the limit
	        listEl.find('blockquote').slice(limit).remove();
	        // update last id with value back from server/API 
			lastID =  (data && data.length) ? data[0].entity_id : lastID

			
            // poll the feed with parameters 
			setTimeout( function(){ refresh( listEl,lastID,limit,feed,interval ); }, interval*1000 );   

		}
	});

}
$(function(){
	 // start the loop 
	 refresh(); 
});


$(function(){
	 // start the loop 
	 refresh($('#tweets-list2'),'' ,20, 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json'); 
});
	
	

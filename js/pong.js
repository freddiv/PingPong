var wins ={
		"Mark":0,
		"Dr. Claw": 0,
		"O-Ren Ishii":0
},
competitorElements = $("div#competitors").find("div.competitor"),
tourneyWinner=0,
winner = '',
counter = 0;


function tournament(playersArray) {
	var index, 
	len,
	idx,
	len2,
	players = playersArray,
	newArray = [],
	playByPlay = $("ul#playByPlay");
	
	for (index = 0, len = players.length; index < len; ++index) {
		var competitor = players[index],
		competitorEl = $(competitorElements[index]);
		competitorEl.find('h2').html(competitor.name);
		competitorEl.find('p').html(competitor.notes);
		if(index > 0){
			game(players[0],0,competitor,index,playByPlay)
		}
	   
	}
	//last two players have to face each other
	newArray =  [playersArray[1],playersArray[2]];
	// next loop goes here
	for (idx = 0, len2 = newArray.length; idx < len2; ++idx) {
		var competitor = newArray[idx],
		competitorEl = $(competitorElements[idx+1]);
		
		if(idx > 0){
			game(newArray[0],0,competitor,idx,playByPlay)
		}
	   
	}
	$.each(wins, function(key, value) {
		if(value > tourneyWinner){
			tourneyWinner=value;
			winner = counter;
		}
		 $(competitorElements[counter]).append('<blockquote>' + value + ' Wins </blockquote>');
	    counter ++
	});
	if(tourneyWinner > 1){
	$(competitorElements[winner]).find('h2').addClass('winner');	
	//$(competitorElements).find('blockquote').append(" Tournament is a tie");
	}
	else{
		$(competitorElements).find('blockquote').append(" Tournament is a tie");	
	}
     	
}

function game(player1,player1Index, player2,player2Index ,playByPlay) {

 	var player1  = player1,
 	player2 = player2,
 	player1Index  = player1Index,
 	player2Index = player2Index,
 	won = 11,
 	playByPlay = playByPlay;
 	
 	player1Score = 0,
 	player2Score = 0,
 	player1Name = player1.name,
 	player2Name = player2.name,

 	service = 0,
 	server = 1;
 	
 	playString = '<li class="point">' + player1.name + ' is playing ' + player2.name + '</li>';
 	playByPlay.append(playString);

 	while (player1Score < won && player2Score < won) {
	 	if(server===1){
	 		serve(player1, player2,playByPlay)
	 	}	
	 	else{
	 		serve(player2, player1,playByPlay)
	 	}

	    service += 1;
	
	    if(service % 2 == 0){
	    	service = 0;
	    	if(server===1){
	     		server = 2;
	     	}
	    	else server = 1;	
	    }
 	}
 	
}

function serve(fromPlayer, toPlayer, playByPlay) {
	var server = fromPlayer,
	returner = toPlayer;
	serviceString =  '<li>' + server.name + ' serves to ' + returner.name + '...';
	
	if(server.serve_accuracy >= getRandom(1,100)){
		serviceString += ' in bounds</li>';
		playByPlay.append(serviceString);
		volley(returner, server, playByPlay);
	}
	else{
		serviceString += ' out of bounds</li>';
		playByPlay.append(serviceString);
		
		playByPlay.append('<li class="point">' + returner.name + ' gets a point!</li>');
		if(returner.name == player1Name){
			player1Score = player1Score + 1;
			if(player1Score >= 11){		
				wins[player1Name] ++
				playByPlay.append('<li class="game">' + returner.name + ' wins the game!</li>');		 		
		 	}			
		}
		else if(returner.name == player2Name){
			player2Score = player2Score + 1;
			if(player2Score >= 11){
				wins[player2Name] ++
		 		playByPlay.append('<li class="game">' + returner.name + ' wins the game!</li>');
		 	}
		}
	}
}

function volley(fromPlayer, toPlayer,playByPlay) {
	var  returner = fromPlayer,
	 server = toPlayer; 
	
	volleyString = '<li>' + returner.name ;
	if(returner.return_skill >= getRandom(1,100) && returner.return_accuracy >= getRandom(1,100)){
		volleyString += ' returns to ' + server.name + '... in bounds</li>';
		playByPlay.append(volleyString);
		 setTimeout(volley(server,returner,playByPlay ), 200);
		    return false;
		//volley(returner, server);
	}
	else{
		volleyString += ' fails to return</li>';
		playByPlay.append(volleyString);
		playByPlay.append( '<li class="point">' +server.name + ' gets a point!</li>');
		if(server.name == player1Name){
			player1Score = player1Score + 1;
			if(player1Score >= 11){
				wins[player1Name] ++ ;
		 		playByPlay.append('<li class="game">' +server.name + ' wins the game!</li>');
		 	}
			
		}
		else if(server.name == player2Name){
			player2Score = player2Score + 1;
			if(player2Score >= 11){
				wins[player2Name] ++ ;
				playByPlay.append('<li class="game">' +server.name + ' wins the game!</li>');
		 	}
			
		}
	}

}


function getRandom(startValue, endValue) {
    var iChoices = endValue - startValue + 1;
    return Math.floor(Math.random() * iChoices + startValue);
}


$(function(){
	 // start the game
	var feed = "competitors.json",
 	feedUrl = feed,
 	players = [];
 		
	$.when( $.ajax({url:feedUrl, method: "GET"}) ).then(function( data, textStatus, jqXHR ) {
				  players = data;
				  tournament(players);
		});	  
	
});

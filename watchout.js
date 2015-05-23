var width = 900;
var height = 600;
var numAsteroids = 50;

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, width]),
  y: d3.scale.linear().domain([0, 100]).range([0, height])
};

var gameboard = d3.select("body").selectAll(".scoreboard").append("svg")
                                 .attr("width", width)
                                 .attr("height", height)
                                 .style("border", "1px solid black")
                                 .classed("gameboard", true);

//  set enemies
var createAsteroids = function(n){

  var asteroids = [];
  for(var i = 0; i < n; i++){
    asteroids.push({
      id: i,
      x: Math.random()*100,
      y: Math.random()*100
    });
  }
  return asteroids;
};

//  render the gameboard
var boardRenderer = function(a){
  var asteroid = gameboard.selectAll('circle.asteroid').data(a, function(e){
    return e.id;
  });

  asteroid.enter()
    .append('svg:circle')
      .attr('cx', function(asteroid){
        return axes.x(asteroid.x);
      })
      .attr('cy', function(asteroid) {
        return axes.y(asteroid.y)
      })
      .attr('r', 25)
      .attr('fill', 'green')
      .attr('stroke', 'blue');

  asteroid.exit().remove();

  var checkCollision = function(asteroid, collidedCallback){
    _.each(asteroids, function(asteroid){
      radiusSum =  parseFloat(asteroid.attr('r')) + player.r;
      xDiff = parseFloat(asteroid.attr('cx')) - player.x;
      yDiff = parseFloat(asteroid.attr('cy')) - player.y;

      separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) )
      if (separation < radiusSum){
        collidedCallback(player, asteroid);
      }
    });
      
  }

  var Player = function () {
    gameboard.append('svg:circle')
      .attr('cx', board.width / 2)
      .attr('cy', board.height / 2)
      .attr('r', 17)
      .attr('fill', 'red')
      .call(d3.behavior.drag()
        .on('drag', function(d) {
          moveObject.call(this);
    }));
  };

  var tweenWithCollisionDetection = function(endData){
    var endPosition, asteroidNextPosition, startPosition;

    asteroid = d3.select(this);

    startPosition = {
      x: parseFloat(asteroid.attr('cx')),
      y: parseFloat(asteroid.attr('cy'))
    };

    endPosition = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return function(t) {
      return checkCollision(asteroid);
    
      var asteroidNextPosition;
      asteroidNextPosition = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return asteroid.attr('cx', asteroidNextPosition.x).attr('cy', asteroidNextPosition.y);
    };
  };
  return asteroid.transition().duration(500).attr('r', 25).transition().duration(2000).tween('custom', tweenWithCollisionDetection);  
  asteroid.exit().remove();
};

//  play game woot woot
play = function() {
  var turn;
  turn = function() {
    var newAsteroidPositions = createAsteroids(numAsteroids);
    return boardRenderer(newAsteroidPositions);
  };

  turn();
  // return setInterval(turn, 1000);
};

play();




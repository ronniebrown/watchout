// start slingin' some d3 here.
var gameboard = d3.select("body").append("svg")
                                 .attr("width", 900)
                                 .attr("height", 600)
                                 .style("border", "1px solid black");

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, 900]),
  y: d3.scale.linear().domain([0, 100]).range([0, 600])
};


//  set enemies
var createAsteroids = function(n){
  var asteroids = [];
  for(var i = 0; i < n; i++){
    asteroids.push({
      id: i,
      x: Math.random()*500,
      y: Math.random()*200
    });
  }
  return asteroids;
};




//  render the gameboard
//  add tween/collision detection
//  play game woot woot

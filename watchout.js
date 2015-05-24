// start slingin' some d3 here.
var height = 600;
var width = 1000;
var nEnemies = 15;

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, width]),
  y: d3.scale.linear().domain([0, 100]).range([0, height])
};

var gameBoard = d3.select('.board').append('svg:svg')
  .attr('width', width)
  .attr('height', height)
  .classed('gameboard', true);

var drag = d3.behavior.drag()  
             .on('dragstart', function() { player.style('opacity', '0.4'); })
             .on('drag', function() { player.attr('cx', d3.event.x)
                                            .attr('cy', d3.event.y); })
             .on('dragend', function() { player.style('opacity', '1.0'); });

var player = gameBoard.selectAll('.draggableplayer')  
                .data([{ x: (width / 2), y: (height / 2), r: 12 }])
                .enter()
                .append('svg:circle')
                .attr('class', 'draggableplayer')
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('r', function(d) { return d.r; })
                .call(drag)
                .style('fill', 'green');

var createEnemies = function(n) {
  var enemies = [];
  for (var i = 0; i < n; i++) {
    enemies.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return enemies;
};

var render = function(enemyData) {
  var enemies = gameBoard.selectAll('circle.enemy').data(enemyData, function(d) {
    return d.id;
  });

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy) {
      return axes.x(enemy.x);
    })
    .attr('cy', function(enemy) {
      return axes.y(enemy.y);
    })
    .attr('r', 15)
    .attr('fill', 'white')
    .attr('stroke', 'blue');

  enemies.exit().remove();

  var checkCollision = function(enemy, player, collidedCallback) {
  
    var radiusSum, separation, xDiff, yDiff;
    _.each(player, function() {
    radiusSum = parseFloat(enemy.attr('r')) + player.r;
    xDiff = parseFloat(enemy.attr('cx')) - player.x;
    yDiff = parseFloat(enemy.attr('cy')) - player.y;
    separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (separation < radiusSum) {
      return collidedCallback(player, enemy);
    };
  });
  };

  var onCollision = function(){
    numenemies = 1;
    enemies.transition()
      .attr('oppacity', '0.4')
      .transition()
      .attr('oppacity', '1');
  }

  var tweenWithCollisionDetection = function(endData) {
    var endPos, enemy, startPos;
    enemy = d3.select(this);
    startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };
    endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };
    return function(t) {
      checkCollision(enemy, onCollision);
      var enemyNextPos;
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };
  enemies.transition().duration(300).attr('r', 15).transition().duration(800).tween('custom', tweenWithCollisionDetection);
};

play = function() {
  var turn;
  turn = function() {
    var newEnemyPositions = createEnemies(nEnemies);
    render(newEnemyPositions);
  };

  turn();
  setInterval(turn, 1000);
};

play();
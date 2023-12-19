// Module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Body = Matter.Body;
    Events = Matter.Events;

// Create an engine
var engine = Engine.create();

// Create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 1800,  // Adjust to fit your screen if necessary
        height: 6000, // Adjust to fit your screen if necessary
        wireframes: false // Set to false to see visual styles
    }
});

// Create the ground body
var ground = Bodies.rectangle(900, 1580, 1800, 20, { 
    isStatic: true, // Make the ground static so it doesn't move
    render: { fillStyle: 'brown' }, // Give it a brown color to look like the floor
    friction: 1.0, // High friction to make the ground sticky
    restitution: 0.0 // Low restitution to reduce bounciness
});


// Add the ground to the world
World.add(engine.world, [ground]);

// Create a static point for the pendulum to hang from
var anchor = { x: 400, y: 800 };

// Create a circle to represent the anchor point
var anchorCircle = Bodies.circle(anchor.x, anchor.y, 7, {
    isStatic: true,
    render: { fillStyle: 'black' },
    collisionFilter: { mask: 0x0000 } // This ensures no collision with other bodies
});

// Add the anchor circle to the world
World.add(engine.world, [anchorCircle]);

// Create the first pendulum body (the gymnast's body)
var pendulumBodyA = Bodies.rectangle(400, 300, 20, 140, { 
    density: 0.001, // Adjust density to make the body swing properly
    render: { fillStyle: 'grey' }
});

// Create a circle to represent the gymnast's head
var pendulumHeadA = Bodies.circle(400, 300, 25, {
    density: 0, // Adjust density to make the head swing properly
    render: { fillStyle: 'grey' }
});

// Create a circle to represent the gymnast's head
var pendulumHandsA = Bodies.circle(400, 230, 10, {
    density: 0, // Adjust density to make the head swing properly
    render: { fillStyle: 'grey' }
});


// Combine the head and body into a single compound body
var gymnastA = Body.create({ parts: [pendulumBodyA, pendulumHeadA, pendulumHandsA] });

// Adjust the properties of the compound body if needed
gymnastA.render.fillStyle = 'grey';

// Create the second pendulum body
var pendulumBodyB = Bodies.rectangle(400, 400, 20, 140, {
    density: 0.001, // Adjust density to make the body swing properly
    render: { fillStyle: 'grey' }
});

// Create the first constraint for the pendulum
var constraintA = Constraint.create({
    pointA: anchor,
    bodyB: gymnastA,
    pointB: { x: 0, y: -70 },
    stiffness: 1,
    length: 0 // Non-zero length for visible connection
});

// Create the second constraint connecting both pendulum bodies
var constraintB = Constraint.create({
    bodyA: gymnastA,
    bodyB: pendulumBodyB,
    pointA: { x: 0, y: 70 },
    pointB: { x: 0, y: -70 },
    stiffness: 1,
    length: 0 // Non-zero length for visible connection
});

// Add all of the bodies and constraints to the world
World.add(engine.world, [gymnastA, pendulumBodyB, constraintA, constraintB]);

var collision = false

Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];

        // Check if the collision is between pendulumBodyB and the ground
        if ((pair.bodyA === pendulumBodyB && pair.bodyB === ground) || (pair.bodyA === ground && pair.bodyB === pendulumBodyB)) {
            // Handle the collision
                console.log('pendulumBodyB has collided with the ground');
                // Example action: you can set pendulumBodyB to static or apply other logic
                Body.setStatic(pendulumBodyB, true);
        }

        // Check if the collision is between the anchor and pendulum hands
        if ((pair.bodyA === anchorCircle && pair.bodyB === pendulumHandsA) ||
            (pair.bodyA === pendulumHandsA && pair.bodyB === anchorCircle)) {
            if (collision) {
                console.log('Collision detected between anchor and pendulum hands');
                World.add(engine.world, constraintA);
                anchorCircle.collisionFilter.mask = 0x0000;
                collision = false
            } else {
                collision = true
            }
        }
    }
});


// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

// Keyboard controls
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('right').addEventListener('click', function() {
        Body.applyForce(pendulumBodyB, { x: pendulumBodyB.position.x, y: pendulumBodyB.position.y - 1000 }, { x: 0.02, y: 0 });
    });
    document.getElementById('left').addEventListener('click', function() {
        Body.applyForce(pendulumBodyB, { x: pendulumBodyB.position.x, y: pendulumBodyB.position.y - 1000 }, { x: -0.02, y: 0 });
    });
    document.getElementById('letGo').addEventListener('click', function() {
        World.remove(engine.world, constraintA);
        anchorCircle.collisionFilter.mask = 0xFFFFFFFF;
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'd') {
        // Apply force to the left at the joint between the pendulums
        Body.applyForce(pendulumBodyB, { x: pendulumBodyB.position.x, y: pendulumBodyB.position.y - 1000 }, { x: -0.02, y: 0 });
    } else if (event.key === 'a') {
        // Apply force to the right at the joint between the pendulums
        Body.applyForce(pendulumBodyB, { x: pendulumBodyB.position.x, y: pendulumBodyB.position.y - 1000 }, { x: 0.02, y: 0 });
    } else if (event.key === 's') {
        // Release the gymnast by removing the constraint
        World.remove(engine.world, constraintA);
        anchorCircle.collisionFilter.mask = 0xFFFFFFFF;
    }
});

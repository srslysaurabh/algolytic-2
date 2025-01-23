let nodes = [];
let particles = [];
const NODES_COUNT = 15;
const PARTICLES_COUNT = 50;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('hero-animation');
    
    // Initialize nodes (junctions)
    for(let i = 0; i < NODES_COUNT; i++) {
        nodes.push({
            x: random(width),
            y: random(height),
            connections: []
        });
    }
    
    // Create connections between nodes
    for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
            if(random() < 0.3) { // 30% chance of connection
                nodes[i].connections.push(j);
                nodes[j].connections.push(i);
            }
        }
    }
    
    // Initialize particles
    for(let i = 0; i < PARTICLES_COUNT; i++) {
        particles.push({
            pos: createVector(random(width), random(height)),
            vel: p5.Vector.random2D().mult(2),
            path: []
        });
    }
}

function draw() {
    background(0, 20);
    
    // Draw connections (roads)
    stroke(30, 144, 255, 50);
    strokeWeight(1);
    for(let i = 0; i < nodes.length; i++) {
        for(let connection of nodes[i].connections) {
            line(nodes[i].x, nodes[i].y, 
                 nodes[connection].x, nodes[connection].y);
        }
    }
    
    // Draw nodes (junctions)
    noStroke();
    fill(30, 144, 255, 100);
    for(let node of nodes) {
        circle(node.x, node.y, 8);
    }
    
    // Update and draw particles
    for(let particle of particles) {
        particle.pos.add(particle.vel);
        
        // Wrap around screen
        if(particle.pos.x < 0) particle.pos.x = width;
        if(particle.pos.x > width) particle.pos.x = 0;
        if(particle.pos.y < 0) particle.pos.y = height;
        if(particle.pos.y > height) particle.pos.y = 0;
        
        // Draw particle
        fill(255, 100);
        noStroke();
        circle(particle.pos.x, particle.pos.y, 4);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
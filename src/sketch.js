var settings= {
    time:{
        speed:0.1,
    }
}
var variables = {
    
    color:{
        black:[0,0,0],
        white:[255,255,255],
        wisharedom_dark_mode_bg:[32,32,32],
        red:[255,0,0],
        green:[0,255,0],
        blue:[0,0,255],
        grey:[50,50,50],
        wisharedom_logo_aqua:[72,201,176]
    },
    
    object:{
        size:15,
    },

    gap:30,

    max_particle:5,

    min_particle:0,

    time:{
        current_time:0,
        delta_t:(1/60)*settings.time.speed,
        run_time:100,
    },
    simulation:{
        run:false,
    },
    graph:{
        grid_point_count:20,
        margin:0,
        text_gap:10,
        log_base:10,
    },
    // axes:{
    //     x_axis:{
    //         start_x:20,
    //         start_y:20,
    //         end_x:
    //     }
    // }
}
const logBase = (n, base) => Math.log(n) / Math.log(base)

class grid{
    constructor(x_limit,y_limit,mposx,mposy){

        this.x_limit = x_limit
        this.y_limit = y_limit
        this.mposx = mposx
        this.mposy = mposy
    }
    draw(){
        let sw = $("#simulation").width()
        let sh = $("#simulation").height()

        let gl = [
            stroke(variables.color.grey),
            strokeWeight(1)
            
        ]
        // let xp = this.x_limit/variables.graph.grid_point_count
        // let yp = this.y_limit/variables.graph.grid_point_count
        // for (let i = -this.x_limit*0 + 0; i < this.x_limit*0 + 600; i += xp) {
        //     gl.push(line(i,-sh/2+variables.gap,i,sh/2-variables.gap))
        //     gl.push(text(this.mposx*i/(xp*variables.graph.grid_point_count),i,0))
        // }
        for (let p = -variables.graph.grid_point_count/2+1; p < variables.graph.grid_point_count/2 ; p++) {
            if(p!=0){
                gl.push(fill(variables.color.white))
                let x_pos = this.x_limit*p/variables.graph.grid_point_count
                let y_pos = this.y_limit*p/variables.graph.grid_point_count
    
                let xl = line(x_pos,-sh/2+variables.gap,x_pos,sh/2-variables.gap)
                let yl = line(-sw/2+variables.gap,y_pos,sw/2-variables.gap,y_pos)

                let xt = text(this.mposx*p*2/variables.graph.grid_point_count,this.x_limit*p/variables.graph.grid_point_count,-variables.graph.text_gap)
                let yt = text(-this.mposy*p*2/variables.graph.grid_point_count,variables.graph.text_gap,this.y_limit*p/variables.graph.grid_point_count)
                
                gl.push(xl)
                gl.push(yl)

                

                gl.push(xt)
                gl.push(yt)
            }
        }
        gl.push(stroke(variables.color.white))
        return gl
    }
}
class axes{
    constructor(x_limit,y_limit){
        this.x_limit = x_limit
        this.y_limit = y_limit
    }
    
    draw(){
        let sw = $("#simulation").width()
        let sh = $("#simulation").height()
        let grid_ = new grid(sw-variables.gap,sh-variables.gap,this.x_limit,this.y_limit)
        return [
            strokeWeight(1),
            line(-sw/2+variables.gap,0,sw/2-variables.gap,0), //x-axis
            line(0,-sh/2+variables.gap,0,sh/2-variables.gap), // y-axis
            
            grid_.draw()
            // line(sw,20,sw,sh-variables.gap),

            // line(20,(sh-variables.gap),sw-variables.gap,(sh-variables.gap))
        ]
    }
}
class pointParticle{
    constructor(position,vel,acc,display_size){
        this.position = position
        this.display_position = {x:this.position.x,y:this.position.y}
        this.vel = vel
        this.display_vel = {x:this.vel.x,y:this.vel.y}
        this.acc = acc
        this.display_size = display_size
        this.grab = true
    }
    draw(){
        
        return [ellipseMode(CENTER),
            stroke(variables.color.red),
            fill(variables.color.red),
            ellipse(this.display_position.x,-this.display_position.y,this.display_size),
            // line(0,0,this.display_position.x,-this.display_position.y),
            stroke(variables.color.wisharedom_logo_aqua),
            line(this.display_position.x,-this.display_position.y,this.display_position.x+this.display_vel.x,-this.display_position.y-this.display_vel.y),
            // stroke(variables.color.blue),
            // line(this.display_position.x,-this.display_position.y,this.display_position.x+this.acc.x,-this.display_position.y+this.acc.y)
        ]
        
    }
    nextPosition(){
        this.vel.x += this.acc.x * variables.time.delta_t
        this.vel.y += this.acc.y * variables.time.delta_t
        this.position.x += this.vel.x * variables.time.delta_t
        this.position.y += this.vel.y * variables.time.delta_t
    }
    // move(){
    //     let sim = $('#simulation')
    //     let right_border = sim.width() - variables.object.size - variables.gap
    //     if(this.position.x <= right_border){

    //         this.position = {x:mouseX,y:mouseY}
    //         console.log(this.position)
    //         console.log([sim.width() - variables.object.size - variables.gap,sim.height()])
    //         if(this.position.x > right_border){
    //             this.position.x = right_border
    //         }
    //     }
    // }
}
let particles = []
let grph_axes = []
let vectors = []
$(document).ready(function(){

    coordsControl()
    velocitiesControl()
    accControl()

    $(document).on('click',"#add-object",function() {
        let x_coord = parseInt($("#x-coord").val())
        let y_coord = parseInt($("#y-coord").val())
        let x_vel = parseInt($("#x-vel").val())
        let y_vel = parseInt($("#y-vel").val())
        let x_acc = parseInt($("#x-acc").val())
        let y_acc = parseInt($("#y-acc").val())

        if (particles.length < variables.max_particle) {
            let particle = addParticle(
                {
                    x:x_coord,
                    y:y_coord
                },
                {
                    x:x_vel,
                    y:y_vel
                },
                {
                    x:x_acc,
                    y:y_acc
                },
            )
            particles.push(particle)
            
        }
        normalizeAll(particles)
    })
    $(document).on('click',"#remove-object",function() {
        // let particle = addParticle({x:60,y:60})
        if(particles.length > variables.min_particle){

            particles.pop()
        }
        normalizeAll(particles)

    })
    $(document).on('click',"#run-simulation",function() {
        if(variables.simulation.run){

            variables.simulation.run = false
            $("#run-simulation").html("run")
        }else{
            variables.simulation.run = true
            $("#run-simulation").html("stop")
        }
        
        // runSimulation(particles)
    })

    $(document).on('change input',"#x-coord",function() {
        $("#x-coord-label").html("x koordinatı: "+$("#x-coord").val())
    })
    $(document).on('change input',"#x-vel",function() {
        
        $("#x-vel-label").html("x hızı: "+$("#x-vel").val())
    })
    $(document).on('change input',"#x-acc",function() {
        
        $("#x-acc-label").html("x ivmesi: "+$("#x-acc").val())
    })
    $(document).on('change input',"#y-coord",function() {
        $("#y-coord-label").html("y koordinatı: "+$("#y-coord").val())
    })
    $(document).on('change input',"#y-vel",function() {
        
        $("#y-vel-label").html("y hızı: "+$("#y-vel").val())
    })
    $(document).on('change input',"#y-acc",function() {
        
        $("#y-acc-label").html("y ivmesi: "+$("#y-acc").val())
    })
    $(document).on('change input',"#sim-speed",function() {
        settings.time.speed = parseInt($("#sim-speed").val())
        variables.time.delta_t = (1/60)*settings.time.speed
        $("#sim-speed-label").html("sim speed: "+$("#sim-speed").val())
    })
})

function setup() {
    let canvas = createCanvas($("#simulation").width(),windowHeight)
    canvas.parent("simulation")
    let g_axes = new axes(20,20)
    grph_axes.push(g_axes)
    displayAll(particles,grph_axes)
    $("body").ready(function(){
        
        
    })
}


function draw() {
    
    translate($("#simulation").width() / 2, $("#simulation").height() / 2)
    background(variables.color.black)
    
    displayAll(particles,grph_axes)
    $("#simulation-time").html(variables.time.current_time.toFixed(2).toString()+"s")
    if(variables.simulation.run){
        
        runSimulation(particles)
        normalizeAll(particles)
        variables.time.current_time += variables.time.delta_t
    }
}
function mousePressed() {
    // checkGrab(particles)
}
function mouseDragged() {
    // moveThis(particles)
}
function windowResized() {
    resizeCanvas($("#simulation").width(),windowHeight)
    coordsControl()
    velocitiesControl()
    accControl()
    normalizeAll(particles)
}
function coordsControl(){
    // $("#x-coord").attr("max",$('#simulation').width()-variables.gap).attr("min",0)
    // $("#y-coord").attr("max",$(window).height()-variables.gap).attr("min",0)
    $("#x-coord").attr("max",100).attr("min",-100)
    $("#y-coord").attr("max",100).attr("min",-100)

    $("#x-coord-label").html("x koordinatı: "+$("#x-coord").val())
    $("#y-coord-label").html("y koordinatı: "+$("#y-coord").val())

    $("#sim-speed").attr("max",60).attr("min",0.1)

    $("#sim-speed-label").html("sim speed: "+$("#sim-speed").val())

}
function velocitiesControl(){
    $("#x-vel").attr("max",100).attr("min",-100)
    $("#y-vel").attr("max",100).attr("min",-100)

    $("#x-vel-label").html("x hızı: "+$("#x-vel").val())
    $("#y-vel-label").html("y hızı: "+$("#y-vel").val())
}

function accControl(){
    
    $("#x-acc").attr("max",10).attr("min",-10)
    $("#y-acc").attr("max",10).attr("min",-10)

    $("#x-acc-label").html("x ivmesi: "+$("#x-acc").val())
    $("#y-acc-label").html("y ivmesi: "+$("#y-acc").val())
}

function addParticle(position,vel,acc){
    return new pointParticle(position,vel,acc,variables.object.size)
}
function displayAll(list,axes_){
    stroke(variables.color.black)
    strokeWeight(1)
    fill(255)
    // vectors = []
    for (let i = 0; i < list.length; i++) {
        list[i].draw()
        // let v = new vector(list[i])
        // v.draw()
        
    }
    
    fill(0)
    stroke(variables.color.green)
    grph_axes[0].draw()
    
}
function runSimulation(list){
    // for (let t = 0; t < variables.time.run_time; t++) {
        for (let i = 0; i < list.length; i++) {
            list[i].nextPosition()
            // console.log(list[i].position)
            normalizeAll(particles)
            $("#object-info").html(list[0].position.x.toFixed(3).toString()+" x pos\n"+list[0].position.y.toFixed(3).toString()+" y pos")
            // $("#object-info").html()
        }
    // }
}
function moveThis(list){
    // for (let i = 0; i < list.length; i++) {
        
    //     if(dist(mouseX,mouseY,list[i].position.x,list[i].position.y) < variables.object.size && list[i].grab==true){
    //         list[i].move()
    //     }
    // } 
}
function checkGrab(list){
    // for (let i = 0; i < list.length; i++) {
    //     if(dist(mouseX,mouseY,list[i].position.x,list[i].position.y) < variables.object.size){
    //         list[i].grab = true
    //     }
    //     // else if(dist(mouseX,mouseY,list[i].position.x,list[i].position.y) < variables.object.size && list[i].grab==false){
    //     //     list[i].grab = true

    //     // }
    // } 
}
function normalizeAll(list) {
    let pos_x = []
    let pos_y = [] 
    let xp,yp
    for (let j = 0; j < list.length; j++) {
        const element = list[j];
        const ex = element.position.x
        const ey = element.position.y
        
        pos_x.push(Math.abs(ex))
        pos_y.push(Math.abs(ey))
    }
    
    if(Math.max(...pos_x) != 0 && pos_x.length > 0){

        // xp = Math.pow(variables.graph.log_base,Math.ceil(logBase(Math.max(...pos_x),variables.graph.log_base))+ variables.graph.margin)
        xp = Math.pow(variables.graph.log_base,Math.ceil(logBase(Math.max(...pos_x),variables.graph.log_base))+1+ variables.graph.margin)
    }else{
        xp = 20
    }
    // if(pos_x.length == 0){

    //     xp = 20
    // }else{
    //     xp = Math.pow(variables.graph.log_base,Math.ceil(logBase(Math.max(...pos_x),variables.graph.log_base))+ variables.graph.margin)
    // }
    if(Math.max(...pos_y) != 0 && pos_y.length >0){
        // yp = Math.pow(variables.graph.log_base,Math.ceil(logBase(Math.max(...pos_y),variables.graph.log_base))+ variables.graph.margin)
        yp = Math.pow(variables.graph.log_base,Math.floor(logBase(Math.max(...pos_y),variables.graph.log_base))+1+ variables.graph.margin)
    }
    else{
        yp = 20
    }
    // if(pos_y.length == 0){
    //     yp = 20
    // }
    // else{
    //     yp = Math.pow(variables.graph.log_base,Math.ceil(logBase(Math.max(...pos_y),variables.graph.log_base))+ variables.graph.margin)
    // }
      
    grph_axes[0].x_limit = xp
    grph_axes[0].y_limit = yp

        for (let i = 0; i < list.length; i++) {
            list[i].display_position.x = list[i].position.x * ($("#simulation").width()-variables.gap)/(2*xp)
            list[i].display_position.y = list[i].position.y * ($("#simulation").height()-variables.gap)/(2*yp)
            list[i].display_vel.x = list[i].vel.x * ($("#simulation").width()-variables.gap)/(2*xp)
            list[i].display_vel.y = list[i].vel.y * ($("#simulation").height()-variables.gap)/(2*yp)
            
        }

}

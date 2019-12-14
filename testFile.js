export default class testFile{
    constructor(){

    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "#ff0";
        ctx.rect(120,50,50,50);
        ctx.fill();
        ctx.closePath();
    }
}

const Equippable = require("../Equippable.js");
module.exports = class Weapon extends Equippable{
    constructor(owner){
        super(owner, "Generic");
        this.collisionStyle = "Stick";
        this.setWeaponPosition({x:0, y:0}, {x:10, y:10});
        this.length = 60;
    }
    setWeaponPosition(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
    }
    setWeaponPositionByAngle(startPoint, angle){
        this.point1 = startPoint;
        this.point2 = {x:startPoint.x + Math.cos(angle) * this.length, y:startPoint.y + Math.sin(angle) * this.length};
    }
}
const Enemy = require("../Enemy.js");

module.exports = class Zombie extends Enemy{
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine,
    objectsToDrawArray,
    zombieLevel
    ){
    super(xPosition, yPosition, size, parentCollisionEngine, objectsToDrawArray);
    switch(zombieLevel){
      default:
        this.health = 50;
        break;
    }
  }
  moveToPlayer() {
    var dx = this.targetPlayer.location.x + this.targetPlayer.size.x - this.location.x - this.size.x;
    var dy = this.targetPlayer.location.y + this.targetPlayer.size.y - this.location.y - this.size.y;
    var distanceMagnitude = Math.sqrt(dx * dx + dy * dy);
    this.location.x += (dx / distanceMagnitude) * this.speed;
    if (!this.quadrent.testMovement(this, true)) {
      this.location.x -= (dx / distanceMagnitude) * this.speed;
    }else{
      this.quadrent.checkEntityImmigration(this);
    }
    this.location.y += (dy / distanceMagnitude) * this.speed;
    if (!this.quadrent.testMovement(this, true)) {
      this.location.y -= (dy / distanceMagnitude) * this.speed;
    }else{
      this.quadrent.checkEntityImmigration(this);
    }
  }
  attackedBy(weaponType, damageAmount, incomingAngle) {
    switch(weaponType){
      case "blunt":
      this.health -= damageAmount;
      break;
      default:
      this.quadrent.respawn(this);
      break;
    }
    this.stunned = true;
    this.stunDuration = 10;
    this.knockbackForce = 10;
    this.knockbackAngle = incomingAngle;
    this.knockbackDuration = 10;
  }
}
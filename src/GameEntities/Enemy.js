const gameEntity = require("../gameEntity.js");
const Projectile = require("./Projectile.js");

module.exports = class Enemy extends gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine,
    objectsToDrawArray
  ) {
    super(
      xPosition,
      yPosition,
      size,
      parentCollisionEngine,
      objectsToDrawArray
    );
    this.health = 50;
    this.baseColor = "#0f0";
    this.collisionStyle = "Circle";
    this.speed = 1;
    //this.targetPlayer = this.findClosestPlayer(playerArray);
  }
  findClosestPlayer() {
    //Simple Version because we really only have one player
    //Will Need to be revised when there are multiple Players
    var nearbyPlayers = [];
    this.quadrent.getReleventPlayers(nearbyPlayers);
    this.targetPlayer = nearbyPlayers[0];
    
  }
  collidedWith(objectHittingMe) {
    super.collidedWith(objectHittingMe);
    if (objectHittingMe instanceof Projectile) {
      this.health -= objectHittingMe.damage;
    }
  }
  update() {
    if (this.health <= 0) {
      this.destroy();
    }
    this.findClosestPlayer();
    this.moveToPlayer();
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

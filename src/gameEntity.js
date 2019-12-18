module.exports = class gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine,
    objectsToDrawArray
  ) {
    //General Stats
    this.health = 100;
    this.maxHealth = 100;
    this.quadrent;
    this.drawnArray = objectsToDrawArray;
    this.collisionEngine = parentCollisionEngine;
    this.location = {
      x: xPosition,
      y: yPosition
    };
    this.size = {
      x: size,
      y: size
    };
    switch (this.type) {
      case "Wall":
        break;
      case "Player":
        break;
      case "Projectile":
        break;
      default:
        this.baseColor = "#f0b";
        break;
    }
  }
  update() {}

  setQuadrent(newQuadrent){
    this.quadrent = newQuadrent;
  }
  getHealthPercentage(){
    return(this.health * 100)/this.maxHealth;
  }
  destroy() {
    this.quadrent.removeEntity(this);
  }
  getCenter(){
    return{x: this.location.x + this.size.x, y: this.location.y + this.size.y}
  }
  collidedWith(objectHittingMe) {}
  draw(ctx) {}
}

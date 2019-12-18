const gameEntity = require("../gameEntity.js");
const Projectile = require("./Projectile.js");

module.exports =  class Wall extends gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine
  ) {
    super(
      xPosition,
      yPosition,
      size,
      parentCollisionEngine
    );
    this.falseWall = false;
    this.durability = 100;
    this.transparent = false;
    this.industructable = false;
    this.baseColor = "#000";
    this.collisionStyle = "Rect";
  }
  update() {
    if (this.health <= 0) {
      this.destroy();
    }
  }
  draw(ctx) {
    this.update();
    ctx.beginPath();
    ctx.fillStyle = this.baseColor;
    ctx.rect(this.location.x, this.location.y, this.size.x, this.size.y);
    ctx.fill();
    ctx.closePath();
  }
  collidedWith(objectHittingMe) {
    super.collidedWith(objectHittingMe);
    if (objectHittingMe instanceof Projectile) {
      if (this.falseWall) {
        this.destroy();
      } else if (this.industructable === false) {
        this.health -= objectHittingMe.damage;
      }
    }
  }
}

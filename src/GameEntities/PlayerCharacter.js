const gameEntity = require("../gameEntity.js");
const Projectile = require("./Projectile.js");
const Weapon = require("../Equippables/Weapon.js")
const playerSize = 40;
module.exports = class Player extends gameEntity {
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
    
    //#region Character Movements
    this.baseSpeed = 2;
    this.movingLeft = false;
    this.movingRight = false;
    this.movingUp = false;
    this.movingDown = false;
    this.crouching = false;
    this.shooting = false;
    this.swingingSword = false;
    this.respawnRequest = false;
    this.respawnCooldown = 0;
    //#endregion
    this.lastDirection = "Right";
    this.baseColor = "#0ff";
    this.collisionStyle = "Circle";
    //#region Sword Variables
    this.swordReach = 1;
    this.swordSwingDuration = 25;
    this.swordSwingCooldown = 50;
    this.currentSwingDuration = this.swordSwingDuration;
    this.currentSwingCooldown = 0;
    this.swingArcAngle = 60/180*Math.PI;
    this.currentSwordAngle = this.swingArcAngle/-2;
    //#endregion
    this.orientationAngle = 0;
    this.uniquePlayerID;
    this.toolbelt=[];
    this.stunned = false;
    this.stunDuration = 0;
    this.knockbackDuration;
    this.knockbackAngle = 0;
    this.knockbackForce = 0;
    //this.toolbelt.push(new Weapon(this));
    this.weapon = new Weapon(this);
  }
  update() {
    //#region Movement and Stunned Handling
    if(this.stunned){
      if(this.stunDuration > 0){
        this.stunDuration--;
      }else{
        this.stunned = false;
      }
    }else{
      this.movementOption1();
    }
    //#endregion
    //#region Handles Swinging the Sword
    this.quadrent.initialUpdate();
    if(this.swingingSword && this.currentSwingCooldown === 0){
      if(this.currentSwingDuration > 0){
        this.swingMeleeWeapon();
        this.currentSwingDuration--;
      }else{
        this.swingingSword = false;
        this.currentSwingDuration = this.swordSwingDuration;
        this.currentSwingCooldown = this.swordSwingCooldown;
      }
    }else if(this.currentSwingCooldown > 0){
      this.resetMeleeWeapon();
      this.currentSwingCooldown--;
    }else{ 
    
    }
    //#endregion
    //#region Forced Respawn
    //This is the a debug feature allowing players to teleport back to the start of the map
    if(this.respawnRequest && this.respawnCooldown <= 0){
      console.log("Tried Respawning!");
      this.quadrent.respawn(this);
      this.respawnCooldown=1000;
    }else{
      this.respawnCooldown--;
    }
    //#endregion
    //#region Generic Management
    if(this.health <= 0){
      this.health = 100;
      this.quadrent.respawn(this);
    }
    //#endregion
    //#region 
    if(this.knockbackDuration > 0){
      this.knockbackDuration--;
      this.movementOption2(this.knockbackAngle, this.knockbackForce);
    }
    //#endregion
  }
  //#region Movement Utility Methods
  movementOption1(){
    if (this.movingRight === true) {
      this.location.x += this.modifiedSpeed();
      if (!this.quadrent.testMovement(this, true)) {
        this.location.x -= this.modifiedSpeed();
      }else{
        this.quadrent.checkEntityImmigration(this);
      }
    }
    if (this.movingLeft === true) {
      this.location.x -= this.modifiedSpeed();
      if (!this.quadrent.testMovement(this, true)) {
        this.location.x += this.modifiedSpeed();
      }else{
        this.quadrent.checkEntityImmigration(this);
      }
    }
    if (this.movingDown === true) {
      this.location.y += this.modifiedSpeed();
      if (!this.quadrent.testMovement(this, true)) {
        this.location.y -= this.modifiedSpeed();
      }else{
        this.quadrent.checkEntityImmigration(this);
      }
    }
    if (this.movingUp === true) {
      this.location.y -= this.modifiedSpeed();
      if (!this.quadrent.testMovement(this, true)) {
        this.location.y += this.modifiedSpeed();
      }else{
        this.quadrent.checkEntityImmigration(this);
      }
    }
  }
  movementOption2(angle, force){
    //Handles Y Movement
    var yDisplacement = 0;
    var xDisplacement = 0;
    var actualSpeed = force;
    var needToCheckImmigration = false;
  
    yDisplacement += Math.sin(angle) * actualSpeed;
    xDisplacement += Math.cos(angle) * actualSpeed;
  
    this.location.y += yDisplacement;
    if(!this.quadrent.testMovement(this, true)){
      this.location.y -= yDisplacement;
    }else{
      needToCheckImmigration = true;
    }
    this.location.x += xDisplacement;
    if(!this.quadrent.testMovement(this, true)){
      this.location.x -= xDisplacement;
    }else{
      needToCheckImmigration = true;
    }
    if(needToCheckImmigration){
      this.quadrent.checkEntityImmigration(this);
    }
  }
  modifiedSpeed() {
    var modifiedSpeed = this.baseSpeed;
    if (this.crouching) {
      modifiedSpeed = modifiedSpeed / 2;
    }
    return modifiedSpeed;
  }
  //#endregion
  //#region Physical Attack Methods
  shootProjectile() {
    var projectileX = 0;
    var projectileY = 0;
    var projectileSize = 10;
    var projectileDX = 0;
    var projectileDY = 0;
    var dummyProjectile = new Projectile(
      projectileX,
      projectileY,
      projectileSize,
      this.collisionEngine,
      this.drawnArray
    );
    if (!this.collisionEngine.doesMovementCauseCollision(dummyProjectile)) {
      dummyProjectile.velocity.x = projectileDX;
      dummyProjectile.velocity.y = projectileDY;
      this.drawnArray.push(dummyProjectile);
    }
    //Not adding the projectile to the physics Engine untill a later update
    this.quadrent.addObject(dummyProjectile);
  }
  swingMeleeWeapon(){
    this.currentSwordAngle += this.swingArcAngle / this.swordSwingDuration;
    //Check Collision With Walls or Enemies
    this.checkWeaponCollision();
  }
  checkWeaponCollision(){
    var playerCenter = {x: this.location.x + playerSize/2, y:this.location.y + playerSize/2}
    this.weapon.setWeaponPositionByAngle(playerCenter, this.currentSwordAngle + this.orientationAngle);
    if(!this.quadrent.testMovement(this.weapon, true)){

    }
  }
  resetMeleeWeapon(){
    this.currentSwordAngle -= this.swingArcAngle / this.swordSwingCooldown;
    //Check if the sword is 
  }
  //#endregion
  //#region Methods For handling being attacked
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
  //#endregion
  //#region Receieve Player Information From Client
  receiveAction(playerKeyInfo){
    //console.log(playerKeyInfo);
    this.movingUp = playerKeyInfo.upAction;
    this.movingDown = playerKeyInfo.downAction;
    this.movingLeft = playerKeyInfo.leftAction;
    this.movingRight = playerKeyInfo.rightAction;
    this.crouching = playerKeyInfo.shiftAction;
    this.orientationAngle = playerKeyInfo.orientation;
    this.respawnRequest = playerKeyInfo.respawnAction;
    if(playerKeyInfo.swingAction){
      this.swingingSword = playerKeyInfo.swingAction;
    }
  }
  //#endregion
}

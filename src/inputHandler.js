module.exports = class InputHandler {
  constructor(targetEntity, targetCanvas) {
    document.addEventListener("keydown", event => {
      this.keyDownHandeler(event.keyCode);
    });
    document.addEventListener("keyup", event => {
      this.keyUpHandeler(event.keyCode);
    });
    this.currentTargetEntity = targetEntity;
    this.canvas = targetCanvas;
  }
  keyDownHandeler(keyCode) {
    this.currentTargetEntity.receiveDownKeyCode(keyCode);
  }
  keyUpHandeler(keyCode) {
    this.currentTargetEntity.receiveUpKeyCode(keyCode);
  }
  setTargetEntity(newEntity) {
    this.currentTargetEntity = newEntity;
  }
}
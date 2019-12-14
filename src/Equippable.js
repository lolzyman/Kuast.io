//const Item = require("../Equi.js");
module.exports = class Equippable{
    constructor(owner, characterClass){
        this.characterClass = characterClass;
        this.owner = owner;
    }
}
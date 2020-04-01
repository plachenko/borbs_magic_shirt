export default class Color{
  private red = 0;
  private green = 0;
  private blue = 0;

  constructor(r = 0, g = 0, b = 0){
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  get hex() {
    return "#" + this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
  }

  public hexToRgb(){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private componentToHex(c: number){
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}

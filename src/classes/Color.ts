export default class Color{
  public red = 0;
  public green = 0;
  public blue = 0;

  constructor(hex: string){
    if(hex){
      this.hexToRgb(hex);
    }
  }

  get hex() {
    return this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
  }

  public mix(color: Color){
    const mixAmt = 3;
    const rdiff = Math.round((color.red - this.red) / mixAmt);
    const bdiff = Math.round((color.blue - this.blue) / mixAmt);
    const gdiff = Math.round((color.green - this.green) / mixAmt);

    if(this.red >= 0 && this.red <= 255)
      this.red += rdiff;

    if(this.blue >= 0 && this.blue <= 255)
      this.blue += bdiff;

    if(this.green >= 0 && this.green <= 255)
      this.green += gdiff;
  }

  public hexToRgb(_hex: string){
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);

    if(result){
      this.red = parseInt(result[1], 16),
      this.green = parseInt(result[2], 16),
      this.blue = parseInt(result[3], 16)
    }
  }

  private componentToHex(c: number){
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}

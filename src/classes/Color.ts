export default class Color{
  public red = 0;
  public green = 0;
  public blue = 0;
  public idx = 1;
  public colors: (string|null)[];

  constructor(hex: string, hex2: string | null = null){
    this.colors = [hex, hex2];
    if(hex){
      this.hexToRgb(hex);
    }
  }

  get hex() {
    return this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
  }

  public swap(){
    if(this.colors[this.idx]){
      return this.colors[this.idx];
      // this.hexToRgb(this.colors[this.idx]);
    }
  }

  public mix(color: Color){
    return color.swap()
    /*
    const mixAmt = 3;
    const rdiff = Math.floor((color.red - this.red) / mixAmt);
    const bdiff = Math.floor((color.blue - this.blue) / mixAmt);
    const gdiff = Math.floor((color.green - this.green) / mixAmt);

    if(this.red >= 0 && this.red <= 255)
      this.red += rdiff;

    if(this.blue >= 0 && this.blue <= 255)
      this.blue += bdiff;

    if(this.green >= 0 && this.green <= 255)
      this.green += gdiff;
    */
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

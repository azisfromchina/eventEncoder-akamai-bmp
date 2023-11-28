const { crc32 } = require('crc');
class EventEncoder {
  constructor() {  }

  static motionEncode(floatArray, f){
    var str1 = "";
    var str2 = "Incorrect sensor data";
    let l = 0;
    try {
      let floatArray2 = [...floatArray];

      let pair = this.motionEncodeHelperA(floatArray);
      let f1 = pair.first;
      let f2 = pair.second;


      let str5 = this.motionEncodeHelperB(floatArray, f1, f2);
      let str6 = this.motionEncodeHelperC(str5);

      let k = str6.length;
      let l1 = crc32(str6);

      f1 = Number(f1.toFixed(2));
      f2 = Number(f2.toFixed(2));

      str6 = "2;"+f1.toFixed(2)+";"+f2.toFixed(2)+";"+l1+";"+str6;

      let l2 = Math.round(f2 * 100.0 + f1 * 100.0) + l1;
      let j = k;

      let i = floatArray2.length; //var25
      let floatArray1 = floatArray2;

      if(!this.powerOfTwo(i)) throw "Length must be power of 2";


      this.motionEncodeHelperD(floatArray1, 0, i, []);
      f1 = this.motionEncodeHelperE(floatArray1, f);

      f2 = floatArray2[0];

      let floatArray5 = floatArray2.slice(1);

      let pair1 = this.motionEncodeHelperA(floatArray5);
      let f3 = pair1.first;
      let f4 = pair1.second;


      let str7 = this.motionEncodeHelperB(floatArray5, f3, f4);
      let str4 = this.motionEncodeHelperC(str7);

      let m = str4.length; //var32

      let l3 = crc32(str4);

      f3 = Number(f3.toFixed(2));
      f4 = Number(f4.toFixed(2));
      f2 = Number(f2.toFixed(2));

      let str3 = "1;"+f3.toFixed(2)+";"+f4.toFixed(2)+";"+f2.toFixed(2)+";"+l3+";"+str4;
      let l4 = Math.round(f3 * 100 + f4 * 100 + f2 * 100) +l3;


      if (j - m < 20) {
        str1 = str6;
        l = l2;
      } else {
        str1 = str3;
        l = l4;
      }
    } catch (e) {
      str2 = str2 + ": " + e.toString();
    }



    if(str1 == "")
      str1 = "0;" + str2;
    return {
      first : str1,
      second: l
    }
  }
  static motionEncodeHelperA(floatArray){
    let f1 = floatArray[0];
    let f2 = floatArray[0];
    let i; //int
    let b; //byte
    for (i = floatArray.length, b = 0; b < i; b++) {
      let f = floatArray[b];
      if (f  < f1) {
        f1 = f;
      } else if (f > f2) {
        f2 = f;
      }
    }
    return {
      first: f1,
      second: f2
    }
  }
  static motionEncodeHelperB(array, f1, f2){
    let f = (f2 - f1) / 60;
    let out = "";
    for (var b = 0; b < array.length; b++) {
      let c = String.fromCharCode(Math.floor((array[b] - f1 ) / f) +65)

      if(array[b] == f2)
        c = '}';
      out += (c == '\\') ? "." : ( (c == ".") ? "\\" : c);
    }
    return out;
  }
  static motionEncodeHelperC(str) {
    let i = str.length;
    let out = "";
    let b = 0;
    while (b < i) {
      let c = str.charAt(b++);
      let b1 = 1;
      while(b < i && c == str.charAt(b)){
        b1++;
        b++;
      }
      if(b1 > 1)
        out += b1;
      out += c;
    }
    return out;
  }

  static motionEncodeHelperD(var0, var1, var2, var3){
    if (var2 != 1) {
      var var4 = var2 / 2;
      var var5 = 0;
      var var6;
      var var7;
      for(var6 = 0; var6 < var4; ++var6) {
         var7 = var1 + var6;
         var var8 = var0[var7];
         var var9 = var0[var1 + var2 - 1 - var6];
         var3[var7] = var8 + var9;
         var3[var7 + var4] = (var8 - var9) / (Math.cos((var6 + 0.5) * Math.PI / var2) * 2.0);
      }

      this.motionEncodeHelperD(var3, var1, var4, var0);
      var7 = var1 + var4;
      this.motionEncodeHelperD(var3, var7, var4, var0);

      for(var6 = var5; var6 < var4 - 1; ++var6) {
         var var11 = var6 * 2 + var1;
         var var10 = var1 + var6;
         var0[var11 + 0] = var3[var10];
         var10 += var4;
         var0[var11 + 1] = var3[var10] + var3[var10 + 1];
      }

      var1 += var2;
      var0[var1 - 2] = var3[var7 - 1];
      --var1;
      var0[var1] = var3[var1];
      var0[var1] = var3[var1];
     }
  }


  static motionEncodeHelperE(paramArrayOffloat, paramFloat) {
    let i = paramArrayOffloat.length;
    let arrayOfFloat = [];
    let j;
    for (j = 0; j < i; j++)
      arrayOfFloat[j] =Math.abs(paramArrayOffloat[j]);

    arrayOfFloat = arrayOfFloat.sort(function(a,b) { return a - b;});

    j = Math.floor(((i - 1) * paramFloat));

    paramFloat = arrayOfFloat[j];
    for (let b = 0; b < i; b++) {
      if (Math.abs(paramArrayOffloat[b]) < paramFloat)
        paramArrayOffloat[b] = 0.0;
    }
    return paramFloat;
  }
  static powerOfTwo(x) {
    return (Math.log(x)/Math.log(2)) % 1 === 0;
  }
}

module.exports = EventEncoder;

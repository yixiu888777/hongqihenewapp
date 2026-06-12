// utils/crypto.js
import CryptoJS from 'crypto-js'

const key = 'IdTJq0HklpuI6mu8iB%OO@!vd^4K&uXW'; // 32字节的密钥（AES-256）
const iv = '$0v@krH7V2123456'; // 16字节的IV（CBC模式）

export default {
  // AES加密
  encrypt(data) {
	 return CryptoJS.AES.encrypt(
	      JSON.stringify(data), 
	      CryptoJS.enc.Utf8.parse(key),
	      { 
	        iv: CryptoJS.enc.Utf8.parse(iv), 
	        mode: CryptoJS.mode.CBC,
	        padding: CryptoJS.pad.Pkcs7
	      }
	    ).toString()
  },


  // AES解密
   decrypt(encryptedData) {
      try {
        // 使用CryptoJS进行AES-256-CBC解密
        const decrypted = CryptoJS.AES.decrypt(
          encryptedData,
          CryptoJS.enc.Utf8.parse(key),
          {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );
        
        // 将解密结果转换为UTF-8字符串
        const decryptedStr = CryptoJS.enc.Utf8.stringify(decrypted);
        
        if (!decryptedStr) {
          throw new Error('解密失败或数据为空');
        }
        
        return JSON.parse(decryptedStr);
      } catch (error) {
        console.error('解密错误:', error);
        throw new Error('数据解密失败: ' + error.message);
      }
    }
}

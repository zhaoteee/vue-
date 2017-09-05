/**
 * @param  {[type]} id    [商家ID值]
 * @param  {[type]} key   [要存入的属性名]
 * @param  {[type]} value [对应存入的属性值]
 * @return {[type]}       [localStorage字符串]
 */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if(!seller) {
    seller = {};
    seller[id] = {};
   
  } else {
    seller = JSON.parse(seller);
    if(!seller[id]) {
      seller[id] = {};
    }
  } 
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);

};
/**
 * [loadFromLocal 读取localStorage]
 * @param  {[type]} id    [商家ID值]
 * @param  {[type]} key   [要存入的属性名]
 * @param  {[type]} def   [没有对应值时的默认值]
 * @return {[type]}       [属性值]
 */
export function loadFromLocal (id, key, def) {
 let seller = window.localStorage.__seller__;
 if(!seller) {
  return def;
 }
 seller = JSON.parse(seller)[id];
 if(!seller) {
  return def
 }
 let ret = seller[key];
 return ret || def;
}

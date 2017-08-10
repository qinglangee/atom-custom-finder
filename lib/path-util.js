/** @babel */
import fs from 'fs'

export default class PathUtil {

  constructor(serializedState) {}
  
  loadAllPath(paths){
    var list = [];
    if(paths == null || typeof(paths) !== "object" ){
      return list;
    }
    for(var i=0;i<paths.length;i++){
      this.loadPathFiles(paths[i]).forEach(f=>list.push(f));
    }
    return list;
  }
    
  /** 接受一个目录作为参数，递归查询返回目录下所有文件的列表 */
  loadPathFiles(path){
    var fileList = [];
    // 不处理文件，直接返回空数组
    if(!fs.statSync(path).isDirectory()){
      return fileList;
    }
    
    try{
        // 没有读权限的,报错不用管了
        var dirList = fs.readdirSync(path);
    }catch(e){
        dirList = [];
    }
    
    var root = this;
    dirList.forEach(function(item){
      var name = item;
      var fullPath = path + '/' + item;
      if(fs.statSync(fullPath).isDirectory()){
        root.loadPathFiles(fullPath).forEach(f=>fileList.push(f))
      }else{
        fileList.push({name,fullPath});
      }
    });
    return fileList;
    
  }
}
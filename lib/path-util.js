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
    
    
  loadPathFiles(path){
    var fileList = [];
    if(!fs.statSync(path).isDirectory()){
      return fileList;
    }
    
    var dirList = fs.readdirSync(path);
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
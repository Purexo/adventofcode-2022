import {open} from "node:fs/promises";
import {reduce} from "../lib/itertools/index.js";
import {sum} from "../lib/functools.js";

class INode {
  name;
  size = 0;
  
  parent = null;
  /**
   * @type {Map<string, INode> | undefined}
   */
  children;
  
  path = '/';
  
  /**
   *
   * @param {string} name
   * @param {number} [size=0]
   * @param {INode | null} [parent=null]
   * @param {Map<string, INode> | undefined} [children]
   * @param {string} path
   */
  constructor({name, size = 0, parent = null, children, path = '/'}) {
    this.name = name;
    this.size = size;
    
    this.parent = parent;
    this.children = children;
    
    this.path = path;
  }
}

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
const fh = await open(new URL('./input.txt', import.meta.url));

let spaceUsed = 0;
const flatFolders = new Map();

/**
 * @type {INode | null | undefined}
 */
let currentDir = new INode({name: '', parent: null, children: new Map(), path: ''});
let currentPath = '';

for await (const line of fh.readLines()) {
  if (line.startsWith('$ cd ')) {
    const dirname = line.slice(5);
    if (dirname === '..') {
      currentDir = currentDir.parent;
      currentPath = currentDir.path;
    } else {
      if (!currentDir.children.has(dirname)) {
        currentDir.children.set(dirname, new INode({
          name: dirname,
          parent: currentDir.parent,
          children: new Map(),
          path: `${currentPath}/${dirname}`.replace(/^\/+/, '/')
        }));
      }
      currentDir = currentDir.children.get(dirname);
      currentPath = currentDir.path;
    }
  } else if (line.startsWith('$ ls')) continue;
  else if (line.startsWith('dir ')) {
    const dirname = line.slice(4);
    if (currentDir.children.has(dirname)) continue;
    currentDir.children.set(dirname, new INode({
      name: dirname,
      parent: currentDir,
      children: new Map(),
      path: `${currentPath}/${dirname}`.replace(/^\/+/, '/')
    }));
  } else {
    const [_size, name] = line.split(' ');
    const size = Number(_size);
    
    const file = new INode({name, parent: currentDir, size});
    file.size = size;
    currentDir.children.set(name, file);
    spaceUsed += file.size;
    
    let current = currentDir;
    while (current) {
      current.size += file.size;
  
      flatFolders.set(current.path, current);
      
      current = current.parent;
    }
  }
}

const FS_TOTAL_SIZE = 70_000_000;
const FREE_SPACE_TARGET = 30_000_000;
const MINIMAL_SPACE_TO_DELETE = FREE_SPACE_TARGET - (FS_TOTAL_SIZE - spaceUsed)

let smallestFolderToRemove = null;
for (const folder of flatFolders.values()) {
  if (folder.size >= MINIMAL_SPACE_TO_DELETE) {
    if (smallestFolderToRemove === null) smallestFolderToRemove = folder;
    if (folder.size < smallestFolderToRemove.size) smallestFolderToRemove = folder;
  }
}

// NOT 578710
console.log(smallestFolderToRemove.size);

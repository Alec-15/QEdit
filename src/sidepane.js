import React from 'react';



export class SidePane extends React.Component {
  // Add one item to the tree
  // Search this level, and recursively call this on lower levels
  addToTree(tree, obj) {
    console.log(obj.name + ": Looking for " + obj.loc);
    for (let i = 0; i < tree.length; i++) {
      console.log("... in " + tree[i].name);
      if (tree[i].name === obj.loc) {
        // Found on this level, add new node and quit
        const h = {name:obj.name, object:obj, branch:[]};
        tree[i].branch.push(h);
        console.log("... added");
        return true;
      }
      if (this.addToTree(tree[i].branch, obj)) {
        // Found on a lower level, so it was added there
        console.log("... done");
        return true;
      }
    }
    console.log("Failed to put in tree: " + obj.name);
    return false;
  }
  
  buildTree(tree, remainder, objects) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].loc === undefined || objects[i].loc === "---") {
        tree.push({name:objects[i].name, object:objects[i], branch:[]});
      }
      else {
        if (!this.addToTree(tree, objects[i])) remainder.push(objects[i]);
      }
    }
  }
  
  render() {
    const tree = [];
    let objects = this.props.objects
    let remainder;
    let count;
    
    do {
      remainder = [];
      count = objects.length;
      this.buildTree(tree, remainder, objects);
      objects = remainder;
    } while (remainder.length !== 0 && remainder.length !== count);

    if (remainder.length !== 0) {
      console.log("WARNING: " + remainder.length + " items were not put in the tree.")
      console.log(remainder);
    }
    //console.log(JSON.stringify(tree));
    
    return <div id="sidepane"><TreeView tree={tree} showObject={this.props.showObject} treeToggle={this.props.treeToggle}/></div>
  }
}

const TreeView = (props) => {
  const {tree, showObject, treeToggle} = props;

  if (tree.length === 0) return null;
  return (<ul className="active">
  {tree.map(function(node, index) {
    if (node.branch.length === 0) {
      return (<li key={index}>
        {String.fromCharCode(9678)}
        <TreeLink object={node.object} showObject={showObject}/>
      </li>)
    }
    else {
      //return null;
      return (<TreeToggler tree={node} key={index} showObject={showObject} treeToggle={treeToggle}/>)
    }
  })}
  </ul>)
}

const TreeToggler = (props) => {
  const {tree, showObject, treeToggle} = props;
  
  if (tree.object.jsExpanded) {
    return (<li>
      <a onClick={() => treeToggle(tree.object)} className="caret">{String.fromCharCode(9660)}</a>
      <TreeLink object={tree.object} showObject={showObject}/>
      <TreeView tree={tree.branch} showObject={showObject} treeToggle={treeToggle}/>
    </li>)
  }
  else {
    return (<li>
      <a onClick={() => treeToggle(tree.object)} className="caret">{String.fromCharCode(9654)}</a>
      <TreeLink object={tree.object} showObject={showObject}/>
    </li>)
  }      
}



const TreeLink = (props) => {
  const {object, showObject} = props;
  const style = {color:object.jsColour};
  
  return  <a onClick={() => showObject(object.name)} style={style} className={object.jsIsRoom ? (object.jsIsZone ? "treeZone" : "treeRoom") : "treeItem"}>{object.name}</a>
}
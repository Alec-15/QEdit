import React from 'react';

//const Blockly = require('node-blockly/javascript');

console.log("blockly loaded okay")

// The input should (or might) specify:
//    if a string is allowed
//    return type
//    parameters
// The value should be a dictionary, with type and code attributes

export class ScriptOrStringComp extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value;  
    this.id = props.input.name
    this.handleChange = this.props.handleChange;
    this.allowString = this.props.allowString;
  }
  
  // This handles changing the type
  handleTypeChange(e) {
    //console.log(e)
    //console.log(this.props.value)
    const value = {
      type:e.target.checked ? "asl" : "string",
      code:this.props.value.code,
    }
    console.log(value)
    
    e = {target:{ id:this.id,  value:value, dataset:{type:'scriptType'}}};
    this.handleChange(e);
  }

  // This handles changing the type
  handleCodeChange(e) {
    //console.log(e)
    //console.log(this.props.value)
    const value = {
      type:this.props.value.type,
      code:e.target.value,
    }
    console.log(value)
    
    e = {target:{ id:this.id,  value:value, dataset:{type:'scriptChange'}}};
    this.handleChange(e);
  }

  render() {
    const isScript = this.props.value.type === "asl";
    return (  
      <tr className="form-group">
        <td colSpan="2">
        <span className="fieldName">{this.props.input.display}</span>

        <span style={{textAlign:'right'}}>
        <select
          className="form-control"
          id={this.props.name}
          name={this.props.name}
          value={this.props.value}
          title={this.props.tooltip}
          onChange={this.handleTypeChange.bind(this)}
        >
        {['Text', 'JavaScript', 'ASL'].map((s, i) => <option value={s} key={i}>{s}</option>)}
        </select>
        </span>

        <br/>
        <textarea
          className="form-control textarea"
          cols="500" rows="16"
          id={this.props.input.name}
          name={this.props.input.name}
          value={this.props.value.code}
          title={this.props.input.tooltip}
          onChange={this.handleCodeChange.bind(this)}
        />
        </td>
      </tr>
    )
  }
}





class ScriptComp extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value;
    this.id = props.input.name
    this.handleChange=this.props.handleChange;
  }
  
  handleScriptChange(e) {
    //console.log("s----------------------------");
    //console.log(e);
    //console.log(typeof this.handleChange);
    const value = "function(" + this.params + ") {\n" + e.target.value + "}";
    e = {target:{ id:this.id,  value:value, }};
    this.handleChange(e);
  }

  handleParamChange(e) {
    const value = "function(" + e.target.value + ") {\n" + this.text + "}";
    e = {target:{ id:this.id,  value:value, }};
    this.handleChange(e);
  }


  render() {
    let isValid = true;
    //console.log("----------------------------");
    //console.log(this.props.value);
    //console.log(typeof this.props.value);
    const md = /^function\((.*?)\) {\n?([\s\S]*)}\S*$/.exec(this.props.value)
    if (md === null) {
      this.params = "WARNING: Failed to parse function";
      this.text = this.props.value
    }
    else {
      this.params = md[1];
      this.text = md[2];
      try {
        console.log(this.text);
        //eval(this.text);
        
        let result = function(str, params){
          console.log("-------------------");
          console.log(params);
          const l = params.split(",");
          let preamble = ""
          for (let i = 0; i < l.length; i++) {
            const name = l[i].trim();
            console.log("var " + name);
            if (name.length > 0) preamble += "var " + name + ";\n";
          }
          console.log(preamble + str);
          return eval(preamble + str);
        }.call(RunEnviro, this.text, this.params);
        
        //eval(this.props.value);
        console.log('Code is good');
      }
      catch (err) {
        isValid = false;
        console.log('Error in function code');
        //console.log('------------------------');
        console.log(err);
        //console.log('------------------------');
      }
    }
    const style = {backgroundColor:isValid ? "white" : "yellow"};
    return (  
      <div style={style}>
        <span className="fieldName">Parameters (separated with commas)</span>
        <input
          className="form-control"
          id={this.props.input.name}
          name={this.props.input.name}
          type={this.props.input.type}
          title={this.props.input.tooltip}
          value={this.params}
          onChange={this.handleParamChange.bind(this)}
        />
        <br/>
        <textarea
          className="form-control textarea"
          cols="500" rows="16"
          id={this.props.input.name}
          name={this.props.input.name}
          value={this.text}
          title={this.props.input.tooltip}
          onChange={this.handleScriptChange.bind(this)}
        />
      </div>
    )
  }
}






const beautifyFunction = function(str, indent) {
    console.log("=----------------------------");
  let res = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{") {
      indent++;
      res += "{\n" + tabs(indent);
    }
    else if (str[i] === "}") {
      res = res.trim();
      indent--;
      res += "\n" + tabs(indent) + "}\n" + tabs(indent);
    }
    else if (str[i] === ";") {
      res += ";\n" + tabs(indent);
    }
    else {
      res += str[i];
    }
  }
  return res.trim();
}

const tabs = function(n) {
  let res = "";
  for (let i = 0; i < n; i++) res += "  ";
  return res;
}




const RunEnviro = {}

const msg = function(s){}


'use strict';

// I am unable to do tests involving XML as DOMParser is not accessible.
// I am not sure why it can be used in Electron/React but not in tests.
// I have looked somewhat at other XML translators without success;
// also tried "dom-parser" but it uses different names (no Element class),
// so I still get errors. 


const [QuestObject, Exit, xmlToDict] = require('../src/questobject')




test('xmlToDict', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('  <object name="test_object" count="5">\n    <width>Ten</width>\n  </object>\n\n', "text/xml")
  const d = xmlToDict(xmlDoc.documentElement)
  expect(d.name).toBe("test_object")
  expect(d.count).toBe("5")
  expect(d.width).toBe("Ten")
});



test('xmlToDict with settings', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('  <object name="test_object" count="5">\n    <width>Ten</width>\n  </object>\n\n', "text/xml")
  const d = xmlToDict(xmlDoc.documentElement, {height:14})
  expect(d.name).toBe("test_object")
  expect(d.count).toBe("5")
  expect(d.width).toBe("Ten")
  expect(d.height).toBe(14)
});

test('xmlToDict with script', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('<testAtt type="script">\n            <code><![CDATA[msg("Hello")]]></code>\n          </testAtt>', "text/xml")
  const d = xmlToDict(xmlDoc.documentElement)
  expect(d.type).toBe("script")
  expect(d.code).toBe("msg(\"Hello\")")
});




// Also want to cope with Quest 5 exits!!!!

test('Exit.createFromXml simple', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('<exit alias="north" to="library">\n    </exit>', "text/xml")
  const d = Exit.createFromXml(xmlDoc.documentElement)
  expect(d.data.useType).toBe("default")
  expect(d.name).toBe("library")
});

test('Exit.createFromXml msg', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('<exit alias="north" to="library">\n      <useType>msg</useType>\n      <msg><![CDATA[You go into the library.]]></msg>\n    </exit>', "text/xml")
  const d = Exit.createFromXml(xmlDoc.documentElement)
  expect(d.data.useType).toBe("msg")
  expect(d.data.msg).toBe("You go into the library.")
});

test('Exit.createFromXml function', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('<exit alias="east" to="library">\n      <useType>custom</useType>\n      <use><![CDATA[msg("You go into the library.")]]></use>\n    </exit>', "text/xml")
  const d = Exit.createFromXml(xmlDoc.documentElement)
  expect(d.data.useType).toBe("custom")
  expect(d.data.use).toBe('msg("You go into the library.")')
});

test('Exit.createFromXml simple Quest5', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('      <exit alias="east" to="landing">\n        <inherit name="eastdirection" />\n      </exit>', "text/xml")
  const d = Exit.createFromXml(xmlDoc.documentElement)
  expect(d.data.useType).toBe("default")
  expect(d.name).toBe("landing")
});

test('Exit.createFromXml invisible Quest5', () => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString('      <exit name="exit_cellars_secret_passage" alias="east" to="secondcrypt">\n        <inherit name="eastdirection" />\n       <visible type="boolean">false</visible>\n      </exit>', "text/xml")
  const d = Exit.createFromXml(xmlDoc.documentElement)
  expect(d.data.useType).toBe("default")
  expect(d.data.visible).toBe(false)
  expect(d.name).toBe("secondcrypt")
});



      






const createFromXml = function(xml) {
  const parser = new DOMParser()
  // This is a Document object, not XMLDocument
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  return new QuestObject(xmlDoc.documentElement, 600)
}








test('toXml 1', () => {
  const obj = new QuestObject({name:'test_object'})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});



test('toJs 1', () => {
  const obj = new QuestObject({name:'test_object'})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n})'
  expect(result).toBe(expected);
});



test('toXml with template', () => {
  const obj = new QuestObject({name:'test_object', jsMobilityType:"Takeable", jsIsSwitchable:true})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <jsMobilityType type="string"><![CDATA[Takeable]]></jsMobilityType>\n    <jsIsSwitchable type="boolean">true</jsIsSwitchable>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with template', () => {
  const obj = new QuestObject({name:'test_object', jsMobilityType:"Takeable", jsIsSwitchable:true})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", TAKEABLE(), SWITCHABLE(), {\n})'
  expect(result).toBe(expected);
});



test('toXml with string', () => {
  const obj = new QuestObject({name:'test_object', testAtt:"Testable", second:""})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="string"><![CDATA[Testable]]></testAtt>\n    <second type="string"><![CDATA[]]></second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with string', () => {
  const obj = new QuestObject({name:'test_object', testAtt:"Testable", second:""})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:"Testable",\n  second:"",\n})'
  expect(result).toBe(expected);
});



test('toXml with boolean', () => {
  const obj = new QuestObject({name:'test_object', testAtt:true, second:false})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="boolean">true</testAtt>\n    <second type="boolean">false</second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with boolean', () => {
  const obj = new QuestObject({name:'test_object', testAtt:true, second:false})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:true,\n  second:false,\n})'
  expect(result).toBe(expected);
});



test('toXml with number', () => {
  const obj = new QuestObject({name:'test_object', testAtt:12, second:-5})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="int">12</testAtt>\n    <second type="int">-5</second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with number', () => {
  const obj = new QuestObject({name:'test_object', testAtt:12, second:-5})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:12,\n  second:-5,\n})'
  expect(result).toBe(expected);
});



test('toXml with regex', () => {
  const obj = new QuestObject({name:'test_object', testAtt:/abcd/, second:/^([a-zA-Z]*) function/})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="regex">abcd</testAtt>\n    <second type="regex">^([a-zA-Z]*) function</second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with regex', () => {
  const obj = new QuestObject({name:'test_object', testAtt:/abcd/, second:/^([a-zA-Z]*) function/})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:/abcd/,\n  second:/^([a-zA-Z]*) function/,\n})'
  expect(result).toBe(expected);
});



test('toXml with stringlist', () => {
  const obj = new QuestObject({name:'test_object', testAtt:['one', 'two', 'three'], second:[]})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="stringlist">\n      <value>one</value>\n      <value>two</value>\n      <value>three</value>\n    </testAtt>\n    <second type="stringlist">\n    </second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with stringlist', () => {
  const obj = new QuestObject({name:'test_object', testAtt:['one', 'two', 'three'], second:[]})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:["one", "two", "three"],\n  second:[],\n})'
  expect(result).toBe(expected);
});



test('toXml with javascript', () => {
  const obj = new QuestObject({name:'test_object', testAtt:{type:'js', params:'', code:'msg("Hello")'}, second:{type:'js', params:'s', code:'if (s) {\n  msg("Hello" + s)\n}'}})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="js">\n      <params type="string"></params>\n      <code><![CDATA[msg("Hello")]]></code>\n    </testAtt>\n    <second type="js">\n      <params type="string">s</params>\n      <code><![CDATA[if (s) {\n  msg("Hello" + s)\n}]]></code>\n    </second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with javascript', () => {
  const obj = new QuestObject({name:'test_object', testAtt:{type:'js', params:'', code:'msg("Hello")'}, second:{type:'js', params:'s', code:'if (s) {\n  msg("Hello" + s)\n}'}})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:function() {\n    msg("Hello")\n  },\n  second:function(s) {\n    if (s) {\n      msg("Hello" + s)\n    }\n  },\n})'
  expect(result).toBe(expected);
});



test('toXml with script', () => {
  const obj = new QuestObject({name:'test_object', testAtt:{type:'script', code:'msg("Hello")'}, second:{type:'script', code:'if (s) {\n  msg("Hello" + s)\n}'}})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <testAtt type="script">\n      <code><![CDATA[msg("Hello")]]></code>\n    </testAtt>\n    <second type="script">\n      <code><![CDATA[if (s) {\n  msg("Hello" + s)\n}]]></code>\n    </second>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with script', () => {
  const obj = new QuestObject({name:'test_object', testAtt:{type:'script', code:'msg("Hello")'}, second:{type:'script', code:'if (s) {\n  msg("Hello" + s)\n}'}})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  testAtt:undefined, // WARNING: This script has not been included as it is in ASLX, not JavaScript\n  second:undefined, // WARNING: This script has not been included as it is in ASLX, not JavaScript\n})'
  expect(result).toBe(expected);
});



test('toXml with simple exit', () => {
  const obj = new QuestObject({name:'test_object', north:new Exit('library'), south:new Exit('hall')})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <exit alias="north" to="library">\n    </exit>\n    <exit alias="south" to="hall">\n    </exit>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with simple exit', () => {
  const obj = new QuestObject({name:'test_object', north:new Exit('library'), south:new Exit('hall')})
  const result = obj.toJs()
  const expected = '\n\n\ncreateItem("test_object", {\n  north:new Exit("library"),\n  south:new Exit("hall"),\n})'
  expect(result).toBe(expected);
});

test('toXml with msg exit', () => {
  const obj = new QuestObject({name:'test_object', north:new Exit('library', {useType:'msg', msg:'You go into the library.'})})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <exit alias="north" to="library">\n      <useType>msg</useType>\n      <msg><![CDATA[You go into the library.]]></msg>\n    </exit>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with msg exit', () => {
  const obj = new QuestObject({name:'test_object', north:new Exit('library', {useType:'msg', msg:'You go into the library.'})})
  const result = obj.toJs()
  const expected = `


createItem("test_object", {
  north:new Exit("library", {
    msg:"You go into the library.",
  }),
})`  
  expect(result).toBe(expected);
});


test('toXml with function exit', () => {
  const obj = new QuestObject({name:'test_object', east:new Exit('library', {useType:'custom', use:'msg("You go into the library.")'})})
  const result = obj.toXml()
  const expected = '  <object name="test_object">\n    <exit alias="east" to="library">\n      <useType>custom</useType>\n      <use><![CDATA[msg("You go into the library.")]]></use>\n    </exit>\n  </object>\n\n'
  expect(result).toBe(expected);
  
  const obj2 = createFromXml(result)
  expect(obj).toEqual(obj2)
});

test('toJs with function exit', () => {
  const obj = new QuestObject({name:'test_object', east:new Exit('library', {useType:'custom', use:'msg("You go into the library.")'})})
  const result = obj.toJs()
  const expected = `


createItem("test_object", {
  east:new Exit("library", {
    use:function() {
      msg("You go into the library.")
    },
  }),
})`
  expect(result).toBe(expected);
});



test('toJsSettings with boolean/string', () => {
  const obj = new QuestObject({name:'Settings', jsObjType:'settings', stringAtt:'Some string', jsstringAtt:true})
  const result = obj.toJs()
  expect(result).toBe('');

  const result2 = obj.toJsSettings()
  const expected2 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  '    ',\n]\nsettings.stringAtt = \"Some string\"\n"
  expect(result2).toBe(expected2);
  
  obj.jsstringAtt = false

  const result3 = obj.toJsSettings()
  const expected3 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  '    ',\n]\nsettings.stringAtt = false\n"
  expect(result3).toBe(expected3);
});


test('toJsSettings with room description, ordered', () => {
  const obj = new QuestObject({name:'Settings', jsObjType:'settings', jsRoomTitlePos:1, jsRoomItemsPos:2, jsRoomExitsPos:3, jsRoomDescPos:4})

  const result1 = obj.toJsSettings()
  //console.log(result1)
  const expected1 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  '{b:{cap:{hereName}}} {objectsHere:You can see {objects} here.} {exitsHere:You can go {exits}.} {terse:{hereDesc}} ',\n]\n"
  expect(result1).toBe(expected1);
  
  obj.jsRoomDescPos = 2
  obj.jsRoomItemsPos = 4
  const result2 = obj.toJsSettings()
  //console.log(result2)
  const expected2 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  '{b:{cap:{hereName}}} {terse:{hereDesc}} {exitsHere:You can go {exits}.} {objectsHere:You can see {objects} here.} ',\n]\n"
  expect(result2).toBe(expected2);
});



test('toJsSettings with room description, options', () => {
  const obj = new QuestObject({name:'Settings', jsObjType:'settings', jsRoomTitlePos:1, jsRoomItemsPos:2, jsRoomExitsPos:3, jsRoomDescPos:4, jsRoomTitleNewLine:true})

  const result1 = obj.toJsSettings()
  //console.log(result1)
  const expected1 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  '#{cap:{hereName}}',\n  '{objectsHere:You can see {objects} here.} {exitsHere:You can go {exits}.} {terse:{hereDesc}} ',\n]\n"
  expect(result1).toBe(expected1);
  
  obj.jsRoomDescPos = 2
  obj.jsRoomItemsPos = 4
  obj.jsRoomTitleNewLine = false
  obj.jsRoomTitleYouAreIn = true
  const result2 = obj.toJsSettings()
  //console.log(result2)
  const expected2 = "\n\n\nsettings.inventories = [\n]\nsettings.template = [\n  'You are in {hereName}. {terse:{hereDesc}} {exitsHere:You can go {exits}.} {objectsHere:You can see {objects} here.} ',\n]\n"
  expect(result2).toBe(expected2);
});


test('toJsSettings with status list', () => {
  const obj = new QuestObject({name:'Settings', jsObjType:'settings', jsStatusList:['Mana', 'Hit points']})

  const result1 = obj.toJsSettings()
  const expected1 = '\n\n\nsettings.inventories = [\n]\nsettings.status = [\n  function() { return "<td>Mana:</td><td>" + game.player.mana + "</td>"; },\n  function() { return "<td>Hit points:</td><td>" + game.player.hitPoints + "</td>"; },\n]\nsettings.template = [\n  \'    \',\n]\n'
  expect(result1).toBe(expected1);
  
});





test('new QuestObject npc', () => {
  const xml = `
      <object name="apprentice">
        <inherit name="editor_object" />
        <inherit name="namedmale" />
        <alias>Kendall</alias>
        <usedefaultprefix type="boolean">false</usedefaultprefix>
        <look>Kendall is nineteen, a short, slim man, with long, rather unkempt hair.</look>
      </object>`

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  const obj = new QuestObject(xmlDoc.documentElement, 550)
  expect(obj.name).toBe("apprentice")
  expect(obj.examine).toBe("Kendall is nineteen, a short, slim man, with long, rather unkempt hair.")
  expect(obj.alias).toBe("Kendall")
  expect(obj.jsMobilityType).toBe("NPC")
  expect(obj.jsPronoun).toBe("male")
  expect(obj.properName).toBe(true)
});





test('new QuestObject wearable', () => {
  const xml = `
    <object name="robe">
      <inherit name="editor_object" />
      <inherit name="wearable" />
      <alias>Kendall's robe</alias>
      <feature_wearable />
      <wear_slots type="stringlist">
        <value>torso</value>
      </wear_slots>
      <wearmsg>You put on Kendall's robe</wearmsg>
      <removemsg>You take off Kendall's robe.</removemsg>
    </object>`

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  const obj = new QuestObject(xmlDoc.documentElement, 550)
  //console.log(obj)
  expect(obj.name).toBe("robe")
  expect(obj.alias).toBe("Kendall's robe")
  expect(obj.jsMobilityType).toBe("Takeable")
  expect(obj.jsIsWearable).toBe(true)
});



test('new QuestObject room', () => {
  const xml = `
    <object name="scullery">
      <inherit name="editor_room" />
      <roomtype>Lower level room</roomtype>
      <alias>The Scullery</alias>
      <usedefaultprefix type="boolean">false</usedefaultprefix>
      <exit alias="north" to="kitchens">
        <inherit name="northdirection" />
      </exit>
    </object>`

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "text/xml")
  const obj = new QuestObject(xmlDoc.documentElement, 550)
  expect(obj.name).toBe("scullery")
  expect(obj.alias).toBe("The Scullery")
  expect(obj.jsObjType).toBe('room')
  expect(obj.north).toBeInstanceOf(Exit)
});




//*/
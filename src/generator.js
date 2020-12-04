const jsf = require("json-schema-faker");
const fs = require('fs');
const jp = require('jsonpath');
const { countReset } = require("console");

class Generator {
  dateFormat = require('dateformat');
  fake = require('faker');
  jp = require('jsonpath');
  outputFile = "./output/genData.json"
  rsourceBlueprints
  generationInstruction
  generatationInstructions = []
  idPrefix = "generated-id-"
  idPaths
  curGenResources = []

  idCounters = {
    Patient: 1,
    Encounter: 1,
    Condition: 1,
    Procedure: 1,
    Observation: 1,
    ServiceRequest: 1,
    DiagnosticReport: 1,
    Speciment: 1,
    MedicationStatement: 1
  }

  genNumber(params) {
    return this.fake.finance.amount(params['min'], params['max'], params['precision'])
  }

  genEnum(params) {
    var len = params['options'].length
    var index = this.fake.random.number({"max": len - 1})
    return params['options'][index]
  }

  genDate(params) {
    var start = new Date(params['start'])
    var end = new Date(params['end'])
    var format = params['format']
    var randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    if(format != undefined){
      return this.dateFormat(randDate, format)
    } else {
      return this.dateFormat(randDate, "yyyy-mm-dd'T'hh:MM:ss+02:00")
    }
  }

  valueFromEntry(params){
    return params['replaceValue']
  }

  valueFromRessource(params){
    var val = jp.value(this.curGenResources, params['resourcePath'])
    return val
  }

  dateDistanceFromRessource(params){
    var dateVal = jp.value(this.curGenResources, params['resourcePath'])
    var resDate = new Date(dateVal)
    var distPlus = params['distancePlus']
    var distMinus = params['distanceMinus']
  
    var start = new Date()
    start.setDate(resDate.getDate() - distMinus)
    var end = new Date()
    end.setDate(resDate.getDate() + distPlus)

    var randDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    return this.dateFormat(randDate, "yyyy-mm-dd'T'hh:MM:ss+02:00")
  }

  initGenerator() {
    let rsourceBlueprintsData = fs.readFileSync('./src/config/resource-blueprints.json')
    let rsourceBlueprints = JSON.parse(rsourceBlueprintsData)
    this.rsourceBlueprints = rsourceBlueprints

    this.idPaths = JSON.parse(fs.readFileSync('./src/config/idpath-config.json'))

    var files = fs.readdirSync('./input/');

    files.forEach(file => {
      console.log(file)
      let generationInstructionData = fs.readFileSync('./input/' + file)
      let generationInstruction = JSON.parse(generationInstructionData)
      this.generatationInstructions.push(generationInstruction)     
    });

    this.sortGenDescBundle()

  }

  sortGenDescBundle(){

    this.generatationInstructions.forEach(element => {

      let tmpGenDesc = []
      var patient = element['Bundle'].filter(obj => {
        return obj['blueprint'] === 'Patient'
      })
  
      var encounter = element['Bundle'].filter(obj => {
        return obj['blueprint'] === 'Encounter'
      })
  
      var rest = element['Bundle'].filter(obj => {
        return (obj['blueprint'] !== 'Patient' && obj['blueprint'] !== 'Encounter')
      })
  
      tmpGenDesc = tmpGenDesc.concat(patient)
      tmpGenDesc = tmpGenDesc.concat(encounter)
      tmpGenDesc = tmpGenDesc.concat(rest)
      element['Bundle'] = tmpGenDesc
      
    });

    


  }

  generateForDesc(curGenerationDesc) {

    var replacements = []

    for (var key in curGenerationDesc) {
      var valueGenDesc = curGenerationDesc[key]
      var replaceVal = null

      if (valueGenDesc['function'] != undefined) {

        if(valueGenDesc['function'] == 'valueFromEntry'){
          var entryValue = replacements.filter(replacement => {
            return replacement['replacePath'] === valueGenDesc['params']['path']
          })[0];
          valueGenDesc['params']['replaceValue'] = entryValue.replaceValue
        }

        replaceVal = this[valueGenDesc['function']](valueGenDesc['params'])
      } else {
        replaceVal = valueGenDesc
      }

      replacements.push({ "replacePath": key, "replaceValue": replaceVal })

    }

    return replacements
  }

  createEntryFromResource(resource) {

    var fullUrl = resource['resourceType'] + "/" + resource['id']

    //resource object needs to be deepcopied to avoid changing data later

    var entry = {
      fullUrl: fullUrl,
      resource: JSON.parse(JSON.stringify(resource)),
      request: {
        method: "PUT",
        url: fullUrl
      }
    };

    return entry
  }

  setIdsForResource(resource) {

    var resourceType = resource['resourceType']
    this.idCounters[resourceType] = this.idCounters[resourceType] + 1

    this.idPaths[resourceType].forEach(idPath => {
      let idPrefix = idPath['counterName'].toLowerCase().substring(0,3) + "-"
      var generatedId = idPrefix + this.idPrefix + String(this.idCounters[idPath['counterName']])

      if (idPath['refPrefix']!= undefined){
        generatedId = idPath['refPrefix'] + generatedId
      }

      jp.value(resource, idPath['path'], generatedId)
    });
  }


  generateOne(genInst) {

    this.curGenResources = [];

    genInst['Bundle'].forEach(item => {
      //TODO: double check if object is new and resourceBlueprint not overwritten
      var curResource = this.rsourceBlueprints[item['blueprint']]
      var replacements = this.generateForDesc(item['genDesc'])
      this.setIdsForResource(curResource)

      replacements.forEach(replacement => {
        jp.value(curResource, replacement['replacePath'], replacement['replaceValue'])
      });

      this.curGenResources.push(this.createEntryFromResource(curResource))

    });

    var bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: this.curGenResources
    }

    return bundle
  }


  generate() {

    this.generatationInstructions.forEach(genInst => {
      this.idCounters = genInst['idOffsets']
      var nToGenerate = genInst['numberToGenerate']

      let outputFile = './output/' + genInst['name'] + '.json'

      var fileStream = fs.createWriteStream(outputFile, {
        flags: 'a+'
      })

      console.log("Begin generating patients")

      for (var i = 0; i < nToGenerate; i++) {
        var toWrite = JSON.stringify(this.generateOne(genInst)) + "\n"
        fileStream.write(toWrite, function (err) {
          if (err) throw err;
        });
        
        if(i % 1000 == 0){
          console.log("Generated " , i, " out of " , nToGenerate)
        }

        if(i == nToGenerate){
          console.log("Generated " , i, " out of " , nToGenerate)
        }
      }
    });

  }

}

var generator = new Generator();
generator.initGenerator()
generator.generate()

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
  idPrefix = "generated-id-"
  idPaths

  idCounters = {
    Patient: 1,
    Encounter: 1,
    Condition: 1,
    Procedure: 1,
    Observation: 1,
    ServiceRequest: 1,
    DiagnosticReport: 1
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
      return this.dateFormat(randDate, "yyyy-mm-dd'T'hh:MM:ss")
    }
  }

  valueFromEntry(params){
    return params['replaceValue']
  }

  initGenerator() {
    let rsourceBlueprintsData = fs.readFileSync('./src/config/resource-blueprints.json')
    let rsourceBlueprints = JSON.parse(rsourceBlueprintsData)
    this.rsourceBlueprints = rsourceBlueprints

    this.idPaths = JSON.parse(fs.readFileSync('./src/config/idpath-config.json'))

    var files = fs.readdirSync('./input/');
    let generationInstructionData = fs.readFileSync('./input/' + files[0])
    //let generationInstructionData = fs.readFileSync('./input/patient_desc3.json')
    let generationInstruction = JSON.parse(generationInstructionData)
    this.generationInstruction = generationInstruction

    this.idCounters = this.generationInstruction['idOffsets']

    this.sortGenDescBundle()

  }

  sortGenDescBundle(){

    let tmpGenDesc = []

    var patient = this.generationInstruction['Bundle'].filter(obj => {
      return obj['blueprint'] === 'Patient'
    })

    var encounter = this.generationInstruction['Bundle'].filter(obj => {
      return obj['blueprint'] === 'Encounter'
    })

    var rest = this.generationInstruction['Bundle'].filter(obj => {
      return (obj['blueprint'] !== 'Patient' && obj['blueprint'] !== 'Encounter')
    })

    tmpGenDesc = tmpGenDesc.concat(patient)
    tmpGenDesc = tmpGenDesc.concat(encounter)
    tmpGenDesc = tmpGenDesc.concat(rest)
    this.generationInstruction['Bundle'] = tmpGenDesc


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
      var generatedId = this.idPrefix + String(this.idCounters[idPath['counterName']])
      jp.value(resource, idPath['path'], generatedId)
    });
  }


  generateOne() {

    var genResources = [];

    this.generationInstruction['Bundle'].forEach(item => {

      //TODO: double check if object is new and resourceBlueprint not overwritten
      var curResource = this.rsourceBlueprints[item['blueprint']]
      var replacements = this.generateForDesc(item['genDesc'])

      replacements.forEach(replacement => {
        jp.value(curResource, replacement['replacePath'], replacement['replaceValue'])
      });

      this.setIdsForResource(curResource)
      genResources.push(this.createEntryFromResource(curResource))

    });

    var bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: genResources
    }

    return bundle
  }


  generate() {

    var nToGenerate = this.generationInstruction['numberToGenerate']

    var fileStream = fs.createWriteStream(this.outputFile, {
      flags: 'a+'
    })
    //array begin
    fileStream.write('[', function (err) {
      if (err) throw err;
    });
    //write single json
    for (var i = 0; i < nToGenerate; i++) {
      var toWrite = JSON.stringify(this.generateOne()) + "\n"
      fileStream.write(toWrite, function (err) {
        if (err) throw err;
      });
      //separator
      if(i < nToGenerate-1){
        fileStream.write(',', function (err) {
          if (err) throw err;
        });
      }
    }

    //array end
    fileStream.write(']', function (err) {
      if (err) throw err;
    });



  }

}

var generator = new Generator();
generator.initGenerator()
generator.generate()

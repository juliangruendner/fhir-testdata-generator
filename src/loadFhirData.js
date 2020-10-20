var http = require('http');
const fs = require('fs');
//const lineReader = require('line-reader');



//The url we want is `www.nodejitsu.com:1337/`


callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}


function loadData(data){

    var options = {
        host: 'localhost',
        path: '/fhir',
        //since we are listening on a custom port, we need to specify it by hand
        port: '8082',
        //This is what changes the request to a POST request
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
          }
      };

    var req = http.request(options, callback);
    //This is the data we are posting, it needs to be a string or a buffer
    
    req.write(data)
    req.end();
}

var data = '{"resourceType":"Bundle","type":"transaction","entry":[{"fullUrl":"Patient/generated-id-2","resource":{"resourceType":"Patient","id":"generated-id-2","meta":{"source":"kdbp.fau.patstammdaten:kdbp-to-fhir:null"},"identifier":[{"use":"usual","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}],"gender":"female","birthDate":"1995-02-22","deceasedDateTime":"2020-07-22T08:45:00+02:00","address":[{"type":"physical","city":"Erlangen","postalCode":"91052"}]},"request":{"method":"PUT","url":"Patient/generated-id-2"}},{"fullUrl":"Encounter/generated-id-2","resource":{"resourceType":"Encounter","id":"generated-id-2","meta":{"source":"kdbp.fau.patfalldaten:kdbp-to-fhir:null","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-fall/StructureDefinition/Encounter/Versorgungsfall"]},"identifier":[{"use":"official","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"VN"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/encounterId","value":"generated-id-2","assigner":{"identifier":{"system":"http://fhir.de/NamingSystem/arge-ik/iknr","value":"260950567"}}}],"status":"finished","class":{"system":"https://www.medizininformatik-initiative.de/fhir/core/modul-fall/CodeSystem/Versorgungsfallklasse","_code":{"extension":[{"url":"http://hl7.org/fhir/StructureDefinition/data-absent-reason","valueCode":"unknown"}]}},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"period":{"start":"1952-07-22T09:45:00+01:00","end":"1952-07-27T09:45:00+01:00"},"diagnosis":[{"condition":{"reference":"Condition/760621ece14839630833c3fdb5e204b21be60b07ae93b17ac9bba6eb5594fcf3"},"use":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/diagnosis-role","code":"AD","display":"Admission diagnosis"}]}}]},"request":{"method":"PUT","url":"Encounter/generated-id-2"}},{"fullUrl":"Observation/generated-id-2","resource":{"resourceType":"Observation","id":"generated-id-2","meta":{"source":"#laboratory","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-labor/StructureDefinition/ObservationLab"]},"identifier":[{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"OBI"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/swisslab/labObservationId","value":"generated-id-2","assigner":{"identifier":{"system":"https://www.medizininformatik-initiative.de/fhir/core/NamingSystem/org-identifier","value":"UKER"}}}],"status":"final","category":[{"coding":[{"system":"http://loinc.org","code":"26436-6"},{"system":"http://terminology.hl7.org/CodeSystem/observation-category","code":"laboratory"}]}],"code":{"coding":[{"system":"http://loinc.org","code":"26515-7"}]},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"encounter":{"reference":"Encounter/7948eec8952251f5970c05f29f0412486e20788e6723eeff136b7f1c54c2fb4a","identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"VN"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/encounterId","value":"generated-id-2"}},"effectiveDateTime":"2020-07-22T10:44:00+02:00","issued":"2020-07-22T10:45:00.000+02:00","valueQuantity":{"value":24823.352,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"interpretation":[{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation","code":"L","display":"Low"}]}],"referenceRange":[{"low":{"value":123.000001,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"high":{"value":130.123231,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"text":"123-130"}]},"request":{"method":"PUT","url":"Observation/generated-id-2"}},{"fullUrl":"Condition/generated-id-2","resource":{"resourceType":"Condition","id":"generated-id-2","meta":{"source":"kdbp.fau.patdiagnosen:kdbp-to-fhir:null","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-diagnose/StructureDefinition/Diagnose"]},"identifier":[{"use":"official","system":"https://fhir.diz.uk-erlangen/NamingSystem/kdbSurrogateConditionId","value":"generated-id-2"}],"clinicalStatus":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/condition-clinical","code":"active"}]},"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2016","code":"C71.4"}]},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"onsetDateTime":"2020-07-13T05:39:54","recordedDate":"2020-07-13T05:39:54"},"request":{"method":"PUT","url":"Condition/generated-id-2"}}]}'


//loadFiles
//let generationInstructionData = fs.readFileSync('./input/' + files[0])
//console.log("hellon");

//var files = fs.readdirSync('./output/');
//let generationInstructionData = fs.readFileSync('./output/' + files[0])
//let generationInstruction = JSON.parse(generationInstructionData)
//console.log(generationInstruction)

var files = fs.readdirSync('./output/');
var lineReader = require('readline').createInterface({
  //input: require('fs').createReadStream('./output/genData.json')
  input: require('fs').createReadStream('./output/' + files[0])
});

lineReader.on('line', function (line) {
  //remove /n from String
  //use with caution
  line = line.substring(-2)
  loadData(line)
  //console.log('Line from file:', stringObj);
});

//var files = fs.readdirSync('./output/');
//fs.readFile('./output/' + files[0], 'utf8', (err, jsonString) => {
////fs.readFile('./output/genData_copy.json', 'utf8', (err, jsonString) => {
//  if (err) {
//      console.log("File read failed:", err)
//      return
//  }
//  
//  var jsonData = JSON.parse(jsonString);
//
//  jsonData.forEach(function(obj) {    
//    var stringObj = JSON.stringify(obj)
//    loadData(stringObj)
//  });
//})
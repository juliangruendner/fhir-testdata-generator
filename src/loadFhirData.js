var http = require('http');
const fs = require('fs');
const lReader = require('readline');
var path = require('path');
const lineByLine = require('n-readlines');
var myArgs = process.argv.slice(2);


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

    console.log(myArgs)

    var options = {
        host: myArgs[0],
        path: '/fhir',
        port: myArgs[1],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          }
      };

    var req = http.request(options, callback);    
    req.write(data)
    req.end();
}

// var data = '{"resourceType":"Bundle","type":"transaction","entry":[{"fullUrl":"Patient/generated-id-2","resource":{"resourceType":"Patient","id":"generated-id-2","meta":{"source":"kdbp.fau.patstammdaten:kdbp-to-fhir:null"},"identifier":[{"use":"usual","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}],"gender":"female","birthDate":"1995-02-22","deceasedDateTime":"2020-07-22T08:45:00+02:00","address":[{"type":"physical","city":"Erlangen","postalCode":"91052"}]},"request":{"method":"PUT","url":"Patient/generated-id-2"}},{"fullUrl":"Encounter/generated-id-2","resource":{"resourceType":"Encounter","id":"generated-id-2","meta":{"source":"kdbp.fau.patfalldaten:kdbp-to-fhir:null","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-fall/StructureDefinition/Encounter/Versorgungsfall"]},"identifier":[{"use":"official","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"VN"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/encounterId","value":"generated-id-2","assigner":{"identifier":{"system":"http://fhir.de/NamingSystem/arge-ik/iknr","value":"260950567"}}}],"status":"finished","class":{"system":"https://www.medizininformatik-initiative.de/fhir/core/modul-fall/CodeSystem/Versorgungsfallklasse","_code":{"extension":[{"url":"http://hl7.org/fhir/StructureDefinition/data-absent-reason","valueCode":"unknown"}]}},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"period":{"start":"1952-07-22T09:45:00+01:00","end":"1952-07-27T09:45:00+01:00"},"diagnosis":[{"condition":{"reference":"Condition/760621ece14839630833c3fdb5e204b21be60b07ae93b17ac9bba6eb5594fcf3"},"use":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/diagnosis-role","code":"AD","display":"Admission diagnosis"}]}}]},"request":{"method":"PUT","url":"Encounter/generated-id-2"}},{"fullUrl":"Observation/generated-id-2","resource":{"resourceType":"Observation","id":"generated-id-2","meta":{"source":"#laboratory","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-labor/StructureDefinition/ObservationLab"]},"identifier":[{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"OBI"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/swisslab/labObservationId","value":"generated-id-2","assigner":{"identifier":{"system":"https://www.medizininformatik-initiative.de/fhir/core/NamingSystem/org-identifier","value":"UKER"}}}],"status":"final","category":[{"coding":[{"system":"http://loinc.org","code":"26436-6"},{"system":"http://terminology.hl7.org/CodeSystem/observation-category","code":"laboratory"}]}],"code":{"coding":[{"system":"http://loinc.org","code":"26515-7"}]},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"encounter":{"reference":"Encounter/7948eec8952251f5970c05f29f0412486e20788e6723eeff136b7f1c54c2fb4a","identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"VN"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/encounterId","value":"generated-id-2"}},"effectiveDateTime":"2020-07-22T10:44:00+02:00","issued":"2020-07-22T10:45:00.000+02:00","valueQuantity":{"value":24823.352,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"interpretation":[{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation","code":"L","display":"Low"}]}],"referenceRange":[{"low":{"value":123.000001,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"high":{"value":130.123231,"unit":"g/dl","system":"http://unitsofmeasure.org","code":"g/dl"},"text":"123-130"}]},"request":{"method":"PUT","url":"Observation/generated-id-2"}},{"fullUrl":"Condition/generated-id-2","resource":{"resourceType":"Condition","id":"generated-id-2","meta":{"source":"kdbp.fau.patdiagnosen:kdbp-to-fhir:null","profile":["https://www.medizininformatik-initiative.de/fhir/core/modul-diagnose/StructureDefinition/Diagnose"]},"identifier":[{"use":"official","system":"https://fhir.diz.uk-erlangen/NamingSystem/kdbSurrogateConditionId","value":"generated-id-2"}],"clinicalStatus":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/condition-clinical","code":"active"}]},"code":{"coding":[{"system":"http://fhir.de/CodeSystem/dimdi/icd-10-gm","version":"2016","code":"C71.4"}]},"subject":{"identifier":{"type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"MR"}]},"system":"https://fhir.diz.uk-erlangen.de/NamingSystem/patientId","value":"generated-id-2"}},"onsetDateTime":"2020-07-13T05:39:54","recordedDate":"2020-07-13T05:39:54"},"request":{"method":"PUT","url":"Condition/generated-id-2"}}]}'

var inputDir = "./largerFhirBundles/"



var files = fs.readdirSync(inputDir);

var EXTENSION = '.json';
var jsonFiles = files.filter(function(file) {
    return path.extname(file).toLowerCase() === EXTENSION;
});

jsonFiles.forEach(curFile => {

  const liner = new lineByLine(inputDir + curFile);
  let line;
 
  while (line = liner.next()) {
    let toSend = line.toString('utf-8');
    loadData(toSend)
    var sleep = require('system-sleep');
    sleep(20);
  }
  
});


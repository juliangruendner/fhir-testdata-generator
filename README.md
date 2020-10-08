# FHIR TESTDATA GENERATOR

## SIMPLE TESTDATE GENERATOR

this is a simple fhir testdata generator, which takes patient descriptions from /input and uses the resource blueprints as specified in
the src/config/resource-blueprints.json file to generate testdata.

It does this by changing the blueprint resources as specified in the patient descriptions in the input folder.



## RUN

Run the generator using the following command:

`npm install`
`node src/generator.js`

=> This will download the dependencies and execute the generator.
The generated JSON FHIR resources can then be found in the /output folder in the genData.json file as newline delimited JSON strings
